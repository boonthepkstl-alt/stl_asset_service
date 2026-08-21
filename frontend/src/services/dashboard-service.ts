import { assetService } from '@/services/asset-service';
import { licenseService } from '@/services/license-service';
import type { DashboardStats, DistributionSlice } from '@/types/dashboard';

// Cycled by index rather than keyed by department/type name — real department/type values are
// free text (see types/asset.ts), so there's no fixed name-to-color mapping the way the legacy
// fixture hardcoded one color per literal department string.
const PALETTE = ['bg-brand-500', 'bg-accent-500', 'bg-success-500', 'bg-warning-500', 'bg-error-500', 'bg-surface-500', 'bg-indigo-500'];

function groupByColor<T>(items: T[], keyOf: (item: T) => string): DistributionSlice[] {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([label, count], i) => ({ label, count, color: PALETTE[i % PALETTE.length] }));
}

/**
 * Read-only aggregation over Asset and License — the two domains with a real service today.
 * No repository/mock layer of its own (there's nothing to create/update/delete here), same
 * "computed, not stored" precedent as employeeService.getEmployeeSummary (Phase 5A). Everything
 * else the legacy Dashboard showed (AI insights, Oracle FA reconciliation, pending approvals,
 * recent activity feed, maintenance calendar, month-over-month acquisition trend) has no backing
 * domain yet and stays as static illustrative content in the page itself — see
 * DASHBOARD-MIGRATION.md for the full KEEP/COMPUTE/DEFER breakdown.
 */
export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [{ data: assets }, { total: softwareLicenseCount }] = await Promise.all([
      assetService.listAssets({}),
      licenseService.listLicenses({}),
    ]);

    const today = new Date();
    const expiredWarranty = assets.filter((a) => new Date(a.warrantyExpiry).getTime() < today.getTime()).length;

    return {
      totalAssets: assets.length,
      available: assets.filter((a) => a.status === 'Available').length,
      assigned: assets.filter((a) => a.status === 'Assigned').length,
      inMaintenance: assets.filter((a) => a.status === 'In Maintenance').length,
      retired: assets.filter((a) => a.status === 'Retired').length,
      expiredWarranty,
      softwareLicenseCount,
      departmentDistribution: groupByColor(assets, (a) => a.department),
      assetTypeDistribution: groupByColor(assets, (a) => a.type),
    };
  },
};
