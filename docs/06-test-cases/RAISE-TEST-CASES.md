# RAISE Test Cases

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Test Cases
**Version:** 0.4 Draft
**Status:** Draft for Test Case Review
**Source:** [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.4 §7 (Test Suites) + §8 (Blocked Items) + §8.1 (Fully-Blocked Suites — AI Document Intelligence Capabilities), expanding [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md)
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

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-DASH-01 | Summary tiles render | 1. Log in. 2. Land on Dashboard. | Any asset dataset | Total Assets, NBV, Risk, Warranty Expiry tiles are displayed | **BLOCKED (partial)** — tile presence is testable for all listed tiles; NBV/Risk value correctness is not confirmed (PRD §16 Q3/Q4); "Total Assets"/"Warranty Expiry" tile behavior is also unconfirmed. **Utilization specifically (resolved 2026-08-21, partial):** PRD v0.3 §16 Resolved Question 27 and Design v0.4 §13 confirmed Utilization's definition as assignment-time-based (% of time an asset is assigned to a user/department, relative to total available time). **Testable now:** this case may verify that a tile labeled "Utilization" is *present*, and that the tile is documented/described against this confirmed definition. **NOT TESTABLE YET (calculation mechanics only):** how "assigned" state/time is measured against Custody (P-006), what "total available time" excludes, and the aggregation window/granularity — no numeric value, formula, or threshold may be asserted for Utilization until this is resolved (see `RAISE-ACCEPTANCE-CRITERIA.md` §5; `RAISE-TEST-PLAN.md` §8 TS-DASH row). |
| TC-DASH-02 | Category and lifecycle views render | 1. Land on Dashboard with asset data present. | Assets across ≥2 categories | "Asset by Category" and "Lifecycle / Maintenance Overview" sections are displayed | No |
| TC-DASH-03 | Recent alerts section renders | 1. Ensure ≥1 alert exists. 2. Land on Dashboard. | ≥1 triggered alert | "Recent Alerts" section is displayed | No |

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

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ASSET-002-01 | Category hierarchy displays | 1. Open Category & Hierarchy screen. | ≥2-level category tree | Categories shown in parent/child hierarchy | **BLOCKED (partial)** — display mechanism testable; the actual hierarchy taxonomy is illustrative only, not finalized |
| TC-ASSET-002-02 | Asset category consistent across screens | 1. Assign asset to a category. 2. View it in Asset Registry. 3. View it in Asset Detail. | 1 asset, 1 assigned category | Same category shown in both Registry and Detail, matching the hierarchy view | No |

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

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-WARRANTY-001-01 | Warranty fields display | 1. Open Warranty screen for an asset. | 1 asset with Start/End/Status | Start Date, End Date, Status displayed | **BLOCKED (partial)** — display testable; whether additional fields are required is TBD (PRD §16 Q15) |
| TC-WARRANTY-001-02 | Warranty timeline state displays | 1. Open Warranty screen for assets in each state. | 3 assets: Active, Expiring, Expired | Corresponding timeline state shown for each | No |
| TC-WARRANTY-001-03 | 90-day expiring asset appears in expiring view | 1. Set an asset's warranty end date within 90 days. 2. Open Warranty expiring-assets view. | 1 asset, warranty end date = today+45 | Asset appears in expiring list; link opens its Asset Detail | **BLOCKED (partial)** — the 90-day threshold is an illustrative example, not a confirmed business rule (PRD §6.7) |

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

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-ALERT-001-01 | Triggered alert displays with severity/asset | 1. Trigger an alert-worthy condition. 2. Open Alerts. | 1 asset meeting an alert condition | Alert shown with severity, description, associated asset | **BLOCKED (partial)** — display testable; which conditions/severities are correct is TBD (PRD §6.9 Open Question); separately, the "authorized user" gate is testable only structurally since the role/permission model is undefined (PRD §16 Q22) |
| TC-ALERT-001-02 | Only in-app presentation verified | 1. Open Alerts screen. | ≥1 alert | Alert shown on-screen only; no Email/Teams/LINE delivery attempted | No |

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

| TC ID | Title | Steps | Test Data | Expected Result | Blocked |
|---|---|---|---|---|---|
| TC-EXEC-001-01 | KPI tiles display | 1. Log in as Executive. 2. Open Executive Dashboard. | Org-level asset dataset | NBV, Risk, Utilization tiles displayed | **BLOCKED (partial)** — tile presence testable for all three tiles; NBV/Risk formulas/thresholds TBD (PRD §16 Q3/Q4). **Utilization specifically (resolved 2026-08-21, partial):** same partial resolution as `TC-DASH-01` — PRD v0.3 §16 Resolved Question 27 / Design v0.4 §13 confirmed the assignment-time-based definition. **Testable now:** this case may verify that a tile labeled "Utilization" is *present*, and that the tile is documented against the confirmed definition. **NOT TESTABLE YET (calculation mechanics only):** how "assigned" time is measured against Custody, what "total available time" excludes, and the aggregation window/granularity — no value, formula, or threshold may be asserted until this is resolved (see `RAISE-ACCEPTANCE-CRITERIA.md` §17; `RAISE-TEST-PLAN.md` §8 TS-EXEC-001 row). NBV and Risk KPI formulas remain fully unresolved/open, unaffected by this change. |
| TC-EXEC-001-02 | Overview and summary sections display | 1. Open Executive Dashboard. | Org-level asset dataset | Asset Overview and Executive Summary sections present | **BLOCKED (partial)** — whether Executive Summary is AI-generated or static is unresolved (PRD §8.1 gap) |

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

## 19. Test Case Summary

| Suite | Total TCs | Fully Testable | Partially Blocked | Blocked (Full) | Out of Scope |
|---|---|---|---|---|---|
| TS-LOGIN | 3 | 0 | 3 | 0 | 0 |
| TS-DASH | 3 | 2 | 1 | 0 | 0 |
| TS-ASSET-001 | 4 | 3 | 1 | 0 | 0 |
| TS-ASSET-001-DETAIL | 2 | 2 | 0 | 0 | 0 |
| TS-LIFE-001 | 4 | 0 | 3 | 0 | 1 (`TC-LIFE-001-03` — Disposal, Enterprise Roadmap) |
| TS-ASSET-002 | 2 | 1 | 1 | 0 | 0 |
| TS-ASSET-003 | 3 | 1 | 2 | 0 | 0 |
| TS-OPS-001 | 3 | 3 | 0 | 0 | 0 |
| TS-OPS-002 | 3 | 1 | 2 | 0 | 0 |
| TS-MAINT-001 | 9 | 3 | 6 | 0 | 0 |
| TS-WARRANTY-001 | 3 | 1 | 2 | 0 | 0 |
| TS-ORACLE-001 | 4 | 3 | 1 | 0 | 0 |
| TS-ALERT-001 | 2 | 1 | 1 | 0 | 0 |
| TS-AUDIT-001 | 3 | 1 | 2 | 0 | 0 |
| TS-EXEC-001 | 2 | 0 | 2 | 0 | 0 |
| TS-AI-SEARCH-001 | 3 | 2 | 1 | 0 | 0 |
| TS-AI-STATES | 5 | 5 | 0 | 0 | 0 |
| TS-AI-DOC-001 | 1 | 0 | 0 | 1 | 0 |
| TS-AI-DOC-002 | 1 | 0 | 0 | 1 | 0 |
| TS-AI-DOC-003 | 1 | 0 | 0 | 1 | 0 |
| TS-AI-DOC-004 | 1 | 0 | 0 | 1 | 0 |
| **Total** | **62** | **29** | **28** | **4** | **1** |

28 of 62 test cases are partially blocked — executable against their
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
retain their prior status. `TC-DASH-01` and `TC-EXEC-001-01` remain
**BLOCKED (partial)** as of this version, but their wording was sharpened
(2026-08-21) to separate what is now testable (Utilization tile presence
+ confirmed assignment-time-based definition) from what remains NOT
TESTABLE YET (calculation mechanics only), per `RAISE-TEST-PLAN.md` v0.3
§7/§8 and `RAISE-ACCEPTANCE-CRITERIA.md` v0.3 §5/§17.

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
- [ ] Test data listed is illustrative/minimal, not a finalized data
      dictionary (schemas remain TBD per Test Plan §10)
- [ ] No test case was written for a Pilot/Roadmap capability
      (Risk Scoring, Lifecycle Prediction, AI Recommendation, etc.)
- [ ] No VERSCAN-only behavior appears as an expected result

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

**Version:** 0.4 (re-verified against `RAISE-TEST-PLAN.md` v0.4, 2026-08-21 — three
synchronization updates applied:)

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
**Source:** [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.4
**Reference:** VERSCAN only
**Next Action:** Review test cases and confirm blocked-item scoping before Traceability Matrix
