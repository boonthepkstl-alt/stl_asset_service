# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-09-04, after `CHECKPOINT-2026-09-04-006` (PR #97 — **Gap
16 implemented and formally executed**: all five alert conditions now
derive with their confirmed severities, and `TC-ALERT-001-03..10` were
executed against the real running app on merged `main` `c2e6b76` with
**7 PASS, 1 BLOCKED**). **`RAISE-FR-ALERT-001` remains `PASS (partial)`
and Gap 16 remains OPEN** — not because anything is unbuilt, but because
`TC-ALERT-001-09` proved unexecutable as written (**F-42 / Gap 18**), and
no gap closes while a case in its scope is unexecuted. The preceding
milestone was `CHECKPOINT-2026-09-04-005` (PR #95 —
**F-05 resolved (R-23)**: alert trigger rules and severity confirmed by
business and propagated through all seven chain documents; PRD 0.15 →
Matrix 1.9). **This is the first work in several sessions that advances
requirement coverage** — but it is **specification only**, and
`RAISE-FR-ALERT-001` deliberately stays `PASS (partial)` because four of
the five confirmed conditions are still unbuilt (**Gap 16**, open). The
preceding milestone was `CHECKPOINT-2026-09-04-004` (PR #93 — raw Go
error text removed from all 5xx response bodies, closing **F-19** as
**R-22**). **At that point every 🟢 item then in the backlog was
closed** — F-14 (CI), F-18 (bundle size) and F-19 (error hygiene) — and
all three advanced **zero** requirement coverage. That is no longer the
current state: resolving F-05 opened **Gap 16**, which *is* buildable and
*does* advance coverage. The preceding
milestone was `CHECKPOINT-2026-09-04-003` (PR #91 — route-level code
splitting, closing **F-18** as **R-21**; entry chunk 694 KiB → 305 KiB,
−56%), and before that
`CHECKPOINT-2026-09-04-002` (PR #89 — **the project's first CI
pipeline**, closing **F-14** as **R-20**), and before it `CHECKPOINT-2026-09-04-001` (PR #87 — the
Edit Identity modal converted to a full page, **completing the
modal→full-page conversion begun in PR #78: no record-creation or
record-editing form in the app is a modal any more**). **The most recent
work is the PR #78–#93 series covering the Employee form, a round of
user-driven UI/IA corrections, the CI pipeline, route-level code
splitting, and backend error-response hygiene — see the dedicated paragraph at the end of
this preamble, which is the newest item here.** Re-verified live this
close-out pass, on merged `main` at `c2e6b76`: frontend
`npx tsc --noEmit` clean, `npm run lint` clean (0 warnings),
`npm run build` clean, `npm run test` — **49 test files / 250 tests
passing**; backend `go build ./...`, `go vet ./...`, `go test ./...` all
clean. **This is now verified automatically as well**: the CI workflow
PR #89 added ran green on `main` itself (most recently run
`33851908649`, event `push`, sha `449a751`, both jobs) — not merely on the
PR branch, which is the evidence F-14's closure rests on. **`gofmt` is
deliberately not part of either the local or the CI gate**: the repo
stores Go sources with CRLF line endings and has no `.gitattributes`, so
`gofmt -l` lists every file in the module — a pre-existing repo-wide
condition confirmed by `gofmt -d`, not a formatting defect in any file
this series touched.
The immediately preceding milestone was `CHECKPOINT-2026-09-03-002`
(PR #76 — IT Hardware Assignment Approval Workflow's 3 handover nav
items consolidated into one "Asset Handovers" page with role-aware tabs,
per direct user feedback on the sidebar's IA). That feature is shipped
full-stack and live-verified: backend (PR #72,
`CHECKPOINT-2026-09-02-004`), frontend UI (PR #74,
`CHECKPOINT-2026-09-02-006`), deliverable-chain sync (PR #75,
`CHECKPOINT-2026-09-03-001`), and nav consolidation (PR #76,
`CHECKPOINT-2026-09-03-002`) — plus a docs-only close-out for PR #72
itself (PR #73, `CHECKPOINT-2026-09-02-005`). The
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
**R-17 (Warranty "Expiring" threshold) is now Resolved (2026-09-01)** —
per confirmed business decision, the threshold is **per-Asset-Category
configurable**, not a single global constant, defaulting to **90 days
for all 5 current categories**, admin-adjustable via a new Settings
screen (P-018). Recorded as PRD §16 Resolved Question 41 and propagated
through the full chain: `RAISE-DESIGN.md` v0.10 (§5.2 3-state model +
new §5.4 Settings Domain), `RAISE-PROTOTYPE.md` v0.10 (P-010 rewritten +
new §23A P-018 Settings), `RAISE-ACCEPTANCE-CRITERIA.md` v0.9
(AC-WARRANTY-001-03 rewritten + new -04/-05/-06), `RAISE-TEST-PLAN.md`
v0.9 (TS-WARRANTY-001 fully unblocked), `RAISE-TEST-CASES.md` v0.11 (6
test cases, `TC-WARRANTY-001-01..05` PASS, `-06` written but not yet
executed). Implemented same day: `frontend/src/lib/warranty.ts`'s
`getWarrantyStatus` 3-state function, a new `WarrantySettings` record,
the Warranty badge on Assets list/Asset Detail updated to 3-state, and a
new Settings "Warranty" section. Live-verified: setting IT Hardware's
threshold to 5000 flags only IT Hardware assets as "Expiring" on both
Assets list and Asset Detail, while an unrelated Mobile-category expired
asset stays "Expired" — no cross-category leakage. 2 new automated tests
(149→151), full suite passing, `tsc`/lint clean.
`RAISE-TRACEABILITY-MATRIX.md` reached **v1.3** — Gap 12 opened and
closed same revision. **Not resolved by this fix:** `TC-WARRANTY-001-06`
(non-admin denial to the new Settings screen) is written but not yet
executed — tracked as **F-34** (Gap 13, still open).
**With this resolved, the only genuinely undecided open item from the
prior standing backlog is closed** — remaining open findings are either
standing Blocking/Unresolved/Infrastructure items unrelated to this
session's work, or explicitly deferred (F-31, F-33).
**R-18 (F-34, `TC-WARRANTY-001-06`) is now Resolved (2026-09-01)** —
executing the last unexecuted Warranty test case surfaced a real defect:
`frontend/src/App.tsx`'s Settings route wasn't actually gated to ADMIN,
sitting in the general authenticated-user route block instead of the
existing `ProtectedRoute allowedRoles={['ADMIN']}` block that already
gates Administration/User/Role Management. Fixed by moving it into that
block — no new RBAC mechanism invented. 2 new tests in `App.rbac.test.tsx`
pass; full suite 153/153 (was 151), `tsc`/lint clean. Live-verified: an
EMPLOYEE-role user hitting `/settings` sees the real "403 — Access
denied" page; ADMIN access is unaffected. `RAISE-TEST-CASES.md` (v0.12)
`TC-WARRANTY-001-06` now PASS; `RAISE-TRACEABILITY-MATRIX.md` reached
**v1.4** — Gap 13 closed, `RAISE-FR-WARRANTY-001` now a full,
unqualified **PASS** (all 6 test cases). **Every open finding in the
standing backlog is now either Resolved or explicitly deferred — no
coverage gaps remain.**
**`RAISE-COMPLIANCE-REVIEW.md` drafted (2026-09-01)** — the deliverable
chain's first artifact consuming real source code, per `CLAUDE.md`'s
diagram (`docs/11-compliance-review/RAISE-COMPLIANCE-REVIEW.md` v1.0).
Consolidates `RAISE-TRACEABILITY-MATRIX.md` v1.4 into a per-requirement
verdict table: of 17 MVP requirements, 8 full `PASS`, 1 `PASS (partial)`,
2 `FAIL` (both explicitly deferred by business decision, not silent
defects), 1 `BLOCKED (partial)`, 1 `BLOCKED`, 4 `BLOCKED (full)` — no
new test execution was performed, this is a consolidation/verdict layer
only.
**F-02 (Check-in/Check-out workflow shape, permission gate, Custody
holder data model) is now Resolved (R-19, 2026-09-01)** — all three
confirmed answers matched already-built, already-tested behavior
exactly, so **no code change was required**: (1) immediate state-change,
no approval workflow; (2) any authenticated user, no role restriction;
(3) direct 1:1 Employee link for the holder model. Recorded as PRD §16
Resolved Question 42, propagated through the full chain (`RAISE-DESIGN.md`
v0.11, `RAISE-PROTOTYPE.md` v0.12 — a mid-session drafting overreach on
a separate, unconfirmed question was caught and corrected same-session,
see R-19's full record — `RAISE-ACCEPTANCE-CRITERIA.md` v0.10,
`RAISE-TEST-PLAN.md` v0.10, `RAISE-TEST-CASES.md` v0.13). `TC-OPS-002-01..03`
reclassified from partially-blocked to fully PASS, reusing the existing
2026-08-28 execution evidence — no new test run was needed or claimed.
`RAISE-TRACEABILITY-MATRIX.md` reached **v1.5** — Gap 14 opened and
closed same revision. **Explicitly unaffected:** Open Finding F-10
(Custody History write-path exclusivity) and Open Finding F-08 (general
RBAC role/permission-matrix content for other domains) both remain
genuinely open — neither was touched by this resolution.
Every
development session should close out per
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md), which is
what keeps this section current.
**IT Hardware Assignment Approval Workflow backend implemented
(`CHECKPOINT-2026-09-02-004`)** — per PRD §16 Resolved Question 43, a real
4-stage approval workflow (Initiation → Recipient Confirmation → IT
Processing → IT Supervisor Approval), scoped only to assigning IT Hardware
category assets; all other categories and Check-in unaffected. Backend-only
(new Asset Handover domain in `go-template-main`, 6 new endpoints, new
`V5__AssetHandovers_Table.sql` migration) — implemented, `go build`/`vet`/
`test` clean, 24 new unit tests passing, and live-verified end-to-end
against the real Docker stack (all 4 stages, both rejection points, the
non-IT-Hardware regression guard). `TC-OPS-002-04..09` now `PASS` (backend/
API-level scope).
**The frontend then shipped the same day (PR #74, `CHECKPOINT-2026-09-02-006`)** —
full UI for all 4 stages (My Pending Assignments / IT Processing Queue /
IT Supervisor Approval Queue at the time, plus `HandoverDetail`'s governance
indicator), `AssetDetail`'s Assign button intercepting IT Hardware assets,
client-side role-gated routes, 3 real bugs found and fixed by a
self-initiated code review before merge, 47 test files / 196 tests passing,
live-verified end-to-end through the real UI. **PR #75** then synced
`RAISE-TEST-CASES.md`/`RAISE-TRACEABILITY-MATRIX.md` (v1.7 → v1.8) to
remove the now-stale "backend/API-level scope only" caveat. **PR #76**
(2026-09-03) then consolidated the 3 separate nav items into one "Asset
Handovers" page with role-aware tabs, per direct user feedback on the
sidebar's IA — following the same single-nav-item precedent already
established by the Maintenance/Ticket domain. **The feature is now
✅ Complete for its currently confirmed MVP scope** (backend + frontend +
consolidated nav, all shipped, tested, and live-verified) — explicitly
**not** including Stage 2 e-signature, the Stage 2 recipient-decline path,
backend RBAC enforcement, or Custody History write-timing across the 4
stages, all of which remain outside the confirmed scope, not gaps in what
was promised. See `CHECKPOINT-2026-09-02-005`/`-006` and
`CHECKPOINT-2026-09-03-001`/`-002` for the full per-PR record.
**Employee form capability + user-driven UI/IA corrections, PRs #78–#87
(2026-09-03 → 2026-09-04, `CHECKPOINT-2026-09-03-003` through
`-2026-09-04-001`)** — three arcs. **Arc 1 (#78–#81), Create Employee:** the modal became a
full page (#78), gained duplicate-checking on Work Email and Phone (#79),
gained an optional Employee Code field (#80), and gained real format
validation for that code (#81). Three things from this arc matter beyond
the UI. First, a **much larger field-set proposal was declined, not
deferred silently** — several proposed fields already existed, the rest
were unconfirmed scope, and **Matrix Manager directly contradicts a
recorded PRD business rejection**; nothing was invented. Second, #80
**found and fixed a real backend parity gap**: `EmployeeService.CreateEmployee`
always overwrote a client-supplied code, unlike its `AssetService`
sibling, which would have made the new field purely cosmetic. Third,
**the business confirmed the company's real Employee ID convention on
2026-09-03**: exactly 8 digits, first 2 = the Gregorian join year, the
remaining 6 issued by HR and **not derivable by RAISE** — so the
confirmed scope is validate-on-input only, explicitly not
auto-generation. That is shipped, but seed fixtures and the backend
fallback still emit the legacy `EMP-…` form the new check rejects, so
`CHECKPOINT-2026-09-03-006` is **🟡 Partial, not ✅** — tracked as new
finding **F-36**. Username/password provisioning for employees was also
raised and **deferred** (new finding **F-37**) — `User` and `Employee`
are deliberately unlinked, auth mechanism is TBD (F-08), and no user
table exists (F-11). **Arc 2 (#82–#84), corrections from direct user
review:** both Create forms were **flattened from wizards to single-page**
(#82) after the user questioned the wizard premise and measured field
counts confirmed it — 13 fields with two 3-field steps — which
**deliberately reverses #78's pattern choice** (recorded as reasoning,
not churn: #78 correctly copied the codebase's existing pattern; the
pattern itself was what proved unjustified); the global "New Asset"
button was removed from the app header (#83); and breadcrumbs became
clickable with a "Home" root (#84), which **surfaced a latent bug** —
`href` had been in the breadcrumb prop type all along and ~9 pages were
passing real values, but the renderer ignored it entirely, so every one
of those hrefs was dead code. **Arc 3 (#86–#87), closing the loops the
first two left open:** #84's fix had **no test coverage** — the very gap
that let those hrefs go dead — so #86 added 6 breadcrumb regression
tests, each **mutation-tested** against the original bug to prove it
genuinely fails, plus the `aria-label="Breadcrumb"` landmark those tests
need to distinguish the trail from identically-labelled sidebar items.
#87 then converted the **Edit Identity & Organization** modal into a full
page at `/employees/:id/edit`, **completing the modal→full-page
conversion #78 began — no record-creation or record-editing form in the
app is a modal any more**. #87's own max-effort code review produced
**9 findings, 7 fixed before merge**, two of them substantive rather than
cosmetic: audit rows were being written into the demo fixture **even with
`EMPLOYEE_API_ENABLED` on** (which would have shown client-invented
entries indistinguishable from real backend ones), and the phone
duplicate check treated a **failed** employee-list request as "no
duplicate found", silently disabling the validation. The remaining 2 were
**deliberately not fixed** and are tracked as **F-38** (deferred tech
debt — the Employee audit trail is a mock-mode fixture shim; the real fix
is a backend endpoint, not hardening scaffolding) and **F-39**
(**product decision required** — "Modify Specs" routes to a page with no
spec fields; add the fields or remove the button, undecided). Every PR
across all three arcs was live-verified through the actual UI before
merge. **No `RAISE-FR-EMP-*` requirement exists in the PRD at all** —
Employee appears only incidentally under `RAISE-FR-ASSET-003` and
`RAISE-FR-OPS-002` — so most of this session's work traces to **no
governing FR** and is recorded that way rather than mapped to an invented
requirement.

---

## 1. Overall Health

The documentation chain (`docs/01-requirements/` … `docs/07-traceability-matrix/`)
is internally consistent and current — **`RAISE-TRACEABILITY-MATRIX.md` is
at v1.8: all 15 traceability gaps identified across this project's
history are closed** and re-verified against real file content, not just
re-asserted. `docs/11-compliance-review/RAISE-COMPLIANCE-REVIEW.md` v1.0
(2026-09-01) consolidates the whole chain into a per-requirement verdict:
8 of 17 MVP requirements a full unqualified `PASS`, 1 `PASS (partial)`,
2 `FAIL` (both explicitly deferred by business decision — F-31/F-33), and
6 `BLOCKED`/`BLOCKED (partial)` — each waiting on a specific, already-
identified Blocking finding (F-03–F-09; F-02 resolved 2026-09-01, R-19)
rather than an engineering task. This is the single most current, evidence-
linked answer to "what's left" — see it directly rather than this
paragraph, which is a summary of a summary and can drift.

## 2. Deliverable Chain Document Versions

| Document | Version | Notes |
|---|---|---|
| [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) | 0.14 | IT Hardware Assignment Approval Workflow — category-scoped exception to RAISE-FR-OPS-002 (Resolved Question 43, 2026-09-02) |
| [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) | 0.12 | §4.2 extended with the 4-stage IT Hardware handover approval workflow (2026-09-02) |
| [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) | 0.13 | P-008 updated for the handover approval workflow (2026-09-02) |
| [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) | 0.11 | AC-OPS-002-04..09 added for the IT Hardware handover approval workflow (Resolved Question 43, 2026-09-02) |
| [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) | 0.11 | TS-OPS-002 extended to 9 cases for the handover workflow (2026-09-02) |
| [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) | 0.16 | 72 test cases; `TC-OPS-002-04..09` PASS, full-stack scope (backend PR #72 + frontend PR #74, both live-verified) — "backend/API-level scope only, no frontend UI yet" caveat removed 2026-09-03 (PR #75) |
| [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md) | 1.8 | Gap 15 (IT Hardware handover approval) closed — `TC-OPS-002-04..09` PASS, full-stack scope recorded (PR #75, 2026-09-03) |
| [`RAISE-HIGH-LEVEL-ARCHITECTURE.md`](../08-architecture/RAISE-HIGH-LEVEL-ARCHITECTURE.md) | — | As-built, not versioned against PRD chain |
| [`RAISE-API-DB-SPEC.md`](../09-api-db-spec/RAISE-API-DB-SPEC.md) | — | As-built |
| [`RAISE-DETAILED-DESIGN.md`](../10-detailed-design/RAISE-DETAILED-DESIGN.md) | — | As-built |

## 3. Domain Build Status

### Backend domains (`go-template-main`, PostgreSQL-backed, real endpoints)

| Domain | Requirement | Status |
|---|---|---|
| Asset Registry | `RAISE-FR-ASSET-001` | ✅ Built, **PASS on all 6 test cases** per formal test execution 2026-08-26/-27 — list/search/row-click/detail-isolation, the Category filter (F-23), and Asset Detail's Financial/Lifecycle sections (F-24) all fixed and verified |
| Category & Hierarchy | `RAISE-FR-ASSET-002` | ✅ Built, **PASS** per formal test execution 2026-08-26 and 2026-09-01 — category *display* is consistent across screens, and the "By Category" tab inside Asset Management (`/assets`) now nests 2 levels deep: Category → Type → individual assets (**F-27 resolved, R-14**: sub-category = the existing `type` field, no new field/data model). Expanding a category reveals its real Type sub-groups (e.g. "IT Hardware" → Laptop/Monitor/Headphones); expanding a Type reveals its individual assets |
| Asset Assign / Check-in | `RAISE-FR-ASSET-003` / `RAISE-FR-OPS-002` | ✅ Built, **PASS on all test cases for both requirements, full stack** — `RAISE-FR-ASSET-003` (3/3, 2026-08-26/-27, F-26 fixed: History tab renders from the same audit trail `RAISE-FR-AUDIT-001` builds, append-only) and `RAISE-FR-OPS-002` (9/9, 2026-09-02/-03: base Assign/Check-in 3/3 as before, plus a category-scoped 4-stage approval workflow for IT Hardware assets only — `TC-OPS-002-04..09` PASS, **backend (PR #72) and frontend (PR #74) both implemented and live-verified** against the real Docker stack through the actual UI). **F-02 resolved (R-19, 2026-09-01)**: workflow shape (immediate state-change, no approval step), permission gate (any authenticated user), and holder data model (direct Employee link) all confirmed for the general case — matched already-built behavior exactly, no code change. **PRD §16 Resolved Question 43 (2026-09-02)** confirmed a real 4-stage approval exception scoped only to IT Hardware category assignment; backend shipped PR #72, frontend UI shipped PR #74, deliverable chain synced PR #75, and the 3-page navigation consolidated into one "Asset Handovers" page with role-aware tabs PR #76 (2026-09-03, per direct user feedback on the sidebar's IA). **Out of confirmed scope, not gaps**: backend RBAC enforcement (UI-only/client-side is the explicit pre-existing MVP decision), Stage 2 e-signature (user explicitly dismissed this question), and the Stage 2 recipient-decline path (never asked). Custody History write-path exclusivity (F-10) and general RBAC role content (F-08) remain separately open |
| Employee | supports `RAISE-FR-ASSET-003` | 🟡 Built — CRUD backend plus a full Create Employee page (`/employees/create`, PR #78, flattened to a single-page form in PR #82) with duplicate-checking on Work Email/Phone (PR #79) and an optional Employee Code (PR #80, which also fixed a backend parity gap: `CreateEmployee` previously discarded any client-supplied code, unlike `CreateAsset`), and a full Edit Employee page (`/employees/:id/edit`, PR #87) that replaced the last record-editing modal in the app — same field set and payload as the modal it replaced, exclude-self phone duplicate check preserved. Two items from PR #87's code review are tracked rather than fixed: **F-38** (the Employee audit trail is a mock-mode fixture shim with no backend, and Employee Detail aliases it as state — deferred tech debt) and **F-39** ("Modify Specs" routes to a page with no spec fields — **product decision required**). **Not ✅**: the Employee ID convention confirmed 2026-09-03 (8 digits, first 2 = Gregorian join year, remaining 6 HR-issued and non-derivable by RAISE) is **enforced on input but contradicted by the app's own data** — seed fixtures and the backend auto-generation fallback still emit the legacy `EMP-…` form, which the new check rejects (**F-36**, open). Employee login provisioning is deferred (**F-37**). **No `RAISE-FR-EMP-*` requirement exists** in the PRD to trace any of this to — Employee appears only incidentally under `RAISE-FR-ASSET-003`/`RAISE-FR-OPS-002`, so this domain has **no AC and no `TC-*` coverage**; its only automated coverage is component tests |
| Warranty | `RAISE-FR-WARRANTY-001` | ✅ Built, **full unqualified PASS** per formal test execution 2026-09-01 — field list resolved (F-01), Expiring-threshold configurability resolved (R-17), and the Settings admin-only access gate resolved (R-18, a real defect found and fixed on execution). 3-state Active/Expiring/Expired badge on Assets Registry/Asset Detail, per-Asset-Category configurable threshold (default 90 days) via Settings (P-018), now correctly ADMIN-gated. `TC-WARRANTY-001-01..06` all **PASS** |
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

**Buildable now:** **One, and it is small: correct `TC-ALERT-001-09`'s
procedure and execute it (F-42 / Gap 18).** Gap 16's implementation half
shipped in PR #97 and seven of its eight cases now PASS against the real
app. The eighth cannot run as written — its step 2 says "edit that
Asset's `warrantyExpiry`", but the product has **no asset-edit
capability at all** (`asset-repository.ts` exposes only `create`,
`assign`, `checkIn`). That is a **test-case defect**, not an
implementation or specification defect: the implementation was shown
correct during the same execution by lowering the Expiring threshold
90 → 3 via Settings, which took the alert total 19 → 18 and back.

Re-pointing the case at a state change the product *does* support — for
example completing a maintenance ticket to `DONE` — needs **no business
decision**, and executing it closes **Gap 16**. It is the single item
standing between the current state and that closure.

Everything below this line describes the state *before* F-05 was
resolved and is kept for the contrast it draws:
All three 🟢 items found by the 2026-09-04 discovery have shipped:
**F-14** (CI, PR #89, R-20), **F-18** (code splitting, PR #91, R-21) and
**F-19** (5xx error hygiene, PR #93, R-22). **All three advanced zero
requirement, AC, compliance or traceability coverage** — that is the
backlog's shape, not a selection failure. The one engineering item left
is **F-41**, and it is not buildable-now: it needs a per-site audit to
separate genuine sentinels from wrapped driver errors before it can even
be scoped. Re-derived from scratch on 2026-09-04 after
PR #89 merged, by re-reading the PRD, Design, AC, Test Plan, Traceability
Matrix and Compliance Review against the actual source tree, not by
inheriting the previous run's answer. Full candidate table with
classifications in [`NEXT-STEP.md`](NEXT-STEP.md).

**Neither moves compliance or traceability coverage**, and that is not a
selection failure — it is the actual state: the **traceability matrix is
at v1.8 with all 15 gaps closed**, and *every* non-`PASS` row in the
Compliance Review is blocked on a business decision rather than on
engineering. **The highest-leverage next action is obtaining decisions
(F-05 and F-03 unlock the most), not writing code.**

**F-14 (CI) was the last 🟢 item with real leverage and it is now shipped
(R-20).** The earlier 2026-09-03 entry here — a focused `AppShell`
breadcrumb test — **shipped in PR #86**
(`CHECKPOINT-2026-09-03-010`): 6 tests, each mutation-tested against the
original dead-`href` bug to prove it actually fails, plus the
`aria-label="Breadcrumb"` landmark they need to distinguish the trail
from identically-labelled sidebar items. Nothing has replaced it in this
category. The two findings opened by PR #87 are deliberately **not**
buildable-now: **F-38** is deferred technical debt whose real fix is a
backend audit endpoint (hardening the mock shim in isolation would be
work aimed at code that should be deleted), and **F-39** is a **product
decision**, not an engineering task. Otherwise — `TC-WARRANTY-001-06` (F-34) has been
executed (R-18, 2026-09-01), which caught and fixed a real defect
(Settings wasn't actually ADMIN-gated). Otherwise none remaining — F-22 (R-13, 2026-08-31), F-27
(R-14, 2026-09-01), F-30 (R-15, 2026-09-01), F-32 (R-16, 2026-09-01),
and the Warranty Expiring-threshold question (R-17, 2026-09-01) are all
closed: spec corrected/confirmed, implemented, and re-executed, all
cases PASS. Warranty's field list (F-01) is implemented (R-12) as of
the 2026-08-26 Asset-domain sweep, the 2026-08-28 TS-OPS-002/TS-MAINT-001
sweep, and the 2026-08-29 TS-LOGIN sweep — F-23 through F-29 are all
now fixed (R-06 through R-11). F-31 (Oracle FA Financial View) and F-33
(AI Assistant) are both **explicitly deferred by user decision
2026-09-01** — "decided not to build yet" items, not unanswered
questions. Every finding from the prior standing backlog now has an
explicit decision recorded.

**Needs a scoped-down first cut:** None remaining — Audit Log (PR #31 +
#35, now covering both Asset and Ticket domains) and Executive Dashboard
(PR #33) were the last items in this category, both now built to the
extent possible without inventing TBD content. Nothing further is
currently drawable on Executive Dashboard's NBV/Risk KPI formulas without
a business decision (§16 Q3/Q4).

**Blocked on a business decision:** Executive Dashboard NBV/Risk formulas
(F-03), Oracle FA Integration mechanism (F-04), Alert trigger rules
beyond warranty (F-05), Natural Language Search citation format (F-06),
Document Intelligence (F-07), Auth mechanism / role-permission matrix
content (F-08), full asset master field list (F-09). Alerts' build gap
(F-32) and Warranty's threshold/access-gate items (R-17/R-18) are
resolved with scoped implementations — F-05 and F-08's broader content
questions remain separately open, unaffected. F-31 and F-33's build gaps
are explicitly deferred, not awaiting a decision. **F-02 (Check-in/
Check-out workflow/permission/holder-model) is now resolved (R-19,
2026-09-01)** — matched already-built behavior, no code change; the
adjacent, still-genuinely-open **F-10** (Custody History write-path
exclusivity) is explicitly unaffected. **Two findings added 2026-09-03**
by the PR #78–#84 series: **F-36** — the Employee ID convention is
confirmed and enforced on input, but seed fixtures and the backend
auto-generation fallback still emit the non-conforming legacy `EMP-…`
form; deciding whether to switch them needs a rule for the HR-issued
6-digit portion, which HR owns and RAISE cannot invent (the alternative
is dropping auto-generation entirely). **F-37** — username/password
provisioning for employees, raised and deferred: `User` and `Employee`
are deliberately unlinked, the auth mechanism is TBD (**F-08**), no user
table exists (**F-11**), and the existing invite-based User Management
flow is the safer pattern to extend when this is picked up. **One further
finding added 2026-09-04** by PR #87: **F-39** — Employee Detail's
"Modify Specs" button routes to a page containing **no** workstation/OS
spec fields, so it cannot change anything on the card it belongs to. The
mislabel is pre-existing (the old modal was wired to the same handler and
was equally unable to edit specs) but PR #87 made it costlier, turning an
instant modal into a full route change. Exactly two options, both scope
changes: make the spec fields editable, or remove the button. There is
**no governing requirement to derive either from** — the PRD has no
`RAISE-FR-EMP-*` requirement at all — so this is a genuine product
decision and **must not be picked unilaterally**.

**Resolved 2026-09-04 (three findings, three PRs):** **F-19** (raw Go
error text in 5xx bodies) → **Resolved, R-22**, by PR #93 (`449a751`) —
all 18 sites across 7 controllers now return the human-readable message
only, **0 remain**, proved on the wire by stopping the database and
confirming the body no longer carries the driver's connection error
while the server log still does. Guarded by a mutation-tested
source-level invariant test. **F-18** (bundle size) → **Resolved, R-21**,
by PR #91 (`02ae966`). **F-14** (no CI pipeline) → **Resolved, R-20**,
by PR #89 (merge commit `103e069`) — closed only on evidence that CI runs
green on `main` itself (run `33843149477`, event `push`), not merely that
a workflow file exists. **F-14's image-build/push half is explicitly left
open**: CI validates source only, builds and publishes no images, and
**F-13 (hosting) is untouched**.

**Open engineering items (neither buildable-now nor a decision):**
**F-41**, added 2026-09-04 by PR #93's own validation — some **4xx**
bodies also carry raw driver errors rather than sentinels, confirmed
live (`GET /api/assets/does-not-exist` returns `sql: no rows in result
set`). This **partly contradicts the assumption F-19's 5xx-only scoping
rested on**, which is why it was recorded rather than quietly absorbed.
Not buildable-now: the 28 remaining 4xx sites mix genuine sentinels
(text should stay) with wrapped driver errors (text should go), so it
needs a per-site audit before it can be scoped. Lower severity than
F-19 was. Also **F-40**,
added 2026-09-04 — flaky navigate-away assertions, where a test waits for
a success toast and then asserts the form's unmount *synchronously*
although the toast and route change commit independently. Found three
separate times (PR #87's review in `EditEmployee`; **CI on PR #89** in
`CreateEmployee`; then `CreateAsset` by grepping for the same shape).
All three sites are fixed; kept open as a **pattern to watch**, since
nothing prevents reintroduction and no lint rule covers it. Also
**F-38**, added 2026-09-04 by PR #87 — Employee audit entries have no backend at
all. `pages/EditEmployee` records them by mutating the module-level
`employeeAuditLogs` fixture (correctly gated to `!EMPLOYEE_API_ENABLED`),
and `pages/EmployeeDetail:71` holds that same array as state, so its
`useMemo` can never recompute from a write. Behaviour is correct today
because writes only happen while the detail page is unmounted. The
resolution is a real Employee-field audit endpoint — `go-template-main`
has an `auditController` for the Asset domain (`AUDIT_API_ENABLED`) but
nothing equivalent for Employee — **not** hardening the shim, which
should be deleted rather than improved.

**Explicitly out of scope (Roadmap/Pilot):** License Management, AI
Decision Center, Risk Scoring, Lifecycle Prediction, Asset Disposal,
real-time ERP integration, native mobile app, predictive analytics,
workflow automation, multi-channel alerts.
