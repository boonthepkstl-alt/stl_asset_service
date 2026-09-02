import apiClient from '@/services/api-client';
import { recordMockAuditEntry } from '@/services/audit-repository';
import type {
  AssetHandoverModel,
  HandoverListQuery,
  InitiateHandoverInput,
  ConfirmReceiptInput,
  ProcessHandoverInput,
  HandoverDecisionInput,
  TimelineEvent,
} from '@/types/handover';

/**
 * Contract handoverService depends on. HttpHandoverRepository (below) is the real
 * implementation, backed by go-template-main's IT Hardware Assignment Approval Workflow
 * domain (PRs #72-73, RAISE-FR-OPS-002 exception) -- gated off by default behind
 * HANDOVER_API_ENABLED (config/featureFlags.ts), same pattern as TicketRepository/
 * AssetRepository. Mirrors ticket-repository.ts's shape exactly (same helpers, same
 * error-handling convention, same timeline-append convention).
 */
export interface HandoverRepository {
  list(query: HandoverListQuery): Promise<{ data: AssetHandoverModel[]; total: number }>;
  getByCode(handoverCode: string): Promise<AssetHandoverModel | null>;
  initiate(assetId: string, input: InitiateHandoverInput, asset: { id: string; code: string; name: string; category: string; type: string }, initiatedBy: { id: string; name: string; role?: string }): Promise<AssetHandoverModel>;
  confirmReceipt(handoverCode: string, input: ConfirmReceiptInput): Promise<AssetHandoverModel>;
  process(handoverCode: string, input: ProcessHandoverInput): Promise<AssetHandoverModel>;
  decide(handoverCode: string, input: HandoverDecisionInput): Promise<AssetHandoverModel>;
}

function simulateNetwork<T>(value: T, delayMs = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
}

function appendTimeline(handover: AssetHandoverModel, event: TimelineEvent): AssetHandoverModel {
  return { ...handover, timeline: [...handover.timeline, event] };
}

/**
 * Errors thrown to let MockHandoverRepository mirror the backend's documented error mapping
 * (ErrHandoverWrongStage/ErrHandoverWrongRecipient/ErrHandoverAlreadyActive/ErrInvalidDecision
 * etc, all surfaced server-side as HTTP 409) closely enough for pages/tests to branch on.
 */
export class HandoverDomainError extends Error {}

/** Backed by in-memory seed data (data/fixtures/handoverData.ts), same convention as MockTicketRepository. */
export class MockHandoverRepository implements HandoverRepository {
  private handovers: AssetHandoverModel[];
  private seq: number;

  constructor(seedHandovers: AssetHandoverModel[]) {
    this.handovers = [...seedHandovers];
    this.seq = seedHandovers.length + 1;
  }

  async list(query: HandoverListQuery): Promise<{ data: AssetHandoverModel[]; total: number }> {
    const search = (query.search ?? '').toLowerCase().trim();
    const filtered = this.handovers.filter((h) => {
      if (query.status && query.status !== 'ALL' && h.status !== query.status) return false;
      if (query.recipientEmployeeId && h.recipient.id !== query.recipientEmployeeId) return false;
      if (search) {
        const matches =
          h.handoverCode.toLowerCase().includes(search) ||
          h.asset.name.toLowerCase().includes(search) ||
          h.asset.code.toLowerCase().includes(search) ||
          h.recipient.name.toLowerCase().includes(search);
        if (!matches) return false;
      }
      return true;
    });
    return simulateNetwork({ data: filtered, total: filtered.length });
  }

  async getByCode(handoverCode: string): Promise<AssetHandoverModel | null> {
    return simulateNetwork(this.handovers.find((h) => h.handoverCode === handoverCode || h.id === handoverCode) ?? null);
  }

  private update(handoverCode: string, updater: (h: AssetHandoverModel) => AssetHandoverModel): AssetHandoverModel {
    const existing = this.handovers.find((h) => h.handoverCode === handoverCode || h.id === handoverCode);
    if (!existing) throw new HandoverDomainError(`Handover ${handoverCode} not found`);
    const updated = updater(existing);
    this.handovers = this.handovers.map((h) => (h.id === existing.id ? updated : h));
    return updated;
  }

