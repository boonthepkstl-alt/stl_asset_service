# Go Template Readiness Review

Target: `C:\Claude_AI\stl_asset_pj\go-template-main` (module `singer/go-template-new-2026-06`).
Read-only audit; no source file was modified, refactored, upgraded, or added to.

## Executive Summary

This is a **coherent, working, layered Go/Fiber template** with real multi-database
plumbing (including a genuinely sophisticated PostgreSQL/Tarantool dual read-write pool
with hot-reload), working JWT auth infrastructure, OpenTelemetry tracing, and a sane
manual-DI convention. It builds, vets, and gofmt-checks clean, and its existing test
suite passes. It is **not** production-ready as shipped, for reasons that are mostly
already flagged by the template's own README (demo auth) plus several the README does
not mention: unwired RBAC/service-auth middleware, an unbounded token blacklist, a
materially incorrect `architecture.md`, no CI/CD, no Docker, and no migration tooling.
None of these are hard to fix; all of them must be **decided and fixed before**, not
during, a real project's first sprint.

## Project Structure

Clean, conventional layering (`controller → service → repository → database`), one
folder per concern, `sql/` split by engine. No `cmd/`/`pkg/` split (appropriate at this
scale — single binary, nothing exported for reuse). Full detail: BACKEND-STRUCTURE.md.

## Architecture

