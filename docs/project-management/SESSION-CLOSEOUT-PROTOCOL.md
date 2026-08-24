# RAISE — Development Session Close-Out Protocol

**Purpose:** the checklist every development session runs through before
ending, and the three-level checkpoint model it produces. The point is
that a later question — *"what have we built since Phase 5C started?"*,
*"what changed since the last checkpoint?"*, *"what's unfinished and what's
blocking it?"* — must be answerable **from the evidence in this folder,
`git`, test output, and `docs/07-traceability-matrix/`**, never from an AI
session's own conversational memory. Memory ends when a session ends;
these files don't.

---

## 1. The 14-Step Close-Out Checklist

Run this before ending any development session that touched code or docs:

1. **Check `git status` and `git diff`** — know exactly what's
   uncommitted before doing anything else.
2. **Check which files changed** — not just a count; know *what* changed
   (`git diff --stat`, or per-commit `git show --stat` if already
   committed).
3. **Check Test / Build / Validation** — actually run them
   (`go build`/`vet`/`test`, `tsc`/`lint`/`vitest`/`build`), don't assume
   they still pass because they passed last time.
4. **Compare against the Requirement** — does the work trace to a real
   `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` ID, or is it process/tooling
   (mark `N/A` honestly if so — see [`OPEN-FINDINGS.md`](OPEN-FINDINGS.md)
   for the "don't invent" convention this mirrors)?
5. **Check the work against the previous checkpoint** — read the last
   entry in [`PROJECT-CHECKPOINTS.md`](PROJECT-CHECKPOINTS.md) §Level 1 and
   confirm this session's "Remaining Work"/"Next Step" from that entry is
   actually what got worked on (or note why it diverged).
6. **Create a new Level 1 (Task) Checkpoint** — see §2 below.
7. **Update [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md)** — only if a
   phase's Status/Actual dates genuinely changed; most sessions don't need
   this.
8. **Update [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md)** — one row per
   merged PR. Do not add a row for work that isn't merged yet.
9. **Update [`CHANGELOG.md`](CHANGELOG.md)** — only for user/API-visible
   changes, per that file's own rule; skip pure doc-sync sessions.
10. **Update [`CURRENT-STATUS.md`](CURRENT-STATUS.md)** — overwrite the
    relevant table rows in place; this file always describes "now."
11. **State Known Issues explicitly** — don't let a discovered problem go
    unrecorded because the session ran out of time.
12. **State Remaining Work explicitly** — what's left for *this specific
    task/feature*, not a restatement of the whole backlog.
13. **State the Next Recommended Task** — one concrete next step, not a
    menu (a menu is fine mid-conversation; a close-out record should
    commit to one recommendation).
14. **Never report "Completed" if Acceptance Criteria haven't passed.**
    This is the hard constraint the other 13 steps serve. Use `⏳
    In Progress`, `🚧 Partial (AC not met)`, or `🔴 Blocked` instead — see
    the status vocabulary in §4. A build that compiles and tests that pass
    are necessary, not sufficient, for "Completed."

## 2. The Three Checkpoint Levels

| Level | Question it answers | Cadence | Where it lives |
|---|---|---|---|
| **1 — Task** | What did the AI actually do in this task/PR? | Every merged PR (or every session, if unmerged work needs a record) | `PROJECT-CHECKPOINTS.md` §Level 1 |
| **2 — Feature** | How far has this feature progressed, across all its tasks? | When a feature's status changes, or a session touches it | `PROJECT-CHECKPOINTS.md` §Level 2 |
| **3 — Phase** | Is this phase ready to pass its gate? | When a phase's completeness is in question, or before claiming a phase done | `PROJECT-CHECKPOINTS.md` §Level 3 |

A Level 2 checkpoint is a **rollup**, not new information — it should be
derivable by reading its listed Level 1 checkpoints plus
`CURRENT-STATUS.md`. A Level 3 checkpoint is a rollup of Level 2s plus an
explicit **Gate verdict** against `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md`.
None of the three levels should introduce a fact that isn't traceable to
git history, test output, or a chain document.

### Level 1 — Task Checkpoint template

See the template already established at the top of
[`PROJECT-CHECKPOINTS.md`](PROJECT-CHECKPOINTS.md).

### Level 2 — Feature Checkpoint template

```
FEATURE-CHECKPOINT-<feature-slug>

Feature:
Maps to Phase(s):
Maps to Requirement(s):

Task Checkpoints included:
  (list of CHECKPOINT-<date>-<NNN> IDs that belong to this feature)

Progress Summary:
  (what's done, in plain terms — derived from the listed Task Checkpoints)

Acceptance Criteria Status:
  (per AC group: Met / Partial / Not Met — cite the AC ID and traceability
  matrix Test Status column, don't restate from memory)

Status: ✅ Feature-complete for current scope | 🟡 Partial | 🔴 Not started

Known Issues:
Remaining Work:
Next Recommended Task:
```

### Level 3 — Phase Checkpoint template

```
PHASE-CHECKPOINT-<phase-number>

Phase:
Feature Checkpoints included:
  (list of FEATURE-CHECKPOINT-<slug> entries under this phase)

Gate Criteria:
  (what "done" means for this phase — usually: every in-scope AC group in
  the traceability matrix is not BLOCKED, and every listed Deliverable in
  PROJECT-TIMELINE.md exists)

Gate Verdict: ✅ PASSED | 🔴 NOT PASSED
  (if NOT PASSED, list exactly which criteria failed and cite the
  traceability matrix row(s) — this is the field Rule 14 protects)

Known Issues:
Remaining Work:
Next Recommended Task:
```

## 3. How This Answers Follow-Up Questions

| Question | Where the answer comes from |
|---|---|
| "What have we built since Phase 5C started?" | Filter `PROJECT-CHECKPOINTS.md` §Level 1 by date/phase, or read the relevant `PHASE-CHECKPOINT-*` entry |
| "What changed since the last checkpoint?" | Diff the current `git status`/`git log` against the previous checkpoint's **Git: Commit** field |
| "What's unfinished and what's blocking it?" | `OPEN-FINDINGS.md` (ID-tagged, with source citations) + any `🔴 NOT PASSED` Phase Checkpoint's Gate Verdict reasons |

If an answer can't be produced this way — if it would require recalling
something not written down anywhere — that's a gap in this protocol's
execution, not a reason to answer from memory. Fix the gap by adding the
missing checkpoint/log entry, then answer.

## 4. Status Vocabulary

Used consistently across all three checkpoint levels and `CURRENT-STATUS.md`:

| Symbol | Meaning |
|---|---|
| ✅ | Complete for its currently confirmed scope — all relevant AC met |
| 🟡 | Partial — some AC met, some blocked/not met |
| 🚧 | In progress — actively being worked, not yet ready for AC evaluation |
| 🔴 | Blocked or Not Started |
| ⚪ | Not scheduled / out of current scope (e.g. Roadmap) |

**Never substitute ✅ for 🟡 or 🚧 to make a status update read better.**
