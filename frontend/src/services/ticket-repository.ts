import apiClient from '@/services/api-client';
import { recordMockAuditEntry } from '@/services/audit-repository';
import type { Ticket, TicketListQuery, ApprovalDecisionInput, DispatchInput, StatusUpdateInput } from '@/types/ticket';
import type { ITTechnician, TimelineEvent } from '@/data/fixtures/requisitionData';

/**
 * Contract ticketService depends on. HttpTicketRepository (below) is the real implementation,
 * backed by go-template-main's Ticket domain (go-template-main/controller/ticketController.go)
 * -- gated off by default behind TICKET_API_ENABLED (config/featureFlags.ts), same pattern as
 * AssetRepository/EmployeeRepository.
 */
export interface TicketRepository {
  list(query: TicketListQuery): Promise<{ data: Ticket[]; total: number }>;
  getByCode(ticketCode: string): Promise<Ticket | null>;
  create(ticket: Ticket): Promise<Ticket>;
  decideApproval(id: string, input: ApprovalDecisionInput): Promise<Ticket>;
  dispatch(id: string, input: DispatchInput, tech: ITTechnician): Promise<Ticket>;
  updateExecutionStatus(id: string, input: StatusUpdateInput): Promise<Ticket>;
  changeAsset(id: string, asset: Ticket['asset']): Promise<Ticket>;
  changeRequester(id: string, requester: Ticket['requester'], location?: string): Promise<Ticket>;
  listTechnicians(): Promise<ITTechnician[]>;
}

function simulateNetwork<T>(value: T, delayMs = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
}

function appendTimeline(ticket: Ticket, event: TimelineEvent): Ticket {
  return { ...ticket, timeline: [...ticket.timeline, event] };
}

/** Backed by the legacy ESAPS fixture data (data/fixtures/requisitionData.ts). */
export class MockTicketRepository implements TicketRepository {
  private tickets: Ticket[];
  private technicians: ITTechnician[];

  constructor(seedTickets: Ticket[], seedTechnicians: ITTechnician[]) {
    this.tickets = [...seedTickets];
    this.technicians = [...seedTechnicians];
  }

  async list(query: TicketListQuery): Promise<{ data: Ticket[]; total: number }> {
    const search = (query.search ?? '').toLowerCase().trim();
    const filtered = this.tickets.filter((t) => {
      if (query.status && query.status !== 'ALL') {
        if (query.status === 'ACTIVE') {
          if (!['PLANNING', 'IN_PROGRESS', 'ON_HOLD'].includes(t.status)) return false;
        } else if (t.status !== query.status) {
          return false;
        }
      }
      if (query.priority && query.priority !== 'ALL' && t.priority !== query.priority) return false;
      if (query.category && query.category !== 'ALL' && t.category !== query.category) return false;
      if (query.department && query.department !== 'ALL' && t.requester.department !== query.department) return false;
      if (query.requesterName && t.requester.name !== query.requesterName) return false;
      if (search) {
        const matches =
          t.title.toLowerCase().includes(search) ||
          t.ticketCode.toLowerCase().includes(search) ||
          t.asset.name.toLowerCase().includes(search) ||
          t.asset.code.toLowerCase().includes(search) ||
          t.requester.name.toLowerCase().includes(search) ||
          (t.itAssignment.technicianName?.toLowerCase().includes(search) ?? false);
        if (!matches) return false;
      }
      return true;
    });
    return simulateNetwork({ data: filtered, total: filtered.length });
  }

  async getByCode(ticketCode: string): Promise<Ticket | null> {
    return simulateNetwork(this.tickets.find((t) => t.ticketCode === ticketCode || t.id === ticketCode) ?? null);
  }

  async create(ticket: Ticket): Promise<Ticket> {
    this.tickets = [ticket, ...this.tickets];
    recordMockAuditEntry('Ticket created', 'ticket', ticket.id);
    return simulateNetwork(ticket);
  }

  private update(id: string, updater: (t: Ticket) => Ticket): Ticket {
    const existing = this.tickets.find((t) => t.id === id);
    if (!existing) throw new Error(`Ticket ${id} not found`);
    const updated = updater(existing);
    this.tickets = this.tickets.map((t) => (t.id === id ? updated : t));
    return updated;
  }

