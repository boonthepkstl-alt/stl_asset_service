# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-16, after `CHECKPOINT-2026-09-11-003` and the merge of
**PR #132** (`d35b34a`).

> **Process note on this run, stated once and not repeated below.** The
> previous instance of this file was last *generated* on 2026-09-08 and then
> carried **six appended stale-notes** written between 2026-09-09 and
> 2026-09-10, each correcting the one above it. That is not what this file is:
> the protocol says it is **overwritten in place**, same convention as
> `CURRENT-STATUS.md`. This run discards that accumulation rather than adding a
> seventh note to it. Nothing from the old body is lost that matters — every
> fact it carried is in `PROJECT-CHECKPOINTS.md`, `OPEN-FINDINGS.md`, or the
> matrix, which are the durable records; this file is a recommendation, not a
> history.

---

## Current State

**Git.** `main` is at **`d35b34a`** — the merge commit for **PR #132**
(two parents, `0e5bfbe` and `1bd258d`; **not** a fast-forward merge, verified
with `git rev-list --parents`). **No pull requests are open.** Working tree
clean apart from the pre-existing, untracked-by-this-work
`.claude/scheduled_tasks.lock`.

**The last three merges, all closed out.** PR #129 (`6b5e1f5`, P0 pagination),
PR #130 (`8271e4e`, P1 index hardening), PR #131 (`bea06ea`, P2 API-DB-SPEC
reconciliation) — the three follow-ups from the 2026-09-10 database status
review. Recorded as `CHECKPOINT-2026-09-11-001/-002/-003`. PR #132 then
recorded those checkpoints and, in its second commit (`1bd258d`), corrected
**seven factual errors** a max-effort code review found in the first.

**Chain document versions.** PRD **v0.21**, Design **v0.19**, Prototype
**v0.20**, AC **v0.19**, Test Plan **v0.20**, Test Cases **v0.34**, Matrix
**v2.15**.

**Test/validation state** (run 2026-09-11 during the close-out, not assumed):
frontend **54 files / 288 tests** passing, `tsc --noEmit` and
`eslint --max-warnings=0` clean; backend `go build`/`go vet`/
`go test -count=1 ./...` clean across `controller`/`middleware`/`service`.
PR #129 added **24 backend subtests** (8 per domain) on top of that.

**Traceability matrix.** **Gap 21 is the only open gap** — Gaps 1–20 and
22–27 are all closed; 27 is the highest gap number in the document.

**Open blockers, and what kind of blocker each one is.** Both items that gate
real progress are **business decisions, not engineering work**, and neither
moved this session:

| Item | Blocks | Waiting on |
|---|---|---|
| **F-03** | **Gap 21** (NBV tile, `NBVSettings`, Settings section — none built) | One useful-life value **per Asset Type present in the data** (PRD §16 RQ52 amended RQ46 from per-Category). Asked repeatedly; not supplied. **Still the only item that would move a Compliance Review verdict.** |
| **F-55** | `RAISE-FR-MAINT-001`'s primary create flow **in real-API mode only** | How the requester resolves when no `requesterId` param is passed. Partly downstream of **F-08** (no `User`→`Employee` link exists). |

**Two new facts about shipped code**, surfaced by the 2026-09-15 code review of
the close-out commit and now recorded in `CHECKPOINT-2026-09-11-001`'s Known
Issues. Neither has an `F-NN` row, following the same precedent as Findings 4
and 5 (review findings closed out directly rather than back-filled into the
register):

1. **There is no upper bound on `limit` in any RAISE domain.** The only clamp
   anywhere in the backend is `controller/sampleController.go:224`
   (`if query.Limit > 100`), which belongs to the company template's
   **non-RAISE** demo domain. `employeeController.go`, `ticketController.go`
   and `assetHandoverController.go` do not reference `Limit` at all. A single
   request may still ask for the entire table.
