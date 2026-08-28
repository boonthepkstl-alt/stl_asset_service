# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-28, immediately after `CHECKPOINT-2026-08-28-005` (F-29 fix).

---

## Current State

- **Current phase:** Phase 4 — ITSM. `RAISE-FR-MAINT-001` now `PASS` on all 9 test cases (up from a pre-code-era `BLOCKED` guess). `RAISE-FR-OPS-002` also `PASS` (3/3). Both third-sweep (2026-08-28) findings resolved.
- **Current feature:** None actively in progress. Last work: fixed F-29 (stage-progress indicator doesn't distinguish Current from Pending) per explicit user instruction ("Start on F-29").
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-28-005`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-28-005` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (143/143), `npm run build` all pass; browser-verified live across 3 tickets at different stages (`PENDING_DEPT_APPROVAL`, `IN_PROGRESS`, `DONE`) — the current stage is always visually distinct, and a completed ticket shows no "Current" badge anywhere.
- **Open blockers:** None directly buildable right now — F-22/F-27 are scope questions, F-01 is a standing business-decision request.
- **Open findings:** F-01 through F-29 in `OPEN-FINDINGS.md`. **F-28 and F-29 are both now Resolved (R-10, R-11)** — every finding from both 2026-08-26 sweeps and the 2026-08-28 sweep is closed. Only F-22 and F-27 (scope questions) remain open from any test-execution sweep.
- **Remaining work:** No more direct-fix findings remain from any of the three formal test-execution sweeps run this session.
- **Dependencies:** N/A — nothing currently blocked on engineering work.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Needs a business/design decision: update the prototype, or grow the shipped Dashboard toward it? |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — the longest-standing uncompleted request in this session |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-LOGIN`, `TS-DASH`, `TS-WARRANTY-001`, `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` still not formally executed — the largest remaining pool of genuinely new information available without a business decision |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with every finding from all three
prior test-execution sweeps now resolved (F-21, F-23 through F-29), and
the two remaining findings (F-22, F-27) both scope/business questions
that can't be built toward without guessing, there is no direct-fix
"buildable now" item left. The two real options remain: (1) run a new
formal test-case-execution sweep on a not-yet-tested suite — this
session's most consistently productive pattern, having found 8 real
defects across three sweeps — or (2) resurface F-01 (Warranty field
list), the standing uncompleted request. Per the pattern established
earlier this session, **a new test-execution sweep** is recommended,
with F-01 flagged for the user's attention.

---

## Primary Next Step

**Run a new formal test-case-execution sweep on a not-yet-tested suite**
(candidates: `TS-LOGIN`, `TS-DASH`, `TS-WARRANTY-001`, `TS-ORACLE-001`,
`TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES`).

## Why This Is Next

All three prior sweeps (QR/Barcode+Audit+Dashboard; Asset-Registry/
Detail/Category/Custody; Check-in/Check-out+Maintenance) surfaced real,
previously-undetected, non-PRD-blocked defects purely by executing
existing `RAISE-TEST-CASES.md` steps against the real running app. With
every actionable finding from those sweeps now resolved, a fresh suite
is the next highest-value, non-blocked action — same reasoning as the
prior recalculation.

## Dependencies

None technically. Re-check `RAISE-TRACEABILITY-MATRIX.md` §3 before
picking a suite — `TS-LOGIN` (Auth is built, demo-only) is the most
promising remaining candidate (built enough to produce a meaningful,
non-trivially-`BLOCKED` result); `TS-DASH` likely re-confirms F-22's
already-known gap rather than surfacing new information;
`TS-WARRANTY-001`/`TS-ORACLE-001`/`TS-ALERT-001`/`TS-AI-SEARCH-001`/
`TS-AI-STATES` are entirely TBD and would mostly return
`NOT_IMPLEMENTED` with little new insight.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `RAISE-TRACEABILITY-MATRIX.md` §3 and confirm `TS-LOGIN` (or whichever
  suite is chosen) is genuinely the most-built untested option before
  starting.
- Execute each test case's exact steps against the real running app
  (browser automation, same pattern as the three prior sweeps).
- Record real PASS/FAIL evidence per case; update
  `RAISE-TRACEABILITY-MATRIX.md`'s Test Status for the affected
  requirement row(s) with real evidence, not assumption.
- Any new defect found becomes a new `F-NN` in `OPEN-FINDINGS.md`'s
  "Confirmed via Test Execution" category, per this session's
  established pattern.

## Acceptance Criteria

N/A directly — this is a validation task, not a feature. Success is
"every case in the chosen suite has a real, evidence-based Test Status,"
not a specific pass/fail outcome.

## Validation Method

This *is* the validation task — no separate build/lint/test cycle
applies unless a found defect is then fixed (a follow-up task, scoped
separately per this session's established one-fix-per-PR pattern).

## Related Checkpoint

`CHECKPOINT-2026-08-26-001`, `CHECKPOINT-2026-08-26-003`,
`CHECKPOINT-2026-08-28-003` (the three prior test-execution sweeps this
continues the pattern of).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low risk — this is read-only validation, no code changes. The only risk
is picking a suite too far from built (pure TBD), wasting the sweep on
trivial `NOT_IMPLEMENTED` results — mitigate by checking
`RAISE-TRACEABILITY-MATRIX.md` §3 first, as noted above.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `RAISE-TRACEABILITY-MATRIX.md`
(affected requirement rows), `OPEN-FINDINGS.md` (any new findings),
`CURRENT-STATUS.md`, `PROJECT-TIMELINE.md`, this file. `DEVELOPMENT-LOG.md`/
`CHANGELOG.md` only if the sweep itself ships as a PR (docs-only, per
this session's established convention of shipping test-execution results
as their own PR, separate from any resulting fix).

## After Completion

Recalculate. If the new sweep finds defects, triage them the same way
prior findings were (smallest/most self-contained first). If it finds
none new, F-01 (Warranty field list) becomes the strongest remaining
candidate to surface to the user again.
