# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid.

**Run date:** 2026-09-04, after `CHECKPOINT-2026-09-04-006` (PR #97 —
Gap 16 implemented, then `TC-ALERT-001-03..10` formally executed:
**7 PASS, 1 BLOCKED**).

**Derived from** a direct read of merged `main` at `c2e6b76`, not from a
prior run's conclusions: `RAISE-PRD.md` v0.15, `RAISE-DESIGN.md` v0.13,
`RAISE-PROTOTYPE.md` v0.14, `RAISE-ACCEPTANCE-CRITERIA.md` v0.12,
`RAISE-TEST-PLAN.md` v0.12, `RAISE-TEST-CASES.md` v0.18,
`RAISE-TRACEABILITY-MATRIX.md` v2.0, `RAISE-COMPLIANCE-REVIEW.md` v1.0,
`OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation on `c2e6b76`, run for real:** frontend `tsc`/lint/build
  clean, **49 test files / 250 tests**; backend `go build`/`vet`/`test`
  clean; CI green on `main`.
- **Traceability:** matrix at **v2.0** with **three open gaps** — 16
  (alerts, build half done, one case unexecuted), 17 (bell-icon scope
  contradiction), 18 (the `TC-ALERT-001-09` procedure defect).
- **Alerts:** `RAISE-FR-ALERT-001` is `PASS (partial)`. Seven of eight
  new cases pass against the real app. It is **not** a full `PASS` for
  two independent reasons: `TC-ALERT-001-09` is unexecutable as written,
  and F-08's "authorized user" access gate is still NOT TESTABLE YET.

## What changed about this project's shape

For three sessions running, every 🟢 task advanced **zero** requirement
coverage. That is no longer true: F-05's resolution and Gap 16's
implementation moved `RAISE-FR-ALERT-001` from one trigger condition and
an admitted placeholder severity to five conditions verified against the
real app. The remaining 🟢 item is small, but it finishes that work
rather than being adjacent to it.

---

## Candidate Evaluation

### 🟢 Buildable now

| Field | **Correct and execute `TC-ALERT-001-09` (F-42 / Gap 18)** |
|---|---|
| **Status** | 🟢 |
| **Requirement source** | `AC-ALERT-001-09`; `RAISE-TEST-CASES.md` v0.18; Gap 18 in matrix v2.0; **F-42** |
| **Current implementation state** | The behaviour is implemented and demonstrably correct — lowering the Expiring threshold 90 → 3 via the real Settings UI took the alert total 19 → 18 and back. Only the *test procedure* is broken: step 2 says "edit that Asset's `warrantyExpiry`", and `asset-repository.ts` exposes only `create`/`assign`/`checkIn` — there is no `updateAsset` and no edit-asset UI. |
| **Dependencies** | None. |
| **Scope** | Re-point step 2 at a state change the product supports (completing a maintenance ticket to `DONE` should clear its Overdue/On Hold rows), then execute and record the result. A `RAISE-TEST-CASES.md` edit plus one execution — **no production code change**. |
| **Risk** | Low. The one real risk is scope creep: it would be easy to "fix" this by *adding* an asset-edit capability, which is unrequested scope with no requirement behind it. Correct the test, not the product. |
| **Priority** | **P1** — it is the single item keeping **Gap 16** open, and closing it is the only path to `RAISE-FR-ALERT-001` improving further without a business decision. |

> Two other engineering items exist but are **not** buildable-now.
> **F-41** (some 4xx bodies carry raw driver errors) needs a per-site
> audit to separate genuine sentinels from wrapped driver errors before
> it can even be scoped. **F-40** (flaky navigate-away assertions) has
> all three known sites fixed and is a pattern to watch, not a task.

### 🟡 Needs a business/product decision

| Candidate | Requirement source | Current state | Exact missing decision |
|---|---|---|---|
| **F-03** Dashboard NBV/Risk formulas | PRD §16 Q3–Q4; `RAISE-FR-EXEC-001` | `PASS` on its confirmed 8-tile scope; NBV/Risk tiles absent | The formulas and thresholds |
| **F-08** Auth / RBAC content | PRD §16 Q21–Q22 | Enforcement *location* resolved; role *content* is not | The role/permission matrix content. **Blocks the last non-decision reason `RAISE-FR-ALERT-001` is partial** |
| **Gap 17** Header bell scope | PRD RQ35 vs `ESAPS-UI-FOUNDATION-BASELINE.md` line 88 | `AppShell` takes a `notifications` prop defaulting to `[]`; no caller passes it | Which document is right — is `NotificationCenter.tsx` in scope for this requirement at all |
| **F-09** Asset master field list | PRD §16 Q1 | `PASS` on current fields | The authoritative field list |
| **F-35** Asset code scheme | Singer form, 2026-09-02 | `AST-####` generated | Department and 2-letter type-code tables from IT |
| **F-36** Employee ID generation | User Q&A 2026-09-03 | Format validation shipped; fixtures still legacy `EMP-…` | Whether RAISE should generate the HR-issued 6 digits at all |
| **F-39** "Modify Specs" button | `EmployeeDetail:286` | Routes to a page with no spec fields | Add the fields, or remove the button |
| **F-10** Custody vs Check-in/out | PRD Quality Pass | Both `PASS` independently | Which requirement owns the custody write-path |

### 🔴 Blocked on a dependency

| Candidate | Blocked by |
|---|---|
| **F-38** Employee audit backend | No Employee-field audit endpoint exists; `RAISE-FR-AUDIT-001`'s field taxonomy and F-08's role gate both BLOCKED |
| **F-04 / F-31** Oracle FA Financial View | Integration mechanism undecided; business explicitly deferred |
| **F-06 / F-33** Natural Language Search | Needs a real AI backend; business explicitly deferred |
| **F-07** Document Intelligence | Thresholds, field lists, matching rules unanswered |
| **F-37** Employee login provisioning | Behind F-08 and F-11 |
| `RAISE-FR-LIFE-001` | PRD-level lifecycle-stage detail undefined |
| **F-13** Hosting / F-14's image half | No deployment target decided |

---

## Recommendation

**Recommended Next Task:** Correct `TC-ALERT-001-09`'s procedure to use a
state change the product actually supports — completing a maintenance
ticket to `DONE` and confirming its Overdue/On Hold rows clear — then
formally execute it and, if it passes, **close Gap 16**.

**Reason:** it is the only 🟢 candidate, it needs no decision, and it is
the single item keeping Gap 16 open after PR #97 verified seven of the
gap's eight cases against the real app. Unlike the F-14/F-18/F-19 run, it
finishes requirement work already in flight rather than sitting beside
it. It is also cheap: a test-case edit and one execution, **no production
code**.

**Required Decisions Before It:** **None.**

**Proposed Implementation Phase:** Phase 3 — Asset Management, as the
completion of the Alerts (`RAISE-FR-ALERT-001`) work, not a new phase.

> **One caveat worth stating plainly.** Closing Gap 16 will **not** make
> `RAISE-FR-ALERT-001` a full `PASS`. Its second reason for partial
> status — the "authorized user" access gate — is **F-08**, a business
> decision about role/permission content. After this task, Alerts is
> finished as far as engineering can take it without that answer, and the
> project returns to being decision-limited: **F-03** and **F-08** are
> then the highest-leverage moves.
