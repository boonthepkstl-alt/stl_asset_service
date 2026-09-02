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

  // Found running against the real go-template-main backend in the local Docker stack
  // (2026-09-02) with an empty Asset table: Go marshals a nil slice as JSON `null`, not
  // `[]`, which crashed Dashboard/index.tsx's `.map()` calls despite the TS type claiming
  // a non-null array. Locks in the null -> [] normalization added to fix it.
  it('normalizes a null departmentDistribution/assetTypeDistribution (Go nil-slice JSON) to []', async () => {
    getMock.mockResolvedValueOnce({
      data: {
        ...sampleStats,
        departmentDistribution: null,
        assetTypeDistribution: null,
      },
    });
    const { HttpDashboardRepository } = await import('@/services/dashboard-repository');
    const repo = new HttpDashboardRepository();

    const result = await repo.getAssetStats();

    expect(result.departmentDistribution).toEqual([]);
    expect(result.assetTypeDistribution).toEqual([]);
  });

  // /code-review (2026-09-02): the field-level `?? []` guard above assumes the whole
  // response.data object is non-null -- not guaranteed by axios/HTTP in general, even
  // though it's unreachable via today's Go handler. Locks in the whole-object guard.
  it('normalizes a null/undefined response body to a fully zeroed stats object', async () => {
    getMock.mockResolvedValueOnce({ data: null });
    const { HttpDashboardRepository } = await import('@/services/dashboard-repository');
    const repo = new HttpDashboardRepository();

    const result = await repo.getAssetStats();

    expect(result).toEqual({
      totalAssets: 0,
      available: 0,
      assigned: 0,
      inMaintenance: 0,
      retired: 0,
      expiredWarranty: 0,
      departmentDistribution: [],
      assetTypeDistribution: [],
    });
  });
});
