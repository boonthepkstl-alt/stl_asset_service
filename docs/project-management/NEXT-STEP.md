# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-04, after `CHECKPOINT-2026-09-04-008` — the Alerts
access gate confirmed and executed, taking **`RAISE-FR-ALERT-001` to a
full `PASS`**.

**Derived from** a direct read of merged `main` at `d8ad01c` plus this
pass's own execution evidence: PRD **v0.16**, Design **v0.14**,
Prototype **v0.15**, AC **v0.13**, Test Plan **v0.13**, Test Cases
**v0.21**, Traceability Matrix **v2.2**, Compliance Review v1.0,
`OPEN-FINDINGS.md`, and the source tree.

**Still current as of `a7f0d42`** (PR #100 merged 2026-09-05). That PR
changed **no code** — it was a decision, a chain sync and an execution —
so nothing below moved. Re-validated on the merged commit: frontend
`tsc`/lint/build clean and **49 test files / 250 tests passing**;
backend `go build`/`vet`/`test` clean.

---

## Current State

- **Validation:** frontend `tsc`/lint/build clean, **49 test files / 250
  tests**; backend `go build`/`vet`/`test` clean; CI green on `main`.
- **Traceability:** matrix **v2.2**. Gaps 1–16 and 18 resolved; **one gap
  open — Gap 17**, a documentation contradiction, not an engineering task.
- **Alerts:** `RAISE-FR-ALERT-001` is a **full `PASS`** — all 11
  `TC-ALERT-001-01..11` cases executed and passing.

## What this run demonstrated

The last three sessions each ended with the same finding: the project is
decision-limited, not engineering-limited. This run is the proof of what
that costs and what answering costs. **One business answer — "who may
view Alerts?" — converted a requirement that had complete, passing test
coverage from `PASS (partial)` to a full `PASS`.** No code was written.
The engineering had been finished for two PRs; only the definition was
missing.

**F-03 is the same shape.** The Dashboard has passing coverage on its
confirmed scope and two absent tiles waiting on formulas nobody has
supplied.

---

## Candidate Evaluation

### 🟢 Buildable now

**None.** No candidate can proceed without a decision or a prerequisite.

| Item | Why not buildable-now |
|---|---|
| **F-41** — some 4xx bodies carry raw driver errors | Needs a **per-site audit** across 28 sites to separate genuine service-layer sentinels (useful validation feedback, should stay) from wrapped driver errors (should go). Nothing to implement until that audit exists — only something to guess at |
| **F-40** — flaky navigate-away assertions | All three known sites fixed; recorded as a pattern to watch, not a task |

### 🟡 Needs a business/product decision

| Candidate | Requirement source | Current implementation state | Dependencies | Scope | Risk | Priority |
|---|---|---|---|---|---|---|
| **F-03** Dashboard NBV/Risk formulas | PRD §16 Q3–Q4; `RAISE-FR-EXEC-001` | `PASS` on its confirmed 8-tile scope; NBV and Risk tiles absent because no formula exists | None | Define the formulas and thresholds, then build two tiles and re-execute `TC-EXEC-001-*` | Low | **P1 — the same shape as the Alerts decision that just worked: it would complete `RAISE-FR-EXEC-001` and the Dashboard** |
| **Gap 17** Header bell scope | PRD §16 RQ35 vs `ESAPS-UI-FOUNDATION-BASELINE.md` line 88 | `AppShell` takes a `notifications` prop defaulting to `[]`; **no caller passes it**, so the bell is permanently empty while `/notifications` shows 19 real alerts | None | Decide which document is authoritative; if in scope, wire the bell to the existing `deriveAlerts` | Low technically; the risk is picking a side unilaterally when two project documents contradict each other | **P2 — the cheapest item on this list once decided; the derivation already exists** |
| **PRD Q22a** Per-user alert filtering | PRD v0.16 §16 Q22a | Every authenticated user sees all 19 alerts | Needs a `User`↔`Employee` link — none exists (`User` has only `id`/`username`/`fullName`/`role`); Handovers matches by `fullName` string as a documented MVP limitation | Decide what "relevant to me" means per condition and per role, and how identity is linked | Medium — a wrong identity-matching rule silently shows people the wrong data | P3 |
| **F-08 (remainder)** Role/permission content for other screens | PRD §16 Q21–Q22 | Alerts resolved; every other screen's role content undefined | F-11 (no user store) to enforce fully | Define per-screen role access | Low to decide | P3 |
| **F-09** Asset master field list | PRD §16 Q1 | `PASS` on current fields | None | Add confirmed fields | Low | P4 |
| **F-35** Asset code scheme | Singer form, 2026-09-02 | `AST-####` generated | Type/dept code tables from IT | Implement the real format | Medium — wrong codes are hard to unwind | P4 |
| **F-36** Employee ID generation | User Q&A 2026-09-03 | Format validation shipped; fixtures still legacy `EMP-…` | HR's rule for the 6-digit portion | Align generation or drop it | Medium | P4 |
| **F-39** "Modify Specs" button | `EmployeeDetail:286` | Routes to a page with no spec fields | None | Add the fields, or remove the button | Low | P4 |
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

**Recommended Next Task:** Obtain the **F-03** decision — the **NBV and
Risk KPI formulas and their thresholds** for the Executive Dashboard.

**Reason:** it is the same shape as the decision that just worked. The
Alerts requirement had complete passing coverage and was held off a full
`PASS` by one undefined term; **one answer converted it, with no code
written.** `RAISE-FR-EXEC-001` is in that position now — `PASS` on its
confirmed 8-tile scope, with the NBV and Risk tiles absent solely because
no formula exists. It is the only remaining item that would convert
another requirement outright.

**Required Decisions Before It:** F-03 **is** the decision. It needs the
NBV formula, the Risk score's inputs and weighting, and the thresholds
that separate risk bands — enough to compute two tiles and re-execute
`TC-EXEC-001-*`. **Gap 17** is the cheap alternative if the formulas are
slow to obtain: it needs only a ruling on which of two contradicting
project documents is authoritative, and the alert derivation it would use
already exists.

**Proposed Implementation Phase:** none until a decision lands. When F-03
is answered, the work sits in **Phase 8 — Executive Dashboard & KPIs**.
