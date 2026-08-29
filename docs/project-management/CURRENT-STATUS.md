# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-08-29, after `CHECKPOINT-2026-08-29-002` (F-01 Warranty
field-list resolution — not yet shipped via PR, see that checkpoint for
status). The `BASELINE-CHECKPOINT-2026-08-24` scan is still the last
full live re-verification against `git`/source. F-20 (checkpoint-coverage
gap) is closed (R-04); F-21 (QR/Barcode invalid-code state) is closed
(R-05); F-23 (Asset Registry — no Category filter) is closed (R-06);
F-24 (Asset Detail missing Financial/Lifecycle sections) is closed
(R-07); F-26 (Custody History not append-only) is closed (R-08); F-25
(no Category & Hierarchy screen) is closed (R-09) —
`RAISE-FR-ASSET-001`/`-002`/`-003`/`RAISE-FR-OPS-001` all `PASS`
(Category & Hierarchy is a "By Category" tab inside Asset Management,
not a separate page — folded in same-day per user request, see PR #44).
A `/code-review` pass on the F-24 diff (PR #40) found 2 quality issues,
both fixed same-day via PR #41, no behavior regressions.
A third formal test-execution sweep (2026-08-28) covered `RAISE-FR-OPS-002`
(now **`PASS`** 3/3) and `RAISE-FR-MAINT-001` — F-28 (R-10) and F-29
(R-11) are both resolved — **`RAISE-FR-MAINT-001` now `PASS` on all 9
test cases**. A fourth sweep (2026-08-29) covered `RAISE-NFR-SEC-RBAC-001`
(`TS-LOGIN`): `TC-LOGIN-03` (access-denied) **PASS**; `TC-LOGIN-01`/`-02`
(valid/invalid login) **BLOCKED** for a *new* reason — `auth-service.ts`
has no mock fallback and no backend/database is reachable in this
environment (new infrastructure finding **F-30**, distinct from the
pre-existing PRD-content block on auth mechanism/role-matrix).
**F-01 (Warranty field list) is now closed (R-12)** — the user confirmed
`warrantyExpiry` is the only MVP field, rejecting a draft 8-field
proposal; this is recorded as PRD §16 Resolved Question 40 and
propagated through the full deliverable chain via `/update-prd` +
`/run-full-chain` (Design, Prototype, Acceptance Criteria, Test Plan,
Test Cases, Traceability Matrix all updated) — no code change.
`AC-WARRANTY-001-03`'s separate 90-day-window question remains open.
**F-22** (Executive Dashboard scope question) and **F-27** (Category
sub-taxonomy, TBD) remain open from the earlier sweeps. Every
development session should close out per
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md), which is
what keeps this section current.

---

## 1. Overall Health

The documentation chain (`docs/01-requirements/` … `docs/07-traceability-matrix/`)
is internally consistent and current — all 6 historical traceability gaps
are closed and re-verified against real file content, not just re-asserted.
The gap between "documented" and "built" is real but honestly tracked: 3 of
the platform's MVP domains have a full backend-to-frontend implementation;
the rest is either genuinely blocked on an open PRD question or
intentionally out of MVP scope (Roadmap).

## 2. Deliverable Chain Document Versions

| Document | Version | Notes |
|---|---|---|
| [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) | 0.11 | Draft for Requirement Review — Warranty field list resolved (Resolved Question 40) |
| [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) | 0.8 | Gap-closure pass against PRD v0.9; Warranty §5.2 resolved same-day as PRD v0.11 |
| [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) | 0.7 | 17-screen inventory; P-010 Warranty field list corrected |
| [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) | 0.6 | Re-synced against Prototype v0.7 — AC-WARRANTY-001 now Testable |
| [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) | 0.6 | Re-synced against AC v0.6 |
| [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) | 0.6 | 62 test cases; TC-WARRANTY-001-01/-02 unblocked |
| [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md) | 0.6 | All 6 original gaps resolved; Gap 7 (Warranty field list) opened and resolved same-day |
| [`RAISE-HIGH-LEVEL-ARCHITECTURE.md`](../08-architecture/RAISE-HIGH-LEVEL-ARCHITECTURE.md) | — | As-built, not versioned against PRD chain |
| [`RAISE-API-DB-SPEC.md`](../09-api-db-spec/RAISE-API-DB-SPEC.md) | — | As-built |
| [`RAISE-DETAILED-DESIGN.md`](../10-detailed-design/RAISE-DETAILED-DESIGN.md) | — | As-built |

## 3. Domain Build Status

### Backend domains (`go-template-main`, PostgreSQL-backed, real endpoints)

| Domain | Requirement | Status |
|---|---|---|
| Asset Registry | `RAISE-FR-ASSET-001` | ✅ Built, **PASS on all 6 test cases** per formal test execution 2026-08-26/-27 — list/search/row-click/detail-isolation, the Category filter (F-23), and Asset Detail's Financial/Lifecycle sections (F-24) all fixed and verified |
| Category & Hierarchy | `RAISE-FR-ASSET-002` | ✅ Built (scoped), **PASS (scoped)** per formal test execution 2026-08-26/-28 — category *display* is consistent across screens (PASS), and a first-cut P-005 Category & Hierarchy view now exists (F-25 fixed: each category expands to its real assets) — a "By Category" tab inside Asset Management (`/assets`), folded in from an initial standalone `/categories` page per user request (same content, no separate route). Sub-category taxonomy remains intentionally out of scope (**F-27**, TBD per Prototype §11) |
| Asset Assign / Check-in | `RAISE-FR-ASSET-003` / `RAISE-FR-OPS-002` | ✅ Built, **PASS on all test cases for both requirements** — `RAISE-FR-ASSET-003` (3/3, 2026-08-26/-27, F-26 fixed: History tab renders from the same audit trail `RAISE-FR-AUDIT-001` builds, append-only) and `RAISE-FR-OPS-002` (3/3, 2026-08-28: Assign functions as the app's Check-out affordance, Check-in restores Available, both create Audit Log entries) |
| Employee | supports `RAISE-FR-ASSET-003` | ✅ Built |
| Maintenance / Ticket | `RAISE-FR-MAINT-001` | ✅ Built, **PASS on all 9 test cases** per formal test execution 2026-08-28 — all 4 stage transitions (submit/approve/reject/dispatch/status-update/complete) work correctly, the record list shows date/cost per record (F-28 fixed), and the stage-progress indicator now visually distinguishes Current from Pending (F-29 fixed). SLA/vendor/cost model remain separately TBD |
| Auth | supports `RAISE-NFR-SEC-RBAC-001` | 🟡 Built, demo-only — hardcoded single user, no real user store. `TC-LOGIN-03` (access-denied for an unauthorized area) **PASS** per formal test execution 2026-08-29. `TC-LOGIN-01`/`-02` (valid/invalid login) **BLOCKED** — no mock fallback exists (unlike Asset/Employee/Ticket) and no backend/database is reachable in this dev environment (**F-30**) |
| QR / Barcode lookup | `RAISE-FR-OPS-001` | ✅ Built, PASS on all test cases — [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29) + a follow-up F-21 fix (see `DEVELOPMENT-LOG.md` for the PR number once shipped). `GET /assets/:id` resolves by `code` too (dual lookup); real QR generation + Scan QR flow live on both Assets list and Asset Detail. `TC-OPS-001-01..03` all **PASS** — the invalid-code state (F-21) is fixed via a plausible-code-format check before lookup |
| Audit Log | `RAISE-FR-AUDIT-001` | 🟡 Built — [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31) (Asset domain) + [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35) (Ticket domain). `GET /audit-logs` + recording on Asset create/assign/check-in and Ticket create/approve/dispatch/status-update. No update/delete path exists (immutability by omission). The testable subset of `TC-AUDIT-001-01..03` **PASSED** formal execution 2026-08-26; field taxonomy and the audit-review role gate remain TBD (unchanged, blocked on PRD) |
| Executive Dashboard KPIs (first cut) | `RAISE-FR-EXEC-001` | 🟡 Built, narrow scope, FAIL on prototype match per formal test execution — [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33). `GET /dashboard/stats` computes status counts, expired-warranty count, and department/type distribution from real Asset data. Software License count still comes from the frontend's mock license service (no backend License table exists — Roadmap-only). NBV/Risk KPI formulas and Utilization's calculation mechanics remain **not started** (PRD §16 Q3/Q4/Q29 TBD). **`TC-EXEC-001-01/-02` FAILED formal execution 2026-08-26** — the built page has no tiles/sections named per Prototype P-014 at all (not even presence-only), a gap independent of the formula question — see `OPEN-FINDINGS.md` F-22 |
| Oracle FA Integration | `RAISE-FR-ORACLE-001` | Integration method/mapping/sync/security all TBD |
| Natural Language Search | `RAISE-AI-SEARCH-001` | Citation precision/format TBD |
| Document Intelligence | `RAISE-AI-DOC-001..004` | Confidence thresholds / field lists / matching rules undefined |
| Asset Lifecycle Connectivity | `RAISE-FR-LIFE-001` | Partially blocked; Disposal stage confirmed Roadmap |
| User/Role Management | supports `RAISE-NFR-SEC-RBAC-001` | Backend RBAC enforcement confirmed Roadmap, not MVP |

## 4. Checkpoint Backlog

Triaged against [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
§3–§5 — re-check that file before picking an item, it may have changed.

**Buildable now:** **A first-cut Warranty screen (P-010)** — F-01's field
list is now resolved (`warrantyExpiry` only), unblocking real
implementation for the first time; mirrors the F-25 Category & Hierarchy
precedent (scoped-down first cut, not the full illustrative model).
Otherwise, none remaining from the 2026-08-26 Asset-domain sweep, the
2026-08-28 TS-OPS-002/TS-MAINT-001 sweep, or the 2026-08-29 TS-LOGIN
sweep — F-23 through F-29 are all now fixed (R-06 through R-11). F-22
(Executive Dashboard vs. Prototype P-014), F-27 (Category sub-taxonomy),
and F-30 (no Auth mock fallback) all remain open but aren't directly
buildable without a decision.

**Needs a scoped-down first cut:** None remaining — Audit Log (PR #31 +
#35, now covering both Asset and Ticket domains) and Executive Dashboard
(PR #33) were the last items in this category, both now built to the
extent possible without inventing TBD content. Nothing further is
currently drawable on Executive Dashboard's NBV/Risk KPI formulas without
a business decision (§16 Q3/Q4). Separately, **F-22** (Executive
Dashboard vs. Prototype P-014 tile/section-name mismatch) is *not* a
"first cut" candidate — it's a scope-reconciliation question for the
business/design owner (should the prototype or the shipped page change?)
before any code should be written toward it.

**Blocked on a business decision:** Alerts, Oracle FA Integration, Natural
Language Search, Document Intelligence, User/Role Management backend
(RBAC enforcement itself is Roadmap-confirmed, not just TBD). Warranty's
field list is resolved (F-01, 2026-08-29, `warrantyExpiry` only) — a
first-cut P-010 Warranty screen is now buildable, not blocked; only
`AC-WARRANTY-001-03`'s separate 90-day-window rule remains open.

**Explicitly out of scope (Roadmap/Pilot):** License Management, AI
Decision Center, Risk Scoring, Lifecycle Prediction, Asset Disposal,
real-time ERP integration, native mobile app, predictive analytics,
workflow automation, multi-channel alerts.
