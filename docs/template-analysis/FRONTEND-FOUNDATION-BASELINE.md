# Frontend Foundation Baseline

*(Named distinctly from `docs/project-foundation-baseline/PROJECT-FOUNDATION-BASELINE.md`, which covers
ESAPS-reference page-level KEEP/EXTEND/REPLACE decisions — a different scope. This document covers the
frontend-candidate source map, migration boundary, and blocking-items status established in this analysis
pass.)*

**Document Type:** Decision Record / Migration Boundary Baseline
**Status:** Draft for Review
**Date:** 2026-08-21
**Scope:** Establishes the source-of-truth map, migration boundary, and blocking-items status for the RAISE frontend
before any scaffolding or business-page implementation work begins.
**Read-only basis (v1.0 only):** The original v1.0 baseline was the output of a read-only analysis pass — no source
code was modified to produce it. v1.1 and v1.2 each layered one narrow, explicitly user-requested implementation
step on top of that baseline (frontend RBAC hardening, then backend `RequireRole` wiring); see the Changelog and
[Non-Actions Taken](#8-explicit-non-actions-taken-this-phase) for exactly what was and wasn't touched in each
revision.

Companion documents (read first for full evidence trails):
- [INDEX.md](./INDEX.md) — audit index
- [FRONTEND-CANDIDATE-COMPARISON.md](./FRONTEND-CANDIDATE-COMPARISON.md) — 4-way comparison of
  `react-template-main`, `esaps_ai_template`, root `src/`, `frontend/`
- [FRONTEND-RECOMMENDATION.md](./FRONTEND-RECOMMENDATION.md) — verdict and adoption plan
- [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) — single source of truth for RAISE product scope (v0.4, Draft
  for Requirement Review as of this writing)

---

## 1. Source Priority

When any two sources disagree about what RAISE should do, resolve the conflict using this strict priority order —
higher wins, and a lower-priority source can never silently become a requirement on its own:

```
PRD  >  Design  >  Prototype  >  ESAPS Reference  >  Implementation Detail
 │        │            │              │                      │
 │        │            │              │                      └─ code-level choices (variable names,
 │        │            │              │                         component internals, test scaffolding)
 │        │            │              └─ esaps_ai_template / root src/ — UI and business-flow
 │        │            │                 inspiration ONLY, never a requirement source
 │        │            └─ RAISE-PROTOTYPE.md — screen inventory / per-screen spec
 │        └─ RAISE-DESIGN.md — logical architecture / UX design
 └─ RAISE-PRD.md — product requirements (source of truth)
```

**Rule:** If `esaps_ai_template/` or root `src/` shows a behavior, field, workflow, or screen that
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) does not define, that behavior **must not** be treated as an
approved requirement and must not be silently adopted into scope. It must instead be logged as
**`NEEDS_PRD_CONFIRMATION`** in the [log below](#4-needs_prd_confirmation-log) and routed through the PRD chain's own
confirmation mechanism (`/update-prd`) before any implementation depends on it. This mirrors the PRD's own governing
rule (`RAISE-PRD.md` §16, "None are silently resolved") and CLAUDE.md's instruction that `## NEEDS_PRD_CONFIRMATION`
requires explicit user confirmation before writing new PRD content — it is not an auto-chain.

This also governs VERSCAN: per `RAISE-PRD.md` §15 ("VERSCAN Reference Policy"), VERSCAN sits even below ESAPS
Reference in influence — it may only inspire a *candidate* that itself must climb the promotion path
`VERSCAN Reference → Candidate Capability → Business Requirement Review → RAISE PRD → Approved / Rejected` before
touching any layer of this priority order.

---

## 2. Source Map

Three explicit categories — not two. Collapsing ESAPS reference material into a single "business source" bucket
would blur the difference between UI/business inspiration and the one piece of ESAPS that is a genuine technical
pattern reference. Keep them separate.

### 2a. BUSINESS REFERENCE + UI REFERENCE

**`esaps_ai_template/` and root `src/`** — treated as **ONE equivalent reference copy**, not two independent
sources. `FRONTEND-CANDIDATE-COMPARISON.md` (Candidate 3 section) confirmed root `src/` is **byte-for-byte identical**
to `esaps_ai_template/src/` across all 39 shared files, with no `package.json`/`tsconfig.json`/`vite.config.ts` of its
own — it cannot be built, run, or type-checked independently. It is a stray duplicate, not a divergent snapshot.

**Role:** UI-completeness and business-flow inspiration for the RAISE domain (20 page mockups covering
Assets/Employees/Licenses/Maintenance/Reconciliation/AI Decision Center/Administration/User-Role
Management/Settings), and the origin of the 18-component `components/ui/` kit shared across candidates 2–4. Neither
file counts as a requirement source per the [Source Priority](#1-source-priority) rule above — every screen/behavior
found here that isn't already backed by a `RAISE-PRD.md` requirement ID must be flagged
`NEEDS_PRD_CONFIRMATION`, not adopted.

### 2b. AI TECHNICAL REFERENCE

**`esaps_ai_template/server.ts`** (lines 1–392) — a **pattern reference** for how to implement server-side Gemini AI
calls: `getAIClient()` (`server.ts:11-23`), the deterministic-fallback-on-failure design
(`generateFallbackDecision`/`generateFallbackAudit`/`generateFallbackExecutive`/`generateFallbackChat`,
`server.ts:37-132`), and the four-endpoint shape (`decision-matrix`, `reconcile-audit`, `executive-summary`, `chat`).

**Explicitly NOT MVP scope.** `RAISE-PRD.md` §7 lists Natural Language Search as the only "Current"-status AI
capability confirmed for MVP alongside the four newly-added `RAISE-AI-DOC-*` document-processing requirements
(§13 MVP Scope); Risk Scoring and Lifecycle Prediction are Pilot, AI Recommendation is Roadmap (§14). None of these
map onto `server.ts`'s four routes as a 1:1 MVP deliverable.

**Explicitly NOT to be adopted as the production backend.** Production AI calls belong behind
`go-template-main` → an AI controller/service layer (Go) → Gemini — **never Express**. This is stated directly in
`FRONTEND-RECOMMENDATION.md` ("This should land as a `go-template-main` controller ... rather than as a bolted-on
Node/Express side-service — porting the Express server file itself into `frontend/` would reintroduce a second
server stack RAISE does not need"). Verified during this pass: `go-template-main/controller/` currently contains
only `authController.go` and `sampleController.go` — **no AI-specific controller exists yet**.

### 2c. ACTUAL PRODUCT SCOPE

`RAISE-PRD.md` / `RAISE-DESIGN.md` / `RAISE-PROTOTYPE.md` — the only documents that define what RAISE actually is
required to do, per the [Deliverable Chain](../../CLAUDE.md) established for this project.

### Supporting role of the other two candidates

- **`react-template-main`** contributed the Axios instance shape and auth-interceptor pattern (request interceptor
  injects `Authorization: Bearer <token>`; response interceptor clears session + hard-redirects on 401). Confirmed
  as the direct ancestor of `frontend/src/services/api-client.ts` (`FRONTEND-CANDIDATE-COMPARISON.md`, Candidate 4
  section). No further porting is needed from this candidate.
- **`go-template-main`** is the backend API target. `frontend/src/services/api-client.ts` and `auth-service.ts` are
  written explicitly against its contract (`Authorization: Bearer`, `/api/v1` base path,
  `authController.go`-shaped login/logout). It is the only candidate with a real backend deliverable.
- **`frontend/`** ("raise-frontend") is the **chosen implementation foundation going forward**. It already has
  absorbed the useful pieces of the other three: the esaps/root-`src` UI kit (18 `components/ui/` primitives +
  `AppShell.tsx` shell pattern), the react-template-main Axios/auth pattern, and its own materially more mature
  service/repository layer and test suite (31 test files, 103 passing tests, verified live in
  `FRONTEND-CANDIDATE-COMPARISON.md`). All future frontend development happens here; `react-template-main`,
  `esaps_ai_template`, and root `src/` become historical/reference only per
  `FRONTEND-RECOMMENDATION.md`'s step-by-step adoption plan, item 1.

---

## 3. IT Requisition Scoping Decision

**Decision: IT Requisition is a sub-flow of Maintenance, not an independent vertical slice.**

**Rationale:** `RAISE-PRD.md` defines no standalone "IT Requisition" functional requirement anywhere in §6–§9 or the
§17 Traceability Matrix. The only PRD-recognized asset-operations requirements touching this territory are
`RAISE-FR-MAINT-001` (Maintenance) and `RAISE-FR-OPS-002` (Check-in/Check-out) — both of which describe
requisition-adjacent behavior ("appropriate permission," workflow, exception handling) as **open/TBD** rather than
as a separately scoped capability (`RAISE-PRD.md` §16, Q11–Q12, Q14). ESAPS reference material (`esaps_ai_template`)
does not contain a dedicated IT-requisition page distinct from `Maintenance.tsx`/`TicketDetail.tsx` either — this
decision is not overriding an ESAPS design so much as declining to invent a vertical the PRD never named.

Per the [Source Priority](#1-source-priority) rule, absent a PRD requirement, "IT Requisition as a separate slice"
cannot be adopted as scope. Treating it as a Maintenance sub-flow keeps the implementation boundary aligned with
what `RAISE-FR-MAINT-001` already covers ("maintenance information as part of the asset lifecycle") without
expanding scope beyond the PRD.

**This is a working assumption pending confirmation**, not a resolved business decision — the source material
(Hackathon proposal via `RAISE-PRD.md` v0.1 draft) gives no explicit vertical-slice boundary for IT Requisition one
way or the other. It is logged below as the first `NEEDS_PRD_CONFIRMATION` item.

---

## 4. NEEDS_PRD_CONFIRMATION Log

Per CLAUDE.md's rule for this vault, entries here require explicit user/business confirmation via `/update-prd`
before being written into `RAISE-PRD.md` as approved requirements. None are resolved by this document.

| # | Question | Status | Notes |
|---|---|---|---|
| 1 | Does Maintenance include the 4-stage IT-requisition approval workflow: User Requisition → Dept Approval → IT Dispatch → Technician Execution? | **NEEDS_PRD_CONFIRMATION** (not yet answered by `RAISE-PRD.md`) | Directly affects the [IT Requisition Scoping Decision](#3-it-requisition-scoping-decision) above and `RAISE-FR-MAINT-001`/`RAISE-FR-OPS-002`'s open workflow questions (`RAISE-PRD.md` §16 Q11-Q12, Q14). |
| 2 | Should any ESAPS-reference-only pages/flows be promoted into RAISE scope — specifically `Assignment.tsx`, `Auth.tsx` (beyond Login), `Inventory.tsx`, `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`, `SoftwareLicense.tsx`, `ErrorPages.tsx` (found in `esaps_ai_template/src/pages/` with no corresponding `frontend/` page or PRD requirement)? | **NEEDS_PRD_CONFIRMATION** | See [Migration Boundary Table](#5-migration-boundary-table) rows for each — none currently map to a `RAISE-PRD.md` Traceability ID. |
| 3 | Should the AI Decision Center's "recommendation" behavior (currently mock-data-driven in `frontend/src/services/ai-decision-service.ts`, modeled on `esaps_ai_template`'s decision-matrix concept) be scoped as `RAISE-AI-RECOMMEND-001` (Roadmap, not MVP per `RAISE-PRD.md` §7/§13/§14) or does its MVP subset map to a different, currently-undefined requirement? | **NEEDS_PRD_CONFIRMATION** | `RAISE-PRD.md` §7 is explicit that `RAISE-AI-RECOMMEND-001` is Enterprise Roadmap, not Phase 1 MVP, yet `frontend/`'s `AIDecisionCenter` page already exists and is routed (`App.tsx`). This is a scope-boundary risk: the page currently ships ESAPS-inspired recommendation UI (age, repair cost, risk score, recommended action, confidence — matching the `RAISE-AI-RECOMMEND-001` demonstrated-example shape) without an MVP requirement ID actually backing it. |
| 4 | Is the Oracle FA Reconciliation page (`frontend/src/pages/modules.tsx` → `ReconciliationPage`, currently a placeholder per its own code comment "Migrates from `src/pages/Reconciliation.tsx` once Oracle FA is connected in Phase 6") intended to satisfy `RAISE-FR-ORACLE-001`, and does "Phase 6" in that comment correspond to any phase defined in `RAISE-PRD.md`? | **NEEDS_PRD_CONFIRMATION** | `RAISE-PRD.md` has no phase-numbering scheme matching "Phase 6" — the phrase appears to originate from a `frontend/`-internal migration plan (see [Technical Debt Log](#7-technical-debt-log) item 3) that is not itself a PRD artifact. |
| 5 | Does the RAISE MVP require a persisted (backend-enforced) RBAC/permission model before Phase 1 ships, or is a UI-only permission-matrix acceptable for the Hackathon MVP with enforcement deferred? | **NEEDS_PRD_CONFIRMATION** | `RAISE-PRD.md` §11 marks `RAISE-NFR-SEC-RBAC-001` fully TBD; §16 Q21-Q23 are open. This is also [Blocking Item B-1](#6-blocking-items-assessment) below — flagged here too because it is simultaneously an engineering blocker and an unanswered business/security-design question. |

---

## 5. Migration Boundary Table

**Decision vocabulary** (used consistently in the table below):

- **KEEP** — already migrated into `frontend/` in materially complete form; continue building on it as-is.
- **EXTEND** — a `frontend/` counterpart exists but is intentionally a placeholder/thinner than the ESAPS reference;
  extend it toward PRD requirements when those requirements are confirmed.
- **REWRITE** — no acceptable `frontend/` counterpart exists yet; the ESAPS page is UI inspiration only and the
  RAISE version must be built against confirmed PRD/Design/Prototype content, not ported directly.
- **DROP** — no PRD requirement supports this page's function; do not migrate unless promoted through
  `NEEDS_PRD_CONFIRMATION` first.
- **DEFER** — explicitly Roadmap/out-of-scope per `RAISE-PRD.md` §14/§15; revisit only when that changes.

Legacy pages enumerated from `esaps_ai_template/src/pages/` (root `src/pages/` is byte-identical, per
[§2a](#2a-business-reference--ui-reference), so it is not listed as a second row set).

| Legacy Page | Target Module | PRD Requirement | Target Route | Decision | Migration Phase | Notes / Open Questions |
|---|---|---|---|---|---|---|
| `AIDecisionCenter.tsx` | AI Decision Center | `RAISE-AI-RISK-001` (Pilot)/`RAISE-AI-RECOMMEND-001` (Roadmap) — **not a confirmed MVP requirement** | `/ai-decision` (exists in `frontend/App.tsx`) | EXTEND | Phase 5G (per `frontend/` internal comment) | `frontend/src/pages/AIDecisionCenter` already exists and is routed, driven by mock fixture data (`ai-decision-service.ts`). Scope risk — see [NEEDS_PRD_CONFIRMATION #3](#4-needs_prd_confirmation-log): the page currently implements Roadmap-tier functionality ahead of PRD confirmation. |
| `Administration.tsx` | Administration | No dedicated FR; implicitly supports `RAISE-NFR-SEC-RBAC-001` (TBD) | `/admin` | KEEP | Phase 5 (already migrated) | `frontend/src/pages/Administration` exists and is routed. |
| `AssetDetail.tsx` | Asset Registry | `RAISE-FR-ASSET-001` | `/assets/:id` | KEEP | Phase 4 (already migrated) | `frontend/src/pages/AssetDetail` exists and is routed. |
| `AssetList.tsx` | Asset Registry | `RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-002` | `/assets` | KEEP | Phase 4 (already migrated) | Migrated as `frontend/src/pages/Assets`. |
| `Assignment.tsx` | Custody / Check-in-Check-out | `RAISE-FR-ASSET-003`, `RAISE-FR-OPS-002` — workflow detail TBD (`RAISE-PRD.md` §16 Q11-Q12) | NONE yet in `frontend/` | REWRITE | Not started | No `frontend/` counterpart exists. Do not port ESAPS's assignment UI directly — workflow/approval/role detail is still TBD in the PRD; build only once Q11-Q12 are answered. |
| `Auth.tsx` | Authentication | NONE — RAISE-PRD.md §11 marks authentication mechanism TBD (§16 Q21) | `/login` (partially covered) | KEEP (partial) | Phase 1 (foundation) | `frontend/src/pages/Login` + `AuthContext.tsx` already supersede this with a more complete pattern (see [§2](#2-source-map)); ESAPS's `Auth.tsx` was UI-only with no context/interceptor per `FRONTEND-CANDIDATE-COMPARISON.md`. |
| `CreateAsset.tsx` | Asset Registry | `RAISE-FR-ASSET-001` | `/assets/create` | KEEP | Phase 4 (already migrated) | `frontend/src/pages/CreateAsset` exists and is routed. |
| `Dashboard.tsx` | Executive Dashboard | `RAISE-FR-EXEC-001` | `/dashboard` | EXTEND | Phase 4 (already migrated) | `frontend/src/pages/Dashboard` exists; KPI formulas for Utilization are now resolved (`RAISE-PRD.md` §8, Resolved Q27/Q29) but NBV/Risk formulas remain TBD — dashboard must be extended once those land. |
| `EmployeeDetail.tsx` | Custody / Asset holders | `RAISE-FR-ASSET-003` (holder data model TBD, §16 Q13) | `/employees/:id` | KEEP | Phase 5A (already migrated) | `frontend/src/pages/EmployeeDetail` exists and is routed. |
| `ErrorPages.tsx` | Error/404 handling | No dedicated FR (infrastructure concern) | `*` catch-all | KEEP | Phase 4 (already migrated, improved) | `frontend/` has an explicit `NotFound` route (`App.tsx:69`) — react-template-main and ESAPS both lacked this; `frontend/` is already ahead here. |
| `Inventory.tsx` | Asset Registry (bulk/list view) | NONE — no distinct "Inventory" FR beyond `RAISE-FR-ASSET-001`/`002` | NONE yet in `frontend/` | DROP (pending confirmation) | N/A | Functionally overlaps `AssetList`/`Assets`. No PRD requirement singles out a separate Inventory capability; treat as covered by `RAISE-FR-ASSET-001`/`002` unless business says otherwise — see [NEEDS_PRD_CONFIRMATION #2](#4-needs_prd_confirmation-log). |
| `LicenseDetail.tsx` | Software License | NONE — RAISE-PRD.md defines no software-license FR | `/licenses/:id` | KEEP (as built, scope open) | Phase 5C (already migrated) | `frontend/src/pages/LicenseDetail` exists and is routed, but no `RAISE-FR-LICENSE-*` requirement exists in the PRD at all — see [NEEDS_PRD_CONFIRMATION #2](#4-needs_prd_confirmation-log)-adjacent gap; flagged as scope not yet PRD-anchored. |
| `Maintenance.tsx` | Maintenance | `RAISE-FR-MAINT-001` | `/maintenance` | KEEP | Phase 5B (already migrated) | `frontend/src/pages/Maintenance` exists and is routed. IT Requisition sub-flow decision (§3 above) applies here. |
| `NotificationCenter.tsx` | Alerts | `RAISE-FR-ALERT-001` (rules/channels TBD) | NONE yet in `frontend/` | REWRITE | Not started | No `frontend/` counterpart. `RAISE-FR-ALERT-001` is MVP/P0 but "exact alert rules and channels for MVP are TBD" — do not port ESAPS's notification UI wholesale; build once alert rules are confirmed. |
| `Profile.tsx` | User account | NONE — no user-profile FR in PRD | NONE yet in `frontend/` | DROP (pending confirmation) | N/A | No PRD requirement covers a self-service profile page. See [NEEDS_PRD_CONFIRMATION #2](#4-needs_prd_confirmation-log). |
| `Reconciliation.tsx` | Oracle FA Reconciliation | `RAISE-FR-ORACLE-001` | `/reconciliation` | EXTEND | Phase 6 (per `frontend/`-internal comment, not a PRD phase — see [NEEDS_PRD_CONFIRMATION #4](#4-needs_prd_confirmation-log)) | `frontend/src/pages/modules.tsx` → `ReconciliationPage` is an explicit placeholder ("proves routing + AppShell + design system integration only"). Full Oracle integration is undefined in PRD (§16 Q6-Q10). |
| `Reports.tsx` | Executive Intelligence | Possibly overlaps `RAISE-FR-EXEC-001`'s "AI-Generated Executive Summary" (scope/format undefined) | NONE yet in `frontend/` | REWRITE | Not started | PRD does not define a standalone "Reports" capability distinct from the Executive Dashboard. See [NEEDS_PRD_CONFIRMATION #2](#4-needs_prd_confirmation-log). |
| `RoleManagement.tsx` | RBAC Administration | `RAISE-NFR-SEC-RBAC-001` (TBD) | `/admin/roles` | EXTEND | Phase 5 (already migrated; frontend enforcement + persistence landed) | `frontend/src/pages/RoleManagement` exists, is routed, and now persists its permission matrix through `roleService.updatePermissions` — see [Blocking Item B-1](#6-blocking-items-assessment) (frontend portion resolved; backend enforcement still open). |
| `Settings.tsx` | Settings | No dedicated FR (infrastructure/config concern) | `/settings` | KEEP | Phase 5 (already migrated) | `frontend/src/pages/Settings` exists and is routed. |
| `SoftwareLicense.tsx` | Software License | NONE — same gap as `LicenseDetail.tsx` above | NONE distinct — overlaps `Licenses`/`LicenseDetail` | DROP (pending confirmation) | N/A | Likely superseded by `frontend/src/pages/Licenses` + `LicenseDetail`; no separate PRD anchor exists for either. See [NEEDS_PRD_CONFIRMATION #2](#4-needs_prd_confirmation-log). |
| `TicketDetail.tsx` | Maintenance (ticket sub-flow) | `RAISE-FR-MAINT-001` (workflow TBD) | `/tickets/:id` | KEEP | Phase 5B (already migrated) | `frontend/src/pages/TicketDetail` exists and is routed. Also the most likely landing point for the IT-requisition sub-flow decision (§3) once confirmed. |
| `UserManagement.tsx` | RBAC Administration | `RAISE-NFR-SEC-RBAC-001` (TBD) | `/admin/users` | KEEP | Phase 5 (already migrated) | `frontend/src/pages/UserManagement` exists and is routed. |

**Table stats:** 21 legacy pages enumerated (from `esaps_ai_template/src/pages/`, `root src/pages/` identical).
KEEP: 12 · EXTEND: 4 · REWRITE: 3 · DROP (pending confirmation): 3 · DEFER: 0 (none of the 21 pages map directly to a
`RAISE-PRD.md` §14 Enterprise Roadmap item as a page-for-page port; Roadmap items like AI Recommendation are tracked
as a requirement-level concern via `NEEDS_PRD_CONFIRMATION #3` rather than a page-migration row). Note: some rows sum
to more than 21 in spirit because `AssetList.tsx`/`Inventory.tsx` and `LicenseDetail.tsx`/`SoftwareLicense.tsx`
overlap functionally — each legacy file still gets its own row for completeness.

---

## 6. Blocking Items Assessment

Full Step 1 output. Each item classified BLOCKER/HIGH/MEDIUM/LOW/DEFERRED, cross-checked against the **current**
state of `frontend/` (re-verified this pass, not just quoted from `FRONTEND-RECOMMENDATION.md`).

### B-1. No RBAC/authorization enforcement — **RESOLVED (frontend) / PARTIAL (backend example wired; no real admin API yet)**

- **Original problem:** No authorization enforcement existed anywhere in `frontend/` beyond a login-gate.
  `ProtectedRoute` checked only `isAuthenticated`, and `RoleManagement`'s permission matrix was a local-state-only
  toast that discarded on reselect/refresh.
- **Frontend resolution (this pass) — evidence:**
  - `frontend/src/App.tsx` — `ProtectedRoute` now accepts an `allowedRoles?: Role[]` prop; when present, it checks
    `user.role` and redirects non-matching authenticated users to `/forbidden` instead of rendering the page.
  - `/administration`, `/administration/users`, and `/administration/roles` are now nested under
    `<ProtectedRoute allowedRoles={['ADMIN']} />` in `App.tsx`, rather than the general auth-only guard.
  - `frontend/src/pages/Forbidden/index.tsx` (new) — a 403 page shown to authenticated users who fail the role
    check, distinct from the existing 404 `NotFound` page.
  - `frontend/src/types/role.ts` — `Role` gained an optional `modulePermissions: Record<string, string[]>` field.
  - `frontend/src/services/role-repository.ts` / `role-service.ts` — added `updatePermissions(id, modulePermissions)`,
    implemented in `MockRoleRepository` at the same tier as the existing `createRole`/`deleteRole` methods (rejects
    changes to `system` roles, same as `remove` already does).
  - `frontend/src/pages/RoleManagement/index.tsx` — "Save Changes" now calls `roleService.updatePermissions`,
    shows a real success/failure toast, and reloads the saved matrix on role reselect instead of always reseeding a
    hardcoded default. This matches the pattern the `Settings` page had already established ("Save Changes actually
    mutates, unlike the legacy toast-only button").
  - New regression tests: `frontend/src/App.rbac.test.tsx` (3 tests — non-ADMIN redirected to `/forbidden`, ADMIN
    admitted, unrestricted routes unaffected) and `frontend/src/services/role-service.test.ts` (2 tests — permission
    matrix persists and is readable back; system roles reject the update).
  - Verified this pass: full suite `npx vitest run` — **32 test files / 102 tests, all passing** (30 pre-existing +
    2 new files); `npx tsc --noEmit` — clean; `npx eslint . --ext ts,tsx --max-warnings 0` — clean; `npm run build`
    (`tsc && vite build`) — succeeds.
- **Backend wiring (follow-up pass) — evidence:**
  - `go-template-main/router/sampleRouter.go` — `middleware.RequireRole("admin")` is now chained in front of
    `POST /samples`, `PUT /samples/:id`, and `DELETE /samples/:id` (the mutating operations). `GET /samples` and
    `GET /samples/:id` remain open to any authenticated role, unchanged.
  - This was deliberately applied to `/samples` — the only existing mutating CRUD group in the template — as a
    **reference example of the wiring pattern**, not as real admin-API coverage. `go-template-main` still has no
    User/Role/Permission management endpoints at all (only `authController.go`/`sampleController.go` exist), so
    there is nothing resembling the frontend's `/administration/*` surface for `RequireRole` to actually protect
    yet. When real admin endpoints are built, they should copy this exact pattern
    (`middleware.JWTAuth()` then `middleware.RequireRole("admin")` per mutating route), not reinvent it.
  - New regression tests: `go-template-main/middleware/requireRole_test.go` (3 cases — admin role reaches the
    handler, non-admin role gets 403, missing token gets 401 before role is even checked). Uses the existing
    `BYPASS_JWT`/`BYPASS_JWT_ROLE` viper flags `jwtAuth.go` already supported, so no real JWT/DB setup was needed.
  - Verified this pass: `go build ./...` — clean; `go test ./...` — all packages pass, including the new
    `middleware` test and the pre-existing `controller` tests (which build their own bare fiber app bypassing
    `SetupRoutes` entirely, so they were never exercising this middleware and remain unaffected).
- **Why it still isn't "fully production-ready" — remaining gap:**
  - There is still no real `User`/`Role`/`Permission` persistence anywhere — no database tables, no CRUD endpoints,
    no admin-facing API surface for `RequireRole` to guard beyond the `/samples` demo. The frontend's
    `modulePermissions` matrix still lives only in `MockRoleRepository`'s in-memory array, reset on page reload.
  - The role set used (`EMPLOYEE`/`IT_STAFF`/`IT_MANAGER`/`ADMIN`) and the "Administration = ADMIN only" mapping
    applied in `App.tsx` are working assumptions, not PRD-confirmed business rules — `RAISE-NFR-SEC-RBAC-001` is
    still TBD in `RAISE-PRD.md` §11, and this is consistent with [NEEDS_PRD_CONFIRMATION item
    5](#4-needs_prd_confirmation-log) already logged above (backend-enforced RBAC vs. UI-only matrix for MVP).
  - Once real admin endpoints exist, they still need `RequireRole` applied explicitly per route (fiber has no
    global role-gating by path prefix in this template) — the wiring pattern is proven, but each future admin
    route must remember to use it.
- **Recommended action:** Design real `Role`/`Permission` persistence and admin CRUD endpoints once
  `RAISE-NFR-SEC-RBAC-001` and NEEDS_PRD_CONFIRMATION item 5 are resolved; apply `middleware.RequireRole(...)` to
  each mutating admin route following the `/samples` pattern established here.
- **Must complete before new feature development:** No longer a hard blocker for frontend feature work (the UI-level
  gap that was blocking is closed) or for backend plumbing work (the wiring pattern is now proven). **Still required
  before production deployment**, and before any real admin endpoint ships without this same gating applied.
- **Current `frontend/` status: RESOLVED.** **Current backend (`go-template-main`) status: PARTIAL** — the
  `RequireRole` wiring pattern is proven and tested against the one existing mutating CRUD group (`/samples`), but
  no real admin/user/role management endpoint exists yet for it to actually protect in production.

### B-2. No CI/CD pipeline — **HIGH**

- **Problem:** `frontend/` has a real, passing test suite (31 files / 103 tests) but nothing runs it automatically.
- **Evidence:** `FRONTEND-RECOMMENDATION.md`, "Blocking items," item 2, and adoption-plan item 7. Re-verified this
  pass: no `.yml`/`.yaml` file exists anywhere under `frontend/`, and no `.github/` directory exists anywhere in the
  repository root.
- **Why it matters:** A test suite that only runs manually will silently rot as the migration table above adds
  pages — regressions in `KEEP`-status pages won't be caught automatically.
- **Recommended action:** Add a CI workflow (lint + `vitest run` + build) gated on PR, scoped to `frontend/` only.
- **Must complete before new feature development:** No — existing manual `vitest run` is a functioning stopgap, but
  this should land early in Phase-1 implementation, not be deferred indefinitely.
- **Current `frontend/` status: STILL FAILS.** Confirmed unresolved as of this pass (no CI config found).

### B-3. `/api/v1/ai/*` endpoints referenced but not implemented — **HIGH**

- **Problem:** `frontend/`'s own code names a convention (`api-client.ts:5-7`, "AI-related requests must go through
  `/api/v1/ai/*`") that has nothing real to call.
- **Evidence:** `FRONTEND-RECOMMENDATION.md`, "Blocking items," item 3. Re-verified this pass:
  `go-template-main/controller/` contains only `authController.go` and `sampleController.go` — no AI controller.
  Also newly observed this pass (refinement beyond the recommendation doc's wording): `frontend/`'s
  `AIDecisionCenter` page does not currently even attempt to call `/api/v1/ai/*` — `ai-decision-service.ts` is
  entirely mock-data-driven (`MockAIDecisionRepository` seeded from `src/data/fixtures/decisionData`), so the gap is
  presently latent (no broken call in flight) rather than actively failing. This changes the urgency slightly (no
  runtime error today) but not the underlying blocker: any real AI capability (`RAISE-AI-SEARCH-001`,
  `RAISE-AI-DOC-001..004`) has no backend endpoint to land on yet.
- **Why it matters:** `RAISE-AI-SEARCH-001` and the four `RAISE-AI-DOC-*` requirements are all confirmed P0/MVP
  (`RAISE-PRD.md` §13). None can ship without a real backend AI layer.
- **Recommended action:** Stand up a `go-template-main` AI controller per
  `FRONTEND-RECOMMENDATION.md`'s adoption-plan item 3, modeled on `esaps_ai_template/server.ts`'s route shape and
  fallback design (per [§2b](#2b-ai-technical-reference) above — as a Go controller, not a ported Express server).
- **Must complete before new feature development:** Yes, specifically before any `RAISE-AI-*` requirement's UI is
  wired to real data instead of fixtures.
- **Current `frontend/` status: STILL FAILS** (endpoint absent), **but risk profile is slightly better than
  originally described** — no frontend code is currently pointed at a non-existent endpoint; it is pointed at mock
  data instead, which is a safer intermediate state.

### B-4. JWT-in-localStorage risk-acceptance undecided — **HIGH**

- **Problem:** Both `frontend/` and its ancestor `react-template-main` store the auth token in `localStorage`, which
  is vulnerable to XSS-based exfiltration. This has never received a documented risk-acceptance decision.
- **Evidence:** `FRONTEND-RECOMMENDATION.md`, "Blocking items," item 4; originally flagged HIGH in the
  `react-template-main` audit's `SECURITY-REVIEW.md` and `AUTH-RBAC.md`. Re-verified this pass:
  `frontend/src/contexts/AuthContext.tsx:17-21` and `frontend/src/services/api-client.ts` both still use
  `localStorage.getItem/setItem(STORAGE_KEYS.TOKEN)` with no httpOnly-cookie alternative implemented; the
  `AuthContext.tsx` comment itself flags this as "intentionally NOT the final implementation."
- **Why it matters:** `RAISE-PRD.md` §11 requires a Security Design covering authentication and sensitive data
  handling before implementation; token storage is squarely inside that scope and is currently undecided.
- **Recommended action:** Make an explicit risk-acceptance decision (accept localStorage for MVP with documented
  mitigations, or move to `go-template-main`'s `stl_token` httpOnly cookie) as part of Security Design, before
  production traffic.
- **Must complete before new feature development:** No — does not block building more pages, but must be resolved
  before any production deployment.
- **Current `frontend/` status: STILL FAILS** (undecided, unchanged from the recommendation doc).

### B-5. Root `src/` and `esaps_ai_template`'s unused `@supabase/supabase-js` — **MEDIUM**

- **Problem:** Two latent-confusion/latent-risk items: (a) root `src/` duplicates `esaps_ai_template/src/` with no
  build wrapper; (b) `@supabase/supabase-js` is a direct (non-dev) dependency in `esaps_ai_template` with zero
  actual code references.
- **Evidence:** `FRONTEND-RECOMMENDATION.md`, "Blocking items," item 5, and "What to actually pull from where"
  section. Re-verified this pass: `esaps_ai_template/package.json` still lists both `@google/genai": "^2.4.0"` and
  `@supabase/supabase-js": "^2.112.3"` as direct dependencies. Root `src/` still exists at the repo root.
- **Why it matters:** Not an active vulnerability — `FRONTEND-RECOMMENDATION.md` explicitly found no client-side
  Supabase/Gemini usage anywhere. The risk is structural: a future contributor extending `esaps_ai_template` has no
  guardrail against importing Supabase client-side and shipping a key to the browser, and a future contributor could
  accidentally edit the wrong (root `src/`) copy of a page instead of `esaps_ai_template/src/`.
- **Recommended action:** See [Technical Debt Log](#7-technical-debt-log) — review and remove `@supabase/supabase-js`
  once confirmed unnecessary; do not remove it in this phase.
- **Must complete before new feature development:** No.
- **Current `frontend/` status:** Not applicable to `frontend/` directly — `frontend/package.json` has zero
  AI/Supabase SDK dependencies (confirmed this pass), so `frontend/` itself is clean. The risk lives entirely in
  `esaps_ai_template`, which is reference-only per [§2a](#2a-business-reference--ui-reference).

### B-6. `frontend/`-internal "MIGRATION-PLAN.md" reference with no such file found — **LOW** *(newly observed this pass)*

- **Problem:** `frontend/src/pages/modules.tsx` and other page comments (e.g., `ReconciliationPage`) reference "per
  MIGRATION-PLAN.md" and "Phase 6," implying an internal migration-phase document, but no `MIGRATION-PLAN.md` file
  was found anywhere under `frontend/` in this pass.
- **Evidence:** `grep`/`find` for `MIGRATION-PLAN` and `*.md` under `frontend/` returned no matches during this
  pass's verification.
- **Why it matters:** Low severity — it does not block functionality — but it means the "Phase 1/4/5A/5B/5C/5G/6"
  numbering scattered through `frontend/`'s own code comments is currently undocumented anywhere, including in this
  vault's `docs/` tree. This is a documentation gap, not a functional one.
- **Recommended action:** Either locate/restore the referenced `MIGRATION-PLAN.md` if it exists outside this
  workspace, or stop referencing it in code comments until a real document backs the phase numbering — this is a
  documentation hygiene item, not urgent.
- **Must complete before new feature development:** No.
- **Current `frontend/` status:** Confirmed absent as of this pass.

### Severity summary

| Severity | Count | Items |
|---|---|---|
| BLOCKER | 0 | none — B-1's frontend portion is resolved as of this pass (see below) |
| RESOLVED | 1 | B-1, frontend portion (route-level RBAC enforcement + permission persistence) |
| HIGH | 3 | B-2 (CI/CD), B-3 (AI endpoints), B-4 (JWT storage decision) |
| MEDIUM | 2 | B-1 backend residual (wiring pattern proven and tested against `/samples`, but no real admin/user/role API exists yet for it to protect), B-5 (root `src/` / unused Supabase dependency) |
| LOW | 1 | B-6 (undocumented migration-phase references) |
| DEFERRED | 0 | none — all items above have present-day relevance; nothing was deferred out of this assessment |

*Note on B-1: it now spans two states — the frontend-side gap that was the original BLOCKER is RESOLVED; a
MEDIUM-severity backend residual remains, downgraded from its earlier HIGH rating now that `middleware.RequireRole`
is wired and tested against `/samples`'s mutating routes. The remaining gap is a missing capability (no real
admin/user/role API exists yet), not an active unenforced-authorization hole against something already exposed. See
the full B-1 write-up above (section 6, first item) for the split.*

---

## 7. Technical Debt Log

| Item | Location | Action |
|---|---|---|
| Unused `@supabase/supabase-js` dependency (`^2.112.3`, direct `dependency` not `devDependency`) | `esaps_ai_template/package.json` | Review, remove if confirmed unnecessary. **Not removed in this phase** — read-only constraint. |
| Root `src/` — byte-for-byte duplicate of `esaps_ai_template/src/`, no independent build wrapper | repo root `src/` | Candidate for deletion/archival once `esaps_ai_template` is confirmed as the sole retained reference copy. **Not deleted in this phase** — read-only constraint. |
| `frontend/`'s internal "MIGRATION-PLAN.md"/phase-numbering references with no corresponding file found | `frontend/src/pages/modules.tsx` and similar page comments | Locate or recreate the referenced plan, or remove the dangling reference. See [Blocking Item B-6](#6-blocking-items-assessment). |
| No CI/CD despite a real, passing test suite | `frontend/` (repo-wide — no `.github/` found) | Add lint + test + build workflow. See [Blocking Item B-2](#6-blocking-items-assessment). |

---

## 8. Explicit Non-Actions Taken This Phase

*The bullets below describe the original v1.0 baseline-writing pass, which was strictly read-only. v1.1 and v1.2
each authorized one narrow, explicitly-requested implementation step on top of that baseline (see Changelog) — this
is intentional, scoped follow-up work, not scope drift from the read-only constraint that produced the baseline
itself. The two bullets affected by that follow-up work are annotated below rather than silently left inaccurate.*

- **No source code was modified** in `react-template-main/`, `esaps_ai_template/`, or root `src/`, in any revision of
  this document. All verification of those three is read-only inspection throughout.
  - `frontend/` **was** modified, but only as of v1.1, under an explicit user request to fix Blocking Item B-1's
    frontend portion (RBAC route/permission enforcement) — see the v1.1 changelog entry for the exact file list.
  - `go-template-main/` **was** modified, but only as of v1.2, under an explicit user request to wire
    `middleware.RequireRole` onto `/samples`'s mutating routes as a reference example — see the v1.2 changelog
    entry.
- **Root `src/` was not deleted**, despite being confirmed a stray duplicate.
- **`esaps_ai_template/` was not deleted**, despite being superseded by `frontend/` as the active foundation.
- **No new business module, feature, or page was started.** The Migration Boundary Table above still records
  decisions (KEEP/EXTEND/REWRITE/DROP), not completed migrations — REWRITE and DROP-pending rows still have no
  corresponding code written. The RBAC and RequireRole follow-ups were infrastructure/enforcement fixes to
  already-existing code, not new business functionality.
- **No `@supabase/supabase-js` or other dependency was removed** from `esaps_ai_template/package.json`, despite the
  Technical Debt Log recommending review.
- **No real admin/user/role management API was created** in `go-template-main/` — `RequireRole` was wired onto the
  existing `/samples` CRUD group specifically because no admin-specific endpoint exists yet to wire it onto instead
  (see B-1's backend-wiring evidence above).

---

## Document Status

**Version:** 1.2 (Draft for Review — updated after backend RequireRole wiring)
**Status:** Draft — establishes baseline only; does not itself authorize any implementation, scaffolding, or PRD
change. Every `NEEDS_PRD_CONFIRMATION` item above requires a separate `/update-prd` session before being treated as
approved scope. This revision updates [Blocking Item B-1](#6-blocking-items-assessment) to reflect the
`go-template-main` `RequireRole` wiring; it does not resolve any `NEEDS_PRD_CONFIRMATION` item, does not authorize
building a real admin/user/role management API, and does not authorize starting any new business module.
**Depends on:** `RAISE-PRD.md` v0.4, `FRONTEND-CANDIDATE-COMPARISON.md`, `FRONTEND-RECOMMENDATION.md` (all as of
2026-08-21).
**Changelog:**
- v1.2 — Downgraded B-1's backend residual from HIGH to **MEDIUM**: `go-template-main/router/sampleRouter.go` now
  chains `middleware.RequireRole("admin")` in front of `/samples`'s mutating routes (`POST`/`PUT`/`DELETE`), leaving
  `GET` routes open to any authenticated role — applied as a reference example, since no real admin-specific
  endpoint exists yet in this template. Backed by a new regression test file,
  `go-template-main/middleware/requireRole_test.go` (3 cases, using the existing `BYPASS_JWT` test flags). `go build
  ./...` and `go test ./...` both verified passing after the change, including the pre-existing `controller` tests
  (which bypass `SetupRoutes`/this middleware entirely and were unaffected either way). The remaining gap is now a
  **missing capability** (no real admin/user/role API exists for `RequireRole` to protect), not an unenforced-
  authorization hole against something already exposed — hence the downgrade from HIGH.
- v1.1 — Marked B-1's frontend portion **RESOLVED**: `ProtectedRoute` now supports `allowedRoles`, `/administration/*`
  is restricted to `ADMIN`, a `/forbidden` page exists for authorized-but-insufficient-role users, and
  `RoleManagement`'s permission matrix now persists through `roleService` → `role-repository` (`RoleRepository`
  interface) → `MockRoleRepository`, backed by new regression tests (`App.rbac.test.tsx`,
  `role-service.test.ts`). Full suite (32 files / 102 tests), `tsc --noEmit`, `eslint`, and `vite build` all verified
  passing after the change. RBAC is therefore **not fully production-ready** — only the frontend gap that was
  blocking further frontend work is closed as of this version.
- v1.0 — Initial baseline (source priority, source map, migration boundary table, blocking items assessment as of
  the original comparison audit).
**Next Action:** Route the [NEEDS_PRD_CONFIRMATION log](#4-needs_prd_confirmation-log) items through business
confirmation, including item 5 (backend-enforced RBAC vs. UI-only matrix for MVP) which directly governs when a real
admin/user/role API — and therefore real `RequireRole` coverage beyond the `/samples` example — should be built.
Add CI (B-2) early in Phase-1 implementation. Frontend scaffolding/business-page work for `REWRITE`-status rows in
the Migration Boundary Table may proceed for actor-agnostic work; anything actor-differentiated should still wait on
a real backend admin API and PRD confirmation of the role model.
