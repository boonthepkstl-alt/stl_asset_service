# RAISE Test Cases

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Test Cases
**Version:** 0.10 Draft
**Status:** Draft for Test Case Review
**Source:** [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.8 §7 (Test Suites) + §8 (Blocked Items) + §8.1 (Fully-Blocked Suites — AI Document Intelligence Capabilities) + §3.3 (PRD §10 NFR Backlog — No Suite), expanding [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.8
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

This document expands each test suite in `RAISE-TEST-PLAN.md` §7 into
individual, executable test cases: steps, test data, and expected
result. Every test case traces to exactly one Acceptance Criterion (AC
ID), which in turn traces to a PRD requirement.

Where the underlying AC criterion was marked **NOT TESTABLE YET**, the
corresponding test case here is marked **BLOCKED** and scoped down to
verify only the structural/interaction behavior that *is* defined —
consistent with the per-criterion blocking rule in Test Plan §8.

Two distinct BLOCKED markings are used, matching Test Plan §7/§8/§8.1:

- **BLOCKED (partial)** — the AC criterion (or suite) has *some*
  structural/interaction behavior that is defined and testable now; the
  test case executes that narrower scope while explicitly excluding the
  unresolved part (e.g., tile presence is testable, tile value/formula is
  not).
- **BLOCKED (full)** — the AC criterion's *entire* Given/When/Then is
  marked NOT TESTABLE YET in the source AC document, with no fallback
  structural behavior available to test, because the capability itself
  has no concrete UI element defined anywhere in the prior-stage
  documents (only a reserved screen location). No test steps can be
  written; the row exists solely to preserve 1:1 AC-to-TC traceability
  and to be re-verified at each L5 Traceability Regression run (Test Plan
  §4, §8.1). `TS-AI-DOC-001`–`TS-AI-DOC-004` (§18.1–§18.4 below) are the
  first instance of BLOCKED (full) in this document.
- **BLOCKED (pending implementation)** — a distinct third marking, first
  used for `TC-ASSET-002-03` (§7, added 2026-09-01, Open Finding F-27) and
  **closed the same day** once the blocking UI code change shipped and a
  formal execution sweep confirmed the built behavior (§7) — it currently
  has zero active occurrences in this document, but the marking itself is
  retained here for any future case in the same situation. Unlike the two
  markings above, it is **not** driven by an unresolved PRD Open Question
  or an AC criterion marked NOT TESTABLE YET — the underlying AC criterion
  is fully specified and testable as written. The block exists solely
  because the UI behavior it describes has not yet been built. Test steps
  are still written in full (the behavior to verify is well-defined), but
  the case cannot be executed until the corresponding code change ships;
  no PASS/FAIL claim may be made until a subsequent formal execution sweep
  confirms the built behavior against those steps — exactly what happened
  for `TC-ASSET-002-03` (§7): the shipped "By Category" view was extended
  to nest one level deeper (Category → Type → individual assets), and
  formal execution against the real running app confirmed the described
  behavior, so the case is now closed with a **PASS** result and is no
  longer BLOCKED.

---

## 2. Test Case ID Convention

```text
TC-<same-suffix-as-AC-ID>
```

e.g. `AC-ASSET-001-01` → `TC-ASSET-001-01`. This keeps AC ↔ TC mapping
1:1 and mechanical — no test case exists without a matching AC criterion,
and no AC criterion is left without a test case.

---

## 3. TS-LOGIN Test Cases

**Suite:** TS-LOGIN · **AC Group:** AC-LOGIN · **Requirement:** Security Design (TBD) · **Screen:** P-001

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-LOGIN-01 | Valid login grants access | 1. Open Login screen. 2. Enter valid credentials. 3. Submit. | One valid credential set | User is granted access to the platform | **BLOCKED** — auth mechanism undefined (PRD §16 Q21). Verify only that a "valid" path leads to access; exact credential type TBD. |
| TC-LOGIN-02 | Invalid login shows error | 1. Open Login screen. 2. Enter invalid credentials. 3. Submit. | One invalid credential set | Error state is shown; access denied | **BLOCKED** — same as above |
| TC-LOGIN-03 | Unauthorized area shows access-denied | 1. Log in as a user without permission for a target area. 2. Navigate to that area. | One low-privilege user | Access-denied state is shown | **BLOCKED (partial)** — role/permission model undefined (PRD §16 Q22). **RBAC MVP enforcement level confirmed (2026-08-21, PRD §16 Resolved Question 38; Design §16):** a UI-only/client-side permission check is confirmed acceptable for MVP (backend enforcement deferred to Enterprise Roadmap) — this fixes only *where* the access-denied check runs, not *what* the roles/permissions are; Q22 (role list, permission matrix contents, authentication mechanism) remains fully open. This case verifies only that an access-denied state exists and is shown for *some* unspecified permission gate, not that any named role is correctly gated. |

---

## 4. TS-DASH Test Cases

**Suite:** TS-DASH · **AC Group:** AC-DASH · **Requirement:** Product / Dashboard · **Screen:** P-002

**Status Note — Corrected 2026-08-31 to match `RAISE-TEST-PLAN.md` v0.7 / `RAISE-ACCEPTANCE-CRITERIA.md` v0.7
([Open Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question)):**
`TC-DASH-01`–`-03` previously asserted the stale "Asset Overview" wireframe (Total
Assets/NBV/Risk/Warranty Expiry tiles; "Asset by Category"/"Lifecycle / Maintenance
Overview"/"Recent Alerts" sections). Formal test execution on 2026-08-29 confirmed none of
that wireframe was ever built. Per explicit business decision on F-22, all three cases
below are rewritten against the actually shipped `frontend/src/pages/Dashboard/index.tsx`
page (`RAISE-PROTOTYPE.md` §8; `RAISE-ACCEPTANCE-CRITERIA.md` §5). This is a scope/spec
correction to match reality, not a new requirement, and **does not itself report a new
PASS/FAIL execution result** — re-running formal execution against the rewritten steps
below is deferred to a future execution sweep.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-DASH-01 | KPI grid displays all eight tiles | 1. Log in. 2. Land on Dashboard (P-002). | Any asset/maintenance/warranty/license dataset | The KPI grid displays all eight tiles: Total Assets, Available, Assigned, In Maintenance, Expired Warranty, Software Licenses, Monthly Depreciation, and Monthly Cost | No — fully testable against the as-built page (Open Finding F-22). Presence only: Monthly Depreciation and Monthly Cost are explicitly **illustrative** (Prototype §8 — no depreciation model has been built), and none of the eight tiles has a PRD-defined field list, formula, or threshold beyond what the page computes from existing data; this case asserts the tiles are *displayed*, not that their figures are correct. |
| TC-DASH-02 | Ten dashboard sections display | 1. Ensure asset/maintenance/warranty/license data exists. 2. Land on Dashboard (P-002). | Asset/maintenance/warranty/license dataset covering at least one record relevant to each section | All ten sections are displayed: AI Insights, AI Portfolio Health, Oracle FA Reconciliation, Asset Lifecycle, Department Distribution, Asset Status, Asset Type, Pending Approvals, Recent Activities, and Maintenance Calendar | No — fully testable against the as-built page (Open Finding F-22). Presence only, not calculation/content correctness (`RAISE-ACCEPTANCE-CRITERIA.md` §5 caveat). |
| TC-DASH-03 | NBV/Risk/Utilization tiles confirmed absent from the shipped KPI grid | 1. Land on Dashboard (P-002) with the KPI grid from `TC-DASH-01` displayed. 2. Inspect the grid for tiles labeled NBV, Risk, or Utilization. | Same dataset as `TC-DASH-01` | None of the three PRD-proposal KPIs (`RAISE-FR-EXEC-001`) is present in the shipped grid — this documents today's gap accurately; the expected result is absence, not a target for any of the three to be displayed | **BLOCKED (partial)** — the absence-check itself is testable now and expected to pass structurally against the current build. **NOT TESTABLE YET:** whether/when NBV, Risk, or Utilization tiles should be added to the dashboard, and their formulas, thresholds, and placement, since these remain fully undefined (PRD §16 Q3–Q4, tracked as [Open Finding F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement)) — a separate, not-yet-scheduled enhancement (Prototype §8 "NBV/Risk/Utilization — Proposal KPIs, Not Yet Implemented"). Utilization's *definition* remains separately resolved (2026-08-21, PRD §16 Resolved Question 27 — assignment-time-based, Disposed/Retired/Under-Maintenance excluded from the denominator) and unaffected by this correction; only its dashboard *implementation* is outstanding, so this case must not be read as confirming a Utilization tile is required to pass. |

---

## 5. TS-ASSET-001 Test Cases

**Suite:** TS-ASSET-001 · **AC Group:** AC-ASSET-001 · **Requirement:** `RAISE-FR-ASSET-001` · **Screen:** P-003

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ASSET-001-01 | Asset list displays | 1. Log in with asset-view access. 2. Open Asset Registry. | ≥1 asset record | Asset list is displayed | **BLOCKED (partial)** — list renders; full displayable field set is TBD (PRD §16 Q1) |
| TC-ASSET-001-02 | Search filters list | 1. Open Asset Registry. 2. Enter a search term matching one asset. | ≥2 assets, 1 matching term | Only matching asset(s) shown | No |
| TC-ASSET-001-03 | Category filter narrows list | 1. Open Asset Registry. 2. Apply a category filter. | Assets across ≥2 categories | Only assets in selected category shown | No |
| TC-ASSET-001-04 | Selecting asset opens detail | 1. Open Asset Registry. 2. Click an asset row. | 1 asset record | Asset Detail (P-004) opens for that asset | No |

---

## 6. TS-ASSET-001-DETAIL Test Cases

**Suite:** TS-ASSET-001-DETAIL · **AC Group:** AC-ASSET-001-DETAIL · **Requirement:** `RAISE-FR-ASSET-001` · **Screen:** P-004

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ASSET-001-D-01 | All sections present on Asset Detail | 1. Open an asset's Detail screen. | 1 asset with data in every domain (custody, financial, warranty, maintenance, QR, lifecycle, audit) | Basic Info, Category, Custody, Financial, Warranty, Maintenance, QR/Barcode, Lifecycle, Audit/History sections all present | No |
| TC-ASSET-001-D-02 | Detail shows only selected asset's data | 1. Open Asset A Detail. 2. Open Asset B Detail. | 2 distinct assets with different data | Asset A detail shows only Asset A data; Asset B detail shows only Asset B data | No |

**Note — superseded 2026-08-21 (carried from `RAISE-TEST-PLAN.md` §8.1 /
`RAISE-ACCEPTANCE-CRITERIA.md` §19.5–§19.8):** the prior version of this note stated
that OCR/Extraction, Metadata, Classification, and Duplicate Detection had no
dedicated `RAISE-AI-<DOMAIN>-<NNN>` Traceability ID or AC group. PRD v0.3 §16 Resolved
Question 28 assigned each capability its own ID (`RAISE-AI-DOC-001`–`RAISE-AI-DOC-004`)
at P0/MVP, and AC v0.3 §19.5–§19.8 added a dedicated AC group for each. Corresponding
suites `TS-AI-DOC-001`–`TS-AI-DOC-004` and their placeholder test cases now exist —
see §18.1–§18.4 below — and are **BLOCKED (full)**, not simply absent. Independent of
that change, where these four capabilities' effects are *incidentally* visible on
their host screens (e.g., extracted/normalized fields, de-duplicated records), that
incidental behavior remains covered by `TC-ASSET-001-01`..`04` and
`TC-ASSET-001-D-01`/`-02` above only insofar as those cases already describe it — it
must not be read as a separately verified OCR/Metadata/Classification/
Duplicate-Detection test.

---

## 6.5. TS-LIFE-001 Test Cases

**Suite:** TS-LIFE-001 · **AC Group:** AC-LIFE-001 · **Requirement:** `RAISE-FR-LIFE-001` · **Screen:** P-004 (Lifecycle section)

Added to close the gap identified in `RAISE-TRACEABILITY-MATRIX.md` §6. See
`RAISE-ACCEPTANCE-CRITERIA.md` §7.5 for the full explanation of the new Disposal
sub-gap referenced below.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-LIFE-001-01 | Cross-domain records shown as connected | 1. Create/select an asset with a custody assignment, a maintenance record, and an audit log entry. 2. Open Asset Detail (P-004) Lifecycle section. | 1 asset with records in ≥3 domains | All cross-domain records are shown connected to that one asset | **BLOCKED (partial)** — connectivity display testable; formal lifecycle stage labels are TBD (Design §4.2) |
| TC-LIFE-001-02 | Stage change stays consistent across screens | 1. Perform a Check-out (TS-OPS-002). 2. Add a Maintenance record. 3. Compare Custody History, Maintenance, and Audit Log for the same asset. | 1 asset, 1 check-out, 1 maintenance event | No screen shows a state that contradicts another for the same asset | **BLOCKED (partial)** — consistency testable; formal state/transition model TBD (Design §4.2) |
| TC-LIFE-001-03 | History survives disposal | N/A — see Blocked column | N/A | N/A | **OUT OF SCOPE FOR MVP** — Disposal confirmed Enterprise Roadmap, not MVP, by Product/Business decision on 2026-08-21 (`RAISE-PRD.md` §14 item 7, §16 Resolved Question 26). Retained as a row here only to preserve traceability of the original question; not executable and not counted as blocked, since the capability itself is out of scope rather than merely undecided. Re-activate only if Disposal is later promoted to MVP through the standard PRD → Design → Prototype → AC → Test Plan chain. |
| TC-LIFE-001-04 | Lifecycle data consumable by downstream functions | 1. Ensure an asset has connected lifecycle data. 2. Query it via Executive Dashboard (TC-EXEC-001-01) and AI Assistant (TC-AI-SEARCH-001-01). | 1 asset with lifecycle data across domains | Both downstream functions can retrieve and use the data | **BLOCKED (partial)** — inherits blockers from AC-EXEC-001 and AC-AI-SEARCH-001 in addition to its own |

---

## 7. TS-ASSET-002 Test Cases

**Suite:** TS-ASSET-002 · **AC Group:** AC-ASSET-002 · **Requirement:** `RAISE-FR-ASSET-002` · **Screen:** P-005

**Status Note — Resolved 2026-09-01 (Open Finding F-27, per confirmed business
decision):** `RAISE-TEST-PLAN.md` v0.8 and `RAISE-ACCEPTANCE-CRITERIA.md` v0.8
confirm the category hierarchy is exactly 2 levels — Asset `category` field →
Asset `type` field → individual assets — using the real, currently-seeded
Category → Type breakdown from `frontend/src/data/fixtures/mockData.ts` (IT
Hardware → Laptop/Monitor/Headphones; Mobile → Smartphone/Tablet; Office
Equipment → Printer/Projector; Infrastructure → Server/Router; Media Equipment
→ Camera), not an invented example. `TC-ASSET-002-01` is rewritten below to
assert this real hierarchy and is **no longer BLOCKED**. `TC-ASSET-002-02` is
unchanged. A new `TC-ASSET-002-03` is added for the new `AC-ASSET-002-03`
(category → type expand/drill-down behavior); it is marked **BLOCKED
(pending implementation)** — see §1 — because the shipped "By Category" view
currently groups Category → flat asset list only, with no Type-level nesting
yet. This is a scope/spec correction resolving a previously-open question, not
a report of any new PASS/FAIL execution result.

**Status Note — Closed 2026-09-01 (formal test case execution, same day as
the F-27 resolution above):** the UI code change described in the note above
(nesting the "By Category" view one level deeper: Category → Type →
individual assets) has now shipped, and `TC-ASSET-002-03` has been formally
executed against the real running app, with **PASS** confirmed:

- Navigated to `/assets`, opened the "By Category" tab, and expanded the "IT
  Hardware" category node — confirmed it reveals Type-level sub-groups only
  (Headphones: 1 asset, Laptop: 3 assets, Monitor: 2 assets), each shown with
  a count badge and **no individual assets displayed at this level**.
- Expanded the "Laptop" sub-group — confirmed it reveals exactly the 3
  individual assets under it (MacBook Pro 16" M3 / AST-0001, MacBook Air M2 /
  AST-0011, ThinkPad X1 Carbon Gen 11 / AST-0012), each with a status badge,
  and none of Monitor's or Headphones' assets.

This matches the 2-level Category → Type → individual-assets structure
exactly as specified in `AC-ASSET-002-01`/`AC-ASSET-002-03` and
`RAISE-PROTOTYPE.md` P-005 (v0.9), with no deeper nesting observed.
Automated coverage was also added: `frontend/src/pages/Assets/index.test.tsx`
now carries 3 tests for this view (covering `TC-ASSET-002-01`, the
Type-sub-group-expansion behavior, and `TC-ASSET-002-03`) — all pass, and the
full frontend suite (145 tests) passes with no regressions. `TC-ASSET-002-03`
is therefore **no longer BLOCKED (pending implementation)** and is marked
**PASS** below. `TC-ASSET-002-01` and `TC-ASSET-002-02` are unaffected by
this execution beyond the corroborating evidence added to
`TC-ASSET-002-01`'s row (its own classification does not change — it was
already fully testable, not blocked). This is a real test execution
reporting a PASS, not a further scope/spec correction — see §19 for the
updated Test Case Summary totals. A follow-up note in
`RAISE-TEST-PLAN.md` §8's blocked-item entry for this same item may also need
updating to match, but that update is deferred to a separate pass and is not
made here.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ASSET-002-01 | Category → Type hierarchy displays with real seeded values | 1. Log in. 2. Open Category & Hierarchy screen (P-005). | Assets seeded across the real `category`/`type` pairs in `frontend/src/data/fixtures/mockData.ts` (at minimum: IT Hardware with Laptop/Monitor/Headphones; Mobile with Smartphone/Tablet; Office Equipment with Printer/Projector; Infrastructure with Server/Router; Media Equipment with Camera) | Categories are displayed in a parent/child hierarchy where the parent level is the Asset `category` field and the child level is the Asset `type` field, matching the real seeded breakdown (e.g. IT Hardware shown as parent of Laptop, Monitor, and Headphones) | No — fully testable now against the real seeded data (Open Finding F-27, resolved 2026-09-01). The list of `category`/`type` pairs is live/data-derived, not a closed enumeration — it is expected to grow as new `type` values are seeded; this case asserts the hierarchy display mechanism and the currently-seeded values, not a fixed, permanently-exhaustive taxonomy. **Formally executed 2026-09-01 against the real running app — PASS:** confirmed on `/assets`, "By Category" tab, that the "IT Hardware" category correctly renders its Type-level parent/child structure (see the closure note above); also covered by an automated test in `frontend/src/pages/Assets/index.test.tsx`. |
| TC-ASSET-002-02 | Asset category consistent across screens | 1. Assign asset to a category. 2. View it in Asset Registry. 3. View it in Asset Detail. | 1 asset, 1 assigned category | Same category shown in both Registry and Detail, matching the hierarchy view | No — unaffected by the 2026-09-01 closure above; unchanged, consistency-only case. |
| TC-ASSET-002-03 | Expanding a category reveals Type sub-groups, expanding a Type reveals individual assets | 1. Log in. 2. Open Category & Hierarchy screen (P-005). 3. Locate the "IT Hardware" category node. 4. Expand the "IT Hardware" node. 5. Observe the revealed sub-groups. 6. Expand (or view the per-asset list under) one revealed Type sub-group, e.g. "Laptop." 7. Observe the assets listed under it. | Assets seeded across IT Hardware's Type values (at least one asset each for Laptop, Monitor, and Headphones) | Step 5: expanding "IT Hardware" reveals its Type-level sub-groups — Laptop, Monitor, and Headphones — as the distinct `type` values currently present within that `category`, with no individual assets shown yet at this level. Step 7: expanding/viewing the "Laptop" sub-group reveals only the individual assets whose `category` is IT Hardware and `type` is Laptop — matching the 2-level Category → Type → individual assets structure and no deeper. | No — **closed and PASS, 2026-09-01.** The blocking UI code change (nesting the "By Category" view one level deeper) has shipped. Formally executed against the real running app: expanding "IT Hardware" revealed exactly the 3 Type sub-groups (Headphones/Laptop/Monitor) with count badges and no individual assets at that level; expanding "Laptop" then revealed exactly its 3 individual assets (AST-0001, AST-0011, AST-0012) and none of the other Type sub-groups' assets — matching every step above. Also covered by an automated test in `frontend/src/pages/Assets/index.test.tsx` (part of the full 145-test suite, all passing). No longer **BLOCKED (pending implementation)** — see §1 and the closure note above. |

---

## 8. TS-ASSET-003 Test Cases

**Suite:** TS-ASSET-003 · **AC Group:** AC-ASSET-003 · **Requirement:** `RAISE-FR-ASSET-003` · **Screen:** P-006

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ASSET-003-01 | Current holder displays | 1. Open Custody History for an assigned asset. | 1 asset with a current holder | Current holder/assignment is displayed | **BLOCKED (partial)** — display testable; holder data model is TBD (PRD §16 Q13) |
| TC-ASSET-003-02 | Historical custody entries display | 1. Open Custody History for an asset with prior transfers. | 1 asset, ≥2 historical custody events | Chronological history of date/holder/action is displayed | No |
| TC-ASSET-003-03 | Custody change appends history, does not alter prior entries (Check-in/Check-out only) | 1. Record existing history entries. 2. Perform a Check-out (TS-OPS-002). 3. Re-open Custody History. | 1 asset with ≥1 prior entry | New entry appended; all prior entries unchanged | **BLOCKED (partial)** — the append-and-immutability behavior triggered by Check-in/Check-out is testable; this case does NOT test, and must not be read as confirming, whether Custody History is written *only* by Check-in/Check-out or also by other custody-changing events (e.g., a direct reassignment outside Check-in/Check-out). That exclusivity question is blocked pending business confirmation on the `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap (PRD Pre-Finalization Quality Pass, "Duplicated / Overlapping Requirements") — no dedicated case for a non-Check-in/Check-out write path can exist until that flow/screen and its AC criterion are defined. AC-ASSET-003-01 and -02 are unaffected. |

---

## 9. TS-OPS-001 Test Cases

**Suite:** TS-OPS-001 · **AC Group:** AC-OPS-001 · **Requirement:** `RAISE-FR-OPS-001` · **Screen:** P-007

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-OPS-001-01 | Valid scan opens asset detail | 1. Scan a QR/Barcode matching an existing asset. | 1 valid code mapped to 1 asset | Asset Detail opens for that asset | No |
| TC-OPS-001-02 | Unmatched code shows not-found | 1. Scan a well-formed code with no matching asset. | 1 valid-format, unmapped code | "Not found" state shown with retry option | No |
| TC-OPS-001-03 | Invalid code shows invalid-code state | 1. Scan a malformed/unreadable code. | 1 invalid code | "Invalid code" state shown with retry option | No |

---

## 10. TS-OPS-002 Test Cases

**Suite:** TS-OPS-002 · **AC Group:** AC-OPS-002 · **Requirement:** `RAISE-FR-OPS-002` · **Screen:** P-008

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-OPS-002-01 | Check-out updates custody | 1. Select an available asset. 2. Choose Check-out. 3. Identify a holder. 4. Confirm. | 1 available asset, 1 holder identity | Custody state updates to new holder | **BLOCKED (partial)** — basic transition testable; "appropriate permission" gating is TBD (PRD §16 Q12/Q22). **RBAC MVP enforcement level confirmed (2026-08-21, PRD §16 Resolved Question 38; Design §16):** a UI-only/client-side permission check is confirmed acceptable for MVP, backend enforcement deferred to Enterprise Roadmap — this fixes only *where* a permission check runs, not *what* the roles/permissions are (Q22 role list/permission matrix remain TBD), so this case verifies only the state transition itself, not whether the acting user's role is correctly gated. |
| TC-OPS-002-02 | Check-in updates custody | 1. Select a checked-out asset. 2. Confirm return. | 1 checked-out asset | Custody state updates to reflect return | **BLOCKED (partial)** — same as above; also approval/exception rules TBD (PRD §16 Q11) |
| TC-OPS-002-03 | Check-in/Check-out triggers audit entry | 1. Perform Check-out. 2. Open Audit Log. | 1 asset | New Audit Log entry created for the operation | No |

---

## 11. TS-MAINT-001 Test Cases

**Suite:** TS-MAINT-001 · **AC Group:** AC-MAINT-001 · **Requirement:** `RAISE-FR-MAINT-001` · **Screen:** P-009 · **Level(s):** L1, L3

**Updated 2026-08-21 (Test Plan v0.4 §7/§8; AC v0.4 §12):** the 4-stage maintenance-request
workflow (User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician
Execution) and its state model (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH →
PLANNING/IN_PROGRESS/ON_HOLD → DONE`) are business-confirmed (PRD §16 Resolved Question
33; Design §5.1), so `AC-MAINT-001-03` through `-09` now have corresponding test cases
below. Two independent blocking reasons apply to a subset of these cases: (a) the
Reject/Request Info resulting state/flow (`AC-MAINT-001-05`) has no defined downstream
behavior; (b) `AC-MAINT-001-04` through `-08` depend on `RAISE-NFR-SEC-RBAC-001` — MVP
enforcement level is confirmed as UI-only/client-side (backend deferred to Roadmap), but
the role list/permission matrix (Q22) remain TBD, so *who* may perform each stage action
cannot be verified for correctness, only that the state transition occurs when the stage
action is performed. `AC-MAINT-001-03` (any user submitting a request) and
`AC-MAINT-001-09` (stage-progress indicator, not gated by any specific role in the AC/
Design text) carry no RBAC dependency and are fully testable.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-MAINT-001-01 | Maintenance record displays | 1. Open Maintenance screen for an asset with a record. | 1 asset, 1 maintenance record (date/event/status/cost) | Record fields are displayed | **BLOCKED (partial)** — display testable; full field model TBD (PRD §16 Q14) |
| TC-MAINT-001-02 | Maintenance history displays chronologically | 1. Open Maintenance screen for an asset with multiple records. | 1 asset, ≥2 maintenance records | Records shown in chronological order | No |
| TC-MAINT-001-03 | Stage 1 — User Requisition submits into Dept Approval | 1. As any user, open the maintenance-request form for an asset. 2. Enter asset, requester, and issue description. 3. Submit the request. | 1 asset, 1 requester identity, 1 issue description | Request is created and enters state `PENDING_DEPT_APPROVAL` | No |
| TC-MAINT-001-04 | Stage 2 — Dept Approval (Delegated) Approve advances to IT Dispatch | 1. Open a request in state `PENDING_DEPT_APPROVAL`. 2. Select Approve (directly, or while the "acting as delegate for" banner is shown). 3. Confirm. | 1 request in `PENDING_DEPT_APPROVAL`; optionally, 1 delegate-banner context | Request transitions to state `PENDING_IT_DISPATCH` | **BLOCKED (partial)** — the Approve→`PENDING_IT_DISPATCH` state transition itself is testable; the delegated-approver authorization rule (*who* may delegate, *to whom*, how delegation is audited) is **NOT TESTABLE YET** (Prototype §15, Design §5.1) — this case does not assert that the delegation itself was valid or correctly authorized, only that an Approve action advances the state. Also depends on `RAISE-NFR-SEC-RBAC-001`: MVP enforcement level is confirmed UI-only/client-side (PRD §16 Resolved Question 38; Design §16), but the role list/permission matrix (Q22) remain TBD, so this case cannot verify that the acting user is a correctly-gated Dept Approver. |
| TC-MAINT-001-05 | Stage 2 — Reject/Request Info does not advance to IT Dispatch | 1. Open a request in state `PENDING_DEPT_APPROVAL`. 2. Select Reject. 3. Repeat with Request Info instead of Reject on a second request. | 2 requests in `PENDING_DEPT_APPROVAL` | Request does not transition to `PENDING_IT_DISPATCH` | **BLOCKED (partial)** — only the negative assertion (does not transition to `PENDING_IT_DISPATCH`) is testable; the actual resulting state and any downstream flow for Reject/Request Info is **NOT TESTABLE YET** (Prototype §15 shows these as UI actions only, with no defined resulting state) — this case must not assert any specific resulting state (e.g., a "Rejected" or "Info Requested" status) beyond "not `PENDING_IT_DISPATCH`." Also depends on `RAISE-NFR-SEC-RBAC-001` (same Dept Approver role-gating caveat as `TC-MAINT-001-04`). |
| TC-MAINT-001-06 | Stage 3 — IT Dispatch advances to execution state | 1. Open a request in state `PENDING_IT_DISPATCH`. 2. Assign the request to a technician or queue. 3. Select Dispatch. | 1 request in `PENDING_IT_DISPATCH`, 1 technician/queue assignment | Request transitions to one of `PLANNING`, `IN_PROGRESS`, or `ON_HOLD`, and Stage 4 (Technician Execution) begins | **BLOCKED (partial)** — the state transition itself is testable; depends on `RAISE-NFR-SEC-RBAC-001` — MVP enforcement level confirmed UI-only/client-side, but role list/permission matrix (Q22) remain TBD, so this case cannot verify that the acting user is a correctly-gated IT Dispatcher, only that dispatch advances the state. |
| TC-MAINT-001-07 | Stage 4 — Technician updates execution status | 1. Open a request in state `PLANNING`, `IN_PROGRESS`, or `ON_HOLD`. 2. As the assigned technician, change the status control to a different one of the three values. | 1 request in any of `PLANNING`/`IN_PROGRESS`/`ON_HOLD` | Request's displayed status reflects the newly selected value | **BLOCKED (partial)** — the status-update behavior itself is testable; depends on `RAISE-NFR-SEC-RBAC-001` — MVP enforcement level confirmed UI-only/client-side, but role list/permission matrix (Q22) remain TBD, so this case cannot verify that the acting user is a correctly-gated Technician, only that the status control updates the displayed value. |
| TC-MAINT-001-08 | Stage 4 — Mark Complete transitions to Done | 1. Open a request in state `PLANNING`, `IN_PROGRESS`, or `ON_HOLD`. 2. As the assigned technician, select Mark Complete. | 1 request in any of `PLANNING`/`IN_PROGRESS`/`ON_HOLD` | Request transitions to state `DONE` | **BLOCKED (partial)** — the Mark Complete→`DONE` state transition itself is testable; depends on `RAISE-NFR-SEC-RBAC-001` — MVP enforcement level confirmed UI-only/client-side, but role list/permission matrix (Q22) remain TBD, so this case cannot verify that the acting user is a correctly-gated Technician. No behavior is defined for Mark Complete attempted from any other state, or for skipped/reversed stages — no test case exists for those, since none is shown in the Prototype. |
| TC-MAINT-001-09 | Stage-progress indicator reflects current state | 1. Open the detail view for a maintenance request at each of: `PENDING_DEPT_APPROVAL`, `PENDING_IT_DISPATCH`, `PLANNING`/`IN_PROGRESS`/`ON_HOLD`, and `DONE`. | 4 requests, one per listed state (or state group) | The 4-stage progress indicator (User Requisition → Dept Approval → IT Dispatch → Technician Execution) shows Done/Current/Pending consistent with each request's current state | No |

---

## 11.5. License Management — No Test Suite (Confirmed Out of Scope, Roadmap-only)

**Confirmed 2026-08-21 (Test Plan v0.4 §3.2; AC v0.4 §3 traceability note; PRD §6/§13/§17
Resolved Question 34):** License Management (P-016 License Inventory / P-017 License
Detail, `RAISE-FR-LICENSE-001`) is classified as Enterprise Roadmap, not MVP. No
`AC-LICENSE-001` Given/When/Then group exists in `RAISE-ACCEPTANCE-CRITERIA.md` — only a
traceability note recording *why* no group was written — and consequently **no
`TS-LICENSE-001` suite exists in `RAISE-TEST-PLAN.md`**, per that document's own
principle that no test suite is introduced for behavior with no corresponding AC group
(Test Plan §2).

Following the same principle, **no test cases exist for P-016/P-017 in this document**,
consistent with the treatment already given to AI Recommendation, Risk Scoring, and
Lifecycle Prediction (all Pilot/Roadmap, no MVP suite, no test cases). This section exists
solely to record that the absence is deliberate and verified, not an oversight. If
`RAISE-FR-LICENSE-001` is later promoted to MVP and a dedicated `AC-LICENSE-001` group and
`TS-LICENSE-001` suite are added upstream, corresponding test cases must be added here at
that time — not before.

---

## 12. TS-WARRANTY-001 Test Cases

**Suite:** TS-WARRANTY-001 · **AC Group:** AC-WARRANTY-001 · **Requirement:** `RAISE-FR-WARRANTY-001` · **Screen:** P-010

**Field list resolved 2026-08-29:** for MVP, the Warranty domain has exactly
one field on the Asset record — `warrantyExpiry`. A draft 8-field proposal (start date,
provider/vendor, type, coverage details, cost, claim contact, document reference) was
explicitly **rejected for MVP** by the business, not deferred. None of those seven fields
appears in any test case below (`TC-WARRANTY-001-01`/`-02` previously referenced a stale
"Start Date, End Date, Status" three-field shape — corrected below to match
`RAISE-ACCEPTANCE-CRITERIA.md` §13 AC-WARRANTY-001).

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-WARRANTY-001-01 | Warranty expiry field displays | 1. Open Warranty screen for an asset with `warrantyExpiry` set. | 1 asset with a `warrantyExpiry` date set | That asset's `warrantyExpiry` date is displayed | No |
| TC-WARRANTY-001-02 | Warranty timeline state displays | 1. Open Warranty screen for assets whose `warrantyExpiry` places them in each state. | 3 assets, each with a `warrantyExpiry` value placing it in the Active, Expiring, or Expired state respectively | Corresponding UI-computed Warranty Timeline state (Active/Expiring/Expired) shown for each asset, derived from `warrantyExpiry` relative to today's date — not a separately stored field | No |
| TC-WARRANTY-001-03 | 90-day expiring asset appears in expiring view | 1. Set an asset's `warrantyExpiry` within 90 days. 2. Open Warranty expiring-assets view. | 1 asset, `warrantyExpiry` = today+45 | Asset appears in expiring list; link opens its Asset Detail | **BLOCKED (partial)** — the 90-day threshold is the PRD's illustrative business example, not a confirmed, generalizable business rule (PRD §6.7; unaffected by the 2026-08-29 field-list resolution) |

---

## 13. TS-ORACLE-001 Test Cases

**Suite:** TS-ORACLE-001 · **AC Group:** AC-ORACLE-001 · **Requirement:** `RAISE-FR-ORACLE-001` · **Screen:** P-011

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ORACLE-001-01 | Financial data displays when available | 1. Open Financial View for an asset with imported Oracle data. | 1 asset with Asset Number/NBV/Depreciation/Source/Sync Status | All financial fields displayed | **BLOCKED (partial)** — display testable; actual import mechanism TBD (PRD §16 Q6–Q10) |
| TC-ORACLE-001-02 | Data-unavailable state displays | 1. Open Financial View for an asset with no Oracle data. | 1 asset, no Oracle data | "Data unavailable" state shown | No |
| TC-ORACLE-001-03 | Sync/import error state displays | 1. Simulate a sync/import failure. 2. Open Financial View. | 1 asset with simulated sync error | "Sync/import error" state shown | No |
| TC-ORACLE-001-04 | Data-conflict state displays | 1. Simulate two conflicting source values for one asset. 2. Open Financial View. | 1 asset, 2 conflicting values | "Data conflict" state shown; no value silently chosen | No |

---

## 14. TS-ALERT-001 Test Cases

**Suite:** TS-ALERT-001 · **AC Group:** AC-ALERT-001 · **Requirement:** `RAISE-FR-ALERT-001` · **Screen:** P-012

**Status Note — Formally executed 2026-09-01 (Open Finding F-32, resolved):** the
Alerts screen (P-012) has now been implemented — `frontend/src/pages/Alerts/index.tsx`,
registered at `ROUTES.NOTIFICATIONS` (`/notifications`) in `App.tsx`. Per explicit
business decision, this scoped-down screen derives its one alert-triggering condition
from the one already confirmed elsewhere in the app: an asset's `warrantyExpiry` being in
the past (the same `isWarrantyExpired` check the Assets list's Warranty column already
uses). Each row shows Severity (rendered honestly as "Not yet defined" — not an invented
High/Medium/Low value, since severity mapping remains undefined per Open Finding F-05),
the Description ("Warranty expired {date}"), and the associated Asset (clickable,
navigates to Asset Detail). No Email/Teams/LINE delivery UI exists anywhere on the page.
This satisfies exactly the structural-display scope `AC-ALERT-001-01` already limited
itself to (`RAISE-ACCEPTANCE-CRITERIA.md` §15) — the still-open question of which
conditions/severities are the *correct* MVP alert-triggering rules remains **NOT TESTABLE
YET** (PRD §6.9 Open Question, Open Finding F-05) and is unaffected by this closure; no
upstream document (`RAISE-ACCEPTANCE-CRITERIA.md`, `RAISE-TEST-PLAN.md`) changed as a
result. Both cases below were re-executed against the real running app and both **PASS**.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ALERT-001-01 | Triggered alert displays with severity/asset | 1. Trigger an alert-worthy condition. 2. Open Alerts. | 1 asset meeting an alert condition | Alert shown with severity, description, associated asset | No — **PASS on the display mechanism**, fully testable against the as-built Alerts screen (P-012), scoped to `AC-ALERT-001-01`'s structural-display criterion (`RAISE-ACCEPTANCE-CRITERIA.md` §15): an alert lists severity/description/asset when opened. Which specific severity/trigger-rule values are correct remains **NOT TESTABLE YET** (PRD §6.9 Open Question, Open Finding F-05) — a separate, still-unresolved question this case does not claim to close. The "authorized user" gate remains testable only structurally since the role/permission model is undefined (PRD §16 Q22), unaffected by this update. **Formally executed 2026-09-01 against the real running app — PASS:** navigated to `/notifications` (previously 404'd; now renders the Alerts screen with 11 rows, matching the Dashboard's "Expired Warranty: 11" tile exactly); confirmed the row for AST-0013 (Dell OptiPlex 7090) displays Severity "Not yet defined," Description "Warranty expired 2024-03-15," and the associated Asset as a clickable link; clicking it navigated correctly to that asset's Asset Detail page. Also covered by an automated test in `frontend/src/pages/Alerts/index.test.tsx`. |
| TC-ALERT-001-02 | Only in-app presentation verified | 1. Open Alerts screen. | ≥1 alert | Alert shown on-screen only; no Email/Teams/LINE delivery attempted | No — **formally executed 2026-09-01 against the real running app — PASS:** confirmed the Alerts screen (`/notifications`, P-012) presents all 11 alert rows purely as an in-app table, with no Email/Teams/LINE or other delivery-channel UI anywhere on the page. Also covered by an automated test in `frontend/src/pages/Alerts/index.test.tsx`. |

---

## 15. TS-AUDIT-001 Test Cases

**Suite:** TS-AUDIT-001 · **AC Group:** AC-AUDIT-001 · **Requirement:** `RAISE-FR-AUDIT-001` · **Screen:** P-013

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AUDIT-001-01 | Activity creates audit entry | 1. Perform a significant activity (e.g., Check-out). 2. Open Audit Log. | 1 tracked activity | Entry recorded with timestamp, actor, action, entity | **BLOCKED (partial)** — minimum fields testable; whether Before/After/Source/Result are also required is unconfirmed (Design §15) |
| TC-AUDIT-001-02 | Audit entry cannot be modified/deleted | 1. Attempt to edit or delete an existing audit entry via normal app operation. | 1 existing audit entry | Modification/deletion rejected; entry unchanged | No |
| TC-AUDIT-001-03 | Authorized user can view audit log | 1. Log in as a user with audit-review access. 2. Open Audit Log. | 1 user with access, ≥1 entry | Entries are viewable | **BLOCKED (partial)** — "authorized" gating depends on undefined role model (PRD §16 Q22) |

---

## 16. TS-EXEC-001 Test Cases

**Suite:** TS-EXEC-001 · **AC Group:** AC-EXEC-001 · **Requirement:** `RAISE-FR-EXEC-001` · **Screen:** P-014

**Status Note — Corrected 2026-08-31 to match `RAISE-TEST-PLAN.md` v0.7 / `RAISE-ACCEPTANCE-CRITERIA.md` v0.7
([Open Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question)):**
`TC-EXEC-001-01`/`-02` previously asserted the stale "Executive Asset Intelligence" wireframe
(NBV/Risk/Utilization tiles; "Asset Overview"/"Executive Summary" sections). Formal test
execution on 2026-08-26 confirmed none of that wireframe was ever built. Per explicit
business decision on F-22, both cases below are rewritten against the actually shipped
`frontend/src/pages/Dashboard/index.tsx` page — the same built page as P-002 (see §4
`TC-DASH-*` above) — per `RAISE-PROTOTYPE.md` §20 and `RAISE-ACCEPTANCE-CRITERIA.md` §17.
This is a scope/spec correction to match reality — it does not add, remove, or reinterpret
`RAISE-FR-EXEC-001` — and **does not itself report a new PASS/FAIL execution result**;
re-running formal execution against the rewritten steps below is deferred to a future
execution sweep.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-EXEC-001-01 | KPI grid displays all eight tiles (Executive Dashboard) | 1. Log in as Executive. 2. Open Executive Dashboard (P-014). | Org-level asset dataset | The KPI grid displays all eight tiles: Total Assets, Available, Assigned, In Maintenance, Expired Warranty, Software Licenses, Monthly Depreciation, and Monthly Cost | No — fully testable; identical shipped grid to `TC-DASH-01` since P-014 and P-002 document the same built page (Open Finding F-22). Same Monthly Depreciation/Monthly Cost illustrative-figures caveat and presence-only scope from `TC-DASH-01` apply. |
| TC-EXEC-001-02 | Ten dashboard sections display (Executive Dashboard) | 1. Open Executive Dashboard (P-014) with the dashboard displayed. | Org-level asset/maintenance/warranty/license dataset | All ten sections are present: AI Insights, AI Portfolio Health, Oracle FA Reconciliation, Asset Lifecycle, Department Distribution, Asset Status, Asset Type, Pending Approvals, Recent Activities, and Maintenance Calendar | No — fully testable; identical shipped section list to `TC-DASH-02`. |

**Note — NBV/Risk absence, not a numbered AC criterion (unlike AC-DASH-03):** unlike AC-DASH
(§5 of the AC document), `AC-EXEC-001` (§17) does not carry a separate numbered "-03"
criterion for NBV/Risk absence — it is documented only as a narrative "NOT TESTABLE YET
(NBV/Risk — not yet built)" note below AC-EXEC-001-01/-02. Per this document's own TC ID
convention (§2 — no test case without a matching AC ID), no `TC-EXEC-001-03` is created.
The substance is identical to `TC-DASH-03` (§4 above): NBV, Risk, and Utilization are
proposal-defined KPIs under `RAISE-FR-EXEC-001` that do not appear in the shipped grid
tested by `TC-EXEC-001-01`; NBV and Risk formulas, thresholds, and dashboard placement
remain fully undefined (PRD §16 Q3–Q4, tracked as [Open Finding
F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement)) — a
separate, not-yet-scheduled enhancement, not a silently dropped requirement. Utilization's
*definition* remains separately resolved (2026-08-21, PRD §16 Resolved Question 27) and
unaffected; only its dashboard implementation is outstanding. This note carries no PASS/FAIL
weight of its own and is not counted in the §19 Test Case Summary totals for TS-EXEC-001.

---

## 17. TS-AI-SEARCH-001 Test Cases

**Suite:** TS-AI-SEARCH-001 · **AC Group:** AC-AI-SEARCH-001 · **Requirement:** `RAISE-AI-SEARCH-001` · **Screen:** P-015

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AI-SEARCH-001-01 | Natural language question returns answer | 1. Open AI Assistant. 2. Submit a natural-language asset question. | 1 question with matching asset data | Answer returned based on connected data | No |
| TC-AI-SEARCH-001-02 | Answer shows contributing sources | 1. Submit a question. 2. Review the answer. | Question spanning ≥2 data categories (e.g., warranty + maintenance) | "Sources / Data Used" lists contributing categories | **BLOCKED (partial)** — presence of source list testable; citation precision/format TBD (PRD §16 Q18) |
| TC-AI-SEARCH-001-03 | 90-day warranty example returns expected layout | 1. Submit: "Which notebooks expire within 90 days?" | ≥1 notebook asset with warranty expiring ≤90 days | Answer includes affected-asset count and a table with Asset/Warranty/Age/Maintenance/Status columns | No |

---

## 18. TS-AI-STATES Test Cases

**Suite:** TS-AI-STATES · **AC Group:** AC-AI-STATES · **Requirement:** `RAISE-AI-SEARCH-001` · **Screen:** P-015 (§22 AI Response States)

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AI-STATES-01 | Success state | 1. Submit a question with matching data. | Matching asset data exists | Answer + relevant data + source context shown together | No |
| TC-AI-STATES-02 | No-data state | 1. Submit a question with no matching assets. | No assets match the query | "No matching assets were found." shown | No |
| TC-AI-STATES-03 | Unable-to-answer state | 1. Submit a question the system cannot derive an answer for. | Query outside available data's ability to answer | "RAISE could not answer from the available data." shown | No |
| TC-AI-STATES-04 | Source-unavailable state | 1. Simulate a source system outage. 2. Submit a relevant question. | 1 unavailable source (e.g., Oracle FA down) | "Some source data is currently unavailable." shown | No |
| TC-AI-STATES-05 | Data-conflict state | 1. Simulate conflicting values across sources for the same asset attribute. 2. Submit a relevant question. | 1 asset, 2 conflicting values | "Conflicting information was found. Please review the source records." shown | No |

---

## 18.1. TS-AI-DOC-001 Test Cases

**Suite:** TS-AI-DOC-001 · **AC Group:** AC-AI-DOC-001 · **Requirement:** `RAISE-AI-DOC-001` · **Screen:** P-004 (incidental) · **Level:** L5 only (Test Plan §7/§8.1)

This suite is **fully blocked**, not partially blocked: `AC-AI-DOC-001-01` is the
sole criterion in its AC group and is marked NOT TESTABLE YET in its entirety
(`RAISE-ACCEPTANCE-CRITERIA.md` §19.5) — document scope, extractable fields, and the
accuracy threshold are all undefined (`RAISE-PRD.md` §7 RAISE-AI-DOC-001 Open
Question), and the Prototype describes only a reserved screen location on P-004
(incidental), not a concrete UI element. No L1–L4 step can be written without
inventing a document type, field, or threshold that does not exist in any
prior-stage document.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AI-DOC-001-01 | Placeholder — OCR/Extraction not yet testable | N/A — no concrete step can be written; see Blocked column | N/A | N/A | **BLOCKED (full)** — `AC-AI-DOC-001-01`'s entire Given/When/Then is NOT TESTABLE YET; no document type, extracted field, or accuracy value is defined anywhere in `RAISE-PRD.md`, `RAISE-DESIGN.md` §9A, or `RAISE-PROTOTYPE.md` §10 beyond a reserved screen location. This row exists solely to preserve 1:1 AC-to-TC traceability (Test Plan §8.1) and will be re-verified at each L5 Traceability Regression run. Re-activate with concrete L1+ steps only once the PRD Open Question is resolved and AC v-next adds a testable Given/When/Then. |

---

## 18.2. TS-AI-DOC-002 Test Cases

**Suite:** TS-AI-DOC-002 · **AC Group:** AC-AI-DOC-002 · **Requirement:** `RAISE-AI-DOC-002` · **Screen:** P-004 (incidental) · **Level:** L5 only (Test Plan §7/§8.1)

Fully blocked for the same structural reason as TS-AI-DOC-001: `AC-AI-DOC-002-01` is
the sole, entirely NOT TESTABLE YET criterion (`RAISE-ACCEPTANCE-CRITERIA.md` §19.6)
— which metadata fields/tags are generated and how they surface to users are
undefined (`RAISE-PRD.md` §7 RAISE-AI-DOC-002 Open Question), and only a reserved
screen location is described.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AI-DOC-002-01 | Placeholder — Metadata generation not yet testable | N/A — no concrete step can be written; see Blocked column | N/A | N/A | **BLOCKED (full)** — `AC-AI-DOC-002-01`'s entire Given/When/Then is NOT TESTABLE YET; no metadata field, tag, or display format is defined anywhere in prior-stage documents beyond a reserved screen location. This row preserves 1:1 AC-to-TC traceability (Test Plan §8.1) and is re-verified at each L5 Traceability Regression run. Re-activate with concrete L1+ steps only once the PRD Open Question is resolved and AC v-next adds a testable Given/When/Then. |

---

## 18.3. TS-AI-DOC-003 Test Cases

**Suite:** TS-AI-DOC-003 · **AC Group:** AC-AI-DOC-003 · **Requirement:** `RAISE-AI-DOC-003` · **Screen:** P-005 (incidental) · **Level:** L5 only (Test Plan §7/§8.1)

Fully blocked for the same structural reason as TS-AI-DOC-001/002:
`AC-AI-DOC-003-01` is the sole, entirely NOT TESTABLE YET criterion
(`RAISE-ACCEPTANCE-CRITERIA.md` §19.7) — whether the capability auto-assigns a
category or only suggests one for human confirmation is undefined (`RAISE-PRD.md`
§7 RAISE-AI-DOC-003 Open Question), and only a reserved screen location plus an
illustrative example are described.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AI-DOC-003-01 | Placeholder — Classification behavior not yet testable | N/A — no concrete step can be written; see Blocked column | N/A | N/A | **BLOCKED (full)** — `AC-AI-DOC-003-01`'s entire Given/When/Then is NOT TESTABLE YET; no pass/fail behavior (auto-assign vs. suggest-only) can be asserted, since the Prototype itself takes no position on which applies. This row preserves 1:1 AC-to-TC traceability (Test Plan §8.1) and is re-verified at each L5 Traceability Regression run. Re-activate with concrete L1+ steps only once the PRD Open Question is resolved and AC v-next adds a testable Given/When/Then. |

---

## 18.4. TS-AI-DOC-004 Test Cases

**Suite:** TS-AI-DOC-004 · **AC Group:** AC-AI-DOC-004 · **Requirement:** `RAISE-AI-DOC-004` · **Screen:** P-003 (incidental) · **Level:** L5 only (Test Plan §7/§8.1)

Fully blocked for the same structural reason as TS-AI-DOC-001/002/003:
`AC-AI-DOC-004-01` is the sole, entirely NOT TESTABLE YET criterion
(`RAISE-ACCEPTANCE-CRITERIA.md` §19.8) — matching criteria/threshold and the
resolution workflow (auto-merge vs. flag-for-review) are undefined (`RAISE-PRD.md`
§7 RAISE-AI-DOC-004 Open Question), and only a reserved screen location plus an
illustrative example are described.

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-AI-DOC-004-01 | Placeholder — Duplicate Detection behavior not yet testable | N/A — no concrete step can be written; see Blocked column | N/A | N/A | **BLOCKED (full)** — `AC-AI-DOC-004-01`'s entire Given/When/Then is NOT TESTABLE YET; no matching threshold or merge/flag behavior can be asserted, since none is defined in any prior-stage document. This row preserves 1:1 AC-to-TC traceability (Test Plan §8.1) and is re-verified at each L5 Traceability Regression run. Re-activate with concrete L1+ steps only once the PRD Open Question is resolved and AC v-next adds a testable Given/When/Then. |

---

## 18.5. PRD §10 NFR Backlog — No Test Cases (mirrors Test Plan §3.3 / AC §19.9, added 2026-08-23)

**Added 2026-08-23, re-sync against `RAISE-TEST-PLAN.md` v0.5 §3.3.** Test Plan v0.5 §3.3
added an explicit per-area acknowledgment of the PRD §10 / Design §16A / Prototype §25A /
AC §19.9 NFR backlog — Performance, Availability, Scalability, Backup/Recovery, Data
Retention, Encryption, API Security, Audit Retention, Monitoring, Logging (ten areas
outside `RAISE-NFR-SEC-RBAC-001`) — recording that **no test suite is created** for any of
them because no AC group exists for any of them (Test Plan §3.3, itself mirroring AC v0.5
§19.9). This document mirrors that same completeness discipline at the Test Case layer,
per its own §1/§2 principle (no test case without a matching AC criterion):

| PRD §10 NFR Area | Test Case Status |
|---|---|
| Authentication | Already covered narrowly by `TC-LOGIN-01`/`-02` (existence of success/error states only; mechanism BLOCKED — see §3 above) |
| Authorization / RBAC | Already covered narrowly by `TC-LOGIN-03`, `TC-OPS-002-01`, `TC-MAINT-001-04..08` (MVP enforcement level only, per `RAISE-NFR-SEC-RBAC-001`); role list/permission matrix content BLOCKED — see §3, §10, §11 above |
| Performance | No test case — no target defined in PRD/Design/Prototype/AC |
| Availability | No test case — no target defined in PRD/Design/Prototype/AC |
| Scalability | No test case — no target defined in PRD/Design/Prototype/AC |
| Backup / Recovery | No test case — no policy defined in PRD/Design/Prototype/AC |
| Data Retention | No test case — no policy defined in PRD/Design/Prototype/AC |
| Encryption | No test case — no requirement defined in PRD/Design/Prototype/AC |
| API Security | No test case — no requirement defined in PRD/Design/Prototype/AC |
| Audit Retention | No test case beyond the general Q24–Q25 (taxonomy/retention) blocked scope already carried by `TC-AUDIT-001-01`/`-02` (§15 above, per `RAISE-TEST-PLAN.md` §3.3/§8 TS-AUDIT-001 row) — no dedicated retention-period test case exists |
| Monitoring | No test case — no requirement defined in PRD/Design/Prototype/AC |
| Logging | No test case — distinct from the business-facing Audit Log test cases (`TC-AUDIT-001-*`), which test an application-domain acceptance criterion, not an operational logging NFR |

**No test case is written for any of the ten open areas.** Writing one now would invent
both the acceptance threshold and the requirement identity, since no AC group exists to
derive a test case from (this document's own convention, §2: `TC-<same-suffix-as-AC-ID>`
— there is no AC ID to suffix). If any of these ten areas is later given a defined
value/target and a dedicated AC group in `RAISE-ACCEPTANCE-CRITERIA.md`, and a
corresponding suite added to `RAISE-TEST-PLAN.md`, corresponding test cases must be added
here at that time — not before. This section exists only so this document does not
silently omit reference to the PRD §10 backlog, matching the discipline already applied
at the Prototype (§25A), Acceptance Criteria (§19.9), and Test Plan (§3.3) layers. This
section adds **zero** new test cases and does not change the §19 Test Case Summary totals
below.

---

## 19. Test Case Summary

**Note on columns:** the "Partially Blocked" column includes the
AC-Open-Question-driven BLOCKED (partial) marking (§1). A third marking,
BLOCKED (pending implementation) (§1), was introduced 2026-09-01 for
`TC-ASSET-002-03` but closed the same day, once the underlying UI code
change shipped and formal execution confirmed the built behavior against it
(§7) — it currently has **zero active occurrences** in this document, though
the marking itself is retained in §1 for any future case in the same
situation.

| Suite | Total TCs | Fully Testable | Partially Blocked | Blocked (Full) | Out of Scope |
|---|---|---|---|---|---|
| TS-LOGIN | 3 | 0 | 3 | 0 | 0 |
| TS-DASH | 3 | 2 | 1 | 0 | 0 |
| TS-ASSET-001 | 4 | 3 | 1 | 0 | 0 |
| TS-ASSET-001-DETAIL | 2 | 2 | 0 | 0 | 0 |
| TS-LIFE-001 | 4 | 0 | 3 | 0 | 1 (`TC-LIFE-001-03` — Disposal, Enterprise Roadmap) |
| TS-ASSET-002 | 3 | 3 | 0 | 0 | 0 |
| TS-ASSET-003 | 3 | 1 | 2 | 0 | 0 |
| TS-OPS-001 | 3 | 3 | 0 | 0 | 0 |
| TS-OPS-002 | 3 | 1 | 2 | 0 | 0 |
| TS-MAINT-001 | 9 | 3 | 6 | 0 | 0 |
| TS-WARRANTY-001 | 3 | 2 | 1 | 0 | 0 |
| TS-ORACLE-001 | 4 | 3 | 1 | 0 | 0 |
| TS-ALERT-001 | 2 | 2 | 0 | 0 | 0 |
| TS-AUDIT-001 | 3 | 1 | 2 | 0 | 0 |
| TS-EXEC-001 | 2 | 2 | 0 | 0 | 0 |
| TS-AI-SEARCH-001 | 3 | 2 | 1 | 0 | 0 |
| TS-AI-STATES | 5 | 5 | 0 | 0 | 0 |
| TS-AI-DOC-001 | 1 | 0 | 0 | 1 | 0 |
| TS-AI-DOC-002 | 1 | 0 | 0 | 1 | 0 |
| TS-AI-DOC-003 | 1 | 0 | 0 | 1 | 0 |
| TS-AI-DOC-004 | 1 | 0 | 0 | 1 | 0 |
| **Total** | **63** | **35** | **23** | **4** | **1** |

**TS-ASSET-002 updated 2026-09-01 (Open Finding F-27 resolution, then closed
the same day by formal execution):** row grows from `2 | 1 | 1 | 0 | 0` to
`3 | 2 | 1 | 0 | 0` when `TC-ASSET-002-03` was first added (`TC-ASSET-002-01`
moved from BLOCKED (partial) to fully testable; `TC-ASSET-002-02` unchanged;
new `TC-ASSET-002-03` entered marked **BLOCKED (pending implementation)**),
then to **`3 | 3 | 0 | 0 | 0`** later the same day once the corresponding UI
code change (nesting the "By Category" view one level deeper) shipped and
`TC-ASSET-002-03` was formally executed against the real running app with a
confirmed **PASS** (see §7's closure note for the full evidence, including
automated test coverage in `frontend/src/pages/Assets/index.test.tsx`). Net
effect across both updates: grand **Total** row moves from `62 | 32 | 25 | 4 | 1`
to `63 | 34 | 24 | 4 | 1` (one new test case added, and it is fully
testable and passing — not partially blocked as it was between the two
updates).

**TS-ALERT-001 updated 2026-09-01 (Open Finding F-32, resolved — Alerts
screen implemented and formally re-executed):** row moves from `2 | 1 | 1 |
0 | 0` to `2 | 2 | 0 | 0 | 0`. `TC-ALERT-001-01` moves from **BLOCKED
(partial)** to fully testable, marked **PASS on the display mechanism** —
the structural-display scope `AC-ALERT-001-01` already limited itself to
(`RAISE-ACCEPTANCE-CRITERIA.md` §15) is now confirmed working against the
real running app; the still-open severity/trigger-rule correctness question
(PRD §6.9, Open Finding F-05) and the "authorized user" gate note (PRD §16
Q22) are both unaffected and remain explicitly unresolved. `TC-ALERT-001-02`
was already fully testable and is now also formally executed with a
confirmed **PASS**. See §14's Status Note for the full execution evidence.
This is a real test execution reporting a PASS on the testable-now scope,
not a scope/spec correction — no upstream document changed. Grand **Total**
row moves from `63 | 34 | 24 | 4 | 1` to `63 | 35 | 23 | 4 | 1` (no new test
case added; one case reclassified from partially blocked to fully testable
and passing).

23 of 63 test cases are partially blocked — executable against their
structural/interaction behavior, with full correctness pending a PRD Open
Question. This count includes `TC-ASSET-003-03`, updated 2026-08-21 to
**BLOCKED (partial)**: the Check-in/Check-out-triggered append-and-
immutability behavior remains fully testable, but the case does not (and
cannot yet) confirm whether Custody History is written *exclusively* by
Check-in/Check-out, per the newly recorded `RAISE-FR-ASSET-003` vs.
`RAISE-FR-OPS-002` custody-writing-events ambiguity in
`RAISE-TEST-PLAN.md` §7–§8 (carried from `RAISE-ACCEPTANCE-CRITERIA.md`
§9 NOT TESTABLE YET). `AC-ASSET-003-01`/`TC-ASSET-003-01` (holder model
TBD) and `AC-ASSET-003-02`/`TC-ASSET-003-02` (unaffected, fully testable)
retain their prior status. **`TC-DASH-01`/`-02` and `TC-EXEC-001-01`/`-02`
were rewritten (2026-08-31, Open Finding F-22) and are no longer blocked**
— they now test the actual shipped 8-tile KPI grid / 10-section list and
are expected to pass structurally against the current app (see §4, §16
above). `TC-DASH-03` is new (mapping the also-new `AC-DASH-03`) and carries
forward the sole remaining blocker — NBV/Risk/Utilization absence from the
shipped grid, tracked under Open Finding F-03 — that previously sat on
`TC-DASH-01`/`TC-EXEC-001-01`; `TC-EXEC-001` has no equivalent numbered
`-03` case (AC-EXEC-001 documents the same gap as an unnumbered note, not a
separate criterion — see §16's note). This is a scope/spec correction to
match `RAISE-TEST-PLAN.md` v0.7 / `RAISE-ACCEPTANCE-CRITERIA.md` v0.7, not
a report of new PASS/FAIL execution results.

**TS-MAINT-001 expanded from 2 to 9 test cases (2026-08-21, Test Plan v0.4 §7/§8; AC v0.4
§12):** seven new cases (`TC-MAINT-001-03` through `-09`) were added for the newly
confirmed 4-stage workflow's stage-transition criteria (`AC-MAINT-001-03..09`).
`TC-MAINT-001-03` (User Requisition submit) and `TC-MAINT-001-09` (stage-progress
indicator) are fully testable — neither carries an RBAC dependency in the AC text.
`TC-MAINT-001-04` through `-08` are **BLOCKED (partial)**: `-04` and `-05` each carry an
additional, independent block (delegated-approver authorization rule NOT TESTABLE YET for
`-04`; Reject/Request Info resulting state/flow NOT TESTABLE YET for `-05`), and `-04`
through `-08` all depend on `RAISE-NFR-SEC-RBAC-001` — the MVP enforcement level is
confirmed as UI-only/client-side (PRD §16 Resolved Question 38), but the role list and
permission matrix (Q22) remain TBD, so none of these five cases can verify that the
acting user's role (Dept Approver, IT Dispatcher, Technician) is correctly gated, only
that the state transition itself occurs. `TC-LOGIN-03` and `TC-OPS-002-01` had their
Blocked-column wording updated in place (no count change) to cite this same confirmed
RBAC enforcement level explicitly, mirroring `RAISE-TEST-PLAN.md` v0.4 §7/§8.

**4 new test cases (`TC-AI-DOC-001-01`–`TC-AI-DOC-004-01`) are BLOCKED (full)**
— the first instance of this marking in this document. Unlike a BLOCKED
(partial) case, each has no non-blocked structural behavior to execute in
the interim: the sole AC criterion in each of `AC-AI-DOC-001`–`AC-AI-DOC-004`
is marked NOT TESTABLE YET in its entirety (`RAISE-ACCEPTANCE-CRITERIA.md`
§19.5–§19.8), and the Prototype describes only a reserved screen location,
not a concrete UI element (`RAISE-TEST-PLAN.md` §8.1). Each row is a
placeholder that exists solely to preserve 1:1 AC-to-TC traceability and is
assigned Level L5 (Traceability Regression) only, per Test Plan §7 — no
L1–L4 step could be written without inventing detail that does not exist
in `RAISE-PRD.md`, `RAISE-DESIGN.md`, or `RAISE-PROTOTYPE.md`.

**1 test case (`TC-LIFE-001-03`) is Out of
Scope for MVP**, not blocked — Disposal was confirmed Enterprise Roadmap
on 2026-08-21 (`RAISE-PRD.md` §14 item 7), so the capability it would
exercise is intentionally not built in MVP, not merely undecided. None
were skipped or silently marked pass/fail in advance.

---

## 20. Test Case Review Checklist

Before moving to the Requirement Traceability Matrix / Development:

- [ ] Every AC criterion in `RAISE-ACCEPTANCE-CRITERIA.md` has exactly
      one corresponding test case
- [ ] No test case exists without a matching AC ID
- [ ] Every BLOCKED (partial) test case cites the specific PRD Open
      Question it depends on
- [ ] Every BLOCKED (full) test case cites the specific PRD Open
      Question it depends on, and confirms no non-blocked structural
      behavior exists to test in the interim (else it should be
      BLOCKED (partial), not full)
- [ ] Every BLOCKED (pending implementation) test case (§1) confirms the
      underlying AC criterion is fully specified and testable, and that
      the block is solely due to the described UI behavior not yet being
      built — not conflated with a PRD-Open-Question-driven BLOCKED
      (partial)/(full) marking
- [ ] Test data listed is illustrative/minimal, not a finalized data
      dictionary (schemas remain TBD per Test Plan §10)
- [ ] No test case was written for a Pilot/Roadmap capability
      (Risk Scoring, Lifecycle Prediction, AI Recommendation, etc.)
- [ ] No VERSCAN-only behavior appears as an expected result
- [x] PRD §10 / Design §16A / Prototype §25A / AC §19.9 / Test Plan §3.3's NFR backlog is
      explicitly acknowledged (§18.5) rather than silently absent from this document — no
      test case is invented for any of the ten open areas

---

## 21. Next Step

```text
RAISE-PRD.md
      ↓
RAISE-DESIGN.md
      ↓
RAISE-PROTOTYPE.md
      ↓
RAISE-ACCEPTANCE-CRITERIA.md
      ↓
RAISE-TEST-PLAN.md
      ↓
RAISE-TEST-CASES.md        ← Current
      ↓
RAISE-TRACEABILITY-MATRIX.md
      ↓
Development
      ↓
RAISE-COMPLIANCE-REVIEW.md
```

The next artifact, `RAISE-TRACEABILITY-MATRIX.md`, should consolidate the
full chain (PRD Requirement → Design Area → Prototype Screen → AC ID →
Suite ID → TC ID) into one master table for compliance review.

---

## Document Status

**Version:** 0.10 (2026-09-01 — formal test case execution closes out
`TC-ALERT-001-01`/`-02` against the newly implemented Alerts screen (P-012,
Open Finding F-32); `RAISE-TEST-PLAN.md`/`RAISE-ACCEPTANCE-CRITERIA.md`
remain at v0.8, unchanged by this update)

**Change Log — v0.9 → v0.10 (2026-09-01, formal test case execution — real
PASS result, not a scope/spec correction):**

1. **Root cause / trigger.** The Alerts screen (P-012) has been implemented:
   new `frontend/src/pages/Alerts/index.tsx`, registered at
   `ROUTES.NOTIFICATIONS` (`/notifications`) in `App.tsx`. Per explicit
   business decision, this scoped-down screen derives its one
   alert-triggering condition from the one already confirmed elsewhere in
   the app — an asset's `warrantyExpiry` being in the past, the same
   `isWarrantyExpired` check the Assets list's Warranty column already uses.
   Severity is rendered honestly as "Not yet defined" (not an invented
   High/Medium/Low value, since severity mapping remains undefined per Open
   Finding F-05); Description and the associated Asset (clickable, navigates
   to Asset Detail) are also shown. No Email/Teams/LINE delivery UI exists
   anywhere on the page.
2. **No change to `RAISE-ACCEPTANCE-CRITERIA.md` AC-ALERT-001.** It already
   correctly scoped `AC-ALERT-001-01` as testable only for structural
   behavior (an alert lists severity/description/asset when opened),
   separately from which specific severity/trigger-rule values are correct
   (that remains **NOT TESTABLE YET**, tied to Open Finding F-05, PRD §6.9).
   This implementation satisfies exactly that structural scope, so no
   upstream document changed.
3. **§14 TS-ALERT-001 — new "Status Note" added**, recording the
   implementation and execution evidence: navigating to `/notifications`
   (previously 404'd, now renders 11 rows matching the Dashboard's "Expired
   Warranty: 11" tile exactly); confirming a representative row (AST-0013,
   Dell OptiPlex 7090) shows Severity "Not yet defined," Description
   "Warranty expired 2024-03-15," and a clickable Asset link that correctly
   navigates to Asset Detail; and confirming no Email/Teams/LINE
   delivery-channel UI exists anywhere on the page. Also records new
   automated coverage: `frontend/src/pages/Alerts/index.test.tsx` (2 new
   tests, covering `TC-ALERT-001-01` and `TC-ALERT-001-02`), and the full
   frontend suite (149 tests, up from 147) passes with no regressions;
   `tsc --noEmit` and lint both clean.
4. **`TC-ALERT-001-01`'s Blocked column changed from `BLOCKED (partial)` to
   `No — PASS on the display mechanism`**, mirroring the precedent set by
   `TC-EXEC-001-01`/`TC-DASH-01` and `TC-ASSET-002-01`: the AC's
   testable-now subset (structural display) is confirmed working, while the
   still-open trigger-rule/severity question (Open Finding F-05) remains
   explicitly unresolved, and the "authorized user" gate note (PRD §16 Q22)
   is carried forward unaffected.
5. **`TC-ALERT-001-02`'s Blocked column changed from `No` (not blocked, not
   yet executed) to `No` with formal execution evidence appended** —
   confirmed **PASS**.
6. **§19 Test Case Summary** updated: TS-ALERT-001 row moves from
   `2 | 1 | 1 | 0 | 0` to `2 | 2 | 0 | 0 | 0` (Total/Fully Testable/Partially
   Blocked/Blocked Full/Out of Scope). Grand **Total** row updated from
   `63 | 34 | 24 | 4 | 1` to `63 | 35 | 23 | 4 | 1`; the narrative "24 of 63
   test cases are partially blocked" sentence updated to "23 of 63." A new
   explanatory note was added directly above that sentence.
7. **No other suite required changes.** `TC-LOGIN-*`, `TC-DASH-*`,
   `TC-ASSET-001-*`, `TC-ASSET-001-D-*`, `TC-LIFE-001-*`, `TC-ASSET-002-*`,
   `TC-ASSET-003-*`, `TC-OPS-001-*`, `TC-OPS-002-*`, `TC-MAINT-001-*`,
   `TC-WARRANTY-001-*`, `TC-ORACLE-001-*`, `TC-AUDIT-001-*`, `TC-EXEC-001-*`,
   `TC-AI-SEARCH-001-*`, `TC-AI-STATES-*`, and `TC-AI-DOC-001-01`–
   `TC-AI-DOC-004-01` retain their prior status and wording verbatim.
8. **Neither `RAISE-TEST-PLAN.md` nor `RAISE-ACCEPTANCE-CRITERIA.md` was
   touched** — this is real test execution reporting a PASS on the
   testable-now scope, not a scope/spec correction to an earlier layer.

**Change Log — v0.8 → v0.9 (2026-09-01, formal test case execution — real
PASS result, not a scope/spec correction):**

1. **Root cause / trigger.** The UI code change identified as outstanding in
   the v0.7 → v0.8 log below (nesting the "By Category" view one level
   deeper: Category → Type → individual assets) has now shipped in
   `frontend/`, and `TC-ASSET-002-03` was formally executed against the real
   running app.
2. **§7 TS-ASSET-002 — new "Status Note — Closed 2026-09-01" added**,
   recording the execution evidence: navigating to `/assets`, opening the "By
   Category" tab, expanding "IT Hardware" (confirmed Type-level sub-groups
   only — Headphones/Laptop/Monitor with count badges, no individual assets
   at that level), then expanding "Laptop" (confirmed exactly its 3
   individual assets — AST-0001/AST-0011/AST-0012 — and none of the other
   Type sub-groups' assets). Also records new automated coverage:
   `frontend/src/pages/Assets/index.test.tsx` now carries 3 tests for this
   view (`TC-ASSET-002-01`, the Type-sub-group-expansion behavior, and
   `TC-ASSET-002-03`), and the full frontend suite (145 tests) passes with no
   regressions.
3. **`TC-ASSET-002-03`'s Blocked column changed from BLOCKED (pending
   implementation) to `No — closed and PASS, 2026-09-01`**, with the
   execution evidence summarized inline. This is the first case in this
   document to close out of the BLOCKED (pending implementation) marking
   introduced at v0.8 — §1's definition of that marking was updated to note
   the closure and that the marking currently has zero active occurrences,
   though it remains defined for future use.
