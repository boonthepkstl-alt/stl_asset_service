# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-29, immediately after `CHECKPOINT-2026-08-29-007` (`TS-AI-SEARCH-001` sweep, Natural Language Search — all 3 test cases FAIL, new finding F-33).

---

## Current State

- **Current phase:** Phase 9 — AI Document Intelligence & Search (validation only; no new code). `RAISE-AI-SEARCH-001` is confirmed to have no natural-language Q&A implementation at all — two non-matching UI surfaces exist instead.
- **Current feature:** None actively in progress. Last work: ran the `TS-AI-SEARCH-001` formal test-case execution sweep (`TC-AI-SEARCH-001-01/-02/-03`) against the real running app.
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-29-007`.
- **Last completed checkpoint:** `CHECKPOINT-2026-08-29-007` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Current status:** 🟢 Docs-only change, no build/lint/test/type-check impact. Browser-verified live — the header "AI Assistant" drawer confirmed to have no input field; Assets page's "Ask AI" box confirmed to only keyword-filter the list (source-code cross-checked in `handleAISearch`).
- **Open blockers:** None directly buildable — every remaining open item (F-22, F-27, F-30, F-31, F-32, F-33, `AC-WARRANTY-001-03`) needs a business/design decision, not an engineering fix.
- **Open findings:** F-02 through F-33 in `OPEN-FINDINGS.md`. New: **F-33** (AI Assistant/P-015 doesn't answer natural-language questions), distinct from the pre-existing F-06 (citation-precision/format question). F-22, F-27, F-30, F-31, F-32 remain open from earlier sweeps.
- **Remaining work:** No direct-fix findings remain. Only `TS-AI-STATES` (5 test cases) has never been formally executed — the last unexecuted suite in the entire `RAISE-TEST-CASES.md` catalog.
- **Dependencies:** N/A.
- **Plan vs. actual variance:** None new — consistent with `TS-ORACLE-001`/`TS-ALERT-001`, `TS-AI-SEARCH-001` again surfaced a concrete new finding (F-33) rather than merely re-confirming a known `BLOCKED` status, reinforcing that "expected low signal" should not be treated as a reason to skip formal execution.

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| `TS-AI-STATES` (5 test cases, P-015 §22 AI Response States) | `VALIDATION` | The **last** unexecuted suite in `RAISE-TEST-CASES.md` — completing it finishes the full test-case catalog |
| F-33: AI Assistant (P-015) doesn't answer questions | `FINDING` (build gap, confirmed by execution) | Distinct from F-06; two non-matching surfaces exist (no-input drawer, keyword-filter box) |
| F-32: Alerts (P-012) not built — route 404s | `FINDING` (build gap, confirmed by execution) | Worse than F-31's Oracle FA placeholder; distinct from F-05 |
| F-31: Oracle FA / Financial View (P-011) not built | `FINDING` (build gap, confirmed by execution) | Distinct from F-04; not a "first cut" candidate without a design decision on interim-vs-real scope |
| F-22: Executive/Main Dashboard vs. Prototype P-014/P-002 mismatch | `FINDING` (scope question) | Needs a business/design decision — confirmed from two independent Prototype screens/AC groups against the same built page |
| F-27: Category & Hierarchy sub-taxonomy undefined | `FINDING` (scope question) | Prototype P-005's illustrative tree isn't finalized business data |
| F-30: No mock fallback for Auth | `FINDING` (infra, not a defect) | Would need a decision to add a `MockAuthRepository`-style path — not yet requested |
| F-06: AI citation precision/format | Blocked on business decision | PRD §16 Q18 — the deeper citation-mechanism question, independent of F-33 |
| F-05: Alert trigger rules and channels | Blocked on business decision | PRD §6.9 Open Question — independent of F-32 |
| F-04: Oracle integration method/mapping/sync/security | Blocked on business decision | PRD §16 Q6–Q10 — independent of F-31 |
| `AC-WARRANTY-001-03`'s 90-day-window threshold | Blocked on business decision | Separate from F-01 — PRD §6.7's "90 days" is illustrative, not a confirmed generalizable rule; gates the "Expiring" 3rd Warranty Timeline state |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question, unaffected by recent work |
| Delegated-approver configuration rules (`RAISE-FR-MAINT-001`) | Blocked on business decision | Who may delegate, to whom, how audited — TBD |
| Auth mechanism / role-permission matrix content | Blocked on business decision | PRD §16 Q21–Q22 |
| Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: `TS-AI-SEARCH-001` surfaced a third
consecutive genuinely-new finding (F-33, after F-31 and F-32), but none
is directly buildable without a decision — the honest fix in each case
depends on a business/design answer that doesn't exist yet. **The only
remaining item that is not blocked on a business/design decision is
`TS-AI-STATES`** — the last unexecuted test suite in the entire
`RAISE-TEST-CASES.md` catalog. This is now the clearest, lowest-risk
next action: it completes formal execution coverage, and the last three
sweeps have shown it is likely to surface real signal rather than just
re-confirm `BLOCKED`.

---

## Primary Next Step

**Run the `TS-AI-STATES` sweep** (`TC-AI-STATES-01..05`, P-015 §22 AI
Response States — Success/No Match/Ambiguous/Error/Conflicting-Sources).
This is the last unexecuted suite in `RAISE-TEST-CASES.md` — completing
it finishes formal execution coverage of the entire test-case catalog.
Given F-33 (AI Assistant has no real answer engine), most or all of
these states are expected to be unexercisable in the same way — but per
this session's own discipline, that expectation should be verified by
real execution, not assumed.

After that sweep, the only remaining work is a business/design decision
on one of seven now-open scope/infra questions:
1. **F-33** — AI Assistant (P-015) doesn't answer questions at all.
2. **F-32** — Alerts (P-012) is entirely unbuilt (404).
3. **F-31** — Oracle FA Financial View (P-011) is a bare placeholder.
4. **F-22** — Executive/Main Dashboard tile/section spec vs. shipped page.
5. **F-27** — Category sub-taxonomy definition.
6. **F-30** — No Auth mock fallback for local dev/testing.
7. **`AC-WARRANTY-001-03`** — the Warranty "Expiring" 90-day rule.

## Why This Is Next

`TS-AI-STATES` is the only item left that is neither blocked on a
decision nor speculative — it is a concrete, scoped, already-known task
(run the remaining suite) that completes this session's formal
test-execution coverage. Every other remaining item requires the user's
judgment, not engineering effort.

## Dependencies

None.

## Expected Output

A `TS-AI-STATES` checkpoint recording real PASS/FAIL/BLOCKED evidence
for `TC-AI-STATES-01..05`, plus any new finding it surfaces.

## Acceptance Criteria

`AC-AI-STATES-01..05` tested against the real running app with genuine
browser evidence, not assumption.

## Validation Method

Manual browser execution against `raise-frontend`, same methodology as
the seven prior sweeps this session.

## Related Checkpoint

`CHECKPOINT-2026-08-29-007` (most recent, `TS-AI-SEARCH-001` sweep).

## Related Git Branch/Commit

`docs/tc-execution-ai-search` — pending PR (predicted #54).

---

## Risks / Blockers

None — this is a validation task, not a decision point.

## Files to Update (after implementation, per Step 10)

`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md` (if a new finding
surfaces), `PROJECT-CHECKPOINTS.md`, `DEVELOPMENT-LOG.md`,
`CURRENT-STATUS.md`, `PROJECT-TIMELINE.md`, `NEXT-STEP.md`.

## After Completion

Recalculate — with `TS-AI-STATES` done, every suite in
`RAISE-TEST-CASES.md` will have been formally executed at least once
this session, and the next step becomes purely a business/design
decision checkpoint with the user.
