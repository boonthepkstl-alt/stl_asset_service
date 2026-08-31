# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-08-29, after `CHECKPOINT-2026-08-29-008` (`TS-AI-STATES`
sweep — all 5 test cases FAIL, broadening F-33; not yet shipped via PR,
see that checkpoint for status). **This completes formal execution of
every suite in `RAISE-TEST-CASES.md` at least once.** The
`BASELINE-CHECKPOINT-2026-08-24` scan is still the last
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
proposal; recorded as PRD §16 Resolved Question 40, propagated through
the full deliverable chain via `/update-prd` + `/run-full-chain`, then
**implemented the same day**: per explicit user direction, no standalone
P-010 screen was built — a "Warranty" column (expiry date + Active/
Expired badge, sortable) was added to the Assets Registry list instead.
`RAISE-FR-WARRANTY-001` is now **`PASS (partial)`** — `TC-WARRANTY-001-01/-02`
pass; `AC-WARRANTY-001-03`'s separate 90-day-window question (and the
"Expiring" 3rd state it would gate) remains open.
A fifth sweep (2026-08-29) covered `TS-DASH` (Main Dashboard, P-002):
all 3 test cases **FAIL** — NBV/Risk tiles absent, "Warranty Expiry"
mislabeled "Expired Warranty", no "Asset by Category"/"Lifecycle /
Maintenance Overview"/"Recent Alerts" sections. Since P-002's spec is
word-for-word identical to P-014's and both trace to the same single
built page (`frontend/src/pages/Dashboard/index.tsx`), this **broadens
F-22** rather than opening a new finding.
A sixth sweep (2026-08-29) covered `TS-ORACLE-001` (Oracle FA / Financial
View, P-011): all 4 test cases **FAIL** — the `/reconciliation` route
maps `RAISE-FR-ORACLE-001` to a generic "foundation placeholder"
`EmptyState`, with no NBV/Depreciation/Oracle Source/Sync Status fields
and no data-unavailable/error/conflict states at all. New finding
**F-31** — distinct from the pre-existing **F-04** (integration-
mechanism question, PRD §16 Q6–Q10, still genuinely open), since this is
a build gap confirmed by execution, not a PRD-content block.
A seventh sweep (2026-08-29) covered `TS-ALERT-001` (Alerts, P-012): both
test cases **FAIL** — the "Notification Center" route (`/notifications`)
renders the app's generic 404 page, not even a placeholder stub; the
header bell-icon dropdown is hardcoded empty with a static "later phase"
message. New finding **F-32** — distinct from the pre-existing **F-05**
(trigger-rule question, PRD §6.9, still genuinely open), and worse than
F-31's Oracle FA placeholder since this route is entirely unbuilt.
An eighth sweep (2026-08-29) covered `TS-AI-SEARCH-001` (Natural Language
Search, P-015): all 3 test cases **FAIL** — the header "AI Assistant"
drawer accepts no input at all (static placeholder only); the Assets
page's "Ask AI" box is a hardcoded keyword-to-filter matcher (legacy
ESAPS content), not a natural-language answer engine — no "Sources /
Data Used" section, no affected-asset count, no Asset/Warranty/Age/
Maintenance/Status table for the PRD's illustrative 90-day question.
New finding **F-33** — distinct from the pre-existing **F-06** (citation-
precision/format question, PRD §16 Q18, still genuinely open).
A ninth sweep (2026-08-29) covered `TS-AI-STATES` (AI Response States,
P-015 §22): all 5 test cases **FAIL** — none of the 5 required response
states (Success/No-data/Unable-to-answer/Source-unavailable/Data-
conflict) exist anywhere; a nonsense query just falls back to showing
the unfiltered asset list. Since this traces to the same two surfaces
and root cause as `TS-AI-SEARCH-001`, this **broadens F-33** rather than
opening a new finding — completing formal execution of every suite in
`RAISE-TEST-CASES.md` at least once this session.
**F-22** (Executive/Main Dashboard scope question, now confirmed from two
Prototype screens), **F-27** (Category sub-taxonomy, TBD), **F-31**
(Oracle FA Financial View not built), **F-32** (Alerts not built), and
**F-33** (AI Assistant doesn't answer questions) remain open from the
recent sweeps.
Every
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
| Warranty | `RAISE-FR-WARRANTY-001` | ✅ Built (partial), **PASS (partial)** per formal test execution 2026-08-29 — field list resolved (F-01, `warrantyExpiry` only), implemented as a "Warranty" column on the Assets Registry list (`TC-WARRANTY-001-01/-02` pass), not a standalone P-010 screen (per user direction). The "Expiring" timeline state (3rd of 3) is not implemented — depends on `AC-WARRANTY-001-03`'s still-unconfirmed 90-day-style threshold |
| Maintenance / Ticket | `RAISE-FR-MAINT-001` | ✅ Built, **PASS on all 9 test cases** per formal test execution 2026-08-28 — all 4 stage transitions (submit/approve/reject/dispatch/status-update/complete) work correctly, the record list shows date/cost per record (F-28 fixed), and the stage-progress indicator now visually distinguishes Current from Pending (F-29 fixed). SLA/vendor/cost model remain separately TBD |
| Auth | supports `RAISE-NFR-SEC-RBAC-001` | 🟡 Built, demo-only — hardcoded single user, no real user store. `TC-LOGIN-03` (access-denied for an unauthorized area) **PASS** per formal test execution 2026-08-29. `TC-LOGIN-01`/`-02` (valid/invalid login) **BLOCKED** — no mock fallback exists (unlike Asset/Employee/Ticket) and no backend/database is reachable in this dev environment (**F-30**) |
| QR / Barcode lookup | `RAISE-FR-OPS-001` | ✅ Built, PASS on all test cases — [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29) + a follow-up F-21 fix (see `DEVELOPMENT-LOG.md` for the PR number once shipped). `GET /assets/:id` resolves by `code` too (dual lookup); real QR generation + Scan QR flow live on both Assets list and Asset Detail. `TC-OPS-001-01..03` all **PASS** — the invalid-code state (F-21) is fixed via a plausible-code-format check before lookup |
| Audit Log | `RAISE-FR-AUDIT-001` | 🟡 Built — [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31) (Asset domain) + [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35) (Ticket domain). `GET /audit-logs` + recording on Asset create/assign/check-in and Ticket create/approve/dispatch/status-update. No update/delete path exists (immutability by omission). The testable subset of `TC-AUDIT-001-01..03` **PASSED** formal execution 2026-08-26; field taxonomy and the audit-review role gate remain TBD (unchanged, blocked on PRD) |
| Executive Dashboard KPIs (first cut) | `RAISE-FR-EXEC-001` | 🟡 Built, narrow scope, FAIL on prototype match per formal test execution — [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33). `GET /dashboard/stats` computes status counts, expired-warranty count, and department/type distribution from real Asset data. Software License count still comes from the frontend's mock license service (no backend License table exists — Roadmap-only). NBV/Risk KPI formulas and Utilization's calculation mechanics remain **not started** (PRD §16 Q3/Q4/Q29 TBD). **`TC-EXEC-001-01/-02` FAILED formal execution 2026-08-26, and `TC-DASH-01..03` FAILED formal execution 2026-08-29** (P-002 Main Dashboard — word-for-word identical tile/section spec to P-014, same built page) — the built page has no tiles/sections named per Prototype P-002/P-014 at all (not even presence-only), a gap independent of the formula question — see `OPEN-FINDINGS.md` F-22 |
| Oracle FA Integration | `RAISE-FR-ORACLE-001` | 🔴 Integration method/mapping/sync/security all TBD (F-04), **and `TC-ORACLE-001-01..04` FAILED formal execution 2026-08-29** — the `/reconciliation` route renders a generic "foundation placeholder" `EmptyState` (`frontend/src/pages/_shared/ModulePage.tsx`), not an actual Financial View screen; no field or state from `AC-ORACLE-001-01..04` exists at all. A distinct build gap from F-04 — see `OPEN-FINDINGS.md` F-31 |
| Alerts | `RAISE-FR-ALERT-001` | 🔴 Trigger rules/channels all TBD (F-05), **and `TC-ALERT-001-01..02` FAILED formal execution 2026-08-29** — the "Notification Center" route (`/notifications`) renders the app's generic 404 page, not even a placeholder stub; the header bell-icon dropdown is hardcoded empty. No alert is ever listed with severity/description/asset per `AC-ALERT-001-01..02`. A distinct build gap from F-05, worse than F-31's Oracle FA placeholder — see `OPEN-FINDINGS.md` F-32 |
| Natural Language Search | `RAISE-AI-SEARCH-001` | 🔴 Citation precision/format TBD (F-06), **and `TC-AI-SEARCH-001-01..03`/`TC-AI-STATES-01..05` (all 8) FAILED formal execution 2026-08-29** — the header "AI Assistant" drawer accepts no input (static placeholder only); the Assets page's "Ask AI" box is a hardcoded keyword-to-filter matcher (legacy ESAPS content), not a natural-language answer engine, and exhibits none of the 5 required response states. No field or state from `AC-AI-SEARCH-001-01..03`/`AC-AI-STATES-01..05` exists at all. A distinct build gap from F-06 — see `OPEN-FINDINGS.md` F-33 |
| Document Intelligence | `RAISE-AI-DOC-001..004` | Confidence thresholds / field lists / matching rules undefined |
| Asset Lifecycle Connectivity | `RAISE-FR-LIFE-001` | Partially blocked; Disposal stage confirmed Roadmap |
| User/Role Management | supports `RAISE-NFR-SEC-RBAC-001` | Backend RBAC enforcement confirmed Roadmap, not MVP |

## 4. Checkpoint Backlog

Triaged against [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
§3–§5 — re-check that file before picking an item, it may have changed.

**Buildable now:** None remaining — Warranty (F-01) is now implemented
(Assets Registry column, R-12) as of the 2026-08-26 Asset-domain sweep,
the 2026-08-28 TS-OPS-002/TS-MAINT-001 sweep, and the 2026-08-29
TS-LOGIN sweep — F-23 through F-29 are all now fixed (R-06 through
R-11). F-22 (Executive/Main Dashboard vs. Prototype P-002/P-014,
reconfirmed 2026-08-29 via TS-DASH), F-27 (Category sub-taxonomy), F-30
(no Auth mock fallback), F-31 (Oracle FA Financial View not built,
2026-08-29), F-32 (Alerts not built, 2026-08-29), F-33 (AI Assistant
doesn't answer questions, 2026-08-29), and `AC-WARRANTY-001-03`'s
90-day-window question all remain open but aren't directly buildable
without a decision — as of this sweep, every remaining open item is
uniformly blocked on a business/design decision, none is a "buildable
now" engineering task.

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
