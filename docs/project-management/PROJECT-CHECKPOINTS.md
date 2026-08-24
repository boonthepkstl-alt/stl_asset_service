# RAISE — Project Checkpoints

**Purpose:** defines what counts as a checkpoint in this project and
records each load-bearing one with its verification evidence. Where
[`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) lists *every* merged PR,
this file lists only the checkpoints that changed what the system can
actually do — the domain-adding and process-defining ones — with proof
that each was verified before merge, not just claimed.

---

## 1. What a Checkpoint Is

A checkpoint is a merged PR that either (a) adds or changes real backend
or frontend behavior, or (b) establishes a process convention future work
follows. Every checkpoint in this project has followed the same sequence:

1. **Implement** — mirror the frontend's already-approved `Mock*Repository`
   behavior exactly when porting to a real backend; don't invent behavior
   the mock doesn't already have.
2. **Verify** — run the full check on both sides before opening a PR:
   - Backend: `go build ./...`, `go vet ./...`, `gofmt -l`, `go test ./...`
   - Frontend: `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`
   - UI changes additionally verified live in the browser, not just by test
     suite (see individual checkpoints below for what was clicked through)
3. **Branch → PR** — a feature branch off `main`, pushed, PR opened against
   `main` with a body describing what changed and what was deliberately
   left out.
4. **Wait for an explicit merge instruction** — never auto-merge.
5. **Merge → sync → cleanup** — `gh pr merge`, `git pull origin main`,
   delete the branch locally and on `origin`.

## 2. Load-Bearing Checkpoints

### Checkpoint: Asset Registry domain
**[PR #7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7)** · 2026-08-22 · `RAISE-FR-ASSET-001`

First real backend domain. Verified: `go build`/`vet`/`gofmt`/`test` clean;
mocked unit tests added at the service layer (a gap the company template
itself had — every prior template test needed a live DB).

### Checkpoint: Asset API wired to frontend
**[PR #8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8)** · 2026-08-23

`HttpAssetRepository` added behind `ASSET_API_ENABLED` (default off).
Verified: full frontend suite still green with the flag off; manually
verified with the flag on against a locally running backend.

### Checkpoint: Employee domain
**[PR #9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9)** · 2026-08-23

Same pattern as Asset, both backend and frontend in one PR. Verified: both
sides' full check suites green.

### Checkpoint: Login contract fix
**[PR #10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10)** · 2026-08-23

Found via live browser reproduction (not code review alone): backend sent
`{status, data:{expiresAt,user}}` snake_case with a cookie-only token;
frontend expected a bare camelCase object with the token in the body.
Business decision requested via explicit question — fix the backend, not
the frontend's auth model. Verified: real login flow re-tested in-browser
after the fix.

### Checkpoint: Maintenance / Ticket domain
**[PR #11](https://github.com/boonthepkstl-alt/stl_asset_service/pull/11)** · 2026-08-24 · `RAISE-FR-MAINT-001`

The most complex domain to date — nested JSONB storage (not flat columns),
4-stage state machine, two upstream domain dependencies (Employee, Asset)
resolved server-side. `changeAsset`/`changeRequester`/
`listDelegationSettings` explicitly scoped out (not in the confirmed AC
set) and flagged in code comments, not silently dropped. Verified: both
sides' full check suites green.

### Checkpoint: Asset Check-in + real Assign flow
**[PR #13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13)** · 2026-08-24 · `RAISE-FR-OPS-002`

`CheckInAsset` added as the confirmed, symmetric inverse of the existing
`AssignAsset` — deliberately narrow (no approval step, no persisted
history) because the exact workflow is still a PRD open question.
Verified end-to-end in-browser against a locally running backend: assign
→ check-in round trip, toasts, and the History tab's real-data rendering
all confirmed working, not just asserted from test output.

### Checkpoint: Traceability Gap 6 closure
**[PR #12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12)** · 2026-08-24

Closed a critical drift: an earlier matrix revision claimed to be current
against a PRD version it had not actually re-read. This checkpoint
re-verified every cross-reference against the real file content before
marking it resolved — the fix is the re-verification, not a restated claim.

### Checkpoint: Documentation tooling established
**[PR #14](https://github.com/boonthepkstl-alt/stl_asset_service/pull/14), [#15](https://github.com/boonthepkstl-alt/stl_asset_service/pull/15), and this restructuring**

Established `docs/project-management/` as an ongoing, self-maintaining
tracking layer (this file included), and added the as-built technical
documentation set (`docs/08-architecture/`, `docs/09-api-db-spec/`,
`docs/10-detailed-design/`) describing the system as it actually exists.

---

## 3. Next Checkpoint (not yet started)

Per [`CURRENT-STATUS.md`](CURRENT-STATUS.md) §4: **QR / Barcode**
(`RAISE-FR-OPS-001`) is the only remaining MVP requirement with no listed
blocker in the traceability matrix.
