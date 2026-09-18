# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-16 (second run this day), after
`CHECKPOINT-2026-09-16-001`. Triggered by Protocol **Step 11 — Recalculate**:
the previous run's `PRIMARY NEXT STEP` has been carried out, so its
recommendation is spent and must not be re-read as current.

---

## Current State

**Git.** `main` is at **`b05dd66`** — the merge commit for PR #133 (two
parents, `d35b34a` and `4ff040d`; not a fast-forward). The validation work
recorded below sits on branch `docs/pagination-live-validation-2026-09-16`,
**documentation only**.

**What changed since the last run.** The previous run's primary step —
executing the pagination `LIMIT`/`OFFSET` SQL against the live stack — **has
been done and passed**, recorded as `CHECKPOINT-2026-09-16-001`:

- **18 live cases** (6 per domain × `/employees`, `/tickets`, `/handovers`)
  against the real backend and real Postgres, all passing: default-no-params,
  explicit `limit`, explicit `page`, partial last page, page past the end
  (HTTP 200 + empty page, not an error), and filter-plus-pagination.
- **`total` cross-checked against direct SQL** on filtered queries —
  `/tickets?priority=Low` → `total=2` vs `SELECT COUNT(*)` = 2;
  `/handovers?status=PENDING_RECIPIENT_CONFIRMATION` → `total=3` vs 3. This is
  the live confirmation that PR #129 was right to leave `SQL_*_pg_count_base`
  unpaginated.
- **A stale container was caught before the first request**: the running
  backend image was built 2026-09-09, two days *older* than the pagination
  commit it was about to be used to test. Rebuilt from `main` first.
- **PR #129 therefore moves from `VALIDATING` to `COMPLETED`** under the
  Protocol's own Completion Rule.

**Chain document versions** — unchanged by that pass, as expected of a
validation: PRD **v0.21**, Design **v0.19**, Prototype **v0.20**, AC **v0.19**,
Test Plan **v0.20**, Test Cases **v0.34**, Matrix **v2.15**. **Gap 21 remains
the only open gap** of 27.

**Test/validation state**, re-run 2026-09-16 on merged `main`: backend
`go build` / `go vet` / `go test -count=1 ./...` all clean; frontend **54
files / 288 tests** (untouched by this work).

**Blockers — unchanged, and both are decisions rather than work:**

| Item | Blocks | Waiting on |
|---|---|---|
| **F-03** | **Gap 21** (NBV tile, `NBVSettings`, Settings section — none built) | One useful-life value per **Asset Type** present in the data (PRD §16 RQ52). **Still the only item that would move a Compliance Review verdict.** |
| **F-55** | `RAISE-FR-MAINT-001`'s create flow in **real-API mode only** | How the requester resolves with no `requesterId` param; partly downstream of **F-08**. |

---

## Primary Next Step

**Bound the maximum page size on the three RAISE list endpoints
(`/employees`, `/tickets`, `/handovers`).**

Classification: **`FINDING`**. **Requires an explicit go-ahead before
implementation** — see Risks.

---

## Why This Is Next

**It is now the only item left from the pagination thread, and yesterday's
validation sharpened rather than closed it.** The live run proved the SQL
computes pages correctly; it proved nothing about what happens when a caller
asks for an unreasonable page. The endpoints accept any `limit`: the only
clamp anywhere in the backend is `controller/sampleController.go:224`
(`if query.Limit > 100`), which belongs to the company template's **non-RAISE**
demo domain, and `employeeController.go` / `ticketController.go` /
`assetHandoverController.go` do not reference `Limit` at all. **A single
request can still ask for the entire table** — the exact class of exposure the
P0 pagination work was raised to remove, left half-closed.

**The higher-priority items remain unselectable for the same reason as the
last run.** F-03/Gap 21 and F-55 both block on a stakeholder decision, which
Protocol Step 4 treats as an incomplete dependency and Step 5 forbids
supplying on the business's behalf. Nothing about them changed.

**It outranks the other unblocked work on exposure, not on size.** **F-16**
(migration tooling still applied by hand) and **F-14's remaining half** (CI
builds no image) are both genuinely unblocked and both real debt — and today's
stale-container incident is fresh evidence for the latter — but neither closes
an open request path, and neither moves any verdict. This does close one.

**The number does not have to be invented, and that is what makes it
selectable at all.** This project holds an explicit rule against inventing
business numbers — F-03 was held open across four separate requests, and
**F-54** was raised precisely because four SLA values shipped without
authority. The same rule applies here, and the exit is the same one PR #129
used: **reuse an existing in-repo convention instead of designing a new one.**
`sampleController.go:224` already establishes **100** as this repository's
maximum page size. Adopting it is a citation, not an invention — exactly as
PR #129 reused `assets`/`audit_logs`' pagination contract rather than
reinventing it. **If the stakeholder wants a different ceiling, that is their
call and this step should take it from them instead.**

