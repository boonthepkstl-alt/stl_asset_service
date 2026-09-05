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
| **Risks** | The requirements chain is still Draft, not approved — every downstream phase inherits any future PRD revision. `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` scope overlap (finding **F-10**) has been raised twice without resolution and could force rework in Phases 3–4 if resolved differently than assumed. **Mitigated 2026-09-04:** the risk that a session's mandatory validation step is skipped or passes only on one machine is now covered by CI (PR #89) — which demonstrated the risk was real by catching a pre-existing flake (**F-40**) that 88 PRs of local-only verification had missed. |
| **Checkpoint** | [PR #2](https://github.com/boonthepkstl-alt/stl_asset_service/pull/2), [#3](https://github.com/boonthepkstl-alt/stl_asset_service/pull/3), [#6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6), [#12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12), [#15](https://github.com/boonthepkstl-alt/stl_asset_service/pull/15), [#18](https://github.com/boonthepkstl-alt/stl_asset_service/pull/18) (checkpoint template), [#19](https://github.com/boonthepkstl-alt/stl_asset_service/pull/19) (CLAUDE.md refresh), [#20](https://github.com/boonthepkstl-alt/stl_asset_service/pull/20) (close-out protocol rule), [#21](https://github.com/boonthepkstl-alt/stl_asset_service/pull/21) (baseline checkpoint), [#22](https://github.com/boonthepkstl-alt/stl_asset_service/pull/22) (next-step protocol), [#89](https://github.com/boonthepkstl-alt/stl_asset_service/pull/89) (**first CI pipeline** — GitHub Actions running both stacks' checks on every PR and push to `main`; closes **F-14** as **R-20**, verified green on `main` itself, run `33843149477`) — see `PROJECT-CHECKPOINTS.md`. **No phase Status or Actual date changed for PR #89.** This is infrastructure/process inside Phase 1's continuous scope: it automates validation of work already delivered, and delivers no product capability, no `RAISE-FR-*` coverage and no traceability-matrix movement (the matrix stays at v1.8, all 15 gaps closed). [#91](https://github.com/boonthepkstl-alt/stl_asset_service/pull/91) (route-level code splitting — entry chunk 694 KiB → 305 KiB, closes **F-18** as **R-21**) is recorded here on the same basis and with the same caveat: **no phase Status or Actual date changed for it either.** [#93](https://github.com/boonthepkstl-alt/stl_asset_service/pull/93) (raw Go error text removed from all 5xx response bodies, closes **F-19** as **R-22**) joins them on the same basis and with the same caveat: **no phase Status or Actual date changed for it either.** #89, #91 and #93 are engineering debt, not product capability — neither advances a `RAISE-FR-*`, an acceptance criterion, or traceability coverage. The Foundation phase's own gate is **still not passed** for the reasons recorded in `PHASE-CHECKPOINT-1` — the requirements chain remains Draft and **F-10** is unresolved — and CI does not affect either. |

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
| **Risks** | **F-11/F-12** (accepted, not hidden): there is no real user store and no RAISE domain is RBAC-gated — this is fine for MVP per the PRD's own decision, but would be a real security gap if anyone assumed otherwise before Roadmap work happens. Auth mechanism and role/permission matrix content are still open (PRD §16 Q21–Q22), so a future "real" RBAC phase cannot start from this phase's code as-is — it can only reuse the pattern, not the demo data. `TS-LOGIN`'s formal execution ran 2026-08-29: `TC-LOGIN-03` (access-denied for an unauthorized area) **passed**; `TC-LOGIN-01`/`-02` (valid/invalid login) were **BLOCKED** for a distinct, new reason — `auth-service.ts` had no mock fallback and no backend/database was reachable in this dev environment (**F-30**), separate from the pre-existing PRD-content block. **Resolved 2026-09-01**: per confirmed business decision, added a `MockAuthRepository` (4 demo accounts, one per `Role`) gated by a new `AUTH_API_ENABLED` flag, mirroring every other domain's Mock/Http pattern. Re-executed against the real Login UI: `TC-LOGIN-01`/`-02` now **PASS**. This closes the infrastructure/testability gap only — the PRD-content question (auth mechanism/role-matrix, PRD §16 Q21–Q22) remains open, unaffected. |
| **Checkpoint** | [PR #1](https://github.com/boonthepkstl-alt/stl_asset_service/pull/1), [#5](https://github.com/boonthepkstl-alt/stl_asset_service/pull/5), [#10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10), [#23](https://github.com/boonthepkstl-alt/stl_asset_service/pull/23) (generic brand proposal applied), [#24](https://github.com/boonthepkstl-alt/stl_asset_service/pull/24) (re-themed to confirmed Singer CI), [#26](https://github.com/boonthepkstl-alt/stl_asset_service/pull/26) (panel reverted blue per feedback), [#48](https://github.com/boonthepkstl-alt/stl_asset_service/pull/48) (TS-LOGIN test execution), [#59](https://github.com/boonthepkstl-alt/stl_asset_service/pull/59) (F-30 Mock auth fallback) — see `PROJECT-CHECKPOINTS.md`. |

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
| **Risks** | Holder data model undefined (PRD §16 Q13) — **F-02**; category/hierarchy taxonomy undefined — traceability matrix `TC-ASSET-002-01` partial. QR/Barcode's formal `TC-OPS-001-01..03` execution ran 2026-08-26 (2 of 3 passed, `TC-OPS-001-03` failed) — the invalid-code gap it found (**F-21**) was fixed the same day; all three now pass. Asset Registry/Detail/Category/Custody's formal `TC-ASSET-001/-002/-003` execution also ran 2026-08-26, finding 4 new defects (F-23 through F-26); F-23 (no Category filter) was fixed the same day, and F-24 (Asset Detail missing Financial/Lifecycle sections) was fixed 2026-08-27 — `RAISE-FR-ASSET-001` now passes all 6 of its test cases. A `/code-review` pass on the F-24 fix found 2 quality issues (a misleading dead-click affordance on 2 Lifecycle rows, and a 3x-duplicated date computation), both fixed same-day (PR #41) with no behavior regressions. F-26 (Custody History not append-only) was also fixed 2026-08-27 — Asset Detail's History tab now renders from the same audit trail `RAISE-FR-AUDIT-001` already builds, append-only by construction — `RAISE-FR-ASSET-003` now passes all 3 of its test cases. F-25 (no Category & Hierarchy screen) was fixed 2026-08-28 with a scoped-down first cut showing each category's real assets — `RAISE-FR-ASSET-002` now passes `TC-ASSET-002-01` (scoped); the illustrative sub-category taxonomy remains explicitly out of scope, tracked as new finding **F-27**. Initially shipped as a standalone `/categories` page, then folded into Asset Management as a "By Category" tab the same day per user feedback that a dedicated sidebar destination was disproportionate for a secondary view of the same asset data. All 4 defects from this sweep (F-23 through F-26) are now resolved; F-22 (Executive Dashboard scope question) and F-27 are the only items remaining from either 2026-08-26 sweep. A third sweep (2026-08-28) formally executed `TS-OPS-002` (Check-in/Check-out) — all 3 cases passed; `RAISE-FR-OPS-002` now passes formally for the first time (previously only a pre-code-era `BLOCKED` guess). Separately, **F-01** (Warranty field list, PRD §16 Q15) — the longest-standing uncompleted business-decision request this session — was resolved 2026-08-29: user confirmed `warrantyExpiry` is the only MVP field, propagated through the full deliverable chain (PRD §16 Resolved Question 40, Design §5.2, Prototype P-010, AC-WARRANTY-001, TS-WARRANTY-001, TC-WARRANTY-001-01/-02, Traceability Matrix Gap 7). Per explicit user direction ("don't build a page, add it to the relevant asset page instead"), this was implemented same-day as a "Warranty" column on the Assets Registry list (expiry date + Active/Expired badge, sortable) rather than a standalone P-010 screen — `RAISE-FR-WARRANTY-001` now passes `TC-WARRANTY-001-01/-02`. `AC-WARRANTY-001-03`'s separate 90-day-window question (and the "Expiring" 3rd state it would gate) remains open. **F-27 (Category sub-taxonomy) resolved 2026-09-01**: per confirmed business decision, sub-category is the Asset's existing `type` field (2-level Category → Type → assets, no new field/data model) — propagated through Prototype P-005 (v0.9), AC-ASSET-002 (v0.8, new AC-ASSET-002-03), Test Plan/Test Cases (v0.8/v0.9), then implemented the same day (the "By Category" view extended one level deeper) and re-executed against the real app — all cases PASS. `RAISE-TRACEABILITY-MATRIX.md` reaches **v1.0** (Gap 9 closed, the last open gap). **Warranty "Expiring" threshold (R-17) resolved 2026-09-01**: `AC-WARRANTY-001-03`'s 90-day figure was only the PRD's illustrative Business Example, never a confirmed rule. Per confirmed business decision, the threshold is per-Asset-Category configurable (not a single global constant, since different equipment categories carry different warranty periods), defaulting to 90 days for all 5 current categories, admin-adjustable via a new Settings screen (P-018). Recorded as PRD §16 Resolved Question 41 and propagated through the full chain (Design §5.2/§5.4 v0.10, Prototype P-010/§23A P-018 v0.10, AC-WARRANTY-001-03..06 v0.9, Test Plan v0.9, Test Cases v0.11), then implemented the same day: a 3-state Active/Expiring/Expired badge (`getWarrantyStatus`) on the Assets list and Asset Detail, plus a new Settings "Warranty" section. `TC-WARRANTY-001-01..05` **PASS**; `TC-WARRANTY-001-06` (non-admin denial to the new Settings screen) written but not yet executed, tracked as **F-34**. `RAISE-TRACEABILITY-MATRIX.md` reaches **v1.3** (Gap 12 opened and closed same revision; Gap 13 opened, still open). **`TC-WARRANTY-001-06`/F-34 resolved 2026-09-01 (R-18)**: executing the last unexecuted Warranty test case caught a real defect — the Settings route (`ROUTES.SETTINGS`) wasn't actually gated to ADMIN — fixed by moving it into the existing `ProtectedRoute allowedRoles={['ADMIN']}` block. `RAISE-FR-WARRANTY-001` reaches a full unqualified **PASS** (all 6 test cases); `RAISE-TRACEABILITY-MATRIX.md` reaches **v1.4**. **F-02 (Check-in/Check-out workflow shape, permission gate, holder data model) resolved 2026-09-01 (R-19)**: per confirmed business decision (PRD §16 Resolved Question 42, resolving Q11–Q13), all three answers matched already-built, already-tested behavior exactly — immediate state-change (no approval workflow), any authenticated user (no role restriction), direct 1:1 Employee link for the holder model — **no code change required**. Propagated through Design §4.2 (v0.11), Prototype P-008/P-006 (v0.12 — a v0.11 drafting pass briefly over-resolved the separate, unconfirmed Custody-History-write-path-exclusivity question, Open Finding F-10; caught and corrected same-session), AC-OPS-002 (v0.10), Test Plan (v0.10), Test Cases (v0.13, `TC-OPS-002-01..03` reclassified fully PASS reusing existing 2026-08-28 execution evidence, no new run needed). `RAISE-TRACEABILITY-MATRIX.md` reaches **v1.5** (Gap 14 opened and closed same revision). F-10 and F-08 (general RBAC role content) remain explicitly, separately open. **PRD §16 Resolved Question 43 (2026-09-02)** then confirmed a real category-scoped exception for IT Hardware assets only — a 4-stage approval workflow (Initiation → Recipient Confirmation → IT Processing → IT Supervisor Approval) — shipped backend-only 2026-09-02 (PR #72, `TC-OPS-002-04..09` PASS at the API level), then a full frontend UI the same day (PR #74 — My Pending Assignments/IT Processing Queue/IT Supervisor Approval Queue surfaces at the time, plus a 4-stage governance indicator on a new `HandoverDetail` page, 47 test files/196 tests passing, live-verified end-to-end through the real UI), with the deliverable chain re-synced to record full-stack scope 2026-09-03 (PR #75, `RAISE-TRACEABILITY-MATRIX.md` reaches **v1.8**). The 3 separate queue pages were then consolidated into one "Asset Handovers" page with role-aware tabs 2026-09-03 (PR #76), per direct user feedback that 3 top-level nav items for one workflow's stages was bad IA — following the same single-nav-item precedent Phase 4's Maintenance/Ticket domain already established. This category-scoped exception is now **complete for its confirmed MVP scope** (backend + frontend + consolidated nav) — Stage 2 e-signature, the Stage 2 recipient-decline path, and backend RBAC enforcement remain explicitly out of that confirmed scope, not gaps. |
| **Checkpoint** | [PR #7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7), [#8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8), [#9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9), [#13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13), [#29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29), [#49](https://github.com/boonthepkstl-alt/stl_asset_service/pull/49) (Warranty field-list resolution), [#50](https://github.com/boonthepkstl-alt/stl_asset_service/pull/50) (Warranty Asset Registry column), [#58](https://github.com/boonthepkstl-alt/stl_asset_service/pull/58) (F-27 Category→Type hierarchy), [#63](https://github.com/boonthepkstl-alt/stl_asset_service/pull/63) (R-17 Warranty Expiring threshold + Settings screen), [#64](https://github.com/boonthepkstl-alt/stl_asset_service/pull/64) (R-18 TC-WARRANTY-001-06 + RBAC fix), [#67](https://github.com/boonthepkstl-alt/stl_asset_service/pull/67) (R-19 F-02 Check-in/Check-out), [#72](https://github.com/boonthepkstl-alt/stl_asset_service/pull/72) (IT Hardware handover approval workflow, backend), [#73](https://github.com/boonthepkstl-alt/stl_asset_service/pull/73) (docs close-out), [#74](https://github.com/boonthepkstl-alt/stl_asset_service/pull/74) (handover workflow frontend), [#75](https://github.com/boonthepkstl-alt/stl_asset_service/pull/75) (deliverable chain sync), [#76](https://github.com/boonthepkstl-alt/stl_asset_service/pull/76) (handover nav consolidation), [#78](https://github.com/boonthepkstl-alt/stl_asset_service/pull/78) (Create Employee full page), [#79](https://github.com/boonthepkstl-alt/stl_asset_service/pull/79) (Employee duplicate email/phone check), [#80](https://github.com/boonthepkstl-alt/stl_asset_service/pull/80) (optional Employee Code + backend parity fix), [#81](https://github.com/boonthepkstl-alt/stl_asset_service/pull/81) (Employee ID 8-digit format validation, **F-36**), [#82](https://github.com/boonthepkstl-alt/stl_asset_service/pull/82) (Create Asset/Employee forms flattened to single-page), [#87](https://github.com/boonthepkstl-alt/stl_asset_service/pull/87) (Edit Identity modal → full Edit Employee page, completing the modal→full-page conversion begun in #78) — see `PROJECT-CHECKPOINTS.md`. **No phase Status or Actual date changed for PRs #78–#87** — this is Employee-form and form-IA work inside Phase 3's already-open scope, plus cross-cutting shell changes tracked below; nothing started or completed a phase. Employee itself remains a supporting domain with **no `RAISE-FR-EMP-*` requirement anywhere in the PRD**, so none of this work has a governing FR, AC, or test case to advance. |

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
| **Risks** | Audit event taxonomy undefined (Design §15) — **finding tracked in `OPEN-FINDINGS.md`**; the audit-review role gate is undefined (PRD §16 Q22), so `GET /audit-logs` has no RequireRole gate for MVP; `TC-AUDIT-001-01`/`-03` remain partial in the traceability matrix pending those two answers. Oracle integration method/mapping/sync/security are all TBD (PRD §16 Q6–Q10, **F-04**) and represent this project's largest single external-dependency risk — the "Phase 6" label on the existing `ReconciliationPage` code comment was confirmed **not** a real PRD phase (Resolved Q37), so this numbering is coincidental, not inherited from that comment. Formal test execution (`TC-ORACLE-001-01..04`, 2026-08-29) confirms a second, independent gap: the route mapped to `RAISE-FR-ORACLE-001` (`/reconciliation`) renders a generic unbuilt placeholder, not an actual Financial View screen matching Prototype P-011 — tracked as **F-31**, distinct from F-04's integration-mechanism question. **Explicitly deferred by user decision 2026-09-01**: unlike F-22/F-27/F-30, no field/data exists elsewhere in the app to reuse for a scoped fix — NBV/Depreciation/Oracle Source/Sync Status all depend on the real integration that doesn't exist yet, so building anything now would fabricate data or pre-empt F-04. Decision recorded, no code built. |
| **Checkpoint** | [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31), [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35); `CHECKPOINT-2026-08-29-005` (`TS-ORACLE-001` sweep, docs-only, new finding F-31); `CHECKPOINT-2026-09-01-003` (F-31 deferral decision recorded) — see `PROJECT-CHECKPOINTS.md`. Oracle FA Integration: none yet — not started, deliberately deferred. |

## Phase 7 — Alerts & Notifications

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | 2026-09-01 |
| **Actual Completion** | 2026-09-04 (`RAISE-FR-ALERT-001` MVP scope only — **Gap 17** and **PRD Q22a** remain open, both decisions rather than engineering work) |
| **Status** | ✅ `RAISE-FR-ALERT-001` **complete for its confirmed MVP scope** — full `PASS`, all 11 `TC-ALERT-001-01..11` executed and passing (2026-09-04, `CHECKPOINT-2026-09-04-008`). Reached in four steps: the scoped single-condition first cut (2026-09-01), the trigger-rule/severity decision (**F-05 → R-23**, 2026-09-04), the four remaining conditions built and executed (**Gap 16**), and the access gate confirmed (**F-08 partial → R-25**). ✅ is scoped deliberately: **Gap 17** (header bell icon) and **PRD Q22a** (per-user filtering) remain open, and both are decisions, not engineering work |
| **Scope** | `RAISE-FR-ALERT-001` — surfacing conditions to an authenticated user. **Trigger rules and severity are no longer undefined**: PRD §16 **Resolved Question 44** (2026-09-04) fixes exactly five conditions with fixed per-type severities — Warranty Expired (`High`), Ticket Overdue (`High`), Warranty Expiring (`Medium`), Ticket On Hold (`Medium`), Handover Pending (`Low`). **Resolved Question 45** fixes the access gate: **any authenticated user**, all four roles, with role enforcement declared in code per route. Multi-channel delivery (Email/Teams/LINE) stays confirmed Roadmap, not MVP — the Scope line always said single-channel, so F-05's "channels" half was never actually open |
| **Deliverables** | `frontend/src/lib/alerts.ts` — a **pure derivation function** over already-fetched lists, with the severity mapping in a single `Record` so it cannot drift and `asOf` injectable so tests never depend on the clock. **No Alert entity, table, persisted record, new field or data-model change** — the read-time derivation architecture of Design §14 held through the full build. `frontend/src/pages/Alerts/index.tsx` (P-012) at `ROUTES.NOTIFICATIONS`, rendering real `High`/`Medium`/`Low` badges in place of the earlier placeholder "Not yet defined", with each row linking to the asset, ticket or handover it refers to. 12 unit tests covering every condition's positive **and** negative case |
| **Dependencies** | Phase 3 (Warranty data) and Phase 4 (Maintenance ticket data) — **both satisfied**; all five conditions derive from state those phases already built, which is why no new data model was needed. The Expiring threshold is read from Settings per Asset Category rather than hardcoded |
| **Risks** | **Largely retired.** The route-404 defect (**F-32**, found by formal execution 2026-08-29, worse than a placeholder) was fixed 2026-09-01. The severity/trigger-rule TBD (**F-05**) closed 2026-09-04 by business decision, not by invention. **F-42 / Gap 18** — `TC-ALERT-001-09`'s procedure specified editing an asset's `warrantyExpiry`, which the product cannot do — was a **test-case defect, not an implementation defect**; the procedure was corrected *before* execution so it could not be shaped around whatever passed, and no production code was changed to make it pass. Remaining: **Gap 17**, the header bell-icon scope contradiction (PRD §16 Resolved Question 35 vs `ESAPS-UI-FOUNDATION-BASELINE.md` line 88) — two project documents disagree and somebody has to say which is right; and **PRD Q22a**, per-user filtering, which is not specifiable today because **no link exists between the authenticated `User` and an `Employee`** |
| **Checkpoint** | `CHECKPOINT-2026-08-29-006` (`TS-ALERT-001` sweep, docs-only, F-32 raised); `CHECKPOINT-2026-09-01-004` (F-32 resolved, scoped screen implemented); `CHECKPOINT-2026-09-04-005` (F-05 → R-23, specification only); `CHECKPOINT-2026-09-04-006` (Gap 16 built, `TC-ALERT-001-03..10` executed — 7 PASS, 1 BLOCKED); `CHECKPOINT-2026-09-04-007` (`TC-ALERT-001-09` corrected and executed, F-42 → R-24, Gap 18 and Gap 16 closed); `CHECKPOINT-2026-09-04-008` (access gate, F-08 → R-25, requirement to full `PASS`) — see `PROJECT-CHECKPOINTS.md` |

## Phase 8 — Executive Dashboard & Reporting

| Field | |
|---|---|
| **Start Date** | 2026-08-25 |
| **Target Date** | Not scheduled |
| **Actual Start** | 2026-08-25 |
| **Actual Completion** | Not complete — the plain-count KPI tiles (status counts, expired warranty, department/type distribution) moved to a real backend endpoint; NBV/Risk/Utilization-mechanics tiles, the trend chart, and Monthly Depreciation/Cost remain client-side/static, unchanged |
| **Status** | 🟡 Plain-count KPI backend shipped · **Utilization KPI built and live 2026-09-05 (PR #102)** — the first of the three proposal-defined KPIs to land, and it turned out **never to have been blocked on a decision**: PRD §16 Resolved Question 27 fixed its definition and RQ29 its mechanics back on 2026-08-21, so it was missing only because nobody had built it · **NBV method decided 2026-09-05** (straight-line from `purchaseCost`/`purchaseDate`, useful life per Asset Category in Settings, salvage 0) but **blocked on one business input** — the default useful-life years per category · **Risk confirmed OUT of MVP 2026-09-05**, matching what `RAISE-AI-RISK-001` already said (`Pilot (not confirmed MVP)`) · F-22 resolved 2026-08-31 |
| **Scope** | `RAISE-FR-EXEC-001` — KPI tiles (NBV, Risk, Utilization, etc.), acquisitions/retirements trend, department/type distribution. Utilization's *presence and description* are confirmed (PRD §16 Resolved Q27); its *calculation mechanics* and the NBV/Risk formulas are not (Q3–Q4, Resolved Q29 partial). |
| **Deliverables** | `go-template-main` Dashboard domain (model/service/controller, `GET /dashboard/stats`, no new table — composes over the existing Asset domain); frontend `HttpDashboardRepository`/`MockDashboardRepository` behind a new `DASHBOARD_API_ENABLED` flag. Deliberately excludes Software License count (no backend License table — Roadmap-only) and every NBV/Risk/Utilization-mechanics figure (still PRD §16 Q3/Q4/Q29 TBD) — those remain exactly as they were (static illustrative content or Mock-only), not silently approximated. |
| **Dependencies** | Phase 3 (asset data) — satisfied. Phase 5 (license count KPI), Phase 6 (Oracle-sourced NBV) remain dependencies for the *not-yet-built* half of this phase. |
| **Risks** | The original risk — building NBV/Risk before Phase 6's Oracle integration lands, then having to recalculate against real financial data — still stands for **NBV**, and is why its useful-life table is admin-configurable in Settings rather than hardcoded. It no longer applies to **Utilization** (derived purely from `Asset.status`, no financial input) or to **Risk** (out of MVP). A separate hazard was closed 2026-09-05: `currentValue` exists on the Asset record and looks like a ready-made NBV, but `assetService.go:101` sets it equal to `purchaseCost` on create and never recomputes it, and the seed values are hand-written at inconsistent rates — using it would have put a number on the dashboard that never moves. |
| **Checkpoint** | [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33); `CHECKPOINT-2026-08-29-004` (`TS-DASH` sweep, broadens F-22); `CHECKPOINT-2026-08-31-002` (F-22 chain-wide spec correction); `CHECKPOINT-2026-08-31-003` (re-execution, all PASS, F-22 Resolved) — see `PROJECT-CHECKPOINTS.md`. |

## Phase 9 — AI Document Intelligence & Search

| Field | |
|---|---|
| **Start Date** | Not scheduled |
| **Target Date** | Not scheduled |
| **Actual Start** | — |
| **Actual Completion** | — |
| **Status** | ⚪ Not started — fully blocked, and explicitly deferred by business decision 2026-09-01 (not merely unanswered) |
| **Scope** | Natural Language Search (`RAISE-AI-SEARCH-001`) and Document Intelligence — OCR (`RAISE-AI-DOC-001`), Metadata extraction (`-002`), Classification (`-003`), Duplicate Detection (`-004`). All confirmed MVP/Current-AI tier by scope, but every acceptance criterion is `BLOCKED (full)` in the traceability matrix — confidence thresholds, field lists, and matching rules are undefined. |
| **Deliverables** | None yet. |
| **Dependencies** | Phase 3 (assets/documents to search and extract from). |
| **Risks** | Duplicate Detection's matching threshold and merge-vs-flag workflow were explicitly asked of the business on 2026-08-21 and left unanswered (PRD §16 Open Question 20a) — this is the most concretely stalled item in the entire backlog, not merely unprioritized. Formal test execution (`TC-AI-SEARCH-001-01..03` and `TC-AI-STATES-01..05`, 2026-08-29) confirmed a second, independent gap: two "AI" surfaces exist in the built app (a no-input header drawer, and a hardcoded keyword-filter box on the Assets page ported from legacy ESAPS), neither answering a natural-language question or exhibiting any of the 5 required response states per Prototype P-015. Tracked as **F-33**, distinct from F-06's citation-format question. **Explicitly deferred 2026-09-01**: a scoped canned-answer engine for the PRD's illustrative example question was offered as an option and declined — this finding spans 8 test cases across 5 response states, a larger and more speculative undertaking than F-27/F-30/F-32's fixes; wait until real AI backend integration lands. |
| **Checkpoint** | `CHECKPOINT-2026-08-29-007`/`-008` (`TS-AI-SEARCH-001`/`TS-AI-STATES` sweeps, docs-only, F-33); `CHECKPOINT-2026-09-01-005` (F-33 deferral decision recorded) — see `PROJECT-CHECKPOINTS.md`. Otherwise none yet — not started, deliberately deferred. |

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
| [PR #83](https://github.com/boonthepkstl-alt/stl_asset_service/pull/83) | "New Asset" button removed from the global app header (`AppShell`) | The button rendered on every authenticated page regardless of phase — removing it changes Employees, Settings, Licenses, Dashboard and every other screen, not one phase's deliverable |
| [PR #84](https://github.com/boonthepkstl-alt/stl_asset_service/pull/84) | Breadcrumbs made clickable with an `AppShell`-owned "Home" root; 39 call sites across 19 page files updated | Touches the shared shell and nearly every page in the app; also fixed a latent bug where the breadcrumb `href` prop had been accepted but never rendered anywhere |
| [PR #86](https://github.com/boonthepkstl-alt/stl_asset_service/pull/86) | 6 breadcrumb regression tests added for `AppShell`, each mutation-tested against PR #84's original bug; the breadcrumb `<nav>` gained `aria-label="Breadcrumb"` | Guards shell behaviour that every authenticated page depends on — and the missing coverage it closes is exactly what let ~9 pages carry dead `href` props unnoticed. Not a phase deliverable: breadcrumb behaviour is specified nowhere in the chain, so there is no FR/AC/test case for it to advance |
| [PR #89](https://github.com/boonthepkstl-alt/stl_asset_service/pull/89) | First CI pipeline (`.github/workflows/ci.yml`) — two parallel jobs covering frontend lint/typecheck/test/build and backend build/vet/test | Gates every PR in both stacks, not one phase's deliverable (F-14 → R-20) |
| [PR #91](https://github.com/boonthepkstl-alt/stl_asset_service/pull/91) | Route-level code splitting — 21 pages converted to `React.lazy` behind one `Suspense` | Changes how *every* screen loads, no phase owns it (F-18 → R-21) |
| [PR #93](https://github.com/boonthepkstl-alt/stl_asset_service/pull/93) | Raw Go error text removed from every **5xx** body, plus a source-level guard test | Response hygiene across all controllers (F-19 → R-22) |
| [PR #103](https://github.com/boonthepkstl-alt/stl_asset_service/pull/103) | Raw driver errors removed from **404** bodies after auditing all 28 4xx sites; second guard test added | Same class as PR #93 and the direct continuation of it — the audit showed a DB outage had been answering 404 with the driver's dial text, host and port included, which PR #93's 5xx-only guard could not see (F-41 → R-26; F-43 raised, deliberately unswept) |
| [PR #104](https://github.com/boonthepkstl-alt/stl_asset_service/pull/104) | `pool: 'threads'` set for Vitest, making local runs deterministic at 50/257 | Affects how *every* test run is trusted — the close-out protocol compares test counts between checkpoints, so a runner that under-collects undermines the record itself (F-44 → R-27) |

Business confirmation that enabled all of the branding checkpoints above
(PR #23, #24, #26, #25, #27): **RAISE is developed for direct use by
Singer (Thailand)** — `RAISE-PRD.md` §16 Resolved Question 39 (v0.10, see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md)). This is a
branding/identity fact, not a functional-scope change to any phase above.

---

## Legend

🟢 Complete for current scope · 🟡 Partially complete / MVP slice only · ⚪ Not started

*Status reflects the phase's own confirmed scope, not the full ambition of the requirement — a 🟢 phase can still have open Roadmap-tier extensions (see each phase's Risks).*
