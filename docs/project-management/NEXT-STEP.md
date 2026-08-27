# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-27, immediately after `CHECKPOINT-2026-08-27-003` (F-26 fix).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. `RAISE-FR-ASSET-001` `PASS` (6/6), `RAISE-FR-ASSET-003` now `PASS` (3/3, up from `FAIL`). `RAISE-FR-ASSET-002` still `FAIL (partial)`, gated by F-25 alone.
- **Current feature:** None actively in progress. Last work: fixed F-26 (Custody History not append-only) per explicit user instruction, delivered as part of a "Review PR #41 → Merge → Update Timeline/Checkpoint → pull Next Step" instruction chain.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-27-003`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-27-003` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 All checks green — `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (139/139), `npm run build` all pass; browser-verified live on asset `a1` (real Check-in appended "Asset checked in", real Assign appended "Asset assigned to Sarah Chen" alongside it, count badge 0→1→2).
- **Open blockers:** None for F-25 specifically, but it's large (whole new screen) and its underlying category taxonomy content is still TBD — needs a scoped-down first cut, not a direct implementation.
- **Open findings:** F-01 through F-26 in `OPEN-FINDINGS.md`. **F-23, F-24, F-26 are now Resolved (R-06, R-07, R-08)**. **F-25 is the only open, non-PRD-blocked finding remaining from the 2026-08-26 Asset-domain sweep.** F-22 also remains open (scope question, not a build task).
- **Remaining work:** F-25 (no Category & Hierarchy screen) — needs scoping before implementation, unlike F-21/F-23/F-24/F-26 which were direct fixes.
- **Dependencies:** F-25 depends on nothing technically, but its full taxonomy content is blocked on PRD (category/hierarchy data model — not confirmed anywhere in the chain beyond the flat `category` string field `Asset` already has).
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-25: No Category & Hierarchy screen (P-005) | `FINDING` (not blocked but large) | The only remaining finding from the 2026-08-26 Asset-domain sweep. Needs a scoped-down first cut — a screen that lists/displays the distinct category values already used across assets (mirroring the same `categories` fixture export added for F-23), not the full hierarchy/taxonomy model PRD §16 leaves undefined |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Still needs a business/design decision |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — user was asked to confirm this once before and has not yet supplied the field list |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question — the F-26 fix stayed scoped to Check-in/Check-out only, per this note; still open |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | TS-LOGIN, TS-DASH, TS-OPS-002, TS-MAINT-001, TS-WARRANTY-001, TS-ORACLE-001, TS-ALERT-001, TS-AI-SEARCH-001, TS-AI-STATES still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with F-23, F-24, and F-26 all
resolved, **F-25 is the only remaining non-PRD-blocked finding** from the
2026-08-26 Asset-domain sweep — but unlike the three prior fixes (each a
small, direct, fully-AC-specified change), F-25 is a whole missing
screen whose underlying content (category hierarchy/taxonomy) is not
fully specified anywhere in the chain. This is the "needs a scoped-down
first cut" pattern the protocol already has precedent for (see
Audit Log and Executive Dashboard in `CURRENT-STATUS.md` §4's history) —
build the smallest honest version (a screen listing the distinct
category values already in use, without inventing a hierarchy/parent-
child model PRD never specified) rather than either skipping it or
guessing at unconfirmed taxonomy structure.

Two options exist for what's truly next: (1) scope and build a first-cut
F-25 screen, or (2) the user's earlier, still-uncompleted request to
confirm the Warranty field list (F-01) — a business decision only the
user can supply, not something to build around. Per this session's
established pattern (continue building on non-PRD-blocked work rather
than stalling on an unanswered business question), **F-25's first cut**
is recommended, with F-01 flagged as a standing open item.

---

## Primary Next Step

**Scope and build a first-cut Category & Hierarchy screen (P-005), per
`RAISE-FR-ASSET-002`/`TC-ASSET-002-01`.**

## Why This Is Next

The only remaining non-PRD-blocked finding from the 2026-08-26
Asset-domain sweep. Prototype P-005 confirms a screen should exist;
`Asset.category` (a flat string, already used for filtering/display
everywhere else) is the only category data actually defined anywhere in
the chain — no parent/child hierarchy model is confirmed. Building a
first cut that lists the distinct categories in use (with asset counts
per category, linking back to a category-filtered Assets list) closes
the "screen doesn't exist at all" gap without inventing hierarchy
content nobody has confirmed.

## Dependencies

None beyond the already-built Assets page and `categories` fixture
export (`frontend/src/data/fixtures/mockData.ts`, added for F-23). Read
`docs/03-prototype/RAISE-PROTOTYPE.md`'s P-005 spec and
`docs/04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md`'s
`AC-ASSET-002` text in full before scoping — confirm exactly what a
"first cut" must show versus what's explicitly marked TBD, so the scope
decision itself is traceable back to those documents rather than
invented ad hoc.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read
  `docs/03-prototype/RAISE-PROTOTYPE.md` P-005 and
  `AC-ASSET-002`/`TC-ASSET-002-01..02` in full; check
  `frontend/src/config/navigation.ts`/`constants.ts`/`App.tsx` (confirmed
  zero matches for a Category screen — F-25) before adding a new route.
- Add a route + nav entry for a Category & Hierarchy screen that lists
  each distinct value in the `categories` fixture, with a live count of
  assets per category (derived from the existing `assets` fixture data,
  same pattern the Dashboard/Assets pages already use) and a link that
  navigates to the Assets page pre-filtered to that category.
- Do **not** invent a parent/child taxonomy, icon set, or hierarchy depth
  beyond the flat category list — that content is genuinely TBD per PRD,
  and Prototype P-005 itself doesn't specify one either.
- If, after re-reading P-005/AC-ASSET-002, the required first-cut scope
  turns out to need something not derivable from existing data, mark it
  `NOT TESTABLE YET` / TBD explicitly rather than guessing.

## Acceptance Criteria

`TC-ASSET-002-01` (confirmed failing — no screen exists) — a Category &
Hierarchy screen exists and is reachable via navigation.
`TC-ASSET-002-02` (confirmed passing already — category display is
consistent across screens) — must remain passing after this screen is
added.

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: navigate to the new screen via its nav entry, confirm
  category list with counts renders, and that clicking through to Assets
  correctly pre-filters by that category (re-using the F-23 Category
  filter).
- Update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-002` row and
  mark F-25 Resolved in `OPEN-FINDINGS.md` once confirmed — note any
  taxonomy content still deliberately deferred as TBD, don't silently
  drop it.

