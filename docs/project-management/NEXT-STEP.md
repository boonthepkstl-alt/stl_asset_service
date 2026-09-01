# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-001` (F-27 resolved, implemented, and re-verified — all cases PASS, `RAISE-TRACEABILITY-MATRIX.md` reaches v1.0).

---

## Current State

- **Current phase:** Phase 3 — Asset Management. `RAISE-FR-ASSET-002` now fully **PASS** — Category & Hierarchy has a real 2-level Category → Type → assets structure, confirmed by both automated tests and live browser execution.
- **Current feature:** None actively in progress. Last work: resolved F-27's business decision (sub-category = existing `type` field), propagated through Prototype/AC/Test Plan/Test Cases, implemented the UI nesting, and re-verified against the real app.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-001`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-001` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (145/145) all pass; browser-verified live on `/assets` → "By Category" (expanding "IT Hardware" reveals Laptop/Monitor/Headphones; expanding "Laptop" reveals exactly its 3 assets).
- **Open blockers:** None directly buildable — every remaining open item (F-30, F-31, F-32, F-33, `AC-WARRANTY-001-03`) needs a business/design decision, not an engineering fix.
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md`, minus **F-22 and F-27 (both now Resolved, R-13/R-14)**. Four findings remain open: F-30, F-31, F-32, F-33.
- **Remaining work:** No direct-fix findings and no unexecuted validation remain. `RAISE-TRACEABILITY-MATRIX.md` has reached **v1.0** — every traceability gap identified across this project's history is now closed.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — the user chose to define the sub-category taxonomy themselves (using the existing `type` field) rather than have it invented, which is exactly the kind of business decision this session's discipline requires deferring to the user for.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-33: AI Assistant (P-015) doesn't answer questions or exhibit response states | `FINDING` (build gap, confirmed by execution) | Distinct from F-06; needs a business/design decision on scope before any code |
| F-32: Alerts (P-012) not built — route 404s | `FINDING` (build gap, confirmed by execution) | Distinct from F-05 |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | Distinct from F-04 |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path |
| F-06/F-05/F-04: citation format / alert rules / Oracle integration mechanism | Blocked on business decision | Each independent of the corresponding F-33/F-32/F-31 build-gap finding |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — retained as a documented future enhancement by F-22's resolution, not itself resolved |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: F-27 is now fully closed — spec
resolved, implemented, and confirmed PASS. `RAISE-TRACEABILITY-MATRIX.md`
has reached v1.0. **Every remaining item in the Incomplete Work Inventory
is blocked on a business/design decision.** There is no direct-fix
engineering item and no unexecuted validation task left to pick
autonomously.

---

## Primary Next Step

**Check in with the user on direction.** Four open findings now need a
business/design decision, each independent of the others:

1. **F-33** — AI Assistant (P-015) doesn't answer questions or exhibit
   any response state at all. Worth a scoped interim experience, or
   leave until real AI backend integration lands?
2. **F-32** — Alerts (P-012) is entirely unbuilt (404).
3. **F-31** — Oracle FA Financial View (P-011) is a bare placeholder.
4. **F-30** — No Auth mock fallback for local dev/testing.
5. **`AC-WARRANTY-001-03`** — the Warranty "Expiring" 90-day rule.

(F-22 and F-27, previously in this list, are now Resolved — R-13 and R-14.)

Alternatively, reasonable non-decision-dependent work: a `/code-review`
pass across other recent PR diffs, or drafting `RAISE-COMPLIANCE-REVIEW.md`
(the one deliverable-chain document that has never been started, per
`CLAUDE.md`'s deliverable chain diagram) — now a stronger candidate than
before, since the traceability matrix that document would summarize has
just reached v1.0 with zero open gaps.

## Why This Is Next

Every previously-identified "clearly next" item — nine formal
test-execution sweeps, F-01's resolution and implementation, a
`/code-review` fix, F-22's full resolution, and now F-27's full
resolution — has been completed. The remaining backlog is uniformly
blocked on decisions this session cannot make unilaterally.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-09-01-001` (most recent, F-27 resolution — Resolved).

## Related Git Branch/Commit

`frontend/resolve-f27-category-type-hierarchy` — pending PR (predicted #58).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a decision only the
user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
