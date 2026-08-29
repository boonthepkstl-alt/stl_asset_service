# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-006` (`TS-ALERT-001` sweep, Alerts — both test cases FAIL, new finding F-32).

---

## Current State

- **Current phase:** Phase 7 — Alerts & Notifications (validation only; no new code). `RAISE-FR-ALERT-001` is confirmed to have no built Alerts screen at all — the route 404s.
- **Current feature:** None actively in progress. Last work: ran the `TS-ALERT-001` formal test-case execution sweep (`TC-ALERT-001-01/-02`) against the real running app.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-006`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-006` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 Docs-only change, no build/lint/test/type-check impact. Browser-verified live — `/notifications` confirmed to 404, header bell dropdown confirmed hardcoded-empty.
- **Open blockers:** None directly buildable — every remaining open item (F-22, F-27, F-30, F-31, F-32, `AC-WARRANTY-001-03`) needs a business/design decision, not an engineering fix.
- **Open findings:** F-02 through F-32 in `OPEN-FINDINGS.md`. New: **F-32** (Alerts/P-012 not built — the route 404s, worse than F-31's Oracle FA placeholder stub), distinct from the pre-existing F-05 (trigger-rule question). F-22, F-27, F-30, F-31 remain open from earlier sweeps.
- **Remaining work:** No direct-fix findings remain. The `TS-ALERT-001` sweep surfaced a genuinely new finding (F-32), but fixing it isn't "buildable now" — a real Alerts screen depends on trigger rules being defined (F-05, still fully TBD), and even a scoped interim page raises the same "prototype vs. scoped placeholder" question already raised by F-22/F-31.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** The prior `NEXT-STEP.md` flagged the remaining suites as "low marginal signal, expected to mostly confirm BLOCKED status." `TS-ORACLE-001` and now `TS-ALERT-001` both defied that expectation — each surfaced a concrete new finding (a complete absence of the required screen, not just an unresolved PRD question). Variance handled by minting F-31 and F-32 rather than assuming the low-signal prediction held without checking.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-32: Alerts (P-012) not built — route 404s | `FINDING` (build gap, confirmed by execution) | Worse than F-31's Oracle FA placeholder; distinct from F-05 — even presence-only testing fails since no alert list renders anywhere |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | Distinct from F-04; not a "first cut" candidate without a design decision on interim-vs-real scope |
| F-22: Executive/Main Dashboard vs. Prototype P-014/P-002 mismatch | `FINDING` (scope question) | Needs a business/design decision — confirmed from two independent Prototype screens/AC groups against the same built page |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested |
| F-05: Alert trigger rules and channels | Blocked on business decision | PRD §6.9 Open Question — the deeper rule-definition question, independent of F-32 |
| F-04: Oracle integration method/mapping/sync/security | Blocked on business decision | PRD §16 Q6–Q10 — the deeper mechanism question, independent of F-31 |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 — PRD §6.7's "90 days" is illustrative, not a confirmed generalizable rule; gates the "Expiring" 3rd Warranty Timeline state |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Natural Language Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-AI-SEARCH-001`, `TS-AI-STATES` still not formally executed — the last 2 suites in the whole `RAISE-TEST-CASES.md` catalog. `TS-ORACLE-001`/`TS-ALERT-001` both showed "low marginal signal" is not a safe assumption to skip on |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: `TS-ALERT-001` surfaced a second
consecutive genuinely-new finding (F-32, after F-31), but neither is
directly buildable without a decision — the honest fix in both cases
depends on a business/design answer that doesn't exist yet. **Every
remaining item in the Incomplete Work Inventory is now blocked on a
business/design decision, or is the last 2 remaining low-signal
validation suites** (`TS-AI-SEARCH-001`, `TS-AI-STATES` — this would
complete every suite in `RAISE-TEST-CASES.md`). There is no direct-fix,
non-blocked engineering item left to pick autonomously.

---

## Primary Next Step

**Check in with the user on direction.** The concrete open items to put
in front of them, now six scope/infra questions deep:
1. **F-32** (new) — Alerts (P-012) is entirely unbuilt (404). Worth a
   scoped interim page before trigger rules are defined, or leave as-is?
2. **F-31** — Oracle FA Financial View (P-011) is a bare placeholder.
   Same question as F-32, one phase earlier.
3. **F-22** (Executive/Main Dashboard tile/section spec vs. shipped
   page) — update the Prototype, or grow the Dashboard to match?
4. **F-27** (Category sub-taxonomy) — is Prototype P-005's illustrative
   tree the real target, or should it be redefined?
5. **F-30** (no Auth mock fallback) — worth building a
   `MockAuthRepository`-style path for local dev/testing?
6. **`AC-WARRANTY-001-03`** — is PRD §6.7's "90 days" the actual
   business rule for the "Expiring" Warranty state, or illustrative only?

Alternatively, the user may prefer running the last 2 remaining suites
(`TS-AI-SEARCH-001`, `TS-AI-STATES`) to complete every suite in
`RAISE-TEST-CASES.md` — worth doing since F-31/F-32 both showed
"expected low signal" can still surface something concrete.

## Why This Is Next

Every previously-identified "clearly next" item (seven test-execution
sweeps, then F-01's resolution and implementation) has now been
completed. The remaining backlog is uniformly blocked on decisions this
session cannot make unilaterally, or is the last 2 remaining
low-signal-but-not-zero-signal validation suites — this is a genuine
decision point for the user, not a default action to take autonomously.

## Dependencies

None — this is a question, not a task.

## Expected Output

Not yet started — pending user direction.

## Acceptance Criteria

N/A.

## Validation Method

N/A until a direction is chosen.

## Related Checkpoint

`CHECKPOINT-2026-08-29-006` (most recent, `TS-ALERT-001` sweep).

## Related Git Branch/Commit

`docs/tc-execution-alert` — pending PR (predicted #53).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a low-value sweep
or a decision only the user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
