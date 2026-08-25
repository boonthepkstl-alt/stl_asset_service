// Executive Dashboard types (Phase 8). Unlike a CRUD domain, the Dashboard has no repository of
// its own — it's a read-only aggregation over Asset and License (the two domains with a real
// service today). See services/dashboard-service.ts for exactly what is computed live vs kept
// as static illustrative content pending a domain that doesn't exist yet (Approval, Activity
// log, AI, Reconciliation — see DASHBOARD-MIGRATION.md for the KEEP/COMPUTE/DEFER breakdown).

// Raw label/count pair, no color -- this is the shape both the mock computation and
// go-template-main's GET /dashboard/stats (RAISE-FR-EXEC-001) return. Color is a presentation
// concern assigned afterward by dashboard-service.ts (cycling a fixed palette), not domain data.
export interface DistributionCount {
  label: string;
  count: number;
}

export interface DistributionSlice extends DistributionCount {
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
