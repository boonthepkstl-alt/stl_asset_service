# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-001` (TS-LOGIN test-execution sweep).

---

## Current State

- **Current phase:** Phase 2 — Authentication / RBAC. `RAISE-NFR-SEC-RBAC-001` now `FAIL (partial)` with real evidence (1/3 pass, 2/3 blocked for a new infrastructure reason), up from a pre-code-era `BLOCKED` guess.
- **Current feature:** None actively in progress. Last work: ran a fourth formal test-execution sweep (`TS-LOGIN`, 3 cases) per the prior `NEXT-STEP.md`'s own recommendation.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-001`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-001` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 No code changed this checkpoint (test execution only). Prior verification state (143/143 tests, typecheck/lint/build) is unaffected.
- **Open blockers:** F-30 (no mock fallback for Auth) blocks TC-LOGIN-01/-02 specifically in this dev environment — not a product defect, an infrastructure/testing-environment gap; no fix is implied unless explicitly requested.
- **Open findings:** F-01 through F-30 in `OPEN-FINDINGS.md`. **F-30 is new** this checkpoint (Infrastructure/Process category). F-22 and F-27 (scope questions) remain open from earlier sweeps.
- **Remaining work:** No direct-fix findings remain from any of the four formal test-execution sweeps run this session (F-21 through F-30 are all either resolved or correctly classified as non-actionable scope/infra questions).
- **Dependencies:** N/A — nothing currently blocked on engineering work that's actually requested.
- **Plan vs. actual variance:** None — this task was explicitly instructed by the user and matched exactly what the prior `NEXT-STEP.md` recommended.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (scope question) | Needs a business/design decision |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested; not blocking any confirmed AC |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open, not yet answered — the longest-standing uncompleted request in this session |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 — the original reason `TS-LOGIN` was `BLOCKED`, separate from F-30's infra reason |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Remaining `TC-*` formal executions (other suites not yet run) | `VALIDATION` | `TS-DASH`, `TS-WARRANTY-001`, `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES` still not formally executed |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: four formal test-execution sweeps
have now run, with F-30 the only new item and it's an infrastructure
observation, not an actionable product defect. The remaining
not-yet-tested suites split into two groups: `TS-DASH` (likely
re-confirms F-22's already-known Dashboard/Prototype mismatch rather
than surfacing new information) and a cluster of suites that are
entirely TBD (`TS-WARRANTY-001`, `TS-ORACLE-001`, `TS-ALERT-001`,
`TS-AI-SEARCH-001`, `TS-AI-STATES`) that would mostly return
`NOT_IMPLEMENTED` with little new insight. With the test-execution
pattern's marginal value now declining, **F-01 (Warranty field list)** —
the longest-standing uncompleted request this session — is now the
strongest candidate to actively resurface to the user, rather than
running a fifth sweep on progressively lower-signal suites.

---

## Primary Next Step

**Surface F-01 to the user: request the Warranty field list beyond
`warrantyExpiry`, per `RAISE-FR-WARRANTY-001`/PRD §16 Q15.**

## Why This Is Next

This is the longest-standing uncompleted request in the session — the
user was asked once before to confirm this and has not yet supplied the
field list. Every other currently-open item is either a scope question
requiring a business/design call (F-22, F-27), an infra observation not
requiring product work (F-30), or a not-yet-tested suite whose expected
value is now lower than earlier sweeps (see Priority Application). This
is not an engineering task — it's a business-decision request that
should be asked directly, not built around by guessing.

## Dependencies

None from an engineering standpoint — this is purely a request for
business input. Once answered, it would unblock `RAISE-FR-WARRANTY-001`
and any Warranty-dependent Asset Detail sections/fields (already
partially scaffolded — `warrantyExpiry` exists on `Asset`, other fields
do not).

## Expected Output

Not a code change — a direct question to the user (in the next
conversational turn, not this recalculation) asking them to supply the
Warranty field list (or confirm `warrantyExpiry` is the only field in
MVP scope, if that's the actual answer). If they decline or defer, fall
back to the next test-execution sweep (`TS-DASH`, then the TBD cluster)
per the same reasoning as before.

## Acceptance Criteria

N/A — this step is a request for input, not a testable change.

## Validation Method

N/A until an answer is received; then the normal PRD-update →
design/prototype/AC/test-plan/test-case/traceability chain sync applies,
per this repo's established `update-prd` → `run-full-chain` workflow.

## Related Checkpoint

`CHECKPOINT-2026-08-29-001` (most recent sweep, found F-30, prompted
this reprioritization).

## Related Git Branch/Commit

None — this is not an engineering task.

---

## Risks / Blockers

None from doing this — worst case the user defers again and a new test
sweep is run instead, per the fallback above.

## Files to Update (after implementation, per Step 10)

N/A for this step itself. If the user answers, `update-prd` skill/agent
handles `RAISE-PRD.md`, and `run-full-chain` propagates through the
7-stage deliverable chain — not manual editing of this file's usual
target set.

## After Completion

Recalculate. If F-01 is answered, prioritize implementing/wiring the
newly-confirmed Warranty fields (or documenting the chain-sync if no
code change results). If deferred again, run a fifth test-execution
sweep on `TS-DASH` next, expecting it to likely just reconfirm F-22
rather than surface new information — worth doing once for completeness
of the traceability matrix's evidence base, even if low-signal.