4. **`TC-ASSET-002-01`'s Blocked column appended** with the same execution
   evidence (it corroborates the Category → Type hierarchy `TC-ASSET-002-01`
   already asserts); its classification is unchanged — it was already fully
   testable, not blocked, before this update.
5. **`TC-ASSET-002-02` unchanged** — a one-line note was added confirming it
   is unaffected by this execution (still a consistency-only case), per its
   own scope.
6. **§19 Test Case Summary** updated: TS-ASSET-002 row moves from
   `3 | 2 | 1 | 0 | 0` to `3 | 3 | 0 | 0 | 0` (Total/Fully Testable/Partially
   Blocked/Blocked Full/Out of Scope). Grand **Total** row updated from
   `63 | 33 | 25 | 4 | 1` to `63 | 34 | 24 | 4 | 1`; the narrative "25 of 63
   test cases are partially blocked" sentence updated to "24 of 63," and the
   "Note on columns" paragraph updated to record that the BLOCKED (pending
   implementation) marking now has zero active occurrences.
7. **Follow-up noted, not made here:** `RAISE-TEST-PLAN.md` §8's blocked-item
   entry for this same item may also need a matching update to reflect the
   closure — that is out of scope for this update (per instruction, Test
   Plan and earlier layers are not touched here) and is left as an explicit
   follow-up.
