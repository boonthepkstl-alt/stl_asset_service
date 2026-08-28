# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-28, immediately after `CHECKPOINT-2026-08-28-001` (F-25 fix).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. `RAISE-FR-ASSET-001` `PASS` (6/6), `RAISE-FR-ASSET-002` now `PASS (scoped)` (up from `FAIL (partial)`), `RAISE-FR-ASSET-003` `PASS` (3/3). All three Asset-domain requirements from the 2026-08-26 sweep now pass at least at their confirmed-scope level.
- **Current feature:** None actively in progress. Last work: fixed F-25 (no Category & Hierarchy screen) with a scoped-down first cut, per explicit user instruction ("Start on F-25").
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-28-001`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-28-001` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (141/141), `npm run build` all pass; browser-verified live (Asset Management's "By Category" tab shows all 5 categories with correct counts, expands to real assets, click-through to Asset Detail works — folded in from a standalone `/categories` page the same day, per user request, so no separate route/nav entry exists anymore).
- **Open blockers:** None immediately buildable — the two open items from the 2026-08-26 sweeps (F-22, F-27) are both scope/business questions, not engineering tasks.
- **Open findings:** F-01 through F-27 in `OPEN-FINDINGS.md`. **F-23, F-24, F-25, F-26 are all now Resolved (R-06 through R-09).** **F-22** (Executive Dashboard vs. Prototype P-014 mismatch) and **F-27** (Category sub-taxonomy, new this checkpoint) are the only findings remaining from either 2026-08-26 sweep — both are scope questions for a business/design owner, not directly buildable.
- **Remaining work:** No more direct-fix findings remain from the two 2026-08-26 sweeps. Remaining categories of open work: (a) run formal test-case execution on a not-yet-tested suite, (b) resurface F-01 (Warranty field list) — the longest-standing uncompleted request this session, (c) wait for a business/design decision on F-22/F-27.
- **Dependencies:** None block starting a new test-execution sweep. F-01/F-22/F-27 all depend on a human decision this session cannot supply.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Needs a business/design decision: update the prototype, or grow the shipped Dashboard toward it? |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question, new) | Prototype P-005's Computer/Network example tree is illustrative only; no real parent/child taxonomy beyond flat categories is confirmed anywhere in the chain |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — user was asked to confirm this once before and has not yet supplied the field list; the longest-standing uncompleted request in this session |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question — still open, unaffected by any of the recent Asset-domain fixes |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | TS-LOGIN, TS-DASH, TS-OPS-002, TS-MAINT-001, TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AI-SEARCH-001, TS-AI-STATES still not formally executed — the largest remaining pool of genuinely new information available without a business decision |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: both remaining findings from the
2026-08-26 sweeps (F-22, F-27) are scope/business questions, not
engineering tasks — building toward either without a decision would mean
guessing at unconfirmed content, which this session's discipline
explicitly avoids. With no direct-fix "buildable now" item left, the two
real options are: (1) run a new formal test-case-execution sweep on a
not-yet-tested suite — this session's most consistently productive
pattern, having found 6 real defects (F-21 through F-26) across two
prior sweeps — or (2) resurface F-01 (Warranty field list), the
standing uncompleted request. Per the pattern established earlier this
session (continue non-blocked productive work rather than stalling on
an unanswered business question), **a new test-execution sweep** is
recommended, with F-01 flagged for the user's attention.

---

## Primary Next Step

**Run a new formal test-case-execution sweep on a not-yet-tested suite**
(candidates: `TS-LOGIN`, `TS-DASH`, `TS-OPS-002`, `TS-MAINT-001`,
`TS-WARRANTY-001`, `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`,
`TS-AI-STATES`).

## Why This Is Next

The 2026-08-26 sweeps (QR/Barcode+Audit+Dashboard, then
Asset-Registry/Detail/Category/Custody) both surfaced real, previously-
undetected, non-PRD-blocked defects purely by executing existing
`RAISE-TEST-CASES.md` steps against the real running app — a materially
better signal than re-reading code. With the Asset domain's actionable
findings now exhausted, a fresh suite (ideally one covering a *built*
domain, not one that's fully TBD, so results are more than trivially
`NOT_IMPLEMENTED`) is the next highest-value, non-blocked action.

## Dependencies

None technically. Candidate suites should be picked by re-checking
`RAISE-TRACEABILITY-MATRIX.md` §3 for which requirements are actually
built enough to produce a meaningful (non-trivially-BLOCKED) result —
e.g. `TS-LOGIN` (Auth is built, demo-only) or `TS-DASH` (Executive
Dashboard is built, narrow scope) are more promising than
`TS-WARRANTY-001`/`TS-ORACLE-001`/`TS-ALERT-001` (entirely TBD, would
just return `NOT_IMPLEMENTED` with no new insight).

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `RAISE-TRACEABILITY-MATRIX.md` §3 to confirm which suite is most built
  before picking one; don't default to the first name in the candidate
  list without checking.
- Execute each test case's exact steps against the real running app
  (browser automation, same pattern as `CHECKPOINT-2026-08-26-001`/`-003`).
- Record real PASS/FAIL evidence per case; update
  `RAISE-TRACEABILITY-MATRIX.md`'s Test Status for the affected
  requirement row(s) with real evidence, not assumption.
- Any new defect found becomes a new `F-NN` in `OPEN-FINDINGS.md`'s
  "Confirmed via Test Execution" category, per this session's established
  pattern.

## Acceptance Criteria

N/A directly — this is a validation task, not a feature. Success is
"every case in the chosen suite has a real, evidence-based Test Status,"
not a specific pass/fail outcome.

## Validation Method

This *is* the validation task — no separate build/lint/test cycle
applies unless a found defect is then fixed (a follow-up task, scoped
separately per this session's established one-fix-per-PR pattern).

## Related Checkpoint

`CHECKPOINT-2026-08-26-001` and `CHECKPOINT-2026-08-26-003` (the two
prior test-execution sweeps this continues the pattern of).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low risk — this is read-only validation, no code changes. The only risk
is picking a suite that's too far from built (pure TBD), which would
waste the sweep on trivial `NOT_IMPLEMENTED` results with no new
information — mitigate by checking `RAISE-TRACEABILITY-MATRIX.md` §3
first, as noted above.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `RAISE-TRACEABILITY-MATRIX.md`
(affected requirement rows), `OPEN-FINDINGS.md` (any new findings),
`CURRENT-STATUS.md`, `PROJECT-TIMELINE.md`, this file. `DEVELOPMENT-LOG.md`/
`CHANGELOG.md` only if the sweep itself ships as a PR (docs-only,
per this session's established convention of shipping test-execution
results as their own PR, separate from any resulting fix).

## After Completion

Recalculate. If the new sweep finds defects, triage them the same way
F-21/F-23/F-24/F-26 were (smallest/most self-contained first). If it
finds none new, F-01 (Warranty field list) becomes the strongest
remaining candidate to surface to the user again.
