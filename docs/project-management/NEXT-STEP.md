# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-20, after `CHECKPOINT-2026-09-20-003`. Triggered by
Protocol **Step 11 — Recalculate**.

---

## Current State

**Git.** `main` is at **`64870b0`** (PR #139's merge commit). The
suppressed-`Info`-logging fix sits on `fix/suppressed-info-logging`.

**What changed since the last run.** The previous primary step is done:
application `Info` logging was silently disabled and now is not.
`LOG_LEVEL` was never set anywhere in RAISE, and `util/init.go`'s switch falls
through to `ErrorLevel` for an empty value. Fixed in RAISE's own config, **not**
in the template's default — which is documented as configurable and was left
alone. Cause and effect demonstrated with a control run, not inferred.

**Also closed since the last run:** **F-59** — the matrix's
`RAISE-FR-WARRANTY-001` label was stale, not its body. Corrected at source
(matrix **v2.16**), Compliance Review restored to **v1.4**, MVP pass count back
to **8 of 17 (47%)**.

**Chain document versions:** PRD **v0.21**, Design **v0.19**, Prototype
**v0.20**, AC **v0.19**, Test Plan **v0.20**, Test Cases **v0.34**, Matrix
**v2.16**, Compliance Review **v1.4**. **Gap 21 remains the only open gap** of 27.

**Test state** (2026-09-20): backend `go build` / `go vet` /
`go test -count=1 ./...` clean across four packages; frontend 54 files /
288 tests.

**Board:** **8 `PASS` · 1 `PASS (partial)` · 2 `FAIL` · 6 `BLOCKED`** across 17
MVP requirements.

---

## Primary Next Step

**Write the outstanding business decisions up as durable requests in
[`DECISION-REQUESTS.md`](DECISION-REQUESTS.md) — `DR-02` for F-03 and `DR-03`
for F-55 — and hand them to the stakeholder.**

Classification: **`BLOCKER`** (the work is unblocked; what it unblocks is not).

---

## Why This Is Next

**There is no substantial unblocked engineering work left on this board, and
saying so plainly is more useful than manufacturing some.** Every non-passing
requirement traces to a decision nobody has made. The remaining engineering
items are a stale documentation pointer (**F-58**), a CI step capped by an
undecided hosting target (**F-14**), and deferred halves of **F-16** that are
themselves decisions. None moves a verdict.

**The bottleneck is decision latency, and the project has already shown it
handles that badly.** `CHECKPOINT-2026-09-10-002`/`-003` record that a request
covering **F-03** and **F-55** was *"prepared and sent to the stakeholder
2026-09-10"* — **with no copy of what was actually asked kept anywhere**. Ten
days on, both are unanswered, and there is no way to tell whether the question
was clear, whether it reached the right person, or what exactly was asked. A
question that cannot be re-read cannot be followed up on.

**`DECISION-REQUESTS.md` already exists and already solves this** — it was
created on 2026-09-18 for **DR-01** (F-57, License scope) precisely because of
that gap, and its own closing section flags F-03 and F-55 as the two requests
with no durable copy. **Writing them up is the work this file was made for, and
it is the highest-leverage thing available**: F-03 is the only item that would
move a Compliance Review verdict, and F-55 is a real defect in a shipped flow
that nobody can fix without a rule.

**Why not the alternatives.** **F-58** is trivial and genuinely unblocked, but
it is a comment fix — it belongs in the same PR as anything else touching those
files, not at the top of a board. **F-14's** remaining half stays capped by
**F-13**. **F-16's** remaining parts (startup auto-run, rollback) are decisions,
not tasks. **Bounding the unparameterized list request** changes the response of
every existing caller and is a product decision.

**The caveat this step does not escape:** writing a request does not produce an
answer. If the stakeholder does not respond, the board does not move, and no
amount of engineering effort changes that. **What this step does is make the
non-response visible and specific**, rather than leaving it as an unrecorded
"we asked once."

---

## Dependencies

None. `DECISION-REQUESTS.md` and its `DR-NN` convention already exist.

---

## Expected Output

- **`DR-02` — F-03.** What is missing: one useful-life value **per Asset Type
  present in the data** (PRD §16 **RQ52**, which amended RQ46 from per-Category).
  State what is already settled — formula, salvage zero, clamp, configuration
  location — so the ask is narrow. State what unblocks: `RAISE-FR-EXEC-001` to a
  full `PASS`, **Gap 21** closed, the NBV tile and P-018 Settings section
  buildable.
- **`DR-03` — F-55.** The Create Requisition requester rule. Present the three
  shapes already identified in the finding and **propose none**; record that
  option (a), the logged-in user, is **not implementable today** because no
  `User`→`Employee` link exists (partly downstream of **F-08**).
- Both written to be sent **as-is**, each stating plainly what happens if the
  answer is "no" or "not yet" — a deferral is a complete answer and should not
  require engineering to chase it again.
- `OPEN-FINDINGS.md` F-03 and F-55 rows updated to cite their `DR-NN`.

---

## Acceptance Criteria

No `RAISE-FR-*` criterion governs project governance. The bar: each request
states the question, the inputs required, what each possible answer unblocks,
and **proposes no answer of its own** — the rule `DECISION-REQUESTS.md` opens
with, and the rule F-03 has been held open across four requests to honour.

---

## Validation

Re-read each request cold and check it can be answered **without opening the
repository**. A request that requires the reader to go find context is one that
will sit unanswered, which is the failure this step exists to correct.
`git diff --check`; docs only.

---

## Risks / Blockers

- **Writing a request is not getting an answer.** This step improves the odds
  and the record; it cannot compel a decision.
- **Do not let drafting slide into deciding.** The temptation with F-03 is to
  offer "reasonable" default useful-life values to make the ask easier to say
  yes to. **That is exactly what F-54 records going wrong** — four SLA numbers
  shipped without authority. Offer none.
- **F-55's option (a) must be marked not-implementable**, not merely
  "less preferred" — recommending it without the `User`→`Employee` link would
  hand back an answer that cannot be built.

---

## Files to Update

`docs/project-management/DECISION-REQUESTS.md` (DR-02, DR-03),
`OPEN-FINDINGS.md` (F-03 and F-55 rows cite their request), then
`PROJECT-CHECKPOINTS.md`, `CURRENT-STATUS.md`, and this file.
`DEVELOPMENT-LOG.md` only if a PR results. `CHANGELOG.md` **no**.

---

## Next Checkpoint

`CHECKPOINT-2026-09-20-004` — "Decision requests DR-02 (F-03) and DR-03 (F-55)".

---

## Secondary Tasks

1. **F-58** — three source files cite `SOFTWARE-LICENSE-MIGRATION.md`, which
   does not exist. `TECHNICAL_DEBT`, trivial, unblocked.
2. **F-14's remaining half** — image build/push in CI. Capped by **F-13**.
3. **F-16's remaining parts** — startup auto-run (racy across instances),
   down/rollback, CI integration.
4. **F-36** — legacy `EMP-…` ids the app's own validator rejects. **Do not pick
   a fix without asking**; HR owns the numbering.
5. **Bound the unparameterized list request** — residual from
   `CHECKPOINT-2026-09-18-001`. A product decision about default behaviour.
6. **The template's `default: ErrorLevel`** remains a footgun for any
   deployment that forgets `LOG_LEVEL`. Left alone deliberately — it is
   `go-template-main`'s behaviour, not RAISE's.

**Not selectable:** **F-03/Gap 21**, **F-55**, **F-57** — the three the primary
step is about asking, not answering. **F-03 remains the only outstanding item
that would move a Compliance Review verdict.**
