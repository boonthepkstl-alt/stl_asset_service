# RAISE Test Plan

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Test Plan
**Version:** 0.4 Draft
**Status:** Draft for Test Plan Review
**Source:** [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.4, cross-checked against [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.9, [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.7, [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.5
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

This document defines the test strategy for RAISE by organizing the
Acceptance Criteria (`RAISE-ACCEPTANCE-CRITERIA.md`) into test suites,
test levels, entry/exit criteria, and a blocked-items list.

It does **not** yet contain individual test cases (steps, test data,
expected results) — those belong in `RAISE-TEST-CASES.md`, the next
deliverable. This document answers **what will be tested, how, in what
order, and what cannot be tested yet.**

---

## 2. Principle: Plan Follows Criteria

```text
RAISE-ACCEPTANCE-CRITERIA.md   (what "correct" means, per screen)
     ↓
RAISE-TEST-PLAN.md             (how we organize testing it) ← this document
     ↓
RAISE-TEST-CASES.md            (exact steps / data / expected results)
```

Every test suite below maps to one Acceptance Criteria (AC) group. No
test suite is introduced for behavior that has no corresponding AC group.
Where an AC criterion is marked **NOT TESTABLE YET** in the source
document, the corresponding test item here is marked **BLOCKED**, not
silently made executable.

---

## 3. Test Scope

### 3.1 In Scope (MVP, per PRD §13 / Prototype §5)

All 15 prototype screens and their AC groups:

P-001 Login, P-002 Dashboard, P-003 Asset Registry, P-004 Asset Detail,
P-005 Category & Hierarchy, P-006 Custody History, P-007 QR/Barcode,
P-008 Check-in/Check-out, P-009 Maintenance, P-010 Warranty, P-011 Oracle
FA/Financial, P-012 Alerts, P-013 Audit Log, P-014 Executive Dashboard,
P-015 AI Assistant (Natural Language Search + AI Response States).

### 3.2 Out of Scope for this Test Plan

Per PRD §14 Enterprise Roadmap and §7 AI Requirements (Pilot/Roadmap
status), the following have **no MVP test suite** in this plan:

- AI Recommendation (`RAISE-AI-RECOMMEND-001`) — Roadmap
- Risk Scoring (`RAISE-AI-RISK-001`) — Pilot, not MVP-confirmed
- Lifecycle Prediction (`RAISE-AI-LIFECYCLE-001`) — Pilot, not MVP-confirmed
- Real-time ERP Integration, Native Mobile App, Predictive Analytics,
  Workflow Automation, Multi-channel Alerts (Email/Teams/LINE Notify)
- Asset Disposal workflow (terminal stage of `RAISE-FR-LIFE-001`) — Roadmap, confirmed
  2026-08-21 (see PRD §14 item 7); `TC-LIFE-001-03` is excluded rather than tested against
- **License Management (P-016 License Inventory / P-017 License Detail,
  `RAISE-FR-LICENSE-001`) — Roadmap, not MVP; no MVP test suite.** Confirmed at the AC
  layer (`RAISE-ACCEPTANCE-CRITERIA.md` v0.4 §3 traceability note, §21 checklist item):
  PRD §6/§13/§17 (Resolved Question 34) classify this requirement as Enterprise Roadmap,
  and no AC-LICENSE-001 Given/When/Then group was written for it — only a traceability
  note recording *why* no group exists. Per this Test Plan's own principle (§2 — no
  suite without a corresponding AC group), **no `TS-LICENSE-001` suite is created here**,
  consistent with the treatment already given to AI Recommendation, Risk Scoring, and
  Lifecycle Prediction above. If `RAISE-FR-LICENSE-001` is later promoted to MVP and a
  dedicated AC-LICENSE-001 group is added, a corresponding `TS-LICENSE-001` suite must be
  added here at that time — not before.

If any of these is promoted to MVP through business/product review, a
corresponding AC group must be added to `RAISE-ACCEPTANCE-CRITERIA.md`
first — this Test Plan will not test ahead of Acceptance Criteria.

---

## 4. Test Levels

| Level | Purpose | Applies To |
|---|---|---|
| L1 — Functional / Happy Path | Verify the primary flow described in each AC group succeeds | All 15 screens |
| L2 — Negative / Error State | Verify explicitly defined error, empty, and denied states | Login, QR Scan, Oracle Financial View, AI Response States |
| L3 — State Integrity | Verify data written by one flow is correctly reflected elsewhere (e.g., Check-out → Custody History → Audit Log) | Custody, Check-in/Check-out, Audit |
| L4 — Boundary / Integration | Verify behavior at the edge of an external dependency (Oracle FA availability, AI source availability/conflict) | Oracle FA, AI Assistant |
| L5 — Traceability Regression | Re-verify that every AC-to-requirement mapping still holds after any PRD/Design/Prototype change | All (run before each Compliance Review) |

Only L1–L4 produce individual test cases in `RAISE-TEST-CASES.md`. L5 is
a document-consistency check performed against this Test Plan and the
Traceability Matrix (§9 below), not a functional test.

---

## 5. Entry Criteria

Testing for a given suite may begin only when:

- The corresponding AC group in `RAISE-ACCEPTANCE-CRITERIA.md` exists and
  is not entirely blocked.
- The screen/flow is implemented per `RAISE-PROTOTYPE.md` (or, at
  Development stage, per working source code).
- Any **NOT TESTABLE YET** dependency for the specific criterion under
  test has been resolved (see §8 Blocked Items).

## 6. Exit Criteria

| Priority | Exit Requirement |
|---|---|
| P0 (MVP) | All L1 and L2 test cases pass; all L3/L4 cases pass or have an approved, documented waiver |
| Pilot (Risk Scoring, Lifecycle Prediction) | No exit criteria in this plan — out of scope (§3.2) |
| Roadmap | No exit criteria in this plan — out of scope (§3.2) |

A P0 suite with any **BLOCKED** item (§8) cannot be marked exited until
that item is resolved or the blocking Open Question is answered and the
AC is updated.

---

## 7. Test Suites

Each suite ID mirrors its AC group for direct traceability.

| Suite ID | AC Group | Screen | Level(s) | Priority | Blocked Items |
|---|---|---|---|---|---|
| TS-LOGIN | AC-LOGIN | P-001 | L1, L2 | P0 | Yes — auth mechanism TBD; RBAC MVP enforcement level confirmed as UI-only/client-side (role list/permission matrix still TBD) |
| TS-DASH | AC-DASH | P-002 | L1 | P0 | Yes — KPI scope partially TBD; Utilization tile presence + assignment-time-based definition are testable now (resolved 2026-08-21); calculation mechanics (formula/exclusions/aggregation window) remain NOT TESTABLE YET |
| TS-ASSET-001 | AC-ASSET-001 | P-003 | L1 | P0 | Yes — field list TBD |
| TS-ASSET-001-DETAIL | AC-ASSET-001-DETAIL | P-004 | L1 | P0 | No |
| TS-LIFE-001 | AC-LIFE-001 | P-004 (Lifecycle section) | L3, L5 | P0 | Yes — lifecycle state model TBD; Disposal confirmed Out of Scope for MVP (2026-08-21), not a blocker anymore |
| TS-ASSET-002 | AC-ASSET-002 | P-005 | L1 | P0 | Yes — hierarchy TBD |
| TS-ASSET-003 | AC-ASSET-003 | P-006 | L1, L3 | P0 | Yes — holder model TBD; custody-writing-events ambiguity blocks AC-ASSET-003-03's exclusivity scope only |
| TS-OPS-001 | AC-OPS-001 | P-007 | L1, L2 | P0 | No |
| TS-OPS-002 | AC-OPS-002 | P-008 | L1, L3 | P0 | Yes — workflow/roles TBD; RBAC MVP enforcement level confirmed as UI-only/client-side (role list/permission matrix still TBD) |
| TS-MAINT-001 | AC-MAINT-001 | P-009 | L1, L3 | P0 | Yes — field model (date/event/status/cost), SLA/vendor/cost model, and delegated-approver rules TBD; stage-transition criteria (AC-MAINT-001-03..09) testable for state-transition behavior; AC-MAINT-001-04..08 depend on `RAISE-NFR-SEC-RBAC-001` (enforcement level confirmed UI-only/client-side, role list/permission matrix still TBD) |
| TS-WARRANTY-001 | AC-WARRANTY-001 | P-010 | L1 | P0 | Yes — field list TBD |
| TS-ORACLE-001 | AC-ORACLE-001 | P-011 | L1, L2, L4 | P0 | Yes — integration design TBD |
| TS-ALERT-001 | AC-ALERT-001 | P-012 | L1 | P0 | Yes — trigger rules TBD; role gate (Q22) TBD |
| TS-AUDIT-001 | AC-AUDIT-001 | P-013 | L1, L3 | P0 | Yes — taxonomy/retention TBD; role gate (Q22) TBD |
| TS-EXEC-001 | AC-EXEC-001 | P-014 | L1 | P0 | Yes — NBV/Risk KPI formulas TBD; Utilization tile presence + assignment-time-based definition are testable now (resolved 2026-08-21); calculation mechanics (formula/exclusions/aggregation window) remain NOT TESTABLE YET |
| TS-AI-SEARCH-001 | AC-AI-SEARCH-001 | P-015 | L1, L4 | P0 | Yes — citation/confidence TBD |
| TS-AI-STATES | AC-AI-STATES | P-015 | L2, L4 | P0 | No |
| TS-AI-DOC-001 | AC-AI-DOC-001 | P-004 (incidental) | L5 | P0 | Yes — entire suite blocked; sole criterion NOT TESTABLE YET (document scope/fields/accuracy threshold TBD) |
| TS-AI-DOC-002 | AC-AI-DOC-002 | P-004 (incidental) | L5 | P0 | Yes — entire suite blocked; sole criterion NOT TESTABLE YET (metadata fields/tags/surfacing TBD) |
| TS-AI-DOC-003 | AC-AI-DOC-003 | P-005 (incidental) | L5 | P0 | Yes — entire suite blocked; sole criterion NOT TESTABLE YET (assign-vs-suggest classification behavior TBD) |
| TS-AI-DOC-004 | AC-AI-DOC-004 | P-003 (incidental) | L5 | P0 | Yes — entire suite blocked; sole criterion NOT TESTABLE YET (matching threshold / merge-or-flag workflow TBD) |

Three suites (TS-ASSET-001-DETAIL, TS-OPS-001, TS-AI-STATES) have no
blocked items and can be executed as soon as the corresponding screen is
implemented, without waiting on any Open Question.

TS-AI-DOC-001 through TS-AI-DOC-004 are fully blocked, not partially blocked
like the other "Yes" rows above — each AC group (§19.5–§19.8 of the AC
document) contains exactly one criterion, and that criterion is marked
NOT TESTABLE YET in its entirety. No L1–L4 test case can be written for
these suites until the AC document's underlying Open Question is resolved
and a concrete, testable Given/When/Then is added. See §8.1 below.

---

## 8. Blocked Items (carried from Acceptance Criteria §20)

The following must be resolved via business/product confirmation before
the associated suite can reach a clean exit (§6). This list is a direct
carry-forward of `RAISE-ACCEPTANCE-CRITERIA.md` §20 — no new blockers are
introduced here.

| Suite | Blocking PRD Open Question(s) | Cannot Fully Verify |
|---|---|---|
| TS-LOGIN | Q21 Authentication mechanism, Q22 Roles/permissions | Which credential type is valid; which roles see access-denied. **RBAC MVP enforcement level confirmed (2026-08-21, PRD §16 Resolved Question 38; Design §16):** business has confirmed a UI-only/client-side permission check is acceptable for MVP (a client-bypassing actor is an accepted, explicit MVP risk), backend enforcement deferred to Enterprise Roadmap. This fixes only *where* AC-LOGIN-03's access-denied check runs, not *what* the roles/permissions are — Q22 (role list, permission matrix contents, authentication mechanism) remains fully open, so AC-LOGIN-03 stays testable only for "an access-denied state exists and is shown for *some* unspecified permission gate," not for any named role being correctly gated. |
| TS-DASH | Q3 Utilization (calculation mechanics only — partially resolved), Q4 Risk | Whether the Risk tile value is correct, only that it renders; whether "Total Assets"/"Warranty Expiry" tile behavior is final. **Utilization specifically (resolved 2026-08-21, partial):** PRD v0.3 §16 Resolved Question 27 and Design v0.4 §13 confirmed Utilization's definition as assignment-time-based (% of time an asset is assigned to a user/department, relative to total available time) — this suite can now verify tile *presence* on AC-DASH-01 **and** that the tile is documented/described against this confirmed definition. What remains NOT TESTABLE YET is the calculation mechanics: how "assigned" state/time is measured against Custody (P-006), what "total available time" excludes, and the aggregation window/granularity — no test case may assert a specific numeric value, formula, or threshold until this is resolved (see `RAISE-ACCEPTANCE-CRITERIA.md` §5) |
| TS-ASSET-001 | Q1 Asset master field list | Whether all required fields are present, only that search/filter/select work |
| TS-ASSET-002 | (RAISE-FR-ASSET-002 Open Question) Category hierarchy | Whether the hierarchy shown is the correct one, only that hierarchy display works |
| TS-ASSET-003 | Q13 Holder data model; Custody-writing-events ambiguity (`RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` — PRD Pre-Finalization Quality Pass, "Duplicated / Overlapping Requirements," marked "Needs business confirmation") | Whether holder identity is modeled correctly, only that history is appended/immutable. Separately, for AC-ASSET-003-03: whether Custody History is written *only* by Check-in/Check-out (P-008, `AC-OPS-002`) or also by other custody-changing events (e.g., a direct reassignment outside Check-in/Check-out) — this suite verifies only the Check-in/Check-out-triggered append-and-immutability behavior; a dedicated case for a non-Check-in/Check-out write path cannot be added until that ambiguity is resolved and, if needed, a corresponding flow/screen and AC criterion exist. AC-ASSET-003-01 and -02 are unaffected by this blocker and execute normally. |
| TS-LIFE-001 | Design §4.2's exact lifecycle state/transition model is TBD. (Resolved: Disposal MVP scope — confirmed Out of Scope for MVP on 2026-08-21, `RAISE-PRD.md` §14 item 7; the former disposal test case is now excluded rather than blocked, see `RAISE-TEST-CASES.md` §6.5.) | Whether cross-domain lifecycle data displays and stays consistent across stage changes |
| TS-OPS-002 | Q11 Check-in/Check-out workflow, Q12/Q22 Roles | Whether approval/exception rules are enforced, only that the basic state transition + audit trigger occurs. **RBAC MVP enforcement level confirmed (2026-08-21, PRD §16 Resolved Question 38; Design §16):** same narrow decision as TS-LOGIN — UI-only/client-side check accepted for MVP, backend deferred to Roadmap. This fixes only *where* a permission check runs, not *what* the roles/permissions are, so AC-OPS-002-01's "appropriate permission" gate remains untestable for role correctness until the role list/permission matrix (Q22) is defined. |
| TS-MAINT-001 | Q14 Maintenance fields / SLA / vendor model / cost model (workflow shape and state model now confirmed — Resolved Question 33; only SLA, vendor model, cost model, and delegated-approver configuration remain open); Q22 Roles/permissions | Whether the full field set (beyond date/event/status/cost) is complete, only that records/history render (AC-MAINT-001-01/-02). **Stage-transition criteria now testable (2026-08-21):** the 4-stage workflow (User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution) and its state model (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE`) are business-confirmed (PRD §16 Resolved Question 33; Design §5.1), so AC-MAINT-001-03, -06, -07, -08, -09 are executable for the confirmed state transitions and stage-progress indicator. Remaining NOT TESTABLE YET items: (a) AC-MAINT-001-05's Reject/Request Info resulting state/downstream flow — Prototype §15 shows these as UI actions only with no defined resulting state; (b) delegated-approver configuration rules (*who* may delegate, *to whom*, how delegation is audited) — AC-MAINT-001-04 tests only that an Approve action advances the state, not any delegation authorization rule; (c) SLA per stage, the vendor model (internal technician vs. external vendor dispatch), and the cost model/tracking — the "Priority," "Vendor model," and "Cost incurred" fields shown in the Prototype are placeholders only. **RBAC dependency (AC-MAINT-001-04 through -08):** MVP enforcement level is confirmed as UI-only/client-side (PRD §16 Resolved Question 38; Design §16), backend deferred to Roadmap — this fixes only *where* a permission check would run, not *what* the roles/permissions are; the role list, permission matrix contents, and authentication/delegation mechanism remain TBD (Q22), so these five criteria are executable only for the state-transition behavior itself, not for whether the acting user's role (Dept Approver, IT Dispatcher, Technician) is correctly gated or verified. No behavior is defined for Mark Complete attempted from an invalid state, or for skipped/reversed stages — no test case exists for those cases. |
| TS-WARRANTY-001 | Q15 Warranty fields | Whether fields beyond Start/End/Status are needed |
| TS-ORACLE-001 | Q6–Q10 Integration method, sync, mapping, error handling, ownership, source-of-truth, security | Whether the integration itself is correct, only that the four UI states (available/unavailable/error/conflict) render appropriately |
| TS-ALERT-001 | (RAISE-FR-ALERT-001 Open Question) Alert trigger rules; Q22 Roles/permissions | Whether the correct conditions trigger alerts, only that triggered alerts display severity/description/asset; separately, whether the "authorized user" gate on AC-ALERT-001-01 is correctly enforced, only that the alert lists severity/description/asset when opened |
| TS-AUDIT-001 | Q24–Q25 Event taxonomy, retention; Q22 Roles/permissions | Whether all required audit fields are captured, only that Actor/Timestamp/Action/Entity are recorded and immutable; separately, whether the "audit-review access" gate on AC-AUDIT-001-03 is correctly enforced, only that entries are viewable
| TS-EXEC-001 | Q3 Utilization (calculation mechanics only — partially resolved), Q4 Risk, NBV/Risk KPI formulas | Whether NBV/Risk KPI values, thresholds, and dashboard layout are correct, only that the dashboard structure and Asset Overview/Executive Summary sections render; whether Executive Summary content is AI-generated or static is unresolved. **Utilization specifically (resolved 2026-08-21, partial):** same partial resolution as TS-DASH — PRD v0.3 §16 Resolved Question 27 / Design v0.4 §13 confirmed the assignment-time-based definition, so AC-EXEC-001-01 (and this suite) can now verify tile *presence* **and** that the tile is documented against the confirmed definition. What remains NOT TESTABLE YET is the calculation mechanics (how "assigned" time is measured against Custody, what "total available time" excludes, aggregation window/granularity) — no test case may assert a specific value, formula, or threshold until this is resolved (see `RAISE-ACCEPTANCE-CRITERIA.md` §17). NBV and Risk KPI formulas remain fully unresolved/open, unaffected by this change |
| TS-AI-SEARCH-001 | Q18–Q20 Citation, confidence threshold, conflict handling | Whether source attribution is precise/correct, only that it is present |
| TS-AI-DOC-001 | `RAISE-AI-DOC-001` Open Question (document scope / fields / accuracy threshold undefined — `RAISE-PRD.md` §7) | Entire suite — no L1–L4 case can be written; the Prototype describes only a reserved screen location on P-004 (incidental), not a concrete UI element, so no document type, extracted field, or accuracy value can be asserted |
| TS-AI-DOC-002 | `RAISE-AI-DOC-002` Open Question (metadata fields/tags / surfacing undefined — `RAISE-PRD.md` §7) | Entire suite — no L1–L4 case can be written; only a reserved screen location on P-004 (incidental) is described, so no metadata field, tag, or display format can be asserted |
| TS-AI-DOC-003 | `RAISE-AI-DOC-003` Open Question (assign-vs-suggest classification behavior undefined — `RAISE-PRD.md` §7) | Entire suite — no L1–L4 case can be written; whether the capability auto-assigns a category or only suggests one for human confirmation is undefined, so no pass/fail behavior can be asserted on P-005 (incidental) |
| TS-AI-DOC-004 | `RAISE-AI-DOC-004` Open Question (matching threshold / merge-or-flag workflow undefined — `RAISE-PRD.md` §7) | Entire suite — no L1–L4 case can be written; matching criteria/threshold and the resolution workflow (auto-merge vs. flag-for-review) are undefined, so no pass/fail behavior can be asserted on P-003 (incidental) |

**Rule:** a BLOCKED suite may still execute its non-blocked criteria (per
AC group in §19 of the AC document) — the block applies criterion-by-
criterion, not to the whole suite. `RAISE-TEST-CASES.md` must preserve
this distinction when writing individual cases.

### 8.1 Fully-Blocked Suites — AI Document Intelligence Capabilities (carried from AC §19.5–§19.8 / §20)

**This section replaces the prior v0.2 "§8.1 Traceability Gap — Not a Blocked
Suite" note, which is now stale.** That note described four PRD-listed
"Current"-status AI capabilities — OCR/Extraction, Metadata, Classification,
and Duplicate Detection — as having **no** dedicated `RAISE-AI-<DOMAIN>-<NNN>`
Traceability ID and therefore no test suite. PRD v0.3 §16 Resolved Question 28
(2026-08-21) assigned each capability its own ID at P0/MVP
(`RAISE-AI-DOC-001`–`RAISE-AI-DOC-004`), and `RAISE-ACCEPTANCE-CRITERIA.md`
v0.3 §19.5–§19.8 added a dedicated AC group for each. Per this document's own
principle (§2 — a suite exists for every AC group), four corresponding
suites have been added to §7: `TS-AI-DOC-001`, `TS-AI-DOC-002`,
`TS-AI-DOC-003`, `TS-AI-DOC-004`.

**The gap has moved, not closed:** it is no longer a *missing Traceability
ID / missing AC group* gap. It is now a **fully-blocked suite** gap — each
AC group contains exactly one criterion, and that criterion is marked NOT
TESTABLE YET in its entirety (the Prototype describes only a reserved screen
location incidental to an existing screen — P-004, P-004, P-005, P-003
respectively — not a concrete UI element or business rule). Consequently:

- **All four suites are P0 (MVP) per their PRD priority, but none can reach
  the exit criteria in §6** until the underlying Open Question is resolved
  (document scope/fields/accuracy threshold for `RAISE-AI-DOC-001`; metadata
  fields/tags/surfacing for `RAISE-AI-DOC-002`; assign-vs-suggest behavior
  for `RAISE-AI-DOC-003`; matching threshold/merge-or-flag workflow for
  `RAISE-AI-DOC-004`).
- Unlike the "criterion-level, not suite-level" block described at the end
  of §8 above (which applies to suites such as TS-DASH, TS-ASSET-003, and
  TS-EXEC-001 that have a mix of testable and blocked criteria), these four
  suites are blocked **at the suite level** because their single criterion
  is entirely NOT TESTABLE YET — there is no non-blocked criterion left to
  execute in the interim.
- These suites are assigned **L5 (Traceability Regression) only** in §7:
  they exist to preserve the AC-to-requirement mapping and to be re-checked
  at each L5 run, not to produce L1–L4 test cases yet. Once the AC document
  resolves the underlying Open Question and adds a concrete, testable
  Given/When/Then, the suite's Level(s) should be revisited to add L1 (and
  L2/L3/L4 as appropriate).
- Where these four capabilities' effects are incidentally visible on their
  host screens (e.g., extracted/normalized fields on Asset Detail,
  de-duplicated records on Asset Registry, suggested categories on
  Category & Hierarchy), that incidental behavior remains covered by
  `TS-ASSET-001` / `TS-ASSET-001-DETAIL` / `TS-ASSET-002`'s existing L1
  criteria only insofar as those criteria already describe it — it must not
  be treated as a separately verified OCR/Metadata/Classification/
  Duplicate-Detection test.

---

## 9. Traceability Matrix

| Suite | AC Group | PRD Requirement | Design Area | Prototype Screen |
|---|---|---|---|---|
| TS-LOGIN | AC-LOGIN | Security Design (TBD) | §16 Security Architecture | P-001 |
| TS-DASH | AC-DASH | Product / Dashboard | §13 Executive Intelligence (KPI concepts only) | P-002 |
| TS-ASSET-001 | AC-ASSET-001 | RAISE-FR-ASSET-001 | §4.1 Asset Management | P-003 |
| TS-ASSET-001-DETAIL | AC-ASSET-001-DETAIL | RAISE-FR-ASSET-001 | §4.1 Asset Management | P-004 |
| TS-LIFE-001 | AC-LIFE-001 | RAISE-FR-LIFE-001 | §4.2 Conceptual State / §9 Asset Lifecycle | P-004 (Lifecycle section) |
| TS-ASSET-002 | AC-ASSET-002 | RAISE-FR-ASSET-002 | §4.1 Asset Management | P-005 |
| TS-ASSET-003 | AC-ASSET-003 | RAISE-FR-ASSET-003 | §4.2 Custody & Asset Operations | P-006 |
| TS-OPS-001 | AC-OPS-001 | RAISE-FR-OPS-001 | §4.2 Custody & Asset Operations | P-007 |
| TS-OPS-002 | AC-OPS-002 | RAISE-FR-OPS-002 | §4.2 Custody & Asset Operations | P-008 |
| TS-MAINT-001 | AC-MAINT-001 | RAISE-FR-MAINT-001 | §5.1 Maintenance Domain | P-009 |
| TS-WARRANTY-001 | AC-WARRANTY-001 | RAISE-FR-WARRANTY-001 | §5.2 Warranty Domain | P-010 |
| TS-ORACLE-001 | AC-ORACLE-001 | RAISE-FR-ORACLE-001 | §6 Oracle FA Integration | P-011 |
| TS-ALERT-001 | AC-ALERT-001 | RAISE-FR-ALERT-001 | §14 Alert Architecture | P-012 |
| TS-AUDIT-001 | AC-AUDIT-001 | RAISE-FR-AUDIT-001 | §15 Audit Architecture | P-013 |
| TS-EXEC-001 | AC-EXEC-001 | RAISE-FR-EXEC-001 | §13 Executive Intelligence | P-014 |
| TS-AI-SEARCH-001 | AC-AI-SEARCH-001 | RAISE-AI-SEARCH-001 | §9 Natural Language Search | P-015 |
| TS-AI-STATES | AC-AI-STATES | RAISE-AI-SEARCH-001 | §8.2 AI Flow / §20 Error Handling | P-015 |
| TS-AI-DOC-001 | AC-AI-DOC-001 | RAISE-AI-DOC-001 | §9A AI-Assisted Document Intelligence (design-convenience grouping) | P-004 (incidental) |
| TS-AI-DOC-002 | AC-AI-DOC-002 | RAISE-AI-DOC-002 | §9A AI-Assisted Document Intelligence (design-convenience grouping) | P-004 (incidental) |
| TS-AI-DOC-003 | AC-AI-DOC-003 | RAISE-AI-DOC-003 | §9A AI-Assisted Document Intelligence (design-convenience grouping) | P-005 (incidental) |
| TS-AI-DOC-004 | AC-AI-DOC-004 | RAISE-AI-DOC-004 | §9A AI-Assisted Document Intelligence (design-convenience grouping) | P-003 (incidental) |

Cross-checked: every row's PRD Requirement ID appears in
`RAISE-PRD.md` §17 Requirement Traceability Matrix, and every AC Group
appears in `RAISE-ACCEPTANCE-CRITERIA.md` §3. No suite was added without
a corresponding AC group.

**Formerly-excluded row, now added (resolved 2026-08-21):** the v0.2 version
of this table deliberately excluded a row for OCR/Extraction, Metadata,
Classification, and Duplicate Detection, because `RAISE-ACCEPTANCE-CRITERIA.md`
§19.5 (v0.2) marked them as an "AC Scope Boundary Note — not a testable AC
group." PRD v0.3 §16 Resolved Question 28 assigned each capability its own
Traceability ID, and AC v0.3 §19.5–§19.8 added dedicated AC groups. The four
rows above are added accordingly. See §8.1 for why these suites, though now
traceable, remain fully blocked pending further design/business input.

---

## 10. Test Data Requirements (Conceptual)

Because the PRD does not define final schemas (asset master fields,
category hierarchy, holder model, maintenance fields, warranty fields —
see §8 Blocked Items), test data requirements below are conceptual
placeholders, not a finalized data spec:

- At least one asset per lifecycle state shown in Design §4.2 (Registered,
  Assigned, In Use, Check-in, Maintenance/Audit, Disposal)
- At least one asset with warranty expiring within 90 days (to exercise
  the PRD's illustrative example, AC-WARRANTY-001-03 / AC-AI-SEARCH-001-03)
- At least one asset with Oracle FA data available, one with data
  unavailable, one with a simulated sync error, and one with a simulated
  conflicting value (to exercise all four AC-ORACLE-001 states)
- At least one maintenance record and one custody history entry per test
  asset, to exercise history/append-only behavior
- At least one maintenance request per confirmed workflow state
  (`PENDING_DEPT_APPROVAL`, `PENDING_IT_DISPATCH`, `PLANNING`, `IN_PROGRESS`,
  `ON_HOLD`, `DONE`), to exercise AC-MAINT-001-03..09's stage-transition and
  stage-progress-indicator criteria — SLA, vendor, cost, and delegated-approver
  field values remain conceptual placeholders only, per §8
- At least one alert-triggering condition (exact rule TBD — see §8)

**This test data model must be finalized once the Open Questions in §8
are resolved** — do not treat the above as a data dictionary.

---

## 11. Defect / Finding Handling

Per the RAISE AI Development Workflow:

```text
Test Execution
     │
     ▼
Finding / Gap
     │
     ▼
Fix / Re-test
     │
     ▼
Requirement Compliance Review
```

- Every finding must reference its Suite ID, AC ID, and PRD Requirement
  ID.
- A finding against a **BLOCKED** criterion (§8) is not a defect — it is
  logged as an **Open Question escalation**, routed back to Product/
  Business for confirmation, not to Development for a fix.
- A finding against a non-blocked criterion is a standard defect, fixed
  and re-tested against the same AC criterion before closure.

---

## 12. Test Plan Review Checklist

Before moving to Test Cases:

- [ ] Every AC group in `RAISE-ACCEPTANCE-CRITERIA.md` has a corresponding
      test suite
- [ ] Every test suite traces to exactly one PRD requirement (or an
      explicit TBD, as with Login)
- [ ] Every BLOCKED item in §8 matches a NOT TESTABLE YET note in the AC
      document — no new blockers invented, none silently dropped
- [ ] Pilot/Roadmap capabilities have no MVP exit criteria
- [ ] Test levels (L1–L5) are assigned per suite based on the nature of
      its criteria, not uniformly applied
- [ ] Test data requirements are marked conceptual pending schema
      finalization
- [ ] No VERSCAN-only behavior appears as a test suite or criterion

---

## 13. Next Step

```text
RAISE-PRD.md
      ↓
RAISE-DESIGN.md
      ↓
RAISE-PROTOTYPE.md
      ↓
RAISE-ACCEPTANCE-CRITERIA.md
      ↓
RAISE-TEST-PLAN.md         ← Current
      ↓
RAISE-TEST-CASES.md
      ↓
RAISE-TRACEABILITY-MATRIX.md
      ↓
Development
      ↓
RAISE-COMPLIANCE-REVIEW.md
```

The next artifact, `RAISE-TEST-CASES.md`, should expand each suite in §7
into individual test cases (steps, test data, expected result), honoring
the BLOCKED distinctions in §8.

---

## Document Status

**Version:** 0.4 (re-verified against `RAISE-ACCEPTANCE-CRITERIA.md` v0.4, 2026-08-21 —
four synchronization updates applied:)

**Change Log — v0.3 → v0.4 (2026-08-21):**

1. **TS-MAINT-001 expanded for the confirmed 4-stage Maintenance workflow.** AC v0.4 §12
   added seven new stage-transition criteria (AC-MAINT-001-03..09) covering User
   Requisition, Dept Approval (Delegated), IT Dispatch, and Technician Execution, plus a
   stage-progress-indicator criterion. TS-MAINT-001's Level(s) were expanded from L1 to
   L1, L3 (state-transition/state-integrity behavior, consistent with how TS-OPS-002 is
   already leveled), and its Blocked Items entry (§8) was rewritten to distinguish: (a)
   AC-MAINT-001-03/-06/-07/-08/-09 — now testable for the confirmed state transitions;
   (b) AC-MAINT-001-05 (Reject/Request Info resulting state) — remains NOT TESTABLE YET;
   (c) AC-MAINT-001-04 (delegated-approver authorization rule) — remains NOT TESTABLE
   YET; (d) AC-MAINT-001-04 through -08's dependency on `RAISE-NFR-SEC-RBAC-001` — role
   list/permission matrix remain TBD even though the MVP enforcement level is confirmed.
   §10 Test Data Requirements added a bullet covering one maintenance request per
   confirmed workflow state.
2. **License Management (P-016/P-017, `RAISE-FR-LICENSE-001`) — explicit no-suite
   confirmation added.** AC v0.4 §3 records a traceability-only note (no AC-LICENSE-001
   group) because the requirement is Enterprise Roadmap, not MVP. §3.2 Out of Scope now
   states explicitly that no `TS-LICENSE-001` suite is created here, consistent with the
   treatment already given to other Roadmap/Pilot capabilities.
3. **TS-LOGIN and TS-OPS-002 blocked-item wording updated for the confirmed RBAC MVP
   enforcement level.** AC v0.4 (§4, §11) cites PRD §16 Resolved Question 38: a
   UI-only/client-side permission check is confirmed acceptable for MVP, backend
   enforcement deferred to Roadmap. §7 and §8 rows for TS-LOGIN and TS-OPS-002 were
   updated to cite this confirmation explicitly, while continuing to treat the role
   list/permission matrix (Q22) as unresolved — no role model is invented here as a
   result.
4. **AC-ORACLE-001 "Phase 6" drift check — no Test Plan change required.** AC v0.4 §14
   added a note confirming "Phase 6" is a stale code-comment label, not a PRD phase, and
   that AC-ORACLE-001 never referenced it. TS-ORACLE-001 (§7, §8, §9) already made no
   such reference, so no wording change was needed; this is recorded here only to
   confirm the check was performed.

No other suite required changes; TS-DASH, TS-ASSET-001, TS-ASSET-001-DETAIL,
TS-LIFE-001, TS-ASSET-002, TS-ASSET-003, TS-OPS-001, TS-WARRANTY-001, TS-ORACLE-001,
TS-ALERT-001, TS-AUDIT-001, TS-EXEC-001, TS-AI-SEARCH-001, TS-AI-STATES, and
TS-AI-DOC-001..004 are unaffected by AC v0.4's changes.

**Change Log — v0.2 → v0.3 (2026-08-21):**

1. **Utilization blocked-item wording updated from "tile label presence only" to
   "testable now (presence + confirmed definition) vs. NOT TESTABLE YET (calculation
   mechanics only)."** AC v0.3 §5 (AC-DASH) and §17 (AC-EXEC-001) resolved Utilization's
   *definition* as assignment-time-based (PRD v0.3 §16 Resolved Question 27; Design v0.4
   §13), while leaving calculation mechanics (formula, exclusions, aggregation window)
   NOT TESTABLE YET. The TS-DASH and TS-EXEC-001 rows in §7 and §8 were updated in place
   to reflect this partial resolution — these two suites are no longer fully blocked on
   Utilization, only on the narrower calculation-mechanics question (plus Risk/other KPI
   formulas, which remain fully open and unaffected by this change).
2. **Four new test suites added: `TS-AI-DOC-001`, `TS-AI-DOC-002`, `TS-AI-DOC-003`,
   `TS-AI-DOC-004`.** PRD v0.3 §16 Resolved Question 28 assigned `RAISE-AI-DOC-001`–
   `RAISE-AI-DOC-004` (OCR/Extraction, Metadata, Classification, Duplicate Detection)
   their own Traceability IDs at P0/MVP, and AC v0.3 §19.5–§19.8 added a dedicated AC
   group for each (one NOT-TESTABLE-YET criterion per group). Four corresponding suites
   were added to §7 (Level L5 only, Priority P0, fully blocked) and §9 (Traceability
   Matrix). The prior v0.2 "§8.1 Traceability Gap — Not a Blocked Suite" note (written
   when these capabilities had no ID and no AC group) has been replaced with a new §8.1
   "Fully-Blocked Suites — AI Document Intelligence Capabilities," explaining that the
   gap has moved from a missing-Traceability-ID/missing-AC-group gap to a fully-blocked-
   suite gap. The §9 "Deliberately excluded row" note was likewise replaced with a note
   confirming the four rows are now added.

No other suite required changes; TS-LOGIN, TS-ASSET-001, TS-ASSET-001-DETAIL,
TS-LIFE-001, TS-ASSET-002, TS-ASSET-003, TS-OPS-001, TS-OPS-002, TS-MAINT-001,
TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AUDIT-001, TS-AI-SEARCH-001, and
TS-AI-STATES are unaffected by AC v0.3's changes.

**Status:** Draft for Test Plan Review
**Source:** [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.4
**Reference:** VERSCAN only
**Next Action:** Review the v0.4 update (TS-MAINT-001 stage-transition coverage, License
Management no-suite confirmation, RBAC enforcement-level wording refresh) before Test
Cases. `RAISE-TEST-CASES.md` should be checked next for the same drift, in particular
whether it already covers (or needs to add coverage for) TC-MAINT-001-03..09.