8. **No other suite required changes.** `TC-LOGIN-*`, `TC-DASH-*`,
   `TC-ASSET-001-*`, `TC-ASSET-001-D-*`, `TC-LIFE-001-*`, `TC-ASSET-003-*`,
   `TC-OPS-001-*`, `TC-OPS-002-*`, `TC-MAINT-001-*`, `TC-WARRANTY-001-*`,
   `TC-ORACLE-001-*`, `TC-ALERT-001-*`, `TC-AUDIT-001-*`, `TC-EXEC-001-*`,
   `TC-AI-SEARCH-001-*`, `TC-AI-STATES-*`, and `TC-AI-DOC-001-01`–
   `TC-AI-DOC-004-01` retain their prior status and wording verbatim.

**Change Log — v0.7 → v0.8 (2026-09-01, Open Finding F-27 scope/spec
correction, per confirmed business decision):**

1. **Root cause.** `RAISE-TEST-PLAN.md` v0.8 §7/§8 and
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.8 §8 resolved Open Finding F-27:
   `RAISE-PROTOTYPE.md` v0.9 §11 confirms "sub-category" is the existing Asset
   `type` field (not a new field/data model), the hierarchy is exactly 2
   levels (Category → Type → individual assets), and the tree shown is the
   real, currently-seeded Category → Type breakdown from
   `frontend/src/data/fixtures/mockData.ts`, replacing the prior illustrative
   example. This is a scope/spec correction resolving a previously-open
   question, not a new requirement.
