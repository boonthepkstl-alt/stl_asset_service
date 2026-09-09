# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-08, after `CHECKPOINT-2026-09-08-003`.

**Derived from** a direct read of `main` at `39bb2b0`: PRD **v0.20**, Design **v0.18**,
Prototype **v0.18**, AC **v0.17**, Test Plan **v0.17**, Test Cases **v0.27**, Traceability
Matrix **v2.7**, Compliance Review **v1.2**, `OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation, run rather than assumed:** frontend `tsc` **0**, ESLint clean, **54 test
  files / 286 tests pass**; backend `go build`/`vet`/`test` clean; CI green.
- **Three PRs merged after this run**, all product work on the requisition form and the
  create/edit layout — **PR #120** (`24bbd31`), **PR #121** (`79f71eb`) and **PR #122**
  (`71ba972`). Between them they account for the **+1 file / +8 tests** against this run's
  figures. **None needed a chain change** (`AC-MAINT-001-03` constrains state, not
  presentation) and **none moved a verdict**, so they change nothing in this run's
  recommendation — noted here only so the figures above reconcile with `main`.
- **The chain moved a full step today.** PRD §16 **Resolved Questions 50 and 51** were
  recorded and propagated through all six downstream layers, sequentially, through the
  `.claude/skills` subagents.
- **Matrix v2.7 carries one open gap — Gap 21 — and that is correct**, not a regression. It
  tracks the re-execution of `TC-DASH-01` / `TC-EXEC-001-01` against a real ten-tile grid.
  **A complete specification is not coverage.**
- **`RAISE-FR-EXEC-001` stays `PASS (partial)`.** It was not upgraded; its component
  breakdown was corrected *downward* in detail (`-01` PASS → BLOCKED), because those cases
  passed against an assertion that no longer stands.

---

## What changed today — in both directions

**The remaining F-03 work splits into two halves that need *different* inputs.** That
observation is what turned "nothing can proceed" into a full day of legitimate work:

| Half | Needs | Status |
|---|---|---|
| **Dashboard tile — specification** | **DoR-3** (the presentation decision) | ✅ **done today** |
| **Settings NBV section — build** | the useful-life values | 🔴 still blocked |
| **Dashboard tile — build** | the useful-life values | 🔴 still blocked |
| **Second chain sync — re-key to Type** | nothing | ✅ **done** (F-53 → R-39) |

The proof that a presence criterion can be written **without any default value** was already
in the repository: `TC-WARRANTY-001-07` states in its own test-data column *"no
illustrative/placeholder default value is asserted"*. **An earlier run of this protocol
concluded no engineering work was available at all. That was wrong**, and this run is the
correction — the claim had bundled two halves with different blockers into one blocked unit.

**RQ50 — the KPI grid becomes ten tiles.** NBV is specified as a **tenth tile** on **P-002**
and **P-014**. The existing static illustrative **"Monthly Depreciation"** tile is **kept
unchanged**; business explicitly accepted that a real computed figure will sit beside a
fabricated one. `AC-DASH-03b` / `AC-EXEC-001-03b` and their test cases flipped from
**absence** to **presence** — the substance of **F-52**.

**RQ51 — unconfigured Asset Category.** An Asset whose `category` has no configured useful
life contributes **`purchaseCost` unchanged** and stays **included** in the portfolio total.
New `AC-DASH-04`, `AC-EXEC-001-04`, `TC-DASH-04`, `TC-EXEC-001-04`. It **confirms
already-shipped, test-pinned behaviour (R-36)** rather than requesting a change, so **no code
follows from it**.

**Handled rather than hidden.** `TC-DASH-01` / `TC-EXEC-001-01` were **PASS** against the
superseded nine-tile assertion. Their PASS text is preserved **verbatim as history**,
labelled superseded, and both are reclassified **BLOCKED (partial)** pending re-execution.
Neither is carried into a verdict; neither is deleted.

**F-52 was judged in two halves, not closed wholesale** — forward-specification **CLOSED**,
build/execution **still OPEN**. The day's plan had said this sync would "close F-52"; **it
closed half**, and the record says so.

---

## Primary Next Step

**F-03 — obtain one useful-life value per Asset Type.**

**The ask changed today, and the change is the more important news.** Asked for the five
per-Category values, business answered that **IT Hardware has no fixed value** —
*"it depends on the equipment purchased"* — while confirming the other four
categories can each carry one. **That is not a missing number; it is a statement that
RQ46's per-Category model does not fit.** PRD §16 **Resolved Question 52** now keys the
useful life **per Asset Type**, amending RQ46 without deleting it, and `Asset.type`
already exists end to end so **no new field is needed**.

**What is needed, as seeded** — one value each for Laptop, Monitor, Headphones,
Smartphone, Tablet, Printer, Projector, Router, Server, Camera. **Not a fixed list of ten:**
`type` is a free-text `varchar(100)` that grows exactly as `category` does, so the rule is
one value per type present in the data. For the four categories with a fixed value, the
same number may simply repeat across that category's types.

**Status: `BLOCKED` — business-input pending, and now the *only* input outstanding.**

### Why This Is Next

It is the only remaining item that would move a Compliance Review verdict, and **every other
input is now in hand.** F-03's Definition of Ready is **one item from complete**:

| # | Criterion | Status |
|---|---|---|
| **DoR-1** | one value per Asset Type, in years | 🔴 **FAIL** — none supplied |
| **DoR-2** | recorded in PRD §16 with authority | 🟡 RQ50/RQ51 recorded; awaits one more for the values |
| **DoR-3** | tile presentation decision | ✅ **RQ50** |
| **DoR-4** | unconfigured-category behaviour | ✅ **RQ51** |
| **DoR-5** | chain consistent with the confirmed model | ✅ **PASS again** — re-keyed to Type across all six documents (**F-53** → **R-39**) |

**Everything buildable is specified — verified in source this run:**

| Piece | State on `23b9c72` |
|---|---|
| Formula | ✅ `frontend/src/lib/nbv.ts` implements RQ46 in full (R-36) |
| Tests | ✅ `nbv.test.ts`, 15 tests, three mutations |
| Configuration shape | ✅ `NBVSettings: Record<AssetType, usefulLifeYears>` — re-keyed from `Record<AssetCategory, …>` by **RQ52** (F-53 → R-39) |
| Settings precedent | ✅ `Settings/index.tsx:144-161` (Warranty threshold, per-category) |
| Tile precedent | ✅ `Dashboard/index.tsx:29,66,74` (Utilization ← `computeUtilization`) |
| **Specification, all layers** | ✅ **complete as of today** |
| The per-Type values | 🔴 **absent** |
| Chain keyed to Type | ✅ **done** — Design v0.18 through Matrix v2.8 |

**Verified absent, not assumed.** A repository-wide search — `docs/`, `frontend/src`,
`go-template-main`, English and Thai — returns only statements that the values are undefined.
PRD §16 **Q3a is still open** and the constraint is explicit: *"Do not invent or use an
illustrative number as if confirmed."*

### Dependencies

One for this task, and it is not technical: **one useful-life value per Asset Type** — as seeded,
**Laptop, Monitor, Headphones, Smartphone, Tablet, Printer, Projector, Router, Server,
Camera**. **Not** the five per-Category values this section asked for before **RQ52**
re-keyed the configuration (see Primary Next Step above); and **not a fixed list of ten**,
since `type` is a free-text `varchar(100)` that grows exactly as `category` does.

### Expected Output

`NBVSettings` on `PlatformSettings`; a Settings NBV section modelled on the Warranty
Threshold precedent; the NBV tile as the tenth tile on both dashboards, fed by
`computePortfolioNbv`.

**Then execution against specifications that already exist** — no further spec work:
`TC-WARRANTY-001-07`, `TC-DASH-03b`, `TC-EXEC-001-03b`, `TC-DASH-04`, `TC-EXEC-001-04`, plus
**re-execution** of `TC-DASH-01` / `TC-EXEC-001-01` against the real ten-tile grid, which
closes **Gap 21**.

### Acceptance Criteria

`AC-WARRANTY-001-07`, `AC-DASH-01`, `AC-DASH-03b`, `AC-DASH-04`, `AC-EXEC-001-01`,
`AC-EXEC-001-03b`, `AC-EXEC-001-04` — **all written, all currently NOT TESTABLE YET on Q3a
alone.** `RAISE-FR-EXEC-001` moves `PASS (partial)` → full `PASS` **only after execution**,
never on implementation alone.

### Validation

`tsc`, ESLint, Vitest, `vite build`; `go build`/`vet`/`test`; `gofmt` over LF content; **CI
green on the PR head before merge.**

### Risks / Blockers

**Blocked outright on DoR-1.** The only risk of proceeding is the one the PRD names:
inventing a number, producing a tile that looks authoritative and is fabricated.

**Do not touch the Monthly Depreciation tile.** RQ50 keeps it unchanged — not removed, not
relabelled, not re-pointed at real data.

### Files to Update

**Code:** `frontend/src/types/settings.ts`, `frontend/src/pages/Settings/`,
`frontend/src/pages/Dashboard/`, `frontend/src/services/dashboard-service.ts`.

**Chain — before any code:** `RAISE-PRD.md` §16, to record the per-Type values as a Resolved
Question and **close Q3a**. **After execution:** Test Cases statuses, Matrix (closing Gap 21),
Compliance Review.

**No specification pass remains.** The second one — re-keying the configuration from
Category to Type across Design, Prototype, AC, Test Plan, Test Cases and Matrix — was
performed on 2026-09-08 (**F-53** → **R-39**), including its sharpest instance:
`TC-WARRANTY-001-07` no longer reads *"all 5 categories with editable useful-life inputs"*.
It had been deferred to bundle with the values; **that deferral was reversed on evidence**,
since the values had been requested three times across two days and the last answer changed
the model instead of supplying numbers.

**Tracking:** `OPEN-FINDINGS.md`, `PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`.

### Next Checkpoint

`CHECKPOINT-2026-09-08-003`, on receipt of the per-Type values.

---

## Candidate Evaluation

| Candidate | Class | Basis |
|---|---|---|
| **F-03** (values → Settings + tile + execution) | 🟡 **business input** | Everything else is built or specified |
| **F-52** build/execution half | 🔴 dependency | Same values; specification half closed today |
| **F-53** chain re-key to Type | ✅ **RESOLVED** (R-39) | Closed the same day it was created, after the deferral was reversed on evidence |
| **Gap 21** re-execution | 🔴 dependency | Cannot re-execute a ten-tile grid that does not exist |
| **F-54** SLA values | ✅ **RESOLVED** (R-40) | Raised 2026-09-08. `ticket-service.ts:14` and `ticketService.go:19-26` ship `{2, 8, 24, 48}` and the UI labels them as SLA, while PRD/Prototype/AC all say SLA is **TBD** and no test asserts a value. Moves no verdict; three exits, all business decisions |
| **F-43(a)** decoder text | 🟡 business decision | 21 sites (17 RAISE-domain, 4 in the company template's `sampleController.go`) |
| **PRD Q22a** | 🔴 dependency | No `User`↔`Employee` link exists |
| **F-09 · F-35 · F-36 · F-37 · F-39** | 🟡 business decision | Independent product questions, none gating a P0 verdict |
| **F-04 → F-31**, **F-06 / F-07** | 🔴 dependency | Oracle FA mechanism; no AI engine exists |
| **F-38** backend, **F-13/15/16/17** | ⚪ out of scope | No requirement to trace to |
| **A fresh 🟢 item** | ⚪ none found | Zero TODOs, zero skipped RAISE tests, zero failing gates |

---

## Recommendation

**One item still needs no business input at all — but it is no longer Gap 23.**
**Gap 23 is closed:** `TC-MAINT-001-10` was executed 2026-09-09 and **passed**, with the four
priorities stamping 2 / 8 / 24 / 48 hours in the running app.

**What the execution exposed is now Gap 25.** `TICKET_API_ENABLED` is off by default, so the
run exercised the **frontend tier only**; `go-template-main/service/ticketService.go:19-26`'s
identical map was **not exercised**, and **no backend test covers `slaHours`** **[CORRECTED 2026-09-09]** The claim quoted just above was wrong, and so was the grep that "confirmed" it. The search used `SlaTargetHours`; the Go field is **`SLATargetHours`** (capital `SLA`), so the case-sensitive pattern missed the one place it appears. `ticketService_test.go:99` already asserted `SLATargetHours` **= 8** for High, incidentally, inside a broader snapshot test. The true position was **one of four priorities covered**, not none. Same failure mode as **F-49** — a real measurement whose conclusion outran what it showed. **All four priorities plus the unknown-priority case are now covered** by `TestCreateTicket_StampsSLATargetHoursForEveryPriority` and `TestCreateTicket_UnknownPriorityGetsZeroSLATarget`. What is still uncovered: **no test compares the two maps against each other**, and **no run has exercised the Go tier through the HTTP path**.. Closing Gap 25
needs a backend test, or a run with the ticket API flag on — **no decision, no feature build.**

**One business input remains outstanding: F-03.** It is the only item that would move a
Compliance Review verdict.

**F-54 was the other one, and it is closed (R-40)** — business confirmed the four shipped SLA
values as they stand, so the numbers users were already reading now have authority behind
them. It took one sentence from business and no code change. **Its execution followed on
2026-09-09 and passed** (Gap 23 closed). **What remains from it is not a decision either:**
the run exercised the frontend tier only, so `slaHours` on the Go side is still unexercised
and untested — **Gap 25**.

**Supply one useful-life value per Asset Type.** The model question is now settled and the
decisions are
recorded with authority, the specification is complete end to end, and the code precedents
exist. On receipt, `RAISE-FR-EXEC-001` can reach a full `PASS` — the last P0 verdict short of
one — and **Gap 21** closes with it.

---

## Known Issue carried forward

**A dating slip in today's sync.** Five of the six chain documents date this sync
**2026-09-07** (the date of the *decisions*) though it was performed **2026-09-08**; only the
Matrix used the correct date. **Not blanket-corrected**, because that date string appears
roughly **80 times** across those files and most instances legitimately refer to when the
decisions were confirmed — a mechanical replace would corrupt the correct ones. Worth a
deliberate pass, not an automated one.

---

## Document Status

**Status:** Live — regenerated 2026-09-08 from `main` `39bb2b0` (the commit named at the top of this file), then revised twice the same day; figures in "Current State" and the
"Everything buildable is specified" table were re-verified against `23b9c72`. **The `4a442be` this line used to cite was the *first* regeneration's commit and was never updated through
the later revisions — a third instance of the same sweep failure, found in the same pass.**

**Correction, 2026-09-08 (third revision):** two places in this file were left stale by
the previous revision, which updated the DoR table and the candidate list but did not sweep
the whole document. The **Configuration shape** row still read `Record<AssetCategory, …>`
while the row directly beneath it said "Chain keyed to Type — done", and **Dependencies**
still asked for the five per-Category values that **RQ52** had replaced. Both contradicted
this file's own Primary Next Step. **Same failure mode as F-53** — fixing one statement and
leaving its siblings — caught by re-reading rather than by anything downstream.

**Supersedes:** the 2026-09-07 run and its two same-day revisions, which are worth naming
because both were corrections of this file's own account of F-03: the first understated the
remaining work and omitted `TC-WARRANTY-001-07`; the second **overshot**, claiming the chain
was "specified end-to-end" when the Dashboard half specified only the tile's *absence*
(**F-52**). **As of today that claim is finally true** — not by assertion, but because the
specification pass was actually performed.
