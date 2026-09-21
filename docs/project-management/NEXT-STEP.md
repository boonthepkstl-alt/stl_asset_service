# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-21, after `CHECKPOINT-2026-09-21-001`. Triggered by
Protocol **Step 11 — Recalculate**.

---

## Current State

**Git.** `main` is at **`c413f53`** (PR #140's merge commit). The DR-02/DR-03
write-up sits on `docs/dr02-dr03-decision-requests`.

**What changed since the last run.** The previous primary step is done: **F-03
and F-55 are now durable, sendable requests** — `DECISION-REQUESTS.md` **DR-02**
and **DR-03**, with both findings' register rows pointing at them. All three
outstanding decisions (DR-01 for F-57 included) now have a copy of what was
actually asked, which the 2026-09-10 request did not.

**Chain document versions:** PRD **v0.21**, Design **v0.19**, Prototype
**v0.20**, AC **v0.19**, Test Plan **v0.20**, Test Cases **v0.34**, Matrix
**v2.16**, Compliance Review **v1.4**. **Gap 21 remains the only open gap** of 27.

**Board:** **8 `PASS` · 1 `PASS (partial)` · 2 `FAIL` · 6 `BLOCKED`** across 17
MVP requirements. Backend and frontend suites clean as of 2026-09-20.

**Blockers — all three now asked, none answered:**

| Item | Request | Waiting on |
|---|---|---|
| **F-03** | **DR-02** | Useful life per Asset Type. **Still the only item that would move a Compliance Review verdict.** |
| **F-55** | **DR-03** | The Create Requisition requester rule; option (a) is downstream of **F-08**. |
| **F-57** | **DR-01** | Whether Software License is promoted from Roadmap to MVP. |

---

## Primary Next Step

**F-58 — fix the three source files that cite `SOFTWARE-LICENSE-MIGRATION.md`,
a document that does not exist.**

Classification: **`TECHNICAL_DEBT`**. Small, and honestly labelled as such.

---

## Why This Is Next

**Because it is the only remaining item that is both unblocked and free of a
pending decision, and that is worth stating plainly rather than dressing up.**
The board is decision-bound: every non-passing requirement waits on DR-01,
DR-02 or DR-03, and writing those was the previous step. **Nothing engineering
does now moves a requirement verdict until one of them is answered.**

**What makes F-58 worth doing rather than skipping.** Three files —
`services/license-service.ts`, `pages/Licenses/index.tsx`,
`pages/LicenseDetail/index.tsx` — point a reader at a design document for the
domain's cross-domain rules, and the document **does not exist anywhere in the
repository**. No test, `tsc` or ESLint run can catch it, because all three
citations sit in comments. It is the same class as the broken
`RAISE-PROJECT-TIMELINE.md` link PR #131 fixed.

**It also needs a judgement call, which is why it is not purely mechanical:**
write the missing document, retarget the citations at whatever superseded it,
or drop them. **Check first whether the content exists under another name** —
retargeting a live pointer is better than deleting a reference to something
that turns out to be real.

**Why not the alternatives.** **F-14's** remaining half stays capped by
**F-13**. **F-16's** remaining parts (startup auto-run, rollback) are decisions
about behaviour, not tasks. **F-36** needs a rule HR owns. **Bounding the
unparameterized list request** changes the response of every existing caller
and is a product decision.

**The honest framing of this whole run:** the queue is nearly empty, and that
is a *state*, not a problem to engineer around. **Manufacturing work to look
busy is the failure mode to avoid here** — the useful thing is to keep the
board accurate and wait for answers.

---

## Dependencies

None. **F-57/DR-01 does not gate this** — correcting a stale pointer in
existing code is not License scope work, and does not touch behaviour, routing
or the Roadmap gating.

---

## Expected Output

- Each of the three citations either pointing at a document that exists, or
  removed with the cross-domain information they promised either inlined or
  dropped as genuinely unneeded.
- **A search performed and recorded first** — under `docs/`, in git history,
  and under any plausible alternative name — so "it does not exist" is a
  verified conclusion rather than an assumption from one `find`.
- **No behaviour change of any kind.** Comments only.

---

## Acceptance Criteria

No `RAISE-FR-*` criterion governs source comments. The bar: no file in the
repository cites a document that does not exist, and the diff contains **only**
comment lines — confirmable with `git diff -U0`, the same check PR #127 used
for its comment-only change.

---

## Validation

`tsc --noEmit`, ESLint, `vitest run` (all three files are covered by existing
tests, so a stray edit outside a comment would surface); `git diff -U0` to
prove every changed line is a comment; `git diff --check`.

---

## Risks / Blockers

- **Do not delete a citation that could be retargeted.** If the content exists
  under another name, pointing at it is the better fix.
- **Do not write a new design document to satisfy the pointer** unless the
  content genuinely needs to exist. Inventing a document to justify a comment
  is scope creep wearing a tidy hat.
- **Stay out of License scope.** These files belong to a Roadmap-gated domain
  whose MVP status is the open question in DR-01. Touching comments is fine;
  touching behaviour is not.

---

## Files to Update

`frontend/src/services/license-service.ts`,
`frontend/src/pages/Licenses/index.tsx`,
`frontend/src/pages/LicenseDetail/index.tsx`; `OPEN-FINDINGS.md` (F-58 →
Resolved); then `PROJECT-CHECKPOINTS.md`, `CURRENT-STATUS.md`, and this file.
`DEVELOPMENT-LOG.md` if a PR results. `CHANGELOG.md` **no** — invisible to users.

---

## Next Checkpoint

`CHECKPOINT-2026-09-21-002` — "F-58: stale SOFTWARE-LICENSE-MIGRATION.md
citations".

---

## Secondary Tasks

1. **F-14's remaining half** — image build/push in CI. Capped by **F-13**.
2. **F-16's remaining parts** — startup auto-run (racy across instances),
   down/rollback, CI integration.
3. **F-36** — legacy `EMP-…` ids the app's own validator rejects. **Do not pick
   a fix without asking**; HR owns the numbering.
4. **Bound the unparameterized list request** — residual from
   `CHECKPOINT-2026-09-18-001`. A product decision about default behaviour.
5. **`F-55`'s register row has 7 columns in a 5-column table** (its description
   contains literal `|`). Pre-existing and cosmetic; fold into any future edit
   of that row rather than making it its own change.
6. **The template's `default: ErrorLevel`** remains a footgun for any
   deployment that forgets `LOG_LEVEL`. Left alone deliberately.

**Not selectable:** **F-03**, **F-55**, **F-57** — asked, unanswered. **F-03
remains the only outstanding item that would move a Compliance Review verdict.**
