# RAISE — Project Timeline & Checkpoints

**Purpose:** track development progress against the RAISE PRD/Design/Prototype
chain (`docs/01-requirements/` … `docs/07-traceability-matrix/`) — this is a
**process/tracking document, not a deliverable-chain stage**. It does not
carry requirement IDs and is never cited as a requirement source; it only
records what has shipped, when, and what's queued next. When it disagrees
with git history or the traceability matrix, those are authoritative — update
this file to match them, not the other way around.

**Maintenance rule:** append a new row to §2 (Timeline) every time a PR
merges into `main`. Update §3 (Current State Snapshot) whenever a domain
moves between Not started / Mock-only / Backend-wired. Review §4 (Checkpoint
Backlog) against `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md`
§3 whenever that matrix is re-synced, since it's the source of truth for
which requirements are BLOCKED on an open PRD question vs. ready to build.

---

## 1. How to read this document

- **Timeline (§2)** is a flat, chronological log of merged PRs — one row per
  PR, in merge order. It is derived from `git log --merges` / `gh pr view`,
  not hand-maintained prose, so it can always be regenerated if it drifts.
- **Current State Snapshot (§3)** is a point-in-time table of which backend
  domains exist for real (Postgres-backed, `go-template-main`) vs. which
  frontend features still run on `Mock*Repository` fixtures only.
- **Checkpoint Backlog (§4)** is not a committed roadmap — it's a triaged
  list pulled from the traceability matrix's BLOCKED items and the PRD's
  Roadmap section, sorted into "buildable now" vs. "needs a business
  decision first" vs. "explicitly out of scope." Picking the next checkpoint
  from this list is a conversation each time, not an automatic queue.

---

## 2. Timeline (merged PRs, chronological)

