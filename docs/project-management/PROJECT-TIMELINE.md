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
| **Checkpoint** | [PR #2](https://github.com/boonthepkstl-alt/stl_asset_service/pull/2), [#3](https://github.com/boonthepkstl-alt/stl_asset_service/pull/3), [#6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6), [#12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12), [#15](https://github.com/boonthepkstl-alt/stl_asset_service/pull/15), [#18](https://github.com/boonthepkstl-alt/stl_asset_service/pull/18) (checkpoint template), [#19](https://github.com/boonthepkstl-alt/stl_asset_service/pull/19) (CLAUDE.md refresh), [#20](https://github.com/boonthepkstl-alt/stl_asset_service/pull/20) (close-out protocol rule), [#21](https://github.com/boonthepkstl-alt/stl_asset_service/pull/21) (baseline checkpoint), [#22](https://github.com/boonthepkstl-alt/stl_asset_service/pull/22) (next-step protocol) — see `PROJECT-CHECKPOINTS.md`. |

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
| **Risks** | **F-11/F-12** (accepted, not hidden): there is no real user store and no RAISE domain is RBAC-gated — this is fine for MVP per the PRD's own decision, but would be a real security gap if anyone assumed otherwise before Roadmap work happens. Auth mechanism and role/permission matrix content are still open (PRD §16 Q21–Q22), so a future "real" RBAC phase cannot start from this phase's code as-is — it can only reuse the pattern, not the demo data. `TS-LOGIN`'s formal execution ran 2026-08-29: `TC-LOGIN-03` (access-denied for an unauthorized area) **passed**; `TC-LOGIN-01`/`-02` (valid/invalid login) are **BLOCKED** for a distinct, new reason — `auth-service.ts` has no mock fallback and no backend/database is reachable in this dev environment (**F-30**), separate from the pre-existing PRD-content block. |
| **Checkpoint** | [PR #1](https://github.com/boonthepkstl-alt/stl_asset_service/pull/1), [#5](https://github.com/boonthepkstl-alt/stl_asset_service/pull/5), [#10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10), [#23](https://github.com/boonthepkstl-alt/stl_asset_service/pull/23) (generic brand proposal applied), [#24](https://github.com/boonthepkstl-alt/stl_asset_service/pull/24) (re-themed to confirmed Singer CI), [#26](https://github.com/boonthepkstl-alt/stl_asset_service/pull/26) (panel reverted blue per feedback), [#48](https://github.com/boonthepkstl-alt/stl_asset_service/pull/48) (TS-LOGIN test execution) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 3 — Asset Management

| Field | |
|---|---|
| **Start Date** | 2026-08-22 |
| **Target Date** | — (in progress; no committed end date) |
| **Actual Start** | 2026-08-22 |
| **Actual Completion** | Not complete — Asset Registry, Assign/Check-in, and QR/Barcode are done; Category & Hierarchy and full Custody History are partial |
| **Status** | 🟡 Core complete, extensions partial |
| **Scope** | Asset Registry CRUD (`RAISE-FR-ASSET-001`); Category & Hierarchy (`RAISE-FR-ASSET-002`); Custody History (`RAISE-FR-ASSET-003`) via Assign/Check-in (`RAISE-FR-OPS-002`, partial); Warranty as an Asset field (`RAISE-FR-WARRANTY-001`'s only confirmed field, `warrantyExpiry`); QR/Barcode (`RAISE-FR-OPS-001`, ✅ built PR #29). |
| **Deliverables** | `go-template-main` Asset domain (model/repository/service/controller), `sql/pg/V1__Assets_Table.sql`; Employee domain supporting custody (`sql/pg/V2__Employees_Table.sql`); frontend `HttpAssetRepository`/`HttpEmployeeRepository` behind feature flags; real Assign/Check-in UI on Asset Detail; real QR generation + Scan QR lookup-and-navigate flow (`AssetQrCode`, `lib/qr.ts`), dual id/code lookup on both the mock repository and backend SQL. |
| **Dependencies** | Phase 1 (chain + scaffolding); loosely Phase 2 (custody/transfer permission model is still undecided, see Risks). |
| **Risks** | Holder data model undefined (PRD §16 Q13) — **F-02**; category/hierarchy taxonomy undefined — traceability matrix `TC-ASSET-002-01` partial. QR/Barcode's formal `TC-OPS-001-01..03` execution ran 2026-08-26 (2 of 3 passed, `TC-OPS-001-03` failed) — the invalid-code gap it found (**F-21**) was fixed the same day; all three now pass. Asset Registry/Detail/Category/Custody's formal `TC-ASSET-001/-002/-003` execution also ran 2026-08-26, finding 4 new defects (F-23 through F-26); F-23 (no Category filter) was fixed the same day, and F-24 (Asset Detail missing Financial/Lifecycle sections) was fixed 2026-08-27 — `RAISE-FR-ASSET-001` now passes all 6 of its test cases. A `/code-review` pass on the F-24 fix found 2 quality issues (a misleading dead-click affordance on 2 Lifecycle rows, and a 3x-duplicated date computation), both fixed same-day (PR #41) with no behavior regressions. F-26 (Custody History not append-only) was also fixed 2026-08-27 — Asset Detail's History tab now renders from the same audit trail `RAISE-FR-AUDIT-001` already builds, append-only by construction — `RAISE-FR-ASSET-003` now passes all 3 of its test cases. F-25 (no Category & Hierarchy screen) was fixed 2026-08-28 with a scoped-down first cut showing each category's real assets — `RAISE-FR-ASSET-002` now passes `TC-ASSET-002-01` (scoped); the illustrative sub-category taxonomy remains explicitly out of scope, tracked as new finding **F-27**. Initially shipped as a standalone `/categories` page, then folded into Asset Management as a "By Category" tab the same day per user feedback that a dedicated sidebar destination was disproportionate for a secondary view of the same asset data. All 4 defects from this sweep (F-23 through F-26) are now resolved; F-22 (Executive Dashboard scope question) and F-27 are the only items remaining from either 2026-08-26 sweep. A third sweep (2026-08-28) formally executed `TS-OPS-002` (Check-in/Check-out) — all 3 cases passed; `RAISE-FR-OPS-002` now passes formally for the first time (previously only a pre-code-era `BLOCKED` guess). Separately, **F-01** (Warranty field list, PRD §16 Q15) — the longest-standing uncompleted business-decision request this session — was resolved 2026-08-29: user confirmed `warrantyExpiry` is the only MVP field, propagated through the full deliverable chain (PRD §16 Resolved Question 40, Design §5.2, Prototype P-010, AC-WARRANTY-001, TS-WARRANTY-001, TC-WARRANTY-001-01/-02, Traceability Matrix Gap 7). Per explicit user direction ("don't build a page, add it to the relevant asset page instead"), this was implemented same-day as a "Warranty" column on the Assets Registry list (expiry date + Active/Expired badge, sortable) rather than a standalone P-010 screen — `RAISE-FR-WARRANTY-001` now passes `TC-WARRANTY-001-01/-02`. `AC-WARRANTY-001-03`'s separate 90-day-window question (and the "Expiring" 3rd state it would gate) remains open. |
| **Checkpoint** | [PR #7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7), [#8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8), [#9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9), [#13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13), [#29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29), [#49](https://github.com/boonthepkstl-alt/stl_asset_service/pull/49) (Warranty field-list resolution), [#50](https://github.com/boonthepkstl-alt/stl_asset_service/pull/50) (Warranty Asset Registry column) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 4 — ITSM (IT Service Management / Maintenance)

| Field | |
|---|---|
| **Start Date** | 2026-08-24 |
| **Target Date** | — (core shipped; extensions unscheduled) |
| **Actual Start** | 2026-08-24 |
| **Actual Completion** | 2026-08-24 (confirmed 4-stage workflow only) |
| **Status** | 🟢 Core complete, formally test-executed — all 9 test cases pass |
| **Scope** | The confirmed 4-stage ticket workflow (`RAISE-FR-MAINT-001`): User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution. **Deliberately excluded**: SLA-per-stage rules, vendor model, cost model, delegated-approver *configuration* management, `changeAsset`/`changeRequester` admin utilities — none are in the confirmed AC set. |
| **Deliverables** | `go-template-main` Ticket domain (JSONB-document storage + denormalized filter columns), `sql/pg/V3__Tickets_Table.sql`; frontend `HttpTicketRepository` behind a feature flag; full approval/dispatch/execution-status UI reuse (already-built pages wired to the real API). |
| **Dependencies** | Phase 3 (a ticket snapshots an Asset and an Employee at creation time — one-way dependency, resolved server-side). |
| **Risks** | SLA/vendor/cost model and delegated-approver configuration remain TBD — any real operational use of Maintenance is limited until those land; RBAC role-gate content for approval/dispatch actions is also TBD (shared with Phase 2's open item). `TS-MAINT-001`'s formal execution ran 2026-08-28 (7 of 9 cases initially passed) — all 4 stage transitions (submit/approve/reject/dispatch/status-update/complete) work correctly. F-28 (record list missing date/cost fields) was fixed the same day — the list now shows both, preferring actual cost over the dispatch-time estimate, with an honest "—" before dispatch — `RAISE-FR-MAINT-001` now passes 8 of 9 cases. F-29 (stage-progress indicator doesn't distinguish Current from Pending) was also fixed the same day — the current stage is now derived from `ticket.status` and rendered with a distinct brand-colored circle and "Current" badge — `RAISE-FR-MAINT-001` now passes all 9 test cases, and `RAISE-FR-OPS-002` (3/3) also passes formally for the first time. Both third-sweep findings are now resolved. |
| **Checkpoint** | [PR #11](https://github.com/boonthepkstl-alt/stl_asset_service/pull/11), [#45](https://github.com/boonthepkstl-alt/stl_asset_service/pull/45), [#46](https://github.com/boonthepkstl-alt/stl_asset_service/pull/46), [#47](https://github.com/boonthepkstl-alt/stl_asset_service/pull/47) — see `PROJECT-CHECKPOINTS.md`. |

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
| **Start Date** | 2026-08-25 (Audit Log first cut only; Oracle FA Integration not started) |
| **Target Date** | Not scheduled |
| **Actual Start** | 2026-08-25 |
| **Actual Completion** | Not complete — Audit Log now covers both Asset and Ticket domains; Oracle FA Integration remains not started |
| **Status** | 🟡 Audit Log shipped (Asset + Ticket domains) · Oracle FA Integration not started |
| **Scope** | Immutable Audit Log (`RAISE-FR-AUDIT-001`) and Oracle FA Integration + reconciliation (`RAISE-FR-ORACLE-001`), both confirmed MVP/P0 but with substantial open detail. |
| **Deliverables** | `go-template-main` Audit domain (model/repository/service/controller, `sql/pg/V4__Audit_Table.sql`), read-only `GET /audit-logs`; recording wired into Asset create/assign/check-in (PR #31) and Ticket create/approve/dispatch/status-update (PR #35); frontend `HttpAuditRepository`/`MockAuditRepository` behind a feature flag; Asset Detail's "Audit" tab shows real entries (no dedicated Ticket-side viewing surface yet — entries are recorded, not yet displayed anywhere for tickets). |
| **Dependencies** | Phase 3 and Phase 4 (there must be real mutations to audit before an audit log is meaningful) — both satisfied. |
| **Risks** | Audit event taxonomy undefined (Design §15) — **finding tracked in `OPEN-FINDINGS.md`**; the audit-review role gate is undefined (PRD §16 Q22), so `GET /audit-logs` has no RequireRole gate for MVP; `TC-AUDIT-001-01`/`-03` remain partial in the traceability matrix pending those two answers. Oracle integration method/mapping/sync/security are all TBD (PRD §16 Q6–Q10, **F-04**) and represent this project's largest single external-dependency risk — the "Phase 6" label on the existing `ReconciliationPage` code comment was confirmed **not** a real PRD phase (Resolved Q37), so this numbering is coincidental, not inherited from that comment. Formal test execution (`TC-ORACLE-001-01..04`, 2026-08-29) confirms a second, independent gap: the route mapped to `RAISE-FR-ORACLE-001` (`/reconciliation`) renders a generic unbuilt placeholder, not an actual Financial View screen matching Prototype P-011 — tracked as **F-31**, distinct from F-04's integration-mechanism question. |
| **Checkpoint** | [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31), [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35); `CHECKPOINT-2026-08-29-005` (`TS-ORACLE-001` sweep, docs-only, new finding F-31) — see `PROJECT-CHECKPOINTS.md`. Oracle FA Integration: none yet — not started. |

## Phase 7 — Alerts & Notifications

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — blocked on open PRD questions. Formal test execution confirms the gap is worse than "not started": no placeholder exists at all |
| **Scope** | `RAISE-FR-ALERT-001` — surfacing conditions like approaching warranty expiry or maintenance SLA breach to an "authorized user." Trigger rules and delivery channels are undefined; multi-channel delivery (Email/Teams/LINE) is confirmed Roadmap, not MVP. |
| **Deliverables** | None yet. |
| **Dependencies** | Phase 3 (Warranty data) and Phase 4 (Maintenance SLA data) — Alerts has no data of its own to watch until those exist. |
| **Risks** | Trigger-rule thresholds are unconfirmed — building this before Phase 3/4's own TBDs (warranty field list, SLA model) resolve risks building alerts against data shapes that later change. Role gate for who receives alerts shares the same open question as Phases 2/4. Formal test execution (`TC-ALERT-001-01/-02`, 2026-08-29) confirms a second, independent gap: the sidebar "Notification Center" route (`/notifications`) renders the app's generic 404 page — not even a `ModulePage`-style placeholder like Oracle FA (Phase 6) has — and the header bell-icon dropdown is hardcoded empty. Tracked as **F-32**, distinct from F-05's trigger-rule question. |
| **Checkpoint** | `CHECKPOINT-2026-08-29-006` (`TS-ALERT-001` sweep, docs-only, new finding F-32) — see `PROJECT-CHECKPOINTS.md`. Otherwise none yet — not started. |

## Phase 8 — Executive Dashboard & Reporting

| Field | |
|---|---|
| **Start Date** | 2026-08-25 |
| **Target Date** | Not scheduled |
| **Actual Start** | 2026-08-25 |
| **Actual Completion** | Not complete — the plain-count KPI tiles (status counts, expired warranty, department/type distribution) moved to a real backend endpoint; NBV/Risk/Utilization-mechanics tiles, the trend chart, and Monthly Depreciation/Cost remain client-side/static, unchanged |
| **Status** | 🟡 Plain-count KPI backend shipped · NBV/Risk formulas still not started (blocked) |
| **Scope** | `RAISE-FR-EXEC-001` — KPI tiles (NBV, Risk, Utilization, etc.), acquisitions/retirements trend, department/type distribution. Utilization's *presence and description* are confirmed (PRD §16 Resolved Q27); its *calculation mechanics* and the NBV/Risk formulas are not (Q3–Q4, Resolved Q29 partial). |
| **Deliverables** | `go-template-main` Dashboard domain (model/service/controller, `GET /dashboard/stats`, no new table — composes over the existing Asset domain); frontend `HttpDashboardRepository`/`MockDashboardRepository` behind a new `DASHBOARD_API_ENABLED` flag. Deliberately excludes Software License count (no backend License table — Roadmap-only) and every NBV/Risk/Utilization-mechanics figure (still PRD §16 Q3/Q4/Q29 TBD) — those remain exactly as they were (static illustrative content or Mock-only), not silently approximated. |
| **Dependencies** | Phase 3 (asset data) — satisfied. Phase 5 (license count KPI), Phase 6 (Oracle-sourced NBV) remain dependencies for the *not-yet-built* half of this phase. |
| **Risks** | Building real NBV/Risk formulas here before Phase 6's Oracle integration lands still risks a KPI that has to be recalculated once real financial data is wired in — unchanged risk, not yet triggered since this cut didn't touch those tiles. Formal test execution (`TC-EXEC-001`, 2026-08-26, and `TC-DASH-01..03`, 2026-08-29) confirms a second, independent gap: the built page's tile/section names don't match Prototype P-002/P-014 at all — tracked as **F-22**, a scope-reconciliation question, not a defect to fix by more code. |
| **Checkpoint** | [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33); `CHECKPOINT-2026-08-29-004` (`TS-DASH` sweep, docs-only, broadens F-22) — see `PROJECT-CHECKPOINTS.md`. |

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

## Cross-Cutting Work (not tied to one phase)

Some checkpoints touch the whole platform rather than one phase's own
deliverable, so forcing them into a single phase row would misrepresent
their scope. Tracked here instead:

| Checkpoint | What it touched | Why it's cross-cutting |
|---|---|---|
| [PR #25](https://github.com/boonthepkstl-alt/stl_asset_service/pull/25) | Singer CI logo mark extended from Login into the shared `AppShell` sidebar | Affects every authenticated page (Dashboard, Assets, Employees, Tickets, …), not one phase's deliverable |
| [PR #27](https://github.com/boonthepkstl-alt/stl_asset_service/pull/27) | Singer CI red accent added to the Dashboard "Software Licenses" KPI card | Visual-identity change only, not the backend KPI/formula work Phase 8 actually scopes — doesn't belong in Phase 8's Deliverables |

Business confirmation that enabled all of the branding checkpoints above
(PR #23, #24, #26, #25, #27): **RAISE is developed for direct use by
Singer (Thailand)** — `RAISE-PRD.md` §16 Resolved Question 39 (v0.10, see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md)). This is a
branding/identity fact, not a functional-scope change to any phase above.

---

## Legend

🟢 Complete for current scope · 🟡 Partially complete / MVP slice only · ⚪ Not started

*Status reflects the phase's own confirmed scope, not the full ambition of the requirement — a 🟢 phase can still have open Roadmap-tier extensions (see each phase's Risks).*