2. **New third BLOCKED marking introduced (§1): BLOCKED (pending
   implementation).** Distinct from BLOCKED (partial)/(full), which are both
   driven by an AC criterion marked NOT TESTABLE YET, this new marking covers
   a case where the AC criterion is fully specified and testable, but the UI
   behavior it describes has not yet been built. First used for
   `TC-ASSET-002-03` below.
3. **§7 TS-ASSET-002 — `TC-ASSET-002-01` rewritten and unblocked.** Now
   asserts the real, currently-seeded Category → Type hierarchy (IT Hardware
   → Laptop/Monitor/Headphones; Mobile → Smartphone/Tablet; Office Equipment
   → Printer/Projector; Infrastructure → Server/Router; Media Equipment →
   Camera) instead of an illustrative, unfinalized taxonomy. No longer
   BLOCKED.
4. **§7 TS-ASSET-002 — `TC-ASSET-002-02` unchanged.**
5. **§7 TS-ASSET-002 — new `TC-ASSET-002-03` added**, mapping the also-new
   `AC-ASSET-002-03` (category → type expand/drill-down behavior). Marked
   **BLOCKED (pending implementation)**: the shipped "By Category" view (Open
   Finding F-25) currently groups Category → flat asset list only, with no
   Type-level nesting yet, so the described expand behavior cannot be
   executed until a follow-up UI code change ships. This case does **not**
   report a PASS or an expected-pass — it is not executable in the current
   build, and no execution result (PASS or FAIL) is claimed by this update.
