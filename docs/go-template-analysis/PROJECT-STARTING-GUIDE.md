# Project Starting Guide

This describes **how to start a real project from this template**, and how the template
should support future domains (Asset, Employee, IT Requisition, Maintenance, Software
License, Audit, Reconciliation, AI). Nothing below has been implemented — this is
guidance only, per the audit's scope.

## Bootstrap steps (from the template's own README, verified accurate)

```bash
go mod edit -module singer/{module_name}
go mod tidy
```

This renames the module (currently `singer/go-template-new-2026-06`) and re-resolves
`go.sum`. **Every internal import path** (`singer/go-template-new-2026-06/...`, present in
every non-`main` package) must be updated to match — `go mod edit` does not rewrite
import statements automatically; a project-wide find/replace of the old module path is
required after renaming. This audit did not perform that rename (source modification is
out of scope).

Then create an `.env`/`app.env` file (none ships with the template) covering at minimum:
`SERVER_PORT`, `JWT_SECRET`, `JWT_EXPIRE_HOURS`, `CORS_ALLOW_ORIGINS`, and whichever
`DB_*_SERVER` groups are actually needed (leaving the others blank is safe — `main.go`
skips initializing any DB whose `*_SERVER` var is empty).

## What belongs in the Company Backend Foundation vs. a project's Business Domain

| Company Backend Foundation (keep, extend carefully) | Project Business Domain (build fresh) |
|---|---|
| HTTP server bootstrap, graceful shutdown (`main.go`) | Domain models (Asset, Employee, …) |
| Router wiring pattern (`router/`) | Domain-specific controllers/services/repositories |
| Middleware (JWT auth, recovery, tracing, and — once wired — RBAC/service-auth) | Domain-specific business rules/validation |
| Logging (`logger/`, `util/init.go`'s logrus+Logstash setup) | Domain-specific SQL/migrations |
| `DBManager` + PG/TT dual-pool machinery (`repository/dbManager.go`) | Any domain-specific caching/read-model needs |
| Repository **pattern** (facade + per-engine interface shape) | The actual per-domain repository implementations |
| Testing conventions (httptest-based integration style, host-guarded teardown) | Domain-specific test cases |
| Health-check plumbing | — |

**Explicitly do NOT treat as foundation-ready without further work first** (these are
foundation-shaped but currently incomplete):
- Authentication (demo-only — must be rewritten against a real user store before any
  domain depends on "who is logged in" for anything beyond a demo).
- RBAC enforcement (primitive exists, unwired — a real project must decide its role
  model and actually attach `RequireRole` to routes).
- Transaction usage (the mechanism exists, unexercised — the first domain with a
  multi-row write is also the first real test of `WithTransaction`).

## How to add a new domain (concrete steps, using the sample domain as the template)

1. **Model**: create `model/<domain>Model.go` with the domain struct(s) and per-engine
   SQL constants (or, once there are several domains, move SQL into
   `model/<domain>_sql.go` files rather than one big file — the current template's
   single-domain `model/sampleModel.go` scales fine at 1 domain, less so at 5+).
2. **Repository**: create `repository/<domain><Engine>Repository.go` per DB engine
   actually needed (not necessarily all four — most real domains will pick one primary
   store, following the sample's PG-as-primary convention, unless there's a specific
   reason for a facade across multiple engines). Decide up front: does this domain need
   PG/TT-style dual read/write pools, or is a single MSSQL/Oracle-style pool sufficient?
   That decision determines the constructor signature (package-level pool vs.
   `*DBManager` argument — see DATABASE-ARCHITECTURE.md).
3. **Facade** (only if multiple engines are genuinely needed for this domain): create
   `repository/<domain>Repository.go` following `sampleRepository.go`'s
   aggregation pattern.
4. **Service**: create `service/<domain>Service.go`. Keep it thin for CRUD; add real
   validation and, for any multi-row write, a transaction boundary via
   `DBManager.WithTransaction` (see SERVICE-PATTERN.md).
5. **Controller**: create `controller/<domain>Controller.go` following
   `sampleController.go`'s parse → call service → map to HTTP status/JSON shape. Use a
   **shared** error-response type rather than ad-hoc `fiber.Map` literals (recommended
   fix, not yet present in the template itself — see API-ARCHITECTURE.md).
6. **Router**: extend `router/sampleRouter.go` (or split into
   `router/<domain>Router.go` once the file grows unwieldy) with the same manual DI
   block shape, and register routes — remembering to attach `middleware.RequireRole(...)`
   if this domain needs role-gated endpoints, since it is not applied anywhere by
   default today.
7. **SQL/migrations**: add `sql/<engine>/Vn__<description>.sql`. Since no migration
   runner is wired up, also decide (as a project-level decision, not something to invent
   here) whether to introduce `golang-migrate`/`goose` now, or continue applying these by
   hand — the naming convention already looks migration-tool-ready if that choice is
   made later.
8. **Tests**: add controller-level integration tests following the existing pattern,
   plus (recommended, not currently modeled anywhere in the template) mocked
   service-level unit tests for any real business logic the new domain introduces.

## Frontend integration (Company React Template)

Expected integration boundary, based on what actually exists server-side today:

```
React
  ↓  fetch/axios, JSON over HTTPS
HTTP API            /api/...          (no version segment today — see API-ARCHITECTURE.md)
  ↓
Go Handler (controller/)   — expects Authorization: Bearer <jwt>  OR  stl_token cookie
  ↓
Service → Repository → DBManager → PostgreSQL/MSSQL/Oracle/Tarantool
```

- **Auth handoff**: `POST /api/auth/login` returns both a `Set-Cookie: stl_token=...`
  (HttpOnly) and the token/expiry in the JSON body. A React SPA served from a different
  origin than the API should rely on the **Authorization header** flow (store the token
  client-side, attach it manually) rather than the cookie, unless it's served same-site
  and `CORS_ALLOW_ORIGINS` is configured for credentialed cross-origin cookies.
- **Error model**: not yet a single shared shape (see API-ARCHITECTURE.md) — a frontend
  team should not assume every error response has the same fields until the backend
  standardizes this.
- **Pagination**: `?page=&limit=` query params, response includes
  `{data, total, page, limit, total_pages}` — this shape is consistent for the sample
  domain today and is a reasonable contract to keep for new domains.
- **Filtering/sorting**: not supported by any current endpoint; a frontend requiring
  either must wait for backend support to be built (see API-ARCHITECTURE.md).

## Document Status

Draft for Review — guidance only; no scaffolding was generated or applied during this
audit, 2026-08-21.
