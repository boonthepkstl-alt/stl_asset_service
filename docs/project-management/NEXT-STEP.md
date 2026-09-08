# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-08, after `CHECKPOINT-2026-09-08-001`.

**Derived from** a direct read of `main` at `4a442be`: PRD **v0.19**, Design **v0.17**,
Prototype **v0.18**, AC **v0.17**, Test Plan **v0.17**, Test Cases **v0.27**, Traceability
Matrix **v2.7**, Compliance Review **v1.2**, `OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation, run rather than assumed:** frontend `tsc` **0**, ESLint clean, **53 test
  files / 278 tests pass**; backend `go build`/`vet`/`test` clean; CI green.
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

## What changed today, and why it was possible without the five numbers

**The remaining F-03 work splits into two halves that need *different* inputs.** That
observation is what turned "nothing can proceed" into a full day of legitimate work:

| Half | Needs | Status |
|---|---|---|
| **Dashboard tile — specification** | **DoR-3** (the presentation decision) | ✅ **done today** |
| **Settings NBV section — build** | the five useful-life values | 🔴 still blocked |
| **Dashboard tile — build** | the five useful-life values | 🔴 still blocked |

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

**F-03 — obtain the five per-Asset-Category useful-life values.**

**Status: `BLOCKED` — business-input pending, and now the *only* input outstanding.**

### Why This Is Next

It is the only remaining item that would move a Compliance Review verdict, and **every other
input is now in hand.** F-03's Definition of Ready is **one item from complete**:

| # | Criterion | Status |
|---|---|---|
| **DoR-1** | the five values, in years | 🔴 **the only thing missing** |
| **DoR-2** | recorded in PRD §16 with authority | 🟡 RQ50/RQ51 recorded; awaits one more for the values |
| **DoR-3** | tile presentation decision | ✅ **RQ50** |
| **DoR-4** | unconfigured-category behaviour | ✅ **RQ51** |
| **DoR-5** | re-assessment before code | ⚪ when the values arrive |

**Everything buildable is specified — verified in source this run:**

| Piece | State on `4a442be` |
|---|---|
| Formula | ✅ `frontend/src/lib/nbv.ts` implements RQ46 in full (R-36) |
| Tests | ✅ `nbv.test.ts`, 15 tests, three mutations |
| Configuration shape | ✅ `NBVSettings: Record<AssetCategory, usefulLifeYears>` |
| Settings precedent | ✅ `Settings/index.tsx:144-161` (Warranty threshold, per-category) |
| Tile precedent | ✅ `Dashboard/index.tsx:29,66,74` (Utilization ← `computeUtilization`) |
| **Specification, all layers** | ✅ **complete as of today** |
| The five numbers | 🔴 **absent** |

**Verified absent, not assumed.** A repository-wide search — `docs/`, `frontend/src`,
`go-template-main`, English and Thai — returns only statements that the values are undefined.
PRD §16 **Q3a is still open** and the constraint is explicit: *"Do not invent or use an
illustrative number as if confirmed."*

### Dependencies

One, and it is not technical: the values for **IT Hardware, Mobile, Office Equipment,
Infrastructure, Media Equipment**.

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

**Chain — before any code:** `RAISE-PRD.md` §16, to record the five values as a Resolved
Question and **close Q3a**. **After execution:** Test Cases statuses, Matrix (closing Gap 21),
Compliance Review. **No specification pass remains.**

**Tracking:** `OPEN-FINDINGS.md`, `PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`.

### Next Checkpoint

`CHECKPOINT-2026-09-08-002`, on receipt of the five values.

---

## Candidate Evaluation

| Candidate | Class | Basis |
|---|---|---|
| **F-03** (values → Settings + tile + execution) | 🟡 **business input** | Everything else is built or specified |
| **F-52** build/execution half | 🔴 dependency | Same five values; specification half closed today |
| **Gap 21** re-execution | 🔴 dependency | Cannot re-execute a ten-tile grid that does not exist |
| **F-43(a)** decoder text | 🟡 business decision | 21 sites (17 RAISE-domain, 4 in the company template's `sampleController.go`) |
| **PRD Q22a** | 🔴 dependency | No `User`↔`Employee` link exists |
| **F-09 · F-35 · F-36 · F-37 · F-39** | 🟡 business decision | Independent product questions, none gating a P0 verdict |
| **F-04 → F-31**, **F-06 / F-07** | 🔴 dependency | Oracle FA mechanism; no AI engine exists |
| **F-38** backend, **F-13/15/16/17** | ⚪ out of scope | No requirement to trace to |
| **A fresh 🟢 item** | ⚪ none found | Zero TODOs, zero skipped RAISE tests, zero failing gates |

---

## Recommendation

**Supply the five useful-life values.** Nothing else is outstanding: the decisions are
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

**Status:** Live — regenerated 2026-09-08 from `main` `4a442be`.

**Supersedes:** the 2026-09-07 run and its two same-day revisions, which are worth naming
because both were corrections of this file's own account of F-03: the first understated the
remaining work and omitted `TC-WARRANTY-001-07`; the second **overshot**, claiming the chain
was "specified end-to-end" when the Dashboard half specified only the tile's *absence*
(**F-52**). **As of today that claim is finally true** — not by assertion, but because the
specification pass was actually performed.
