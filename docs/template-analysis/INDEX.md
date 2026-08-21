# Template Analysis — Index

Read-only architecture & production-readiness audit of `react-template-main`, performed 2026-08-21.
Audit method: full manual read of every file under `src/`, all root config files, `README.md`, `SETUP.md`, `Dockerfile`, and `package-lock.json` (for resolved dependency versions). No source file was modified. `npm run lint` / `npm run build` were attempted but could not execute — see [TESTING-STANDARD.md](./TESTING-STANDARD.md) and [TEMPLATE-READINESS-REVIEW.md](./TEMPLATE-READINESS-REVIEW.md) for why.

| Document | One-line summary |
|---|---|
| [TEMPLATE-STRUCTURE.md](./TEMPLATE-STRUCTURE.md) | Folder-by-folder map of the template: 21 source files total, very shallow tree, one demo feature (Dashboard) and one auth page (Login). |
| [TECH-STACK.md](./TECH-STACK.md) | React 18.3 + TS 5.9 + Vite 5.4 + Tailwind 3.4 + React Router 7.10 + Axios 1.13 + Zustand 4.5 (installed but unused). Versions taken from `package-lock.json`, not README (README understates several). |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Bootstrap trace, routing, layout/shell, and state-management analysis. Routing has no lazy loading, no 404 route, no nested modules beyond one protected group. |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | No true design-system layer exists — `Loading`, `Navbar`, `ErrorBoundary` are the only reusable components; everything else is raw Tailwind markup with no Button/Input/Modal/Table primitives. |
| [API-ARCHITECTURE.md](./API-ARCHITECTURE.md) | Single Axios instance with auth-header and 401 interceptors; no retry, no cancellation, no response envelope unwrapping, no timeout tuning per call. |
| [AUTH-RBAC.md](./AUTH-RBAC.md) | Authentication is DEMO ONLY (plaintext localStorage token/user, no refresh, no expiry check). Authorization/RBAC is MISSING entirely despite a `role` field on `User`. |
| [TESTING-STANDARD.md](./TESTING-STANDARD.md) | No test tooling of any kind is configured — no unit/component/E2E framework, no test files, no `test` script. |
| [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) | No hardcoded secrets found. Highest-severity findings are token-in-localStorage (XSS exfiltration risk) and hard `window.location.href` redirect on 401. |
| [DEPENDENCY-REVIEW.md](./DEPENDENCY-REVIEW.md) | 6 prod deps, 14 dev deps. Zustand is installed and unused (dead dependency). All majors current as of lockfile; no lockfile-evident CVEs identified by manual review. |
| [PROJECT-STARTING-GUIDE.md](./PROJECT-STARTING-GUIDE.md) | Foundation vs. project-specific split, plus a step-by-step guide to starting a real project from this template. |
| [TEMPLATE-READINESS-REVIEW.md](./TEMPLATE-READINESS-REVIEW.md) | Final consolidated report. Verdict: **READY WITH DOCUMENTED LIMITATIONS**. |

| [FRONTEND-CANDIDATE-COMPARISON.md](./FRONTEND-CANDIDATE-COMPARISON.md) | Comparative read-only audit of all 4 frontend candidates (`react-template-main`, `esaps_ai_template`, orphaned root `src/`, `frontend/`) across the same axes as this template's audit, with a full comparison table. |
| [FRONTEND-RECOMMENDATION.md](./FRONTEND-RECOMMENDATION.md) | Verdict: adopt `frontend/` as the base (it already merges the other candidates' best patterns); step-by-step adoption plan and blocking items before real RAISE feature work starts. |
| [FRONTEND-FOUNDATION-BASELINE.md](./FRONTEND-FOUNDATION-BASELINE.md) | Decision-record baseline: source-priority rule (PRD > Design > Prototype > ESAPS Reference > Implementation Detail), three-category source map, IT Requisition scoping decision, `NEEDS_PRD_CONFIRMATION` log, full legacy-page migration boundary table, re-verified blocking-items status, and technical debt log — established before any frontend scaffolding begins. Not to be confused with `docs/project-foundation-baseline/PROJECT-FOUNDATION-BASELINE.md`, which covers ESAPS-reference page-level KEEP/EXTEND/REPLACE decisions (a different scope). |

Supporting note: `README.md` and `SETUP.md` describe several capabilities (Zustand state management, React Router "6", `services/auth.ts`, `types/index.ts`, `.env`/`.env.production` files) that do not match the actual code in `src/` or the actual root file listing. Every such discrepancy is called out explicitly in the relevant document below rather than silently trusted.
