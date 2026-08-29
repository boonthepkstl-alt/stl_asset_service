# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-005` (`TS-ORACLE-001` sweep, Oracle FA / Financial View — all 4 test cases FAIL, new finding F-31).

---

## Current State

- **Current phase:** Phase 6 — Audit & Reconciliation (validation only; no new code). `RAISE-FR-ORACLE-001` is confirmed to have no built Financial View at all — a placeholder stub in its place.
- **Current feature:** None actively in progress. Last work: ran the `TS-ORACLE-001` formal test-case execution sweep (`TC-ORACLE-001-01/-02/-03/-04`) against the real running app.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-005`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-005` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 Docs-only change, no build/lint/test/type-check impact. Browser-verified live on `/reconciliation` — real page text and `ModulePage` source confirmed the route is a generic placeholder, not a Financial View.
- **Open blockers:** None directly buildable — every remaining open item (F-22, F-27, F-30, F-31, `AC-WARRANTY-001-03`) needs a business/design decision, not an engineering fix.
- **Open findings:** F-02 through F-31 in `OPEN-FINDINGS.md`. New: **F-31** (Oracle FA Financial View not built — placeholder stub only), distinct from the pre-existing F-04 (integration-mechanism question). F-22, F-27, F-30 remain open from earlier sweeps.
- **Remaining work:** No direct-fix findings remain. The `TS-ORACLE-001` sweep surfaced a genuinely new finding (F-31), but fixing it isn't a "buildable now" item — building even a placeholder-quality Financial View before Oracle is actually connected raises the same scope-reconciliation question F-22 raised for the Dashboard (should the prototype or a scoped interim page be the target?).
- **Dependencies:** N/A.
- **Plan vs. actual variance:** The prior `NEXT-STEP.md` listed `TS-ORACLE-001` as a "low marginal signal" suite expected to mostly confirm `BLOCKED` status. Real execution found something more concrete than expected — not just an unresolved PRD question, but a complete absence of the P-011 screen (a stub placeholder). Variance handled by minting a new finding (F-31) rather than either silently downgrading it into F-04 or skipping documentation because the broad direction was predicted correctly.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | Distinct from F-04 — even presence-only testing of the 4 UI states fails; not a "first cut" candidate without a design decision on interim-vs-real scope |
| F-22: Executive/Main Dashboard vs. Prototype P-014/P-002 mismatch | `FINDING` (scope question) | Needs a business/design decision — confirmed from two independent Prototype screens/AC groups against the same built page |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested |
| F-04: Oracle integration method/mapping/sync/security | Blocked on business decision | PRD §16 Q6–Q10 — the deeper mechanism question, independent of F-31 |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 — PRD §6.7's "90 days" is illustrative, not a confirmed generalizable rule; gates the "Expiring" 3rd Warranty Timeline state |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Alerts, Natural Language Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` still not formally executed — all fully-TBD/blocked suites, expected low marginal signal, though `TS-ORACLE-001` shows that assumption can still surface a concrete new finding |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: `TS-ORACLE-001` surfaced a genuinely
new finding (F-31), but it is not directly buildable without a decision
— the honest fix (a real Financial View) depends on Oracle actually
being connected (F-04, still fully TBD), and even a scoped interim
placeholder raises the same "should the prototype or a scoped page be
the target?" question F-22 already raised for the Dashboard. **Every
remaining item in the Incomplete Work Inventory is now blocked on a
business/design decision, or is low-marginal-signal validation work.**
There is no direct-fix, non-blocked engineering item left to pick
autonomously.

---

## Primary Next Step

**Check in with the user on direction.** The concrete open items to put
in front of them, now five scope/infra questions deep:
1. **F-31** (new) — Oracle FA Financial View (P-011) is a bare
   placeholder. Worth a scoped interim page (e.g. showing "data
   unavailable" honestly, per `AC-ORACLE-001-02`) before Oracle is
   connected, or leave as-is until the integration itself is scoped?
2. **F-22** (Executive/Main Dashboard tile/section spec vs. shipped
   page) — update the Prototype, or grow the Dashboard to match?
3. **F-27** (Category sub-taxonomy) — is Prototype P-005's illustrative
   tree the real target, or should it be redefined?
4. **F-30** (no Auth mock fallback) — worth building a
   `MockAuthRepository`-style path for local dev/testing?
5. **`AC-WARRANTY-001-03`** — is PRD §6.7's "90 days" the actual
   business rule for the "Expiring" Warranty state, or illustrative only?

Alternatively, the user may prefer running the remaining low-signal
`TC-*` suites (`TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES`) for
completeness — `TS-ORACLE-001` showed this can still surface something
concrete even when the broad outcome (BLOCKED-on-arrival) is predictable.

## Why This Is Next

Every previously-identified "clearly next" item (six test-execution
sweeps, then F-01's resolution and implementation) has now been
completed. The remaining backlog is uniformly blocked on decisions this
session cannot make unilaterally, or is low-marginal-value validation
work — this is a genuine decision point for the user, not a default
action to take autonomously.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-08-29-005` (most recent, `TS-ORACLE-001` sweep).

## Related Git Branch/Commit

`docs/tc-execution-oracle` — pending PR (predicted #52).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a low-value sweep
or a decision only the user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
