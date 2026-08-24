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
reads as "forgot to check," `None` reads as "checked, nothing there").

---

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
**Next Step:** Retroactive conversion of all prior checkpoints into the `CHECKPOINT-<date>-<NNN>` template (this file, current state).