6. **§19 Test Case Summary** updated: TS-ASSET-002 row moves from
   `2 | 1 | 1 | 0 | 0` to `3 | 2 | 1 | 0 | 0` (Total/Fully
   Testable/Partially Blocked/Blocked Full/Out of Scope). Grand **Total** row
   updated from `62 | 32 | 25 | 4 | 1` to `63 | 33 | 25 | 4 | 1`; the
   narrative "25 of 62 test cases are partially blocked" sentence updated to
   "25 of 63," with a note distinguishing `TC-ASSET-002-03`'s
   implementation-pending block from the PRD-Open-Question-driven blocks in
   the rest of that count. A new note explaining the column-mapping choice
   for the new marking (no new summary column added yet) was also added.
7. **§20 Test Case Review Checklist** gained a new item confirming BLOCKED
   (pending implementation) cases are not conflated with the two existing
   AC-Open-Question-driven markings.
8. Version citations in the document header updated: Test Plan v0.7 → v0.8,
   AC v0.7 → v0.8. **No other suite required changes** — Test Plan v0.8's
   only substantive change from v0.7 is the TS-ASSET-002 resolution; every
   other AC group this document maps 1:1 to is unchanged in substance.
   `TC-LOGIN-*`, `TC-DASH-*`, `TC-ASSET-001-*`, `TC-ASSET-001-D-*`,
   `TC-LIFE-001-*`, `TC-ASSET-003-*`, `TC-OPS-001-*`, `TC-OPS-002-*`,
   `TC-MAINT-001-*`, `TC-WARRANTY-001-*`, `TC-ORACLE-001-*`,
   `TC-ALERT-001-*`, `TC-AUDIT-001-*`, `TC-EXEC-001-*`, `TC-AI-SEARCH-001-*`,
   `TC-AI-STATES-*`, and `TC-AI-DOC-001-01`–`TC-AI-DOC-004-01` retain their
   prior status and wording verbatim.

