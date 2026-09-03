# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-03, immediately after `CHECKPOINT-2026-09-03-002`
(PR #76 — IT Hardware Assignment Approval Workflow's 3 handover nav items
consolidated into one "Asset Handovers" page). This recalculation was
overdue — the previous copy of this file dated 2026-09-01, before PRs
#67–#76 (10 merged PRs) shipped.

---

## Current State

- **Current phase:** Phase 3 — Asset Management. The IT Hardware
  Assignment Approval Workflow (`RAISE-FR-OPS-002` category-scoped
  exception, PRD §16 Resolved Question 43) is now **complete for its
  confirmed MVP scope**: backend (PR #72), frontend UI (PR #74),
  deliverable-chain sync (PR #75), and nav consolidation (PR #76) all
  shipped and live-verified. A docs-only close-out for PR #72 itself
  (PR #73) and this current close-out pass for PR #73–#76 (adding the
  `DEVELOPMENT-LOG.md` rows/checkpoints those PRs were missing) round out
  the set.
- **Current feature:** None actively in progress. Last work: this
  session's close-out pass itself (adding 4 missing Task Checkpoints,
  4 `DEVELOPMENT-LOG.md` rows, 2 `CHANGELOG.md` entries, and syncing
  `CURRENT-STATUS.md`/`PROJECT-TIMELINE.md`/this file).
- **Current task:** None in progress. Last task checkpoint:
  `CHECKPOINT-2026-09-03-002` (PR #76).
- **Last completed checkpoint:** `CHECKPOINT-2026-09-03-002`, plus the
  3 retroactively-recorded checkpoints from this same close-out pass
  (`CHECKPOINT-2026-09-02-005` for PR #73, `CHECKPOINT-2026-09-02-006`
  for PR #74, `CHECKPOINT-2026-09-03-001` for PR #75).
- **Current status:** ✅ All engineering work for this feature is shipped,
  merged, and re-verified this session (`npx tsc --noEmit` clean,
  `npm run lint` clean, `npm run test -- --run` 45 files/205 tests
  passing). Working tree is clean (only an unrelated `.claude/scheduled_tasks.lock`
  modification present, not part of this feature).
- **Open blockers:** None from a shipping standpoint for this feature.
  Project-wide, 6 of 17 MVP requirements still carry a `BLOCKED`/
  `BLOCKED (partial)`/`FAIL` verdict in `RAISE-COMPLIANCE-REVIEW.md`
  (stale — predates this feature's completion, itself due for a refresh),
  gated by Blocking findings F-03–F-09, F-35 — none of these are
  engineering tasks.
- **Open findings:** F-03 through F-09, F-35 (Blocking — all business
  decisions); F-10 (Custody History write-path exclusivity, unresolved
  scope question, adjacent to but not resolved by this feature); F-31/F-33
  (explicitly deferred); F-11/F-12 (accepted Roadmap limitations); F-13–F-19
  (infrastructure/tech-debt, open). Nothing new was opened by PR #73–#76 —
  these were docs-sync/frontend/IA work, not test executions.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None this pass — PR #73–#76 matched
  `CHECKPOINT-2026-09-02-004`'s own predicted next step exactly ("Frontend
  UI work is the next substantive follow-up task"), plus one user-initiated
  IA refactor (PR #76) that wasn't predicted but was a direct, immediate
  response to reviewing the shipped UI — not scope creep, a UX fix on
  work just delivered.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| `RAISE-FR-ORACLE-001` (Oracle FA Integration) — `FAIL` in Compliance Review | Blocked on business decision (F-04) + explicitly deferred build (F-31) | Won't be built until the integration mechanism itself is resolved |
| `RAISE-AI-SEARCH-001` (Natural Language Search) — `FAIL` in Compliance Review | Blocked on business decision (F-06) + explicitly deferred build (F-33) | Won't be built until a real AI backend integration lands |
| `RAISE-FR-AUDIT-001` field taxonomy / audit-review role gate — `BLOCKED (partial)` | Blocked on business decision (F-08, PRD §16 Q22) | Testable subset already PASS; this is the untestable remainder |
| `RAISE-FR-LIFE-001` (Asset Lifecycle Connectivity) — `BLOCKED` | Blocked on business decision | Lifecycle-stage detail beyond Disposal (already correctly Roadmap-excluded) undefined |
| `RAISE-AI-DOC-001..004` (Document Intelligence) — `BLOCKED (full)` ×4 | Blocked on business decision (F-07) | Confidence thresholds / field lists / matching rules — one item (duplicate-detection threshold) was explicitly asked once already and left unanswered |
| F-03: NBV/Risk KPI formulas | Blocked on business decision | PRD §16 Q3–Q4 — Dashboard's confirmed 8-tile/10-section scope is unaffected, already PASS |
| F-05: Alert trigger rules beyond warranty | Blocked on business decision | Alerts' confirmed warranty-only scope is unaffected, already PASS (partial) |
| F-08: Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — separate from OPS-002's now-resolved narrow gate |
| F-09: Full asset master field list | Blocked on business decision | PRD §16 Q1 |
| F-35: Asset code generation scheme (`AST-####` vs. the real company convention) | Blocked on business decision | Partially confirmed 2026-09-02 (running-number scheme); still blocked on the type-code and department-code tables — user explicitly declined to guess, waiting on the company's IT department |
| F-10: `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap (Custody History write-path exclusivity) | `FINDING` (scope question) | Unresolved, not blocking a build — explicitly unaffected by this session's PR #73–#76 work |
| No real user/auth store (F-11/F-12) | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| Backend raw error strings in some `500` responses (F-19) | `TECHNICAL_DEBT` | Acceptable pre-production |
| Hosting / CI-CD / API versioning / DB migration tooling (F-13–F-16) | `TECHNICAL_DEBT` (infra) | Outside PRD scope |
| `RAISE-COMPLIANCE-REVIEW.md` v1.0 (2026-09-01) | `STALE_DOC` | Predates F-02's resolution and this feature's full-stack completion — its per-requirement verdict table has not been refreshed since; not urgent (no verdict it currently states is wrong, just incomplete) |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: there is no further engineering work
on the IT Hardware Assignment Approval Workflow that's unblocked without a
business decision. Backend RBAC enforcement is **explicitly not to be
done** — it's an existing, confirmed, project-wide MVP decision (UI-only/
client-side), not an oversight to fix. What remains is entirely
business-decision-gated (F-03–F-09, F-35 — 8 Blocking findings, one more
than the 7 in this file's prior 2026-09-01 run, since F-35 was raised
2026-09-02 during this feature's backend work) or the smaller, more
tractable F-10 scope question, or accepted technical debt.

---

## Primary Next Step

**No further engineering work is buildable-now without a business
decision.** The next concrete step is a **business check-in with the
user** on which finding to resolve next — `RAISE-COMPLIANCE-REVIEW.md`
deliberately does not recommend an order among F-03–F-09 (a scheduling
question, not an engineering one), and F-35's specific blocker (asset
code type-code/department-code tables) has an explicit, named external
dependency (the company's IT department) rather than an open-ended
question. Candidates, in the order they appear in `OPEN-FINDINGS.md`:

- **F-03** (NBV/Risk KPI formulas — would unblock the Dashboard's remaining `BLOCKED (partial)` sub-item)
- **F-04** (Oracle FA integration mechanism — would unblock `RAISE-FR-ORACLE-001`'s `FAIL`)
- **F-05** (Alert trigger rules beyond warranty)
- **F-06** (NL Search citation format — would unblock `RAISE-AI-SEARCH-001`'s `FAIL`)
- **F-07** (Document Intelligence thresholds/fields — would unblock all 4 `RAISE-AI-DOC-*` rows)
- **F-08** (Auth mechanism / role-permission matrix content)
- **F-09** (Full asset master field list)
- **F-35** (Asset code generation type-code/department-code tables — blocked specifically on the company's IT department supplying the real lists, not an open-ended design question)

Also worth surfacing to the user directly: **F-10** (Custody History
write-path exclusivity) remains a small, narrowly-scoped scope question,
not a business-decision question in the same sense as F-03–F-09/F-35 — it
may be resolvable in one quick check-in rather than a longer discussion,
same as it was when this file last ran (2026-09-01); it was explicitly
confirmed still-untouched by every PR since (#68–#76).

If the user has no immediate answer, reasonable non-decision-dependent
work includes:
- A `/code-review` pass across recent PRs (#71–#76) — none has had one yet
  (the reviews on #72/#74 were self-initiated within those same PRs, not
  a separate follow-up pass).
- Refreshing `RAISE-COMPLIANCE-REVIEW.md` (v1.0, 2026-09-01) — it predates
  F-02's resolution and this feature's full-stack completion; no verdict
  it currently states is wrong, but its per-requirement table doesn't yet
  reflect `RAISE-FR-OPS-002`'s current 9/9 full-stack `PASS`.
- A live re-verification sweep against `BASELINE-CHECKPOINT-2026-08-24`
  (still the last full live `git`/source re-scan, now 10 days and ~20
  merged PRs stale) to confirm `CURRENT-STATUS.md` hasn't drifted from
  reality.
- Re-visiting the Minor/Tech-Debt items (F-18 bundle size, F-19 raw
  error strings) if the user wants small, low-risk cleanup work.

## Why This Is Next

The IT Hardware Assignment Approval Workflow was the last "buildable now"
engineering item in the standing backlog (per `CHECKPOINT-2026-09-02-004`'s
own prediction, confirmed correct by this session's PR #74/#75/#76). With
it complete end-to-end and the close-out gap for PR #73/#75 fixed, nothing
remains that doesn't require either a business decision or an external
input (F-35's code tables). Continuing to write code without one of those
would mean guessing at content this project's own discipline explicitly
forbids (see `CLAUDE.md`'s "ห้ามเขียนรายละเอียดที่ไม่มีอยู่ในเอกสารขั้นตอนก่อนหน้า" rule).

## Dependencies

F-35 depends on the company's IT department supplying the real type-code/
department-code tables — an external dependency, not an internal one.
Every other Blocking finding (F-03–F-09) depends only on a business
decision from the user.

## Expected Output

Not a code change. Either: (a) the user names which finding to resolve
next, producing a scoped `/update-prd` → chain-sync task; or (b) the user
asks for one of the non-decision-dependent items above (code review,
Compliance Review refresh, baseline re-scan, tech-debt cleanup).

## Acceptance Criteria

N/A for this recalculation itself — it is a planning step, not an
implementation task. `AC-OPS-002-04`..`-09` are already fully PASS
(re-confirmed this session, see `CHECKPOINT-2026-09-03-002`'s Validation).

## Validation Method

Already done this session: `npx tsc --noEmit` (clean), `npm run lint`
(clean, 0 warnings), `npm run test -- --run` (45 files / 205 tests
passing) — see `CHECKPOINT-2026-09-03-002`.

## Related Checkpoint

`CHECKPOINT-2026-09-03-002` (most recent — PR #76, nav consolidation).

## Related Git Branch/Commit

`main` at `bf5b88d` (merge commit for PR #76) as of this recalculation.
No new branch created by this recalculation itself (documentation-only).

---

## Risks / Blockers

None new. F-10 remains correctly separate and open — this recalculation
re-confirms it was untouched by PR #73–#76, same as every PR since it was
last checked (2026-09-01).

## Files to Update (after implementation, per Step 10)

N/A for this recalculation — the files this close-out pass needed to
update (`PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md`, `CHANGELOG.md`,
`CURRENT-STATUS.md`, `PROJECT-TIMELINE.md`, this file) were all updated
as part of the same pass, not deferred.

## After Completion

Recalculate again once the user names a Blocking finding to resolve, or
once any other checkpoint lands — per `SESSION-CLOSEOUT-PROTOCOL.md`/
`NEXT-STEP-PROTOCOL.md`'s close-out-then-recalculate loop. Given this file
went 10 days and 10 PRs stale last cycle, consider recalculating at the
end of every session that merges a PR, not only when a feature completes.
