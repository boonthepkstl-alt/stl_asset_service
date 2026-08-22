import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Asset } from '@/types/asset';

// HttpAssetRepository is the real implementation backing go-template-main's Asset Registry
// (RAISE-FR-ASSET-001) -- these tests mock the axios client directly (no library like
// axios-mock-adapter/msw is installed) to verify request shape and response mapping without
// a live backend, matching the contract go-template-main/controller/assetController.go and
// model/assetModel.go actually implement.

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock('@/services/api-client', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
}));

const sampleAsset: Asset = {
  id: 'a1',
  code: 'AST-0001',
  name: 'MacBook Pro 16"',
  category: 'IT Hardware',
  type: 'Laptop',
  status: 'Available',
  condition: 'Excellent',
  location: 'HQ',
  department: 'Engineering',
  assignedTo: null,
  purchaseDate: '2026-01-15',
  purchaseCost: 2500,
  currentValue: 2500,
  warrantyExpiry: '2029-01-15',
  vendor: 'Apple',
  serialNumber: 'SN-001',
  specs: [],
};

describe('HttpAssetRepository', () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
  });

  it('list calls GET /assets with only the non-empty/non-"all" query params', async () => {
    getMock.mockResolvedValueOnce({ data: { data: [sampleAsset], total: 1 } });
    const { HttpAssetRepository } = await import('@/services/asset-repository');
    const repo = new HttpAssetRepository();

    const result = await repo.list({ search: 'MacBook', status: 'all', department: 'all', page: 1, limit: 10 });

    expect(getMock).toHaveBeenCalledWith('/assets', { params: { search: 'MacBook', page: 1, limit: 10 } });
    expect(result).toEqual({ data: [sampleAsset], total: 1 });
  });

  it('getById calls GET /assets/:id and returns the asset', async () => {
    getMock.mockResolvedValueOnce({ data: sampleAsset });
    const { HttpAssetRepository } = await import('@/services/asset-repository');
    const repo = new HttpAssetRepository();

    const result = await repo.getById('a1');

    expect(getMock).toHaveBeenCalledWith('/assets/a1');
    expect(result).toEqual(sampleAsset);
  });

  it('getById returns null on a 404 (not found), matching MockAssetRepository', async () => {
    getMock.mockRejectedValueOnce({ response: { status: 404 } });
    const { HttpAssetRepository } = await import('@/services/asset-repository');
    const repo = new HttpAssetRepository();

    const result = await repo.getById('does-not-exist');

    expect(result).toBeNull();
  });

  it('getById rethrows non-404 errors instead of swallowing them', async () => {
    getMock.mockRejectedValueOnce({ response: { status: 500 } });
    const { HttpAssetRepository } = await import('@/services/asset-repository');
    const repo = new HttpAssetRepository();

    await expect(repo.getById('a1')).rejects.toEqual({ response: { status: 500 } });
  });

  it('create calls POST /assets with the input body and returns the created asset', async () => {
    postMock.mockResolvedValueOnce({ data: sampleAsset });
    const { HttpAssetRepository } = await import('@/services/asset-repository');
    const repo = new HttpAssetRepository();

    const input = {
      name: 'MacBook Pro 16"',
      category: 'IT Hardware',
      type: 'Laptop',
      serialNumber: 'SN-001',
      purchaseCost: 2500,
      purchaseDate: '2026-01-15',
      department: 'Engineering',
      location: 'HQ',
      condition: 'Excellent' as const,
    };
    const result = await repo.create(input);

    expect(postMock).toHaveBeenCalledWith('/assets', input);
    expect(result).toEqual(sampleAsset);
  });

  it('assign posts to /assets/:assetId/assign with assetId removed from the body', async () => {
    const assigned = { ...sampleAsset, status: 'Assigned' as const, assignedTo: 'Sarah Chen' };
    postMock.mockResolvedValueOnce({ data: assigned });
    const { HttpAssetRepository } = await import('@/services/asset-repository');
    const repo = new HttpAssetRepository();

    const result = await repo.assign({ assetId: 'a1', employeeId: 'e1', employeeName: 'Sarah Chen' });

    expect(postMock).toHaveBeenCalledWith('/assets/a1/assign', { employeeId: 'e1', employeeName: 'Sarah Chen' });
    expect(result).toEqual(assigned);
  });
});
