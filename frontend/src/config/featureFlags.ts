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
