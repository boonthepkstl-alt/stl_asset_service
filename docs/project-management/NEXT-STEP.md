# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-25, immediately after `CHECKPOINT-2026-08-25-004` (PR #35, Ticket-domain audit hook-in).

---

## Current State

- **Current phase:** Phase 1 — Foundation (ongoing) running concurrently with Phase 3 — Asset Management, Phase 6 — Audit & Reconciliation (🟡 Audit Log now covers Asset + Ticket domains; Oracle FA Integration not started), and Phase 8 — Executive Dashboard & Reporting (🟡 plain-count KPIs shipped; NBV/Risk/Utilization mechanics blocked on PRD).
- **Current feature:** None actively in progress. Last feature-level work: Ticket-domain audit hook-in, extending PR #31 to a second domain, built in PR #35.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-25-004`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-25-004` (Level 1, merged via [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35)).
- **Current status:** 🟢 Both codebases verified green (backend `go build`/`vet`/`test`; frontend `tsc`/`lint`/`vitest` 134/134/`build`) as of this checkpoint.
- **Open blockers:** Every remaining MVP item in `CURRENT-STATUS.md` §4 is genuinely "Blocked on a business decision" (Warranty, Alerts, Oracle FA Integration, Natural Language Search, Document Intelligence, User/Role Management backend) or the NBV/Risk/Utilization-mechanics remainder of Executive Dashboard (PRD §16 Q3/Q4/Q29). None of these can be scoped down further without inventing an answer — see Priority Application below for why this session does **not** manufacture a fake "buildable" pick.
- **Open findings:** F-01 through F-20 in `OPEN-FINDINGS.md`, unchanged this session. F-20 (missing Level 1 checkpoints for PR #19-28) remains the one open item that is neither blocked nor speculative — see Priority Application.
- **Remaining work:** None outstanding from the Ticket-domain audit hook-in itself. A future Ticket-side (or unified) audit *viewing* UI was explicitly not built — see `CHECKPOINT-2026-08-25-004`'s Remaining Work — but building one wasn't asked for and isn't assumed here.
- **Dependencies:** N/A — no fresh dependency chain to trace; every remaining item's blocker is a PRD answer, not a missing prerequisite domain.
- **Plan vs. actual variance:** None — this session executed exactly the item the prior `NEXT-STEP.md` recommended (Ticket-domain audit hook-in), with no scope drift.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Missing Level 1 checkpoints for PR #19-28 | `FINDING` (F-20) | Documentation debt — real, actionable, not blocked, but also not a product feature |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Blocked — PRD §16 Q15 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 for each item's specific open question |
| Ticket-domain audit *viewing* UI | Not started, not requested | Entries are recorded (PR #35) but nothing displays them yet — a new task if/when asked for |
| `TC-OPS-001-01..03` / `TC-AUDIT-001-01/03` / `TC-EXEC-001-01/02` formal execution | `VALIDATION` | Test-case sign-off, not a code task |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed, not actionable now |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only — do not select |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: for the first time in this session's
run of picks (QR/Barcode → Audit Log → Executive Dashboard →
Ticket-domain audit extension), **no fresh code-buildable item remains**.
Every "needs a scoped-down first cut" and "already-scoped extension"
candidate identified across the last four checkpoints has been built.
What's left splits into exactly two honest categories: (1) items
genuinely blocked on a PRD/business-decision answer, where writing code
now would mean guessing a formula, field list, or role model the
business hasn't confirmed — not permitted per this protocol's own rules;
and (2) documentation debt (F-20) and test-execution sign-off, neither of
which is a "next feature" in the sense the last four picks were.

This is the point the prior `NEXT-STEP.md` runs anticipated ("recalculate
... expecting the honest answer to be 'everything left is blocked on a
PRD/business decision,' and say so plainly rather than inventing a new
'buildable' category that doesn't exist" — `CHECKPOINT-2026-08-25-002`'s
own framing). That prediction is now correct. The responsible move is to
say so, not to stretch F-20 or test-execution into a manufactured "primary
next step" of equivalent weight to the four feature checkpoints just
shipped.

---

## Primary Next Step

**None identified that fits this session's established "scoped-down
first cut / already-scoped extension" pattern.** The two next-best
candidates are of a different kind entirely, and the choice between them
is a judgment call for whoever is directing this project, not something
this protocol should decide unilaterally:

1. **Backfill F-20** (Level 1 checkpoints for PR #19-28) — pure
   documentation debt, zero risk, no PRD dependency, but also not
   product-facing.
2. **Ask the business to resolve one specific open PRD question** (PRD
   §16 — pick from Q3/Q4/Q29 NBV/Risk/Utilization, Q6-Q10 Oracle
   integration, Q15 Warranty fields, Q20a Duplicate Detection, or Q22
   role model) — whichever answer lands first reopens exactly one
   "needs a scoped-down first cut" item.

## Why Neither Is Auto-Selected

Per Rule 14 and this protocol's "don't invent, mark gaps" principle:
picking (1) would silently reframe housekeeping as feature progress;
picking (2) requires a business decision this session cannot make on its
own. Recommending both, explicitly, and deferring the choice is more
honest than picking one and presenting it as equivalent to the last four
shipped checkpoints.

## Dependencies

N/A for both candidates — (1) needs only `gh pr view`/diff access already
used for the PR #18-29 backfill precedent; (2) needs a business answer,
not a technical dependency.

## Expected Output

If (1) is chosen: repeat the same evidence-based backfill process already
used for PR #18-29 (`CHECKPOINT-2026-08-25-001`'s own §"docs/qr-barcode-closeout"
precedent) — `gh pr view <n> --json ...`/diff for PRs #19-28, write Level 1
checkpoints from that real evidence, not from memory.

If (2) is chosen: whichever PRD answer lands, re-run this protocol's Steps
1-7 from scratch against the traceability matrix's state *at that time* —
don't assume the newly-unblocked item is automatically "the" next pick
without re-checking the others too.

## Acceptance Criteria

N/A — neither candidate has a product AC; (1) is docs-process, (2) is a
business decision, not a build task.

## Validation Method

N/A for this recalculation itself. Whichever candidate is chosen next,
its own validation method should be written fresh once real code work
starts (per Step 8/9 of the protocol), not inherited from this entry.

## Related Checkpoint

`CHECKPOINT-2026-08-25-002`, `-003`, `-004` (the three checkpoints whose
own "Next Step" fields predicted this session would eventually run out of
scoped-down picks) and `CURRENT-STATUS.md` §4 (current backlog triage).

## Related Git Branch/Commit

None — no code branch is recommended by this recalculation.

---

## Risks / Blockers

The real risk here is process, not code: treating F-20 backfill as
"progress" of the same kind as the last four feature checkpoints would
misrepresent the project's actual state to a future reader of
`PROJECT-CHECKPOINTS.md`. Keep the distinction explicit if either
candidate is picked next.

## Files to Update (after whichever is chosen, per Step 10)

If (1): `PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md` (if new PRs
result), `OPEN-FINDINGS.md` (resolve F-20), this file. If (2): the full
deliverable chain from `RAISE-PRD.md` downward, per this project's
established "PRD change → re-verify every downstream document" rule.

## After Completion

This file should stop being auto-recalculated as "pick the next scoped
build" once both remaining categories here are exhausted or chosen from
— the next real re-run of this protocol should start from whichever of
(1)/(2) actually happened, not from assuming another first-cut candidate
will appear on its own.
