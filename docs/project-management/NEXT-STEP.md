# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-25, immediately after `CHECKPOINT-2026-08-25-001` (PR #29, QR/Barcode).

---

## Current State

- **Current phase:** Phase 1 — Foundation (ongoing) running concurrently with Phase 3 — Asset Management (🟡 core complete, extensions partial — QR/Barcode, part of this phase's scope, is now ✅ Built).
- **Current feature:** None actively in progress. Last feature-level work: QR/Barcode Identification (`RAISE-FR-OPS-001`), built end-to-end in PR #29.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-25-001`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-25-001` (Level 1, merged via [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29)).
- **Current status:** 🟢 Both codebases verified green (backend `go build`/`vet`/`test`; frontend `tsc`/`lint`/`vitest` 128/128/`build`) as of this checkpoint.
- **Open blockers (for the recommended next step specifically):** Both remaining "buildable" candidates (Audit Log, Executive Dashboard) are only *partially* unblocked — see Priority Application below. Unlike QR/Barcode, neither is a clean `NOT_TESTED (no blockers)` pick.
- **Open findings:** F-01 through F-20 in `OPEN-FINDINGS.md`. F-20 is new this session (missing Level 1 checkpoints for PRs #19-28 — not blocking, but should be closed eventually).
- **Remaining work:** None outstanding from the QR/Barcode task itself. Formal `TC-OPS-001-01..03` execution is still open (see `CHECKPOINT-2026-08-25-001` Known Issues) but is a test-authoring/execution task, not a code task.
- **Dependencies:** Asset Registry domain (`RAISE-FR-ASSET-001`) — already built; both new candidates below build on it directly.
- **Plan vs. actual variance:** None — this session executed exactly the item the prior `NEXT-STEP.md` recommended (QR/Barcode), with no scope drift.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| `TC-OPS-001-01..03` formal execution | `VALIDATION` | Test-case sign-off, not a code task — see F-20-adjacent note in `CHECKPOINT-2026-08-25-001` |
| Audit Log scoped cut (`RAISE-FR-AUDIT-001`) | `ENHANCEMENT` (partially blocked) | `TC-AUDIT-001-01` partial (field taxonomy TBD), `TC-AUDIT-001-03` partial (role gate TBD) — but logging mutations that already happen needs no invented taxonomy |
| Executive Dashboard backend move (`RAISE-FR-EXEC-001`) | `ENHANCEMENT` (partially blocked) | `TC-EXEC-001-01` partial (NBV/Risk KPI formulas TBD); Utilization tile presence/description is testable now (PRD §16 Resolved Q27) but calculation mechanics remain partial (Resolved Q29) |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Blocked — PRD §16 Q15 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Missing Level 1 checkpoints for PR #19-28 | `FINDING` (F-20) | Documentation debt, not a product feature |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed, not actionable now |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only — do not select |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: QR/Barcode was the last item cleanly
listed `NOT_TESTED (no blockers)` — that category is now empty. The next
tier is "needs a scoped-down first cut": both Audit Log and Executive
Dashboard have a **real AC** but a **partially blocked** test case (one
sub-item TBD, others testable now). Per Rule 14, this must be stated
honestly rather than reframed as unblocked. Between the two, Audit Log is
selected as primary because its blocked sub-item (field taxonomy) affects
only *which* fields get logged, not *whether* logging can start — a
first-cut implementation can log the mutations that already happen
(create/assign/check-in/status-change) without inventing the still-open
taxonomy, the same "narrow, no invented workflow" shape used for
Check-in/Check-out and Maintenance previously. Executive Dashboard's
blocked sub-item (KPI formulas) more directly affects the number the
feature exists to show, making a safe narrow cut harder to draw cleanly.

---

## Primary Next Step

**Scope a first-cut Immutable Audit Log (`RAISE-FR-AUDIT-001`) — log
mutations that already occur (asset create/assign/check-in/status-change,
ticket create/approve/dispatch/complete) without inventing the still-TBD
full field taxonomy or role-gate content.**

## Why This Is Next

It is the best-positioned "needs a scoped-down first cut" item: the
domains it would log (Asset, Ticket) already exist and already perform
these mutations, so a first cut is additive instrumentation, not new
business logic requiring invented rules. Executive Dashboard's TBD item
(KPI formulas) is closer to the feature's core value and riskier to cut
narrowly without approximating an unconfirmed number.

## Dependencies

`RAISE-FR-ASSET-001` (Asset Registry), `RAISE-FR-ASSET-003`/`RAISE-FR-OPS-002`
(Assign/Check-in), `RAISE-FR-MAINT-001` (Maintenance/Ticket) — all already
built and stable; this is a consumer of their existing mutation points, not
a new domain.

## Expected Output

- Backend: an append-only audit log table/model recording, at minimum,
  actor, action, entity type/id, and timestamp for the mutations that
  already exist today (do **not** invent the full field taxonomy from
  Design §15 — that's the TBD half of `TC-AUDIT-001-01`).
- Frontend: a read-only Audit view (the existing "Audit" tab stub on
  Asset Detail, and/or a dedicated Audit page if one already exists as a
  placeholder — **inspect existing implementation first**, per Step 8.1,
  before assuming what's already there).
- Explicitly leave the role-gate question (`TC-AUDIT-001-03`, PRD §16 Q22)
  as `TBD`/visible-to-all-authenticated-users-for-now rather than
  inventing a permission model.

## Acceptance Criteria

`AC-AUDIT-001`, per `RAISE-ACCEPTANCE-CRITERIA.md` — do not invent stricter
criteria than what's written there; confirm the exact AC text before
starting, since this document did not re-quote it verbatim.

## Validation Method

- Backend: `go build ./...`, `go vet ./...`, `gofmt -l`, `go test ./...`.
- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: perform a mutation (e.g. assign an asset), confirm it
  appears in the audit view with correct actor/action/timestamp.

## Related Checkpoint

`CHECKPOINT-2026-08-25-001` (this recalculation's basis) and
`CURRENT-STATUS.md` §4 (same recommendation, "needs a scoped-down first
cut" category).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Two TBDs are explicitly out of scope for a first cut, not silently
resolved: (1) full field taxonomy (Design §15) — log a minimal field set
now, extend later once PRD §16 answers land; (2) role-gate content (PRD
§16 Q22) — leave visible to all authenticated users for now rather than
guessing a permission matrix.

## Files to Update (after implementation, per Step 10)

`PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint),
`DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`, `CHANGELOG.md`, this file
(`NEXT-STEP.md`, recalculated per Step 11).

## After Completion

Recalculate from updated project state — do not assume the next pick
after this one is Executive Dashboard just because it's the other
candidate listed here; re-run Steps 1-7 against the traceability matrix's
state *at that time*, since answering PRD open questions between now and
then could change the priority order (e.g. if PRD §16 Q3/Q4 gets answered
first, Executive Dashboard could become the cleaner unblocked pick).
