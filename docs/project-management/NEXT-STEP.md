# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-07, after `CHECKPOINT-2026-09-07-002` — Gap 20's
execution sweep completed, taking **`RAISE-FR-ALERT-001` to a full,
unqualified `PASS`** and leaving the traceability matrix with **zero open
gaps for the first time in its history**.

**Derived from** a direct read of merged `main` at `282e758` plus this
pass's own execution evidence: PRD **v0.18**, Design **v0.16**, Prototype
**v0.17**, AC **v0.16**, Test Plan **v0.16**, Test Cases **v0.26**,
Traceability Matrix **v2.6**, `OPEN-FINDINGS.md`, and the source tree.

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

**1. A contradiction can survive a month because two documents share a
word, not because either is wrong.** Gap 17 pitted PRD RQ35 against the
ESAPS baseline over `NotificationCenter.tsx`. Both were describing
different artifacts under one name — the ESAPS *page* versus RAISE's own
`AppShell` bell. Putting it to business as **two** questions instead of
forcing one side resolved it without anyone having to be wrong.

**2. The AI's own specification error was caught by execution and recorded
as its own.** `AC-ALERT-001-12` claimed the closed bell button shows a
numeric badge. It does not. The criterion had been drafted from the AI's
imprecise phrasing during a chain sync — true of the panel badge, mis-read
as the header badge — and **PRD RQ49 never asked for a header numeral**.
The product matched the decision; the specification over-reached. Recorded
as **F-46**, an AI-introduced specification error, not a product defect.

**3. Correct-then-execute is what makes the evidence worth having.**
`TC-ALERT-001-12` was not marked PASS and its procedure was not rewritten
mid-run — the discipline **F-42** established. The correction landed in
Test Cases v0.25 **unexecuted**, and only then was it executed in v0.26.
The same ordering was used for `TC-ALERT-001-09` and produced the same
kind of trustworthy result.

**4. Verdicts moved in both directions, twice.** `RAISE-FR-ALERT-001` went
`PASS` → `PASS (partial)` when its confirmed scope grew faster than
execution evidence, then back to a full `PASS` once the sweep ran. Nothing
regressed in the product either time.

## Candidate Evaluation

### 🟢 Buildable now

**None.** The Gap 20 sweep was the last buildable item and it is done.
Nothing in the backlog can start without an answer only the business can
give.

### 🟡 Needs a business/product decision

| Candidate | What it needs | Why it matters |
|---|---|---|
| **F-03 (NBV)** | Five numbers: default useful-life years for IT Hardware, Mobile, Office Equipment, Infrastructure, Media Equipment | **Highest leverage, and the only one that converts a requirement outright.** Formula, per-category Settings shape, zero salvage and clamp-at-0 are all confirmed. One answer takes `RAISE-FR-EXEC-001` to a full `PASS` |
| **F-43** | Whether request-parse 4xx bodies keep echoing Go decoder text (usability vs disclosure), and whether a token-signing failure should keep being reported as a 401 | A trade-off, not a defect with an obvious fix. Deliberately not swept with F-41. The 401 half is narrower and could be fixed alone |
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

**Reason:** it is the same shape as the three decisions that have already
worked — F-05 (alert conditions), F-08 (access gate) and RQ49 (bell
scope) — and it is now far narrower than when F-03 was opened. Two of
F-03's three KPIs turned out never to have been decision-blocked at all.
What remains is **five numbers, not a model**, and nothing else on the
list converts a requirement outright.

**Required Decisions Before It:** just those five values. Everything else
is confirmed in PRD §16 Resolved Question 46.

**Proposed Implementation Phase:** none until a decision lands. When F-03
is answered, the work sits in **Phase 8 — Executive Dashboard &
Reporting**: `lib/nbv.ts`, the Settings per-category field, the tile, unit
tests, a chain sync and a formal execution — the same sequence just
completed twice, for Utilization and for the header bell.
