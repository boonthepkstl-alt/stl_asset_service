# API Architecture

## Framework and routing

[Fiber v2](https://gofiber.io/) (`github.com/gofiber/fiber/v2`). All routes are grouped
under `/api` (`app.Group("/api")`), with a nested `protected` group applying
`middleware.JWTAuth()`. Route registration is entirely manual in
`router/sampleRouter.go` — there is no route-generation, no OpenAPI/Swagger annotation
processing, and no code generation.

## Actual route table (verified against `router/sampleRouter.go`, not just the README)

| Method | Path | Auth | Handler |
|---|---|---|---|
| GET | `/api/ping` | Public | inline closure in router (not `controller.Ping`) |
| POST | `/api/auth/login` | Public | `authCtrl.Login` |
| GET | `/api/health` | JWT required | `sampleCtrl.Health` |
| POST | `/api/auth/logout` | JWT required | `authCtrl.Logout` |
| POST | `/api/sample` | JWT required | `sampleCtrl.SampleControllerFunction` (legacy/demo placeholder) |
| POST | `/api/samples` | JWT required | `sampleCtrl.CreateSample` |
| GET | `/api/samples` | JWT required | `sampleCtrl.ListSamples` |
| GET | `/api/samples/:id` | JWT required | `sampleCtrl.GetSampleByID` |
| PUT | `/api/samples/:id` | JWT required | `sampleCtrl.UpdateSample` |
| DELETE | `/api/samples/:id` | JWT required | `sampleCtrl.DeleteSample` |

This matches the README's documented API shape exactly (the README is accurate here,
unlike `architecture.md`'s `DBManager` description).

## Versioning

**No versioning exists.** Routes are `/api/...`, not `/api/v1/...`. There is no mechanism
(header, path segment, or otherwise) for running two API versions side by side. If a real
project needs versioning, it must be introduced deliberately (most simply: change
`app.Group("/api")` to `app.Group("/api/v1")` **before** any client depends on the
unversioned path — retrofitting versioning after clients exist is a breaking migration).
Do not invent a versioning convention unilaterally; this is a decision for the team
adopting the template.

## Request parsing

`c.BodyParser(&input)` (JSON body → struct) and `c.QueryParser(&query)` (query string →
struct, used for pagination). No request-size limits beyond the global
`fiber.Config{BodyLimit: 50 * 1024 * 1024}` (50MB) set in `main.go`. No per-route body-size
override exists.

## Response shape

Two different conventions coexist:

1. **Direct entity/collection JSON** — `CreateSample`/`GetSampleByID` return the
   `model.SampleModel` (or `model.PaginatedResponse`) directly as the JSON body, no
   envelope.
2. **`fiber.Map` ad-hoc envelope** — most other responses use
   `fiber.Map{"status": ..., "message": ..., "error": ...}` shaped per-endpoint, not from
   a shared response-builder function. `AuthController.Login`/`Logout` use `{"status":
   "ok"/"error", ...}`; `SampleController` error paths use `{"message": ..., "error":
   ...}` **without** a `status` field. There is **no single error-response struct/type** —
   each handler builds its own `fiber.Map` literal. A real project should introduce one
   shared error-response type before this drifts further across a growing route table.

## Status codes

Standard and mostly correct: 200 (read/update/delete success), 201 (create), 400
(body-parse failure / missing required param), 401 (auth failure — both login and JWT
middleware), 404 (not found), 500 (unexpected repository/service error), 503 (health
check reports any DB unhealthy — via `controller.Health`'s own logic, not Fiber's
built-in error handling). No 403 path is currently reachable in practice since
`RequireRole` (which would return 403) is never wired to a route — see AUTH-RBAC.md.

## Error-body leakage

Several handlers put the raw `err.Error()` string into the JSON response
(`CreateSample`, `UpdateSample`, `DeleteSample`, `ListSamples` all do this on their
50x paths). For a `database/sql` driver error, this can include connection strings,
column names, or constraint names — see SECURITY-REVIEW.md for the severity call.

## Pagination / filtering / sorting

- **Pagination**: `page`/`limit` query params via `model.PaginationQuery`. Defaults
  (`page=1`, `limit=10`) and a hard cap (`limit ≤ 100`) are enforced in the **controller**
  (`ListSamples`), not the service or repository — worth knowing if a second entry point
  to listing is ever added, since the cap wouldn't automatically apply there.
- **Filtering**: none. `ListSomePGData`/etc. take only `page, limit` — no query-by-field
  support exists in any repository today.
- **Sorting**: fixed `ORDER BY id` (or `ORDER BY ID`) in every list query, not
  client-controllable.

## Validation

No request-body validation beyond what JSON unmarshaling itself enforces (type
mismatches → 400). No field-level rules (required/min-length/format) exist anywhere in
the controller or service layer for the sample domain.

## Document Status

Draft for Review — verified against `router/sampleRouter.go`, `controller/*.go`, and
`model/sampleModel.go`, 2026-08-21.
