# RAISE Requirement Traceability Matrix

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Requirement Traceability Matrix (RTM)
**Version:** 0.4 Draft (full-chain re-sync pass — Maintenance 4-stage workflow, License Roadmap
item, RBAC MVP enforcement level; **critical PRD-version-drift finding, see Gap 6**)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.4, consolidated against [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.4, [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.4, [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.5, [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.7, and — **critically** — [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md), which was **re-read directly for this revision and found to be v0.4, not v0.9** as every downstream document (Design v0.7, Prototype v0.5, AC v0.4, Test Plan v0.4, Test Cases v0.4) claims to be synced against. See **Gap 6 (§6)** — this is the central finding of this revision.
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

**This revision's walk went one step further than usual: the actual current
text of `RAISE-PRD.md` was re-read in full, not assumed from downstream
documents' citations of it.** That extra step is what surfaced Gap 6 (§6) —
every downstream document cites `RAISE-PRD.md` "v0.9" and specific §16
"Resolved Questions" (33–38) and a requirement (`RAISE-FR-LICENSE-001`) that
**do not exist in the actual `RAISE-PRD.md` file on disk**, which is v0.4 and
whose Resolved Questions stop at 32. This is reported as a new, **open**,
critical gap — not silently accepted on the downstream documents' word.

---

## 2. Status Legend

Per `RAISE-PRD.md` §17, each requirement below carries a **Test Status**
using the recommended values:

`PASS · PARTIAL · FAIL · BLOCKED · NOT_IMPLEMENTED · NOT_TESTED`

At this stage (no source code exists yet), every requirement is
**NOT_TESTED** by default; requirements with any BLOCKED test case in
`RAISE-TEST-CASES.md` are marked **BLOCKED** instead, to distinguish
"not yet run" from "cannot be fully run until an Open Question is
resolved."

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

**New this revision:** where a Test Status below rests on a "business
confirmed" claim that traces to one of the PRD §16 Resolved Questions
**33–38** or to `RAISE-FR-LICENSE-001`, that status is additionally
annotated **"⚠ PRD-drift"** — meaning the confirmation is asserted by
Design/Prototype/AC/Test Plan/Test Cases but **could not be verified against
the actual `RAISE-PRD.md` file**, which does not contain those Resolved
Questions or that requirement. See Gap 6 (§6) for the full explanation. This
annotation does not change the underlying BLOCKED/PARTIAL classification
already assigned downstream — it flags that the classification's stated
justification is unverified at the source-of-truth layer.

---

## 3. Master Traceability Matrix — MVP Requirements

| PRD Requirement | Title | Priority/Scope | Design Area | Prototype Screen(s) | AC Group(s) | Suite ID(s) | TC ID(s) | Test Status |
|---|---|---|---|---|---|---|---|---|
| `RAISE-FR-ASSET-001` | Asset Registry | P0 / MVP | §4.1 Asset Management | P-003, P-004 | AC-ASSET-001, AC-ASSET-001-DETAIL | TS-ASSET-001, TS-ASSET-001-DETAIL | TC-ASSET-001-01..04, TC-ASSET-001-D-01..02 | BLOCKED (TC-ASSET-001-01 partial) |
| `RAISE-FR-ASSET-002` | Category & Hierarchy | P0 / MVP | §4.1 Asset Management | P-005 | AC-ASSET-002 | TS-ASSET-002 | TC-ASSET-002-01..02 | BLOCKED (TC-ASSET-002-01 partial) |
| `RAISE-FR-ASSET-003` | Custody History | P0 / MVP | §4.2 Custody & Asset Operations | P-006 | AC-ASSET-003 | TS-ASSET-003 | TC-ASSET-003-01..03 | BLOCKED (TC-ASSET-003-01 partial — holder model TBD, PRD §16 Q13; TC-ASSET-003-03 partial — exclusivity scope only, see Gap 4) |
| `RAISE-FR-OPS-001` | QR / Barcode | P0 / MVP | §4.2 Custody & Asset Operations | P-007 | AC-OPS-001 | TS-OPS-001 | TC-OPS-001-01..03 | NOT_TESTED (no blockers) |
| `RAISE-FR-OPS-002` | Check-in / Check-out | P0 / MVP | §4.2 Custody & Asset Operations | P-008 | AC-OPS-002 | TS-OPS-002 | TC-OPS-002-01..03 | BLOCKED (TC-OPS-002-01, -02 partial; role gate cites RBAC MVP-enforcement-level confirmation — ⚠ PRD-drift, see Gap 6) |
| `RAISE-FR-MAINT-001` | Maintenance (4-stage workflow: User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution) | P0 / MVP | §5.1 Maintenance Domain | P-009 | AC-MAINT-001 (expanded to AC-MAINT-001-01..09 this revision) | TS-MAINT-001 | TC-MAINT-001-01..09 | BLOCKED — TC-MAINT-001-01 partial (field model TBD); -04, -05, -06, -07, -08 partial (delegated-approver rule / Reject-Request-Info resulting state / RBAC role gate all TBD); -02, -03, -09 not blocked (record history display, User Requisition submit, and stage-progress indicator are fully testable now). **The entire 4-stage workflow's "business-confirmed" status (PRD §16 Resolved Question 33) is ⚠ PRD-drift — see Gap 6: this Resolved Question does not exist in the actual `RAISE-PRD.md` file, which still states the maintenance workflow is fully TBD.** |
| `RAISE-FR-WARRANTY-001` | Warranty | P0 / MVP | §5.2 Warranty Domain | P-010 | AC-WARRANTY-001 | TS-WARRANTY-001 | TC-WARRANTY-001-01..03 | BLOCKED (TC-WARRANTY-001-01, -03 partial) |
| `RAISE-FR-ORACLE-001` | Oracle FA Integration + NBV/Depreciation | P0 / MVP | §6 Oracle FA Integration (incl. §6.4 "Phase 6" label note — ⚠ PRD-drift, see Gap 6) | P-011 | AC-ORACLE-001 | TS-ORACLE-001 | TC-ORACLE-001-01..04 | BLOCKED (TC-ORACLE-001-01 partial). `ReconciliationPage`↔`RAISE-FR-ORACLE-001` mapping remains an explicitly open question in every layer (PRD Open Question 10a as originally listed — the label-clarification citation to "Resolved Question 37" is ⚠ PRD-drift, but the *substance*, that the mapping is unresolved, is unaffected and still correctly treated as open everywhere). |
| `RAISE-FR-ALERT-001` | Alerts | P0 / MVP | §14 Alert Architecture | P-012 | AC-ALERT-001 | TS-ALERT-001 | TC-ALERT-001-01..02 | BLOCKED (TC-ALERT-001-01 partial) |
| `RAISE-FR-AUDIT-001` | Immutable Audit Log | P0 / MVP | §15 Audit Architecture | P-013 | AC-AUDIT-001 | TS-AUDIT-001 | TC-AUDIT-001-01..03 | BLOCKED (TC-AUDIT-001-01, -03 partial) |
| `RAISE-FR-EXEC-001` | Executive Dashboard | P0 / MVP | §13 Executive Intelligence | P-014 | AC-EXEC-001 | TS-EXEC-001 | TC-EXEC-001-01..02 | BLOCKED (TC-EXEC-001-01 partial — NBV/Risk formulas/thresholds still TBD, PRD §16 Q3/Q4; Utilization definition testable now for presence + description (PRD §16 Resolved Question 27, real, confirmed present in the actual PRD file); Utilization calculation mechanics (real-time-snapshot aggregation, Disposed/Retired/Under-Maintenance denominator exclusions, PRD §16 Resolved Question 29 — also confirmed present in the actual PRD file) remain BLOCKED (partial) pending further design/AC/test pass; TC-EXEC-001-02 partial — Executive Summary AI-generated-vs-static unresolved, PRD §8.1 gap) |
| `RAISE-AI-SEARCH-001` | Natural Language Search | P0 / MVP (Current AI) | §9 Natural Language Search, §8.2 AI Flow, §20 Error Handling | P-015 | AC-AI-SEARCH-001, AC-AI-STATES | TS-AI-SEARCH-001, TS-AI-STATES | TC-AI-SEARCH-001-01..03, TC-AI-STATES-01..05 | BLOCKED (TC-AI-SEARCH-001-02 partial) |
| `RAISE-FR-LIFE-001` | Asset Lifecycle Connectivity | P0 / MVP (Product Foundation) | §4.2 Conceptual State, §9 Asset Lifecycle | P-004 (Lifecycle section) | AC-LIFE-001 | TS-LIFE-001 | TC-LIFE-001-01..04 | BLOCKED (TC-LIFE-001-01, -02, -04 partial; TC-LIFE-001-03 OUT OF SCOPE FOR MVP — Disposal confirmed Enterprise Roadmap, 2026-08-21, PRD §16 Resolved Question 26 — confirmed present in the actual PRD file, not affected by Gap 6) |
| `RAISE-AI-DOC-001` | OCR / Extraction | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-004 (incidental, no dedicated screen) | AC-AI-DOC-001 | TS-AI-DOC-001 | TC-AI-DOC-001-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; document scope/accuracy threshold undefined (PRD §7 Open Question). Confirmed present in the actual PRD file (§16 Resolved Question 28, 30) — not affected by Gap 6. |
| `RAISE-AI-DOC-002` | Metadata | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-004 (incidental, no dedicated screen) | AC-AI-DOC-002 | TS-AI-DOC-002 | TC-AI-DOC-002-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; metadata fields/tags/surfacing undefined. Confirmed present in the actual PRD file (§16 Resolved Question 28, 31) — not affected by Gap 6. |
| `RAISE-AI-DOC-003` | Classification | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-005 (incidental, no dedicated screen) | AC-AI-DOC-003 | TS-AI-DOC-003 | TC-AI-DOC-003-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; taxonomy/UI-confirmation detail undefined. Confirmed present in the actual PRD file (§16 Resolved Question 28, 32) — not affected by Gap 6. |
| `RAISE-AI-DOC-004` | Duplicate Detection | P0 / MVP (Current AI) | §9A Document Intelligence Capabilities | P-003 (incidental, no dedicated screen) | AC-AI-DOC-004 | TS-AI-DOC-004 | TC-AI-DOC-004-01 | **BLOCKED (full)** — sole criterion NOT TESTABLE YET; matching threshold/merge-vs-flag workflow undefined, explicitly asked and left unanswered (PRD §16 Open Question 20a). Confirmed present in the actual PRD file — not affected by Gap 6. |

---

## 4. Master Traceability Matrix — Supporting / Cross-Cutting Items

These items do not map to a single numbered `RAISE-FR-*` requirement but
are carried through the chain and must remain traceable.

| Item | Title | PRD Basis | Design Area | Prototype Screen | AC Group | Suite ID | TC ID(s) | Test Status |
|---|---|---|---|---|---|---|---|---|
| `RAISE-NFR-SEC-RBAC-001` | Security & RBAC | PRD §11 (TBD in the actual PRD file — see below) | §16 Security Architecture (incl. "MVP Enforcement Level" subsection) | P-001 | AC-LOGIN | TS-LOGIN | TC-LOGIN-01..03 | BLOCKED (all 3 partial — auth mechanism and role model undefined, PRD §16 Q21–Q22). **"MVP Enforcement Level" (UI-only/client-side for MVP, backend deferred to Roadmap) is cited everywhere downstream as PRD §16 Resolved Question 38 — this is ⚠ PRD-drift (see Gap 6): the actual `RAISE-PRD.md` §11 still reads "not sufficiently specified," with no enforcement-level resolution present.** The role list/permission matrix content remains TBD regardless, so the Test Status classification itself (BLOCKED, all partial) is unchanged — only the specific "enforcement level is confirmed" narrative that downstream documents rely on is unverified against the real PRD. |
| Dashboard / Navigation | Main Dashboard | PRD §8.1 (KPI concepts only) | §13 Executive Intelligence (KPI reuse) | P-002 | AC-DASH | TS-DASH | TC-DASH-01..03 | BLOCKED (TC-DASH-01 partial — NBV/Risk value correctness still unconfirmed, PRD §16 Q3/Q4; Utilization presence/definition testable now (PRD §16 Resolved Question 27, confirmed present in actual PRD); calculation mechanics (PRD §16 Resolved Question 29, also confirmed present) remain BLOCKED (partial)) |

### 4.1 PRD-Listed Capabilities Previously Without a Traceability ID — Resolved (unaffected by Gap 6)

**Unchanged from the prior revision.** `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004`
were confirmed at Priority P0 / Scope MVP via PRD §16 Resolved Question 28
(and further acceptance detail via Resolved Questions 30–32 for the first
three) — **both of these were re-verified this revision to actually exist in
the current `RAISE-PRD.md` file** (§7, §13, §16, §17), unlike the
Resolved-Question-33–38 items flagged in Gap 6. Each has a full chain and a
real row in §3 above, all correctly marked **BLOCKED (full)**, since detailed
acceptance behavior for `RAISE-AI-DOC-004` (and residual numeric-threshold /
design-phase detail for the other three) remains PRD-level TBD. See Gap 5
(§6) for the still-open residual TBDs this resolution does not close.

---

## 5. Roadmap / Pilot Items — Explicitly Out of Test Scope

Per PRD §14 (Enterprise Roadmap) and §7 (AI capability classification),
these have **no Design detail beyond a concept diagram, no Prototype
screen, no AC group, no Suite, and no Test Case** — consistent exclusion
end-to-end, not a coverage gap:

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
| — | Asset Disposal workflow (`RAISE-FR-LIFE-001` terminal stage) | ROADMAP | §4.2 Conceptual State (concept only) | None | None (`TC-LIFE-001-03` retained as an inactive Out-of-Scope row, not a real Suite/TC) — confirmed present in actual PRD §14 item 7 / §16 Resolved Question 26, unaffected by Gap 6 |
| `RAISE-FR-LICENSE-001` ⚠ | Software / SaaS License Management | **ROADMAP per every downstream document (Design v0.7 §4.1A/§5.3/§14/§22, Prototype v0.5 P-016/P-017, AC v0.4 §3 traceability note, Test Plan v0.4 §3.2) — but this requirement ID, its Roadmap classification, and PRD §16 "Resolved Question 34" do not exist anywhere in the actual `RAISE-PRD.md` file** (verified by direct re-read + grep this revision: no match for `RAISE-FR-LICENSE-001` in `RAISE-PRD.md`). It has a full Design area, two dedicated Prototype screens (P-016, P-017), and an AC/Test-Plan traceability note — all consistently treating it as Roadmap-not-MVP, which is the *correct* outcome if the requirement is real, but **the requirement's very existence in the PRD source of truth is unverified.** See Gap 6 (§6). | §4.1A, §5.3 (correctly marked Roadmap, not MVP, in the design text) | P-016 License Inventory, P-017 License Detail (Roadmap-labeled) | AC: traceability note only (no AC group, correctly per Roadmap rule) · Suite: none (correctly, per Roadmap rule) · TC: none |

**Important note on the `RAISE-FR-LICENSE-001` row above:** every downstream
document already treats this item exactly the way this section requires a
Roadmap item to be treated (no MVP AC group, no Suite, no Test Case) — so
*if* the requirement is real, there is no scope-creep problem. The problem
is one layer up: **there is currently no PRD requirement to point to.** This
matrix lists it here, flagged, rather than silently omitting it, because
omitting it would hide from a reviewer that five dedicated artifacts already
exist across Design/Prototype/AC/Test Plan for a requirement whose PRD
authority cannot currently be confirmed.

If any Roadmap/Pilot item is promoted to MVP, it must re-enter the chain at
`RAISE-PRD.md` first (scope change), then Design, then Prototype, then
Acceptance Criteria, then Test Plan/Cases — this matrix will not be
back-filled with test coverage that skipped those steps. **`RAISE-FR-LICENSE-001`
is a different situation from a normal Roadmap item: it needs to *enter* the
PRD for the first time (or have its absence explained), not be "promoted."**

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
26 (confirmed present in the actual PRD file this revision), Design §4.2,
AC §7.5, Test Plan, Test Cases, and §5 above. Re-confirmed this revision —
no drift.

**Gap 3 (resolved 2026-08-21, incl. follow-through):** Q12/Q22 role-gate
attribution was under-documented at the AC layer (§20) and had not
propagated to Test Plan/Test Cases. Both fixed directly in
`RAISE-ACCEPTANCE-CRITERIA.md`, `RAISE-TEST-PLAN.md`, and
`RAISE-TEST-CASES.md`. Re-confirmed this revision — no drift; Q22's
role-gate note appears consistently at AC §15/§16/§20, Test Plan §7/§8, and
Test Cases TC-ALERT-001-01/TC-AUDIT-001-03. (Note: the *new* RBAC
"enforcement-level" material added to AC-LOGIN/AC-OPS-002/AC-MAINT-001 this
revision is a **different** item — see Gap 6, not a re-opening of Gap 3.)

**Gap 4 (resolved 2026-08-21, matrix-layer sync only):** this matrix's own
§3 row for `RAISE-FR-ASSET-003` had not been re-synced to reflect
`TC-ASSET-003-03`'s BLOCKED (partial) status already correctly recorded in
`RAISE-TEST-CASES.md`/`RAISE-TEST-PLAN.md`. Corrected in this matrix; no
upstream document required a change. **Still open, not part of Gap 4's
closure:** the underlying business question (whether Custody History is
written only by Check-in/Check-out) remains unresolved — no new Open
Question proposed; PRD's existing "Duplicated / Overlapping Requirements"
entry already covers it. Re-confirmed this revision — no drift.

**Gap 5 (resolved 2026-08-21, both sub-items):** Utilization KPI definition
(PRD §16 Resolved Question 27) and the four AI-DOC capabilities'
Traceability IDs (PRD §16 Resolved Question 28) were each closed via a real,
verified `RAISE-PRD.md` change. **Re-verified again this revision by direct
re-read of the current `RAISE-PRD.md` file:** Resolved Questions 27, 28,
29 (Utilization calculation mechanics), 30, 31, 32 (AI-DOC-001/002/003
acceptance detail) all genuinely exist in the current PRD text (§7, §8,
§16). This is an important contrast with Gap 6 below — Gap 5's closures are
**real**, Gap 6's are **not**. Residual TBD items (Utilization calculation
mechanics' further threshold detail; `RAISE-AI-DOC-004`'s fully-undefined
acceptance behavior) remain open exactly as before, tracked in §3/§4 above.

---

### Gap 6 (NEW, OPEN, CRITICAL — chain-integrity gap, not a matrix-layer sync issue)

**Finding:** Design v0.7, Prototype v0.5, `RAISE-ACCEPTANCE-CRITERIA.md`
v0.4, `RAISE-TEST-PLAN.md` v0.4, and `RAISE-TEST-CASES.md` v0.4 **all**
state they are synced against `RAISE-PRD.md` **v0.9**, and all cite specific
PRD §16 **"Resolved Questions 33 through 38"** and a new PRD requirement
**`RAISE-FR-LICENSE-001`** as the business-confirmed basis for several
substantial pieces of downstream work. This matrix re-read the actual
`RAISE-PRD.md` file directly for this revision (not trusting downstream
citations) and confirmed by both full read and targeted grep:

- The current `RAISE-PRD.md` file's own header and Document Status both
  read **"Version: 0.4"**, not v0.9.
- Its §16 "Resolved Questions" list runs only **26 through 32** — there is
  no Resolved Question 33, 34, 35, 36, 37, or 38 anywhere in the file.
- There is **no `RAISE-FR-LICENSE-001` entry anywhere** in the file — not
  in §6 Functional Requirements, not in §13 MVP Scope, not in §14 Enterprise
  Roadmap, not in §17 Requirement Traceability Matrix. `grep` for the exact
  string `RAISE-FR-LICENSE-001` against `RAISE-PRD.md` returns **zero
  matches**.
- PRD §11 (Security & RBAC) still reads that security is "not sufficiently
  specified," with **no** enforcement-level decision recorded — contradicting
  the "MVP Enforcement Level — Resolved 2026-08-21 (PRD v0.9, §16 Resolved
  Question 38)" subsection that `RAISE-DESIGN.md` §16 and every downstream
  document that inherits it (`RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`,
  `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`) present as settled.
- PRD's actual `RAISE-FR-MAINT-001` entry still reads "Complete maintenance
  workflow, SLA, vendor model, and cost model are not defined" (Open
  Question, §16 Q14) — with **no** confirmation of the 4-stage workflow
  shape anywhere in the file, contradicting the "4-stage workflow shape
  confirmed 2026-08-21, PRD §16 Resolved Question 33" claim repeated across
  Design §5.1, Prototype §15/§26/§27, AC §12/§20/§21, Test Plan §7/§8, and
  Test Cases (`TC-MAINT-001-03..09`, all newly added this cycle on the
  strength of that claim).
- PRD's Open Question list does not contain an item numbered "10a" in the
  form Design §6.4/§25 describes (Oracle FA "Phase 6" label / Resolved
  Question 37) — although this particular instance is **lower severity**,
  because the *conclusion* downstream documents reach (the "Phase 6" code
  comment is not a PRD phase, and the `ReconciliationPage`↔
  `RAISE-FR-ORACLE-001` mapping remains unresolved) is actually consistent
  with what the real PRD does and does not say — it is only the specific
  citation to a numbered "Resolved Question 37" that is unverifiable, not
  the substantive conclusion.
- Similarly, the six ESAPS-reference-only pages' out-of-scope confirmation
  (cited as "PRD §16 Resolved Question 35") and `RAISE-AI-RECOMMEND-001`'s
  Roadmap re-confirmation (cited as "Resolved Question 36") are not present
  in the real PRD text either, though — as with "Phase 6" above — the
  *conclusions* these citations support (ESAPS pages out of scope; AI
  Recommendation stays Roadmap) do not actually contradict anything the real
  PRD states; they are simply uncited/unconfirmed at the source-of-truth
  layer rather than confirmed-but-wrong.

**Why this matters (severity):** this is not a documentation-consistency
slip like Gap 4 (a stale summary cell in this matrix). It is a break in the
chain's fundamental discipline — stated repeatedly throughout every document
in this vault (`CLAUDE.md`; each document's own §1/§2; the PRD's own "no
silent resolution" rule) — that **PRD is the sole source of truth** and that
no downstream document may treat a requirement or business decision as
confirmed unless it is actually recorded in `RAISE-PRD.md`. Five downstream
documents did exactly that: they built (a) an entire new requirement
(`RAISE-FR-LICENSE-001`) with two dedicated Prototype screens, a Design
component, and Roadmap-scope handling across AC/Test Plan; and (b) a fully
elaborated 9-criterion AC group, a 9-case test suite, and a matching state
model for `RAISE-FR-MAINT-001`'s 4-stage workflow — on top of PRD content
that, whatever its origin (a simulated or drafted `/update-prd` session
whose output was described in downstream change logs but never actually
written back into `RAISE-PRD.md`), is **not present in the actual PRD file
today.**

**What this matrix does *not* do about it:** per this document's own rule
("no gap may be closed here without a real upstream document change"), this
gap **cannot be closed by this matrix**. It also cannot be closed by
reverting the downstream documents, since editing them is out of scope for
this agent. The Test Status values in §3/§4 above are left exactly as
recorded downstream (BLOCKED/BLOCKED (partial)/BLOCKED (full), matching each
document's own current text) — this matrix does not invent a *worse* status
either. What this matrix does is **annotate every affected cell with ⚠
PRD-drift** and record this gap prominently so a reader does not mistake
"BLOCKED (partial), business confirmed" for an actually-verified business
decision when the citation supporting "confirmed" cannot be traced to the
real PRD.

**Affected items (all remain OPEN pending a real PRD update):**

1. `RAISE-FR-LICENSE-001` (§5 above) — entire requirement unconfirmed at the
   PRD layer.
2. `RAISE-FR-MAINT-001`'s 4-stage workflow and state model (§3 above,
   `AC-MAINT-001-03..09`, `TS-MAINT-001`, `TC-MAINT-001-03..09`) —
   workflow-shape "confirmation" unconfirmed at the PRD layer; the PRD's own
   text still lists this as fully open.
3. `RAISE-NFR-SEC-RBAC-001`'s "MVP Enforcement Level" decision (UI-only/
   client-side for MVP, backend deferred to Roadmap) — cited in AC-LOGIN,
   AC-OPS-002, AC-MAINT-001, TS-LOGIN, TS-OPS-002, TS-MAINT-001 — unconfirmed
   at the PRD layer; PRD §11 still says security is "not sufficiently
   specified."
4. The six ESAPS-reference-only out-of-scope pages and the
   `RAISE-AI-RECOMMEND-001` Roadmap re-confirmation — lower severity, since
   the conclusions do not contradict the real PRD, but the specific Resolved
   Question citations (35, 36) are unverifiable.
5. The Oracle FA "Phase 6" label clarification — lowest severity, same
   reasoning as item 4.

**What would close this gap:** an actual `/update-prd` session whose output
is written into `RAISE-PRD.md` itself (raising its version past v0.4, adding
real Resolved Questions 33+ and, if confirmed, a real `RAISE-FR-LICENSE-001`
entry) — followed by re-verification that Design/Prototype/AC/Test Plan/Test
Cases' existing citations now match real PRD content. Until then, this
matrix records the current state as: **downstream documents are internally
consistent with each other, but not verifiably consistent with the actual
PRD file.**

**No new Open Question is proposed for the substance of Maintenance's
4-stage workflow, License Management's scope, or RBAC's enforcement level**
— those already have a place to live (PRD §16 Q14, a new License entry if
confirmed, and PRD §11/§16 Q21-Q23 respectively). What is being flagged here
is procedural/integrity: the confirmations claimed to exist for them do not
currently exist in the PRD source of truth, regardless of what the correct
business answer eventually turns out to be.

---

## 7. Chain Consistency Check

Performed by walking every ID backward through the chain, **and this
revision, by re-reading the actual current text of every document in the
chain including a full direct re-read of `RAISE-PRD.md` itself, rather than
relying on any downstream document's citation of an upstream document's
content:**

- Every `TC-*` ID in `RAISE-TEST-CASES.md` maps to exactly one `AC-*`
  criterion in `RAISE-ACCEPTANCE-CRITERIA.md`. ✅ No orphan test cases,
  including the seven new `TC-MAINT-001-03..09` cases (all map to
  `AC-MAINT-001-03..09`).
- Every AC Group maps to exactly one Suite ID in `RAISE-TEST-PLAN.md` §7.
  ✅ No orphan AC groups.
- Every Suite ID maps to exactly one screen in `RAISE-PROTOTYPE.md` §27.
  ✅ No orphan suites.
- Every screen maps to a Design Area in `RAISE-DESIGN.md` §24. ✅ No orphan
  screens.
- Every `RAISE-FR-*` / `RAISE-AI-*` ID appearing in §3/§4/§5 above matches
  an ID in `RAISE-PRD.md` §17 — **with one confirmed exception this
  revision: `RAISE-FR-LICENSE-001`, which appears throughout Design,
  Prototype, AC, and Test Plan, but does NOT appear in `RAISE-PRD.md` §17
  (or anywhere else in the PRD file). This is Gap 6, tracked as open, not
  silently waived.**
- `RAISE-FR-LIFE-001`, Gaps 1–5 (§6): re-confirmed resolved, no drift, as
  detailed in each gap's entry above.
- **`RAISE-FR-MAINT-001` 4-stage workflow — thread walked end-to-end this
  revision:** Design §5.1 → Prototype §15/§26/§27 → AC §12/§20/§21 → Test
  Plan §7/§8 → Test Cases `TC-MAINT-001-03..09`. Every layer is internally
  consistent with every other layer (the same workflow shape, state names,
  and TBD items are repeated identically at each layer) — **but the thread's
  root citation, `RAISE-PRD.md` §16 Resolved Question 33, does not exist in
  the actual PRD file.** The thread is complete and self-consistent
  *downstream of the PRD*; it is not verifiably anchored *to* the PRD. This
  is recorded as Gap 6, not treated as "thread confirmed."
- **`RAISE-FR-LICENSE-001` Roadmap-only scope — thread walked end-to-end
  this revision:** Design §4.1A/§5.3/§14/§22/§24 → Prototype §5/§22/§23/§27
  → AC §3 (traceability note only) → Test Plan §3.2 (no suite). Every layer
  agrees the item is Roadmap, not MVP — so if the requirement is confirmed
  to exist, **no scope-creep occurred** (no MVP test coverage was
  accidentally built for it). But the requirement's root citation
  (`RAISE-PRD.md` §16 Resolved Question 34, and the requirement definition
  itself) does not exist in the actual PRD file. Same conclusion as above:
  self-consistent downstream, not verifiably anchored to the PRD. Gap 6.
- **`RAISE-NFR-SEC-RBAC-001` MVP enforcement level — thread walked this
  revision:** Design §16 → Prototype §4/§7/§9 → AC §4/§11/§12/§20/§21 → Test
  Plan §7/§8. All layers consistently describe "UI-only/client-side for MVP,
  backend deferred to Roadmap" as confirmed via PRD §16 Resolved Question
  38. The actual PRD §11 text contains no such resolution. Gap 6.
- Full re-walk confirmed no other Test Status cell in §3/§4 has drifted from
  the current text of `RAISE-TEST-CASES.md` v0.4 (cross-checked TC-by-TC):
  `RAISE-FR-ASSET-001..003`, `RAISE-FR-OPS-001/002`, `RAISE-FR-WARRANTY-001`,
  `RAISE-FR-ORACLE-001`, `RAISE-FR-ALERT-001`, `RAISE-FR-AUDIT-001`,
  `RAISE-FR-EXEC-001`, `RAISE-AI-SEARCH-001`, `RAISE-FR-LIFE-001`,
  `RAISE-AI-DOC-001..004`, and the Dashboard/Navigation row all match their
  respective TC Blocked-column text exactly (beyond the ⚠ PRD-drift
  annotations added this revision, which do not change any classification).

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

**Readiness caveat (new this revision — see Gap 6):** before Development
starts building against `RAISE-FR-MAINT-001`'s 4-stage workflow,
`RAISE-FR-LICENSE-001` (even as a Roadmap placeholder), or
`RAISE-NFR-SEC-RBAC-001`'s "UI-only enforcement is acceptable for MVP"
decision, the actual `RAISE-PRD.md` file needs to be brought up to the
version every other document already assumes it is at. Building against
Design/Prototype/AC/Test Plan's current text for these three items means
building against a business decision that cannot currently be verified in
the source of truth. This does not block Development on the *other*
requirements in §3, which are unaffected by Gap 6.

---

## 9. Traceability Matrix Review Checklist

- [x] Every PRD MVP requirement (§13 of the PRD) appears in §3 above
- [x] Every supporting/cross-cutting item appears in §4, explicitly
      labeled as not mapping to a single `RAISE-FR-*` ID
- [x] Every Pilot/Roadmap item appears in §5 with no test coverage
      columns filled in (including `RAISE-FR-LICENSE-001`, flagged per Gap 6)
- [x] Gaps 1–5 (§6) are re-confirmed resolved with no drift this revision
- [ ] **Gap 6 (§6) is OPEN and CRITICAL** — the actual `RAISE-PRD.md` file
      (v0.4) does not contain the content (§16 Resolved Questions 33–38;
      `RAISE-FR-LICENSE-001`) that Design v0.7, Prototype v0.5, AC v0.4, Test
      Plan v0.4, and Test Cases v0.4 all cite as their basis for treating
      `RAISE-FR-MAINT-001`'s 4-stage workflow, `RAISE-FR-LICENSE-001`, and
      `RAISE-NFR-SEC-RBAC-001`'s MVP enforcement level as business-confirmed.
      This must be resolved — by an actual PRD update, or by correcting the
      downstream documents' citations — before those three items are treated
      as ready for Development.
- [x] Chain consistency (§7) has been re-verified this revision, including a
      direct re-read of `RAISE-PRD.md` itself (not just downstream
      citations of it) — this is what surfaced Gap 6
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

Gaps 1–5 (§6) are all resolved and re-confirmed with no drift this revision.

**Gap 6 (§6) is open and is the priority item before Development proceeds
on the affected requirements.** Recommended next action, in order:

1. Determine whether `RAISE-FR-MAINT-001`'s 4-stage workflow,
   `RAISE-FR-LICENSE-001`, and `RAISE-NFR-SEC-RBAC-001`'s MVP enforcement
   level were ever actually confirmed by business (i.e., whether a real
   `/update-prd` session happened whose output simply never got written
   into `RAISE-PRD.md`), or whether these were introduced downstream without
   a real business confirmation at all.
2. If confirmed: run `/update-prd` for real and write the corresponding
   Resolved Questions and (if applicable) the `RAISE-FR-LICENSE-001`
   requirement into `RAISE-PRD.md` itself, bumping its version past v0.4.
   Then re-verify this matrix's ⚠ PRD-drift annotations and remove them
   once the citations resolve cleanly.
3. If not confirmed: the downstream documents' claims need to be corrected
   at their source (out of scope for this matrix to do, since this agent
   may only edit this file) — `RAISE-FR-MAINT-001`'s AC/Test Plan/Test Cases
   content built on the 4-stage workflow, and `RAISE-FR-LICENSE-001`'s
   Design/Prototype/AC/Test Plan content, would need to be reverted or
   re-marked as unconfirmed pending an actual business decision.
4. Independent of Gap 6, the remaining outstanding PRD Open Questions
   (Q1–Q25, Q3/Q4's residual formula/threshold portion, the
   custody-writing-events exclusivity question underlying Gap 4, and
   `RAISE-AI-DOC-004`'s fully-open acceptance behavior) should still be
   reviewed with Product/Business before Development on the requirements
   they block.

---

## Document Status

**Version:** 0.4 (full-chain re-sync pass — Maintenance 4-stage workflow,
License Roadmap item, RBAC MVP enforcement level reflected; **Gap 6 opened,
critical PRD-version-drift finding**)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.4 and full upstream chain — `RAISE-TEST-PLAN.md` v0.4, `RAISE-ACCEPTANCE-CRITERIA.md` v0.4, `RAISE-PROTOTYPE.md` v0.5, `RAISE-DESIGN.md` v0.7, and `RAISE-PRD.md` (re-read directly this revision: actual file version is **v0.4**, not the v0.9 every downstream document cites)
**Reference:** VERSCAN only
**Last Re-Verified:** 2026-08-21 (full-chain re-sync pass) — re-read
`RAISE-TEST-CASES.md` v0.4, `RAISE-TEST-PLAN.md` v0.4,
`RAISE-ACCEPTANCE-CRITERIA.md` v0.4, `RAISE-PROTOTYPE.md` v0.5,
`RAISE-DESIGN.md` v0.7, and — critically — `RAISE-PRD.md` itself, end to
end. All ID cross-checks in §7 re-run.

**Change Log — v0.3 → v0.4 (this revision):**

1. **`RAISE-FR-MAINT-001` row expanded** in §3 to reflect the confirmed
   4-stage workflow's downstream coverage: `AC-MAINT-001-03..09`,
   `TS-MAINT-001` (unchanged Suite ID, expanded scope), and
   `TC-MAINT-001-03..09` (seven new test cases). Test Status updated to
   itemize which of the nine test cases are blocked vs. testable now.
2. **`RAISE-FR-LICENSE-001` added to §5** (Roadmap/Pilot table) — the first
   time this requirement appears in this matrix, since it is new to the
   downstream chain this cycle.
3. **`RAISE-NFR-SEC-RBAC-001` row in §4 updated** to note the "MVP
   Enforcement Level" decision cited throughout AC-LOGIN/AC-OPS-002/
   AC-MAINT-001 and their Suites.
4. **Gap 6 opened (new, critical):** while performing the chain re-walk for
   items 1–3 above, this matrix — for the first time — re-read the actual
   `RAISE-PRD.md` file directly (rather than relying on downstream
   documents' citations of "PRD v0.9") and found that the file is v0.4, does
   not contain §16 Resolved Questions 33–38, and does not contain a
   `RAISE-FR-LICENSE-001` requirement anywhere. This means the "business
   confirmed" basis cited by Design v0.7, Prototype v0.5, AC v0.4, Test Plan
   v0.4, and Test Cases v0.4 for items 1–3 above cannot be verified against
   the source of truth. Recorded in full in §6 Gap 6, with every affected
   cell in §3/§4/§5 annotated ⚠ PRD-drift. **This is an open gap — it is not
   resolved by this revision**, since resolving it requires either a real
   PRD update or a correction to the downstream documents, neither of which
   this matrix can perform itself.
5. Gaps 1–5 (§6) re-confirmed still resolved with no drift, including a
   direct re-verification that Resolved Questions 26–32 (unlike 33–38) do
   genuinely exist in the current `RAISE-PRD.md` text.
6. Chain Consistency Check (§7) re-run against the actual current text of
   every document, including `RAISE-PRD.md` directly.

**Next Action:** Resolve Gap 6 before Development proceeds on
`RAISE-FR-MAINT-001`'s 4-stage workflow, `RAISE-FR-LICENSE-001`, or any
`RAISE-NFR-SEC-RBAC-001`-dependent work item — either by running a real
`/update-prd` session whose output is actually written into `RAISE-PRD.md`
(if these were genuinely business-confirmed and simply never recorded), or
by correcting the affected downstream documents if they were not. In
parallel, continue tracking the pre-existing outstanding PRD Open Questions
(Q1–Q25, Q3/Q4's residual formula/threshold portion, Gap 4's
custody-writing-events question, and `RAISE-AI-DOC-004`'s acceptance
behavior) before implementation proceeds against the requirements they
block — none of those are new to this revision, and none are affected by
Gap 6.
