# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-28, immediately after `CHECKPOINT-2026-08-28-003` (TS-OPS-002/TS-MAINT-001 test-execution sweep).

---

## Current State

- **Current phase:** Phase 3 (Asset Management) fully passing across all its requirements; Phase 4 (ITSM/Maintenance) now formally tested for the first time — `RAISE-FR-MAINT-001` at `FAIL (partial)` (7/9), `RAISE-FR-OPS-002` at `PASS` (3/3).
- **Current feature:** None actively in progress. Last work: ran a third formal test-execution sweep (`TS-OPS-002`, `TS-MAINT-001`, 12 cases) per explicit user instruction ("รัน test-case execution sweep รอบใหม่"), matching the prior sweep's own recommendation.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-28-003`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-28-003` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 No code changed this checkpoint (test execution only). Prior verification state (139/139+ tests, typecheck/lint/build) is unaffected.
- **Open blockers:** None for F-28/F-29 — both non-PRD-blocked, directly buildable.
- **Open findings:** F-01 through F-29 in `OPEN-FINDINGS.md`. **F-28, F-29 are new** this checkpoint. F-22 and F-27 remain open scope questions from earlier sweeps.
- **Remaining work:** F-28 (Maintenance record list missing date/cost fields), F-29 (stage-progress indicator doesn't distinguish Current from Pending) — both directly buildable now.
- **Dependencies:** Neither F-28 nor F-29 depends on anything not already built.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-28: Maintenance record list missing date/cost fields | `FINDING` (new, not blocked) | `AC-MAINT-001-01` names these fields explicitly; likely the smaller fix — add 2 fields to an existing render, data (`createdAt`, ticket's cost) already exists on the `Ticket` type |
| F-29: Stage-progress indicator doesn't distinguish Current from Pending | `FINDING` (new, not blocked) | `GovernanceStep` (`TicketDetail/index.tsx`) needs a 3rd visual state; requires knowing which stage is "current" given the ticket's status — some derivation logic needed, not just a prop rename |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Still needs a business/design decision |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data; no real taxonomy confirmed anywhere in the chain |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — user was asked to confirm this once before and has not yet supplied the field list; the longest-standing uncompleted request in this session |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question — unaffected by today's TS-OPS-002 execution, which stayed within the Check-in/Check-out write path only |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD (Prototype §15, Design §5.1); AC-MAINT-001-04/-05 already account for this, not a new gap |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | TS-LOGIN, TS-DASH, TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AI-SEARCH-001, TS-AI-STATES still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: two new non-PRD-blocked findings
exist (F-28, F-29), both from today's sweep. **F-28** is picked next —
it's the more self-contained of the two (add date/cost display to an
existing per-record row; the underlying `Ticket` data already has both
fields, e.g. `createdAt` and the dispatch-time estimated cost). **F-29**
requires a bit more design judgment (deriving which stage is "current"
from the ticket's status, then adding a 3rd visual treatment to
`GovernanceStep`) — a reasonable follow-up right after F-28, not instead
of it.

---

## Primary Next Step

**Fix F-28 — add date and cost fields to the Maintenance record list on
Asset Detail, per `AC-MAINT-001-01`/`TC-MAINT-001-01`.**

## Why This Is Next

Smallest, most self-contained non-PRD-blocked finding from today's
sweep. `AC-MAINT-001-01` fully specifies the requirement ("date, event,
status, and cost"); status and event (title) already render, only date
and cost are missing — an additive display change, not a new data model.

## Dependencies

None beyond the already-built `Ticket` type and Asset Detail's
Maintenance & Tickets tab (`frontend/src/pages/AssetDetail/index.tsx`).
Inspect the `Ticket` type (`frontend/src/types/ticket.ts`) first to
confirm exactly which field holds "cost" (likely
`itAssignment`/dispatch-time estimated cost, set via
`ticketService.dispatchTicket`) — don't invent a new cost field if an
existing one already covers it, and if no cost value exists yet for a
ticket still in `PENDING_DEPT_APPROVAL`/`PENDING_IT_DISPATCH` (before
dispatch sets one), decide how to render that absence honestly (e.g.
"—", not a fabricated $0) rather than guessing.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read the
  `tab === 'maintenance'` block in `AssetDetail/index.tsx` (currently
  renders ticketCode/priority/status-badge/title per row) and the
  `Ticket` type before adding fields.
- Add a rendered "Created" date (from `t.createdAt`, already used
  elsewhere on this same page) and a "Cost" field (from wherever the
  `Ticket` type already tracks estimated/actual cost) to each row.
- If cost is genuinely absent for tickets not yet dispatched, render an
  honest placeholder rather than a fabricated value.

## Acceptance Criteria

`TC-MAINT-001-01` (already-confirmed text, no PRD question attached) —
maintenance records display date, event, status, and cost.

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: re-run `TC-MAINT-001-01` exactly as executed in
  `CHECKPOINT-2026-08-28-003` — open Asset Detail for an asset with
  ≥1 maintenance ticket and confirm date and cost now render per record.
- Update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-MAINT-001` row and
  mark F-28 Resolved in `OPEN-FINDINGS.md` once confirmed.

## Related Checkpoint

`CHECKPOINT-2026-08-28-003` (found F-28, F-29).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low risk — this is a display-only addition using data the `Ticket` type
likely already has. The only judgment call is how to render cost for
tickets that haven't reached dispatch yet (no cost set) — use an honest
placeholder, don't invent a value.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-28),
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-MAINT-001` row), this file.

## After Completion

Recalculate. F-29 (stage-progress Current/Pending distinction) is the
next reasonable pick — same domain, same file family (`TicketDetail/
index.tsx`). Re-run Steps 1-7 rather than assuming this holds, since F-01
(Warranty field list) remains a standing uncompleted request the user
may return to at any time.
