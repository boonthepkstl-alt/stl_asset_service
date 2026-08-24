# RAISE — Project Timeline

**Purpose:** the project-level roadmap — ten capability phases spanning the
whole platform, each with its own scope, deliverables, dependencies, risks,
and status. This replaces this file's earlier chronological-PR-grouping
structure; for that level of detail (what merged, when), see
[`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md). For the current point-in-time
snapshot, see [`CURRENT-STATUS.md`](CURRENT-STATUS.md). For individual
shipped checkpoints with verification evidence, see
[`PROJECT-CHECKPOINTS.md`](PROJECT-CHECKPOINTS.md).

**Phase numbering reflects a dependency order, not a commitment to build
sequentially** — Phases 5, 6, 7, 9, and 10 are not scheduled and have no
target date, because the PRD hasn't confirmed the business rules they'd
need (see each phase's **Dependencies**/**Risks**). Phase order was chosen
so each phase's dependencies point only to lower-numbered phases.

**Maintenance rule:** update **Actual Start** / **Actual Completion** /
**Status** the moment a phase genuinely starts or finishes — never
backfill them to make a phase look further along than it is. **Target
Date** is a planning estimate; change it only when the phase is
deliberately re-planned, not retroactively to match what actually
happened. Every phase's **Checkpoint** row should link to a real entry in
`PROJECT-CHECKPOINTS.md` once one exists.

---

## Phase 1 — Foundation

| Field | |
|---|---|
| **Start Date** | 2026-08-21 |
| **Target Date** | — (foundation work is continuous, not a fixed-end phase) |
| **Actual Start** | 2026-08-21 |
| **Actual Completion** | Ongoing — baseline established, but the requirements chain remains living Drafts (`RAISE-PRD.md` v0.9, `RAISE-DESIGN.md` v0.8, …), re-synced as new information arrives |
| **Status** | 🟢 Baseline established |
| **Scope** | Audit both company templates (`go-template-main`, `react-template-main`); confirm what in `esaps_ai_template/`/root `src/` is KEEP/EXTEND/REFACTOR/REPLACE/DEFER/DO NOT USE; establish and iteratively sync the 7-stage requirements chain (PRD → Design → Prototype → AC → Test Plan → Test Cases → Traceability Matrix); fix template-level defects blocking real work. |
| **Deliverables** | `docs/company-foundation-baseline/`, `docs/go-template-analysis/`, `docs/template-analysis/`, `docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md`; the full `docs/01-requirements/` … `docs/07-traceability-matrix/` chain; `docs/08-architecture/`, `docs/09-api-db-spec/`, `docs/10-detailed-design/` (as-built technical docs); this `docs/project-management/` tracking layer. |
| **Dependencies** | None — this is the root phase. |
| **Risks** | The requirements chain is still Draft, not approved — every downstream phase inherits any future PRD revision. `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` scope overlap (finding **F-10**) has been raised twice without resolution and could force rework in Phases 3–4 if resolved differently than assumed. |
| **Checkpoint** | [PR #2](https://github.com/boonthepkstl-alt/stl_asset_service/pull/2), [#3](https://github.com/boonthepkstl-alt/stl_asset_service/pull/3), [#6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6), [#12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12), [#15](https://github.com/boonthepkstl-alt/stl_asset_service/pull/15) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 2 — Authentication / RBAC

| Field | |
|---|---|
| **Start Date** | 2026-08-21 |
| **Target Date** | — (MVP-scoped slice only; full RBAC has no target, see Scope) |
| **Actual Start** | 2026-08-21 |
| **Actual Completion** | 2026-08-23 (demo-auth slice only) |
| **Status** | 🟡 MVP slice complete · full RBAC intentionally out of MVP scope |
| **Scope** | **In MVP:** a working login flow against a real backend (`POST /auth/login`), token issuance, and the `RequireRole` middleware pattern demonstrated on the template's reference routes. **Confirmed out of MVP scope** (PRD §16 Resolved Question 38): backend RBAC enforcement on real RAISE domains, a real user/role data model, and any UI beyond a single demo login. |
| **Deliverables** | `go-template-main/service/authService.go` (demo credential check, JWT issuance), `middleware/jwtAuth.go`, `middleware/requireRole.go` (wired only to the template's demo `/samples` routes); frontend `auth-service.ts` + split-panel Login page. |
| **Dependencies** | Phase 1 (backend/frontend scaffolding must exist first). |
| **Risks** | **F-11/F-12** (accepted, not hidden): there is no real user store and no RAISE domain is RBAC-gated — this is fine for MVP per the PRD's own decision, but would be a real security gap if anyone assumed otherwise before Roadmap work happens. Auth mechanism and role/permission matrix content are still open (PRD §16 Q21–Q22), so a future "real" RBAC phase cannot start from this phase's code as-is — it can only reuse the pattern, not the demo data. |
| **Checkpoint** | [PR #1](https://github.com/boonthepkstl-alt/stl_asset_service/pull/1), [#5](https://github.com/boonthepkstl-alt/stl_asset_service/pull/5), [#10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 3 — Asset Management

| Field | |
|---|---|
| **Start Date** | 2026-08-22 |
| **Target Date** | — (in progress; no committed end date) |
| **Actual Start** | 2026-08-22 |
| **Actual Completion** | Not complete — Asset Registry and Assign/Check-in are done; Category & Hierarchy and full Custody History are partial |
| **Status** | 🟡 Core complete, extensions partial |
| **Scope** | Asset Registry CRUD (`RAISE-FR-ASSET-001`); Category & Hierarchy (`RAISE-FR-ASSET-002`); Custody History (`RAISE-FR-ASSET-003`) via Assign/Check-in (`RAISE-FR-OPS-002`, partial); Warranty as an Asset field (`RAISE-FR-WARRANTY-001`'s only confirmed field, `warrantyExpiry`); QR/Barcode (`RAISE-FR-OPS-001`, not started). |
| **Deliverables** | `go-template-main` Asset domain (model/repository/service/controller), `sql/pg/V1__Assets_Table.sql`; Employee domain supporting custody (`sql/pg/V2__Employees_Table.sql`); frontend `HttpAssetRepository`/`HttpEmployeeRepository` behind feature flags; real Assign/Check-in UI on Asset Detail. |
| **Dependencies** | Phase 1 (chain + scaffolding); loosely Phase 2 (custody/transfer permission model is still undecided, see Risks). |
| **Risks** | Holder data model undefined (PRD §16 Q13) — **F-02**; category/hierarchy taxonomy undefined — traceability matrix `TC-ASSET-002-01` partial; QR/Barcode has no listed blocker and is the next natural checkpoint but is not yet started. |
| **Checkpoint** | [PR #7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7), [#8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8), [#9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9), [#13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 4 — ITSM (IT Service Management / Maintenance)

| Field | |
|---|---|
| **Start Date** | 2026-08-24 |
| **Target Date** | — (core shipped; extensions unscheduled) |
| **Actual Start** | 2026-08-24 |
| **Actual Completion** | 2026-08-24 (confirmed 4-stage workflow only) |
| **Status** | 🟢 Core complete · extensions deferred |
| **Scope** | The confirmed 4-stage ticket workflow (`RAISE-FR-MAINT-001`): User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution. **Deliberately excluded**: SLA-per-stage rules, vendor model, cost model, delegated-approver *configuration* management, `changeAsset`/`changeRequester` admin utilities — none are in the confirmed AC set. |
| **Deliverables** | `go-template-main` Ticket domain (JSONB-document storage + denormalized filter columns), `sql/pg/V3__Tickets_Table.sql`; frontend `HttpTicketRepository` behind a feature flag; full approval/dispatch/execution-status UI reuse (already-built pages wired to the real API). |
| **Dependencies** | Phase 3 (a ticket snapshots an Asset and an Employee at creation time — one-way dependency, resolved server-side). |
| **Risks** | SLA/vendor/cost model and delegated-approver configuration remain TBD — any real operational use of Maintenance is limited until those land; RBAC role-gate content for approval/dispatch actions is also TBD (shared with Phase 2's open item). |
| **Checkpoint** | [PR #11](https://github.com/boonthepkstl-alt/stl_asset_service/pull/11) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 5 — License Management

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — confirmed Roadmap, not MVP |
| **Scope** | `RAISE-FR-LICENSE-001` (Software / SaaS License Management) is confirmed **Roadmap-only** (PRD §16 Resolved Question 34, 2026-08-21). No backend work is planned under current scope. The frontend already has mock-only License pages (ported from the ESAPS reference) gated behind `ROADMAP_FEATURES_ENABLED`, visible for demo purposes only. |
| **Deliverables** | None planned. Existing: `frontend/src/pages/Licenses/`, `LicenseDetail/` (mock-only, flag-gated). |
| **Dependencies** | Would depend on Phase 3 (license seats bind to Assets/Employees) if promoted to MVP. |
| **Risks** | Highest risk here is **scope creep**, not technical difficulty — the UI already exists and looks finished, which invites building a backend for it without a PRD scope change. Per the traceability matrix's own rule: promoting this to MVP means re-entering the chain at `RAISE-PRD.md` first, not skipping straight to a backend PR. |
| **Checkpoint** | None yet — not started. |

## Phase 6 — Audit & Reconciliation

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — blocked on open PRD questions |
| **Scope** | Immutable Audit Log (`RAISE-FR-AUDIT-001`) and Oracle FA Integration + reconciliation (`RAISE-FR-ORACLE-001`), both confirmed MVP/P0 but with substantial open detail. |
| **Deliverables** | None yet. A scoped-down first cut is plausible without inventing anything: an append-only log of mutations that already happen (asset create/assign/check-in, ticket create/approve/dispatch/status) — see `CURRENT-STATUS.md` §4. |
| **Dependencies** | Phase 3 and Phase 4 (there must be real mutations to audit before an audit log is meaningful). |
| **Risks** | Audit event taxonomy undefined (Design §15) — **finding tracked in `OPEN-FINDINGS.md`**; Oracle integration method/mapping/sync/security are all TBD (PRD §16 Q6–Q10) and represent this project's largest single external-dependency risk — the "Phase 6" label on the existing `ReconciliationPage` code comment was confirmed **not** a real PRD phase (Resolved Q37), so this numbering is coincidental, not inherited from that comment. |
| **Checkpoint** | None yet — not started. |

## Phase 7 — Alerts & Notifications

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — blocked on open PRD questions |
| **Scope** | `RAISE-FR-ALERT-001` — surfacing conditions like approaching warranty expiry or maintenance SLA breach to an "authorized user." Trigger rules and delivery channels are undefined; multi-channel delivery (Email/Teams/LINE) is confirmed Roadmap, not MVP. |
| **Deliverables** | None yet. |
| **Dependencies** | Phase 3 (Warranty data) and Phase 4 (Maintenance SLA data) — Alerts has no data of its own to watch until those exist. |
| **Risks** | Trigger-rule thresholds are unconfirmed — building this before Phase 3/4's own TBDs (warranty field list, SLA model) resolve risks building alerts against data shapes that later change. Role gate for who receives alerts shares the same open question as Phases 2/4. |
| **Checkpoint** | None yet — not started. |

## Phase 8 — Executive Dashboard & Reporting

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started as a backend — a client-computed mock version already exists |
| **Scope** | `RAISE-FR-EXEC-001` — KPI tiles (NBV, Risk, Utilization, etc.), acquisitions/retirements trend, department/type distribution. Utilization's *presence and description* are confirmed (PRD §16 Resolved Q27); its *calculation mechanics* and the NBV/Risk formulas are not (Q3–Q4, Resolved Q29 partial). |
| **Deliverables** | Existing (mock-only): `frontend/src/services/dashboard-service.ts`, `pages/Dashboard/`. A scoped-down first cut could move the already-real KPI computations to backend query endpoints without inventing the still-TBD formulas — see `CURRENT-STATUS.md` §4. |
| **Dependencies** | Phase 3 (asset data), Phase 5 (license count KPI), Phase 6 (Oracle-sourced NBV, if that's the intended source). |
| **Risks** | Building real formulas here before Phase 6's Oracle integration lands risks a KPI that has to be recalculated once real financial data is wired in. |
| **Checkpoint** | None yet — not started. |

## Phase 9 — AI Document Intelligence & Search

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — fully blocked |
| **Scope** | Natural Language Search (`RAISE-AI-SEARCH-001`) and Document Intelligence — OCR (`RAISE-AI-DOC-001`), Metadata extraction (`-002`), Classification (`-003`), Duplicate Detection (`-004`). All confirmed MVP/Current-AI tier by scope, but every acceptance criterion is `BLOCKED (full)` in the traceability matrix — confidence thresholds, field lists, and matching rules are undefined. |
| **Deliverables** | None yet. |
| **Dependencies** | Phase 3 (assets/documents to search and extract from). |
| **Risks** | Duplicate Detection's matching threshold and merge-vs-flag workflow were explicitly asked of the business on 2026-08-21 and left unanswered (PRD §16 Open Question 20a) — this is the most concretely stalled item in the entire backlog, not merely unprioritized. |
| **Checkpoint** | None yet — not started. |

## Phase 10 — AI Advanced (Roadmap Tier)

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — confirmed Roadmap/Pilot, not MVP |
| **Scope** | Risk Scoring (`RAISE-AI-RISK-001`, Pilot), Lifecycle Prediction (`RAISE-AI-LIFECYCLE-001`, Pilot), AI Recommendation / AI Decision Center (`RAISE-AI-RECOMMEND-001`, Roadmap, re-confirmed with **no MVP subset**). Concept-level design only exists (`RAISE-DESIGN.md` §10–§12); no Prototype screen, AC, Suite, or Test Case exists for any of the three, by design. |
| **Deliverables** | None planned under current scope. Existing: `frontend/src/pages/AIDecisionCenter/` (mock-only, flag-gated). |
| **Dependencies** | Would depend on Phases 8–9 (dashboard + document intelligence data) if promoted to MVP. |
| **Risks** | Same scope-creep risk as Phase 5 — the AI Decision Center UI already exists and is visually complete, which is exactly the condition that produces pressure to build a backend for it without a PRD scope change. |
| **Checkpoint** | None yet — not started. |

---

## Legend

🟢 Complete for current scope · 🟡 Partially complete / MVP slice only · ⚪ Not started

*Status reflects the phase's own confirmed scope, not the full ambition of the requirement — a 🟢 phase can still have open Roadmap-tier extensions (see each phase's Risks).*