2. **The pagination `LIMIT`/`OFFSET` SQL has never been executed against a
   real database.** This codebase has no repository-level test harness —
   verified, zero test files under `repository/` — so PR #129's 24 subtests
   exercise each service's **in-memory mock repository**, not Postgres. PR
   #130, by contrast, *was* applied to the live container and confirmed via
   `pg_indexes`.

---

## Primary Next Step

**Execute the pagination `LIMIT`/`OFFSET` SQL against the live stack for all
three domains, and record the result — taking PR #129 from `VALIDATING` to
`COMPLETED`.**

Classification: **`VALIDATION`**. Priority: highest *selectable* item (see
below).

---

## Why This Is Next

**The two higher-priority items cannot be selected, and the protocol says so
explicitly.** Step 4: *"Never start a task if a required dependency is
incomplete. If a dependency blocks the planned task, select the dependency
instead."* For both **F-03/Gap 21** and **F-55**, the incomplete dependency is
a **stakeholder decision**, which is not a task this project may complete on
its own behalf — Step 5's "don't invent" rule forbids supplying the missing
values or picking the requester rule unilaterally. So neither is available,
and neither is deferred out of preference.

**Among what remains, this one ranks first on the protocol's own Completion
Rule rather than on appeal.** That rule distinguishes `IMPLEMENTED` (code
exists) from `COMPLETED` (acceptance criteria **and required validation** have
both passed). PR #129 is merged and on `main`, so its code exists — but its
SQL has only ever run against mocks. By the project's own definition it is
**`VALIDATING`, not `COMPLETED`**, and closing that is the cheapest
outstanding step that changes a real status.

**It is also the honest follow-through on a correction just made.** The
close-out record originally claimed live dev-stack verification of exactly
this; the review established that never happened, and PR #132 replaced the
claim with a plain statement that the SQL has not run against a real database.
Performing the verification is what turns that corrected record from an
admission into a closed item — and it is small, because the stack, the seed
data and the method are all already proven by PR #130's identical live pass.

**What is deliberately NOT bundled in.** Adding the missing **max page size**
is a *behaviour change that requires choosing a number*, and this project has
an explicit, repeatedly-tested rule against inventing numbers (F-03 held open
across four requests; F-54 was raised precisely because four SLA numbers were
shipped without authority). It is listed as the secondary task below with a
defensible non-invented option, not folded into a validation pass.

---

## Dependencies

- **Docker stack runnable** — `docker-compose.yml` + the two Dockerfiles, live
  since 2026-09-01 (`DOCKER.md`). Already used for PR #130's live index
  verification and PR #129/#131-era work, so this is proven, not assumed.
- **Seeded data in Postgres** — PR #130's pass ran against roughly 8 seeded
  ticket rows. Enough to exercise page boundaries, though see Risks below.
- **No dependency on F-03, F-55, F-08 or F-16.** This step touches none of
  them and must not be reported as advancing any of them.

---

## Expected Output

- A live execution against the running stack covering, per domain
  (`/employees`, `/tickets`, `/handovers`):
  - default call with **no** `page`/`limit` → full result set, matching
    today's unpaginated behaviour;
  - explicit `limit` → page of that size, with `total` still reporting the
    **full filtered count**, not the page size (this is the specific
    behaviour the corrected records now describe, and the one most worth
    proving on real SQL);
  - explicit `page` → correct offset;
  - a page past the end → **empty page, not an error**;
  - a filter parameter alongside pagination parameters → no interaction bug.
- The result recorded in `CHECKPOINT-2026-09-11-001`'s Integration Test field,
  **replacing** its current "None — and deliberately recorded as none" text,
  and in a new Level 1 checkpoint for this run.
- **No production code change is expected.** If the live run disagrees with
  the mock-backed tests, that is a defect discovery and becomes its own task
  with its own decision about scope — it does not get fixed silently inside a
  validation pass.

---

## Acceptance Criteria