  async decideApproval(id: string, input: ApprovalDecisionInput): Promise<Ticket> {
    const isApproved = input.decision === 'Approve';
    const updated = this.update(id, (t) =>
      appendTimeline(
        {
          ...t,
          status: isApproved ? 'PENDING_IT_DISPATCH' : 'REJECTED_BY_DEPT',
          departmentApproval: {
            ...t.departmentApproval,
            status: isApproved ? 'Approved' : 'Rejected',
            approverName: input.approverName ?? t.departmentApproval.approverName,
            isDelegated: input.isDelegated ?? t.departmentApproval.isDelegated,
            delegatedBy: input.delegatedBy ?? t.departmentApproval.delegatedBy,
            approvedAt: 'Just now',
            comments: input.comments || (isApproved ? 'Approved.' : 'Rejected.'),
          },
        },
        {
          id: `tl-${Date.now()}`,
          stage: 'Dept Approval',
          actorName: input.approverName ?? t.departmentApproval.approverName,
          actorRole: input.isDelegated ? 'Delegated Acting Approver' : 'Department Head',
          timestamp: 'Just now',
          action: isApproved ? 'Department Head Sign-off Approved' : 'Department Head Sign-off Rejected',
          notes: input.comments,
        }
      )
    );
    recordMockAuditEntry(`Ticket ${input.decision}d`, 'ticket', id);
    return simulateNetwork(updated);
  }

  async dispatch(id: string, input: DispatchInput, tech: ITTechnician): Promise<Ticket> {
    const updated = this.update(id, (t) =>
      appendTimeline(
        {
          ...t,
          status: 'IN_PROGRESS',
          itAssignment: {
            ...t.itAssignment,
            assignedAt: 'Just now',
            technicianId: tech.id,
            technicianName: tech.name,
            technicianRole: tech.role || tech.specialty,
            technicianAvatar: tech.avatarColor,
            estimatedCost: input.estimatedCost,
            targetResolutionDate: input.targetResolutionDate,
          },
          itExecution: { ...t.itExecution, currentStatus: 'In-Progress', diagnosticNotes: input.notes ?? t.itExecution.diagnosticNotes },
        },
        {
          id: `tl-${Date.now()}`,
          stage: 'IT Assignment',
          actorName: tech.name,
          actorRole: tech.role || tech.specialty,
          timestamp: 'Just now',
          action: `Assigned to ${tech.name} (${tech.role || tech.specialty})`,
          notes: input.notes,
        }
      )
    );
    recordMockAuditEntry(`Ticket dispatched to ${tech.name}`, 'ticket', id);
    return simulateNetwork(updated);
  }

  async updateExecutionStatus(id: string, input: StatusUpdateInput): Promise<Ticket> {
    const statusMap: Record<StatusUpdateInput['status'], Ticket['status']> = {
      Planning: 'PLANNING',
      'In-Progress': 'IN_PROGRESS',
      'On-Hold': 'ON_HOLD',
      Done: 'DONE',
    };
    const nextStatus = statusMap[input.status];
    const updated = this.update(id, (t) =>
      appendTimeline(
        {
          ...t,
          status: nextStatus,
          itExecution: {
            ...t.itExecution,
            currentStatus: input.status,
            holdCategory: nextStatus === 'ON_HOLD' ? input.holdCategory : t.itExecution.holdCategory,
            holdReason: nextStatus === 'ON_HOLD' ? input.holdReason : t.itExecution.holdReason,
            diagnosticNotes: input.diagnosticNotes ?? t.itExecution.diagnosticNotes,
            resolutionNotes: nextStatus === 'DONE' ? input.resolutionNotes ?? t.itExecution.resolutionNotes : t.itExecution.resolutionNotes,
            actualCost: nextStatus === 'DONE' ? input.actualCost ?? t.itExecution.actualCost : t.itExecution.actualCost,
            downtimeHours: nextStatus === 'DONE' ? input.downtimeHours ?? t.itExecution.downtimeHours : t.itExecution.downtimeHours,
            partsUsed: nextStatus === 'DONE' ? input.partsUsed ?? t.itExecution.partsUsed : t.itExecution.partsUsed,
            completedAt: nextStatus === 'DONE' ? 'Just now' : t.itExecution.completedAt,
          },
        },
        {
          id: `tl-${Date.now()}`,
          stage: nextStatus === 'DONE' ? 'Resolution' : nextStatus === 'ON_HOLD' ? 'On-Hold' : 'In-Progress',
          actorName: t.itAssignment.technicianName || 'Unassigned Technician',
          actorRole: t.itAssignment.technicianRole || 'Assigned Technician',
          timestamp: 'Just now',
          action: `Status updated to ${input.status}`,
          notes: nextStatus === 'ON_HOLD' ? `Hold: ${input.holdCategory} — ${input.holdReason}` : nextStatus === 'DONE' ? input.resolutionNotes : input.diagnosticNotes,
        }
      )
    );
    recordMockAuditEntry(`Ticket status updated to ${input.status}`, 'ticket', id);
    return simulateNetwork(updated);
  }

