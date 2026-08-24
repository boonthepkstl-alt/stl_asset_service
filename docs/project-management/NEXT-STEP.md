# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-24, immediately after `BASELINE-CHECKPOINT-2026-08-24`.

---

## Current State

- **Current phase:** Phase 1 — Foundation (ongoing, `PHASE-CHECKPOINT-1` = 🔴 NOT PASSED, by design — see `PROJECT-CHECKPOINTS.md`) running concurrently with Phase 3 — Asset Management (🟡 core complete, extensions partial).
- **Current feature:** None actively in progress. Last feature-level work: `FEATURE-CHECKPOINT-project-tracking-governance` (🚧 In Progress — PR #21, the Baseline Checkpoint itself, is open awaiting merge).
- **Current task:** None in progress. Last task checkpoint: `BASELINE-CHECKPOINT-2026-08-24`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-24-009` (Level 1, merged via PR #18) → `BASELINE-CHECKPOINT-2026-08-24` (open, PR #21, not yet merged — per Rule 14, treat as `VALIDATING`, not `COMPLETED`, until merged).
- **Current status:** 🟢 Both codebases verified green (backend `go build`/`vet`/`test`; frontend `tsc`/`lint`/`vitest`/`build`) as of the baseline scan. No source drift.
- **Open blockers (for the recommended next step specifically):** None.
- **Open findings:** F-01 through F-19 in `OPEN-FINDINGS.md`, all still open, none newly discovered.
- **Remaining work:** Merge PR #21 (administrative, not a development task); pick the next feature-level task (this document).
- **Dependencies:** Asset Registry domain (`RAISE-FR-ASSET-001`) — already built (PR #7).
- **Plan vs. actual variance:** This session's actual work was governance/tooling (checkpoints, timeline, protocols) rather than a new feature domain — explicitly user-directed, not drift.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Merge PR #21 | `VALIDATION` | Administrative, not a dev task |
| QR / Barcode (`RAISE-FR-OPS-001`) | `REQUIRED` | P0/MVP, confirmed, **no blocker** |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Blocked — PRD §16 Q15 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Audit Log scoped cut (`RAISE-FR-AUDIT-001`) | `ENHANCEMENT` | Buildable narrow, but not P0-unblocked like OPS-001 |
| Executive Dashboard backend move (`RAISE-FR-EXEC-001`) | `ENHANCEMENT` | Buildable narrow |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed, not actionable now |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only — do not select |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: no `BLOCKER` or unmet `Critical/P0` item exists **except** QR/Barcode, which is itself the highest-priority `REQUIRED` item with zero dependency gaps. Everything else in the table above is either a `FINDING` genuinely blocked on a PRD answer (can't be started without inventing an answer), `TECHNICAL_DEBT` correctly deferred, or explicitly out of scope. This makes the selection in Step 6 unambiguous rather than close.

---

## Primary Next Step

**Implement QR / Barcode Identification (`RAISE-FR-OPS-001`) — backend + frontend, both sides.**

## Why This Is Next

It is the *only* MVP requirement the traceability matrix lists as
`NOT_TESTED (no blockers)` — every other open MVP item is genuinely
blocked on an unanswered PRD question (Warranty, Check-in/out detail,
Oracle, Alerts, AI capabilities) or is Roadmap-only. Its sole dependency
(`RAISE-FR-ASSET-001`) is already built and stable. This is the same
reasoning already used to select Check-in/Check-out and Maintenance as
prior checkpoints — pick the unblocked P0 item, not the interesting one.

## Dependencies

`RAISE-FR-ASSET-001` (Asset Registry) — **satisfied**, built in PR #7.

## Expected Output

- Backend: an endpoint that resolves a QR/barcode payload (most simply,
  the existing `code` field, e.g. `AST-0004`) to its Asset record — likely
  reusable directly via the existing `GET /assets/:id` lookup path (which
  already supports lookup by `id`; confirm/extend to also match `code` if
  it doesn't already) rather than a new endpoint, unless generation
  (producing a scannable QR image) requires a dedicated route.
- Frontend: wire the existing "Scan QR" button (`pages/Assets/index.tsx`)
  and "Print QR" quick action (`pages/AssetDetail/index.tsx`, currently a
  placeholder toast — same dead-end pattern the Assign button had before
  Check-in/Check-out fixed it) to real behavior: scan → look up → navigate
  to Asset Detail; print → render/download an actual QR encoding the asset
  code.
- **Inspect existing implementation first** (Step 8.1) before assuming
  scope — confirm exactly what the two existing buttons currently do and
  what `GET /assets/:id` currently accepts.

## Acceptance Criteria

`AC-OPS-001`, sourced from `RAISE-PRD.md`'s own AC text for
`RAISE-FR-OPS-001`: *"Users can use QR / Barcode information to identify
an asset; the identified asset can be connected to its asset record."*
Two testable behaviors: (1) identify an asset from QR/barcode data, (2)
navigate from that identification to the real asset record. No workflow
detail, permission model, or field format is specified beyond this — do
not invent stricter criteria than the PRD states.

## Validation Method

- Backend: `go build ./...`, `go vet ./...`, `gofmt -l`, `go test ./...`
  (new mocked service-layer tests for any new/changed lookup logic).
- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify end-to-end: scan (or manually enter) a code → resolves to
  the correct Asset Detail page; Print QR renders a real, scannable code
  (not a toast).

## Related Checkpoint

`BASELINE-CHECKPOINT-2026-08-24` and `PHASE-CHECKPOINT-1` (both recommend
this same item). Prior pattern reference: `CHECKPOINT-2026-08-24-003`
(Asset Check-in — same "confirmed, narrow, no invented workflow" shape).

## Related Git Branch/Commit

None yet — not started. Would follow the established naming convention,
e.g. `backend/qr-barcode` or `frontend/qr-barcode-wiring` depending on
whether backend work is needed or this turns out to be frontend-only.

---

## Risks / Blockers

None blocking. Minor open question to resolve *during* implementation,
not before: whether QR "generation" needs a dedicated backend
capability/library or can be done client-side from the existing `code`
field (likely the latter, given the AC only requires identify-and-connect,
not a specific encoding format).

## Files to Update (after implementation, per Step 10)

`PROJECT-TIMELINE.md` (Phase 3 status), `PROJECT-CHECKPOINTS.md` (new
Level 1 checkpoint), `DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`,
`CHANGELOG.md`, this file (`NEXT-STEP.md`, recalculated per Step 11).

## After Completion

Recalculate from updated project state — do not assume the next pick
after this one is Warranty/Audit/Alerts just because they're next in
`CURRENT-STATUS.md`'s backlog list; re-run Steps 1-7 against the
traceability matrix's state *at that time*, since answering PRD open
questions between now and then could change the priority order.
