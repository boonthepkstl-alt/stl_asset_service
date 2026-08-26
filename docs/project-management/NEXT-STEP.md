# RAISE — Next Step

**Live output of [`NEXT-STEP-PROTOCOL.md`](NEXT-STEP-PROTOCOL.md).**
Overwritten in place each time the protocol is re-run — do not treat an
old copy of this file as still valid; re-run Step 11 (Recalculate) first.

**Run date:** 2026-08-26, immediately after `CHECKPOINT-2026-08-26-001` (formal test case execution for TS-OPS-001/TS-AUDIT-001/TS-EXEC-001).

---

## Current State

- **Current phase:** Phase 3 — Asset Management, Phase 6 — Audit & Reconciliation, Phase 8 — Executive Dashboard & Reporting all touched by this checkpoint (test execution spans all three's requirements).
- **Current feature:** None actively in progress. Last work: formal execution of `TC-OPS-001-01..03`, `TC-AUDIT-001-01..03`, `TC-EXEC-001-01..02` against the real running app, per the user's explicit request ("รัน test case execution ก่อน").
- **Current task:** None in progress. Last task checkpoint: `CHECKPOINT-2026-08-26-001` (not yet shipped via PR at the time this file was written — see that checkpoint's Git section).
- **Last completed checkpoint:** `CHECKPOINT-2026-08-26-001`.
- **Current status:** 🟡 No code changed by this checkpoint (docs/test-execution only) — prior code-verification state (backend `go build`/`vet`/`test`; frontend `tsc`/`lint`/`vitest` 134/134/`build`) is unaffected and still holds.
- **Open blockers:** None for the newly-surfaced F-21 (QR/Barcode invalid-code state) — it's a confirmed, non-PRD-blocked defect. F-22 (Executive Dashboard vs. Prototype P-014) is not code-blocked either, but needs a scope decision from the business/design owner before code should be written toward it (see Priority Application).
- **Open findings:** F-01 through F-22 in `OPEN-FINDINGS.md`. **F-21 and F-22 are new** — found by this session's test execution, not previously tracked anywhere.
- **Remaining work:** `TC-AUDIT-001-01/-03`'s field-taxonomy/role-gate sub-scope and `TC-EXEC-001-01`'s NBV/Risk-formula sub-scope remain BLOCKED on PRD answers — this checkpoint didn't resolve those, it only confirmed what's actually testable now and recorded the real result.
- **Dependencies:** F-21 depends on nothing new — the Scan QR modal (`frontend/src/pages/Assets/index.tsx`) already exists; this is a validation/state addition to it.
- **Plan vs. actual variance:** The user chose test-case execution over the other option offered (confirming the Warranty field list PRD answer) — consistent with what was actually asked ("รัน test case execution ก่อน" = "run test case execution first").

## Incomplete Work Inventory (classified)

| Item | Classification | Note |
|---|---|---|
| F-21: QR/Barcode invalid-code state missing | `FINDING` (new, not blocked) | Confirmed defect against `AC-OPS-001-03`; no PRD question stands in the way — genuinely buildable now |
| F-22: Executive Dashboard vs. Prototype P-014 mismatch | `FINDING` (new, scope question) | Not a code task until the business/design owner says which direction is correct (update prototype, or build toward it) |
| Warranty field list (`RAISE-FR-WARRANTY-001`) | `FINDING` (F-01) | Still open — user was asked to confirm this and instead chose to run test execution first; the question remains live for a future turn |
| NBV/Risk/Utilization-mechanics KPIs (`RAISE-FR-EXEC-001` remainder) | Blocked on business decision | PRD §16 Q3/Q4/Q29 — now additionally entangled with F-22's scope question |
| Check-in/out workflow detail (`RAISE-FR-OPS-002`) | `FINDING` (F-02) | Blocked — PRD §16 Q11-13 |
| `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap | `FINDING` (F-10) | Unresolved scope question |
| Alerts, Oracle FA Integration, NL Search, Document Intelligence, User/Role Management backend | Blocked on business decision | See `CURRENT-STATUS.md` §4 |
| Ticket-domain audit *viewing* UI | Not started, not requested | Still true, unaffected by this checkpoint |
| Remaining `TC-*` formal executions (other suites not yet run this way) | `VALIDATION` | This checkpoint only ran 3 of the many suites in `RAISE-TEST-CASES.md` — the same exercise could surface more findings elsewhere, not yet done |
| No real user/auth store | `TECHNICAL_DEBT` | Accepted — Roadmap-confirmed |
| Frontend bundle size (F-18) | `TECHNICAL_DEBT` | Not urgent |
| License, AI Decision Center, Risk/Lifecycle/Recommendation | `ENHANCEMENT` (out of scope) | Roadmap-only |

## Priority Application

Per `NEXT-STEP-PROTOCOL.md` §Step 3: this session's test execution
produced exactly one genuinely "buildable now" item — **F-21** — the
first fresh candidate of that kind since the "needs a scoped-down first
cut" category was exhausted (per `CHECKPOINT-2026-08-25-005`'s own
framing). Unlike F-22, F-21 requires no business decision: `AC-OPS-001-03`
already says precisely what's required ("an 'invalid code' state is
shown with a retry option"), the AC is not attached to any PRD Open
Question, and the fix is scoped to one existing component. F-22 is
deliberately **not** promoted to "buildable now," even though it's also
non-PRD-blocked in the technical sense — building toward Prototype
P-014's tile/section names without confirming that's still the intended
direction would risk inventing scope the business hasn't actually
signed off on (the shipped Dashboard may be the deliberately-chosen
direction, with the prototype simply never updated to match — this
session's evidence can't distinguish "bug" from "stale spec").

---

## Primary Next Step

**Fix F-21 — add a distinct "invalid code" state to the Scan QR flow
(`frontend/src/pages/Assets/index.tsx`), separate from "not found," per
`AC-OPS-001-03`.**

## Why This Is Next

It is the only finding from this session's test execution that is both
genuinely actionable (no PRD/business answer needed) and small in scope
(one component, one new UI state). F-22 needs a business/design
decision first (see Priority Application); everything else in the
inventory above is either already-known-blocked or not a code task.

## Dependencies

None beyond the already-built Scan QR modal itself.

## Expected Output

- **Inspect existing implementation first** (Step 8.1) — re-read the
  `handleScanSubmit` function in `frontend/src/pages/Assets/index.tsx`
  and decide what "invalid/unreadable code" should mean in practice for
  a manually-typed or scanner-typed input (e.g. a basic format check —
  the confirmed asset code pattern is `AST-####` per the seeded fixture
  data and `CreateAsset`'s code-generation logic — vs. treating any
  input that doesn't match that pattern as "invalid" before even
  attempting a lookup). Do not invent a stricter validation rule than
  what the AC/prototype actually describes (a "malformed/unreadable"
  distinction, not a business rule about code format).
- Add a distinct error state/message in the Scan QR modal for that case,
  with the same retry affordance the "not found" state already has.
- Consider whether the same distinction should apply to the equivalent
  scan/lookup path server-side, if one is later built — out of scope for
  this fix (the current implementation is entirely frontend/mock-driven
  for this flow).

## Acceptance Criteria

`AC-OPS-001-03` (already-confirmed text, no PRD question attached) — "Given
an invalid or unreadable code is scanned, when the scan completes, then
an 'invalid code' state is shown with a retry option."

## Validation Method

- Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`.
- Browser-verify: re-run `TC-OPS-001-03` exactly as executed in
  `CHECKPOINT-2026-08-26-001` (scan `%%$#!!garbage///` or similar) and
  confirm a distinct "invalid code" message now appears, separate from
  the "not found" message from `TC-OPS-001-02`.
- Re-update `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-OPS-001` row from
  `PARTIAL` to `PASS` once confirmed, and mark F-21 Resolved in
  `OPEN-FINDINGS.md`.

## Related Checkpoint

`CHECKPOINT-2026-08-26-001` (this recalculation's basis — the checkpoint
that found F-21).

## Related Git Branch/Commit

None yet — not started.

---

## Risks / Blockers

Low risk — small, well-scoped UI change with a clear AC and an existing
component to modify. The only judgment call is exactly how to detect
"invalid/unreadable" vs. "not found," which should stay minimal (format
check, not a new business rule) per the Expected Output note above.

## Files to Update (after implementation, per Step 10)

`PROJECT-TIMELINE.md` (Phase 3 risk line), `PROJECT-CHECKPOINTS.md` (new
Level 1 checkpoint), `DEVELOPMENT-LOG.md`, `CURRENT-STATUS.md`,
`CHANGELOG.md`, `OPEN-FINDINGS.md` (resolve F-21),
`RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-OPS-001` row → `PASS`), this
file (recalculated per Step 11).

## After Completion

Recalculate from updated project state. F-22 (Dashboard/Prototype
mismatch) should be raised with the business/design owner separately —
it is not automatically "next" after F-21 just because it's the other
new finding; it needs a decision this protocol can't make on its own.
Consider also whether running the same formal-test-execution exercise
against other not-yet-executed suites in `RAISE-TEST-CASES.md` is worth
doing again, now that this session has shown it surfaces real findings
rather than just re-confirming known blockers.
