import { describe, expect, it, beforeEach } from 'vitest';
import { MockHandoverRepository, HandoverDomainError } from '@/services/handover-repository';
import { initialHandovers } from '@/data/fixtures/handoverData';
import type { AssetHandoverModel } from '@/types/handover';

const itAsset = { id: 'a99', code: 'AST-0099', name: 'Test Laptop', category: 'IT Hardware', type: 'Laptop' };
const nonItAsset = { id: 'a98', code: 'AST-0098', name: 'Test Chair', category: 'Office Equipment', type: 'Furniture' };
const initiator = { id: 'e1', name: 'Sarah Chen', role: 'Administrator' };

function freshRepo() {
  return new MockHandoverRepository(initialHandovers);
}

describe('MockHandoverRepository', () => {
  let repo: MockHandoverRepository;

  beforeEach(() => {
    repo = freshRepo();
  });

  describe('Stage 1: initiate', () => {
    it('creates a handover in PENDING_RECIPIENT_CONFIRMATION and does not touch asset state', async () => {
      const before = (await repo.list({})).total;
      const created = await repo.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);

      expect(created.status).toBe('PENDING_RECIPIENT_CONFIRMATION');
      expect(created.asset.id).toBe('a99');
      expect(created.recipient).toEqual({ id: 'e2', name: 'Marcus Johnson' });
      expect(created.handoverCode).toMatch(/^AHO-2026-/);
      const after = (await repo.list({})).total;
      expect(after).toBe(before + 1);
    });

    it('rejects initiating a handover for a non-IT-Hardware asset', async () => {
      await expect(
        repo.initiate('a98', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, nonItAsset, initiator)
      ).rejects.toThrow(HandoverDomainError);
    });

    it('rejects an empty employeeId/employeeName (ErrInvalidRecipient)', async () => {
      await expect(repo.initiate('a99', { employeeId: '', employeeName: '' }, itAsset, initiator)).rejects.toThrow(HandoverDomainError);
    });

    it('rejects initiating a second handover while one is already active for the same asset', async () => {
      await repo.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      await expect(
        repo.initiate('a99', { employeeId: 'e3', employeeName: 'Priya Patel' }, itAsset, initiator)
      ).rejects.toThrow(HandoverDomainError);
    });
  });

  describe('Stage 2: confirmReceipt', () => {
    it('advances a matching recipient to PENDING_IT_PROCESSING', async () => {
      const created = await repo.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      const confirmed = await repo.confirmReceipt(created.handoverCode, { recipientId: 'e2', recipientName: 'Marcus Johnson' });
      expect(confirmed.status).toBe('PENDING_IT_PROCESSING');
      expect(confirmed.confirmedAt).toBeTruthy();
    });

    it('rejects a mismatched recipient (ErrHandoverWrongRecipient)', async () => {
      const created = await repo.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      await expect(repo.confirmReceipt(created.handoverCode, { recipientId: 'e3', recipientName: 'Priya Patel' })).rejects.toThrow(HandoverDomainError);
    });

    it('rejects confirming a handover not in PENDING_RECIPIENT_CONFIRMATION (ErrHandoverWrongStage)', async () => {
      const created = await repo.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      await repo.confirmReceipt(created.handoverCode, { recipientId: 'e2', recipientName: 'Marcus Johnson' });
      await expect(repo.confirmReceipt(created.handoverCode, { recipientId: 'e2', recipientName: 'Marcus Johnson' })).rejects.toThrow(HandoverDomainError);
    });
  });

  describe('Stage 3: process / reject', () => {
    async function confirmedHandover(repository: MockHandoverRepository): Promise<AssetHandoverModel> {
      const created = await repository.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      return repository.confirmReceipt(created.handoverCode, { recipientId: 'e2', recipientName: 'Marcus Johnson' });
    }

    it('process forwards to PENDING_IT_SUPERVISOR_APPROVAL', async () => {
      const confirmed = await confirmedHandover(repo);
      const processed = await repo.process(confirmed.handoverCode, { actorId: 'tech-1', actorName: 'Alex Rivera' });
      expect(processed.status).toBe('PENDING_IT_SUPERVISOR_APPROVAL');
      expect(processed.processedBy?.name).toBe('Alex Rivera');
    });

    it('reject at Stage 3 terminates as REJECTED with rejectionStage recorded', async () => {
      const confirmed = await confirmedHandover(repo);
      const rejected = await repo.decide(confirmed.handoverCode, { decision: 'REJECT', actorId: 'tech-1', actorName: 'Alex Rivera', reason: 'Not needed' });
      expect(rejected.status).toBe('REJECTED');
      expect(rejected.rejectionStage).toBe('IT Processing');
      expect(rejected.rejectionReason).toBe('Not needed');
    });
  });

  describe('Stage 4: approve / reject', () => {
    async function atSupervisorApproval(repository: MockHandoverRepository): Promise<AssetHandoverModel> {
      const created = await repository.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      const confirmed = await repository.confirmReceipt(created.handoverCode, { recipientId: 'e2', recipientName: 'Marcus Johnson' });
      return repository.process(confirmed.handoverCode, { actorId: 'tech-1', actorName: 'Alex Rivera' });
    }

    it('approve is the only transition to ASSIGNED', async () => {
      const atApproval = await atSupervisorApproval(repo);
      const approved = await repo.decide(atApproval.handoverCode, { decision: 'APPROVE', actorId: 'mgr-1', actorName: 'Jordan Lee' });
      expect(approved.status).toBe('ASSIGNED');
      expect(approved.approvedBy?.name).toBe('Jordan Lee');
    });

    it('reject at Stage 4 terminates as REJECTED (asset conceptually returns to Available)', async () => {
      const atApproval = await atSupervisorApproval(repo);
      const rejected = await repo.decide(atApproval.handoverCode, { decision: 'REJECT', actorId: 'mgr-1', actorName: 'Jordan Lee', reason: 'Wrong spec' });
      expect(rejected.status).toBe('REJECTED');
      expect(rejected.rejectionStage).toBe('IT Supervisor Approval');
    });

    it('rejects an invalid decision value (ErrInvalidDecision)', async () => {
      const atApproval = await atSupervisorApproval(repo);
      // @ts-expect-error -- deliberately invalid decision to exercise the guard
      await expect(repo.decide(atApproval.handoverCode, { decision: 'MAYBE', actorId: 'mgr-1', actorName: 'Jordan Lee' })).rejects.toThrow(HandoverDomainError);
    });

    it('rejects approving before Stage 4 (ErrHandoverWrongStage)', async () => {
      const created = await repo.initiate('a99', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, itAsset, initiator);
      const confirmed = await repo.confirmReceipt(created.handoverCode, { recipientId: 'e2', recipientName: 'Marcus Johnson' });
      await expect(repo.decide(confirmed.handoverCode, { decision: 'APPROVE', actorId: 'mgr-1', actorName: 'Jordan Lee' })).rejects.toThrow(HandoverDomainError);
    });
  });
});