| Date | PR | Summary |
|---|---|---|
| 2026-08-21 | [#1](https://github.com/boonthepkstl-alt/stl_asset_service/pull/1) | Wire `RequireRole` middleware to admin-gated sample routes |
| 2026-08-22 | [#2](https://github.com/boonthepkstl-alt/stl_asset_service/pull/2) | Close all 6 `NEEDS_PRD_CONFIRMATION` items from FRONTEND-FOUNDATION-BASELINE.md |
| 2026-08-22 | [#3](https://github.com/boonthepkstl-alt/stl_asset_service/pull/3) | Sync deliverable chain for Maintenance workflow, License scope (Roadmap), RBAC enforcement level |
| 2026-08-22 | [#4](https://github.com/boonthepkstl-alt/stl_asset_service/pull/4) | Gate Roadmap-only Licenses/AI Decision Center pages behind a feature flag |
| 2026-08-22 | [#5](https://github.com/boonthepkstl-alt/stl_asset_service/pull/5) | Restyle Login page (split-panel); make dev server port configurable |
| 2026-08-22 | [#6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6) | Fix react-template-main build failure (unused imports) |
| 2026-08-22 | [#7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7) | **Add RAISE Asset Registry domain** to go-template-main (`RAISE-FR-ASSET-001`) |
| 2026-08-23 | [#8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8) | Wire frontend `asset-repository` to the new go-template-main Asset API |
| 2026-08-23 | [#9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9) | **Add RAISE Employee domain** to go-template-main + wire frontend |
| 2026-08-23 | [#10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10) | Fix login response contract: bare object, camelCase, token in body |
| 2026-08-24 | [#11](https://github.com/boonthepkstl-alt/stl_asset_service/pull/11) | **Add RAISE Maintenance/Ticket domain** (`RAISE-FR-MAINT-001`) |
| 2026-08-24 | [#12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12) | Sync deliverable chain: NFR backlog acknowledgment + traceability Gap 6 fix |
| 2026-08-24 | [#13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13) | **Add Asset Check-in** (`RAISE-FR-OPS-002`), wire real Assign flow |
| 2026-08-24 | [#14](https://github.com/boonthepkstl-alt/stl_asset_service/pull/14) | Add project timeline/checkpoint tracker (`docs/project-management/`) |
| 2026-08-24 | *(this PR)* | Add High-Level Architecture, API/DB Spec, and Detailed Design docs (`docs/08-architecture/`, `docs/09-api-db-spec/`, `docs/10-detailed-design/`) |

*(To regenerate/verify this table: `git log --merges --oneline --format="%h %ad %s" --date=short` plus `gh pr view <n> --json title,mergedAt` for each PR number.)*

---

## 3. Current State Snapshot (as of 2026-08-24, after PR #13)

### Backend domains (`go-template-main`, PostgreSQL-backed, real endpoints)

| Domain | Requirement | Status | Notes |
|---|---|---|---|
| Asset Registry | `RAISE-FR-ASSET-001` | ✅ Built (PR #7) | CRUD + list/filter |
| Asset Assign | `RAISE-FR-ASSET-003` / `OPS-002` (partial) | ✅ Built (PR #7, #13) | Assign + Check-in (symmetric inverse); no approval step, no history log — holder data model still TBD (PRD §16 Q13) |
| Employee | (supports `RAISE-FR-ASSET-003`) | ✅ Built (PR #9) | CRUD + list/filter |
| Maintenance / Ticket | `RAISE-FR-MAINT-001` | ✅ Built (PR #11) | 4-stage workflow (confirmed shape); SLA/vendor/cost model, delegated-approver config, `changeAsset`/`changeRequester` deliberately not implemented — not in confirmed AC set |
| Auth | (supports `RAISE-NFR-SEC-RBAC-001`) | ✅ Built, demo-only | Hardcoded single demo user (`admin`/`password`) — real user store not built, RBAC backend enforcement deferred to Roadmap (PRD §16 Resolved Question 38) |

### Frontend features still Mock-only (no backend endpoint exists)

| Feature | Requirement | Notes |
|---|---|---|
| Warranty | `RAISE-FR-WARRANTY-001` | Only field is `Asset.warrantyExpiry`, already in the Asset domain — no separate entity exists to build; field list beyond that is Open Question (PRD §16 Q15) |
| QR / Barcode | `RAISE-FR-OPS-001` | No blockers listed in traceability matrix — candidate for next backend work |
| License | `RAISE-FR-LICENSE-001` | **Roadmap, not MVP** (confirmed 2026-08-21) — gated behind `ROADMAP_FEATURES_ENABLED`, do not build backend for this without a scope change |
| AI Decision Center | `RAISE-AI-RECOMMEND-001` | **Roadmap** — gated behind `ROADMAP_FEATURES_ENABLED` |
| Alerts | `RAISE-FR-ALERT-001` | Trigger rules/channels TBD |
| Audit Log | `RAISE-FR-AUDIT-001` | Field taxonomy TBD |
| Executive Dashboard | `RAISE-FR-EXEC-001` | Currently client-computed from mock asset/license data; NBV/Risk KPI formulas TBD |
| Oracle FA Integration | `RAISE-FR-ORACLE-001` | Integration method/mapping/sync/security all TBD |
| Natural Language Search | `RAISE-AI-SEARCH-001` | Citation precision/format TBD |
| Document Intelligence (OCR/Metadata/Classification/Dup-detection) | `RAISE-AI-DOC-001..004` | All BLOCKED (full) — confidence thresholds / field lists / matching rules undefined |
| Asset Lifecycle Connectivity | `RAISE-FR-LIFE-001` | Foundation-level, partially blocked; Disposal terminal stage confirmed Roadmap-only |
| User/Role Management | (supports `RAISE-NFR-SEC-RBAC-001`) | `user-service.ts`/`role-service.ts` are mock-only; no real Users/Roles table — backend RBAC enforcement itself is confirmed Roadmap, not MVP |

---

## 4. Checkpoint Backlog

Pulled from `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` §3–§5.
Re-check that file for the current BLOCKED/NOT_TESTED status before picking
an item — it may have changed since this was last written.

### Buildable now (no open PRD question blocking a first backend cut)

- **QR / Barcode (`RAISE-FR-OPS-001`)** — traceability matrix lists this as
  `NOT_TESTED (no blockers)`, the only MVP requirement with that status.
  Best next candidate by the same reasoning used for Warranty/Check-in.

### Needs a scoped-down first cut (like Maintenance/Check-in were)

These have real, confirmed AC groups but with some fields/rules still TBD —
buildable if scoped to only the confirmed parts, same pattern as
Maintenance's 4-stage shape (confirmed) vs. SLA/vendor/cost (deferred):

- **Audit Log (`RAISE-FR-AUDIT-001`)** — event taxonomy TBD, but an
  append-only log of the mutations already happening (asset create/assign/
  check-in, ticket create/approve/dispatch/status) could be built without
  inventing a taxonomy, if scoped to "record what already happens."
- **Executive Dashboard (`RAISE-FR-EXEC-001`)** — moving the already-real
  client-side KPI computations (`dashboard-service.ts`) to backend query
  endpoints, without inventing the still-TBD NBV/Risk formulas.

### Blocked on a business decision (do not silently invent)

- **Warranty (`RAISE-FR-WARRANTY-001`)** — field list beyond `warrantyExpiry`
  is Open Question (PRD §16 Q15).
- **Alerts (`RAISE-FR-ALERT-001`)** — trigger rules/channels TBD; also
  depends on Warranty + Maintenance.
- **Oracle FA Integration (`RAISE-FR-ORACLE-001`)** — integration
  method/mapping/sync/security all TBD (PRD §16 Q6–Q10).
- **Natural Language Search / Document Intelligence (`RAISE-AI-*`)** —
  confidence thresholds, field lists, matching rules all TBD.
- **User/Role Management backend** — RBAC backend enforcement is
  confirmed **Roadmap, not MVP** (PRD §16 Resolved Question 38); building
  a real Users/Roles domain now would be pre-empting a business decision
  that was explicitly deferred.

### Explicitly out of scope (Roadmap/Pilot — do not build without a PRD scope change first)

`RAISE-FR-LICENSE-001` (License Management), `RAISE-AI-RECOMMEND-001` (AI
Decision Center), `RAISE-AI-RISK-001` (Risk Scoring), `RAISE-AI-LIFECYCLE-001`
(Lifecycle Prediction), Asset Disposal, real-time ERP integration, native
mobile app, predictive analytics, workflow automation, multi-channel alerts.
Per the traceability matrix: promoting any of these to MVP means re-entering
the chain at `RAISE-PRD.md` first — this backlog will not be back-filled with
work that skipped that step.

---

## 5. Process notes

- Every checkpoint so far has followed: implement (backend → frontend wiring,
  mirroring the confirmed Mock behavior exactly) → verify (build/vet/test on
  both sides, browser-verify UI changes) → branch → PR → **wait for explicit
  merge instruction** → merge → pull `main` → delete branch. Keep following
  this pattern; don't auto-merge.
- When a checkpoint surfaces a requirement gap or an invented detail
  temptation, flag it (in the PR body and/or the traceability matrix) rather
  than guessing — this has been the norm throughout §2 and should stay the
  norm going forward.
