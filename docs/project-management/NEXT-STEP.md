# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-31, immediately after `CHECKPOINT-2026-08-31-002` (F-22's Dashboard spec correction propagated through the full deliverable chain).

---

## Current State

- **Current phase:** Phase 8 — Executive Dashboard & Reporting (documentation correction; no new code). `RAISE-FR-EXEC-001`'s chain now documents the actually shipped dashboard, but this has not yet been re-verified by a fresh formal execution sweep.
- **Current feature:** None actively in progress. Last work: propagated F-22's business decision through Design → Prototype → Acceptance Criteria → Test Plan → Test Cases → Traceability Matrix via `/run-full-chain`.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-31-002`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-31-002` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 Docs-only change, no build/lint/test/type-check impact (no code was touched). Each subagent's output was verified by reading the actual file content, not just its self-report, before proceeding to the next chain stage.
- **Open blockers:** None directly buildable as new engineering work. One item is now a **validation** task rather than blocked: a formal test-execution sweep against the corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02`.
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md`. **F-22 has a confirmed business decision and a completed chain correction, but is NOT YET Resolved** — pending a fresh execution sweep to confirm the corrected spec actually passes. F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03` remain open, awaiting their own decisions.
- **Remaining work:** Run a formal test-execution sweep against the corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02` to confirm the real app passes and close F-22 with an R-number. This is expected to PASS on tile/section presence (the app already renders these — this was always a documentation gap, not a code gap), with the NBV/Risk absence sub-item (`TC-DASH-03`) remaining BLOCKED (partial), tied to the separate F-03 question.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — this followed the plan the user set (fix docs to match the shipped app), executed via the standard `/run-full-chain` sequential-subagent workflow with verification at each stage, exactly as done for the Warranty resolution (PR #49) precedent.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Re-execute `TC-DASH-01..03`/`TC-EXEC-001-01..02` against the corrected spec | `VALIDATION` | The one item that's directly actionable right now — confirms F-22's fix and closes it with an R-number. Expected to PASS on tiles/sections (app already renders them); `TC-DASH-03` (NBV/Risk absence) stays BLOCKED (partial), tied to F-03 |
| F-33: AI Assistant (P-015) doesn't answer questions or exhibit response states | `FINDING` (build gap, confirmed by execution) | Distinct from F-06; needs a business/design decision on scope before any code |
| F-32: Alerts (P-012) not built — route 404s | `FINDING` (build gap, confirmed by execution) | Distinct from F-05 |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | Distinct from F-04 |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path |
| F-06/F-05/F-04: citation format / alert rules / Oracle integration mechanism | Blocked on business decision | Each independent of the corresponding F-33/F-32/F-31 build-gap finding |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — explicitly retained as a documented future enhancement by this session's F-22 correction, not resolved |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: this is the first time since the
initial nine test-execution sweeps that a genuinely **buildable-now,
non-blocked** item exists again — re-executing `TC-DASH-01..03`/
`TC-EXEC-001-01..02` against the corrected spec. This isn't a business
decision or a code fix; it's the validation step that actually closes
F-22, and it's the natural continuation of the work just completed
(a documentation correction is incomplete until it's confirmed to
actually match reality). This should be prioritized over the five
remaining open findings (F-27/F-30/F-31/F-32/F-33), which are genuinely
blocked on decisions the user hasn't made yet.

---

## Primary Next Step

**Run a formal test-execution sweep against the corrected `TS-DASH`/
`TS-EXEC-001` suites** (`TC-DASH-01..03`, `TC-EXEC-001-01..02`) via
browser automation against the real running app, exactly as done for
the prior nine sweeps this session. Expected outcome: `TC-DASH-01/-02`
and `TC-EXEC-001-01/-02` PASS (the app already renders the 8-tile
grid/10-section list — only the documentation was wrong); `TC-DASH-03`
(NBV/Risk/Utilization absence) remains BLOCKED (partial), tied to F-03.
If confirmed, update the Traceability Matrix's `RAISE-FR-EXEC-001`/
"Main Dashboard" rows from `NOT_TESTED` to `PASS (partial)`, close Gap 8,
and mark F-22 Resolved in `OPEN-FINDINGS.md` with a new R-number.

If the user prefers to defer this validation step, the fallback is the
same as before: check in on one of the five remaining open findings
(F-27/F-30/F-31/F-32/F-33) or `AC-WARRANTY-001-03`.

## Why This Is Next

A spec correction that hasn't been verified against the real app is an
incomplete fix — this project's own discipline (never report "Completed"
until Acceptance Criteria actually pass) requires closing the loop with
real execution, not assuming the correction is sufficient just because
it was carefully written.

## Dependencies

None — the corrected spec and the real app both already exist; this is
pure verification.

## Expected Output

Updated `RAISE-TRACEABILITY-MATRIX.md` rows (PASS or FAIL with evidence),
`OPEN-FINDINGS.md` F-22 marked Resolved (if PASS) or given a new,
narrower finding (if FAIL — would be surprising, since this only
requires re-reading what's already been visually confirmed multiple
times this session).

## Acceptance Criteria

`AC-DASH-01/-02`, `AC-EXEC-001-01/-02` confirmed against the real
running app with genuine browser evidence.

## Validation Method

Manual browser execution against `raise-frontend`, same methodology as
the nine prior sweeps this session.

## Related Checkpoint

`CHECKPOINT-2026-08-31-002` (most recent, F-22 chain correction).

## Related Git Branch/Commit

`docs/resolve-f22-dashboard-spec-correction` — pending PR (predicted #56).

---

## Risks / Blockers

None — this is a low-risk verification step; the only open question is
whether the user wants it done now or wants to move to a different
finding first.

## Files to Update (after implementation, per Step 10)

`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`, `PROJECT-CHECKPOINTS.md`,
`DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`, `PROJECT-TIMELINE.md`,
`NEXT-STEP.md`.

## After Completion

Recalculate once the sweep runs (or once the user picks a different
direction).
