# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-10-07, after `CHECKPOINT-2026-10-07-003`. Triggered by
Protocol **Step 11 — Recalculate**, because two decision requests were answered.
Third run today; each was triggered by a change, not by the calendar.

---

## Current State

**Git.** `main` is at **`6e5f948`** (PR #159). The DR-01/DR-04 answers are on
`docs/dr-01-dr-04-answered`.

**What changed since the last run.** **DR-01 and DR-04 were answered**, both in
chat, both with the cheapest answer their request offered:

- **DR-01 — "not in the first release."** Software License stays Roadmap.
  A re-confirmation of PRD §16 Resolved Question 34, so the PRD is not edited.
  **F-57 → R-42**, confirmed unchanged.
- **DR-04 — "not yet."** Running RAISE beyond a developer's machine is not in
  scope. **F-13 → R-43**, decided: not yet; F-14's image-build remainder becomes
  *not needed yet*.

Also found and fixed: **F-03 never got its Resolved-table row** when it closed on
2026-09-23 — now **R-41**.

**Board: 8 `PASS` · 2 `FAIL` · 6 `BLOCKED` · 1 `PASS (partial)`** — unchanged.
Neither answer touches one of the 17 MVP rows. **Gap 21** still the only open gap
of 27.

**Six requests, three answered:**

| Request | Finding | Answered | How |
|---|---|---|---|
| **DR-02** | F-03 | ✅ 2026-09-23 | chat |
| **DR-01** | F-57 | ✅ 2026-10-07 | chat |
| **DR-04** | F-13 | ✅ 2026-10-07 | chat |
| **DR-05** | F-60 | — | |
| **DR-06** | F-61 | — | |
| **DR-03** | F-55 | — | |

---

## Primary Next Step

**Put DR-05, DR-06 and DR-03 to the account holder directly, in chat.**

**The evidence for the channel is now unambiguous: three answers, all three in
chat, none through a sendable page.** The previous run's primary step —
*confirm whether the pages reached anyone* — has been overtaken by events: the
questions that got answered were never routed through the pages at all. The
pages stay useful as a durable record, and for anyone else they are shared with;
they are not how decisions are actually arriving.

**Order — by what each answer unlocks:**

1. **DR-05** (Asset Type: fixed list or open text). The only one of the three that
   moves Gap 21, and it has a product half — four Asset Types and the whole
   Media Equipment category cannot be registered through the app today.
2. **DR-06** (what happens to a leaver's equipment). Latent rather than live —
   no bad record exists yet — but the only one about custody data being silently
   wrong.
3. **DR-03** (whose requisition, when nobody said). Real but narrow: affects one
   form, only in real-database mode.

Each accepts **"not yet"** as a complete answer, as DR-04 just demonstrated.

---

## Why This Is Next

**Protocol Step 4 — dependencies.** Every remaining engineering item depends on
one of these answers. Nothing else is selectable without inventing scope.

**Step 3 — priority.** DR-05 first because it is the only answer that can move a
gap the traceability matrix tracks.

**The four findings without a request** — F-39, F-36's remainder, F-43(a), F-15 —
**stay deferred, but the reason has weakened and is restated honestly.** They
were deferred so as not to add volume to an unanswered queue of five. The queue
is now three, and the account holder answers promptly when asked directly. Once
the three above are settled, putting these four in the same direct way is the
natural next step. One relationship worth recording without acting on it:
**F-15 (API versioning) matters mainly once something outside the codebase
consumes the API, and DR-04 just put that out of scope** — but architecture §6
says not to resolve its rows by implication, so F-15 stays open until asked.

---

## Dependencies

**The account holder's answers.** No engineering dependency.

---

## Expected Output

For each answer received: the request marked answered in
`DECISION-REQUESTS.md` with the verbatim reply, the finding resolved or
reclassified in `OPEN-FINDINGS.md` with an R-row, and — **only where the answer
supplies a new fact** — a PRD change propagated through the chain, as DR-02's
was. Where it confirms existing scope, as DR-01 did, no chain work follows.

---

## Acceptance Criteria

- Each answer recorded verbatim, dated, with its source channel.
- **Every resolved finding gets its Resolved-table row in the same PR** — the step
  F-03 missed.
- No PRD change invented from a "not yet" or a confirmation.

---

## Validation

- Touched tables rendered through GitHub's GFM endpoint, not checked by pipe count.
- Uniqueness assertions on every anchored edit.

---

## Risks / Blockers

**None in engineering.** The risk worth naming is the opposite of last run's: not
that the requests are unread, but that **the pages could now contradict the
record** if someone the pages were shared with answers one already settled in
chat. Mitigated for DR-01 and DR-04 by writing their answers into the pages'
own stores; the same must be done for each future chat answer.

---

## Files to Update

| File | When |
|---|---|
| `DECISION-REQUESTS.md`, `OPEN-FINDINGS.md` | On each answer |
| The answered request's page store | On each chat answer, so the page shows it settled |
| `DEVELOPMENT-LOG.md` | This PR's row, in the next PR |
| `NEXT-STEP.md` | Re-run on each answer |

---

## Next Checkpoint

Triggered by the next answer.

---

**Document Status:** Live output, overwritten each run.
**Run:** 2026-10-07 (third run today) · `main` at `6e5f948` · Board 8/2/6/1 · Gap 21 open · 3 of 6 requests answered
**Previous run:** 2026-10-07 — its primary step (confirm delivery) was overtaken: answers arrived through chat instead.
