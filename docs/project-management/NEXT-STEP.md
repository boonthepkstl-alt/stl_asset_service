# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-05, after `CHECKPOINT-2026-09-05-004` — the Gap 19
execution sweep completed, taking **`RAISE-FR-EXEC-001` to `PASS
(partial)`** and closing the last gap in the matrix except one.

**Derived from** a direct read of merged `main` at `5100678` plus this
pass's own execution evidence: PRD **v0.17**, Design **v0.15**, Prototype
**v0.16**, AC **v0.14**, Test Plan **v0.14**, Test Cases **v0.23**,
Traceability Matrix **v2.4**, `OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation:** frontend `tsc`/lint/build clean, **50 test files / 257
  tests**; backend `go build`/`vet`/`test` clean; CI green on `main`.
  Local runs are now deterministic (`pool: 'threads'`, F-44 → R-27).
- **Traceability:** matrix **v2.4**. Gaps 1–16, 18 and 19 resolved;
  **one gap open — Gap 17**, a documentation contradiction, not an
  engineering task.
- **Alerts:** `RAISE-FR-ALERT-001` is a **full `PASS`** — all 11
  `TC-ALERT-001-01..11` executed and passing.
- **Executive Dashboard:** `RAISE-FR-EXEC-001` is **`PASS (partial)`** —
  `TC-DASH-01`/`-03a` and `TC-EXEC-001-01`/`-03a` executed 2026-09-05
  against the nine-tile grid and passing; `-03b` (NBV) BLOCKED; `-03c`
  (Risk) out of scope by decision, not counted as missing coverage.

## What this run demonstrated

Three things worth carrying forward.

**1. A finding's own framing can be wrong, and checking the source first
is what catches it.** F-03 tracked NBV, Risk and Utilization as one
decision gap. Reading the code before asking showed that two of the three
were never decision-blocked at all: **Utilization** had been fully
specified since 2026-08-21 (RQ27/RQ29) and was merely unbuilt, and
**Risk** was already recorded as Pilot/Roadmap, so §16 Q4 never blocked
this P0 requirement. Only NBV was ever a real gap. That is the third
consecutive round in which a finding's premise needed correcting (F-05's
channels half, F-19's scoping rationale, F-41's two-way split).

**2. Shipping code without syncing the chain has a measurable cost.** PR
#102 shipped the Utilization tile and deliberately held the chain sync so
it could move once alongside NBV. When NBV blocked, `AC-DASH-03` spent
three days asserting something factually false — that no such tile
existed — with a recorded PASS behind it. The repair was larger than the
sync would have been.

**3. A verdict must follow the evidence in both directions.** The matrix
was downgraded (`PASS` → `NOT_TESTED`) when criteria grew, then restored
only to `PASS (partial)` — not to a full `PASS` — because NBV remains
blocked. Superseded results kept their original dates rather than being
deleted or quietly re-marked.

## Candidate Evaluation

### 🟢 Buildable now

**None.** The last buildable item — the Gap 19 execution sweep — was
completed this run. Nothing else in the backlog can start without an
answer that only the business can give.

### 🟡 Needs a business/product decision

| Candidate | What it needs | Why it matters |
|---|---|---|
| **F-03 (NBV)** | Five numbers: the default useful-life years for IT Hardware, Mobile, Office Equipment, Infrastructure and Media Equipment | **Highest leverage.** Everything else about NBV is confirmed — formula, per-category Settings shape, zero salvage, clamp at 0. One answer takes `RAISE-FR-EXEC-001` to a full `PASS` |
| **Gap 17** | A ruling on which of two contradicting documents is authoritative — PRD §16 Resolved Question 35 vs `ESAPS-UI-FOUNDATION-BASELINE.md` line 88 | **Cheapest.** `deriveAlerts` already exists; the bell only needs wiring. Closing it empties the matrix's gap list entirely |
| **F-43** | Whether request-parse 4xx bodies should keep echoing Go decoder text (usability vs disclosure), and whether a token-signing failure should keep being reported as a 401 | A trade-off, not a defect with an obvious fix. Deliberately not swept with F-41 |
| **PRD Q22a** | How to link the authenticated `User` to an `Employee`, and what "relevant to me" means per alert condition and role | Not specifiable today — `User` carries only `id`/`username`/`fullName`/`role` |

### 🔴 Blocked on a dependency

| Candidate | Blocked on |
|---|---|
| **F-04** (Oracle FA integration) | Integration method, mapping, sync and security all undefined (PRD §16 Q6–Q10) |
| **F-31** (Financial View, P-011) | Depends on F-04 |
| **F-06 / F-07** (AI search citations, document intelligence) | Thresholds, field lists and merge rules undefined |

### Minor, no decision needed

**F-45** — `TC-EXEC-001-01`/`-03a` say "Log in as Executive", a role the
app does not have. A two-line wording fix, non-blocking; roll it into the
next PR that touches the test cases. **F-40** — flaky navigate-away
assertions; all known sites fixed, a pattern to watch rather than a task.

## Recommendation

> **No 🟢 buildable task is currently available. The next action should be
> a business decision, not implementation.**

**Recommended Next Task:** Obtain **F-03**'s per-Asset-Category
useful-life defaults.

**Reason:** it is the same shape as the two decisions that have already
worked this week, and it is now much narrower than when F-03 was opened.
The Alerts requirement had complete passing coverage and was held off a
full `PASS` by one undefined term; one answer converted it with **no code
written**. `RAISE-FR-EXEC-001` is in that position now, except that the
formula is already confirmed — what is missing is five numbers, not a
model. Nothing else on the list converts a requirement outright.

**Required Decisions Before It:** just the five values. The formula
(straight-line), the configuration shape (per Asset Category, in Settings,
following RQ41's precedent), the salvage value (zero) and the clamp (at 0)
are all confirmed in PRD §16 Resolved Question 46. **Gap 17** remains the
cheap alternative if those numbers are slow to obtain — it needs only a
ruling on which document is authoritative.

**Proposed Implementation Phase:** none until a decision lands. When F-03
is answered, the work sits in **Phase 8 — Executive Dashboard &
Reporting**: `lib/nbv.ts`, the Settings per-category field, the tile,
unit tests, a chain sync and a formal execution — the same sequence just
completed for Utilization.
