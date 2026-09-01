# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-008` (`RAISE-COMPLIANCE-REVIEW.md` v1.0 drafted and merged as [PR #65](https://github.com/boonthepkstl-alt/stl_asset_service/pull/65)).

---

## Current State

- **Current phase:** Cross-cutting (deliverable-chain tooling). The full chain — `RAISE-PRD.md` through `RAISE-COMPLIANCE-REVIEW.md` — now has a real artifact at every stage for the first time.
- **Current feature:** None actively in progress. Last work: drafted `docs/11-compliance-review/RAISE-COMPLIANCE-REVIEW.md` v1.0, consolidating `RAISE-TRACEABILITY-MATRIX.md` v1.4 into a per-requirement verdict table (no new test execution — a consolidation layer only).
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-008`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-008` — shipped and merged as [PR #65](https://github.com/boonthepkstl-alt/stl_asset_service/pull/65).
- **Current status:** 🟢 Clean — `main` is up to date with `origin/main`, no uncommitted changes, no open branch.
- **Open blockers:** None from a shipping standpoint. 6 of 17 MVP requirements carry a `BLOCKED`/`BLOCKED (partial)` verdict in the new Compliance Review, each waiting on a specific, already-identified business decision (see Incomplete Work Inventory below) — none of these are engineering tasks.
- **Open findings:** F-02 through F-19, F-31, F-33 in `OPEN-FINDINGS.md` (all standing/deferred items, unchanged by this session's work). F-22, F-27, F-30, F-32 Resolved (R-13–R-16); Warranty threshold Resolved (R-17); Settings access-gate defect Resolved (R-18). F-31/F-33 remain explicitly deferred by business decision.
- **Remaining work:** None shipping-related. The only remaining work across the whole project is business decisions on the 8 "Blocking" findings (F-02–F-09) that gate the 6 `BLOCKED`/`FAIL` requirement verdicts, or non-decision-dependent process work (see Primary Next Step).
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — the Compliance Review was drafted exactly as scoped (a verdict consolidation, not a new test-execution pass), matching what was described to the user before drafting began.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| `RAISE-FR-ORACLE-001` (Oracle FA Integration) — `FAIL` in Compliance Review | Blocked on business decision (F-04) + explicitly deferred build (F-31) | Won't be built until the integration mechanism itself is resolved |
| `RAISE-AI-SEARCH-001` (Natural Language Search) — `FAIL` in Compliance Review | Blocked on business decision (F-06) + explicitly deferred build (F-33) | Won't be built until a real AI backend integration lands |
| `RAISE-FR-AUDIT-001` field taxonomy / audit-review role gate — `BLOCKED (partial)` | Blocked on business decision (F-08, PRD §16 Q22) | Testable subset already PASS; this is the untestable remainder |
| `RAISE-FR-LIFE-001` (Asset Lifecycle Connectivity) — `BLOCKED` | Blocked on business decision | Lifecycle-stage detail beyond Disposal (already correctly Roadmap-excluded) undefined |
| `RAISE-AI-DOC-001..004` (Document Intelligence) — `BLOCKED (full)` ×4 | Blocked on business decision (F-07) | Confidence thresholds / field lists / matching rules — one item (duplicate-detection threshold) was explicitly asked once already and left unanswered |
| F-02: Check-in/Check-out exact workflow, holder data model | Blocked on business decision | PRD §16 Q11–Q13 |
| F-03: NBV/Risk KPI formulas | Blocked on business decision | PRD §16 Q3–Q4 — Dashboard's confirmed 8-tile/10-section scope is unaffected, already PASS |
| F-05: Alert trigger rules beyond warranty | Blocked on business decision | Alerts' confirmed warranty-only scope is unaffected, already PASS (partial) |
| F-08: Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — separate from the now-fully-resolved UI-only enforcement *location* |
| F-09: Full asset master field list | Blocked on business decision | PRD §16 Q1 |
| F-10: `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (scope question) | Unresolved, not blocking a build |
| No real user/auth store (F-11/F-12) | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| Backend raw error strings in some `500` responses (F-19) | `TECHNICAL_DEBT` | Acceptable pre-production |
| Hosting / CI-CD / API versioning / DB migration tooling (F-13–F-16) | `TECHNICAL_DEBT` (infra) | Outside PRD scope |
| Header bell-icon dropdown still hardcoded empty | `TECHNICAL_DEBT` (minor) | Flagged in F-32's resolution as a separate, smaller-scope item |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: every buildable-now engineering item
in the standing backlog has been completed and shipped. What remains is
entirely business-decision-gated (8 Blocking findings, F-02–F-09) or
explicitly deferred (F-31/F-33) or accepted technical debt. There is no
direct-fix engineering task or unexecuted validation task left to pick
autonomously — the honest next step is either a business check-in or
optional non-decision-dependent process work.

---

## Primary Next Step

**Check in with the user on which Blocking finding to resolve next** —
`RAISE-COMPLIANCE-REVIEW.md`'s §7 deliberately does not recommend an
order among F-02–F-09, since prioritizing them is a business scheduling
question, not an engineering one. Candidates, in the order they appear
in `OPEN-FINDINGS.md`:

- **F-02** (Check-in/Check-out workflow detail, holder data model)
- **F-03** (NBV/Risk KPI formulas — would unblock the Dashboard's remaining `BLOCKED (partial)` sub-item)
- **F-04** (Oracle FA integration mechanism — would unblock `RAISE-FR-ORACLE-001`'s `FAIL`)
- **F-05** (Alert trigger rules beyond warranty)
- **F-06** (NL Search citation format — would unblock `RAISE-AI-SEARCH-001`'s `FAIL`)
- **F-07** (Document Intelligence thresholds/fields — would unblock all 4 `RAISE-AI-DOC-*` rows)
- **F-08** (Auth mechanism / role-permission matrix content)
- **F-09** (Full asset master field list)

If the user has no immediate answer, reasonable non-decision-dependent
work includes:
- A `/code-review` pass across recent PRs (#63–#65) — none has had one yet.
- A live re-verification sweep against `BASELINE-CHECKPOINT-2026-08-24`
  (still the last full live `git`/source re-scan) to confirm
  `CURRENT-STATUS.md` hasn't drifted from reality after this session's
  volume of changes (PRs #58–#65).
- Re-visiting the Minor/Tech-Debt items (F-18 bundle size, F-19 raw
  error strings) if the user wants small, low-risk cleanup work.

## Why This Is Next

Every previously-identified "clearly next" item this session — the
Warranty threshold decision, its implementation, `TC-WARRANTY-001-06`'s
execution (which caught a real RBAC defect), and drafting the
Compliance Review — has been completed and shipped. `RAISE-COMPLIANCE-REVIEW.md`
now gives a single, honest, evidence-linked answer to "what's left,"
and it points to a business-decision backlog, not an engineering one.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction on which finding to resolve
next, or confirmation to proceed with non-decision-dependent work.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-09-01-008` (most recent, Compliance Review drafted).

## Related Git Branch/Commit

None pending — [PR #65](https://github.com/boonthepkstl-alt/stl_asset_service/pull/65) is merged, `main` is clean.

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a decision only the
user can make, or picking an arbitrary Blocking finding to work on
without the user's actual priority.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
