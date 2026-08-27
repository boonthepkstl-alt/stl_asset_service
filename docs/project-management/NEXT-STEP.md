# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-27, immediately after `CHECKPOINT-2026-08-27-001` (F-24 fix).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. `RAISE-FR-ASSET-001` now `PASS` on all 6 test cases (up from `FAIL (partial)`). `-002`/`-003` unchanged (`FAIL (partial)`/`FAIL`), gated by F-25/F-26 respectively.
- **Current feature:** None actively in progress. Last work: fixed F-24 (Financial/Lifecycle sections on Asset Detail) per explicit user instruction ("Start on F-24").
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-27-001`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-27-001` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (138/138), `npm run build` all pass; browser-verified live on asset `a1` (Financial: "$3,299"/"$2,800"/"2024-01-15"; Lifecycle: 5 rows with live values, clicking Maintenance row correctly switches to that tab).
- **Open blockers:** None for F-26 specifically (see Primary Next Step). F-25 is also non-PRD-blocked but larger — see Priority Application.
- **Open findings:** F-01 through F-26 in `OPEN-FINDINGS.md`. **F-23 and F-24 are now Resolved (R-06, R-07)**; F-25, F-26 remain open, both in the "Confirmed via Test Execution" category (not PRD-blocked). F-22 also remains open (scope question, not a build task).
- **Remaining work:** F-25 (no Category & Hierarchy screen), F-26 (Custody History not append-only).
- **Dependencies:** Neither remaining finding depends on anything not already built.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-26: Custody History not append-only | `FINDING` (not blocked) | Asset Detail's History tab needs to append entries instead of overwriting the current-state one — touches state-mutation logic (Check-in), not just display; slightly higher risk than the F-23/F-24 fixes |
| F-25: No Category & Hierarchy screen (P-005) | `FINDING` (not blocked but large) | A whole new screen — closest to "needs a scoped-down first cut," but the underlying taxonomy content is still TBD (only the missing *screen* itself is non-blocked) |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Still needs a business/design decision |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — user was asked to confirm this once before and has not yet supplied the field list |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question — F-26's fix should stay scoped to Check-in/Check-out only, not resolve this overlap question in passing |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | TS-LOGIN, TS-DASH, TS-OPS-002, TS-MAINT-001, TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AI-SEARCH-001, TS-AI-STATES still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with F-23 and F-24 both resolved,
only two non-PRD-blocked findings remain from the 2026-08-26
Asset-domain sweep. **F-26** is picked next — it's self-contained (one
file, `frontend/src/pages/AssetDetail/index.tsx`, the History tab
specifically) and fully specified by `AC-ASSET-003-02`, but note it's a
different shape than F-21/F-23/F-24: those were pure display gaps, F-26
requires changing what `handleCheckIn`/an assign action actually persist
(append vs. replace), so it carries slightly more risk of an unintended
behavior change and needs closer attention to `MockAssetRepository`'s
existing `checkIn`/`assign` methods before touching them. **F-25**
remains the largest (an entire missing screen) and is deliberately not
picked first.

---

## Primary Next Step

**Fix F-26 — make Custody/Assignment History append-only, per
`AC-ASSET-003-02`/`TC-ASSET-003-02..03`.**

## Why This Is Next

The last small-to-medium, non-PRD-blocked, AC-specified finding from the
2026-08-26 Asset-domain sweep before F-25 (a much larger, whole-new-screen
task). `AC-ASSET-003-02` already fully specifies the requirement (a
custody-changing event must append a new history entry, not replace the
current one) — this is confirmed in-scope for the one write path that
exists (Check-in/Check-out), independent of the still-open
Custody-vs-Check-in/out overlap question (F-10).

## Dependencies

None beyond the already-built Asset Detail History tab and
`MockAssetRepository`'s existing `assign`/`checkIn` methods
(`frontend/src/services/asset-repository.ts`). Inspect those methods
first — the fix likely needs each custody-changing action to push a new
history entry onto a list (rather than the History tab deriving a
single "current state" row from `asset.assignedTo` at render time, as it
does now) — check whether `Asset`/`AssetListResult`'s existing shape has
anywhere to store that list, or whether a new field is genuinely needed
before adding one.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read the
  `tab === 'history'` block in `frontend/src/pages/AssetDetail/index.tsx`
  (currently derives a single "current custody state" row + a fixed
  "Asset Registered" row from `asset.assignedTo`/`purchaseDate` at render
  time — no stored history list exists) and `MockAssetRepository.assign`/
  `checkIn` in `frontend/src/services/asset-repository.ts` before writing
  anything.
- Decide, without inventing new scope: does this need a new `custodyHistory`
  field on `Asset` (or a separate in-memory store keyed by asset id,
  mirroring how `audit-repository.ts` already tracks audit entries
  per-entity)? The audit-repository pattern is the closer precedent —
  reuse its shape rather than inventing a new one if it fits.
- Wire `assign`/`checkIn` to append a new entry instead of only mutating
  `asset.assignedTo`, then render the History tab from that list instead
  of deriving a single row.
- Stay scoped to the Check-in/Check-out write path only (per F-10's own
  note) — do not attempt to resolve the Custody-vs-Check-in/out overlap
  question in passing.

## Acceptance Criteria

`TC-ASSET-003-02`/`-03` (already-confirmed text, no PRD question
attached) — a Check-in on a previously-assigned asset must leave the
prior "Assigned to X" entry visible in history, with a new entry appended
alongside it (not replacing it).

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: re-run `TC-ASSET-003-02`/`-03` exactly as executed in
  `CHECKPOINT-2026-08-26-003` — perform a real Check-in on a seeded
  assigned asset and confirm both the prior assignment entry and a new
  check-in entry are visible afterward.
- Update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-003` row and
  mark F-26 Resolved in `OPEN-FINDINGS.md` once confirmed.

## Related Checkpoint

`CHECKPOINT-2026-08-26-003` (found F-26), `CHECKPOINT-2026-08-27-001`
(F-24, the most recent fix in this same file).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Medium risk relative to F-21/F-23/F-24 — this is a data-shape change
(adding a stored history list), not a pure display addition, so it
touches `assign`/`checkIn`'s existing behavior. Verify no other
component reads `asset.assignedTo` in a way that would break if custody
state is refactored to be derived from a history list instead of a
single field.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-26),
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-ASSET-003` row), this file.

## After Completion

Recalculate. F-25 (no Category & Hierarchy screen) is the only remaining
non-PRD-blocked finding from the 2026-08-26 Asset-domain sweep, and would
need to be scoped down (a first-cut screen, not the full taxonomy) since
the underlying taxonomy content is still TBD. Re-run Steps 1-7 rather
than assuming this holds. Separately, F-01 (Warranty field list) is still
awaiting the user's actual field-list content from an earlier,
uncompleted request — worth surfacing again if the user returns to it.