**Change Log — v0.6 → v0.7 (2026-08-31):**

1. **TC-DASH-01/-02 and TC-EXEC-001-01/-02 rewritten to match `RAISE-TEST-PLAN.md` v0.7 /
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.7's corrected AC-DASH (§5) and AC-EXEC-001 (§17), per
   explicit business decision on [Open Finding
   F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question).**
   All four cases previously asserted a stale "Asset Overview"/"Executive Asset
   Intelligence" wireframe (Total Assets/NBV/Risk/Warranty Expiry tiles; "Asset by
   Category"/"Lifecycle / Maintenance Overview"/"Recent Alerts"/"Asset Overview"/"Executive
   Summary" sections) that formal test execution already confirmed FAIL against the real
   app (`TC-EXEC-001-01`/`-02`, 2026-08-26; `TC-DASH-01..03`, 2026-08-29). This is a
   scope/spec correction to match Test Plan v0.7's already-corrected content, not a new
   requirement, and it reports no new PASS/FAIL execution result — actual formal execution
   against the rewritten steps is deferred to a future execution sweep.
2. **`TC-DASH-01` and `TC-EXEC-001-01`** now assert the actual shipped 8-tile KPI grid
   (Total Assets, Available, Assigned, In Maintenance, Expired Warranty, Software Licenses,
   Monthly Depreciation, Monthly Cost) and are **no longer BLOCKED** — fully testable for
   presence, with the Monthly Depreciation/Monthly Cost illustrative-figures caveat and a
   presence-only (not calculation-correctness) scope carried over from the AC document.
