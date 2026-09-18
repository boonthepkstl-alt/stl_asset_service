# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-18, after `CHECKPOINT-2026-09-18-001`. Triggered by
Protocol **Step 11 — Recalculate**: the previous run's `PRIMARY NEXT STEP` has
been carried out, so its recommendation is spent.

---

## Current State

**Git.** `main` is at **`c23c9cf`** (PR #134's merge commit, two parents). The
max-page-size work sits on `feature/max-page-size`, **the first code change in
this stretch** — the four before it were documentation.

**What changed since the last run.** The previous run's primary step is done:
**`limit` is now capped at 100 on all five list endpoints**
(`/assets`, `/employees`, `/tickets`, `/handovers`, `/audit-logs`), silently
clamped rather than rejected, via `model.ClampPageLimit`. Neither the value nor
the clamp-don't-reject behaviour was chosen — both were taken from
`sampleController.go:224`, which had already established them. 21 new
assertions, mutation-tested; proven live by seeding `employees` past the
ceiling (155 rows → `?limit=999999` returned exactly 100) and then restoring
the database.

**The pagination thread is now closed except for one deliberate residual:**
**an unparameterized request is still unbounded.** Omitting `limit` returns the
full result set, because the `limit <= 0` default is resolved downstream as
"everything" — and changing it would alter the response of every existing
caller. Recorded in three places so it cannot be mistaken for closed.

**Chain document versions** — unchanged: PRD **v0.21**, Design **v0.19**,
Prototype **v0.20**, AC **v0.19**, Test Plan **v0.20**, Test Cases **v0.34**,
Matrix **v2.15**. `RAISE-API-DB-SPEC.md` gained a shared **Pagination**
contract section (as-built doc, unversioned). **Gap 21 remains the only open
gap** of 27.

**Test/validation state** (run 2026-09-18): backend `go build` / `go vet` /
`go test -count=1 ./...` clean; `gofmt` clean **checked against index content,
the way CI checks it**; frontend untouched at 54 files / 288 tests.

**Blockers — unchanged for the fourth consecutive run, and both are decisions
rather than work:**

| Item | Blocks | Waiting on |
|---|---|---|
| **F-03** | **Gap 21** (NBV tile, `NBVSettings`, Settings section — none built) | One useful-life value per **Asset Type** (PRD §16 RQ52). **Still the only item that would move a Compliance Review verdict.** |
| **F-55** | `RAISE-FR-MAINT-001`'s create flow in **real-API mode only** | How the requester resolves with no `requesterId` param; partly downstream of **F-08**. |

---

## Primary Next Step

**F-16 — wire up a database migration tool.**

Classification: **`TECHNICAL_DEBT`**. **Scope needs agreeing before
implementation** — see Risks.

---

## Why This Is Next

**The pagination thread is finished, and nothing else unblocked is closer to
the product.** F-03/Gap 21 and F-55 remain unselectable for the fourth run
running: both block on a stakeholder decision, which Protocol Step 4 treats as
an incomplete dependency and Step 5 forbids supplying on the business's behalf.
Nothing about either changed.

**Among unblocked work, F-16 is now the largest real exposure.** Six migrations
(`V0`–`V6`) are applied **by hand**. The consequences are not hypothetical and
two of them showed up in the last three days:

- **V6 was applied manually** on 2026-09-11 — one `docker exec psql` away from
  having been forgotten, with nothing in the repository able to tell.
- **There is no record anywhere of which migrations a given database has
  had applied.** The 2026-09-16 validation had to confirm V6's indexes by
  querying `pg_indexes` directly, because no schema-version table exists to ask.
- The official Postgres image runs `sql/pg/*.sql` **only on first init against
  an empty volume** (`docker-compose.yml`'s own comment says so). Any
  migration added after a developer's volume exists is silently skipped for
  them — which is precisely how a stale schema goes unnoticed.

**It is genuinely unblocked.** No business input, no PRD question, no
stakeholder decision — the only open questions are engineering ones.

**Why not the alternatives.** **F-14's remaining half** (CI builds no image) is
real and got fresh evidence on 2026-09-16 when a two-day-stale container nearly
produced a false validation — but it is downstream of **F-13** (no hosting
target decided), so it can only go as far as build-and-publish. **F-36** is a
`BUG` but needs a decision HR owns. Neither is bigger than the schema-drift
exposure above.

**An honest caveat about its value, stated rather than buried:** F-16 moves
**no requirement verdict**. It is infrastructure. It ranks first here because
everything above it is blocked, not because it is the most valuable thing on
the board — **F-03's missing values remain that**, and they are still the only
item that would change a Compliance Review outcome.

---

## Dependencies

None blocking. Note that **F-13** (hosting target) is still undecided, so this
step must not drift into anything deployment-shaped.

---

## Expected Output

- A migration tool selected and wired for the Go backend, with the **choice
  and its rejected alternatives recorded** — this is an architecture decision
  and the repository has no ADR convention yet, so it belongs in
  `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6 alongside F-16's own entry.
- **`V0`–`V6` baselined, not re-run.** Existing databases already have this
  schema; the tool must adopt them as already-applied rather than attempting to
  execute them again.
- A documented path for a developer whose volume predates the tool.
- CI wiring only if it can be done without a hosting decision.

---

## Acceptance Criteria

No `RAISE-FR-*` criterion governs migration tooling — F-16 is filed under
*Infrastructure / Process (not addressed anywhere in the PRD)*, and stating
that is more honest than attaching an ID that does not apply.

The bar: a fresh database reaches the same schema as an existing one; an
existing database is **not** damaged or re-migrated; the applied set is
queryable from the database itself; and `V0`–`V6` remain byte-unchanged — this
step adopts them, it does not rewrite them.

---

## Validation

- A **fresh volume** brought up from empty and its schema compared against a
  current database — including the five V6 indexes.
- An **existing volume** brought up and confirmed unchanged, with the tool
  reporting the migrations as already applied. **This is the case that matters**;
  a tool that quietly re-runs V1 on a populated database is worse than no tool.
- `go build` / `go vet` / `go test -count=1 ./...`; `gofmt` **against index
  content**, not the Windows working tree.
- Rebuild the stack before any live check — the 2026-09-16 stale-image lesson.

---

## Risks / Blockers

- **Scope needs agreeing first.** "Wire up a migration tool" spans a
  one-evening job (a library, baselined, run at startup) and a week (CI
  integration, rollback strategy, per-environment config). **Agree which before
  starting.**
- **Baselining is the dangerous part.** Getting it wrong means re-running
  `CREATE TABLE` against a populated database. Every rehearsal belongs on a
  throwaway volume.
- **Do not let it become a hosting decision.** F-13 is undecided and is not
  this step's to settle.
- **It moves no verdict.** Worth restating so the board is not misread as
  progressing toward MVP acceptance.

---

## Files to Update

`go-template-main/` (tool config, wiring, possibly `go.mod`);
`docker-compose.yml` and `DOCKER.md`; `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6;
`OPEN-FINDINGS.md` (**F-16 is a numbered finding — it gets a real Resolved row
with the merge commit, unlike the un-numbered review findings**); then
`PROJECT-CHECKPOINTS.md`, `CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md`, and this
file. `CHANGELOG.md` **no** — invisible to users.

---

## Next Checkpoint

`CHECKPOINT-2026-09-18-002` — "Database migration tooling (F-16)".

---

## Secondary Tasks

**None of these replaces the primary step** (Protocol Step 6).

1. **F-14's remaining half — image build/push in CI.** `TECHNICAL_DEBT`.
   Fresh evidence 2026-09-16: a developer verifying against a long-running
   local stack silently tests stale code. Capped by **F-13**.
2. **F-36 — seed fixtures and the backend fallback still emit legacy `EMP-…`
   ids the app's own validator rejects.** `BUG`; **do not pick a fix without
   asking** — HR owns the numbering.
3. **Bound the unparameterized request.** `ENHANCEMENT`. The residual left
   open by `CHECKPOINT-2026-09-18-001`. Deliberately *not* ranked higher: it
   changes the response of every existing caller, so it is a product decision
   about default behaviour, not cleanup.
4. **`employeePGRepository.List` cannot tolerate NULLs** in several nullable
   columns (`converting NULL to string is unsupported` → HTTP 500). Found
   incidentally 2026-09-18 from synthetic test data, not from real data; no
   `F-NN` invented. Only reachable by rows the app itself would not create.

**Not selectable, restated so no future run mistakes them for available
work:** **F-03/Gap 21** and **F-55**, both waiting on a stakeholder decision.
**F-03 remains the only outstanding item that would move a Compliance Review
verdict.**