There is **no `RAISE-FR-*` acceptance criterion for pagination** — it is
cross-cutting scalability hardening, not a PRD-traced capability, exactly as
`CHECKPOINT-2026-09-11-001/-002` already record. Stating that plainly rather
than attaching a requirement ID that does not govern this work.

The bar for this task is therefore its own, and is met when: all five
behaviours above are observed against real Postgres for all three domains, the
observations are recorded with the actual requests and responses, and any
divergence from the mock-backed expectations is reported rather than
reconciled.

---

## Validation

- `docker compose up` (or the already-running stack) with the backend and
  Postgres live.
- Real HTTP calls to the three list endpoints, with the responses read back —
  not `curl` output pasted from a prior session, and not inferred from the
  unit tests.
- `total` cross-checked against a direct `SELECT COUNT(*)` on the
  corresponding table for at least one domain, since "`total` must stay the
  full filtered count" is the claim most likely to be wrong and the one the
  mocks cannot prove.
- Backend re-validated on merged `main` after the run: `go build`, `go vet`,
  `go test -count=1 ./...`.

---

## Risks / Blockers

- **Seed volume is small (~8 rows).** Page-boundary cases are still
  exercisable at that size, but it will not surface volume-dependent
  behaviour. Say so in the record rather than implying more coverage than the
  data supports — the same discipline PR #130 applied when it reported that
  `EXPLAIN` still chose a sequential scan at this scale.
- **This proves the SQL, not the API contract's ceiling.** With no `limit`
  bound in place (item 1 above), a passing validation must not be written up
  as "pagination is now safe."
- **No blocker.** Nothing about this step waits on anyone.

---

## Files to Update

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint; amend
`CHECKPOINT-2026-09-11-001`'s Integration Test and Known Issues fields),
`CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md` only if a PR results,
`PROJECT-TIMELINE.md` only if a phase status genuinely changes (it should
not), `CHANGELOG.md` **not** — a validation pass changes nothing a user would
notice. This file, on the next run.

---

## Next Checkpoint

`CHECKPOINT-2026-09-16-001` — "Live-stack validation of the pagination
LIMIT/OFFSET SQL (PR #129 → COMPLETED)".

---

## Secondary Tasks

Listed in priority order. **None of these replaces the primary step**
(Protocol Step 6).

1. **Bound the maximum page size on the three RAISE list endpoints.**
   Classification `FINDING`. The gap is real (item 1 under Current State).
   **The number is the whole question, and there is a non-invented answer
   available:** `sampleController.go:224` already establishes **100** as this
   repository's max page size. Adopting it reuses an existing in-repo
   convention rather than inventing a threshold — precisely what PR #129 did
   when it reused `assets`/`audit_logs`' pagination contract instead of
   designing a new one. **Still requires a go-ahead**, because it changes
   response behaviour for any caller that asks for more.
2. **F-16 — DB migration tooling.** Classification `TECHNICAL_DEBT`.
   Genuinely unblocked, no business input needed: `sql/pg/V*__*.sql` are still
   applied by hand, and V6 was applied that way on 2026-09-11. Larger than it
   looks (tool choice, baselining six existing migrations, CI wiring) and
   **moves no requirement verdict**, which is why it sits below a validation
   pass rather than above it.
3. **F-14's remaining half — image build/push in CI.** Classification
   `TECHNICAL_DEBT`. CI validates both stacks' source but builds no image;
   **F-13 (hosting target) is undecided**, so this can only go as far as
   building and publishing, not deploying.
4. **F-36 — seed fixtures and the backend fallback still emit legacy
   `EMP-…` ids that the app's own validator rejects.** Classification `BUG`,
   but **do not pick a fix without asking**: both available options (invent a
   rule for the HR-issued 6 digits, or remove auto-generation entirely) are
   scope decisions, and HR owns the numbering.

**Not selectable, restated so no future run mistakes them for available
work:** F-03/Gap 21 and F-55 — both waiting on a stakeholder decision.
**F-03 remains the only outstanding item that would move a Compliance Review
verdict.**
