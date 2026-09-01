# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-007` (`TC-WARRANTY-001-06` executed — found and fixed a real RBAC gap, Settings was not actually admin-gated — R-18).

---

## Current State

- **Current phase:** Phase 3 — Asset Management (Warranty sub-domain). `RAISE-FR-WARRANTY-001` now a full, unqualified `PASS` — all 6 test cases formally executed and passing.
- **Current feature:** None actively in progress. Last work: executed `TC-WARRANTY-001-06`, which surfaced and fixed a real defect (Settings wasn't actually gated to ADMIN).
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-007`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-007` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section; branch/commit/push/PR still pending).
- **Current status:** 🟡 Code changed, tests passing (153/153), live-verified, **not yet committed to git** — working tree is on `main`, uncommitted, awaiting branch creation and PR (predicted #64, per `gh pr list`).
- **Open blockers:** None. Every finding in the standing backlog is now either Resolved or explicitly deferred, and no coverage gap remains in the Warranty domain.
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md` (F-34 resolved as R-18, no longer a standalone open row). **F-22, F-27, F-30, F-32 Resolved (R-13/R-14/R-15/R-16); the Warranty threshold question Resolved (R-17); the Settings access-gate defect Resolved (R-18). F-31 and F-33 explicitly deferred by business decision, not awaiting one.**
- **Remaining work:** Git branch/commit/push/PR for this session's `TC-WARRANTY-001-06` fix — not yet done.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — user confirmed a per-Asset-Category configurable threshold (not a fixed global number) after an initial "specify a different number" answer was followed by an explicit clarification ("different equipment's warranty periods aren't the same").

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Git branch/commit/push/PR for the Warranty threshold work | `SHIP_PENDING` | Code implemented, tested, live-verified, and doc chain fully synced — only git governance steps remain |
| `TC-WARRANTY-001-06` (non-admin denial to new Settings screen, F-34) | `FINDING` (coverage gap, not a business question) | The underlying UI-only MVP RBAC mechanism already exists elsewhere in the app — this is executing one test case, not building new capability |
| F-33: AI Assistant (P-015) doesn't answer questions or exhibit response states | `FINDING` (build gap, confirmed by execution) | **Explicitly deferred 2026-09-01** — not building until real AI backend integration lands |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | **Explicitly deferred 2026-09-01** — not building until real Oracle FA integration lands (F-04 resolved) |
| F-06/F-05/F-04: citation format / alert rules (beyond warranty) / Oracle integration mechanism | Blocked on business decision | Underlying content questions beneath the deferred F-33/F-31 build gaps |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — separate from F-30's now-resolved infrastructure half |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — retained as a documented future enhancement by F-22's resolution, not itself resolved |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed (F-11/F-12) |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| Header bell-icon dropdown still hardcoded empty | `TECHNICAL_DEBT` (minor) | Flagged in F-32's resolution as a separate, smaller-scope item |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: the Warranty threshold question —
the last genuinely undecided item in the standing backlog — is now
resolved, implemented, and verified, but **not yet shipped**. The
highest-priority next action is completing the git governance steps
(branch → commit → push → PR), not starting new work. `TC-WARRANTY-001-06`
(F-34) is the only remaining buildable-now item, and it is small
(one test case against an already-confirmed RBAC mechanism), not urgent
relative to shipping.

---

## Primary Next Step

**Ship this session's work:** create a git branch, commit the frontend
code + all 7 synced deliverable-chain documents + `OPEN-FINDINGS.md`/
`PROJECT-CHECKPOINTS.md`/`CURRENT-STATUS.md`/`PROJECT-TIMELINE.md`/
`CHANGELOG.md`/`DEVELOPMENT-LOG.md`, push, and open a PR (predicted
#63). **Do not merge until the user explicitly says "merge PR #N"** —
per this project's strict, unwavering governance rule.

After shipping, reasonable next items (in no particular priority order,
none blocking):
- Execute `TC-WARRANTY-001-06` (F-34) — a non-admin user should be
  denied access/write to the new Settings > Warranty screen, at the
  already-confirmed MVP UI-only RBAC enforcement level.
- A `/code-review` pass across this session's diff.
- Drafting `RAISE-COMPLIANCE-REVIEW.md` — the one deliverable-chain
  document that has never been started, per `CLAUDE.md`'s deliverable
  chain diagram. The traceability matrix it would summarize is at v1.3
  with every historical gap resolved except the newly-opened, still-
  open Gap 13 (F-34).
- A live re-verification sweep against `BASELINE-CHECKPOINT-2026-08-24`
  (still the last full live `git`/source re-scan) to confirm
  `CURRENT-STATUS.md` hasn't drifted from reality after this session's
  volume of changes.

## Why This Is Next

The Warranty threshold question was the last genuinely undecided item
in the standing backlog. It has now been resolved, implemented, tested
(151/151, `tsc`/lint clean), and live-verified in the browser, and the
decision has been propagated through all 7 documents in the deliverable
chain plus `OPEN-FINDINGS.md`. The only thing standing between this
work and "done" is git shipping — no further design or business
decision is required.

## Dependencies

None — this is a shipping task, not a decision.

## Expected Output

A merged PR (once the user instructs merging) containing: 8 frontend
files, 7 deliverable-chain documents, and 6 `docs/project-management/`
tracking files.

## Acceptance Criteria

`AC-WARRANTY-001-01` through `-05` PASS (already verified). `-06` is a
separate, smaller follow-up (F-34), not a blocker on shipping this PR.

## Validation Method

Already done: `npx tsc --noEmit`, `npm run lint`, `npx vitest run`
(151/151), live browser verification via `mcp__Claude_Browser__*` tools
(Settings > Warranty, Assets list, Asset Detail).

## Related Checkpoint

`CHECKPOINT-2026-09-01-007` (most recent, `TC-WARRANTY-001-06` execution + RBAC fix).

## Related Git Branch/Commit

Not yet created — predicted branch name
`frontend/execute-tc-warranty-001-06`, predicted PR #64 (verify
via `gh pr list` before treating as final).

---

## Risks / Blockers

None. The only open item (F-34) is non-blocking and independently
schedulable.

## Files to Update (after implementation, per Step 10)

N/A — already done as part of this checkpoint (all 7 chain documents +
6 tracking files updated).

## After Completion

Recalculate once the PR is created (and again once merged, per
`SESSION-CLOSEOUT-PROTOCOL.md`).
