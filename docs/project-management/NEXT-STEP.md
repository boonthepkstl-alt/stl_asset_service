# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-28, immediately after `CHECKPOINT-2026-08-28-004` (F-28 fix).

---

## Current State

- **Current phase:** Phase 4 — ITSM. `RAISE-FR-MAINT-001` now `FAIL (partial)` at 8/9 (up from 7/9). `RAISE-FR-OPS-002` `PASS` (3/3, unaffected).
- **Current feature:** None actively in progress. Last work: fixed F-28 (Maintenance record list missing date/cost fields) per explicit user instruction ("Start on F-28").
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-28-004`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-28-004` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (142/142), `npm run build` all pass; browser-verified live on asset `a1` (`REQ-2026-0042` shows "2026-08-15 09:30 AM · Cost: $120"; `REQ-2026-0044`, not yet dispatched, shows "Cost: —").
- **Open blockers:** None for F-29 — non-PRD-blocked, directly buildable.
- **Open findings:** F-01 through F-29 in `OPEN-FINDINGS.md`. **F-28 is now Resolved (R-10)**. F-29 is the only open finding from the 2026-08-28 sweep. F-22 and F-27 remain open scope questions from earlier sweeps.
- **Remaining work:** F-29 (stage-progress indicator doesn't distinguish Current from Pending).
- **Dependencies:** None — `GovernanceStep`/`TicketDetail/index.tsx` are already built.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-29: Stage-progress indicator doesn't distinguish Current from Pending | `FINDING` (not blocked) | `GovernanceStep` (`TicketDetail/index.tsx`) needs a 3rd visual state; requires deriving which stage is "current" from the ticket's status (e.g. `PENDING_IT_DISPATCH` → stage 3 is current, stage 4 is pending) — some small derivation logic needed, not just a prop rename |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Still needs a business/design decision |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — the longest-standing uncompleted request in this session |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | TS-LOGIN, TS-DASH, TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AI-SEARCH-001, TS-AI-STATES still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with F-28 resolved, **F-29** is the
only remaining non-PRD-blocked finding from the 2026-08-28 sweep. It's
slightly more involved than F-28 (needs to derive "which stage is
current" from `ticket.status`, then add a 3rd visual treatment to
`GovernanceStep`), but still self-contained to one component and one
file. No other buildable item competes with it right now — F-22/F-27
are scope questions, F-01 is a standing business-decision request.

---

## Primary Next Step

**Fix F-29 — make the 4-stage progress indicator distinguish Current
from Pending, per `AC-MAINT-001-09`/`TC-MAINT-001-09`.**

## Why This Is Next

Last remaining non-PRD-blocked finding from the 2026-08-28 sweep.
`AC-MAINT-001-09` explicitly requires 3 states (Done/Current/Pending);
`GovernanceStep` currently only renders 2 (done ✓ vs. a plain gray
circle for everything else), verified to render stage 3 (current) and
stage 4 (pending) identically at `PENDING_IT_DISPATCH`.

## Dependencies

None beyond `frontend/src/pages/TicketDetail/index.tsx`'s existing
`GovernanceStep` component and the ticket's `status` field, which
already fully determines which stage is current.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `GovernanceStep` and the 4 call sites in `TicketDetail/index.tsx`
  (`done={...}` computed per-stage from `ticket.status`/related fields)
  before changing the component's prop shape.
- Derive which single stage is "current" from `ticket.status` (e.g.
  `PENDING_DEPT_APPROVAL` → stage 2 current; `PENDING_IT_DISPATCH` →
  stage 3 current; `PLANNING`/`IN_PROGRESS`/`ON_HOLD` → stage 4 current;
  `DONE` → no stage current, all done). Stage 1 (User Requisition) is
  always done once a ticket exists.
- Add a 3rd visual state to `GovernanceStep` (e.g. a distinct
  color/ring/badge for "current" vs. the existing done/pending look) —
  reuse the app's existing badge/color conventions rather than inventing
  new ones.
- Do not change the underlying stage-transition logic — this is a
  display-only fix, same as F-28.

## Acceptance Criteria

`TC-MAINT-001-09` (already-confirmed text, no PRD question attached) —
the 4-stage indicator shows Done/Current/Pending consistent with the
ticket's actual current state, for a ticket at any stage.

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: re-run `TC-MAINT-001-09` across multiple stages (at
  least `PENDING_DEPT_APPROVAL`, `PENDING_IT_DISPATCH`, one of
  `PLANNING`/`IN_PROGRESS`/`ON_HOLD`, and `DONE`) and confirm the
  current stage is visually distinct from both done and pending stages
  at each point.
- Update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-MAINT-001` row (should
  reach full `PASS`, 9/9) and mark F-29 Resolved in `OPEN-FINDINGS.md`.

## Related Checkpoint

`CHECKPOINT-2026-08-28-003` (found F-29), `CHECKPOINT-2026-08-28-004`
(F-28, the same-sweep fix this task follows).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low-to-medium risk. The only judgment call is exactly how to visually
distinguish "current" — pick something consistent with the app's
existing badge/color language (e.g. how `getStatusBadge` already colors
different stages) rather than inventing a new visual system.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-29),
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-MAINT-001` row), this file.

## After Completion

Recalculate. With F-29 resolved, both 2026-08-28 sweep findings close
and the only remaining Asset/Maintenance-domain items are the two
scope questions (F-22, F-27) and F-01 (Warranty field list). Likely next
candidates: a new test-execution sweep on a not-yet-tested suite, or
surfacing F-01 again. Re-run Steps 1-7 rather than assuming.
