# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-004` (F-32 resolved, implemented, and re-verified — all cases PASS, `RAISE-TRACEABILITY-MATRIX.md` now v1.2).

---

## Current State

- **Current phase:** Phase 7 — Alerts & Notifications. `RAISE-FR-ALERT-001` now **PASS (partial)** — a real, scoped Alerts screen exists; the deeper trigger-rule/severity content question (F-05) remains open, unaffected.
- **Current feature:** None actively in progress. Last work: resolved F-32's business decision (build a scoped Alerts screen using only warranty data), implemented it, and re-verified through the real app.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-004`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-004` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 `tsc --noEmit`, `npm run lint` (0 warnings), `npx vitest run` (149/149) all pass; browser-verified live on `/notifications` — 11 alert rows matching the Dashboard's "Expired Warranty" tile exactly, asset links navigate correctly, no delivery-channel UI.
- **Open blockers:** None directly buildable — the one remaining open item (F-33) needs a business/design decision, not an engineering fix. F-31 is explicitly deferred.
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md`, minus **F-22, F-27, F-30, and F-32 (all now Resolved, R-13/R-14/R-15/R-16)**. F-31 remains Open but explicitly deferred. **F-33 is the only genuinely open, undecided finding left.**
- **Remaining work:** No direct-fix findings and no unexecuted validation remain. `RAISE-TRACEABILITY-MATRIX.md` is at **v1.2** — every traceability gap identified across this project's history is closed.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — the user again chose a scoped, honest implementation (reuse existing warranty data, render undefined severity honestly rather than inventing it) over either a full build or a full defer, consistent with the F-27 pattern.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-33: AI Assistant (P-015) doesn't answer questions or exhibit response states | `FINDING` (build gap, confirmed by execution) | Distinct from F-06; needs a business/design decision on scope before any code — the only remaining undecided finding |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | **Explicitly deferred 2026-09-01** — not building until real Oracle FA integration lands (F-04 resolved) |
| F-06/F-05/F-04: citation format / alert rules (beyond warranty) / Oracle integration mechanism | Blocked on business decision | F-05 (alert trigger rules beyond warranty expiry) is now independent of F-32, which is resolved |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — separate from F-30's now-resolved infrastructure half |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — retained as a documented future enhancement by F-22's resolution, not itself resolved |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed (F-11/F-12) |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |
| Header bell-icon dropdown still hardcoded empty | `TECHNICAL_DEBT` (minor) | Flagged in F-32's resolution as a separate, smaller-scope item — the dedicated Alerts screen is the one that matters for `AC-ALERT-001`; not itself a tracked finding |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: F-32 is now fully closed — spec
confirmed, implemented, and re-executed. `RAISE-TRACEABILITY-MATRIX.md`
is at v1.2. **Every remaining item in the Incomplete Work Inventory is
either explicitly deferred (F-31) or blocked on a business/design
decision (F-33 and the rest).** There is no direct-fix engineering item
and no unexecuted validation task left to pick autonomously. F-33 is
now the single remaining genuinely-undecided finding.

---

## Primary Next Step

**Check in with the user on F-33** — the one remaining open, undecided
finding:

**F-33** — AI Assistant (P-015) doesn't answer natural-language
questions or exhibit any of the 5 required response states at all (two
non-matching surfaces exist instead: a no-input header drawer, and a
hardcoded keyword-filter box on the Assets page). Worth a scoped
interim experience (e.g. a simple keyword-to-canned-answer mapping
using only existing data, similar in spirit to F-32's approach), or
leave until real AI backend integration lands?

Also worth surfacing: **`AC-WARRANTY-001-03`**'s 90-day "Expiring"
Warranty threshold, still open since F-01's original resolution.

Alternatively, reasonable non-decision-dependent work: a `/code-review`
pass across other recent PR diffs, or drafting `RAISE-COMPLIANCE-REVIEW.md`
(the one deliverable-chain document that has never been started, per
`CLAUDE.md`'s deliverable chain diagram) — a strong candidate now that
the traceability matrix that document would summarize is at v1.2 with
every historical gap closed and only 1 genuinely open finding remaining.

## Why This Is Next

Every previously-identified "clearly next" item — nine formal
test-execution sweeps, F-01's resolution and implementation, a
`/code-review` fix, and F-22/F-27/F-30/F-32's full resolutions, plus
F-31's deferral decision — has been completed. The remaining backlog is
down to one genuinely open finding (F-33) plus a handful of
already-categorized blocked/deferred/accepted items.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-09-01-004` (most recent, F-32 resolution — Resolved).

## Related Git Branch/Commit

`frontend/resolve-f32-alerts-screen` — pending PR (predicted #61).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a decision only the
user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