  async initiate(
    _assetId: string,
    input: InitiateHandoverInput,
    asset: { id: string; code: string; name: string; category: string; type: string },
    initiatedBy: { id: string; name: string; role?: string }
  ): Promise<AssetHandoverModel> {
    if (!input.employeeId || !input.employeeName) {
      throw new HandoverDomainError('ErrInvalidRecipient: employeeId/employeeName are required');
    }
    if (asset.category !== 'IT Hardware') {
      throw new HandoverDomainError('ErrAssetNotITHardware');
    }
    const alreadyActive = this.handovers.some(
      (h) => h.asset.id === asset.id && !['ASSIGNED', 'REJECTED'].includes(h.status)
    );
    if (alreadyActive) {
      throw new HandoverDomainError('ErrHandoverAlreadyActive');
    }

    const now = new Date().toISOString();
    const created: AssetHandoverModel = {
      id: `aho-${this.seq}`,
      handoverCode: `AHO-2026-${this.seq.toString().padStart(3, '0')}`,
      status: 'PENDING_RECIPIENT_CONFIRMATION',
      createdAt: now,
      asset,
      recipient: { id: input.employeeId, name: input.employeeName },
      initiatedBy,
      initiatedAt: now,
      timeline: [
        {
          id: `aho-tl-${Date.now()}`,
          stage: 'Creation',
          actorName: initiatedBy.name,
          actorRole: initiatedBy.role || 'Administrator',
          timestamp: 'Just now',
          action: `Assignment initiated for ${asset.name} (${asset.code}) to ${input.employeeName} — awaiting recipient confirmation.`,
        },
      ],
    };
    this.seq += 1;
    this.handovers = [created, ...this.handovers];
    recordMockAuditEntry(`Handover initiated for ${asset.name} to ${input.employeeName}`, 'handover', created.id);
    return simulateNetwork(created);
  }

  async confirmReceipt(handoverCode: string, input: ConfirmReceiptInput): Promise<AssetHandoverModel> {
    const updated = this.update(handoverCode, (h) => {
      if (h.status !== 'PENDING_RECIPIENT_CONFIRMATION') {
        throw new HandoverDomainError('ErrHandoverWrongStage');
      }
      if (h.recipient.id !== input.recipientId) {
        throw new HandoverDomainError('ErrHandoverWrongRecipient');
      }
      return appendTimeline(
        { ...h, status: 'PENDING_IT_PROCESSING', confirmedAt: 'Just now' },
        {
          id: `aho-tl-${Date.now()}`,
          stage: 'Recipient Confirmation',
          actorName: input.recipientName,
          actorRole: 'Recipient',
          timestamp: 'Just now',
          action: 'Recipient confirmed receipt — routed to IT Processing queue.',
        }
      );
    });
    recordMockAuditEntry('Handover receipt confirmed', 'handover', updated.id);
    return simulateNetwork(updated);
  }

  async process(handoverCode: string, input: ProcessHandoverInput): Promise<AssetHandoverModel> {
    const updated = this.update(handoverCode, (h) => {
      if (h.status !== 'PENDING_IT_PROCESSING') {
        throw new HandoverDomainError('ErrHandoverWrongStage');
      }
      return appendTimeline(
        {
          ...h,
          status: 'PENDING_IT_SUPERVISOR_APPROVAL',
          processedBy: { id: input.actorId, name: input.actorName, role: 'IT Staff' },
          processedAt: 'Just now',
        },
        {
          id: `aho-tl-${Date.now()}`,
          stage: 'IT Processing',
          actorName: input.actorName,
          actorRole: 'IT Staff',
          timestamp: 'Just now',
          action: 'Forwarded to IT Supervisor for final approval.',
        }
      );
    });
    recordMockAuditEntry('Handover forwarded to IT Supervisor', 'handover', updated.id);
    return simulateNetwork(updated);
  }

