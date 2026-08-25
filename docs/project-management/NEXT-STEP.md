# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-25, immediately after `CHECKPOINT-2026-08-25-002` (PR #31, Audit Log first cut).

---

## Current State

- **Current phase:** Phase 1 — Foundation (ongoing) running concurrently with Phase 3 — Asset Management (🟡 core complete, extensions partial) and Phase 6 — Audit & Reconciliation (🟡 Audit Log first cut shipped; Oracle FA Integration not started).
- **Current feature:** None actively in progress. Last feature-level work: Audit Log first cut (`RAISE-FR-AUDIT-001`), scoped to Asset-domain mutations only, built in PR #31.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-25-002`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-25-002` (Level 1, merged via [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31)).
- **Current status:** 🟢 Both codebases verified green (backend `go build`/`vet`/`test`; frontend `tsc`/`lint`/`vitest` 131/131/`build`) as of this checkpoint.
- **Open blockers (for the recommended next step specifically):** Executive Dashboard's traceability row is also only *partially* unblocked (KPI formula sub-item TBD) — same honest framing as Audit Log had, not a clean `NOT_TESTED (no blockers)` pick.
- **Open findings:** F-01 through F-20 in `OPEN-FINDINGS.md`, unchanged this session (no new finding surfaced during the Audit Log work beyond what CHECKPOINT-2026-08-25-002 already documents inline).
- **Remaining work:** Ticket-domain audit hook-in (create/approve/dispatch/status update) was explicitly deferred in PR #31 — see that checkpoint's Remaining Work. Not blocking, but real leftover scope on the *same* feature, distinct from picking the *next* feature below.
- **Dependencies:** Asset Registry (`RAISE-FR-ASSET-001`), Dashboard's existing client-side KPI computation (`frontend/src/services/dashboard-service.ts`) — both already exist; Executive Dashboard's first cut would move that existing logic server-side, not invent new logic.
- **Plan vs. actual variance:** None — this session executed exactly the item the prior `NEXT-STEP.md` recommended (Audit Log), with no scope drift.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Ticket-domain audit hook-in | `ENHANCEMENT` (already-scoped extension) | Deferred in PR #31, not a fresh pick — see `CHECKPOINT-2026-08-25-002` Remaining Work |
| `TC-OPS-001-01..03` / `TC-AUDIT-001-01/03` formal execution | `VALIDATION` | Test-case sign-off, not a code task |
| Executive Dashboard backend move (`RAISE-FR-EXEC-001`) | `ENHANCEMENT` (partially blocked) | `TC-EXEC-001-01` partial (NBV/Risk KPI formulas/thresholds TBD, PRD §16 Q3/Q4); Utilization tile presence/description is testable now (PRD §16 Resolved Q27) but calculation mechanics remain partial (Resolved Q29); `TC-EXEC-001-02` partial (AI-generated-vs-static Executive Summary unresolved) |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Blocked — PRD §16 Q15 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Missing Level 1 checkpoints for PR #19-28 | `FINDING` (F-20) | Documentation debt, not a product feature |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed, not actionable now |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only — do not select |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: Audit Log was the other "needs a
scoped-down first cut" candidate alongside Executive Dashboard; it's now
done (narrow scope: Asset domain only). Executive Dashboard is the only
remaining item in that tier. Its blocked sub-item (KPI formulas) is closer
to the feature's core value than Audit Log's was — moving the *existing*
client-side math to a real backend endpoint doesn't require inventing the
still-TBD formulas, only relocating what's already computed and rendered
today (`dashboard-service.ts`), so a safe narrow cut is still drawable: a
first cut can expose the fields that are NOT formula-dependent (Total
Assets, Software Licenses count, Expired Warranty count — all plain
counts, not risk/NBV scoring) via a real endpoint, while leaving the
NBV/Risk-dependent tiles client-side/unchanged until PRD §16 Q3/Q4 land.

---

## Primary Next Step

**Scope a first-cut Executive Dashboard backend (`RAISE-FR-EXEC-001`) —
move the KPI tiles that are plain counts (not formula-dependent) from
client-side computation to a real backend endpoint, leaving NBV/Risk-
scored tiles as they are today until PRD §16 Q3/Q4 resolve.**

## Why This Is Next

It is the only remaining "needs a scoped-down first cut" item after Audit
Log. The domain data it needs (Asset, License) already exists and is
already being aggregated client-side in `dashboard-service.ts` — this is
a relocation of existing logic to a real endpoint for the plain-count
tiles, not new business logic, the same "additive, not invented" shape
that made Audit Log and QR/Barcode tractable first cuts.

## Dependencies

`RAISE-FR-ASSET-001` (Asset Registry), `RAISE-FR-LICENSE-001` (License —
Roadmap-confirmed but its seed/count data already exists in fixtures) —
both already built/seeded; this reuses existing data, not a new domain.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — read
  `frontend/src/services/dashboard-service.ts` and
  `frontend/src/pages/Dashboard/index.tsx` in full before assuming which
  KPI tiles are plain counts vs. formula-dependent; confirm exactly what
  `getDashboardStats()` currently computes and from which fixtures.
- Backend: a new read-only endpoint (e.g. `GET /dashboard/stats`) that
  computes only the confirmed-testable tiles (Total Assets, Software
  Licenses, Expired Warranty count, or whichever subset inspection
  confirms has no TBD formula behind it) from the Asset/License data
  already in Postgres.
- Frontend: wire `dashboard-service.ts` to call it behind a new
  `DASHBOARD_API_ENABLED`-style flag (matching `ASSET_API_ENABLED`'s
  convention), same fallback-to-mock pattern as every other domain.
- Do **not** attempt to move NBV/Risk-scored tiles server-side — their
  formulas are still PRD §16 Q3/Q4 TBD; leave those exactly as they render
  today.

## Acceptance Criteria

`AC-EXEC-001`, per `RAISE-ACCEPTANCE-CRITERIA.md` — confirm the exact text
before starting (this document doesn't re-quote it verbatim); per the
traceability matrix, only the non-formula-dependent parts are currently
testable — do not invent stricter criteria than what's confirmed.

## Validation Method

- Backend: `go build ./...`, `go vet ./...`, `gofmt -l`, `go test ./...`.
- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: Dashboard's plain-count KPI tiles render the same
  numbers as today, now sourced from the real endpoint instead of
  client-side computation (verify via network tab / by changing seed data
  and confirming the tile updates).

## Related Checkpoint

`CHECKPOINT-2026-08-25-002` (this recalculation's basis) and
`CURRENT-STATUS.md` §4 (same recommendation, "needs a scoped-down first
cut" category, now the sole remaining item there).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

The line between "plain count" and "formula-dependent" must be drawn from
actually reading `dashboard-service.ts`, not assumed from tile names —
some KPI that looks like a simple count today may already embed
undocumented logic. If inspection reveals ambiguity about which tiles are
safe to move, treat that as a reason to narrow the cut further, not to
guess.

## Files to Update (after implementation, per Step 10)

`PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint),
`DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`, `CHANGELOG.md`, this file
(`NEXT-STEP.md`, recalculated per Step 11).

## After Completion

Recalculate from updated project state rather than assuming the next pick
is automatically "whatever's left in the Checkpoint Backlog" — after
Executive Dashboard's first cut, `CURRENT-STATUS.md` §4's "needs a
scoped-down first cut" tier will be empty, so re-run Steps 1-7 against
the traceability matrix's state *at that time* to see whether a PRD
answer has landed that reclassifies a currently-"Blocked on a business
decision" item (Warranty, Alerts, Oracle, NL Search, Document
Intelligence, User/Role Management) into something buildable.
