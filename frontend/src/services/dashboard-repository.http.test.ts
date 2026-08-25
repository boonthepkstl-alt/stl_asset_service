import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { AssetDashboardStats } from '@/services/dashboard-repository';

// HttpDashboardRepository is the real implementation backing go-template-main's Dashboard
// endpoint (RAISE-FR-EXEC-001) -- mocks the axios client directly, matching the contract
// go-template-main/controller/dashboardController.go and model/dashboardModel.go implement.

const getMock = vi.fn();

vi.mock('@/services/api-client', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
  },
}));

const sampleStats: AssetDashboardStats = {
  totalAssets: 4,
  available: 1,
  assigned: 1,
  inMaintenance: 1,
  retired: 1,
  expiredWarranty: 0,
  departmentDistribution: [{ label: 'Engineering', count: 2 }, { label: 'Sales', count: 2 }],
  assetTypeDistribution: [{ label: 'Laptop', count: 3 }, { label: 'Phone', count: 1 }],
};

describe('HttpDashboardRepository', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('getAssetStats calls GET /dashboard/stats and returns the response as-is', async () => {
    getMock.mockResolvedValueOnce({ data: sampleStats });
    const { HttpDashboardRepository } = await import('@/services/dashboard-repository');
    const repo = new HttpDashboardRepository();

    const result = await repo.getAssetStats();

    expect(getMock).toHaveBeenCalledWith('/dashboard/stats');
    expect(result).toEqual(sampleStats);
  });
});
