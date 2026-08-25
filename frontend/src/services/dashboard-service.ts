import { licenseService } from '@/services/license-service';
import { DASHBOARD_API_ENABLED } from '@/config/featureFlags';
import { HttpDashboardRepository, MockDashboardRepository, type DashboardRepository } from '@/services/dashboard-repository';
import type { DashboardStats, DistributionCount, DistributionSlice } from '@/types/dashboard';

// Cycled by index rather than keyed by department/type name — real department/type values are
// free text (see types/asset.ts), so there's no fixed name-to-color mapping the way the legacy
// fixture hardcoded one color per literal department string.
const PALETTE = ['bg-brand-500', 'bg-accent-500', 'bg-success-500', 'bg-warning-500', 'bg-error-500', 'bg-surface-500', 'bg-indigo-500'];

// Color is a presentation concern assigned here, after the repository (mock or real backend)
// returns raw label/count pairs -- see types/dashboard.ts's DistributionCount vs
// DistributionSlice split.
function assignColors(items: DistributionCount[]): DistributionSlice[] {
  return items.map((item, i) => ({ ...item, color: PALETTE[i % PALETTE.length] }));
}

const repository: DashboardRepository = DASHBOARD_API_ENABLED ? new HttpDashboardRepository() : new MockDashboardRepository();

/**
 * RAISE-FR-EXEC-001. Merges the Asset-derived stats (Mock or Http repository, see
 * dashboard-repository.ts) with the Software License count -- License
 * (RAISE-FR-LICENSE-001) is confirmed Roadmap-only and has no backend table, so that one field
 * always comes from licenseService regardless of DASHBOARD_API_ENABLED. Everything else the
 * legacy Dashboard showed (AI insights, Oracle FA reconciliation, pending approvals, recent
 * activity feed, maintenance calendar, month-over-month acquisition trend, Monthly
 * Depreciation/Cost) has no backing domain/formula yet and stays as static illustrative content
 * in the page itself -- see DASHBOARD-MIGRATION.md for the full KEEP/COMPUTE/DEFER breakdown.
 * None of that is NBV/Risk-scored math being moved here; it was never computed at all.
 */
export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [assetStats, { total: softwareLicenseCount }] = await Promise.all([
      repository.getAssetStats(),
      licenseService.listLicenses({}),
    ]);

    return {
      totalAssets: assetStats.totalAssets,
      available: assetStats.available,
      assigned: assetStats.assigned,
      inMaintenance: assetStats.inMaintenance,
      retired: assetStats.retired,
      expiredWarranty: assetStats.expiredWarranty,
      softwareLicenseCount,
      departmentDistribution: assignColors(assetStats.departmentDistribution),
      assetTypeDistribution: assignColors(assetStats.assetTypeDistribution),
    };
  },
};
