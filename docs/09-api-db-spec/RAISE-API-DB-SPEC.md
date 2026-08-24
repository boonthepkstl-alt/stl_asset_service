# RAISE — API Specification & Database Schema

**Document Status:** Draft for Review
**Scope note:** documents the **as-built** REST API and PostgreSQL schema
actually implemented in `go-template-main/` today. Not a numbered stage of
the deliverable chain — see
[`RAISE-HIGH-LEVEL-ARCHITECTURE.md`](../08-architecture/RAISE-HIGH-LEVEL-ARCHITECTURE.md) §6
for what's still undecided (API versioning, migration tooling, etc.). Every
endpoint/table below exists in the repository right now; nothing here is
proposed or planned — planned-but-not-built endpoints are listed separately
in §5.

Base URL: `{VITE_API_BASE_URL}` (default `http://localhost:8080/api`, unversioned).
Auth: `Authorization: Bearer <token>` header, required on every route below
except `POST /auth/login` and `GET /ping`.

---

## 1. Auth

### `POST /auth/login`
Request:
```json
{ "username": "admin", "password": "password" }
```
Response `200`:
```json
{
  "token": "<jwt>",
  "expiresAt": "2026-08-25T00:00:00Z",
  "user": { "id": "admin", "username": "admin", "fullName": "Template Admin", "role": "ADMIN" }
}
```
`401` on mismatch. **Demo-only**: credentials are hardcoded (`AUTH_DEMO_USERNAME`/`AUTH_DEMO_PASSWORD` env vars, default `admin`/`password`) — no user table exists. Real user store is confirmed Roadmap (PRD §16 Resolved Question 38).

### `POST /auth/logout`
No body. `200` on success (stateless — clears nothing server-side; frontend clears its own token).

---

## 2. Asset Registry (`RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-003` partial, `RAISE-FR-OPS-002` partial)

| Method | Path | Purpose |
|---|---|---|
| GET | `/assets?search=&status=&department=&page=&limit=` | List/filter |
| GET | `/assets/:id` | Get one (by internal id) |
| POST | `/assets` | Create |
| POST | `/assets/:id/assign` | Assign to an employee |
| POST | `/assets/:id/checkin` | Return to Available (clears assignment) |

**AssetModel** (wire shape, `model/assetModel.go`):
```
id, code, name, category, type, status, condition, location, department,
assignedTo?, assignedEmployeeId?, assignedDate?,
purchaseDate, purchaseCost, currentValue, warrantyExpiry, vendor,
serialNumber, specs: [{label, value}]
```
`status` ∈ `Available | Assigned | In Maintenance | Retired`.

`POST /assets` body (`CreateAssetRequest`): `name, code?, category, type, serialNumber, vendor?, purchaseCost, purchaseDate, warrantyExpiry?, department, location, condition`. Server generates `id` (UUID) and `code` (`AST-<8-char>`) if not supplied; `status` always starts `Available`, `currentValue` defaults to `purchaseCost`.

`POST /assets/:id/assign` body (`AssignAssetRequest`): `employeeId, employeeName, notes?`. Sets `status=Assigned`, stamps `assignedDate=today`.

`POST /assets/:id/checkin`: no body. Clears `assignedTo`/`assignedEmployeeId`/`assignedDate`, sets `status=Available`.

### Table `assets` (`sql/pg/V1__Assets_Table.sql`)
```sql
CREATE TABLE assets (
    id varchar(64) PRIMARY KEY,
    code varchar(50) NOT NULL UNIQUE,
    name varchar(200) NOT NULL,
    category varchar(100) NOT NULL,
    type varchar(100) NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'Available',
    condition varchar(30) NOT NULL,
    location varchar(200) NOT NULL,
    department varchar(200) NOT NULL,
    assigned_to varchar(200) NULL,
    assigned_employee_id varchar(64) NULL,
    assigned_date date NULL,
    purchase_date date NOT NULL,
    purchase_cost numeric(14,2) NOT NULL DEFAULT 0,
    current_value numeric(14,2) NOT NULL DEFAULT 0,
    warranty_expiry date NULL,
    vendor varchar(200) NULL,
    serial_number varchar(200) NOT NULL,
    specs jsonb NOT NULL DEFAULT '[]'
);
-- indexes: status, department
```
`assigned_employee_id` is a soft reference to `employees.id` — **no FK
constraint exists** (cross-domain reference kept loose, matching the
frontend's snapshot-not-join pattern; see §4 for the same choice on
`tickets`).

---

## 3. Employee (supports `RAISE-FR-ASSET-003`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/employees?search=&department=&location=&status=` | List/filter |
| GET | `/employees/:id` | Get one (by internal id or `employeeCode`) |
| POST | `/employees` | Create |
| PUT | `/employees/:id` | Partial update |

**EmployeeModel:**
```
id, employeeCode, name, email, phone, jobTitle, title, department,
departmentId, location, deskLocation, manager, managerId, status,
avatarColor, initials, startDate, workstationType, primaryOs, assignedCount
```

`PUT /employees/:id` body (`UpdateEmployeeRequest`) — every field is an
optional pointer so "not supplied" and "cleared to empty string" are
distinguishable, matching the frontend mock's `input.field ?? existing.field`
semantics exactly: `jobTitle?, department?, location?, deskLocation?, phone?, manager?, status?`.

