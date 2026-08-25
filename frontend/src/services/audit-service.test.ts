import { beforeEach, describe, expect, it, vi } from 'vitest';

async function freshServices() {
  vi.resetModules();
  const auditMod = await import('@/services/audit-service');
  const assetMod = await import('@/services/asset-service');
  return { auditService: auditMod.auditService, assetService: assetMod.assetService };
}

describe('auditService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('listAuditLogs returns no entries for an asset with no recorded activity yet', async () => {
    const { auditService } = await freshServices();
    const result = await auditService.listAuditLogs({ entityType: 'asset', entityId: 'does-not-exist' });
    expect(result.total).toBe(0);
    expect(result.data).toEqual([]);
  });

  it('recording an asset mutation (create) is reflected in listAuditLogs for that entity', async () => {
    const { auditService, assetService } = await freshServices();

    const created = await assetService.createAsset({
      name: 'Test Laptop',
      category: 'IT Hardware',
      type: 'Laptop',
      serialNumber: 'TEST-0002',
      purchaseCost: 1200,
      purchaseDate: '2026-01-01',
      department: 'Engineering',
      location: 'HQ - Floor 4',
      condition: 'Excellent',
    });

    const result = await auditService.listAuditLogs({ entityType: 'asset', entityId: created.id });
    expect(result.total).toBe(1);
    expect(result.data[0].action).toBe('Asset created');
    expect(result.data[0].entityType).toBe('asset');
    expect(result.data[0].entityId).toBe(created.id);
    expect(result.data[0].actor).toBeTruthy();
    expect(result.data[0].createdAt).toBeTruthy();
  });

  it('assign and check-in each append their own audit entry for the same asset', async () => {
    const { auditService, assetService } = await freshServices();

    const created = await assetService.createAsset({
      name: 'Test Monitor',
      category: 'IT Hardware',
      type: 'Monitor',
      serialNumber: 'TEST-0003',
      purchaseCost: 500,
      purchaseDate: '2026-01-01',
      department: 'Engineering',
      location: 'HQ - Floor 4',
      condition: 'Excellent',
    });
    await assetService.assignAsset({ assetId: created.id, employeeId: 'e1', employeeName: 'Test Employee' });
    await assetService.checkInAsset(created.id);

    const result = await auditService.listAuditLogs({ entityType: 'asset', entityId: created.id });
    expect(result.total).toBe(3);
    const actions = result.data.map((e) => e.action);
    expect(actions).toContain('Asset created');
    expect(actions).toContain('Asset assigned to Test Employee');
    expect(actions).toContain('Asset checked in');
  });
});