  async changeAsset(id: string, asset: Ticket['asset']): Promise<Ticket> {
    const updated = this.update(id, (t) =>
      appendTimeline(
        { ...t, asset },
        { id: `tl-${Date.now()}`, stage: 'Creation', actorName: t.requester.name, actorRole: 'Requester', timestamp: 'Just now', action: `Affected Asset changed to ${asset.name} (${asset.code})` }
      )
    );
    return simulateNetwork(updated);
  }

  async changeRequester(id: string, requester: Ticket['requester'], location?: string): Promise<Ticket> {
    const updated = this.update(id, (t) =>
      appendTimeline(
        { ...t, requester, location: location ?? t.location },
        { id: `tl-${Date.now()}`, stage: 'Creation', actorName: 'Administrator', actorRole: 'System Admin', timestamp: 'Just now', action: `Requester re-assigned to ${requester.name} (${requester.department})` }
      )
    );
    return simulateNetwork(updated);
  }

  async listTechnicians(): Promise<ITTechnician[]> {
    return simulateNetwork(this.technicians);
  }
}

/**
 * Backed by go-template-main's real Ticket endpoints (GET/POST /tickets, GET /tickets/:code,
 * POST /tickets/:code/{approval,dispatch,status}, GET /technicians). Response field names
 * match the Go backend's TicketModel JSON tags exactly, so no mapping layer is needed.
 *
 * create/dispatch take an already-resolved `Ticket`/`ITTechnician` (built client-side by
 * ticket-service.ts against MockTicketRepository's contract) but the backend independently
 * resolves requesterId/assetId/technicianId server-side and rebuilds the snapshot itself --
 * so here we extract just the ids the backend actually needs and let its response (not the
 * locally-built object) be the source of truth for the returned Ticket.
 *
 * changeAsset/changeRequester are deliberately NOT implemented server-side yet (see
 * go-template-main/repository/ticketRepository.go's doc comment -- not part of the confirmed
 * AC-MAINT-001-03..09 set), so they throw here rather than silently no-op.
 */
export class HttpTicketRepository implements TicketRepository {
  async list(query: TicketListQuery): Promise<{ data: Ticket[]; total: number }> {
    const params: Record<string, string> = {};
    if (query.search) params.search = query.search;
    if (query.status && query.status !== 'ALL') params.status = query.status;
    if (query.priority && query.priority !== 'ALL') params.priority = query.priority;
    if (query.category && query.category !== 'ALL') params.category = query.category;
    if (query.department && query.department !== 'ALL') params.department = query.department;
    if (query.requesterName) params.requesterName = query.requesterName;

    const response = await apiClient.get<{ data: Ticket[]; total: number }>('/tickets', { params });
    return response.data;
  }

  async getByCode(ticketCode: string): Promise<Ticket | null> {
    try {
      const response = await apiClient.get<Ticket>(`/tickets/${ticketCode}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      throw error;
    }
  }

  async create(ticket: Ticket): Promise<Ticket> {
    const body = {
      requesterId: ticket.requester.id,
      assetId: ticket.asset.id,
      category: ticket.category,
      priority: ticket.priority,
      title: ticket.title,
      description: ticket.description,
      location: ticket.location,
    };
    const response = await apiClient.post<Ticket>('/tickets', body);
    return response.data;
  }

  async decideApproval(id: string, input: ApprovalDecisionInput): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/approval`, input);
    return response.data;
  }

  async dispatch(id: string, input: DispatchInput, _tech: ITTechnician): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/dispatch`, input);
    return response.data;
  }

  async updateExecutionStatus(id: string, input: StatusUpdateInput): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/status`, input);
    return response.data;
  }

  async changeAsset(_id: string, _asset: Ticket['asset']): Promise<Ticket> {
    throw new Error('changeAsset is not supported by the Ticket API yet -- see ticketRepository.go');
  }

  async changeRequester(_id: string, _requester: Ticket['requester'], _location?: string): Promise<Ticket> {
    throw new Error('changeRequester is not supported by the Ticket API yet -- see ticketRepository.go');
  }

  async listTechnicians(): Promise<ITTechnician[]> {
    const response = await apiClient.get<ITTechnician[]>('/technicians');
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
