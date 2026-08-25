// RAISE-FR-LICENSE-001 (Software License Management) and RAISE-AI-RECOMMEND-001 (AI Decision
// Center) are confirmed Roadmap-only in RAISE-PRD.md -- not MVP -- but their pages/routes/nav
// entries were already built ahead of that confirmation. Gate them behind this flag so they
// stay reachable for demo/dev purposes without being presented as approved MVP functionality
// by default. See RAISE-PRD.md's engineering notes on both requirements, and
// docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md's NEEDS_PRD_CONFIRMATION log.
export const ROADMAP_FEATURES_ENABLED = import.meta.env.VITE_ENABLE_ROADMAP_FEATURES === 'true';

// Nav item ids (config/navigation.ts) and route path constants (config/constants.ts) gated by
// the flag above. Kept as one shared list so the nav filter and the route filter can't drift.
export const ROADMAP_ONLY_NAV_IDS = new Set(['licenses', 'ai']);

// go-template-main now has a real Asset Registry domain (RAISE-FR-ASSET-001, see
// go-template-main/controller/assetController.go) but this frontend has been running entirely
// on MockAssetRepository's in-memory fixtures. Default OFF -- there's no backend/Postgres
// running in most dev/test environments, and the whole existing test suite (Assets,
// AssetDetail, CreateAsset, Dashboard, cross-domain tests) depends on the mock's synchronous,
// seeded data. Set to "true" only when a real go-template-main instance (with the
// V1__Assets_Table.sql migration applied) is actually running at VITE_API_BASE_URL.
export const ASSET_API_ENABLED = import.meta.env.VITE_ASSET_API_ENABLED === 'true';

// Same reasoning as ASSET_API_ENABLED, for the Employee domain (go-template-main/controller/
// employeeController.go). Independent flag since the two domains' backends can land/be
// enabled separately.
export const EMPLOYEE_API_ENABLED = import.meta.env.VITE_EMPLOYEE_API_ENABLED === 'true';

// Same reasoning as ASSET_API_ENABLED/EMPLOYEE_API_ENABLED, for the Ticket/Maintenance domain
// (go-template-main/controller/ticketController.go, RAISE-FR-MAINT-001). Independent flag
// since it depends on both the Asset and Employee domains already being resolvable server-side.
export const TICKET_API_ENABLED = import.meta.env.VITE_TICKET_API_ENABLED === 'true';

// Same reasoning as the flags above, for the Immutable Audit Log domain
// (go-template-main/controller/auditController.go, RAISE-FR-AUDIT-001). Independent flag since
// it can land/be enabled separately from the domains it observes.
export const AUDIT_API_ENABLED = import.meta.env.VITE_AUDIT_API_ENABLED === 'true';

// Same reasoning as the flags above, for the Executive Dashboard's Asset-derived KPI
// computation (go-template-main/controller/dashboardController.go, RAISE-FR-EXEC-001).
// Independent flag since it can land/be enabled separately from ASSET_API_ENABLED itself --
// this domain composes over the Asset domain server-side, not the frontend's own
// assetService, so enabling it doesn't require ASSET_API_ENABLED to also be on.
export const DASHBOARD_API_ENABLED = import.meta.env.VITE_DASHBOARD_API_ENABLED === 'true';