## Related Checkpoint

`CHECKPOINT-2026-08-26-003` (found F-25), `CHECKPOINT-2026-08-27-003`
(F-26, the most recently resolved finding from the same sweep).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Medium risk — this is the first *new screen* task in this finding
cluster (F-21/F-23/F-24/F-26 all fixed existing screens). The main risk
is scope creep into inventing hierarchy/taxonomy content PRD never
confirmed; mitigate by treating "distinct flat categories, with counts"
as the ceiling of this first cut, and explicitly deferring anything
beyond that rather than guessing.

## Files to Update (after implementation, per Step 10)

`PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint), `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-25 or
narrow its scope note), `RAISE-TRACEABILITY-MATRIX.md`
(`RAISE-FR-ASSET-002` row), possibly `frontend/src/config/navigation.ts`/
`constants.ts`/`App.tsx`, this file.

## After Completion

Recalculate. Once F-25 is scoped/built, the 2026-08-26 Asset-domain test-
execution sweep's findings (F-21 through F-26) will all be closed. At
that point, re-run the Next-Step Protocol fresh — likely candidates are
either running a new formal test-case-execution sweep on a
not-yet-tested suite (TS-LOGIN, TS-DASH, TS-OPS-002, TS-MAINT-001, etc.)
or surfacing F-01 (Warranty field list) again, since it's the
longest-standing uncompleted request in this session.
