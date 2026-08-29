# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-002` (F-01 Warranty field-list resolution).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. Warranty (`RAISE-FR-WARRANTY-001`) is now `APPROVED` in the PRD (field list confirmed: `warrantyExpiry` only) — the longest-standing uncompleted business-decision request this session is closed.
- **Current feature:** None actively in progress. Last work: resolved F-01 per the user's direct answer ("ใช้แค่ warrantyExpiry พอสำหรับ MVP"), propagated through `/update-prd` + `/run-full-chain`.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-002`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-002` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 No code changed this checkpoint (pure documentation/requirements-chain resolution). Prior verification state (143/143 tests, typecheck/lint/build) is unaffected.
- **Open blockers:** None for a first-cut Warranty screen — the field list is now confirmed. `AC-WARRANTY-001-03`'s 90-day-window threshold remains a separate, still-open question (not part of what was just resolved).
- **Open findings:** F-02 through F-30 in `OPEN-FINDINGS.md` (F-01 is now Resolved as R-12). F-22, F-27, F-30 remain open scope/infra questions. No other direct-fix findings remain from any of the four test-execution sweeps.
- **Remaining work:** A first-cut Warranty screen (P-010) is now the strongest "buildable now" candidate — mirrors the F-25 Category & Hierarchy precedent (build only what's confirmed, don't invent the rest).
- **Dependencies:** None — `Asset.warrantyExpiry` already exists; no backend change needed for a first cut (same pattern as F-25, which needed no new backend query support either).
- **Plan vs. actual variance:** None — this task was the user's own direct instruction, following up on a question I'd raised earlier in the session.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| Warranty screen (P-010) — no first-cut build yet | `ENHANCEMENT` (now unblocked) | Field list confirmed (`warrantyExpiry` only); building the screen itself has not been requested yet, but is now technically buildable for the first time |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Needs a business/design decision |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 — PRD §6.7's "90 days" is illustrative, not a confirmed generalizable rule |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-DASH`, `TS-WARRANTY-001` (now partly unblocked — could re-run to confirm), `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with F-01 resolved, a first-cut
Warranty screen (P-010) is now the strongest genuinely-new "buildable
now" item — unlike F-22/F-27/F-30 (scope/infra questions requiring a
decision) or the remaining TBD test suites (low marginal signal), this
is real, confirmed, unblocked engineering work that wasn't possible
before this session. It directly mirrors the F-25 precedent: build only
the confirmed scope (a screen showing `warrantyExpiry` per asset, plus
the UI-computed Active/Expiring/Expired timeline already specified in
Prototype P-010/AC-WARRANTY-001), not the rejected 7-field model. This
has not yet been explicitly requested by the user, though — worth
confirming with them before starting, since it's a build task, not a
continuation of an in-progress one.

---

## Primary Next Step

**Confirm with the user whether to build a first-cut Warranty screen
(P-010) now that its field list is resolved** — or ask what they'd
prefer next, since F-01's resolution was itself the prior recommended
action and this is a new fork in the road, not a predetermined next
task.

## Why This Is Next

F-01's resolution unblocks real engineering work for the first time,
but building a whole new screen is a large-enough step (same category
as F-25's screen build) that confirming scope/priority with the user
first fits this session's established pattern (e.g., confirming before
each sweep, before UX relocations, etc.) — this is a genuine decision
point, not just executing an already-agreed task.

## Dependencies

None technically — `Asset.warrantyExpiry` exists, `useAssets`/asset
fixtures already carry it. If the user confirms, follow the F-25
pattern: a scoped-down first cut (warrantyExpiry + computed timeline
state only), reusing existing UI patterns (Tabs/Card/Badge), no new
backend query support invented.

## Expected Output

Not yet started — pending user confirmation. If confirmed, the task
would be: add a Warranty view (screen or tab, per user preference — the
Assets/Categories precedent suggests asking whether this should be its
own page or folded into an existing one, given the just-established
"secondary views belong as tabs" pattern from the Category & Hierarchy
relocation) showing per-asset `warrantyExpiry` and computed
Active/Expiring/Expired state, matching `AC-WARRANTY-001-01/-02`
exactly, deferring `AC-WARRANTY-001-03`'s 90-day view since that
threshold remains unconfirmed.

## Acceptance Criteria

`AC-WARRANTY-001-01`/`-02` (already-confirmed text) — if this task
proceeds. `AC-WARRANTY-001-03` stays out of scope until the 90-day
question resolves.

## Validation Method

Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
Browser-verify against real seeded asset data with varying
`warrantyExpiry` dates. Update `RAISE-TRACEABILITY-MATRIX.md`'s
`RAISE-FR-WARRANTY-001` row and mark the relevant open item Resolved
once confirmed — if this task is undertaken.

## Related Checkpoint

`CHECKPOINT-2026-08-29-002` (F-01 resolution, this recommendation's
basis), `CHECKPOINT-2026-08-28-001` (F-25, the closest precedent for
how to scope a first-cut screen build).

## Related Git Branch/Commit

None yet — not started, pending confirmation.

---

## Risks / Blockers

Low risk once confirmed — same shape as F-25's already-successful
first-cut pattern. The only risk is scope creep into the rejected
7-field model or the unconfirmed 90-day rule; mitigate by treating
`warrantyExpiry` + computed timeline as the ceiling, same discipline
used for F-25's flat-category-only scope.

## Files to Update (after implementation, per Step 10)

If undertaken: `PROJECT-CHECKPOINTS.md` (new Level 1 checkpoint),
`DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`, `CHANGELOG.md`,
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-WARRANTY-001` row), this file.

## After Completion

Recalculate. If the user declines or defers the Warranty screen, the
next candidates are a test-execution sweep on `TS-DASH` (or the
remaining TBD suites) or the other open scope questions (F-22, F-27,
F-30) — none of which is a build task without further business input.
