# RAISE Requirement Traceability Matrix

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Requirement Traceability Matrix (RTM)
**Version:** 0.5 Draft (full-chain re-sync pass — PRD §10 NFR backlog acknowledgment
propagated to every layer; **Gap 6 from v0.4 re-verified and closed — see §6**)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.5, consolidated against [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.5, [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.5, [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.6, [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.8, and [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.9 — **the actual PRD file on disk was re-read in full for this revision, not assumed from downstream citations**, per this document's own standing practice since v0.4
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

This document consolidates the full delivery chain into one master table,
per requirement:

```text
PRD Requirement → Design Area → Prototype Screen → AC Group → Test Suite → Test Case(s)
```

It is built by walking `RAISE-TEST-CASES.md` back up through every prior
document, not by re-deriving requirements independently — so it is a
consistency check on the whole chain as much as it is a lookup table.

This is the artifact `RAISE-COMPLIANCE-REVIEW.md` will use to check each
requirement's real implementation/test status during and after
Development.

**This revision's headline finding is a resolution, not a new problem.**
`RAISE-TRACEABILITY-MATRIX.md` v0.4 opened a critical **Gap 6**: every
downstream document (Design v0.7, Prototype v0.5, AC v0.4, Test Plan v0.4,
Test Cases v0.4) claimed to be synced against `RAISE-PRD.md` **v0.9** and
cited specific §16 "Resolved Questions 33–38" and a `RAISE-FR-LICENSE-001`
requirement — but the actual `RAISE-PRD.md` file on disk at that time was
**v0.4**, with Resolved Questions stopping at 32 and no
`RAISE-FR-LICENSE-001` entry anywhere. This revision **re-read the current
`RAISE-PRD.md` file directly, in full, before consolidating anything else**,
and confirms:

- The file's own header and Document Status now read **Version 0.9**.
- §16 "Resolved Questions" now runs through **38** (Resolved Questions 33–38
  all have real, substantive entries — Maintenance 4-stage workflow, License
  Management identity/scope, six ESAPS-reference pages out of scope, AI
  Recommendation re-confirmed Roadmap, Oracle "Phase 6" label clarified, RBAC
  MVP enforcement level).
- `RAISE-FR-LICENSE-001` **does** exist — in §6 (Functional Requirements),
  §13 (MVP Scope, explicit exclusion note), §14 (Enterprise Roadmap, item 8),
  and §17 (Requirement Traceability Matrix row, Scope `Roadmap`).
- §11 (Security & RBAC) now contains the "MVP enforcement level confirmed
  2026-08-21" subsection matching what Design §16 and every document
  downstream of it describe.
- `RAISE-FR-MAINT-001`'s Acceptance Criteria field in §6 now contains the
  full 4-stage workflow description (User Requisition → Dept Approval
  (Delegated) → IT Dispatch → Technician Execution) and the state model,
  matching Design §5.1 / Prototype §15 / AC §12 / Test Plan §7–§8 / Test
  Cases `TC-MAINT-001-03..09` exactly.

**Conclusion: Gap 6 is closed.** The chain is now verifiably anchored to the
actual PRD source of truth, not merely internally consistent among the
downstream documents. See §6 for the full closure record (this matrix does
not delete gap history — it records resolution with evidence, per this
document's own no-silent-resolution discipline).

---

## 2. Status Legend

Per `RAISE-PRD.md` §17, each requirement below carries a **Test Status**
using the recommended values:

`PASS · PARTIAL · FAIL · BLOCKED · NOT_IMPLEMENTED · NOT_TESTED`

*(Note: this section originally described a pre-code state where every
requirement defaulted to* **NOT_TESTED***. That premise is stale — real
code exists across many domains as of PR #36, and `RAISE-FR-OPS-001`,
`RAISE-FR-AUDIT-001`, and `RAISE-FR-EXEC-001` carry real, evidence-based
`PASS`/`PARTIAL`/`FAIL`/`BLOCKED` status as of 2026-08-26 — see §3's
Correction note near the end of this document. Rows not yet
re-executed may still show the original default/BLOCKED status below.)*
Requirements with any BLOCKED test case in `RAISE-TEST-CASES.md` are
marked **BLOCKED**, to distinguish "genuinely not testable yet" from a
requirement that has actually been run and passed, partially passed, or
failed.

Two distinct flavors of BLOCKED exist upstream and are carried into this
matrix's Test Status column:

- **BLOCKED (partial)** — some structural/interaction behavior is
  testable now; only part of the criterion's correctness is pending an
  Open Question (e.g., tile presence testable, tile value not).
- **BLOCKED (full)** — the entire AC criterion is NOT TESTABLE YET, with
  no fallback structural behavior, because no concrete UI element or
  business rule exists yet in any prior-stage document (only a reserved
  screen location). Used for `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` (§3
  below).

**No PRD-drift annotation is needed in this revision.** v0.4 of this matrix
annotated every cell resting on Resolved Questions 33–38 or on
`RAISE-FR-LICENSE-001` with "⚠ PRD-drift," since those citations could not
be verified against the real PRD file at that time. This revision re-verified
each of those citations directly against the current `RAISE-PRD.md` v0.9 and
found all of them genuinely present (see §6 Gap 6 closure). The ⚠ PRD-drift
markings are therefore removed throughout §3–§5 below — not because the
underlying BLOCKED/PARTIAL classifications changed (they have not), but
because their stated justification is now verified at the source-of-truth
layer, which is exactly the condition that would have removed the annotation
per v0.4 Gap 6's own closure criteria.

---

## 3. Master Traceability Matrix — MVP Requirements

| PRD Requirement | Title | Priority/Scope | Design Area | Prototype Screen(s) | AC Group(s) | Suite ID(s) | TC ID(s) | Test Status |
|---|---|---|---|---|---|---|---|---|
| `RAISE-FR-ASSET-001` | Asset Registry | P0 / MVP | §4.1 Asset Management | P-003, P-004 | AC-ASSET-001, AC-ASSET-001-DETAIL | TS-ASSET-001, TS-ASSET-001-DETAIL | TC-ASSET-001-01..04, TC-ASSET-001-D-01..02 | **PASS** — executed 2026-08-26 against the real running app: TC-ASSET-001-01 **PASS** (list displays), TC-ASSET-001-02 **PASS** (search filters), TC-ASSET-001-04 **PASS** (row click opens Detail), TC-ASSET-001-D-02 **PASS** (Detail shows only the selected asset's data, verified across two distinct assets). TC-ASSET-001-03 originally **FAIL** — no Category filter existed anywhere in the Assets page's Filters panel (F-23) — **now PASS**, re-executed after the fix: a Category `Select` narrows the list correctly (verified 15 → 2 assets on "Infrastructure") and "Clear filters" resets it. TC-ASSET-001-D-01 originally **FAIL** — Asset Detail was missing 2 of the 9 required sections entirely (no "Financial" section, no "Lifecycle" section) — **now PASS**, re-executed after the fix (F-24): a "Financial" section (Purchase Cost/Current Value/Purchase Date, sourced from fields the Asset record already carries) and a "Lifecycle" section (a connectivity summary linking to the Custody/Warranty/Maintenance/Audit tabs, per Prototype P-004's "one asset → connected information across its lifecycle" principle and `AC-LIFE-001-01`) were added; all 9 required sections now confirmed present for a seeded asset. All 6 test cases now **PASS** — independent of the pre-existing asset-master-field-list block (PRD §16 Q1), which remains open but no longer blocks this row's Test Status. |
| `RAISE-FR-ASSET-002` | Category & Hierarchy | P0 / MVP | §4.1 Asset Management | P-005 | AC-ASSET-002 | TS-ASSET-002 | TC-ASSET-002-01..02 | **PASS (scoped)** — executed 2026-08-26: TC-ASSET-002-02 **PASS** (Category is consistent between Asset Registry and Asset Detail for the same asset, e.g. `a1` shows "IT Hardware" in both). TC-ASSET-002-01 originally **FAIL** — no P-005 "Category & Hierarchy" screen existed anywhere in the app's routing/navigation (F-25) — **now PASS on the display mechanism**, re-executed after a scoped-down first cut, now a "By Category" view inside Asset Management (`frontend/src/pages/Assets/index.tsx` — moved there from a standalone `/categories` page per user request, same content/behavior): each category expands to show the real assets registered under it (a genuine, confirmed parent/child relationship — category → its assets — verified live: "IT Hardware" expands to 6 real seeded assets, clicking one navigates to its Asset Detail). This deliberately does **not** implement Prototype P-005's illustrative sub-category tree (Computer > Notebook/Desktop, etc.) — that taxonomy remains explicitly **TBD** per Prototype §11 and AC-ASSET-002's own "NOT TESTABLE YET" note; only the flat-category-to-real-assets grouping is built, since that's the only parent/child data actually confirmed anywhere in the chain. |
| `RAISE-FR-ASSET-003` | Custody History | P0 / MVP | §4.2 Custody & Asset Operations | P-006 | AC-ASSET-003 | TS-ASSET-003 | TC-ASSET-003-01..03 | **PASS** — executed 2026-08-26: TC-ASSET-003-01 **PASS** (current holder "Sarah Chen" displays for asset `a1`). TC-ASSET-003-02/-03 originally **FAIL** — the "Assignment History" panel derived a single "current custody state" row instead of a chronological list, and a Check-in **replaced** the prior entry instead of appending — **now PASS**, re-executed after the fix (F-26): the History tab renders from the same per-asset audit trail `RAISE-FR-AUDIT-001` already builds (append-only by construction — `recordMockAuditEntry` only ever `unshift`s), which `assign`/`checkIn` already fed. Verified live on `a1`: Check-in appended "Asset checked in", then Assign appended "Asset assigned to Sarah Chen" alongside it (not replacing it) — both visible, newest-first. Independent of the still-open Check-in/Check-out-exclusivity question (Gap 4), which only concerns *other* write paths, not this one. |
| `RAISE-FR-OPS-001` | QR / Barcode | P0 / MVP | §4.2 Custody & Asset Operations | P-007 | AC-OPS-001 | TS-OPS-001 | TC-OPS-001-01..03 | **PASS** — re-executed 2026-08-26 (after the F-21 fix) against the real running app (`frontend/src/pages/Assets/index.tsx`'s Scan QR flow): TC-OPS-001-01 **PASS** (valid code `AST-0001` opens Asset Detail); TC-OPS-001-02 **PASS** (unmatched-but-well-formed code `AST-9999` shows "No asset found for..."); TC-OPS-001-03 **PASS** (malformed code `%%$#!!garbage///` now shows a distinct "Invalid code — ... doesn't look like a scannable asset code" message, without attempting a lookup — no longer the same message as TC-OPS-001-02). F-21 resolved (`OPEN-FINDINGS.md`). |
| `RAISE-FR-OPS-002` | Check-in / Check-out | P0 / MVP | §4.2 Custody & Asset Operations | P-008 | AC-OPS-002 | TS-OPS-002 | TC-OPS-002-01..03 | **PASS** — executed 2026-08-28 against the real running app: TC-OPS-002-01 **PASS** (Assign — the app's actual affordance for identifying a holder and confirming, no distinct "Check-out" label exists but the behavior matches: custody state updated to the new holder on asset `a4`); TC-OPS-002-02 **PASS** (Check-in confirmed the asset's return to Available/Unassigned); TC-OPS-002-03 **PASS** (both operations created a corresponding Audit Log entry, verified visible with actor and timestamp). "Appropriate permission"/role-correctness remains untestable (PRD §16 Q22, unchanged) but does not block re-verifying the state-transition and audit-entry behavior itself. |
| `RAISE-FR-MAINT-001` | Maintenance (4-stage workflow: User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution) | P0 / MVP | §5.1 Maintenance Domain | P-009 | AC-MAINT-001 (AC-MAINT-001-01..09) | TS-MAINT-001 | TC-MAINT-001-01..09 | **FAIL (partial)** — executed 2026-08-28 against the real running app, all 9 cases: TC-MAINT-001-03 **PASS** (a new requisition submitted via "New IT Requisition" enters `PENDING_DEPT_APPROVAL`). TC-MAINT-001-04 **PASS** (Dept Sign-off → Approve transitions to `PENDING_IT_DISPATCH`). TC-MAINT-001-05 **PASS** (Reject on a separate `PENDING_DEPT_APPROVAL` ticket resulted in `REJECTED_BY_DEPT`, confirmed **not** `PENDING_IT_DISPATCH` — per this case's own scope, no claim is made about whether that specific resulting state is itself correct). TC-MAINT-001-06 **PASS** (Assign Tech + Dispatch transitions to `IN_PROGRESS`, one of the three allowed states). TC-MAINT-001-07 **PASS** (Update Status to On-Hold with a hold reason correctly reflects "3. On-Hold" and shows the reason banner). TC-MAINT-001-08 **PASS** (Mark Complete transitions to `DONE`/"4. Resolved & Closed" with resolution notes shown). TC-MAINT-001-01 originally **FAIL** — the Maintenance record list (Asset Detail's "Maintenance & Tickets" tab) showed only ticket code, priority, workflow-stage badge, and title per record; no date (created) and no cost field were rendered anywhere (F-28) — **now PASS**, re-executed after the fix: each record now shows created date and cost (preferring `itExecution.actualCost` once known, falling back to `itAssignment.estimatedCost`, or an honest "—" for a ticket not yet dispatched) — verified live on asset `a1` (`REQ-2026-0042` shows "2026-08-15 09:30 AM · Cost: $120"; `REQ-2026-0044`, not yet dispatched, shows "Cost: —"). TC-MAINT-001-09 **FAIL** — the 4-stage progress indicator (`GovernanceStep` in `TicketDetail/index.tsx`) only renders two visual states (done ✓ vs. a plain gray circle with the step number), so the "Current" stage and any not-yet-reached "Pending" stage are visually identical; verified at `PENDING_IT_DISPATCH`, where stage 3 (current) and stage 4 (pending) rendered indistinguishably. This contradicts AC-MAINT-001-09's explicit three-state "Done/Current/Pending" requirement. New finding **F-29**. TC-MAINT-001-02 **PASS** (2 records for asset `a1` displayed in ascending-chronological order by observed outcome, though the underlying code has no explicit sort — `assetTickets` in `AssetDetail/index.tsx` is unsorted array-filter order — a fragility worth watching, not a current failure since the observed order was correct). **The 4-stage workflow shape and state model remain verified present in `RAISE-PRD.md` v0.9 §6 and §16 Resolved Question 33.** |
| `RAISE-FR-WARRANTY-001` | Warranty | P0 / MVP | §5.2 Warranty Domain | P-010 | AC-WARRANTY-001 | TS-WARRANTY-001 | TC-WARRANTY-001-01..03 | BLOCKED (TC-WARRANTY-001-01 partial — field list TBD, PRD §16 Q15; TC-WARRANTY-001-03 partial — 90-day rule illustrative only) |
| `RAISE-FR-ORACLE-001` | Oracle FA Integration + NBV/Depreciation | P0 / MVP | §6 Oracle FA Integration (incl. §6.4 "Phase 6" label note) | P-011 | AC-ORACLE-001 | TS-ORACLE-001 | TC-ORACLE-001-01..04 | BLOCKED (TC-ORACLE-001-01 partial — integration method/mapping/sync/security TBD, PRD §16 Q6–Q10). `ReconciliationPage`↔`RAISE-FR-ORACLE-001` mapping remains an **explicitly open question in the real PRD** (Open Question 10a, verified present in `RAISE-PRD.md` v0.9 §9/§16) — the "Phase 6" label itself is confirmed not a PRD phase (§16 Resolved Question 37, verified present), but the substantive mapping question is not resolved by that and is not treated as resolved anywhere in this chain. |
| `RAISE-FR-ALERT-001` | Alerts | P0 / MVP | §14 Alert Architecture | P-012 | AC-ALERT-001 | TS-ALERT-001 | TC-ALERT-001-01..02 | BLOCKED (TC-ALERT-001-01 partial — trigger rules TBD; role gate, PRD §16 Q22, TBD) |
| `RAISE-FR-AUDIT-001` | Immutable Audit Log | P0 / MVP | §15 Audit Architecture | P-013 | AC-AUDIT-001 | TS-AUDIT-001 | TC-AUDIT-001-01..03 | **BLOCKED (partial)** — testable subset executed 2026-08-26 against the real running app, all **PASS**: TC-AUDIT-001-01 (checked in a real asset via the UI; confirmed via `auditService.listAuditLogs` that an entry was recorded with actor `"Demo Admin"`, action `"Asset checked in"`, entity `asset/a2`, and a real timestamp); TC-AUDIT-001-02 (no edit/delete control exists anywhere near a rendered audit entry, and neither `AuditRepository`/`MockAuditRepository` nor the backend router expose any update/delete method or route — verified by both UI inspection and code); TC-AUDIT-001-03 (the recorded entry is visible on Asset Detail's "Audit" tab to a logged-in user). Field taxonomy (Design §15) and role-gate correctness (PRD §16 Q22) remain BLOCKED — unchanged by this execution, since those require a PRD/Design answer, not more testing. |
| `RAISE-FR-EXEC-001` | Executive Dashboard | P0 / MVP | §13 Executive Intelligence | P-014 | AC-EXEC-001 | TS-EXEC-001 | TC-EXEC-001-01..02 | **FAIL (partial)** — executed 2026-08-26 against the real running app (`frontend/src/pages/Dashboard/index.tsx`), and the result is worse than the pre-existing BLOCKED status: TC-EXEC-001-01 **FAILS even on its testable-now scope** — no tile labeled "NBV", "Risk", or "Utilization" exists anywhere on the built page (confirmed by reading the full rendered page text; the KPI grid instead shows Total Assets/Available/Assigned/In Maintenance/Expired Warranty/Software Licenses/Monthly Depreciation/Monthly Cost). TC-EXEC-001-02 **FAILS** the same way — no section is labeled "Asset Overview" or "Executive Summary"; the page instead has AI Insights, AI Portfolio Health, an Oracle FA Reconciliation banner, Asset Lifecycle/Department Distribution/Asset Status/Asset Type charts, Pending Approvals, Recent Activities, and a Maintenance Calendar. This is independent of, and does not wait on, the still-open NBV/Risk formula question (PRD §16 Q3/Q4) — even presence-only testing fails. See `OPEN-FINDINGS.md` F-22 for the scope-reconciliation question this raises (is Prototype P-014 or the shipped page the intended direction?). |
| `RAISE-AI-SEARCH-001` | Natural Language Search | P0 / MVP (Current AI) | §9 Natural Language Search, §8.2 AI Flow, §20 Error Handling | P-015 | AC-AI-SEARCH-001, AC-AI-STATES | TS-AI-SEARCH-001, TS-AI-STATES | TC-AI-SEARCH-001-01..03, TC-AI-STATES-01..05 | BLOCKED (TC-AI-SEARCH-001-02 partial — citation precision/format TBD, PRD §16 Q18) |
| `RAISE-FR-LIFE-001` | Asset Lifecycle Connectivity | P0 / MVP (Product Foundation) | §4.2 Conceptual State, §9 Asset Lifecycle | P-004 (Lifecycle section) | AC-LIFE-001 | TS-LIFE-001 | TC-LIFE-001-01..04 | BLOCKED (TC-LIFE-001-01, -02, -04 partial; TC-LIFE-001-03 OUT OF SCOPE FOR MVP — Disposal confirmed Enterprise Roadmap, PRD §14 item 7 / §16 Resolved Question 26, verified present) |
| `RAISE-AI-DOC-001` | OCR / Extraction | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-004 (incidental, no dedicated screen) | AC-AI-DOC-001 | TS-AI-DOC-001 | TC-AI-DOC-001-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; document scope is defined (Invoice/Receipt, Warranty document, Asset nameplate/label — PRD §16 Resolved Question 30, verified present) but the numeric confidence-threshold value remains TBD |
| `RAISE-AI-DOC-002` | Metadata | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-004 (incidental, no dedicated screen) | AC-AI-DOC-002 | TS-AI-DOC-002 | TC-AI-DOC-002-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; metadata scope is defined (document-type tagging, key-value extraction, search tags/keywords — PRD §16 Resolved Question 31, verified present) but per-document-type field list / UI surfacing remain design-phase TBD |
| `RAISE-AI-DOC-003` | Classification | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-005 (incidental, no dedicated screen) | AC-AI-DOC-003 | TS-AI-DOC-003 | TC-AI-DOC-003-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; suggestion-only mode is confirmed (PRD §16 Resolved Question 32, verified present) but taxonomy / confirmation-UI detail remain design-phase TBD |
| `RAISE-AI-DOC-004` | Duplicate Detection | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-003 (incidental, no dedicated screen) | AC-AI-DOC-004 | TS-AI-DOC-004 | TC-AI-DOC-004-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; matching threshold/merge-vs-flag workflow undefined, explicitly asked of business 2026-08-21 and **left unanswered** (PRD §16 Open Question 20a, verified present as still-open, not silently resolved) |

---

## 4. Master Traceability Matrix — Supporting / Cross-Cutting Items

These items do not map to a single numbered `RAISE-FR-*` requirement but
are carried through the chain and must remain traceable.

| Item | Title | PRD Basis | Design Area | Prototype Screen | AC Group | Suite ID | TC ID(s) | Test Status |
|---|---|---|---|---|---|---|---|---|
| `RAISE-NFR-SEC-RBAC-001` | Security & RBAC | PRD §11, §16 Resolved Question 38 (MVP enforcement level: UI-only/client-side, backend deferred to Roadmap — **verified present in `RAISE-PRD.md` v0.9 §11**) | §16 Security Architecture (incl. "MVP Enforcement Level" subsection) | P-001 | AC-LOGIN | TS-LOGIN | TC-LOGIN-01..03 | BLOCKED (all 3 partial — auth mechanism and role/permission-matrix content undefined, PRD §16 Q21–Q22; only the enforcement *location* is resolved, not the role model) |
| Dashboard / Navigation | Main Dashboard | PRD §8 (KPI concepts only) | §13 Executive Intelligence (KPI reuse) | P-002 | AC-DASH | TS-DASH | TC-DASH-01..03 | BLOCKED (TC-DASH-01 partial — NBV/Risk value correctness still unconfirmed, PRD §16 Q3/Q4; Utilization presence/definition testable now, PRD §16 Resolved Question 27, verified present; calculation mechanics, PRD §16 Resolved Question 29, verified present, remain BLOCKED (partial)) |

### 4.1 PRD-Listed Capabilities Previously Without a Traceability ID — Resolved

`RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` were confirmed at Priority P0 / Scope
MVP via PRD §16 Resolved Question 28 (further acceptance detail via
Resolved Questions 30–32 for the first three) — verified present in
`RAISE-PRD.md` v0.9 §7, §13, §16, §17. Each has a full chain and a real row
in §3 above, all correctly marked **BLOCKED (full)**, since detailed
acceptance behavior for `RAISE-AI-DOC-004` (and residual design-phase detail
for the other three) remains PRD-level TBD.

### 4.2 PRD §10 NFR Backlog — Cross-Layer Acknowledgment (new this revision)

`RAISE-PRD.md` §10 records an NFR backlog broader than
`RAISE-NFR-SEC-RBAC-001` — this backlog has now been given an explicit,
identically-worded "no invented value, not silently omitted" placeholder at
every layer of the chain in this synchronization pass:
[`RAISE-DESIGN.md` §16A](../02-design/RAISE-DESIGN.md#16a-other-non-functional-requirements--design-backlog),
[`RAISE-PROTOTYPE.md` §25A](../03-prototype/RAISE-PROTOTYPE.md#25a-nfr-backlog--prototype-note),
[`RAISE-ACCEPTANCE-CRITERIA.md` §19.9](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md#199-nfr-backlog--acceptance-criteria-note),
[`RAISE-TEST-PLAN.md` §3.3](../05-test-plan/RAISE-TEST-PLAN.md#33-prd-10-nfr-backlog--no-suite-mirrors-ac-199-added-2026-08-23),
[`RAISE-TEST-CASES.md` §18.5](../06-test-cases/RAISE-TEST-CASES.md#185-prd-10-nfr-backlog--no-test-cases-mirrors-test-plan-33--ac-199-added-2026-08-23).
This matrix mirrors the same discipline here rather than silently omitting
the backlog from the master table, per this document's own principle that
every PRD-referenced area must appear somewhere in the chain even when it
has no dedicated Traceability ID and therefore no row of its own in §3:

| PRD §10 NFR Area | Design | Prototype | AC | Suite | TC | Matrix Status |
|---|---|---|---|---|---|---|
| Authentication | §16 (mechanism TBD) | Narrative on P-001 only | AC-LOGIN (existence only) | TS-LOGIN | TC-LOGIN-01/-02 | Covered only as a narrow slice of `RAISE-NFR-SEC-RBAC-001` above — no dedicated PRD Traceability ID of its own |
| Authorization / RBAC | §16 "MVP Enforcement Level" | Narrative on P-001/P-009 | AC-LOGIN, AC-OPS-002, AC-MAINT-001 (dependency notes) | TS-LOGIN, TS-OPS-002, TS-MAINT-001 | TC-LOGIN-03, TC-OPS-002-01, TC-MAINT-001-04..08 | Same row as `RAISE-NFR-SEC-RBAC-001` above (§4) — enforcement location only, role content TBD |
| Performance | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | **No PRD Traceability ID — not a row in §3/§4. Placeholder only, no test coverage of any kind, by design (nothing to invent).** |
| Availability | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance |
| Scalability | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance |
| Backup / Recovery | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance |
| Data Retention | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance; interacts conceptually with `RAISE-FR-AUDIT-001`'s retention item and `RAISE-FR-LICENSE-001` (§5 below), but no retention period is defined for either |
| Encryption | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance |
| API Security | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance |
| Audit Retention | §16A: TBD | §25A: narrative on P-013 only | AC-AUDIT-001's existing retention note | TS-AUDIT-001 | TC-AUDIT-001-01/-02 | Covered only as a narrow slice of `RAISE-FR-AUDIT-001` (§3 above) — no dedicated retention-period test exists, no dedicated Traceability ID for "Audit Retention" itself |
| Monitoring | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance |
| Logging | §16A: TBD | §25A: no representation | §19.9: no AC group | §3.3: no suite | §18.5: no test case | Same as Performance; explicitly distinct from the business-facing Audit Log (`RAISE-FR-AUDIT-001`) |

**Why these are not rows in §3:** per the PRD's own Traceability ID
convention (`RAISE-FR-*` / `RAISE-AI-*` / `RAISE-NFR-*`), only
`RAISE-NFR-SEC-RBAC-001` among the twelve §10 NFR areas has been assigned an
ID — the other ten (Performance, Availability, Scalability, Backup/Recovery,
Data Retention, Encryption, API Security, Audit Retention, Monitoring,
Logging) remain named backlog items with no ID, no value, and no target
anywhere in `RAISE-PRD.md`. Giving them a row in §3 (a requirement-ID-keyed
table) would imply an ID exists where none does. This section exists so a
reviewer does not need to infer their absence — it is recorded, not silent.

---

## 5. Roadmap / Pilot Items — Explicitly Out of Test Scope

Per PRD §14 (Enterprise Roadmap) and §7 (AI capability classification),
these have **no Design detail beyond a concept diagram, no Prototype
screen** (except `RAISE-FR-LICENSE-001`, noted below), **no AC group, no
Suite, and no Test Case** — consistent exclusion end-to-end, not a coverage
gap:

| PRD Requirement | Title | Status | Design Area | Prototype | AC / Suite / TC |
|---|---|---|---|---|---|
| `RAISE-AI-RISK-001` | Risk Scoring | PILOT | §10 Risk Scoring (concept only) | None | None |
| `RAISE-AI-LIFECYCLE-001` | Lifecycle Prediction | PILOT | §11 Lifecycle Prediction (concept only) | None | None |
| `RAISE-AI-RECOMMEND-001` | AI Recommendation | ROADMAP | §12 AI Recommendation (concept only) | None | None |
| — | Real-time ERP Integration | ROADMAP | Not designed | None | None |
| — | Native Mobile App | ROADMAP | Not designed | None | None |
| — | Predictive Analytics | ROADMAP | Not designed | None | None |
| — | Workflow Automation | ROADMAP | Not designed | None | None |
| — | Multi-channel Alerts (Email/Teams/LINE) | ROADMAP | Noted in §14 Alert Architecture (Roadmap subsection) | None | None |
| — | Asset Disposal workflow (`RAISE-FR-LIFE-001` terminal stage) | ROADMAP | §4.2 Conceptual State (concept only) | None | None (`TC-LIFE-001-03` retained as an inactive Out-of-Scope row, not a real Suite/TC) — confirmed present in `RAISE-PRD.md` §14 item 7 / §16 Resolved Question 26 |
| `RAISE-FR-LICENSE-001` | Software / SaaS License Management | **ROADMAP** — verified present in `RAISE-PRD.md` v0.9 §6, §13, §14 item 8, §17 (Scope `Roadmap`, §16 Resolved Question 34). **Former Gap 6 concern resolved:** this requirement's existence and Roadmap classification are now confirmed at the source-of-truth layer, matching what Design (§4.1A, §5.3), Prototype (P-016/P-017), AC (§3 traceability note), and Test Plan (§3.2) already asserted. | §4.1A, §5.3 (Roadmap, not MVP) | P-016 License Inventory, P-017 License Detail (Roadmap-labeled, mirroring already-built `frontend/src/pages/Licenses/` and `LicenseDetail`) | AC: traceability note only (no AC group, correctly per Roadmap rule) · Suite: none (correctly, per Roadmap rule) · TC: none |

If any Roadmap/Pilot item is promoted to MVP, it must re-enter the chain at
`RAISE-PRD.md` first (scope change), then Design, then Prototype, then
Acceptance Criteria, then Test Plan/Cases — this matrix will not be
back-filled with test coverage that skipped those steps.

---

## 6. Gaps

**Gap 1 (resolved):** `RAISE-FR-LIFE-001` previously had no dedicated AC
group, test suite, or test cases. Closed via `AC-LIFE-001`
(`RAISE-ACCEPTANCE-CRITERIA.md` §7.5), `TS-LIFE-001`
(`RAISE-TEST-PLAN.md` §7–§9), and `TC-LIFE-001-01..04`
(`RAISE-TEST-CASES.md` §6.5). Re-confirmed this revision — no drift.

**Gap 2 (resolved 2026-08-21):** Disposal (`RAISE-FR-LIFE-001` terminal
stage) had no MVP requirement or screen despite appearing in the lifecycle
diagram. Resolved: Product/Business confirmed Disposal is Enterprise
Roadmap, not MVP — propagated through PRD §14 item 7 / §16 Resolved Question
26 (verified present in `RAISE-PRD.md` v0.9), Design §4.2, AC §7.5, Test
Plan, Test Cases, and §5 above. Re-confirmed this revision — no drift.

**Gap 3 (resolved 2026-08-21, incl. follow-through):** Q12/Q22 role-gate
attribution was under-documented at the AC layer and had not propagated to
Test Plan/Test Cases. Fixed directly in `RAISE-ACCEPTANCE-CRITERIA.md`,
`RAISE-TEST-PLAN.md`, and `RAISE-TEST-CASES.md`. Re-confirmed this revision
— no drift; Q22's role-gate note appears consistently at AC §15/§16/§20,
Test Plan §7/§8, and Test Cases `TC-ALERT-001-01`/`TC-AUDIT-001-03`.

**Gap 4 (resolved 2026-08-21, matrix-layer sync only):** this matrix's own
§3 row for `RAISE-FR-ASSET-003` had not been re-synced to reflect
`TC-ASSET-003-03`'s BLOCKED (partial) status already correctly recorded in
`RAISE-TEST-CASES.md`/`RAISE-TEST-PLAN.md`. Corrected. **Still open, not
part of Gap 4's closure:** the underlying business question — whether
Custody History (`RAISE-FR-ASSET-003`) is written *only* by Check-in/
Check-out (`RAISE-FR-OPS-002`) or also by other custody-changing events — is
unresolved in `RAISE-PRD.md`'s own Pre-Finalization Quality Pass
("Duplicated / Overlapping Requirements," marked "Needs business
confirmation"). This means `AC-ASSET-003-03`/`TC-ASSET-003-03` verify only
the Check-in/Check-out-triggered path — a genuinely thin slice of
`RAISE-FR-ASSET-003`'s full scope, carried forward as an open item, not
newly discovered this revision. No new Open Question is proposed here; the
PRD's existing entry already covers it and should be resolved through the
normal `/update-prd` business-confirmation path.

**Gap 5 (resolved 2026-08-21, both sub-items):** Utilization KPI definition
(PRD §16 Resolved Question 27) and the four AI-DOC capabilities'
Traceability IDs (PRD §16 Resolved Question 28) were each closed via a real,
verified `RAISE-PRD.md` change. Re-verified again this revision: Resolved
Questions 27, 28, 29 (Utilization calculation mechanics), 30, 31, 32
(AI-DOC-001/002/003 acceptance detail) all genuinely exist in the current
PRD text (§7, §8, §16). Residual TBD items (Utilization calculation
mechanics' further threshold detail; `RAISE-AI-DOC-004`'s fully-undefined
acceptance behavior) remain open exactly as before, tracked in §3/§4 above.

**Gap 6 (RESOLVED this revision — was OPEN/CRITICAL in v0.4):**

v0.4 of this matrix found that the actual `RAISE-PRD.md` file was v0.4 (not
the v0.9 every downstream document claimed), with no §16 Resolved Questions
33–38 and no `RAISE-FR-LICENSE-001` entry anywhere — meaning five downstream
documents (Design, Prototype, AC, Test Plan, Test Cases) had built
substantial content (the Maintenance 4-stage workflow's full AC/Suite/Test
Case elaboration, the entire `RAISE-FR-LICENSE-001` requirement with two
Prototype screens, and the RBAC MVP-enforcement-level decision) on a PRD
state that did not actually exist on disk.

**This revision re-read the current `RAISE-PRD.md` file directly, in full
(not via downstream citation), before doing anything else, and confirms the
file has since been genuinely updated:**

- Header/Document Status: **Version 0.9** (was 0.4).
- §16 Resolved Questions run through **38**, each with a real, substantive
  entry (verified by reading each one in full — see §1 above for the list).
- `RAISE-FR-LICENSE-001` exists in §6, §13, §14, and §17 — with Scope
  correctly recorded as `Roadmap` (not MVP) in every location, matching what
  Design/Prototype/AC/Test Plan already asserted.
- §11 (Security & RBAC) contains the RBAC MVP-enforcement-level subsection
  matching Design §16.
- `RAISE-FR-MAINT-001`'s Acceptance Criteria field contains the full
  4-stage workflow and state model matching Design §5.1 / AC §12 / Test
  Cases `TC-MAINT-001-03..09`.

**What this means for the affected items:**

1. `RAISE-FR-LICENSE-001` (§5 above) — requirement identity and Roadmap
   scope are now **confirmed at the PRD layer**. No further action needed
   beyond normal Roadmap-planning work (field model, alert rule, etc., which
   remain separately TBD and are not part of this gap).
2. `RAISE-FR-MAINT-001`'s 4-stage workflow and state model (§3 above) —
   **confirmed at the PRD layer**. The AC/Suite/Test Case elaboration built
   on top of it (`AC-MAINT-001-03..09`, `TS-MAINT-001`,
   `TC-MAINT-001-03..09`) is now verifiably anchored to a real requirement,
   not merely internally consistent among downstream documents.
3. `RAISE-NFR-SEC-RBAC-001`'s "MVP Enforcement Level" decision — **confirmed
   at the PRD layer** (§11, §16 Resolved Question 38). The role
   list/permission matrix content itself remains genuinely TBD (PRD §16
   Q21–Q23) — that part of the gap was never claimed resolved and still
   is not; only the enforcement-*location* decision is confirmed.
4. The six ESAPS-reference-only out-of-scope pages and the
   `RAISE-AI-RECOMMEND-001` Roadmap re-confirmation (Resolved Questions 35,
   36) — confirmed present.
5. The Oracle FA "Phase 6" label clarification (Resolved Question 37) —
   confirmed present. As before, this resolves only the label; the
   substantive `ReconciliationPage`↔`RAISE-FR-ORACLE-001` mapping question
   (PRD Open Question 10a) remains genuinely open in the real PRD text and
   is **not** treated as resolved anywhere in this chain (see the
   `RAISE-FR-ORACLE-001` row in §3).

**No corrective action against any downstream document is required** — the
gap was in the PRD's on-disk state lagging its own claimed version, not in
any Design/Prototype/AC/Test Plan/Test Cases content being substantively
wrong. This matrix records the closure with the evidence above rather than
silently dropping the gap from its history, consistent with the "resolved
gaps are recorded as resolved, not deleted" discipline already used for
Gaps 1–5.

**New residual item surfaced while re-verifying Gap 6 (not a new gap, a
sharpening of Gap 4):** while confirming `RAISE-FR-MAINT-001`'s workflow
shape against the real PRD, this matrix also re-confirmed that the PRD's
§16 Resolved Question 33 explicitly states SLA per stage, the vendor model,
the cost model, and delegated-approver configuration rules remain **TBD** —
this is unchanged from every downstream document's own framing and is not a
new finding, just confirmed as accurately carried through the whole chain.

---

## 7. Chain Consistency Check

Performed by walking every ID backward through the chain, re-reading the
actual current text of every document in the chain — including a full
direct re-read of `RAISE-PRD.md` itself — rather than relying on any
downstream document's citation of an upstream document's content:

- **PRD → Design:** every `RAISE-FR-*` / `RAISE-AI-*` / `RAISE-NFR-*` ID in
  `RAISE-PRD.md` §17 (v0.9, 20 rows) appears in `RAISE-DESIGN.md` §24's
  Design Traceability table or is explicitly covered structurally
  (`RAISE-NFR-SEC-RBAC-001` via §16 Security Architecture, per §24's own
  cross-check note). ✅ No orphan PRD requirement without a design area.
- **Design → Prototype:** every design area with a screen-bearing
  requirement maps to a screen in `RAISE-PROTOTYPE.md` §5/§27. `RAISE-FR-
  LICENSE-001` maps to P-016/P-017 (Roadmap-labeled, per §22's out-of-scope
  discipline). `RAISE-AI-DOC-001..004` map incidentally to existing screens
  per Design §9A's "design-convenience grouping only" framing, carried
  through to Prototype §5's mapping note. ✅ No orphan design area without
  prototype representation (beyond the deliberate Pilot/Roadmap concept-only
  areas in §5 above, which correctly have none).
- **Prototype → AC:** every mandatory screen (P-001–P-015) has at least one
  AC group in `RAISE-ACCEPTANCE-CRITERIA.md` §3; P-016/P-017 correctly have
  only a traceability note, not an AC group, per the Roadmap exclusion rule.
  ✅ No orphan screen.
- **AC → Suite:** every AC group in AC §3 has exactly one Suite ID in
  `RAISE-TEST-PLAN.md` §7, including the four AC-AI-DOC groups (now mapped
  to `TS-AI-DOC-001..004`, fully blocked per §8.1). ✅ No orphan AC group.
- **Suite → Test Case:** every Suite ID in Test Plan §7 has at least one
  test case in `RAISE-TEST-CASES.md` (including the four BLOCKED (full)
  placeholder cases, which exist solely to preserve 1:1 traceability). ✅ No
  orphan suite.
- **Test Case → AC:** every `TC-*` ID maps to exactly one `AC-*` criterion,
  1:1, per Test Cases' own ID convention (§2). ✅ No orphan test case
  (verified for all 62 test cases in Test Cases v0.5 §19).
- **Reverse check, PRD requirement existence:** every `RAISE-FR-*` /
  `RAISE-AI-*` ID appearing in §3/§4/§5 above was checked against a direct
  re-read of `RAISE-PRD.md` v0.9 §6, §7, §8, §9, §11, §12, §17 — all exist,
  including `RAISE-FR-LICENSE-001` (Gap 6, now closed) and
  `RAISE-FR-MAINT-001`'s workflow-shape Acceptance Criteria content.
- **`RAISE-FR-MAINT-001` 4-stage workflow — thread walked end-to-end this
  revision:** PRD §6/§16 Resolved Question 33 → Design §5.1 → Prototype
  §15/§26/§27 → AC §12/§20/§21 → Test Plan §7/§8 → Test Cases
  `TC-MAINT-001-03..09`. Every layer is internally consistent with every
  other layer **and** now verifiably anchored to the real PRD text (unlike
  the v0.4 finding). Thread confirmed complete.
- **`RAISE-FR-LICENSE-001` Roadmap-only scope — thread walked end-to-end
  this revision:** PRD §6/§13/§14/§17/§16 Resolved Question 34 → Design
  §4.1A/§5.3/§14/§22/§24 → Prototype §5/§22/§23/§27 → AC §3 (traceability
  note only) → Test Plan §3.2 (no suite) → Test Cases §11.5 (no test cases).
  Every layer agrees the item is Roadmap, not MVP — no scope-creep occurred,
  and the requirement's existence is now confirmed at the PRD layer. Thread
  confirmed complete.
- **`RAISE-NFR-SEC-RBAC-001` MVP enforcement level — thread walked this
  revision:** PRD §11/§16 Resolved Question 38 → Design §16 → Prototype
  §4/§7/§9 → AC §4/§11/§12/§20/§21 → Test Plan §7/§8 → Test Cases
  `TC-LOGIN-03`, `TC-OPS-002-01`, `TC-MAINT-001-04..08`. All layers
  consistently describe "UI-only/client-side for MVP, backend deferred to
  Roadmap," and this is now confirmed present in the real PRD §11 text.
  Thread confirmed complete.
- **PRD §10 NFR backlog — thread walked this revision (new):** PRD §10 →
  Design §16A → Prototype §25A → AC §19.9 → Test Plan §3.3 → Test Cases
  §18.5 → this matrix's §4.2. All six layers list the identical eleven
  areas (Authentication, Authorization/RBAC, Performance, Availability,
  Scalability, Backup/Recovery, Data Retention, Encryption, API Security,
  Audit Retention, Monitoring, Logging) with the identical "no invented
  value, ten of the eleven have no dedicated Traceability ID" framing at
  every layer. ✅ No layer silently omits the backlog; no layer invents a
  value, mechanism, or Traceability ID that the PRD does not define.
- Full re-walk confirmed no other Test Status cell in §3/§4 has drifted from
  the current text of `RAISE-TEST-CASES.md` v0.5 (cross-checked TC-by-TC):
  `RAISE-FR-ASSET-001..003`, `RAISE-FR-OPS-001/002`, `RAISE-FR-WARRANTY-001`,
  `RAISE-FR-ORACLE-001`, `RAISE-FR-ALERT-001`, `RAISE-FR-AUDIT-001`,
  `RAISE-FR-EXEC-001`, `RAISE-AI-SEARCH-001`, `RAISE-FR-LIFE-001`,
  `RAISE-AI-DOC-001..004`, and the Dashboard/Navigation row all match their
  respective TC Blocked-column text exactly.

---

## 8. Compliance Review Readiness

Per the RAISE AI Development Workflow, this matrix is the input to
`RAISE-COMPLIANCE-REVIEW.md` once Development produces source code:

```text
RAISE-TRACEABILITY-MATRIX.md
      │
      ▼
Development (Source Code)
      │
      ▼
Requirement Compliance Review
      │
      └──► Finding / Gap ──► Fix / Re-test
```

For each requirement row above, Compliance Review should update the
**Test Status** column from `NOT_TESTED`/`BLOCKED` to `PASS`, `PARTIAL`,
`FAIL`, or `NOT_IMPLEMENTED` as evidence becomes available — this matrix
is the living record referenced at that stage, not a one-time snapshot.

**Readiness note (updated this revision — Gap 6 closed):** Development may
now proceed against `RAISE-FR-MAINT-001`'s 4-stage workflow,
`RAISE-FR-LICENSE-001` (as a Roadmap-only placeholder, not MVP work),
and `RAISE-NFR-SEC-RBAC-001`'s "UI-only enforcement is acceptable for MVP"
decision — all three are now verifiably anchored to the real
`RAISE-PRD.md` v0.9, removing the readiness caveat v0.4 of this matrix
raised.

**Correction (2026-08-26):** the caveat immediately below — "no source
code exists yet in `frontend/`... every Test Status above is `NOT_TESTED`
or `BLOCKED` by definition" — is stale and has been false since at least
PR #5. Real backend (`go-template-main`) and frontend (`frontend/src/`)
code exist for multiple domains as of PR #36. `RAISE-FR-OPS-001`,
`RAISE-FR-AUDIT-001`, and `RAISE-FR-EXEC-001` were formally executed
against the real running app on 2026-08-26 (see each row's own Test
Status cell above for evidence) — this is real `PASS`/`PARTIAL`/`FAIL`
status, not the placeholder default this caveat describes. The caveat
text below is left otherwise unedited (not rewritten wholesale) since a
full re-verification of every remaining row's status is separate,
larger work — see `CURRENT-STATUS.md`/`NEXT-STEP.md` for what's actually
built vs. this matrix's row-by-row detail, which may still lag in rows
not touched by this correction.

**Standing readiness caveats (unaffected by Gap 6, still open):**

- ~~No source code exists yet in `frontend/` (per `CLAUDE.md`: package
  manifest present, `src/` empty) — every Test Status above is `NOT_TESTED`
  or `BLOCKED` by definition, not `PASS`/`FAIL`, because there is nothing
  to execute against yet.~~ — **superseded, see Correction note above.**
- The PRD Open Questions still blocking full testability (§3/§4 above,
  Q1–Q25 minus the resolved/partially-resolved items) must still be
  reviewed with Product/Business before Development proceeds on the
  requirements they block.
- The `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` custody-writing-events
  exclusivity question (Gap 4) remains open and should be resolved before
  Development builds any custody-writing code path beyond Check-in/
  Check-out.
- `RAISE-AI-DOC-004`'s acceptance behavior (matching threshold,
  merge-vs-flag workflow) was explicitly asked of business and left
  unanswered — Development cannot build this capability's behavior without
  inventing it.

---

## 9. Traceability Matrix Review Checklist

- [x] Every PRD MVP requirement (§13 of the PRD) appears in §3 above
- [x] Every supporting/cross-cutting item appears in §4, explicitly
      labeled as not mapping to a single `RAISE-FR-*` ID
- [x] Every Pilot/Roadmap item appears in §5 with no test coverage
      columns filled in (including `RAISE-FR-LICENSE-001`, now confirmed
      real at the PRD layer)
- [x] Gaps 1–5 (§6) are re-confirmed resolved with no drift this revision
- [x] **Gap 6 (§6) is RESOLVED this revision** — the actual `RAISE-PRD.md`
      file is now genuinely v0.9 and contains §16 Resolved Questions 33–38
      and the `RAISE-FR-LICENSE-001` requirement, verified by direct re-read
      rather than by trusting downstream citations
- [x] PRD §10 NFR backlog is explicitly acknowledged in a dedicated §4.2
      cross-layer table, mirroring Design §16A / Prototype §25A / AC §19.9 /
      Test Plan §3.3 / Test Cases §18.5 — no value, target, or Traceability
      ID is invented for the ten areas with none defined
- [x] Chain consistency (§7) has been re-verified this revision, including a
      direct re-read of `RAISE-PRD.md` itself
- [x] No VERSCAN-only item appears anywhere in this matrix

---

## 10. Next Step

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
RAISE-TEST-CASES.md
      ↓
RAISE-TRACEABILITY-MATRIX.md   ← Current
      ↓
Development (Source Code)
      ↓
RAISE-COMPLIANCE-REVIEW.md
```

Gaps 1–6 are all resolved and re-confirmed with no drift this revision.

**Recommended next actions, in order:**

1. Resolve the remaining PRD Open Questions that block full testability of
   P0/MVP requirements (§3/§4 above) — in particular Q1 (asset master
   fields), Q3/Q4 residual KPI formulas, Q6–Q10 (Oracle integration design),
   Q11–Q13 (Check-in/Check-out and custody model), Q15 (warranty fields),
   Q18–Q20 (AI citation/confidence/conflict), Q21–Q23 (authentication
   mechanism, role list, permission matrix content), Q24–Q25 (audit
   taxonomy/retention), Open Question 10a (`ReconciliationPage` mapping),
   and Open Question 20a (`RAISE-AI-DOC-004` matching/merge behavior).
2. Resolve the `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` custody-writing-
   events exclusivity question (Gap 4) before any custody-writing code path
   beyond Check-in/Check-out is built.
3. If and when any PRD §10 NFR backlog area (§4.2 above) receives a defined
   value/target, add the corresponding Traceability ID to `RAISE-PRD.md`
   first, then propagate a real AC group / Suite / Test Case down the chain
   — do not add test coverage for these areas ahead of a PRD-level
   definition.
4. Proceed to Development for requirements with no open blocker (e.g.,
   `RAISE-FR-OPS-001`, `TS-AI-STATES`), while tracking the BLOCKED items
   above for the remaining requirements.

---

## Document Status

**Version:** 0.5 (full-chain re-sync pass — PRD §10 NFR backlog
acknowledgment propagated to every layer; **Gap 6 from v0.4 re-verified and
closed**)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.5 and full upstream chain — `RAISE-TEST-PLAN.md` v0.5, `RAISE-ACCEPTANCE-CRITERIA.md` v0.5, `RAISE-PROTOTYPE.md` v0.6, `RAISE-DESIGN.md` v0.8, and `RAISE-PRD.md` v0.9 (re-read directly this revision, in full, before consolidating anything else)
**Reference:** VERSCAN only
**Last Re-Verified:** 2026-08-23 (full-chain re-sync pass) — re-read
`RAISE-TEST-CASES.md` v0.5, `RAISE-TEST-PLAN.md` v0.5,
`RAISE-ACCEPTANCE-CRITERIA.md` v0.5, `RAISE-PROTOTYPE.md` v0.6,
`RAISE-DESIGN.md` v0.8, and — critically, as has been this document's
practice since v0.4 — `RAISE-PRD.md` v0.9 itself, end to end. All ID
cross-checks in §7 re-run.

**Change Log — v0.4 → v0.5 (this revision, 2026-08-23):**

1. **Gap 6 closed.** v0.4 opened a critical finding that the actual
   `RAISE-PRD.md` file was v0.4 (not the v0.9 every downstream document
   claimed), missing §16 Resolved Questions 33–38 and the
   `RAISE-FR-LICENSE-001` requirement entirely. This revision re-read the
   current `RAISE-PRD.md` file directly, in full, and confirmed it is now
   genuinely v0.9, with Resolved Questions running through 38 and a real
   `RAISE-FR-LICENSE-001` entry in §6/§13/§14/§17 — all matching what
   downstream documents already asserted. Every ⚠ PRD-drift annotation from
   v0.4 has been removed from §3/§4/§5 and replaced with a "verified present
   in `RAISE-PRD.md` v0.9" citation where the underlying claim was
   previously flagged as unverifiable. §6 Gap 6 now records this as
   **RESOLVED**, with the full evidence trail preserved (not deleted),
   consistent with how Gaps 1–5 are recorded.
2. **New §4.2 "PRD §10 NFR Backlog — Cross-Layer Acknowledgment" added.**
   `RAISE-DESIGN.md` v0.8 §16A, `RAISE-PROTOTYPE.md` v0.6 §25A,
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.5 §19.9, `RAISE-TEST-PLAN.md` v0.5 §3.3,
   and `RAISE-TEST-CASES.md` v0.5 §18.5 each added an identical-in-spirit
   placeholder acknowledging the PRD §10 NFR backlog (Performance,
   Availability, Scalability, Backup/Recovery, Data Retention, Encryption,
   API Security, Audit Retention, Monitoring, Logging — ten areas with no
   dedicated PRD Traceability ID, plus `RAISE-NFR-SEC-RBAC-001` which does
   have one and is already covered in §4). This matrix had no equivalent
   acknowledgment; the new §4.2 records, per area, exactly what (if any)
   narrow coverage exists and confirms no value/target/ID is invented for
   the ten open areas. **No new requirement, AC group, suite, or test case
   was created** — this is a completeness/traceability-note pass only,
   mirroring the discipline every other layer already applied.
3. **§7 Chain Consistency Check expanded** with a new bullet walking the
   PRD §10 NFR backlog thread end-to-end (PRD → Design → Prototype → AC →
   Test Plan → Test Cases → this matrix), confirming identical framing at
   every layer.
4. **§8 Compliance Review Readiness updated** to remove the v0.4 readiness
   caveat (which was contingent on Gap 6) and replace it with the standing,
   Gap-6-independent caveats that remain open (no source code yet; PRD Open
   Questions; Gap 4's custody-writing-events question; `RAISE-AI-DOC-004`'s
   unanswered acceptance behavior).
5. Version citations throughout were updated: PRD v0.9 (confirmed real, not
   claimed), Design v0.7 → v0.8, Prototype v0.5 → v0.6, AC v0.4 → v0.5, Test
   Plan v0.4 → v0.5, Test Cases v0.4 → v0.5.
6. **Quality-gap scan (per this revision's explicit instruction to look for
   thin P0 coverage, not just orphan IDs):** re-examined every P0/MVP
   requirement in §3 for a requirement whose only coverage is embedded
   inside another requirement's AC group with no dedicated AC group of its
   own (the pattern that produced Gap 1 for `RAISE-FR-LIFE-001`, since
   resolved). No new instance of that specific pattern was found — every P0
   requirement in PRD §17 now has its own AC group, Suite, and Test Case(s)
   (§3 above). The closest remaining thin-coverage item is the existing,
   already-tracked **Gap 4** residual (`RAISE-FR-ASSET-003`'s
   `AC-ASSET-003-03`/`TC-ASSET-003-03` verify only the Check-in/Check-out-
   triggered write path, not the requirement's full "custody history is
   retained" scope) — restated with sharper wording in §6 Gap 4 above, not
   newly discovered. `RAISE-AI-DOC-001..004`'s BLOCKED (full) status (§3, §4.1)
   is a different, already-well-documented pattern (own AC group exists, but
   its sole criterion is entirely untestable) and is not re-flagged as new.

**Change Log — v0.3 → v0.4 (prior revision):** see git history / prior
version of this file for the full v0.3 → v0.4 record (Maintenance 4-stage
workflow row expansion, `RAISE-FR-LICENSE-001` first added to §5, RBAC MVP
enforcement level noted, and the original Gap 6 finding).

**Next Action:** With Gap 6 closed, the priority shifts back to the
standing PRD Open Questions and Gap 4's custody-writing-events question
(§8, §10 above) before Development proceeds on the requirements they block.
No document in the chain requires a consistency correction at this time.
