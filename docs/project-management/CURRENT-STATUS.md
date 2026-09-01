# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-09-01, after `CHECKPOINT-2026-09-01-005` (F-33 explicitly
deferred by user decision, not built; not yet shipped via PR, see that
checkpoint for status). The
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
A `/code-review` pass on PR #50's diff (2026-08-31) found 1 `reuse`
finding — the "is warranty expired" check duplicated across 3 files —
fixed same-day via [PR #55](https://github.com/boonthepkstl-alt/stl_asset_service/pull/55)
(extracted `frontend/src/lib/warranty.ts`), no behavior regressions
(144/144 tests still pass).
**F-22 (Executive/Main Dashboard scope question) is now Resolved (R-13,
2026-08-31)** — per confirmed business decision ("แก้ Prototype ให้ตรงกับ
ของจริง"), the full chain (`RAISE-DESIGN.md` §13 v0.9, `RAISE-PROTOTYPE.md`
P-002/P-014 v0.8, `RAISE-ACCEPTANCE-CRITERIA.md` AC-DASH/AC-EXEC-001 v0.7,
`RAISE-TEST-PLAN.md` TS-DASH/TS-EXEC-001 v0.7, `RAISE-TEST-CASES.md`
TC-DASH-01..03/TC-EXEC-001-01..02 v0.7) was corrected to document the
actually shipped 8-tile KPI grid / 10-section dashboard, then
**re-executed the same day against the real app: all cases PASS**
(all 8 tiles, all 10 sections confirmed present via real page text).
`RAISE-TRACEABILITY-MATRIX.md` (v0.8) updated to PASS/PASS (partial),
Gap 8 closed. NBV/Risk/Utilization remain a documented, not-yet-scheduled
enhancement (F-03) — not deleted, not resolved by this fix.
**F-27 (Category sub-taxonomy) is now Resolved (R-14, 2026-09-01)** —
per confirmed business decision, sub-category = the existing Asset `type`
field (2-level Category → Type → assets, no new field/data model). The
chain (`RAISE-PROTOTYPE.md` P-005 v0.9, `RAISE-ACCEPTANCE-CRITERIA.md`
AC-ASSET-002 v0.8, `RAISE-TEST-PLAN.md`/`RAISE-TEST-CASES.md` v0.8/v0.9)
was corrected, then **implemented and re-verified the same day**: the
Assets page's "By Category" view was extended one level deeper —
expanding a category reveals its real Type sub-groups, expanding a Type
reveals its individual assets. All cases **PASS**; 3 automated tests
(144→145), full suite passing, `tsc`/lint clean.
**`RAISE-TRACEABILITY-MATRIX.md` reached v1.0** — Gap 9 closed, all
traceability gaps resolved.
**F-30 (no Auth mock fallback) is now Resolved (R-15, 2026-09-01)** —
per confirmed business decision, added `MockAuthRepository` following
the established Mock/Http pattern (`frontend/src/services/auth-repository.ts`),
gated by a new `AUTH_API_ENABLED` flag. 4 demo accounts seeded, one per
Role (`admin@raise.dev`/`manager@raise.dev`/`itstaff@raise.dev`/
`employee@raise.dev`, all `demo1234`). Live-verified through the real
Login page UI (not a `localStorage` bypass): invalid credentials
rejected, valid credentials log in and land on the Dashboard. 2 new
automated tests (145→147), full suite passing, `tsc`/lint clean.
`RAISE-TRACEABILITY-MATRIX.md` (v1.1) updated to PASS, Gap 10 closed —
**this resolves the infrastructure gap only**; the separate PRD-content
question (auth mechanism/role-permission matrix, PRD §16 Q21–Q22)
remains genuinely undefined.
**F-31 (Oracle FA Financial View not built) has a confirmed business
decision (2026-09-01): explicitly deferred** — do not build a
placeholder-vs-real Financial View now; wait until real Oracle FA
integration lands (F-04 resolved). Unlike F-22/F-27/F-30, there is no
existing field/data in the app to reuse for a "match reality" fix, so
building anything now would either fabricate NBV/Depreciation/Oracle
Source/Sync Status data or pre-empt the still-open F-04 formula
question. `OPEN-FINDINGS.md` F-31 updated to record this — remains
**Open**, not Resolved (nothing was built; the app's behavior is
unchanged).
**F-32 (Alerts not built) is now Resolved (R-16, 2026-09-01)** — per
confirmed business decision, built a scoped Alerts screen
(`frontend/src/pages/Alerts/index.tsx`, new `ROUTES.NOTIFICATIONS`)
that derives alerts from the one condition already confirmed
elsewhere — expired warranty (`isWarrantyExpired`, same helper the
Assets Warranty column and Dashboard already use). Severity is
rendered honestly as "Not yet defined" rather than an invented
High/Medium/Low, since severity/trigger rules remain undefined
(F-05, unaffected). `RAISE-ACCEPTANCE-CRITERIA.md` was deliberately
**not** touched — its existing scope already covered this (unlike
F-22/F-27). Live-verified: `/notifications` shows 11 alert rows
matching the Dashboard's "Expired Warranty" count exactly, asset
links navigate correctly, no delivery-channel UI. 2 new automated
tests (147→149), full suite passing, `tsc`/lint clean.
`RAISE-TRACEABILITY-MATRIX.md` (v1.2) updated to PASS (partial),
Gap 11 closed.
**F-33 (AI Assistant doesn't answer questions) has a confirmed business
decision (2026-09-01): explicitly deferred** — do not build even a
scoped canned-answer engine for the PRD's illustrative example question
now; wait until real AI backend integration lands. This finding spans
8 test cases across 5 response states (`TS-AI-SEARCH-001` +
`TS-AI-STATES`), a larger and more speculative undertaking than
F-27/F-30/F-32's fixes (each reused one existing field/pattern).
`OPEN-FINDINGS.md` F-33 updated to record this — remains **Open**, not
Resolved (nothing was built; the app's behavior is unchanged).
**Every open finding now has an explicit decision recorded** — F-22,
F-27, F-30, F-32 Resolved; F-31, F-33 explicitly deferred. Only
`AC-WARRANTY-001-03`'s 90-day-window question remains a genuinely
undecided open item.
Every
development session should close out per
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md), which is
what keeps this section current.

---

## 1. Overall Health

The documentation chain (`docs/01-requirements/` … `docs/07-traceability-matrix/`)
is internally consistent and current — **`RAISE-TRACEABILITY-MATRIX.md` is
at v1.1: all 10 traceability gaps identified across this project's
history are closed** and re-verified against real file content, not just
re-asserted. The gap between "documented" and "built" is real but honestly
tracked: several of the platform's MVP domains have a full
backend-to-frontend implementation, verified by formal test execution;
the rest is either genuinely blocked on an open PRD/business question
(F-31/F-32/F-33, `AC-WARRANTY-001-03`, and the still-separate auth
mechanism/role-matrix question underlying F-30's now-resolved
infrastructure half) or intentionally out of MVP scope (Roadmap).

## 2. Deliverable Chain Document Versions

| Document | Version | Notes |
|---|---|---|
| [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) | 0.11 | Draft for Requirement Review — Warranty field list resolved (Resolved Question 40) |
| [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) | 0.9 | §13 Executive Intelligence corrected to as-built dashboard (F-22, 2026-08-31) |
| [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) | 0.9 | P-005 corrected to real Category→Type breakdown (F-27, 2026-09-01) |
| [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) | 0.8 | AC-ASSET-002 resolved, new AC-ASSET-002-03 (F-27, 2026-09-01) |
| [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) | 0.8 | TS-ASSET-002 resolved and closed (F-27, 2026-09-01) |
| [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) | 0.10 | 63 test cases; TC-ALERT-001-01/-02 both PASS (F-32, 2026-09-01) |
| [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md) | 1.2 | Gap 11 closed (F-32, R-16) — build-gap scope only, F-05 trigger-rule question unaffected |
| [`RAISE-HIGH-LEVEL-ARCHITECTURE.md`](../08-architecture/RAISE-HIGH-LEVEL-ARCHITECTURE.md) | — | As-built, not versioned against PRD chain |
| [`RAISE-API-DB-SPEC.md`](../09-api-db-spec/RAISE-API-DB-SPEC.md) | — | As-built |
| [`RAISE-DETAILED-DESIGN.md`](../10-detailed-design/RAISE-DETAILED-DESIGN.md) | — | As-built |

## 3. Domain Build Status

### Backend domains (`go-template-main`, PostgreSQL-backed, real endpoints)

| Domain | Requirement | Status |
|---|---|---|
| Asset Registry | `RAISE-FR-ASSET-001` | ✅ Built, **PASS on all 6 test cases** per formal test execution 2026-08-26/-27 — list/search/row-click/detail-isolation, the Category filter (F-23), and Asset Detail's Financial/Lifecycle sections (F-24) all fixed and verified |
| Category & Hierarchy | `RAISE-FR-ASSET-002` | ✅ Built, **PASS** per formal test execution 2026-08-26 and 2026-09-01 — category *display* is consistent across screens, and the "By Category" tab inside Asset Management (`/assets`) now nests 2 levels deep: Category → Type → individual assets (**F-27 resolved, R-14**: sub-category = the existing `type` field, no new field/data model). Expanding a category reveals its real Type sub-groups (e.g. "IT Hardware" → Laptop/Monitor/Headphones); expanding a Type reveals its individual assets |
| Asset Assign / Check-in | `RAISE-FR-ASSET-003` / `RAISE-FR-OPS-002` | ✅ Built, **PASS on all test cases for both requirements** — `RAISE-FR-ASSET-003` (3/3, 2026-08-26/-27, F-26 fixed: History tab renders from the same audit trail `RAISE-FR-AUDIT-001` builds, append-only) and `RAISE-FR-OPS-002` (3/3, 2026-08-28: Assign functions as the app's Check-out affordance, Check-in restores Available, both create Audit Log entries) |
| Employee | supports `RAISE-FR-ASSET-003` | ✅ Built |
| Warranty | `RAISE-FR-WARRANTY-001` | ✅ Built (partial), **PASS (partial)** per formal test execution 2026-08-29 — field list resolved (F-01, `warrantyExpiry` only), implemented as a "Warranty" column on the Assets Registry list (`TC-WARRANTY-001-01/-02` pass), not a standalone P-010 screen (per user direction). The "Expiring" timeline state (3rd of 3) is not implemented — depends on `AC-WARRANTY-001-03`'s still-unconfirmed 90-day-style threshold |
| Maintenance / Ticket | `RAISE-FR-MAINT-001` | ✅ Built, **PASS on all 9 test cases** per formal test execution 2026-08-28 — all 4 stage transitions (submit/approve/reject/dispatch/status-update/complete) work correctly, the record list shows date/cost per record (F-28 fixed), and the stage-progress indicator now visually distinguishes Current from Pending (F-29 fixed). SLA/vendor/cost model remain separately TBD |
| Auth | supports `RAISE-NFR-SEC-RBAC-001` | 🟡 Built, demo-only — backend is a hardcoded single user, no real user store (Roadmap-confirmed, F-11/F-12). Frontend **PASS on all 3 test cases** per formal test execution 2026-08-29/2026-09-01 — `TC-LOGIN-03` (access-denied) PASS; `TC-LOGIN-01`/`-02` (valid/invalid login) now **PASS** (F-30 resolved, R-15) via a new `MockAuthRepository` (4 demo accounts, one per Role) gated by `AUTH_API_ENABLED`. This resolves the infrastructure/testability gap only — the production auth mechanism and role/permission matrix content (PRD §16 Q21–Q22) remain undefined |
| QR / Barcode lookup | `RAISE-FR-OPS-001` | ✅ Built, PASS on all test cases — [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29) + a follow-up F-21 fix (see `DEVELOPMENT-LOG.md` for the PR number once shipped). `GET /assets/:id` resolves by `code` too (dual lookup); real QR generation + Scan QR flow live on both Assets list and Asset Detail. `TC-OPS-001-01..03` all **PASS** — the invalid-code state (F-21) is fixed via a plausible-code-format check before lookup |
| Audit Log | `RAISE-FR-AUDIT-001` | 🟡 Built — [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31) (Asset domain) + [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35) (Ticket domain). `GET /audit-logs` + recording on Asset create/assign/check-in and Ticket create/approve/dispatch/status-update. No update/delete path exists (immutability by omission). The testable subset of `TC-AUDIT-001-01..03` **PASSED** formal execution 2026-08-26; field taxonomy and the audit-review role gate remain TBD (unchanged, blocked on PRD) |
| Executive Dashboard KPIs (first cut) | `RAISE-FR-EXEC-001` | ✅ Built, **PASS** per formal test execution 2026-08-31 — [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33). `GET /dashboard/stats` computes status counts, expired-warranty count, and department/type distribution from real Asset data. Software License count still comes from the frontend's mock license service (no backend License table exists — Roadmap-only). **F-22 resolved (R-13)**: the full chain (Design/Prototype/AC/Test Plan/Test Cases/Traceability Matrix) was corrected to document the actually shipped 8-tile KPI grid / 10-section dashboard, then re-executed against the real app — all cases **PASS** (`TC-DASH-01..03`/`TC-EXEC-001-01..02`). NBV/Risk/Utilization is retained as a documented, not-yet-scheduled enhancement (PRD §16 Q3/Q4/Q29 TBD), tracked separately as **F-03** — presence-check for its absence passes (`TC-DASH-03`), but building it remains blocked on that formula question |
| Oracle FA Integration | `RAISE-FR-ORACLE-001` | 🔴 Integration method/mapping/sync/security all TBD (F-04), **and `TC-ORACLE-001-01..04` FAILED formal execution 2026-08-29** — the `/reconciliation` route renders a generic "foundation placeholder" `EmptyState` (`frontend/src/pages/_shared/ModulePage.tsx`), not an actual Financial View screen; no field or state from `AC-ORACLE-001-01..04` exists at all. **Explicitly deferred by user decision 2026-09-01 (F-31)** — no placeholder-vs-real Financial View will be built until real Oracle FA integration lands |
| Alerts | `RAISE-FR-ALERT-001` | ✅ Built (scoped), **PASS (partial)** per formal test execution 2026-09-01 — the "Notification Center" route (`/notifications`) now renders a real Alerts screen (`frontend/src/pages/Alerts/index.tsx`) instead of the app's generic 404. Scoped to the one alert-triggering condition already confirmed elsewhere (expired warranty); severity rendered honestly as "Not yet defined" since severity/trigger rules for any other condition remain TBD (**F-05**, unaffected — see `OPEN-FINDINGS.md`). The header bell-icon dropdown across other pages remains hardcoded empty, a separate smaller-scope item |
| Natural Language Search | `RAISE-AI-SEARCH-001` | 🔴 Citation precision/format TBD (F-06), **and `TC-AI-SEARCH-001-01..03`/`TC-AI-STATES-01..05` (all 8) FAILED formal execution 2026-08-29** — the header "AI Assistant" drawer accepts no input (static placeholder only); the Assets page's "Ask AI" box is a hardcoded keyword-to-filter matcher (legacy ESAPS content), not a natural-language answer engine, and exhibits none of the 5 required response states. **Explicitly deferred by user decision 2026-09-01 (F-33)** — no canned-answer engine will be built until real AI backend integration lands |
| Document Intelligence | `RAISE-AI-DOC-001..004` | Confidence thresholds / field lists / matching rules undefined |
| Asset Lifecycle Connectivity | `RAISE-FR-LIFE-001` | Partially blocked; Disposal stage confirmed Roadmap |
| User/Role Management | supports `RAISE-NFR-SEC-RBAC-001` | Backend RBAC enforcement confirmed Roadmap, not MVP |

## 4. Checkpoint Backlog

Triaged against [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
§3–§5 — re-check that file before picking an item, it may have changed.

**Buildable now:** None remaining — F-22 (R-13, 2026-08-31), F-27
(R-14, 2026-09-01), F-30 (R-15, 2026-09-01), and F-32 (R-16, 2026-09-01)
are all closed: spec corrected/confirmed, implemented, and re-executed,
all cases PASS. Warranty (F-01) is implemented (Assets Registry column,
R-12) as of the 2026-08-26 Asset-domain sweep, the 2026-08-28
TS-OPS-002/TS-MAINT-001 sweep, and the 2026-08-29 TS-LOGIN sweep —
F-23 through F-29 are all now fixed (R-06 through R-11). F-31 (Oracle
FA Financial View) and F-33 (AI Assistant) are both **explicitly
deferred by user decision 2026-09-01** — "decided not to build yet"
items, not unanswered questions. Only `AC-WARRANTY-001-03`'s
90-day-window question remains a genuinely undecided open item — every
finding now has an explicit decision recorded, none is a "buildable
now" engineering task.

**Needs a scoped-down first cut:** None remaining — Audit Log (PR #31 +
#35, now covering both Asset and Ticket domains) and Executive Dashboard
(PR #33) were the last items in this category, both now built to the
extent possible without inventing TBD content. Nothing further is
currently drawable on Executive Dashboard's NBV/Risk KPI formulas without
a business decision (§16 Q3/Q4).

**Blocked on a business decision:** Oracle FA Integration mechanism
(F-04), Natural Language Search citation format (F-06), Document
Intelligence, User/Role Management backend (RBAC enforcement itself is
Roadmap-confirmed, not just TBD). Alerts' trigger-rule/severity
question (F-05) remains open, but the build gap itself (F-32) is now
resolved with a scoped implementation. F-31 and F-33's build gaps are
explicitly deferred, not awaiting a decision. Warranty's field list is
resolved (F-01, 2026-08-29,
`warrantyExpiry` only) — only `AC-WARRANTY-001-03`'s separate 90-day-
window rule remains open.

**Explicitly out of scope (Roadmap/Pilot):** License Management, AI
Decision Center, Risk Scoring, Lifecycle Prediction, Asset Disposal,
real-time ERP integration, native mobile app, predictive analytics,
workflow automation, multi-channel alerts.
