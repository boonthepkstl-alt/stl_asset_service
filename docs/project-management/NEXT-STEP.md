# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-009` (Open Finding F-02 resolved — Check-in/Check-out workflow shape, permission gate, and Custody holder data model, PRD §16 Q11–Q13, matching already-built behavior — R-19).

---

## Current State

- **Current phase:** Phase 3 — Asset Management (Custody & Asset Operations). `RAISE-FR-OPS-002` and `RAISE-FR-ASSET-003`'s remaining Open Question fields are now resolved; no code changed.
- **Current feature:** None actively in progress. Last work: resolved F-02's three sub-questions via `AskUserQuestion`, all three confirmed answers matching current implementation exactly, so the entire task was a documentation-chain sync (7 files) with no code change.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-009`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-009` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section; branch/commit/push/PR still pending).
- **Current status:** 🟡 Documentation changed, sanity-checked (153/153 tests still passing, unchanged), **not yet committed to git** — working tree is on `main`, uncommitted, awaiting branch creation and PR (predicted #67, per `gh pr list`).
- **Open blockers:** None from a shipping standpoint. 6 of 17 MVP requirements still carry a `BLOCKED`/`BLOCKED (partial)`/`FAIL` verdict in `RAISE-COMPLIANCE-REVIEW.md`, now gated by 7 remaining Blocking findings (F-03–F-09, F-02 now resolved) — none of these are engineering tasks.
- **Open findings:** F-03 through F-19, F-31, F-33 in `OPEN-FINDINGS.md` (F-02 resolved this checkpoint, R-19; F-22/F-27/F-30/F-32 Resolved R-13–R-16; Warranty threshold Resolved R-17; Settings access-gate defect Resolved R-18). F-10 (Custody History write-path exclusivity) and F-08 (general RBAC role/permission-matrix content) remain genuinely open, explicitly unaffected by F-02's resolution. F-31/F-33 remain explicitly deferred.
- **Remaining work:** Git branch/commit/push/PR for this checkpoint's documentation changes — not yet done.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** One correction mid-task — the Prototype sync's first pass (v0.11) incorrectly inferred an answer to a separate, unconfirmed question (F-10, Custody History write-path exclusivity) from the fact that no other code path currently exists. Caught immediately and corrected in the same session (v0.12), restoring F-10 to genuinely open. This is exactly the kind of unconfirmed-scope-expansion this project's discipline exists to prevent — worth remembering as a recurring risk when a subagent drafts alongside a "matches already-built behavior" resolution: it's easy to over-read "no other path exists in the code" as "no other path is allowed."

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Git branch/commit/push/PR for F-02's resolution | `SHIP_PENDING` | Docs synced across 7 files + `OPEN-FINDINGS.md`; sanity-checked (153/153); only git governance steps remain |
| `RAISE-FR-ORACLE-001` (Oracle FA Integration) — `FAIL` in Compliance Review | Blocked on business decision (F-04) + explicitly deferred build (F-31) | Won't be built until the integration mechanism itself is resolved |
| `RAISE-AI-SEARCH-001` (Natural Language Search) — `FAIL` in Compliance Review | Blocked on business decision (F-06) + explicitly deferred build (F-33) | Won't be built until a real AI backend integration lands |
| `RAISE-FR-AUDIT-001` field taxonomy / audit-review role gate — `BLOCKED (partial)` | Blocked on business decision (F-08, PRD §16 Q22) | Testable subset already PASS; this is the untestable remainder |
| `RAISE-FR-LIFE-001` (Asset Lifecycle Connectivity) — `BLOCKED` | Blocked on business decision | Lifecycle-stage detail beyond Disposal (already correctly Roadmap-excluded) undefined |
| `RAISE-AI-DOC-001..004` (Document Intelligence) — `BLOCKED (full)` ×4 | Blocked on business decision (F-07) | Confidence thresholds / field lists / matching rules — one item (duplicate-detection threshold) was explicitly asked once already and left unanswered |
| F-03: NBV/Risk KPI formulas | Blocked on business decision | PRD §16 Q3–Q4 — Dashboard's confirmed 8-tile/10-section scope is unaffected, already PASS |
| F-05: Alert trigger rules beyond warranty | Blocked on business decision | Alerts' confirmed warranty-only scope is unaffected, already PASS (partial) |
| F-08: Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — separate from OPS-002's now-resolved narrow gate |
| F-09: Full asset master field list | Blocked on business decision | PRD §16 Q1 |
| F-10: `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap (Custody History write-path exclusivity) | `FINDING` (scope question) | Unresolved, not blocking a build — explicitly confirmed still-open this checkpoint (a mid-session drafting overreach on this exact point was caught and corrected) |
| No real user/auth store (F-11/F-12) | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| Backend raw error strings in some `500` responses (F-19) | `TECHNICAL_DEBT` | Acceptable pre-production |
| Hosting / CI-CD / API versioning / DB migration tooling (F-13–F-16) | `TECHNICAL_DEBT` (infra) | Outside PRD scope |
| Header bell-icon dropdown still hardcoded empty | `TECHNICAL_DEBT` (minor) | Flagged in F-32's resolution as a separate, smaller-scope item |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: F-02 is resolved. The highest-priority
next action is completing the git governance steps (branch → commit →
push → PR) for this checkpoint, not starting new work. After that, what
remains is entirely business-decision-gated (F-03–F-09, 7 Blocking
findings) or explicitly deferred (F-31/F-33) or accepted technical debt.

---

## Primary Next Step

**Ship this checkpoint's work:** create a git branch, commit the 7
synced deliverable-chain documents + `OPEN-FINDINGS.md`/
`PROJECT-CHECKPOINTS.md`/`CURRENT-STATUS.md`/`PROJECT-TIMELINE.md`/
`DEVELOPMENT-LOG.md`, push, and open a PR (predicted #67). **Do not
merge until the user explicitly says "merge PR #N"** — per this
project's strict, unwavering governance rule.

After shipping, **check in with the user on which Blocking finding to
resolve next** — `RAISE-COMPLIANCE-REVIEW.md`'s §7 deliberately does not
recommend an order among the remaining 7, since prioritizing them is a
business scheduling question, not an engineering one. Candidates, in the
order they appear in `OPEN-FINDINGS.md`:

- **F-03** (NBV/Risk KPI formulas — would unblock the Dashboard's remaining `BLOCKED (partial)` sub-item)
- **F-04** (Oracle FA integration mechanism — would unblock `RAISE-FR-ORACLE-001`'s `FAIL`)
- **F-05** (Alert trigger rules beyond warranty)
- **F-06** (NL Search citation format — would unblock `RAISE-AI-SEARCH-001`'s `FAIL`)
- **F-07** (Document Intelligence thresholds/fields — would unblock all 4 `RAISE-AI-DOC-*` rows)
- **F-08** (Auth mechanism / role-permission matrix content)
- **F-09** (Full asset master field list)

Also worth surfacing to the user directly: **F-10** (Custody History
write-path exclusivity) is a small, narrowly-scoped scope question, not
a business-decision question in the same sense as F-03–F-09 — it may be
resolvable in one quick check-in rather than a longer discussion.

If the user has no immediate answer, reasonable non-decision-dependent
work includes:
- A `/code-review` pass across recent PRs (#63–#67) — none has had one yet.
- A live re-verification sweep against `BASELINE-CHECKPOINT-2026-08-24`
  (still the last full live `git`/source re-scan) to confirm
  `CURRENT-STATUS.md` hasn't drifted from reality after this session's
  volume of changes (PRs #58–#67).
- Re-visiting the Minor/Tech-Debt items (F-18 bundle size, F-19 raw
  error strings) if the user wants small, low-risk cleanup work.

## Why This Is Next

F-02 was one of the 8 original Blocking findings in the standing
backlog. Resolving it removed the last question tied to
`RAISE-FR-OPS-002`/`RAISE-FR-ASSET-003`, and matched already-built
behavior exactly, so it required no code change — just a
documentation-chain sync. The only thing standing between this work and
"done" is git shipping.

## Dependencies

None — this is a shipping task, not a decision.

## Expected Output

A merged PR (once the user instructs merging) containing 7
deliverable-chain documents and 5 `docs/project-management/` tracking
files.

## Acceptance Criteria

`AC-OPS-002-01`/`-02` PASS (already verified, reusing existing 2026-08-28 execution evidence).

## Validation Method

Already done: `npx vitest run` (153/153, unchanged — sanity check only, no code changed).

## Related Checkpoint

`CHECKPOINT-2026-09-01-009` (most recent, F-02 resolution).

## Related Git Branch/Commit

Not yet created — predicted branch name
`docs/resolve-f02-checkin-checkout`, predicted PR #67 (verify via
`gh pr list` before treating as final).

---

## Risks / Blockers

None. F-10 was correctly kept separate and open — verify this hasn't
drifted before treating F-02 as fully closed in any future summary.

## Files to Update (after implementation, per Step 10)

N/A — already done as part of this checkpoint (all 7 chain documents +
5 tracking files updated).

## After Completion

Recalculate once the PR is created (and again once merged, per
`SESSION-CLOSEOUT-PROTOCOL.md`).
