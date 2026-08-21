# Go Template Analysis — Index

Audit target: `go-template-main` (module `singer/go-template-new-2026-06`), located at
`C:\Claude_AI\stl_asset_pj\go-template-main`.

This is a **read-only architecture and readiness audit**. No source file in the template
was modified, refactored, or upgraded during this analysis. All findings are based on
**actual source code**, not on the template's own `README.md` / `architecture.md` /
`project-structure.md`, which were found to be **out of date in several places** (see
`ARCHITECTURE.md` §"Discrepancies vs. shipped docs").

A prior, differently-named analysis already exists at `../template-analysis/`. This audit
is independent and supersedes it for anything that conflicts — this one was produced by
reading every source file line-by-line and running `go build`/`go vet`/`gofmt`/`go test`
against the actual tree.

## Documents

| File | Contents |
|---|---|
| [BACKEND-STRUCTURE.md](BACKEND-STRUCTURE.md) | Folder-by-folder responsibility table |
| [TECH-STACK.md](TECH-STACK.md) | Go version, dependencies, build/test commands |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Actual layering, bootstrap flow, DI wiring, discrepancies |
| [DATABASE-ARCHITECTURE.md](DATABASE-ARCHITECTURE.md) | DBManager vs. package-level PG/TT dual-pools, health, transactions |
| [REPOSITORY-PATTERN.md](REPOSITORY-PATTERN.md) | Facade + per-DB repository conventions |
| [SERVICE-PATTERN.md](SERVICE-PATTERN.md) | Service layer shape, thin-vs-business-centric verdict |
| [API-ARCHITECTURE.md](API-ARCHITECTURE.md) | Routes, request/response shape, versioning, pagination |
| [AUTH-RBAC.md](AUTH-RBAC.md) | JWT auth, demo credentials, RBAC (defined but unwired) |
| [SECURITY-REVIEW.md](SECURITY-REVIEW.md) | Source-level security findings, classified by severity |
| [TESTING-STANDARD.md](TESTING-STANDARD.md) | What's tested, what's mocked, what's missing |
| [DEPENDENCY-REVIEW.md](DEPENDENCY-REVIEW.md) | go.mod/go.sum audit |
| [PROJECT-STARTING-GUIDE.md](PROJECT-STARTING-GUIDE.md) | How to bootstrap a real project from this template |
| [TEMPLATE-READINESS-REVIEW.md](TEMPLATE-READINESS-REVIEW.md) | Final verdict: READY / READY WITH LIMITATIONS / NOT READY |

## Headline findings (see linked docs for detail)

1. **`architecture.md` (shipped in the template) is factually wrong about `DBManager`.**
   It documents `DBManager{MSSQLDb, PGDb, OracleDb, TTPool}`, but the real struct
   (`repository/dbManager.go`) only holds `MSSQLDb` and `OracleDb`. PostgreSQL and
   Tarantool are managed by **package-level global dual-pools** (separate read/write
   pools with hot-reload of replica membership), accessed via free functions
   (`GetPGWriteDb`, `GetPGReadDB`, `GetTTPool`, `GetTTReadPool`), not through the
   `DBManager` struct at all.
2. Authentication is **demo-only**: a single hardcoded username/password pair read from
   env vars, plaintext-compared. Explicitly documented as such in the template's own
   README, but worth restating: this is **not adaptable to real users without a rewrite**.
3. RBAC primitives exist (`middleware.RequireRole`, JWT `Role` claim) but
   **`RequireRole` is never attached to any route** — no authorization checks currently
   run in the request pipeline.
4. `middleware.ServiceAuth()` (API-key auth for service-to-service calls) and
   `util.StartBlacklistCleanup()` (periodic eviction of revoked-JWT entries) are both
   **fully implemented but never called from anywhere** — dead code today; the blacklist
   is consequently an **unbounded in-memory map** in any long-running process that issues
   logouts.
5. A hardcoded API key (`"9KzNGvXB"`) is committed in `handler/sampleHandler.go`.
6. No Docker, no CI/CD, no migration tool — confirmed absent, not just undocumented.
7. `go build ./...`, `go vet ./...`, `gofmt -l .` all pass clean; `go test ./...` passes
   (DB-dependent subtests self-skip when no DB env is configured).

## Document Status

Draft for Review — produced 2026-08-21 by direct source inspection. No template files were
modified.
