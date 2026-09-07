# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-07, after `CHECKPOINT-2026-09-07-004`. **The previous run of
this protocol concluded that nothing buildable remained. That conclusion was audited
and was wrong twice**, producing F-47 and F-43 half (b) — both now closed.

**Derived from** a direct read of merged `main` at `96d076f`: PRD **v0.18**, Design
**v0.16**, Prototype **v0.17**, AC **v0.16**, Test Plan **v0.16**, Test Cases
**v0.26**, Traceability Matrix **v2.6**, Compliance Review **v1.1**,
`OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation:** frontend `tsc`/lint/build clean, **51 test files / 262
  tests**; backend `go build`/`vet`/`test` clean; CI green on `main`.
  Local runs are deterministic (`pool: 'threads'`, F-44 → R-27).
- **Traceability:** matrix **v2.6**. **Gaps 1–20 all resolved — no gap is
  open.** This is the first revision of that document with zero open gaps.
- **Alerts:** `RAISE-FR-ALERT-001` is a **full, unqualified `PASS`** on
  **both** surfaces — the Alerts screen (P-012) and the header bell in
  global chrome — all seventeen `TC-ALERT-001-01..17` executed and passing.
- **Executive Dashboard:** `RAISE-FR-EXEC-001` is **`PASS (partial)`**,
  held by **NBV alone**. Utilization is built and executed; Risk is out of
  MVP scope by confirmed decision, not a gap.

## What this run demonstrated

**One thing, and it is about this document rather than the product.**

The previous run said: *"No 🟢 buildable task is currently available. The next action
should be a business decision, not implementation."* Asked to decide what to do next,
the honest move was to **check that claim rather than repeat it** — and it was wrong
twice:

| Item | What had parked it | What was actually true |
|---|---|---|
| **F-47** | The Compliance Review said of itself *"no action is required to finish this review"* | It had fallen **twelve matrix revisions** behind and was **overstating** `RAISE-FR-EXEC-001` as a full `PASS` |
| **F-43 half (b)** | Its row said fixing it *"changes login response text the frontend may rely on"* | Nothing reads that text — `Login` displays its own fixed string. Never a decision; a plain defect |

**Both blockers were premises written down without being checked, and one of them I
wrote myself.** Neither needed a business answer; both needed someone to open the file.

**The rule this produces: a finding's own scoping note deserves the same verification
as a test result.** A wrong one quietly parks real work in the decision-blocked column,
where nothing goes looking for it again — which is exactly how the Compliance Review
drifted twelve revisions while every close-out dutifully updated the matrix beside it.

**Carried forward from the previous run, still true:** a contradiction can survive a
month because two documents share a word (Gap 17); the AI's own specification error was
caught by execution and recorded as its own (F-46); correct-then-execute is what makes
the evidence worth having; and verdicts moved in both directions without anything
regressing in the product.

## Candidate Evaluation

### 🟢 Buildable now

**None.** The Gap 20 sweep was the last buildable item and it is done.
Nothing in the backlog can start without an answer only the business can
give.

### 🟡 Needs a business/product decision

| Candidate | What it needs | Why it matters |
|---|---|---|
| **F-03 (NBV)** | Five numbers: default useful-life years for IT Hardware, Mobile, Office Equipment, Infrastructure, Media Equipment | **Highest leverage, and the only one that converts a requirement outright.** Formula, per-category Settings shape, zero salvage and clamp-at-0 are all confirmed. One answer takes `RAISE-FR-EXEC-001` to a full `PASS` |
| **F-43 half (a)** | Whether the 15 request-parse 4xx sites should keep echoing Go's decoder text | A genuine usability-versus-disclosure trade. **Half (b) is closed** (R-32) — it was never a decision, only a premise nobody had checked. F-41 warned that a blanket sweep is the wrong shape of fix |
| **PRD Q22a** | How to link the authenticated `User` to an `Employee`, and what "relevant to me" means per condition and role | Not specifiable today — `User` carries only `id`/`username`/`fullName`/`role`; Handovers matches by `fullName` string, a documented MVP limitation, not a reusable identity link |
| **F-09 / F-35 / F-36 / F-37 / F-39** | Asset master field list; asset-code scheme; the Employee-ID convention the app's own seed data contradicts; login provisioning; what "Modify Specs" should edit | Smaller, independent product questions, none blocking a P0 verdict today |

### 🔴 Blocked on a dependency

| Candidate | Blocked on |
|---|---|
| **F-04** (Oracle FA integration) | Integration method, mapping, sync and security all undefined (PRD §16 Q6–Q10) |
| **F-31** (Financial View, P-011) | Depends on F-04 |
| **F-06 / F-07** (AI search citations, document intelligence) | Thresholds, field lists and merge rules undefined |

### Minor, no decision needed

**F-40** — flaky navigate-away assertions; all known sites fixed, a
pattern to watch rather than a task. **F-38** — the Employee audit trail
is a mock-mode fixture shim with no backend; deferred tech debt, recorded
rather than hidden.

## Recommendation

> **No 🟢 buildable task is currently available. The next action should be
> a business decision, not implementation.**

**Recommended Next Task:** Obtain **F-03**'s per-Asset-Category
useful-life defaults.

**Reason:** it is the same shape as the decisions that have already worked — F-05
(alert conditions), F-08 (access gate), RQ49 (bell scope), RQ46—48 (KPI scope) — and
it is now far narrower than when F-03 was opened. Two of its three KPIs turned out
never to have been decision-blocked at all. What remains is **five numbers, not a
model**, and it is the only remaining item that would move a Compliance Review
verdict from `PASS (partial)` to a full `PASS`.

**Required Decisions Before It:** just those five values. Everything else
is confirmed in PRD §16 Resolved Question 46.

**Proposed Implementation Phase:** none until a decision lands. When F-03
is answered, the work sits in **Phase 8 — Executive Dashboard &
Reporting**: `lib/nbv.ts`, the Settings per-category field, the tile, unit
tests, a chain sync and a formal execution — the same sequence just
completed twice, for Utilization and for the header bell.
