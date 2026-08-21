# Architecture

## Actual pattern

This is a **layered (N-tier) architecture**, not a strict Clean/Hexagonal Architecture,
despite the template's own `architecture.md` calling it "Clean Architecture." The real
dependency direction is:

```
HTTP Request
     │
     ▼
[ Controller ]   controller/*.go        — parse request, no business logic
     │
     ▼
[  Service   ]   service/*.go           — business logic, orchestrates repo + handler
     │
     ▼
[ Repository ]   repository/*.go        — data access, one impl per DB engine
     │
     ▼
[  Database  ]   PostgreSQL / MSSQL / Oracle / Tarantool
```

Each layer depends on the layer below through a **Go interface** (`SampleController`,
`SampleService`, `SampleRepository`, `SamplePGRepository`/`SampleMSSQLRepository`/…), and
concrete constructors (`NewX(...)`) are wired by hand in `router/sampleRouter.go`. There is
**no dependency-injection framework** (no Wire, no fx) — this is plain constructor
injection, which is easy to read and easy to mock in tests.

It is **not** Hexagonal/Clean Architecture in the strict sense: there is no separate
"domain"/"use case" package independent of framework types, `model.SampleModel` carries
both `json` and `db` tags (so the same struct is HTTP DTO *and* SQL row target *and*
implicitly the domain entity), and `fiber.Ctx` only appears in `controller/`, which is the
one place that *is* correctly isolated from the framework in the layers below it.

## Bootstrap / startup flow (traced from `main.go`)

```
func init()                          → util.Init()  (load env + optional Infisical secrets,
                                        configure logrus + optional Logstash TCP hook)
func main()
  1. util.InitTracing(ctx)           → no-op unless OTEL_ENABLED=true; else builds an
                                        OTLP-HTTP exporter + TracerProvider, defer Shutdown
  2. repository.InitTT()             → eagerly connects Tarantool write + read pools
                                        (package-level, NOT part of DBManager)
  3. repository.InitPG()             → eagerly connects PostgreSQL write + read pools
                                        (package-level, NOT part of DBManager)
  4. repository.InitMSSQLPool()      → only if DB_MSSQL_SERVER is set; returns *sql.DB
  5. repository.InitOraclePoolWithOptions() → only if DB_ORACLE_SERVER + DB_ORACLE_SERVICE set
  6. repository.NewDBManager(mssqlDb, oracleDb) → struct with ONLY these two fields
  7. fiber.New(BodyLimit: 50MB)
  8. app.Use(cors.New(...))          → default allow-list localhost:3000,5173 if unset
  9. app.Use(fiberlogger.New(...))   → "[AUDIT]" line format, includes trace_id/user/role
 10. router.SetupRoutes(app, dbManager) → builds repos/services/controllers, registers routes
 11. goroutine: signal.Notify(SIGINT, SIGTERM) → app.Shutdown() (graceful)
 12. app.Listen(":" + SERVER_PORT)  → default port 8000
```

Steps 2–5 all log-and-continue on failure rather than exiting (`log.Errorf` / `log.Warnf`,
no `os.Exit`/`panic`) — the process **starts even if every database is unreachable**. This
is a deliberate "fail soft" choice suited to a template/demo, but a real project should
decide explicitly whether a required datastore being down should be fatal at startup.

Graceful shutdown covers: Fiber's own `app.Shutdown()` (stops accepting new connections,
drains in-flight ones) → `defer dbManager.Close()` (closes MSSQL/Oracle `*sql.DB`, then
calls `repository.ClosePGPools()` and `repository.CloseTTPool()`) → `defer
shutdownTracing(ctx)` (5s timeout). Order is correct (HTTP stops before DB pools close).

## Dependency injection (manual, traced from `router/sampleRouter.go`)

