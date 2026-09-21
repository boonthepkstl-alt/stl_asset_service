# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-21 (second run this day), after
`CHECKPOINT-2026-09-21-002`. Triggered by Protocol **Step 11 — Recalculate**.

---

## Current State

**Git.** `main` is at **`755b5a0`** (PR #141's merge commit). The F-58 fix sits
on `docs/f58-stale-migration-doc-citations`.

**What changed since the last run.** **F-58 is closed.** The three source files
citing `SOFTWARE-LICENSE-MIGRATION.md` no longer do. `git log --all` confirmed
the document was **never committed at any point**, so there was nothing to
retarget to; writing it to satisfy three comments was rejected as scope creep,
and was unnecessary because each comment already stated its own point in full.
Comment-only, proven with `git diff -U0`.

**Chain document versions:** PRD **v0.21**, Design **v0.19**, Prototype
**v0.20**, AC **v0.19**, Test Plan **v0.20**, Test Cases **v0.34**, Matrix
**v2.16**, Compliance Review **v1.4**. **Gap 21 remains the only open gap** of 27.

**Board:** **8 `PASS` · 1 `PASS (partial)` · 2 `FAIL` · 6 `BLOCKED`** across 17
MVP requirements. Frontend 54 files / 288 tests; backend clean.

---

## Primary Next Step

**None. Wait for an answer to DR-01, DR-02 or DR-03.**

Classification: **`BLOCKER`** — and the blocker is not ours to clear.

---

## Why This Is Next

**This run deliberately does not name a task, because naming one would be
dishonest.** With F-58 closed, **every remaining item on the board waits on a
decision that has been asked and not answered.** The protocol's Step 6 asks for
exactly one primary next step; Step 5 forbids inventing scope; and Step 4 says
that when a dependency blocks the planned task, select the dependency instead.
**Here the dependency is a business answer, and there is nothing behind it to
select.**

**What is actually outstanding, all three written up and sendable:**

| Request | Finding | What it unblocks |
|---|---|---|
| **DR-02** | **F-03** | `RAISE-FR-EXEC-001` → full `PASS`, **Gap 21** closed, NBV tile + P-018 section buildable. **The only item that would move a Compliance Review verdict.** |
| **DR-03** | **F-55** | The Create Requisition flow in real-API mode. Option (a) is downstream of **F-08**. |
| **DR-01** | **F-57** | Whether Software License is MVP at all. "No" is a complete answer that closes it. |

**DR-02 is the one worth chasing first.** `frontend/src/lib/nbv.ts` already
implements RQ46's formula in full with 15 passing tests and takes the
useful-life lookup as an injected parameter. **It has zero production importers
because there is nothing to feed it.** The gap between "blocked" and "shipped"
there is a set of numbers, not a build.

**What remains that is technically unblocked is not worth promoting, and this
run says so rather than dressing one up as a priority:**

- **F-14's remaining half** — image build/push in CI. Capped by **F-13**; can
  only reach publish, not deploy.
- **F-16's remaining parts** — startup auto-run is itself a decision (racy
  across instances); rollback and CI integration follow it.
- **F-36** — a real `BUG`, but HR owns the numbering rule.
- **Bounding the unparameterized list request** — changes the response of every
  existing caller. A product decision.
- **`F-55`'s register row has 7 columns** in a 5-column table (literal `|` in
  its description). Cosmetic; fold into a future edit of that row.
- **The template's `default: ErrorLevel`** — a footgun for any deployment that
  forgets `LOG_LEVEL`, deliberately left as `go-template-main`'s own behaviour.

**None of these moves a requirement verdict.** Picking one to keep the queue
non-empty is the failure mode to avoid here — **a nearly-empty queue is a
state, not a problem to engineer around.**

---

## Dependencies

A stakeholder answer. Nothing engineering can supply, and nothing it may
supply on the business's behalf — the rule **F-03** has been held open across
four requests to honour, and **F-54** exists because it was once broken.

---

## Expected Output

**From this run: none.** The correct output of a recalculation that finds no
selectable work is an accurate record that there is none.

**When an answer arrives**, the next step follows from which one:

- **DR-02 answered** → values into the P-018 Settings NBV section, wire
  `lib/nbv.ts` to its first real consumer, build the tenth Dashboard tile,
  re-execute `TC-DASH-01`/`TC-EXEC-001-01` against a real ten-tile grid, close
  **Gap 21**, re-verify the Compliance Review **in the same pass**.
- **DR-03 answered** → implement the chosen requester rule; if option (b), the
  chain re-enters at the AC layer first, since it adds a field to a confirmed
  screen.
- **DR-01 answered "yes"** → re-enter the chain at `RAISE-PRD.md`; **not** a
  backend PR.
- **DR-01 answered "no"** → close **F-57** as *confirmed unchanged*. No code.

---

## Acceptance Criteria

Not applicable — no work is selected.

---

## Validation

Not applicable. **Re-run this protocol when an answer lands, or when anything
changes on `main`** — not on a schedule, and not to find something to do.

---

## Risks / Blockers

- **The real risk in this state is manufacturing work to look busy.** Every
  item in the "not worth promoting" list above could be made to sound like a
  priority. None of them is.
- **The second risk is the silence going unnoticed.** All three requests are
  unanswered; DR-02 and DR-03 were first asked on **2026-09-10** in a form
  nobody kept a copy of. **If they go unanswered again, the problem is the
  asking channel, not the questions** — they are written to be answerable now.

---

## Files to Update

None until an answer arrives.

---

## Next Checkpoint

None scheduled. The next checkpoint follows the next answered decision.

---

## Secondary Tasks

See the "not worth promoting" list above — enumerated so nothing is lost, not
as a queue to work through. **Not selectable:** **F-03**, **F-55**, **F-57**.
**F-03/DR-02 remains the only outstanding item that would move a Compliance
Review verdict.**
