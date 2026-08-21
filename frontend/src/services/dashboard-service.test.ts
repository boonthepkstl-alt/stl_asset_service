import { beforeEach, describe, expect, it, vi } from 'vitest';

async function freshDashboardService() {
  vi.resetModules();
  const mod = await import('@/services/dashboard-service');
  return mod.dashboardService;
}

describe('dashboardService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getDashboardStats computes real counts from the seeded asset fixture, not hardcoded totals', async () => {
    const dashboardService = await freshDashboardService();
    const stats = await dashboardService.getDashboardStats();

    // The legacy dashboard hardcoded totalAssets: 1248 disconnected from the real asset list —
    // this asserts the new stats reflect the actual seeded fixture size instead.
    expect(stats.totalAssets).toBeGreaterThan(0);
    expect(stats.totalAssets).toBeLessThan(100);
    expect(stats.available + stats.assigned + stats.inMaintenance + stats.retired).toBe(stats.totalAssets);
  });

  it('getDashboardStats reflects the real software license count', async () => {
    const dashboardService = await freshDashboardService();
    const stats = await dashboardService.getDashboardStats();
    expect(stats.softwareLicenseCount).toBeGreaterThan(0);
  });

  it('getDashboardStats groups assets by department with counts summing to the total', async () => {
    const dashboardService = await freshDashboardService();
    const stats = await dashboardService.getDashboardStats();
    const sum = stats.departmentDistribution.reduce((s, d) => s + d.count, 0);
    expect(sum).toBe(stats.totalAssets);
    expect(stats.departmentDistribution.every((d) => d.color.startsWith('bg-'))).toBe(true);
  });

  it('getDashboardStats groups assets by type with counts summing to the total', async () => {
    const dashboardService = await freshDashboardService();
    const stats = await dashboardService.getDashboardStats();
    const sum = stats.assetTypeDistribution.reduce((s, d) => s + d.count, 0);
    expect(sum).toBe(stats.totalAssets);
  });
});
