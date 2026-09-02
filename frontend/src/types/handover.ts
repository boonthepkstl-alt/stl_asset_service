// IT Hardware Assignment Approval Workflow domain types (RAISE-FR-OPS-002 exception).
// Mirrors types/ticket.ts's pattern: the wire shape from go-template-main's
// AssetHandoverModel (PRs #72-73) is reproduced field-for-field here rather than reshaped, so
// no mapping layer is needed between HttpHandoverRepository and the backend response. Reuses
// TimelineEvent from the Ticket/Maintenance domain fixture -- same audit-trail shape, no new
// type invented for what is structurally the same concept.
import type { TimelineEvent } from '@/data/fixtures/requisitionData';

export type { TimelineEvent };

export interface HandoverAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  type: string;
}

export interface HandoverPerson {
  id: string;
  name: string;
  role?: string;
}

export type HandoverStatus =
  | 'PENDING_RECIPIENT_CONFIRMATION'
  | 'PENDING_IT_PROCESSING'
  | 'PENDING_IT_SUPERVISOR_APPROVAL'
  | 'ASSIGNED'
  | 'REJECTED';

export interface AssetHandoverModel {
  id: string;
  handoverCode: string;
  status: HandoverStatus;
  createdAt: string;
  asset: HandoverAsset;
  recipient: HandoverPerson;
  initiatedBy: HandoverPerson;
  initiatedAt: string;
  confirmedAt?: string;
  processedBy?: HandoverPerson;
  processedAt?: string;
  approvedBy?: HandoverPerson;
  approvedAt?: string;
  rejectedBy?: HandoverPerson;
  rejectedAt?: string;
  rejectionStage?: string;
  rejectionReason?: string;
  timeline: TimelineEvent[];
}

// Stage 1 (POST /assets/:id/handover)
export interface InitiateHandoverInput {
  employeeId: string;
  employeeName: string;
}

// Stage 2 (POST /handovers/:code/confirm)
export interface ConfirmReceiptInput {
  recipientId: string;
  recipientName: string;
}

// Stage 3 forward (POST /handovers/:code/process)
export interface ProcessHandoverInput {
  actorId: string;
  actorName: string;
}

// Stage 4 approve, or Stage 3/4 reject (POST /handovers/:code/decision)
export interface HandoverDecisionInput {
  decision: 'APPROVE' | 'REJECT';
  actorId: string;
  actorName: string;
  reason?: string;
}

export interface HandoverListQuery {
  search?: string;
  status?: HandoverStatus | 'ALL';
  recipientEmployeeId?: string;
}
