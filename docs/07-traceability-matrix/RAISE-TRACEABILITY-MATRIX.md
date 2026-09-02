# RAISE Requirement Traceability Matrix

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Requirement Traceability Matrix (RTM)
**Version:** 1.7 Draft (`RAISE-FR-OPS-002` — **Gap 15 (IT Hardware Assignment
Approval Workflow implementation gap) RESOLVED this revision, 2026-09-02.**
The 4-stage workflow (Initiation → Recipient Confirmation → IT Processing →
IT Supervisor Approval) confirmed by PRD §16 Resolved Question 43 (v1.6,
narrowing Resolved Question 42) has now been **implemented in
`go-template-main`** — new backend files `model/assetHandoverModel.go`,
`repository/assetHandoverPGRepository.go`, `repository/
assetHandoverRepository.go`, `service/assetHandoverService.go`,
`controller/assetHandoverController.go`, `sql/pg/V5__AssetHandovers_Table.sql`;
new routes `GET /handovers`, `GET /handovers/:code`, `POST
/assets/:id/handover`, `POST /handovers/:code/confirm`, `POST
/handovers/:code/process`, `POST /handovers/:code/decision`;
`AssetService.AssignAsset` now branches on Category `"IT Hardware"`,
returning HTTP 409 with a `nextStep` hint into the new handover flow, while
every other category continues to assign immediately (regression-verified).
`RAISE-TEST-CASES.md` v0.15 records `TC-OPS-002-04` through
`TC-OPS-002-09` — all six — moved from **BLOCKED (pending implementation)**
to **PASS**, formally re-executed end-to-end against the real running Docker
stack (backend + Postgres), covering all 4 stages, both rejection points
(Stage 3 and Stage 4, both confirmed terminal), and the non-IT-Hardware
regression guard, corroborated by 18 new Go unit tests
(`service/assetHandoverService_test.go`, all passing) and a clean
`go build`/`go vet`/`go test` sweep. **This is backend/API-level execution
only** — no frontend UI exists yet for "My Pending Assignments"/`IT_STAFF`
queue/`IT_MANAGER` queue (a distinct, not-yet-started follow-up, tracked as a
scope boundary below, not re-opened as part of Gap 15), and `IT_STAFF`/
`IT_MANAGER` role gates were **not** verified as backend-enforced —
consistent with this codebase's existing project-wide MVP decision that RBAC
is UI-only/client-side (PRD §16 Resolved Question 38), not a gap specific to
this feature. `RAISE-FR-OPS-002`'s row (§3) is accordingly upgraded from
**PASS (partial)** to a full **PASS on the testable-now scope**
(backend/API-level, 4-stage state machine, terminal rejection, regression
guard) — see the row's own Test Status cell for the explicit list of
still-open sub-points this PASS does **not** cover. **Genuinely still open,
unaffected by this closure, not resolved by real code+test evidence and
therefore correctly left open per this document's no-silent-resolution
discipline:** the Stage-2 e-signature/acknowledgment-text-capture question
(PRD's own `## NEEDS_PRD_CONFIRMATION` note, untouched — the user dismissed
this question this session rather than answering it); the Stage-2
recipient-decline path (never asked, not implemented); and the Custody
History write-timing question across the 4 stages
(`RAISE-DESIGN.md` §4.2's own flagged open design point, distinct from and
not resolving Open Finding F-10 / Gap 4). See the `RAISE-FR-OPS-002` row
(§3) and Gap 15 (§6, now **RESOLVED**) for the full closure record. Gaps
1–14 remain resolved from v1.5/v1.6, unchanged this revision.)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.14 (§16 Resolved Question 43, unchanged this revision), [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.12 (§4.2, unchanged this revision), [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.13 (P-008, unchanged this revision), [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.11 (§11 AC-OPS-002-04..09, unchanged this revision), [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.11 (TS-OPS-002, unchanged this revision), and [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.15 (`TC-OPS-002-04..09` moved from BLOCKED (pending implementation) to **PASS**, formal execution against the real running Docker stack, 2026-09-02). Only `RAISE-TEST-CASES.md` and the real `go-template-main` source tree changed to produce this closure — this revision updates only `RAISE-TRACEABILITY-MATRIX.md` itself to reflect that. Confirmed: this closure rests on real implementation + real test execution evidence, not a business decision or spec correction alone, per this document's own standing discipline (Gap 6/8/9/12's "a business decision or spec correction alone never upgrades a Test Status; only a real execution does").
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
| `RAISE-FR-ASSET-002` | Category & Hierarchy | P0 / MVP | §4.1 Asset Management | P-005 | AC-ASSET-002 (AC-ASSET-002-01/-02/-03) | TS-ASSET-002 | TC-ASSET-002-01..03 | **PASS — spec corrected and re-execution complete 2026-09-01 (Open Finding F-27, RESOLVED).** Prior formal execution (2026-08-26) confirmed TC-ASSET-002-02 **PASS** (Category is consistent between Asset Registry and Asset Detail for the same asset, e.g. `a1` shows "IT Hardware" in both) and TC-ASSET-002-01 **PASS on the display mechanism** (a "By Category" view inside Asset Management, `frontend/src/pages/Assets/index.tsx`, groups Category → its real assets; verified live: "IT Hardware" expands to 6 real seeded assets, clicking one navigates to Asset Detail). At that time, the *spec itself* (AC-ASSET-002-01, Prototype P-005) still described an illustrative, unconfirmed sub-category tree (Computer > Notebook/Desktop, etc.), so the PASS above was explicitly scoped to the flat category-to-assets grouping only, not to a Category→Type hierarchy — the taxonomy question was open, tracked as F-27. **Spec resolved 2026-09-01 (Open Finding F-27, per explicit business decision):** "sub-category" is confirmed as the existing Asset `type` field (no new field/data model); the hierarchy is exactly 2 levels — Category → Type → individual assets — using the real, currently-seeded Category → Type breakdown (IT Hardware → Laptop/Monitor/Headphones; Mobile → Smartphone/Tablet; Office Equipment → Printer/Projector; Infrastructure → Server/Router; Media Equipment → Camera). Propagated through Prototype P-005 (§11, v0.9), AC-ASSET-002 (§8, v0.8, now includes a new **AC-ASSET-002-03**), Test Plan TS-ASSET-002 (v0.8), and Test Cases `TC-ASSET-002-01..03` (v0.9). **UI code change shipped and formally re-executed, same day (2026-09-01):** the "By Category" view (`frontend/src/pages/Assets/index.tsx`) was extended one level deeper to nest Category → Type → individual assets, closing the previously-BLOCKED `TC-ASSET-002-03`. Formal execution against the real running app: navigated to `/assets`, opened "By Category," expanded "IT Hardware" — confirmed it reveals Type-level sub-groups only (Headphones: 1 asset, Laptop: 3 assets, Monitor: 2 assets), with no individual assets shown at that level; expanded "Laptop" — confirmed it reveals exactly its 3 individual assets (MacBook Pro 16" M3 / AST-0001, MacBook Air M2 / AST-0011, ThinkPad X1 Carbon Gen 11 / AST-0012), none of Monitor's or Headphones' assets. Matches `AC-ASSET-002-01`/`-03` and Prototype P-005 (v0.9) exactly. `TC-ASSET-002-01` **PASS** — the corrected Category → Type hierarchy display is now confirmed by this same execution (the 2026-08-26 PASS is no longer relied on; this is a fresh, direct PASS against the corrected wording). `TC-ASSET-002-03` **PASS** — no longer BLOCKED (pending implementation). `TC-ASSET-002-02` **unaffected, still PASS**. Also confirmed: 3 new/updated automated tests in `frontend/src/pages/Assets/index.test.tsx` all pass, the full frontend suite (145 tests) passes with no regressions, and `tsc --noEmit`/lint are both clean. **All three sub-items of Gap 9 (spec correction, UI implementation, execution sweep) are now closed** — see Gap 9, §6, RESOLVED. Overall row status: **PASS**. |
| `RAISE-FR-ASSET-003` | Custody History | P0 / MVP | §4.2 Custody & Asset Operations | P-006 | AC-ASSET-003 | TS-ASSET-003 | TC-ASSET-003-01..03 | **PASS** — executed 2026-08-26: TC-ASSET-003-01 **PASS** (current holder "Sarah Chen" displays for asset `a1`). TC-ASSET-003-02/-03 originally **FAIL** — the "Assignment History" panel derived a single "current custody state" row instead of a chronological list, and a Check-in **replaced** the prior entry instead of appending — **now PASS**, re-executed after the fix (F-26): the History tab renders from the same per-asset audit trail `RAISE-FR-AUDIT-001` already builds (append-only by construction — `recordMockAuditEntry` only ever `unshift`s), which `assign`/`checkIn` already fed. Verified live on `a1`: Check-in appended "Asset checked in", then Assign appended "Asset assigned to Sarah Chen" alongside it (not replacing it) — both visible, newest-first. Independent of the still-open Check-in/Check-out-exclusivity question (Gap 4), which only concerns *other* write paths, not this one. **Holder-data-model question resolved 2026-09-01** (`RAISE-PRD.md` §16 Resolved Question 42, resolving Open Question 13, Open Finding F-02): confirmed as a **direct 1:1 link to an Employee record** (`Asset.assignedEmployeeId`/`assignedTo`) — no additional organizational relationship model (department, team, or location-based custody) is needed for MVP. This matches already-built, already-tested behavior exactly (the existing `TC-ASSET-003-01..03` results already exercise this data model); **no new field, model, or test execution was required or performed**. This resolution is independent of, and does **not** touch, the separate custody-writing-events exclusivity question (Gap 4, Open Finding F-10) — whether Check-in/Check-out is the *exclusive* writer of Custody History remains genuinely open, unaffected (`RAISE-PROTOTYPE.md` v0.12 explicitly restored F-10 to open after a v0.11 draft briefly and incorrectly over-resolved it). See Gap 14 (§6, opened and RESOLVED same revision, v1.5) for the full closure record. |
| `RAISE-FR-OPS-001` | QR / Barcode | P0 / MVP | §4.2 Custody & Asset Operations | P-007 | AC-OPS-001 | TS-OPS-001 | TC-OPS-001-01..03 | **PASS** — re-executed 2026-08-26 (after the F-21 fix) against the real running app (`frontend/src/pages/Assets/index.tsx`'s Scan QR flow): TC-OPS-001-01 **PASS** (valid code `AST-0001` opens Asset Detail); TC-OPS-001-02 **PASS** (unmatched-but-well-formed code `AST-9999` shows "No asset found for..."); TC-OPS-001-03 **PASS** (malformed code `%%$#!!garbage///` now shows a distinct "Invalid code — ... doesn't look like a scannable asset code" message, without attempting a lookup — no longer the same message as TC-OPS-001-02). F-21 resolved (`OPEN-FINDINGS.md`). |
| `RAISE-FR-OPS-002` | Check-in / Check-out (**narrowed 2026-09-02 for one category**: IT Hardware Check-out/Assign now requires a new 4-stage approval workflow — Initiation → Recipient Confirmation → IT Processing → IT Supervisor Approval — before status becomes Assigned; every other category, and Check-in for every category including IT Hardware, unaffected) | P0 / MVP | §4.2 Custody & Asset Operations; §4.2's new "IT Hardware Assignment Approval Workflow" subsection (category-scoped exception) | P-008 | AC-OPS-002 (AC-OPS-002-01/-02/-03 general rule; **AC-OPS-002-04..09**, IT Hardware exception) | TS-OPS-002 | TC-OPS-002-01..03 (general rule); **TC-OPS-002-04..09 (IT Hardware exception, now implemented and PASS)** | **PASS on the testable-now scope — Gap 15 (implementation gap) RESOLVED 2026-09-02.** General-rule evidence unchanged from 2026-08-28 execution against the real running app: TC-OPS-002-01 **PASS** (Assign — the app's actual affordance for identifying a holder and confirming, no distinct "Check-out" label exists but the behavior matches: custody state updated to the new holder on asset `a4`); TC-OPS-002-02 **PASS** (Check-in confirmed the asset's return to Available/Unassigned); TC-OPS-002-03 **PASS** (both operations created a corresponding Audit Log entry, verified visible with actor and timestamp). **Permission-gate and workflow-shape questions resolved 2026-09-01** (`RAISE-PRD.md` §16 Resolved Question 42, resolving Open Questions 11 and 12, Open Finding F-02): Check-in/Check-out is confirmed as an **immediate state-change operation**, with no approval step or exception-handling workflow, and the permission gate is confirmed as **any authenticated user, no role restriction** — matching the already-executed behavior exactly. This resolves only Check-in/Check-out's *own* permission requirement — it does **not** resolve the broader `RAISE-NFR-SEC-RBAC-001` role/permission-matrix-content question for other domains (PRD §16 Q21–Q22, Open Finding F-08), which remains genuinely open and unaffected. It also does **not** touch the separate, still-open question of whether Check-in/Check-out is the *exclusive* writer of Custody History (Gap 4, Open Finding F-10, unaffected). See Gap 14 (§6, opened and RESOLVED same revision, v1.5) for the full closure record of the general-rule resolution. **IT Hardware Assignment Approval Workflow, PRD §16 Resolved Question 43, narrowing Resolved Question 42 for the IT Hardware category only — confirmed 2026-09-02, implemented and formally tested this same session:** a real Singer Thailand company form ("ใบดำเนินการเกี่ยวกับคอมพิวเตอร์และอุปกรณ์") supplied by the business user during a live session showed a genuine 4-signature approval process for IT equipment handovers, confirmed and digitized to 4 stages (Initiation → Recipient Confirmation → IT Processing (`IT_STAFF`) → IT Supervisor Approval (`IT_MANAGER`, only stage that flips status to Assigned); rejection at Stage 3/4 is terminal, returns to Available). Fully propagated through `RAISE-DESIGN.md` v0.12 §4.2, `RAISE-PROTOTYPE.md` v0.13 P-008, `RAISE-ACCEPTANCE-CRITERIA.md` v0.11 §11 (`AC-OPS-002-04..09`), `RAISE-TEST-PLAN.md` v0.11 (`TS-OPS-002` Partial, blocked on implementation) — and **now implemented**: new `go-template-main` files `model/assetHandoverModel.go`, `repository/assetHandoverPGRepository.go`, `repository/assetHandoverRepository.go`, `service/assetHandoverService.go`, `controller/assetHandoverController.go`, `sql/pg/V5__AssetHandovers_Table.sql`; new routes `GET /handovers`, `GET /handovers/:code`, `POST /assets/:id/handover`, `POST /handovers/:code/confirm`, `POST /handovers/:code/process`, `POST /handovers/:code/decision`; `AssetService.AssignAsset` branches on Category `"IT Hardware"` to return HTTP 409 directing to the new handover flow, with non-IT-Hardware assets unaffected (regression-verified). `RAISE-TEST-CASES.md` v0.15 §10 records `TC-OPS-002-04..09` **all PASS**, formally re-executed end-to-end against the real running Docker stack (backend + Postgres): TC-OPS-002-04 **PASS** (Stage 1 Initiate enters `PENDING_RECIPIENT_CONFIRMATION`, asset stays Available, no early flip); TC-OPS-002-05 **PASS** (Stage 2 Confirm Receipt by the matching recipient advances to `PENDING_IT_PROCESSING`, with recipient-identity validation confirmed — mismatched/empty recipient rejected); TC-OPS-002-06 **PASS** (Stage 3 IT Processing advances to `PENDING_IT_SUPERVISOR_APPROVAL`); TC-OPS-002-07 **PASS** (Stage 4 IT Supervisor Approval is confirmed the *only* action that flips status to Assigned — no earlier stage does so); TC-OPS-002-08 **PASS** (rejection at both Stage 3 and Stage 4 confirmed terminal — asset returns to Available, no path reopens the rejected request); TC-OPS-002-09 **PASS** (non-IT-Hardware Check-out regression guard confirmed unaffected — no 409, no pending/handover state introduced). Corroborated by 18 new Go unit tests (`service/assetHandoverService_test.go`, all passing) and a clean full `go build`/`go vet`/`go test` sweep. `AC-OPS-002-01..09` are now all **PASS** on the testable-now scope. **Scope boundaries that remain genuinely open, NOT closed by this evidence (do not treat these as resolved):** (1) this is **backend/API-level execution only** — no frontend UI exists yet for "My Pending Assignments"/`IT_STAFF` queue/`IT_MANAGER` queue, a distinct, not-yet-started follow-up; (2) `IT_STAFF`/`IT_MANAGER` role gates are **not** backend-enforced, consistent with this codebase's project-wide MVP decision (UI-only/client-side RBAC, PRD §16 Resolved Question 38) — not a gap specific to this feature; (3) the Stage-2 e-signature/acknowledgment-text-capture question remains genuinely open — the PRD's own `## NEEDS_PRD_CONFIRMATION` note is untouched (the user dismissed rather than answered this question this session); (4) the Stage-2 recipient-decline path was never asked and is not implemented; (5) Custody History write-timing across the 4 stages (`RAISE-DESIGN.md` §4.2's own flagged open design point) remains unresolved, distinct from and not resolving Open Finding F-10 (Gap 4). See **Gap 15 (§6, RESOLVED)** for the full closure record. Overall row status: **PASS on the testable-now scope** — the general Check-in/Check-out rule and the new IT Hardware Assignment Approval Workflow (backend/API-level, all 4 stages, both terminal-rejection points, non-IT-Hardware regression guard) are all real, evidence-based PASS; frontend UI, backend role enforcement, and the two Stage-2 sub-points remain out of this PASS's scope, tracked separately above and not silently folded in. |
| `RAISE-FR-MAINT-001` | Maintenance (4-stage workflow: User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution) | P0 / MVP | §5.1 Maintenance Domain | P-009 | AC-MAINT-001 (AC-MAINT-001-01..09) | TS-MAINT-001 | TC-MAINT-001-01..09 | **PASS** — executed 2026-08-28 against the real running app, all 9 cases: TC-MAINT-001-03 **PASS** (a new requisition submitted via "New IT Requisition" enters `PENDING_DEPT_APPROVAL`). TC-MAINT-001-04 **PASS** (Dept Sign-off → Approve transitions to `PENDING_IT_DISPATCH`). TC-MAINT-001-05 **PASS** (Reject on a separate `PENDING_DEPT_APPROVAL` ticket resulted in `REJECTED_BY_DEPT`, confirmed **not** `PENDING_IT_DISPATCH` — per this case's own scope, no claim is made about whether that specific resulting state is itself correct). TC-MAINT-001-06 **PASS** (Assign Tech + Dispatch transitions to `IN_PROGRESS`, one of the three allowed states). TC-MAINT-001-07 **PASS** (Update Status to On-Hold with a hold reason correctly reflects "3. On-Hold" and shows the reason banner). TC-MAINT-001-08 **PASS** (Mark Complete transitions to `DONE`/"4. Resolved & Closed" with resolution notes shown). TC-MAINT-001-01 originally **FAIL** — the Maintenance record list showed no date/cost fields (F-28) — **now PASS**, re-executed after the fix: each record now shows created date and cost, verified live on asset `a1`. TC-MAINT-001-09 originally **FAIL** — the 4-stage progress indicator (`GovernanceStep` in `TicketDetail/index.tsx`) only rendered two visual states (done ✓ vs. a plain gray circle with the step number), so the "Current" stage and any not-yet-reached "Pending" stage were visually identical (F-29) — **now PASS**, re-executed after the fix: the current stage is derived from `ticket.status` and rendered with a distinct brand-colored circle, ring, and a "Current" badge; verified live across `PENDING_DEPT_APPROVAL` (stage 2 current), `PENDING_IT_DISPATCH` (stage 3 current), and `DONE` (no stage marked current, all done). TC-MAINT-001-02 **PASS** (2 records for asset `a1` displayed in ascending-chronological order by observed outcome, though the underlying code has no explicit sort — `assetTickets` in `AssetDetail/index.tsx` is unsorted array-filter order — a fragility worth watching, not a current failure since the observed order was correct). **The 4-stage workflow shape and state model remain verified present in `RAISE-PRD.md` v0.9 §6 and §16 Resolved Question 33.** |
| `RAISE-FR-WARRANTY-001` | Warranty | P0 / MVP | §5.2 Warranty Domain (3-state model); §5.4 Settings Domain | P-003 (Asset Registry column), P-004 (Asset Detail), P-018 (Settings > Warranty, new) | AC-WARRANTY-001 (AC-WARRANTY-001-01..06) | TS-WARRANTY-001 | TC-WARRANTY-001-01..06 | **PASS (partial)** — field-list blocker resolved 2026-08-29 (`RAISE-PRD.md` §16 Resolved Question 40, resolving Open Question 15: `warrantyExpiry` is the only MVP field). **Expiring-threshold blocker resolved 2026-09-01** (`RAISE-PRD.md` §16 Resolved Question 41, resolving follow-on Open Question 15b): the Expiring threshold is confirmed **per-Asset-Category configurable**, not a single global 90-day constant — defaulting to 90 days for all 5 current Asset Categories, admin-adjustable via a new P-018 Settings screen. **Implemented and formally executed 2026-09-01:** `frontend/src/lib/warranty.ts` (`getWarrantyStatus`, 3-state Active/Expiring/Expired), `frontend/src/types/settings.ts` (`WarrantySettings`), `frontend/src/services/settings-service.ts` + `settings-repository.ts` (per-category seed/merge), `frontend/src/pages/Settings/index.tsx` (new Warranty section, P-018), `frontend/src/pages/Assets/index.tsx` + `AssetDetail/index.tsx` (3-state badge). TC-WARRANTY-001-01 **PASS** (Warranty column/field displays `warrantyExpiry`). TC-WARRANTY-001-02 **PASS** (Active/Expiring/Expired badge correctly derived from `warrantyExpiry` + the asset's category's configured threshold, via `getWarrantyStatus()`). TC-WARRANTY-001-03 **PASS** — no longer BLOCKED: a category-specific threshold correctly flags an asset as Expiring, confirmed by automated test and live browser (setting IT Hardware to 5000 days flagged only IT Hardware assets Expiring, with an unrelated Mobile-category expired asset unaffected — no cross-category leakage). TC-WARRANTY-001-04 **PASS** (P-018 Settings > Warranty renders all 5 Asset Categories with a "90" default threshold input each). TC-WARRANTY-001-05 **PASS** (editing/saving one category's threshold recomputes only that category's assets; other categories unaffected). Verified via 151/151 automated tests (`tsc --noEmit`/lint clean) and live browser execution. **TC-WARRANTY-001-06 (non-admin access/write denial to P-018) formally executed 2026-09-01 and now PASS** — but only after a real defect was found and fixed first: the Settings route (`ROUTES.SETTINGS`) in `frontend/src/App.tsx` was **not actually gated to ADMIN**, sitting in the general authenticated-user route block instead of the existing `<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>` block that already gates Administration/User Management/Role Management. Fixed by moving the Settings route into that existing block — no new RBAC mechanism invented, this reuses the exact mechanism already confirmed elsewhere in the app (PRD §16 Resolved Question 38, UI-only/client-side MVP enforcement level, per `RAISE-NFR-SEC-RBAC-001`). Confirmed by 2 new tests in `frontend/src/App.rbac.test.tsx` (non-ADMIN `EMPLOYEE`-role user redirected to the Forbidden page at `/settings`; ADMIN user let through), full suite 153/153 (was 151), `tsc --noEmit`/lint both clean, and live browser verification (2026-09-01): an EMPLOYEE-role user sees the app's real "403 — Access denied" Forbidden page at `/settings`, an ADMIN-role user sees the real Settings page render. **Both PRD-content blockers this row previously carried (field list, Q15; Expiring-threshold shape, Q15b) are now fully resolved** — see Gap 7 (§6, resolved 2026-08-29) and Gap 12 (§6, opened and RESOLVED same-revision, v1.3, 2026-09-01). **The one remaining coverage gap (TC-WARRANTY-001-06 unexecuted) is now also closed** — see Gap 13 (§6, opened v1.3, RESOLVED this revision v1.4, 2026-09-01). Overall row status: **PASS** — no remaining PRD-content blocker and no remaining unexecuted test case for this requirement. |
| `RAISE-FR-ORACLE-001` | Oracle FA Integration + NBV/Depreciation | P0 / MVP | §6 Oracle FA Integration (incl. §6.4 "Phase 6" label note) | P-011 | AC-ORACLE-001 | TS-ORACLE-001 | TC-ORACLE-001-01..04 | **FAIL** — executed 2026-08-29 against the real running app, and the result is worse than the pre-existing BLOCKED status: the route the app maps to `RAISE-FR-ORACLE-001` (`/reconciliation`, labeled "Oracle FA Reconcile" in navigation) renders `ModulePage` — a generic, literal "foundation placeholder" `EmptyState` ("Oracle FA Reconciliation — foundation placeholder / Migrates from src/pages/Reconciliation.tsx once Oracle FA is connected in Phase 6."), confirmed via `frontend/src/pages/_shared/ModulePage.tsx` and real page text. TC-ORACLE-001-01 **FAILS even on its testable-now scope** — no "Asset Number", "Acquisition Information", "NBV", "Depreciation", "Oracle Source", or "Synchronization Status" field exists anywhere on this page (the closest analog, Asset Detail's own "Financial" section added for F-24, shows only Purchase Cost/Current Value/Purchase Date — no Oracle-specific fields at all). TC-ORACLE-001-02/-03/-04 **FAIL** — no "data unavailable"/"sync error"/"data conflict" state is rendered anywhere; the placeholder has no state logic at all. This is independent of, and does not wait on, the still-open integration-mechanism question (PRD §16 Q6–Q10, tracked as F-04) or the `ReconciliationPage` mapping question (Open Question 10a) — even presence-only testing of the four UI states fails, since no P-011 screen was actually built (a stub exists in its place). See `OPEN-FINDINGS.md` F-31 for this new build-gap finding (distinct from F-04's integration-mechanism gap). |
| `RAISE-FR-ALERT-001` | Alerts | P0 / MVP | §14 Alert Architecture | P-012 | AC-ALERT-001 | TS-ALERT-001 | TC-ALERT-001-01..02 | **PASS (partial) — Open Finding F-32 (no P-012 screen at all, route 404'd) RESOLVED 2026-09-01, per explicit business decision and now implemented.** Prior execution (2026-08-29) found `/notifications` rendered the app's generic 404 page, worse than the pre-existing BLOCKED status — see the superseded evidence retained in the Change Log (v1.1 → v1.2) for the historical record. **Business decision (2026-09-01):** scope the Alerts screen to derive its one alert-triggering condition from the one already confirmed elsewhere in the app — an asset's `warrantyExpiry` being in the past (the same `isWarrantyExpired` check the Assets list's Warranty column, `RAISE-FR-WARRANTY-001`, already uses) — no new field or data model. Severity is rendered honestly as "Not yet defined" rather than an invented High/Medium/Low, since severity mapping and trigger rules for any other condition remain undefined (PRD §6.9 Open Question, Open Finding F-05, **still genuinely open, not resolved by this fix**). **Implemented:** new `frontend/src/pages/Alerts/index.tsx`, registered at `ROUTES.NOTIFICATIONS` (`/notifications`) in `App.tsx` (previously had no route at all). `RAISE-ACCEPTANCE-CRITERIA.md` `AC-ALERT-001` was **not** modified — it already correctly scoped `AC-ALERT-001-01` as testable only for structural display (severity/description/asset present), separate from which severity/trigger-rule values are correct, so this implementation satisfies that existing scope without a spec correction first (unlike the F-22/F-27 pattern where the spec itself was wrong). **Formally executed 2026-09-01** against the real running app (`RAISE-TEST-CASES.md` v0.10): `/notifications` now renders 11 alert rows, matching the Dashboard's "Expired Warranty: 11" tile exactly. TC-ALERT-001-01 **PASS** — the row for AST-0013 (Dell OptiPlex 7090) displays Severity "Not yet defined," Description "Warranty expired 2024-03-15," and the associated Asset as a clickable link that navigated correctly to Asset Detail. TC-ALERT-001-02 **PASS** — confirmed the screen presents all 11 rows purely as an in-app table, with no Email/Teams/LINE or other delivery-channel UI anywhere on the page. Also covered by 2 new passing automated tests in `frontend/src/pages/Alerts/index.test.tsx`; full frontend suite 149/149 (was 147), `tsc --noEmit`/lint both clean. **What this closes, and what it explicitly does not close:** this resolves only the build-gap half of the finding (a real, evidence-based PASS on the testable-now, single-trigger-condition scope) — it does **not** resolve the separate, still-open severity/trigger-rule definition question (PRD §6.9 Open Question, F-05), and the "authorized user" gate remains untestable (PRD §16 Q22), both unaffected by this fix. See new Gap 11 (§6, RESOLVED — infrastructure/build-gap scope only). |
| `RAISE-FR-AUDIT-001` | Immutable Audit Log | P0 / MVP | §15 Audit Architecture | P-013 | AC-AUDIT-001 | TS-AUDIT-001 | TC-AUDIT-001-01..03 | **BLOCKED (partial)** — testable subset executed 2026-08-26 against the real running app, all **PASS**: TC-AUDIT-001-01 (checked in a real asset via the UI; confirmed via `auditService.listAuditLogs` that an entry was recorded with actor `"Demo Admin"`, action `"Asset checked in"`, entity `asset/a2`, and a real timestamp); TC-AUDIT-001-02 (no edit/delete control exists anywhere near a rendered audit entry, and neither `AuditRepository`/`MockAuditRepository` nor the backend router expose any update/delete method or route — verified by both UI inspection and code); TC-AUDIT-001-03 (the recorded entry is visible on Asset Detail's "Audit" tab to a logged-in user). Field taxonomy (Design §15) and role-gate correctness (PRD §16 Q22) remain BLOCKED — unchanged by this execution, since those require a PRD/Design answer, not more testing. |
| `RAISE-FR-EXEC-001` | Executive Dashboard | P0 / MVP | §13 Executive Intelligence (rewritten 2026-08-31 — "Logical Dashboard — Current MVP (As Built)") | P-014 (rewritten 2026-08-31 to match as-built) | AC-EXEC-001 (rewritten 2026-08-31: AC-EXEC-001-01/-02) | TS-EXEC-001 (corrected 2026-08-31) | TC-EXEC-001-01..02 (rewritten 2026-08-31) | **PASS** — re-executed 2026-08-31 against the real running app (`frontend/src/pages/Dashboard/index.tsx`, route `/dashboard`, page title literally "Executive Dashboard" — confirming P-014 and this route are the same entry point) after the F-22 spec correction. `TC-EXEC-001-01` **PASS** — all 8 KPI tiles present and confirmed via real page text: Total Assets (15), Available (4), Assigned (8), In Maintenance (2), Expired Warranty (11), Software Licenses (10), Monthly Depreciation ($42.8K, illustrative), Monthly Cost ($156.2K, illustrative). `TC-EXEC-001-02` **PASS** — all 10 sections present: AI Insights, AI Portfolio Health, Oracle FA Synced (Oracle FA Reconciliation), Asset Lifecycle, Department Distribution, Asset Status, Asset Type, Pending Approvals, Recent Activities, Maintenance Calendar. This closes Gap 8's re-execution item — see `OPEN-FINDINGS.md` F-22, now Resolved (R-13). The NBV/Risk absence sub-item (`AC-EXEC-001`'s narrative note, no numbered `-03` criterion) remains **BLOCKED (partial)**, tied to Open Finding F-03 (PRD §16 Q3–Q4, NBV/Risk formulas undefined) — unaffected by this re-execution, never claimed resolved. |
| `RAISE-AI-SEARCH-001` | Natural Language Search | P0 / MVP (Current AI) | §9 Natural Language Search, §8.2 AI Flow, §20 Error Handling | P-015 | AC-AI-SEARCH-001, AC-AI-STATES | TS-AI-SEARCH-001, TS-AI-STATES | TC-AI-SEARCH-001-01..03, TC-AI-STATES-01..05 | **`TS-AI-SEARCH-001` FAIL** — executed 2026-08-29 against the real running app, and the result is worse than the pre-existing BLOCKED status. Two distinct "AI" surfaces exist, neither matching P-015's spec: (1) the header "AI Assistant" drawer (`frontend/src/components/AppShell.tsx`) accepts **no input at all** — a static placeholder message only ("AI Assistant will connect to POST /api/v1/ai/chat once the AI module migration phase lands."), confirmed live via screenshot; (2) the Assets page's "Ask AI" box (`frontend/src/pages/Assets/index.tsx`'s `handleAISearch`) is a hardcoded keyword-to-filter matcher (e.g. "laptop"/"notebook" → `Type = Laptop`) ported from legacy ESAPS, predating this PRD/prototype — it narrows the existing Asset list, it does not return a natural-language "answer." TC-AI-SEARCH-001-01 **FAILS** — no genuine answer is ever returned by either surface. TC-AI-SEARCH-001-02 **FAILS** — no "Sources / Data Used" section exists anywhere. TC-AI-SEARCH-001-03 **FAILS** — submitting the PRD's exact illustrative question ("Which notebooks expire within 90 days?") to the Assets "Ask AI" box only interpreted it as `Type = Laptop` (keyword match on "notebook") and filtered the existing table, producing none of the required affected-asset count or Asset/Warranty/Age/Maintenance/Status columns. This is independent of the still-open citation-precision/format question (PRD §16 Q18, tracked as F-06) — even presence-only testing fails. See `OPEN-FINDINGS.md` F-33 for this build-gap finding (distinct from F-06). **`TS-AI-STATES` FAIL** — executed 2026-08-29 against the same two surfaces, same root cause. None of the 5 required literal state messages ("No matching assets were found.", "RAISE could not answer from the available data.", "Some source data is currently unavailable.", "Conflicting information was found. Please review the source records.") exist anywhere in `frontend/src` (confirmed by source grep). Live-verified: submitting a deliberately nonsense query ("asdkjqwiuey zzz nonsense query xyz") to the Assets "Ask AI" box produced "AI interpreted: No specific filters detected — showing all assets." — i.e. it falls back to showing everything rather than a "no match" state, since it is a keyword filter with no concept of "no data found." TC-AI-STATES-01 (Success) **FAILS** for the same reason as `TS-AI-SEARCH-001` (no genuine answer/relevant-data/source-context triple is ever shown together). TC-AI-STATES-02 (No-data) **FAILS** — no "no matching assets" message exists; a non-matching query just shows the unfiltered list. TC-AI-STATES-03 (Unable-to-answer), TC-AI-STATES-04 (Source-unavailable), and TC-AI-STATES-05 (Data-conflict) **FAIL** — none of these states can even be simulated, since there is no backend AI call to fail, no source-availability check, and no conflict-detection logic anywhere in either surface. Since both suites trace to the exact same two built surfaces and the same root cause (no real Q&A engine exists), this **broadens F-33** rather than opening a new finding — the same precedent already established by F-22 (Dashboard, two Prototype screens/one page). |
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
| `RAISE-NFR-SEC-RBAC-001` | Security & RBAC | PRD §11, §16 Resolved Question 38 (MVP enforcement level: UI-only/client-side, backend deferred to Roadmap — **verified present in `RAISE-PRD.md` v0.9 §11**) | §16 Security Architecture (incl. "MVP Enforcement Level" subsection) | P-001 | AC-LOGIN | TS-LOGIN | TC-LOGIN-01..03 | **PASS — F-30 (no Mock fallback for Auth) RESOLVED 2026-09-01, per explicit business decision and now implemented.** `TC-LOGIN-01`/`-02` move from their prior **BLOCKED** status (2026-08-29 — `auth-service.ts` had no mock fallback at all, so `login()` always hit the real, unreachable `go-template-main` backend, `ERR_CONNECTION_REFUSED`) to **PASS**. Fix: a new `frontend/src/services/auth-repository.ts` (`AuthRepository` interface, `MockAuthRepository`, `HttpAuthRepository`) mirrors the existing Mock/Http repository pattern already used by Asset/Employee/Ticket/Audit/Dashboard exactly; `auth-service.ts` was rewritten to select between them via a new `AUTH_API_ENABLED` flag (`config/featureFlags.ts`, default OFF, same convention as the other domains). Four demo accounts were created, one per Role (`types/auth.ts`: `EMPLOYEE`, `IT_STAFF`, `IT_MANAGER`, `ADMIN`) — `admin@raise.dev` / `manager@raise.dev` / `itstaff@raise.dev` / `employee@raise.dev`, all `demo1234`. TC-LOGIN-02 **PASS** — live-verified through the real Login page UI (`frontend/src/pages/Login/index.tsx`, not a localStorage bypass): submitting `wrong@raise.dev`/`wrongpass` showed "Invalid username or password" — this time confirmed as genuine credential rejection (`MockAuthRepository` checked the credential and rejected it), not a network failure masquerading as the same message, which is precisely the ambiguity that made this case BLOCKED before. TC-LOGIN-01 **PASS** — submitting `admin@raise.dev`/`demo1234` through the same real UI successfully logged in and landed on the Executive Dashboard as "Demo Admin" / `ADMIN` role. Also confirmed: new `frontend/src/services/auth-service.test.ts` (2 tests — TC-LOGIN-01 valid credentials across multiple roles, TC-LOGIN-02 invalid credentials rejected) both pass; full frontend suite now 147/147 passing (was 145, +2 for this change), `tsc --noEmit` and lint both clean. TC-LOGIN-03 **unaffected, still PASS** (unchanged from the 2026-08-29 execution — simulated non-admin `role: 'VIEWER'` correctly denied `/administration`, contrasted against an `ADMIN`-role user reaching the real page). **This closes F-30 (infrastructure/execution gap) only.** It explicitly does **not** resolve the separate, still-open PRD-content question — the authentication mechanism and role/permission matrix content (PRD §16 Q21–Q22) remain genuinely undefined; the four demo accounts are a testing convenience enabling dev-sandbox execution, not a confirmed production role/permission matrix. AC-LOGIN's own "NOT TESTABLE YET" note (mechanism/role content) is unchanged and still accurate — see new Gap 10 (§6). |
| Dashboard / Navigation | Main Dashboard | PRD §8 (KPI concepts only) | §13 Executive Intelligence (rewritten 2026-08-31 — "Logical Dashboard — Current MVP (As Built)") | P-002 (rewritten 2026-08-31 to match as-built) | AC-DASH (rewritten 2026-08-31: AC-DASH-01/-02, new AC-DASH-03) | TS-DASH (corrected 2026-08-31) | TC-DASH-01..03 (rewritten 2026-08-31) | **PASS (partial)** — re-executed 2026-08-31 against the real running app (same single page as `RAISE-FR-EXEC-001`/P-014 above — see that row for evidence). `TC-DASH-01` **PASS** (all 8 KPI tiles present) and `TC-DASH-02` **PASS** (all 10 sections present), both confirmed via real page text — identical evidence to `TC-EXEC-001-01`/`-02` since this is the same built page. This closes Gap 8's re-execution item — see `OPEN-FINDINGS.md` F-22, now Resolved (R-13). `TC-DASH-03` (NBV/Risk/Utilization tiles confirmed absent from the shipped grid) **PASS on the absence-check itself** — the three tiles are indeed absent, as expected — but remains **BLOCKED (partial)** for whether/when they should ever be added and under what formula/threshold (PRD §16 Q3–Q4, Open Finding F-03), unaffected by this re-execution. Utilization's definition remains separately resolved per PRD §16 Resolved Question 27 (unaffected). |

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
| Authentication | §16 (mechanism TBD) | Narrative on P-001 only | AC-LOGIN (existence only) | TS-LOGIN | TC-LOGIN-01/-02 | Covered only as a narrow slice of `RAISE-NFR-SEC-RBAC-001` above — no dedicated PRD Traceability ID of its own. `TC-LOGIN-01`/`-02` now execute and **PASS** (F-30 infrastructure gap resolved 2026-09-01 — `MockAuthRepository` + `AUTH_API_ENABLED` flag), but the *mechanism itself* (production auth model, not the demo Mock credentials used to exercise it) remains TBD — this row's "mechanism TBD" status is unchanged |
| Authorization / RBAC | §16 "MVP Enforcement Level" | Narrative on P-001/P-009 | AC-LOGIN, AC-OPS-002, AC-MAINT-001 (dependency notes) | TS-LOGIN, TS-OPS-002, TS-MAINT-001 | TC-LOGIN-03, TC-OPS-002-01, TC-MAINT-001-04..08 | Same row as `RAISE-NFR-SEC-RBAC-001` above (§4) — enforcement location only, role content TBD; unaffected by F-30's resolution, since `TC-LOGIN-03` was already PASS and does not depend on the Mock/Http auth fallback |
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

**Gap 7 (resolved 2026-08-29):** `RAISE-FR-WARRANTY-001`'s field list was
previously PRD §16 Open Question 15 (TBD), which left `AC-WARRANTY-001-01`
and `TC-WARRANTY-001-01`/`-02` BLOCKED (partial) and, upstream of that,
`RAISE-PROTOTYPE.md` P-010 asserting a stale illustrative "Start Date, End
Date, Status" three-field shape not confirmed anywhere. Resolved: Product/
Business confirmed, for MVP, the Warranty domain has exactly one field on
the Asset record — `warrantyExpiry` (already implemented on the Asset
record) — and explicitly **rejected**, not deferred, a draft 8-field
proposal (start date, provider/vendor, type, coverage details, cost, claim
contact, document reference). Verified re-read directly at every layer this
revision:

- `RAISE-PRD.md` §16 Resolved Question 40 (resolving Open Question 15).
- `RAISE-DESIGN.md` §5.2 (Warranty Domain) — resolved, `warrantyExpiry` only.
- `RAISE-PROTOTYPE.md` §14 (P-010) — field list corrected to `warrantyExpiry`
  only, stale three-field shape removed.
- `RAISE-ACCEPTANCE-CRITERIA.md` §13 (AC-WARRANTY-001) — AC-WARRANTY-001-01/
  -02 rewritten against `warrantyExpiry` and the UI-computed Warranty
  Timeline state derived from it; both now Testable (no longer BLOCKED).
- `RAISE-TEST-PLAN.md` §7/§8 (TS-WARRANTY-001) — field-list blocked-item
  wording corrected from "field list TBD" to "field list resolved."
- `RAISE-TEST-CASES.md` §12 (`TC-WARRANTY-001-01`/`-02`) — rewritten to test
  only `warrantyExpiry` and its derived timeline state; no longer BLOCKED.

**Originally left open, not part of Gap 7's closure (now resolved — see Gap
12 below):** `AC-WARRANTY-001-03` / `TC-WARRANTY-001-03`'s 90-day
expiry-window threshold remained **BLOCKED (partial)** as a separate,
unrelated question at the time Gap 7 closed — the PRD §6.7 figure was an
illustrative business example, not yet a confirmed, generalizable rule for
the expiring-assets view. This distinction was called out explicitly at
every layer above (AC §13, Test Plan §8, Test Cases §12) precisely so the
two blockers were not conflated. **This residual item is now closed as of
2026-09-01** — see new **Gap 12** below for the resolution record and
`RAISE-PRD.md` §16 Resolved Question 41 (resolving follow-on Open Question
15b) for the underlying business decision.

**Gap 8 (RESOLVED 2026-08-31 — spec corrected and re-execution now complete):**
the Dashboard/Navigation row (§4) and
`RAISE-FR-EXEC-001` (§3) previously carried real **FAIL**/**FAIL (partial)**
results — `TC-EXEC-001-01`/`-02` on 2026-08-26, `TC-DASH-01..03` on
2026-08-29 — because the app's actual shipped dashboard
(`frontend/src/pages/Dashboard/index.tsx`) had never matched the
Design §13 / Prototype P-002 & P-014 wireframe those test cases were written
against (an "Asset Overview"/"Executive Asset Intelligence" spec: NBV/Risk/
Utilization tiles; "Asset by Category"/"Lifecycle-Maintenance-Overview"/
"Recent Alerts"/"Executive Summary" sections). This was tracked as Open
Finding F-22 (`OPEN-FINDINGS.md`).

**What was actually done to close this:** per explicit business decision on
F-22 — fix the spec to match the shipped app, not the other way around — the
full chain was corrected on 2026-08-31, verified by direct re-read of each
document:

- `RAISE-DESIGN.md` §13 (v0.9) — rewritten with a "Status Note — Corrected
  2026-08-31 to Match As-Built (Open Finding F-22)" and a new "Logical
  Dashboard — Current MVP (As Built)" wireframe documenting the real 8-tile
  KPI grid and 10-section list; NBV/Risk/Utilization retained in a distinct
  "Proposal KPIs, Not Yet Implemented" subsection (not deleted).
- `RAISE-PROTOTYPE.md` P-002 (§8) and P-014 (§20) (v0.8) — both rewritten to
  document the identical shipped tile/section list, with an explicit note
  that P-002 and P-014 describe the same single built page (this was the
  root cause of the original drift — two prototype entries independently
  describing an unbuilt wireframe).
- `RAISE-ACCEPTANCE-CRITERIA.md` AC-DASH (§5) and AC-EXEC-001 (§17) (v0.7) —
  AC-DASH-01/-02 and AC-EXEC-001-01/-02 rewritten to test the actual 8-tile/
  10-section shipped page; a new `AC-DASH-03` (and an equivalent narrative
  note under AC-EXEC-001, not a numbered `-03`) documents NBV/Risk/
  Utilization absence as a separate, not-yet-scheduled enhancement.
- `RAISE-TEST-PLAN.md` TS-DASH and TS-EXEC-001 (§7, §8, §9) (v0.7) — updated
  to mark AC-DASH-01/-02 and AC-EXEC-001-01/-02 testable against the as-built
  page; **explicitly states this step reports no new execution result.**
- `RAISE-TEST-CASES.md` `TC-DASH-01..03` and `TC-EXEC-001-01..02` (v0.7) —
  rewritten to the corrected steps/expected results; **each carries its own
  "does not itself report a new PASS/FAIL execution result" statement**,
  deferring re-execution to a future sweep.

**What this closes, and what it explicitly does not close:**

1. **Closed:** the *specification* mismatch. Design/Prototype/AC/Test Plan/
   Test Cases now all describe the same real, shipped dashboard — no
   document in the chain still asserts an NBV/Risk/Utilization tile,
   "Asset Overview," "Executive Summary," or "Recent Alerts" section exists
   on the built page. The two independent, word-for-word-duplicated
   Prototype entries (P-002/P-014) that caused the original drift are now
   explicitly cross-referenced as describing one page, reducing the chance
   this class of drift recurs.
2. **Also now closed, as of a second sweep on 2026-08-31:** the prior FAIL
   results (`TC-EXEC-001-01`/`-02` on 2026-08-26, `TC-DASH-01..03` on
   2026-08-29) were **real, valid formal test executions run against the
   spec as it stood at the time** — correcting the spec did not retroactively
   make those runs pass, and did not by itself constitute a new passing run
   against the *corrected* spec. That is why this matrix's v0.7 revision
   correctly left both rows at `NOT_TESTED (re-derived after spec correction;
   execution pending)` rather than assuming PASS. **A fresh formal execution
   sweep against the corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02` has now
   been run (2026-08-31)** against the real running app
   (`frontend/src/pages/Dashboard/index.tsx`, route `/dashboard`, page title
   literally "Executive Dashboard," confirming P-002/P-014/this route are the
   same entry point). Result: `TC-DASH-01`/`TC-EXEC-001-01` **PASS** (all 8
   KPI tiles present and confirmed via real page text: Total Assets,
   Available, Assigned, In Maintenance, Expired Warranty, Software Licenses,
   Monthly Depreciation, Monthly Cost); `TC-DASH-02`/`TC-EXEC-001-02` **PASS**
   (all 10 sections present: AI Insights, AI Portfolio Health, Oracle FA
   Synced, Asset Lifecycle, Department Distribution, Asset Status, Asset
   Type, Pending Approvals, Recent Activities, Maintenance Calendar);
   `TC-DASH-03` **PASS on the absence-check itself** (NBV/Risk/Utilization
   tiles confirmed absent from the shipped grid, as expected). Both rows'
   Test Status are updated from `NOT_TESTED` to real, evidence-based `PASS`
   (§3/§4 above) — this is the condition Gap 6's own discipline requires
   before marking a row PASS: a real execution, not an assumption from the
   spec correction alone.
3. **Still genuinely BLOCKED, unaffected by this correction or this
   re-execution:** NBV/Risk tile presence/formula/threshold (`AC-DASH-03`,
   `AC-EXEC-001`'s NBV/Risk note) — tracked under the pre-existing Open
   Finding F-03 (PRD §16 Q3–Q4), not a new blocker introduced by this gap's
   closure work. Both rows therefore carry an overall **PASS (partial)**
   status where this sub-item is concerned (Dashboard/Navigation row, §4) or
   a **PASS** with an explicit unaffected-BLOCKED-note (`RAISE-FR-EXEC-001`
   row, §3) — see each row for the precise wording.

**No new Open Question is proposed here** — the business decision that
resolved the scope question was already made and documented (fix spec to
match app), and the remaining execution work is now complete. See
`OPEN-FINDINGS.md` F-22 (now Resolved, R-13) for the corresponding closure
record there (maintained separately, out of this document's scope).

**Gap 9 (RESOLVED 2026-09-01 — spec corrected, UI shipped, and execution
sweep complete, all in the same day):** `RAISE-FR-ASSET-002`'s Prototype/AC/
Test Plan/Test Cases previously described the P-005 "Category & Hierarchy"
sub-category tree only as an illustrative, unconfirmed example (Computer >
Notebook/Desktop, etc.) — `AC-ASSET-002-01` carried a "NOT TESTABLE YET"
note and no criterion existed for expand/drill-down behavior at all. This
was a genuine quality gap, not merely a missing ID: `RAISE-FR-ASSET-002` is
a P0/MVP requirement whose only prior test coverage (`TC-ASSET-002-01`) had
been formally scoped *down* to a flat category-to-assets grouping precisely
because the intended 2-level taxonomy was undefined — tracked as Open
Finding F-27.

**What was done to close the spec half:** per explicit business decision on
F-27 — confirm "sub-category" is not a new field/data model, it is the
existing Asset `type` field, and the hierarchy is exactly 2 levels
(Category → Type → individual assets) — the chain was corrected 2026-09-01,
verified by direct re-read of each document:

- `RAISE-PROTOTYPE.md` §11 (P-005, v0.9) — rewritten to show the real,
  currently-seeded Category → Type breakdown (IT Hardware →
  Laptop/Monitor/Headphones; Mobile → Smartphone/Tablet; Office Equipment →
  Printer/Projector; Infrastructure → Server/Router; Media Equipment →
  Camera) in place of the prior illustrative tree.
- `RAISE-ACCEPTANCE-CRITERIA.md` §8 (AC-ASSET-002, v0.8) — AC-ASSET-002-01
  rewritten to assert the real 2-level Category → Type hierarchy; a new
  **AC-ASSET-002-03** added for expand/drill-down behavior (Category node
  reveals Type sub-groups; Type node reveals individual assets). The prior
  "NOT TESTABLE YET" note is removed — AC-ASSET-002 is now marked Testable.
- `RAISE-TEST-PLAN.md` §7/§8/§9 (TS-ASSET-002, v0.8) — updated to record
  AC-ASSET-002 as fully testable, no longer blocked on the taxonomy
  question.
- `RAISE-TEST-CASES.md` §7 (TC-ASSET-002-01..03, v0.9) — `TC-ASSET-002-01`
  rewritten to assert the real Category → Type hierarchy and marked no
  longer BLOCKED; `TC-ASSET-002-02` unchanged; new `TC-ASSET-002-03` added,
  initially marked **BLOCKED (pending implementation)**, then formally
  executed and closed **PASS** the same day (2026-09-01) once the UI change
  shipped.

**What was then done to close the UI-implementation and execution-sweep
halves, same day (2026-09-01):**

- The "By Category" view (`frontend/src/pages/Assets/index.tsx`) was
  extended one level deeper: it now nests Category → Type → individual
  assets, matching the corrected P-005/AC-ASSET-002 spec exactly.
- A formal execution sweep was run against the real running app: navigated
  to `/assets`, opened "By Category," expanded "IT Hardware" — confirmed it
  reveals Type-level sub-groups only (Headphones: 1 asset, Laptop: 3 assets,
  Monitor: 2 assets), with no individual assets shown at that level;
  expanded "Laptop" — confirmed it reveals exactly its 3 individual assets
  (MacBook Pro 16" M3 / AST-0001, MacBook Air M2 / AST-0011, ThinkPad X1
  Carbon Gen 11 / AST-0012), none of Monitor's or Headphones' assets.
- `RAISE-TEST-CASES.md` v0.9 §7 records `TC-ASSET-002-01`, `-02`, and `-03`
  all **PASS** against this execution. 3 new/updated automated tests in
  `frontend/src/pages/Assets/index.test.tsx` all pass, the full frontend
  suite (145 tests) passes with no regressions, and `tsc --noEmit`/lint are
  both clean.
- `RAISE-TEST-PLAN.md` TS-ASSET-002 (§7/§8) updated to record the suite as
  "RESOLVED and CLOSED 2026-09-01," with no remaining blocked item.

**What this closes:**

1. **Closed:** the *specification* ambiguity. Every layer of the chain now
   agrees "sub-category" = the existing Asset `type` field, the hierarchy is
   exactly 2 levels, and the same real seeded Category → Type values are
   used consistently (Prototype, AC, Test Plan, Test Cases all cite the
   identical breakdown). No document still describes an invented,
   unconfirmed sub-category tree.
2. **Closed — UI implementation:** the shipped "By Category" view now nests
   Category → Type → individual assets, per the change and evidence above.
   `TC-ASSET-002-03` is no longer BLOCKED and is recorded **PASS** in
   `RAISE-TEST-CASES.md` v0.9.
3. **Closed — execution sweep on the corrected `TC-ASSET-002-01`:** rather
   than carrying forward the 2026-08-26 PASS earned against the *prior*,
   narrower flat-grouping spec, a fresh formal execution was run against the
   corrected Category → Type wording (evidence above) and confirmed **PASS**
   directly — consistent with the same discipline applied to Gap 6 and Gap 8
   (a spec correction alone never upgrades a Test Status; only a real
   execution against the corrected wording does). `RAISE-FR-ASSET-002`'s row
   (§3) is accordingly upgraded from **PASS (scoped)** to a full **PASS**.

**No new Open Question is proposed here** — the business decision that
resolved the sub-category question (F-27) was already made and documented,
and the UI-implementation/execution-sweep work that remained open in the
prior revision has now been completed and evidenced above, closing this gap
in full. `OPEN-FINDINGS.md` F-27's closure (to Resolved) is tracked and
handled separately, out of this document's scope.

**Gap 10 (RESOLVED 2026-09-01 — infrastructure gap only; a distinct
requirement-content question remains open):** `RAISE-NFR-SEC-RBAC-001`'s
`TC-LOGIN-01`/`-02` were BLOCKED as of the 2026-08-29 execution for an
infrastructure reason distinct from the requirement's own long-standing
PRD-content blocker — unlike every other domain (Asset/Employee/Ticket/
Audit/Dashboard), `auth-service.ts` had **no Mock repository fallback at
all**, so `login()` always called the real, unreachable `go-template-main`
backend, making the two test cases genuinely impossible to exercise in this
dev sandbox (no reachable Postgres, no `docker-compose`/`.env.example` for a
quick stand-up). Tracked as Open Finding F-30.

**What was done to close it:** per explicit business decision — add a
`MockAuthRepository` following the same Mock/Http repository pattern already
used by every other domain, gated by a feature flag defaulting OFF, same as
the others — the fix was implemented 2026-09-01:

- New `frontend/src/services/auth-repository.ts` — `AuthRepository`
  interface, `MockAuthRepository`, `HttpAuthRepository` — mirrors
  `asset-repository.ts`'s structure exactly.
- `frontend/src/services/auth-service.ts` rewritten to select between them
  via a new `AUTH_API_ENABLED` flag (`config/featureFlags.ts`, default OFF),
  mirroring `asset-service.ts`.
- Four demo accounts, one per Role (`types/auth.ts`: `EMPLOYEE`, `IT_STAFF`,
  `IT_MANAGER`, `ADMIN`) — `admin@raise.dev` / `manager@raise.dev` /
  `itstaff@raise.dev` / `employee@raise.dev`, all `demo1234`.
- New `frontend/src/services/auth-service.test.ts` (2 tests: TC-LOGIN-01
  valid credentials across multiple roles, TC-LOGIN-02 invalid credentials
  rejected), both passing. Full frontend suite 147/147 (was 145),
  `tsc --noEmit` and lint both clean.
- Live browser verification through the **real** Login page UI
  (`frontend/src/pages/Login/index.tsx`, not a localStorage bypass):
  `wrong@raise.dev`/`wrongpass` → "Invalid username or password," confirmed
  this time as genuine credential rejection, not a network failure
  masquerading as the same message (the exact ambiguity that made this case
  BLOCKED before); `admin@raise.dev`/`demo1234` → successful login, landed
  on the Executive Dashboard as "Demo Admin" / `ADMIN` role.

**What this closes, and what it explicitly does not close:**

1. **Closed:** the infrastructure/execution gap. `TC-LOGIN-01` and
   `TC-LOGIN-02` (§4, `RAISE-NFR-SEC-RBAC-001` row) move from `BLOCKED` to a
   real, evidence-based **PASS**. `TC-LOGIN-03` is unaffected, unchanged
   `PASS`.
2. **NOT closed — a genuinely separate, still-open question:** the
   authentication mechanism and role/permission matrix content (PRD §16
   Q21–Q22) remain undefined. `AC-LOGIN`'s own "NOT TESTABLE YET" note
   (`RAISE-ACCEPTANCE-CRITERIA.md` §4) is unchanged by this fix and is still
   accurate — it was never edited, because no source document for that
   half of the gap has been changed. The four demo accounts are a testing
   convenience that makes `MockAuthRepository`-backed execution possible;
   they are explicitly **not** a confirmed production role list or
   permission matrix, and this matrix does not treat them as one. No new
   Open Question is proposed here for the Q21/Q22 half — that question
   already has a documented, still-open vehicle (PRD §16 Q21–Q22, AC-LOGIN
   §4's own note) and remains correctly tracked there, not silently folded
   into F-30's closure.

`OPEN-FINDINGS.md` F-30's closure (to Resolved) is tracked and handled
separately, out of this document's scope.

**Gap 11 (opened and RESOLVED in the same revision, 2026-09-01 — build-gap
scope only; a distinct requirement-content question remains open):**
`RAISE-FR-ALERT-001`'s `TC-ALERT-001-01`/`-02` were **FAIL** as of the
2026-08-29 execution for a build-gap reason distinct from the requirement's
own long-standing severity/trigger-rule content blocker (PRD §6.9 Open
Question, F-05) — no P-012 Alerts screen existed at all, not even a stub;
the sidebar's "Notification Center" entry routed to `/notifications`, which
rendered the app's generic 404 page. Tracked as Open Finding F-32 (not
previously carried as a numbered Gap in this document, the same pattern as
F-30/Gap 10 before this revision).

**What was done to close it:** per explicit business decision — scope the
Alerts screen to derive its one alert-triggering condition from the one
already confirmed elsewhere in the app (an asset's `warrantyExpiry` being in
the past, the same `isWarrantyExpired` check `RAISE-FR-WARRANTY-001`'s
Warranty column already uses), with no new field/data model, and render
Severity honestly as "Not yet defined" rather than inventing a High/Medium/
Low mapping — the fix was implemented 2026-09-01:

- New `frontend/src/pages/Alerts/index.tsx`, registered at
  `ROUTES.NOTIFICATIONS` (`/notifications`) in `App.tsx`, replacing the
  generic-404 fallthrough with a real screen.
- `RAISE-ACCEPTANCE-CRITERIA.md` `AC-ALERT-001` was **not** modified —
  `AC-ALERT-001-01` already correctly scoped its criterion to structural
  display (severity/description/asset present) only, separate from which
  severity/trigger-rule values are correct, so the existing spec's scope is
  satisfied by this implementation without needing a prior spec correction
  (a different situation from Gap 8/F-22 and Gap 9/F-27, where the spec
  itself had to be corrected first).
- New `frontend/src/pages/Alerts/index.test.tsx` (2 tests, covering
  `TC-ALERT-001-01`/`-02`), both passing. Full frontend suite 149/149 (was
  147), `tsc --noEmit` and lint both clean.
- Live browser verification against the real running app: `/notifications`
  now renders 11 alert rows, matching the Dashboard's "Expired Warranty: 11"
  tile exactly; the row for AST-0013 (Dell OptiPlex 7090) shows Severity
  "Not yet defined," Description "Warranty expired 2024-03-15," and a
  clickable Asset link that correctly navigates to that asset's Asset
  Detail page; confirmed no Email/Teams/LINE delivery-channel UI exists
  anywhere on the page.

**What this closes, and what it explicitly does not close:**

1. **Closed:** the build-gap. `TC-ALERT-001-01` and `TC-ALERT-001-02` (§3,
   `RAISE-FR-ALERT-001` row) move from `FAIL` to a real, evidence-based
   **PASS**, scoped to the single confirmed trigger condition
   (warranty-expired).
2. **NOT closed — a genuinely separate, still-open question:** the
   severity/trigger-rule definition for any other alert condition (PRD §6.9
   Open Question, Open Finding F-05) remains undefined — "Not yet defined"
   is rendered honestly rather than an invented value, and this matrix does
   not treat it as resolved. The "authorized user" gate (PRD §16 Q22)
   likewise remains testable only structurally, unaffected by this fix. No
   new Open Question is proposed for the F-05 half — it already has a
   documented, still-open vehicle (PRD §6.9, AC-ALERT-001's own scoping
   note) and remains correctly tracked there, not silently folded into
   F-32's closure.

`OPEN-FINDINGS.md` F-32's closure (to Resolved) is tracked and handled
separately, out of this document's scope.

**Gap 12 (opened and RESOLVED in the same revision, 2026-09-01 — a genuine
requirement-content resolution, not a build/infrastructure-only fix like
Gaps 9–11):** `RAISE-FR-WARRANTY-001`'s Expiring-threshold question, left
explicitly open at Gap 7's closure (2026-08-29) as PRD §16 Open Question
15b (follow-on from Resolved Question 40, which settled the field list but
not the threshold value/shape), is now resolved. `TC-WARRANTY-001-03` had
carried **BLOCKED (partial)** status since the 90-day figure in PRD §6.7 was
only an illustrative business example, not a confirmed generalizable rule.

**What was done to close it:** per explicit confirmed business decision,
2026-09-01 — the Expiring threshold is **per-Asset-Category configurable**,
not a single global constant, defaulting to 90 days for all 5 current Asset
Categories (IT Hardware, Mobile, Office Equipment, Infrastructure, Media
Equipment), admin-adjustable via a new **P-018 Settings** screen. Verified
propagated end-to-end at every layer this revision:

- `RAISE-PRD.md` v0.12, §16 Resolved Question 41 (resolving Open Question
  15b).
- `RAISE-DESIGN.md` v0.10, §5.2 (Warranty Domain, rewritten to a 3-state
  Active/Expiring/Expired model driven by the configurable threshold) and
  new §5.4 (Settings Domain) / §4.1B (Settings component).
- `RAISE-PROTOTYPE.md` v0.10, P-010 (rewritten) and new §23A (P-018 Settings
  screen).
- `RAISE-ACCEPTANCE-CRITERIA.md` v0.9, §13 — `AC-WARRANTY-001-03` rewritten
  to test the category-specific threshold directly; new
  `AC-WARRANTY-001-04` (P-018 shows all 5 categories, defaulting to 90) and
  `AC-WARRANTY-001-05` (per-category edits do not leak across categories).
- `RAISE-TEST-PLAN.md` v0.9, §7/§8 — TS-WARRANTY-001 fully unblocked, no
  remaining blocked item for the threshold question.
- `RAISE-TEST-CASES.md` v0.11, §12 — `TC-WARRANTY-001-03` rewritten and
  formally executed, **PASS**; new `TC-WARRANTY-001-04`/`-05` added and
  formally executed, both **PASS**.
- Implementation and live verification: `frontend/src/lib/warranty.ts`
  (`getWarrantyStatus`), `frontend/src/types/settings.ts`
  (`WarrantySettings`), `frontend/src/services/settings-service.ts` +
  `settings-repository.ts`, `frontend/src/pages/Settings/index.tsx`,
  `frontend/src/pages/Assets/index.tsx` + `AssetDetail/index.tsx`. 151/151
  automated tests pass, `tsc --noEmit`/lint clean. Live browser: Settings >
  Warranty renders all 5 categories at default 90; editing IT Hardware to
  5000 and saving correctly flags only IT Hardware assets as Expiring on
  both Assets list and Asset Detail, while an unrelated Mobile-category
  expired asset stays Expired (no cross-category leakage).

**What this closes, and what it explicitly does not close:**

1. **Closed:** the Expiring-threshold shape/value question (PRD Open
   Question 15b / Resolved Question 41). `TC-WARRANTY-001-03` moves from
   `BLOCKED (partial)` to a real, evidence-based **PASS**.
2. **Closed as a side effect, tracked separately for clarity:** the new
   P-018 Settings screen introduces a new admin-only access-control
   criterion, `AC-WARRANTY-001-06` / `TC-WARRANTY-001-06`. This is **not**
   part of Gap 12's resolution — it is a newly *introduced* test case (not a
   pre-existing blocker being resolved), and it has not yet been formally
   executed. Tracked as its own, still-open item — see **Gap 13** below.
   Conflating the two would overstate this row's coverage.

`OPEN-FINDINGS.md` update (closing the underlying finding, if one was
tracked for PRD Open Question 15b) is handled separately, out of this
document's scope.

**Gap 13 (opened v1.3, 2026-09-01 — RESOLVED v1.4, 2026-09-01, a real
coverage gap that, once executed, turned out to be a real defect, not just
an unexecuted-but-already-correct behavior):** `TC-WARRANTY-001-06`
(non-admin access/write to the new P-018 Settings screen is denied) was
written and fully specified in `RAISE-TEST-CASES.md` v0.11 §12 but had
**not yet been formally executed** against the real running app or in an
automated test targeting P-018 specifically. Unlike Gap 12 (opened and
resolved in the same v1.3 revision), this gap was deliberately left open at
v1.3 pending a genuine execution sweep — this record shows why that
discipline mattered.

**What the execution sweep found (2026-09-01):** running `TC-WARRANTY-001-06`
against the real app surfaced an actual RBAC-gating defect, not merely
confirmation of already-correct behavior. The Settings route
(`ROUTES.SETTINGS`) in `frontend/src/App.tsx` was **not gated to ADMIN at
all** — it was declared in the general authenticated-user route block
instead of the existing `<Route element={<ProtectedRoute
allowedRoles={['ADMIN']} />}>` block that already gates
Administration/User Management/Role Management. Any authenticated user of
any Role (including `EMPLOYEE`) could reach `/settings` and edit Warranty
thresholds before the fix.

**What was done to close it:** the Settings route was moved into the
existing ADMIN-gated `<ProtectedRoute allowedRoles={['ADMIN']} />` block in
`frontend/src/App.tsx` — **no new RBAC mechanism was invented**; this
reuses the exact mechanism already confirmed elsewhere in the app (PRD §16
Resolved Question 38, UI-only/client-side MVP enforcement level, per
`RAISE-NFR-SEC-RBAC-001`). Verified:

- 2 new tests in `frontend/src/App.rbac.test.tsx`:
  `'TC-WARRANTY-001-06: redirects a non-ADMIN authenticated user away from
  Settings'` (an `EMPLOYEE`-role user navigating to `/settings` is
  redirected to the Forbidden page, not the Settings page) and
  `'TC-WARRANTY-001-06: allows an ADMIN user through to Settings'` — both
  pass.
- Full frontend suite 153/153 (was 151, +2), `tsc --noEmit` clean, `npm run
  lint` clean.
- Live browser verification (2026-09-01): an `EMPLOYEE`-role user navigating
  to `/settings` sees the app's real "403 — Access denied" Forbidden page;
  an `ADMIN`-role user navigating to `/settings` sees the real Settings page
  render correctly.
- `RAISE-TEST-CASES.md` v0.12, §12 — `TC-WARRANTY-001-06` updated to record
  this formal execution and root-cause-fix, **PASS**.

**What this closes, and what it explicitly does not close:** this closes
the coverage gap for `TC-WARRANTY-001-06` and, as a direct consequence,
fixes a real production-facing RBAC defect on the Settings screen — it does
**not** reopen or touch the requirement-content question already closed by
Gap 12 (the Expiring-threshold shape/value itself), and it does **not**
resolve the separate, still-open authentication-mechanism / role-permission
matrix content question (PRD §16 Q21–Q22), which remains genuinely open and
unaffected by this fix. `RAISE-FR-WARRANTY-001`'s row (§3) moves from `PASS
(partial)` to a full, unqualified **PASS** — `TC-WARRANTY-001-01` through
`-06` all now PASS.

`OPEN-FINDINGS.md` update (recording this as a newly-found-and-fixed defect,
if tracked there) is handled separately, out of this document's scope.

**Gap 14 (opened and RESOLVED in the same revision, 2026-09-01, v1.5 — a
genuine requirement-content resolution, not a build/infrastructure fix like
Gaps 9–11/13, and not a new-defect find like Gap 13):** `RAISE-FR-OPS-002`'s
workflow shape and permission gate, and `RAISE-FR-ASSET-003`'s holder data
model, were previously PRD §16 Open Questions 11, 12, and 13 — the
underlying questions behind Open Finding F-02 (`OPEN-FINDINGS.md`).
`RAISE-FR-OPS-002`'s row already carried a real, evidence-based **PASS**
(executed 2026-08-28), but its Test Status note carried a stale caveat
("appropriate permission/role-correctness remains untestable, PRD §16 Q22")
that conflated OPS-002's own now-resolved permission gate with the
genuinely-still-open general role/permission-matrix-content question for
other domains. `RAISE-FR-ASSET-003`'s row had no note at all on the holder
data model, since the question had not been resolved when that row was last
updated.

**What was done to close it:** per explicit confirmed business decision,
2026-09-01 — all three recommended options chosen, each matching the app's
already-built behavior exactly, no new code required — the chain was
resolved and propagated end-to-end, verified by direct re-read of each
document this revision:

- `RAISE-PRD.md` v0.13, §16 Resolved Question 42 (resolving Open Questions
  11, 12, and 13): (a) **Workflow (Q11)** — Check-in/Check-out is an
  immediate state-change operation, no approval/exception-handling step;
  (b) **Permission (Q12)** — any authenticated user, no role restriction,
  matching the already-confirmed MVP RBAC enforcement level (§16 Resolved
  Question 38) — explicitly scoped to **this one gate only**, not the
  broader Q21–Q22 role/permission-matrix-content question (Open Finding
  F-08); (c) **Holder data model (Q13)** — a direct 1:1 link to an Employee
  record (`Asset.assignedEmployeeId`/`assignedTo`), no additional
  organizational relationship model needed for MVP.
- `RAISE-DESIGN.md` v0.11, §4.2 — resolution recorded, matching PRD §16
  Resolved Question 42 exactly.
- `RAISE-PROTOTYPE.md` v0.12, P-008 (§14) and P-006 (§10 area) — rewritten
  to state the confirmed workflow/permission/holder-model rules. **Note:** a
  v0.11 draft of this document briefly and incorrectly over-resolved a
  related-but-separate question — whether Check-in/Check-out is the
  *exclusive* writer of Custody History — as if PRD §16 Resolved Question 42
  had settled it too. This was caught and corrected in v0.12, which
  explicitly restores that question to open, tracked as **Open Finding
  F-10** (distinct from F-02, and distinct from Gap 4's own record of the
  same underlying question below). This matrix does not repeat that error:
  F-10/Gap 4 are treated as genuinely open throughout this revision.
- `RAISE-ACCEPTANCE-CRITERIA.md` v0.10, §11 — `AC-OPS-002-01`/`-02`
  rewritten to test the confirmed rule directly (any authenticated user;
  immediate state change, no approval step); `AC-OPS-002` moved from
  "Partially testable" to fully testable in the AC index (§3).
- `RAISE-TEST-PLAN.md` v0.10, §7/§8/§9 — `TS-OPS-002` fully unblocked, no
  remaining blocked item for the workflow/permission questions.
- `RAISE-TEST-CASES.md` v0.13, §10 — `TC-OPS-002-01`/`-02`'s Blocked-column
  wording updated to cite the resolution; `TC-OPS-002-03` unaffected (was
  already fully testable). **Explicitly, no new test execution was run**:
  the existing 2026-08-28 formal execution (an authenticated user performed
  Assign/Check-in with no role gate blocking them, because none was ever
  implemented or tested against) already exercised exactly the
  now-confirmed rule — this is a scope/spec correction to the Blocked-column
  wording only, not a report of a new PASS/FAIL result.

**What this closes, and what it explicitly does not close:**

1. **Closed:** the workflow-shape and permission-gate questions for
   `RAISE-FR-OPS-002` (PRD Open Questions 11, 12) and the holder-data-model
   question for `RAISE-FR-ASSET-003` (PRD Open Question 13). Both rows' Test
   Status notes (§3) are updated to record this resolution; **neither row's
   PASS verdict itself changes** — both were already `PASS` (executed
   2026-08-28), and this resolution retroactively confirms that execution
   already covered the newly-settled scope, rather than producing a new
   execution result.
2. **NOT closed — a genuinely separate, still-open question:** whether
   Check-in/Check-out is the *exclusive* writer of Custody History (Open
   Finding F-10, tracked at Gap 4, §6). PRD §16 Resolved Question 42 covers
   only workflow shape, permission gate, and holder data model — it does
   **not** decide which operations may write to Custody History. `Gap 4`
   above is unchanged by this closure and remains open exactly as before.
3. **NOT closed — a genuinely separate, still-open question:** the general
   `RAISE-NFR-SEC-RBAC-001` role list / permission-matrix content for other
   domains (PRD §16 Q21–Q22, Open Finding F-08). Resolved Question 42
   explicitly scopes its permission-gate answer to Check-in/Check-out's own
   gate only — it is not read anywhere in this chain as answering Q21–Q22
   generally, and this matrix does not treat it as such.

`OPEN-FINDINGS.md` F-02's closure (to Resolved) is tracked and handled
separately, out of this document's scope.

**Gap 15 (opened 2026-09-02, v1.6 — RESOLVED 2026-09-02, v1.7, same day but a
later revision, not the same-revision pattern used for Gaps 12/14):**
`RAISE-FR-OPS-002`'s Check-in/Check-out
workflow, resolved as a uniform immediate-state-change rule at Gap 14
(2026-09-01, PRD §16 Resolved Question 42), is **narrowed for one category**
by a new business decision, 2026-09-02, PRD §16 Resolved Question 43: a real
Singer Thailand company form ("ใบดำเนินการเกี่ยวกับคอมพิวเตอร์และอุปกรณ์",
IT Equipment Processing Form, Version 2024, branch Retail9972 ไทวัสดุ ภูเก็ต)
supplied by the business user during a live session showed a genuine
4-signature approval process exists in practice for IT equipment handovers —
a fact not visible in the source material behind Resolved Question 42.
Confirmed: this applies **only** to assigning (Check-out) an asset in the
**IT Hardware** category — Check-in (all categories) and Check-out of every
other category remain exactly as Resolved Question 42 confirmed.

**Why this is a genuinely different case from every other same-day
resolution in this document (Gaps 9, 12, 13, 14):** those were either (a) a
pure requirement-content/spec correction matching already-built,
already-tested behavior exactly (Gap 14, Gap 12's threshold-value half), or
(b) a small, already-scoped UI change shipped and formally executed the same
day (Gap 9's Type-level nesting, Gap 13's ADMIN-route fix). This is neither:
it is a **brand-new 4-stage approval feature with zero code written yet** —
new pending/confirmed/processed/approved states, two new role-gated queues
(`IT_STAFF` IT Processing Queue, `IT_MANAGER` IT Supervisor Approval Queue),
a new "My Pending Assignments" employee-facing surface, and a 4-stage
progress indicator (reused pattern from `RAISE-FR-MAINT-001`'s
`GovernanceStep`, but not yet wired to this new state model). Marking this
row's new scope PASS, or closing this gap same-revision, would overstate
readiness in exactly the way this document's own standing discipline
(Gap 6/8/9's "a spec correction alone never upgrades a Test Status; only a
real execution does") forbids. **Historical note, superseded by the
Resolution subsection below:** this gap was correctly left open at v1.6
opening for exactly the reasons above (zero code existed). It was later
resolved in v1.7, same day, once real backend code was actually written and
`TC-OPS-002-04..09` were formally re-executed against it — a genuinely
later revision producing real evidence, not a re-labeling of this v1.6
snapshot.

**What has been done, verified by direct re-read of every document in the
chain this revision:**

- `RAISE-PRD.md` v0.14, §16 Resolved Question 43 (narrowing Resolved
  Question 42, not reopening or reversing it) — the 4-stage digital workflow
  (Initiation → Recipient Confirmation → IT Processing → IT Supervisor
  Approval), state model, and role gates (`IT_STAFF`/`IT_MANAGER`, no new
  Role) are specified; §6 (`RAISE-FR-OPS-002` Acceptance Criteria/
  Dependencies/Source Reference/Open Question), §11 (Security & RBAC note),
  and §17 (Traceability Matrix row) updated to match.
- `RAISE-DESIGN.md` v0.12, §4.2, new "IT Hardware Assignment Approval
  Workflow — Category-Scoped Exception" subsection.
- `RAISE-PROTOTYPE.md` v0.13, P-008 (§14), new subsection — explicitly notes
  no recipient-decline path is defined, and flags an open design point on
  Custody History write-timing across the 4 stages.
- `RAISE-ACCEPTANCE-CRITERIA.md` v0.11, §11 — six new criteria
  `AC-OPS-002-04..09` (Stage 1 pending-state entry, Stage 2 Recipient
  Confirmation, Stage 3 IT Processing, Stage 4 IT Supervisor Approval as the
  sole status-flipping action, Stage 3/4 rejection returning to Available
  terminal, and a regression-guard criterion confirming non-IT-Hardware
  categories are unaffected). Two Stage-2 sub-points (recipient-decline path;
  e-signature/acknowledgment-text capture) explicitly marked NOT TESTABLE
  YET, tracked via the PRD's own `## NEEDS_PRD_CONFIRMATION` note rather than
  invented.
- `RAISE-TEST-PLAN.md` v0.11 — `TS-OPS-002` removed from the "no blocked
  items" group and marked Partial: `AC-OPS-002-01..03` remain fully testable
  and already-PASSing; `AC-OPS-002-04..09` are blocked **on implementation**
  (a different blocking category from every other row in that section, which
  waits on a business/product decision, not on code being written).
- `RAISE-TEST-CASES.md` v0.14, §10 — six new test cases `TC-OPS-002-04..09`
  added 1:1 against the six new criteria, **each explicitly marked BLOCKED
  (pending implementation)** — fully specified, none executed, since no code
  exists yet.

**What this closes, and what it explicitly does not close:**

1. **RESOLVED 2026-09-02 (this revision, v1.7):** implementation of the
   4-stage workflow's backend/state-machine core. The 4-stage workflow has
   now been implemented in `go-template-main` (see the Resolution subsection
   below for the full record) and `TC-OPS-002-04..09` have been formally
   re-executed end-to-end against the real running Docker stack and recorded
   **PASS** in `RAISE-TEST-CASES.md` v0.15. `RAISE-FR-OPS-002`'s row (§3) is
   accordingly upgraded from `PASS (partial)` back to **PASS on the
   testable-now scope**. **Not fully closed by this resolution, and
   correctly not claimed as such:** the frontend UI for this workflow
   (a distinct, not-yet-started follow-up) and backend enforcement of the
   `IT_STAFF`/`IT_MANAGER` role gates (consistent with this codebase's
   existing project-wide UI-only RBAC MVP decision, not a gap specific to
   this feature) — both are recorded as explicit scope boundaries in the
   Resolution subsection below, not silently folded into this PASS.
2. **Not closed — genuinely open, tracked via the PRD's own
   `## NEEDS_PRD_CONFIRMATION` mechanism, not invented here:** whether the
   recipient's Confirm Receipt action (Stage 2) should also capture an
   e-signature or legal-acknowledgment text, matching the underlying physical
   form. No criterion, test case, or this matrix's row assumes an answer
   either way.
3. **Not closed — a new design-phase question, distinct from Open Finding
   F-10 (Gap 4):** at which of the 4 stages `RAISE-FR-ASSET-003` Custody
   History is actually written (only at final approval, or at each stage
   transition) is explicitly not defined by Resolved Question 43. This does
   **not** touch or resolve Gap 4/F-10 (whether Check-in/Check-out is the
   *exclusive* writer of Custody History), which remains open and unaffected.
4. **NOT closed — also unaffected and out of scope for this gap:** the
   general `RAISE-NFR-SEC-RBAC-001` role/permission-matrix-content question
   for other domains (PRD §16 Q21–Q22, Open Finding F-08) — Resolved
   Question 43 reuses the existing, already-confirmed `IT_STAFF`/`IT_MANAGER`
   roles (no new Role introduced) and does not touch that broader question.

**Gap 15 — Resolution (2026-09-02, v1.7):** real code has now been written
and a formal execution sweep against `TC-OPS-002-04..09` has recorded real
PASS results — the condition this gap's own closure rule (above) required.

- **Implementation:** new `go-template-main` files
  `model/assetHandoverModel.go`, `repository/assetHandoverPGRepository.go`,
  `repository/assetHandoverRepository.go`, `service/assetHandoverService.go`,
  `controller/assetHandoverController.go`,
  `sql/pg/V5__AssetHandovers_Table.sql`; new routes `GET /handovers`,
  `GET /handovers/:code`, `POST /assets/:id/handover`,
  `POST /handovers/:code/confirm`, `POST /handovers/:code/process`,
  `POST /handovers/:code/decision`. `AssetService.AssignAsset` now branches
  on Asset Category `"IT Hardware"`, returning HTTP 409 with a `nextStep`
  hint into the new handover flow; every other category continues to assign
  immediately, unchanged (regression-verified via `TC-OPS-002-09`).
- **Test evidence:** `RAISE-TEST-CASES.md` v0.15, §10 — `TC-OPS-002-04`
  through `TC-OPS-002-09` (all six) rewritten from **BLOCKED (pending
  implementation)** to **PASS**, formally re-executed end-to-end against the
  real running Docker stack (backend + Postgres): Stage 1 Initiate (no early
  status flip, TC-OPS-002-04), Stage 2 Recipient Confirmation with
  recipient-identity validation (TC-OPS-002-05), Stage 3 IT Processing
  (TC-OPS-002-06), Stage 4 IT Supervisor Approval as the sole
  status-flipping action (TC-OPS-002-07), terminal rejection at both Stage 3
  and Stage 4 confirmed non-reopenable (TC-OPS-002-08), and the
  non-IT-Hardware regression guard (TC-OPS-002-09). Corroborated by 18 new
  Go unit tests (`service/assetHandoverService_test.go`, all passing) and a
  clean full `go build`/`go vet`/`go test` sweep.
- **§3 row updated:** `RAISE-FR-OPS-002`'s Test Status is upgraded from
  `PASS (partial)` to **PASS on the testable-now scope** (see the row itself
  for the full evidence list and the explicit scope-boundary list below).
- **What this closes:** item 1 above only — the "zero code written yet"
  implementation gap. **What this explicitly does NOT close** (items 2–4
  above, all unchanged and still genuinely open): the Stage-2 e-signature/
  acknowledgment-text-capture question (PRD's own
  `## NEEDS_PRD_CONFIRMATION` note — the user dismissed rather than answered
  this question this session, so it remains untouched, not resolved by
  omission); the Stage-2 recipient-decline path (never asked, not
  implemented); the Custody History write-timing question across the 4
  stages (`RAISE-DESIGN.md` §4.2's own flagged open design point, distinct
  from and not resolving Open Finding F-10 / Gap 4); and the general
  `RAISE-NFR-SEC-RBAC-001` role/permission-matrix-content question (PRD §16
  Q21–Q22, Open Finding F-08).
- **Two additional scope boundaries, new to this resolution, correctly not
  claimed as closed by it:** (a) this execution is **backend/API-level
  only** — no frontend UI exists yet for "My Pending Assignments"/
  `IT_STAFF` queue/`IT_MANAGER` queue, a distinct, not-yet-started
  follow-up; (b) `IT_STAFF`/`IT_MANAGER` role gates were confirmed present
  in the state machine but **not** verified as backend-enforced, consistent
  with this codebase's existing project-wide MVP decision that RBAC is
  UI-only/client-side (PRD §16 Resolved Question 38) — not a gap specific to
  this feature, and not newly introduced by this resolution.

**Gap 15 is RESOLVED as of this revision (v1.7).** `OPEN-FINDINGS.md` update
(recording this closure, if tracked there) is handled separately, out of
this document's scope.

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
- **`RAISE-FR-WARRANTY-001` field list — thread walked end-to-end 2026-08-29
  (retained for history):** PRD §16 Resolved Question 40 (resolving Open
  Question 15) → Design §5.2 → Prototype §14 (P-010) → AC §13
  (AC-WARRANTY-001-01/-02, now Testable) → Test Plan §7/§8 (TS-WARRANTY-001,
  field-list blocker resolved) → Test Cases §12 (`TC-WARRANTY-001-01`/`-02`,
  rewritten to `warrantyExpiry`-only, no longer BLOCKED). Every layer agrees
  the Warranty domain has exactly one MVP field, `warrantyExpiry`, and that
  the draft 8-field proposal was rejected, not deferred — no stale reference
  to the old three-field ("Start Date, End Date, Status") shape remains
  anywhere in the chain. Thread confirmed complete. See Gap 7 (§6) for the
  full closure record.
- **`RAISE-FR-WARRANTY-001` Expiring-threshold configurability — thread
  walked end-to-end this revision (2026-09-01):** PRD §16 Resolved Question
  41 (resolving follow-on Open Question 15b) → Design §5.2 (rewritten to a
  3-state Active/Expiring/Expired model driven by a configurable threshold)
  and new §5.4 (Settings Domain) → Prototype P-010 (rewritten) and new §23A
  (P-018 Settings screen) → AC §13 (`AC-WARRANTY-001-03` rewritten;
  new `AC-WARRANTY-001-04`/`-05`/`-06`) → Test Plan §7/§8 (TS-WARRANTY-001
  fully unblocked, no remaining blocked item) → Test Cases §12
  (`TC-WARRANTY-001-03` rewritten; new `TC-WARRANTY-001-04`/`-05`/`-06`).
  Every layer agrees the threshold is per-Asset-Category configurable,
  defaulting to 90 days for all 5 current categories, admin-adjustable via
  P-018 — no layer still asserts a single global constant. A formal
  execution sweep against the real running app and 151/151 passing
  automated tests confirmed `TC-WARRANTY-001-01` through `-05`
  **PASS**. Thread confirmed complete for the threshold-configurability half
  (Gap 12, §6, RESOLVED v1.3).
- **`RAISE-FR-WARRANTY-001` / P-018 access-gate execution (`TC-WARRANTY-001-06`)
  — thread walked this revision (2026-09-01, v1.4):** `RAISE-TEST-CASES.md`
  v0.12 §12 (`TC-WARRANTY-001-06` formally executed, **PASS**, root-cause
  fix recorded) → `frontend/src/App.tsx` (Settings route moved into the
  existing `<ProtectedRoute allowedRoles={['ADMIN']} />` block that already
  gates Administration/User Management/Role Management) →
  `frontend/src/App.rbac.test.tsx` (2 new tests, both pass) → live browser
  verification (EMPLOYEE-role user denied at `/settings` via the real
  Forbidden page; ADMIN-role user let through). This thread was
  deliberately left incomplete at v1.3 (Gap 13, opened) precisely because no
  execution record existed yet; it is now complete, and the execution
  surfaced a genuine defect (Settings was not actually ADMIN-gated before
  this fix) rather than merely re-confirming already-correct behavior — see
  Gap 13, §6, RESOLVED, for the full record. `RAISE-FR-WARRANTY-001`'s row
  (§3) now carries a full, unqualified **PASS**.
- **`RAISE-FR-EXEC-001` / Dashboard-Navigation spec correction — thread
  walked end-to-end this revision (2026-08-31):** Open Finding F-22 →
  `RAISE-DESIGN.md` §13 (v0.9, "Logical Dashboard — Current MVP (As Built)")
  → `RAISE-PROTOTYPE.md` P-002 (§8) / P-014 (§20) (v0.8, both rewritten to
  the identical as-built tile/section list, cross-referencing each other as
  the same built page) → `RAISE-ACCEPTANCE-CRITERIA.md` AC-DASH (§5) /
  AC-EXEC-001 (§17) (v0.7, AC-DASH-01/-02 and AC-EXEC-001-01/-02 rewritten,
  new `AC-DASH-03` added) → `RAISE-TEST-PLAN.md` TS-DASH / TS-EXEC-001 (v0.7,
  §7/§8/§9) → `RAISE-TEST-CASES.md` `TC-DASH-01..03` / `TC-EXEC-001-01..02`
  (v0.7, §4/§16). Every layer now describes the identical 8-tile/10-section
  shipped page; no layer still asserts the old NBV/Risk/Utilization/"Asset
  Overview"/"Recent Alerts" wireframe. Test Plan item 5 of its v0.6→v0.7
  change log, and both Test Cases Status Notes (§4, §16), correctly stated no
  new PASS/FAIL execution result was being reported by the spec-correction
  step alone — this matrix's v0.7 revision accordingly re-derived §3/§4 to
  `NOT_TESTED (re-derived after spec correction; execution pending)`, not
  assumed PASS. **A fresh formal execution sweep was then run 2026-08-31**
  against the real running app (`frontend/src/pages/Dashboard/index.tsx`,
  route `/dashboard`), confirming `TC-DASH-01..02`/`TC-EXEC-001-01..02`
  **PASS** and `TC-DASH-03` **PASS on the absence-check itself** (with the
  NBV/Risk formula sub-item still correctly BLOCKED per F-03, unaffected).
  §3/§4 rows updated from `NOT_TESTED` to real, evidence-based `PASS`/`PASS
  (partial)` accordingly. Thread confirmed complete end-to-end, including the
  execution-sweep portion (Gap 8, §6, now fully resolved).
- **`RAISE-FR-ASSET-002` Category/Type sub-taxonomy — thread walked
  end-to-end this revision (2026-09-01):** Open Finding F-27 →
  `RAISE-PROTOTYPE.md` §11 (P-005, v0.9, real Category → Type breakdown
  replacing the illustrative tree) → `RAISE-ACCEPTANCE-CRITERIA.md` §8
  (AC-ASSET-002, v0.8, AC-ASSET-002-01 rewritten, new AC-ASSET-002-03 added,
  "NOT TESTABLE YET" note removed) → `RAISE-TEST-PLAN.md` §7/§8/§9
  (TS-ASSET-002, v0.8, "RESOLVED and CLOSED 2026-09-01," no longer blocked
  on the taxonomy question, no remaining blocked item) →
  `RAISE-TEST-CASES.md` §7 (`TC-ASSET-002-01` rewritten and unblocked,
  `TC-ASSET-002-02` unchanged, new `TC-ASSET-002-03` added — all three now
  v0.9, all three formally executed against the real running app 2026-09-01
  and confirmed **PASS**). Every layer now agrees "sub-category" = the
  existing Asset `type` field and the hierarchy is exactly 2 levels
  (Category → Type → individual assets), using the identical real seeded
  breakdown. The spec-correction step itself carried an explicit "no new
  PASS/FAIL execution result reported" note (per the same discipline applied
  to the Gap 6/Gap 8 threads above); a separate, subsequent formal execution
  sweep — navigating to `/assets`, expanding "IT Hardware" (Type sub-groups
  Headphones/Laptop/Monitor revealed, no individual assets at that level),
  then expanding "Laptop" (exactly its 3 assets revealed: AST-0001, AST-0011,
  AST-0012) — was then run the same day and did report a real PASS for all
  three test cases, corroborated by 3 passing automated tests in
  `frontend/src/pages/Assets/index.test.tsx` and a clean full 145-test
  frontend suite. Thread confirmed complete end-to-end — the
  spec-correction, UI-implementation, and execution-sweep halves are all
  closed (Gap 9, §6, RESOLVED).
- **`RAISE-NFR-SEC-RBAC-001` / F-30 Mock-fallback infrastructure gap —
  thread walked this revision (2026-09-01):** Open Finding F-30 →
  `frontend/src/services/auth-repository.ts` (new, mirrors
  `asset-repository.ts`) → `frontend/src/services/auth-service.ts`
  (rewritten to select Mock/Http via `AUTH_API_ENABLED`, mirrors
  `asset-service.ts`) → `frontend/src/services/auth-service.test.ts` (new,
  2 tests, both pass) → live execution against the real Login page UI
  (`frontend/src/pages/Login/index.tsx`). This is an infrastructure/
  execution-layer fix, not a spec-content change — `RAISE-PRD.md`,
  `RAISE-ACCEPTANCE-CRITERIA.md` (`AC-LOGIN`), and `RAISE-TEST-CASES.md`
  (`TC-LOGIN-01..03`) were **not** edited for this fix, and correctly were
  not: `AC-LOGIN`'s "NOT TESTABLE YET" note already scoped `AC-LOGIN-01/-02`
  to *existence* of a success/error path only, not to any specific
  mechanism — exactly what is now exercisable and PASS. No layer invents a
  role list, permission matrix, or production auth mechanism; the four demo
  accounts remain a testing convenience, correctly not elevated to
  confirmed requirement content anywhere in this thread. Thread confirmed
  complete — infrastructure half closed (Gap 10, §6, RESOLVED); the
  requirement-content half (PRD §16 Q21–Q22) is a genuinely separate,
  still-open thread, unaffected and not claimed closed here.
- **`RAISE-FR-ALERT-001` / F-32 build-gap — thread walked this revision
  (2026-09-01):** Open Finding F-32 → `frontend/src/pages/Alerts/index.tsx`
  (new) → `App.tsx` (`ROUTES.NOTIFICATIONS` now registered, replacing the
  generic-404 fallthrough) → `frontend/src/pages/Alerts/index.test.tsx`
  (new, 2 tests, both pass) → live execution against the real running app
  (`/notifications`) → `RAISE-TEST-CASES.md` v0.10 (`TC-ALERT-001-01`/`-02`
  rewritten with formal 2026-09-01 execution evidence, both PASS). This is a
  build/infrastructure fix scoped to one confirmed trigger condition
  (warranty-expired, reusing `RAISE-FR-WARRANTY-001`'s existing
  `isWarrantyExpired` check), not a spec-content change —
  `RAISE-ACCEPTANCE-CRITERIA.md` (`AC-ALERT-001`) was correctly **not**
  edited, since `AC-ALERT-001-01`'s existing scope (structural display only,
  severity/trigger-rule correctness explicitly out of scope) already covers
  what was implemented. No layer invents a severity taxonomy or
  general-purpose trigger-rule set; Severity is rendered as "Not yet
  defined," and PRD §6.9's Open Question / Open Finding F-05 remain
  correctly tracked as still-open, not folded into this closure. Thread
  confirmed complete — build-gap half closed (Gap 11, §6, RESOLVED); the
  severity/trigger-rule content half (F-05) is a genuinely separate,
  still-open thread, unaffected and not claimed closed here.
- **`RAISE-FR-OPS-002` / `RAISE-FR-ASSET-003` — Open Finding F-02 (PRD §16
  Open Questions 11–13) — thread walked this revision (2026-09-01, v1.5):**
  `RAISE-PRD.md` v0.13 §16 Resolved Question 42 → `RAISE-DESIGN.md` v0.11
  §4.2 → `RAISE-PROTOTYPE.md` v0.12 P-008/P-006 (v0.11's brief, incorrect
  over-resolution of the separate Custody-History-exclusivity question,
  Open Finding F-10, caught and corrected in v0.12, restoring F-10 to
  genuinely open) → `RAISE-ACCEPTANCE-CRITERIA.md` v0.10 §11
  (`AC-OPS-002-01`/`-02` rewritten, `AC-OPS-002` fully testable) →
  `RAISE-TEST-PLAN.md` v0.10 §7/§8/§9 (`TS-OPS-002` fully unblocked) →
  `RAISE-TEST-CASES.md` v0.13 §10 (`TC-OPS-002-01`/`-02` Blocked-column
  wording updated, no new execution claimed; `TC-OPS-002-03` unaffected).
  Every layer agrees: (a) Check-in/Check-out is an immediate state-change
  operation with no approval/exception-handling step; (b) the permission
  gate is any authenticated user, no role restriction, scoped explicitly to
  this one gate and not PRD §16 Q21–Q22 (Open Finding F-08); (c)
  `RAISE-FR-ASSET-003`'s holder data model is a direct 1:1 link to an
  Employee record. No layer treats this as resolving Open Finding F-10
  (Custody-History write-path exclusivity, tracked separately at Gap 4) or
  F-08 (general RBAC role/permission-matrix content) — both remain
  genuinely open and are carried forward unchanged. The existing
  `TC-OPS-002-01..03` PASS result (2026-08-28) already covers the
  newly-confirmed scope; no new code was written and no new test execution
  was performed. Thread confirmed complete (Gap 14, §6, opened and RESOLVED
  same revision, v1.5).
- **`RAISE-FR-OPS-002` — IT Hardware Assignment Approval Workflow, PRD §16
  Resolved Question 43 (narrowing Resolved Question 42) — thread walked this
  revision (2026-09-02, v1.6):** `RAISE-PRD.md` v0.14 §16 Resolved Question
  43 → `RAISE-DESIGN.md` v0.12 §4.2 (new "IT Hardware Assignment Approval
  Workflow — Category-Scoped Exception" subsection) →
  `RAISE-PROTOTYPE.md` v0.13 P-008 (§14, new subsection; explicitly flags no
  recipient-decline path and an open Custody-History write-timing design
  point) → `RAISE-ACCEPTANCE-CRITERIA.md` v0.11 §11 (six new criteria
  `AC-OPS-002-04..09`, two Stage-2 sub-points explicitly marked NOT TESTABLE
  YET) → `RAISE-TEST-PLAN.md` v0.11 (`TS-OPS-002` removed from the "no
  blocked items" group, marked Partial, blocked on implementation) →
  `RAISE-TEST-CASES.md` v0.14 §10 (six new cases `TC-OPS-002-04..09`, each
  explicitly **BLOCKED (pending implementation)**). Every layer agrees on
  the same 4-stage shape, state model, and role gates, and — critically —
  every layer agrees **no implementation exists yet (at v1.6 opening)**: no
  document in this thread claims or implies a PASS for the new scope at that
  point. This matrix's own §3 row mirrored that exactly at v1.6: general-rule
  PASS unchanged, new-scope status downgraded to **PASS (partial)** overall,
  with `AC-OPS-002-04..09` / `TC-OPS-002-04..09` carried as BLOCKED (pending
  implementation), not PASS and not silently omitted. Thread confirmed
  complete and consistent at v1.6 — **deliberately left open as a gap**
  (Gap 15, opened v1.6) at that point, since the underlying implementation
  work, not just the spec sync, remained outstanding. **Superseded by the
  bullet immediately below, this same revision (v1.7).**
- **`RAISE-FR-OPS-002` / IT Hardware Assignment Approval Workflow — Gap 15
  RESOLVED, thread walked this revision (2026-09-02, v1.7):** the upstream
  five documents (`RAISE-PRD.md` v0.14, `RAISE-DESIGN.md` v0.12,
  `RAISE-PROTOTYPE.md` v0.13, `RAISE-ACCEPTANCE-CRITERIA.md` v0.11,
  `RAISE-TEST-PLAN.md` v0.11) are **unchanged** from v1.6 — this closure is
  produced entirely by real implementation (`go-template-main`, new files
  and routes listed in the `RAISE-FR-OPS-002` row and Gap 15's Resolution
  subsection, §6) plus a formal test-execution update to
  `RAISE-TEST-CASES.md` v0.15 §10, which rewrites `TC-OPS-002-04..09` from
  BLOCKED (pending implementation) to **PASS**, each citing specific,
  re-checked behavior (Stage 1 no-early-flip; Stage 2
  recipient-identity-validated confirmation; Stage 3 forwarding; Stage 4
  sole status-flip; Stage 3/4 terminal rejection; non-IT-Hardware
  regression guard), corroborated by 18 new passing Go unit tests and a
  clean `go build`/`go vet`/`go test` sweep. This matrix's own §3 row now
  mirrors that exactly: **PASS on the testable-now scope**, with the two
  scope boundaries this execution does not cover (no frontend UI yet;
  role gates not backend-enforced, consistent with the project-wide
  UI-only RBAC MVP decision) recorded explicitly, not silently folded into
  the PASS. No document in this thread claims or implies the two Stage-2
  sub-points (e-signature/acknowledgment-text capture; recipient-decline
  path) or the Custody-History write-timing question are resolved by this
  closure — all three remain genuinely open and are carried forward
  unchanged. Thread confirmed complete — **Gap 15 is now RESOLVED** (§6).
- Full re-walk confirmed no other Test Status cell in §3/§4 has drifted from
  the current text of `RAISE-TEST-CASES.md` v0.15 (cross-checked TC-by-TC):
  `RAISE-FR-ASSET-001`, `RAISE-FR-ORACLE-001`, `RAISE-FR-AUDIT-001`,
  `RAISE-AI-SEARCH-001`, `RAISE-FR-LIFE-001`,
  `RAISE-AI-DOC-001..004` all match their respective TC Blocked-column text
  exactly (`RAISE-FR-OPS-002`/`RAISE-FR-ASSET-003` are checked separately
  immediately above, given this revision's substantive change to those
  rows; `RAISE-FR-WARRANTY-001` was checked separately in the v1.4 revision,
  unchanged this pass; `RAISE-FR-EXEC-001` and the Dashboard/Navigation row
  were checked separately in a prior revision; `RAISE-FR-ASSET-002` and
  `RAISE-NFR-SEC-RBAC-001` were checked separately in prior revisions;
  `RAISE-FR-ALERT-001` was checked separately in a prior revision, unchanged
  this pass).

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
- **Resolved this revision (2026-08-31), Gap 8:** `RAISE-FR-EXEC-001` and the
  Dashboard/Navigation row now have a fully-corrected, internally consistent
  spec end-to-end (Design/Prototype/AC/Test Plan/Test Cases), **and** a fresh
  formal execution sweep has been run against it (2026-08-31, against the
  real running app) confirming `TC-DASH-01..02`/`TC-EXEC-001-01..02` **PASS**
  and `TC-DASH-03` **PASS on the absence-check itself**. Compliance Review
  may treat both rows' KPI-grid/section-list coverage as a confirmed `PASS`
  — this is a real, evidence-based execution result, not an assumption from
  the spec correction alone. The NBV/Risk formula sub-item remains
  **BLOCKED (partial)**, tied to the separate, still-open Open Finding F-03
  — Compliance Review should not treat that narrower sub-item as resolved by
  this sweep. See Gap 8, §6.
- **Resolved this revision (2026-09-01), Gap 9:** `RAISE-FR-ASSET-002`'s
  Category/Type sub-taxonomy spec question (Open Finding F-27) is now fully
  resolved end-to-end. The "By Category" view (`frontend/src/pages/Assets/
  index.tsx`) was extended to nest Category → Type → individual assets, and
  a fresh formal execution sweep was run against the real running app
  2026-09-01, confirming `TC-ASSET-002-01`, `-02`, and `-03` **PASS**
  (evidence: `RAISE-FR-ASSET-002` row, §3), corroborated by 3 passing
  automated tests and a clean full 145-test frontend suite. Compliance
  Review may treat this requirement's Category/Type hierarchy coverage as a
  confirmed `PASS` — this is a real, evidence-based execution result, not an
  assumption from the spec correction alone. See Gap 9, §6, RESOLVED.
- **Resolved this revision (2026-09-01), Gap 10:** `RAISE-NFR-SEC-RBAC-001`'s
  infrastructure blocker (Open Finding F-30 — no Mock fallback for Auth) is
  now resolved. `TC-LOGIN-01`/`-02` were formally re-executed through the
  real Login page UI and confirmed **PASS**, alongside 2 new passing
  automated tests (`auth-service.test.ts`) and a clean 147/147 full frontend
  suite. Compliance Review may treat this requirement's success/error-state
  existence coverage as a confirmed `PASS`. **Compliance Review must not**,
  however, treat this as resolving the authentication mechanism or role/
  permission matrix content (PRD §16 Q21–Q22) — that remains a genuinely
  open, separate requirement-content question; `AC-LOGIN`'s "NOT TESTABLE
  YET" note on mechanism/role content is unchanged. See Gap 10, §6.
- **Resolved this revision (2026-09-01), Gap 11:** `RAISE-FR-ALERT-001`'s
  build-gap (Open Finding F-32 — no P-012 screen at all, route 404'd) is now
  resolved. `TC-ALERT-001-01`/`-02` were formally executed against the real
  running app (new `frontend/src/pages/Alerts/index.tsx`, registered at
  `/notifications`) and confirmed **PASS**, alongside 2 new passing
  automated tests and a clean 149/149 full frontend suite. Compliance
  Review may treat this requirement's structural display and in-app-only
  presentation coverage as a confirmed `PASS`, scoped to the single
  confirmed trigger condition (warranty-expired). **Compliance Review must
  not**, however, treat this as resolving the severity/trigger-rule
  definition for any other alert condition (PRD §6.9 Open Question, Open
  Finding F-05) — that remains a genuinely open, separate
  requirement-content question; `AC-ALERT-001`'s own scoping note (structural
  display testable, specific severity/trigger-rule values not) is unchanged.
  See Gap 11, §6.
- **Resolved this revision (2026-09-01), Gap 12:** `RAISE-FR-WARRANTY-001`'s
  Expiring-threshold shape/value question (PRD §16 Open Question 15b) is now
  resolved — the threshold is per-Asset-Category configurable, defaulting to
  90 days for all 5 categories, admin-adjustable via new P-018 Settings.
  `TC-WARRANTY-001-03/-04/-05` were formally executed and confirmed **PASS**,
  corroborated by 151/151 passing automated tests and a live browser sweep
  confirming no cross-category leakage. Compliance Review may treat this
  requirement's Warranty-state and P-018 threshold-configuration coverage as
  a confirmed `PASS`. See Gap 12, §6.
- **Resolved this revision (2026-09-01), Gap 13:** `TC-WARRANTY-001-06`
  (non-admin access/write denial to the new P-018 Settings screen) has now
  been formally executed and confirmed **PASS**, per `RAISE-TEST-CASES.md`
  v0.12. The execution sweep found and fixed a real defect first — the
  Settings route in `frontend/src/App.tsx` was not actually gated to ADMIN
  — before recording the PASS; the fix reuses the existing ADMIN-gating
  mechanism already confirmed elsewhere in the app, no new mechanism was
  invented. Compliance Review may now treat `RAISE-FR-WARRANTY-001`'s row
  as a full, unqualified `PASS` — `TC-WARRANTY-001-01` through `-06` all
  PASS, no remaining coverage gap and no remaining PRD-content blocker for
  this requirement. **Compliance Review should note**, for the record, that
  this defect existed in the shipped app until this execution sweep caught
  it — a concrete example of why unexecuted-but-specified test cases must
  not be treated as equivalent to a passing result. See Gap 13, §6.
- **Resolved this revision (2026-09-01), Gap 14:** `RAISE-FR-OPS-002`'s
  workflow shape and permission gate, and `RAISE-FR-ASSET-003`'s holder data
  model (PRD §16 Open Questions 11–13, Open Finding F-02) are now resolved:
  immediate state-change operation, no role restriction beyond
  authentication, direct 1:1 Employee link. **No new code was written and no
  new test execution was performed** — the existing `TC-OPS-002-01..03`
  PASS result (2026-08-28) already covers the newly-confirmed scope.
  Compliance Review may treat both rows' Test Status notes as accurate and
  current. **Compliance Review must not**, however, treat this as resolving
  the separate, still-open Custody-History write-path exclusivity question
  (Open Finding F-10, Gap 4) or the general RBAC role/permission-matrix
  content question for other domains (PRD §16 Q21–Q22, Open Finding F-08) —
  both remain genuinely open and unaffected. See Gap 14, §6.
- **Resolved this revision (2026-09-02), Gap 15:** `RAISE-FR-OPS-002`'s new
  IT Hardware Assignment Approval Workflow (PRD §16 Resolved Question 43,
  narrowing Resolved Question 42 for the IT Hardware category only) is now
  implemented in `go-template-main` and formally executed. `TC-OPS-002-04`
  through `TC-OPS-002-09` were formally re-executed end-to-end against the
  real running Docker stack (backend + Postgres) and confirmed **PASS**,
  per `RAISE-TEST-CASES.md` v0.15, corroborated by 18 new passing Go unit
  tests and a clean `go build`/`go vet`/`go test` sweep. Compliance Review
  may treat `RAISE-FR-OPS-002`'s row as **PASS on the testable-now scope**
  — the general Check-in/Check-out rule and the new IT Hardware workflow's
  4-stage state machine, terminal-rejection behavior, and non-IT-Hardware
  regression guard are all real, evidence-based PASS. **Compliance Review
  must not**, however, treat this as: (a) confirmation of a frontend UI for
  this workflow — none exists yet, a distinct, not-yet-started follow-up;
  (b) confirmation that the `IT_STAFF`/`IT_MANAGER` role gates are
  backend-enforced — they are not, consistent with this codebase's
  project-wide UI-only/client-side RBAC MVP decision (PRD §16 Resolved
  Question 38), not a gap specific to this feature; (c) resolution of the
  separate, still-open recipient-decline-path / e-signature-capture
  sub-points (tracked via the PRD's own `## NEEDS_PRD_CONFIRMATION` note,
  untouched — the user dismissed rather than answered this question this
  session); or (d) resolution of the Custody-History write-timing question
  across the 4 stages (a design-phase question, distinct from and not
  resolving Open Finding F-10 / Gap 4). See Gap 15, §6, RESOLVED.

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
- [x] **Gap 8 (§6) is fully RESOLVED as of this revision** —
      `RAISE-FR-EXEC-001`/Dashboard-Navigation spec correction (Open Finding
      F-22) verified propagated through Design §13 / Prototype P-002 & P-014
      / AC AC-DASH & AC-EXEC-001 / Test Plan TS-DASH & TS-EXEC-001 / Test
      Cases TC-DASH-01..03 & TC-EXEC-001-01..02 (all dated 2026-08-31), **and**
      a fresh formal execution sweep against the corrected test cases was run
      2026-08-31 against the real running app, confirming PASS — both the
      spec-correction half and the execution half are now closed
- [x] **Gap 9 (§6) is fully RESOLVED this revision** —
      `RAISE-FR-ASSET-002`'s Category/Type sub-taxonomy (Open Finding F-27)
      verified propagated through Prototype P-005 (v0.9) / AC AC-ASSET-002
      (v0.8) / Test Plan TS-ASSET-002 (v0.8, "RESOLVED and CLOSED") / Test
      Cases TC-ASSET-002-01..03 (v0.9, all dated 2026-09-01) — **all three**
      sub-items are now closed: the spec correction, the UI implementation
      (Type-level nesting shipped in the "By Category" view), and the
      execution sweep (`TC-ASSET-002-01`, `-02`, `-03` all formally executed
      against the real running app and confirmed PASS, corroborated by 3
      passing automated tests and a clean full 145-test frontend suite)
- [x] **Gap 10 (§6) is RESOLVED this revision** — Open Finding F-30 (no
      Mock fallback for Auth) is closed: `MockAuthRepository` +
      `AUTH_API_ENABLED` flag implemented, mirroring every other domain's
      Mock/Http pattern; `TC-LOGIN-01`/`-02` formally re-executed through
      the real Login page UI and confirmed PASS, corroborated by 2 new
      passing automated tests and a clean 147/147 full frontend suite.
      **Explicitly not resolved by this**, and correctly not claimed as
      such: the authentication mechanism / role-permission matrix content
      (PRD §16 Q21–Q22) — remains genuinely open, tracked separately
- [x] **Gap 11 (§6) is RESOLVED this revision** — Open Finding F-32 (no
      P-012 Alerts screen at all, route 404'd) is closed: new
      `frontend/src/pages/Alerts/index.tsx` registered at
      `ROUTES.NOTIFICATIONS`, scoped to the one confirmed trigger condition
      (warranty-expired, reusing `RAISE-FR-WARRANTY-001`'s existing
      `isWarrantyExpired` check); `TC-ALERT-001-01`/`-02` formally executed
      against the real running app and confirmed PASS, corroborated by 2 new
      passing automated tests and a clean 149/149 full frontend suite.
      **Explicitly not resolved by this**, and correctly not claimed as
      such: the severity/trigger-rule definition for any other alert
      condition (PRD §6.9 Open Question, Open Finding F-05) — remains
      genuinely open, tracked separately
- [x] **Gap 12 (§6) is RESOLVED this revision** — PRD §16 Open Question 15b
      (`RAISE-FR-WARRANTY-001`'s Expiring-threshold shape/value) is closed:
      per-Asset-Category configurable threshold, defaulting to 90 days,
      admin-adjustable via new P-018 Settings; `TC-WARRANTY-001-03/-04/-05`
      formally executed against the real running app and confirmed PASS,
      corroborated by 151/151 passing automated tests and a live
      cross-category-leakage check. **Explicitly not part of this
      closure** and correctly not claimed as such: `TC-WARRANTY-001-06`'s
      execution status — see Gap 13.
- [x] **Gap 13 (§6) is RESOLVED this revision (opened v1.3, closed v1.4)** —
      `TC-WARRANTY-001-06` (non-admin denial to P-018 Settings) has been
      formally executed and confirmed **PASS**, per `RAISE-TEST-CASES.md`
      v0.12. The execution sweep found and fixed a real defect first — the
      Settings route in `frontend/src/App.tsx` was not gated to ADMIN before
      this fix — reusing the existing ADMIN-gating mechanism, not inventing
      a new one. `RAISE-FR-WARRANTY-001`'s row (§3) is now a full,
      unqualified `PASS`.
- [x] **Gap 14 (§6) is opened and RESOLVED in this same revision (v1.5)** —
      PRD §16 Open Questions 11–13 (`RAISE-FR-OPS-002` workflow shape and
      permission gate; `RAISE-FR-ASSET-003` holder data model), the
      underlying questions behind Open Finding F-02, are closed via PRD §16
      Resolved Question 42: immediate state-change operation, any
      authenticated user, direct 1:1 Employee link — matching already-built,
      already-tested behavior. No new code was written and no new test
      execution was performed; the existing `TC-OPS-002-01..03` PASS result
      (2026-08-28) already covers the newly-confirmed scope. **Explicitly
      not resolved**, and correctly not claimed as such: Open Finding F-10
      (Custody-History write-path exclusivity, Gap 4) and Open Finding F-08
      (general RBAC role/permission-matrix content, PRD §16 Q21–Q22) —
      both remain genuinely open, tracked separately
- [x] **Gap 15 (§6) is RESOLVED this revision (v1.7, opened v1.6, resolved
      v1.7, same day)** — `RAISE-FR-OPS-002`'s new IT Hardware Assignment
      Approval Workflow (PRD §16 Resolved Question 43, narrowing Resolved
      Question 42) is now implemented in `go-template-main` (new
      model/repository/service/controller/SQL migration files, new
      `/handovers` routes, `AssetService.AssignAsset` branching on Category
      "IT Hardware") and formally re-executed end-to-end against the real
      running Docker stack (backend + Postgres). `TC-OPS-002-04..09` all move
      from BLOCKED (pending implementation) to **PASS** in
      `RAISE-TEST-CASES.md` v0.15, corroborated by 18 new passing Go unit
      tests. `RAISE-FR-OPS-002`'s row (§3) is upgraded from `PASS (partial)`
      to **PASS on the testable-now scope**. **Explicitly not resolved by
      this**, and correctly not claimed as such: frontend UI for the
      workflow (not yet started), backend role-gate enforcement (consistent
      with this codebase's project-wide UI-only RBAC MVP decision), the two
      Stage-2 sub-points (e-signature capture; recipient-decline path), and
      the Custody-History write-timing question — all remain genuinely open,
      tracked separately (§6, Gap 15's Resolution subsection)
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

**Gaps 1–15 are all resolved** — Gap 15 (opened v1.6, 2026-09-02) is now
**RESOLVED this revision (v1.7, same day)**, see below. Gaps 1–13 are
re-confirmed with no drift this revision except where noted, and **Gap 14
(opened and RESOLVED in the v1.5
revision, unchanged this pass)** — see below for the closure record, the same
"opened-and-closed-same-revision" pattern used for Gap 12, distinct from
Gap 13's "opened in one revision, closed in a later one" pattern.
**Gap 8
is fully resolved** — both the spec-correction half and the formal
execution-sweep half are done (see Gap 8, §6, and the `RAISE-FR-EXEC-001`/
Dashboard-Navigation rows in §3/§4). **Gap 9 is fully resolved** —
`RAISE-FR-ASSET-002`'s Category/Type sub-taxonomy spec question
(Open Finding F-27) is closed at the Prototype/AC/Test Plan/Test Cases
layer, the UI code change (Type-level nesting in the "By Category" view) has
shipped, and a fresh formal execution sweep against `TC-ASSET-002-01`/`-02`/
`-03` confirmed PASS (see Gap 9, §6, and the `RAISE-FR-ASSET-002` row in
§3). **Gap 10 is now resolved this revision** —
`RAISE-NFR-SEC-RBAC-001`'s infrastructure blocker (Open Finding F-30 — no
Mock fallback for Auth) is closed: a `MockAuthRepository` + `AUTH_API_ENABLED`
flag now let `TC-LOGIN-01`/`-02` execute against the real Login page UI,
confirmed PASS (see Gap 10, §6, and the `RAISE-NFR-SEC-RBAC-001` row in §4).
This closes only the infrastructure half — the requirement-content half
(auth mechanism / role-permission matrix, PRD §16 Q21–Q22) remains open and
is carried forward in item 1 below, unchanged in scope. **Gap 11 is now
resolved this revision** — `RAISE-FR-ALERT-001`'s build-gap (Open Finding
F-32 — no P-012 screen at all, route 404'd) is closed: a new Alerts screen
(`frontend/src/pages/Alerts/index.tsx`, registered at `/notifications`)
scoped to the one confirmed trigger condition (warranty-expired) now lets
`TC-ALERT-001-01`/`-02` execute against the real running app, confirmed
PASS (see Gap 11, §6, and the `RAISE-FR-ALERT-001` row in §3). This closes
only the build-gap half — the requirement-content half (severity/
trigger-rule definition for any other condition, PRD §6.9 Open Question,
Open Finding F-05) remains open and is carried forward in item 1 below,
unchanged in scope. **Gap 12 is opened and resolved in this same
revision** — `RAISE-FR-WARRANTY-001`'s Expiring-threshold shape/value
question (PRD §16 Open Question 15b) is closed: the threshold is confirmed
per-Asset-Category configurable, defaulting to 90 days for all 5 categories,
admin-adjustable via new P-018 Settings; `TC-WARRANTY-001-03/-04/-05`
execute against the real running app and confirmed PASS (see Gap 12, §6,
and the `RAISE-FR-WARRANTY-001` row in §3). **Gap 13, opened in v1.3, is now
RESOLVED in this revision (v1.4)** — `TC-WARRANTY-001-06` (non-admin denial
to the new P-018 Settings screen) has been formally executed and confirmed
PASS; the execution sweep found and fixed a real RBAC-gating defect first
(the Settings route in `frontend/src/App.tsx` was not gated to ADMIN),
reusing the existing ADMIN-gating mechanism rather than inventing a new one
(see Gap 13, §6, and the `RAISE-FR-WARRANTY-001` row in §3). This closes the
last open item for `RAISE-FR-WARRANTY-001`; the row now carries a full,
unqualified PASS. **Gap 14 is opened and resolved in this same revision
(v1.5)** — `RAISE-FR-OPS-002`'s workflow shape and permission gate, and
`RAISE-FR-ASSET-003`'s holder data model (PRD §16 Open Questions 11–13,
Open Finding F-02) are closed via PRD §16 Resolved Question 42: immediate
state-change operation, any authenticated user (no role restriction),
direct 1:1 Employee link — all matching already-built, already-tested
behavior. **No new code was written and no new test execution was
performed**; the existing `TC-OPS-002-01..03` PASS result (2026-08-28)
already covers the newly-confirmed scope (see Gap 14, §6, and the
`RAISE-FR-OPS-002`/`RAISE-FR-ASSET-003` rows in §3). This closes only the
workflow/permission/holder-model half — the separate Custody-History
write-path exclusivity question (Open Finding F-10, Gap 4) and the general
RBAC role/permission-matrix content question for other domains (PRD §16
Q21–Q22, Open Finding F-08) remain open and are carried forward in item 1
below, unchanged in scope. **Gap 15, opened v1.6 (2026-09-02), is now RESOLVED this revision (v1.7,
same day)** — `RAISE-FR-OPS-002`'s new IT Hardware Assignment Approval
Workflow (PRD §16 Resolved Question 43, narrowing Resolved Question 42 for
the IT Hardware category only) is confirmed at the requirement-content
layer, fully propagated through `RAISE-DESIGN.md` v0.12 §4.2,
`RAISE-PROTOTYPE.md` v0.13 P-008, `RAISE-ACCEPTANCE-CRITERIA.md` v0.11
(`AC-OPS-002-04..09`), `RAISE-TEST-PLAN.md` v0.11 (`TS-OPS-002` Partial,
blocked on implementation) — and **now genuinely implemented**: new
`go-template-main` backend files/routes for the 4-stage handover state
machine, with `AssetService.AssignAsset` branching on Category "IT
Hardware." `RAISE-TEST-CASES.md` v0.15 records `TC-OPS-002-04..09` all
**PASS**, formally re-executed end-to-end against the real running Docker
stack (backend + Postgres), corroborated by 18 new passing Go unit tests.
Unlike Gaps 9/12/13/14 (closed same-revision via spec correction or a small
already-scoped fix), this gap took two revisions (opened v1.6, resolved
v1.7) because it genuinely required real net-new implementation work first
— but it is now closed on real code + real execution evidence, per this
document's own no-silent-resolution discipline (see Gap 15, §6, RESOLVED,
and the `RAISE-FR-OPS-002` row in §3, now **PASS on the testable-now
scope**, upgraded from the `PASS (partial)` Gap 15's opening left it at).
**Not closed by this resolution** (unaffected, carried forward): frontend UI
for the workflow, backend role-gate enforcement, the two Stage-2 sub-points,
and the Custody-History write-timing question — see Gap 15, §6, for the
full scope-boundary list.

**Recommended next actions, in order:**

1. Resolve the remaining PRD Open Questions that block full testability of
   P0/MVP requirements (§3/§4 above) — in particular Q1 (asset master
   fields), Q3/Q4 residual KPI formulas, Q6–Q10 (Oracle integration design)
   (Q11–Q13's Check-in/Check-out workflow shape, permission gate, and
   holder-data-model questions are now resolved — see Gap 14, §6, and Q11
   for the IT Hardware category specifically has since been narrowed by
   Q43 and implemented — see Gap 15, §6, RESOLVED; Q15's field-list portion is
   resolved — see Gap 7, §6 — and Q15b's threshold-configurability portion is
   now also resolved — see Gap 12, §6), Q18–Q20 (AI citation/confidence/
   conflict), Q21–Q23 (authentication mechanism, role list, permission
   matrix content — **still genuinely open; the four `MockAuthRepository`
   demo accounts added to close Gap 10 are a testing convenience, and the
   Check-in/Check-out permission-gate answer resolved by Gap 14 is a narrow
   exception scoped to that one gate only — neither is a proposed answer to
   this broader question**), Q24–Q25 (audit taxonomy/retention), the PRD
   §6.9 Open Question (Alerts severity mapping / trigger rules for any
   condition beyond warranty-expired — **still genuinely open; the "Not yet
   defined" Severity rendering added to close Gap 11 is an honest
   placeholder, not a proposed answer to this question**, tracked as Open
   Finding F-05), Open Question 10a (`ReconciliationPage` mapping), and Open
   Question 20a (`RAISE-AI-DOC-004` matching/merge behavior).
2. Resolve the `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` custody-writing-
   events exclusivity question (Gap 4, Open Finding F-10 — **explicitly not
   resolved by Gap 14's closure of the workflow/permission/holder-model
   questions, and not resolved by Gap 15's IT Hardware workflow confirmation
   or implementation either**) before any custody-writing code path beyond
   Check-in/Check-out is built — this now also includes deciding at which of
   the new 4 stages Custody History is written, per the open design point
   Gap 15's Resolution left explicitly unresolved (`RAISE-DESIGN.md` §4.2).
3. If and when any PRD §10 NFR backlog area (§4.2 above) receives a defined
   value/target, add the corresponding Traceability ID to `RAISE-PRD.md`
   first, then propagate a real AC group / Suite / Test Case down the chain
   — do not add test coverage for these areas ahead of a PRD-level
   definition.
4. Proceed to Development for requirements with no open blocker (e.g.,
   `RAISE-FR-OPS-001`, `TS-AI-STATES`), while tracking the BLOCKED items
   above for the remaining requirements. **Resolved this revision:** the IT
   Hardware Assignment Approval Workflow's backend (new
   pending/confirmed/processed/approved states, `AssetService.AssignAsset`
   branching, `/handovers` routes) has been implemented and
   `TC-OPS-002-04..09` formally executed — see Gap 15, §6, RESOLVED.
   **Remaining follow-up work, not yet started, not part of this closure:**
   build the frontend UI for this workflow (`IT_STAFF`/`IT_MANAGER`
   role-gated queues, "My Pending Assignments" surface, 4-stage progress
   indicator reusing `RAISE-FR-MAINT-001`'s `GovernanceStep` pattern) and,
   once the RBAC-enforcement question (PRD §16 Q21–Q22) is answered,
   backend-enforce the `IT_STAFF`/`IT_MANAGER` role gates.

---

## Document Status

**Version:** 1.7 (`RAISE-FR-OPS-002` — **Gap 15 RESOLVED, 2026-09-02, same
day as its v1.6 opening.** The IT Hardware Assignment Approval Workflow
(PRD §16 Resolved Question 43, narrowing Resolved Question 42) is now
implemented in `go-template-main`: new `model/assetHandoverModel.go`,
`repository/assetHandoverPGRepository.go`,
`repository/assetHandoverRepository.go`, `service/assetHandoverService.go`,
`controller/assetHandoverController.go`,
`sql/pg/V5__AssetHandovers_Table.sql`; new routes `GET /handovers`,
`GET /handovers/:code`, `POST /assets/:id/handover`,
`POST /handovers/:code/confirm`, `POST /handovers/:code/process`,
`POST /handovers/:code/decision`; `AssetService.AssignAsset` branches on
Category `"IT Hardware"`, returning HTTP 409 into the new handover flow,
with every other category unaffected (regression-verified).
`RAISE-TEST-CASES.md` v0.15 records `TC-OPS-002-04..09` (all six) moved
from **BLOCKED (pending implementation)** to **PASS**, formally re-executed
end-to-end against the real running Docker stack (backend + Postgres),
covering all 4 stages, both terminal-rejection points (Stage 3 and Stage
4), and the non-IT-Hardware regression guard — corroborated by 18 new Go
unit tests (`service/assetHandoverService_test.go`, all passing) and a
clean full `go build`/`go vet`/`go test` sweep. `RAISE-FR-OPS-002`'s row
(§3) is accordingly upgraded from `PASS (partial)` (as v1.6/Gap 15's opening
left it) to **PASS on the testable-now scope**. This is backend/API-level
execution only — **explicitly not closed by this resolution**: frontend UI
for this workflow (a distinct, not-yet-started follow-up); backend
enforcement of the `IT_STAFF`/`IT_MANAGER` role gates (consistent with this
codebase's existing project-wide UI-only RBAC MVP decision, PRD §16
Resolved Question 38, not a gap specific to this feature); the Stage-2
e-signature/acknowledgment-text-capture question (PRD's own
`## NEEDS_PRD_CONFIRMATION` note, untouched — dismissed rather than
answered this session); the Stage-2 recipient-decline path (never asked,
not implemented); and the Custody-History write-timing question across the
4 stages (`RAISE-DESIGN.md` §4.2's own flagged open design point, distinct
from and not resolving Open Finding F-10 / Gap 4). Gaps 1–14 unchanged from
v1.5/v1.6.)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.14 (§16 Resolved Question 43, unchanged this revision), [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.12 (§4.2, unchanged this revision), [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.13 (P-008, unchanged this revision), [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.11 (§11 AC-OPS-002-04..09, unchanged this revision), [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.11 (TS-OPS-002, unchanged this revision), and [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.15 (§10 TC-OPS-002-04..09 now PASS) — plus the real `go-template-main` source tree (new handover model/repository/service/controller/SQL migration files and routes, `AssetService.AssignAsset` branching). This revision updates only `RAISE-TRACEABILITY-MATRIX.md` itself to reflect that closure.
**Reference:** VERSCAN only
**Last Re-Verified:** 2026-09-02 (`RAISE-FR-OPS-002` row updated to record
Gap 15's resolution — the IT Hardware Assignment Approval Workflow is now
implemented and formally executed — see Change Log v1.6 → v1.7 below and
Gap 15, §6, RESOLVED, for the full record. **Real backend code was written
and a formal test-execution sweep was performed** — all six new test cases
(`TC-OPS-002-04..09`) are correctly recorded **PASS** in
`RAISE-TEST-CASES.md` v0.15, corroborated by 18 new passing Go unit tests.
Prior re-verification work on `RAISE-FR-OPS-002`'s general rule and
`RAISE-FR-ASSET-003` (unaffected this revision) is retained below for
history: `TC-OPS-002-01..03` executed 2026-08-28 and confirmed PASS (Gap 14,
§6, RESOLVED, v1.5); `RAISE-FR-WARRANTY-001`'s `TC-WARRANTY-001-01` through
`-06` executed against the real running app and confirmed PASS (Gap 12/13,
§6, RESOLVED, v1.3/v1.4).

**This revision's execution evidence (2026-09-01, v1.4):** 153/153
automated tests pass (`tsc --noEmit`/lint clean, up from 151/151 in v1.3 —
2 new tests in `frontend/src/App.rbac.test.tsx`:
`'TC-WARRANTY-001-06: redirects a non-ADMIN authenticated user away from
Settings'` and `'TC-WARRANTY-001-06: allows an ADMIN user through to
Settings'`). Live browser: an `EMPLOYEE`-role user navigating to
`/settings` was redirected to the app's real "403 — Access denied"
Forbidden page (no Settings content ever rendered); an `ADMIN`-role user
navigating to `/settings` saw the real Settings page render correctly,
including the Warranty section (5 Asset Categories, per-category threshold
inputs). **Root cause fixed before this PASS was recorded:** the Settings
route (`ROUTES.SETTINGS`) in `frontend/src/App.tsx` had been declared in
the general authenticated-user route block rather than the existing
`<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>` block that
already gates Administration/User Management/Role Management — moved into
that block, no new mechanism invented.

**Prior revision's execution evidence (2026-09-01, v1.3, retained for
history):** 151/151 automated tests passed (`tsc --noEmit`/lint clean, up
from 149/149 in v1.2 — 2 new tests: `frontend/src/pages/Assets/index.test.tsx`'s
`TC-WARRANTY-001-03` case, `frontend/src/services/settings-service.test.ts`'s
per-category-seed/merge case). Live browser: Settings > Warranty rendered
all 5 Asset Categories (IT Hardware, Mobile, Office Equipment,
Infrastructure, Media Equipment), each with a "90" default threshold input;
editing IT Hardware to 5000 and saving correctly flagged MacBook Pro and
Dell UltraSharp Monitor (both IT Hardware) as "Expiring" on Asset Registry,
while iPhone 15 Pro (Mobile, already-expired) still correctly showed
"Expired" — confirming no cross-category leakage; Asset Detail for MacBook
Pro showed "Expiring" consistently in both its Lifecycle row and Warranty &
Coverage section badge. `TC-WARRANTY-001-06` was **not** executed that
pass — this is exactly the gap v1.4 closes above.

**Change Log — v1.6 → v1.7 (this revision, 2026-09-02, same day as v1.6):**

1. **Gap 15 RESOLVED — real implementation + real test execution, not a
   business decision or spec correction alone:** the IT Hardware Assignment
   Approval Workflow confirmed at v1.6 (PRD §16 Resolved Question 43) has
   now been implemented in `go-template-main`: new files
   `model/assetHandoverModel.go`, `repository/assetHandoverPGRepository.go`,
   `repository/assetHandoverRepository.go`,
   `service/assetHandoverService.go`, `controller/assetHandoverController.go`,
   `sql/pg/V5__AssetHandovers_Table.sql`; new routes `GET /handovers`,
   `GET /handovers/:code`, `POST /assets/:id/handover`,
   `POST /handovers/:code/confirm`, `POST /handovers/:code/process`,
   `POST /handovers/:code/decision`; `AssetService.AssignAsset` now branches
   on Category `"IT Hardware"`, returning HTTP 409 into the new handover
   flow, with every other category unaffected (regression-verified).
2. **`RAISE-TEST-CASES.md` v0.15 formally re-executed `TC-OPS-002-04..09`**
   end-to-end against the real running Docker stack (backend + Postgres):
   Stage 1 Initiate (no early status flip), Stage 2 Recipient Confirmation
   (recipient-identity validation confirmed), Stage 3 IT Processing, Stage 4
   IT Supervisor Approval (confirmed the sole status-flipping action),
   terminal rejection at both Stage 3 and Stage 4 (confirmed non-reopenable),
   and the non-IT-Hardware regression guard — all six moved from **BLOCKED
   (pending implementation)** to **PASS**. Corroborated by 18 new Go unit
   tests (`service/assetHandoverService_test.go`, all passing) and a clean
   full `go build`/`go vet`/`go test` sweep.
3. **§3 `RAISE-FR-OPS-002` row updated**: Test Status upgraded from `PASS
   (partial)` to **PASS on the testable-now scope**, with the full evidence
   list and an explicit list of still-open scope boundaries (no frontend UI
   yet; role gates not backend-enforced; Stage-2 e-signature/decline
   sub-points; Custody-History write-timing question) recorded directly in
   the row, not silently omitted.
4. **§6 Gap 15 updated from OPEN to RESOLVED**, with a new "Gap 15 —
   Resolution (2026-09-02, v1.7)" subsection recording the implementation,
   the test evidence, what this closes (the "zero code written" item only),
   and what it explicitly does not close (the Stage-2 sub-points, the
   Custody-History write-timing question, the general RBAC content
   question, the frontend UI, and backend role-gate enforcement) — the
   original "opened" narrative (what was propagated, why it was genuinely
   different from Gaps 9/12/13/14 at opening) is retained unedited for
   history, with a note pointing to the new Resolution subsection.
5. **§7 Chain Consistency Check** gained a new `RAISE-FR-OPS-002` / Gap 15
   RESOLVED thread-walk bullet for this revision, noting the five upstream
   documents are unchanged from v1.6 and this closure rests entirely on real
   implementation + `RAISE-TEST-CASES.md` v0.15's execution evidence; the
   prior v1.6 bullet is retained for history with a note that it is
   superseded. The "full re-walk" closing bullet's Test Cases version
   citation updated from v0.14 to v0.15.
6. **§8 Compliance Review Readiness** Gap 15 bullet changed from OPEN to
   Resolved, with the same explicit list of what Compliance Review may and
   must not treat as covered by this closure.
7. **§9 Checklist** Gap 15 item changed from unchecked (`[ ]`) to checked
   (`[x]`), with the resolution evidence and the still-open scope-boundary
   list recorded in the item text.
8. **§10 Next Step** — the "Gaps 1–14 are resolved; Gap 15 is OPEN" summary
   text is corrected to "Gaps 1–15 are all resolved," with Gap 15's
   resolution recorded; recommended next-action item 1's Q11 citation
   updated from "still open pending implementation" to "narrowed by Q43 and
   implemented"; item 2 (Gap 4 / F-10) updated to note Gap 15's resolution
   still does not resolve it, and to point at `RAISE-DESIGN.md` §4.2's
   flagged open design point for Custody-History write-timing; item 4
   updated from "implement the workflow" to "resolved this revision," with
   the remaining frontend-UI and role-gate-enforcement follow-up work
   recorded as explicit next steps.
9. Version citations updated this revision: only `RAISE-TEST-CASES.md` v0.14
   → v0.15 (the five upstream documents — PRD, Design, Prototype, AC, Test
   Plan — are unchanged from v1.6, since this closure required no
   spec-content change, only real implementation and real test execution).
   Document version bumped 1.6 → 1.7. **No other gap in §6 was found open,
   closed, or newly discovered during this pass** — Gaps 1–14 are unchanged
   from v1.6 and are not re-litigated here; this revision's scope was Gap 15
   specifically, per the instruction that prompted it. `OPEN-FINDINGS.md`
   update (recording this closure, if tracked there) is handled separately,
   out of this document's scope. **Explicitly unaffected and not touched by
   this revision:** Open Finding F-10 (Custody-History write-path
   exclusivity, Gap 4), Open Finding F-08 (general RBAC role/
   permission-matrix content, PRD §16 Q21–Q22), and the two Stage-2
   sub-points (e-signature capture; recipient-decline path, tracked via the
   PRD's own `## NEEDS_PRD_CONFIRMATION` note) — all remain genuinely open
   or unaffected, per the instruction that prompted this revision.

**Change Log — v1.5 → v1.6 (prior revision, 2026-09-02, retained for
history):**

1. **Gap 15 opened, deliberately left OPEN (not resolved that revision) —
   a genuine new-feature gap, distinct from every same-day resolution
   pattern used so far (Gaps 9/12/13/14):** `RAISE-PRD.md` §16 Resolved
   Question 43 (narrowing Resolved Question 42, not reopening or reversing
   it) confirms a new IT Hardware Assignment Approval Workflow: a real
   Singer Thailand company form ("ใบดำเนินการเกี่ยวกับคอมพิวเตอร์และอุปกรณ์")
   supplied by the business user during a live session showed a genuine
   4-signature approval process exists in practice for IT equipment
   handovers. Confirmed digital workflow, scoped **only** to Check-out
   (assign) of IT Hardware-category assets — 4 stages (Initiation →
   Recipient Confirmation → IT Processing (`IT_STAFF`) → IT Supervisor
   Approval (`IT_MANAGER`, only stage flipping status to Assigned));
   rejection at Stage 3/4 is terminal, returns to Available; no new Role
   introduced. Propagated through `RAISE-DESIGN.md` v0.12 (§4.2, new
   subsection), `RAISE-PROTOTYPE.md` v0.13 (P-008, new subsection),
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.11 (six new criteria
   `AC-OPS-002-04..09`), `RAISE-TEST-PLAN.md` v0.11 (`TS-OPS-002` moved out
   of the "no blocked items" group, marked Partial, blocked on
   implementation), and `RAISE-TEST-CASES.md` v0.14 (six new test cases
   `TC-OPS-002-04..09`, all **BLOCKED (pending implementation)**). **Unlike
   Gaps 9/12/13/14, this is a brand-new feature with zero code written yet**
   — not a spec correction matching already-built behavior, and not a small
   already-scoped UI fix shipped same-day. This gap is therefore correctly
   left **OPEN**, per this document's own rule that a gap is never closed
   without a real source-document fix (here: real implementation) backing
   the closure.
2. **§3 `RAISE-FR-OPS-002` row updated**: Priority/Scope, Design Area,
   AC Group(s), TC ID(s), and Test Status columns all updated to reflect the
   new category-scoped exception. Test Status changed from a full,
   unqualified `PASS` to **`PASS (partial)`** — the general rule (all
   Check-in, and Check-out for every category except IT Hardware) remains
   PASS on unchanged 2026-08-28 evidence; the new IT Hardware workflow is
   recorded as confirmed-but-unimplemented, with `AC-OPS-002-04..09` /
   `TC-OPS-002-04..09` carried as BLOCKED (pending implementation).
3. **§6 new Gap 15 added**, opened and left OPEN this revision, with a full
   record of what was propagated, what remains genuinely undecided
   (recipient-decline path; e-signature/acknowledgment-text capture, both
   tracked via the PRD's own `## NEEDS_PRD_CONFIRMATION` note), and a new
   design-phase question surfaced (Custody History write-timing across the 4
   stages, distinct from and not resolving Open Finding F-10 / Gap 4).
4. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-OPS-002` / IT
   Hardware Assignment Approval Workflow thread-walk bullet for this
   revision; the "full re-walk" closing bullet's Test Cases version citation
   updated from v0.13 to v0.14.
5. **§8 Compliance Review Readiness** gained a new Gap 15 OPEN bullet, with
   an explicit instruction that Compliance Review must not treat
   `RAISE-FR-OPS-002` as fully PASS, and must not treat this as resolving the
   Stage-2 sub-points or the Custody-History write-timing question.
6. **§9 Checklist** gained a new Gap 15 item, left **unchecked** (`[ ]`) —
   the first unchecked item in this section's history — deliberately, to
   visually distinguish an open gap from every prior checklist entry, all of
   which record a resolution.
7. **§10 Next Step** — the "Gaps 1–14 are now all resolved" summary text is
   corrected to "Gaps 1–14 are resolved; Gap 15 (opened this revision, v1.6)
   is OPEN, not resolved," with a new Gap 15 summary paragraph; recommended
   next-action item 1's Q11 citation is annotated to note the IT Hardware
   narrowing; item 2 (Gap 4 / F-10) gained a note that Gap 15's new
   Custody-History-write-timing question does not resolve it either; item 4
   gained an explicit new action item to implement the workflow and execute
   `TC-OPS-002-04..09` before this row can return to a full PASS.
8. Version citations updated this revision: `RAISE-PRD.md` v0.13 → v0.14,
   `RAISE-DESIGN.md` v0.11 → v0.12, `RAISE-PROTOTYPE.md` v0.12 → v0.13,
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.10 → v0.11, `RAISE-TEST-PLAN.md` v0.10 →
   v0.11, `RAISE-TEST-CASES.md` v0.13 → v0.14 (all six were already synced
   against this new requirement in prior steps, not by this revision — this
   revision only updates `RAISE-TRACEABILITY-MATRIX.md` itself to reflect
   that prior sync). Document version bumped 1.5 → 1.6. **No other gap in
   §6 was found open, closed, or newly discovered during this pass** — Gaps
   1–14 are unchanged from v1.5 and are not re-litigated here; this
   revision's reverse-chain re-verification was scoped to `RAISE-FR-OPS-002`
   / the new IT Hardware Assignment Approval Workflow / PRD §16 Resolved
   Question 43 specifically, per the instruction that prompted it, not a
   full re-walk of every requirement. `OPEN-FINDINGS.md` update (recording
   this as a new, still-open finding, if tracked there) is handled
   separately, out of this document's scope. **Explicitly unaffected and not
   touched by this revision:** `RAISE-FR-ASSET-003` (Gap 14, unaffected —
   the holder-data-model resolution is untouched by this narrower Check-out
   exception), Open Finding F-10 (Custody-History write-path exclusivity,
   Gap 4), and Open Finding F-08 (general RBAC role/permission-matrix
   content, PRD §16 Q21–Q22) — all remain genuinely open or unaffected, per
   the instruction that prompted this revision.

**Change Log — v1.4 → v1.5 (prior revision, 2026-09-01):**

1. **Gap 14 opened and RESOLVED in the same revision, requirement-content
   scope (matching the Gap 12 pattern, not the Gap 13 pattern):**
   `RAISE-FR-OPS-002`'s workflow shape and permission gate, and
   `RAISE-FR-ASSET-003`'s holder data model, were previously PRD §16 Open
   Questions 11, 12, and 13 — the underlying questions behind Open Finding
   F-02. Per explicit confirmed business decision (2026-09-01, PRD §16
   Resolved Question 42), all three are resolved: (a) immediate
   state-change operation, no approval/exception-handling step; (b) any
   authenticated user, no role restriction, scoped to this one gate only,
   not the general RAISE-NFR-SEC-RBAC-001 role/permission-matrix-content
   question (PRD §16 Q21–Q22, Open Finding F-08); (c) a direct 1:1 link to
   an Employee record. Propagated through `RAISE-DESIGN.md` v0.11 (§4.2),
   `RAISE-PROTOTYPE.md` v0.12 (P-008/P-006 — a v0.11 draft briefly and
   incorrectly over-resolved the separate Custody-History-exclusivity
   question, Open Finding F-10; caught and corrected in v0.12, restoring
   F-10 to open), `RAISE-ACCEPTANCE-CRITERIA.md` v0.10 (AC-OPS-002-01/-02
   rewritten), `RAISE-TEST-PLAN.md` v0.10 (TS-OPS-002 fully unblocked), and
   `RAISE-TEST-CASES.md` v0.13 (`TC-OPS-002-01..03` status notes updated).
   **No new code was written and no new test execution was performed** —
   the existing `TC-OPS-002-01..03` PASS result (2026-08-28) already covers
   the newly-confirmed scope; this is a scope/spec-correction closure only,
   the same discipline used for Gap 12.
2. **§3 `RAISE-FR-OPS-002` and `RAISE-FR-ASSET-003` rows updated**: both
   rows' Test Status notes now record this resolution and explicitly
   distinguish it from the still-open F-10 (Gap 4) and F-08 questions.
   **Neither row's PASS verdict itself changes** — both remain the same
   `PASS` recorded 2026-08-28, now with an accurate, non-stale note.
3. **§6 new Gap 14 added**, opened and RESOLVED in this same revision, with
   full closure record (what was resolved, what remains explicitly open).
4. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-OPS-002` /
   `RAISE-FR-ASSET-003` / Open Finding F-02 thread-walk bullet for this
   revision; the "full re-walk" closing bullet's TC-Cases version citation
   updated from v0.11 to v0.13 and its requirement list adjusted to exclude
   the two rows now checked separately.
5. **§8 Compliance Review Readiness** gained a new Gap 14 resolved-item
   bullet, with an explicit "must not" caveat for F-10/F-08.
6. **§9 Checklist** gained a new Gap 14 item, checked (`[x]`), opened and
   resolved within this revision (the same pattern as Gap 12's checklist
   entry, not Gap 13's "moved from unchecked to checked across revisions"
   pattern).
7. **§10 Next Step** — the Gaps 1–13/"Gaps 1-13 now all resolved" summary
   text is updated to "Gaps 1–14 are now all resolved," with a new Gap 14
   summary paragraph; recommended next-action item 1's Q11–Q13 citation is
   updated to note resolution (mirroring how Q15/Q15b were previously
   updated for Gap 7/Gap 12), and item 2 (Gap 4 / F-10) gained an explicit
   note that Gap 14's closure does not touch it.
8. Version citations updated this revision: `RAISE-PRD.md` v0.12 → v0.13,
   `RAISE-DESIGN.md` v0.10 → v0.11, `RAISE-PROTOTYPE.md` v0.10 → v0.12,
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.9 → v0.10, `RAISE-TEST-PLAN.md` v0.9 →
   v0.10, `RAISE-TEST-CASES.md` v0.12 → v0.13 (all six were already synced
   against this resolution in prior steps, not by this revision — this
   revision only updates `RAISE-TRACEABILITY-MATRIX.md` itself to reflect
   that prior sync). Document version bumped 1.4 → 1.5. **No other gap in
   §6 was found open, closed, or newly discovered during this pass** — Gaps
   1–13 are unchanged from v1.4 and are not re-litigated here; this
   revision's reverse-chain re-verification was scoped to `RAISE-FR-OPS-002`
   / `RAISE-FR-ASSET-003` / Open Finding F-02 specifically, per the
   instruction that prompted it, not a full re-walk of every requirement.
   `OPEN-FINDINGS.md` F-02's closure (to Resolved), if tracked there, is
   handled separately, out of this document's scope. **Explicitly
   unaffected and not touched by this revision:** Open Finding F-10
   (Custody-History write-path exclusivity, Gap 4) and Open Finding F-08
   (general RBAC role/permission-matrix content, PRD §16 Q21–Q22) — both
   remain genuinely open, per the instruction that prompted this revision.

**Change Log — v1.3 → v1.4 (prior revision, 2026-09-01):**

1. **Gap 13 (opened v1.3) RESOLVED this revision, execution-sweep closure
   that surfaced a real defect:** `TC-WARRANTY-001-06` (non-admin
   access/write denial to the P-018 Settings screen) has been formally
   executed against the real running app and confirmed **PASS**, per
   `RAISE-TEST-CASES.md` v0.12 §12. The execution sweep found the Settings
   route (`ROUTES.SETTINGS`) in `frontend/src/App.tsx` was **not** actually
   gated to ADMIN — any authenticated user of any Role could reach
   `/settings` and edit Warranty thresholds before this fix. **Fixed** by
   moving the Settings route into the existing `<ProtectedRoute
   allowedRoles={['ADMIN']} />` block that already gates
   Administration/User Management/Role Management — reusing the exact
   mechanism already confirmed elsewhere in the app (PRD §16 Resolved
   Question 38, per `RAISE-NFR-SEC-RBAC-001`), no new RBAC mechanism
   invented. Verified via 2 new tests in `frontend/src/App.rbac.test.tsx`
   (both pass), a clean full 153/153 frontend suite (was 151), clean
   `tsc --noEmit`/lint, and live browser verification (EMPLOYEE-role user
   denied via the real Forbidden page; ADMIN-role user let through).
2. **§3 `RAISE-FR-WARRANTY-001` row updated**: Test Status moved from `PASS
   (partial)` to a full, unqualified **PASS** — `TC-WARRANTY-001-01`
   through `-06` all PASS, no remaining unexecuted test case and no
   remaining PRD-content blocker for this requirement.
3. **§6 Gap 13 rewritten** from "opened this revision, still OPEN" to
   "opened v1.3, RESOLVED v1.4" — the root cause found (a real route-gating
   defect, not just an unexecuted test) and the fix applied are both
   recorded in full, following this document's own rule that a gap is not
   closed without a real execution record.
4. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-WARRANTY-001`
   / P-018 access-gate execution thread-walk bullet for this revision; the
   pre-existing threshold-configurability bullet (v1.3) is retained,
   trimmed to its own closed scope only.
5. **§8 Compliance Review Readiness** — the Gap 13 open-item note is
   rewritten as a resolved-item note; Compliance Review may now treat
   `RAISE-FR-WARRANTY-001`'s row as a full, unqualified PASS.
6. **§9 Checklist** — the Gap 13 item is checked off (`[x]`), the first
   Gap in this document to move from an unchecked `[ ]` state (v1.3) to
   checked (v1.4) rather than being opened-and-closed within one revision.
7. **§10 Next Step** — the Gaps 1–12/"Gap 13 remains OPEN" summary text is
   updated to "Gaps 1–13 are now all resolved"; the former recommended
   next-action item 1 (run the `TC-WARRANTY-001-06` execution sweep) is
   removed as complete, and the remaining items renumbered 1–4.
8. Version citation for `RAISE-TEST-CASES.md` updated this revision: v0.11
   → v0.12 (the only upstream document that changed this revision — every
   other document in the chain, `RAISE-PRD.md` through `RAISE-TEST-PLAN.md`,
   is unchanged from v1.3, since this was purely an execution-sweep-and-fix
   revision, not a further requirement-content resolution). Document
   version bumped 1.3 → 1.4. **No other gap in §6 was found open, closed,
   or newly discovered during this pass** — Gaps 1–12 are unchanged from
   v1.3 and are not re-litigated here; this revision's reverse-chain
   re-verification was scoped to `RAISE-FR-WARRANTY-001` /
   `TC-WARRANTY-001-06` specifically, per the instruction that prompted it,
   not a full re-walk of every requirement. `OPEN-FINDINGS.md` updates, if
   any are tracked for this newly-found-and-fixed RBAC-gating defect, are
   handled separately, out of this document's scope.

**Change Log — v1.2 → v1.3 (prior revision, 2026-09-01):**

1. **Gap 12 opened and RESOLVED in the same revision, requirement-content
   scope (not a build-gap fix like Gaps 9–11):** `RAISE-FR-WARRANTY-001`'s
   `TC-WARRANTY-001-03` was `BLOCKED (partial)` because the 90-day Expiring
   window was only the PRD's illustrative business example, not a confirmed
   generalizable rule. Per explicit confirmed business decision (2026-09-01,
   PRD §16 Resolved Question 41, resolving follow-on Open Question 15b), the
   threshold is now **per-Asset-Category configurable**, defaulting to 90
   days for all 5 current Asset Categories, admin-adjustable via a new
   **P-018 Settings** screen. Propagated through `RAISE-DESIGN.md` v0.10
   (§5.2 rewritten to a 3-state Active/Expiring/Expired model, new §5.4
   Settings Domain), `RAISE-PROTOTYPE.md` v0.10 (P-010 rewritten, new §23A
   P-018), `RAISE-ACCEPTANCE-CRITERIA.md` v0.9 (`AC-WARRANTY-001-03`
   rewritten, new `AC-WARRANTY-001-04`/`-05`), `RAISE-TEST-PLAN.md` v0.9
   (TS-WARRANTY-001 fully unblocked), and `RAISE-TEST-CASES.md` v0.11
   (`TC-WARRANTY-001-03` rewritten, new `TC-WARRANTY-001-04`/`-05`, all
   formally executed and confirmed **PASS**). **This closes the
   threshold-configurability half of the gap in full; a newly-introduced
   access-control test case for the new P-018 screen —
   `TC-WARRANTY-001-06` — is explicitly not part of this closure** — see
   Gap 13, §6, for the full closure record.
2. **Gap 13 opened this revision — still OPEN, real coverage gap, not a
   business-open question:** `TC-WARRANTY-001-06` (non-admin access/write
   denial to the new P-018 Settings screen) is written and fully specified
   in `RAISE-TEST-CASES.md` v0.11 §12, but has not been formally executed.
   The underlying UI-only RBAC denial mechanism is already confirmed and
   exercised elsewhere in the app (`RAISE-NFR-SEC-RBAC-001`), so this is
   purely a missing execution pass, not an undefined mechanism or missing
   business decision. Test Status recorded as `NOT_TESTED` (per
   `RAISE-PRD.md` §17), distinct from PASS/FAIL/BLOCKED. See Gap 13, §6.
3. **§3 `RAISE-FR-WARRANTY-001` row rewritten**: Design Area, Prototype
   Screen(s), AC Group(s), and TC ID(s) columns updated to include P-018 and
   `AC-WARRANTY-001-04/-05/-06` / `TC-WARRANTY-001-04..06`. Test Status
   updated from `PASS (partial)` (field-list-only resolution) to `PASS
   (partial)` on updated grounds — `TC-WARRANTY-001-01` through `-05` now
   all **PASS**, with the row's only remaining "partial" qualifier being the
   still-unexecuted `TC-WARRANTY-001-06` (Gap 13), not any remaining
   PRD-content blocker.
4. **§6 Gap 7's "still open" residual-item paragraph updated** to record
   that its previously-carved-out 90-day-threshold item is now resolved,
   pointing to new Gap 12 rather than describing it as still BLOCKED.
5. **§6 Gaps 12 and 13 added**, following the same "record resolution with
   evidence, explicitly separate a closed half from a still-open half, do
   not silently close the open half" discipline as Gaps 7–11 — with Gap 12
   marked RESOLVED and Gap 13 marked OPEN (this document's first Gap opened
   this revision that is *not* also closed in the same revision, since
   v0.4's Gap 1).
6. **§7 Chain Consistency Check** gained a dedicated
   `RAISE-FR-WARRANTY-001` / Expiring-threshold thread-walk bullet for this
   revision (the pre-existing 2026-08-29 field-list bullet is retained,
   relabeled "for history," and no longer asserted as covering the
   threshold question); the "no other row drifted" re-walk list updated to
   reflect `RAISE-TEST-CASES.md` v0.11 and to move `RAISE-FR-WARRANTY-001`
   into its own dedicated bullet.
7. **§8 Compliance Review Readiness** gained a Gap 12 resolved-item note and
   a Gap 13 open-item note, the latter explicitly warning Compliance Review
   not to treat this row as a full unqualified PASS.
8. **§9 Checklist** gained a Gap 12 item (marked RESOLVED) and a Gap 13 item
   (marked OPEN — the checklist's first unchecked `[ ]` item since Gap 1).
9. **§10 Next Step** — Gaps 1–11 summary text updated to Gaps 1–12, with an
   explicit note that Gap 13 remains OPEN; item 1's Q15 threshold-window
   reference updated to reflect Q15b's resolution; a new recommended-action
   item 1 added ahead of the existing list, directing a formal execution
   sweep of `TC-WARRANTY-001-06`; subsequent items renumbered 2–5.
10. Version citations updated this revision: `RAISE-PRD.md` v0.11 → v0.12,
    `RAISE-DESIGN.md` v0.9 → v0.10, `RAISE-PROTOTYPE.md` v0.9 → v0.10,
    `RAISE-ACCEPTANCE-CRITERIA.md` v0.8 → v0.9, `RAISE-TEST-PLAN.md` v0.8 →
    v0.9, `RAISE-TEST-CASES.md` v0.10 → v0.11 (every upstream document in
    the chain changed this revision, since this was a genuine
    requirement-content resolution propagated top-to-bottom, unlike the
    build/infrastructure-only fixes behind Gaps 9–11). Document version
    bumped 1.2 → 1.3. **No other gap in §6 was found open, closed, or newly
    discovered during this pass** — Gaps 1–11 are unchanged from v1.2 and
    are not re-litigated here; this revision's reverse-chain
    re-verification was scoped to `RAISE-FR-WARRANTY-001` specifically, per
    the instruction that prompted it, not a full re-walk of every
    requirement. `OPEN-FINDINGS.md` updates, if any are tracked for PRD
    Open Question 15b, are handled separately, out of this document's
    scope.

**Change Log — v1.1 → v1.2 (prior revision, 2026-09-01):**

1. **Gap 11 opened and RESOLVED in the same revision, build-gap scope
   only:** `RAISE-FR-ALERT-001`'s `TC-ALERT-001-01`/`-02` were `FAIL` as of
   the 2026-08-29 execution because no P-012 Alerts screen existed at all —
   the sidebar's "Notification Center" entry routed to `/notifications`,
   which rendered the app's generic 404 page. Per explicit business
   decision, the Alerts screen was scoped to derive its one
   alert-triggering condition from the one already confirmed elsewhere in
   the app — an asset's `warrantyExpiry` being in the past, the same
   `isWarrantyExpired` check `RAISE-FR-WARRANTY-001`'s Warranty column
   already uses — with no new field/data model, and Severity is rendered
   honestly as "Not yet defined" rather than an invented High/Medium/Low.
   New `frontend/src/pages/Alerts/index.tsx`, registered at
   `ROUTES.NOTIFICATIONS` (`/notifications`) in `App.tsx`. **This closes
   the build-gap half of the gap in full; the requirement-content half —
   severity mapping / trigger rules for any condition beyond
   warranty-expired, PRD §6.9 Open Question, Open Finding F-05 — is
   explicitly not resolved and remains open** — see Gap 11, §6, for the
   full closure record.
2. **§3 `RAISE-FR-ALERT-001` row updated** from `FAIL` to real,
   evidence-based **PASS (partial)**: `TC-ALERT-001-01`/`-02` formally
   executed 2026-09-01 against the real running app — `/notifications` now
   renders 11 alert rows, matching the Dashboard's "Expired Warranty: 11"
   tile exactly; the row for AST-0013 (Dell OptiPlex 7090) displays
   Severity "Not yet defined," Description "Warranty expired 2024-03-15,"
   and a clickable Asset link that correctly navigates to Asset Detail;
   confirmed no Email/Teams/LINE delivery-channel UI exists anywhere on the
   page. Corroborated by 2 new passing automated tests
   (`frontend/src/pages/Alerts/index.test.tsx`) and a clean 149/149 full
   frontend suite (was 147), with `tsc --noEmit`/lint both clean.
3. **§6 Gap 11 added**, following the same "record resolution with
   evidence, explicitly separate a closed build-gap half from a still-open
   content half, do not silently close the content half" discipline as
   Gaps 7–10.
4. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-ALERT-001` /
   F-32 thread-walk bullet confirming the fix is a build/infrastructure fix
   only — `RAISE-ACCEPTANCE-CRITERIA.md` (`AC-ALERT-001`) was correctly
   **not** edited for this fix, since `AC-ALERT-001-01`'s existing scope
   (structural display only) already covers what was implemented; the "no
   other row drifted" re-walk list was updated to reflect
   `RAISE-TEST-CASES.md` v0.10 and to move `RAISE-FR-ALERT-001` out of the
   "unchanged" list into its own dedicated bullet.
5. **§8 Compliance Review Readiness** gained a new resolved-item note
   (mirroring the Gap 9/Gap 10 notes) explicitly warning Compliance Review
   not to treat this fix as resolving the severity/trigger-rule definition
   question (PRD §6.9, Open Finding F-05).
6. **§9 Checklist** gained a Gap 11 item, marked RESOLVED (build-gap scope
   only, content half explicitly still open).
7. **§10 Next Step** — Gaps 1–10 summary text updated to Gaps 1–11; item 1's
   Open Question list gained an explicit PRD §6.9 / F-05 entry, noting the
   "Not yet defined" Severity rendering added to close Gap 11 is an honest
   placeholder, not a proposed answer to that question.
8. Version citations updated this revision: `RAISE-TEST-CASES.md` v0.9 →
   v0.10 (the only upstream document that changed — `TC-ALERT-001-01`/`-02`
   rewritten with formal execution evidence, per its own v0.10 change log).
   `RAISE-PRD.md` v0.11, `RAISE-DESIGN.md` v0.9, `RAISE-PROTOTYPE.md` v0.9,
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.8, `RAISE-TEST-PLAN.md` v0.8 unchanged
   — none required an edit for this fix, since it is a code/infrastructure
   change plus a direct execution-evidence update, not a spec correction
   (per this document's own established practice for pure execution-result
   updates, e.g. the `RAISE-NFR-SEC-RBAC-001`/Gap 10 precedent). Document
   version bumped 1.1 → 1.2. **No other gap in §6 was found open, closed,
   or newly discovered during this pass** — Gaps 1–10 are unchanged from
   v1.1 and are not re-litigated here; this revision's reverse-chain
   re-verification was scoped to `RAISE-FR-ALERT-001` specifically, per the
   instruction that prompted it, not a full re-walk of every requirement.
   `OPEN-FINDINGS.md` F-32 update (to Resolved) is tracked and handled
   separately, out of this document's scope.

**Change Log — v1.0 → v1.1 (prior revision, 2026-09-01):**

1. **Gap 10 opened and RESOLVED in the same revision, infrastructure scope
   only:** `RAISE-NFR-SEC-RBAC-001`'s `TC-LOGIN-01`/`-02` were `BLOCKED` as
   of the 2026-08-29 execution because `auth-service.ts` had no Mock
   repository fallback, unlike every other domain, so `login()` always
   called the real, unreachable `go-template-main` backend. Per explicit
   business decision, a `MockAuthRepository` was added (new
   `frontend/src/services/auth-repository.ts`, mirroring
   `asset-repository.ts`'s `AuthRepository`/`MockAuthRepository`/
   `HttpAuthRepository` structure exactly), gated by a new
   `AUTH_API_ENABLED` flag (`config/featureFlags.ts`, default OFF, same
   convention as every other domain). Four demo accounts were created, one
   per Role (`types/auth.ts`: `EMPLOYEE`, `IT_STAFF`, `IT_MANAGER`,
   `ADMIN`) — `admin@raise.dev` / `manager@raise.dev` / `itstaff@raise.dev`
   / `employee@raise.dev`, all `demo1234`. **This closes the infrastructure
   half of the gap in full; the requirement-content half — authentication
   mechanism / role-permission matrix content, PRD §16 Q21–Q22 — is
   explicitly not resolved and remains open** — see Gap 10, §6, for the
   full closure record.
2. **§4 `RAISE-NFR-SEC-RBAC-001` row updated** from `FAIL (partial)` to
   real, evidence-based **PASS**: `TC-LOGIN-01`/`-02` re-executed through
   the real Login page UI (`frontend/src/pages/Login/index.tsx`, not a
   localStorage bypass) and confirmed PASS (wrong credentials rejected with
   genuine "Invalid username or password"; `admin@raise.dev`/`demo1234`
   logged in successfully as `ADMIN`); `TC-LOGIN-03` unaffected, still PASS.
   Corroborated by 2 new passing automated tests
   (`frontend/src/services/auth-service.test.ts`) and a clean 147/147 full
   frontend suite (was 145), with `tsc --noEmit`/lint both clean.
3. **§4.2 NFR backlog cross-layer table updated** — the Authentication and
   Authorization/RBAC rows both gained a clarifying note that `TC-LOGIN-01`/
   `-02`/`-03` now execute and PASS, while the underlying "mechanism TBD" /
   "role content TBD" status is explicitly unchanged, since F-30 was an
   infrastructure gap, not a requirement-content resolution.
4. **§6 Gap 10 added**, following the same "record resolution with
   evidence, explicitly separate a closed infrastructure half from a still-
   open content half, do not silently close the content half" discipline as
   Gaps 7–9.
5. **§7 Chain Consistency Check** gained a dedicated `RAISE-NFR-SEC-RBAC-001`
   / F-30 thread-walk bullet confirming the fix is infrastructure/execution-
   layer only — `RAISE-PRD.md`, `RAISE-ACCEPTANCE-CRITERIA.md` (`AC-LOGIN`),
   and `RAISE-TEST-CASES.md` (`TC-LOGIN-01..03`) were correctly **not**
   edited for this fix, since `AC-LOGIN`'s existing "NOT TESTABLE YET" note
   already scoped `AC-LOGIN-01/-02` to existence-only testing, which is
   exactly what is now exercisable.
6. **§8 Compliance Review Readiness** gained a new resolved-item note
   (mirroring the Gap 8/Gap 9 notes) explicitly warning Compliance Review
   not to treat this fix as resolving the authentication-mechanism/role-
   matrix question.
7. **§9 Checklist** gained a Gap 10 item, marked RESOLVED (infrastructure
   scope only, content half explicitly still open).
8. **§10 Next Step** — Gaps 1–9 summary text updated to Gaps 1–10; item 1's
   Q21–Q23 reference gained a clarifying note that the four
   `MockAuthRepository` demo accounts are a testing convenience, not a
   proposed answer to the open role/permission-matrix question.
9. Version citations unchanged this revision: `RAISE-PRD.md` v0.11,
   `RAISE-DESIGN.md` v0.9, `RAISE-PROTOTYPE.md` v0.9,
   `RAISE-ACCEPTANCE-CRITERIA.md` v0.8, `RAISE-TEST-PLAN.md` v0.8,
   `RAISE-TEST-CASES.md` v0.9 — none of the five upstream documents required
   an edit for this fix, since it is a code/infrastructure change plus a
   direct execution-evidence update to this matrix, not a spec correction
   (per this document's own established practice for pure execution-result
   updates, e.g. the `RAISE-FR-ASSET-001`/`RAISE-FR-OPS-001`/
   `RAISE-FR-OPS-002` rows). Document version bumped 1.0 → 1.1. **No other
   gap in §6 was found open, closed, or newly discovered during this pass**
   — Gaps 1–9 are unchanged from v1.0 and are not re-litigated here; this
   revision's reverse-chain re-verification was scoped to
   `RAISE-NFR-SEC-RBAC-001` specifically, per the instruction that prompted
   it, not a full re-walk of every requirement. `OPEN-FINDINGS.md` F-30
   update (to Resolved) is tracked and handled separately, out of this
   document's scope.

**Change Log — v0.9 → v1.0 (prior revision, 2026-09-01):**

1. **Gap 9 fully RESOLVED** (was partially resolved in v0.9 — spec
   correction only). The UI code change nesting the "By Category" view one
   level deeper (Category → Type → individual assets) has shipped in
   `frontend/src/pages/Assets/index.tsx`, and a fresh formal execution
   sweep against `TC-ASSET-002-01..03` was run 2026-09-01 against the real
   running app, confirming all three **PASS**: navigated to `/assets`,
   opened "By Category," expanded "IT Hardware" (Type-level sub-groups
   Headphones: 1 asset, Laptop: 3 assets, Monitor: 2 assets revealed, no
   individual assets at that level), expanded "Laptop" (exactly its 3
   individual assets revealed — MacBook Pro 16" M3 / AST-0001, MacBook Air
   M2 / AST-0011, ThinkPad X1 Carbon Gen 11 / AST-0012 — none of Monitor's or
   Headphones' assets). Corroborated by 3 new/updated automated tests in
   `frontend/src/pages/Assets/index.test.tsx` (all pass), the full frontend
   suite (145 tests, no regressions), and clean `tsc --noEmit`/lint. This
   closes the UI-implementation and execution-sweep halves of Gap 9 that
   v0.9 left explicitly open — see Gap 9, §6, for the full closure record
   (all three sub-items now recorded resolved, none silently dropped).
2. **§3 `RAISE-FR-ASSET-002` row updated** from `PASS (scoped)` to real,
   evidence-based **PASS** (Category → Type hierarchy display and drill-down
   both confirmed), with `TC-ASSET-002-02` unaffected and still PASS.
3. **§6 Gap 9 updated** from "PARTIALLY RESOLVED" to fully "RESOLVED," with
   the UI-implementation and execution-sweep evidence added alongside the
   already-closed spec-correction record.
4. **§7 Chain Consistency Check** — the `RAISE-FR-ASSET-002` thread-walk
   bullet updated to record the completed UI shipment and execution sweep,
   closing out the "UI-implementation and execution-sweep halves remain
   explicitly open" note that ended the v0.9 bullet.
5. **§8 Compliance Review Readiness** — the standing caveat warning
   Compliance Review not to treat `TC-ASSET-002-01`/`-03` as PASS on the
   spec resolution alone is removed and replaced with a note that all three
   test cases now carry a real, evidence-based PASS.
6. **§9 Checklist** — Gap 9 item updated from "PARTIALLY RESOLVED" to
   "fully RESOLVED."
7. **§10 Next Step** — item 0 (ship the UI change and run the execution
   sweep) removed, since it is now done; the numbered list re-sequenced
   starting at 1.
8. Version citations updated: Test Cases v0.8 → v0.9 (Prototype unchanged at
   v0.9, AC unchanged at v0.8, Test Plan unchanged at v0.8 — this revision's
   change was UI code plus a Test Cases execution-result update, not a
   further AC/Prototype/Test Plan rewrite; PRD unchanged at v0.11, Design
   unchanged at v0.9). Document version bumped 0.9 → 1.0. No other gap in §6
   was found open, closed, or newly discovered during this pass — Gaps 1–8
   are unchanged from v0.9 and are not re-litigated here; this revision's
   reverse-chain re-verification was scoped to `RAISE-FR-ASSET-002`
   specifically, per the instruction that prompted it, not a full re-walk of
   every requirement. `OPEN-FINDINGS.md` F-27 update (to Resolved) is
   tracked and handled separately, out of this document's scope.

**Change Log — v0.8 → v0.9 (prior revision, 2026-09-01):**

1. **Gap 9 opened and partially resolved in the same revision:**
   `RAISE-FR-ASSET-002`'s Category & Hierarchy sub-category taxonomy was
   previously an illustrative, unconfirmed example with a "NOT TESTABLE
   YET" note on `AC-ASSET-002-01` and no drill-down criterion at all —
   tracked as Open Finding F-27. Per explicit business decision — confirm
   "sub-category" is the existing Asset `type` field (no new field/data
   model), the hierarchy is exactly 2 levels (Category → Type → individual
   assets), using real seeded values — the chain was corrected 2026-09-01:
   `RAISE-PROTOTYPE.md` §11 (P-005, v0.9), `RAISE-ACCEPTANCE-CRITERIA.md` §8
   (AC-ASSET-002, v0.8, new AC-ASSET-002-03 added), `RAISE-TEST-PLAN.md`
   §7/§8/§9 (TS-ASSET-002, v0.8), and `RAISE-TEST-CASES.md` §7
   (`TC-ASSET-002-01` rewritten and unblocked, new `TC-ASSET-002-03` added
   and marked BLOCKED (pending implementation)). **The spec-correction half
   of Gap 9 is closed; the UI-implementation half and the execution-sweep
   half are explicitly not** — see Gap 9, §6, for the full record.
2. **§3 `RAISE-FR-ASSET-002` row rewritten** to distinguish what is
   confirmed (the chain is corrected and matches the business decision;
   `TC-ASSET-002-02` unaffected PASS) from what is not yet confirmed (a
   fresh execution sweep against `TC-ASSET-002-01`'s corrected
   Category → Type wording; `TC-ASSET-002-03`'s UI implementation). Overall
   row status retained at **PASS (scoped)**, explicitly not upgraded on the
   strength of the spec correction alone.
3. **§6 Gap 9 added**, following the same "record resolution with evidence,
   split closed vs. open sub-items, do not silently close" discipline as
   Gaps 6 and 8.
4. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-ASSET-002`
   thread-walk bullet (F-27 → Prototype → AC → Test Plan → Test Cases)
   confirming the spec-correction propagated cleanly, and explicitly noting
   every layer states no new execution result is being reported.
5. **§8 Compliance Review Readiness** gained a new standing caveat warning
   Compliance Review not to treat `TC-ASSET-002-01`/`-03` as PASS on the
   strength of the spec resolution alone.
6. **§9 Checklist** gained a Gap 9 item, explicitly marked partially
   resolved (not fully resolved), mirroring the discipline used for Gap 8
   when its execution half was still open.
7. **§10 Next Step** gained a new highest-priority action (item 0): ship the
   Type-level nesting UI change and run a fresh execution sweep against
   `TC-ASSET-002-01`/`-03`, updating §3's `RAISE-FR-ASSET-002` row from
   `PASS (scoped)` once run.
8. Version citations updated throughout: Prototype v0.8 → v0.9, AC v0.7 →
   v0.8, Test Plan v0.7 → v0.8, Test Cases v0.7 → v0.8 (PRD unchanged at
   v0.11, Design unchanged at v0.9 — confirmed by direct re-read, not
   assumed, since F-27's resolution required no PRD/Design-level change).
   **No other gap in §6 was found open, closed, or newly discovered during
   this pass** — Gaps 1–8 are unchanged from v0.8 and are not re-litigated
   here; this revision's reverse-chain re-verification was scoped to
   `RAISE-FR-ASSET-002` specifically, per the instruction that prompted it,
   not a full re-walk of every requirement. `OPEN-FINDINGS.md` F-27 update
   is tracked and handled separately, out of this document's scope.

**Change Log — v0.7 → v0.8 (prior revision, 2026-08-31):**

1. **Gap 8 fully RESOLVED** (was partially resolved in v0.7 — spec
   correction only). A fresh formal execution sweep against the corrected
   `TC-DASH-01..03`/`TC-EXEC-001-01..02` was run 2026-08-31 against the real
   running app, confirming `TC-DASH-01..02`/`TC-EXEC-001-01..02` **PASS** and
   `TC-DASH-03` **PASS** on the absence-check itself. This closes the
   execution-sweep half of Gap 8 that v0.7 left explicitly open — see Gap 8,
   §6, for the full closure record (both sub-items now recorded resolved,
   neither silently dropped).
2. **§3 `RAISE-FR-EXEC-001` row updated** from `NOT_TESTED (re-derived after
   spec correction; execution pending)` to real, evidence-based **PASS**
   (KPI grid + section list), with the pre-existing NBV/Risk absence
   sub-item unaffected and still **BLOCKED (partial)** under Open Finding
   F-03.
3. **§4 Dashboard/Navigation row updated** identically in substance: from
   `NOT_TESTED (re-derived after spec correction; execution pending)` to
   real, evidence-based **PASS (partial)** — PASS on `TC-DASH-01`/`-02` and
   on `TC-DASH-03`'s absence-check itself, still **BLOCKED (partial)** on
   whether/when NBV/Risk/Utilization tiles should ever be added (Open
   Finding F-03, unaffected).
4. **§7 Chain Consistency Check** — the `RAISE-FR-EXEC-001`/
   Dashboard-Navigation thread-walk bullet updated to record the completed
   execution sweep, closing out the "execution-sweep portion remains open"
   note that ended the v0.7 bullet.
5. **§8 Compliance Review Readiness** — the standing caveat warning
   Compliance Review not to treat this row as PASS on the spec correction
   alone is removed and replaced with a note that both rows now carry a
   real, evidence-based PASS (KPI grid/section-list scope), with the NBV/Risk
   formula sub-item still correctly called out as separately BLOCKED under
   F-03.
6. **§9 Checklist** — Gap 8 item updated from "opened and partially
   resolved" to "fully RESOLVED."
7. **§10 Next Step** — item 0 (run the execution sweep) removed, since it is
   now done; the numbered list re-sequenced starting at 1.
8. Document version bumped 0.7 → 0.8. No PRD/Design/Prototype/AC/Test
   Plan/Test Cases document changed for this revision — this is a
   test-execution-result update only, layered on top of the v0.7
   spec-correction work. `OPEN-FINDINGS.md` F-22 update (to Resolved,
   R-13) is tracked and handled separately, out of this document's scope.

**Change Log — v0.6 → v0.7 (prior revision, 2026-08-31):**

1. **Gap 8 opened and partially closed in the same revision:**
   `RAISE-FR-EXEC-001` (§3) and the Dashboard/Navigation row (§4) previously
   carried real **FAIL**/**FAIL (partial)** results (`TC-EXEC-001-01`/`-02`
   on 2026-08-26, `TC-DASH-01..03` on 2026-08-29) against an "Asset
   Overview"/"Executive Asset Intelligence" wireframe spec (NBV/Risk/
   Utilization tiles; "Asset by Category"/"Executive Summary"/"Recent
   Alerts" sections) that was never built — tracked as Open Finding F-22.
   Per explicit business decision, the spec itself (not the app) was
   corrected on 2026-08-31 across the full chain: `RAISE-DESIGN.md` §13
   (v0.9), `RAISE-PROTOTYPE.md` P-002/P-014 (v0.8), `RAISE-ACCEPTANCE-
   CRITERIA.md` AC-DASH/AC-EXEC-001 (v0.7), `RAISE-TEST-PLAN.md` TS-DASH/
   TS-EXEC-001 (v0.7), and `RAISE-TEST-CASES.md` `TC-DASH-01..03`/
   `TC-EXEC-001-01..02` (v0.7) — all now document/test the actually shipped
   8-tile KPI grid / 10-section dashboard. **The spec-correction half of Gap
   8 is closed; the execution half is explicitly not** — no fresh formal
   test execution has been run against the corrected test cases, and this
   matrix does not assume one would pass. See Gap 8, §6, for the full
   record.
2. **§3 `RAISE-FR-EXEC-001` row rewritten** to state plainly that the prior
   2026-08-26 FAIL result is superseded (not corrected to PASS) by the spec
   fix, and that the row's Test Status is re-derived to `NOT_TESTED
   (re-derived after spec correction; execution pending)` rather than
   assumed to pass. The NBV/Risk absence sub-item (no numbered
   `AC-EXEC-001-03`, per Test Cases §16's own note on why not) remains
   **BLOCKED (partial)**, tied to the pre-existing Open Finding F-03 — unaffected
   by this correction.
3. **§4 Dashboard/Navigation row rewritten** identically in substance: the
   prior 2026-08-29 FAIL result is superseded, not corrected to PASS; Test
   Status re-derived to `NOT_TESTED (re-derived after spec correction;
   execution pending)`. The new `AC-DASH-03`/`TC-DASH-03` (NBV/Risk/
   Utilization absence, a numbered criterion this time, unlike
   AC-EXEC-001's narrative-only note) remains **BLOCKED (partial)**, tied to
   Open Finding F-03, unaffected by this correction.
4. **§6 Gap 8 added**, following the same "record resolution with evidence,
   do not silently close" discipline as Gaps 1–7, but explicitly split into
   a closed sub-item (spec correction) and an open sub-item (formal
   re-execution) rather than marking the whole gap resolved — since only
   half of it actually is.
5. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-EXEC-001`/
   Dashboard-Navigation thread-walk bullet (F-22 → Design → Prototype → AC →
   Test Plan → Test Cases) confirming the spec-correction propagated
   cleanly, and explicitly flagging that every layer in the thread states no
   new execution result is being reported.
6. **§8 Compliance Review Readiness** gained a new standing caveat warning
   Compliance Review not to treat this row as PASS on the strength of the
   spec correction alone.
7. **§9 Checklist** gained a Gap 8 item, explicitly marked partially
   resolved (not fully resolved), mirroring the same discipline used for
   Gap 6 when it was still open in earlier revisions.
8. **§10 Next Step** gained a new highest-priority action (item 0): run a
   fresh formal execution sweep against the corrected `TC-DASH-01..03`/
   `TC-EXEC-001-01..02`, and update this matrix's §3/§4 rows from
   `NOT_TESTED` to the real observed result once run. Also notes that
   `OPEN-FINDINGS.md` F-22 update (Resolved-with-R-number, or "spec
   corrected, re-execution pending") is out of this document's scope and
   handled separately.
9. Version citations updated throughout: Design v0.8 → v0.9, Prototype v0.7
   → v0.8, AC v0.6 → v0.7, Test Plan v0.6 → v0.7, Test Cases v0.6 → v0.7
   (PRD unchanged at v0.11 — confirmed by direct re-read, not assumed, since
   this correction is documentation-only). **No other gap in §6 was found
   open, closed, or newly discovered during this pass** — Gaps 1–7 are
   unchanged from v0.6 and are not re-litigated here; this revision's
   reverse-chain re-verification was scoped to `RAISE-FR-EXEC-001`/
   Dashboard-Navigation specifically, per the instruction that prompted it,
   not a full re-walk of every requirement.

**Change Log — v0.5 → v0.6 (prior revision, 2026-08-29):**

1. **Gap 7 opened and closed in the same revision:** `RAISE-FR-WARRANTY-001`'s
   field-list question (previously PRD §16 Open Question 15, TBD) is now
   resolved via `RAISE-PRD.md` §16 Resolved Question 40 — for MVP, the
   Warranty domain has exactly one field on the Asset record,
   `warrantyExpiry` (already implemented on the Asset record); a draft
   8-field proposal was explicitly rejected, not deferred. Verified
   propagated through `RAISE-DESIGN.md` §5.2, `RAISE-PROTOTYPE.md` §14
   (P-010), `RAISE-ACCEPTANCE-CRITERIA.md` §13 (AC-WARRANTY-001-01/-02, now
   Testable), `RAISE-TEST-PLAN.md` §7/§8 (TS-WARRANTY-001), and
   `RAISE-TEST-CASES.md` §12 (`TC-WARRANTY-001-01`/`-02`, no longer
   BLOCKED). See Gap 7, §6, for the full record.
2. **§3 `RAISE-FR-WARRANTY-001` row rewritten** to reflect the field-list
   resolution while explicitly preserving `AC-WARRANTY-001-03`/
   `TC-WARRANTY-001-03`'s separate, still-open 90-day-expiry-window blocker
   as **BLOCKED (partial)**, unaffected by this resolution — the two
   questions are not conflated.
3. **§7 Chain Consistency Check** gained a dedicated `RAISE-FR-WARRANTY-001`
   thread-walk bullet (PRD → Design → Prototype → AC → Test Plan → Test
   Cases) confirming no stale reference to the previously-rejected 8-field
   (or the older illustrative 3-field) shape remains anywhere in the chain.
4. **§10 Next Step** recommendation list updated: Q15's field-list portion
   is removed from the list of PRD Open Questions still blocking testability
   (replaced with a reference to the narrower, still-open 90-day-window
   threshold that remains under `AC-WARRANTY-001-03`).
5. Version citations updated throughout: PRD v0.9 → v0.11, Prototype v0.6 →
   v0.7, AC v0.5 → v0.6, Test Plan v0.5 → v0.6, Test Cases v0.5 → v0.6
   (Design unchanged at v0.8). **No other gap in §6 was found open, closed,
   or newly discovered during this pass** — Gaps 1–6 are unchanged from
   v0.5 and are not re-litigated here; this revision's reverse-chain
   re-verification was scoped to `RAISE-FR-WARRANTY-001` specifically, per
   the instruction that prompted it, not a full re-walk of every
   requirement (that full re-walk was last performed for v0.5, 2026-08-23).

**Change Log — v0.4 → v0.5 (prior revision, 2026-08-23):**

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

**Next Action:** With the Dashboard/`RAISE-FR-EXEC-001` spec correction
propagated end-to-end and the fresh formal execution sweep against the
corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02` now complete (Gap 8, §6,
fully resolved), with `RAISE-FR-ASSET-002`'s Category/Type sub-taxonomy
spec correction, UI implementation, and execution sweep now also complete
(Gap 9, §6, fully resolved), and with `RAISE-NFR-SEC-RBAC-001`'s Mock-
fallback infrastructure gap now also resolved (Gap 10, §6 — `TC-LOGIN-01`/
`-02` re-executed through the real Login page UI and confirmed PASS,
infrastructure scope only), this matrix's own §3/§4 rows have been updated
to real, evidence-based `PASS`/`PASS (partial)` results. The standing PRD
Open Questions — in particular Q21–Q23 (authentication mechanism, role
list, permission matrix content), which Gap 10's closure explicitly does
**not** resolve — and Gap 4's custody-writing-events question (§8, §10
above) remain the next priority before Development proceeds on the
requirements they block. No document in the chain requires a further
consistency correction at this time.