---

## Dependencies

None. No business input is required *if* the template's existing 100 is
adopted; a different value would require someone to supply it.

---

## Expected Output

- An upper bound applied to `Limit` for the three RAISE list endpoints,
  implemented **once in a shared place if the codebase already offers one**,
  and otherwise mirrored per controller in the same shape
  `sampleController.go` already uses — establishing no new pattern.
- Unit tests covering: `limit` under the ceiling (unaffected), `limit` above
  it (clamped to the ceiling, **not** rejected with an error — matching the
  template's existing behaviour, which silently clamps), and the existing
  `limit <= 0` default path (unchanged).
- The clamp behaviour documented in **`RAISE-API-DB-SPEC.md`** §3/§4/§6's
  query-string lines, since that document is the as-built API contract and
  currently implies no ceiling exists.
- **`assets` and `audit_logs` explicitly considered and a decision recorded
  either way.** They already paginate and are equally unbounded; extending the
  clamp to them is consistent, *not* extending it leaves an inconsistency this
  step would have created. Deciding it silently is the one outcome to avoid.

---

## Acceptance Criteria

**No `RAISE-FR-*` acceptance criterion governs pagination** — stated plainly
rather than attaching a requirement ID that does not apply, consistent with
`CHECKPOINT-2026-09-11-001/-002` and `-2026-09-16-001`.

The bar is therefore: a request above the ceiling returns at most the ceiling's
worth of rows; `total` still reports the **full filtered count** (the property
the live run just confirmed, and the one a clamp could most easily break); no
existing caller's behaviour changes, since none currently sends a `limit` at
all; and the as-built spec no longer implies an unbounded endpoint.

---

## Validation

- `go build`, `go vet`, `go test -count=1 ./...`, `gofmt` (raw **and** over LF
  content, per R-34).
- New unit tests run individually, not merely via a package-level `ok` — the
  standing practice in this project since PR #128.
- **A live re-run of the relevant subset** against the rebuilt stack: a request
  above the ceiling, and a normal request confirming nothing regressed.
  **Rebuild the backend image first** — see Risks.
- `git diff --check`; confirm `.claude/scheduled_tasks.lock` untouched.

---

## Risks / Blockers

- **This changes response behaviour for any caller that asks for more than the
  ceiling.** No such caller exists today (the frontend sends no `limit` at
  all), which is what makes now the cheap moment to do it — but it is a
  behaviour change, so it needs a go-ahead rather than being folded in as
  cleanup.
- **Clamp silently, or reject with 400?** The template clamps. Rejecting would
  be defensible and is arguably clearer to an API consumer, but it is a
  *different* contract and would diverge from the in-repo precedent this step
  leans on for its authority. **Do not decide this by preference** — take the
  template's behaviour unless told otherwise.
- **Rebuild the dev stack before any live check.** The 2026-09-16 pass found
  the running backend image was two days older than the code under test. Any
  live verification that skips this step is measuring the wrong binary.

---

## Files to Update

`go-template-main/controller/` (the three RAISE controllers) or a shared
helper; the corresponding `_test.go` files;
`docs/09-api-db-spec/RAISE-API-DB-SPEC.md`; then
`PROJECT-CHECKPOINTS.md`, `CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md` (a code PR
does get a row), and this file. **`CHANGELOG.md` — yes**, unlike the last two
steps: a maximum page size is an API-visible behaviour change.

---

## Next Checkpoint

`CHECKPOINT-2026-09-16-002` — "Maximum page size on the RAISE list endpoints".

---

## Secondary Tasks

**None of these replaces the primary step** (Protocol Step 6).

1. **F-16 — DB migration tooling.** `TECHNICAL_DEBT`. Fully unblocked, no
   business input. `sql/pg/V*__*.sql` are still applied by hand. Larger than
   it looks (tool choice, baselining six existing migrations, CI wiring) and
   moves no requirement verdict.
2. **F-14's remaining half — image build/push in CI.** `TECHNICAL_DEBT`. Given
   fresh evidence on 2026-09-16: a developer verifying against a long-running
   local stack silently tests stale code. Can only go as far as build/publish;
   **F-13** (hosting target) is undecided, so deployment is out of reach.
3. **F-36 — seed fixtures and the backend fallback still emit legacy `EMP-…`
   ids the app's own validator rejects.** `BUG`, but **do not pick a fix
   without asking**: both options are scope decisions and HR owns the
   numbering.

**Not selectable, restated so no future run mistakes them for available
work:** **F-03/Gap 21** and **F-55**, both waiting on a stakeholder decision.
**F-03 remains the only outstanding item that would move a Compliance Review
verdict.**
