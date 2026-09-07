# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run.

**Run date:** 2026-09-07, after `CHECKPOINT-2026-09-07-007`. **This protocol has now
concluded "nothing buildable remains" four times and been wrong three.** The three
wrong ones produced F-47, F-43 half (b), F-49, F-38 half and F-03 groundwork — all
closed. The one correct one was the third audit, which found only bookkeeping errors.

**Derived from** a direct read of merged `main` at `c22c5e2`: PRD **v0.18**, Design
**v0.16**, Prototype **v0.17**, AC **v0.16**, Test Plan **v0.16**, Test Cases
**v0.26**, Traceability Matrix **v2.6**, Compliance Review **v1.2**,
`OPEN-FINDINGS.md`, and the source tree.

---

## Current State

- **Validation:** frontend `tsc`/lint/build clean, **53 test files / 278
  tests**; backend `go build`/`vet`/`test` clean; CI green on `main`, and CI
  now also gates `gofmt` (F-49 → R-34). Local runs are deterministic
  (`pool: 'threads'`, F-44 → R-27).

## What this run demonstrated

**The same thing three more times, which is what makes it a pattern rather than an
anecdote.**

| Item | What had parked it | What was actually true |
|---|---|---|
| **F-49** | `ci.yml` said Go sources are *"committed with CRLF … so `gofmt -l` lists every file on a Linux runner"* | They are committed with **LF**. The CRLF was `core.autocrlf` on a Windows working tree. The gate was never blocked — and **failed on its first run** on a real misformat the CRLF noise had masked |
| **F-38 half** | Filed as "deferred tech debt" | A latent correctness defect: the audit memo could never recompute from a write |
| **F-03 groundwork** | This document said F-03 was blocked outright on five numbers | Only the *defaults* were. RQ46 confirmed the formula, and `lib/alerts.ts` already showed how to build against an injected lookup |

**Two of those three premises were written by this AI**, including the one in this
document. F-49 went further and produced a *second* overstatement inside its own fix:
proving that the locally-flagged and locally-CRLF file sets were identical was taken to
mean "no real formatting problems exist", which set equality does not show. The gate
disproved it immediately.

**The rule, unchanged and now five-for-five: a finding's own scoping note deserves the
same verification as a test result.** A wrong one parks real work where nothing looks
for it again.

**A second rule, earned this run: a fix is not verified until the guard fails without
it.** The F-38 fix was cosmetic on its second attempt and would have shipped as a bug
fix — the guard test still passed with the original bug restored, because it exercised
the wrong arrangement. Mutation-testing the guard, not just running it, is what caught
that.

## Candidate Evaluation

### 🟢 Buildable now

**None — recorded as a hypothesis, not a conclusion.** It has been wrong three times
out of four. If it is worth re-testing, the productive method has been to take one
finding's scoping note and open the file it describes, rather than re-reading the
register.

### 🟡 Needs a business/product decision

| Candidate | What it needs | Why it matters |
|---|---|---|
| **F-03 (NBV)** | Five numbers: default useful-life years for IT Hardware, Mobile, Office Equipment, Infrastructure, Media Equipment | **Highest leverage, and the only one that converts a requirement outright.** As of 2026-09-07 the formula is **built** — `lib/nbv.ts`, RQ46 in full, useful life injected, **no defaults defined**, 15 tests, three mutations. What still needs the numbers: the Settings field, the tile, the chain sync and an execution |
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

**F-40** — a flaky navigate-away test pattern; all known sites fixed, a pattern to watch
rather than a task. **F-38's backend half** — the Employee audit trail has no backend and
`EditEmployee` writes by mutating a module fixture. Not fixable within scope: **no
`RAISE-FR-EMP-*` requirement exists** to trace an audit source to. Its stale-derivation
half is closed (R-35).

## Recommendation

> **No 🟢 buildable task is currently available. The next action should be
> a business decision, not implementation.**

**Recommended Next Task:** Obtain **F-03**'s per-Asset-Category useful-life defaults.

**Reason:** it is now the narrowest it has ever been. Two of F-03's three KPIs turned out
never to have been decision-blocked, and as of 2026-09-07 the third's **formula is built and
tested** — what remains is **five numbers, not a model, and not code**. It is the only
remaining item that would move a Compliance Review verdict from `PASS (partial)` to a full
`PASS`.

**Required Decisions Before It:** just those five values. Everything else
is confirmed in PRD §16 Resolved Question 46.

**Proposed Implementation Phase:** the remaining work sits in **Phase 8 — Executive
Dashboard & Reporting** and is now short: seed the Settings per-category field, wire the
tile to `computePortfolioNbv`, sync the chain, execute. `lib/nbv.ts` is already merged and
tested, so none of that is design work — the same sequence completed three times already,
for Utilization, the header bell, and Gap 20.
