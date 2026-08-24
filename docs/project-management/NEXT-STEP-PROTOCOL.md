# RAISE — Next-Step Development Protocol

**Purpose:** the decision process for choosing what to work on next —
evidence-driven, not assumed or picked arbitrarily. Companion to
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md): that
protocol closes out a session's work; this one decides what the *next*
session (or the next step within one) should be. Together they form a
loop: **close out → recalculate → select → implement → checkpoint → close
out again.**

**Live output:** running this protocol produces
[`NEXT-STEP.md`](NEXT-STEP.md) — overwritten in place each time it's
re-run, same convention as `CURRENT-STATUS.md`.

---

## Objective

Determine the next development task from the current project state — never
from assumption, and never by picking whatever seems interesting.

## Required Sources

Before selecting the next task, inspect all of:

1. [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md)
2. [`PROJECT-CHECKPOINTS.md`](PROJECT-CHECKPOINTS.md)
3. [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md)
4. [`CURRENT-STATUS.md`](CURRENT-STATUS.md)
5. `PROJECT-PLAN.md` (does not exist yet in this project — treat as N/A
   until one is created; do not fabricate its contents)
6. PRD / Requirements — [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md)
7. Acceptance Criteria — [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md)
8. Test Plan / Test Cases — [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md), [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md)
9. Traceability Matrix — [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
10. Open Findings — [`OPEN-FINDINGS.md`](OPEN-FINDINGS.md)
11. `git status`, current branch, recent commits, and relevant diffs
12. Existing source code and tests (`go-template-main/`, `frontend/`)

## Decision Process

### Step 1 — Determine Current State

Identify: current phase, current feature, current task, last completed
checkpoint, current status, open blockers, open findings, remaining work,
dependencies, and plan-vs-actual variance.

### Step 2 — Identify Incomplete Work

Collect from: project plan, timeline, previous checkpoints, requirements,
acceptance criteria, test results, findings, technical debt. Classify each
item as one of: `BLOCKER`, `REQUIRED`, `IN_PROGRESS`, `VALIDATION`, `BUG`,
`FINDING`, `TECHNICAL_DEBT`, `ENHANCEMENT`.

### Step 3 — Apply Priority

1. Blockers
2. Critical/P0 issues
3. Required dependencies
4. Current in-progress work
5. Failed acceptance criteria
6. High/P1 issues
7. Phase dependencies
8. Technical debt affecting upcoming work
9. P2 issues
10. Enhancements

### Step 4 — Check Dependencies

Never start a task if a required dependency is incomplete. If a dependency
blocks the planned task, select the dependency instead.

### Step 5 — Check Scope

Never introduce unrelated features or expand scope without evidence from
the PRD, an approved plan, Acceptance Criteria, or an explicit project
decision — same "don't invent" discipline as everywhere else in this vault.

### Step 6 — Select One Primary Next Step

Exactly one `PRIMARY NEXT STEP`, which must be actionable, traceable,
implementable, aligned with the current phase, and supported by evidence.
Secondary tasks may be listed but never replace the primary one.

### Step 7 — Explain the Decision

For the selected task, state: Task, Priority, Reason, Source of
Requirement, Dependencies, Expected Output, Acceptance Criteria,
Validation Method, Related Checkpoint, Related Git branch/commit.

### Step 8 — Implement

Only after the next step is approved (explicit user go-ahead, consistent
with this project's established workflow of confirming scope before
coding — see every prior checkpoint's PR history):

1. Inspect existing implementation.
2. Implement only the selected scope.
3. Run appropriate tests.
4. Run build/type-check/lint where applicable.
5. Inspect the git diff.
6. Verify requirement traceability.

### Step 9 — Create Checkpoint

A Level 1 Task Checkpoint (per `SESSION-CLOSEOUT-PROTOCOL.md` §2) covering:
what was implemented/modified/fixed, files changed, tests executed,
validation results, requirement traceability, git branch/commit, known
issues, remaining work.

### Step 10 — Update Project State

Update: `PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md`,
`DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`, `CHANGELOG.md`, `NEXT-STEP.md`.

### Step 11 — Recalculate

Never assume the previous next step is still valid. After every completed
checkpoint: **re-read project state → recalculate → select next step.**

## Completion Rule

Never report a feature `COMPLETED` merely because implementation exists.

| Status | Meaning |
|---|---|
| `IMPLEMENTED` | Code exists |
| `VALIDATING` | Validation incomplete |
| `COMPLETED` | Applicable Acceptance Criteria **and** required validation have both passed |

This mirrors `SESSION-CLOSEOUT-PROTOCOL.md`'s Rule 14 exactly — the two
protocols must never contradict each other on this point.

## Output Format

Every run of this protocol ends with, in this order: **Current State →
Primary Next Step → Why This Is Next → Dependencies → Expected Output →
Acceptance Criteria → Validation → Risks / Blockers → Files to Update →
Next Checkpoint.** See [`NEXT-STEP.md`](NEXT-STEP.md) for the current
instance.

**After completion:** recalculate the next step from the updated project
state (Step 11) — do not carry the old `NEXT-STEP.md` forward unexamined.
