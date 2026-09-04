# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid.

**Run date:** 2026-09-04, after `CHECKPOINT-2026-09-04-007` —
`TC-ALERT-001-09` corrected and executed (**PASS**), closing **F-42
(R-24)**, **Gap 18** and **Gap 16**.

**Derived from** a direct read of merged `main` at `30f176c` plus this
pass's own execution evidence: `RAISE-PRD.md` v0.15, `RAISE-DESIGN.md`
v0.13, `RAISE-PROTOTYPE.md` v0.14, `RAISE-ACCEPTANCE-CRITERIA.md` v0.12,
`RAISE-TEST-PLAN.md` v0.12, `RAISE-TEST-CASES.md` **v0.20**,
`RAISE-TRACEABILITY-MATRIX.md` **v2.1**, `RAISE-COMPLIANCE-REVIEW.md`
v1.0, `OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation on `30f176c`:** frontend `tsc`/lint/build clean, **49 test
  files / 250 tests**; backend `go build`/`vet`/`test` clean; CI green.
- **Traceability:** matrix **v2.1**. Gaps 1–16 and 18 resolved; **one gap
  open — Gap 17**, and it is a documentation decision, not an
  engineering task.
- **Alerts:** **all 10 `TC-ALERT-001-*` cases executed and passing.**
  `RAISE-FR-ALERT-001` is still `PASS (partial)` — held there by **F-08**
  alone.

## The distinction that matters most right now

`RAISE-FR-ALERT-001` has **complete test coverage, all passing**, and is
still not a full `PASS`. That is not a gap in the work — it is a gap in
the decisions. The `"authorized user"` access gate on `AC-ALERT-001-01`
cannot be tested until somebody defines the role/permission matrix
(**F-08**, PRD §16 Q22). No amount of engineering closes it.

Anyone reading "Gap 16 and Gap 18 closed" as "Alerts is done" would be
wrong in a way worth pre-empting: Alerts is done *as far as engineering
can take it*.

---

## Candidate Evaluation

### 🟢 Buildable now

**None.** Every engineering candidate is either finished, blocked on a
prerequisite, or needs a decision first.

For completeness, the two engineering items that exist and why neither
qualifies:

| Candidate | Why not buildable-now |
|---|---|
| **F-41** — some 4xx bodies carry raw driver errors | Needs a **per-site audit** across 28 sites to separate genuine service-layer sentinels (whose text is useful validation feedback and should stay) from wrapped driver errors (which should go). Until that audit exists there is nothing to implement, only something to guess at |
| **F-40** — flaky navigate-away assertions | All three known sites are fixed. It is recorded as a **pattern to watch**, not a task; there is no work item here unless the shape reappears |

### 🟡 Needs a business/product decision

| Candidate | Requirement source | Current implementation state | Dependencies | Scope | Risk | Priority |
|---|---|---|---|---|---|---|
| **F-08** Auth/RBAC role-permission content | PRD §16 Q21–Q22 | Enforcement *location* resolved (UI-only, MVP); role *content* undefined. Route guards exist and work | None to decide it; F-11 (no user store) to implement it fully | Define which roles may see/do what, then gate the Alerts screen and re-test `AC-ALERT-001-01` | Low to decide; the risk is inventing a matrix nobody approved | **P1 — the single thing standing between `RAISE-FR-ALERT-001` and a full `PASS`** |
| **F-03** Dashboard NBV/Risk formulas | PRD §16 Q3–Q4; `RAISE-FR-EXEC-001` | `PASS` on its confirmed 8-tile scope; NBV/Risk tiles absent | None | Define formulas + thresholds, then build two tiles | Low | **P2 — completes `RAISE-FR-EXEC-001` and the Dashboard** |
| **Gap 17** Header bell scope | PRD §16 RQ35 vs `ESAPS-UI-FOUNDATION-BASELINE.md` line 88 | `AppShell` takes a `notifications` prop defaulting to `[]`; **no caller passes it**, so the bell is permanently empty while `/notifications` shows 17–19 real alerts | None | Decide which document is authoritative; if in scope, wire the bell to the existing `deriveAlerts` | Low technically. The risk is picking a side unilaterally — two project documents contradict each other | **P3 — cheap to build once decided; the derivation already exists** |
| **F-09** Asset master field list | PRD §16 Q1 | `PASS` on current fields | None | Add confirmed fields | Low | P4 |
| **F-35** Asset code scheme | Singer form, 2026-09-02 | `AST-####` generated | Type/dept code tables from IT | Implement the real format | Medium — wrong codes are hard to unwind | P4 |
| **F-36** Employee ID generation | User Q&A 2026-09-03 | Format validation shipped; fixtures still legacy `EMP-…` | HR's rule for the 6-digit portion | Align generation or drop it | Medium | P4 |
| **F-39** "Modify Specs" button | `EmployeeDetail:286` | Routes to a page with no spec fields | None | Add fields, or remove the button | Low | P4 |
| **F-10** Custody vs Check-in/out | PRD Quality Pass | Both `PASS` independently | None | Clarify ownership of the custody write-path | Low | P4 |

### 🔴 Blocked on a dependency

| Candidate | Blocked by |
|---|---|
| **F-38** Employee audit backend | No Employee-field audit endpoint; `RAISE-FR-AUDIT-001` taxonomy and F-08's role gate both BLOCKED |
| **F-04 / F-31** Oracle FA Financial View | Integration mechanism undecided; business explicitly deferred |
| **F-06 / F-33** Natural Language Search | Needs a real AI backend; business explicitly deferred |
| **F-07** Document Intelligence | Thresholds, field lists, matching rules unanswered |
| **F-37** Employee login provisioning | Behind F-08 and F-11 |
| `RAISE-FR-LIFE-001` | PRD-level lifecycle-stage detail undefined |
| **F-13** Hosting / F-14's image half | No deployment target decided |

---

## Recommendation

> **No 🟢 buildable task is currently available. The next action should be
> requirements/business decision resolution rather than implementation.**

**Recommended Next Task:** Obtain the **F-08** decision — the
role/permission matrix content: which roles exist and what each may see
and do, starting with who may view the Alerts screen.

**Reason:** evidence, not preference. `RAISE-FR-ALERT-001` now has every
test case in its scope executed and passing, and is still `PASS
(partial)` for exactly one reason: `AC-ALERT-001-01`'s "authorized user"
gate is NOT TESTABLE YET behind F-08. It is the only remaining item that
converts an existing requirement to a full `PASS`, and it also unblocks
**F-37** and part of **F-38**. No engineering candidate is buildable —
the two that exist (F-41, F-40) need an audit and are a watch-item
respectively, and neither would move compliance coverage.

**Required Decisions Before It:** F-08 **is** the decision. It needs, at
minimum: the list of roles, and per role what is viewable and editable —
enough to gate the Alerts screen and re-execute `AC-ALERT-001-01`'s
access-gate half. **F-03** is the equally-valuable alternative if the
RBAC answer is slower to obtain than the KPI formulas.

**Proposed Implementation Phase:** none until a decision lands. When
F-08 is answered, the work sits in **Phase 2 — Authentication / RBAC**,
whose scope explicitly reserved role content as out-of-MVP pending
exactly this answer.