  async decide(handoverCode: string, input: HandoverDecisionInput): Promise<AssetHandoverModel> {
    if (input.decision !== 'APPROVE' && input.decision !== 'REJECT') {
      throw new HandoverDomainError('ErrInvalidDecision');
    }
    const updated = this.update(handoverCode, (h) => {
      if (!['PENDING_IT_PROCESSING', 'PENDING_IT_SUPERVISOR_APPROVAL'].includes(h.status)) {
        throw new HandoverDomainError('ErrHandoverWrongStage');
      }
      if (input.decision === 'REJECT') {
        // rejectionStage is a human-readable label ("IT Processing"/"IT Supervisor Approval"),
        // not the status enum -- must match go-template-main/service/assetHandoverService.go's
        // DecideHandover exactly, since HandoverDetail compares against these literal strings.
        const rejectionStage = h.status === 'PENDING_IT_PROCESSING' ? 'IT Processing' : 'IT Supervisor Approval';
        return appendTimeline(
          {
            ...h,
            status: 'REJECTED',
            rejectedBy: { id: input.actorId, name: input.actorName },
            rejectedAt: 'Just now',
            rejectionStage,
            rejectionReason: input.reason,
          },
          {
            id: `aho-tl-${Date.now()}`,
            stage: 'Rejected',
            actorName: input.actorName,
            actorRole: h.status === 'PENDING_IT_PROCESSING' ? 'IT Staff' : 'IT Supervisor',
            timestamp: 'Just now',
            action: 'Handover rejected — asset returned to Available.',
            notes: input.reason,
          }
        );
      }
      // APPROVE is only meaningful at Stage 4 (IT Supervisor Approval) -- the only action in
      // the whole flow that sets the asset Assigned.
      if (h.status !== 'PENDING_IT_SUPERVISOR_APPROVAL') {
        throw new HandoverDomainError('ErrHandoverWrongStage');
      }
      return appendTimeline(
        {
          ...h,
          status: 'ASSIGNED',
          approvedBy: { id: input.actorId, name: input.actorName, role: 'IT Supervisor' },
          approvedAt: 'Just now',
        },
        {
          id: `aho-tl-${Date.now()}`,
          stage: 'IT Supervisor Approval',
          actorName: input.actorName,
          actorRole: 'IT Supervisor',
          timestamp: 'Just now',
          action: 'Approved — asset is now Assigned.',
        }
      );
    });
    recordMockAuditEntry(`Handover ${input.decision === 'APPROVE' ? 'approved' : 'rejected'}`, 'handover', updated.id);
    return simulateNetwork(updated);
  }
}

/**
 * Backed by go-template-main's real Handover endpoints (GET /handovers, GET /handovers/:code,
 * POST /assets/:id/handover, POST /handovers/:code/{confirm,process,decision}). Response field
 * names match the Go backend's AssetHandoverModel JSON tags exactly, so no mapping layer is
 * needed.
 */
export class HttpHandoverRepository implements HandoverRepository {
  async list(query: HandoverListQuery): Promise<{ data: AssetHandoverModel[]; total: number }> {
    const params: Record<string, string> = {};
    if (query.search) params.search = query.search;
    if (query.status && query.status !== 'ALL') params.status = query.status;
    if (query.recipientEmployeeId) params.recipientEmployeeId = query.recipientEmployeeId;

    const response = await apiClient.get<{ data: AssetHandoverModel[]; total: number }>('/handovers', { params });
    return response.data;
  }

  async getByCode(handoverCode: string): Promise<AssetHandoverModel | null> {
    try {
      const response = await apiClient.get<AssetHandoverModel>(`/handovers/${handoverCode}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      throw error;
    }
  }

  async initiate(
    assetId: string,
    input: InitiateHandoverInput,
    _asset?: { id: string; code: string; name: string; category: string; type: string },
    _initiatedBy?: { id: string; name: string; role?: string }
  ): Promise<AssetHandoverModel> {
    const response = await apiClient.post<AssetHandoverModel>(`/assets/${assetId}/handover`, input);
    return response.data;
  }

  async confirmReceipt(handoverCode: string, input: ConfirmReceiptInput): Promise<AssetHandoverModel> {
    const response = await apiClient.post<AssetHandoverModel>(`/handovers/${handoverCode}/confirm`, input);
    return response.data;
  }

  async process(handoverCode: string, input: ProcessHandoverInput): Promise<AssetHandoverModel> {
    const response = await apiClient.post<AssetHandoverModel>(`/handovers/${handoverCode}/process`, input);
    return response.data;
  }

  async decide(handoverCode: string, input: HandoverDecisionInput): Promise<AssetHandoverModel> {
    const response = await apiClient.post<AssetHandoverModel>(`/handovers/${handoverCode}/decision`, input);
    return response.data;
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}
