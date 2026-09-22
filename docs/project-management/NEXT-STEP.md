# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-22, after `CHECKPOINT-2026-09-22-001`. Triggered by
Protocol **Step 11 — Recalculate**.

---

## Current State

**Git.** `main` is at **`86b3a38`** (PR #143's merge commit). The DR-04 write-up
sits on `docs/dr04-hosting-decision`.

**What changed since the last run.** **F-13 has been asked for the first time**,
as `DECISION-REQUESTS.md` **DR-04**. It had been open since the architecture
document was written, blocking F-14's remaining half and every
deployment-shaped item in architecture §6, without anyone having put the
question to a person. Also corrected in the same pass: architecture §6 still
claimed no CI pipeline existed — false since **2026-09-04**.

**Board:** **8 `PASS` · 1 `PASS (partial)` · 2 `FAIL` · 6 `BLOCKED`** across 17
MVP requirements. **Gap 21** remains the only open gap of 27. Chain versions
unchanged: PRD **v0.21**, Matrix **v2.16**, Compliance Review **v1.4**.

**Four requests outstanding, none answered:**

| Request | Finding | Asked | What an answer does |
|---|---|---|---|
| **DR-02** | F-03 | 2026-09-10, re-asked 09-21 | `RAISE-FR-EXEC-001` → full `PASS`, **Gap 21** closed. **The only one that moves a verdict.** |
| **DR-03** | F-55 | 2026-09-10, re-asked 09-21 | Fixes the Create Requisition flow in real-API mode. |
| **DR-01** | F-57 | 2026-09-18 | Settles whether Software License is MVP. "No" closes it. |
| **DR-04** | F-13 | 2026-09-22 | "Not yet" closes F-13 **and** takes F-14's remainder off the board. |

---

## Primary Next Step

**None. Wait.**

Classification: **`BLOCKER`** — not ours to clear, for the second run running.

---

## Why This Is Next

**Every item on the board now waits on one of four questions, all asked, none
answered.** Step 6 wants one primary task; Step 5 forbids inventing scope; Step
4 says to select the dependency when it blocks the work. **The dependency is a
human reply, and there is nothing behind it to select.**

**The honest read of this state:** the project is not short of engineering
capacity, it is short of decisions. Three of the four requests can be answered
"not yet" in one line, and **two of those answers would close findings outright**
rather than defer them — DR-01's "no" closes F-57, DR-04's "not yet" closes F-13
and removes F-14's remainder. **A deferral here is progress, not delay.**

**What remains technically available, and why none of it is promoted:**

- **Repository-layer test harness** — 17 of 18 files in `repository/` have no
  automated coverage, and the pagination SQL was verified once by hand. Real
  debt, genuinely unblocked, ~1 day. **Moves no verdict.**
- **Docker image build in CI** — nothing currently checks the Dockerfiles still
  build, and a stale image nearly produced a false validation twice this month.
  **Now explicitly downstream of DR-04**: building toward a registry that may
  not be wanted is work that could be discarded.
- **F-16's remaining parts** — startup auto-run is itself a decision; rollback
  and CI integration follow it.
- **F-36** — a real `BUG`, but HR owns the numbering rule.
- **Bounding the unparameterized list request** — changes every existing
  caller's response. A product decision.
- **`F-55`'s register row has 7 columns** in a 5-column table. Cosmetic; fold
  into a future edit of that row.
- **The template's `default: ErrorLevel`** — a footgun for any deployment that
  forgets `LOG_LEVEL`; left as `go-template-main`'s own behaviour.

**If work is wanted while waiting, the repository test harness is the one worth
doing** — it is the only item on that list that reduces a real risk rather than
tidying one. **It still moves no verdict**, and this file will not pretend
otherwise.

---

## Dependencies

A reply to DR-01, DR-02, DR-03 or DR-04.

**One practical blocker worth repeating:** DR-02's fillable page is **private**
and cannot be opened by its recipient until it is shared from its own Share
menu. Engineering cannot change that.

---

## Expected Output

**From this run: none.** An accurate record that there is no selectable work.

**When an answer lands**, the next step follows from which one:

- **DR-02** → values into the P-018 Settings NBV section, wire `lib/nbv.ts` to
  its first real consumer, build the tenth Dashboard tile, re-execute
  `TC-DASH-01`/`TC-EXEC-001-01` against a real ten-tile grid, close **Gap 21**,
  re-verify the Compliance Review **in the same pass**.
- **DR-03** → implement the chosen requester rule; option (b) re-enters the
  chain at the AC layer first, since it adds a field to a confirmed screen.
- **DR-01 "yes"** → re-enter at `RAISE-PRD.md`, **not** a backend PR.
  **"No"** → close F-57 as *confirmed unchanged*. No code.
- **DR-04 "yes"** → a registry first, then the CI image build. **"Not yet"** →
  close F-13, and F-14's remainder leaves the board.

---

## Acceptance Criteria

Not applicable — no work is selected.

---

## Validation

Not applicable. **Re-run when an answer lands, or when `main` changes** — not on
a schedule, and not to find something to do.

---

## Risks / Blockers

- **Manufacturing work to look busy** is the standing risk in this state. Every
  item in the list above could be dressed up as a priority. None is one.
- **Four unanswered requests is now a pattern, not an incident.** DR-02 and
  DR-03 have been outstanding since **2026-09-10**. If they stay unanswered,
  **the problem is the asking channel rather than the questions** — each is
  written to be answerable in a single reply, and three of the four accept
  "not yet" as a complete answer.

---

## Files to Update

None until an answer arrives.

---

## Next Checkpoint

None scheduled. The next checkpoint follows the next answered decision — or a
deliberate choice to spend time on the repository test harness.

---

## Secondary Tasks

Enumerated in *Why This Is Next* above so nothing is lost — **not a queue to
work through.** **Not selectable:** F-03, F-55, F-57, F-13. **F-03/DR-02
remains the only outstanding item that would move a Compliance Review verdict.**