3. **`TC-DASH-02` and `TC-EXEC-001-02`** now assert the actual shipped 10-section list (AI
   Insights, AI Portfolio Health, Oracle FA Reconciliation, Asset Lifecycle, Department
   Distribution, Asset Status, Asset Type, Pending Approvals, Recent Activities, Maintenance
   Calendar) and are **no longer BLOCKED** — fully testable for presence.
4. **New `TC-DASH-03` added**, mapping the also-new `AC-DASH-03`: it tests that NBV, Risk,
   and Utilization tiles are confirmed absent from the shipped grid tested by `TC-DASH-01`.
   Marked **BLOCKED (partial)** — the absence-check itself is testable now (expected to pass
   structurally), while whether/when these three proposal KPIs should be built, and their
   formulas/thresholds/placement, remains NOT TESTABLE YET pending [Open Finding
   F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement) (PRD §16
   Q3–Q4). No equivalent `TC-EXEC-001-03` is created — `AC-EXEC-001` (§17) documents the
   same gap as an unnumbered narrative note, not a separate numbered criterion, so per this
   document's own TC ID convention (§2) no new TC ID is invented for it; the substance is
   instead carried as an explanatory note under §16 (`TC-EXEC-001-01`/`-02`'s section)
   pointing back to `TC-DASH-03`.
5. **§19 Test Case Summary** updated: TS-DASH row unchanged at `3 | 2 | 1 | 0 | 0` (the
   count of blocked cases stays 1, but the blocked case moved from `TC-DASH-01` to the new
   `TC-DASH-03`); TS-EXEC-001 row updated from `2 | 0 | 2 | 0 | 0` to `2 | 2 | 0 | 0 | 0`.
   Grand **Total** row updated from `62 | 30 | 27 | 4 | 1` to `62 | 32 | 25 | 4 | 1`; the
   narrative "27 of 62 test cases are partially blocked" sentence updated to "25 of 62,"
   and its `TC-DASH-01`/`TC-EXEC-001-01` reference rewritten to describe the current state.
6. Version citations in the document header updated from Test Plan v0.6 / AC v0.6 to Test
   Plan v0.7 / AC v0.7. **No other suite required changes** — Test Plan v0.7's only
   substantive change from v0.6 is the TS-DASH/TS-EXEC-001 correction; every other AC group
   this document maps 1:1 to is unchanged in substance. `TC-LOGIN-*`, `TC-ASSET-001-*`,
   `TC-ASSET-001-D-*`, `TC-LIFE-001-*`, `TC-ASSET-002-*`, `TC-ASSET-003-*`, `TC-OPS-001-*`,
   `TC-OPS-002-*`, `TC-MAINT-001-*`, `TC-WARRANTY-001-*`, `TC-ORACLE-001-*`,
   `TC-ALERT-001-*`, `TC-AUDIT-001-*`, `TC-AI-SEARCH-001-*`, `TC-AI-STATES-*`, and
   `TC-AI-DOC-001-01`–`TC-AI-DOC-004-01` retain their prior status and wording verbatim,
   including `TC-LIFE-001-04`'s existing "inherits blockers from AC-EXEC-001 and
   AC-AI-SEARCH-001" note — that note is out of scope for this correction (Test Plan v0.7
   touched only TS-DASH/TS-EXEC-001) and is left as-is pending a future pass; it is now
   stale with respect to `AC-EXEC-001-01` specifically (no longer blocked) but still
   accurate with respect to `AC-AI-SEARCH-001`.

