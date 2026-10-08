# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-10-08, after `CHECKPOINT-2026-10-08-001`. Triggered by
Protocol **Step 11 — Recalculate**, because the last three decision requests were
answered and propagated through the chain.

**For the first time in four runs, the primary step is engineering work.**

---

## Current State

**Git.** `main` is at **`1b1c0a4`** (PR #160). DR-03/05/06 and the full chain
propagation are on `feature/dr-03-05-06-answers`.

**What changed since the last run.** **All six decision requests are answered.**
DR-05: Asset Type is **open text** (RQ55). DR-06: `Inactive` or `On Leave` means the
holder has gone, and equipment stays assigned until IT confirms each item back,
with a visible marker — a **new MVP requirement, `RAISE-FR-ASSET-004`** (RQ56).
DR-03: the requester is the logged-in user, **effective with the Roadmap user
store** — no MVP change (RQ57). Chain: PRD v0.23 → Matrix v2.19, Compliance
Review v1.8.

**Board: 7 `PASS` · 2 `PASS (partial)` · 2 `FAIL` · 6 `BLOCKED` · 1 `NOT_TESTED`
of 18 — 7 of 18 (38.9%), from 8 of 17 (47.1%).** Two causes, neither a product
regression: a new requirement built nowhere, and `RAISE-FR-ASSET-001` moved to
`PASS (partial)` because its new criteria catch a shipped defect (the Create Asset
form omits Media Equipment).

**Open gaps: 4 of 30** — Gap 21, Gap 28, Gap 29, Gap 30.

---

## Primary Next Step

**Build the open-text Asset Type field and correct the Category list on Create
Asset, then execute the cases they unblock.**

| Change | Closes | Then executes |
|---|---|---|
| Type: closed six-option `Select` → free text with existing types suggested (RQ55) | **Gap 29** | `TC-ASSET-001-05..07` |
| Category: add **Media Equipment**, the confirmed fifth value | **Gap 30** | `TC-ASSET-001-08` |
| — the precondition RQ51 needed now exists through the UI | **Gap 21** | `TC-DASH-04`, `TC-EXEC-001-04` |

**If every case passes:** `RAISE-FR-ASSET-001` returns to `PASS` and
`RAISE-FR-EXEC-001` reaches a full `PASS` for the first time — **9 of 18 (50.0%)**.
Stated as arithmetic, not a forecast; the cases decide.

---

## Why This Is Next

**Highest leverage per unit of work.** One small change to one form closes three
gaps and moves two requirements. It needs no further input: the type rule is
RQ55, and the five Categories have been confirmed since RQ41.

**Why not `RAISE-FR-ASSET-004` first.** It is the larger build, and the matrix's
Gap 28 raised three questions nobody has answered — one of which could change its
design:

- **Q-B: can IT find everything held by people who have left?** The prototype
  specifies a per-row badge, and `AC-ASSET-004-13` forbids a new filter or column.
  That may leave IT with no way to list affected assets except by scanning.
- Q-A: should a pending IT Hardware handover whose recipient leaves be marked? The
  rule keys only on `Assigned`.
- Q-C: is the employee status change itself audited?

**Ask those three before building ASSET-004**, the same way the decision requests
were asked — directly, in chat. They are refinements, not blockers, but building
first and asking second risks rework.

---

## Dependencies

**None for the primary step.** The rule and the data are both confirmed.

---

## Expected Output

- `frontend/src/pages/CreateAsset/index.tsx`: Type as free text with suggestions
  drawn from existing types; Category with the confirmed five.
- Tests pinning both, including **that two spellings are stored as entered** —
  RQ55 explicitly declines normalisation, so a test should fail if someone adds it.
- Formal execution of the six cases above against the running app, recorded in
  Test Cases and the matrix; Compliance Review re-verified in the same pass.

---

## Acceptance Criteria

`AC-ASSET-001-05..08` and `AC-DASH-04` / `AC-EXEC-001-04`, as written in AC v0.22.

---

## Validation

- Unit tests, build and lint.
- **Execution against the running app** after merge — the dev server serves the
  main checkout, not a worktree, so the build must merge before the sweep.
- Every touched table rendered through GitHub's GFM endpoint.

---

## Risks / Blockers

**Mock-mode persistence.** `MockAssetRepository` resets on a full page reload, so
`TC-DASH-04` must create the asset and reach the dashboard by in-app navigation,
not a reload. Recorded in Test Cases v0.37.

**Open Question 3b becomes visible.** A newly typed Asset Type will not appear in
the P-018 NBV section, which lists configured types only. That is the correct
behaviour under RQ51 and the open question, not a defect — but the first person to
type a new type will notice it.

---

## Secondary

| Item | Note |
|---|---|
| Ask Gap 28's Q-A, Q-B, Q-C | Before building `RAISE-FR-ASSET-004` |
| Build `RAISE-FR-ASSET-004` | Closes Gap 28; would take the board to 10 of 18 |
| **F-62** — 57 links render as plain text | A sweep **and** a rule in the PRD writer's instructions, or the sweep decays |
| `DEVELOPMENT-LOG.md` | This PR's row, in the next PR |

---

## Next Checkpoint

Triggered when the Create Asset change merges and its cases execute.

---

**Document Status:** Live output, overwritten each run.
**Run:** 2026-10-08 · `main` at `1b1c0a4` · Board 7/2/2/6/1 of 18 · Gaps open 4 of 30 · All 6 decision requests answered
**Previous run:** 2026-10-07 — its primary step (ask DR-05, DR-06, DR-03 in chat) is complete.
