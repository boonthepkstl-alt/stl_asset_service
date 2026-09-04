# RAISE — Project Checkpoints

**Purpose:** a structured, per-checkpoint record — one entry per merged PR,
using the `CHECKPOINT-<YYYY-MM-DD>-<NNN>` ID scheme (`NNN` resets each day,
in merge order). This supersedes the earlier narrative-style checkpoint
list with a fixed template so every checkpoint reports the same fields.
For the PR-by-PR summary table, see
[`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md); for the capability-phase
roadmap these checkpoints roll up into, see
[`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md); for the current snapshot, see
[`CURRENT-STATUS.md`](CURRENT-STATUS.md).

**Template** (every new checkpoint uses exactly this field set):

```
CHECKPOINT-<YYYY-MM-DD>-<NNN>

Phase:
Feature:
Task:

What was implemented:
What was modified:
What was fixed:
What was added:
What was removed:

Files changed:
Database changes:
API changes:
Frontend changes:

Tests:
- Unit Test
- Integration Test
- E2E Test

Validation:
- Build
- Lint
- Test
- Type Check

Requirement Traceability:
PRD:
Design:
Acceptance Criteria:
Test Case:

Git:
Branch:
Commit:

Known Issues:
Remaining Work:
Next Step:
```

**Maintenance rule:** log a new checkpoint immediately after every merge —
same moment `DEVELOPMENT-LOG.md` and `CHANGELOG.md` get their rows. Leave a
field `None` when genuinely empty; never leave it blank (a blank field
reads as "forgot to check," `None` reads as "checked, nothing there"). This
file holds all three checkpoint levels defined in
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md) — Task
(§Level 1, below), Feature (§Level 2), and Phase (§Level 3). Run that
protocol's 14-step checklist before ending any development session.

---

## Level 1 — Task Checkpoints

## CHECKPOINT-2026-08-21-001

**Phase:** Phase 2 — Authentication / RBAC
**Feature:** RBAC middleware reference wiring
**Task:** Wire `RequireRole` middleware to the template's admin-gated sample routes

**What was implemented:** `RequireRole("admin")` gating on the template's demo `/samples` mutation routes (`POST`/`PUT`/`DELETE`), as the reference pattern any future RAISE domain's RBAC decision would point back to.
**What was modified:** `router/sampleRouter.go` route wiring; `FRONTEND-FOUNDATION-BASELINE.md` updated to record the decision.
**What was fixed:** None.
**What was added:** `middleware/requireRole_test.go` — regression coverage using the `BYPASS_JWT` test pattern (no real JWT/DB needed).
**What was removed:** None.

**Files changed:** `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md`, `go-template-main/middleware/requireRole_test.go`, `go-template-main/router/sampleRouter.go` (3 files, +169/-54)
**Database changes:** None.
**API changes:** None (gates existing demo routes; no new endpoint).
**Frontend changes:** None.

**Tests:**
- Unit Test: `middleware/requireRole_test.go` (new)
- Integration Test: None
- E2E Test: None

**Validation:**
- Build: Pass
- Lint: N/A (Go — no separate lint step beyond `go vet`)
- Test: Pass
- Type Check: N/A (Go)

**Requirement Traceability:**
PRD: `RAISE-NFR-SEC-RBAC-001` (reference pattern only — not yet applied to a real RAISE domain)
Design: N/A at this point (predates the Security Architecture section)
Acceptance Criteria: N/A
Test Case: N/A

**Git:**
Branch: `wip/backend-rbac-wiring-unconfirmed`
Commit: `62659df` (merge)

**Known Issues:** Gate applies only to the template's own demo domain, not any real RAISE domain.
**Remaining Work:** Apply (or deliberately defer, per PRD decision) to real domains once RBAC scope is confirmed.
**Next Step:** Confirm RBAC MVP enforcement level in the PRD — resolved later this cycle (see CHECKPOINT-2026-08-22-001).

---

## CHECKPOINT-2026-08-22-001

**Phase:** Phase 1 — Foundation
**Feature:** PRD requirements chain
**Task:** Close all 6 `NEEDS_PRD_CONFIRMATION` items raised by the design/prototype layer

**What was implemented:** Business confirmation for six previously-open items, recorded as PRD Resolved Questions.
**What was modified:** `docs/01-requirements/RAISE-PRD.md` (v0.1 draft → v0.9 line): Maintenance's 4-stage workflow shape confirmed; License Management confirmed Roadmap-only (`RAISE-FR-LICENSE-001` added); six ESAPS-reference-only pages confirmed out of scope; `RAISE-AI-RECOMMEND-001` re-confirmed Roadmap-only with no MVP subset; Oracle "Phase 6" code-comment label confirmed not a real PRD phase; `RAISE-NFR-SEC-RBAC-001` MVP enforcement level confirmed UI-only/client-side.
**What was fixed:** An earlier inaccurate draft statement of License Management's scope, corrected per the PRD's own Document Status change log.
**What was added:** `RAISE-FR-LICENSE-001` as a new requirement entry.
**What was removed:** None.

**Files changed:** `docs/01-requirements/RAISE-PRD.md` (1 file, +484/-27)
**Database changes:** None.
**API changes:** None.
**Frontend changes:** None (this PR is requirements-only; downstream docs/code follow in later checkpoints).

**Tests:** N/A — documentation-only change.

**Validation:**
- Build: N/A
- Lint: N/A
- Test: N/A
- Type Check: N/A

**Requirement Traceability:**
PRD: `RAISE-FR-MAINT-001`, `RAISE-FR-LICENSE-001`, `RAISE-AI-RECOMMEND-001`, `RAISE-FR-ORACLE-001`, `RAISE-NFR-SEC-RBAC-001`
Design: Not yet synced (next checkpoint)
Acceptance Criteria: Not yet synced
Test Case: Not yet synced

**Git:**
Branch: `prd/close-needs-prd-confirmation-items`
Commit: `d525604` (merge)

**Known Issues:** None.
**Remaining Work:** Propagate these six confirmations down through Design → Prototype → AC → Test Plan → Test Cases → Traceability Matrix.
**Next Step:** CHECKPOINT-2026-08-22-002 (chain sync).

---

## CHECKPOINT-2026-08-22-002

**Phase:** Phase 1 — Foundation
**Feature:** Deliverable chain sync
**Task:** Propagate PRD v0.9's confirmations through Design, Prototype, AC, Test Plan, Test Cases, and the Traceability Matrix

**What was implemented:** Full downstream sync of the Maintenance workflow shape, License scope (Roadmap), and RBAC enforcement level across all six remaining chain documents.
**What was modified:** `RAISE-DESIGN.md`, `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`, `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`, `RAISE-TRACEABILITY-MATRIX.md` — version bumps and new sections reflecting the PRD confirmations.
**What was fixed:** None.
**What was added:** License-related Design/Prototype sections marked Roadmap-only (not full MVP treatment).
**What was removed:** None.

**Files changed:** 6 files in `docs/02-design/` … `docs/07-traceability-matrix/` (+2025/-566)
**Database changes:** None.
**API changes:** None.
**Frontend changes:** None.

**Tests:** N/A — documentation-only change.

**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:**
PRD: `RAISE-FR-MAINT-001`, `RAISE-FR-LICENSE-001`, `RAISE-NFR-SEC-RBAC-001`
Design: Full chain re-sync
Acceptance Criteria: Full chain re-sync
Test Case: Full chain re-sync

**Git:**
Branch: `chain-sync/license-maint-rbac-workflow`
Commit: `2e9cd1c` (merge)

**Known Issues:** None at close of this checkpoint (a version-drift issue in the Traceability Matrix was introduced later and only caught in CHECKPOINT-2026-08-24-002).
**Remaining Work:** None for this cycle.
**Next Step:** Gate Roadmap-only frontend pages behind a feature flag (next checkpoint).

---

## CHECKPOINT-2026-08-22-003

**Phase:** Phase 1 — Foundation (prep for Phases 5 & 10)
**Feature:** Roadmap feature gating
**Task:** Gate Roadmap-only Licenses/AI Decision Center pages behind a feature flag

**What was implemented:** `ROADMAP_FEATURES_ENABLED` feature flag controlling visibility of nav items and routes for pages confirmed Roadmap-only.
**What was modified:** `App.tsx` (route filtering), `config/navigation.ts` (nav item filtering).
**What was fixed:** None.
**What was added:** `config/featureFlags.ts` (new file), `.env.example` entry, `.claude/launch.json` entry, `App.roadmap-gating.test.tsx`.
**What was removed:** None.

**Files changed:** `.claude/launch.json`, `frontend/.env.example`, `frontend/src/App.roadmap-gating.test.tsx`, `frontend/src/App.tsx`, `frontend/src/config/featureFlags.ts`, `frontend/src/config/navigation.ts`, `frontend/vitest.config.ts` (7 files, +135/-5)
**Database changes:** None.
**API changes:** None.
**Frontend changes:** Licenses and AI Decision Center nav entries/routes hidden by default.

**Tests:**
- Unit Test: None new
- Integration Test: `App.roadmap-gating.test.tsx` (new — verifies nav/route hiding)
- E2E Test: None

**Validation:**
- Build: Pass
- Lint: Pass
- Test: Pass
- Type Check: Pass

**Requirement Traceability:**
PRD: `RAISE-FR-LICENSE-001` (Roadmap), `RAISE-AI-RECOMMEND-001` (Roadmap)
Design: §4.1A, §5.3 (Roadmap, not MVP)
Acceptance Criteria: Traceability note only (no AC group, correctly per Roadmap rule)
Test Case: None (correctly, per Roadmap rule)

**Git:**
Branch: `frontend/gate-roadmap-license-ai-features`
Commit: `305efed` (merge)

**Known Issues:** None.
**Remaining Work:** None for MVP scope.
**Next Step:** Login page restyle (next checkpoint).

---

## CHECKPOINT-2026-08-22-004

**Phase:** Phase 2 — Authentication / RBAC (UI) / Phase 1 (dev tooling)
**Feature:** Login page, dev server config
**Task:** Restyle Login page to a split-panel layout; make the dev server port configurable

**What was implemented:** Split-panel Login page redesign (visual only — auth logic unchanged); `autoPort` support so the dev server doesn't hard-fail when its default port is occupied.
**What was modified:** `frontend/src/pages/Login/index.tsx`, `frontend/vite.config.ts`, `.claude/launch.json`.
**What was fixed:** Dev server failing to start when port 5173 was already in use.
**What was added:** None (visual restyle of an existing page).
**What was removed:** Prior single-column Login layout.

**Files changed:** `.claude/launch.json`, `frontend/src/pages/Login/index.tsx`, `frontend/vite.config.ts` (3 files, +167/-30)
**Database changes:** None.
**API changes:** None.
**Frontend changes:** Login page visual redesign (split-panel).

**Tests:**
- Unit Test: None new (existing Login tests still pass)
- Integration Test: None new
- E2E Test: Manually verified in-browser (visual redesign)

**Validation:**
- Build: Pass
- Lint: Pass
- Test: Pass
- Type Check: Pass

**Requirement Traceability:**
PRD: `RAISE-NFR-SEC-RBAC-001` (Login screen, P-001)
Design: No change (visual only)
Acceptance Criteria: AC-LOGIN (unchanged — visual restyle doesn't alter behavior)
Test Case: TC-LOGIN-01..03 (unchanged)

**Git:**
Branch: `frontend/login-restyle-and-dev-server-autoport`
Commit: `c818363` (merge)

**Known Issues:** None.
**Remaining Work:** None.
**Next Step:** Fix a pre-existing react-template-main build failure (next checkpoint).

---

## CHECKPOINT-2026-08-22-005

**Phase:** Phase 1 — Foundation
**Feature:** react-template-main (company template)
**Task:** Fix a pre-existing build failure in react-template-main

**What was implemented:** N/A (bug fix, not a feature).
**What was modified:** `react-template-main/src/components/ErrorBoundary.tsx`, `react-template-main/src/hooks/useLocalStorage.ts`.
**What was fixed:** Build failure caused by unused imports (2 lines) — fixed directly in the template per an explicit business decision (fix the template, not work around it downstream).
**What was added:** None.
**What was removed:** Unused imports; a stale `package-lock.json` entry.

**Files changed:** `react-template-main/package-lock.json`, `react-template-main/src/components/ErrorBoundary.tsx`, `react-template-main/src/hooks/useLocalStorage.ts` (3 files, +2/-14)
**Database changes:** None.
**API changes:** None.
**Frontend changes:** None user-visible (template-level build fix, not `frontend/`'s own code).

**Tests:** N/A — no test coverage change; fix verified by a successful build.

**Validation:**
- Build: Pass (was failing before this checkpoint)
- Lint: Pass
- Test: Pass
- Type Check: Pass

**Requirement Traceability:** N/A — template infrastructure fix, not a RAISE requirement.

**Git:**
Branch: `template/fix-react-template-build-errors`
Commit: `70388c4` (merge)

**Known Issues:** None.
**Remaining Work:** None.
**Next Step:** Begin real backend domain work — Asset Registry (next checkpoint).

---

## CHECKPOINT-2026-08-22-006

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Registry domain
**Task:** Add the RAISE Asset Registry domain to go-template-main

**What was implemented:** Full layered Asset domain — model, PG repository, repository facade, service, controller, router wiring, SQL migration.
**What was modified:** `router/sampleRouter.go` (route wiring).
**What was fixed:** None.
**What was added:** `model/assetModel.go`, `repository/assetRepository.go`, `repository/assetPGRepository.go`, `service/assetService.go` + `assetService_test.go`, `controller/assetController.go`, `sql/pg/V1__Assets_Table.sql`.
**What was removed:** None.

**Files changed:** 8 files in `go-template-main/` (+841/-0)
**Database changes:** New table `assets` (`sql/pg/V1__Assets_Table.sql`) — id, code, name, category, type, status, condition, location, department, assigned_to, assigned_employee_id, assigned_date, purchase_date, purchase_cost, current_value, warranty_expiry, vendor, serial_number, specs (jsonb); indexes on status, department.
**API changes:** New — `GET /assets`, `GET /assets/:id`, `POST /assets`, `POST /assets/:id/assign`.
**Frontend changes:** None yet (frontend wiring is the next checkpoint) — backend-only.

**Tests:**
- Unit Test: `service/assetService_test.go` — mocked in-memory repository, no live DB required
- Integration Test: None
- E2E Test: None

**Validation:**
- Build: Pass
- Lint: N/A (Go)
- Test: Pass
- Type Check: N/A (Go)

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-001`
Design: §4.1 Asset Management
Acceptance Criteria: AC-ASSET-001, AC-ASSET-001-DETAIL
Test Case: TC-ASSET-001-01..04, TC-ASSET-001-D-01..02

**Git:**
Branch: `backend/asset-domain`
Commit: `be06327` (merge)

**Known Issues:** Asset code generation deliberately deviates from the frontend mock's sequential `AST-0001` scheme (uses a UUID-fragment code instead) since sequential-by-list-length isn't meaningful server-side.
**Remaining Work:** Wire the frontend to this API (next checkpoint).
**Next Step:** CHECKPOINT-2026-08-23-001.

---

## CHECKPOINT-2026-08-23-001

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Registry domain
**Task:** Wire the frontend `asset-repository` to the new go-template-main Asset API

**What was implemented:** `HttpAssetRepository`, selected via a feature flag alongside the existing `MockAssetRepository`.
**What was modified:** `services/asset-service.ts` (flag-based repository selection), `services/api-client.ts` (base path fix), `frontend/.env.example`.
**What was fixed:** API base path mismatch that would have 404'd every real request (`/api` vs. an incorrect prior path).
**What was added:** `config/featureFlags.ts` `ASSET_API_ENABLED` flag; `asset-repository.http.test.ts`.
**What was removed:** None.

**Files changed:** `frontend/.env.example`, `frontend/src/config/featureFlags.ts`, `frontend/src/services/api-client.ts`, `frontend/src/services/asset-repository.http.test.ts`, `frontend/src/services/asset-repository.ts`, `frontend/src/services/asset-service.ts` (6 files, +211/-11)
**Database changes:** None.
**API changes:** None new — consumes CHECKPOINT-2026-08-22-006's endpoints.
**Frontend changes:** Asset pages can now run against the real backend when `ASSET_API_ENABLED=true`; default remains the mock (flag off).

**Tests:**
- Unit Test: `asset-repository.http.test.ts` (new — mocks `api-client.ts` directly)
- Integration Test: Existing Asset page test suite re-verified green with the flag off
- E2E Test: Manually verified in-browser against a locally running backend

**Validation:**
- Build: Pass
- Lint: Pass
- Test: Pass
- Type Check: Pass

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-001`
Design: §4.1 Asset Management
Acceptance Criteria: AC-ASSET-001
Test Case: TC-ASSET-001-01..04

**Git:**
Branch: `frontend/wire-asset-repository-to-api`
Commit: `fcdb4ae` (merge)

**Known Issues:** None.
**Remaining Work:** None for Asset Registry CRUD; Assign/Check-in came later (CHECKPOINT-2026-08-24-003).
**Next Step:** Employee domain (next checkpoint).

---

## CHECKPOINT-2026-08-23-002

**Phase:** Phase 3 — Asset Management
**Feature:** Employee domain
**Task:** Add the RAISE Employee domain to go-template-main and wire the frontend

**What was implemented:** Full layered Employee domain (backend) plus `HttpEmployeeRepository` (frontend), in one PR.
**What was modified:** `router/sampleRouter.go`, `services/employee-service.ts`.
**What was fixed:** None.
**What was added:** `model/employeeModel.go`, `repository/employeeRepository.go` + `employeePGRepository.go`, `service/employeeService.go` + test, `controller/employeeController.go`, `sql/pg/V2__Employees_Table.sql`; frontend `HttpEmployeeRepository`, `employee-repository.http.test.ts`, `EMPLOYEE_API_ENABLED` flag.
**What was removed:** None.

**Files changed:** 13 files across `go-template-main/` and `frontend/` (+1004/-6)
**Database changes:** New table `employees` — id, employee_code, name, email, phone, job_title, title, department, department_id, location, desk_location, manager, manager_id, status, avatar_color, initials, start_date, workstation_type, primary_os, assigned_count; indexes on department, status.
**API changes:** New — `GET /employees`, `GET /employees/:id`, `POST /employees`, `PUT /employees/:id`.
**Frontend changes:** Employee pages can run against the real backend behind `EMPLOYEE_API_ENABLED` (default off).

**Tests:**
- Unit Test: `service/employeeService_test.go` (mocked repository); `employee-repository.http.test.ts` (mocked api-client)
- Integration Test: Existing Employee page suite re-verified green
- E2E Test: None this checkpoint

**Validation:**
- Build: Pass (both sides)
- Lint: Pass
- Test: Pass (both sides)
- Type Check: Pass

**Requirement Traceability:**
PRD: supports `RAISE-FR-ASSET-003` (Custody History depends on Employee existing as a real domain)
Design: §4.2 Custody & Asset Operations
Acceptance Criteria: AC-ASSET-003 (partial — see Known Issues)
Test Case: TC-ASSET-003-01..03 (partial)

**Git:**
Branch: `backend/employee-domain`
Commit: `46c4b94` (merge)

**Known Issues:** Holder data model still undefined (PRD §16 Q13) — Employee existing doesn't itself resolve `RAISE-FR-ASSET-003`'s open question.
**Remaining Work:** None for Employee CRUD itself.
**Next Step:** A real login bug was found next (see CHECKPOINT-2026-08-23-003).

---

## CHECKPOINT-2026-08-23-003

**Phase:** Phase 2 — Authentication / RBAC
**Feature:** Login contract
**Task:** Fix login response contract mismatch

**What was implemented:** N/A (bug fix).
**What was modified:** `controller/authController.go`, `model/authModel.go`.
**What was fixed:** Backend sent `{status, data:{expiresAt,user}}` (snake_case, cookie-only token, lowercase role); frontend expected a bare `{token, expiresAt, user}` object (camelCase, uppercase `Role`). Found via live browser reproduction, not code review alone.
**What was added:** `token` field to the response body; camelCase JSON tags.
**What was removed:** The response-envelope wrapper (`status`/`data`) for this endpoint.

**Files changed:** `go-template-main/controller/authController.go`, `go-template-main/controller/sampleController_test.go`, `go-template-main/model/authModel.go` (3 files, +39/-15)
**Database changes:** None (Auth doesn't touch Postgres — demo credential check only).
**API changes:** Changed — `POST /auth/login` response shape (breaking change to the contract, not additive).
**Frontend changes:** None required — frontend's `LoginResponse` type was already correct; only the backend needed to match it.

**Tests:**
- Unit Test: `sampleController_test.go` updated for the new response shape
- Integration Test: None new
- E2E Test: Manually re-verified real login end-to-end in-browser after the fix

**Validation:**
- Build: Pass
- Lint: N/A (Go)
- Test: Pass
- Type Check: N/A (Go)

**Requirement Traceability:**
PRD: `RAISE-NFR-SEC-RBAC-001` (Login, P-001)
Design: §16 Security Architecture
Acceptance Criteria: AC-LOGIN
Test Case: TC-LOGIN-01..03

**Git:**
Branch: `backend/fix-login-response-contract`
Commit: `ce4493b` (merge)

**Known Issues:** None remaining from this bug.
**Remaining Work:** None.
**Next Step:** Maintenance/Ticket domain (next checkpoint).

---

## CHECKPOINT-2026-08-24-001

**Phase:** Phase 4 — ITSM
**Feature:** Maintenance / Ticket domain
**Task:** Add the RAISE Maintenance/Ticket domain to go-template-main

**What was implemented:** Full layered Ticket domain with the confirmed 4-stage workflow (User Requisition → Dept Approval → IT Dispatch → Technician Execution); JSONB-document storage (not flat columns) since a ticket embeds point-in-time Asset/Employee snapshots.
**What was modified:** `router/sampleRouter.go`; frontend `ticket-service.ts`.
**What was fixed:** None.
**What was added:** `model/ticketModel.go`, `repository/ticketRepository.go` + `ticketPGRepository.go`, `service/ticketService.go` + test, `controller/ticketController.go`, `sql/pg/V3__Tickets_Table.sql`; frontend `HttpTicketRepository`, `ticket-repository.http.test.ts`, `TICKET_API_ENABLED` flag.
**What was removed:** None.

**Files changed:** 13 files across `go-template-main/` and `frontend/` (+1615/-5)
**Database changes:** New table `tickets` (id, ticket_code, title, status, category, priority, department, requester_name, technician_name, asset_name, asset_code, `doc` jsonb; indexes on status, department) and `technicians` (seeded, read-only).
**API changes:** New — `GET/POST /tickets`, `GET /tickets/:code`, `POST /tickets/:code/{approval,dispatch,status}`, `GET /technicians`.
**Frontend changes:** Maintenance/Ticket pages can run against the real backend behind `TICKET_API_ENABLED` (default off).

**Tests:**
- Unit Test: `service/ticketService_test.go` (mocked repository + real Asset/Employee service instances); `ticket-repository.http.test.ts`
- Integration Test: Existing Maintenance/TicketDetail page suites re-verified green
- E2E Test: None this checkpoint

**Validation:**
- Build: Pass (both sides)
- Lint: Pass
- Test: Pass (both sides — 127 frontend tests, all backend Go tests)
- Type Check: Pass

**Requirement Traceability:**
PRD: `RAISE-FR-MAINT-001`
Design: §5.1 Maintenance Domain
Acceptance Criteria: AC-MAINT-001 (AC-MAINT-001-01..09)
Test Case: TC-MAINT-001-01..09

**Git:**
Branch: `backend/maintenance-domain`
Commit: `3d7fcb6` (merge)

**Known Issues:** `changeAsset`, `changeRequester`, `listDelegationSettings` deliberately not implemented — not part of the confirmed AC-MAINT-001-03..09 set, flagged in code comments rather than silently built or dropped.
**Remaining Work:** SLA-per-stage, vendor model, cost model, delegated-approver configuration rules — all PRD TBD.
**Next Step:** Traceability chain re-sync (next checkpoint) — a drift issue was found during this cycle.

---

## CHECKPOINT-2026-08-24-002

**Phase:** Phase 1 — Foundation
**Feature:** Deliverable chain / Traceability Matrix
**Task:** Sync deliverable chain for the PRD §10 NFR backlog; close Traceability Matrix Gap 6

**What was implemented:** NFR backlog (performance, availability, scalability, etc.) acknowledged as TBD at every layer of the chain; critical version-drift gap in the Traceability Matrix re-verified and closed.
**What was modified:** `RAISE-DESIGN.md` §16A, `RAISE-PROTOTYPE.md` §25A, `RAISE-ACCEPTANCE-CRITERIA.md` §19.9, `RAISE-TEST-PLAN.md` §3.3, `RAISE-TEST-CASES.md` §18.5, `RAISE-TRACEABILITY-MATRIX.md` (Gap 6 section + §4.2).
**What was fixed:** Gap 6 — the matrix had previously claimed to be current against a PRD version it had not actually re-verified. This checkpoint re-checked every citation against the real file content before closing it.
**What was added:** §4.2 cross-layer NFR acknowledgment table in the Traceability Matrix.
**What was removed:** None.

**Files changed:** 6 files in `docs/02-design/` … `docs/07-traceability-matrix/` (+905/-443)
**Database changes:** None.
**API changes:** None.
**Frontend changes:** None.

**Tests:** N/A — documentation-only change.

**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:**
PRD: PRD §10 (NFR backlog)
Design: §16A
Acceptance Criteria: §19.9 (no new AC groups — nothing testable to add)
Test Case: §18.5 (no new test cases — mirrors Test Plan §3.3)

**Git:**
Branch: `docs/sync-nfr-backlog-full-chain`
Commit: `9517581` (merge)

**Known Issues:** `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` scope overlap remains an unresolved question, restated (not newly discovered) in this cycle.
**Remaining Work:** None for this cycle's stated scope.
**Next Step:** Asset Check-in feature (next checkpoint).

---

## CHECKPOINT-2026-08-24-003

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Check-in
**Task:** Add Asset Check-in (`RAISE-FR-OPS-002`); wire the real Assign flow on Asset Detail

**What was implemented:** `CheckInAsset` as the confirmed, symmetric inverse of the existing `AssignAsset`; a real employee-picker Assign modal on the Asset Detail page (previously a dead-end toast); real Assignment History (previously hardcoded fixture rows).
**What was modified:** `service/assetService.go`, `controller/assetController.go`, `router/sampleRouter.go`; frontend `AssetDetail/index.tsx`, `asset-repository.ts`, `asset-service.ts`.
**What was fixed:** The "Assign" quick action, which previously only showed a placeholder toast and never called the real service.
**What was added:** `POST /assets/:id/checkin` endpoint; `assetService_test.go` new cases; `asset-repository.http.test.ts` new case.
**What was removed:** Hardcoded fixture rows in the Assignment History tab (`'Assigned to Sarah Chen', '2024-01-15'...`).

**Files changed:** 8 files across `go-template-main/` and `frontend/` (+196/-6)
**Database changes:** None (reuses the existing `assets` table).
**API changes:** New — `POST /assets/:id/checkin`.
**Frontend changes:** Real Assign modal (employee picker), Check-in quick action, real Assignment History.

**Tests:**
- Unit Test: `TestCheckInAsset_ClearsAssignmentAndSetsAvailable`, `TestCheckInAsset_UnknownIDReturnsNotFound`; `asset-repository.http.test.ts` new case
- Integration Test: Existing AssetDetail page suite re-verified green
- E2E Test: Manually verified in-browser against a locally running backend — assign → check-in round trip, toasts, and History tab confirmed working

**Validation:**
- Build: Pass (both sides)
- Lint: Pass (0 warnings)
- Test: Pass (127 frontend tests, all backend Go tests)
- Type Check: Pass

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-003` (partial), `RAISE-FR-OPS-002` (partial)
Design: §4.2 Custody & Asset Operations
Acceptance Criteria: AC-ASSET-003, AC-OPS-002 (both still partial — workflow/holder model TBD)
Test Case: TC-ASSET-003-01..03, TC-OPS-002-01..03 (partial)

**Git:**
Branch: `backend/asset-checkin`
Commit: `3815a13` (merge)

**Known Issues:** No approval step, no permission gate beyond `JWTAuth`, no persisted multi-event history — deliberate, per PRD §16 Q11-Q13 being open.
**Remaining Work:** Full workflow/holder-model detail once PRD answers those questions.
**Next Step:** Project-management tracking layer established (next checkpoint).

---

## CHECKPOINT-2026-08-24-004

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking
**Task:** Add a project timeline/checkpoint tracker

**What was implemented:** The first version of `docs/project-management/` — a single-file tracker (later restructured into six files, see CHECKPOINT-2026-08-24-006).
**What was modified:** None (new folder).
**What was fixed:** None.
**What was added:** `docs/project-management/RAISE-PROJECT-TIMELINE.md`.
**What was removed:** None.

**Files changed:** 1 file (+152/-0)
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:** N/A — process tooling, not a PRD requirement.

**Git:**
Branch: `docs/project-timeline-tracker`
Commit: `5ebef07` (merge)

**Known Issues:** None.
**Remaining Work:** Superseded by CHECKPOINT-2026-08-24-006's restructuring.
**Next Step:** As-built technical documentation (next checkpoint).

---

## CHECKPOINT-2026-08-24-005

**Phase:** Phase 1 — Foundation
**Feature:** Technical documentation
**Task:** Add High-Level Architecture, API/DB Spec, and Detailed Design docs

**What was implemented:** As-built (not pre-code-plan) documentation of the system that actually exists: system context, layered backend, frontend repository-swap pattern; every real endpoint and table; per-domain business logic and state machines.
**What was modified:** `docs/project-management/RAISE-PROJECT-TIMELINE.md` (added a timeline row for this PR).
**What was fixed:** None.
**What was added:** `docs/08-architecture/RAISE-HIGH-LEVEL-ARCHITECTURE.md`, `docs/09-api-db-spec/RAISE-API-DB-SPEC.md`, `docs/10-detailed-design/RAISE-DETAILED-DESIGN.md`.
**What was removed:** None.

**Files changed:** 4 files (+666/-0)
**Database changes:** None (documents existing schema, doesn't change it). **API changes:** None (documents existing endpoints). **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields; content verified against actual source files instead).

**Requirement Traceability:** N/A directly — cites existing PRD/Design IDs throughout rather than carrying its own.

**Git:**
Branch: `docs/technical-design-hla-api-db-detailed`
Commit: `4544057` (merge)

**Known Issues:** None.
**Remaining Work:** None.
**Next Step:** Restructure the project-management folder into six focused files (next checkpoint).

---

## CHECKPOINT-2026-08-24-006

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking
**Task:** Restructure `docs/project-management/` into six focused files

**What was implemented:** Split the single-file tracker into `CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md`, `PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md`, each with a distinct scope and a stated maintenance rule.
**What was modified:** None (all six are new; the old file is deleted).
**What was fixed:** None.
**What was added:** The six files above.
**What was removed:** `docs/project-management/RAISE-PROJECT-TIMELINE.md`.

**Files changed:** 7 files (+456/-154)
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:** N/A — process tooling, not a PRD requirement.

**Git:**
Branch: `docs/project-management-restructure`
Commit: `22d39d2` (merge)

**Known Issues:** None.
**Remaining Work:** None.
**Next Step:** Redesign `PROJECT-TIMELINE.md` as a 10-phase capability roadmap (next checkpoint).

---

## CHECKPOINT-2026-08-24-007

**Phase:** Phase 1 — Foundation
**Feature:** Project timeline
**Task:** Redesign `PROJECT-TIMELINE.md` as a 10-phase capability roadmap

**What was implemented:** Ten capability phases (Foundation → Authentication/RBAC → Asset Management → ITSM → License Management → Audit & Reconciliation → Alerts & Notifications → Executive Dashboard & Reporting → AI Document Intelligence & Search → AI Advanced/Roadmap-tier), each with Start/Target/Actual dates, Status, Scope, Deliverables, Dependencies, Risks, and Checkpoint links.
**What was modified:** `docs/project-management/PROJECT-TIMELINE.md` (full rewrite).
**What was fixed:** None.
**What was added:** Phases 7-10 (named from PRD capabilities not covered by phases 1-6, per a dependency-order rule).
**What was removed:** The prior chronological-PR-grouping "Phase 0-4" structure.

**Files changed:** 1 file (+174/-71)
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:** N/A directly — cites PRD requirement IDs per phase throughout.

**Git:**
Branch: `docs/timeline-10-phase-roadmap`
Commit: `7e8f356` (merge)

**Known Issues:** Phases 5-10 have no target date — deliberately, since none are scheduled or business-confirmed yet.
**Remaining Work:** Business to confirm/adjust Phase 7-10 naming and any scheduling.
**Next Step:** Retroactive conversion of all prior checkpoints into the `CHECKPOINT-<date>-<NNN>` template (next checkpoint).

---

## CHECKPOINT-2026-08-24-008

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking
**Task:** Rewrite `PROJECT-CHECKPOINTS.md` using the structured per-checkpoint template; retroactively convert all 17 prior PRs

**What was implemented:** All 17 merged PRs converted into `CHECKPOINT-<YYYY-MM-DD>-<NNN>` entries, with `NNN` resetting per day in actual merge order. Content (files/DB/API/frontend changes, PRD/Design/AC/Test Case references) pulled from `git show --stat` on each real merge commit, not reconstructed from memory.
**What was modified:** `docs/project-management/PROJECT-CHECKPOINTS.md` (full rewrite).
**What was fixed:** None.
**What was added:** The fixed checkpoint template itself, included at the top of the file.
**What was removed:** The prior narrative-style "Checkpoint: <name>" list format.

**Files changed:** 1 file (+702/-79 at time of this checkpoint's own writing)
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:** N/A — process tooling, not a PRD requirement.

**Git:**
Branch: `docs/checkpoints-structured-template`
Commit: `afd23d7` (merge commit, [PR #18](https://github.com/boonthepkstl-alt/stl_asset_service/pull/18), merged 2026-08-24). *(Corrected 2026-08-25 during the F-20 backfill — this line originally read "pending merge" and was never updated after the merge actually happened; fixing a stale factual claim, not a status change.)*

**Known Issues:** None.
**Remaining Work:** Merge PR #18.
**Next Step:** Define a formal end-of-session close-out protocol (next checkpoint, same PR).

---

## CHECKPOINT-2026-08-24-009

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Define the Development Session Close-Out Protocol and the three-level checkpoint model (Task / Feature / Phase)

**What was implemented:** `SESSION-CLOSEOUT-PROTOCOL.md` — a 14-step close-out checklist, templates for Level 2 (Feature) and Level 3 (Phase) checkpoints, a status vocabulary (✅/🟡/🚧/🔴/⚪), and an explicit mapping from likely follow-up questions ("what changed since the last checkpoint?") to the evidence file that answers them.
**What was modified:** `PROJECT-CHECKPOINTS.md` — added a `## Level 1 — Task Checkpoints` heading above the existing entries, plus new `## Level 2 — Feature Checkpoints` and `## Level 3 — Phase Checkpoints` sections (below).
**What was fixed:** None.
**What was added:** The Level 2 (`FEATURE-CHECKPOINT-project-tracking-governance`) and Level 3 (`PHASE-CHECKPOINT-1`) entries below, as the first real instances of the new model.
**What was removed:** None.

**Files changed:** `docs/project-management/SESSION-CLOSEOUT-PROTOCOL.md` (new), `docs/project-management/PROJECT-CHECKPOINTS.md` (extended)
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change. Backend (`go build`/`vet`/`test`) and frontend (`tsc`/`lint`) re-verified green as part of this session's close-out step 3, confirming no source drift occurred during a docs-only session.
**Validation:** N/A — documentation-only change for this task itself; the re-verification above is Step 3 of the close-out protocol, not validation of this task's own (nonexistent) code.

**Requirement Traceability:** N/A — process tooling, not a PRD requirement.

**Git:**
Branch: `docs/checkpoints-structured-template`
Commit: `afd23d7` (merge commit, [PR #18](https://github.com/boonthepkstl-alt/stl_asset_service/pull/18), merged 2026-08-24), same branch as CHECKPOINT-2026-08-24-008. *(Corrected 2026-08-25 during the F-20 backfill — same stale "pending merge" issue as -008.)*

**Known Issues:** The protocol is new and unproven — its real test is whether the next session actually follows it without being reminded.
**Remaining Work:** Merge PR #18; the next session should be the first to demonstrate the protocol running against genuinely new work (e.g. the QR/Barcode checkpoint backlog item).
**Next Step:** QR / Barcode (`RAISE-FR-OPS-001`) remains the recommended next feature-level checkpoint — see `CURRENT-STATUS.md` §4.

---

**Backfill note (2026-08-25):** checkpoints -010 through -019 below (PRs #19-28) were not recorded when merged — this is finding **F-20** in `OPEN-FINDINGS.md`, closed by this backfill. They are reconstructed entirely from `gh pr view <n> --json title,body,files,mergeCommit,mergedAt` output (real merged-PR metadata, including each PR's own contemporaneous test-plan checkboxes), not from memory. PR #28's checkpoint is numbered `-019` to keep same-day merge order (it was the last 2026-08-24 merge, at 15:23), even though it is being written after `CHECKPOINT-2026-08-25-001` through `-004` — those were authored in real time as their PRs merged, before this gap was discovered.

## CHECKPOINT-2026-08-24-010

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Refresh `CLAUDE.md` to match actual project state

**What was implemented:** Rewrote `CLAUDE.md` §1 (project status), §3 (docs/ folder map), §4 (deliverable chain diagram), §5 (agent/skill gap description), and closing guidance — the file had drifted to claim `frontend/src/` was empty and no Technical Spec pipeline existed, when PRs #7-#15 had already built real backend domains (Asset, Employee, Maintenance/Ticket, demo Auth), real frontend code, and as-built docs (`docs/08-architecture/` through `docs/10-detailed-design/`).
**What was modified:** `CLAUDE.md` (+89/-40).
**What was fixed:** The stale "empty frontend" / "no pipeline" claims themselves.
**What was added:** `docs/project-foundation-baseline/RAISE-BRAND-STYLE-GUIDE.md` (new, +97); `docs/superpowers/specs/2026-08-24-technical-spec-pipeline-design.md` (new, +167) — records a Technical Spec pipeline design that was drafted then withdrawn (SUPERSEDED) once this drift was discovered, per the PR body.
**What was removed:** None.

**Files changed:** 3 files (+353/-40) — see [PR #19](https://github.com/boonthepkstl-alt/stl_asset_service/pull/19).
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change.

**Requirement Traceability:** N/A — process/documentation tooling, not a PRD requirement.

**Git:**
Branch: `docs/claude-md-refresh`
Commit: `28aa7d5` (merge commit, [PR #19](https://github.com/boonthepkstl-alt/stl_asset_service/pull/19), merged 2026-08-24T13:30:39Z)

**Known Issues:** None.
**Remaining Work:** None for this task itself.
**Next Step:** Make the close-out protocol a binding `CLAUDE.md` rule (next checkpoint).

---

## CHECKPOINT-2026-08-24-011

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Make the Development Session Close-Out Protocol a binding `CLAUDE.md` rule

**What was implemented:** A new `CLAUDE.md` section making `SESSION-CLOSEOUT-PROTOCOL.md`'s 14-step checklist mandatory for every AI agent working in this repo, summarizing the checklist, the 3-level checkpoint model, and the protocol's design goal (project-state questions must be answerable from Timeline + Checkpoint + Git + Test + Traceability evidence, never AI memory). Built on the just-merged CLAUDE.md refresh (PR #19) rather than the stale pre-refresh version.
**What was modified:** `CLAUDE.md` (+22/-0).
**What was fixed:** None.
**What was added:** None (new section within the existing file).
**What was removed:** None.

**Files changed:** 1 file (+22/-0) — see [PR #20](https://github.com/boonthepkstl-alt/stl_asset_service/pull/20).
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change.

**Requirement Traceability:** N/A — process tooling.

**Git:**
Branch: `docs/claude-md-session-protocol-rule`
Commit: `a08e81b` (merge commit, [PR #20](https://github.com/boonthepkstl-alt/stl_asset_service/pull/20), merged 2026-08-24T13:34:44Z)

**Known Issues:** None.
**Remaining Work:** None for this task itself.
**Next Step:** Establish a Baseline Checkpoint from a live git/source scan (next checkpoint).

---

## CHECKPOINT-2026-08-24-012

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Add `BASELINE-CHECKPOINT-2026-08-24` from a live git/source-code scan

**What was implemented:** Defined **Baseline Checkpoints** as a fourth checkpoint type (`SESSION-CLOSEOUT-PROTOCOL.md` §1a) — a live re-scan of git and the actual source tree, distinct from routine Task/Feature/Phase checkpoints, used only at governance-establishment or major-milestone moments. Ran that scan for real: Git HEAD `a08e81b`, 49 commits, 20 merged PRs (#1-#20), 2026-08-21→08-24, no local/origin divergence; backend 4 real domains, 50 `Test*` functions, `go build`/`vet`/`test` all pass; frontend 20 pages, 19 services, 36 test files / 127 tests passing, `tsc`/`lint`/`build` all pass. Cross-checked against the traceability matrix and `OPEN-FINDINGS.md` — no drift found.
**What was modified:** `docs/project-management/CURRENT-STATUS.md` (+5/-3, "As of" line now points at the baseline); `SESSION-CLOSEOUT-PROTOCOL.md` (+13/-0, the new §1a).
**What was fixed:** None.
**What was added:** `BASELINE-CHECKPOINT-2026-08-24` entry in `PROJECT-CHECKPOINTS.md` (+46/-0).
**What was removed:** None.

**Files changed:** 3 files (+64/-3) — see [PR #21](https://github.com/boonthepkstl-alt/stl_asset_service/pull/21).
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** The baseline scan itself re-ran `go build`/`vet`/`test` and `tsc`/`lint`/`vitest`/`build` for real, per the PR body — not asserted from memory.
**Validation:** As above — all green at scan time.

**Requirement Traceability:** N/A — process tooling; the baseline scan cross-references the traceability matrix but doesn't change it.

**Git:**
Branch: `docs/baseline-checkpoint-2026-08-24`
Commit: `4cced08` (merge commit, [PR #21](https://github.com/boonthepkstl-alt/stl_asset_service/pull/21), merged 2026-08-24T14:10:16Z)

**Known Issues:** None.
**Remaining Work:** None for this task itself.
**Next Step:** Add the Next-Step Development Protocol and run it (next checkpoint).

---

## CHECKPOINT-2026-08-24-013

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Add the Next-Step Development Protocol and run it against current state

**What was implemented:** `NEXT-STEP-PROTOCOL.md` — the evidence-driven decision process for choosing what to work on next (determine state → classify incomplete work → apply priority → check dependencies/scope → select one primary next step → explain the decision → implement only after approval → checkpoint → update project state → recalculate). Companion to `SESSION-CLOSEOUT-PROTOCOL.md`. Then actually ran it against the project's real state (all 12 required sources inspected) and recorded the result in `NEXT-STEP.md`: **Primary Next Step: QR/Barcode Identification (`RAISE-FR-OPS-001`)** — the only MVP requirement the traceability matrix listed with zero blockers at that time.
**What was modified:** None (new files only).
**What was fixed:** None.
**What was added:** `docs/project-management/NEXT-STEP-PROTOCOL.md` (+143/-0), `docs/project-management/NEXT-STEP.md` (+134/-0).
**What was removed:** None.

**Files changed:** 2 files (+277/-0) — see [PR #22](https://github.com/boonthepkstl-alt/stl_asset_service/pull/22).
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change.

**Requirement Traceability:** Identifies `RAISE-FR-OPS-001` as the next target; does not itself implement it (explicitly not implemented in this PR — approval required first, per this project's established pattern).

**Git:**
Branch: `docs/next-step-protocol`
Commit: `dea0154` (merge commit, [PR #22](https://github.com/boonthepkstl-alt/stl_asset_service/pull/22), merged 2026-08-24T14:10:36Z)

**Known Issues:** None.
**Remaining Work:** Implement QR/Barcode once approved (this happened later, see `CHECKPOINT-2026-08-25-001`).
**Next Step:** QR/Barcode Identification, pending approval.

---

## CHECKPOINT-2026-08-24-014

**Phase:** Phase 2 — Authentication / RBAC
**Feature:** Login page branding
**Task:** Apply stakeholder brand proposal to the Login page

**What was implemented:** Implemented the visual identity proposal from `RAISE-BRAND-STYLE-GUIDE.md`, scoped to the Login page and shared Button component only (not a platform-wide re-theme). Logo mark gained a small upward-stroke accent using the existing `success-*` token; illustration panel changed to a deep-blue-only gradient (`brand-700`→`brand-900`) with an abstract asset-network illustration (green-accented nodes) replacing the old "person holding a device" motif; Inter + Prompt fonts actually loaded via Google Fonts for the first time (previously named in the CSS stack but never loaded); primary Button got a `hover:shadow-md` lift; SSO buttons got a light-gray hover background.
**What was modified:** `frontend/src/pages/Login/index.tsx` (+62/-14), `frontend/index.html` (+3/-0), `frontend/src/components/ui/Button.tsx` (+1/-1), `frontend/src/index.css` (+2/-2), `docs/project-foundation-baseline/RAISE-BRAND-STYLE-GUIDE.md` (+38/-22, also corrected a stale premise that `frontend/src` was empty when the guide was written).
**What was fixed:** `RAISE-BRAND-STYLE-GUIDE.md`'s stale "empty frontend" premise (see above).
**What was added:** None (new files).
**What was removed:** None.

**Files changed:** 5 files (+106/-39) — see [PR #23](https://github.com/boonthepkstl-alt/stl_asset_service/pull/23).
**Database changes:** None. **API changes:** None. **Frontend changes:** Login page visual restyle; shared Button gets a new hover state.

**Tests:**
- Unit Test: none new for this UI-only change.
- Integration/E2E: none exist in this project.

**Validation (per the PR's own test plan):**
- `npx tsc --noEmit` — clean
- `npm run lint` — 0 warnings
- `npx vitest run` — 127/127 pass
- `npm run build` — succeeds
- Manually verified in-browser at 1440×900: logo mark accent, network illustration, Thai text rendering — all correct

**Requirement Traceability:** N/A — visual/branding change, not tied to a `RAISE-FR-*` requirement.

**Git:**
Branch: `frontend/login-brand-styling`
Commit: `c0be51c` (merge commit, [PR #23](https://github.com/boonthepkstl-alt/stl_asset_service/pull/23), merged 2026-08-24T14:27:47Z)

**Known Issues:** None at merge time — superseded hours later once Singer's real CI was confirmed (next checkpoint).
**Remaining Work:** None for this task itself (superseded, not incomplete).
**Next Step:** Re-theme to Singer's confirmed CI once the business answered which brand direction to use.

---

## CHECKPOINT-2026-08-24-015

**Phase:** Phase 2 — Authentication / RBAC
**Feature:** Login page branding
**Task:** Re-theme Login to Singer's confirmed Corporate Identity (red accent)

**What was implemented:** Business confirmed 2026-08-24 that RAISE is developed for Singer (Thailand)'s direct use (PRD §16 Resolved Question 39, PRD bumped to v0.10). Re-themed Login to Singer's actual CI, superseding the generic palette from PR #23 a few hours earlier. Color sourced from the real `singerthai.co.th` site's computed styles (not guessed): `#E50040` on CTA/header, `#A80331` as a pressed state — anchoring a new `singer-*` Tailwind scale kept deliberately separate from `brand-*` and `error-*` to avoid colliding with existing button/alert semantics. New opt-in `Button variant="brand"` used only on Login's Sign-in button. Illustration panel went dark slate/near-black (not solid red), per the stakeholder's own UX caution that red already means alert/breakdown in this app. Red applied as accent-only: network nodes, Sign-in button, focus ring (scoped via `.login-form-accent`), logo mark.
**What was modified:** `frontend/src/pages/Login/index.tsx` (+18/-15), `frontend/src/components/ui/Button.tsx` (+5/-1), `frontend/src/index.css` (+34/-0), `docs/project-foundation-baseline/RAISE-BRAND-STYLE-GUIDE.md` (+88/-17), `docs/01-requirements/RAISE-PRD.md` (+34/-2, new Resolved Question 39, v0.9→v0.10).
**What was fixed:** None (supersedes, doesn't fix, PR #23's palette).
**What was added:** `singer-*` color scale; `Button variant="brand"`.
**What was removed:** None (PR #23's generic palette values are overwritten, not the code paths).

**Files changed:** 5 files (+179/-35) — see [PR #24](https://github.com/boonthepkstl-alt/stl_asset_service/pull/24).
**Database changes:** None. **API changes:** None. **Frontend changes:** Login re-themed to Singer red accents on a dark panel.

**Validation (per the PR's own test plan):**
- `npx tsc --noEmit` — clean
- `npm run lint` — 0 warnings
- `npx vitest run` — 127/127 pass
- `npm run build` — succeeds
- Manually verified in-browser at 1440×900: dark panel with red-accented nodes, red logo mark, red Sign-in button, red focus ring — all correct

**Requirement Traceability:**
PRD: `RAISE-PRD.md` §16 Resolved Question 39 (new).

**Git:**
Branch: `frontend/singer-ci-login-branding`
Commit: `1887a19` (merge commit, [PR #24](https://github.com/boonthepkstl-alt/stl_asset_service/pull/24), merged 2026-08-24T14:47:30Z)

**Known Issues:** The near-black panel was later reverted per direct user feedback (see `CHECKPOINT-2026-08-24-017`) — not a defect in this PR, a subsequent design change.
**Remaining Work:** None for this task itself.
**Next Step:** Extend the Singer CI logo mark to the app shell sidebar.

---

## CHECKPOINT-2026-08-24-016

**Phase:** Cross-Cutting Work
**Feature:** Shared UI components
**Task:** Extend Singer CI logo mark to the app shell sidebar

**What was implemented:** Extracted the Singer-red `RaiseMark` from `Login/index.tsx` into a shared `frontend/src/components/RaiseMark.tsx`; `AppShell`'s sidebar header (used by every authenticated page) now uses this shared mark instead of its old blue-to-indigo gradient box, making the logo visually consistent from Login through the whole app. Deliberately did not touch Dashboard's KPI cards/charts/buttons — Dashboard already uses red (`error-*`) extensively for real alert meaning, and extending Singer red further would collide with the "red is accent-only, never a second meaning" caution in the brand guide.
**What was modified:** `frontend/src/components/AppShell.tsx` (+2/-3), `frontend/src/pages/Login/index.tsx` (+1/-19, the extraction).
**What was fixed:** None.
**What was added:** `frontend/src/components/RaiseMark.tsx` (new, +21/-0).
**What was removed:** The inline `RaiseMark`-equivalent markup previously duplicated in `Login/index.tsx`.

**Files changed:** 3 files (+24/-22) — see [PR #25](https://github.com/boonthepkstl-alt/stl_asset_service/pull/25).
**Database changes:** None. **API changes:** None. **Frontend changes:** Shared logo component; sidebar header visual change.

**Validation (per the PR's own test plan):**
- `npx tsc --noEmit` — clean
- `npm run lint` — 0 warnings
- `npx vitest run` — 127/127 pass
- `npm run build` — succeeds
- Manually verified in-browser: sidebar logo renders in Singer red/dark on Dashboard, consistent with Login, all KPI/alert colors unchanged

**Requirement Traceability:** N/A — visual/branding change.

**Git:**
Branch: `frontend/singer-ci-shell-logo`
Commit: `70aaae1` (merge commit, [PR #25](https://github.com/boonthepkstl-alt/stl_asset_service/pull/25), merged 2026-08-24T15:08:59Z)

**Known Issues:** None.
**Remaining Work:** Whether primary buttons/CTAs platform-wide should also move to Singer red is an explicitly separate, larger decision, not made here.
**Next Step:** Revert the Login illustration panel to blue per direct user feedback (next checkpoint).

---

## CHECKPOINT-2026-08-24-017

**Phase:** Phase 2 — Authentication / RBAC
**Feature:** Login page branding
**Task:** Revert Login illustration panel from black back to blue

**What was implemented:** Direct user feedback: the near-black illustration panel introduced in PR #24 wasn't wanted. Reverted the panel background to the blue gradient (`brand-700`→`brand-900`) used before that change. Everything else from the Singer CI pass was kept unchanged: red-accented network nodes, red Sign-in button, red logo mark, red focus ring — red stays accent-only.
**What was modified:** `frontend/src/pages/Login/index.tsx` (+5/-4).
**What was fixed:** Reverted an unwanted design change (not a code defect).
**What was added:** None.
**What was removed:** The near-black panel background.

**Files changed:** 1 file (+5/-4) — see [PR #26](https://github.com/boonthepkstl-alt/stl_asset_service/pull/26).
**Database changes:** None. **API changes:** None. **Frontend changes:** Login illustration panel background reverted to blue.

**Validation (per the PR's own test plan):**
- `npx tsc --noEmit` — clean
- `npm run lint` — 0 warnings
- Manually verified in-browser: blue panel with red-accented nodes renders correctly; Dashboard (unaffected) still shows the red sidebar logo mark

**Requirement Traceability:** N/A — visual/branding change.

**Git:**
Branch: `frontend/login-panel-revert-to-blue`
Commit: `8c0f7b8` (merge commit, [PR #26](https://github.com/boonthepkstl-alt/stl_asset_service/pull/26), merged 2026-08-24T15:09:22Z)

**Known Issues:** None.
**Remaining Work:** None for this task itself.
**Next Step:** Extend Singer CI accent to the Dashboard's Software Licenses KPI card only.

---

## CHECKPOINT-2026-08-24-018

**Phase:** Cross-Cutting Work
**Feature:** Dashboard KPI styling
**Task:** Add Singer CI accent to the Software Licenses KPI card

**What was implemented:** Extended Singer's confirmed CI to the Dashboard, per explicit confirmation on scope: only the "Software Licenses" KPI card (previously generic blue `brand`) now uses the `singer-*` red scale. Deliberately not applied to "Total Assets" (also previously `brand`) — it sits directly above the `error`-colored "Expired Warranty" card in the same grid column, so recoloring it red would read as a second alert stacked in one column. Every other KPI card unchanged (Available/success, Assigned/accent, In Maintenance/warning, Expired Warranty/error, Monthly Depreciation/accent, Monthly Cost/success) since those already carry real alert/status meaning.
**What was modified:** `frontend/src/pages/Dashboard/index.tsx` (+5/-1).
**What was fixed:** None.
**What was added:** None.
**What was removed:** None.

**Files changed:** 1 file (+5/-1) — see [PR #27](https://github.com/boonthepkstl-alt/stl_asset_service/pull/27).
**Database changes:** None. **API changes:** None. **Frontend changes:** Dashboard KPI card color change (Software Licenses only).

**Validation (per the PR's own test plan):**
- `npx tsc --noEmit` — clean
- `npm run lint` — 0 warnings
- `npx vitest run` — 127/127 pass
- `npm run build` — succeeds
- Manually verified in-browser: Software Licenses card shows the Singer red icon, Total Assets stays blue, no visual collision with Expired Warranty

**Requirement Traceability:** N/A — visual/branding change; not the backend KPI/formula work `RAISE-FR-EXEC-001` (Phase 8) actually scopes.

**Git:**
Branch: `frontend/dashboard-singer-ci-kpi`
Commit: `1ee80f1` (merge commit, [PR #27](https://github.com/boonthepkstl-alt/stl_asset_service/pull/27), merged 2026-08-24T15:23:58Z)

**Known Issues:** None.
**Remaining Work:** None for this task itself.
**Next Step:** Backfill `PROJECT-TIMELINE.md` checkpoint links for PRs #18-27 (next checkpoint).

---

## CHECKPOINT-2026-08-24-019

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Add PR #18-27 checkpoint links to `PROJECT-TIMELINE.md`

**What was implemented:** Backfilled the Checkpoint field for phases with real work landed since PR #17 (the last time the file's checkpoint links were touched): Phase 1 gained #18-22 (checkpoint template, CLAUDE.md refresh, close-out protocol rule, baseline checkpoint, next-step protocol — all this phase's own tracking-layer deliverable); Phase 2 gained #23/#24/#26 (three Login restyles, none touching the auth mechanism itself); a new "Cross-Cutting Work" section was added for #25 (shell-wide logo) and #27 (Dashboard KPI accent), since neither fit one phase's Deliverables cleanly. Phases 3-10 were left unchanged — no domain work had shipped since #17 affecting those.
**What was modified:** `docs/project-management/PROJECT-TIMELINE.md` (+21/-2).
**What was fixed:** None.
**What was added:** The "Cross-Cutting Work" section.
**What was removed:** None.

**Files changed:** 1 file (+21/-2) — see [PR #28](https://github.com/boonthepkstl-alt/stl_asset_service/pull/28).
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change.

**Requirement Traceability:** N/A — process tooling.

**Git:**
Branch: `docs/timeline-checkpoints-18-27`
Commit: `d714b9f` (merge commit, [PR #28](https://github.com/boonthepkstl-alt/stl_asset_service/pull/28), merged 2026-08-25T13:12:00Z)

**Known Issues:** None.
**Remaining Work:** None for this task itself.
**Next Step:** This backfill (F-20 closure) itself — see `CHECKPOINT-2026-08-25-005` below. At the time PR #28 actually merged, the real next step taken was QR/Barcode Identification (`CHECKPOINT-2026-08-25-001`).

---

## CHECKPOINT-2026-08-25-001

**Phase:** Phase 3 — Asset Management
**Feature:** QR / Barcode Identification
**Task:** Implement `RAISE-FR-OPS-001` / `AC-OPS-001` — replace the existing fake/non-functional QR UI with a real, working implementation

**What was implemented:** A real, scannable QR code generator (`frontend/src/lib/qr.ts`, using the `qrcode` package) encoding a deep link to the asset's own detail page (`{origin}/assets/{code}`); a shared `AssetQrCode` component with a working download button; a "Scan QR" modal on the Assets list using an auto-focused text input (the "keyboard wedge" pattern real barcode/QR scanner hardware uses) that looks up an asset by code and navigates to its record, or shows an inline "not found" error.
**What was modified:** `frontend/src/pages/Assets/index.tsx` (swapped the fake SVG QR modal for `AssetQrCode`; wired the previously-inert "Scan QR" button); `frontend/src/pages/AssetDetail/index.tsx` (wired "Print QR", previously a toast placeholder, to the same shared modal); `go-template-main/model/assetModel.go` (`SQL_asset_pg_get` now matches `WHERE id = $1 OR code = $1`); `go-template-main/controller/assetController.go` (doc comment update).
**What was fixed:** `MockAssetRepository.getById` (`frontend/src/services/asset-repository.ts`) only matched by internal `id`, not `code` — since this repository is the one active by default (`ASSET_API_ENABLED` off, no backend running), scanning a real printed/scanned asset code like `AST-0004` would always fail "not found." Fixed to match either. Also discovered and removed: a decorative pseudo-random SVG pattern that looked like a QR code but encoded no real data, and a "Download QR" button with no `onClick` handler at all.
**What was added:** `frontend/src/components/AssetQrCode.tsx`, `frontend/src/lib/qr.ts`, one new test in `asset-service.test.ts` covering code-based lookup.
**What was removed:** The fake pseudo-random SVG QR pattern in `Assets/index.tsx`.

**Files changed:** 10 files (+419/-31) — see [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29) for the full diff.
**Database changes:** None (query predicate change only, no schema/migration change). **API changes:** None (existing `GET /assets/:id` endpoint's matching behavior extended, no new route). **Frontend changes:** New `AssetQrCode` component, new `qr.ts` lib, Assets/AssetDetail pages wired to real QR generation and a functional scan-and-navigate flow.

**Tests:**
- Unit Test: 1 new test added (`asset-service.test.ts` — code-based lookup), 128/128 frontend tests passing overall.
- Integration Test: None added — no existing integration-test layer covers this flow (scan → lookup → navigate is a manual/browser-verified user flow, not a written integration test).
- E2E Test: None — no E2E framework exists in this project yet.

**Validation:**
- Build: `go build ./...` ✅, `npm run build` ✅
- Lint: `go vet ./...` ✅, `npm run lint` ✅ (0 warnings)
- Test: `go test ./...` ✅, `npx vitest run` ✅ (128/128)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): "Scan QR" with a valid code (`AST-0004`) navigates to that asset's detail page; an unknown code shows an inline "No asset found" error without navigating; "Print QR Code" (Assets list row action) and "Print QR" (Asset Detail) both render a real, well-formed scannable QR image.

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-001`
Design: `RAISE-DESIGN.md` (Asset Registry / Operations section — QR/Barcode identification)
Acceptance Criteria: `AC-OPS-001` — "Users can use QR/Barcode information to identify an asset; the identified asset can be connected to its asset record." Met by manual verification (above); **not yet run as a formal, signed-off test case** — see Known Issues.
Test Case: `TC-OPS-001-01..03` (`RAISE-TEST-CASES.md`) — not yet formally executed against this implementation; traceability matrix still shows `NOT_TESTED` for this row pending that formal pass.

**Git:**
Branch: `feature/qr-barcode-identification`
Commit: `c408f8f` (implementation), merged via `625ceec` (merge commit, [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29))

**Known Issues:** Formal test case execution (`TC-OPS-001-01..03`) has not been run and signed off — this checkpoint's "Tests" verification is build/lint/unit-test plus manual browser verification, which satisfies the AC in substance but is not the same artifact as a completed test-case record in `RAISE-TEST-CASES.md`. The traceability matrix's `NOT_TESTED` status for `RAISE-FR-OPS-001` should not be flipped to a passed status until that formal run happens.
**Remaining Work:** Run/record `TC-OPS-001-01..03` formally if this project starts treating that document as a live execution log rather than a static plan; otherwise no further code work is required for MVP scope on this requirement.
**Next Step:** Per `CURRENT-STATUS.md` §4, the next "needs a scoped-down first cut" candidates are Audit Log (`RAISE-FR-AUDIT-001`) or Executive Dashboard (`RAISE-FR-EXEC-001`) — both have a real AC with some fields TBD, same pattern as the already-built Maintenance/Check-in domains.

---

## CHECKPOINT-2026-08-25-002

**Phase:** Phase 6 — Audit & Reconciliation
**Feature:** Immutable Audit Log (first cut)
**Task:** Implement `RAISE-FR-AUDIT-001` scoped to what's confirmed: log mutations that already happen (Asset create/assign/check-in) without inventing the still-open field taxonomy or role-gate content

**What was implemented:** A new Audit Log domain end to end — backend `audit_logs` table, model, repository (Create + List only), service, and a read-only `GET /audit-logs` controller; frontend `audit-repository.ts`/`audit-service.ts` (Mock + Http, gated by a new `AUDIT_API_ENABLED` flag) and a `useAuditLogs` hook. Recording is wired into `CreateAsset`/`AssignAsset`/`CheckInAsset` on the backend and into `MockAssetRepository.create/assign/checkIn` on the frontend mock, so both paths produce real entries.
**What was modified:** `go-template-main/controller/assetController.go` (best-effort `recordAudit` call after each mutation succeeds); `router/sampleRouter.go` (wiring + new route); `frontend/src/services/asset-repository.ts` (mock recording hook-in); `frontend/src/pages/AssetDetail/index.tsx` (Audit tab now reads real entries, refetched after Assign/Check-in).
**What was fixed:** None — this is new functionality, not a bugfix.
**What was added:** `go-template-main/model/auditModel.go`, `repository/auditRepository.go` + `auditPGRepository.go`, `service/auditService.go` (+ test), `controller/auditController.go`, `sql/pg/V4__Audit_Table.sql`; `frontend/src/types/audit.ts`, `services/audit-repository.ts`, `services/audit-service.ts` (+ test), `hooks/useAuditLogs.ts`.
**What was removed:** The hardcoded fake 3-entry audit array previously inline in `AssetDetail/index.tsx`'s Audit tab.

**Files changed:** 17 files (+719/-17) — see [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31) for the full diff.
**Database changes:** New table `audit_logs` (`sql/pg/V4__Audit_Table.sql`) — additive, no existing table touched. **API changes:** New read-only endpoint `GET /audit-logs`; no existing endpoint's contract changed (the mutating endpoints it observes keep their existing request/response shapes, audit recording is a side effect, not a new response field). **Frontend changes:** New Audit domain service/repository/hook; Asset Detail's Audit tab behavior changed from static fake data to live entries.

**Tests:**
- Unit Test: `go-template-main/service/auditService_test.go` (3 new cases); `frontend/src/services/audit-service.test.ts` (3 new cases) — 131/131 frontend tests passing overall.
- Integration Test: None added — same gap as the rest of this codebase (no integration-test layer exists yet).
- E2E Test: None — no E2E framework exists in this project.

**Validation:**
- Build: `go build ./...` ✅, `npm run build` ✅
- Lint: `go vet ./...` ✅, `npm run lint` ✅ (0 warnings)
- Test: `go test ./...` ✅, `npx vitest run` ✅ (131/131)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): performed Check-in then Assign on a seeded asset; both actions immediately produced a correctly-attributed, correctly-timestamped audit entry on the Audit tab, newest-first, replacing the prior static fake list.

**Requirement Traceability:**
PRD: `RAISE-FR-AUDIT-001`
Design: `RAISE-DESIGN.md` §15 "Audit Architecture" — implements exactly the confirmed subset (Actor/Action/Entity/Timestamp), not the "design candidate" fields (Before/After, Source, Result) it explicitly flags as unconfirmed.
Acceptance Criteria: `AC-AUDIT-001-01` (entry created with minimum fields) — met for Asset-domain mutations. `AC-AUDIT-001-02` (entries cannot be modified/deleted through normal application operation) — met by omission (no Update/Delete method exists at any layer). `AC-AUDIT-001-03` (authorized user can view entries) — met structurally (entries are viewable); the "authorized" role-gate part is **not** enforced, since PRD §16 Q22 leaves the role model undefined — same reasoning already applied to every other RAISE domain route.
Test Case: `TC-AUDIT-001-01` (partial — field taxonomy TBD), `TC-AUDIT-001-02` (not blocked — met), `TC-AUDIT-001-03` (partial — role gate TBD). This checkpoint does not change the traceability matrix's `BLOCKED` status for `RAISE-FR-AUDIT-001` — see Known Issues.

**Git:**
Branch: `feature/audit-log-first-cut`
Commit: `8aef31b` (implementation), merged via `33f9164` (merge commit, [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31))

**Known Issues:** (1) Audit writes are best-effort, non-atomic with the primary mutation they observe — a rare audit-write failure would let a mutation succeed without a matching entry; documented in `assetController.go`'s `recordAudit` comment as a deliberate first-cut trade-off, not an oversight. (2) Ticket-domain mutations (create/approve/dispatch/status update) are **not** wired to the audit log in this cut — Asset-domain coverage alone satisfies `AC-AUDIT-001-01`'s own example (Check-in/Check-out), but full domain coverage is incomplete. (3) `TC-AUDIT-001-01`/`-03` remain partially blocked in the traceability matrix; this implementation does not resolve the underlying PRD/Design open questions, only builds what's already confirmed.
**Remaining Work:** Wire Ticket-domain mutations into the same `AuditService.Record` call, once/if that's prioritized; re-run `TC-AUDIT-001-01..03` formally and update the traceability matrix if/when Design §15's field taxonomy and PRD §16 Q22's role gate get answered.
**Next Step:** Per `CURRENT-STATUS.md` §4, the next "needs a scoped-down first cut" candidate is Executive Dashboard (`RAISE-FR-EXEC-001`) — real AC exists, KPI formulas TBD, same narrow-first-cut pattern.

---

## CHECKPOINT-2026-08-25-003

**Phase:** Phase 8 — Executive Dashboard & Reporting
**Feature:** Executive Dashboard KPIs (first cut)
**Task:** Implement `RAISE-FR-EXEC-001` scoped to exactly what's already confirmed: relocate the existing client-side plain-count KPI computation to a real backend endpoint, without adding or approximating any NBV/Risk/Utilization-mechanics formula

**What was implemented:** A new read-only Dashboard domain — backend `GET /dashboard/stats` computing status counts (Available/Assigned/In Maintenance/Retired), expired-warranty count, and department/type distribution by composing over the existing `AssetService` (no new table, no new SQL); frontend `dashboard-repository.ts` (Mock + Http, gated by a new `DASHBOARD_API_ENABLED` flag) feeding the same shape `dashboard-service.ts` always produced.
**What was modified:** `go-template-main/router/sampleRouter.go` (wiring); `frontend/src/services/dashboard-service.ts` (now composes the repository's stats with `licenseService`'s software license count and applies color assignment, instead of computing everything inline); `frontend/src/types/dashboard.ts` (added colorless `DistributionCount` as the base of `DistributionSlice`); `frontend/src/config/featureFlags.ts` (new flag).
**What was fixed:** None — this is a relocation, not a bugfix.
**What was added:** `go-template-main/model/dashboardModel.go`, `service/dashboardService.go` (+ 4 tests), `controller/dashboardController.go`; `frontend/src/services/dashboard-repository.ts` (+ http test).
**What was removed:** The inline computation previously living directly in `dashboard-service.ts`'s `getDashboardStats` (moved into `dashboard-repository.ts`'s `MockDashboardRepository`, same logic, not deleted).

**Files changed:** 10 files (+414/-30) — see [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33) for the full diff.
**Database changes:** None (no new table — composes over the existing `assets` table via `AssetService`). **API changes:** New read-only endpoint `GET /dashboard/stats`; no existing endpoint's contract changed. **Frontend changes:** New Dashboard repository/flag; `dashboard-service.ts`'s output shape and values are unchanged when the flag is off (default) — verified by browser comparison, not just assumed.

**Tests:**
- Unit Test: `go-template-main/service/dashboardService_test.go` (4 new cases); `frontend/src/services/dashboard-repository.http.test.ts` (1 new case) — 132/132 frontend tests passing overall, including the 4 pre-existing `dashboard-service.test.ts` cases unchanged.
- Integration Test: None added — same gap as the rest of this codebase.
- E2E Test: None — no E2E framework exists in this project.

**Validation:**
- Build: `go build ./...` ✅, `npm run build` ✅
- Lint: `go vet ./...` ✅, `npm run lint` ✅ (0 warnings)
- Test: `go test ./...` ✅, `npx vitest run` ✅ (132/132)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): Dashboard page rendered with the flag at its default (off) — same KPI numbers, same department/type distribution values and colors, no console errors, confirming the relocated mock-path logic reproduces the original inline computation exactly.

**Requirement Traceability:**
PRD: `RAISE-FR-EXEC-001`
Design: N/A cited directly in this checkpoint — see `RAISE-DESIGN.md`'s Executive Intelligence section for the full KPI tile list this first cut only partially covers.
Acceptance Criteria: `AC-EXEC-001` — met only for the plain-count sub-scope (status counts, expired warranty, distributions); the NBV/Risk/Utilization-mechanics sub-scope is untouched and remains not-yet-testable per the traceability matrix.
Test Case: `TC-EXEC-001-01` (partial — NBV/Risk formulas TBD, unchanged by this PR), `TC-EXEC-001-02` (partial — AI-generated-vs-static Executive Summary unresolved, unrelated to this PR's scope). This checkpoint does not change the traceability matrix's status for `RAISE-FR-EXEC-001` — see Known Issues.

**Git:**
Branch: `feature/executive-dashboard-kpi-backend`
Commit: `862b7a1` (implementation), merged via `20e0afd` (merge commit, [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33))

**Known Issues:** (1) Software License count still comes from the frontend's mock license service regardless of `DASHBOARD_API_ENABLED` — there is no backend License table to query (`RAISE-FR-LICENSE-001` is Roadmap-only), so this is a permanent characteristic of the current architecture, not a bug. (2) NBV, Risk score, and Utilization's calculation mechanics are **not started** at all (not approximated, not stubbed) — PRD §16 Q3/Q4/Q29 remain the blocker. (3) Monthly Depreciation/Monthly Cost and the AI Insights/AI Portfolio Health panel remain static illustrative fixture content — they were never computed logic, so there was nothing to "move" for them in this cut.
**Remaining Work:** The NBV/Risk/Utilization-mechanics half of `RAISE-FR-EXEC-001` cannot proceed without a PRD §16 Q3/Q4/Q29 answer — this is a business-decision blocker, not a scoping task.
**Next Step:** Per `CURRENT-STATUS.md` §4, no fresh "needs a scoped-down first cut" item remains. The next actionable, non-invented task is the already-scoped Ticket-domain audit hook-in (extends PR #31 — see that checkpoint's Remaining Work) unless a PRD answer unblocks something else first.

---

## CHECKPOINT-2026-08-25-004

**Phase:** Phase 6 — Audit & Reconciliation
**Feature:** Immutable Audit Log — Ticket-domain extension
**Task:** Close the gap PR #31 explicitly deferred: wire `AuditService.Record` into the Ticket domain's mutation points, exactly the same pattern already proven on the Asset domain

**What was implemented:** A `recordAudit` helper on `ticketController.go`, identical in shape to `assetController.go`'s, wired into `CreateTicket` ("Ticket created"), `DecideApproval` ("Ticket Approved"/"Ticket Rejected"), `Dispatch` ("Ticket dispatched to <technician>"), and `UpdateExecutionStatus` ("Ticket status updated to <status>"). Frontend `MockTicketRepository`'s equivalent four methods now call the same shared `recordMockAuditEntry` helper `MockAssetRepository` already uses.
**What was modified:** `go-template-main/router/sampleRouter.go` (`NewTicketController` now takes `auditService`); `frontend/src/services/audit-service.test.ts` (2 new tests).
**What was fixed:** None — this closes a documented gap, not a bug.
**What was added:** The `recordAudit` helper and its four call sites in `ticketController.go`; the four `recordMockAuditEntry` calls in `ticket-repository.ts`.
**What was removed:** None.

**Files changed:** 4 files (+91/-7) — see [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35) for the full diff.
**Database changes:** None (writes into the existing `audit_logs` table from PR #31, `entity_type: "ticket"`). **API changes:** None — no new route; existing `/tickets/*` mutation endpoints now have a recording side effect. **Frontend changes:** `MockTicketRepository` now writes into the shared mock audit store; no UI change (deliberately no new Ticket-side "Audit" view — see Known Issues).

**Tests:**
- Unit Test: `frontend/src/services/audit-service.test.ts` (+2 cases: ticket create recording, and approve/dispatch/status-update each appending their own entry) — 134/134 frontend tests passing overall.
- Integration Test: None added — same gap as the rest of this codebase.
- E2E Test: None — no E2E framework exists in this project.

**Validation:**
- Build: `go build ./...` ✅, `npm run build` ✅
- Lint: `go vet ./...` ✅, `npm run lint` ✅ (0 warnings)
- Test: `go test ./...` ✅, `npx vitest run` ✅ (134/134)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): approved a real ticket (`REQ-2026-0043`) via the Dept Sign-off action in the running app, then confirmed via a dynamic `import()` of `audit-service.ts` executed in the page that a real entry existed — `actor: "Demo Admin"`, `action: "Ticket Approved"`, `entityType: "ticket"`, correct `entityId`, real ISO timestamp. This is a live check against the running mock store, not only the unit tests' assertions.

**Requirement Traceability:**
PRD: `RAISE-FR-AUDIT-001`
Design: `RAISE-DESIGN.md` §15 — same confirmed-subset scope as PR #31, now applied to a second domain; no new field was introduced beyond what PR #31 already modeled.
Acceptance Criteria: `AC-AUDIT-001-01` — its own worked example is Check-in/Check-out (Asset domain, PR #31); this PR extends coverage to a second "significant system activity" category (ticket lifecycle transitions) without changing what the AC requires.
Test Case: `TC-AUDIT-001-01`/`-03` traceability matrix status is unchanged by this PR (still partial, per PR #31's Known Issues — field taxonomy and role gate remain the blockers, unrelated to domain coverage breadth).

**Git:**
Branch: `feature/ticket-domain-audit-hookin`
Commit: `9741bff` (implementation), merged via `5b52672` (merge commit, [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35))

**Known Issues:** (1) Same best-effort, non-atomic audit-write trade-off as PR #31 — a rare write failure logs but doesn't fail the ticket mutation. (2) No UI currently displays Ticket-domain audit entries — they are recorded and queryable via `GET /audit-logs`/`auditService.listAuditLogs`, but no page renders them yet (deliberate — `AC-AUDIT-001-03` only requires viewability to exist somewhere, and inventing a UI surface wasn't asked for). (3) `TicketDetail`'s existing "Audit Trail" tab is unrelated — it renders the ticket's own pre-existing `timeline` field, not this `audit_logs` table; the two systems now coexist without conflict but could read as confusingly similar names to a future reader.
**Remaining Work:** If a Ticket-side (or unified cross-domain) audit viewing UI is wanted, that's a new, explicitly-scoped task — not assumed here. Otherwise, `RAISE-FR-AUDIT-001`'s remaining gaps (field taxonomy, role gate) are both business-decision blockers, not code tasks.
**Next Step:** Per `CURRENT-STATUS.md` §4, no fresh "needs a scoped-down first cut" or "already-scoped extension" item remains identified. The next actionable code task would need either a new PRD answer (unblocking Warranty/Alerts/Executive Dashboard's remainder/etc.) or an explicit new instruction (e.g. a cross-domain audit viewing UI) — recalculate `NEXT-STEP.md` accordingly rather than inventing a category that doesn't currently exist.

---

## CHECKPOINT-2026-08-25-005

**Phase:** Phase 1 — Foundation
**Feature:** Project tracking / process governance
**Task:** Backfill Level 1 checkpoints for PR #19-28, closing finding F-20

**What was implemented:** `CHECKPOINT-2026-08-24-010` through `-019`, reconstructed entirely from `gh pr view <n> --json title,body,files,mergeCommit,mergedAt` output for PRs #19-28 — real merged-PR metadata and each PR's own contemporaneous test-plan checkboxes, not memory. Numbered `-010`..`-019` to preserve 2026-08-24's real merge order (continuing from `-009`); PR #28's checkpoint is `-019` even though it's written after `-001`..`-004` chronologically in *authoring* time, since those four were written in real time as their PRs merged on 2026-08-25, before this gap was noticed.
**What was modified:** Also corrected two stale factual errors found while inserting this backfill: `CHECKPOINT-2026-08-24-008` and `-009` both still said "pending merge" for PR #18's commit, months after it had actually merged (`afd23d7`) — updated to the real merge commit hash, per the maintenance rule's allowance to fix factual errors in past entries.
**What was fixed:** The two stale "pending merge" lines above.
**What was added:** 10 new Level 1 checkpoint entries (`-010` through `-019`).
**What was removed:** None.

**Files changed:** 1 file (`PROJECT-CHECKPOINTS.md`) — this backfill plus the two corrections.
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change. Cross-checked: `grep -n "^## CHECKPOINT-"` confirms no duplicate or out-of-sequence IDs after insertion.

**Requirement Traceability:** N/A — process/documentation tooling. Directly resolves `OPEN-FINDINGS.md` finding F-20.

**Git:**
Branch: `docs/ticket-audit-closeout` (added as a second commit onto the still-open PR #36, rather than a new branch, since both are docs-only close-out work and this avoids a `PROJECT-CHECKPOINTS.md` merge conflict between two simultaneously-open PRs)
Commit: `f05b3c5` (implementation), merged via [PR #36](https://github.com/boonthepkstl-alt/stl_asset_service/pull/36). *(Corrected 2026-08-26 — this line originally read "pending," written before the PR merged; same self-referential timing this backfill's own commentary already explained.)*

**Known Issues:** None.
**Remaining Work:** None for this task itself — F-20 is fully closed.
**Next Step:** Per the recalculated `NEXT-STEP.md` (see `CHECKPOINT-2026-08-25-004`'s own Next Step), the remaining choice was between more documentation debt (none identified) and waiting on a PRD business-decision answer — the user picked a third option not listed there: run the formal test-case executions this protocol had been treating as pure "validation, not a code task." See `CHECKPOINT-2026-08-26-001` below for what that turned up.

---

## CHECKPOINT-2026-08-26-001

**Phase:** Phase 3 — Asset Management, Phase 6 — Audit & Reconciliation, Phase 8 — Executive Dashboard & Reporting (spans all three — one test-execution pass per suite)
**Feature:** Formal test case execution for TS-OPS-001, TS-AUDIT-001, TS-EXEC-001
**Task:** Actually run `TC-OPS-001-01..03`, `TC-AUDIT-001-01..03`, and `TC-EXEC-001-01..02` against the real running app and record real PASS/FAIL evidence in `RAISE-TRACEABILITY-MATRIX.md`, instead of leaving these suites at their pre-code-era default/blocked status indefinitely

**What was implemented:** Executed all 8 test cases against the real running frontend (`raise-frontend` dev server, mock repositories) via browser automation, recording actual observed behavior — not re-asserting prior claims. Results:
- **TC-OPS-001-01 PASS** — scanning `AST-0001` opened `/assets/a1` (Asset Detail).
- **TC-OPS-001-02 PASS** — scanning the well-formed-but-unmapped `AST-9999` showed an inline "No asset found" message with the field still editable (retry path).
- **TC-OPS-001-03 FAIL** — scanning a malformed code (`%%$#!!garbage///`) showed the *identical* generic "No asset found" message as TC-OPS-001-02; `AC-OPS-001-03`'s distinct "invalid code" state does not exist. New finding **F-21**.
- **TC-AUDIT-001-01 PASS** — checked in a real asset (`a2`) via the UI, then confirmed via a dynamic `import()` of `audit-service.ts` executed in the page that an entry was recorded with `actor: "Demo Admin"`, `action: "Asset checked in"`, `entityType: "asset"`, `entityId: "a2"`, and a real ISO timestamp.
- **TC-AUDIT-001-02 PASS** — no edit/delete control exists near the rendered entry (UI inspection); no update/delete method exists on `AuditRepository`/`MockAuditRepository`, and no such route is registered in the backend router (code inspection).
- **TC-AUDIT-001-03 PASS** — the recorded entry rendered on Asset Detail's "Audit" tab for the logged-in user.
- **TC-EXEC-001-01 FAIL** — no tile labeled "NBV", "Risk", or "Utilization" exists anywhere on the built Dashboard page (confirmed by reading the full rendered page text). Worse than the prior "BLOCKED pending formula" status — even presence-only testing fails.
- **TC-EXEC-001-02 FAIL** — no section labeled "Asset Overview" or "Executive Summary" exists either. New finding **F-22**.

**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` — updated the `RAISE-FR-OPS-001`, `RAISE-FR-AUDIT-001`, `RAISE-FR-EXEC-001` rows with real evidence-based Test Status (`PARTIAL`, `BLOCKED (partial)` with a passed testable subset, and `FAIL (partial)` respectively — using the document's own defined vocabulary, not an invented one); corrected two stale "no source code exists yet, everything defaults to NOT_TESTED" passages (§2 legend, §7 readiness caveats) that had been false since at least PR #5. `docs/project-management/OPEN-FINDINGS.md` — added a new "Confirmed via Test Execution" category with findings F-21 and F-22.
**What was fixed:** The two stale "no source code exists" passages above (factual-error correction, not narrative rewrite).
**What was added:** F-21, F-22 in `OPEN-FINDINGS.md`.
**What was removed:** None.

**Files changed:** 2 files (`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`).
**Database changes:** None. **API changes:** None. **Frontend changes:** None — this task tests existing code, it doesn't change any.

**Tests:** This *is* the test-execution task — see the 8 results above. No new automated test was written; this was manual/browser-driven execution against `RAISE-TEST-CASES.md`'s existing step definitions, per the user's explicit request to "run test case execution."
**Validation:** N/A in the usual build/lint/vitest sense — no code changed. The validation *is* the browser evidence captured above (screenshots, DOM inspection, and a live `auditService.listAuditLogs()` call executed in the running page, not simulated).

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-001`, `RAISE-FR-AUDIT-001`, `RAISE-FR-EXEC-001`.
Acceptance Criteria: `AC-OPS-001-01..03`, `AC-AUDIT-001-01..03`, `AC-EXEC-001-01..02` — each judged against its own exact Given/When/Then text from `RAISE-ACCEPTANCE-CRITERIA.md`, not an approximation.
Test Case: `TC-OPS-001-01..03`, `TC-AUDIT-001-01..03`, `TC-EXEC-001-01..02` — all 8 now have real, evidence-based results for the first time since these suites were written.

**Git:**
Branch: `docs/tc-execution-ops-audit-exec`
Commit: `2016e7b` (implementation), merged via `ced4b1c` (merge commit, [PR #37](https://github.com/boonthepkstl-alt/stl_asset_service/pull/37)). *(Corrected 2026-08-26, same turn as CHECKPOINT-2026-08-26-002 below — this line originally said "pending merge.")*

**Known Issues:** F-21 and F-22 (above) are real, confirmed defects/gaps — not invented, not PRD-blocked, genuinely actionable whenever prioritized.
**Remaining Work:** `TC-AUDIT-001-01/-03`'s field-taxonomy/role-gate sub-scope and `TC-EXEC-001-01`'s NBV/Risk-formula sub-scope remain BLOCKED on PRD answers, unchanged by this execution — this task closed the "was this actually run?" gap, not the underlying PRD gaps.
**Next Step:** Recalculate `NEXT-STEP.md` — F-21 (QR/Barcode invalid-code state) is a small, fully-scoped, non-PRD-blocked fix and is the strongest new "buildable now" candidate this checkpoint surfaced. Actioned immediately — see `CHECKPOINT-2026-08-26-002` below.

---

## CHECKPOINT-2026-08-26-002

**Phase:** Phase 3 — Asset Management
**Feature:** QR / Barcode Identification
**Task:** Fix F-21 — add a distinct "invalid code" state to the Scan QR flow, separate from "not found," per `AC-OPS-001-03`

**What was implemented:** An `isPlausibleCodeFormat` check (`frontend/src/pages/Assets/index.tsx`) run before attempting an asset lookup in `handleScanSubmit` — rejects any scanned/typed code containing characters outside `[A-Za-z0-9_-]` with a distinct "Invalid code — ... doesn't look like a scannable asset code" message, without calling `assetService.getAsset` at all. A well-formed-but-unmapped code still falls through to the existing "No asset found for ..." message. Deliberately does **not** assert a specific prefix/length (e.g. "must start with AST-") — that would invent a business rule about code format beyond what `AC-OPS-001-03`/Prototype P-007 actually require ("invalid or unreadable"), and would incorrectly reject legitimately-created custom-coded assets (`CreateAssetInput.code` has no format constraint).
**What was modified:** `frontend/src/pages/Assets/index.tsx` (`handleScanSubmit` + new `isPlausibleCodeFormat` helper).
**What was fixed:** F-21.
**What was added:** 2 new tests in `frontend/src/pages/Assets/index.test.tsx` (`TC-OPS-001-02`/`-03` regression coverage).
**What was removed:** None.

**Files changed:** 2 files (+~50/-3 estimate) — `frontend/src/pages/Assets/index.tsx`, `frontend/src/pages/Assets/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Scan QR modal now shows a distinct message for malformed input.

**Tests:**
- Unit Test: `frontend/src/pages/Assets/index.test.tsx` — 2 new (`TC-OPS-001-02` not-found regression, `TC-OPS-001-03` invalid-code fix) — 136/136 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (136/136)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): re-ran the exact TC-OPS-001-01/-02/-03 steps from `CHECKPOINT-2026-08-26-001` — valid code (`AST-0001`) navigates to Asset Detail; unmapped well-formed code (`AST-9999`) shows "No asset found..."; malformed code (`%%$#!!garbage///`) now shows a distinct "Invalid code..." message, confirmed visually distinct from the not-found case.

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-001`
Acceptance Criteria: `AC-OPS-001-03` — met.
Test Case: `TC-OPS-001-01..03` — all three **PASS** on re-execution; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-OPS-001` row updated from `PARTIAL` to `PASS`.

**Git:**
Branch: `frontend/fix-scan-qr-invalid-code-state`
Commit: `05febae` (implementation), merged via `277d2ee` (merge commit, [PR #38](https://github.com/boonthepkstl-alt/stl_asset_service/pull/38)). *(Corrected 2026-08-26 — originally said "pending merge.")*

**Known Issues:** None.
**Remaining Work:** None for `RAISE-FR-OPS-001` — all three test cases now pass.
**Next Step:** Per the recalculated `NEXT-STEP.md`, no fresh "buildable now" item remained after this fix. User chose to keep running formal test-case executions (Option 1 of the two offered) — see `CHECKPOINT-2026-08-26-003` below.

---

## CHECKPOINT-2026-08-26-003

**Phase:** Phase 3 — Asset Management
**Feature:** Formal test case execution for TS-ASSET-001, TS-ASSET-001-DETAIL, TS-ASSET-002, TS-ASSET-003
**Task:** Continue the test-execution sweep started in `CHECKPOINT-2026-08-26-001` — per explicit user instruction to analyze and choose the next task autonomously, selected the Asset Registry/Detail/Category/Custody suites as the next-highest-value target (the most foundational, most-used domain, not yet formally executed)

**What was implemented:** Executed 11 test cases against the real running app. Results:
- **TC-ASSET-001-01 PASS** (list displays, 15 seeded assets), **-02 PASS** (search narrows to matching asset), **-04 PASS** (row click opens Asset Detail).
- **TC-ASSET-001-03 FAIL** — no Category filter exists anywhere in the Assets page's Filters panel (Status/Department/Location only); the Category column header only sorts. New finding **F-23**.
- **TC-ASSET-001-D-01 FAIL** — Asset Detail is missing 2 of the 9 required sections: no "Financial" section (purchase cost/current value never render there, despite existing on the record) and no "Lifecycle" section. New finding **F-24**.
- **TC-ASSET-001-D-02 PASS** — Detail correctly shows only the selected asset's data (verified across two distinct assets, `a1`/`a2`).
- **TC-ASSET-002-01 FAIL** — no P-005 "Category & Hierarchy" screen exists anywhere in routing/navigation at all (confirmed via `grep`, zero matches) — worse than the prior "taxonomy TBD" framing, since even the display mechanism is absent. New finding **F-25**.
- **TC-ASSET-002-02 PASS** — Category is consistent between Asset Registry and Asset Detail for the same asset.
- **TC-ASSET-003-01 PASS** — current holder displays correctly.
- **TC-ASSET-003-02 FAIL** — the "Assignment History" panel shows only a current-state entry plus registration, not a real chronological transfer history; no seeded asset has ≥2 custody events to even test against.
- **TC-ASSET-003-03 FAIL** — performed a real Check-in on `a1` via the UI: the prior "Assigned to Sarah Chen" entry was replaced, not preserved alongside a new appended entry, contradicting `AC-ASSET-003-02`'s append-only requirement for the one write path (Check-in/Check-out) this AC confirms is in scope. New finding **F-26** (covers both -02 and -03).

Net: 6 PASS, 5 FAIL, 4 new findings (F-23 through F-26) — a lower pass rate than the previous sweep (5/8 pass), reflecting that Asset Registry/Detail/Category/Custody has more surface area and known-incomplete areas (holder model, category taxonomy) than the smaller QR/Audit/Dashboard slice tested first.

**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` — updated `RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-002`, `RAISE-FR-ASSET-003` rows with real evidence-based Test Status (`FAIL (partial)`, `FAIL (partial)`, `FAIL` respectively). `docs/project-management/OPEN-FINDINGS.md` — added F-23 through F-26 to the "Confirmed via Test Execution" category.
**What was fixed:** None — this is test execution, not a fix. Also corrected a stale "pending merge" note on `CHECKPOINT-2026-08-26-002` (see above).
**What was added:** F-23, F-24, F-25, F-26.
**What was removed:** None.

**Files changed:** 2 files (`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`).
**Database changes:** None. **API changes:** None. **Frontend changes:** None — this task tests existing code, it doesn't change any.

**Tests:** This *is* the test-execution task — 11 manual/browser-driven test cases against `RAISE-TEST-CASES.md`'s existing step definitions, per the user's explicit request to keep running test-case execution.
**Validation:** N/A in the usual build/lint/vitest sense — no code changed. The validation is the browser evidence captured above, including one real state mutation (Check-in on `a1`) performed and observed live, not simulated.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-002`, `RAISE-FR-ASSET-003`.
Acceptance Criteria: `AC-ASSET-001`, `AC-ASSET-001-DETAIL`, `AC-ASSET-002`, `AC-ASSET-003` — each judged against exact Given/When/Then text.
Test Case: `TC-ASSET-001-01..04`, `TC-ASSET-001-D-01..02`, `TC-ASSET-002-01..02`, `TC-ASSET-003-01..03` — all 11 now have real, evidence-based results for the first time since these suites were written.

**Git:**
Branch: `docs/tc-execution-asset-registry-detail-custody`
Commit: pending merge — part of [PR #39](https://github.com/boonthepkstl-alt/stl_asset_service/pull/39) (predicted PR number, next in sequence after #38 at branch-creation time; verify against the actual PR before treating this as final).

**Known Issues:** F-23 through F-26 are real, confirmed defects — not PRD-blocked, genuinely actionable whenever prioritized. F-24 and F-26 in particular touch core Asset Detail/Custody UX, not edge cases.
**Remaining Work:** None for this task itself — it's a read-only test-execution pass. The findings it produced are separate follow-up work.
**Next Step:** Recalculate `NEXT-STEP.md`. F-23 (missing Category filter) is the smallest, most self-contained new finding — a reasonable next "buildable now" candidate, similar in shape to F-21.

---

## CHECKPOINT-2026-08-26-004

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Registry
**Task:** Fix F-23 — add a Category filter to the Asset Registry's Filters panel, per `AC-ASSET-001`/`TC-ASSET-001-03`, per explicit user instruction ("งานถัดไป: F-23")

**What was implemented:** A Category `Select` in the Assets page's Filters panel (`frontend/src/pages/Assets/index.tsx`), positioned between Status and Department, following the exact pattern the existing Department/Location selects already use. Sourced from a new `categories` fixture export (`frontend/src/data/fixtures/mockData.ts`) — a hardcoded distinct-values list (`IT Hardware`, `Mobile`, `Office Equipment`, `Infrastructure`, `Media Equipment`), mirroring how `departments`/`locations` are already defined rather than deriving categories dynamically. Wired through a new `category` field on `AssetListQuery` (`frontend/src/types/asset.ts`) into `MockAssetRepository.list()`'s filter predicate (`frontend/src/services/asset-repository.ts`) and `useAssets`'s effect dependency array. Deliberately **not** forwarded to `HttpAssetRepository`'s query params — `go-template-main`'s `GET /assets` controller only documents `search`/`status`/`department`/`page`/`limit` (confirmed via `assetController.go`'s own doc comment); adding an unsupported query param there would silently no-op against a real backend instead of filtering, which would be worse than the gap it "fixes." This mirrors F-21's precedent of not inventing scope beyond what's confirmed. "Clear filters" and its visibility condition were extended to include the new filter.
**What was modified:** `frontend/src/pages/Assets/index.tsx`, `frontend/src/hooks/useAssets.ts`, `frontend/src/services/asset-repository.ts`, `frontend/src/types/asset.ts`, `frontend/src/data/fixtures/mockData.ts`.
**What was fixed:** F-23.
**What was added:** 1 new test in `frontend/src/pages/Assets/index.test.tsx` (`TC-ASSET-001-03` regression coverage); `categories` fixture export.
**What was removed:** None.

**Files changed:** 6 files — the 5 modified above plus the test file.
**Database changes:** None. **API changes:** None (intentionally — see above). **Frontend changes:** Assets page Filters panel now has a working Category filter.

**Tests:**
- Unit Test: `frontend/src/pages/Assets/index.test.tsx` — 1 new (`TC-ASSET-001-03`: filtering by Category narrows the list, then Clear filters resets it) — 137/137 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (137/137)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): re-ran `TC-ASSET-001-03` — selected Category = "Infrastructure" in the Filters panel, list narrowed from 15 assets to 2 (`Dell PowerEdge R750`, `Cisco Catalyst 9300`, both correctly `Infrastructure`), "Clear filters" appeared and, on click, restored all 15 assets.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-001`
Acceptance Criteria: `AC-ASSET-001` — met for the Category-filter clause.
Test Case: `TC-ASSET-001-03` — now **PASS** on re-execution; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-001` row updated accordingly (F-24/`TC-ASSET-001-D-01` remains open and unaffected).

**Git:**
Branch: `docs/tc-execution-asset-registry-detail-custody` (stacked on top of the still-open PR #39 branch, rather than a fresh branch off `main`, since PR #39 was still unmerged when this task started and this fix's close-out documentation builds directly on content PR #39 introduces — F-23's finding text, this checkpoint sequence, and the traceability-matrix row PR #39 last touched. Mirrors the precedent set by PR #36 stacking onto an open branch instead of opening a competing PR.)
Commit: pending merge — will ship as part of the same PR that supersedes/extends #39 (verify actual PR number before treating this as final; PR #39 was still `OPEN`, not merged, as of this checkpoint).

**Known Issues:** None new.
**Remaining Work:** F-24 (missing Financial/Lifecycle sections on Asset Detail), F-25 (no Category & Hierarchy screen), F-26 (Custody History not append-only) remain open — none in scope for this task.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-23 now resolved, F-24 (same file family, `frontend/src/pages/AssetDetail/index.tsx`) is the next reasonable "buildable now" candidate, but re-run the Next-Step Protocol rather than assuming that order holds.

---

## CHECKPOINT-2026-08-27-001

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Registry (Asset Detail)
**Task:** Fix F-24 — add the missing Financial and Lifecycle sections to Asset Detail, per `AC-ASSET-001-DETAIL`/`TC-ASSET-001-D-01`, per explicit user instruction ("Start on F-24")

**What was implemented:** Two new `SectionCard`s on Asset Detail's Overview tab (`frontend/src/pages/AssetDetail/index.tsx`):
- **Financial** — Purchase Cost, Current Value, Purchase Date, all sourced from fields the `Asset` record already carries (the same `purchaseCost`/`currentValue` the Assets list column already renders) — no new financial modeling (depreciation schedule, book-value formula) was invented.
- **Lifecycle** — a connectivity summary with 5 clickable rows (Procurement, Custody, Warranty, Maintenance, Audit), each showing a one-line live summary (e.g. "2 tickets", "Assigned to Sarah Chen") and jumping to the tab that owns that data on click. This directly implements Prototype P-004's stated principle ("one asset → connected information across its lifecycle") and `AC-LIFE-001-01` ("cross-domain records shown as connected to that one asset") without inventing a separate lifecycle-stage data model — every value shown is read from data the page already fetches (`asset`, `assetTickets`, `auditEntries`).
A new `LifecycleRow` helper component was added alongside the existing `InfoRow` helper.
**What was modified:** `frontend/src/pages/AssetDetail/index.tsx`.
**What was fixed:** F-24.
**What was added:** 1 new test in `frontend/src/pages/AssetDetail/index.test.tsx` (`TC-ASSET-001-D-01` regression coverage); `LifecycleRow` component.
**What was removed:** None.

**Files changed:** 2 files — `frontend/src/pages/AssetDetail/index.tsx`, `frontend/src/pages/AssetDetail/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Asset Detail's Overview tab now has Financial and Lifecycle sections.

**Tests:**
- Unit Test: `frontend/src/pages/AssetDetail/index.test.tsx` — 1 new (`TC-ASSET-001-D-01`: Financial and Lifecycle sections present with real data) — 138/138 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (138/138)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): opened asset `a1` (MacBook Pro 16" M3) — Financial section shows "$3,299" / "$2,800" / "2024-01-15"; Lifecycle section shows all 5 rows with live values ("Assigned to Sarah Chen", "Active until 2027-01-15", "2 tickets", "No audit entries yet"); clicking the Maintenance row correctly switched the active tab to "Maintenance & Tickets".

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-001`, `RAISE-FR-LIFE-001`
Acceptance Criteria: `AC-ASSET-001-D-01`, `AC-LIFE-001-01` — both met.
Test Case: `TC-ASSET-001-D-01` — now **PASS** on re-execution; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-001` row updated from `FAIL (partial)` to full `PASS` (all 6 test cases now pass).

**Git:**
Branch: `frontend/fix-asset-detail-financial-lifecycle`
Commit: `ec328e3` (implementation), merged via `c87ad3a` (merge commit, [PR #40](https://github.com/boonthepkstl-alt/stl_asset_service/pull/40)). *(Corrected 2026-08-27, same turn as CHECKPOINT-2026-08-27-002 below — this line originally said "pending merge.")*

**Known Issues:** None new. *(2 code-review findings surfaced against this checkpoint's own diff after merge — see `CHECKPOINT-2026-08-27-002` below.)*
**Remaining Work:** F-25 (no Category & Hierarchy screen), F-26 (Custody History not append-only) remain open — neither in scope for this task.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-23 and F-24 both resolved, F-26 (Custody History not append-only) is a reasonable next candidate — same file (`AssetDetail/index.tsx`) but touches state-mutation logic (Check-in), not just display, a slightly higher-risk change than F-23/F-24 were. F-25 (whole new screen) remains the largest. Re-run the Next-Step Protocol rather than assuming this order holds.

---

## CHECKPOINT-2026-08-27-002

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Registry (Asset Detail)
**Task:** Fix 2 findings from a `/code-review` pass on `CHECKPOINT-2026-08-27-001`'s diff (PR #40, merged)

**What was implemented:**
- **Dead-click affordance (correctness):** the new Lifecycle section's "Procurement" and "Warranty" rows were styled identically to "Custody"/"Maintenance"/"Audit" (hover state, chevron, `<button>`) but their `onClick` only called `setTab('overview')` — a no-op, since that section only renders when the Overview tab is already active. `LifecycleRow`'s `onClick` prop is now optional: rows without a handler (Procurement, Warranty — both already fully shown on this same tab, with nowhere else to navigate to) render as a plain non-interactive `<div>` (no hover, no chevron); Custody/Maintenance/Audit keep the `<button>` form since they do navigate.
- **Duplicate computation (simplification):** `new Date(asset.warrantyExpiry) < new Date()` was being evaluated 3 separate times per render (once new, in the Lifecycle row; twice pre-existing, in the Warranty & Coverage badge's variant and label). Hoisted to a single `isWarrantyExpired` local, computed once alongside `Icon`, reused in both places.

**What was modified:** `frontend/src/pages/AssetDetail/index.tsx` (`LifecycleRow`, the Lifecycle section's Procurement/Warranty rows, `isWarrantyExpired`, the Warranty & Coverage badge).
**What was fixed:** Both findings from the `/code-review` pass, above.
**What was added:** None — no new test needed; existing `TC-ASSET-001-D-01` regression test already covers the Lifecycle/Financial sections' presence and continues to pass unchanged.
**What was removed:** The 2 duplicate inline `new Date(asset.warrantyExpiry) < new Date()` expressions.

**Files changed:** 1 file — `frontend/src/pages/AssetDetail/index.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Procurement/Warranty rows in the Lifecycle section are no longer visually clickable.

**Tests:**
- Unit Test: No new test — `frontend/src/pages/AssetDetail/index.test.tsx`'s existing `TC-ASSET-001-D-01` test re-verified unchanged — 138/138 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (138/138)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): on asset `a1`, queried the DOM directly — "Procurement" and "Warranty" now render as `DIV`s (no chevron), while "Custody", "Maintenance", "Audit" remain `BUTTON`s.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-001`, `RAISE-FR-LIFE-001` (unchanged from `CHECKPOINT-2026-08-27-001` — this is a quality fix to the same feature, not a new requirement).
Acceptance Criteria: `AC-ASSET-001-D-01`, `AC-LIFE-001-01` — still met; this fix makes the implementation more honestly match "connected information," not less.
Test Case: `TC-ASSET-001-D-01` — still **PASS**, unaffected.

**Git:**
Branch: `frontend/asset-detail-lifecycle-review-fixes`
Commit: `242d5f4` (implementation), merged via `bbf84fe` (merge commit, [PR #41](https://github.com/boonthepkstl-alt/stl_asset_service/pull/41)).

**Known Issues:** None.
**Remaining Work:** F-25, F-26 remain open — unaffected by this fix.
**Next Step:** Unchanged from `CHECKPOINT-2026-08-27-001` — F-26 (Custody History not append-only) remains the recommended next task; see `NEXT-STEP.md`.

---

## CHECKPOINT-2026-08-27-003

**Phase:** Phase 3 — Asset Management
**Feature:** Asset Registry (Asset Detail — Custody History)
**Task:** Fix F-26 — make Custody/Assignment History append-only, per `AC-ASSET-003-02`/`TC-ASSET-003-02..03`

**What was implemented:** Rewired Asset Detail's History tab (`frontend/src/pages/AssetDetail/index.tsx`) to render from the same per-asset audit trail `RAISE-FR-AUDIT-001` already builds, instead of deriving a single "current custody state" row from `asset.assignedTo` at render time. `useAuditLogs({ entityType: 'asset', entityId: asset.id })` was already fetched at the top of the component (feeding the existing Audit tab) — the History tab now maps over that same `auditEntries` list. This is append-only by construction: `recordMockAuditEntry` (`audit-repository.ts`) only ever `mockAuditStore.unshift(entry)`, never mutates or removes an existing entry, and `MockAssetRepository.assign`/`checkIn` already call it on every custody change (and already call `refetchAuditEntries()` after each mutation). No new custody-log data model, field, or store was invented — this reuses infrastructure `RAISE-FR-AUDIT-001` (PR #31) already shipped. The invented "Asset Registered" row (sourced from `asset.purchaseDate`/`purchaseCost`, not real audit data) was dropped in favor of an honest empty state matching the Audit tab's existing wording ("No custody-changing events recorded yet... Pre-existing seeded assets have no history to backfill"). The History tab's badge count (previously hardcoded `5`, unrelated to any real data) now also reflects `auditEntries.length`, matching the pattern the Maintenance & Tickets tab's count already used.
**What was modified:** `frontend/src/pages/AssetDetail/index.tsx` (History tab body, tab count badge).
**What was fixed:** F-26.
**What was added:** 1 new test in `frontend/src/pages/AssetDetail/index.test.tsx` (`TC-ASSET-003-02/-03`: performs a real Check-in then Assign via the UI, confirms both entries appear without either being overwritten).
**What was removed:** The derived single-row "current custody state" + invented "Asset Registered" row.

**Files changed:** 2 files — `frontend/src/pages/AssetDetail/index.tsx`, `frontend/src/pages/AssetDetail/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Asset Detail's History tab now shows a real, growing, append-only log instead of a static 2-row summary.

**Tests:**
- Unit Test: `frontend/src/pages/AssetDetail/index.test.tsx` — 1 new (`TC-ASSET-003-02/-03`) — 139/139 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (139/139)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): on asset `a1`, confirmed the History tab starts empty (no backfilled entries for the seeded fixture), then performed a real Check-in via the UI (appended "Asset checked in", timestamped) followed by a real Assign to Sarah Chen (appended "Asset assigned to Sarah Chen" alongside it, not replacing it) — both entries visible afterward, newest-first, with the History tab's count badge updating from 0 → 1 → 2 live.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-003`
Acceptance Criteria: `AC-ASSET-003-02` — met.
Test Case: `TC-ASSET-003-01..03` — all three now **PASS** on re-execution (TC-ASSET-003-01 was already passing); `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-003` row updated from `FAIL` to `PASS`.

**Git:**
Branch: `frontend/fix-custody-history-append-only`
Commit: `2cb6443` (implementation), merged via `838aa34` (merge commit, [PR #42](https://github.com/boonthepkstl-alt/stl_asset_service/pull/42)).

**Known Issues:** None new.
**Remaining Work:** F-25 (no Category & Hierarchy screen) remains open — the only unresolved finding left from the 2026-08-26 Asset-domain test-execution sweep.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-23, F-24, and F-26 all resolved, F-25 (no Category & Hierarchy screen) is the only remaining non-PRD-blocked finding — it needs a scoped-down first cut (a whole new screen, with taxonomy content still TBD) rather than a small fix like the prior three. Re-run the Next-Step Protocol rather than assuming this is still the only option (a PRD answer on Warranty/F-01 also remains outstanding).

---

## CHECKPOINT-2026-08-28-001

**Phase:** Phase 3 — Asset Management
**Feature:** Category & Hierarchy (new screen, P-005)
**Task:** Fix F-25 — build a scoped-down first cut of the Category & Hierarchy screen, per `RAISE-FR-ASSET-002`/`TC-ASSET-002-01`, per explicit user instruction ("Start on F-25")

**What was implemented:** A new page (`frontend/src/pages/Categories/index.tsx`, route `/categories`, nav entry "Category & Hierarchy" under the "Assets" sidebar group) that lists every known category (from the `categories` fixture export added for F-23) as an expandable parent node, showing a live per-category asset count. Expanding a category reveals the real assets registered under it (name, code, status), each clickable through to its Asset Detail page. This deliberately implements only the one parent/child relationship actually confirmed anywhere in the chain — category → its real assets — and explicitly does **not** build Prototype P-005's illustrative sub-category tree (Computer > Notebook/Desktop, Network > Switch/Router), since that hierarchy is marked "not finalized business data" in Prototype §11 and `AC-ASSET-002` itself carries a "NOT TESTABLE YET" note on it. A new finding, **F-27**, was added to `OPEN-FINDINGS.md` to track that still-open taxonomy question separately, so it isn't silently dropped now that the screen itself exists.
**What was modified:** `frontend/src/App.tsx` (new route), `frontend/src/config/constants.ts` (`ROUTES.CATEGORIES`), `frontend/src/config/navigation.ts` (new nav item + `pageTitles` entry), `frontend/src/App.navigation.test.tsx` (new click-through regression test + id/route guard assertion).
**What was fixed:** F-25.
**What was added:** New page `frontend/src/pages/Categories/index.tsx` + its test file (`frontend/src/pages/Categories/index.test.tsx`, 2 tests); new finding F-27 (sub-category taxonomy still TBD).
**What was removed:** None.

**Files changed:** 6 files — `frontend/src/pages/Categories/index.tsx` (new), `frontend/src/pages/Categories/index.test.tsx` (new), `frontend/src/App.tsx`, `frontend/src/App.navigation.test.tsx`, `frontend/src/config/constants.ts`, `frontend/src/config/navigation.ts`.
**Database changes:** None. **API changes:** None. **Frontend changes:** New "Category & Hierarchy" screen reachable from the sidebar.

**Tests:**
- Unit Test: `frontend/src/pages/Categories/index.test.tsx` — 2 new (`TC-ASSET-002-01`: all 5 categories render as parent nodes; expanding a category shows its real assets). `frontend/src/App.navigation.test.tsx` — 1 new click-through test + 1 new id/route assertion. 142/142 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (142/142)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): navigated to `/categories` directly — all 5 categories render with correct live counts (IT Hardware 6, Mobile 4, Office Equipment 2, Infrastructure 2, Media Equipment 1); expanding "IT Hardware" showed all 6 real seeded assets with status badges; clicking one navigated to its Asset Detail page; from the Assets page, clicking "Category & Hierarchy" in the sidebar correctly reached the new screen.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-002`
Acceptance Criteria: `AC-ASSET-002-01` — met for the confirmed parent/child data (category → assets); the illustrative sub-category taxonomy remains explicitly out of scope (tracked as F-27). `AC-ASSET-002-02` — unaffected, still passing.
Test Case: `TC-ASSET-002-01` — now **PASS (scoped)** on re-execution; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ASSET-002` row updated from `FAIL (partial)` to `PASS (scoped)`.

**Git:**
Branch: `frontend/category-hierarchy-first-cut`
Commit: `fe5a9ba` (implementation), merged via `7c17b25` (merge commit, [PR #43](https://github.com/boonthepkstl-alt/stl_asset_service/pull/43)). *(Corrected 2026-08-28, same turn as CHECKPOINT-2026-08-28-002 below — this line originally said "pending merge.")*

**Known Issues:** F-27 (sub-category taxonomy undefined) is a new, intentionally-tracked open item — not a regression, a deliberate scope boundary.
**Remaining Work:** None from the 2026-08-26 Asset-domain test-execution sweep — F-21 through F-26 are all now resolved (only F-22, a scope-reconciliation question, remains genuinely open from that sweep, alongside the newly-tracked F-27).
**Next Step:** Recalculate `NEXT-STEP.md`. With the entire 2026-08-26 Asset-domain sweep's actionable findings closed, likely next candidates are a new formal test-case-execution sweep on a not-yet-tested suite (TS-LOGIN, TS-DASH, TS-OPS-002, TS-MAINT-001, etc.) or resurfacing F-01 (Warranty field list), the longest-standing uncompleted request in this session. Re-run the Next-Step Protocol rather than assuming either by default. *(Superseded same-day by a user-requested UX change — see `CHECKPOINT-2026-08-28-002` below.)*

---

## CHECKPOINT-2026-08-28-002

**Phase:** Phase 3 — Asset Management
**Feature:** Category & Hierarchy (UX consolidation)
**Task:** Fold the standalone Category & Hierarchy screen (`CHECKPOINT-2026-08-28-001`, PR #43) into Asset Management as a "By Category" view, per explicit user feedback that a dedicated sidebar item was disproportionate for a secondary/derived view of the same Asset Registry data

**What was implemented:** The user asked (in Thai) whether Category & Hierarchy should live somewhere other than its own top-level page, since it isn't a primary destination; after discussing options, the user chose "fold it into Asset Management as an alternate view/tab." Removed the standalone `/categories` route, its sidebar nav entry, and `frontend/src/pages/Categories/` entirely; ported the same tree UI (category → its real assets, expand/collapse, click-through to Asset Detail) into `frontend/src/pages/Assets/index.tsx` as a new "By Category" tab (via the shared `Tabs` component) alongside the existing "List" view (the pre-existing DataTable). No behavior or content changed — same categories, same counts, same click-through — only its location and navigation path did. This matches Design/Prototype's own grouping of P-005 under the Asset Management area (Design §4.1), rather than treating it as an independent module.
**What was modified:** `frontend/src/pages/Assets/index.tsx` (new "By Category" tab + tree view), `frontend/src/App.tsx` (removed `/categories` route), `frontend/src/config/constants.ts` (removed `ROUTES.CATEGORIES`), `frontend/src/config/navigation.ts` (removed the `categories` nav item + its `pageTitles` entry), `frontend/src/App.navigation.test.tsx` (removed the now-obsolete click-through test and id assertion).
**What was fixed:** N/A — this is a UX relocation, not a defect fix.
**What was added:** 2 new tests in `frontend/src/pages/Assets/index.test.tsx` (`TC-ASSET-002-01`/consistency, ported from the deleted `Categories/index.test.tsx`).
**What was removed:** `frontend/src/pages/Categories/index.tsx` + its test file; the standalone `/categories` route and sidebar nav entry.

**Files changed:** 8 files — 2 deleted (`Categories/index.tsx`, `Categories/index.test.tsx`), 6 modified (`Assets/index.tsx`, `Assets/index.test.tsx`, `App.tsx`, `App.navigation.test.tsx`, `config/constants.ts`, `config/navigation.ts`).
**Database changes:** None. **API changes:** None. **Frontend changes:** Category & Hierarchy is now a tab inside Asset Management instead of its own sidebar destination.

**Tests:**
- Unit Test: `frontend/src/pages/Assets/index.test.tsx` — 2 new (ported from the deleted Categories test file) — 141/141 frontend tests passing overall (142 before this checkpoint, −2 deleted Categories tests, −1 deleted nav click-through test, +2 new Assets tests = 141).
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (141/141)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): on `/assets`, clicked "By Category" — all 5 categories render with correct counts; expanding "IT Hardware" shows its 6 real assets; clicking one navigates to Asset Detail; confirmed via DOM query that no sidebar button labeled "Category & Hierarchy" exists anymore.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-002` (unchanged — this is a presentation-location change, not a requirement or acceptance-criteria change).
Acceptance Criteria: `AC-ASSET-002-01`/`-02` — still met, same as `CHECKPOINT-2026-08-28-001`.
Test Case: `TC-ASSET-002-01`/`-02` — still **PASS (scoped)**, re-verified at the new location.

**Git:**
Branch: `frontend/category-hierarchy-fold-into-assets`
Commit: `e05648c` (implementation), merged via `87bdc79` (merge commit, [PR #44](https://github.com/boonthepkstl-alt/stl_asset_service/pull/44)). *(Corrected 2026-08-28, same turn as CHECKPOINT-2026-08-28-003 below — this line originally said "pending merge.")*

**Known Issues:** None new.
**Remaining Work:** Unchanged from `CHECKPOINT-2026-08-28-001` — F-22 and F-27 remain open scope questions; no engineering task is currently blocked.
**Next Step:** Unchanged from `CHECKPOINT-2026-08-28-001` — a new formal test-case-execution sweep on a not-yet-tested suite, or resurfacing F-01 (Warranty field list). See `NEXT-STEP.md`.

---

## CHECKPOINT-2026-08-28-003

**Phase:** Phase 3 — Asset Management (`RAISE-FR-OPS-002`) / Phase 4 — ITSM (`RAISE-FR-MAINT-001`)
**Feature:** Formal test case execution for TS-OPS-002, TS-MAINT-001
**Task:** Run a new formal test-case-execution sweep, per explicit user instruction ("รัน test-case execution sweep รอบใหม่") and `NEXT-STEP.md`'s own recommendation — picked the two most-built, not-yet-formally-tested suites (`RAISE-FR-OPS-002` Check-in/Check-out and `RAISE-FR-MAINT-001` 4-stage Maintenance workflow), both previously carrying only a pre-code-era `BLOCKED` guess in `RAISE-TRACEABILITY-MATRIX.md`, never re-verified against the real running app.

**What was implemented:** Executed 12 test cases against the real running app. Results:
- **TC-OPS-002-01 PASS** — "Assign" (the app's real affordance for identifying a holder and confirming; no distinct "Check-out" label exists, but the behavior matches AC-OPS-002-01) updated custody on asset `a4` to the new holder.
- **TC-OPS-002-02 PASS** — Check-in correctly returned the asset to Available/Unassigned.
- **TC-OPS-002-03 PASS** — both operations created a corresponding Audit Log entry, visible with actor and timestamp.
- **TC-MAINT-001-03 PASS** — a new requisition ("New IT Requisition") entered `PENDING_DEPT_APPROVAL`.
- **TC-MAINT-001-04 PASS** — Dept Sign-off → Approve transitioned it to `PENDING_IT_DISPATCH`.
- **TC-MAINT-001-05 PASS** — Reject on a separate ticket resulted in `REJECTED_BY_DEPT`, confirmed not `PENDING_IT_DISPATCH`.
- **TC-MAINT-001-06 PASS** — Assign Tech + Dispatch transitioned to `IN_PROGRESS`.
- **TC-MAINT-001-07 PASS** — Update Status to On-Hold correctly reflected "3. On-Hold" with the hold-reason banner.
- **TC-MAINT-001-08 PASS** — Mark Complete transitioned to `DONE`/"4. Resolved & Closed" with resolution notes shown.
- **TC-MAINT-001-02 PASS** — 2 maintenance records for asset `a1` displayed in ascending-chronological order by observed outcome (though the underlying code has no explicit sort — noted as a fragility, not a current failure).
- **TC-MAINT-001-01 FAIL** — the Maintenance & Tickets tab on Asset Detail shows only ticket code, priority, workflow-stage badge, and title per record; no date or cost field renders anywhere, contradicting `AC-MAINT-001-01`'s explicit requirement. New finding **F-28**.
- **TC-MAINT-001-09 FAIL** — the 4-stage progress indicator (`GovernanceStep`) only renders 2 visual states (done vs. not-done); the "Current" stage and a "Pending" future stage look identical. Verified at `PENDING_IT_DISPATCH`: stage 3 (current) and stage 4 (pending) rendered indistinguishably. New finding **F-29**.

Net: 10 PASS, 2 FAIL, 2 new findings (F-28, F-29) — a notably higher pass rate than either 2026-08-26 sweep, since both requirements were previously only a pre-code-era `BLOCKED` guess, never actually exercised against real, already-built functionality.

**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` — updated `RAISE-FR-OPS-002` (from `BLOCKED` guess to real `PASS`) and `RAISE-FR-MAINT-001` (from `BLOCKED` guess to real `FAIL (partial)`) rows with evidence-based Test Status. `docs/project-management/OPEN-FINDINGS.md` — added F-28, F-29 to the "Confirmed via Test Execution" category.
**What was fixed:** None — this is test execution, not a fix.
**What was added:** F-28, F-29.
**What was removed:** None.

**Files changed:** 2 files (`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`).
**Database changes:** None. **API changes:** None. **Frontend changes:** None — this task tests existing code, it doesn't change any.

**Tests:** This *is* the test-execution task — 12 manual/browser-driven test cases against `RAISE-TEST-CASES.md`'s existing step definitions.
**Validation:** N/A in the usual build/lint/vitest sense — no code changed. The validation is the browser evidence captured above, including real state mutations (Assign/Check-in on `a4`; a new ticket created, approved, dispatched, put on hold, and completed; a separate ticket rejected) performed and observed live, not simulated.

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002`, `RAISE-FR-MAINT-001`.
Acceptance Criteria: `AC-OPS-002`, `AC-MAINT-001` (all 9 sub-criteria) — each judged against exact Given/When/Then text.
Test Case: `TC-OPS-002-01..03`, `TC-MAINT-001-01..09` — all 12 now have real, evidence-based results for the first time since these suites were written.

**Git:**
Branch: `docs/tc-execution-ops002-maint001`
Commit: `deca6d9` (implementation), merged via `db8630d` (merge commit, [PR #45](https://github.com/boonthepkstl-alt/stl_asset_service/pull/45)). *(Corrected 2026-08-28, same turn as CHECKPOINT-2026-08-28-004 below — this line originally said "pending merge.")*

**Known Issues:** F-28 and F-29 are real, confirmed defects — not PRD-blocked, genuinely actionable whenever prioritized.
**Remaining Work:** None for this task itself — it's a read-only test-execution pass. F-28/F-29 are separate follow-up work.
**Next Step:** Recalculate `NEXT-STEP.md`. F-28 (missing date/cost fields) is likely the smaller, more self-contained fix of the two; F-29 (progress-indicator states) needs a small `GovernanceStep` prop/rendering change. Either is a reasonable next "buildable now" candidate — re-run the Next-Step Protocol rather than assuming which.

---

## CHECKPOINT-2026-08-28-004

**Phase:** Phase 4 — ITSM (IT Service Management / Maintenance)
**Feature:** Maintenance (Asset Detail — Maintenance & Tickets tab)
**Task:** Fix F-28 — add date and cost fields to the Maintenance record list, per `AC-MAINT-001-01`/`TC-MAINT-001-01`, per explicit user instruction ("Start on F-28")

**What was implemented:** Each row in Asset Detail's "Maintenance & Tickets" tab (`frontend/src/pages/AssetDetail/index.tsx`) now shows a caption line with the ticket's created date (`t.createdAt`) and a cost figure, closing the last 2 of the 4 fields (`AC-MAINT-001-01` requires date/event/status/cost — event and status already rendered). Cost prefers `t.itExecution.actualCost` (set once IT Dispatch/Technician work completes) and falls back to `t.itAssignment.estimatedCost` (set at Dispatch); for a ticket that hasn't reached Dispatch yet, neither field exists, so the row renders an honest "—" rather than a fabricated $0 or guessed figure — no new field or data model was invented, both cost fields already existed on the `Ticket` type.
**What was modified:** `frontend/src/pages/AssetDetail/index.tsx` (Maintenance & Tickets tab row render).
**What was fixed:** F-28.
**What was added:** 1 new test in `frontend/src/pages/AssetDetail/index.test.tsx` (`TC-MAINT-001-01` regression coverage).
**What was removed:** None.

**Files changed:** 2 files — `frontend/src/pages/AssetDetail/index.tsx`, `frontend/src/pages/AssetDetail/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Each maintenance record on Asset Detail now shows its created date and cost (or an honest "—" if not yet known).

**Tests:**
- Unit Test: `frontend/src/pages/AssetDetail/index.test.tsx` — 1 new (`TC-MAINT-001-01`: date/cost render correctly for a dispatched ticket) — 142/142 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (142/142)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): on asset `a1`'s Maintenance & Tickets tab, `REQ-2026-0042` (dispatched, in progress) shows "2026-08-15 09:30 AM · Cost: $120" (the actual cost, preferred over the earlier $350 estimate); `REQ-2026-0044` (not yet dispatched) shows "2026-08-16 09:15 AM · Cost: —", confirming the honest-placeholder path.

**Requirement Traceability:**
PRD: `RAISE-FR-MAINT-001`
Acceptance Criteria: `AC-MAINT-001-01` — met.
Test Case: `TC-MAINT-001-01` — now **PASS** on re-execution; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-MAINT-001` row updated accordingly (F-29/`TC-MAINT-001-09` remains open and unaffected — row stays `FAIL (partial)`, 8/9).

**Git:**
Branch: `frontend/fix-maintenance-record-date-cost`
Commit: `2d27cb5` (implementation), merged via `049736d` (merge commit, [PR #46](https://github.com/boonthepkstl-alt/stl_asset_service/pull/46)). *(Corrected 2026-08-28, same turn as CHECKPOINT-2026-08-28-005 below — this line originally said "pending merge.")*

**Known Issues:** None new.
**Remaining Work:** F-29 (stage-progress indicator doesn't distinguish Current from Pending) remains open — not in scope for this task.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-28 resolved, F-29 is the last open finding from the 2026-08-28 sweep — a reasonable next candidate, but re-run the Next-Step Protocol rather than assuming.

---

## CHECKPOINT-2026-08-28-005

**Phase:** Phase 4 — ITSM (IT Service Management / Maintenance)
**Feature:** Maintenance (Ticket Detail — 4-Stage Governance & Audit Trail)
**Task:** Fix F-29 — make the 4-stage progress indicator distinguish Current from Pending, per `AC-MAINT-001-09`/`TC-MAINT-001-09`, per explicit user instruction ("Start on F-29")

**What was implemented:** `TicketDetailPage` (`frontend/src/pages/TicketDetail/index.tsx`) now derives a `currentStage` (2, 3, 4, or `null`) directly from `ticket.status` — `PENDING_DEPT_APPROVAL` → 2, `PENDING_IT_DISPATCH` → 3, `PLANNING`/`IN_PROGRESS`/`ON_HOLD` → 4, `DONE`/`REJECTED_BY_DEPT` → `null` (no current stage: all done, or the flow terminated at Stage 2) — no new field invented, `ticket.status` already fully determines this. `GovernanceStep` gained a `current?: boolean` prop and a 3rd visual state: a brand-colored circle with a ring (instead of the plain gray "not done" circle), a highlighted brand-tinted card background, and a "Current" `Badge`, applied only when `current` is true. Stage 1 (User Requisition) is always `done` once a ticket exists, so it never needs a `current` state.
**What was modified:** `frontend/src/pages/TicketDetail/index.tsx` (`currentStage` derivation, `GovernanceStep`'s 4 call sites, `GovernanceStep` component).
**What was fixed:** F-29.
**What was added:** 1 new test in `frontend/src/pages/TicketDetail/index.test.tsx` (`TC-MAINT-001-09` regression coverage).
**What was removed:** None.

**Files changed:** 2 files — `frontend/src/pages/TicketDetail/index.tsx`, `frontend/src/pages/TicketDetail/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** The 4-stage governance indicator on Ticket Detail now visually distinguishes the current stage from both done and pending stages.

**Tests:**
- Unit Test: `frontend/src/pages/TicketDetail/index.test.tsx` — 1 new (`TC-MAINT-001-09`: the current stage renders distinctly from a done stage) — 143/143 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (143/143)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): checked 3 tickets at different stages — `REQ-2026-0043` (`PENDING_DEPT_APPROVAL`) shows stage 2 with a "Current" badge, stages 3/4 plain; `REQ-2026-0042` (`IN_PROGRESS`) shows stage 4 current, stages 2/3 done; `REQ-2026-0040` (`DONE`) shows all 4 stages done, no "Current" badge anywhere.

**Requirement Traceability:**
PRD: `RAISE-FR-MAINT-001`
Acceptance Criteria: `AC-MAINT-001-09` — met.
Test Case: `TC-MAINT-001-09` — now **PASS** on re-execution; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-MAINT-001` row updated from `FAIL (partial)` (8/9) to full `PASS` (9/9) — all findings from the 2026-08-28 sweep are now resolved.

**Git:**
Branch: `frontend/fix-governance-current-stage-indicator`
Commit: `9a4077d` (implementation), merged via `1e31888` (merge commit, [PR #47](https://github.com/boonthepkstl-alt/stl_asset_service/pull/47)).

**Known Issues:** None new.
**Remaining Work:** None from the 2026-08-28 sweep — F-28 and F-29 are both resolved. F-22 (Executive Dashboard scope question) and F-27 (Category sub-taxonomy) remain open from earlier sweeps.
**Next Step:** Recalculate `NEXT-STEP.md`. With `RAISE-FR-OPS-002` and `RAISE-FR-MAINT-001` both now fully passing, likely next candidates are a new test-execution sweep on a not-yet-tested suite (e.g. `TS-LOGIN`, `TS-DASH`) or resurfacing F-01 (Warranty field list) — re-run the Next-Step Protocol rather than assuming either.

---

## CHECKPOINT-2026-08-29-001

**Phase:** Phase 2 — Authentication / RBAC
**Feature:** Formal test case execution for TS-LOGIN
**Task:** Run a new formal test-case-execution sweep, per explicit user instruction and `NEXT-STEP.md`'s own recommendation — `RAISE-NFR-SEC-RBAC-001`/`TS-LOGIN` was the most-built, not-yet-formally-tested candidate (Login page + `AuthContext` both exist), previously carrying only a pre-code-era `BLOCKED` guess.

**What was implemented:** Executed 3 test cases against the real running app. Before executing, confirmed a real constraint: unlike Asset/Employee/Ticket, `auth-service.ts` has no mock fallback — `login()` always calls the real `go-template-main` backend. Checked for a locally reachable Postgres (port 5432) and a backend `docker-compose`/`.env.example` — neither exists in this environment. Results:
- **TC-LOGIN-01 BLOCKED** — submitted the documented demo credential (`admin`/`password`) via the real Login form; the request failed with `net::ERR_CONNECTION_REFUSED` (confirmed via network trace, `POST http://localhost:8080/api/auth/login`) before reaching any real auth logic. Cannot be tested without a live backend + database.
- **TC-LOGIN-02 BLOCKED** — same connectivity failure. Login's `catch` block shows the identical "Invalid username or password" message for *any* failure (network-down or genuinely-wrong credentials alike), so even the visible symptom on screen can't be used to infer this case passed — the observed trigger was connectivity, not credential validation.
- **TC-LOGIN-03 PASS** — simulated an authenticated non-admin user (`role: 'VIEWER'`, via the same `localStorage` bypass used throughout this session) and confirmed navigating to `/administration` (an `allowedRoles={['ADMIN']}`-gated route) shows "403 — Access denied"; confirmed by contrast that swapping to `role: 'ADMIN'` reaches the real page.

New infrastructure finding **F-30** — no mock fallback exists for Auth, so TC-LOGIN-01/-02 can't be exercised in this dev sandbox at all (distinct from, and in addition to, the pre-existing PRD-content block on auth mechanism/role-matrix, PRD §16 Q21–Q22, which remains separately open).

**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` — updated `RAISE-NFR-SEC-RBAC-001` row from `BLOCKED` (pre-code-era guess) to `FAIL (partial)` with real evidence. `docs/project-management/OPEN-FINDINGS.md` — added F-30 to the "Infrastructure / Process" category.
**What was fixed:** None — this is test execution, not a fix.
**What was added:** F-30.
**What was removed:** None.

**Files changed:** 2 files (`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`).
**Database changes:** None. **API changes:** None. **Frontend changes:** None — this task tests existing code, it doesn't change any.

**Tests:** This *is* the test-execution task — 3 manual/browser-driven test cases against `RAISE-TEST-CASES.md`'s existing step definitions, plus a real attempted login against the actual backend endpoint (which failed for infrastructure reasons, itself real evidence).
**Validation:** N/A in the usual build/lint/vitest sense — no code changed. The validation is the browser/network evidence captured above (a real `ERR_CONNECTION_REFUSED` trace, and a real role-based access-denied render, not simulated in either case).

**Requirement Traceability:**
PRD: `RAISE-NFR-SEC-RBAC-001`.
Acceptance Criteria: `AC-LOGIN-01..03` — judged against exact Given/When/Then text; `AC-LOGIN-01`/`-02` remain not-testable in this environment specifically (infra), `AC-LOGIN-03` met.
Test Case: `TC-LOGIN-01..03` — all 3 now have real, evidence-based results for the first time since this suite was written.

**Git:**
Branch: `docs/tc-execution-login`
Commit: `434e481` (implementation), merged via `fde68b6` (merge commit, [PR #48](https://github.com/boonthepkstl-alt/stl_asset_service/pull/48)).

**Known Issues:** F-30 is an infrastructure/testing-environment gap, not a product defect — no fix is implied by this checkpoint (unlike F-21/F-23/F-24/F-26/F-28/F-29, which were real product defects). It's tracked so a future session doesn't waste time assuming Login is testable in this sandbox the way Asset/Employee/Ticket are.
**Remaining Work:** None for this task itself — it's a read-only test-execution pass. Whether to add a mock Auth path (mirroring `MockAssetRepository`'s pattern) is a separate, not-yet-requested engineering decision, not undertaken here without being asked.
**Next Step:** Recalculate `NEXT-STEP.md`. With `TS-LOGIN` now also swept, remaining not-yet-tested suites are `TS-DASH` (likely re-confirms F-22's already-known gap) and several fully-TBD suites (`TS-WARRANTY-001`, `TS-ORACLE-001`, `TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES`) that would mostly return `NOT_IMPLEMENTED`. F-01 (Warranty field list) — the standing uncompleted request — is now a comparably strong candidate to resurface to the user.

---

## CHECKPOINT-2026-08-29-002

**Phase:** Phase 3 — Asset Management (Warranty as an Asset field)
**Feature:** Warranty (`RAISE-FR-WARRANTY-001`) — PRD field-list resolution
**Task:** Resolve F-01 (Warranty field list beyond `warrantyExpiry` undefined, PRD §16 Q15) — the standing uncompleted business-decision request — and propagate the answer through the full deliverable chain, per explicit user instruction ("ตอบคำถาม F-01 ให้ด้วย" → proposed a draft field list for confirmation → user confirmed "ใช้แค่ warrantyExpiry พอสำหรับ MVP")

**What was implemented:** This is a documentation/requirements-chain task, not a code change. Sequence:
1. Presented the user a draft 8-field proposal (`warrantyExpiry`, `warrantyStartDate`, `warrantyProvider`/vendor, `warrantyType`, `coverageDetails`, `warrantyCost`, `claimContact`, `warrantyDocumentRef`), explicitly labeled as a proposal requiring confirmation, not a decision — per this project's "don't invent/guess business requirements" discipline.
2. User confirmed: for MVP, `warrantyExpiry` is the only field; the other 7 are explicitly rejected, not deferred.
3. Called `/update-prd` (`prd-writer` subagent) — recorded the answer as `RAISE-PRD.md` §16 Resolved Question 40 (resolving Open Question 15), updated `RAISE-FR-WARRANTY-001`'s Open Question field and §17 Requirement Traceability Matrix row (`TBD (field list)` → `APPROVED`).
4. Called `/run-full-chain` — sequentially synced `RAISE-DESIGN.md` §5.2 (was: "exact warranty fields are TBD"), `RAISE-PROTOTYPE.md` P-010 (was: stale `Asset/Start Date/End Date/Status` mock field list matching the *rejected* draft — corrected to `warrantyExpiry` only), `RAISE-ACCEPTANCE-CRITERIA.md` AC-WARRANTY-001 (was: "Partially testable" asserting a 3-field shape — now "Testable," AC-WARRANTY-001-01/-02 rewritten to assert only `warrantyExpiry` and a UI-computed Active/Expiring/Expired timeline derived from it), `RAISE-TEST-PLAN.md` TS-WARRANTY-001 (field-list blocker resolved), `RAISE-TEST-CASES.md` TC-WARRANTY-001-01/-02 (rewritten off the stale Start/End/Status test data, `BLOCKED (partial)` → fully testable), and `RAISE-TRACEABILITY-MATRIX.md` (new Gap 7, resolved same-day).
5. Deliberately preserved as a **separate, still-open** item: `AC-WARRANTY-001-03`'s 90-day expiry-window threshold — PRD §6.7's "90 days" is an illustrative business example, not a confirmed generalizable rule; this was *not* part of what the user confirmed, so it stays `NOT TESTABLE YET`/`BLOCKED (partial)`.
No `## NEEDS_PRD_CONFIRMATION` signal was raised at any layer — this was a closing-out of an already-resolved decision, not a new gap requiring further business input.

**What was modified:** `docs/01-requirements/RAISE-PRD.md` (v0.10 → 0.11), `docs/02-design/RAISE-DESIGN.md` (unchanged version — already had the resolution per subagent's check, v0.8), `docs/03-prototype/RAISE-PROTOTYPE.md` (v0.6 → 0.7), `docs/04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md` (v0.5 → 0.6), `docs/05-test-plan/RAISE-TEST-PLAN.md` (v0.5 → 0.6), `docs/06-test-cases/RAISE-TEST-CASES.md` (v0.5 → 0.6), `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (v0.5 → 0.6).
**What was fixed:** F-01 (documentation/requirements resolution, not a code defect).
**What was added:** PRD §16 Resolved Question 40; Traceability Matrix Gap 7 (resolved same-day it was opened).
**What was removed:** The stale "Start Date/End Date/Status" Warranty field shape from `RAISE-PROTOTYPE.md` P-010 and `RAISE-TEST-CASES.md` TC-WARRANTY-001-01/-02 (which mirrored the rejected 8-field draft, not the confirmed answer).

**Files changed:** 7 files — all in the `docs/01-requirements/` through `docs/07-traceability-matrix/` chain. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None — this is a requirements-documentation resolution; the `Asset.warrantyExpiry` field was already implemented before this task.

**Tests:** N/A — no code changed. Each chain-layer sync was verified by directly reading the actual file after each subagent call (not trusting the subagent's self-report), per this project's standing verification discipline.
**Validation:** Read-verified `RAISE-PRD.md` §16/§17, `RAISE-DESIGN.md` §5.2, `RAISE-PROTOTYPE.md` P-010/§27, `RAISE-ACCEPTANCE-CRITERIA.md` §13/AC index, `RAISE-TEST-PLAN.md` §7/§8, `RAISE-TEST-CASES.md` §12, and `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-WARRANTY-001` row — each shows the resolved state, not just the subagent's claim of it.

**Requirement Traceability:**
PRD: `RAISE-FR-WARRANTY-001`, now `APPROVED` (was `TBD (field list)`).
Acceptance Criteria: `AC-WARRANTY-001-01`/`-02` — now fully testable/met at the display level. `AC-WARRANTY-001-03` — unaffected, still blocked on the separate 90-day-window question.
Test Case: `TC-WARRANTY-001-01`/`-02` — no longer `BLOCKED (partial)`; `TC-WARRANTY-001-03` — still `BLOCKED (partial)`, correctly unaffected.

**Git:**
Branch: `docs/resolve-warranty-field-list`
Commit: `89f1045` (implementation), merged via `2fa8449` (merge commit, [PR #49](https://github.com/boonthepkstl-alt/stl_asset_service/pull/49)). *(Corrected 2026-08-29, same turn as CHECKPOINT-2026-08-29-003 below — this line originally said "pending merge.")*

**Known Issues:** None new. This closes the longest-standing uncompleted request in the session (first raised, then re-raised, across multiple earlier turns before the user actually supplied an answer).
**Remaining Work:** `AC-WARRANTY-001-03`'s 90-day-window threshold remains open (separate question). *(Superseded same-day — see `CHECKPOINT-2026-08-29-003` below: the user declined a standalone P-010 screen, choosing an Asset Registry column instead.)*
**Next Step:** Recalculate `NEXT-STEP.md`. With F-01 now resolved and no other direct-fix findings open, candidates are: build a first-cut Warranty screen (P-010) now that its field list is confirmed (mirrors the F-25 Category & Hierarchy precedent), or continue formal test-execution sweeps on `TS-DASH`/the remaining TBD suites. Re-run the Next-Step Protocol rather than assuming either.

---

## CHECKPOINT-2026-08-29-003

**Phase:** Phase 3 — Asset Management (Warranty as an Asset field)
**Feature:** Warranty (`RAISE-FR-WARRANTY-001`) — Asset Registry implementation
**Task:** Implement F-01's resolved Warranty field on the Asset Registry list, per explicit user direction ("ไม่ควรสร้างหน้า แต่เพิ่มในหน้าอุปกรณ์ที่เกี่ยวข้องพอ" — don't build a page, add it to the relevant asset page instead), declining the standalone P-010 screen `CHECKPOINT-2026-08-29-002` had offered as the default next step

**What was implemented:** A new "Warranty" column on the Assets page's `DataTable` (`frontend/src/pages/Assets/index.tsx`), positioned after Location and before Current Value. Shows each asset's `warrantyExpiry` date and an Active/Expired `Badge`, computed the same way Asset Detail's pre-existing "Warranty & Coverage" section already does (`new Date(warrantyExpiry) < new Date()`); the column is sortable by expiry date. Deliberately implements only 2 of the 3 Warranty Timeline states named in `AC-WARRANTY-001-02` (Prototype P-010) — "Expiring" is not built, since its threshold depends on `AC-WARRANTY-001-03`'s still-unconfirmed 90-day-style rule (PRD §6.7's illustrative example, not a confirmed generalizable window). Also corrected `RAISE-PROTOTYPE.md` P-010 and `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-WARRANTY-001` row to record this implementation-location decision — P-010 is retained for historical/traceability purposes only, explicitly marked not a pending build target.
**What was modified:** `frontend/src/pages/Assets/index.tsx` (new Warranty column), `frontend/src/pages/Assets/index.test.tsx` (new test), `docs/03-prototype/RAISE-PROTOTYPE.md` (P-010 implementation-direction note), `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-WARRANTY-001` row).
**What was fixed:** N/A — this implements a newly-resolved requirement, not a defect.
**What was added:** 1 new test (`TC-WARRANTY-001-01/-02` regression coverage); the Warranty column itself.
**What was removed:** None.

**Files changed:** 4 files — `Assets/index.tsx`, `Assets/index.test.tsx`, `RAISE-PROTOTYPE.md`, `RAISE-TRACEABILITY-MATRIX.md`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Assets Registry list now shows a Warranty column (expiry date + Active/Expired badge, sortable).

**Tests:**
- Unit Test: `frontend/src/pages/Assets/index.test.tsx` — 1 new (`TC-WARRANTY-001-01/-02`: Warranty column shows expiry date and Active/Expired state for both a not-yet-expired and an expired seeded asset) — 144/144 frontend tests passing overall.
- Integration Test: None — no integration-test layer exists in this project.
- E2E Test: None — no E2E framework exists.

**Validation:**
- Build: `npm run build` ✅
- Lint: `npm run lint` ✅ (0 warnings)
- Test: `npx vitest run` ✅ (144/144)
- Type Check: `npx tsc --noEmit` ✅
- Manual browser verification (Chrome preview, `raise-frontend` dev server): on `/assets`, confirmed the Warranty column renders for all visible rows with correct Active/Expired states matching each asset's real `warrantyExpiry`; clicked the column header and confirmed it sorts correctly (earliest expiry first).

**Requirement Traceability:**
PRD: `RAISE-FR-WARRANTY-001`
Acceptance Criteria: `AC-WARRANTY-001-01`/`-02` — met, implemented and verified live (not just resolved on paper as of the prior checkpoint). `AC-WARRANTY-001-03` — unaffected, still blocked on the separate 90-day-window question.
Test Case: `TC-WARRANTY-001-01`/`-02` — now **PASS** (up from resolved-but-unimplemented); `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-WARRANTY-001` row updated from `BLOCKED (partial)` to `PASS (partial)`.

**Git:**
Branch: `docs/tc-execution-warranty-and-asset-registry-column`
Commit: pending merge — part of predicted PR #50 (next in sequence after #49 at branch-creation time; verify against the actual PR before treating this as final).

**Known Issues:** None new.
**Remaining Work:** `AC-WARRANTY-001-03`'s 90-day-window threshold (and the "Expiring" state it would gate) remains a separate, still-open business question.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-01 fully resolved and implemented, remaining candidates are the same as before this checkpoint: a test-execution sweep on `TS-DASH`/the remaining TBD suites, or the other open scope questions (F-22, F-27, F-30). Re-run the Next-Step Protocol rather than assuming.

---

## CHECKPOINT-2026-08-29-004

**Phase:** Phase 8 — Executive Dashboard & Reporting (Main Dashboard, P-002)
**Feature:** Formal test-case execution — `TS-DASH` (Main Dashboard)
**Task:** Run the `TS-DASH` sweep (`TC-DASH-01`/`-02`/`-03`) against the real running app, per explicit user instruction ("รัน TS-DASH sweep ต่อ")

**What was implemented:** N/A — this is test execution, not a build task.
**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` ("Dashboard / Navigation | Main Dashboard" row, `BLOCKED` → `FAIL` with full evidence), `docs/project-management/OPEN-FINDINGS.md` (F-22 broadened from "Executive Dashboard vs. P-014" only to also cover "Main Dashboard vs. P-002" — same underlying gap, same built page, confirmed from a second angle).
**What was fixed:** None.
**What was added:** None — no new finding number was minted, since Prototype P-002's tile/section spec (Total Assets/NBV/Risk/Warranty Expiry tiles; Asset by Category; Lifecycle/Maintenance Overview; Recent Alerts) was found to be word-for-word identical to P-014's, already tracked as F-22, and both map to the exact same single built page (`frontend/src/pages/Dashboard/index.tsx`).
**What was removed:** None.

**Files changed:** 2 files — `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (read-only verification against the already-shipped Dashboard page).

**Tests:**
- Unit Test: None — this is manual/formal test-case execution, not automated test authoring.
- Integration Test: None.
- E2E Test: Manual browser execution (Chrome preview, `raise-frontend` dev server) of `TC-DASH-01`/`-02`/`-03`'s exact steps — auth-bypass via `localStorage` (ADMIN role), navigated to `/dashboard`, captured real page text via `get_page_text`. Result: **all 3 FAIL**. `TC-DASH-01` — "Total Assets" tile present; NBV and Risk tiles entirely absent (not even presence-only); "Warranty Expiry" shown as differently-worded "Expired Warranty". `TC-DASH-02` — no section literally named "Asset by Category" or "Lifecycle / Maintenance Overview"; built page has "Asset Type"/"Department Distribution" and "Asset Lifecycle"/"Maintenance Calendar" instead. `TC-DASH-03` — no "Recent Alerts" section; built page has "Recent Activities" and "Pending Approvals" instead.

**Validation:**
- Build: N/A (no code change). Lint: N/A. Test: N/A. Type Check: N/A.
- Manual browser verification: as above — real page-text evidence captured before any documentation was updated.

**Requirement Traceability:**
PRD: PRD §8 (KPI concepts only), §13 Executive Intelligence (KPI reuse).
Acceptance Criteria: `AC-DASH-01`/`-02`/`-03` — all **FAIL** against the real built page.
Test Case: `TC-DASH-01`/`-02`/`-03` — now **FAIL** (up from `BLOCKED`); `RAISE-TRACEABILITY-MATRIX.md`'s "Main Dashboard" row updated accordingly.

**Git:**
Branch: `docs/tc-execution-dash`
Commit: `e7e6d69` (implementation), merged via [PR #51](https://github.com/boonthepkstl-alt/stl_asset_service/pull/51).

**Known Issues:** None new — this reproduces the already-tracked F-22 gap, confirmed from a second Prototype screen/AC group (P-002/`AC-DASH-*` in addition to P-014/`AC-EXEC-001-*`) against the same single built page.
**Remaining Work:** F-22 (now broadened), F-27, F-30, and `AC-WARRANTY-001-03`'s 90-day threshold all remain open scope questions blocked on a business/design decision — no engineering task is currently unblocked and buildable from these.
**Next Step:** Recalculate `NEXT-STEP.md`. Since this sweep found no new actionable item (only re-confirmed an existing finding), the next step is to check in with the user for direction on the now-uniformly-blocked open items rather than pick one unilaterally. User chose to continue formal test execution — see `CHECKPOINT-2026-08-29-005` below.

---

## CHECKPOINT-2026-08-29-005

**Phase:** Phase 6 — Oracle FA Integration & Reconciliation
**Feature:** Formal test-case execution — `TS-ORACLE-001` (Oracle FA / Financial View, P-011)
**Task:** Run the `TS-ORACLE-001` sweep (`TC-ORACLE-001-01`/`-02`/`-03`/`-04`) against the real running app, per explicit user instruction ("รัน TS-ORACLE-001 sweep ต่อ")

**What was implemented:** N/A — this is test execution, not a build task.
**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-ORACLE-001` row, `BLOCKED` → `FAIL` with full evidence), `docs/project-management/OPEN-FINDINGS.md` (new finding **F-31**).
**What was fixed:** None.
**What was added:** Finding **F-31** — the route the app maps to `RAISE-FR-ORACLE-001` (`/reconciliation`) renders `ModulePage`, a generic "foundation placeholder" `EmptyState` with no fields and no state logic, not an actual Financial View screen. Kept distinct from the pre-existing **F-04** (integration-mechanism question, PRD §16 Q6–Q10, still genuinely open) since this is a build gap confirmed by execution, independent of how the real Oracle integration would eventually work — same pattern already established by F-22 for the Dashboard.
**What was removed:** None.

**Files changed:** 2 files — `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (read-only verification against the already-shipped placeholder route).

**Tests:**
- Unit Test: None — this is manual/formal test-case execution, not automated test authoring.
- Integration Test: None.
- E2E Test: Manual browser execution (Chrome preview, `raise-frontend` dev server) of `TC-ORACLE-001-01`/`-02`/`-03`/`-04`'s exact steps — auth-bypass via `localStorage` (ADMIN role), navigated to `/reconciliation`, captured real page text via `get_page_text` (confirmed: "Oracle FA Reconciliation — foundation placeholder / Migrates from src/pages/Reconciliation.tsx once Oracle FA is connected in Phase 6."), also read `frontend/src/pages/_shared/ModulePage.tsx` source and checked Asset Detail's "Financial" section (added for F-24: only Purchase Cost/Current Value/Purchase Date, no Oracle-specific field) as the closest analog. Result: **all 4 FAIL**. `TC-ORACLE-001-01` — no "Asset Number"/"Acquisition Information"/"NBV"/"Depreciation"/"Oracle Source"/"Synchronization Status" field exists anywhere. `TC-ORACLE-001-02`/`-03`/`-04` — no "data unavailable"/"sync error"/"data conflict" state exists; the placeholder has no state logic at all.

**Validation:**
- Build: N/A (no code change). Lint: N/A. Test: N/A. Type Check: N/A.
- Manual browser verification: as above — real page-text and source-code evidence captured before any documentation was updated.

**Requirement Traceability:**
PRD: `RAISE-FR-ORACLE-001`, PRD §16 Q6–Q10 (F-04, unaffected), Open Question 10a (`ReconciliationPage` mapping, unaffected).
Acceptance Criteria: `AC-ORACLE-001-01..04` — all **FAIL** against the real built app.
Test Case: `TC-ORACLE-001-01..04` — now **FAIL** (up from `BLOCKED`); `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ORACLE-001` row updated accordingly.

**Git:**
Branch: `docs/tc-execution-oracle`
Commit: `d59363c` (implementation), merged via [PR #52](https://github.com/boonthepkstl-alt/stl_asset_service/pull/52).

**Known Issues:** F-31 (new) — Oracle FA Financial View (P-011) is an unbuilt placeholder, distinct from F-04's integration-mechanism gap.
**Remaining Work:** F-22, F-27, F-30, F-31, and `AC-WARRANTY-001-03`'s 90-day threshold all remain open items blocked on a business/design decision — no engineering task is currently unblocked and buildable from these.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction — the remaining low-signal suites (`TS-ALERT-001`, `TS-AI-SEARCH-001`, `TS-AI-STATES`) or a decision on one of the now-5 open scope questions. User chose to continue formal test execution — see `CHECKPOINT-2026-08-29-006` below.

---

## CHECKPOINT-2026-08-29-006

**Phase:** Phase 7 — Alerts & Notifications
**Feature:** Formal test-case execution — `TS-ALERT-001` (Alerts, P-012)
**Task:** Run the `TS-ALERT-001` sweep (`TC-ALERT-001-01`/`-02`) against the real running app, per explicit user instruction ("รัน TS-ALERT-001 sweep ต่อ")

**What was implemented:** N/A — this is test execution, not a build task.
**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-ALERT-001` row, `BLOCKED` → `FAIL` with full evidence), `docs/project-management/OPEN-FINDINGS.md` (new finding **F-32**).
**What was fixed:** None.
**What was added:** Finding **F-32** — the sidebar "Notification Center" route (`/notifications`) renders the app's generic 404 page, not even a `ModulePage`-style placeholder; the header bell-icon dropdown is hardcoded to an empty notifications array with a static "later phase" message. Worse than F-31's Oracle FA placeholder stub. Kept distinct from the pre-existing **F-05** (trigger-rule question, PRD §6.9, still genuinely open) since this is a build gap confirmed by execution.
**What was removed:** None.

**Files changed:** 2 files — `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (read-only verification against the already-shipped routing/AppShell).

**Tests:**
- Unit Test: None — this is manual/formal test-case execution, not automated test authoring.
- Integration Test: None.
- E2E Test: Manual browser execution (Chrome preview, `raise-frontend` dev server) of `TC-ALERT-001-01`/`-02`'s exact steps — auth-bypass via `localStorage` (ADMIN role), navigated to `/notifications` (confirmed generic 404: "Page not found — hasn't been migrated yet"), then opened the header bell-icon dropdown on the Dashboard (confirmed hardcoded-empty "Notifications" panel with a static "will be wired to the real API in a later phase" message, and a "View all notifications" link pointing to the same 404 route), and cross-checked Dashboard's "AI Insights" → "Warranty Expiry Approaching" card as the closest analog (confirmed it's an aggregate AI Decision Center metric, not a per-alert severity/description/asset list). Result: **both FAIL**. `TC-ALERT-001-01` — no alert is ever listed with severity/description/asset, structurally or otherwise. `TC-ALERT-001-02` — not exercisable at all, since no in-app alert presentation exists to verify.

**Validation:**
- Build: N/A (no code change). Lint: N/A. Test: N/A. Type Check: N/A.
- Manual browser verification: as above — real page-text and source-code evidence captured before any documentation was updated.

**Requirement Traceability:**
PRD: `RAISE-FR-ALERT-001`, PRD §6.9 Open Question (F-05, unaffected), PRD §16 Q22 (role gate, unaffected).
Acceptance Criteria: `AC-ALERT-001-01..02` — both **FAIL** against the real built app.
Test Case: `TC-ALERT-001-01..02` — now **FAIL** (up from `BLOCKED`); `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-ALERT-001` row updated accordingly.

**Git:**
Branch: `docs/tc-execution-alert`
Commit: `e7aa354` (implementation), merged via [PR #53](https://github.com/boonthepkstl-alt/stl_asset_service/pull/53).

**Known Issues:** F-32 (new) — Alerts (P-012) is entirely unbuilt (404, no placeholder), distinct from F-05's trigger-rule gap.
**Remaining Work:** F-22, F-27, F-30, F-31, F-32, and `AC-WARRANTY-001-03`'s 90-day threshold all remain open items blocked on a business/design decision — no engineering task is currently unblocked and buildable from these.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction — the remaining low-signal suites (`TS-AI-SEARCH-001`, `TS-AI-STATES`) or a decision on one of the now-6 open scope questions. User chose to continue formal test execution — see `CHECKPOINT-2026-08-29-007` below.

---

## CHECKPOINT-2026-08-29-007

**Phase:** Phase 9 — AI Document Intelligence & Search
**Feature:** Formal test-case execution — `TS-AI-SEARCH-001` (Natural Language Search, P-015)
**Task:** Run the `TS-AI-SEARCH-001` sweep (`TC-AI-SEARCH-001-01`/`-02`/`-03`) against the real running app, per explicit user instruction ("รัน TS-AI-SEARCH-001 sweep ต่อ")

**What was implemented:** N/A — this is test execution, not a build task.
**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (`RAISE-AI-SEARCH-001` row — `TS-AI-SEARCH-001` portion updated `BLOCKED` → `FAIL` with full evidence; `TS-AI-STATES` portion left `BLOCKED`, not yet executed), `docs/project-management/OPEN-FINDINGS.md` (new finding **F-33**).
**What was fixed:** None.
**What was added:** Finding **F-33** — two distinct "AI" surfaces exist (header "AI Assistant" drawer, and Assets page's "Ask AI" keyword filter), neither implementing P-015's natural-language Q&A spec. Kept distinct from the pre-existing **F-06** (citation-precision/format question, PRD §16 Q18, still genuinely open) since this is a build gap confirmed by execution.
**What was removed:** None.

**Files changed:** 2 files — `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (read-only verification against the already-shipped AI Assistant drawer and Assets page "Ask AI" box).

**Tests:**
- Unit Test: None — this is manual/formal test-case execution, not automated test authoring.
- Integration Test: None.
- E2E Test: Manual browser execution (Chrome preview, `raise-frontend` dev server) of `TC-AI-SEARCH-001-01`/`-02`/`-03`'s exact steps — auth-bypass via `localStorage` (ADMIN role). Opened the header "AI Assistant" drawer on the Dashboard: confirmed via screenshot it has no input field at all, only a static placeholder message. Navigated to Assets, typed the PRD's exact illustrative question ("Which notebooks expire within 90 days?") into the page's "Ask AI" box and submitted it: confirmed (via screenshot and reading `handleAISearch` in `frontend/src/pages/Assets/index.tsx`) it only performs hardcoded keyword-to-filter matching ("notebook" → `Type = Laptop`), narrowing the existing Asset list — no answer, no "Sources / Data Used" section, no affected-asset count, no Asset/Warranty/Age/Maintenance/Status table. Result: **all 3 FAIL**.

**Validation:**
- Build: N/A (no code change). Lint: N/A. Test: N/A. Type Check: N/A.
- Manual browser verification: as above — real screenshot and source-code evidence captured before any documentation was updated.

**Requirement Traceability:**
PRD: `RAISE-AI-SEARCH-001`, PRD §16 Q18 (F-06, unaffected).
Acceptance Criteria: `AC-AI-SEARCH-001-01..03` — all **FAIL** against the real built app.
Test Case: `TC-AI-SEARCH-001-01..03` — now **FAIL** (up from `BLOCKED`); `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-AI-SEARCH-001` row updated accordingly (`TS-AI-STATES` portion unaffected, still `BLOCKED`).

**Git:**
Branch: `docs/tc-execution-ai-search`
Commit: `905d5e4` (implementation), part of [PR #54](https://github.com/boonthepkstl-alt/stl_asset_service/pull/54) (open at the time of this checkpoint — see `CHECKPOINT-2026-08-29-008` below, which lands on the same branch/PR before merge).

**Known Issues:** F-33 (new) — AI Assistant (P-015) doesn't answer natural-language questions; two non-matching surfaces exist instead, distinct from F-06's citation-format gap.
**Remaining Work:** F-22, F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold all remain open items blocked on a business/design decision — no engineering task is currently unblocked and buildable from these. `TS-AI-STATES` (the last unexecuted suite) remains.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction — the last remaining suite (`TS-AI-STATES`) or a decision on one of the now-7 open scope questions. User chose to continue formal test execution immediately — see `CHECKPOINT-2026-08-29-008` below.

---

## CHECKPOINT-2026-08-29-008

**Phase:** Phase 9 — AI Document Intelligence & Search
**Feature:** Formal test-case execution — `TS-AI-STATES` (AI Response States, P-015 §22)
**Task:** Run the `TS-AI-STATES` sweep (`TC-AI-STATES-01..05`) against the real running app, per explicit user instruction ("รัน TS-AI-STATES sweep ต่อ พร้อมสรุป") — the last unexecuted suite in `RAISE-TEST-CASES.md`

**What was implemented:** N/A — this is test execution, not a build task.
**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (`RAISE-AI-SEARCH-001` row extended with `TS-AI-STATES` results — `FAIL`, full evidence), `docs/project-management/OPEN-FINDINGS.md` (F-33 broadened to also cover `AC-AI-STATES-01..05`, same root cause as `TS-AI-SEARCH-001`). Landed on the same `docs/tc-execution-ai-search` branch/PR #54 as `CHECKPOINT-2026-08-29-007`, since both suites share one root cause and one finding.
**What was fixed:** None.
**What was added:** None — no new finding number was minted. F-33 was broadened rather than a new F-34 opened, since `TS-AI-STATES` traces to the exact same two built surfaces (header "AI Assistant" drawer, Assets page "Ask AI" keyword filter) and the same root cause (no real Q&A engine) as `TS-AI-SEARCH-001` — the same precedent already established by F-22 (Dashboard, two Prototype screens/one page, one finding).
**What was removed:** None.

**Files changed:** 2 files — `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (read-only verification against the already-shipped AI Assistant drawer and Assets page "Ask AI" box).

**Tests:**
- Unit Test: None — this is manual/formal test-case execution, not automated test authoring.
- Integration Test: None.
- E2E Test: Manual browser execution (Chrome preview, `raise-frontend` dev server) of `TC-AI-STATES-01..05`'s exact steps — auth-bypass via `localStorage` (ADMIN role). Grepped `frontend/src` for all 5 required literal state messages ("No matching assets were found.", "RAISE could not answer from the available data.", "Some source data is currently unavailable.", "Conflicting information was found. Please review the source records.", plus the Success-state triple of answer/relevant-data/source-context) — none exist anywhere in source. Live-verified on Assets: submitted a deliberately nonsense query ("asdkjqwiuey zzz nonsense query xyz") to the "Ask AI" box; result was "AI interpreted: No specific filters detected — showing all assets" (the unfiltered list), not a "no match" state. Result: **all 5 FAIL**. TC-AI-STATES-01 (Success) fails for the same reason as `TS-AI-SEARCH-001` (no genuine answer/relevant-data/source-context triple). TC-AI-STATES-02 (No-data) fails — no "no matching assets" message exists; a non-matching query just shows everything. TC-AI-STATES-03/-04/-05 (Unable-to-answer/Source-unavailable/Data-conflict) fail — none of these states can even be simulated, since there is no backend AI call, no source-availability check, and no conflict-detection logic anywhere.

**Validation:**
- Build: N/A (no code change). Lint: N/A. Test: N/A. Type Check: N/A.
- Manual browser verification + source grep: as above — real evidence captured before any documentation was updated.

**Requirement Traceability:**
PRD: `RAISE-AI-SEARCH-001`, PRD §16 Q18 (F-06, unaffected), PRD §20 Error Handling / §22 AI Response States.
Acceptance Criteria: `AC-AI-STATES-01..05` — all **FAIL** against the real built app.
Test Case: `TC-AI-STATES-01..05` — now **FAIL** (up from `BLOCKED`); `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-AI-SEARCH-001` row updated accordingly. This completes formal execution of every suite in `RAISE-TEST-CASES.md` at least once this session.

**Git:**
Branch: `docs/tc-execution-ai-search`
Commit: `932a6eb` (implementation), merged via [PR #54](https://github.com/boonthepkstl-alt/stl_asset_service/pull/54).

**Known Issues:** None new — this broadens F-33, confirmed from a second AC group/suite against the exact same two built surfaces.
**Remaining Work:** F-22, F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold all remain open items blocked on a business/design decision — no engineering task is currently unblocked and buildable from these. **Every suite in `RAISE-TEST-CASES.md` has now been formally executed at least once.**
**Next Step:** Recalculate `NEXT-STEP.md`. With formal execution coverage complete, the only remaining work is a business/design decision on one of the seven open findings — check in with the user for direction. User asked for a `/code-review` pass instead — see `CHECKPOINT-2026-08-31-001` below.

---

## CHECKPOINT-2026-08-31-001

**Phase:** Cross-cutting (code quality, not tied to one phase)
**Feature:** `/code-review` pass on PR #50 (Warranty column), medium effort
**Task:** Review PR #50's diff for correctness/cleanup issues per explicit user instruction ("/code-review [max]" — target clarified to PR #50 after the working tree/PRs were confirmed clean), then fix the 1 confirmed finding per user instruction ("fix it")

**What was implemented:** N/A — a review and a targeted refactor, not new functionality.
**What was modified:** `frontend/src/pages/Assets/index.tsx`, `frontend/src/pages/AssetDetail/index.tsx`, `frontend/src/services/dashboard-repository.ts` (all 3 call sites of the "is warranty expired" check switched to import a shared helper).
**What was fixed:** 1 `reuse`-category finding — `new Date(warrantyExpiry) < new Date()` was independently duplicated in 3 files (introduced by PR #50's new Warranty column, on top of 2 pre-existing sites); PR #41 earlier in this project had already established a "compute once" precedent for this exact check within `AssetDetail`, but it was never extracted into a shared utility.
**What was added:** `frontend/src/lib/warranty.ts` — `isWarrantyExpired(warrantyExpiry: string, asOf: Date = new Date()): boolean`.
**What was removed:** The 3 inline duplicate computations (replaced with calls to the shared helper); `dashboard-repository.ts` keeps its existing "compute `today` once outside the filter loop" optimization by passing it as `asOf`.

**Files changed:** 4 files — 1 new (`lib/warranty.ts`), 3 modified. No docs touched (pure code fix).
**Database changes:** None. **API changes:** None. **Frontend changes:** None visible — same rendered output, same badges/dates, just single-sourced logic.

**Tests:**
- Unit Test: No new test added (behavior unchanged) — existing `TC-WARRANTY-001-01/-02` coverage in `Assets/index.test.tsx` continues to pass unmodified, confirming no behavior regression.
- Integration Test: None. E2E Test: None.

**Validation:**
- Build: N/A (not run standalone; covered by Type Check below). Lint: `npm run lint` ✅ (0 warnings).
- Test: `npx vitest run` ✅ (144/144, unchanged from PR #50's baseline).
- Type Check: `npx tsc --noEmit` ✅.

**Requirement Traceability:**
PRD: `RAISE-FR-WARRANTY-001` (unaffected — no behavior change, pure refactor).
Acceptance Criteria / Test Case: `AC-WARRANTY-001-01/-02` / `TC-WARRANTY-001-01/-02` — still **PASS**, re-verified via the existing automated test, not a manual browser re-check (no user-facing change to verify).

**Git:**
Branch: `frontend/dedupe-warranty-expired-check`
Commit: `89e0067` (implementation), merged via [PR #55](https://github.com/boonthepkstl-alt/stl_asset_service/pull/55).

**Known Issues:** None new.
**Remaining Work:** F-22, F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision.
**Next Step:** User chose to resolve F-22 next — see `CHECKPOINT-2026-08-31-002` below.

---

## CHECKPOINT-2026-08-31-002

**Phase:** Phase 8 — Executive Dashboard & Reporting (Design/Prototype/AC/Test Plan/Test Cases/Traceability Matrix correction)
**Feature:** Resolve Open Finding F-22's business decision via the full deliverable chain
**Task:** Per explicit user decision ("แก้ Prototype ให้ตรงกับของจริง" — fix the docs to match the shipped app, not the other way around), propagate this correction through `RAISE-DESIGN.md` → `RAISE-PROTOTYPE.md` → `RAISE-ACCEPTANCE-CRITERIA.md` → `RAISE-TEST-PLAN.md` → `RAISE-TEST-CASES.md` → `RAISE-TRACEABILITY-MATRIX.md`, using `/run-full-chain`'s sequential subagent workflow (design-writer → prototype-writer → acceptance-criteria-writer → test-plan-writer → test-cases-writer → traceability-matrix-writer), verifying each stage's actual file content before proceeding to the next

**What was implemented:** N/A — a documentation correction to match already-shipped behavior, not new code.
**What was modified:**
- `RAISE-DESIGN.md` §13 (v0.8→0.9): replaced the never-built "NBV/Risk/Utilization" wireframe with "Logical Dashboard — Current MVP (As Built)" documenting the real 8-tile KPI grid / 10-section list; added a "NBV/Risk/Utilization — Proposal KPIs, Not Yet Implemented" subsection (kept, not deleted).
- `RAISE-PROTOTYPE.md` P-002/P-014 (v0.7→0.8): both rewritten to the as-built tile/section list, now explicitly cross-referencing each other as documenting the same single built page (`frontend/src/pages/Dashboard/index.tsx`) instead of duplicating divergent specs.
- `RAISE-ACCEPTANCE-CRITERIA.md` AC-DASH/AC-EXEC-001 (v0.6→0.7): `AC-DASH-01/-02`/`AC-EXEC-001-01/-02` rewritten as Testable against the as-built list; new `AC-DASH-03` (and an equivalent AC-EXEC-001 note) documents NBV/Risk/Utilization absence as NOT TESTABLE YET (tied to F-03), not a passing criterion.
- `RAISE-TEST-PLAN.md` TS-DASH/TS-EXEC-001 (v0.6→0.7): blocked-item notes corrected to match — tile/section presence has no remaining gap; only the NBV/Risk sub-item remains blocked.
- `RAISE-TEST-CASES.md` TC-DASH-01..03/TC-EXEC-001-01..02 (v0.6→0.7): rewritten to assert the as-built tile/section list; new `TC-DASH-03` (absence-check) added; explicitly does NOT mark any case as already PASSED.
- `RAISE-TRACEABILITY-MATRIX.md` (v0.6→0.7): `RAISE-FR-EXEC-001` and "Main Dashboard" rows re-derived to `NOT_TESTED (re-derived after spec correction; formal re-execution pending)` — explicitly does not claim PASS from a documentation fix alone; new Gap 8 recorded (spec correction closed, re-execution open).
- `docs/project-management/OPEN-FINDINGS.md` F-22: updated to record the business decision and chain correction; kept **Open** (not Resolved) pending a fresh execution sweep.

**What was fixed:** None — this is a spec/scope correction, not a defect fix (the app was already correct; the documentation was wrong).
**What was added:** `AC-DASH-03`, `TC-DASH-03` (both testing NBV/Risk/Utilization's confirmed absence from the shipped grid); Gap 8 in the Traceability Matrix.
**What was removed:** The stale "Asset Overview"/"Executive Asset Intelligence" wireframe and its NBV/Risk/Utilization/"Asset by Category"/"Recent Alerts" tile-and-section names from Design §13 and Prototype P-002/P-014 (the underlying KPI *concept* is retained, only the fictional wireframe is removed).

**Files changed:** 7 files — `RAISE-DESIGN.md`, `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`, `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`, `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (the app was already correct; only its documentation was wrong).

**Tests:**
- Unit/Integration/E2E: None — this step corrects what future test execution will assert; it does not itself execute any test. Each subagent was explicitly instructed not to claim PASS.

**Validation:**
- Build/Lint/Test/Type Check: N/A (no code change).
- Chain verification: after each subagent's output, the actual file content was Read (not just the subagent's self-report) to confirm the correction landed correctly and no earlier-layer document was touched out of scope — per this project's standing `/run-full-chain` discipline.

**Requirement Traceability:**
PRD: `RAISE-FR-EXEC-001` (unchanged — no new requirement, no requirement deleted).
Acceptance Criteria: `AC-DASH-01/-02`, `AC-EXEC-001-01/-02` — now Testable (not yet executed). `AC-DASH-03`/AC-EXEC-001's NBV/Risk note — NOT TESTABLE YET (F-03, unaffected).
Test Case: `TC-DASH-01..03`, `TC-EXEC-001-01..02` — rewritten; `RAISE-TRACEABILITY-MATRIX.md`'s `RAISE-FR-EXEC-001`/"Main Dashboard" rows explicitly marked `NOT_TESTED (re-derived; re-execution pending)`, not PASS.

**Git:**
Branch: `docs/resolve-f22-dashboard-spec-correction`
Commit: `71144f0` (implementation), merged via [PR #56](https://github.com/boonthepkstl-alt/stl_asset_service/pull/56).

**Known Issues:** None new.
**Remaining Work:** A fresh formal test-execution sweep against the corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02` has not yet been run — this is the recommended next action to actually close F-22 (mark it Resolved with an R-number) rather than leave it "corrected but unverified." F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open, unaffected by this work.
**Next Step:** Recalculate `NEXT-STEP.md`. Recommend running a formal test-execution sweep against the corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02` next, to confirm the app actually passes the corrected spec and close F-22 for real — or continue with another open finding, per user direction. User chose to run the sweep immediately — see `CHECKPOINT-2026-08-31-003` below.

---

## CHECKPOINT-2026-08-31-003

**Phase:** Phase 8 — Executive Dashboard & Reporting
**Feature:** Formal test-case execution — `TS-DASH`/`TS-EXEC-001` re-verification after F-22's spec correction
**Task:** Run the corrected `TC-DASH-01..03`/`TC-EXEC-001-01..02` against the real running app, per explicit user instruction ("รัน TS-DASH/TS-EXEC-001 sweep ต่อ พร้อมสรุปสั้นๆ"), to confirm the F-22 spec correction (`CHECKPOINT-2026-08-31-002`, PR #56) actually holds and close the finding for real

**What was implemented:** N/A — this is test execution, not a build task.
**What was modified:** `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (`RAISE-FR-EXEC-001` and "Main Dashboard" rows updated `NOT_TESTED` → `PASS`/`PASS (partial)`; Gap 8 closed fully; version bumped 0.7→0.8), `docs/project-management/OPEN-FINDINGS.md` (F-22 moved from "Confirmed via Test Execution" to **Resolved**, recorded as R-13).
**What was fixed:** None — the app was already correct; this confirms it.
**What was added:** None.
**What was removed:** F-22's row from the "Confirmed via Test Execution" open-findings table (moved to Resolved, not deleted — full history preserved as R-13).

**Files changed:** 2 files — `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None (read-only verification against the already-shipped, unmodified Dashboard page).

**Tests:**
- Unit Test: None — manual/formal test-case execution, not automated test authoring.
- Integration Test: None.
- E2E Test: Manual browser execution (Chrome preview, `raise-frontend` dev server) — auth-bypass via `localStorage` (ADMIN role), navigated to `/dashboard` (confirmed page title is literally "Executive Dashboard," the single route serving both P-002 and P-014), captured real page text. Result: **all cases PASS**. `TC-DASH-01`/`TC-EXEC-001-01` — all 8 KPI tiles present: Total Assets (15), Available (4), Assigned (8), In Maintenance (2), Expired Warranty (11), Software Licenses (10), Monthly Depreciation ($42.8K, illustrative), Monthly Cost ($156.2K, illustrative). `TC-DASH-02`/`TC-EXEC-001-02` — all 10 sections present: AI Insights, AI Portfolio Health, Oracle FA Synced, Asset Lifecycle, Department Distribution, Asset Status, Asset Type, Pending Approvals, Recent Activities, Maintenance Calendar. `TC-DASH-03` — NBV/Risk/Utilization tiles confirmed absent (PASS on the absence-check itself; the deeper "should they be added" question remains BLOCKED (partial), tied to F-03).

**Validation:**
- Build: N/A (no code change). Lint: N/A. Test: N/A. Type Check: N/A.
- Manual browser verification: as above — real page-text evidence captured before any documentation was updated.

**Requirement Traceability:**
PRD: `RAISE-FR-EXEC-001` (unchanged).
Acceptance Criteria: `AC-DASH-01/-02`, `AC-EXEC-001-01/-02` — **PASS**. `AC-DASH-03`/AC-EXEC-001's NBV/Risk note — still **BLOCKED (partial)**, tied to F-03, unaffected.
Test Case: `TC-DASH-01..03`, `TC-EXEC-001-01..02` — now **PASS**/**PASS (partial)**; `RAISE-TRACEABILITY-MATRIX.md` updated accordingly, Gap 8 closed, F-22 marked Resolved (R-13) in `OPEN-FINDINGS.md`.

**Git:**
Branch: `docs/tc-execution-dash-reverify`
Commit: `dac0ae2` (implementation), merged via [PR #57](https://github.com/boonthepkstl-alt/stl_asset_service/pull/57).

**Known Issues:** None new.
**Remaining Work:** F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision — no engineering task is currently unblocked and buildable from these. F-22 is fully closed.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-22 closed, check in with the user on direction for one of the five remaining open findings. User chose F-27 next — see `CHECKPOINT-2026-09-01-001` below.

---

## CHECKPOINT-2026-09-01-001

**Phase:** Phase 3 — Asset Management (Category & Hierarchy sub-taxonomy)
**Feature:** Resolve Open Finding F-27's business decision, propagate through the deliverable chain, implement, and re-verify — all in one session
**Task:** Per explicit user decision (sub-category = existing Asset `type` field, 2-level Category → Type → assets hierarchy), propagate via `/run-full-chain`-style sequential subagent sync (Prototype P-005 → Acceptance Criteria AC-ASSET-002 → Test Plan TS-ASSET-002 → Test Cases TC-ASSET-002-01..03), then implement the UI change, verify with automated tests and live browser execution, then close the loop in Test Cases/Traceability Matrix/Open Findings

**What was implemented:** Extended the Assets page's "By Category" view (`frontend/src/pages/Assets/index.tsx`) one level deeper — Category → Type → individual assets, where "Type" groups are the distinct `type` values actually present within each category (not a fixed enumerated list). Added `expandedTypes` state and `toggleTypeExpanded()`, mirroring the existing category-expand pattern; each Type node shows an asset-count badge and its own expand/collapse.
**What was modified:**
- `RAISE-PROTOTYPE.md` P-005 (v0.8→0.9): replaced the fictional "Computer/Notebook/Desktop" illustrative tree with the real, currently-seeded Category→Type breakdown; states plainly that "sub-category" = the existing `type` field, not a new concept.
- `RAISE-ACCEPTANCE-CRITERIA.md` AC-ASSET-002 (v0.7→0.8): resolved the "NOT TESTABLE YET" note; rewrote `AC-ASSET-002-01` to assert the Category→Type hierarchy explicitly; added new `AC-ASSET-002-03` for the expand-to-reveal behavior.
- `RAISE-TEST-PLAN.md` TS-ASSET-002 (v0.7→0.8, then closed): blocked-item note resolved, then updated again same day to "RESOLVED and CLOSED" once the UI shipped and passed.
- `RAISE-TEST-CASES.md` TC-ASSET-002-01..03 (v0.7→0.9): `TC-ASSET-002-01` rewritten for the new spec; new `TC-ASSET-002-03` added (initially `BLOCKED (pending implementation)`, then closed to **PASS** same day once the code shipped and was verified).
- `frontend/src/pages/Assets/index.tsx` / `index.test.tsx`: the UI implementation itself, plus 1 rewritten and 1 new automated test (3 total for this view).
- `RAISE-TRACEABILITY-MATRIX.md` (v0.7→1.0): `RAISE-FR-ASSET-002` row updated to full **PASS**; Gap 9 opened then fully closed same day — **this closes the last open gap, bringing the matrix to v1.0**.
- `docs/project-management/OPEN-FINDINGS.md`: F-27 moved from "Blocking" to **Resolved**, recorded as R-14.
**What was fixed:** None — this implements a newly-resolved requirement (sub-category taxonomy), not a defect.
**What was added:** The Type-level grouping UI; `AC-ASSET-002-03`/`TC-ASSET-002-03`; 1 new automated test (`TC-ASSET-002-03`), 1 rewritten (`expanding a category shows its Type sub-groups`).
**What was removed:** None — the old flat Category→assets test was upgraded in place, not deleted.

**Files changed:** 8 files — `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`, `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`, `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`, `frontend/src/pages/Assets/index.tsx`, `frontend/src/pages/Assets/index.test.tsx`.
**Database changes:** None — deliberately uses the existing `type` column, no migration needed. **API changes:** None. **Frontend changes:** "By Category" tab on Assets page now nests one level deeper (Category → Type → assets).

**Tests:**
- Unit Test: `frontend/src/pages/Assets/index.test.tsx` — `TC-ASSET-002-01` (unchanged assertion, still passes), rewrote the second test to assert Type sub-groups instead of flat assets, added `TC-ASSET-002-03` (expand a Type sub-group, confirm only its assets show, confirm other types' assets are absent) — 3 tests, all passing. Full suite: 145/145 passing, no regressions.
- Integration Test: None. E2E Test: None.

**Validation:**
- Build: covered by Type Check below. Lint: `npm run lint` ✅ (0 warnings).
- Test: `npx vitest run` ✅ (145/145).
- Type Check: `npx tsc --noEmit` ✅.
- Manual browser verification (Chrome preview, `raise-frontend` dev server): on `/assets` → "By Category," expanded "IT Hardware" — confirmed Type sub-groups (Headphones: 1, Laptop: 3, Monitor: 2) with no individual assets shown at that level; expanded "Laptop" — confirmed exactly its 3 assets (MacBook Pro 16" M3/AST-0001, MacBook Air M2/AST-0011, ThinkPad X1 Carbon Gen 11/AST-0012) and none of Monitor's/Headphones'.

**Requirement Traceability:**
PRD: `RAISE-FR-ASSET-002` (unchanged — no new requirement).
Acceptance Criteria: `AC-ASSET-002-01/-02/-03` — all **PASS**.
Test Case: `TC-ASSET-002-01..03` — all **PASS**; `RAISE-TRACEABILITY-MATRIX.md` updated to full PASS, Gap 9 closed, matrix reaches **v1.0**.

**Git:**
Branch: `frontend/resolve-f27-category-type-hierarchy`
Commit: `8066e1f` (implementation), merged via [PR #58](https://github.com/boonthepkstl-alt/stl_asset_service/pull/58).

**Known Issues:** None new.
**Remaining Work:** F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision. F-22 and F-27 are both fully closed.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction for one of the four remaining open findings. User chose F-30 next — see `CHECKPOINT-2026-09-01-002` below.

---

## CHECKPOINT-2026-09-01-002

**Phase:** Cross-cutting (dev infrastructure, not tied to one product phase)
**Feature:** Resolve Open Finding F-30's business decision, implement, and re-verify — all in one session
**Task:** Per explicit user decision (add a `MockAuthRepository` following the established Mock/Http pattern; 4 demo accounts, one per Role), implement, verify with automated tests and live browser execution through the real Login UI, then close the loop in the Traceability Matrix and Open Findings

**What was implemented:** `frontend/src/services/auth-repository.ts` (`AuthRepository` interface, `MockAuthRepository`, `HttpAuthRepository`) mirroring `asset-repository.ts`'s structure exactly. `auth-service.ts` rewritten to select between them via a new `AUTH_API_ENABLED` flag (`config/featureFlags.ts`, default OFF, same convention as every other domain). Four demo accounts seeded, one per `Role` (`types/auth.ts`): `admin@raise.dev`/`manager@raise.dev`/`itstaff@raise.dev`/`employee@raise.dev`, all password `demo1234`.
**What was modified:**
- `frontend/src/config/featureFlags.ts`: new `AUTH_API_ENABLED` flag.
- `frontend/src/services/auth-service.ts`: rewritten to pick `HttpAuthRepository`/`MockAuthRepository` via the flag (mirrors `asset-service.ts`).
- `RAISE-TRACEABILITY-MATRIX.md` (v1.0→1.1): `RAISE-NFR-SEC-RBAC-001` row — `TC-LOGIN-01`/`-02` move from BLOCKED to **PASS**; explicitly notes this resolves the infrastructure gap only, not the separate PRD-content question (auth mechanism/role-matrix, PRD §16 Q21–Q22); new Gap 10 opened and closed (infrastructure half).
- `docs/project-management/OPEN-FINDINGS.md`: F-30 moved to **Resolved**, recorded as R-15.
**What was fixed:** The missing Mock fallback itself — `login()` previously always hit the real (unreachable in this dev environment) backend.
**What was added:** `frontend/src/services/auth-repository.ts` (new file); `frontend/src/services/auth-service.test.ts` (new file, 2 tests — `TC-LOGIN-01` valid credentials across roles, `TC-LOGIN-02` invalid credentials rejected).
**What was removed:** None.

**Files changed:** 6 files — `featureFlags.ts`, `auth-service.ts` (modified), `auth-repository.ts`, `auth-service.test.ts` (new), `RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`.
**Database changes:** None. **API changes:** None. **Frontend changes:** Login now works end-to-end against 4 demo accounts without a real backend.

**Tests:**
- Unit Test: `frontend/src/services/auth-service.test.ts` — 2 new tests, both passing. Full suite: 147/147 passing (was 145, +2 for this change).
- Integration Test: None. E2E Test: None.

**Validation:**
- Build: covered by Type Check below. Lint: `npm run lint` ✅ (0 warnings).
- Test: `npx vitest run` ✅ (147/147).
- Type Check: `npx tsc --noEmit` ✅.
- Manual browser verification (Chrome preview, `raise-frontend` dev server) through the **real Login page UI**, not a `localStorage` bypass: submitted `wrong@raise.dev`/`wrongpass` — confirmed "Invalid username or password" shown (genuine credential rejection this time, not a network-failure false positive). Submitted `admin@raise.dev`/`demo1234` — confirmed successful login, landed on the Executive Dashboard as "Demo Admin"/ADMIN.

**Requirement Traceability:**
PRD: `RAISE-NFR-SEC-RBAC-001` (unchanged — this is an infrastructure fix, not a requirement change).
Acceptance Criteria: `AC-LOGIN`'s own "NOT TESTABLE YET" note (mechanism/role content) is unchanged and still accurate.
Test Case: `TC-LOGIN-01`/`-02` — now **PASS** (up from BLOCKED); `TC-LOGIN-03` unaffected, still PASS. `RAISE-TRACEABILITY-MATRIX.md` updated accordingly, Gap 10 closed (infrastructure half).

**Git:**
Branch: `frontend/resolve-f30-mock-auth`
Commit: `5b291d0` (implementation), merged via [PR #59](https://github.com/boonthepkstl-alt/stl_asset_service/pull/59).

**Known Issues:** None new.
**Remaining Work:** F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision. F-22, F-27, and F-30 are all fully closed.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction for one of the three remaining open findings. User chose F-31 next — see `CHECKPOINT-2026-09-01-003` below.

---

## CHECKPOINT-2026-09-01-003

**Phase:** Phase 6 — Oracle FA Integration & Reconciliation
**Feature:** Record explicit business decision on Open Finding F-31
**Task:** Present F-31 (Oracle FA Financial View, P-011, unbuilt placeholder) and its options to the user; record the decision

**What was implemented:** N/A — this is a decision-recording task, not a build task.
**What was modified:** `docs/project-management/OPEN-FINDINGS.md` (F-31's row updated to record the explicit deferral decision).
**What was fixed:** None.
**What was added:** None.
**What was removed:** None.

**Decision:** Presented 3 options — (1) build a scoped interim Financial View using only fields that already exist on the Asset record (Asset Number/Acquisition Info), with an honest "Data Unavailable" state for the Oracle-specific fields (NBV/Depreciation/Oracle Source/Sync Status) that don't require answering F-04's formula question; (2) leave deferred until real Oracle FA integration lands; (3) ask for more detail first. **User chose option (2): explicitly defer** — do not build anything for F-31 until the real Oracle FA integration is in place. Unlike F-22/F-27/F-30, there is no existing field/data in the app to reuse for a "match reality" fix — building anything now for Oracle-specific fields would either fabricate data or pre-empt the still-open F-04 formula question, so deferral is the sound choice here, not a stalled decision.

**Files changed:** 1 file — `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — no code changed.
**Validation:** N/A — no code changed.

**Requirement Traceability:**
PRD: `RAISE-FR-ORACLE-001` (unchanged).
Acceptance Criteria / Test Case: `AC-ORACLE-001-01..04` / `TC-ORACLE-001-01..04` — unchanged, still FAIL (unbuilt), unaffected by this decision (no code changed). `RAISE-TRACEABILITY-MATRIX.md` row unchanged — no re-execution needed since nothing was built.

**Git:**
Branch: `docs/defer-f31-oracle-fa`
Commit: `1b08a3b` (implementation), merged via [PR #60](https://github.com/boonthepkstl-alt/stl_asset_service/pull/60).

**Known Issues:** None new.
**Remaining Work:** F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision. F-31 is now explicitly deferred (not a "buildable now" candidate), distinct from F-22/F-27/F-30 which were fully resolved.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction for one of the two remaining open findings (F-32, F-33) or the Warranty 90-day question. User chose F-32 next — see `CHECKPOINT-2026-09-01-004` below.

---

## CHECKPOINT-2026-09-01-004

**Phase:** Phase 7 — Alerts & Notifications
**Feature:** Resolve Open Finding F-32's business decision, implement, and re-verify — all in one session
**Task:** Per explicit user decision (build a scoped Alerts screen using only warranty data that already exists), implement, verify with automated tests and live browser execution, then close the loop in Test Cases, Traceability Matrix, and Open Findings

**What was implemented:** `frontend/src/pages/Alerts/index.tsx` (new) — a real Alerts screen (P-012) registered at a new `ROUTES.NOTIFICATIONS` (`/notifications`) constant, replacing what was previously an unregistered route that fell through to the app's generic 404. Derives its one alert-triggering condition from the asset's existing `warrantyExpiry` field via the shared `isWarrantyExpired` helper (same one `Assets/index.tsx`'s Warranty column and `dashboard-repository.ts`'s expired-warranty count already use) — no new field or data model. Each row shows Severity (rendered honestly as "Not yet defined," not an invented High/Medium/Low, since severity mapping is undefined per F-05), Description ("Warranty expired {date}"), and the associated Asset (clickable, navigates to Asset Detail).
**What was modified:**
- `frontend/src/config/constants.ts`: new `ROUTES.NOTIFICATIONS: '/notifications'`.
- `frontend/src/App.tsx`: registered the new route.
- `frontend/src/App.navigation.test.tsx`: updated a stale comment that listed "notifications" among un-scaffolded, expected-to-404 nav items.
- `RAISE-TEST-CASES.md` (v0.9→0.10): `TC-ALERT-001-01/-02` — both move to PASS on the testable-now scope (structural display), with the severity/trigger-rule question (F-05) and the "authorized user" gate (PRD §16 Q22) explicitly noted as unaffected, still unresolved. `RAISE-ACCEPTANCE-CRITERIA.md` AC-ALERT-001 was deliberately **not** touched — it already correctly scoped AC-ALERT-001-01 as testable only for structural display, so no spec correction was needed first (unlike F-22/F-27).
- `RAISE-TRACEABILITY-MATRIX.md` (v1.1→1.2): `RAISE-FR-ALERT-001` row updated to **PASS (partial)**; new Gap 11 opened and closed same revision (build-gap scope only).
- `docs/project-management/OPEN-FINDINGS.md`: F-32 moved to **Resolved**, recorded as R-16.
**What was fixed:** The missing route/screen itself — `/notifications` previously fell through to the app's generic 404, worse than a placeholder stub.
**What was added:** `frontend/src/pages/Alerts/index.tsx`, `frontend/src/pages/Alerts/index.test.tsx` (2 new tests — `TC-ALERT-001-01`, `TC-ALERT-001-02`).
**What was removed:** None.

**Files changed:** 8 files — 2 new (`Alerts/index.tsx`, `Alerts/index.test.tsx`), 4 modified (`constants.ts`, `App.tsx`, `App.navigation.test.tsx`, `RAISE-TEST-CASES.md`), 2 docs (`RAISE-TRACEABILITY-MATRIX.md`, `OPEN-FINDINGS.md`).
**Database changes:** None — deliberately reuses the existing `warrantyExpiry` field. **API changes:** None. **Frontend changes:** The sidebar "Notification Center" entry and header bell's "View all notifications" link now reach a real Alerts screen instead of a 404 (the header bell dropdown's own hardcoded-empty state is a separate, smaller-scope item, not wired here).

**Tests:**
- Unit Test: `frontend/src/pages/Alerts/index.test.tsx` — 2 new tests, both passing. Full suite: 149/149 passing (was 147, +2 for this change).
- Integration Test: None. E2E Test: None.

**Validation:**
- Build: covered by Type Check below. Lint: `npm run lint` ✅ (0 warnings).
- Test: `npx vitest run` ✅ (149/149).
- Type Check: `npx tsc --noEmit` ✅.
- Manual browser verification (Chrome preview, `raise-frontend` dev server): navigated to `/notifications` — confirmed it renders 11 alert rows (matching the Dashboard's "Expired Warranty: 11" tile exactly), each with Severity "Not yet defined," a "Warranty expired {date}" description, and a clickable asset link; clicked "Dell OptiPlex 7090" (AST-0013) and confirmed correct navigation to its Asset Detail page. Confirmed no Email/Teams/LINE delivery-channel UI exists anywhere on the page.

**Requirement Traceability:**
PRD: `RAISE-FR-ALERT-001` (unchanged — this implements an already-scoped-correctly AC, not a new requirement).
Acceptance Criteria: `AC-ALERT-001-01/-02` — now PASS on the testable-now structural-display scope.
Test Case: `TC-ALERT-001-01/-02` — now **PASS**; `RAISE-TRACEABILITY-MATRIX.md` updated accordingly, Gap 11 closed.

**Git:**
Branch: `frontend/resolve-f32-alerts-screen`
Commit: `bbc9808` (implementation), merged via [PR #61](https://github.com/boonthepkstl-alt/stl_asset_service/pull/61).

**Known Issues:** None new. The header bell-icon dropdown across other pages remains hardcoded empty — a separate, smaller-scope item not wired in this change.
**Remaining Work:** F-33 and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision. F-22, F-27, F-30, and F-32 are all fully resolved; F-31 is explicitly deferred.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction for the one remaining open finding (F-33) or the Warranty 90-day question. User chose F-33 next — see `CHECKPOINT-2026-09-01-005` below.

---

## CHECKPOINT-2026-09-01-005

**Phase:** Phase 9 — AI Document Intelligence & Search
**Feature:** Record explicit business decision on Open Finding F-33
**Task:** Present F-33 (AI Assistant, P-015, two non-matching surfaces) and its options to the user; record the decision

**What was implemented:** N/A — this is a decision-recording task, not a build task.
**What was modified:** `docs/project-management/OPEN-FINDINGS.md` (F-33's row updated to record the explicit deferral decision).
**What was fixed:** None.
**What was added:** None.
**What was removed:** None.

**Decision:** Presented 3 options — (1) build a scoped canned-answer engine matching only the PRD's illustrative example question ("Which notebooks expire within 90 days?") using existing Asset/Warranty/Type data, with the other 4 `AC-AI-STATES` states handled honestly (e.g. "unable to answer" for anything not matching); (2) leave deferred until real AI backend integration lands; (3) ask for more detail first. **User chose option (2): explicitly defer.** Unlike F-27/F-30/F-32, this finding spans 8 test cases across 5 response states (`TS-AI-SEARCH-001` + `TS-AI-STATES`) requiring a genuine natural-language-Q&A simulation, a larger and more speculative undertaking than reusing one existing field — deferral is the sound choice here, not a stalled decision.

**Files changed:** 1 file — `OPEN-FINDINGS.md`. No frontend/backend code touched.
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — no code changed.
**Validation:** N/A — no code changed.

**Requirement Traceability:**
PRD: `RAISE-AI-SEARCH-001` (unchanged).
Acceptance Criteria / Test Case: `AC-AI-SEARCH-001-01..03`/`AC-AI-STATES-01..05` / `TC-AI-SEARCH-001-01..03`/`TC-AI-STATES-01..05` — unchanged, still FAIL (unbuilt), unaffected by this decision (no code changed). `RAISE-TRACEABILITY-MATRIX.md` row unchanged — no re-execution needed since nothing was built.

**Git:**
Branch: `docs/defer-f33-ai-assistant`
Commit: pending — predicted next PR after #61 (verify via `gh pr list` before treating as final).

**Known Issues:** None new.
**Remaining Work:** `AC-WARRANTY-001-03`'s 90-day threshold remains the one open item blocked on a business/design decision. F-22, F-27, F-30, and F-32 are fully resolved; F-31 and F-33 are both explicitly deferred.
**Next Step:** Recalculate `NEXT-STEP.md`. Check in with the user on direction for the Warranty 90-day question, or a non-decision-dependent task (e.g. `/code-review`, `RAISE-COMPLIANCE-REVIEW.md`).

---

## CHECKPOINT-2026-09-01-006

**Phase:** Phase 3 — Asset Management (Warranty sub-domain)
**Feature:** Resolve `AC-WARRANTY-001-03`'s Expiring-threshold open question (R-17) and implement it end-to-end
**Task:** Present the Warranty "Expiring" threshold question to the user, record the confirmed decision, implement it, verify it, and propagate the decision through the full deliverable chain

**What was implemented:** A per-Asset-Category configurable "Expiring" warranty threshold, defaulting to 90 days for all 5 current categories, admin-adjustable via a new Settings screen.
**What was modified:** `frontend/src/lib/warranty.ts` (new `getWarrantyStatus` 3-state function, `isWarrantyExpired` kept unchanged), `frontend/src/types/settings.ts` (new `WarrantySettings`), `frontend/src/services/settings-service.ts`/`settings-repository.ts` (seed + per-category merge), `frontend/src/pages/Assets/index.tsx` and `frontend/src/pages/AssetDetail/index.tsx` (3-state Warranty badge), `frontend/src/pages/Settings/index.tsx` (new "Warranty" section).
**What was fixed:** N/A.
**What was added:** New Settings "Warranty" section/tab (5 editable per-category threshold inputs); `frontend/src/services/settings-service.test.ts` warranty test; `frontend/src/pages/Assets/index.test.tsx` `TC-WARRANTY-001-03` test.
**What was removed:** None.

**Decision:** Presented the 90-day threshold as the PRD's illustrative-only Business Example and asked how to resolve it. User rejected a plain fixed-number answer ("ระบุจำนวนวันอื่น" then clarified further), then explicitly directed a **per-Asset-Category configurable** field ("กำหนดเป็นช่องให้สามารถระบุได้ เพราะคิดว่าแต่ละอุปกรณ์ warranty ไม่เท่ากัน" — different equipment categories have different warranty periods, so a single global number doesn't fit), confirmed scope as **per Category** (not per-asset, not a single global constant), and confirmed **all categories default to 90 days, admin-adjustable later via Settings**.

**Files changed:** 8 frontend files (listed above) + 7 documentation files (`RAISE-PRD.md` v0.12, `RAISE-DESIGN.md` v0.10, `RAISE-PROTOTYPE.md` v0.10, `RAISE-ACCEPTANCE-CRITERIA.md` v0.9, `RAISE-TEST-PLAN.md` v0.9, `RAISE-TEST-CASES.md` v0.11, `RAISE-TRACEABILITY-MATRIX.md` v1.3) + `OPEN-FINDINGS.md` (R-17 added, F-34 added for the one still-open coverage gap).
**Database changes:** None (frontend-only, mock repository layer). **API changes:** None. **Frontend changes:** See above.

**Tests:** Full suite **151/151 passing** (was 149 before this task — `settings-service.test.ts` +1, `Assets/index.test.tsx` +1). `npx tsc --noEmit` → clean. `npm run lint` → clean, 0 warnings.
**Validation:** Live browser execution (this session): Settings > Warranty renders all 5 categories at default 90; set IT Hardware to 5000, saved ("Settings saved" toast confirmed); Assets list then showed MacBook Pro and Dell UltraSharp Monitor (both IT Hardware) as "Expiring", while iPhone 15 Pro (Mobile, already-expired) correctly stayed "Expired" — confirming no cross-category leakage; MacBook Pro's Asset Detail page confirmed both the Lifecycle row and Warranty & Coverage section badge show "Expiring".

**Requirement Traceability:**
PRD: `RAISE-FR-WARRANTY-001` — Open Question 15b raised and resolved same session as `§16 Resolved Question 41`.
Acceptance Criteria / Test Case: `AC-WARRANTY-001-03` rewritten; new `AC-WARRANTY-001-04/-05/-06` added. `TC-WARRANTY-001-01` through `-05` **PASS**; `TC-WARRANTY-001-06` (non-admin denial to the new Settings screen) written but **not yet executed** — tracked as **F-34** / Traceability Matrix **Gap 13** (still open, a coverage gap, not a business question). `RAISE-TRACEABILITY-MATRIX.md` reached **v1.3** — Gap 12 (the threshold-configurability question itself) opened and closed same revision.

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #61/#62 (verify via `gh pr list` before treating as final; per this project's strict governance, this PR must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** `TC-WARRANTY-001-06` unexecuted (F-34, Gap 13) — real coverage gap, not a blocker on this task's own scope.
**Remaining Work:** With this resolved, every previously-open finding now has an explicit decision (Resolved or explicitly deferred) except F-34 (a coverage gap, not a business question) and the pre-existing standing Blocking/Unresolved/Infrastructure findings (F-02 through F-19 minus what's since been resolved). Git branch/commit/push/PR still pending as of this checkpoint.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-01-007

**Phase:** Phase 3 — Asset Management (Warranty sub-domain)
**Feature:** Execute `TC-WARRANTY-001-06` (F-34) — non-admin access/write denial to the new Settings (P-018) screen
**Task:** Execute the last remaining written-but-unexecuted Warranty test case

**What was implemented:** N/A — this uncovered and fixed a real defect rather than confirming already-correct behavior.
**What was modified:** `frontend/src/App.tsx` (moved `ROUTES.SETTINGS` into the existing ADMIN-only `<ProtectedRoute allowedRoles={['ADMIN']}>` route block, alongside Administration/User Management/Role Management).
**What was fixed:** A real RBAC gap — Settings (which now includes the per-Category Warranty threshold editor) was reachable by any authenticated user, not just ADMIN, despite `AC-WARRANTY-001-06` requiring admin-only access.
**What was added:** 2 new tests in `frontend/src/App.rbac.test.tsx`.
**What was removed:** None.

**Decision:** User instruction: "ทำ TC-WARRANTY-001-06 ต่อเลย" (execute TC-WARRANTY-001-06 next). No business decision was needed — the RBAC enforcement mechanism itself was already confirmed (PRD §16 Resolved Q38); executing the test case surfaced that Settings simply hadn't been wired into it.

**Files changed:** 2 frontend files (`App.tsx`, `App.rbac.test.tsx`) + 2 documentation files (`RAISE-TEST-CASES.md` v0.12, `RAISE-TRACEABILITY-MATRIX.md` v1.4) + `OPEN-FINDINGS.md` (R-18 added, F-34 removed/superseded by R-18).
**Database changes:** None. **API changes:** None. **Frontend changes:** Settings route now ADMIN-gated.

**Tests:** Full suite **153/153 passing** (was 151). `npx tsc --noEmit` → clean. `npm run lint` → clean, 0 warnings.
**Validation:** Live browser execution: an EMPLOYEE-role user navigating to `/settings` sees the app's real "403 — Access denied" Forbidden page; an ADMIN-role user sees the real Settings page render correctly.

**Requirement Traceability:**
PRD: `RAISE-FR-WARRANTY-001` (unchanged — this closes a test-execution gap, not a PRD question).
Acceptance Criteria / Test Case: `AC-WARRANTY-001-06` / `TC-WARRANTY-001-06` — now formally executed, **PASS**. `RAISE-FR-WARRANTY-001`'s Test Status in `RAISE-TRACEABILITY-MATRIX.md` (v1.4) is now a full, unqualified **PASS** — `TC-WARRANTY-001-01` through `-06` all pass. Gap 13 closed (opened v1.3, resolved v1.4).

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #63 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** None new.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-01-008

**Phase:** Cross-cutting (deliverable-chain tooling, not one product phase)
**Feature:** Draft `RAISE-COMPLIANCE-REVIEW.md` — the first artifact in the deliverable chain that consumes source code rather than producing spec for it
**Task:** Assess readiness, then draft the document

**What was implemented:** N/A — a documentation consolidation, not code.
**What was modified:** None.
**What was fixed:** None.
**What was added:** `docs/11-compliance-review/RAISE-COMPLIANCE-REVIEW.md` (new file, new folder, v1.0).
**What was removed:** None.

**Decision:** User asked to check readiness first ("ตรวจสอบ RAISE-COMPLIANCE-REVIEW.md ว่าเริ่มได้หรือยัง"). Assessed via `RAISE-TRACEABILITY-MATRIX.md` v1.4 §6/§8/§9 — confirmed all 13 chain-consistency gaps resolved, no drift. Reported ready, with the caveat that "ready" means the chain is internally consistent, not that every requirement passes. User then confirmed: "เริ่มร่าง RAISE-COMPLIANCE-REVIEW.md เลยครับ".

**Files changed:** 1 new file (`docs/11-compliance-review/RAISE-COMPLIANCE-REVIEW.md`) + `CURRENT-STATUS.md`/`PROJECT-CHECKPOINTS.md`/`DEVELOPMENT-LOG.md` (this checkpoint's own tracking).
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — no code changed.
**Validation:** Every verdict in the new document was drawn directly from `RAISE-TRACEABILITY-MATRIX.md` §3/§4 cells and `OPEN-FINDINGS.md`, not re-derived — no new test execution was performed for this document itself.

**Requirement Traceability:**
Consolidates all 17 MVP-traceable requirements (`RAISE-FR-*`/`RAISE-AI-*`) into a verdict table: 8 `PASS`, 1 `PASS (partial)`, 2 `FAIL` (both explicitly deferred, F-31/F-33), 1 `BLOCKED (partial)`, 1 `BLOCKED`, 4 `BLOCKED (full)`. Plus 2 cross-cutting items (`RAISE-NFR-SEC-RBAC-001` PASS, Dashboard/Navigation PASS (partial)).

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #64 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** None new — this document surfaces, not creates, the 6 already-tracked `BLOCKED`/`FAIL` requirement verdicts.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-01-009

**Phase:** Phase 3 — Asset Management (Custody & Asset Operations)
**Feature:** Resolve Open Finding F-02 — Check-in/Check-out workflow shape, permission gate, and Custody holder data model (PRD §16 Q11–Q13)
**Task:** Present F-02 with context, record the confirmed business decision, and propagate it through the full deliverable chain

**What was implemented:** N/A — all three confirmed answers matched already-built, already-tested behavior exactly; no new code was required.
**What was modified:** None (code). Documentation only: `RAISE-PRD.md` (v0.13), `RAISE-DESIGN.md` (v0.11), `RAISE-PROTOTYPE.md` (v0.12), `RAISE-ACCEPTANCE-CRITERIA.md` (v0.10), `RAISE-TEST-PLAN.md` (v0.10), `RAISE-TEST-CASES.md` (v0.13), `RAISE-TRACEABILITY-MATRIX.md` (v1.5), `OPEN-FINDINGS.md` (R-19 added, F-02 removed from Blocking table).
**What was fixed:** A drafting overreach caught mid-session — the Prototype sync's first pass (v0.11) incorrectly inferred an answer to a separate, unconfirmed question (whether Check-in/Check-out exclusively writes Custody History, Open Finding F-10) from the fact that no other code path currently exists. Caught immediately, corrected in the same session (v0.12), restoring F-10 to genuinely open.
**What was added:** None.
**What was removed:** None.

**Decision:** Presented F-02's three sub-questions (Q11 workflow shape, Q12 permission gate, Q13 holder data model) with the app's current behavior described for each. User confirmed all three recommended options via `AskUserQuestion`, all of which matched the current implementation exactly: (1) immediate state-change, no approval workflow; (2) any authenticated user, no role restriction; (3) direct 1:1 Employee link, no additional org-relationship model.

**Files changed:** 7 documentation files (listed above) + `OPEN-FINDINGS.md`.
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** Full suite re-run as a sanity check (no code changed) — **153/153 passing**, unchanged from before this checkpoint.
**Validation:** N/A beyond the sanity-check test run — no new behavior to verify live, since nothing changed. The existing `TC-OPS-002-01..03` PASS result (2026-08-28) already covers the newly-confirmed scope.

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002`, `RAISE-FR-ASSET-003` — Open Questions 11, 12, 13 resolved as `§16 Resolved Question 42`.
Acceptance Criteria / Test Case: `AC-OPS-002-01/-02` rewritten to state the confirmed rule directly; `TC-OPS-002-01..03` reclassified from partially-blocked to fully PASS (no new execution). `RAISE-TRACEABILITY-MATRIX.md` (v1.5) — Gap 14 opened and closed same revision. **Explicitly unaffected:** Open Finding F-10 (Custody History write-path exclusivity) and Open Finding F-08 (general RBAC role/permission-matrix content for other domains) both remain genuinely open.

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #66 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** None new.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-01-010

**Phase:** Infrastructure / Process (F-13 Hosting, F-14 CI/CD — not a PRD-scope item)
**Feature:** Local 3-container Docker stack (frontend / backend / PostgreSQL)
**Task:** User requested local Docker infrastructure with one container each for `frontend/`, `go-template-main/`, and the database

**What was implemented:** `docker-compose.yml` (root) orchestrating 3 services (`db`: `postgres:16-alpine` with auto-applied `sql/pg/*.sql` init on first run; `backend`: multi-stage Go 1.23 build; `frontend`: multi-stage Node 20 → nginx build), plus `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/.dockerignore`, `go-template-main/Dockerfile`, `go-template-main/.dockerignore`, `docker.env.example`, and `DOCKER.md` (usage guide).
**What was modified:** None (existing app code untouched).
**What was fixed:** A real bug found during verification, not a pre-existing one — the initial `nginx.conf` used `try_files $uri $uri/ /index.html`, which matched the app's client-side `/assets` route (Asset Registry) against Vite's own build-output `assets/` directory (hashed JS/CSS chunks) and 301-redirected instead of serving the SPA shell. Fixed by dropping the `$uri/` directory-match fallback (`try_files $uri /index.html`) — static chunks still serve correctly via a separate extension-matched `location` block.
**What was added:** See "What was implemented."
**What was removed:** None.

**Decision:** N/A — a concrete engineering request (3 named containers), not a PRD/business question. No `AskUserQuestion` needed; reasonable infra defaults (Postgres 16, Node 20, Go 1.23 matching `go.mod`, ports 3000/8080/5432) were chosen and documented in `DOCKER.md` rather than asked about.

**Files changed:** 9 new files (`docker-compose.yml`, `DOCKER.md`, `docker.env.example`, `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/.dockerignore`, `go-template-main/Dockerfile`, `go-template-main/.dockerignore`) + `OPEN-FINDINGS.md` (F-13/F-14 notes updated, not resolved).
**Database changes:** None to schema — the existing `sql/pg/V0..V4` files are now auto-applied by the `db` container's first-run init, not newly written.
**API changes:** None. **Frontend changes:** None to app code; only the new `nginx.conf` serving layer.

**Tests:** No unit/automated test suite applies to Docker infra itself. **Full manual end-to-end verification performed** (see Validation).
**Validation:** `docker compose up --build` — all 3 containers reached a running/healthy state. Verified live: (1) Postgres init auto-applied all 5 migration files (`\dt` showed `assets`, `audit_logs`, `employees`, `samplemodel`, `technicians`, `tickets`); (2) backend `/api/auth/login` with the existing demo credentials (`admin`/`password`) returned a valid JWT; (3) that token successfully queried `/api/assets` (a DB-backed endpoint, returned `{"data":[],"total":0}` — empty because no seed data, not because the connection failed); (4) CORS preflight from `Origin: http://localhost:3000` to the backend returned `Access-Control-Allow-Origin: http://localhost:3000` correctly; (5) frontend served `index.html` at `/`, and — after the nginx fix — both `/assets` and `/settings` (SPA client-side routes) returned 200 with the app shell, while the real static chunk `/assets/index-*.js` still served correctly with `application/javascript`. All test containers stopped and removed after verification (`docker compose down`).

**Requirement Traceability:**
No `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` ID — this is Infrastructure/Process work (F-13/F-14), explicitly outside PRD scope, consistent with `OPEN-FINDINGS.md`'s existing categorization.

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #67 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** F-13 (production hosting target) and F-14 (CI/CD pipeline) remain genuinely open — this checkpoint makes local dev/demo containerized and reproducible, it does not decide where these containers would run in production or wire up any pipeline to build/push them.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-02-001

**Phase:** Infrastructure / Process (F-13/F-14) + Phase 8 (Executive Dashboard, `RAISE-FR-EXEC-001`)
**Feature:** Fix the Docker stack to actually exercise the real backend, and a real dashboard null-guard bug found while doing so
**Task:** User asked to log in through the running Docker stack and try it (`admin`/`password`)

**What was implemented:** N/A — two bug fixes, not new features.
**What was modified:** `frontend/Dockerfile` (added `VITE_AUTH_API_ENABLED`/`VITE_ASSET_API_ENABLED`/`VITE_EMPLOYEE_API_ENABLED`/`VITE_TICKET_API_ENABLED`/`VITE_AUDIT_API_ENABLED`/`VITE_DASHBOARD_API_ENABLED` build args, all defaulting `true`), `docker-compose.yml` (passes them through), `docker.env.example` (documents them), `frontend/nginx.conf` (adds an explicit no-cache header on `index.html`), `frontend/src/services/dashboard-repository.ts` (null-guards `departmentDistribution`/`assetTypeDistribution`).
**What was fixed:** Two real defects, both found via live verification, neither by test suite alone:
1. The Docker frontend image was built without any `*_API_ENABLED` flag set, so it silently ran entirely on in-memory mock data — `admin`/`password` (the real backend's demo credential) failed login with "Invalid username or password" because the frontend was validating against `MockAuthRepository`'s different demo accounts instead of ever calling the real `go-template-main` container. Root cause: my initial Dockerfile only wired `VITE_API_BASE_URL`, missing every feature-flag env var the app actually gates its repository choice on.
2. Once real API calls were wired up, the Executive Dashboard crashed with "Unable to load dashboard statistics" against an empty (freshly-migrated, unseeded) database: Go marshals a nil slice as JSON `null`, not `[]`, and `HttpDashboardRepository.getAssetStats()` trusted the `AssetDashboardStats` TS type (which claims non-null arrays) without guarding against it — `Dashboard/index.tsx`'s `.map()` calls threw on `null`.
3. Also caught along the way (already fixed in the prior checkpoint's stack but re-verified here): `index.html` was not being sent with an explicit no-cache header, so a rebuilt container's new JS hash could stay invisible behind a browser's own cached copy of the previous `index.html` — fixed by an explicit `location = /index.html { add_header Cache-Control "no-cache, no-store, must-revalidate"; }` block.
**What was added:** 1 new regression test (`dashboard-repository.http.test.ts` — null → `[]` normalization).
**What was removed:** None.

**Decision:** N/A — bug fixes found via live testing, not business questions.

**Files changed:** 6 files (`frontend/Dockerfile`, `docker-compose.yml`, `docker.env.example`, `frontend/nginx.conf`, `frontend/src/services/dashboard-repository.ts`, `frontend/src/services/dashboard-repository.http.test.ts`).
**Database changes:** None. **API changes:** None (frontend-only). **Frontend changes:** See above.

**Tests:** Full suite **154/154 passing** (was 153, +1 for the new null-guard regression test). `npx tsc --noEmit` → clean. `npm run lint` → clean.
**Validation:** Live Docker verification, twice — once per bug: (1) after adding the `*_API_ENABLED` build args and rebuilding, `admin`/`password` successfully logged in through the real browser UI, landing on the Executive Dashboard as "Template Admin"/ADMIN (the real backend's demo user, distinct from the mock's "Demo Admin") — confirmed via network log showing a real `POST /api/auth/login` call, not an in-memory resolution. (2) After the dashboard null-guard fix and nginx no-cache fix, rebuilt again and re-verified via a cache-busted navigation (`?cachebust=1`, since the browser automation tool's own navigation reused a stale cached `index.html` referencing an old JS hash even after the no-cache header was added — confirmed server-side via direct `curl` that the header and correct hash were being served correctly throughout): Dashboard now renders "0" for every KPI tile (correctly reflecting the empty database) with no crash, and the Department Distribution donut chart renders its empty state correctly. No console errors.

**Requirement Traceability:**
No `RAISE-FR-*` ID for the Docker/nginx fixes (Infrastructure/Process, F-13/F-14). The dashboard null-guard touches `RAISE-FR-EXEC-001`'s existing `PASS` status — this is a defensive fix for an edge case (0 assets) that the existing formal `TC-DASH-01/-02`/`TC-EXEC-001-01/-02` execution (2026-08-31, against a seeded fixture) never exercised; it does not change that Test Status, since it was never formally re-executed against a live empty-database scenario as a numbered test case.

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #68 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** None new.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-02-002

**Phase:** Infrastructure / Process (F-13/F-14) + Phase 8 (Executive Dashboard, `RAISE-FR-EXEC-001`)
**Feature:** `/code-review` pass on the Docker infra diff (PRs #68–#69), fixes applied
**Task:** User ran `/code-review max --fix` against the Docker infrastructure changes

**What was implemented:** N/A — code-review-driven fixes, not new features.
**What was modified:** `docker-compose.yml` (CORS_ALLOW_ORIGINS/VITE_API_BASE_URL now derive their defaults from FRONTEND_PORT/BACKEND_PORT via nested compose interpolation instead of hardcoded literals), `docker.env.example` (comments updated to match, override lines now commented out by default so the new derivation actually applies), `frontend/Dockerfile` (removed 8 redundant `ENV VAR=$VAR` lines mirroring `ARG` declarations — Docker already exposes ARG values to same-stage RUN instructions), `DOCKER.md` (documents that the stack is only reachable from the Docker host machine, not other machines on the LAN, and updates the stale "manually update VITE_API_BASE_URL" advice), `frontend/src/services/dashboard-repository.ts` (added a whole-object null guard on top of the existing per-field array guard), `frontend/src/services/dashboard-repository.http.test.ts` (1 new regression test).
**What was fixed:** 6 findings reported via `ReportFindings`, 5 fixed, 1 skipped (see below).
**What was added:** 1 new regression test.
**What was removed:** 8 redundant `ENV` lines in `frontend/Dockerfile`.

**Decision:** N/A — code-review findings, not business questions. One finding (frontend's `depends_on: backend` lacking a health condition, since `backend` has no healthcheck at all) was deliberately **not** auto-fixed: writing a correct healthcheck for the Go binary risked shipping something worse than the problem it fixed (an incorrect check would make `docker compose up` hang forever waiting for a container that's actually fine), and the underlying race window is narrow and self-healing (a few hundred ms to ~1-2s before the human/script can plausibly hit the endpoint). Reported as `PLAUSIBLE`/`skipped` with reasoning rather than fixed via guesswork.

**Files changed:** 6 files (listed above).
**Database changes:** None. **API changes:** None. **Frontend changes:** See above.

**Tests:** Full suite **155/155 passing** (was 154, +1 for the new whole-object-null regression test). `npx tsc --noEmit` → clean (had to restructure the null-guard from a spread+override pattern to explicit `?? 0`/`?? []` per field after `tsc` correctly flagged the spread pattern as TS2783 "specified more than once"). `npm run lint` → clean.
**Validation:** `docker compose config` (with and without `BACKEND_PORT`/`FRONTEND_PORT` overrides) confirmed the new nested interpolation resolves correctly in both the default and overridden cases. Full Docker rebuild (`docker compose up -d --build`) and live re-verification: frontend/backend/db all healthy, login succeeds, CORS preflight passes, dashboard renders correctly with no console errors — same evidence bar as `CHECKPOINT-2026-09-02-001`, confirming the code-review fixes didn't regress anything.

**Requirement Traceability:**
No `RAISE-FR-*` ID for the Docker/nginx fixes (Infrastructure/Process, F-13/F-14, unaffected in scope). The dashboard whole-object null guard is a defensive hardening of `RAISE-FR-EXEC-001`'s existing `PASS` status, not a new test execution.

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #69 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** The `frontend`/`backend` `depends_on` health-condition gap (skipped finding) remains open — a narrow, self-healing race window, not tracked as a numbered Open Finding since it's sub-severity for this project's F-13/F-14 categorization.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-02-003

**Phase:** Phase 8 (Executive Dashboard, `RAISE-FR-EXEC-001`)
**Feature:** Fix `ExpiredWarranty` always reporting 0 regardless of real data — found while seeding demo data into the local Docker stack
**Task:** User asked to seed the Docker stack's database so the dashboard shows real numbers

**What was implemented:** N/A — a bug fix, not a new feature. 10 sample assets were inserted directly into the running `db` container's Postgres (ephemeral — not a committed SQL migration, lost on `docker compose down -v`) to populate the dashboard for demo purposes.
**What was modified:** `go-template-main/service/dashboardService.go` (new `parseAssetDate` helper tolerating both RFC3339 and bare-date layouts), `go-template-main/service/dashboardService_test.go` (1 new regression test).
**What was fixed:** A real, pre-existing backend bug (not introduced this session): `GetDashboardStats()`'s expired-warranty check parsed `WarrantyExpiry` with the strict layout `"2006-01-02"`, but `lib/pq` actually scans a Postgres `date` column into a Go string as RFC3339 (`"2025-06-10T00:00:00Z"`), which that layout doesn't match — the parse silently failed (non-nil `err`) for every real row, so `ExpiredWarranty` stayed `0` no matter how much genuinely-expired seed data existed. This is why the existing unit tests (which use bare `"2020-01-01"`-style fixtures) never caught it — they don't exercise the real driver's actual wire format.
**What was added:** `parseAssetDate` helper; 1 new regression test (`TestGetDashboardStats_CountsExpiredWarranty_RFC3339Layout`).
**What was removed:** None.

**Decision:** N/A — a clear, unambiguous bug fix (not a business/scope question), found via the same "seed real data through the real stack" verification pattern that already caught the nginx routing bug and the dashboard null-guard bug earlier in this session.

**Files changed:** 2 files (`go-template-main/service/dashboardService.go`, `go-template-main/service/dashboardService_test.go`).
**Database changes:** None to schema. 10 sample asset rows inserted directly into the running container's Postgres for demo purposes — ephemeral, not part of any committed migration.
**API changes:** None (response shape unchanged — only the previously-always-0 `expiredWarranty` value is now correct). **Frontend changes:** None.

**Tests:** `go build ./...` → **Pass**. `go vet ./...` → **Pass**. `go test ./...` → **Pass** (all packages, including the new regression test).
**Validation:** Live-verified against the real seeded Docker stack: `GET /api/dashboard/stats` returned `expiredWarranty: 7` after the fix (was `0` before), matching manual counting of the 10 seed assets' warranty dates against today's date (2026-09-02) exactly. Confirmed visually in the browser — the Dashboard's "Expired Warranty" KPI tile shows 7.

**Requirement Traceability:**
`RAISE-FR-EXEC-001` — this is a defensive/correctness fix to the existing `PASS` dashboard implementation, not a new test execution against `RAISE-TEST-CASES.md`'s `TC-DASH-*`/`TC-EXEC-001-*` (those test presence of tiles/sections against a fixture, not this specific date-parsing edge case).

**Git:**
Branch: pending (not yet created as of this checkpoint).
Commit: pending — predicted next PR after #70 (verify via `gh pr list` before treating as final; must not be merged until the user explicitly instructs "merge PR #N").

**Known Issues:** None new.
**Remaining Work:** Git branch/commit/push/PR for this checkpoint's changes. The 10 seed asset rows in the running container are ephemeral (not committed to a migration) — if a durable local demo dataset is wanted later, that would be a separate, explicitly-requested task.
**Next Step:** Recalculate `NEXT-STEP.md`. Create git branch, commit, push, open PR, and wait for the user's explicit "merge PR #N" instruction before merging.

---

## CHECKPOINT-2026-09-02-004

**Phase:** Phase 3 — Asset Management
**Feature:** IT Hardware Assignment Approval Workflow (`RAISE-FR-OPS-002` category-scoped exception, PRD §16 Resolved Question 43)
**Task:** Implement the backend for a real 4-stage approval workflow, scoped only to assigning (Check-out) IT Hardware category assets, confirmed this session from a user-supplied real company equipment handover form (Singer Thailand "ใบดำเนินการเกี่ยวกับคอมพิวเตอร์และอุปกรณ์", Version 2024)

**What was implemented:** A new Asset Handover domain in `go-template-main`: Stage 1 Initiation (IT/Admin clicks Assign on an IT Hardware asset → asset enters pending state instead of immediately "Assigned"), Stage 2 Recipient Confirmation (the assigned employee confirms receipt — merges the paper form's recipient + recipient-supervisor signatures into one digital step, a deliberate business simplification), Stage 3 IT Processing (an IT_STAFF-role user processes it), Stage 4 IT Supervisor Approval (an IT_MANAGER-role user gives final approval — only this stage flips the asset's status to the existing "Assigned" value). Rejection is possible only at Stage 3 or Stage 4, returns the asset immediately to "Available", and is terminal (no reopening). No new Role was introduced (reuses IT_STAFF/IT_MANAGER). All other categories and all Check-in are unaffected — the old `POST /assets/:id/assign` immediate-assign path still works unchanged for non-IT-Hardware assets.
**What was modified:** `controller/assetController.go` (`AssignAsset` now returns HTTP 409 + a `nextStep` hint for IT Hardware assets instead of assigning immediately); `router/sampleRouter.go` (6 new routes wired); `service/assetService.go` (new `ErrRequiresHandoverApproval` sentinel error, `CategoryITHardware` constant, `CompleteHandoverAssignment` method, `applyAssignment` extracted as a shared helper); `service/dashboardService_test.go` (the `fakeAssetService` test double updated for the widened service interface).
**What was fixed:** During a self-initiated code-review pass (5 parallel reviewer agents, 8 finder angles, 8 candidates found), 3 issues were fixed and re-verified live: (1) `InitiateHandover` now validates `employeeId`/`employeeName` are non-empty (HTTP 400 if missing) — closes a gap where an empty recipient could bypass Stage 2's identity check; (2) handover code sequence numbers are now correctly year-scoped (`AHO-<year>-<seq>` resets each year) via a new `CountByCodePrefix` repository method, replacing a full List()-fetch-and-discard pattern; (3) HTTP status mapping fixed so the new validation error returns 400, not 500.
**What was added:** `model/assetHandoverModel.go`, `repository/assetHandoverPGRepository.go`, `repository/assetHandoverRepository.go`, `service/assetHandoverService.go`, `controller/assetHandoverController.go`, `sql/pg/V5__AssetHandovers_Table.sql`, `service/assetHandoverService_test.go` (24 test functions). 6 new routes: `GET /handovers`, `GET /handovers/:code`, `POST /assets/:id/handover`, `POST /handovers/:code/confirm`, `POST /handovers/:code/process`, `POST /handovers/:code/decision`.
**What was removed:** None.

**Files changed:** 13 total — 7 new (`model/assetHandoverModel.go`, `repository/assetHandoverPGRepository.go`, `repository/assetHandoverRepository.go`, `service/assetHandoverService.go`, `controller/assetHandoverController.go`, `sql/pg/V5__AssetHandovers_Table.sql`, `service/assetHandoverService_test.go`) + 4 modified Go files (`controller/assetController.go`, `router/sampleRouter.go`, `service/assetService.go`, `service/dashboardService_test.go`) + 2 modified docs-adjacent files already synced by an earlier step this session (`docs/project-management/OPEN-FINDINGS.md`, plus the 7-file PRD→Traceability-Matrix chain — see that step's own record, not restated here).
**Database changes:** New `sql/pg/V5__AssetHandovers_Table.sql` migration (new `asset_handovers` table). Applied live to the running Docker `db` container this session for verification.
**API changes:** `POST /assets/:id/assign` now returns `409 Conflict` + a `nextStep` hint for IT Hardware category assets (was: immediate 200 assign) — a real, intentional breaking-for-that-category change to existing behavior, not additive-only. 6 new endpoints listed above.
**Frontend changes:** None — explicitly out of scope for this task; frontend UI for this workflow has not been started.

**Tests:**
- Unit Test: `service/assetHandoverService_test.go`, 24 new test functions — all 4 stages, both rejection points, the non-IT-Hardware regression guard, the empty-recipient validation, and the year-scoped sequence numbering
- Integration Test: None (Go module has no separate integration-test tier)
- E2E Test: None automated — live-verified manually via `curl` against the real Docker stack (see Validation)

**Validation:**
- Build: Pass — `go build ./...` (re-confirmed this close-out, exit 0)
- Lint: N/A (Go — `gofmt` confirmed clean on every new/edited file)
- Test: Pass — `go vet ./...` and `go test ./...` (re-confirmed this close-out, exit 0, full module including `singer/go-template-new-2026-06/{controller,middleware,service}`)
- Type Check: N/A (Go)
- Live E2E (Docker stack, `stl_asset_pj-backend-1`/`stl_asset_pj-db-1`): applied the V5 migration to the running DB, rebuilt/restarted the backend container, then via `curl`: confirmed old `POST /assets/:id/assign` returns 409 + `nextStep` for IT Hardware assets; confirmed all 4 stages transition correctly (asset stays "Available" through stages 1–3, flips to "Assigned" only at Stage 4 approval); confirmed rejection at Stage 3 and Stage 4 both return the asset to "Available" and are terminal (a second decision on an already-rejected handover is correctly rejected); confirmed `GET /handovers` list + status filter works; confirmed non-IT-Hardware assets (e.g. Office Equipment) still assign immediately with no 409 (regression guard).

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002` (§16 Resolved Question 43, v0.14)
Design: `RAISE-DESIGN.md` §4.2, v0.12
Acceptance Criteria: `AC-OPS-002-04`..`-09`, `RAISE-ACCEPTANCE-CRITERIA.md` v0.11
Test Case: `TC-OPS-002-04`..`-09`, `RAISE-TEST-CASES.md` v0.15 — moved from `BLOCKED (pending implementation)` to `PASS` (backend/API-level scope; no frontend UI yet; RBAC not backend-enforced, per this project's existing MVP-wide convention). `TS-OPS-002` row now 9/9/0/0/0 (was 9/3/6/0/0). `RAISE-TRACEABILITY-MATRIX.md` v1.7 — Gap 15 closed.

**Git:**
Branch: `feature/it-hardware-handover-approval-workflow` (deleted after merge)
Commit: `16a062c` (feature commit), merged to `main` via [PR #72](https://github.com/boonthepkstl-alt/stl_asset_service/pull/72) (merge commit `498b7fb`), 2026-09-02.

**Known Issues:**
- 5 code-review findings were identified but deliberately **not** fixed this session, documented as residual risk with inline code comments in `service/assetHandoverService.go`: (1) a count-then-insert race condition on the sequence number — the same unaddressed pattern already present in `TicketService.CreateTicket`, needs a DB sequence or `SELECT ... FOR UPDATE`, larger change than this pass's scope; (2) a non-atomic two-write sequence between the asset-status flip and the handover-record update at Stage 4 approval — no shared-transaction mechanism exists anywhere in this codebase, same best-effort trade-off already documented on the audit-log write elsewhere; (3) a TOCTOU gap where Stage 4 approval doesn't re-validate the asset's live status before flipping it (plausible, not confirmed); (4) `GetAsset` errors always mapped to a 404 rather than distinguishing real failures — matches `AssignAsset`'s existing pre-established convention, no change needed; (5) a hardcoded route-string coupling in the 409 response's `nextStep` hint (low severity, cosmetic).
- RBAC/role enforcement for IT_STAFF/IT_MANAGER is not backend-enforced on the new endpoints — consistent with this codebase's pre-existing, PRD-confirmed, project-wide MVP decision (RBAC is UI-only/client-side for MVP, PRD §16 Resolved Question 38), not a gap specific to this feature, but a real limitation of what "Approve" currently means (anyone with a valid JWT can call these endpoints today).
- Stage 2 e-signature/acknowledgment-text capture is genuinely undecided — the user was asked this exact question this session and explicitly dismissed it. Must not be decided, invented, or treated as resolved by any future session without new explicit user instruction.
- Stage 2 recipient-decline path was never asked and is not implemented.
- Custody History write-timing across the 4 stages: `RAISE-DESIGN.md` §4.2 itself flags this as an open design point, not resolved by this implementation.

**Remaining Work:**
- Frontend UI for this workflow does not exist at all yet — no "My Pending Assignments" surface, no IT_STAFF queue, no IT_MANAGER queue, no stage-progress indicator. This is a distinct, sizeable, not-yet-started follow-up, comparable in scope to the whole Maintenance domain's frontend work.
- The open business questions above (Stage 2 e-signature, Stage 2 decline path, Custody History write-timing) remain open pending explicit user direction.

**Next Step:** ~~Create a git branch, commit these changes, push, and open a PR~~ — **done**: [PR #72](https://github.com/boonthepkstl-alt/stl_asset_service/pull/72) opened, then merged to `main` on the user's explicit "merge PR #72" instruction, 2026-09-02 (see Git section above). Frontend UI work is the next substantive follow-up task, but is out of scope for this checkpoint.

---

## CHECKPOINT-2026-09-02-005

**Phase:** Phase 3 — Asset Management
**Feature:** IT Hardware Assignment Approval Workflow (`RAISE-FR-OPS-002` category-scoped exception)
**Task:** Docs-only session close-out for `CHECKPOINT-2026-09-02-004`/PR #72 — this checkpoint itself was never logged at the time

**What was implemented:** N/A — documentation-only, no code/behavior change.
**What was modified:** `docs/project-management/PROJECT-CHECKPOINTS.md` (`CHECKPOINT-2026-09-02-004`'s Git section updated from `pending` to the real merged commit/branch, once PR #72 actually merged).
**What was fixed:** None.
**What was added:** `docs/project-management/DEVELOPMENT-LOG.md` row for PR #72; `docs/project-management/CHANGELOG.md` entry for PR #72's user-visible change (IT Hardware Assignment Approval Workflow, backend-only) — both deferred until #72 was confirmed merged, per this project's own convention that those two files only get entries for **merged** PRs, not predicted ones.
**What was removed:** None.

**Files changed:** 3 (`docs/project-management/CHANGELOG.md`, `docs/project-management/DEVELOPMENT-LOG.md`, `docs/project-management/PROJECT-CHECKPOINTS.md`) — +19/-4.
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002` (§16 Resolved Question 43) — recording only, no new evidence generated.
Design/Acceptance Criteria/Test Case: Unchanged by this PR — see `CHECKPOINT-2026-09-02-004`.

**Git:**
Branch: `docs/it-hardware-handover-closeout` (deleted after merge)
Commit: `85d67e6` (feature commit), merged to `main` via [PR #73](https://github.com/boonthepkstl-alt/stl_asset_service/pull/73) (merge commit `d86d109`), 2026-09-02.

**Known Issues:** This checkpoint itself is being recorded retroactively (during the PR #73–#76 close-out pass) — the gap it documents (a pure-docs-closeout PR lacking its own `DEVELOPMENT-LOG.md` row and Task Checkpoint) is the same class of gap R-04 fixed for PRs #19–#28, now recurring here for #73/#75. Established convention (PR #30, #32, #34, #36, #66 all pure-docs-closeout PRs with their own rows) says every merged PR gets one — this checkpoint and the `DEVELOPMENT-LOG.md` row added in this same pass close that gap for #73.
**Remaining Work:** None for PR #72's close-out itself. Frontend UI for this workflow remained the open follow-up at the time (addressed next, PR #74).
**Next Step:** Frontend UI for the IT Hardware handover workflow (became PR #74).

---

## CHECKPOINT-2026-09-02-006

**Phase:** Phase 3 — Asset Management
**Feature:** IT Hardware Assignment Approval Workflow (`RAISE-FR-OPS-002` category-scoped exception) — frontend
**Task:** Build the frontend UI for the 4-stage approval workflow whose backend shipped in PR #72 (`CHECKPOINT-2026-09-02-004`), per that checkpoint's own predicted next step

**What was implemented:** Full frontend surface for the 4-stage workflow: `types/handover.ts`, `services/handover-repository.ts` (Mock + Http, mirroring the established `ticket-repository.ts` pattern), `services/handover-service.ts`, `hooks/useHandover.ts`/`useHandovers.ts`, three new pages (`MyPendingAssignments`, `ITProcessingQueue`, `ITSupervisorApprovalQueue` — all three later deleted and replaced by a single consolidated page in PR #76, see `CHECKPOINT-2026-09-03-002`) plus `HandoverDetail` (a 4-stage governance indicator mirroring `TicketDetail`'s existing pattern). New routes role-gated client-side (`IT_STAFF`/`ADMIN` for the processing queue, `IT_MANAGER`/`ADMIN` for the approval queue) via the existing `ProtectedRoute` pattern — UI-only, no backend RBAC enforcement, consistent with this codebase's pre-existing MVP decision.
**What was modified:** `AssetDetail`'s existing Assign button now intercepts IT Hardware category assets and routes through this flow instead of assigning immediately; every other category unaffected (regression-tested). `App.tsx`, `config/constants.ts`, `config/featureFlags.ts`, `config/navigation.ts`, `data/fixtures/requisitionData.ts`, `docker-compose.yml`, `docker.env.example`, `frontend/.env.example`, `frontend/Dockerfile`.
**What was fixed:** A self-initiated code-review pass (5 parallel reviewer agents, 8 finder angles) found and fixed 3 real bugs before merge: (1) the mock repository's Approve action never actually completed the underlying asset assignment (the default, `HANDOVER_API_ENABLED=false` demo path silently left assets stuck "Available" forever despite the handover record showing "Assigned") — fixed in `handoverService.decideHandover` to complete the assignment itself when mocked, mirroring the real backend's `CompleteHandoverAssignment`; (2) the pending-handover badge/quick-action on Asset Detail was category-blind (didn't check `asset.category === 'IT Hardware'`) — fixed with defense-in-depth; (3) the Custody Lifecycle row on Asset Detail said "Currently Available" while a handover was actively pending, contradicting the header badge on the same page — fixed to show "Assignment Pending — {recipient}".
**What was added:** See "What was implemented." Plus new test files: `App.rbac.test.tsx` additions, `AssetDetail/index.test.tsx` additions, `HandoverDetail/index.test.tsx`, `ITProcessingQueue/index.test.tsx`, `ITSupervisorApprovalQueue/index.test.tsx`, `MyPendingAssignments/index.test.tsx`, `handover-repository.http.test.ts`, `handover-repository.test.ts`, `handover-service.test.ts`.
**What was removed:** None (the 3 queue pages added here were removed later, in PR #76).

**Files changed:** 29 (`+2055/-7`) — full list: `docker-compose.yml`, `docker.env.example`, `frontend/.env.example`, `frontend/Dockerfile`, `frontend/src/App.rbac.test.tsx`, `frontend/src/App.tsx`, `frontend/src/config/constants.ts`, `frontend/src/config/featureFlags.ts`, `frontend/src/config/navigation.ts`, `frontend/src/data/fixtures/handoverData.ts`, `frontend/src/data/fixtures/requisitionData.ts`, `frontend/src/hooks/useHandover.ts`, `frontend/src/hooks/useHandovers.ts`, `frontend/src/pages/AssetDetail/index.test.tsx`, `frontend/src/pages/AssetDetail/index.tsx`, `frontend/src/pages/HandoverDetail/index.test.tsx`, `frontend/src/pages/HandoverDetail/index.tsx`, `frontend/src/pages/ITProcessingQueue/{index.tsx,index.test.tsx}`, `frontend/src/pages/ITSupervisorApprovalQueue/{index.tsx,index.test.tsx}`, `frontend/src/pages/MyPendingAssignments/{index.tsx,index.test.tsx}`, `frontend/src/services/handover-repository.{ts,test.ts,http.test.ts}`, `frontend/src/services/handover-service.{ts,test.ts}`, `frontend/src/types/handover.ts`.
**Database changes:** None (consumes PR #72's existing backend endpoints; no schema change). **API changes:** None new (frontend-only; wires to PR #72's 6 endpoints behind `HANDOVER_API_ENABLED`, default off — mock path is the default demo experience). **Frontend changes:** See above — this is the change.

**Tests:**
- Unit Test: `handover-repository.test.ts`, `handover-repository.http.test.ts`, `handover-service.test.ts` (new)
- Integration Test: `HandoverDetail/index.test.tsx`, `ITProcessingQueue/index.test.tsx`, `ITSupervisorApprovalQueue/index.test.tsx`, `MyPendingAssignments/index.test.tsx` (new); `AssetDetail/index.test.tsx`, `App.rbac.test.tsx` (extended)
- E2E Test: None automated — live-verified manually (see Validation)

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings)
- Test: Pass — 47 test files / 196 tests passing at merge time
- Type Check: Pass (`tsc --noEmit` clean)
- Live E2E (real running Docker stack, through the actual UI, not just API calls): all 4 stages exercised via real button clicks; both rejection paths verified with correct stage-attribution in the governance indicator; the non-IT-Hardware regression guard confirmed (other categories still assign immediately).

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002` (§16 Resolved Question 43)
Design: `RAISE-DESIGN.md` §4.2 (unchanged this PR — already covers the workflow from PR #72)
Acceptance Criteria: `AC-OPS-002-04`..`-09` (frontend now exercises what PR #72 only satisfied at the API level)
Test Case: `TC-OPS-002-04`..`-09` — status unchanged by this PR itself (the deliverable-chain re-sync recording the frontend's completion is PR #75, `CHECKPOINT-2026-09-03-001`)

**Git:**
Branch: `feature/it-hardware-handover-workflow-frontend` (deleted after merge)
Commit: `97e7558` (feature commit), merged to `main` via [PR #74](https://github.com/boonthepkstl-alt/stl_asset_service/pull/74) (merge commit `c5b17d9`), 2026-09-02.

**Known Issues:** 4 lower-severity findings from the code-review pass were left as documented residual risk, not fixed: (1) name-only recipient matching between the User/auth model and Employee/recipient model — no `employeeId` link exists anywhere in this codebase, a documented accepted MVP limitation; (2) no double-submit guard on queue row actions, mitigated by the backend's own stage guard; (3) a `GovernanceStep` component duplicated from `TicketDetail` instead of shared; (4) unformatted raw timestamps. Backend RBAC enforcement for `IT_STAFF`/`IT_MANAGER` remains UI-only/client-side, consistent with the pre-existing project-wide MVP decision (not a gap specific to this feature).
**Remaining Work:** Deliverable-chain re-sync to reflect the frontend now existing (became PR #75). The 3 separate queue pages' navigation/IA (3 top-level nav items for one workflow) was later identified as a UX problem and consolidated in PR #76.
**Next Step:** Sync `RAISE-TEST-CASES.md`/`RAISE-TRACEABILITY-MATRIX.md` to remove the "backend/API-level scope only, no frontend UI yet" caveat now that the frontend shipped and was live-verified (became PR #75, `CHECKPOINT-2026-09-03-001`).

---

## CHECKPOINT-2026-09-03-001

**Phase:** Phase 1 — Foundation (deliverable chain sync) / Phase 3 — Asset Management (`RAISE-FR-OPS-002`)
**Feature:** IT Hardware Assignment Approval Workflow — deliverable chain sync
**Task:** Update `RAISE-TEST-CASES.md` and `RAISE-TRACEABILITY-MATRIX.md` now that PR #74 shipped the frontend and it was live-verified through the real UI

**What was implemented:** N/A — documentation-only, no code/behavior change.
**What was modified:** `docs/06-test-cases/RAISE-TEST-CASES.md` (v0.15 → v0.16) and `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md` (v1.7 → v1.8) — removed the "backend/API-level scope only, no frontend UI yet" caveat on `TC-OPS-002-04..09`/`RAISE-FR-OPS-002`, since PR #74's frontend shipped and was live-verified end-to-end against the real running Docker stack through the actual UI (not just API calls).
**What was fixed:** None.
**What was added:** None.
**What was removed:** The now-stale "no frontend UI yet" caveat text.

**Files changed:** 2 (`docs/06-test-cases/RAISE-TEST-CASES.md`, `docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md`) — +365/-148.
**Database changes:** None. **API changes:** None. **Frontend changes:** None.

**Tests:** N/A — documentation-only change.
**Validation:** N/A — documentation-only change (all four fields).

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002` (§16 Resolved Question 43)
Design: Unchanged
Acceptance Criteria: `AC-OPS-002-04`..`-09` unchanged (already correct as of PR #72)
Test Case: `TC-OPS-002-04`..`-09`, `RAISE-TEST-CASES.md` v0.16 — full-stack scope now recorded (was backend/API-only)

**Git:**
Branch: `docs/it-hardware-handover-frontend-closeout` (deleted after merge)
Commit: `3ccfc62` (feature commit), merged to `main` via [PR #75](https://github.com/boonthepkstl-alt/stl_asset_service/pull/75) (merge commit `b886de6`), 2026-09-03 (00:55 UTC / 09:55+07:00 local).

**Known Issues:** Still-open items explicitly preserved as unresolved by this PR (not decided or silently dropped): backend RBAC enforcement, Stage 2 e-signature, Stage 2 recipient-decline path, name-string-based recipient matching. This PR itself was also never given its own `DEVELOPMENT-LOG.md` row/checkpoint at the time — the same gap as PR #73, closed retroactively in this same close-out pass.
**Remaining Work:** None for the deliverable-chain sync itself. The 3-page navigation/IA problem (identified by the user reviewing a sidebar screenshot) was the next follow-up (became PR #76).
**Next Step:** Consolidate the 3 handover nav items into one page, per direct user feedback (became PR #76, `CHECKPOINT-2026-09-03-002`).

---

## CHECKPOINT-2026-09-03-002

**Phase:** Phase 3 — Asset Management (`RAISE-FR-OPS-002`) — cross-cutting navigation/IA
**Feature:** IT Hardware Assignment Approval Workflow — navigation consolidation
**Task:** User-requested IA refactor after reviewing a sidebar screenshot: collapse 3 separate top-level nav items (one per workflow stage/actor) into 1

**What was implemented:** One new page `frontend/src/pages/Handovers/index.tsx` with role-aware tabs — "My Pending" visible to everyone, "IT Processing" visible to `IT_STAFF`/`ADMIN`, "Supervisor Approval" visible to `IT_MANAGER`/`ADMIN` — default active tab matching the signed-in user's primary role. Follows this codebase's own established precedent: "IT Requisition & Maintenance" (the Ticket/Maintenance domain) is also a multi-stage, multi-actor workflow, but is a single nav item/page, not one per stage — the same pattern applied here.
**What was modified:** `ROUTES.MY_PENDING_ASSIGNMENTS`/`ROUTES.IT_PROCESSING_QUEUE`/`ROUTES.IT_SUPERVISOR_APPROVAL_QUEUE` collapsed into one `ROUTES.HANDOVERS = '/handovers'` (`config/constants.ts`); `HANDOVER_DETAIL` route unchanged. 3 nav items collapsed into one "Asset Handovers" nav item in `config/navigation.ts`, positioned next to "IT Requisition & Maintenance" in the Assets group. `HandoverDetail`'s hardcoded back-references updated from the old `my-pending-assignments` id/path to the new `handovers` one (`frontend/src/pages/HandoverDetail/index.tsx`). `frontend/src/services/handover-service.ts` (minor). `App.tsx` (route wiring). `App.rbac.test.tsx` — removed 3 route-level role-gating tests since role-gating is now a page-level tab-visibility concern, added a test confirming `/handovers` is reachable by every authenticated role.
**What was fixed:** None (UX/IA refactor, not a bug fix).
**What was added:** `frontend/src/pages/Handovers/index.tsx`, `frontend/src/pages/Handovers/index.test.tsx`.
**What was removed:** `frontend/src/pages/MyPendingAssignments/`, `frontend/src/pages/ITProcessingQueue/`, `frontend/src/pages/ITSupervisorApprovalQueue/` (all 3 page folders, including their test files) — fully replaced by the one consolidated page above.

**Files changed:** 14 (`+586/-561`) — `frontend/src/App.rbac.test.tsx`, `frontend/src/App.tsx`, `frontend/src/config/constants.ts`, `frontend/src/config/navigation.ts`, `frontend/src/pages/HandoverDetail/index.tsx`, `frontend/src/pages/Handovers/{index.tsx,index.test.tsx}` (new), `frontend/src/pages/ITProcessingQueue/{index.tsx,index.test.tsx}` (deleted), `frontend/src/pages/ITSupervisorApprovalQueue/{index.tsx,index.test.tsx}` (deleted), `frontend/src/pages/MyPendingAssignments/{index.tsx,index.test.tsx}` (deleted), `frontend/src/services/handover-service.ts`.
**Database changes:** None. **API changes:** None (frontend-only IA refactor). **Frontend changes:** See above — sidebar now shows exactly one "Asset Handovers" entry instead of 3.

**Tests:**
- Unit Test: None new beyond the consolidated page's own suite
- Integration Test: `Handovers/index.test.tsx` (new, 17 tests covering all 3 tabs' visibility/default-tab/row-action behavior across roles); `App.rbac.test.tsx` updated (3 route-level tests removed, 1 new `/handovers`-reachable-by-every-role test added, net +9 tests / -2 files vs. pre-consolidation)
- E2E Test: None automated — live-verified manually (see Validation)

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings) — re-confirmed this close-out (`npm run lint`, exit 0)
- Test: Pass — 45 test files / 205 tests passing — re-confirmed this close-out (`npm run test -- --run`, exit 0, matches the PR's own reported count exactly)
- Type Check: Pass — re-confirmed this close-out (`npx tsc --noEmit`, exit 0)
- Live E2E (real running Docker stack): sidebar now shows exactly one "Asset Handovers" entry; tabs switch correctly with per-tab counts.

**Requirement Traceability:**
PRD: `RAISE-FR-OPS-002` (§16 Resolved Question 43) — IA/navigation change only, no requirement content change.
Design: N/A — this is a UI/IA decision, not a logical-architecture change; no `RAISE-DESIGN.md` update required.
Acceptance Criteria: Unaffected — `AC-OPS-002-04..09` describe workflow behavior, not nav structure.
Test Case: Unaffected in content; `TC-OPS-002-04..09` continue to PASS against the consolidated page (re-verified live, see Validation).

**Git:**
Branch: `frontend/consolidate-handover-nav-into-single-page` (deleted after merge)
Commit: `01c8517` (feature commit), merged to `main` via [PR #76](https://github.com/boonthepkstl-alt/stl_asset_service/pull/76) (merge commit `bf5b88d`), 2026-09-03 (06:42 UTC / 13:42+07:00 local).

**Known Issues:** Carried forward, unaffected by this IA-only change: (1)-(4) the 4 lower-severity PR #74 code-review findings (name-only recipient matching, no double-submit guard, duplicated `GovernanceStep`, unformatted timestamps); Stage 2 e-signature/acknowledgment capture undecided (user explicitly dismissed this question in the PR #72 session — must not be decided by any future session without new explicit instruction); Stage 2 recipient-decline path never asked, not implemented; Custody History write-timing across the 4 stages (`RAISE-DESIGN.md` §4.2 flags this as an open design point, F-10-adjacent); backend RBAC enforcement remains UI-only/client-side (explicit pre-existing MVP decision — not a gap to close).
**Remaining Work:** None unblocked by engineering — every buildable-now item for this feature (backend, frontend, and now IA) is shipped, tested, and live-verified. What remains is business/data decisions: the Blocking findings F-03–F-09/F-35, or F-10 (Custody History write-timing), none of which this feature's frontend work can resolve on its own.
**Next Step:** Not a further engineering task on this feature — check in with the user on which Blocking finding (F-03–F-09, F-35) or F-10 to resolve next, per `NEXT-STEP.md`'s standing recommendation pattern. Recalculate `NEXT-STEP.md` (stale since 2026-09-01, predates PR #67) as part of this same close-out pass.

---

## CHECKPOINT-2026-09-03-003

**Phase:** Phase 3 — Asset Management (Employee domain, supports `RAISE-FR-ASSET-003`)
**Feature:** Create Employee — form surface
**Task:** Convert "Add Employee" from a Modal on the Employees list into a full page at `/employees/create`, mirroring the then-existing `CreateAsset` 4-step wizard pattern

**What was implemented:** A new full-page `frontend/src/pages/CreateEmployee/index.tsx` with a 3-step flow (Basic Info → Organization & Location → Review), copying `CreateAsset`'s then-current pattern exactly: horizontal step indicator, one `SectionCard` per step, inline footer actions. New `ROUTES.EMPLOYEE_CREATE` (`config/constants.ts`) wired in `App.tsx`. Layout-only — **no new fields**.
**What was modified:** `frontend/src/pages/Employees/index.tsx` — the "Add Employee" button now navigates instead of opening a modal; `Employees/index.test.tsx` updated accordingly.
**What was fixed:** None (layout change, not a defect fix).
**What was added:** `frontend/src/pages/CreateEmployee/{index.tsx,index.test.tsx}`.
**What was removed:** The inline Add-Employee Modal from the Employees list page (−66 lines there).

**Scope decision worth recording (this is the substance of this PR, not the layout):** the user proposed a much larger Employee-form redesign — Employment Type, Cost Center/Business Unit, Emergency Contact, Personal Email, Alternate Phone, **Matrix Manager**, System Role, AD/SSO toggle, Profile Picture, and an auto-generate-ID button. Each was compared against the real `Employee` type and `RAISE-PRD.md` before any code was written. Result: several proposed "new" fields **already existed** (Reporting Manager, Location Campus, Physical Desk); the rest were **unconfirmed new scope** with no PRD backing; and **Matrix Manager directly contradicts an explicit prior business rejection** — the PRD records that a second manager/supervisor relationship on Employee was rejected during the Check-out workflow discussion. The user agreed to ship layout-only and defer the field set. No field was invented, and no recorded rejection was quietly reversed.

**Files changed:** 6 (`+279/-66`) — `frontend/src/App.tsx`, `frontend/src/config/constants.ts`, `frontend/src/pages/CreateEmployee/index.tsx` (new), `frontend/src/pages/CreateEmployee/index.test.tsx` (new), `frontend/src/pages/Employees/index.tsx`, `frontend/src/pages/Employees/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** See above — this is the change.

**Tests:**
- Unit Test: None new
- Integration Test: `CreateEmployee/index.test.tsx` (new); `Employees/index.test.tsx` (updated for navigation instead of modal)
- E2E Test: None automated — live-verified manually (see Validation)

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings)
- Test: Pass — 210 tests at merge time (was 205 at PR #76)
- Type Check: Pass (`tsc --noEmit` clean)
- Live E2E (real running Docker stack, through the actual UI): the Add Employee button navigates to the new page; all 3 steps advance and a real employee is created.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** `RAISE-PRD.md` contains **no `RAISE-FR-EMP-*` requirements at all** (re-verified by grep during this close-out); Employee appears only incidentally under `RAISE-FR-ASSET-003` (Custody History) and `RAISE-FR-OPS-002` (Check-in/Check-out), neither of which specifies an employee-creation form.
Design: N/A — UI layout decision, not a logical-architecture change.
Acceptance Criteria: N/A — no AC group covers Employee creation.
Test Case: N/A — no `TC-*` covers this screen; coverage is the new component test only.

**Git:**
Branch: `frontend/employee-create-full-page` (deleted after merge)
Commit: `e8c1c80` (feature commit), merged to `main` via [PR #78](https://github.com/boonthepkstl-alt/stl_asset_service/pull/78) (merge commit `1e9e246`), 2026-09-03 17:20+07:00.

**Status:** ✅ Complete for its confirmed scope (layout conversion only) — **but superseded four PRs later**: the wizard pattern this PR deliberately mirrored was itself removed in PR #82 (`CHECKPOINT-2026-09-03-007`) after the user questioned whether either Create form should be a wizard at all. See that checkpoint for the reversal reasoning; this is not unexplained churn.
**Known Issues:** None from this change.
**Remaining Work:** The deferred field-set proposal above remains undecided — none of it is scheduled, and Matrix Manager specifically must not be added without first reversing a recorded business rejection.
**Next Step:** Ship the one item from the deferred proposal that is buildable now without new scope — duplicate-checking on fields that already exist (became PR #79, `CHECKPOINT-2026-09-03-004`).

---

## CHECKPOINT-2026-09-03-004

**Phase:** Phase 3 — Asset Management (Employee domain)
**Feature:** Create Employee — form surface
**Task:** Add live duplicate-check validation for Work Email and Phone — the first buildable-now item from PR #78's deferred proposal

**What was implemented:** Duplicate detection on Create Employee for Work Email and Phone — checked on field blur and again on submit, blocking the form from advancing when a match is found against the existing employee list. Chosen deliberately as the first item from the deferred proposal because it is a **safeguard on fields that already exist**, not new scope requiring a PRD decision.
**What was modified:** `frontend/src/pages/EmployeeDetail/index.tsx` — the "Edit Identity" modal gained the same phone duplicate check, **excluding the employee being edited** (so saving an unchanged record isn't rejected by its own value). Email is not checked there because that modal has no email field.
**What was fixed:** None (a validation gap with no prior behavior, not a regression).
**What was added:** 80 lines of new test coverage in `CreateEmployee/index.test.tsx`.
**What was removed:** None.

**Files changed:** 3 (`+161/-3`) — `frontend/src/pages/CreateEmployee/index.tsx`, `frontend/src/pages/CreateEmployee/index.test.tsx`, `frontend/src/pages/EmployeeDetail/index.tsx`.
**Database changes:** None. **API changes:** None — the check runs client-side against the loaded employee list; there is no server-side uniqueness constraint behind it. **Frontend changes:** See above.

**Tests:**
- Unit Test: None new
- Integration Test: `CreateEmployee/index.test.tsx` extended (duplicate email blocks, duplicate phone blocks, unique values pass)
- E2E Test: None automated — live-verified manually

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings)
- Test: Pass — 215 tests at merge time (was 210)
- Type Check: Pass
- Live E2E (real running Docker stack, through the actual UI): entering an existing employee's email/phone blocks the step; a unique value clears the error on blur.

**Requirement Traceability:**
PRD: **N/A — no governing FR** (no `RAISE-FR-EMP-*` exists; see `CHECKPOINT-2026-09-03-003`).
Design: N/A. Acceptance Criteria: N/A. Test Case: N/A — component tests only.

**Git:**
Branch: `frontend/employee-duplicate-email-phone-check` (deleted after merge)
Commit: `2c9c343`, merged to `main` via [PR #79](https://github.com/boonthepkstl-alt/stl_asset_service/pull/79) (merge commit `c774b08`), 2026-09-03 17:33+07:00.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** Uniqueness is enforced **client-side only** — the backend has no unique constraint on employee email or phone, so a concurrent create through the API can still produce a duplicate. Consistent with this app's existing MVP validation posture, but a real limitation, not a solved problem.
**Remaining Work:** None for this item.
**Next Step:** Add the optional Employee Code field, mirroring `CreateAsset`'s existing optional Asset Code pattern (became PR #80, `CHECKPOINT-2026-09-03-005`).

---

## CHECKPOINT-2026-09-03-005

**Phase:** Phase 3 — Asset Management (Employee domain)
**Feature:** Create Employee — Employee Code field
**Task:** Add an optional "Employee Code" field, mirroring `CreateAsset`'s optional Asset Code field ("leave blank for auto-generation")

**What was implemented:** An optional Employee Code input on Create Employee with the same helper text and the same duplicate-check pattern already established in PR #79. `types/employee.ts` and `services/employee-repository.ts` carry the field through.
**What was modified:** See below — the backend half.
**What was fixed:** **A real backend parity gap, found while implementing and fixed in the same PR.** `AssetService.CreateAsset` already accepted an optional client-supplied code and fell back to auto-generation only when it was empty; `EmployeeService.CreateEmployee` **always overwrote the input with a generated code regardless of what was sent**. Without this fix the new frontend field would have been purely cosmetic — a user's typed code silently discarded by the server. Fixed by mirroring the asset pattern in `go-template-main/model/employeeModel.go` (request field) and `go-template-main/service/employeeService.go` (`code := input.EmployeeCode; if code == "" { code = fmt.Sprintf("EMP-%s", id[:8]) }`). `gofmt` then had to be run on both files — the edit had left them unformatted.
**What was added:** 56 lines of new test coverage in `CreateEmployee/index.test.tsx`.
**What was removed:** None.

**Files changed:** 6 (`+89/-2`) — `frontend/src/pages/CreateEmployee/index.tsx`, `frontend/src/pages/CreateEmployee/index.test.tsx`, `frontend/src/services/employee-repository.ts`, `frontend/src/types/employee.ts`, `go-template-main/model/employeeModel.go`, `go-template-main/service/employeeService.go`.
**Database changes:** None (the `employee_code` column already existed). **API changes:** `POST /employees` now honours a client-supplied `employeeCode` instead of ignoring it — a behaviour change on an existing endpoint, no new endpoint. **Frontend changes:** See above.

**Tests:**
- Unit Test: Backend — the existing `service/employeeService_test.go` suite still passes; **no new Go test was added** for the honour-supplied-code path
- Integration Test: `CreateEmployee/index.test.tsx` extended (optional code accepted, blank allowed, duplicate blocked)
- E2E Test: None automated — live-verified manually

**Validation:**
- Build: Pass (`go build ./...` and frontend build)
- Lint: Pass (0 warnings); `gofmt` clean on both touched Go files
- Test: Pass — 218 frontend tests at merge time (was 215); `go test ./...` clean
- Type Check: Pass
- Live E2E (real running Docker stack, through the actual UI): a typed Employee Code survives the round-trip to Postgres; a blank one still auto-generates.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** The backend parity fix likewise traces to no requirement — it was found by comparing two sibling services, not by testing against an AC.
Design: N/A. Acceptance Criteria: N/A. Test Case: N/A.

**Git:**
Branch: `feature/employee-code-optional-field` (deleted after merge)
Commit: `995b330`, merged to `main` via [PR #80](https://github.com/boonthepkstl-alt/stl_asset_service/pull/80) (merge commit `ba79456`), 2026-09-03 20:42+07:00.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** No Go unit test covers the newly-honoured client-supplied-code path — verified live against the real stack, but not guarded by an automated backend regression test. Employee-code uniqueness, like email/phone, remains client-side only (no DB unique constraint).
**Remaining Work:** None for this item.
**Next Step:** The auto-generated fallback here emits `EMP-<8 hex chars>`, which is **not** the company's real Employee ID convention — ask the business what that convention actually is before doing anything further with this field (became PR #81, `CHECKPOINT-2026-09-03-006`).

---

## CHECKPOINT-2026-09-03-006

**Phase:** Phase 3 — Asset Management (Employee domain)
**Feature:** Create Employee — Employee ID format
**Task:** Validate Employee Code against the company's real Employee ID convention, newly confirmed by the business

**Business confirmation (2026-09-03, direct Q&A with the user) — the substance of this PR:** the company's real Employee ID is **exactly 8 digits, where the first 2 digits are the Gregorian join year** (e.g. `26725898` = joined 2026). The remaining **6 digits are issued by HR/payroll — RAISE cannot derive or generate them**. The confirmed scope is therefore explicitly **validate the format on input only, deliberately NOT auto-generate it**. Recorded as new finding **F-36** in [`OPEN-FINDINGS.md`](OPEN-FINDINGS.md) — the direct sibling of **F-35** (asset code generation scheme).

**What was implemented:** `checkEmployeeCodeFormat` in `frontend/src/pages/CreateEmployee/index.tsx` — rejects anything that is not exactly 8 digits, on blur and on submit. Format is checked **before** uniqueness (`checkEmployeeCodeFormat(...) ?? checkEmployeeCodeDuplicate(...)`), since a duplicate check on a malformed value is useless. Help text states the rule: "8 digits, first 2 = join year (e.g. 26725898). Leave blank for auto-generation."
**What was modified:** Two existing tests used non-conforming codes and were updated. The duplicate-code test had to **change shape**, not merely change its literal: the seeded fixtures use the legacy `EMP-####` form, which the new format check now rejects outright, so that test can no longer reach the duplicate branch via a seeded value.
**What was fixed:** None (new validation, not a regression).
**What was added:** See above. **What was removed:** None.

**Files changed:** 2 (`+59/-12`) — `frontend/src/pages/CreateEmployee/index.tsx`, `frontend/src/pages/CreateEmployee/index.test.tsx`.
**Database changes:** None. **API changes:** None — validation is client-side; the backend accepts any non-empty string. **Frontend changes:** See above.

**Tests:**
- Unit Test: None new
- Integration Test: `CreateEmployee/index.test.tsx` — format-rejection cases added, 2 existing cases updated, the duplicate-code case restructured
- E2E Test: None automated — live-verified manually

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings)
- Test: Pass — 219 tests at merge time (was 218)
- Type Check: Pass
- Live E2E (real running Docker stack, through the actual UI): a 7-digit or alphanumeric code is rejected on blur with the format message; `26725898` is accepted.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** This is a newly-confirmed business rule with no `RAISE-FR-*` ID to trace to; it is recorded in `OPEN-FINDINGS.md` as F-36 rather than written into a requirement this session had no authority to create.
Design: N/A. Acceptance Criteria: N/A. Test Case: N/A.

**Git:**
Branch: `feature/employee-id-format-validation` (deleted after merge)
Commit: `a970143`, merged to `main` via [PR #81](https://github.com/boonthepkstl-alt/stl_asset_service/pull/81) (merge commit `b26ff11`), 2026-09-03 20:53+07:00.

**Status:** 🟡 **Partial** — the *confirmed* scope (validate-on-input) is fully shipped and verified, but the application now **enforces a format its own data does not follow**: `employeeService.go`'s auto-generation still emits `EMP-<8 hex>`, and the frontend seed fixtures still use `EMP-####` — both are rejected by the check this PR added. Marking this ✅ would hide a live internal contradiction, so per Rule 14 it stays 🟡.
**Known Issues:** As above — auto-generated and seeded Employee Codes do not conform to the confirmed 8-digit convention. Fixing that needs a rule for the HR-issued 6-digit portion, which RAISE does not own. Tracked as the open half of **F-36**.
**Remaining Work:** Decide (with HR) whether seed fixtures and the auto-generation fallback should switch to a conforming form, or whether auto-generation should be removed outright on the grounds that RAISE cannot legitimately mint an HR-issued number.
**Next Step:** Not a further Employee-field task — the user's next input redirected to the shape of the Create forms themselves (became PR #82, `CHECKPOINT-2026-09-03-007`).

---

## CHECKPOINT-2026-09-03-007

**Phase:** Phase 3 — Asset Management — cross-cutting form IA
**Feature:** Create Asset / Create Employee — form structure
**Task:** User questioned whether the Create Asset wizard should be a wizard at all, and asked for analysis **before** any code. The analysis supported the instinct; both Create forms were then flattened to single-page.

**Analysis performed before writing code (recorded because it is what justified the reversal):** the real field counts were measured, not estimated — `CreateAsset` holds **13 fields total**, with step 2 (Financial) and step 3 (Assignment) holding **only 3 fields each**, far too thin to justify their own step.
**What was implemented:** `CreateAsset` flattened from 4 steps to 3 stacked `SectionCard`s; `CreateEmployee` flattened from 3 steps to 2. The action bar is now sticky to the viewport bottom. Validation became a **single pass on submit**, so every error surfaces at once instead of one step at a time.
**What was modified:** Both pages' test suites, rewritten for a single-page flow (no step navigation left to drive).
**What was fixed:** The Review step on both forms was dropped as redundant once every field is visible at once — and on Asset it was **actively misleading**, listing only 6 of the 13 fields, so a user reviewing it saw less than half of what they were about to submit.
**What was added:** None net. **What was removed:** Both step indicators, both Review steps, and the per-step validation machinery. **Net −137 lines.**

**Why this reverses PR #78 four PRs earlier — recorded explicitly so it does not read as unexplained churn:** `CreateEmployee` had been built to mirror the `CreateAsset` stepper only two days earlier (`CHECKPOINT-2026-09-03-003`). Flattening Asset alone would have re-introduced the exact inconsistency PR #78 existed to remove, so both were flattened in one PR. PR #78 was not wrong given what was known then — it correctly copied the pattern the codebase had; the *pattern itself* is what was later found unjustified, and only measuring the field counts showed that.

**Files changed:** 4 (`+261/-398`) — `frontend/src/pages/CreateAsset/{index.tsx,index.test.tsx}`, `frontend/src/pages/CreateEmployee/{index.tsx,index.test.tsx}`.
**Database changes:** None. **API changes:** None. **Frontend changes:** See above — this is the change.

**Tests:**
- Unit Test: None new
- Integration Test: `CreateAsset/index.test.tsx` and `CreateEmployee/index.test.tsx` both substantially rewritten for the single-page flow, including a case confirming all validation errors appear together on submit
- E2E Test: None automated — live-verified manually

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings)
- Test: Pass at merge time
- Type Check: Pass
- Live E2E (real running Docker stack, through the actual UI): both forms create real records in one pass; the sticky action bar stays reachable while scrolling; submitting an empty form surfaces every error simultaneously.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** No `RAISE-FR-*` acceptance criterion covers either Create form's structure; `RAISE-FR-ASSET-001` covers the registry, not the creation form's step count.
Design: N/A — UI/IA decision, not a logical-architecture change.
Acceptance Criteria: N/A. Test Case: N/A — no `TC-*` asserts a wizard, so nothing in the chain regressed.

**Git:**
Branch: `frontend/flatten-create-forms-single-page` (deleted after merge)
Commit: `1f75818`, merged to `main` via [PR #82](https://github.com/boonthepkstl-alt/stl_asset_service/pull/82) (merge commit `19d1a0b`), 2026-09-03 21:08+07:00.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** None from this change.
**Remaining Work:** None for this item.
**Next Step:** Continue the user's review of the app shell — the global "New Asset" button was the next item raised (became PR #83, `CHECKPOINT-2026-09-03-008`).

---

## CHECKPOINT-2026-09-03-008

**Phase:** Cross-cutting — app shell / navigation
**Feature:** App header
**Task:** Remove the "New Asset" button from the global app header

**What was implemented:** N/A — this is a removal.
**What was modified:** `frontend/src/App.route.test.tsx` tightened from `getAllByRole(...)[0]` to `getByRole` — the loosened form existed only to tolerate two identical buttons on screen, so tightening it now also **guards against the duplicate silently returning**.
**What was fixed:** The button rendered on **every** page (Employees, Settings, Licenses, Dashboard, …) despite doing one asset-specific thing, and duplicated the Assets page's own "New Asset" button on the one page where it was actually relevant.
**What was added:** None.
**What was removed:** The header button in `frontend/src/components/AppShell.tsx`, plus its now-unused `Plus` import. The Assets page's own button stays, as does the asset table's empty-state one — every path to creating an asset that made sense is preserved.

**Files changed:** 2 (`+4/-6`) — `frontend/src/App.route.test.tsx`, `frontend/src/components/AppShell.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** See above.

**Tests:**
- Unit Test: None new
- Integration Test: `App.route.test.tsx` tightened (now fails if a second "New Asset" button reappears)
- E2E Test: None automated — live-verified manually

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings) — the unused `Plus` import would have failed lint had it been left behind
- Test: Pass at merge time
- Type Check: Pass
- Live E2E (real running Docker stack, through the actual UI): the header no longer offers "New Asset" on non-asset pages; the Assets page still does.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** Design: N/A. Acceptance Criteria: N/A. Test Case: N/A — no test case asserted the header button's existence.

**Git:**
Branch: `frontend/remove-global-new-asset-button` (deleted after merge)
Commit: `b3c0cce`, merged to `main` via [PR #83](https://github.com/boonthepkstl-alt/stl_asset_service/pull/83) (merge commit `65b3799`), 2026-09-03 21:14+07:00.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** None.
**Remaining Work:** None.
**Next Step:** Continue the shell review — breadcrumbs were the next item raised (became PR #84, `CHECKPOINT-2026-09-03-009`).

---

## CHECKPOINT-2026-09-03-009

**Phase:** Cross-cutting — app shell / navigation
**Feature:** Breadcrumbs
**Task:** User asked for the breadcrumb root to read "Home" and be clickable, and for intermediate crumbs (e.g. "Employee Management") to link back

**What was implemented:** Non-last crumbs carrying an `href` now render as **navigating buttons**; the last crumb stays inert, since it is the page you are already on. `AppShell` now **owns the root crumb** and prepends `Home` (→ dashboard) itself. Navigation goes through the existing `onNavigate(id)` prop rather than importing react-router, keeping `AppShell` router-agnostic as originally designed.
**What was modified:** All **39 call sites across 19 page files** dropped their hardcoded `{ label: 'RAISE' }` root crumb, now that `AppShell` supplies it.
**What was fixed:** **A latent bug, not just a feature request.** The breadcrumb prop type has always been `{ label: string; href?: string }[]`, and roughly 9 pages were already passing real `href` values — but the rendering **ignored `href` entirely** and emitted a plain `<span>` for every crumb. Every one of those hrefs was dead code: the data was correct and had been for a long time; nothing ever read it. The user's request surfaced it.
**What was added:** None beyond the above. **What was removed:** 39 hardcoded root-crumb literals.

**Files changed:** 21 (`+70/-45`) — `frontend/src/components/AppShell.tsx` plus 20 page files (`AIDecisionCenter`, `Administration`, `Alerts`, `AssetDetail`, `Assets`, `CreateAsset`, `CreateEmployee`, `Dashboard`, `EmployeeDetail`, `Employees`, `HandoverDetail`, `Handovers`, `LicenseDetail`, `Licenses`, `Maintenance`, `RoleManagement`, `Settings`, `TicketDetail`, `UserManagement`, `_shared/ModulePage`).
**Database changes:** None. **API changes:** None. **Frontend changes:** See above.

**Tests:**
- Unit Test: None new
- Integration Test: Existing page suites cover the changed call sites; **no breadcrumb-specific suite was added**
- E2E Test: None automated — live-verified manually

**Validation:**
- Build: Pass
- Lint: Pass (0 warnings)
- Test: Pass — **46 test files / 221 tests**, re-confirmed during this close-out (`npx tsc --noEmit`, `npm run lint`, `npm run test` all exit 0)
- Type Check: Pass
- Live E2E (real running Docker stack, through the actual UI): "Home" appears as the first crumb on every page and navigates to the dashboard; "Employee Management" on Employee Detail navigates back to the list; the final crumb is not clickable.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** Design: N/A. Acceptance Criteria: N/A. Test Case: N/A — no test case covers breadcrumb behaviour, which is precisely why the dead-`href` bug survived undetected.

**Git:**
Branch: `frontend/clickable-breadcrumbs-home-root` (deleted after merge)
Commit: `e88c919`, merged to `main` via [PR #84](https://github.com/boonthepkstl-alt/stl_asset_service/pull/84) (merge commit `02d99cb`), 2026-09-03 21:28+07:00.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** Breadcrumb rendering still has **no automated test coverage** — the very gap that let ~9 pages carry dead `href` props unnoticed. The fix is live-verified but not regression-guarded.
**Remaining Work:** Add a focused `AppShell` breadcrumb test (root crumb present, intermediate crumbs navigate, last crumb inert) so this cannot silently regress again.
**Next Step:** See `CURRENT-STATUS.md` §4 — the recommended next task is resolving **F-36**'s open half (seed fixtures / auto-generation vs. the confirmed 8-digit convention), not a further shell refinement.

---

## CHECKPOINT-2026-09-03-010

**Phase:** Cross-cutting — app shell / navigation
**Feature:** Breadcrumbs
**Task:** Close the coverage gap `CHECKPOINT-2026-09-03-009` recorded as its own Remaining Work — add the regression test that would have caught PR #84's dead-`href` bug

**What was implemented:** `frontend/src/components/AppShell.breadcrumb.test.tsx` — 6 tests pinning the three rules PR #84's bug violated: the `Home` root crumb is prepended by `AppShell` and navigates to the dashboard; an intermediate crumb carrying an `href` renders as a navigating button and calls `onNavigate` with the **bare nav id** (not the `/`-prefixed path, since every call site implements `onNavigate` as `navigate('/' + id)`); the last crumb is never linked even when it carries an `href`. Two edge cases are also pinned: an intermediate crumb *without* an `href` stays plain text, and `Home` goes inert when the trail is empty (it is then itself the current page).
**What was modified:** `AppShell.tsx` — the breadcrumb `<nav>` gained `aria-label="Breadcrumb"`.
**What was fixed:** The missing landmark label was **not cosmetic**: the sidebar renders nav items with the same labels ("Employee Management", "Asset Management"), so an unscoped query matched both the sidebar and the breadcrumb. The label makes the trail addressable as a landmark so the tests can scope to it with `within(...)`, and it is the WAI-ARIA breadcrumb pattern's own requirement.
**What was added:** See above. **What was removed:** None.

**Files changed:** 2 (`+79/-2`) — `frontend/src/components/AppShell.breadcrumb.test.tsx` (new), `frontend/src/components/AppShell.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** One accessibility attribute; no behavioural change.

**Tests:**
- Unit Test: **6 new** (`AppShell.breadcrumb.test.tsx`)
- Integration Test: None new
- E2E Test: None — this PR *is* the automated replacement for PR #84's manual-only verification
- **Mutation-tested:** each new test was re-run against the original bug (breadcrumb rendering every crumb as a plain `<span>`) and confirmed to **fail**, so the suite genuinely guards the regression rather than merely passing alongside it

**Validation:**
- Build: Pass · Lint: Pass (0 warnings) · Type Check: Pass
- Test: Pass — **47 test files / 227 tests** (was 46/221), re-measured directly at merge commit `1122c9f` in an isolated `git worktree` during this close-out, not derived from arithmetic

**Requirement Traceability:**
PRD: **N/A — no governing FR.** Design: N/A. Acceptance Criteria: N/A. Test Case: N/A. Breadcrumb behaviour is not specified anywhere in the chain; these are engineering regression tests, not chain-traced test cases, and are deliberately **not** added to `RAISE-TEST-CASES.md`.

**Git:**
Branch: `frontend/breadcrumb-tests`
Commit: `c8ab4d2`, merged to `main` via [PR #86](https://github.com/boonthepkstl-alt/stl_asset_service/pull/86) (merge commit `1122c9f`), 2026-09-03 21:49+07:00.

**Status:** ✅ Complete for its confirmed scope — this closes `CHECKPOINT-2026-09-03-009`'s stated Remaining Work exactly as written.
**Known Issues:** None.
**Remaining Work:** None for breadcrumbs. The broader pattern this exposed — UI behaviour with no chain-level test case, so a prop can go dead unnoticed — is not itself resolved and still applies to other shell-level behaviour.
**Next Step:** See `CHECKPOINT-2026-09-04-001` (PR #87), which was taken up next at the user's direction.

---

## CHECKPOINT-2026-09-04-001

**Phase:** Phase 5 — Employee & custody surfaces (cross-cutting UI consistency)
**Feature:** Employee record editing
**Task:** User asked to make Employee Detail "a full page in the same style." Employee Detail **already was** a full page — investigation found the request's real target was the last record-editing form still living in a modal, and the user confirmed that reading before any code was written

**What was implemented:** `frontend/src/pages/EditEmployee/index.tsx` — the former "Edit Identity & Organization" modal as a full page at `ROUTES.EMPLOYEE_EDIT` (`/employees/:employeeId/edit`), mirroring `CreateEmployee`'s post-PR-#82 single-page layout: stacked `SectionCard`s, sticky bottom action bar (Cancel left → back to the detail page, Save Changes right), breadcrumb `Home / Employee Management / <name> / Edit`.
**What was modified:** `EmployeeDetail/index.tsx` shed `isEditProfileModalOpen`, 8 `edit*` state variables, the duplicate-check/save handlers and the `<Modal>` itself (**−118 lines**); both "Edit Identity" and "Modify Specs" now navigate. `test-utils.tsx`'s `renderWithProviders` gained an `extraRoutes` option. `App.tsx`/`constants.ts` registered the route.
**What was preserved deliberately:** **exactly** the modal's editable field set (Job Title, Phone, Status, Department, Location Campus, Physical Desk, Reporting Manager) and its `updateEmployee` payload — no field added, removed or renamed — and the phone duplicate check **including its exclude-self behaviour** from PR #79. The Assign Equipment and Create IT Requisition modals on the same page were left untouched.
**What was fixed:** A self-initiated code review (max effort, 8 finder angles) produced **9 findings; 7 were fixed in-PR** before merge, of which the substantive ones were: **(1)** audit rows were written into the shared fixture **even with `EMPLOYEE_API_ENABLED` on**, which would have put client-invented entries on the Audit tab that exist nowhere server-side and look identical to real ones — now gated to mock mode; **(2)** the phone duplicate check read `useEmployees`' empty array as "no duplicate found" while discarding that hook's `loading`/`error` flags, so a failed list request **silently disabled the validation entirely** — the check now distinguishes "ok" from "could not verify" and refuses to save on the latter; **(3)** the audit actor was hardcoded to `'Current Admin'` rather than the signed-in user, despite `services/audit-repository.ts` already establishing the convention for this; **(4)** two genuine test flakes reproduced during review — typing before the pre-fill `useEffect` had flushed (the save then persisted the *seeded* value; observed as `expected 'Desk S-999', got 'Desk S-204'`), and asserting the form's removal synchronously off the success toast when the toast and the route change commit independently; **(5)** the test file was **order-dependent** — `MockEmployeeRepository` is a module-level singleton, so the exclude-self test left `e1` renamed and the pre-fill test passed only by running first.
**What was removed:** The Edit Identity modal. With it, the modal→full-page conversion begun in PR #78 is complete: **no record-creation or record-editing form in the app is a modal any more.**

**Files changed:** 8 across two commits (`+415/-108`) — `pages/EditEmployee/index.tsx` + `index.test.tsx` (new), `pages/EmployeeDetail/index.tsx` + `index.test.tsx`, `config/constants.ts`, `App.tsx`, `test/test-utils.tsx`.
**Database changes:** None. **API changes:** None — the same `updateEmployee` payload the modal already sent. **Frontend changes:** See above.

**Tests:**
- Unit Test: **7 new** in `EditEmployee/index.test.tsx` (pre-fill, not-found, Cancel-discards, duplicate phone blocks, exclude-self allows, persist-and-navigate, **plus a new regression test for the unverifiable-phone path** added by the review)
- Integration Test: 1 new in `EmployeeDetail/index.test.tsx` — the Edit button routes to `/employees/e1/edit` instead of opening a dialog
- E2E Test: None automated — live-verified through the real UI
- **Order-independence verified:** three consecutive `--sequence.shuffle` runs of the `EditEmployee` file, all green, after adding snapshot/restore around the shared mock repository

**Validation:**
- Build: Pass · Lint: Pass (0 warnings) · Type Check: Pass
- Test: Pass — **48 test files / 235 tests** (was 47/227), re-run on merged `main` during this close-out
- Live E2E (Vite dev server, through the actual UI): pre-fill correct; save persists, toasts and returns to the detail page with the new value; Cancel discards; a phone matching **another** employee blocks; the employee's **own** phone does not falsely block; and after the fix the Audit tab's new row is attributed to **"Demo Admin"** (the signed-in user) with **no** spurious desk-location row alongside it

**Requirement Traceability:**
PRD: **N/A — no governing FR.** The PRD has **no `RAISE-FR-EMP-*` requirement at all**, the same gap already recorded against PRs #78–#82. Design: N/A. Acceptance Criteria: N/A. Test Case: N/A. This is UI-consistency work on an existing capability, not a new chain-traced one — `RAISE-TEST-CASES.md` and `RAISE-TRACEABILITY-MATRIX.md` were correctly **not** touched.

**Git:**
Branch: `frontend/edit-employee-modal-to-full-page`
Commits: `82db72c` (conversion), `489250a` (review fixes), merged to `main` via [PR #87](https://github.com/boonthepkstl-alt/stl_asset_service/pull/87) (merge commit `152a394`), 2026-09-04 08:35+07:00.

**Status:** ✅ Complete for its confirmed scope — the conversion is functionally verified end-to-end, and no acceptance criterion is being claimed, because none governs this work.
**Known Issues:** Two findings from the same review were **deliberately not fixed**, and are now tracked rather than left in conversation:
- **F-38** (deferred technical debt) — Employee audit entries have no backend; `EditEmployee` records them by mutating the module-level `employeeAuditLogs` fixture, and `EmployeeDetail:71` aliases that same array as state, so its `useMemo` can never recompute from a write. Harmless today (writes happen while the page is unmounted) and correct as demo scaffolding; the fix is a real audit endpoint, not hardening the shim.
- **F-39** (product decision required) — Employee Detail's "Modify Specs" button routes to a page with **no** workstation/OS spec fields. Pre-existing (the modal had the same defect) but costlier now that it is a full route change. The two options — add spec fields, or remove the button — are both scope changes with no requirement to derive them from. **Not decided; do not pick one without asking.**

**Remaining Work:** None for the modal→full-page conversion itself; it is finished across all three forms (Create Asset, Create Employee, Edit Employee). What remains is F-38 and F-39 above, neither of which is this feature's own work.
**Next Step:** See `CURRENT-STATUS.md` §4. The recommended next task remains **F-36**'s open half (seed fixtures / backend auto-generation vs. the confirmed 8-digit Employee ID convention) — the same recommendation `CHECKPOINT-2026-09-03-009` made and which the last two sessions bypassed at the user's direction. It is the only buildable-now item whose blocking half is already answered; **F-39** is the natural alternative but needs a product answer first.

---

## CHECKPOINT-2026-09-04-002

**Phase:** Phase 1 — Foundation (continuous; infrastructure/process, not a product phase)
**Feature:** CI/CD pipeline
**Task:** Close **F-14** — neither stack had any automated build/test pipeline. Selected by a Next Work Discovery pass over the whole backlog as the **only** candidate buildable without a business or product decision

**Objective:** make the checks `SESSION-CLOSEOUT-PROTOCOL.md` step 3 requires every session to run by hand — "actually run them, don't assume they still pass because they passed last time" — into evidence attached to each PR. Before this, all 88 merged PRs were verified locally only, by hand, with multiple sessions working the same directory concurrently (`CLAUDE.md`) and no mechanism to catch a skipped check or a machine-specific failure.

**What was implemented:** `.github/workflows/ci.yml` — two parallel jobs on every `pull_request` and every `push` to `main`:
- **frontend** — `npm ci` → lint → `tsc --noEmit` → vitest → production build
- **backend** — `go build ./...` → `go vet ./...` → `go test ./...`

**What was added:** `TestCreateEmployee_EmployeeCode` in `go-template-main/service/employeeService_test.go`, closing the hole `DEVELOPMENT-LOG.md` recorded against PR #80 ("No Go unit test covers the newly-honoured path" — verified live only; confirmed still true, `TestCreateEmployee_RespectsSuppliedOptionalFields` never passed an `EmployeeCode` at all). Covers both branches: a supplied code survives verbatim, a blank one falls back to the generated `EMP-<8>` form — asserted **by shape**, so if F-36 is ever resolved by changing that fallback this test fails and forces the decision to surface rather than letting it slip through.
**What was fixed:** two flaky navigate-away assertions CI itself caught (see Findings discovered, below).

**Files changed:** 4 — `.github/workflows/ci.yml` (new), `go-template-main/service/employeeService_test.go`, `frontend/src/pages/CreateEmployee/index.test.tsx`, `frontend/src/pages/CreateAsset/index.test.tsx`.
**Database changes:** None. **API changes:** None. **Frontend changes:** test-only. **Backend changes:** test-only.

**Design decisions (each has a trap behind it, so they are recorded rather than left implicit):**
- **`gofmt` is deliberately not a gate.** No `.gitattributes` exists and Go sources are committed with **CRLF**, so `gofmt -l` lists every file in the module on a Linux runner. Confirmed with `gofmt -d` that the diff is line endings only, not a formatting defect. Gating on it would make CI red on arrival for a repo-wide storage condition. Normalising line endings is its own change.
- **No `paths` filter**, despite this repo merging many docs-only PRs (#73, #75, #77, #85, #88). A job skipped by a `paths` filter never reports a status, so enabling branch protection later with these as required checks would leave docs PRs permanently un-mergeable.
- **`if: '!cancelled()'` on every step**, so one run reports every failure instead of fix-push-wait.
- **Go version read from `go.mod`** (`go-version-file`), so the workflow cannot drift from the module's declared toolchain. Node pinned to 22 (LTS; Vite 6 + Vitest 2 support 18/20/22).
- **Actions pinned to current majors** (checkout/setup-node/setup-go v7, cache v6) — v4/v5 target Node 20 and annotated every run.

**Performance, measured rather than assumed:** the first run was 8m17s (frontend) + 1m31s (backend). Step timings showed `npm ci` alone was **7m02s cold and still 4m12s** with `setup-node`'s `cache: npm` warm — that option caches only npm's *download* cache, while `npm ci` deletes and rebuilds `node_modules` from scratch every run regardless, which is the actual cost. Caching the built tree instead (exact lockfile key, **no `restore-keys`**, since a partial match would give a `node_modules` not corresponding to the lockfile) and skipping the install on a hit brought the frontend job to **1m10s**, verified by re-running the same SHA and confirming `Install dependencies: skipped`.

**Validation:**
- **CI on `main` itself, not merely on the PR branch** — run `33843149477`, event `push`, `head_branch=main`, sha `103e069`: Backend green 1m15s, Frontend green 4m52s, **zero annotations**. (Frontend was slower than the PR branch's 1m10s because GitHub scopes caches per ref: `main`'s first run could not read the cache written on the PR branch. Later `main` runs will hit it.)
- Locally re-verified on merged `main` in the same pass: frontend `npx tsc --noEmit` clean, `npm run lint` clean (0 warnings), **48 test files / 235 tests passing**, `npm run build` clean; backend `go build ./...`, `go vet ./...`, `go test ./...` all clean.
- **Mutation-tested**, per the discipline set in `CHECKPOINT-2026-09-03-010`: reverting PR #80's fix makes `TestCreateEmployee_EmployeeCode` fail with `"EMP-10274830" should not contain "EMP-"`. The implementation was restored and the backend suite re-run clean afterwards.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** Design: `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6 records the absence of a pipeline as a gap (F-14), which is what this closes. Acceptance Criteria: N/A. Test Case: N/A. This is infrastructure/process work; the PRD does not scope CI/CD, and **no chain document was touched** — `RAISE-TRACEABILITY-MATRIX.md` stays at v1.8 with all 15 gaps closed, and this work neither adds nor removes coverage.

**Findings resolved:** **F-14** → Resolved (**R-20**) — but only on the evidence above that CI actually *runs green on `main`*, not merely that the workflow file exists. F-14's **image build/push half is explicitly left open**: CI validates source only; it does not build or publish the Docker images, and **F-13 (hosting) is untouched**.

**Findings discovered during validation:** **F-40** — flaky navigate-away assertions. On its fourth run, before merge, CI failed on `CreateEmployee/index.test.tsx:70` with `expect(element).not.toBeInTheDocument()` / `found <input id="name" value="Test Employee" />`. The test waited for the success toast and then asserted the form's unmount **synchronously**; the toast and the route change commit independently, so on a differently-scheduled machine the toast renders first. **The code under test was correct — the assertion was racing.** It had passed every local run and the three CI runs before it. Grepping for the same shape found `CreateAsset/index.test.tsx:81` with the identical defect. Both now wrap the removal in `waitFor`, matching the fix PR #87's review had already applied to `EditEmployee`. **This is the concrete demonstration that the pipeline provides real regression detection: it caught, before merge, a pre-existing flake that 88 PRs of local-only verification never surfaced.**

**Git:**
Branch: `ci/github-actions-build-test`
Commits: `4151613` (workflow + Go test), `43d638e` (pin actions past the Node 20 deprecation), `f73a673` (cache `node_modules`), `738d546` (bump `actions/cache`), `dd62694` (fix the two flakes CI caught) — merged to `main` via [PR #89](https://github.com/boonthepkstl-alt/stl_asset_service/pull/89), **merge commit `103e069`**, 2026-09-04 13:08+07:00.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** A stale 399 MiB Go cache written by `setup-go@v5` during the first run caused a recurring `Failed to restore: "/usr/bin/tar" failed with error: exit code 2` warning; it was deleted and a fresh v7-written cache does not reproduce it. Nothing outstanding from it. **F-40** stays recorded as a pattern to watch — all three known sites are fixed, but nothing prevents the shape being reintroduced and there is no lint rule for it.
**Remaining Work:** None for F-14's source-validation scope. Not attempted and not in scope here: image build/push, deployment (F-13), and CI for anything beyond the two stacks' own checks.
**Next Step:** See `CURRENT-STATUS.md` §4 and `NEXT-STEP.md`. The Next Work Discovery run in this same close-out found **no 🟢 buildable candidate remaining** — the "Buildable now" list is empty, and the next action is a business/product decision, not implementation.

---

## CHECKPOINT-2026-09-04-003

**Phase:** Phase 1 — Foundation (continuous; frontend engineering debt, not a product capability)
**Feature:** Frontend bundle / initial load
**Task:** Close **F-18** — route-level code splitting. Selected by the Next Work Discovery recorded in `NEXT-STEP.md` (2026-09-04 run) as the best remaining 🟢 candidate: the smallest self-contained task that invents no business rule

**Objective:** cut what a first-time visitor downloads before the app is usable. The production build emitted a **single 694 KiB JS chunk** containing all **27** routes — `React.lazy` was used **zero** times — so someone landing on `/login` fetched the Asset Registry, the AI Decision Center and every admin screen before seeing a password field. Vite warned about it on every build.

**What was implemented:** every authenticated page in `frontend/src/App.tsx` is now a `React.lazy` chunk behind a single `Suspense` boundary wrapping `<Routes>`. The pages use named exports, so each dynamic import is remapped to the default shape `React.lazy` requires. Vite splits on the dynamic import, so no `manualChunks` configuration was needed.
**What was deliberately not changed:** three components stay eager, each for a stated reason — `Login`, the entry point of every unauthenticated visit, where a lazy chunk would add a round-trip to the most common first paint; and `NotFound`/`Forbidden`, both small and both rendered as the destination of a catch-all or a redirect, where showing a loading fallback *before* an error page is worse than the bytes saved. The `Suspense` fallback is deliberately identical to `ProtectedRoute`'s existing auth-loading markup, so a cold chunk fetch and an auth check read as one wait rather than two different ones.
**What was added:** nothing beyond the above. **What was removed:** the 21 eager page imports.

**Files changed:** 1 (`+124/-59`) — `frontend/src/App.tsx`.
**Database changes:** None. **API changes:** None. **Backend changes:** None. **Frontend changes:** module-loading only — no component, route path, guard or rendered output changed.

**Results, measured on the production build rather than estimated:**

| | Before | After |
|---|---|---|
| Entry chunk | 694 KiB | **305 KiB** (312.5 kB, gzip 102 kB) — **−56%** |
| Chunks emitted | 1 | 80 |
| Total JS | 694 KiB | 789 KiB |
| Vite >500 kB warning | present | **gone** |

Total JS grows by ~95 KiB of chunking overhead. That is the honest trade and is recorded rather than omitted: the overhead is paid only for pages a user actually opens, while the initial load — which every user pays — drops by more than half.

**Tests:**
- Unit Test: none new
- Integration Test: none new
- **No test needed changing, and that was verified rather than assumed.** Lazy routes resolve asynchronously, which is exactly the timing class behind **F-40**, so the App-level suites were checked before the change: only `App.rbac.test.tsx` imports from `@/App`, and it takes `ProtectedRoute` with **stub elements**, not the real pages; the other seven `App.*.test.tsx` files build their own route trees from **direct page imports**, so `App.tsx`'s lazy wrappers never enter those paths.

**Validation:**
- Build: Pass (warning-free) · Lint: Pass (0 warnings) · Type Check: Pass
- Test: Pass — **48 test files / 235 tests**, unchanged from before this PR
- **CI on `main` itself:** run `33845187022`, event `push`, `head_branch=main`, sha `02ae966` — both jobs green
- Live E2E through the real UI: login lands on the dashboard, and `/assets`, `/employees`, `/handovers`, `/notifications` and `/settings` each render their real content — **no console errors, no failed requests**

**Requirement Traceability:**
PRD: **N/A — no governing FR.** Design: N/A. Acceptance Criteria: N/A. Test Case: N/A. This is engineering debt recorded as **F-18**; **performance targets themselves remain undefined (F-17)**, so this closes a self-identified build warning, **not** a stated NFR. No chain document was touched — `RAISE-TRACEABILITY-MATRIX.md` stays at v1.8 with all 15 gaps closed, and this work neither adds nor removes coverage.

**Findings resolved:** **F-18** → Resolved (**R-21**).
**Findings discovered during validation:** none.

**Git:**
Branch: `perf/route-level-code-splitting`
Commit: `6f92774`, merged to `main` via [PR #91](https://github.com/boonthepkstl-alt/stl_asset_service/pull/91) (merge commit `02ae966`), 2026-09-04.

**Status:** ✅ Complete for its confirmed scope.
**Known Issues:** None from this change. Two second-order notes, neither a defect: the `Suspense` fallback is a full-height "Loading..." panel, so a cold navigation briefly replaces the shell rather than showing an in-place skeleton — acceptable at this scale and not worth a design decision now; and because performance targets are undefined (**F-17**), there is no threshold this result can be declared to *meet*, only a warning it clears.
**Remaining Work:** None for F-18.
**Next Step:** **F-19** is the only 🟢 item left (46 `err.Error()` occurrences across 8 controllers leaking raw Go error strings into JSON responses), and it is low-urgency because no deployment exists (**F-13**). See `NEXT-STEP.md`: the project is **decision-limited, not engineering-limited** — the traceability matrix is closed at v1.8 and every non-`PASS` row in the Compliance Review waits on a business answer. **F-05** (alert trigger rules/channels) and **F-03** (NBV/Risk formulas) unlock more than every remaining buildable task combined.

---

## CHECKPOINT-2026-09-04-004

**Phase:** Phase 1 — Foundation (continuous; backend security hygiene, not a product capability)
**Feature:** Backend error responses
**Task:** Close **F-19** — raw Go error text in 5xx response bodies. The last 🟢 item in the backlog after F-14 (PR #89) and F-18 (PR #91)

**Objective:** stop 5xx responses handing internal detail to the caller. Eighteen handlers across 7 controllers put `err.Error()` straight into the JSON body beside a human-readable `message`; those errors originate in the database layer, so a response could carry driver text, SQL fragments, schema names or connection detail.

**What was implemented:** the `"error": err.Error()` field was removed from all **18** 5xx responses in `assetController`, `assetHandoverController`, `auditController`, `dashboardController`, `employeeController`, `sampleController` and `ticketController`. Each keeps its existing human-readable `message`. **0 5xx `err.Error()` sites remain** on `main`.
**What was added:** `controller/internalErrorLeak_test.go` — a source-level invariant test asserting no 5xx JSON body contains `err.Error()`.
**What was deliberately not changed:** the **28** 4xx sites. F-19's own wording scopes it to 5xx, and many 4xx bodies carry sentinel errors from the service layer (`ErrAssetNotITHardware`, `ErrHandoverWrongStage`, ...) whose text is meaningful, expected validation feedback — removing those would degrade the API rather than harden it.

**Files changed:** 8 (`+6/-19` in 7 controllers, plus the new test) — `go-template-main/controller/{asset,assetHandover,audit,dashboard,employee,sample,ticket}Controller.go` and `controller/internalErrorLeak_test.go`.
**Database changes:** None. **Frontend changes:** None. **API changes:** 5xx response bodies no longer include an `error` field — a response-shape change, verified safe (below).

**Why this was safe for the frontend, verified rather than assumed:** `frontend/src/types/api.ts` declares `APIError` with an `error` field, but **nothing in `frontend/src` reads it** — the `api-client.ts` response interceptor branches only on status 401. Confirmed by grep before the change.

**Validation:**
- Backend: `go build ./...`, `go vet ./...`, `go test ./...` all clean on merged `main`. `gofmt` clean on every changed file (checked on LF copies, since the repo stores Go sources with CRLF — the pre-existing repo-wide condition recorded against the CI work).
- Frontend (unchanged by this PR, re-run anyway): `tsc`/lint clean, **48 test files / 235 tests**.
- **CI on `main` itself:** run `33851908649`, event `push`, sha `449a751` — both jobs green.
- **Live E2E against the real Docker stack — the evidence this checkpoint rests on.** The database container was stopped to force a genuine 500 on `GET /api/assets`. Before this change that body would have carried `dial tcp: lookup db on 127.0.0.11:53: server misbehaving`; it now returns exactly `{"message":"Failed to retrieve assets"}`. The **server log still records the full error** (`[ERRO] [assetController.go] [ListAssets] ListAssets service error: dial tcp: ...`), so nothing was lost diagnostically. The happy path (200) was confirmed unaffected before and after, 4xx behaviour was confirmed unchanged, and the stack was restored and re-verified.
- Every one of the 18 sites was checked individually to confirm it already logged the error before responding — including the two that delegate to `mapHandoverError`, whose two callers both log first.
- **Mutation-tested**, per the discipline set in `CHECKPOINT-2026-09-03-010`: re-adding the field to `dashboardController` fails the new test with the exact file and line (`dashboardController.go:38 returns a http.StatusInternalServerError body containing the raw error text`). The implementation was restored and the suite re-run clean.

**Note on the guard's design:** the test checks source rather than HTTP responses, and says so in its own header comment. The existing controller harness needs live MSSQL/Postgres/Tarantool handles and a signed token before it can serve a request, so driving all 18 sites through real 500s would cost far more than the invariant is worth. The trade — it checks the code as written, not the bytes on the wire — is recorded rather than glossed. It also asserts it scanned **at least 15** sites, so it cannot pass vacuously if the controllers are later refactored behind a shared error helper.

**Requirement Traceability:**
PRD: **N/A — no governing FR.** Design: `RAISE-DETAILED-DESIGN.md` §7 records the leak, which is what this closes. Acceptance Criteria: N/A. Test Case: N/A. Security NFRs remain undefined (**F-17**), so this closes a recorded finding, **not** a stated NFR. No chain document was touched — `RAISE-TRACEABILITY-MATRIX.md` stays at v1.8, all 15 gaps closed.

**Findings resolved:** **F-19** → Resolved (**R-22**).

**Findings discovered during validation:** **F-41** — and it **partly contradicts the assumption this PR's own scoping rested on**, so it is recorded rather than quietly absorbed. The 5xx/4xx split was justified on the basis that 4xx bodies carry *sentinels*; live verification showed that is not uniformly true. `GET /api/assets/does-not-exist` returns `{"error":"sql: no rows in result set","message":"Asset not found"}` — a raw `database/sql` error in a 4xx body, where `message` already says everything the caller needs. **Deliberately not fixed here:** the 28 remaining 4xx sites mix genuine sentinels (whose text should stay) with wrapped driver errors (which should go), so it needs a per-site audit, not a sweep — widening this PR would have meant guessing which messages are load-bearing. Lower severity than F-19 was, since `sql: no rows` is far less sensitive than connection detail.

**Git:**
Branch: `fix/no-raw-errors-in-5xx-responses`
Commit: `0b1c191`, merged to `main` via [PR #93](https://github.com/boonthepkstl-alt/stl_asset_service/pull/93) (merge commit `449a751`), 2026-09-04.

**Status:** ✅ Complete for its confirmed scope — F-19's 5xx scope is fully closed and guarded. Not to be read as "error responses are now clean": **F-41 is open** on the 4xx half.
**Known Issues:** F-41 (above). Also worth stating plainly: no deployment exists yet (**F-13**), so this fix is preventative — it removes an exposure that had no public surface to leak through yet.
**Remaining Work:** None for F-19.
**Next Step:** **No 🟢 task remains.** F-14, F-18 and F-19 — every buildable item in the backlog — are now closed, and **all three advanced zero requirement coverage**, which is the backlog's shape rather than a selection failure. The traceability matrix is closed at v1.8 and every non-`PASS` row in the Compliance Review waits on a business answer. The next action is a decision, not implementation: **F-05** (alert trigger rules and channels) or **F-03** (NBV/Risk KPI formulas). F-41 is the only remaining engineering item and needs a per-site audit before it can be scoped.

---

## CHECKPOINT-2026-09-04-005

**Phase:** Phase 3 — Asset Management (requirements/spec work, not implementation)
**Feature:** Alerts (`RAISE-FR-ALERT-001`)
**Task:** Resolve **F-05** — alert trigger rules and severity — and propagate it through the full deliverable chain. F-05 was one of the two findings the three preceding close-outs each identified as unlocking more than the entire remaining 🟢 backlog combined

**Objective:** the shipped Alerts screen had exactly **one** trigger condition (expired warranty) and rendered severity as the literal string **"Not yet defined"**, because `RAISE-FR-ALERT-001`'s Acceptance Criteria said only "relevant conditions can trigger an alert" and had never been made concrete. That honesty was correct but not a destination.

**What was decided (business Q&A with the project owner, 2026-09-04):** exactly **five** MVP trigger conditions with a fixed 3-level severity assigned **per condition type**:

| Condition | Detection | Severity | Record |
|---|---|---|---|
| Warranty EXPIRED | `Asset.warrantyExpiry` in the past | **High** | Asset |
| Ticket OVERDUE | `targetResolutionDate` passed AND status ≠ `DONE` | **High** | Ticket |
| Warranty EXPIRING | inside the existing per-Asset-Category threshold (default 90 days) | **Medium** | Asset |
| Ticket ON_HOLD | ticket status is `ON_HOLD` | **Medium** | Ticket |
| Handover PENDING | non-terminal stage of the 4-stage IT Hardware workflow | **Low** | Handover |

**How the decision was obtained, which matters for its trustworthiness:** every option put to the user was grounded in a field that already exists in the built app — the candidate list was derived by reading `types/asset.ts`, `requisitionData.ts` and `lib/warranty.ts` first, so no option could have introduced a data-model change. The two alternative severity rules (derive from days-overdue; derive from asset value/criticality) were **explicitly offered and rejected** by the user, and the asset-criticality option was labelled as requiring a field that does not exist. **No business rule was invented at any point.**

**A correction to the finding's own premise, recorded rather than glossed:** F-05 was worded "trigger rules **and channels**". The channels half was **never actually open** — `RAISE-FR-ALERT-001`'s own Scope line already read *"MVP (single-channel; multi-channel is Roadmap)"*. Only stale "channels are TBD" wording was removed. The chain says so explicitly rather than implying the user made a channel decision they were never asked for.

**What was changed:** all seven chain documents, in order, each verified against the real file before the next was started:

| Document | Version | Change |
|---|---|---|
| `RAISE-PRD.md` | 0.14 → **0.15** | §16 Resolved Question 44; `RAISE-FR-ALERT-001` Acceptance Criteria/Dependencies/Open Question rewritten; §17 row `TBD (rules/channels)` → `APPROVED` |
| `RAISE-DESIGN.md` | 0.12 → **0.13** | §14 Alert Architecture: alerts are a **read-time derivation** over existing Asset/Ticket/Handover state — **no Alert entity, table or persisted record**, explicitly contrasted with Maintenance tickets, which do persist |
| `RAISE-PROTOTYPE.md` | 0.13 → **0.14** | P-012 rewritten: five conditions, real severities, three link targets (Asset Detail P-004 / Maintenance detail in P-009 / Assignment Approval detail in P-008) — no new screen invented |
| `RAISE-ACCEPTANCE-CRITERIA.md` | 0.11 → **0.12** | AC-ALERT-001 extended **2 → 10** criteria |
| `RAISE-TEST-PLAN.md` | 0.11 → **0.12** | TS-ALERT-001 blocked-item note "trigger rules TBD" → "Partial" |
| `RAISE-TEST-CASES.md` | 0.16 → **0.17** | 8 new cases TC-ALERT-001-03..10, **none marked PASS** |
| `RAISE-TRACEABILITY-MATRIX.md` | 1.8 → **1.9** | **Gap 16** and **Gap 17** opened, both left open |

**Database changes:** None. **API changes:** None. **Code changes:** **None — this checkpoint is specification only.**

**Validation:**
- Merged `main` at `ae56120` re-verified for real in this close-out: frontend `npx tsc --noEmit` clean, `npm run lint` clean (0 warnings), **48 test files / 235 tests passing**; backend `go build ./...`, `go vet ./...`, `go test ./...` all clean. CI green on the PR.
- Chain versions confirmed **on `main`**, read from the merged blobs rather than the working tree: PRD 0.15 · Design 0.13 · Prototype 0.14 · AC 0.12 · Test Plan 0.12 · Test Cases 0.17 · Matrix 1.9. `RAISE-FR-ALERT-001`'s §17 row confirmed `APPROVED`.
- Each chain layer was gate-checked before the next ran, per `run-full-chain`'s sequential rule — including a check that the 11 `NEEDS_PRD_CONFIRMATION` occurrences in `RAISE-DESIGN.md` were all historical change-log lines stating *no* signal was raised, not an unhandled signal that should have halted the pipeline.

**Requirement Traceability:** `RAISE-FR-ALERT-001` (P0/MVP). PRD §16 Resolved Question 44 → Design §14 → Prototype P-012 → AC-ALERT-001-01..10 → TS-ALERT-001 → TC-ALERT-001-01..10 → Matrix §3 row. This is the **first work in several sessions that advances requirement coverage at all** — F-14, F-18 and F-19 each advanced none.

**Findings resolved:** **F-05** → Resolved (**R-23**) — **specification only.**

**Two things deliberately NOT done, and they are the point of this checkpoint:**
1. **`RAISE-FR-ALERT-001` was NOT upgraded to a full `PASS`.** F-05 is resolved, but only one of the five conditions is actually built. The *reason* for the partial status changed — from "trigger rules undefined" to "rules defined, four of five conditions unimplemented" — it did not disappear. That build gap is **Gap 16**, opened and left open because the code does not exist yet. `TC-ALERT-001-01/-02` keep their genuine 2026-09-01 PASS; none of the 8 new cases claims one.
2. **The header bell-icon question was not decided.** `RAISE-PRD.md` §16 Resolved Question 35 lists `NotificationCenter.tsx` as confirmed entirely out of RAISE scope and *distinct from* this requirement, while `ESAPS-UI-FOUNDATION-BASELINE.md` line 88 maps it **to** this requirement as **EXTEND**. Recorded as **Gap 17**, an unreconciled contradiction; no side was picked.

**Git:**
Branch: `docs/alerts-f05-chain-sync`
Commit: `65de552`, merged to `main` via [PR #95](https://github.com/boonthepkstl-alt/stl_asset_service/pull/95) (merge commit `ae56120`), 2026-09-04.

**Status:** ✅ Complete for its confirmed scope — **the specification**. Explicitly **not** to be read as "Alerts is done": four of five conditions are unbuilt.
**Known Issues:** **Gap 16** (four conditions unimplemented) and **Gap 17** (bell-icon scope contradiction), both open by design. The "authorized user" access gate stays **NOT TESTABLE YET** (**F-08**), unaffected.
**Remaining Work:** Implement Gap 16 — the four unbuilt conditions plus real severity values on the Alerts screen, against AC-ALERT-001-03..10 and TC-ALERT-001-03..10.
**Next Step:** **Gap 16 implementation.** Unlike the previous three 🟢 items, this one **does** advance requirement coverage: it has 10 acceptance criteria and 8 written test cases waiting on it, and needs no further decision — the spec is complete and every rule is confirmed.

---

## Level 2 — Feature Checkpoints

### FEATURE-CHECKPOINT-project-tracking-governance

**Feature:** Project Tracking & Governance (the `docs/project-management/` layer itself — Timeline, Checkpoints, Changelog, Findings, Current Status, and this Close-Out Protocol)
**Maps to Phase(s):** Phase 1 — Foundation
**Maps to Requirement(s):** N/A — this feature is process tooling, not a PRD-traced product capability. Its "requirement" is the explicit instruction to make project state answerable from evidence, not AI memory.

**Task Checkpoints included:** CHECKPOINT-2026-08-24-004, -005, -006, -007, -008, -009 (six checkpoints, one PR each — see Level 1 above for each PR's individual detail)

**Progress Summary:** Introduced a single-file tracker, then split it into six focused files (`CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md`, `PROJECT-TIMELINE.md`, `PROJECT-CHECKPOINTS.md`, `CHANGELOG.md`, `OPEN-FINDINGS.md`), redesigned the timeline as a 10-phase capability roadmap, and rewrote the checkpoint file around a structured, evidence-grounded template with an explicit three-level model and a 14-step session close-out checklist.

**Acceptance Criteria Status:** N/A — no `RAISE-FR-*` AC group applies to internal process tooling. The functional bar for this feature is self-defined in `SESSION-CLOSEOUT-PROTOCOL.md` §3 ("How This Answers Follow-Up Questions") and has not yet been tested against a real follow-up question from a future session.

**Status:** 🚧 In Progress — the tooling exists but PR #18 (which contains the last three checkpoints, including this one) has not merged yet, and the protocol has not yet been exercised on a session it wasn't written by.

**Known Issues:** None structural. The protocol's effectiveness is unverified until reused.
**Remaining Work:** Merge PR #18. Exercise the protocol on the next real development task and confirm it produces answerable checkpoints without needing this session's memory.
**Next Recommended Task:** Start the QR / Barcode checkpoint (Phase 3 — Asset Management) and close it out using this protocol end-to-end, as the first real test.

---

## Level 3 — Phase Checkpoints

### PHASE-CHECKPOINT-1

**Phase:** Phase 1 — Foundation
**Feature Checkpoints included:** `FEATURE-CHECKPOINT-project-tracking-governance` (this phase also contains the original template-audit and requirements-chain-confirmation work from CHECKPOINT-2026-08-21-001 through -22-002 and -22-005, and the chain re-sync/technical-docs work from -22-002, -24-002, -24-005 — no separate Feature Checkpoint has been written for those yet; see Known Issues)

**Gate Criteria:** Per `PROJECT-TIMELINE.md`'s own Phase 1 definition — both company templates audited with a recorded KEEP/EXTEND/REFACTOR baseline, and the 7-stage requirements chain established. Gate would require: the chain no longer being Draft-status, and every open finding in `OPEN-FINDINGS.md` tagged as Foundation-scope (none currently are) being resolved.

**Gate Verdict:** 🔴 **NOT PASSED**

Reasons (per Rule 14 — not glossed over):
- `RAISE-PRD.md` is still **v0.9, "Draft for Requirement Review"** — not an approved baseline.
- `RAISE-DESIGN.md` (v0.8), `RAISE-PROTOTYPE.md` (v0.6), `RAISE-ACCEPTANCE-CRITERIA.md`/`RAISE-TEST-PLAN.md`/`RAISE-TEST-CASES.md`/`RAISE-TRACEABILITY-MATRIX.md` (all v0.5) are likewise still Draft.
- Finding **F-10** (`RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap) is an unresolved Foundation-level scope question, open since before this phase's own PRs began.
- This is the expected state for an MVP still under active requirements refinement, not a defect — but per Rule 14, "baseline established" (this checkpoint's own Progress Summary language) must not be read as "Gate passed."

**Known Issues:** No Feature Checkpoint yet exists for the original template-audit or requirements-chain work (CHECKPOINT-2026-08-21-001 through -22-002, -22-005) — only the most recent Project Tracking & Governance feature has one. Backfilling those is optional; they predate this protocol's own creation.
**Remaining Work:** Move the PRD and downstream chain from Draft to an approved baseline (a business decision, not an engineering task) before this phase can pass its gate; resolve Finding F-10.
**Next Recommended Task:** Not a Phase 1 task specifically — Phase 1 stays open-ended by design (see `PROJECT-TIMELINE.md`: "foundation work is continuous, not a fixed-end phase"). Recommended next work remains the Phase 3 QR/Barcode checkpoint, which does not depend on Phase 1's gate passing.

---

## Baseline Checkpoints

A Baseline Checkpoint (defined in
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md) §1a) is a
live re-scan of git and the actual source tree — not reconstructed from
prior history — recorded only at governance-establishment or
major-milestone moments, so later checkpoints have a verified zero point.

### BASELINE-CHECKPOINT-2026-08-24

**Established immediately after:** PR #20 merged (the Development Session
Close-Out Protocol became a binding `CLAUDE.md` rule).
**Purpose:** the first Baseline Checkpoint under the new protocol — verify
and record what genuinely exists right now, by direct inspection, not by
citing earlier checkpoints.

**Git state (scanned live):**
- HEAD: `a08e81b` — "Merge pull request #20 from boonthepkstl-alt/docs/claude-md-session-protocol-rule"
- Total commits: 49 · Merged PRs: 20 (#1–#20, all merged)
- Commit date range: 2026-08-21 → 2026-08-24
- Local `main` == `origin/main` (no divergence at scan time)
- No open PRs at scan time

**Backend (`go-template-main`) — scanned live:**
- Real domains: Asset Registry (+ Assign/Check-in), Employee, Maintenance/Ticket, Auth (demo-only)
- 50 `Test*` functions across `service/*_test.go`, `controller/*_test.go`, `middleware/*_test.go`
- SQL migrations present: `V0__Initial_Table.sql` (template demo, not RAISE), `V1__Assets_Table.sql`, `V2__Employees_Table.sql`, `V3__Tickets_Table.sql`
- `go build ./...` → **Pass** · `go vet ./...` → **Pass** · `go test ./...` → **Pass** (all packages)

**Frontend (`frontend/`) — scanned live:**
- 20 page folders under `src/pages/`, 19 service modules under `src/services/` (excluding `*.test.ts`)
- 36 test files, **127 tests passing**
- `npx tsc --noEmit` → **Pass** · `npm run lint` → **Pass** (0 warnings) · `npm run build` → **Pass** (main bundle ~634 kB / gzip ~175 kB — still over the 500 kB chunk-size advisory, Finding **F-18**, not blocking)

**Requirement Traceability:** Cross-checked against `RAISE-TRACEABILITY-MATRIX.md` v0.5 §3 at scan time — no change in BLOCKED/NOT_TESTED status since `CURRENT-STATUS.md` was last written; QR/Barcode (`RAISE-FR-OPS-001`) remains the only MVP requirement listed with no blocker.

**Open Findings at scan time:** F-01 through F-19 in `OPEN-FINDINGS.md`, none newly resolved or newly discovered by this scan.

**Verdict:** This baseline **confirms** — does not contradict — every fact already recorded in `CURRENT-STATUS.md`, `DEVELOPMENT-LOG.md`, and the Level 1-3 checkpoints above as of PR #20. No drift was found between the documented state and the actual repository state at scan time.

**Known Issues:** None newly found by this scan (see `OPEN-FINDINGS.md` for the standing list).
**Remaining Work:** None specific to establishing this baseline.
**Next Recommended Task:** QR / Barcode (`RAISE-FR-OPS-001`) — per `CURRENT-STATUS.md` §4 and `PHASE-CHECKPOINT-1`'s recommendation, unchanged by this scan.
