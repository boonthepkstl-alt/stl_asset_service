# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run the recalculation first.

**Run date:** 2026-09-04, first written after `CHECKPOINT-2026-09-04-002`
(PR #89 — the first CI pipeline), then **updated after
`CHECKPOINT-2026-09-04-003`** (PR #91 — route-level code splitting, merge
commit `02ae966`) and again after **`CHECKPOINT-2026-09-04-004`** (PR #93
— 5xx error hygiene, merge commit `449a751`). Each update shipped this
file's own previous recommendation: F-18 → **R-21**, F-19 → **R-22**.
**There is now no 🟢 candidate left at all**, which sharpens rather than
changes the conclusion below. The
previous copy of this file dated 2026-09-03 and pre-dated PRs #78–#89
(12 merged PRs), so it was stale in both its state summary and its
recommendation.

**Derived from:** `RAISE-PRD.md` v0.14, `RAISE-DESIGN.md` v0.12,
`RAISE-PROTOTYPE.md` v0.13, `RAISE-ACCEPTANCE-CRITERIA.md` v0.11,
`RAISE-TEST-PLAN.md` v0.11, `RAISE-TEST-CASES.md` v0.16,
`RAISE-TRACEABILITY-MATRIX.md` v1.8, `RAISE-COMPLIANCE-REVIEW.md` v1.0,
`OPEN-FINDINGS.md`, `PROJECT-TIMELINE.md`, `CURRENT-STATUS.md`, and a
direct read of the source tree on `main` at `103e069` — not from a prior
session's conclusions.

---

## Current State

- **Current phase:** Phase 3 — Asset Management (product work). Phase 1 —
  Foundation remains open by design and absorbed PR #89's CI work.
- **Validation on merged `main` (`103e069`), run for real this pass:**
  frontend `tsc`/lint/build clean, **48 test files / 235 tests passing**;
  backend `go build`/`go vet`/`go test` clean. **Now also automated** —
  CI run `33843149477` (event `push`, `head_branch=main`) green on both
  jobs with zero annotations.
- **Traceability:** matrix at **v1.8, all 15 gaps closed**. No open gap.
- **Compliance:** 8 `PASS`, 1 `PASS (partial)`, 2 `FAIL`, 6 `BLOCKED`.
  **Every non-`PASS` row is blocked on a business decision or an explicit
  business deferral — none is blocked on missing engineering effort.**

## The central fact this run establishes

**The project is no longer engineering-limited. It is decision-limited.**

Two things are true at once and must not be conflated:

1. There *are* 🟢 buildable tasks (below). Reporting "nothing is
   buildable" would be false.
2. **None of them advances a requirement, a test case, compliance, or
   traceability coverage** — because the matrix is fully closed and every
   remaining requirement is gated on an unanswered question.

So the honest recommendation is a 🟢 task *and* an explicit statement
that the highest-leverage action is obtaining decisions. Picking up more
engineering debt will keep the repo tidy; it will not move the product.

---

## Candidate Evaluation

### 🟢 Buildable now — no business rule required

| Field | **F-18 — route-level code splitting** |
|---|---|
| **Status** | ✅ **SHIPPED** — PR #91, merge `02ae966`, Resolved as **R-21**. Entry chunk **694 KiB → 305 KiB (−56%)**, chunks 1 → 80, Vite's >500 kB warning gone. Kept here for one revision so this file's recommendation and its outcome stay side by side. |
| **Requirement source** | None. `OPEN-FINDINGS.md` F-18 (Minor/Tech Debt); Vite's own build warning. **No NFR governs it** — performance targets are undefined (F-17). |
| **Current state** | Verified on `main`: production build emits a **single 710 KB JS chunk**; `App.tsx` uses `React.lazy` **zero** times across **27** routes. |
| **Why buildable** | `React.lazy` + `Suspense` per route invents no business rule and changes no behaviour or contract. Purely additive. |
| **Dependencies** | None. |
| **Scope** | Convert the 27 route imports in `App.tsx` to lazy imports, add a `Suspense` fallback, verify the chunk split in the build output. Existing route tests should pass unchanged. |
| **Risk** | Low. Main risk is a `Suspense` fallback flashing on navigation, and tests that assume synchronous route mounting — the latter is real, given **F-40** was exactly that class of timing assumption. |
| **Priority** | **P1 of the 🟢 set** (smallest, most self-contained, measurable before/after, and now guarded by CI's build step). |

| Field | **F-19 — backend error-response hygiene** |
|---|---|
| **Status** | ✅ **SHIPPED** — PR #93, merge `449a751`, Resolved as **R-22**. All 18 5xx sites cleaned (0 remain), proved on the wire, guarded by a mutation-tested invariant test. Its validation surfaced **F-41** (some 4xx bodies also carry raw driver errors), which is **not** buildable-now: it needs a per-site audit to separate sentinels from wrapped driver errors. Kept here for one revision so the recommendation and its outcome stay side by side. |
| **Requirement source** | None. `OPEN-FINDINGS.md` F-19; `RAISE-DETAILED-DESIGN.md` §7. Security NFRs are undefined (F-17). |
| **Current state** | Verified: **46 `err.Error()` occurrences across 8 controllers** put raw Go error strings into JSON responses. |
| **Why buildable** | Not leaking internal error text needs no business rule. |
| **Dependencies** | None hard, but the replacement contract must be chosen and frontend consumers of the `error` field checked first — so it is more entangled than F-18. |
| **Scope** | Replace raw error text with a stable generic message per status; keep detail in server logs. |
| **Risk** | Low–moderate: it is an API response-shape change, and no deployment exists yet (F-13), so the benefit is currently theoretical. |
| **Priority** | P2 of the 🟢 set. |

### 🟡 Needs a business/product decision

| Candidate | Requirement source | Current state | Exact missing decision |
|---|---|---|---|
| **F-03** Dashboard NBV/Risk KPI formulas | PRD §16 Q3–Q4; `RAISE-FR-EXEC-001` | Dashboard `PASS` on its confirmed 8-tile scope; NBV/Risk tiles absent | The formulas and thresholds themselves |
| **F-05** Alert trigger rules & channels | PRD §6.9; `RAISE-FR-ALERT-001` | Alerts screen shipped, scoped to the one confirmed trigger (expired warranty); severity rendered honestly as "Not yet defined" | Which conditions raise an alert, at what severity, over which channels |
| **F-09** Full asset master field list | PRD §16 Q1 | `RAISE-FR-ASSET-001` `PASS` on current fields | The authoritative field list |
| **F-35** Asset code generation scheme | User-supplied Singer form, 2026-09-02 | `AST-####` auto-generated; real convention is `<Company><YY><MM><Dept><TypeCode><NNNN>` | The department-code and 2-letter type-code tables from IT (only `IT` and `NB` attested) |
| **F-36** Employee ID generation | User Q&A 2026-09-03 | **Format validation shipped** (8 digits, first 2 = join year). Seed fixtures and the backend fallback still emit legacy `EMP-…` | Whether RAISE should generate the HR-issued 6 digits at all, and if so how. **Known: 8 digits, first 2 = Gregorian join year, last 6 issued by HR. Unknown: any rule RAISE could use to produce them.** Do **not** implement generation without this |
| **F-39** "Modify Specs" button | `EmployeeDetail:286` | Routes to a page with no spec fields | Add the workstation/OS spec fields, or remove the button. No `RAISE-FR-EMP-*` exists to derive either from |
| **F-10** Custody vs. Check-in/out | PRD Pre-Finalization Quality Pass | Both requirements `PASS` independently | Which requirement owns the custody write-path |
| Header bell dropdown | — | `AppShell` takes a `notifications` prop defaulting to `[]`; **no caller passes it**, so it is permanently empty while `/notifications` shows 11 real alerts | **Blocked by a documentation contradiction, see below** |

> **Documentation conflict, unresolved — raised 2026-09-04, not decided.**
> `RAISE-PRD.md` (Resolved Question 35) lists `NotificationCenter.tsx` as
> *"confirmed explicitly out of RAISE scope entirely"* and **distinct
> from** `RAISE-FR-ALERT-001`, while
> `ESAPS-UI-FOUNDATION-BASELINE.md:88` maps it **to**
> `RAISE-FR-ALERT-001` as **EXTEND**, *"matches MVP's single-channel
> in-app alerts requirement."* These directly contradict. Combined with
> F-05 leaving *channels* TBD, whether populating the header bell is
> in-scope is a scope call, not an engineering one.

### 🔴 Blocked on a technical or requirement dependency

| Candidate | Blocked by |
|---|---|
| **F-38** Employee audit trail backend | Needs a real Employee-field audit endpoint (none exists; `auditController` covers Assets only) **and** `RAISE-FR-AUDIT-001`'s field taxonomy (Design §15) + audit-review role gate (**F-08**), both `BLOCKED` |
| **F-04 / F-31** Oracle FA Financial View | Integration mechanism undecided (PRD §16 Q6–Q10); business explicitly deferred building even a placeholder, 2026-09-01 |
| **F-06 / F-33** Natural Language Search | Needs a real AI backend; business explicitly deferred a canned-answer engine, 2026-09-01 |
| **F-07** Document Intelligence (`RAISE-AI-DOC-001..004`) | Confidence thresholds, field lists and matching/merge rules all unanswered — asked once (PRD §16 Q20a) and not answered |
| **F-08** Auth / RBAC content | Role-permission matrix content undefined |
| **F-37** Employee login provisioning | Behind **F-08** and **F-11** (no user store exists) |
| `RAISE-FR-LIFE-001` Lifecycle Connectivity | PRD-level lifecycle-stage detail undefined |
| F-14's image build/push half | **F-13** (no hosting target decided) |

---

## Recommendation

**Recommended Next Task:** **Obtain a business decision — F-05 (alert
trigger rules and channels) or F-03 (NBV/Risk KPI formulas). There is no
implementation task to recommend.**

> **No 🟢 buildable task is currently available. The next action should be
> requirements/business decision resolution rather than implementation.**

**Reason:** this is now demonstrated rather than argued. The 2026-09-04
discovery found exactly three 🟢 items and **all three have shipped** —
**F-14** (CI, PR #89), **F-18** (code splitting, PR #91) and **F-19**
(5xx error hygiene, PR #93). Each was worth doing. **Each advanced zero
requirement, AC, compliance and traceability coverage.** Three for three
is no longer a coincidence to explain away: the traceability matrix is
closed at **v1.8 with all 15 gaps closed**, and **every** non-`PASS` row
in the Compliance Review waits on an answer, not on code. There is
nothing further to build that would move the product.

The only remaining engineering item, **F-41**, is deliberately **not**
offered as a substitute: it needs a per-site audit to separate genuine
sentinels from wrapped driver errors before it can even be scoped, and
it would advance no coverage either.

**Required Decisions Before It:** **F-05** — which conditions raise an
alert, at what severity, over which channels (would move
`RAISE-FR-ALERT-001` off `PASS (partial)` and is the prerequisite for the
header-bell question and its unresolved PRD-vs-baseline documentation
conflict). **Or F-03** — the NBV and Risk KPI formulas and thresholds
(would complete `RAISE-FR-EXEC-001` and the Dashboard). Either unlocks
more than the entire 🟢 backlog did.

**Proposed Implementation Phase:** **none.** No phase should be advanced
and no implementation started until one of those decisions lands.

> **Read this before treating the above as "the plan."** F-18 is the best
> *buildable* task, not the most *valuable* action. The project is
> decision-limited, not engineering-limited: the traceability matrix is
> fully closed at v1.8, and every one of the Compliance Review's 8
> non-`PASS` requirements is waiting on an answer rather than on code.
> **The two decisions that unlock the most are F-05** (alert trigger
> rules and channels — would move `RAISE-FR-ALERT-001` off `PASS
> (partial)` and is the prerequisite for the header-bell question)
> **and F-03** (NBV/Risk formulas — would complete `RAISE-FR-EXEC-001`
> and the Dashboard). Either is worth more to the project than every
> remaining 🟢 task combined.
