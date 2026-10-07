# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-10-07, after `CHECKPOINT-2026-09-24-001` and the merge of
PRs #155/#156. Triggered by Protocol **Step 11 — Recalculate**.

**The previous run was 15 days stale and said so about nothing.** It was dated
2026-09-22 with `main` at `86b3a38`, PRD v0.21, Matrix v2.16, Review v1.4, and
"four requests outstanding, none answered" — all superseded. Its verdict (*None.
Wait.*) happened to survive, which is exactly why staleness here is dangerous:
**a file that is right by accident reads the same as one that is right on
purpose.** Recorded because this is the second tracking document in two weeks
found silently behind (see `DEVELOPMENT-LOG.md`'s backfill note), and both
stopped updating when delivery sped up.

---

## Current State

**Git.** `main` is at **`fae1092`** (PR #156's merge). PRs #155 and #156 both
merged 2026-10-07; no branch is outstanding.

**What changed since the last run.** **DR-02 was answered.** Business supplied
the ten per-Asset-Type NBV useful-life values (PRD §16 **Resolved Question
54**), closing Open Question 3a and **resolving F-03** after it had been held
open across four separate requests. The chain was propagated end to end, both
NBV surfaces were built (PR #151), and the seven NBV test cases were executed
against the real app (PR #152): **five PASS, two BLOCKED.** Three further
decision requests gained sendable pages (#153, #154, #155) and
`DEVELOPMENT-LOG.md`'s eleven-PR hole was backfilled and then corrected (#156).

**Board: 8 `PASS` · 2 `FAIL` · 6 `BLOCKED` · 1 `PASS (partial)`** across 17 MVP
requirements — **unchanged.** Chain: PRD **v0.22**, AC **v0.21**, Test Plan
**v0.21**, Test Cases **v0.36**, Matrix **v2.18**, Compliance Review **v1.6**.
**Gap 21 remains the only open gap of 27**, narrowed rather than closed: its
build half is discharged and five of its seven cases pass.

**The thing worth noticing about that board.** Two weeks of work — a finding
closed after four requests, a feature built, five test cases executed and
passing — moved **no verdict**. That is the correct outcome each time and was
recorded as such each time, but the pattern now has a name: *everything
remaining is gated on an answer, so delivery capacity is not the constraint.*

**Five requests, four unanswered:**

| Request | Finding | Asked | State |
|---|---|---|---|
| **DR-02** | F-03 | 2026-09-10, re-asked 09-21 | **ANSWERED 2026-09-23** ✅ |
| **DR-03** | F-55 | 2026-09-10, re-asked 09-21 | Awaiting — 27 days |
| **DR-01** | F-57 | 2026-09-18 | Awaiting — 19 days |
| **DR-04** | F-13 | 2026-09-22 | Awaiting — 15 days |
| **DR-05** | F-60 | 2026-09-25 | Awaiting — 12 days |

**All four unanswered requests now have a sendable page, and every page is
still private.** None can be opened by a recipient until it is shared from its
own Share menu — an action only the account holder can take. **This is the
single highest-leverage open item in the project and it is not engineering
work.**

---

## Primary Next Step

**Write F-61 up as a durable decision request, `DR-06`.**

`RAISE has no employee-offboarding feature of any kind`, so an asset stays
`Assigned` to an employee indefinitely once that employee is no longer active.
F-61 records this, verified on four fronts rather than inferred — no
`RAISE-FR-*` covers termination, no screen offers the action, and neither the
mock nor the backend update path contains any cascade. The finding itself says
**"Do not build any part of this without asking."**

**F-61 is the only decision-blocked finding with no durable request.** Every
other one has been written up: F-57→DR-01, F-03→DR-02, F-55→DR-03, F-13→DR-04,
F-60→DR-05. Asking is therefore the one action available that neither invents
scope nor waits on someone else.

---

## Why This Is Next

**Priority class:** `FINDING` → scope question, not an engineering task.
Protocol Step 3 ranks blockers first; none of the six blocking findings is
actionable without a business answer, and all that can be asked have been.

**It is the only candidate that changes data correctness.** Four other findings
also lack a request — F-39 (Modify Specs has no spec fields), F-36's remainder
(seed data violates the Employee ID format the app now enforces), F-43(a)
(parse errors leak Go struct names), F-15 (API versioning genuinely undecided).
All four are developer-facing or cosmetic. F-61 is the only one where the
product is **silently wrong about who holds company assets** — the exact thing
this system exists to track.

**And a deliberate restraint, recorded rather than quietly observed.** Those
four are **not** being written up in the same pass. Four requests already sit
unanswered, the oldest 27 days. Adding four more to an unanswered queue does not
raise the chance of any being answered; it lowers it, and it would convert a
specific, answerable backlog into volume. DR-06 is written because F-61 is new
and materially different in kind — not because the register has spare items.

---

## Dependencies

**None.** Writing a decision request depends on no other work, no business
answer, and no unmerged branch. It is the same shape of task as PR #141
(DR-02/DR-03), PR #144 (DR-04) and PR #156's DR-05 — all completed without
dependencies.

**What DR-06 must NOT do:** propose an answer. The trigger ("a status change? a
dedicated action? HR integration?") and the behaviour ("release immediately?
require confirmation? notify someone?") are both undecided, and F-61 says so.
Per `DECISION-REQUESTS.md`'s standing rule, engineering does not fill in a
missing business value to unblock itself.

---

## Expected Output

1. **`DECISION-REQUESTS.md` § DR-06** — raised date, finding, requirement
   (none; no `RAISE-FR-*` exists, which is itself the finding), status, what is
   blocked, the question, the options identified without choosing, and what
   engineering does with each answer.
2. **A sendable page**, matching the DR-02/04/05 set — same visual system, the
   answer saved to the page, written for a reader outside the codebase.
3. **`OPEN-FINDINGS.md`'s F-61 row** updated to cite DR-06, as F-03/F-55/F-57/
   F-13/F-60 cite theirs.
4. **One PR**, docs only.

---

## Acceptance Criteria

- DR-06 exists with every field the other five carry, and **proposes no answer**.
- "Not yet" is stated as a complete answer, as in DR-03/DR-04/DR-05.
- The page is linked from DR-06's own table, with the private-by-default caveat.
- F-61's row cites DR-06; no other finding row is edited.
- **No `RAISE-FR-*` verdict moves and no requirement is invented** — the PRD is
  not touched, because entering the chain at `RAISE-PRD.md` is what a *yes*
  would trigger, not what asking does.

---

## Validation

- `git diff --check` clean; table integrity checked on both edited rows.
- Docs only — no code, test, migration or config in the diff.
- The published page's `responses` collection reachable and empty before anyone
  answers (the check the DR-04/05 pages had).
- CI green on both jobs before merge.

---

## Risks / Blockers

**The real risk is not in this task.** DR-06 will almost certainly be correct
and almost certainly change nothing, because it joins a queue of four.

**The actual blocker is distribution.** All four unanswered requests have pages;
all four pages are private. Until they are shared, the project's entire
remaining backlog is waiting on something no amount of engineering can advance.
If DR-06 is written and also goes unshared, this run will have added a fifth
unread question — which is worth saying plainly here rather than discovering at
the next recalculation.

**Second-order risk, recorded from this run's own findings:** two tracking
documents were found stale in two weeks. `NEXT-STEP.md` is overwritten each run
and so leaves no visible hole when it falls behind. Re-running this protocol
after every merged PR — not when someone remembers — is the only thing that
prevents it.

---

## Files to Update

| File | Change |
|---|---|
| `DECISION-REQUESTS.md` | New § DR-06, plus the finding list in the header rule |
| `OPEN-FINDINGS.md` | F-61's status cell cites DR-06 |
| `NEXT-STEP.md` | Overwritten by Step 11 after completion |
| `PROJECT-CHECKPOINTS.md` | New Level 1 checkpoint |
| `CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md` | Per the close-out protocol |

---

## Next Checkpoint

`CHECKPOINT-2026-10-07-001` — *"F-61 asked as DR-06."*

**Expected status: 🟡, not ✅.** Writing the request completes the task; it does
not resolve the finding. F-61 stays open, no verdict moves, and the board stays
**8 PASS / 2 FAIL / 6 BLOCKED / 1 partial**.

---

**Document Status:** Live output, overwritten each run.
**Run:** 2026-10-07 · `main` at `fae1092` · Board 8/2/6/1 · Gap 21 open
**Previous run:** 2026-09-22 (15 days stale when replaced — see the note at the top)
