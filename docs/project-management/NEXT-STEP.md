# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-26, immediately after `CHECKPOINT-2026-08-26-003` (second test-execution sweep — Asset Registry/Detail/Category/Custody).

---

## Current State

- **Current phase:** Phase 3 — Asset Management, now carrying real `FAIL`/`FAIL (partial)` Test Status on `RAISE-FR-ASSET-001`/`-002`/`-003` instead of the pre-code-era default.
- **Current feature:** None actively in progress. Last work: a second formal test-execution sweep (11 test cases, Asset Registry/Detail/Category/Custody), chosen autonomously per the user's explicit instruction to analyze and pick the next task without asking again.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-26-003`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-26-003` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 No code changed this checkpoint (test execution only) — prior verification state (backend/frontend green) is unaffected.
- **Open blockers:** None for F-23 specifically (see Primary Next Step). F-24/F-25/F-26 are also non-PRD-blocked but larger in scope — see Priority Application for why F-23 is picked first, not why the others are blocked.
- **Open findings:** F-01 through F-26 in `OPEN-FINDINGS.md`. **F-23, F-24, F-25, F-26 are new** this checkpoint, all in the "Confirmed via Test Execution" category (not PRD-blocked).
- **Remaining work:** None from the test-execution task itself — it's read-only. The four findings it produced are the actual remaining work.
- **Dependencies:** None of the four new findings depend on anything not already built.
- **Plan vs. actual variance:** The user was offered two options (more test execution, or a PRD answer) and explicitly asked this session to analyze and choose — chose to continue test execution, consistent with the productive track record of the first sweep (found F-21/F-22 from 3 suites; this sweep found F-23-F-26 from 4 more).

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-23: No Category filter on Asset Registry | `FINDING` (new, not blocked) | Smallest, most self-contained — same shape as the F-21 fix |
| F-24: Asset Detail missing Financial/Lifecycle sections | `FINDING` (new, not blocked) | Larger — two new UI sections, needs real data wiring for Financial (purchase cost/current value already exist on the record) |
| F-25: No Category & Hierarchy screen (P-005) | `FINDING` (new, not blocked but large) | A whole new screen — closest to "needs a scoped-down first cut," but the underlying taxonomy content is still TBD (only the missing *screen* itself is non-blocked) |
| F-26: Custody History not append-only | `FINDING` (new, not blocked) | Asset Detail's History tab needs to append entries instead of overwriting the current-state one — touches core custody UX |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Still needs a business/design decision, unaffected by this checkpoint |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question — worth noting F-26's fix should stay scoped to Check-in/Check-out only, not resolve this overlap question in passing |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | TS-LOGIN, TS-DASH, TS-OPS-002, TS-MAINT-001, TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AI-SEARCH-001, TS-AI-STATES still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: for the first time since this
protocol reached "no fresh code-buildable item" twice in a row
(`CHECKPOINT-2026-08-25-005`, then again briefly before F-21 was found),
there are now **four** non-PRD-blocked findings to choose from. Applying
the same reasoning that made F-21 tractable (small, self-contained, no
PRD dependency, an AC the app already fully specifies): **F-23** fits
best — it's the smallest (one missing filter control, same shape as the
F-21 fix), fully specified by `AC-ASSET-001`/`TC-ASSET-001-03` with no
open question attached, and touches one file. F-24 and F-26 are real
and worth doing but are larger (new sections, behavior change to a core
custody flow) and better scoped as their own separate tasks rather than
bundled with F-23. F-25 is the largest (an entire missing screen) and
is deliberately not picked first.

---

## Primary Next Step

**Fix F-23 — add a Category filter to the Assets page's Filters panel,
per `AC-ASSET-001`/`TC-ASSET-001-03`.**

## Why This Is Next

Smallest, most self-contained, non-PRD-blocked finding from this
checkpoint — the same profile that made F-21 the right previous pick.
`RAISE-FR-ASSET-001`'s AC is fully specified (search/category/detail all
listed as required filter/interactions); the fix is additive to an
already-existing Filters panel pattern (Status/Department/Location
already work the same way).

## Dependencies

None beyond the already-built Assets page and its existing
Status/Department/Location `Select` filters, which this follows the
same pattern as.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `frontend/src/pages/Assets/index.tsx`'s Filters panel and
  `useAssets`/`asset-repository.ts`'s `list()` filtering logic before
  writing anything, to add a `categoryFilter` state + `Select` the same
  way `statusFilter`/`deptFilter` already work, not a new pattern.
- Add a Category `Select` to the Filters panel, sourced from the
  distinct category values already present in the asset fixture data
  (same approach `departments`/`locations` already use).
- Wire it into `MockAssetRepository.list()`'s filter predicate (and
  `HttpAssetRepository`/backend query params, if reachable without
  inventing new backend query support — confirm `ListAssets`'s existing
  query params first; do not add a new backend filter parameter unless
  one doesn't already exist for this).

## Acceptance Criteria

`TC-ASSET-001-03` (already-confirmed text, no PRD question attached) —
"Category filter narrows list... Only assets in selected category
shown."

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: re-run `TC-ASSET-001-03` exactly as executed in
  `CHECKPOINT-2026-08-26-003` — apply a category filter, confirm only
  matching assets show.
- Update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-001` row and
  mark F-23 Resolved in `OPEN-FINDINGS.md` once confirmed.

## Related Checkpoint

`CHECKPOINT-2026-08-26-003` (found F-23), `CHECKPOINT-2026-08-26-002`
(F-21, the same-shaped fix this task follows the pattern of).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low risk. The only judgment call is where category values come from
(derive from existing asset data vs. a fixed enum) — follow whatever
`departments`/`locations` already do in this codebase rather than
inventing a new sourcing pattern.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-23),
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-ASSET-001` row), this file.

## After Completion

Recalculate. F-24, F-25, F-26 remain open and are reasonable next picks
in roughly that order (smallest to largest) — but re-run Steps 1-7
rather than assuming that order holds, since new information (a PRD
answer, a user instruction) could change it.