Layered/N-tier with interface-based dependency inversion and manual constructor DI — not
strict Clean/Hexagonal despite the shipped docs' claim. Bootstrap order is
config → tracing → DB pools → Fiber app → routes → signal-driven graceful shutdown, and
it fails soft (logs, doesn't crash) if a database is unreachable at startup. Full detail
and a list of concrete discrepancies against the shipped `architecture.md`:
ARCHITECTURE.md.

## HTTP/API

Fiber v2, `/api` prefix, no version segment. Route table matches the README exactly.
Two inconsistent response-envelope styles across handlers; several 5xx paths leak raw
driver error text to clients. No filtering/sorting; simple, controller-enforced
pagination with a 100-item cap. Full detail: API-ARCHITECTURE.md.

## Database

Two genuinely different integration models coexist by design: MSSQL/Oracle are
single-pool, owned by the `DBManager` struct; PostgreSQL/Tarantool are **package-level**
dual read/write pools with round-robin replica selection, live health-checked routing,
and hot config-file reload — none of which touches `DBManager` at all. Full detail:
DATABASE-ARCHITECTURE.md.

## DBManager

Actual struct: `{ MSSQLDb *sql.DB; OracleDb *sql.DB }` — the shipped `architecture.md`'s
claim that it also holds `PGDb`/`TTPool` fields is **factually wrong**; those live in
separate package-level state accessed via free functions. `DBManager.Health()` is a
readiness-style check (pings every backend live, no separate liveness probe).
`DBManager.WithTransaction` is correctly implemented (panic-safe, rollback-on-error) but
**currently unused anywhere in the codebase**. Full detail: DATABASE-ARCHITECTURE.md,
ARCHITECTURE.md.

## Repository

Facade (`SampleRepository`) + one interface/impl per DB engine, uniform 5-method CRUD
shape, correct parameter binding per engine (no SQL injection found), SQL text
co-located in `model/`. Read/write pool selection is manual, per-method, inside the
PG/TT repositories — not centrally enforced. Full detail: REPOSITORY-PATTERN.md.

## Service

Thin orchestration; almost no business logic beyond UUID generation and pagination math.
`CallAllRepositories` is a multi-DB fan-out **demonstration**, not a pattern to reuse for
real cross-store business operations. No transaction is opened anywhere yet — the first
real multi-row domain operation will be the first genuine test of
`DBManager.WithTransaction`. Full detail: SERVICE-PATTERN.md.

## Authentication

**Classified: DEMO.** Single hardcoded env-var credential pair, plaintext comparison, no
user store, no password hashing dependency. JWT issuance/validation itself is solid
(HS256, explicit algorithm check, JTI-based blacklist support, dual
header/HttpOnly-cookie transport). Full detail: AUTH-RBAC.md.

## Authorization

**Classified: DEFINED BUT NOT ENFORCED.** `RequireRole` middleware exists and is
correctly implemented but is wired to **zero routes**. No permission concept exists,
only bare role-string comparison. `BYPASS_JWT=true` grants admin to any unauthenticated
request when no token is presented — must be guaranteed unset outside local dev. Full
detail: AUTH-RBAC.md.

## Error Handling

Repository layer uses status-string sentinels (`"COMPLETE"`/`"NOT_FOUND"`/`"ERROR"`,
inconsistently also `"OK"` in one place) alongside `error` returns — callers must check
both. Controller layer maps these to HTTP codes correctly, but several paths leak raw
internal error text to the client (MEDIUM finding, SECURITY-REVIEW.md). Global panic
recovery is correctly implemented and does not leak stack traces to clients.

## Logging / Observability

Logrus + nested formatter + optional daily file rotation + optional Logstash TCP hook
with auto-reconnect, all wired through `logger.GetLogger*` helpers that also inject OTel
`trace_id`/`span_id`. OpenTelemetry tracing is fully implemented end-to-end
(`middleware.Tracing()` → OTLP-HTTP exporter, Jaeger-compatible) but **off by default**
(`OTEL_ENABLED`). Classification: **READY** for logging, **READY (opt-in)** for tracing,
**MISSING** for metrics (no `/metrics` endpoint, no Prometheus client dependency) and for
liveness-vs-readiness distinction (`/health` is a single readiness-style endpoint).

## Testing

Real, working integration-style tests through a live Fiber app, with a genuinely good
host-guarded teardown safeguard and a useful partial-failure regression test. Gap:
**no mocked unit tests exist anywhere** — every non-trivial assertion depends on a live
database being reachable; CI without provisioned databases verifies compilability and
basic routing only, not repository SQL correctness. Full detail: TESTING-STANDARD.md.

## Security

No SQL injection, no auth-bypass-via-missing-checks, no unsafe deserialization, correct
panic containment. Real findings: a hardcoded demo API key committed in source (HIGH),
demo-only auth (HIGH, already documented by the template itself), the `BYPASS_JWT`
admin-escalation footgun (HIGH if misconfigured), internal-error leakage to clients
(MEDIUM), an unbounded/unshared token blacklist (MEDIUM), and a handful of LOW/INFO items
(no rate limiting, no security-headers middleware, demo credentials in local-bootstrap
SQL scripts). Full detail with severities: SECURITY-REVIEW.md.

## Dependencies

25 direct dependencies, all actually used (no dead direct deps found). Two watch-items
(`go-file-rotatelogs` unmaintained upstream; `denisenkom/go-mssqldb` superseded by a more
active fork) — neither urgent. `govulncheck` was not run (not installed; installing
tools is out of scope for this audit) — **recommended before go-live**. Full detail:
DEPENDENCY-REVIEW.md.

## Docker / Deployment

**Confirmed absent** — no `Dockerfile`, no `docker-compose.yml`, no `.dockerignore`
anywhere in the tree.

## CI/CD

**Confirmed absent** — no `.github/`, no `.gitlab-ci.yml`, no `Jenkinsfile`, no
`Makefile`. SonarQube integration exists only as a manual, local, Docker-based runbook
(`sonar-prepare.md`) — not wired into any pipeline.

## Health Checks

One endpoint (`GET /api/health`), JWT-protected, readiness-style (actively pings every
configured backend, including PG read replicas, on every call). No separate liveness
probe. MSSQL/Oracle pings have no explicit timeout (PG/TT do) — a hung network path to
either could stall the endpoint.

## Future Domain Extension

The template's layering and repository-facade pattern generalize cleanly to new domains
(Asset, Employee, IT Requisition, Maintenance, Software License, Audit, Reconciliation,
AI) **as a pattern to copy**, provided each new domain's author understands the
PG/TT-vs-MSSQL/Oracle constructor-signature asymmetry and the current gaps in
transactions/RBAC/validation before relying on them. No domain-specific code exists or
was created during this audit. Full detail: PROJECT-STARTING-GUIDE.md.

## Frontend Integration

Contract boundary is plain JSON over `/api/...`, JWT via header or HttpOnly cookie,
consistent pagination envelope for list endpoints, inconsistent error envelope across
endpoints (a fix worth making before a frontend team starts building against many
endpoints in parallel). Full detail: PROJECT-STARTING-GUIDE.md.

## Strengths

- Working, tested, multi-database plumbing with a genuinely production-grade
  PostgreSQL/Tarantool dual-pool implementation (hot-reload, round-robin health-checked
  reads, graceful degradation to master).
- Correct SQL parameter binding across all four supported engines — no injection risk
  found anywhere in the sample code.
- Solid JWT mechanics (algorithm pinning, JTI-based revocation hook, dual transport).
- Sensible fail-soft startup and correctly ordered graceful shutdown.
- Genuinely useful test patterns already in place (host-guarded teardown,
  partial-failure fan-out test) worth keeping as project conventions.
- Manual DI is explicit and easy to trace end-to-end — no framework magic to debug.

## Risks

- **Documentation drift**: `architecture.md` is materially wrong about `DBManager`; a
  team onboarding from that file alone will misunderstand the DB layer. Fix the doc or
  point new engineers at this audit until it's fixed.
- **Auth/RBAC gap** is the single biggest blocker to any real deployment — see Required
  Changes below.
- **Silent unbounded memory growth** in the token blacklist under sustained logout
  traffic in a long-running process.
- **No automated verification (CI)** means regressions in any of the above would not be
  caught mechanically today — they'd have to be caught by a human running `go test`
  locally.

## Missing Capabilities

- Real user/credential store; password hashing.
- RBAC enforcement wired to routes; a permission model beyond bare role strings.
- Docker packaging; CI/CD pipeline; automated coverage/lint gating.
- Migration runner (tool or scripted `psql`/`sqlcmd`/etc. application of the `sql/*.sql`
  files).
- Metrics endpoint (Prometheus or equivalent); liveness vs. readiness distinction.
- Rate limiting; security-headers middleware; shared error-response type.
- Mocked unit-test coverage independent of live databases.

## Required Changes Before Project Start

1. Replace `AuthService.Login` with a real, hashed-password, repository-backed
   implementation — no domain should ship behind the current demo auth.
2. Decide the RBAC model and wire `middleware.RequireRole` (or a replacement) to every
   route that needs role-gating; currently zero routes enforce role.
3. Guarantee `BYPASS_JWT` is false/unset outside local development (env-var discipline,
   or a startup assertion).
4. Call `util.StartBlacklistCleanup()` from `main.go` (or replace the blacklist with a
   shared/external store — Redis, DB table — if more than one instance will ever run).
5. Remove the hardcoded API key from `handler/sampleHandler.go` before adapting that
   file for a real external integration.
6. Stop returning raw `err.Error()` to API clients on 5xx paths; keep detail in logs only.
7. Correct or replace the shipped `architecture.md`'s `DBManager` description.
8. Add Docker packaging and a minimal CI pipeline (build, vet, test, gofmt check) before
   treating this as a shippable foundation — currently neither exists.

## Recommended Changes (non-blocking, but should not be deferred indefinitely)

- Introduce a migration tool (`golang-migrate`/`goose`) rather than continuing to apply
  `sql/*.sql` files by hand once more than one engine/domain is in active use.
- Add a shared error-response type/helper to stop the `fiber.Map` literal drift.
- Add API versioning (`/api/v1`) before any external client depends on the unversioned
  path.
- Add mocked unit tests at the service layer for the first domain with real business
  logic.
- Run `govulncheck ./...` and address findings before production go-live.
- Decide the long-term replacement for `go-file-rotatelogs` (unmaintained upstream).

## Do Not Change

Per the audit's own constraints, and reinforced by what this review found to already
work correctly:

- The layered architecture and manual-DI convention (works, is easy to trace).
- The PostgreSQL/Tarantool dual-pool implementation's internals (hot-reload, mutex
  separation, round-robin health-checked reads) — subtle and already correct; touch only
  with full understanding of the two-mutex deadlock-avoidance comment in
  `dbManager.go`.
- The per-engine SQL parameter-binding conventions — all four are currently
  injection-safe; any refactor must preserve this.
- `DBManager.WithTransaction`'s panic-safety (re-panic after rollback) — do not "fix" it
  to swallow panics.
- The host-guarded test teardown pattern in `sampleController_test.go`.

## Final Readiness

**READY WITH DOCUMENTED LIMITATIONS**

The template is a solid, working starting point for a real backend — the database
plumbing in particular is more sophisticated than most templates at this stage — but it
must not be treated as production-ready as-is. Every item under "Required Changes Before
Project Start" above must be addressed before this becomes the foundation for a real
enterprise application handling real users or real data.

## Document Status

Draft for Review — final synthesis of all linked documents in this audit; produced by
direct source inspection plus live `go build`/`go vet`/`gofmt`/`go test` runs against the
unmodified checkout, 2026-08-21.
