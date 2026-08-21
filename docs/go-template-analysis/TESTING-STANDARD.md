# Testing Standard

## What exists today

A single test file: `controller/sampleController_test.go`. It is best described as
**integration-style HTTP tests through a real Fiber app**, not isolated unit tests:

```
Test (httptest request)
     ↓
fiber.App  (real router, real middleware chain minus JWTAuth in the test's own mini-router)
     ↓
Controller (real)
     ↓
Service (real)
     ↓
Repository (real, per-DB)
     ↓
Database (REAL, when configured — PostgreSQL/MSSQL/Oracle/Tarantool via env vars)
```

`TestMain` builds its **own** minimal router (not `router.SetupRoutes`) wiring the real
controllers/services/repositories directly, and generates one shared bearer token
(`util.GenerateToken`) used across all tests via a `newJSONRequest` helper that always
attaches `Authorization: Bearer <token>` — so **JWT validation itself is exercised only
implicitly** (a valid token always present), not tested for rejection paths beyond the
two explicit auth tests (`TestAuthLogin_Success`, `TestAuthLogin_InvalidCredentials`).

## Which layers are "tested" and how

| Layer | Coverage style | Mocked? |
|---|---|---|
| Controller | Exercised via real HTTP requests (`httptest.NewRequest` + `app.Test`) | No |
| Service | Exercised transitively through the controller tests; **one** test
  (`TestSampleServiceFunction_Success`) calls `service.NewSampleService` directly with a
  **stub** `handler.SampleHandler` (`stubSampleHandler`) | Partially — only the
  `handler.SampleHandler` dependency is stubbed; repositories are always real |
| Repository | Exercised transitively via controller tests, **and** directly in
  DB-specific tests (`TestPGRepository_CRUD`, `TestMSSQLRepository_CRUD`,
  `TestOracleRepository_CRUD`, `TestTarantoolRepository_CRUD`) that call repository
  constructors and methods directly | No — these are real-DB integration tests |
| Database | All CRUD tests run against **real, live databases** when `DB_*_SERVER` env
  vars are set; each DB-specific test guards itself with a `requireX(t)` helper that
  calls `t.Skip` if the corresponding pool never came up | N/A |

**Verified live**: running `go test ./...` in this environment (no `DB_*_SERVER` vars
set) produced `ok singer/go-template-new-2026-06/controller 1.714s` — meaning every
DB-dependent subtest self-skipped cleanly rather than failing, and the DB-independent
tests (ping, health, login success/failure, invalid-body 400s) passed.

## What is intentionally exercised (worth calling out as strengths)

- **Teardown is host-guarded**: `TestMain`'s teardown only runs `DELETE FROM samplemodel`
  when the configured host is `localhost`/`127.0.0.1`/`::1` — a real safeguard against a
  misconfigured `.env` accidentally wiping a shared/remote database during test runs.
- **Partial-failure path is tested**: `TestCallAllRepositories_PartialFailure` explicitly
  constructs a `DBManager` with `nil` MSSQL/Oracle connections and asserts the
  "errors" map is populated while PG-specific keys still succeed — a genuinely useful
  regression test for the fan-out pattern's error-collection behavior.
- **Pagination edge cases are covered**: default pagination, custom page/limit, the
  100-item cap, and invalid-page-defaults-to-1 are each their own test.

## What is missing (gaps to flag, not to silently work around)

1. **No true unit tests with mocked repositories/services.** There is no
   `//go:generate mockgen` setup, no hand-written mock implementing `SampleRepository`,
   and no test that exercises `sampleController`/`sampleService` logic (e.g. UUID
   generation on empty ID, `NOT_FOUND` → 404 mapping) **without** a live database. Every
   test that isn't pure ping/auth/pagination-math ultimately depends on a real DB
   connection to prove anything beyond "the request didn't crash."
2. **No middleware-level tests.** `middleware.JWTAuth`, `middleware.Recovery`,
   `middleware.RequireRole`, `middleware.ServiceAuth`, `middleware.Tracing` have zero
   dedicated test coverage — including no test proving `RequireRole` actually blocks a
   wrong-role request (doubly notable since it's also unwired from any route — see
   AUTH-RBAC.md).
3. **No repository-layer tests independent of a live DB** (e.g. via `sqlmock` /
   `go-sqlmock`) — meaning CI without database access cannot verify repository SQL
   correctness at all; it can only verify "the code compiles and doesn't panic."
4. **Coverage tooling is documented but not automated.** `README.md` gives the
   `go test -coverprofile=...` command and `sonar-prepare.md` gives a manual pipeline for
   feeding that into a local SonarQube instance — there is no CI step that runs this
   automatically or enforces a coverage threshold.
5. **No test for `DBManager.WithTransaction`** — unsurprising since nothing in the
   codebase calls it yet (see DATABASE-ARCHITECTURE.md), but it means the one piece of
   transaction-safety logic in the template is currently unverified by any test.

## Recommended pattern for future domains

- Keep the existing integration-style controller tests for happy-path/DB-backed
  correctness — they are genuinely useful and the host-guard on teardown is a good
  pattern to keep.
- Add **mocked** unit tests at the service layer (mock the repository interface) for any
  business logic beyond pure pass-through — this template's own services are thin enough
  that this hasn't mattered yet, but it will the moment a real domain adds validation or
  multi-step orchestration.
- Add `sqlmock`-based repository tests if CI needs to run without live database access
  (currently, DB-dependent tests silently skip in that case rather than failing, which is
  safe but means CI provides **zero verification** of repository SQL correctness unless
  real databases are provisioned for the test run).

## Document Status

Draft for Review — verified by reading `controller/sampleController_test.go` in full and
running `go test ./...` live against the checkout, 2026-08-21.
