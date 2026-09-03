import { initialHandovers } from '@/data/fixtures/handoverData';
import { assetService } from '@/services/asset-service';
import { HANDOVER_API_ENABLED } from '@/config/featureFlags';
import { HttpHandoverRepository, MockHandoverRepository, type HandoverRepository } from '@/services/handover-repository';
import type {
  AssetHandoverModel,
  ConfirmReceiptInput,
  HandoverDecisionInput,
  HandoverListQuery,
  InitiateHandoverInput,
  ProcessHandoverInput,
} from '@/types/handover';

// HANDOVER_API_ENABLED (config/featureFlags.ts) is off by default -- same reasoning as
// TICKET_API_ENABLED in ticket-service.ts.
const repository: HandoverRepository = HANDOVER_API_ENABLED
  ? new HttpHandoverRepository()
  : new MockHandoverRepository(initialHandovers);

/**
 * The stable frontend contract for the IT Hardware Assignment Approval Workflow
 * (pages/Handovers -- the consolidated My Pending / IT Processing / Supervisor Approval tabs,
 * formerly 3 separate pages -- pages/HandoverDetail, and the Assign-flow interception in
 * pages/AssetDetail). Depends on
 * assetService one-way (to resolve the asset snapshot when initiating a handover), mirroring
 * how ticket-service.ts depends on assetService/employeeService -- neither of those services
 * imports anything from here.
 */
export const handoverService = {
  listHandovers: (query: HandoverListQuery = {}) => repository.list(query),
  getHandover: (handoverCode: string) => repository.getByCode(handoverCode),

  /**
   * Stage 1 (Initiation). Caller (AssetDetail's handleAssign) is responsible for having
   * already checked `asset.category === 'IT Hardware'` before calling this -- cheap
   * client-side check that avoids a round trip, per the spec. Resolves the current asset
   * snapshot here (rather than trusting a stale one the caller might be holding) the same way
   * ticketService.createTicket resolves requester/asset before writing.
   */
  initiateHandover: async (assetId: string, input: InitiateHandoverInput, initiatedBy: { id: string; name: string; role?: string }): Promise<AssetHandoverModel> => {
    const asset = await assetService.getAsset(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);
    return repository.initiate(
      assetId,
      input,
      { id: asset.id, code: asset.code, name: asset.name, category: asset.category, type: asset.type },
      initiatedBy
    );
  },

  // Stage 2 (Recipient Confirmation) -- the only action at this stage, per spec: no decline.
  confirmReceipt: (handoverCode: string, input: ConfirmReceiptInput) => repository.confirmReceipt(handoverCode, input),

  // Stage 3 forward (IT Processing -> IT Supervisor Approval).
  processHandover: (handoverCode: string, input: ProcessHandoverInput) => repository.process(handoverCode, input),

  // Stage 3/4 reject, or Stage 4 approve. Approval is the only action in the whole workflow
  // that sets the asset Assigned -- go-template-main's DecideHandover does this itself
  // server-side (CompleteHandoverAssignment), but HttpHandoverRepository just relays whatever
  // the backend returns, so nothing extra is needed there. MockHandoverRepository only owns
  // the AssetHandoverModel record, not the Asset one, so this layer completes the assignment
  // explicitly on APPROVE -- otherwise the mock (default) path would leave the underlying
  // Asset stuck "Available" forever despite the handover showing ASSIGNED, silently breaking
  // Check-in, the Assign quick-action, and Custody History for every IT Hardware handover.
  decideHandover: async (handoverCode: string, input: HandoverDecisionInput): Promise<AssetHandoverModel> => {
    const updated = await repository.decide(handoverCode, input);
    if (input.decision === 'APPROVE' && !HANDOVER_API_ENABLED) {
      await assetService.assignAsset({ assetId: updated.asset.id, employeeId: updated.recipient.id, employeeName: updated.recipient.name });
    }
    return updated;
  },
};
