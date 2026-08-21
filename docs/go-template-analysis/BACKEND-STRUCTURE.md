# Backend Structure

Module: `singer/go-template-new-2026-06` (Go 1.23.0 declared; built here with go1.26.5).

| Folder/File | Responsibility | Standard | Extensible | Notes |
|---|---|---|---|---|
| `main.go` | Process entrypoint: init config/tracing, init DB pools, build `fiber.App`, wire CORS + audit logging, call `router.SetupRoutes`, signal-driven graceful shutdown, listen. | Yes — every real project keeps this shape | No (one process entrypoint) | `//go:debug x509negativeserial=1` build tag at top — a workaround for an x.509 negative-serial cert-validation edge case, likely needed for one of the DB drivers/Infisical TLS chain. Preserve unless proven unnecessary. |
| `go.mod` / `go.sum` | Module identity + dependency graph. | Yes | N/A | Module path `singer/go-template-new-2026-06` must be renamed per project (see PROJECT-STARTING-GUIDE.md). |
| `controller/` | HTTP layer: parse request, call service, map result to HTTP status + JSON. No SQL, no business rules. | Yes | Yes — add one file per resource | `sampleController.go` defines a `Ping` method that is **dead code** (router defines its own inline `/ping` handler instead — see ARCHITECTURE.md). |
| `handler/` | Outbound HTTP client calls to **external** APIs (not the DB). Isolates 3rd-party HTTP plumbing from `service/`. | Yes | Yes | `sampleHandler.go` has a hardcoded demo API key committed in source — flagged in SECURITY-REVIEW.md. |
| `logger/` | Thin wrapper over logrus; injects `component`/`function` (via `runtime.Caller`) and OTel `trace_id`/`span_id` into every entry. | Yes | Yes (use `GetLogger`/`GetLoggerWithFiber` everywhere) | No log-scrubbing/masking of request bodies — anything logged with `%v`/`%#v` on a model can leak PII if a real domain model carries it. |
| `middleware/` | Cross-cutting HTTP concerns: JWT auth, panic recovery, OTel span-per-request, internal-service API-key auth. | Yes | Yes | `serviceAuth.go` (`ServiceAuth()`) and the `RequireRole` role-gate in `jwtAuth.go` are implemented but **not wired into `router/sampleRouter.go`** — currently dead. |
| `model/` | Data-transfer/domain structs **and** per-database raw SQL string constants, co-located. | Yes, for this template's chosen convention | Yes, but see REPOSITORY-PATTERN.md re: SQL-in-model vs. SQL-in-repository tradeoff | `sampleModel.go` mixes Go structs with 24 SQL constants (4 DBs × 6 queries) in one file — fine at this scale, would want per-domain SQL files once multiple domains exist. |
| `repository/` | Data access. One facade interface (`SampleRepository`) + one interface/impl pair per database engine. `dbManager.go` also lives here (connection lifecycle, pooling, health, hot-reload, transaction helper). | Yes | Yes — implement the same 5-method interface shape for a new DB engine | `dbManager.go` is the single largest file (~950 lines) and does three jobs (MSSQL/Oracle single-pool bootstrap, PG dual-pool, TT dual-pool) — a real project will likely want to split this once behaviour grows further. |
| `router/` | Manual dependency-injection wiring (constructors, no DI framework) + Fiber route registration. | Yes | Yes, but wiring is 100% manual — every new domain repeats the same "build repo → build service → build controller → register routes" block here | The inline `/ping` handler duplicates responsibility that already exists (unused) in `controller.Ping`. |
| `sql/` | One subfolder per DB engine (`pg`, `mssql`, `oracle`, `tt`) holding hand-numbered `V0__*.sql` files. | Partial — file **naming** looks Flyway-style but there is **no migration runner wired into the app or any script** | Yes (add `V1__*.sql`, etc., by convention) | No down-migrations. `sql/oracle/V0_Prepare_Schema.sql` and `sql/tt/V0__Initial_Table.txt` embed hardcoded demo credentials (`hr`/`hr`, `appuser`/`apppassword`, `mysecretpassword`) — see SECURITY-REVIEW.md; low severity because these are local bootstrap scripts, not runtime config, but should not be copied into a real project's docs verbatim. |
| `util/` | Grab-bag: Viper env/Infisical config loading, structured-logging bootstrap + Logstash TCP hook, JWT sign/verify, in-memory JWT blacklist, random-string helper, OTel tracer bootstrap. | Mostly yes | Yes, but this package is doing 6 unrelated things under one name | `util/sampleutils.go`'s `SomeUtilMethods` is a placeholder function with no real logic — clearly scaffold-only, delete or replace per project. |
| `sonar-project.properties`, `sonar-prepare.md` | SonarQube scan configuration + a runbook for doing it manually via Docker. | Documented, not automated | Yes | Not wired into any CI — this is a **manual local runbook only** (see §28 CI/CD). |
| `README.md`, `architecture.md`, `project-structure.md` | Template documentation. | — | — | `architecture.md` contains a **materially incorrect** description of `DBManager` (claims it holds `PGDb`/`TTPool` fields that do not exist in the real struct). Treat source as ground truth; see ARCHITECTURE.md for the exact discrepancy. |

## Absent (confirmed by directory search, not by omission)

- No `cmd/` — this is a single-binary template, `main.go` sits at repo root.
- No `pkg/` — nothing is exposed for external module consumption; not needed at this scale.
- No `Dockerfile`, `docker-compose.yml`, `.dockerignore`.
- No CI/CD config of any kind (`.github/`, `.gitlab-ci.yml`, `Jenkinsfile`).
- No `Makefile`.
- No `.env` / `app.env` file (README references running `export $(cat app.env | xargs)`, but no such file ships with the template — the user must create it).
- No `migrations` runner (goose/flyway/golang-migrate) — grepped for `migrate`, `goose`, `flyway`, `embed`: zero matches.

## Document Status

Draft for Review — verified against actual directory listing and file contents, 2026-08-21.
