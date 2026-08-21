# RAISE Requirement Traceability Matrix

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Requirement Traceability Matrix (RTM)
**Version:** 0.3 Draft (full-chain re-sync — Gap 5 resolution pass)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.3, consolidated against [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) v0.3, [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) v0.3, [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.3, [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.4, [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.3
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

As of `RAISE-TEST-CASES.md` v0.3, two distinct flavors of BLOCKED exist
upstream and are carried into this matrix's Test Status column:

- **BLOCKED (partial)** — some structural/interaction behavior is
  testable now; only part of the criterion's correctness is pending an
  Open Question (e.g., tile presence testable, tile value not).
- **BLOCKED (full)** — the entire AC criterion is NOT TESTABLE YET, with
  no fallback structural behavior, because no concrete UI element or
  business rule exists yet in any prior-stage document (only a reserved
  screen location). First introduced this revision for
  `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` (§3 below) — the row is retained
  for 1:1 traceability, not omitted, even though nothing can be executed
  against it yet.

---

## 3. Master Traceability Matrix — MVP Requirements

| PRD Requirement | Title | Priority/Scope | Design Area | Prototype Screen(s) | AC Group(s) | Suite ID(s) | TC ID(s) | Test Status |
|---|---|---|---|---|---|---|---|---|
| `RAISE-FR-ASSET-001` | Asset Registry | P0 / MVP | §4.1 Asset Management | P-003, P-004 | AC-ASSET-001, AC-ASSET-001-DETAIL | TS-ASSET-001, TS-ASSET-001-DETAIL | TC-ASSET-001-01..04, TC-ASSET-001-D-01..02 | BLOCKED (TC-ASSET-001-01 partial) |
| `RAISE-FR-ASSET-002` | Category & Hierarchy | P0 / MVP | §4.1 Asset Management | P-005 | AC-ASSET-002 | TS-ASSET-002 | TC-ASSET-002-01..02 | BLOCKED (TC-ASSET-002-01 partial) |
| `RAISE-FR-ASSET-003` | Custody History | P0 / MVP | §4.2 Custody & Asset Operations | P-006 | AC-ASSET-003 | TS-ASSET-003 | TC-ASSET-003-01..03 | BLOCKED (TC-ASSET-003-01 partial — holder model TBD, PRD §16 Q13; TC-ASSET-003-03 partial — exclusivity scope only, see Gap 4 below) |
| `RAISE-FR-OPS-001` | QR / Barcode | P0 / MVP | §4.2 Custody & Asset Operations | P-007 | AC-OPS-001 | TS-OPS-001 | TC-OPS-001-01..03 | NOT_TESTED (no blockers) |
| `RAISE-FR-OPS-002` | Check-in / Check-out | P0 / MVP | §4.2 Custody & Asset Operations | P-008 | AC-OPS-002 | TS-OPS-002 | TC-OPS-002-01..03 | BLOCKED (TC-OPS-002-01, -02 partial) |
| `RAISE-FR-MAINT-001` | Maintenance | P0 / MVP | §5.1 Maintenance Domain | P-009 | AC-MAINT-001 | TS-MAINT-001 | TC-MAINT-001-01..02 | BLOCKED (TC-MAINT-001-01 partial) |
| `RAISE-FR-WARRANTY-001` | Warranty | P0 / MVP | §5.2 Warranty Domain | P-010 | AC-WARRANTY-001 | TS-WARRANTY-001 | TC-WARRANTY-001-01..03 | BLOCKED (TC-WARRANTY-001-01, -03 partial) |
| `RAISE-FR-ORACLE-001` | Oracle FA Integration + NBV/Depreciation | P0 / MVP | §6 Oracle FA Integration | P-011 | AC-ORACLE-001 | TS-ORACLE-001 | TC-ORACLE-001-01..04 | BLOCKED (TC-ORACLE-001-01 partial) |
| `RAISE-FR-ALERT-001` | Alerts | P0 / MVP | §14 Alert Architecture | P-012 | AC-ALERT-001 | TS-ALERT-001 | TC-ALERT-001-01..02 | BLOCKED (TC-ALERT-001-01 partial) |
| `RAISE-FR-AUDIT-001` | Immutable Audit Log | P0 / MVP | §15 Audit Architecture | P-013 | AC-AUDIT-001 | TS-AUDIT-001 | TC-AUDIT-001-01..03 | BLOCKED (TC-AUDIT-001-01, -03 partial) |
| `RAISE-FR-EXEC-001` | Executive Dashboard | P0 / MVP | §13 Executive Intelligence | P-014 | AC-EXEC-001 | TS-EXEC-001 | TC-EXEC-001-01..02 | BLOCKED (TC-EXEC-001-01 partial — NBV/Risk formulas/thresholds still TBD, PRD §16 Q3/Q4; **Utilization resolved 2026-08-21 to "testable now" for definition + presence** (PRD §16 Resolved Question 27; Design v0.4 §13; assignment-time-based: % of time an asset is assigned to a user/department, relative to total available time) — tile-label presence and description-against-definition are now assertable; **calculation mechanics remain BLOCKED (partial)** — how "assigned" time is measured, what "total available time" excludes, and aggregation window/granularity are still NOT TESTABLE YET, see Gap 5 sub-item 1, now resolved-with-residual-TBD below; TC-EXEC-001-02 partial — Executive Summary AI-generated-vs-static unresolved, PRD §8.1 gap) |
| `RAISE-AI-SEARCH-001` | Natural Language Search | P0 / MVP (Current AI) | §9 Natural Language Search, §8.2 AI Flow, §20 Error Handling | P-015 | AC-AI-SEARCH-001, AC-AI-STATES | TS-AI-SEARCH-001, TS-AI-STATES | TC-AI-SEARCH-001-01..03, TC-AI-STATES-01..05 | BLOCKED (TC-AI-SEARCH-001-02 partial) |
| `RAISE-FR-LIFE-001` | Asset Lifecycle Connectivity | P0 / MVP (Product Foundation) | §4.2 Conceptual State, §9 Asset Lifecycle | P-004 (Lifecycle section) | AC-LIFE-001 | TS-LIFE-001 | TC-LIFE-001-01..04 | BLOCKED (TC-LIFE-001-01, -02, -04 partial; **TC-LIFE-001-03 OUT OF SCOPE FOR MVP — Disposal confirmed Enterprise Roadmap, 2026-08-21**) |
| `RAISE-AI-DOC-001` | OCR / Extraction | P0 / MVP (Current AI, ID assigned 2026-08-21) | §9A Document Intelligence Capabilities | P-004 (incidental element only, no dedicated screen) | AC-AI-DOC-001 | TS-AI-DOC-001 | TC-AI-DOC-001-01 | **BLOCKED (full)** — sole criterion `AC-AI-DOC-001-01` is entirely NOT TESTABLE YET; document scope, extracted fields, and accuracy threshold undefined (PRD §7 RAISE-AI-DOC-001 Open Question). No non-blocked structural behavior exists to test; Level L5 (Traceability Regression) only. |
| `RAISE-AI-DOC-002` | Metadata | P0 / MVP (Current AI, ID assigned 2026-08-21) | §9A Document Intelligence Capabilities | P-004 (incidental element only, no dedicated screen) | AC-AI-DOC-002 | TS-AI-DOC-002 | TC-AI-DOC-002-01 | **BLOCKED (full)** — sole criterion `AC-AI-DOC-002-01` is entirely NOT TESTABLE YET; metadata fields/tags and surfacing mechanism undefined (PRD §7 RAISE-AI-DOC-002 Open Question). No non-blocked structural behavior exists to test; Level L5 only. |
| `RAISE-AI-DOC-003` | Classification | P0 / MVP (Current AI, ID assigned 2026-08-21) | §9A Document Intelligence Capabilities | P-005 (incidental element only, no dedicated screen) | AC-AI-DOC-003 | TS-AI-DOC-003 | TC-AI-DOC-003-01 | **BLOCKED (full)** — sole criterion `AC-AI-DOC-003-01` is entirely NOT TESTABLE YET; assign-vs-suggest classification behavior (relative to `RAISE-FR-ASSET-002`) undefined (PRD §7 RAISE-AI-DOC-003 Open Question). No non-blocked structural behavior exists to test; Level L5 only. |
| `RAISE-AI-DOC-004` | Duplicate Detection | P0 / MVP (Current AI, ID assigned 2026-08-21) | §9A Document Intelligence Capabilities | P-003 (incidental element only, no dedicated screen) | AC-AI-DOC-004 | TS-AI-DOC-004 | TC-AI-DOC-004-01 | **BLOCKED (full)** — sole criterion `AC-AI-DOC-004-01` is entirely NOT TESTABLE YET; matching criteria/threshold and merge-vs-flag resolution workflow undefined (PRD §7 RAISE-AI-DOC-004 Open Question). No non-blocked structural behavior exists to test; Level L5 only. |

---

## 4. Master Traceability Matrix — Supporting / Cross-Cutting Items

These items do not map to a single numbered `RAISE-FR-*` requirement but
are carried through the chain and must remain traceable.

| Item | Title | PRD Basis | Design Area | Prototype Screen | AC Group | Suite ID | TC ID(s) | Test Status |
|---|---|---|---|---|---|---|---|---|
| `RAISE-NFR-SEC-RBAC-001` | Security & RBAC | PRD §11 (TBD) | §16 Security Architecture | P-001 | AC-LOGIN | TS-LOGIN | TC-LOGIN-01..03 | BLOCKED (all 3 partial — auth mechanism and role model undefined) |
| Dashboard / Navigation | Main Dashboard | PRD §8.1 (KPI concepts only) | §13 Executive Intelligence (KPI reuse) | P-002 | AC-DASH | TS-DASH | TC-DASH-01..03 | BLOCKED (TC-DASH-01 partial — NBV/Risk value correctness still unconfirmed, PRD §16 Q3/Q4; **Utilization resolved 2026-08-21 to "testable now" for definition + presence** (PRD §16 Resolved Question 27; Design v0.4 §13) — tile-label presence and description-against-definition are now assertable; **calculation mechanics remain BLOCKED (partial)** — measurement of "assigned" time against Custody (P-006), what "total available time" excludes, and aggregation window/granularity are still NOT TESTABLE YET, see Gap 5 sub-item 1, now resolved-with-residual-TBD below) |

### 4.1 PRD-Listed Capabilities Previously Without a Traceability ID — Now Resolved, Rows Moved to §3

**Superseded this revision.** In the prior matrix revision (v0.2), PRD §7's AI
capability classification table listed **OCR/Extraction, Metadata,
Classification, and Duplicate Detection** as "Current" status with **no
dedicated `RAISE-AI-<DOMAIN>-<NNN>` ID** — they existed only as row labels,
and so could have no Master-Matrix row of their own (a row requires an ID to
anchor it, per §1's walk-the-chain method). That absence was recorded as Gap
5 sub-item 2 (§6).

**Resolution, confirmed via actual PRD change (not assumed):** Business
confirmed via an `/update-prd` session, 2026-08-21 — see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) §16 Resolved Question 28 —
that all four capabilities should receive Traceability IDs at **Priority P0 /
Scope MVP**, matching `RAISE-AI-SEARCH-001`'s treatment. They are now:

- `RAISE-AI-DOC-001` (OCR / Extraction)
- `RAISE-AI-DOC-002` (Metadata)
- `RAISE-AI-DOC-003` (Classification)
- `RAISE-AI-DOC-004` (Duplicate Detection)

Each now has a full chain and a real row in **§3 above**, re-walked this
revision end to end:

- `RAISE-DESIGN.md` §9A (v0.4, new) gives each capability a dedicated
  section — conceptual flow, design notes/TBD items, hybrid-AI-architecture
  placement, and dependencies — and §24 (Design Traceability) lists all four
  against "Document Intelligence Capabilities (§9A)."
- `RAISE-PROTOTYPE.md` §5 (Screen Inventory) and §25 (Prototype
  Traceability) record each as an **incidental element on an existing
  screen, not a dedicated `P-NNN` screen**: `RAISE-AI-DOC-001`/`-002` on
  P-004 Asset Detail, `RAISE-AI-DOC-003` on P-005 Category & Hierarchy, and
  `RAISE-AI-DOC-004` on P-003 Asset Registry.
- `RAISE-ACCEPTANCE-CRITERIA.md` §19.5–§19.8 (v0.3, new) each give the
  capability a dedicated AC group with one criterion, marked **NOT TESTABLE
  YET in its entirety** (not a scope-boundary note anymore, since a real
  requirement ID now exists to anchor a criterion against).
- `RAISE-TEST-PLAN.md` §7/§8.1 (v0.3, new) add four dedicated suites
  (`TS-AI-DOC-001`..`004`), each Level L5 only, each **fully blocked** —
  confirmed distinct from a suite with a mix of testable/blocked criteria.
- `RAISE-TEST-CASES.md` §18.1–§18.4 (v0.3, new) add one placeholder test
  case per suite (`TC-AI-DOC-001-01`..`004-01`), each marked **BLOCKED
  (full)** — the first use of that marking in the whole chain (§1 above),
  because no non-blocked structural behavior exists to fall back on.

**Conclusion:** this subsection is retained only as a historical record of
how the gap was found and closed — it is **not** a live "no row exists"
notice anymore. The four capabilities now have full-chain rows in §3, same
as every other MVP requirement, though every layer of that chain is
correctly marked BLOCKED (full) rather than executable, since detailed
acceptance behavior for all four remains PRD-level TBD. See **Gap 5** in §6
below for the residual TBD items this resolution does *not* close.

---

## 5. Roadmap / Pilot Items — Explicitly Out of Test Scope

Per PRD §7 (AI capability classification) and §14 (Enterprise Roadmap),
these have **no Design detail beyond a concept diagram, no Prototype
screen, no AC group, no Suite, and no Test Case** — consistent exclusion
end-to-end, not a gap:

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
| — | Asset Disposal workflow (`RAISE-FR-LIFE-001` terminal stage) | ROADMAP | §4.2 Conceptual State (concept only, marked Roadmap 2026-08-21) | None | None (`TC-LIFE-001-03` retained in `RAISE-TEST-CASES.md` §6.5 as an inactive Out-of-Scope row, not a real Suite/TC) |

If any of these is promoted to MVP, it must re-enter the chain at
`RAISE-PRD.md` first (scope change), then Design, then Prototype, then
Acceptance Criteria, then Test Plan/Cases — this matrix will not be
back-filled with test coverage that skipped those steps.

---

## 6. Gaps

**Gap 1 (resolved):** `RAISE-FR-LIFE-001` (Asset Lifecycle Connectivity)
previously had no dedicated AC group, test suite, or test cases — only an
incidental mention inside `AC-ASSET-001-DETAIL`. This has been closed:

- **AC-LIFE-001** added to `RAISE-ACCEPTANCE-CRITERIA.md` §7.5 (3 criteria,
  covering cross-domain record connectivity, stage-change consistency
  across screens, and downstream consumption by reporting/AI functions).
- **TS-LIFE-001** added to `RAISE-TEST-PLAN.md` §7–§9 (Level L3/L5, P0,
  traced to Design §4.2/§9 and Prototype P-004's Lifecycle section).
- **TC-LIFE-001-01..04** added to `RAISE-TEST-CASES.md` §6.5.
- The row above in §3 now carries a full chain, matching every other MVP
  requirement.

**Gap 2 (resolved 2026-08-21):** Design §4.2's conceptual state diagram and
PRD's lifecycle diagram both include a **Disposal** stage, but no Disposal
screen, flow, or MVP requirement existed anywhere in `RAISE-PROTOTYPE.md`'s
Screen Inventory or `RAISE-PRD.md` §13 MVP Scope — this could not be
resolved from the source documents alone, so it was escalated as a
business/scope decision rather than assumed.

**Resolution:** Product/Business confirmed **Disposal is Enterprise
Roadmap, not MVP**. Propagated through the full chain:

- `RAISE-PRD.md` §14 Enterprise Roadmap, item 7 (new); §16 Resolved
  Question 26
- `RAISE-DESIGN.md` §4.2 — note added that Disposal is a Roadmap-only
  reference in the diagram, not an MVP deliverable
- `RAISE-ACCEPTANCE-CRITERIA.md` §7.5 — marked resolved, no criterion
  ever claimed disposal behavior so none needed correction
- `RAISE-TEST-PLAN.md` §3.2, blocked-items table, §9 — Disposal added to
  Out-of-Scope list; `TS-LIFE-001` blocked-item note updated
- `RAISE-TEST-CASES.md` §6.5/§19 — `TC-LIFE-001-03` changed from
  `BLOCKED (full)` to `OUT OF SCOPE FOR MVP`, removed from the blocked
  count, tracked in its own column instead
- §5 above — Disposal added as a new Roadmap row

**Gap 3 (resolved 2026-08-21):** AC §20's Not-Yet-Testable Summary table listed
**Q12, Q22 (Roles/permissions)** as blocking both `AC-ALERT-001-01` and
`AC-AUDIT-001-03`, but neither AC group's own per-group NOT TESTABLE YET note (§15, §16)
mentioned this dependency — an internal inconsistency within
`RAISE-ACCEPTANCE-CRITERIA.md` itself, not a broken chain link.

**Investigation, at the time this was found:** `AC-ALERT-001`'s "authorized user"
phrasing and `AC-AUDIT-001-03`'s "audit-review access" phrasing both genuinely depend on
the undefined role/permission model (PRD §16 Q22) — `RAISE-TEST-CASES.md`'s
`TC-AUDIT-001-03` had already independently flagged this ("'authorized' gating depends on
undefined role model (PRD §16 Q22)"), confirming the dependency is real, just
under-documented at the AC layer. Q12 ("who can assign/transfer an asset") only actually
applies to `AC-OPS-002-01`, not to Alert/Audit — the original §20 row conflated the two
questions into one entry.

**Resolution applied directly to `RAISE-ACCEPTANCE-CRITERIA.md`:**
- §15 (AC-ALERT-001) and §16 (AC-AUDIT-001) NOT TESTABLE YET notes each gained a sentence
  citing PRD §16 Q22 for their "authorized user" / "audit-review access" gating.
- §20's summary table row was split: `Q12` now attributed only to `AC-OPS-002-01`, and
  `Q22` attributed to `AC-LOGIN-01..03, AC-OPS-002-01, AC-ALERT-001-01, AC-AUDIT-001-03` —
  matching what each criterion's own text and per-group note actually say.

No Test Status value in §3 changed (the underlying test cases were already correctly
BLOCKED for other documented reasons) — this was a documentation-consistency fix, not a
coverage change. Gaps 1, 2, and 3 are all resolved as of this revision.

**Gap 3 — follow-through (resolved 2026-08-21, this revision):** the AC-layer fix above
did not, by itself, propagate down to `RAISE-TEST-PLAN.md` or `RAISE-TEST-CASES.md`. A
follow-up check found the same under-documentation one layer further down the chain:

- `RAISE-TEST-PLAN.md` §7's Test Suites table listed a Blocked Items note for
  `TS-ALERT-001` and `TS-AUDIT-001` that did not mention the Q22 role-gate dependency
  (only trigger-rules / taxonomy-retention TBD), even though §8's per-suite Blocked
  Items table and `AC-ALERT-001-01` / `AC-AUDIT-001-03` themselves already required it
  after the Gap 3 fix above.
- `RAISE-TEST-CASES.md` §14's `TC-ALERT-001-01` Blocked column mentioned only the
  trigger-rule/severity TBD, not the Q22 role-gate dependency — inconsistent with its
  sibling `TC-AUDIT-001-03`, which had already carried the Q22 note.

**Resolution applied directly to the source documents (not to this matrix):**
- `RAISE-TEST-PLAN.md` §7 rows for `TS-ALERT-001` and `TS-AUDIT-001` now each read
  "...; role gate (Q22) TBD" in the Blocked Items column, matching §8 and the AC layer.
- `RAISE-TEST-CASES.md` `TC-ALERT-001-01`'s Blocked column now also cites the Q22
  role-gate dependency, matching `TC-AUDIT-001-03`.

Re-verified this revision: the Q22 role-gate note now appears consistently at every layer
that depends on it — `RAISE-ACCEPTANCE-CRITERIA.md` §15/§16/§20, `RAISE-TEST-PLAN.md`
§7/§8, and `RAISE-TEST-CASES.md` TC-ALERT-001-01/TC-AUDIT-001-03 all agree. No Test
Status value in §3 changed here either — both requirement rows were already BLOCKED for
other documented reasons. Gap 3 is now fully closed end-to-end, not just at the AC layer.

**Gap 4 (new, resolved 2026-08-21, this revision — matrix-layer sync only, no upstream
document changed):** `AC-ASSET-003-03` (`RAISE-ACCEPTANCE-CRITERIA.md` §9) was narrowed to
scope the custody-writing-events ambiguity (`RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002`,
"Needs business confirmation" — PRD Pre-Finalization Quality Pass, "Duplicated /
Overlapping Requirements") onto that single criterion's *exclusivity* claim. This was
correctly propagated into `RAISE-TEST-PLAN.md` (§7 `TS-ASSET-003` Blocked Items column and
§8's per-suite Blocked Items table both already cite "custody-writing-events ambiguity
blocks AC-ASSET-003-03's exclusivity scope only") and into `RAISE-TEST-CASES.md`
(`TC-ASSET-003-03` is `BLOCKED (partial)`, and §19's Test Case Summary explicitly narrates
this as an update "updated 2026-08-21 to BLOCKED (partial)").

**What was found stale:** this matrix's own §3 Master Traceability Matrix row for
`RAISE-FR-ASSET-003` had not been re-synced after that Test Cases/Test Plan update — its
Test Status column still read `BLOCKED (TC-ASSET-003-01 partial)` only, omitting
`TC-ASSET-003-03`'s now-partial status entirely. Left as-is, a reader of this matrix alone
(without cross-checking `RAISE-TEST-CASES.md` directly) would have under-counted the
blocked test cases for this requirement and could have mistaken `TC-ASSET-003-03` for
fully executable — which it is not, on the exclusivity question.

**Resolution applied directly to this matrix (§3 above):** the `RAISE-FR-ASSET-003` row's
Test Status column now reads `BLOCKED (TC-ASSET-003-01 partial — holder model TBD, PRD
§16 Q13; TC-ASSET-003-03 partial — exclusivity scope only, see Gap 4 below)`, matching the
current, already-correct state of `RAISE-TEST-CASES.md` and `RAISE-TEST-PLAN.md`. No
upstream document (PRD, Design, Prototype, AC, Test Plan, Test Cases) was modified to
close this gap — they were already correct; only this matrix's summary was out of sync.

**Still open — not closed by this fix:** the underlying business question itself (whether
Custody History is written *only* by Check-in/Check-out, or also by other custody-changing
events such as a direct reassignment outside that flow) remains unresolved and is **not**
a matrix-layer documentation issue — it requires an actual Product/Business decision, the
same way the Disposal question (Gap 2) did. Until that confirmation exists and, if
needed, a corresponding flow/screen and AC criterion are added, `TC-ASSET-003-03` cannot
be split into a fully-testable case plus a new dedicated case for the non-Check-in/
Check-out path. **No new Open Question is proposed here** — the existing PRD
Pre-Finalization Quality Pass entry ("Duplicated / Overlapping Requirements") already
covers it precisely; this matrix simply ensures its downstream consequence is visible at
every layer, including this one.

**Gap 5 (resolved 2026-08-21, this revision — both sub-items closed via actual business
confirmation, not matrix-layer guessing; residual TBD items recorded below, not silently
dropped):** two related but distinct issues, previously open, were each closed this
revision through a real `RAISE-PRD.md` change made during an `/update-prd` session — not
by this matrix inferring or assuming a resolution.

1. **Utilization KPI definition — resolved.** `RAISE-PRD.md` §16 Resolved Question 27
   (2026-08-21) confirmed Utilization's definition as **assignment-time-based**: % of time
   an asset is assigned to a user/department, relative to total available time. This
   propagated consistently through every layer re-checked this revision:
   `RAISE-DESIGN.md` §13 (v0.4) → `RAISE-PROTOTYPE.md` §8/§20 (v0.3) →
   `RAISE-ACCEPTANCE-CRITERIA.md` §5/§17 (v0.3) → `RAISE-TEST-PLAN.md` §7/§8 rows for
   `TS-DASH`/`TS-EXEC-001` (v0.3) → `RAISE-TEST-CASES.md` `TC-DASH-01`/`TC-EXEC-001-01`
   (v0.3). This matrix's §3 (`RAISE-FR-EXEC-001`) and §4 (Dashboard) rows have been updated
   to reflect the split this resolution creates: tile *presence* and *description-against-
   definition* are now testable now; **calculation mechanics are not** — how "assigned"
   time is measured against Custody (P-006), what "total available time" excludes, and the
   aggregation window/granularity remain undefined. **Residual TBD (not closed by this
   resolution, tracked here rather than silently dropped):** PRD §16 Q3 itself is only
   *partially* resolved — the definition is settled, but the exact formula thresholds and
   the NBV/Risk KPI formulas (the rest of Q3/Q4) remain fully open. No new Open Question is
   proposed for this residual, since Q3/Q4 already cover it precisely; `RAISE-FR-EXEC-001`
   and the Dashboard item both remain **BLOCKED (partial)** in §3/§4, not PASS/NOT_TESTED,
   until the calculation mechanics are defined and a follow-up AC/Test Plan/Test Case pass
   adds real value/formula assertions.
2. **Four "Current"-status AI capabilities assigned Traceability IDs — resolved.**
   `RAISE-PRD.md` §16 Resolved Question 28 (2026-08-21) confirmed OCR/Extraction,
   Metadata, Classification, and Duplicate Detection each receive a dedicated
   `RAISE-AI-DOC-<NNN>` ID at Priority P0 / Scope MVP, matching `RAISE-AI-SEARCH-001`'s
   treatment. This is a **structural PRD fix** (a missing requirement definition was
   added), not a business-rule answer — and it has been traced end-to-end and confirmed
   present at every layer this revision (see §4.1 above for the full per-layer walk):
   Design §9A (v0.4, new) → Prototype §5/§25 (v0.3, incidental placement on P-003/P-004/
   P-005) → AC §19.5–§19.8 (v0.3, new AC groups) → Test Plan §7/§8.1 (v0.3, new fully-
   blocked suites) → Test Cases §18.1–§18.4 (v0.3, new `BLOCKED (full)` placeholder TCs).
   All four now have real rows in **§3 above**, each carrying **BLOCKED (full)** status —
   the first use of that marking anywhere in the chain. **Residual TBD (not closed by this
   resolution, tracked here rather than silently dropped):** the ID-assignment decision
   deliberately did **not** define any capability's detailed acceptance behavior. Per
   `RAISE-PRD.md` §7, for each of the four: document/field/threshold scope
   (`RAISE-AI-DOC-001`), metadata schema/surfacing (`RAISE-AI-DOC-002`), assign-vs-suggest
   classification behavior relative to `RAISE-FR-ASSET-002` (`RAISE-AI-DOC-003`), and
   matching threshold/merge-vs-flag workflow (`RAISE-AI-DOC-004`) are all still undefined.
   Each is already logged as an `Open Question` field on its own PRD §7 requirement entry,
   so **no new numbered Open Question is proposed here** — but until each is answered, all
   four `TS-AI-DOC-*` suites and `TC-AI-DOC-*-01` cases stay **BLOCKED (full)**, and cannot
   be promoted to even BLOCKED (partial), because no prior-stage document defines any
   concrete UI element or business rule to fall back on for partial testing.

**What Gap 5's resolution does and does not mean:** both sub-items are closed as
*traceability-chain* gaps — every layer of the chain now agrees on what is known and what
is still unknown, instead of one layer being silently out of sync with another. Neither
sub-item's closure means the underlying capability is now testable end-to-end; both
`RAISE-FR-EXEC-001`/Dashboard (partial) and `RAISE-AI-DOC-001`..`004` (full) remain
BLOCKED in §3/§4 until their respective residual TBDs above are answered by Product/
Business and propagated back down through Design → Prototype → AC → Test Plan → Test
Cases → this matrix, the same discipline every other gap in this section has followed.

---

## 7. Chain Consistency Check

Performed by walking every ID backward through the chain:

- Every `TC-*` ID in `RAISE-TEST-CASES.md` maps to exactly one `AC-*`
  criterion in `RAISE-ACCEPTANCE-CRITERIA.md`. ✅ No orphan test cases.
- Every AC Group maps to exactly one Suite ID in `RAISE-TEST-PLAN.md`
  §7. ✅ No orphan AC groups.
- Every Suite ID maps to exactly one screen in `RAISE-PROTOTYPE.md` §25.
  ✅ No orphan suites.
- Every screen maps to a Design Area in `RAISE-DESIGN.md` §24. ✅ No
  orphan screens (P-001/P-002 intentionally map to general
  navigation/security rather than a numbered requirement, as already
  noted in the Prototype and Design documents).
- Every `RAISE-FR-*` / `RAISE-AI-*` ID here matches an ID in
  `RAISE-PRD.md` §17. ✅ No orphan requirements.
- `RAISE-FR-LIFE-001` now has full chain coverage (§6) — both the
  original coverage gap and the narrower Disposal-scope question are
  resolved as of 2026-08-21.
- **Re-verified 2026-08-21:** the LIFE-001 resolution was re-checked against the actual
  content of `RAISE-ACCEPTANCE-CRITERIA.md` §7.5, `RAISE-TEST-PLAN.md` §7–§9, and
  `RAISE-TEST-CASES.md` §6.5/§19 (not assumed from this matrix's own prior text) — AC-LIFE-001
  (3 criteria), TS-LIFE-001, and TC-LIFE-001-01..04 all exist as described, and every Test
  Status value in §3 above was individually re-matched against the BLOCKED/No markers in
  `RAISE-TEST-CASES.md`. No drift found; the resolution stands.
- **Documentation-trail note from the prior revision — now resolved:** an earlier revision
  of this matrix recorded that `RAISE-PROTOTYPE.md` §5 (Screen Inventory) and §25 (Prototype
  Traceability Matrix) did not carry an explicit row mapping `RAISE-FR-LIFE-001` to P-004.
  Re-checked this revision: `RAISE-PROTOTYPE.md` has since been updated —
  §5's P-004 row now reads Requirement `RAISE-FR-ASSET-001, RAISE-FR-LIFE-001`, and §25 now
  carries an explicit row `P-004 Asset Detail | RAISE-FR-LIFE-001 | Planned` (with an
  accompanying note explaining the addition and why P-004's own Traceability section,
  Prototype §10, already realized it across P-004/P-006/P-009/P-010/P-013). The prior note's
  underlying concern is now fully closed at the Prototype layer itself — no residual
  documentation-trail gap remains for `RAISE-FR-LIFE-001` at any layer of the chain.
- **Gap 3 — resolved 2026-08-21:** `RAISE-ACCEPTANCE-CRITERIA.md`'s §20 Not-Yet-Testable
  Summary table previously attributed Q12/Q22 (Roles/permissions) to `AC-ALERT-001-01`
  and `AC-AUDIT-001-03` without those groups' own per-group notes (§15, §16) saying so.
  This has since been fixed directly in `RAISE-ACCEPTANCE-CRITERIA.md` itself: §15/§16
  now each cite PRD §16 Q22 for their "authorized user"/"audit-review access" gating, and
  §20's row was split into a precise `Q12` entry (only `AC-OPS-002-01`) and `Q22` entry
  (the four criteria that genuinely depend on the undefined role model). See §6 Gap 3
  above for the full resolution record.
- **Gap 3 follow-through — resolved 2026-08-21 (this revision):** the AC-layer fix had
  not yet propagated to `RAISE-TEST-PLAN.md` §7 (Test Suites table) or
  `RAISE-TEST-CASES.md` §14 (`TC-ALERT-001-01`), both of which still lacked the Q22
  role-gate citation that `AC-ALERT-001-01`/`AC-AUDIT-001-03` and Test Plan §8 already
  carried. Re-checked this revision against the actual current text of both documents:
  `RAISE-TEST-PLAN.md` §7's `TS-ALERT-001`/`TS-AUDIT-001` rows and
  `RAISE-TEST-CASES.md`'s `TC-ALERT-001-01` now all cite Q22 alongside their existing
  TBD reasons, matching `TC-AUDIT-001-03` and the AC layer. See §6 Gap 3 follow-through
  above for the full resolution record. The Q22 role-gate propagation is now consistent
  across every layer of the chain: AC → Test Plan → Test Cases.
- **Gap 4 — resolved 2026-08-21 (this revision):** re-walked `TC-ASSET-003-03` back
  through `RAISE-TEST-CASES.md` → `RAISE-TEST-PLAN.md` §7/§8 → `RAISE-ACCEPTANCE-CRITERIA.md`
  §9/§20 → `RAISE-PRD.md`'s "Duplicated / Overlapping Requirements" note. All four layers
  already agreed with each other that the custody-writing-events ambiguity blocks only
  `AC-ASSET-003-03`'s exclusivity claim, not the append/immutability behavior itself — the
  only inconsistency was in this matrix's own §3 summary row for `RAISE-FR-ASSET-003`,
  which had not named `TC-ASSET-003-03` as partially blocked. Now corrected — see §6 Gap 4
  above for the full resolution record. No upstream document required a change; this was
  a matrix-only sync.
- Full re-walk confirmed no other Test Status cell in §3/§4 has drifted from the current
  text of `RAISE-TEST-CASES.md` (cross-checked TC-by-TC against §19's Test Case Summary
  table): `RAISE-FR-ASSET-001`, `-002`, `RAISE-FR-OPS-001/002`, `RAISE-FR-MAINT-001`,
  `RAISE-FR-WARRANTY-001`, `RAISE-FR-ORACLE-001`, `RAISE-FR-ALERT-001`,
  `RAISE-FR-AUDIT-001`, `RAISE-FR-EXEC-001`, `RAISE-AI-SEARCH-001`, `RAISE-FR-LIFE-001`,
  `RAISE-NFR-SEC-RBAC-001`, and the Dashboard/Navigation row all still match their
  respective TC Blocked-column text exactly.
- **Gap 5 — resolved 2026-08-21 (this revision, full chain re-sync — PRD v0.3 → Design
  v0.4 → Prototype v0.3 → AC v0.3 → Test Plan v0.3 → Test Cases v0.3):** re-read all six
  documents end to end after a coordinated `/update-prd` session and full downstream sync.
  Re-verified both sub-items directly against the current text of every layer, not
  assumed from this matrix's own prior wording:
  - **Utilization sub-item:** `RAISE-PRD.md` §16 Resolved Question 27 exists and states
    the assignment-time-based definition; `RAISE-DESIGN.md` §13 (v0.4), `RAISE-PROTOTYPE.md`
    §8/§20 (v0.3), `RAISE-ACCEPTANCE-CRITERIA.md` §5/§17 (v0.3), `RAISE-TEST-PLAN.md` §7/§8
    (`TS-DASH`/`TS-EXEC-001` rows, v0.3), and `RAISE-TEST-CASES.md` `TC-DASH-01`/
    `TC-EXEC-001-01` (v0.3) all carry the same testable-now/calculation-mechanics-TBD split
    consistently. This matrix's §3 (`RAISE-FR-EXEC-001`) and §4 (Dashboard) rows were the
    only layer still carrying the pre-resolution "presence-only" wording — corrected above.
  - **Four-AI-capability sub-item:** `RAISE-PRD.md` §16 Resolved Question 28 and §7/§17
    confirm the four new `RAISE-AI-DOC-001`..`004` IDs at P0/MVP; `RAISE-DESIGN.md` §9A/§24
    (v0.4), `RAISE-PROTOTYPE.md` §5/§25 (v0.3), `RAISE-ACCEPTANCE-CRITERIA.md` §19.5–§19.8
    (v0.3), `RAISE-TEST-PLAN.md` §7/§8.1 (v0.3), and `RAISE-TEST-CASES.md` §18.1–§18.4
    (v0.3) all give each capability a full, consistent chain, uniformly BLOCKED (full).
    This matrix had **no row at all** for these four prior to this revision — four new
    rows added to §3, and §4.1 rewritten from "verified-absent-by-design" to "resolved,
    superseded, rows moved to §3."
  - Confirmed no orphan ID introduced by this change in either direction: each
    `RAISE-AI-DOC-*` ID traces cleanly TC → AC → Suite → Screen → Design Area → PRD ID, and
    each PRD §17 row for these four IDs has a corresponding §3 row here — no gap between
    "PRD assigns an ID" and "matrix reflects it."
- **Historical record from the v0.2 revision (superseded by the Gap 5 resolution above,
  kept for audit trail):** as of that revision, the matrix had only just sharpened the
  Utilization "presence-only" wording and added §4.1/Gap 5 to document — as **open** —
  that the four AI capabilities had no PRD Traceability ID at all. Both items were, at
  that time, documentation-consistency improvements only, explicitly not resolutions,
  since no `RAISE-PRD.md` change had yet occurred. That is no longer the current state —
  see the "Gap 5 — resolved" bullet above for what changed this revision (PRD v0.3
  Resolved Questions 27/28) and why both sub-items now qualify as closed
  traceability-chain gaps, not merely sharpened wording.

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

---

## 9. Traceability Matrix Review Checklist

- [x] Every PRD MVP requirement (§13 of the PRD) appears in §3 above
- [x] Every supporting/cross-cutting item appears in §4, explicitly
      labeled as not mapping to a single `RAISE-FR-*` ID
- [x] Every Pilot/Roadmap item appears in §5 with no test coverage
      columns filled in
- [x] Gaps 1, 2, and 3 (§6) were all resolved through actual upstream
      document changes, not silently filled in here
- [x] Gap 4 (§6) was resolved as a matrix-only sync (§3 Test Status cell
      corrected to match already-correct upstream text) — no upstream
      document required a change; the underlying business question
      (custody-writing-events exclusivity) itself remains open, per PRD
      Pre-Finalization Quality Pass, and is not claimed resolved
- [x] Gap 5 (§6) is recorded as **resolved this revision** for both
      sub-items, each closed via a real upstream `RAISE-PRD.md` change (§16
      Resolved Questions 27 and 28) confirmed present and propagated through
      every downstream document, not inferred here — with residual TBD
      items (Utilization calculation mechanics; each AI-DOC capability's
      detailed acceptance behavior) explicitly retained as open, not
      silently dropped, since those still require further upstream
      document changes that have not happened yet
- [x] Chain consistency (§7) has been re-verified after this revision's
      coordinated upstream changes (PRD v0.3, Design v0.4, Prototype v0.3,
      AC v0.3, Test Plan v0.3, Test Cases v0.3)
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

Gaps 1–5 (§6) are all resolved as of 2026-08-21 — Gap 4 as a matrix-only documentation
sync, the others (including both of Gap 5's sub-items, this revision) through actual
upstream document changes confirmed by Product/Business via `/update-prd` sessions. **No
gap in §6 remains open as a traceability-chain gap.** However, resolving Gap 5 surfaced
residual TBD items that are **not** the same thing as the gap itself and must not be
conflated with "resolved": Utilization's calculation mechanics (formula, exclusions,
aggregation window) and each `RAISE-AI-DOC-001`..`004` capability's detailed acceptance
behavior (document/field scope, metadata schema, assign-vs-suggest behavior, matching
threshold/workflow) remain undefined at the PRD level. Before Development begins, the
remaining outstanding PRD Open Questions (Q1–Q25, Q3/Q4's residual formula/threshold
portion, the still-unconfirmed custody-writing-events exclusivity question underlying
Gap 4, and the four AI-DOC capabilities' per-capability Open Question fields) blocking the
partially- and fully-blocked test cases (`RAISE-TEST-CASES.md` §19) should still be
reviewed with Product/Business, per this document's own **Source of Truth** rule: nothing
here should be implemented against an assumption this chain hasn't already made explicit.

---

## Document Status

**Version:** 0.3 (full-chain re-sync — Gap 5 resolution pass)
**Status:** Draft for Traceability Review
**Source:** [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) v0.3 and full upstream chain — `RAISE-TEST-PLAN.md` v0.3, `RAISE-ACCEPTANCE-CRITERIA.md` v0.3, `RAISE-PROTOTYPE.md` v0.3, `RAISE-DESIGN.md` v0.4, `RAISE-PRD.md` v0.3
**Reference:** VERSCAN only
**Last Re-Verified:** 2026-08-21 (full-chain re-sync pass, following a coordinated
`/update-prd` business-confirmation session and downstream sync across all six upstream
documents) — re-read `RAISE-PRD.md` v0.3, `RAISE-DESIGN.md` v0.4, `RAISE-PROTOTYPE.md`
v0.3, `RAISE-ACCEPTANCE-CRITERIA.md` v0.3, `RAISE-TEST-PLAN.md` v0.3, and
`RAISE-TEST-CASES.md` v0.3 end to end; all ID cross-checks in §7 re-run; no orphan IDs
found in either direction (TC→AC→Suite→Screen→Design Area→PRD ID).

**Gap 5 — resolved this pass (was open in v0.2):** both sub-items closed via actual
business confirmation recorded in `RAISE-PRD.md` §16 as Resolved Questions 27 and 28
(2026-08-21, `/update-prd` session), not by this matrix inferring a resolution on its own:

1. **Utilization KPI definition** — Resolved Question 27 confirmed assignment-time-based
   definition. Propagated through `RAISE-DESIGN.md` §13 (v0.4), `RAISE-PROTOTYPE.md`
   §8/§20 (v0.3), `RAISE-ACCEPTANCE-CRITERIA.md` §5/§17 (v0.3), `RAISE-TEST-PLAN.md` §7/§8
   `TS-DASH`/`TS-EXEC-001` rows (v0.3), and `RAISE-TEST-CASES.md` `TC-DASH-01`/
   `TC-EXEC-001-01` (v0.3) — this matrix's §3 (`RAISE-FR-EXEC-001`) and §4 (Dashboard) rows
   were the only layer not yet reflecting the testable-now/calculation-mechanics-TBD split;
   corrected this revision.
2. **Four AI capabilities assigned Traceability IDs** — Resolved Question 28 confirmed
   `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` at P0/MVP. Propagated through `RAISE-DESIGN.md`
   §9A/§24 (v0.4, new), `RAISE-PROTOTYPE.md` §5/§25 (v0.3), `RAISE-ACCEPTANCE-CRITERIA.md`
   §19.5–§19.8 (v0.3, new), `RAISE-TEST-PLAN.md` §7/§8.1 (v0.3, new), and
   `RAISE-TEST-CASES.md` §18.1–§18.4 (v0.3, new) — this matrix had **no row at all** for
   these four prior to this revision; four new rows added to §3 (all `BLOCKED (full)`,
   the first use of that marking in this matrix), and §4.1 rewritten from
   "verified-absent-by-design" to "resolved, superseded, rows moved to §3."

Both sub-items are recorded as **resolved as traceability-chain gaps** — every layer now
agrees on what is known and what remains unknown — but neither resolution makes the
underlying capability fully testable. Residual TBD items (Utilization calculation
mechanics; each AI-DOC capability's detailed acceptance behavior) are recorded in §6 Gap 5
as explicit residual notes, not dropped, consistent with this document's rule against
silently resolving items that still require a further upstream document change.

Gaps 1–4 (§6) re-confirmed still resolved with no drift.

**Next Action:** Review readiness for Development — no matrix-layer documentation gaps
remain undocumented, and Gap 5 is now closed as a chain-consistency matter. The remaining
outstanding items are PRD-level, not matrix-level: PRD Open Questions Q1–Q25 (Q3/Q4's
residual formula/threshold portion in particular), the custody-writing-events exclusivity
question (Gap 4), the Utilization calculation-mechanics residual, and each
`RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` capability's per-capability Open Question (PRD §7)
all remain open pending Product/Business and PRD-authoring action before implementation
proceeds against any of the affected P0/MVP requirements — `RAISE-FR-EXEC-001` and the
Dashboard item (Utilization calculation mechanics), and all four `RAISE-AI-DOC-*`
requirements (entirely BLOCKED (full) pending detailed acceptance behavior), most
directly.
