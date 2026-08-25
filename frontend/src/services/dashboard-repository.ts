import apiClient from '@/services/api-client';
import { assetService } from '@/services/asset-service';
import type { DistributionCount } from '@/types/dashboard';

// The Asset-derived subset of DashboardStats -- deliberately excludes softwareLicenseCount
// (License has no backend table; dashboard-service.ts still sources that from licenseService)
// and any NBV/Risk-scored figure (PRD §16 Q3/Q4 remain open). See go-template-main/model/
// dashboardModel.go's DashboardStatsModel, which this mirrors field-for-field.
export interface AssetDashboardStats {
  totalAssets: number;
  available: number;
  assigned: number;
  inMaintenance: number;
  retired: number;
  expiredWarranty: number;
  departmentDistribution: DistributionCount[];
  assetTypeDistribution: DistributionCount[];
}

/**
 * Contract dashboardService depends on for the Asset-derived half of the Executive Dashboard
 * (RAISE-FR-EXEC-001). Same Mock/Http split convention as every other domain, gated by
 * DASHBOARD_API_ENABLED (config/featureFlags.ts).
 */
export interface DashboardRepository {
  getAssetStats(): Promise<AssetDashboardStats>;
}

function groupCounts<T>(items: T[], keyOf: (item: T) => string): DistributionCount[] {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
}

/**
 * Computes the same Asset-derived stats client-side that dashboard-service.ts always has --
 * unchanged behavior, just extracted into this repository shape (RAISE-FR-EXEC-001's first
 * cut) for symmetry with every other domain's Mock/Http split.
 */
export class MockDashboardRepository implements DashboardRepository {
  async getAssetStats(): Promise<AssetDashboardStats> {
    const { data: assets } = await assetService.listAssets({});
    const today = new Date();

    return {
      totalAssets: assets.length,
      available: assets.filter((a) => a.status === 'Available').length,
      assigned: assets.filter((a) => a.status === 'Assigned').length,
      inMaintenance: assets.filter((a) => a.status === 'In Maintenance').length,
      retired: assets.filter((a) => a.status === 'Retired').length,
      expiredWarranty: assets.filter((a) => new Date(a.warrantyExpiry).getTime() < today.getTime()).length,
      departmentDistribution: groupCounts(assets, (a) => a.department),
      assetTypeDistribution: groupCounts(assets, (a) => a.type),
    };
  }
}

/**
 * Backed by go-template-main's real Dashboard endpoint (GET /dashboard/stats,
 * RAISE-FR-EXEC-001), computed server-side from Asset domain data already in Postgres.
 */
export class HttpDashboardRepository implements DashboardRepository {
  async getAssetStats(): Promise<AssetDashboardStats> {
    const response = await apiClient.get<AssetDashboardStats>('/dashboard/stats');
    return response.data;
  }
}
