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
| *(this PR)* | 2026-08-24 | `docs/project-management-restructure` | Split `RAISE-PROJECT-TIMELINE.md` into six focused files (this one, `PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md`, `CURRENT-STATUS.md`) | Docs |