```
router.SetupRoutes(app, dbManager)
 │
 ├── repository.NewSampleTTRepository()               — no args (uses package-level TT pool)
 ├── repository.NewSamplePGRepository()               — no args (uses package-level PG pool)
 ├── repository.NewSampleOracleRepository(dbManager)  — needs dbManager (Oracle IS in DBManager)
 ├── repository.NewSampleMSSQLRepository(dbManager)   — needs dbManager (MSSQL IS in DBManager)
 │        └── repository.NewSampleRepository(tt, pg, oracle, mssql)  → facade
 │
 ├── handler.NewSampleHandler()
 ├── service.NewSampleService(sampleHandler, dbManager, sampleRepo)
 ├── controller.NewSampleController(sampleService)
 │
 ├── service.NewAuthService()
 └── controller.NewAuthController(authService)
```

**This asymmetry is intentional and load-bearing**: PG/TT repos take **zero** constructor
arguments (state lives in `repository` package-level vars), while MSSQL/Oracle repos take
`*DBManager`. Anyone adding a fifth database must decide up front which pattern to follow —
see DATABASE-ARCHITECTURE.md for the tradeoff.

## Routing (traced from `router/sampleRouter.go`)

```
app.Use(middleware.Tracing())
app.Use(middleware.Recovery())

/api  (fiber.Group)
 ├── GET  /ping                 — public, INLINE handler defined in router (not controller.Ping)
 ├── POST /auth/login           — public
 └── (protected group, middleware.JWTAuth())
      ├── GET    /health
      ├── POST   /auth/logout
      ├── POST   /sample                — legacy scaffold endpoint
      ├── POST   /samples
      ├── GET    /samples
      ├── GET    /samples/:id
      ├── PUT    /samples/:id
      └── DELETE /samples/:id
```

CORS and the Fiber request-audit logger are registered directly in `main.go`, **before**
`router.SetupRoutes` is called — so they wrap the tracing/recovery middleware too.

## Discrepancies vs. shipped docs

The template ships its own `architecture.md` and `project-structure.md`. Per the audit
rule (source code overrides documentation), the following are **material discrepancies**,
not stylistic ones:

| Claim in `architecture.md` | Actual source | Where |
|---|---|---|
| `DBManager` struct has fields `MSSQLDb`, `PGDb`, `OracleDb`, `TTPool` | Real struct is `type DBManager struct { MSSQLDb *sql.DB; OracleDb *sql.DB }` — **no `PGDb`, no `TTPool` field exists** | `repository/dbManager.go:28-31` |
| Startup order lists `InitPostgresPool()`/`InitTarantoolPool()` as steps producing values fed into `NewDBManager(...)` | `main.go` actually calls `repository.InitTT()` and `repository.InitPG()` (return nothing, warm package-level pools) *before* building `DBManager`, and `NewDBManager` is only called with `(mssqlDb, oracleDb)` | `main.go:51-72` |
| Implies a single connection pool per DB | PostgreSQL and Tarantool each have **two** pools (write + read), independently sized, with hot-reload of replica membership from env-file mtime; MSSQL and Oracle have exactly **one** pool each, no read/write split | `repository/dbManager.go` |
| "Connection pool settings (configurable via env)" table applies uniformly | Pool tuning is actually **not uniform**: PG has `DB_PG_MAX_OPEN_CONNS`/`DB_PG_MAX_IDLE_CONNS` env overrides; Oracle has `DB_ORACLE_MAX_OPEN_CONNS`/`DB_ORACLE_MAX_IDLE_CONNS`; **MSSQL has no override at all** — always hardcoded 100/20/5m/2m | `repository/dbManager.go:428-438`, `810-817`, `779-782` |
| `Ping healthcheck` section implies `controller.Ping` serves `/ping` | The live `/ping` route is an **inline closure in `router/sampleRouter.go`**; `controller.Ping` (with its own separate `version` constant) is defined but never routed — dead code | `router/sampleRouter.go:37-44` vs `controller/sampleController.go:57-65` |

Treat this ARCHITECTURE.md, not the shipped `architecture.md`, as current for anything
about `DBManager`, pool topology, or the `/ping` route.

## Document Status

Draft for Review — traced directly from `main.go`, `router/sampleRouter.go`,
`repository/dbManager.go`, 2026-08-21.
