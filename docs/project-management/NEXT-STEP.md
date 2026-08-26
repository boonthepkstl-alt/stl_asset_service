# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-26, immediately after `CHECKPOINT-2026-08-26-002` (F-21 fix — Scan QR invalid-code state).

---

## Current State

- **Current phase:** Phase 3 — Asset Management (`RAISE-FR-OPS-001` now fully `PASS`), Phase 6 — Audit & Reconciliation, Phase 8 — Executive Dashboard & Reporting (🟡 F-22 open — scope-reconciliation question, not a code task).
- **Current feature:** None actively in progress. Last work: fixed F-21 (Scan QR invalid-code state), the item this protocol identified as the strongest "buildable now" candidate after the 2026-08-26 test-execution pass.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-26-002`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-26-002` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 Frontend verified green (`tsc`/`lint`/`vitest` 136/136/`build`); backend unaffected by this frontend-only fix.
- **Open blockers:** None for any remaining actionable item — everything left in the backlog is either genuinely blocked on a PRD/business-decision answer, or (F-22) a scope-reconciliation question for the business/design owner, not a coding task.
- **Open findings:** F-01 through F-22 in `OPEN-FINDINGS.md`. **F-21 is now resolved as R-05.** F-22 remains open.
- **Remaining work:** None outstanding from the F-21 fix itself — all three `TC-OPS-001-*` cases now pass.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — this session executed exactly what the prior `NEXT-STEP.md` recommended (fix F-21), with no scope drift.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Not a code task until the business/design owner says which direction is correct |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open — was asked of the user once already (turn before last), not yet answered |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — now additionally entangled with F-22 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Ticket-domain audit *viewing* UI | Not started, not requested | Unaffected by this checkpoint |
| Remaining `TC-*` formal executions (other suites not yet run this way) | `VALIDATION` | Only 3 of many suites in `RAISE-TEST-CASES.md` have been formally executed so far — the same exercise could surface more findings elsewhere |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: the one genuinely "buildable now"
item this protocol had identified (F-21) is done. No other item in the
inventory above is both non-PRD-blocked and a code task — F-22 is
non-PRD-blocked but is a scope-reconciliation question, and every other
open item is a genuine business-decision block. Running more formal test
executions (per the "Remaining work" note above) is a legitimate
alternative activity — it has already surfaced 2 real findings from just
3 suites — but it is validation work, not a "next feature," and
shouldn't be dressed up as one.

---

## Primary Next Step

**No fresh code-buildable item identified.** Two legitimate next
activities exist, and picking between them is a call for whoever is
directing the project, same as the last time this protocol reached this
point (`CHECKPOINT-2026-08-25-005`):

1. **Run more formal test-case executions** against suites in
   `RAISE-TEST-CASES.md` not yet exercised this way — has a proven track
   record this session (found F-21 and F-22 from just 3 suites) of
   surfacing real, actionable findings rather than re-confirming known
   blockers.
2. **Get a PRD answer** on one of the open §16 questions (Q3/Q4/Q29
   NBV/Risk/Utilization, Q15 Warranty fields — already asked once,
   Q6-Q10 Oracle, Q22 role model) or a scope decision on F-22 — any of
   these would reopen a real "first cut" or "buildable now" item.

## Why Neither Is Auto-Selected

Same reasoning as `CHECKPOINT-2026-08-25-005`: picking (1) on this
protocol's own initiative would be choosing a broad validation sweep
without knowing which suite is worth the time; picking (2) requires an
answer this session cannot supply on its own. Both are legitimate;
neither should be presented as equivalent to a scoped, approved code
task without the user weighing in.

## Dependencies

N/A for either candidate.

## Expected Output

If (1): pick an unexecuted suite from `RAISE-TEST-CASES.md`, run its
test cases against the real app exactly as done for
`CHECKPOINT-2026-08-26-001`, record real PASS/FAIL evidence in
`RAISE-TRACEABILITY-MATRIX.md`, and file any new findings in
`OPEN-FINDINGS.md`.

If (2): whichever answer/decision lands, re-run this protocol's Steps
1-7 from scratch against the traceability matrix's state at that time.

## Acceptance Criteria

N/A — neither candidate is itself a product AC.

## Validation Method

N/A for this recalculation. Whichever is chosen, its own validation
method follows the pattern already established (browser execution +
evidence, or full chain re-sync for a PRD answer).

## Related Checkpoint

`CHECKPOINT-2026-08-26-001` (found F-21/F-22), `CHECKPOINT-2026-08-26-002`
(fixed F-21, this recalculation's basis).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

None for either candidate — both are low-risk, well-understood
activities; the only open question is which one is worth doing next,
which is a judgment call for the user.

## Files to Update (after whichever is chosen, per Step 10)

If (1): `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`,
`PROJECT-CHECKPOINTS.md`, `CURRENT-STATUS.md`, this file. If (2): the
full deliverable chain from `RAISE-PRD.md` downward.

## After Completion

Recalculate from updated project state. Do not assume the next pick
after this one is automatically another F-21-shaped fix — re-run Steps
1-7 against whatever the traceability matrix and open findings actually
say at that time.
