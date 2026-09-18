# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-18 (second run this day), after
`CHECKPOINT-2026-09-18-002`. Triggered by Protocol **Step 11 — Recalculate**.

---

## Current State

**Git.** `main` is at **`fd8a966`** (PR #135's merge commit). The F-16 migration
runner sits on `feature/f16-migration-runner`.

**What changed since the last run.** The previous run's primary step — F-16's
scoped-down cut — is done. A migration runner now exists (`schema_migrations`
tracking, version-ordered application each in one transaction, invoked as
`docker compose run --rm backend -migrate`), with **no new dependency** and
**V0–V6 neither renamed nor edited**. Adopting a database that predates it
requires an explicit `-baseline=N`; it refuses to guess. Live-verified on every
branch, including the F-16 scenario itself.

**F-16 stays OPEN, narrowed.** Startup auto-run, down/rollback migrations and
CI integration are all still out of scope — the last of those capped by
**F-13**.

**Chain document versions** — unchanged by infrastructure work: PRD **v0.21**,
Design **v0.19**, Prototype **v0.20**, AC **v0.19**, Test Plan **v0.20**, Test
Cases **v0.34**, Matrix **v2.15**. **Gap 21 remains the only open gap** of 27.

**Test state** (2026-09-18): backend `go build` / `go vet` /
`go test -count=1 ./...` clean across four packages — `repository/` now has
tests for the first time. Frontend untouched at 54 files / 288 tests.

**Blockers — unchanged, all three are decisions rather than work:**

| Item | Waiting on |
|---|---|
| **F-03** | Useful-life values per Asset Type. **Still the only item that would move a Compliance Review verdict.** |
| **F-55** | The Create Requisition requester rule; partly downstream of **F-08**. |
| **F-57** | Whether Software License is promoted from Roadmap to MVP — [`DR-01`](DECISION-REQUESTS.md), prepared, unanswered. |

---

## Primary Next Step

**Find out why `logger.GetLogger()`'s Info level is suppressed, and decide
whether that is intended.**

Classification: **`BUG`** (pre-existing, unrelated to any feature).

---

## Why This Is Next

**The application currently emits no INFO logging at all.** Found while testing
the migration runner and verified rather than assumed: the running backend's own
output contains **zero** Info lines — even `main.go`'s `-= Start Service =-`,
a plain `log.Info`, never appears, while `[ERRO]` lines do. Every
`logger.GetLogger().Infof` call in this codebase is therefore writing to
nowhere.

**That matters more than its size suggests.** `[AUDIT]` request lines still
print — they come from Fiber's own middleware, not this logger — so the app
looks adequately instrumented at a glance. What is missing is every deliberate
application-level Info the code emits, including, until it was worked around,
the migration runner's entire success output. **A tool whose confirmation is
invisible is how a silent failure gets reported as a success**, which is the
class of error this project has spent several sessions correcting.

**It is genuinely unblocked** — no business decision, no PRD question, no
dependency on F-13.

**Why not the alternatives.** **F-14's remaining half** (CI builds no image)
stays capped by F-13. **F-36** needs a decision HR owns. **F-58** (three source
files citing a document that does not exist) is real but cosmetic. **Bounding
the unparameterized list request** changes the response of every existing caller
and is a product decision, not cleanup.

**Caveat, stated rather than buried:** like F-16, this moves **no requirement
verdict**. It ranks first because everything above it is blocked — **F-03's
missing values remain the highest-value item on the board**, and they are still
the only thing that would change a Compliance Review outcome.

---

## Dependencies

None.

---

## Expected Output

- The cause identified in `logger/` — a level set from config, a hook, or a
  formatter that drops the level — **read, not guessed**.
- A decision recorded either way: if the suppression is deliberate, say so
  where a reader will find it and stop treating it as a defect; if not, fix it.
- If fixed: confirmation that Info lines actually appear in the running
  container, not merely that the configuration changed.

---

## Acceptance Criteria

No `RAISE-FR-*` criterion governs logging, and the `RAISE-NFR-*` observability
targets are themselves undefined (**F-17**). The bar is therefore: a deliberate
`log.Info` in application code reaches the container's output, or the reason it
does not is documented where a reader will find it.

---

## Validation

`go build` / `go vet` / `go test -count=1 ./...`; `gofmt` **against index
content**, not the Windows working tree. Rebuild the stack and read the
container's real output — the 2026-09-16 stale-image lesson applies.

---

## Risks / Blockers

- **The logger is shared by every package.** A level change affects all output,
  including `[AUDIT]` volume. Check what gets noisier before changing it.
- **It may be intentional** — config-driven quieting for a demo stack is a
  legitimate choice. If so the outcome is documentation, not a patch.

---

## Files to Update

`go-template-main/logger/` (investigation; a change only if warranted), then
`PROJECT-CHECKPOINTS.md`, `CURRENT-STATUS.md`, and this file.
`DEVELOPMENT-LOG.md` only if a PR results. `CHANGELOG.md` **no** — invisible to
users.

---

## Next Checkpoint

`CHECKPOINT-2026-09-18-003` — "Application Info logging suppressed".

---

## Secondary Tasks

1. **F-58** — three source files cite `SOFTWARE-LICENSE-MIGRATION.md`, which
   does not exist. `TECHNICAL_DEBT`, trivial, unblocked.
2. **F-14's remaining half** — image build/push in CI. Capped by **F-13**.
3. **F-16's remaining parts** — startup auto-run (a decision: racy across
   instances), down/rollback, CI integration.
4. **F-36** — legacy `EMP-…` ids the app's own validator rejects. `BUG`, but
   **do not pick a fix without asking**; HR owns the numbering.
5. **Bound the unparameterized list request** — the residual from
   `CHECKPOINT-2026-09-18-001`. A product decision about default behaviour.

**Not selectable:** **F-03/Gap 21**, **F-55**, **F-57** — all three waiting on a
stakeholder decision. **F-03 remains the only outstanding item that would move a
Compliance Review verdict.**
