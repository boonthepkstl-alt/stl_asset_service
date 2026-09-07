# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-07, after `CHECKPOINT-2026-09-07-008` (PR #119 merged and closed out).
**This run reaches the same conclusion as the last one, and this time the conclusion
survived being checked:** the only work of substance left is **F-03**, and it is blocked
on business input, not on engineering.

**Derived from** a direct read of merged `main` at `456dda2` (PR #119 = `1594fab`): PRD
**v0.18**, Design **v0.16**, Prototype **v0.17**, AC **v0.16**, Test Plan **v0.16**, Test
Cases **v0.26**, Traceability Matrix **v2.6**, Compliance Review **v1.2**,
`OPEN-FINDINGS.md`, and the source tree. **Every claim below was verified against source,
tests or CI** — no scoping note, checkpoint or prior statement was taken on trust, which is
what produced the corrections recorded in the previous two runs.

---

## Current State

- **Validation, run rather than assumed on `456dda2`:** frontend `tsc` 0, ESLint clean
  (`--max-warnings 0`), **53 test files / 278 tests pass**, `vite build` clean; backend
  `go build`/`vet`/`test` clean. **`gofmt` checked the R-34 way** — over all **64** Go
  files converted to LF content, the form a CI runner checks out, rather than the CRLF
  working tree — **flags nothing**. CI green on the merge commit, with the Backend job's
  per-step conclusions read individually: Build, Vet, Test and **Format check** all
  `success`.
- **Traceability Matrix v2.6 carries zero open gaps** (Gaps 1–20 all resolved).
- **Compliance Review v1.2 verdicts, read from the file:** 8 requirements at full `PASS`
  (`ASSET-001/-002/-003`, `OPS-001/-002`, `MAINT-001`, `WARRANTY-001`, `ALERT-001`), one at
  **`PASS (partial)`** (`EXEC-001`), two `FAIL` (`AI-SEARCH-001`, `ORACLE-001`), five
  `BLOCKED` (`LIFE-001`, `AI-DOC-001..004`).
- **No latent engineering work exists in the source.** **Zero** `TODO`/`FIXME`/`HACK`/`XXX`
  across `frontend/src` and `go-template-main`. The only skipped tests are the company
  template's eight DB-conditional `t.Skip`s in `sampleController_test.go` — no RAISE test is
  skipped, and nothing is failing.
- **Every non-passing requirement carries its own recorded "no further engineering action"
  finding**, quoted from Compliance Review v1.2 rather than inferred: `AI-SEARCH-001` — *"No
  further engineering action is expected until that decision lands"* (F-33);
  `ORACLE-001` — the same sentence (F-31, gated on F-04); `AI-DOC-001..004` — *"Awaits a
  business answer on the confidence-threshold value"* (F-07); `LIFE-001` — *"the partial
  sub-items require PRD-level lifecycle-stage detail not yet defined"*, with Disposal
  correctly excluded as Roadmap (RQ26), *"not a defect"*.

---

## Primary Next Step

**F-03 — the five per-Asset-Category useful-life defaults, then the Settings field, the
NBV tile, and the execution of three test cases that are already written.**

**Status: `BLOCKED` — business-input pending.** Not `IMPLEMENTED`, not `VALIDATING`. No
engineering step can begin, and **no default may be invented to unblock it** — PRD §16 Open
Question 3a states the constraint explicitly: *"Do not invent or use an illustrative number
as if confirmed."*

### Why This Is Next

It is the **only** remaining item that would move a Compliance Review verdict.
`RAISE-FR-EXEC-001` is the single requirement sitting at `PASS (partial)` while otherwise
complete, and `TC-EXEC-001-03b` / `TC-DASH-03b` are the cases holding it there.

**The chain specifies one half of this work and only documents the absence of the other —
and this file has now been wrong about it in both directions, so the evidence is set out in
full rather than summarised.**

*First error (the run after `CHECKPOINT-2026-09-07-007`):* "the chain sync" was listed among
F-03's remaining work and only two test cases were named, missing `TC-WARRANTY-001-07`
entirely. *Second error (the revision of `a92aeb5`, correcting the first):* it swung to
"specified end-to-end … no specification work remains", **which is false for the Dashboard
half.** Checked line by line against the chain documents on `a92aeb5`:

| Half | Specified as | Evidence |
|---|---|---|
| **Settings NBV section** | ✅ **presence — buildable against a spec** | Prototype v0.17 **§23A**; `AC-WARRANTY-001-07`; `TC-WARRANTY-001-07` — *"P-018 Settings NBV section shows all 5 categories with editable useful-life inputs"*, whose expected result already names `NBVSettings: Record<AssetCategory, usefulLifeYears>` |
| **Dashboard / Executive NBV tile** | 🔴 **absence only — no forward spec exists** | `AC-DASH-03b`: *"when a user inspects it for an NBV tile, **then no such tile is present**"* · `AC-EXEC-001-03b`: *"**then no such tile is present**"* · `TC-DASH-03b` expected result: *"No NBV tile is present in the shipped grid — **this documents today's accurate absence, not a target for NBV to be displayed**"* · Prototype:783: *"**No NBV tile exists on this dashboard today, and none can be built**"* |

**The consequence is concrete, not stylistic.** `TC-DASH-03b` and `TC-EXEC-001-03b` are
**not** cases that a built NBV tile would pass — **they assert its absence, so building the
tile makes them fail.** And `TC-DASH-01` / `TC-EXEC-001-01` assert a **nine-tile** grid in a
fixed order and are already recorded **PASS**; a tenth tile invalidates those records too.

**What this changes about the plan.** F-03 is *not* "five numbers, two UI pieces and three
executions". It is:

1. the five values, recorded in PRD §16 with authority;
2. **a specification pass for the Dashboard tile** — AC → Test Plan → Test Cases, through
   the `.claude/skills` subagents — turning the absence criteria into presence criteria and
   settling the nine-vs-ten tile count. **This cannot be written until DoR-3 is answered**,
   because the answer determines what the criteria say;
3. the two UI pieces;
4. execution: `TC-WARRANTY-001-07` (already a presence case), plus the rewritten Dashboard
   cases and a re-execution of `TC-DASH-01` / `TC-EXEC-001-01` against the new tile count.

**Same class of defect as F-50**, which this session fixed in the findings register: a
tracking document misdescribing state. The lesson it repeats is the session's own — *a claim
in a document deserves the same verification as a test result* — and here the claim needing
it was this file's correction of itself.

**Everything else about it is already built or specified — verified in source this run:**

| Piece | State on `456dda2` |
|---|---|
| Formula | ✅ `frontend/src/lib/nbv.ts` implements RQ46 in full — straight-line, zero salvage, clamped at 0 (R-36) |
| Tests | ✅ `nbv.test.ts`, 15 tests, three mutations against RQ46's own clauses |
| Configuration shape | ✅ Design v0.16 already specifies it: `NBVSettings: Record<AssetCategory, usefulLifeYears>` |
| Settings-page precedent | ✅ the existing "Warranty Expiring Threshold" section — the same one-value-per-category shape, ~13 lines |
| The five numbers | 🔴 **absent** |

**The absence was verified, not assumed.** A repository-wide search for a per-category
useful-life value — across `docs/`, `frontend/src` and `go-template-main`, in English and
Thai — returns **only statements that it is undefined**: PRD §16 Q3a, PRD §5/§13/§17, and
Design v0.16 §-NBV (*"no computable useful-life input, so no NBV tile can be built"*).
`grep usefulLife` outside `nbv.ts`/`nbv.test.ts` returns **nothing**. `PlatformSettings`
carries no depreciation key. `lib/nbv.ts` has **zero consumers**. **No number with any
claim to authority exists anywhere in the repository**, so there is nothing to check the
authority *of*.

### Dependencies

**One, and it is not technical:** the five values for IT Hardware, Mobile, Office
Equipment, Infrastructure and Media Equipment. Business was asked directly and answered
**"I will specify these myself"** (PRD §16 Q3a, 2026-09-05); the values have not arrived.

### Expected Output

`NBVSettings` on `PlatformSettings`, a Settings section modelled on the Warranty
Threshold precedent (`Settings/index.tsx:144-161`, which loops `Object.keys` over
`expiringThresholdDaysByCategory`), and a Dashboard NBV tile fed by `computePortfolioNbv`
the way the Utilization tile is fed by `computeUtilization` (`Dashboard/index.tsx:29,66,74`).

**Specification first for the Dashboard half, then execution — not execution alone.**
`TC-WARRANTY-001-07` is already a presence case and needs only executing. The Dashboard
cases do not: `AC-DASH-03b` / `AC-EXEC-001-03b` and their test cases must be **rewritten
from absence criteria to presence criteria** through the `.claude/skills` subagents, and the
nine-tile count in `AC-DASH-01` / `AC-EXEC-001-01` settled, before anything there can be
executed. Only then are statuses, the matrix row and the Compliance Review verdict updated.

### Acceptance Criteria

- `AC-WARRANTY-001-07` (Settings NBV section) — **already a presence criterion**, NOT
  TESTABLE YET on Q3a alone.
- `AC-DASH-03b` / `AC-EXEC-001-03b` — **currently absence criteria** (*"then no such tile is
  present"*). A built tile does not satisfy them; it contradicts them. They must be rewritten
  before they can serve as this work's acceptance criteria.
- `AC-DASH-01` / `AC-EXEC-001-01` — assert **nine tiles** and are recorded PASS; a tenth tile
  requires them to be re-specified and re-executed.

`RAISE-FR-EXEC-001` moves `PASS (partial)` → full `PASS` **only after execution**, never on
implementation alone (Completion Rule, and `SESSION-CLOSEOUT-PROTOCOL.md` Rule 14).

### Validation

`tsc`, ESLint, Vitest, `vite build`; `go build`/`vet`/`test`; `gofmt` over LF content; CI
green on the PR head **before** merge — the one process slip of 2026-09-07 was merging
PR #117 while its Frontend check still read `pending`, and it is not to be repeated.

### Risks / Blockers

**Blocked outright.** The only risk of proceeding is the one the PRD names: inventing a
number, which would produce a tile that looks authoritative and is fabricated. **A second,
narrower risk worth recording now** so it is not discovered mid-task: the Dashboard already
renders a **"Monthly Depreciation"** tile (`pages/Dashboard/index.tsx:78`) fed by a static
ESAPS-inherited fixture (`mockData.ts:755`, `monthlyDepreciation: 42800`) and labelled
*illustrative*. A real NBV tile would sit beside a fake depreciation figure. That is a
presentation decision for whoever specifies the numbers, **not** licence to change or remove
the existing tile.

### Files to Update

**Code:** `frontend/src/types/settings.ts`, `frontend/src/pages/Settings/`,
`frontend/src/pages/Dashboard/`, `frontend/src/services/dashboard-service.ts`.

**Chain** — via the `.claude/skills` subagents, never edited directly in the main thread —
in two distinct passes that must not be conflated:

1. **Before any code:** `RAISE-PRD.md` §16, to record the five values as a Resolved Question
   and close Q3a.
2. **Specification, also before the Dashboard code:** `RAISE-ACCEPTANCE-CRITERIA.md`,
   `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md` — rewriting the NBV absence criteria as
   presence criteria and settling the tile count. **Gated on DoR-3**, which determines what
   they say.
3. **Execution recording, after:** `RAISE-TEST-CASES.md` statuses,
   `RAISE-TRACEABILITY-MATRIX.md`, `RAISE-COMPLIANCE-REVIEW.md`.

**Tracking:** `OPEN-FINDINGS.md`, `PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`.

### Definition of Ready — all five must hold before any code is written

| # | Criterion |
|---|---|
| **DoR-1** | The **five values** supplied in full, in years, with no gaps and no "approximately". |
| **DoR-2** | Recorded as a **new Resolved Question in PRD §16**, closing Q3a, through the `update-prd` subagent — a number that exists only in a chat message has no authority the chain can cite. |
| **DoR-3** | A decision on presentation beside the **existing static "Monthly Depreciation" tile** (`Dashboard/index.tsx:78`, fed by `mockData.ts:755` `monthlyDepreciation: 42800`, labelled *illustrative*). A real NBV figure would sit next to a fabricated depreciation figure. **That tile must not be changed or removed without a requirement or business decision behind it.** **This is the gate on the specification pass, not merely a presentation preference:** the chain asserts a **nine-tile** grid in a fixed order, `TC-DASH-01` / `TC-EXEC-001-01` are recorded **PASS** against it, and the NBV criteria currently assert the tile's **absence**. Until the answer is known, the rewritten acceptance criteria cannot be written, so **no Dashboard code can begin** even if the five values arrive first. |
| **DoR-4** | Confirmation that an Asset whose `category` falls outside the five keeps its current behaviour — `computeAssetNbv` returns `purchaseCost` unchanged. `AssetCategory` is `string` (`types/asset.ts:17`), an open type, not an enum of five, so this case is reachable by data alone. The behaviour is deliberate and test-pinned (R-36); what is needed is business acceptance of it, not a code change. |
| **DoR-5** | A short re-assessment **after** the numbers arrive and **before** any code, per the vertical-slice sequence. |

### Next Checkpoint

`CHECKPOINT-2026-09-07-009` (or the next date's `-001`), on receipt of the five values.

---

## Candidate Evaluation

| Candidate | Class | Verified basis for the classification |
|---|---|---|
| **F-03** (NBV defaults → tile) | 🟡 **business input** | The five values exist nowhere in the repository; formula, tests, config shape and UI precedent all exist |
| **F-43(a)** decoder text | 🟡 business decision | **21 sites reproduced exactly** by re-running the classifier this run (18 `BadRequest`, 2 `Conflict`, 1 `Unauthorized`). **New precision:** 4 of the 21 are in `sampleController.go`, company-template code, so **17 are RAISE-domain**. Whether to strip Go's decoder text is a product decision |
| **PRD Q22a** "relevant to me" | 🔴 technical dependency | `User` is `{id, username, fullName, role}`; `grep employeeId` across auth types, `AuthContext` and `authModel.go` returns **nothing**. Unspecifiable until a `User`↔`Employee` link exists |
| **F-09 · F-35 · F-36 · F-37 · F-39** | 🟡 business decision | `F-35`: codes are `AST-<uuid[:8]>` (`assetService.go:86`), no type/dept tables. `F-37`: `grep password\|provision` in `employeeService.go` returns **nothing**. `F-39`: "Modify Specs" (`EmployeeDetail:310`) targets `/employees/:id/edit`, whose fields are department, deskLocation, jobTitle, location, **manager**, phone, status — **no spec field among them** |
| **F-04 → F-31** Oracle FA | 🔴 technical dependency | `ReconciliationPage` is a `ModulePage` placeholder; the Oracle references in `main.go:45–72` are the company template's generic DB pool, not an FA integration |
| **F-06 / F-07** AI | 🔴 technical dependency | **No AI engine exists.** Every `Gemini`/`LLM` hit in `frontend/src` is a comment explaining its absence, plus one fixture string; `ai-decision-service.ts:117` states it directly |
| **F-38** backend half | ⚪ out of scope | **No `RAISE-FR-EMP-*` requirement exists** to trace an Employee audit source to |
| **F-13 / F-15 / F-16 / F-17** | ⚪ out of scope | Infrastructure the PRD does not cover; `F-17` is why no performance target is testable |
| **A fresh 🟢 item** | ⚪ **none found** | Zero TODOs, zero skipped RAISE tests, zero failing gates, zero open matrix gaps, and every non-passing requirement carries its own "no further engineering action" finding |

**Two corrections this run makes to earlier statements of its own, recorded rather than
quietly fixed:**

1. **`Employee.manager` and `Employee.managerId` exist end-to-end** — `types/employee.ts:23-24`,
   `employeeModel.go:19-20`, and the SQL — and `manager` is an editable field on the Edit
   Employee form. A previous run listed that form's fields **without** `manager`. It changes
   no verdict, but it matters to anyone reasoning about the RQ43 handover workflow, whose
   scope note says no *new* manager relationship field was being introduced — because one
   already existed.
2. **F-43(a)'s 21 sites are not all RAISE code.** Four are in the company template's
   `sampleController.go`. The finding's count was right; its implied scope was wider than the
   product.

---

## Recommendation

**Do not start engineering work. `F-03 = business-input pending.**

There is no second-best task to fall back on. The previous run's fallback — the two stale
statements — was taken and closed by PR #119, and this run found no replacement for it:
**every remaining finding is gated on a business answer or a technical dependency, and each
gate was verified in source this run rather than read off a prior note.**

The one thing that unblocks the highest-value work is **five numbers**: the useful life in
years for **IT Hardware, Mobile, Office Equipment, Infrastructure, Media Equipment**. On
receipt, `RAISE-FR-EXEC-001` can reach a full `PASS` — the last P0 verdict still short of
one.

---

## Document Status

**Status:** Live — regenerated 2026-09-07 from merged `main` `456dda2`, then revised twice
the same day, both times to correct this file's own account of F-03's remaining work:

1. against `c4d2e24` — the chain sync was overstated as outstanding and
   `TC-WARRANTY-001-07` had been omitted; the Definition of Ready was added.
2. against `a92aeb5` — **that first correction overshot.** It claimed the chain was
   "specified end-to-end", which holds for the Settings half and is **false for the
   Dashboard half**, where every criterion and test case specifies the NBV tile's
   **absence**. Recorded with the verbatim evidence in "Why This Is Next".

Neither revision changed a verdict or the recommendation. The second added a dependency:
a specification pass, itself gated on DoR-3.
**Supersedes:** the run of 2026-09-07 recorded after `CHECKPOINT-2026-09-07-007`.