### Table `employees` (`sql/pg/V2__Employees_Table.sql`)
```sql
CREATE TABLE employees (
    id varchar(64) PRIMARY KEY,
    employee_code varchar(50) NOT NULL UNIQUE,
    name varchar(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    phone varchar(50), job_title varchar(150), title varchar(150),
    department varchar(200) NOT NULL, department_id varchar(64),
    location varchar(200) NOT NULL, desk_location varchar(150),
    manager varchar(200), manager_id varchar(64),
    status varchar(30) NOT NULL DEFAULT 'Active',
    avatar_color varchar(50), initials varchar(5),
    start_date date NOT NULL,
    workstation_type varchar(150), primary_os varchar(150),
    assigned_count integer NOT NULL DEFAULT 0
);
-- indexes: department, status
```

---

## 4. Maintenance / Ticket (`RAISE-FR-MAINT-001`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/tickets?search=&status=&priority=&category=&department=&requesterName=` | List/filter |
| GET | `/tickets/:code` | Get one (by `ticketCode` or internal id) |
| POST | `/tickets` | Create (resolves `requesterId`/`assetId` server-side) |
| POST | `/tickets/:code/approval` | Dept Approval decision |
| POST | `/tickets/:code/dispatch` | IT Dispatch (assign technician) |
| POST | `/tickets/:code/status` | Technician execution status update |
| GET | `/technicians` | List technicians (static/seeded) |

`status` filter also accepts the synthetic value `ACTIVE`, meaning
`status IN ('PLANNING','IN_PROGRESS','ON_HOLD')`.

**TicketModel** (full nested shape — see `model/ticketModel.go` for every
field): `id, ticketCode, title, category, priority, slaTargetHours,
description, location, createdAt, status, requester{...}, asset{...},
departmentApproval{...}, itAssignment{...}, itExecution{...}, timeline[]`.

`POST /tickets` body: `requesterId, assetId, category, priority, title,
description?, location?`. Server resolves both ids against the Employee and
Asset domains, computes `slaTargetHours` from a fixed map
(`Critical:2, High:8, Medium:24, Low:48`), generates
`ticketCode = ITR-<year>-<seq>`, and starts `status=PENDING_DEPT_APPROVAL`.

`POST /tickets/:code/approval` body: `decision ('Approve'|'Reject'),
approverName?, isDelegated?, delegatedBy?, comments?`.

`POST /tickets/:code/dispatch` body: `technicianId, estimatedCost?,
targetResolutionDate?, notes?`.

`POST /tickets/:code/status` body: `status ('Planning'|'In-Progress'|
'On-Hold'|'Done'), holdCategory?, holdReason?, diagnosticNotes?,
resolutionNotes?, actualCost?, downtimeHours?, partsUsed?`.

**Not implemented** (deliberately, see `repository/ticketRepository.go`'s
doc comment — not part of the confirmed AC-MAINT-001-03..09 set):
`changeAsset`, `changeRequester`, `listDelegationSettings`.

### Table `tickets` (`sql/pg/V3__Tickets_Table.sql`)
```sql
CREATE TABLE tickets (
    id varchar(64) PRIMARY KEY,
    ticket_code varchar(50) NOT NULL UNIQUE,
    title varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    category varchar(100) NOT NULL,
    priority varchar(20) NOT NULL,
    department varchar(200),
    requester_name varchar(200),
    technician_name varchar(200),
    asset_name varchar(200),
    asset_code varchar(50),
    doc jsonb NOT NULL
);
-- indexes: status, department
```
**Storage shape is deliberately different from `assets`/`employees`**: the
entire `TicketModel` is stored as one JSONB document in `doc`, because a
ticket embeds point-in-time *snapshots* of the referenced Asset/Employee
(not live joins) — the handful of denormalized scalar columns
(`status`, `category`, `priority`, `department`, `requester_name`,
`technician_name`, `asset_name`, `asset_code`, `title`) exist purely so
`List()`'s `WHERE`/`ILIKE` filters don't have to parse JSON in SQL.

### Table `technicians`
```sql
CREATE TABLE technicians (
    id varchar(64) PRIMARY KEY,
    name varchar(200) NOT NULL,
    role varchar(150),
    specialty varchar(150),
    avatar_color varchar(50),
    initials varchar(5),
    active_tickets_count integer NOT NULL DEFAULT 0,
    completed_this_month integer NOT NULL DEFAULT 0
);
```
Seeded with the 4 fixture technicians from
`frontend/src/data/fixtures/requisitionData.ts`'s `initialTechnicians` — no
create/update endpoint exists (read-only, matching the frontend mock).

---

## 5. Template demo domain (not RAISE) and planned-but-not-built

- `GET/POST/PUT/DELETE /sample(s)*` and `GET /health` are the company Go
  template's own demo domain (`samplemodel` table, `V0__Initial_Table.sql`)
  — fans out across TT/PG/Oracle/MSSQL. **Not part of RAISE**, kept only as
  the template's reference wiring for `middleware.RequireRole`. Do not
  extend this domain for RAISE features.
- **Not yet built** (mock-only on the frontend, no endpoint exists):
  Warranty (beyond the `warrantyExpiry` field already on `assets`), QR/
  Barcode, License, Alerts, Audit Log, Oracle FA Integration, Executive
  Dashboard aggregation endpoints, Natural Language Search, Document
  Intelligence, User/Role management. See
  [`RAISE-PROJECT-TIMELINE.md`](../project-management/RAISE-PROJECT-TIMELINE.md)
  §3–§4 for which of these are buildable now vs. blocked on a PRD decision.

## 6. Error Response Shape

Every endpoint above returns, on error:
```json
{ "message": "human-readable summary", "error": "underlying detail (optional)" }
```
with HTTP status `400` (bad input / not-found-as-client-error for
`CreateTicket`'s employee/asset resolution), `404` (resource not found), or
`500` (unexpected). See
[`RAISE-DETAILED-DESIGN.md`](../10-detailed-design/RAISE-DETAILED-DESIGN.md) §5
for the sentinel-error-to-HTTP-status mapping per domain.
