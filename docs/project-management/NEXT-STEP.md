# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-26, immediately after `CHECKPOINT-2026-08-26-004` (F-23 fix).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. `RAISE-FR-ASSET-001` now only fails on F-24; `-002`/`-003` unchanged (`FAIL (partial)`/`FAIL`).
- **Current feature:** None actively in progress. Last work: fixed F-23 (Category filter) per explicit user instruction ("งานถัดไป: F-23").
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-26-004`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-26-004` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section; stacked onto the still-open PR #39 branch rather than a fresh PR, since PR #39 was unmerged when this task started).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (137/137), `npm run build` all pass; browser-verified live (`TC-ASSET-001-03`: 15 → 2 assets on Category = "Infrastructure", Clear filters restores 15).
- **Open blockers:** None for F-24 specifically (see Primary Next Step). F-25/F-26 are also non-PRD-blocked but larger — see Priority Application.
- **Open findings:** F-01 through F-26 in `OPEN-FINDINGS.md`. **F-23 is now Resolved (R-06)**; F-24, F-25, F-26 remain open, all in the "Confirmed via Test Execution" category (not PRD-blocked).
- **Remaining work:** F-24 (Asset Detail missing Financial/Lifecycle sections), F-25 (no Category & Hierarchy screen), F-26 (Custody History not append-only).
- **Dependencies:** None of the three remaining findings depend on anything not already built.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-24: Asset Detail missing Financial/Lifecycle sections | `FINDING` (new, not blocked) | Two new UI sections; Financial needs no new data (purchase cost/current value already exist on the record), Lifecycle likely needs new fields/labels — check what's already on the `Asset` type before inventing new ones |
| F-25: No Category & Hierarchy screen (P-005) | `FINDING` (not blocked but large) | A whole new screen — closest to "needs a scoped-down first cut," but the underlying taxonomy content is still TBD (only the missing *screen* itself is non-blocked) |
| F-26: Custody History not append-only | `FINDING` (not blocked) | Asset Detail's History tab needs to append entries instead of overwriting the current-state one — touches core custody UX |
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

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with F-23 now resolved, F-24 is the
next-best "buildable now" candidate on the same reasoning that made F-21
and F-23 tractable (non-PRD-blocked, AC already fully specifies the
requirement). F-24 is somewhat larger than F-23 was (two new sections
instead of one filter control) but still confined to one file
(`frontend/src/pages/AssetDetail/index.tsx`) and one already-available
data source for the Financial half. F-26 is a reasonable alternative
(also self-contained) but touches state-mutation logic (Check-in) rather
than pure display, a slightly higher-risk change. F-25 remains the
largest (an entire missing screen) and is deliberately not picked first.

---

## Primary Next Step

**Fix F-24 — add the missing Financial and Lifecycle sections to Asset
Detail, per the 9-section requirement in `AC-ASSET-001-DETAIL`/`TC-ASSET-001-D-01`.**

## Why This Is Next

Non-PRD-blocked, AC-specified, and the same file family as the F-23 fix
just shipped (`frontend/src/pages/AssetDetail/index.tsx` sits alongside
`frontend/src/pages/Assets/index.tsx`). The Financial section's data
(purchase cost, current value) already exists on the `Asset` record and
already renders on the Assets list — this is a display gap on Asset
Detail specifically, not a missing-data problem.

## Dependencies

None beyond the already-built Asset Detail page and the `Asset` type's
existing fields. Before writing new fields for "Lifecycle," re-read the
`Asset` type (`frontend/src/types/asset.ts`) and `AC-ASSET-001-DETAIL`'s
exact text for what "Lifecycle" is expected to show — do not invent new
lifecycle-stage data if the AC only requires surfacing existing dates
(e.g. purchase date, warranty expiry) under a labeled section.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `frontend/src/pages/AssetDetail/index.tsx`'s existing section
  structure (Basic Info, Category, Custody, Warranty, Maintenance,
  QR/Barcode, Audit/History already exist per `CHECKPOINT-2026-08-26-003`)
  to match its established per-section pattern, not invent a new one.
- Add a "Financial" section rendering `purchaseCost`/`currentValue`
  (already on the `Asset` type, already used elsewhere).
- Add a "Lifecycle" section — check `RAISE-ACCEPTANCE-CRITERIA.md`'s
  exact `AC-ASSET-001-DETAIL` wording for what it must contain before
  deciding the field list; if the AC is vague, use only fields the
  `Asset` type already has (e.g. purchase/warranty dates) rather than
  inventing new lifecycle-stage tracking.

## Acceptance Criteria

`TC-ASSET-001-D-01` (already-confirmed text, no PRD question attached) —
all 9 named sections (Basic Info, Category, Custody, Financial,
Warranty, Maintenance, QR/Barcode, Lifecycle, Audit/History) present on
Asset Detail.

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: re-run `TC-ASSET-001-D-01` exactly as executed in
  `CHECKPOINT-2026-08-26-003` — confirm all 9 sections render for a
  seeded asset.
- Update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-001` row (should
  reach full `PASS`) and mark F-24 Resolved in `OPEN-FINDINGS.md` once
  confirmed.

## Related Checkpoint

`CHECKPOINT-2026-08-26-003` (found F-24), `CHECKPOINT-2026-08-26-004`
(F-23, the same-shaped fix this task follows the pattern of).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low-to-medium risk. The main judgment call is scoping "Lifecycle" without
inventing new fields — resolve by checking the AC's exact text and the
`Asset` type before writing any new field. If the AC only names the
section without specifying required fields, mark that ambiguity
explicitly rather than guessing a full lifecycle-stage model.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-24),
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-ASSET-001` row), this file.

## After Completion

Recalculate. F-25, F-26 remain open and are reasonable next picks — but
re-run Steps 1-7 rather than assuming order holds, since new information
(a PRD answer, a user instruction) could change it. Separately, F-01
(Warranty field list) is still awaiting the user's actual field-list
content from an earlier, uncompleted request — worth surfacing again if
the user returns to it.
