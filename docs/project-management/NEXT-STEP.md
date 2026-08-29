# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-003` (Warranty Asset Registry column implementation).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. `RAISE-FR-WARRANTY-001` now `PASS (partial)` (`TC-WARRANTY-001-01/-02` pass; `-03` separately blocked) — implemented as a live Asset Registry column, not just resolved on paper.
- **Current feature:** None actively in progress. Last work: implemented F-01's resolved Warranty field as a column on the Assets Registry list, per explicit user direction declining a standalone P-010 screen.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-003`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-003` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (144/144), `npm run build` all pass; browser-verified live on `/assets` (Warranty column shows correct Active/Expired state and date for every visible asset; sorts correctly by expiry date).
- **Open blockers:** None directly buildable — remaining open items (F-22, F-27, F-30, `AC-WARRANTY-001-03`) all need a business/design decision or aren't product defects.
- **Open findings:** F-02 through F-30 in `OPEN-FINDINGS.md` (F-01 Resolved as R-12, now also implemented). F-22, F-27, F-30 remain open scope/infra questions.
- **Remaining work:** No direct-fix findings remain from any of the four test-execution sweeps, nor from F-01's resolution+implementation.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** The prior `NEXT-STEP.md` proposed a first-cut Warranty *screen* (P-010) as the likely next step; the user redirected to "no screen, add to the relevant asset page" — implemented accordingly. Variance was resolved by asking/following the user's direction, not by guessing.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Needs a business/design decision |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 — PRD §6.7's "90 days" is illustrative, not a confirmed generalizable rule; gates the "Expiring" 3rd Warranty Timeline state |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-DASH`, `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with F-01 now both resolved and
implemented, no direct-fix, non-blocked engineering item remains. The
same two options from the prior cycle apply again: (1) a new
test-execution sweep on `TS-DASH` (likely re-confirms F-22's already-
known gap) or the remaining fully-TBD suites (`TS-ORACLE-001`,
`TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` — low marginal
signal), or (2) wait for a business/design decision on F-22, F-27, F-30,
or `AC-WARRANTY-001-03`. None of these is as clearly valuable as F-01
was, so the honest recommendation is to check in with the user on
direction rather than defaulting to a low-signal sweep.

---

## Primary Next Step

**Check in with the user on direction** — no single next task is
clearly higher-value than the others right now. Offer: (a) a test-
execution sweep on `TS-DASH` for completeness (expected to mostly
re-confirm F-22), (b) surfacing F-22/F-27/F-30/`AC-WARRANTY-001-03` for
a business/design decision, or (c) whatever the user actually wants to
work on next.

## Why This Is Next

Every previously-identified "clearly next" item (four test-execution
sweeps, then F-01) has now been completed. The remaining backlog is
uniformly blocked on decisions this session cannot make unilaterally,
or is low-marginal-value validation work — this is a genuine decision
point for the user, not a default action to take autonomously.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-08-29-003` (most recent, F-01 fully closed out).

## Related Git Branch/Commit

None — not started.

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a low-value sweep
or a decision only the user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
