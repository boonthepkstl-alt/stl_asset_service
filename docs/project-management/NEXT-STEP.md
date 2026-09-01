# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-003` (F-31 explicitly deferred by user decision — not built).

---

## Current State

- **Current phase:** Phase 6 — Oracle FA Integration & Reconciliation. `RAISE-FR-ORACLE-001` unchanged (still an unbuilt placeholder) — the decision is to leave it that way until real Oracle FA integration lands.
- **Current feature:** None actively in progress. Last work: presented F-31's options to the user; recorded the decision to defer.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-09-01-003`.
- **Last completed checkpoint:** `CHECKPOINT-2026-09-01-003` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 No code changed — this was a documentation-only decision record. No build/lint/test/type-check impact.
- **Open blockers:** None directly buildable — every remaining open item (F-32, F-33, `AC-WARRANTY-001-03`) needs a business/design decision, not an engineering fix. F-31 is now explicitly deferred, not merely blocked.
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md`, minus **F-22, F-27, and F-30 (Resolved, R-13/R-14/R-15)**. F-31 remains Open but is now explicitly deferred (a decided "not yet," not an unanswered question). Two findings remain genuinely open: F-32, F-33.
- **Remaining work:** No direct-fix findings and no unexecuted validation remain.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — the user considered the 3 options presented (scoped interim build, defer, ask for more detail) and chose to defer, a legitimate decision this session correctly did not make unilaterally.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-33: AI Assistant (P-015) doesn't answer questions or exhibit response states | `FINDING` (build gap, confirmed by execution) | Distinct from F-06; needs a business/design decision on scope before any code |
| F-32: Alerts (P-012) not built — route 404s | `FINDING` (build gap, confirmed by execution) | Distinct from F-05 |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | **Explicitly deferred 2026-09-01** — not building until real Oracle FA integration lands (F-04 resolved) |
| F-06/F-05/F-04: citation format / alert rules / Oracle integration mechanism | Blocked on business decision | Each independent of the corresponding F-33/F-32/F-31 build-gap finding |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — separate from F-30's now-resolved infrastructure half |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — retained as a documented future enhancement by F-22's resolution, not itself resolved |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed (F-11/F-12) |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: F-31 now has an explicit decision
(defer) recorded, distinguishing it from a still-open question. **Every
remaining item in the Incomplete Work Inventory is either explicitly
deferred (F-31) or blocked on a business/design decision this session
cannot make unilaterally (F-32, F-33, and the rest).** There is no
direct-fix engineering item and no unexecuted validation task left to
pick autonomously.

---

## Primary Next Step

**Check in with the user on direction.** Two open findings still need a
business/design decision:

1. **F-33** — AI Assistant (P-015) doesn't answer questions or exhibit
   any response state at all. Worth a scoped interim experience, or
   leave until real AI backend integration lands?
2. **F-32** — Alerts (P-012) is entirely unbuilt (404).
3. **`AC-WARRANTY-001-03`** — the Warranty "Expiring" 90-day rule.

(F-22, F-27, and F-30 are Resolved — R-13/R-14/R-15. F-31 is now
explicitly deferred by decision, not awaiting one.)

Alternatively, reasonable non-decision-dependent work: a `/code-review`
pass across other recent PR diffs, or drafting `RAISE-COMPLIANCE-REVIEW.md`
(the one deliverable-chain document that has never been started, per
`CLAUDE.md`'s deliverable chain diagram) — a strong candidate now that
the traceability matrix that document would summarize is at v1.1 with
every historical gap closed.

## Why This Is Next

Every previously-identified "clearly next" item — nine formal
test-execution sweeps, F-01's resolution and implementation, a
`/code-review` fix, and F-22/F-27/F-30's full resolutions, plus F-31's
deferral decision — has been completed. The remaining backlog is
uniformly blocked on decisions this session cannot make unilaterally.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-09-01-003` (most recent, F-31 deferral decision).

## Related Git Branch/Commit

`docs/defer-f31-oracle-fa` — pending PR (predicted #60).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a decision only the
user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
