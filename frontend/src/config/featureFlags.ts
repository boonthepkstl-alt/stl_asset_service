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
