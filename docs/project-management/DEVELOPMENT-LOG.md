# RAISE — Development Log

**Purpose:** the raw, technical, PR-by-PR engineering log — one entry per
merged pull request, in merge order, with enough detail to know what
actually changed without opening GitHub. This is the most granular file in
`docs/project-management/` — for a zoomed-out narrative grouped by phase,
see [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md); for stakeholder-facing
"what's new," see [`CHANGELOG.md`](CHANGELOG.md); for the current
point-in-time snapshot, see [`CURRENT-STATUS.md`](CURRENT-STATUS.md).

**Maintenance rule:** append one row per merged PR, immediately after
merging (same step as updating `CHANGELOG.md`). Never edit past rows except
to fix a factual error. Regenerate/verify with:
```
git log --merges --oneline --format="%h %ad %s" --date=short
gh pr view <n> --json title,mergedAt,body
```

---

| # | Date | Branch | Summary | Layer(s) touched |
|---|---|---|---|---|
| [#1](https://github.com/boonthepkstl-alt/stl_asset_service/pull/1) | 2026-08-21 | `wip/backend-rbac-wiring-unconfirmed` | Wire `RequireRole` middleware to admin-gated sample routes | Backend (middleware) |
| [#2](https://github.com/boonthepkstl-alt/stl_asset_service/pull/2) | 2026-08-22 | `prd/close-needs-prd-confirmation-items` | Close all 6 `NEEDS_PRD_CONFIRMATION` items from FRONTEND-FOUNDATION-BASELINE.md | Docs (PRD) |
| [#3](https://github.com/boonthepkstl-alt/stl_asset_service/pull/3) | 2026-08-22 | `chain-sync/license-maint-rbac-workflow` | Sync deliverable chain for Maintenance workflow, License scope (Roadmap), RBAC enforcement level | Docs (Design/Prototype/AC/Test Plan/Test Cases) |
| [#4](https://github.com/boonthepkstl-alt/stl_asset_service/pull/4) | 2026-08-22 | `frontend/gate-roadmap-license-ai-features` | Gate Roadmap-only Licenses/AI Decision Center pages behind a feature flag | Frontend |
| [#5](https://github.com/boonthepkstl-alt/stl_asset_service/pull/5) | 2026-08-22 | `frontend/login-restyle-and-dev-server-autoport` | Restyle Login page (split-panel); make dev server port configurable | Frontend |
| [#6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6) | 2026-08-22 | `template/fix-react-template-build-errors` | Fix react-template-main build failure (unused imports) | Template |
| [#7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7) | 2026-08-22 | `backend/asset-domain` | **Add RAISE Asset Registry domain** to go-template-main (`RAISE-FR-ASSET-001`) | Backend |
| [#8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8) | 2026-08-23 | `frontend/wire-asset-repository-to-api` | Wire frontend `asset-repository` to the new go-template-main Asset API | Frontend |
| [#9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9) | 2026-08-23 | `backend/employee-domain` | **Add RAISE Employee domain** to go-template-main + wire frontend | Backend + Frontend |
| [#10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10) | 2026-08-23 | `backend/fix-login-response-contract` | Fix login response contract: bare object, camelCase, token in body | Backend + Frontend |
| [#11](https://github.com/boonthepkstl-alt/stl_asset_service/pull/11) | 2026-08-24 | `backend/maintenance-domain` | **Add RAISE Maintenance/Ticket domain** (`RAISE-FR-MAINT-001`) | Backend + Frontend |
| [#12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12) | 2026-08-24 | `docs/sync-nfr-backlog-full-chain` | Sync deliverable chain: NFR backlog acknowledgment + traceability Gap 6 fix | Docs |
| [#13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13) | 2026-08-24 | `backend/asset-checkin` | **Add Asset Check-in** (`RAISE-FR-OPS-002`), wire real Assign flow | Backend + Frontend |
| [#14](https://github.com/boonthepkstl-alt/stl_asset_service/pull/14) | 2026-08-24 | `docs/project-timeline-tracker` | Add project timeline/checkpoint tracker (single-file version, later restructured) | Docs |
| [#15](https://github.com/boonthepkstl-alt/stl_asset_service/pull/15) | 2026-08-24 | `docs/technical-design-hla-api-db-detailed` | Add High-Level Architecture, API/DB Spec, and Detailed Design docs | Docs |
| [#16](https://github.com/boonthepkstl-alt/stl_asset_service/pull/16) | 2026-08-24 | `docs/project-management-restructure` | Split `RAISE-PROJECT-TIMELINE.md` into six focused files (this one, `PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md`, `CURRENT-STATUS.md`) | Docs |
| [#17](https://github.com/boonthepkstl-alt/stl_asset_service/pull/17) | 2026-08-24 | `docs/timeline-10-phase-roadmap` | Redesign `PROJECT-TIMELINE.md` as a 10-phase capability roadmap | Docs |
| [#18](https://github.com/boonthepkstl-alt/stl_asset_service/pull/18) | 2026-08-24 | `docs/checkpoints-structured-template` | Rewrite `PROJECT-CHECKPOINTS.md` with the structured template (17 PRs retroactively converted) + add `SESSION-CLOSEOUT-PROTOCOL.md` (14-step close-out checklist, 3-level checkpoint model) | Docs |
| [#19](https://github.com/boonthepkstl-alt/stl_asset_service/pull/19) | 2026-08-24 | `docs/claude-md-refresh` | Refresh `CLAUDE.md` to match actual project state | Docs |
| [#20](https://github.com/boonthepkstl-alt/stl_asset_service/pull/20) | 2026-08-24 | `docs/claude-md-session-protocol-rule` | Make the Development Session Close-Out Protocol a binding `CLAUDE.md` rule | Docs |
| [#21](https://github.com/boonthepkstl-alt/stl_asset_service/pull/21) | 2026-08-24 | `docs/baseline-checkpoint-2026-08-24` | Add `BASELINE-CHECKPOINT-2026-08-24` from a live git/source-code scan | Docs |
| [#22](https://github.com/boonthepkstl-alt/stl_asset_service/pull/22) | 2026-08-24 | `docs/next-step-protocol` | Add the Next-Step Development Protocol and run it against current state | Docs |
| [#23](https://github.com/boonthepkstl-alt/stl_asset_service/pull/23) | 2026-08-24 | `frontend/login-brand-styling` | Apply stakeholder brand proposal to the Login page (generic pass, later superseded by Singer CI) | Frontend |
| [#24](https://github.com/boonthepkstl-alt/stl_asset_service/pull/24) | 2026-08-24 | `frontend/singer-ci-login-branding` | Re-theme Login to Singer's confirmed Corporate Identity (`#E50040`/`#A80331` red accent, sourced from the live `singerthai.co.th` site) | Frontend + Docs (PRD Resolved Q39, Brand Style Guide) |
| [#25](https://github.com/boonthepkstl-alt/stl_asset_service/pull/25) | 2026-08-24 | `frontend/singer-ci-shell-logo` | Extend the Singer CI logo mark (`RaiseMark`) to the app shell sidebar | Frontend |
| [#26](https://github.com/boonthepkstl-alt/stl_asset_service/pull/26) | 2026-08-24 | `frontend/login-panel-revert-to-blue` | Revert Login illustration panel from black back to blue, keeping Singer-red accents | Frontend |
| [#27](https://github.com/boonthepkstl-alt/stl_asset_service/pull/27) | 2026-08-24 | `frontend/dashboard-singer-ci-kpi` | Add Singer CI accent to the Software Licenses KPI card only (Total Assets left blue to avoid colliding with the adjacent Expired Warranty alert card) | Frontend |
| [#28](https://github.com/boonthepkstl-alt/stl_asset_service/pull/28) | 2026-08-25 | `docs/timeline-checkpoints-18-27` | Add PR #18-27 checkpoint links to `PROJECT-TIMELINE.md` | Docs |
| [#29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29) | 2026-08-25 | `feature/qr-barcode-identification` | **Implement QR/Barcode Identification** (`RAISE-FR-OPS-001`) — real scannable QR generation, working Scan QR lookup-and-navigate flow, dual id/code lookup (frontend mock repo + backend SQL) | Backend + Frontend |
| [#30](https://github.com/boonthepkstl-alt/stl_asset_service/pull/30) | 2026-08-25 | `docs/qr-barcode-closeout` | Close out QR/Barcode session per `SESSION-CLOSEOUT-PROTOCOL.md` — checkpoint, backfilled PR #18-29 log rows, status/timeline/changelog updates | Docs |
| [#31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31) | 2026-08-25 | `feature/audit-log-first-cut` | **Implement Audit Log first cut** (`RAISE-FR-AUDIT-001`) — new `audit_logs` table/model/repository/service/controller (read-only, no update/delete path), recording wired into Asset create/assign/check-in, real Audit tab on Asset Detail replacing the old fake static list | Backend + Frontend |
| [#32](https://github.com/boonthepkstl-alt/stl_asset_service/pull/32) | 2026-08-25 | `docs/audit-log-closeout` | Close out Audit Log session per `SESSION-CLOSEOUT-PROTOCOL.md` — checkpoint, status/timeline/changelog updates, `NEXT-STEP.md` recalculation | Docs |
| [#33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33) | 2026-08-25 | `feature/executive-dashboard-kpi-backend` | **Move Executive Dashboard KPI computation to backend** (`RAISE-FR-EXEC-001`) — new `GET /dashboard/stats` composing over the existing Asset domain (status counts, expired warranty, department/type distribution); no NBV/Risk formula added, none of that PRD-open math existed before or exists now | Backend + Frontend |
| [#34](https://github.com/boonthepkstl-alt/stl_asset_service/pull/34) | 2026-08-25 | `docs/executive-dashboard-closeout` | Close out Executive Dashboard KPI session per `SESSION-CLOSEOUT-PROTOCOL.md` — checkpoint, status/timeline/changelog updates, `NEXT-STEP.md` recalculation | Docs |
| [#35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35) | 2026-08-25 | `feature/ticket-domain-audit-hookin` | **Extend Audit Log to the Ticket domain** (`RAISE-FR-AUDIT-001`) — wires `AuditService.Record` into `CreateTicket`/`DecideApproval`/`Dispatch`/`UpdateExecutionStatus` (backend) and the equivalent `MockTicketRepository` methods (frontend), closing PR #31's deferred Ticket-domain gap | Backend + Frontend |
| [#36](https://github.com/boonthepkstl-alt/stl_asset_service/pull/36) | 2026-08-25 | `docs/ticket-audit-closeout` | Close out Ticket-domain audit hook-in session per `SESSION-CLOSEOUT-PROTOCOL.md`, plus backfill Level 1 checkpoints for PR #19-28 (closing F-20 as R-04) | Docs |
| [#37](https://github.com/boonthepkstl-alt/stl_asset_service/pull/37) | 2026-08-26 | `docs/tc-execution-ops-audit-exec` | **Run formal test case execution** for `TS-OPS-001`/`TS-AUDIT-001`/`TS-EXEC-001` (8 test cases) against the real running app — updates `RAISE-TRACEABILITY-MATRIX.md` with real evidence-based Test Status, corrects two stale "no code exists yet" passages, finds two new confirmed defects (F-21, F-22) | Docs |
| [#38](https://github.com/boonthepkstl-alt/stl_asset_service/pull/38) | 2026-08-26 | `frontend/fix-scan-qr-invalid-code-state` | **Fix F-21** — Scan QR now shows a distinct "invalid code" message for malformed input, separate from "not found" (`AC-OPS-001-03`); `RAISE-FR-OPS-001` now `PASS` on all 3 test cases | Frontend |
| [#39](https://github.com/boonthepkstl-alt/stl_asset_service/pull/39) | 2026-08-26 | `docs/tc-execution-asset-registry-detail-custody` | **Run formal test case execution** for `TS-ASSET-001`/`TS-ASSET-001-DETAIL`/`TS-ASSET-002`/`TS-ASSET-003` (11 test cases) against the real running app — finds 4 new confirmed defects (F-23: no Category filter, F-24: Asset Detail missing Financial/Lifecycle sections, F-25: no Category & Hierarchy screen, F-26: Custody History not append-only). A second commit on this same branch then **fixes F-23** — adds a working Category filter to the Assets page's Filters panel, wired into the mock repository (not the HTTP one, since `go-template-main`'s `GET /assets` has no category query param yet); `RAISE-FR-ASSET-001` now only fails on the still-open F-24. *(Row content updated 2026-08-26 to reflect the second commit — this row is written before the PR is confirmed merged, per this file's PR-prediction convention; verify against `gh pr view 39` before treating it as final.)* | Docs + Frontend |
