import { beforeEach, describe, expect, it } from 'vitest';

async function freshHandoverService() {
  const mod = await import('@/services/handover-service');
  return mod.handoverService;
}

async function freshAssetService() {
  const mod = await import('@/services/asset-service');
  return mod.assetService;
}

describe('handoverService', () => {
  beforeEach(() => {
    // Not vi.resetModules() -- handoverService/handover-repository.ts hold module-level mutable
    // state (MockHandoverRepository instance) the same way ticketService's does; each test that
    // needs a clean slate operates on the seeded fixture data and its own newly-initiated
    // handovers rather than asserting on exact counts across tests.
  });

  it('listHandovers returns the seeded fixture handovers', async () => {
    const handoverService = await freshHandoverService();
    const result = await handoverService.listHandovers({});
    expect(result.total).toBeGreaterThanOrEqual(3);
  });

  it('getHandover returns null for an unknown code', async () => {
    const handoverService = await freshHandoverService();
    const result = await handoverService.getHandover('DOES-NOT-EXIST');
    expect(result).toBeNull();
  });

  it('initiateHandover resolves the asset snapshot and creates a PENDING_RECIPIENT_CONFIRMATION handover for an IT Hardware asset', async () => {
    const handoverService = await freshHandoverService();
    // a1 (MacBook Pro 16" M3) is IT Hardware -- deliberately NOT a11/a12/a2, which the seeded
    // fixture data (data/fixtures/handoverData.ts) already has active handovers against.
    const created = await handoverService.initiateHandover(
      'a1',
      { employeeId: 'e2', employeeName: 'Marcus Johnson' },
      { id: 'admin-1', name: 'Test Admin', role: 'ADMIN' }
    );
    expect(created.status).toBe('PENDING_RECIPIENT_CONFIRMATION');
    expect(created.asset.code).toBe('AST-0001');
    expect(created.recipient.name).toBe('Marcus Johnson');
  });

  it('initiateHandover rejects an unknown asset id', async () => {
    const handoverService = await freshHandoverService();
    await expect(
      handoverService.initiateHandover('nope', { employeeId: 'e2', employeeName: 'Marcus Johnson' }, { id: 'admin-1', name: 'Test Admin' })
    ).rejects.toThrow();
  });

  it('confirmReceipt -> processHandover -> decideHandover(APPROVE) walks a handover to ASSIGNED', async () => {
    const handoverService = await freshHandoverService();
    // a13 (Dell OptiPlex 7090) is IT Hardware with no seeded active handover against it.
    const created = await handoverService.initiateHandover(
      'a13',
      { employeeId: 'e3', employeeName: 'Priya Patel' },
      { id: 'admin-1', name: 'Test Admin' }
    );
    const confirmed = await handoverService.confirmReceipt(created.handoverCode, { recipientId: 'e3', recipientName: 'Priya Patel' });
    expect(confirmed.status).toBe('PENDING_IT_PROCESSING');

    const processed = await handoverService.processHandover(created.handoverCode, { actorId: 'tech-1', actorName: 'Alex Rivera' });
    expect(processed.status).toBe('PENDING_IT_SUPERVISOR_APPROVAL');

    const approved = await handoverService.decideHandover(created.handoverCode, { decision: 'APPROVE', actorId: 'mgr-1', actorName: 'Jordan Lee' });
    expect(approved.status).toBe('ASSIGNED');
    expect(approved.approvedBy?.name).toBe('Jordan Lee');

    // Regression test: the mock (default, HANDOVER_API_ENABLED off) path used to only mutate
    // the AssetHandoverModel record on APPROVE, never the underlying Asset -- so the asset
    // stayed "Available" forever despite the handover showing ASSIGNED. Found via a code-review
    // pass and fixed in handoverService.decideHandover, which now completes the assignment
    // itself (mirroring go-template-main's CompleteHandoverAssignment) when running mocked.
    const assetService = await freshAssetService();
    const asset = await assetService.getAsset('a13');
    expect(asset?.status).toBe('Assigned');
    expect(asset?.assignedTo).toBe('Priya Patel');
  });

  it('decideHandover(REJECT) at Stage 3 terminates the handover as REJECTED', async () => {
    const handoverService = await freshHandoverService();
    // a10 (Bose headphones) is IT Hardware, already assigned to Elena Rodriguez per seed data
    // but with no seeded active handover -- distinct from the a1/a13 used above so this test
    // doesn't collide with the still-active handover the first test in this file created.
    const created = await handoverService.initiateHandover(
      'a10',
      { employeeId: 'e5', employeeName: 'Elena Rodriguez' },
      { id: 'admin-1', name: 'Test Admin' }
    );
    await handoverService.confirmReceipt(created.handoverCode, { recipientId: 'e5', recipientName: 'Elena Rodriguez' });
    const rejected = await handoverService.decideHandover(created.handoverCode, { decision: 'REJECT', actorId: 'tech-1', actorName: 'Alex Rivera', reason: 'Duplicate request' });
    expect(rejected.status).toBe('REJECTED');
    expect(rejected.rejectionStage).toBe('IT Processing');
  });
});
