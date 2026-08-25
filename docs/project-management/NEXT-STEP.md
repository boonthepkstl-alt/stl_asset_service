# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-25, immediately after `CHECKPOINT-2026-08-25-003` (PR #33, Executive Dashboard KPI first cut).

---

## Current State

- **Current phase:** Phase 1 — Foundation (ongoing) running concurrently with Phase 3 — Asset Management, Phase 6 — Audit & Reconciliation (🟡 Audit Log first cut, Ticket-domain hook-in outstanding), and Phase 8 — Executive Dashboard & Reporting (🟡 plain-count KPIs shipped; NBV/Risk/Utilization mechanics not started, blocked on PRD).
- **Current feature:** None actively in progress. Last feature-level work: Executive Dashboard KPI first cut (`RAISE-FR-EXEC-001`), scoped to plain-count tiles only, built in PR #33.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-25-003`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-25-003` (Level 1, merged via [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33)).
- **Current status:** 🟢 Both codebases verified green (backend `go build`/`vet`/`test`; frontend `tsc`/`lint`/`vitest` 132/132/`build`) as of this checkpoint.
- **Open blockers (for the recommended next step specifically):** None for the Ticket-domain audit hook-in itself (it's additive instrumentation on an already-built domain, same shape as the Asset-domain hook-in already shipped in PR #31). The *other* remaining `RAISE-FR-EXEC-001` work (NBV/Risk/Utilization mechanics) is genuinely blocked on PRD §16 Q3/Q4/Q29 — not a scoping problem, a business-decision one.
- **Open findings:** F-01 through F-20 in `OPEN-FINDINGS.md`, unchanged this session.
- **Remaining work:** Ticket-domain audit hook-in (deferred in PR #31, still open); NBV/Risk/Utilization-mechanics KPIs (blocked, not actionable without a PRD answer).
- **Dependencies:** Ticket domain (`RAISE-FR-MAINT-001`) and `AuditService.Record` (both already built) — the hook-in is pure composition of two existing things, not a new domain.
- **Plan vs. actual variance:** None — this session executed exactly the item the prior `NEXT-STEP.md` recommended (Executive Dashboard KPI first cut), with no scope drift.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Ticket-domain audit hook-in | `ENHANCEMENT` (already-scoped extension, not blocked) | Deferred in PR #31 — see `CHECKPOINT-2026-08-25-002` Remaining Work. No PRD answer needed; same pattern already proven on the Asset domain |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | `FINDING`-adjacent (blocked on business decision) | PRD §16 Q3/Q4/Q29 — cannot be scoped down further without guessing a formula |
| `TC-OPS-001-01..03` / `TC-AUDIT-001-01/03` / `TC-EXEC-001-01/02` formal execution | `VALIDATION` | Test-case sign-off, not a code task |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Blocked — PRD §16 Q15 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Missing Level 1 checkpoints for PR #19-28 | `FINDING` (F-20) | Documentation debt, not a product feature |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed, not actionable now |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only — do not select |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: both items that were "needs a
scoped-down first cut" candidates (Audit Log, Executive Dashboard) are now
built to the extent possible without inventing TBD content. No fresh item
remains in that category. The next tier down is "already-scoped
extension of a shipped first cut" — exactly one candidate qualifies:
Ticket-domain audit hook-in. Unlike the NBV/Risk/Utilization-mechanics
remainder of Executive Dashboard (which needs a PRD answer before any
further code can be written without guessing), the Ticket-domain hook-in
needs no new decision at all — `AuditService.Record` and the Ticket
domain's mutation points (`CreateTicket`/`DecideApproval`/`Dispatch`/
`UpdateExecutionStatus`) both already exist; this is pure composition,
the same shape as connecting two already-built pipes.

---

## Primary Next Step

**Wire Ticket-domain mutations into the existing Audit Log
(`AuditService.Record`) — extend PR #31's Asset-domain coverage to
`CreateTicket`/`DecideApproval`/`Dispatch`/`UpdateExecutionStatus`, on
both the backend controller and the frontend mock ticket repository.**

## Why This Is Next

It is the only remaining item that is both genuinely actionable (no PRD
answer needed) and non-speculative (reuses two already-built pieces
verbatim). Every other open item is either a business-decision blocker
(NBV/Risk/Utilization formulas, Warranty field list, Check-in/out
workflow detail) or a documentation/test-execution task, not a code task.

## Dependencies

`RAISE-FR-MAINT-001` (Ticket/Maintenance domain) and `RAISE-FR-AUDIT-001`
(`AuditService.Record`, `recordMockAuditEntry`) — both already built and
stable; this is a consumer of both, not a new domain or a new pattern.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `go-template-main/controller/ticketController.go` and
  `go-template-main/controller/assetController.go`'s `recordAudit`
  helper (added in PR #31) before writing anything, to reuse the exact
  same best-effort-write pattern rather than inventing a second one.
- Backend: add a `recordAudit`-equivalent call (or promote the existing
  one to a shared helper if it can be reused verbatim) after each of
  `CreateTicket`/`DecideApproval`/`Dispatch`/`UpdateExecutionStatus`
  succeeds, with `entityType: "ticket"` and the ticket's code/id as
  `entityID`.
- Frontend: same hook-in on `MockTicketRepository`'s equivalent methods
  in `frontend/src/services/ticket-repository.ts`, calling
  `recordMockAuditEntry` exactly as `MockAssetRepository` already does
  (`frontend/src/services/asset-repository.ts`).
- Do **not** add a Ticket-specific "Audit" tab UI unless one is
  requested — `AC-AUDIT-001-03` only requires that entries be viewable
  somewhere; whether that's a new UI surface or an extension of an
  existing one is a scope question to raise, not assume.

## Acceptance Criteria

`AC-AUDIT-001-01` (already-confirmed text, re-used from PR #31 — see
`CHECKPOINT-2026-08-25-002`) — this task extends its coverage to a second
domain, it doesn't change what the AC requires.

## Validation Method

- Backend: `go build ./...`, `go vet ./...`, `gofmt -l`, `go test ./...`.
- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: perform a ticket mutation (e.g. approve a requisition),
  confirm a new audit entry appears (wherever it's surfaced) with
  `entityType: "ticket"`, correct actor/action/timestamp.

## Related Checkpoint

`CHECKPOINT-2026-08-25-002` (PR #31, the Asset-domain pattern this task
extends) and `CHECKPOINT-2026-08-25-003` (this recalculation's basis).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

None identified — this is composition of two already-shipped, already-
tested pieces. The only judgment call is where entries surface in the UI
(see Expected Output's note on not inventing a new tab without asking).

## Files to Update (after implementation, per Step 10)

`PROJECT-TIMELINE.md` (Phase 6 status), `PROJECT-CHECKPOINTS.md` (new
Level 1 checkpoint), `DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`,
`CHANGELOG.md`, this file (`NEXT-STEP.md`, recalculated per Step 11).

## After Completion

Recalculate from updated project state. Once the Ticket-domain hook-in
ships, every remaining "needs a scoped-down first cut" and
"already-scoped extension" item will be exhausted — re-run Steps 1-7 at
that point expecting the honest answer to be "everything left is blocked
on a PRD/business decision," and say so plainly rather than inventing a
new "buildable" category that doesn't exist.
