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

**The deliverable chain is already specified end-to-end for this work — a correction to
this file's own earlier claim, recorded rather than quietly fixed.** The run of
2026-09-07 after `CHECKPOINT-2026-09-07-008` listed "the chain sync" among F-03's remaining
work and named only two test cases. **Both were checked against the chain documents on
`c4d2e24` and both were incomplete:**

| Layer | Already written |
|---|---|
| Prototype v0.17 | **§23A P-018 Settings** — the NBV section, with a Status Banner |
| AC v0.16 | `AC-WARRANTY-001-07` (Settings NBV section), `AC-DASH-03b`, `AC-EXEC-001-03b` |
| Test Cases v0.26 | **`TC-WARRANTY-001-07`** — *"P-018 Settings NBV section shows all 5 categories with editable useful-life inputs"*, whose expected result already names `NBVSettings: Record<AssetCategory, usefulLifeYears>` — plus `TC-DASH-03b` and `TC-EXEC-001-03b` |
| Matrix v2.6 | Q3a recorded as the blocker of all three ACs |

All three cases read **BLOCKED (partial)** for two precisely stated reasons: the section is
not built, and no default value can be asserted. Neither reason is "unspecified".

**What this changes about the plan:** no specification work remains. F-03 is **five
numbers, two UI pieces, and the execution of three existing test cases** — the chain edits
afterwards are *execution recording* (statuses and verdicts), not a spec sync. The earlier
framing made the task sound larger than it is, and it omitted `TC-WARRANTY-001-07`
entirely.

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

**Then execution, not specification:** `TC-WARRANTY-001-07`, `TC-DASH-03b` and
`TC-EXEC-001-03b` are formally executed — all three exist today and are BLOCKED — and their
recorded statuses, the matrix row and the Compliance Review verdict are updated through the
`.claude/skills` subagents to reflect the result.

### Acceptance Criteria

`AC-WARRANTY-001-07` (Settings NBV section), `AC-DASH-03b` and `AC-EXEC-001-03b` — all three
already written, all three currently NOT TESTABLE YET on Q3a alone.
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

**Chain, for execution recording only** (via the `.claude/skills` subagents, never edited
directly in the main thread): `RAISE-TEST-CASES.md`, `RAISE-TRACEABILITY-MATRIX.md`,
`RAISE-COMPLIANCE-REVIEW.md` — plus `RAISE-PRD.md` §16 **before** any code, to record the
five values as a Resolved Question and close Q3a.

**Tracking:** `OPEN-FINDINGS.md`, `PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`.

### Definition of Ready — all five must hold before any code is written

| # | Criterion |
|---|---|
| **DoR-1** | The **five values** supplied in full, in years, with no gaps and no "approximately". |
| **DoR-2** | Recorded as a **new Resolved Question in PRD §16**, closing Q3a, through the `update-prd` subagent — a number that exists only in a chat message has no authority the chain can cite. |
| **DoR-3** | A decision on presentation beside the **existing static "Monthly Depreciation" tile** (`Dashboard/index.tsx:78`, fed by `mockData.ts:755` `monthlyDepreciation: 42800`, labelled *illustrative*). A real NBV figure would sit next to a fabricated depreciation figure. **That tile must not be changed or removed without a requirement or business decision behind it.** |
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

**Status:** Live — regenerated 2026-09-07 from merged `main` `456dda2`, then **revised the
same day against `c4d2e24`** to correct this file's own account of F-03's remaining work
(the chain was already specified; `TC-WARRANTY-001-07` had been omitted) and to add the
Definition of Ready. The revision changed no verdict and no recommendation.
**Supersedes:** the run of 2026-09-07 recorded after `CHECKPOINT-2026-09-07-007`.
