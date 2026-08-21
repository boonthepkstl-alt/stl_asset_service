# Tech Stack

Source of truth: `go.mod` / `go.sum` (not the README, per audit rules). Go toolchain
verified by running `go version` against the actual checkout.

## Language / toolchain

| Technology | Version | Purpose | Company Standard? | Notes |
|---|---|---|---|---|
| Go | `go 1.23.0` declared in `go.mod`; built/tested here with **go1.26.5 windows/amd64** | Language/runtime | Presumed yes (template repo) | `go build ./...`, `go vet ./...`, `gofmt -l .` all pass clean with the installed 1.26.5 toolchain — no version-skew issues observed. |

## Direct dependencies (from `go.mod` `require` block)

| Package | Version | Purpose | Company Standard? | Notes |
|---|---|---|---|---|
| `github.com/gofiber/fiber/v2` | v2.51.0 | HTTP framework (router, middleware, ctx) | Yes | Core of the whole HTTP layer. |
| `github.com/spf13/viper` | v1.17.0 | Config loading (env + optionally Infisical) | Yes | `viper.AutomaticEnv()` + `.env` file read as `env` config type. |
| `github.com/golang-jwt/jwt/v5` | v5.2.1 | JWT sign/verify | Yes | HS256 only; secret from `JWT_SECRET` env var. |
| `github.com/sirupsen/logrus` | v1.9.3 | Structured logging | Yes | Wrapped by `logger/logger.go`. |
| `github.com/antonfisher/nested-logrus-formatter` | v1.3.1 | Log formatting (component/function nesting) | Yes | |
| `github.com/lestrrat/go-file-rotatelogs` | (pseudo-version, 2018) | Daily log-file rotation | Yes, but **unmaintained upstream** (last commit 2018) | Flag for future replacement; still functions. |
| `github.com/lib/pq` | v1.10.9 | PostgreSQL driver (`database/sql`) | Yes | Pure `database/sql` driver, no ORM. |
| `github.com/denisenkom/go-mssqldb` | v0.12.3 | MS SQL Server driver | Yes | |
| `github.com/sijms/go-ora/v2` | v2.9.0 | Oracle driver (pure Go, no OCI client needed) | Yes | Notably does **not** require Oracle Instant Client — good for containerization. |
| `github.com/tarantool/go-tarantool/v2` | v2.4.1 | Tarantool driver + connection pool (`pool.ConnectionPool`) | Yes | Only DB driver here that ships its own **pool abstraction with role-aware routing** (`pool.RW`, `pool.PreferRO`) — used directly by `dbManager.go`'s TT dual-pool. |
| `github.com/blockloop/scan` | v1.3.0 | `*sql.Rows` → struct scanning | Yes | Used by every repository except Tarantool (which decodes tuples manually) and MSSQL/Oracle repos use it too via `scan.Row`/`scan.Rows`. This **is** the "ORM/SQL strategy" — see §10 in ARCHITECTURE.md. |
| `github.com/google/uuid` | v1.6.0 | UUID v4 generation | Yes | Used by `sampleService.CreateSample` when no client-supplied ID. |
| `github.com/infisical/go-sdk` | v0.4.4 | Pulls secrets from Infisical when `INFISICAL=TRUE` | Yes | Only exercised at startup in `util.Init()`; failures are logged, not fatal. |
| `github.com/ggwhite/go-masker` | v1.1.0 | Masks sensitive values (e.g. credit-card-shaped strings) before logging | Yes | Only actually invoked in `infisicalUtils.go`'s debug print of the Infisical secret payload — **not** used anywhere else in the codebase (e.g. not applied to request/response logging). |
| `go.opentelemetry.io/otel*` (+ `otlptracehttp`, `sdk`, `trace`) | v1.24.0 | OpenTelemetry tracing, OTLP-HTTP export (Jaeger-compatible) | Yes | Fully wired: `middleware.Tracing()` creates a span per request; `main.go` calls `util.InitTracing` and defers shutdown. Off by default (`OTEL_ENABLED`). |
| `github.com/stretchr/testify` | v1.9.0 | Test assertions | Yes | Only consumer of `testing` in the repo (`controller/sampleController_test.go`). |

## Notable transitive dependencies (indirect, pulled in but not directly imported)

The `go.mod` `// indirect` block includes a substantial AWS SDK v2 surface
(`aws-sdk-go-v2`, `config`, `credentials`, `sts`, `sso`, …) and a Google Cloud
auth surface (`cloud.google.com/go/auth`, `compute/metadata`, `iam`). Neither AWS
nor GCP is imported anywhere in this codebase's own source — these arrive
transitively through the **Infisical SDK** (which supports multiple secret-store
backends) and/or the OTel exporter chain. See DEPENDENCY-REVIEW.md for the
full audit; not a defect, but worth knowing before assuming "we depend on AWS."

## Build / test / lint commands (as the template itself defines them)

| Command | Source | Verified |
|---|---|---|
| `go build ./...` | inferred (standard) | ✅ Passed, no output/errors |
| `go vet ./...` | inferred (standard) | ✅ Passed, no output/errors |
| `gofmt -l .` | inferred (standard) | ✅ Passed — zero files need reformatting |
| `go test -v -coverprofile=coverage.out -coverpkg=./... -covermode=set ./...` | `README.md` §Test | ✅ `go test ./...` passed; DB-dependent subtests self-skip (`t.Skip`) when no `DB_*_SERVER` env is set |
| `golangci-lint` | Referenced by audit brief, not by the template itself | ❌ Not installed in this environment; **not present in `go.mod` tool dependencies or any config file either** — the template does not actually configure golangci-lint (no `.golangci.yml`) |
| `staticcheck` | Referenced by audit brief | ❌ Not installed; no config found |
| SonarQube scan | `sonar-project.properties` + `sonar-prepare.md` | Documented as a **manual, local, Docker-based runbook** — not automated, not part of any CI |

## Document Status

Draft for Review — versions read directly from `go.mod`; toolchain checks executed live
against the checkout, 2026-08-21.