**Change Log — v0.5 → v0.6 (2026-08-29):**

1. **TS-WARRANTY-001 field-list blocker resolved.** Test Plan v0.6 §7/§8 (carrying AC v0.6
   §13's resolution of PRD Open Question 15, `RAISE-PRD.md` §16 Resolved Question 40): for
   MVP, the Warranty domain has exactly one field on the Asset record, `warrantyExpiry`; a
   draft 8-field proposal (start date, provider/vendor, type, coverage details, cost, claim
   contact, document reference) was explicitly **rejected** for MVP by the business, not
   deferred. `TC-WARRANTY-001-01` ("Warranty fields display") and `TC-WARRANTY-001-02`
   ("Warranty timeline state displays") previously asserted a stale "Start Date, End Date,
   Status" three-field shape that no longer matches `RAISE-PROTOTYPE.md` §14 (P-010) or
   `RAISE-ACCEPTANCE-CRITERIA.md` §13. Both cases were rewritten to test only the
   `warrantyExpiry` field's display and the UI-computed Active/Expiring/Expired timeline
   state derived from it (not a separately stored field), and both are now **fully
   testable (no longer BLOCKED)**. None of the seven rejected fields appears in either
   case's Steps, Test Data, or Expected Result.
2. **`TC-WARRANTY-001-03`'s 90-day-window blocker is unaffected and stays BLOCKED
   (partial).** This is a separate, still-open question from the field-list resolution —
   the 90-day figure in PRD §6.7 remains an illustrative business example, not a confirmed,
   generalizable rule for the expiring-assets view's window(s). Its wording was updated
   only to note it is unaffected by the 2026-08-29 field-list resolution; its classification
   is unchanged.
3. **§19 Test Case Summary** TS-WARRANTY-001 row updated from `3 | 1 | 2 | 0 | 0` to
   `3 | 2 | 1 | 0 | 0` (Total/Fully Testable/Partially Blocked/Blocked Full/Out of Scope).
   Grand **Total** row updated from `62 | 29 | 28 | 4 | 1` to `62 | 30 | 27 | 4 | 1`; the
   narrative "28 of 62 test cases are partially blocked" sentence updated to "27 of 62."
4. Version citations in the document header updated from Test Plan v0.5 / AC v0.5 to Test
   Plan v0.6 / AC v0.6. No other suite required changes — Test Plan v0.6's only
   substantive change from v0.5 is the TS-WARRANTY-001 field-list resolution; every other
   AC group this document maps 1:1 to is unchanged in substance.

No other suite required changes; `TC-LOGIN-*`, `TC-DASH-*`, `TC-ASSET-001-*`,
`TC-ASSET-001-D-*`, `TC-LIFE-001-*`, `TC-ASSET-002-*`, `TC-ASSET-003-*`, `TC-OPS-001-*`,
`TC-OPS-002-*`, `TC-MAINT-001-*`, `TC-ORACLE-001-*`, `TC-ALERT-001-*`, `TC-AUDIT-001-*`,
`TC-EXEC-001-*`, `TC-AI-SEARCH-001-*`, `TC-AI-STATES-*`, and `TC-AI-DOC-001-01`–
`TC-AI-DOC-004-01` are unaffected by Test Plan v0.6's changes.

**Change Log — v0.4 → v0.5 (2026-08-23):**

1. **New §18.5 "PRD §10 NFR Backlog — No Test Cases" added, mirroring Test Plan v0.5 §3.3
   (itself mirroring AC v0.5 §19.9).** Test Plan v0.5 added an explicit per-area
   acknowledgment of the PRD §10 / Design §16A / Prototype §25A NFR backlog (Performance,
   Availability, Scalability, Backup/Recovery, Data Retention, Encryption, API Security,
   Audit Retention, Monitoring, Logging), recording that no `TS-NFR-*` suite exists for
   any of the ten open areas because no AC group exists for any of them. This document had
   no equivalent acknowledgment — new §18.5 now records, per area, that no test case
   exists (or, for Authentication/Authorization-RBAC and Audit Retention, exactly what
   narrow test case coverage already exists via `TC-LOGIN-*`, `TC-OPS-002-01`,
   `TC-MAINT-001-04..08`, and `TC-AUDIT-001-01`). **No new test case was invented** —
   this pass only ensures the document does not silently omit reference to these ten
   areas, consistent with this document's own §2 convention (no test case without a
   matching AC ID). §19 Test Case Summary totals are unchanged (62 TCs; the new section
   adds zero test cases).
2. **Test Case Review Checklist (§20)** gained a new checklist item confirming the PRD
   §10 NFR backlog is explicitly acknowledged rather than silently absent.
3. **Verified 1:1 AC-to-TC coverage against AC v0.5.** AC v0.5's only substantive change
   versus AC v0.4 was the addition of §19.9 (a traceability-note-only section with no new
   AC group, mirrored above) — confirmed that AC-LOGIN through AC-AI-DOC-004, and the
   License Management Roadmap-only traceability note, are unchanged in substance, so no
   existing test case (§3–§18.4) required a content correction. In particular,
   `TC-MAINT-001-03` through `-09` (added at v0.4) already cover `AC-MAINT-001-03..09`
   in full — the Test Plan's suggestion to re-check this coverage found it already
   complete, requiring no new test cases.
4. Version citations in the document header were updated from Test Plan v0.4 / AC (v0.4
   implied) to Test Plan v0.5 / AC v0.5.

No other suite required changes; `TC-LOGIN-*`, `TC-DASH-*`, `TC-ASSET-001-*`,
`TC-ASSET-001-D-*`, `TC-LIFE-001-*`, `TC-ASSET-002-*`, `TC-ASSET-003-*`, `TC-OPS-001-*`,
`TC-OPS-002-*`, `TC-MAINT-001-*`, `TC-WARRANTY-001-*`, `TC-ORACLE-001-*`, `TC-ALERT-001-*`,
`TC-AUDIT-001-*`, `TC-EXEC-001-*`, `TC-AI-SEARCH-001-*`, `TC-AI-STATES-*`, and
`TC-AI-DOC-001-01`–`TC-AI-DOC-004-01` are unaffected by Test Plan v0.5's changes.

**Change Log — v0.3 → v0.4 (2026-08-21):**

1. **TS-MAINT-001 expanded from 2 to 9 test cases.** Test Plan v0.4 §7/§8 (carrying AC v0.4
   §12's seven new stage-transition criteria, `AC-MAINT-001-03..09`) confirmed the 4-stage
   maintenance workflow's state model as testable for state transitions. Seven new test
   cases were added: `TC-MAINT-001-03` (User Requisition submit — fully testable),
   `TC-MAINT-001-04` (Dept Approval Approve — **BLOCKED (partial)**, delegated-approver
   rule NOT TESTABLE YET plus RBAC dependency), `TC-MAINT-001-05` (Reject/Request Info —
   **BLOCKED (partial)**, resulting state/flow NOT TESTABLE YET plus RBAC dependency),
   `TC-MAINT-001-06` (IT Dispatch — **BLOCKED (partial)**, RBAC dependency),
   `TC-MAINT-001-07` (Technician status update — **BLOCKED (partial)**, RBAC dependency),
   `TC-MAINT-001-08` (Mark Complete — **BLOCKED (partial)**, RBAC dependency), and
   `TC-MAINT-001-09` (stage-progress indicator — fully testable, no RBAC dependency in the
   AC text). §11's suite-level note and §19 Test Case Summary (row + totals) were updated
   accordingly.
2. **New §11.5 added: License Management — No Test Suite (Confirmed Out of Scope).**
   Explicitly records, consistent with Test Plan v0.4 §3.2 and AC v0.4 §3, that
   `RAISE-FR-LICENSE-001` (P-016/P-017) remains Enterprise Roadmap with no
   `AC-LICENSE-001` group and no `TS-LICENSE-001` suite, so no test cases exist for it —
   this is a deliberate, verified absence, not an oversight.
3. **`TC-LOGIN-03` and `TC-OPS-002-01` Blocked-column wording updated** to cite the
   confirmed RBAC MVP enforcement level (PRD §16 Resolved Question 38; Design §16 — a
   UI-only/client-side permission check is accepted for MVP, backend enforcement deferred
   to Roadmap), mirroring `RAISE-TEST-PLAN.md` v0.4 §7/§8's TS-LOGIN and TS-OPS-002 rows.
   This is a wording-only change; neither case's BLOCKED (partial) classification or the
   §19 Summary counts change as a result, since both were already counted as partially
   blocked.

No other suite's test cases required changes; `TC-DASH-*`, `TC-ASSET-001-*`,
`TC-ASSET-001-D-*`, `TC-LIFE-001-*`, `TC-ASSET-002-*`, `TC-ASSET-003-*`, `TC-OPS-001-*`,
`TC-OPS-002-02`/`-03`, `TC-WARRANTY-001-*`, `TC-ORACLE-001-*`, `TC-ALERT-001-*`,
`TC-AUDIT-001-*`, `TC-EXEC-001-*`, `TC-AI-SEARCH-001-*`, `TC-AI-STATES-*`, and
`TC-AI-DOC-001-01`–`TC-AI-DOC-004-01` are unaffected by Test Plan v0.4's changes.

**Change Log — v0.2 → v0.3 (2026-08-21):**

1. **`TC-DASH-01` and `TC-EXEC-001-01` Blocked-column wording updated** to mirror
   Test Plan v0.3 §7/§8 and AC v0.3 §5/§17: Utilization is now split into
   **testable now** (tile *presence* + the confirmed assignment-time-based
   definition, per PRD v0.3 §16 Resolved Question 27 / Design v0.4 §13) vs.
   **NOT TESTABLE YET** (calculation mechanics only — how "assigned" time is
   measured, what "total available time" excludes, aggregation window/
   granularity). Both cases remain **BLOCKED (partial)** overall (NBV/Risk
   formulas and other tile behavior are still fully open), but the wording no
   longer implies the whole Utilization concept is undefined.
2. **Four new suites' test cases added: `TS-AI-DOC-001`–`TS-AI-DOC-004`**
   (§18.1–§18.4), each with exactly one placeholder test case
   (`TC-AI-DOC-001-01`–`TC-AI-DOC-004-01`) marked **BLOCKED (full)** — the
   first use of this marking in this document, distinct from BLOCKED
   (partial). PRD v0.3 §16 Resolved Question 28 assigned each AI Document
   Intelligence capability its own Traceability ID at P0/MVP, and AC v0.3
   §19.5–§19.8 added a dedicated, entirely-NOT-TESTABLE-YET AC group for
   each; Test Plan v0.3 §7/§8.1 added the corresponding fully-blocked
   suites (Level L5 only). Because each AC group's sole criterion has no
   non-blocked structural behavior to fall back on, no L1–L4 steps could be
   written — each placeholder row exists only to preserve 1:1 AC-to-TC
   traceability, to be re-verified at each L5 run. The stale "Traceability
   gap note" under §6 (`TS-ASSET-001-DETAIL`), written when these
   capabilities had no ID or AC group, was replaced with a note pointing to
   the new §18.1–§18.4 sections. §1 was updated to define BLOCKED (partial)
   vs. BLOCKED (full). §19 Test Case Summary and §20 Review Checklist were
   updated accordingly (new "Blocked (Full)" column; totals now 55 TCs — 27
   fully testable, 23 partially blocked, 4 blocked (full), 1 out of scope).

**Status:** Draft for Test Case Review
**Source:** [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.8
**Reference:** VERSCAN only
**Next Action:** Review the v0.9 update — `TC-ASSET-002-03` (and its
corroborating evidence on `TC-ASSET-002-01`) is now formally executed and
**closed with a PASS** result, following the UI code change that nested the
"By Category" view one level deeper (Category → Type → individual assets).
TS-ASSET-002 is now fully testable and fully passing (3 of 3 test cases). A
follow-up update to `RAISE-TEST-PLAN.md` §8's blocked-item note for this same
item is recommended but not made here (out of scope for this update). Then
proceed to `RAISE-TRACEABILITY-MATRIX.md` to propagate this PASS result and
close the corresponding gap/finding entries there.
