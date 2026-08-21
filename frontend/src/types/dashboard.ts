// Executive Dashboard types (Phase 8). Unlike a CRUD domain, the Dashboard has no repository of
// its own — it's a read-only aggregation over Asset and License (the two domains with a real
// service today). See services/dashboard-service.ts for exactly what is computed live vs kept
// as static illustrative content pending a domain that doesn't exist yet (Approval, Activity
// log, AI, Reconciliation — see DASHBOARD-MIGRATION.md for the KEEP/COMPUTE/DEFER breakdown).

export interface DistributionSlice {
  label: string;
  count: number;
  color: string;
}

export interface DashboardStats {
  totalAssets: number;
  available: number;
  assigned: number;
  inMaintenance: number;
  retired: number;
  expiredWarranty: number;
  softwareLicenseCount: number;
  departmentDistribution: DistributionSlice[];
  assetTypeDistribution: DistributionSlice[];
}
