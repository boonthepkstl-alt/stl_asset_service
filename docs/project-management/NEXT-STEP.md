# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-005` (F-33 explicitly deferred by user decision — not built).

---

## Current State

- **Current phase:** Phase 9 — AI Document Intelligence & Search. `RAISE-AI-SEARCH-001` unchanged (still two non-matching placeholder surfaces) — the decision is to leave it that way until real AI backend integration lands.
- **Current feature:** None actively in progress. Last work: presented F-33's options to the user; recorded the decision to defer.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-005`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-005` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 No code changed — this was a documentation-only decision record. No build/lint/test/type-check impact.
- **Open blockers:** Only `AC-WARRANTY-001-03`'s 90-day-window question remains a genuinely undecided open item — every other finding now has an explicit decision recorded (Resolved or explicitly deferred).
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md`. **F-22, F-27, F-30, F-32 are Resolved (R-13/R-14/R-15/R-16). F-31 and F-33 are explicitly deferred by business decision, not awaiting one.** No finding remains in an "undecided, waiting on the user" state except the Warranty 90-day question.
- **Remaining work:** No direct-fix findings, no unexecuted validation, and no undecided findings remain (except the Warranty threshold).
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — the user considered the same 3-option framing used for F-31 (scoped build / defer / ask for detail) and again chose to defer, consistent with F-33's larger scope (8 test cases, 5 response states) compared to F-27/F-30/F-32's narrower fixes.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | The one remaining genuinely undecided item — separate from F-01, which is otherwise fully resolved |
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

Per `NEXT-STEP-PROTOCOL.md` §Step 3: **every open finding now has an
explicit decision recorded** — F-22/F-27/F-30/F-32 Resolved, F-31/F-33
explicitly deferred. This is a genuine milestone: the only remaining
undecided item in the entire backlog is `AC-WARRANTY-001-03`'s 90-day
threshold. There is no direct-fix engineering item and no unexecuted
validation task left to pick autonomously.

---

## Primary Next Step

**Check in with the user on the last remaining undecided item:**

**`AC-WARRANTY-001-03`** — the Warranty "Expiring" 90-day rule. PRD
§6.7's "90 days" is an illustrative business example, not a confirmed
generalizable threshold. Resolving this would unlock the 3rd Warranty
Timeline state ("Expiring," alongside the already-built Active/Expired)
on both the Assets Registry Warranty column and the Alerts screen
(which could then surface "expiring soon" warranties alongside the
already-built "expired" alerts).

If the user has no immediate answer, reasonable non-decision-dependent
work includes:
- A `/code-review` pass across other recent PR diffs.
- Drafting `RAISE-COMPLIANCE-REVIEW.md` — the one deliverable-chain
  document that has never been started, per `CLAUDE.md`'s deliverable
  chain diagram. This is now a strong candidate: the traceability
  matrix it would summarize is at v1.2 with every historical gap
  closed, and every finding has an explicit decision recorded.
- A live re-verification sweep against `BASELINE-CHECKPOINT-2026-08-24`
  (still the last full live `git`/source re-scan) to confirm
  `CURRENT-STATUS.md` hasn't drifted from reality after this session's
  volume of changes.

## Why This Is Next

Every previously-identified "clearly next" item — nine formal
test-execution sweeps, F-01's resolution and implementation, a
`/code-review` fix, F-22/F-27/F-30/F-32's full resolutions, and
F-31/F-33's deferral decisions — has been completed. The remaining
backlog is down to one genuinely undecided item plus a set of
already-categorized blocked/deferred/accepted items.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-09-01-005` (most recent, F-33 deferral decision).

## Related Git Branch/Commit

`docs/defer-f33-ai-assistant` — pending PR (predicted #62).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a decision only the
user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
