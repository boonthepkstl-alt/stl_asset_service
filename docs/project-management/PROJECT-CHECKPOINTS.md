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
Commit: pending — predicted next PR after #56 (verify via `gh pr list` before treating as final).

**Known Issues:** None new.
**Remaining Work:** F-27, F-30, F-31, F-32, F-33, and `AC-WARRANTY-001-03`'s 90-day threshold remain open items blocked on a business/design decision — no engineering task is currently unblocked and buildable from these. F-22 is fully closed.
**Next Step:** Recalculate `NEXT-STEP.md`. With F-22 closed, check in with the user on direction for one of the five remaining open findings.

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
