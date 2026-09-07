package model

// DistributionCount is a plain label/count pair -- deliberately no color field. Color is a
// presentation concern (a Tailwind CSS class name), same reasoning AssetModel's frontend
// counterpart drops its `icon: LucideIcon` field when mirroring the Go model (see the comment
// on AssetModel) -- a real API should never return a UI styling token. The frontend assigns
// colors by cycling a fixed palette over whichever labels come back
// (frontend/src/services/dashboard-service.ts).
type DistributionCount struct {
	Label string `json:"label"`
	Count int    `json:"count"`
}

// DashboardStatsModel is RAISE-FR-EXEC-001's first cut -- computed entirely from Asset domain
// data already in Postgres (RAISE-FR-ASSET-001), moving logic that already existed
// client-side (frontend/src/services/dashboard-service.ts, pre-this-cut) onto the backend.
// Deliberately excludes:
//   - Any NBV/Risk-scored figure -- nothing resembling either is modeled or approximated here.
//     Neither is an open question any more, and the reason differs: NBV's formula is confirmed
//     (PRD Sec16 Resolved Question 46) and computed on the frontend in lib/nbv.ts, which needs
//     a configured per-category useful life this model does not carry (Open Finding F-03);
//     Risk scoring is OUT of MVP scope (Resolved Question 47). An earlier version of this
//     comment cited "PRD Sec16 Q3/Q4" as open -- stale on both halves (Finding F-51).
//   - Software License count. RAISE-FR-LICENSE-001 is confirmed Roadmap-only and has no
//     backend table to query -- the frontend continues sourcing that one field from its
//     existing mock license service (see dashboard-service.ts's merge logic).
type DashboardStatsModel struct {
	TotalAssets            int                 `json:"totalAssets"`
	Available              int                 `json:"available"`
	Assigned               int                 `json:"assigned"`
	InMaintenance          int                 `json:"inMaintenance"`
	Retired                int                 `json:"retired"`
	ExpiredWarranty        int                 `json:"expiredWarranty"`
	DepartmentDistribution []DistributionCount `json:"departmentDistribution"`
	AssetTypeDistribution  []DistributionCount `json:"assetTypeDistribution"`
}
