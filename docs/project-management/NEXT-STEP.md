# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-004` (`TS-DASH` sweep, Main Dashboard — all 3 test cases FAIL, broadening F-22).

---

## Current State

- **Current phase:** Phase 8 — Executive Dashboard & Reporting (validation only; no new code). `RAISE-FR-EXEC-001`'s scope-mismatch gap is now confirmed from two Prototype screens (P-002 and P-014) against the one built page.
- **Current feature:** None actively in progress. Last work: ran the `TS-DASH` formal test-case execution sweep (`TC-DASH-01/-02/-03`) against the real running app.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-004`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-004` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 Docs-only change, no build/lint/test/type-check impact. Browser-verified live on `/dashboard` — real page text captured confirming all 3 `TC-DASH` cases FAIL exactly as described.
- **Open blockers:** None directly buildable — every remaining open item (F-22, F-27, F-30, `AC-WARRANTY-001-03`) needs a business/design decision, not an engineering fix.
- **Open findings:** F-02 through F-30 in `OPEN-FINDINGS.md`. F-22 is now broadened (covers both Executive Dashboard/P-014 and Main Dashboard/P-002 — same underlying gap). F-27, F-30 remain open scope/infra questions.
- **Remaining work:** No direct-fix findings remain. The `TS-DASH` sweep produced no new actionable item — it re-confirmed an existing finding from a second angle.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None — the prior `NEXT-STEP.md` predicted `TS-DASH` would "likely re-confirm F-22's already-known gap," and real browser execution confirmed exactly that (rather than skipping execution because the outcome was predictable).

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-22: Executive/Main Dashboard vs. Prototype P-014/P-002 mismatch | `FINDING` (scope question) | Needs a business/design decision — now confirmed from two independent Prototype screens/AC groups against the same built page |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 — PRD §6.7's "90 days" is illustrative, not a confirmed generalizable rule; gates the "Expiring" 3rd Warranty Timeline state |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` still not formally executed — all fully-TBD/blocked suites, expected low marginal signal (BLOCKED-on-arrival, not new-finding-producing) |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: with `TS-DASH` executed and F-22
broadened rather than a new finding surfaced, **every remaining item in
the Incomplete Work Inventory is now blocked on a business/design
decision, or is low-marginal-signal validation work** (`TS-ORACLE-001`,
`TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` — suites whose
requirements are already known-TBD, so execution would mostly confirm
`BLOCKED` status rather than surface something new). There is no
direct-fix, non-blocked engineering item left to pick autonomously.

---

## Primary Next Step

**Check in with the user on direction.** The concrete open items to put
in front of them:
1. **F-22** (Executive/Main Dashboard tile/section spec vs. shipped
   page) — should Prototype P-002/P-014 be updated to match the shipped
   legacy-derived layout, or should the Dashboard grow those
   tiles/sections?
2. **F-27** (Category sub-taxonomy) — is Prototype P-005's illustrative
   tree the real target, or should it be redefined?
3. **F-30** (no Auth mock fallback) — worth building a
   `MockAuthRepository`-style path for local dev/testing, or leave as is
   since real backend auth is the eventual target anyway?
4. **`AC-WARRANTY-001-03`** — is PRD §6.7's "90 days" the actual
   business rule for the "Expiring" Warranty state, or illustrative only?

Alternatively, the user may prefer running the remaining low-signal
`TC-*` suites (`TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`,
`TS-AI-STATES`) for completeness, even though they're expected to mostly
confirm already-known `BLOCKED` status.

## Why This Is Next

Every previously-identified "clearly next" item (five test-execution
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

`CHECKPOINT-2026-08-29-004` (most recent, `TS-DASH` sweep).

## Related Git Branch/Commit

`docs/tc-execution-dash` — pending PR (predicted #51).

---

## Risks / Blockers

None from asking. Risk of *not* asking: guessing at a low-value sweep
or a decision only the user can make.

## Files to Update (after implementation, per Step 10)

N/A until direction is chosen.

## After Completion

Recalculate once the user responds.
