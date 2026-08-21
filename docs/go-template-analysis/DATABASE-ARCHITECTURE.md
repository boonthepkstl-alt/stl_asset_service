# Database Architecture

This is the most critical, and most misdocumented, part of the template. Everything below
is traced directly from `repository/dbManager.go` (952 lines — the single largest file in
the codebase).

## Two different connection models, by design (not by accident)

| | MSSQL | Oracle | PostgreSQL | Tarantool |
|---|---|---|---|---|
| Owned by `DBManager` struct? | Yes (`MSSQLDb *sql.DB`) | Yes (`OracleDb *sql.DB`) | **No** — package-level var | **No** — package-level var |
| Pool count | 1 | 1 | 2 (write + read) | 2 (write + read) |
| Read/write split | No | No | Yes (`GetPGWriteDb` / `GetPGReadDB`) | Yes (`GetTTPool` / `GetTTReadPool`) |
| Hot-reload of replica list without restart | No | No | Yes | Yes |
| Repository constructor signature | `NewSampleMSSQLRepository(dbManager *DBManager)` | `NewSampleOracleRepository(dbManager *DBManager)` | `NewSamplePGRepository()` — no args | `NewSampleTTRepository()` — no args |
| Pool sizing overridable via env | No (hardcoded 100/20/5m/2m) | Yes (`DB_ORACLE_MAX_OPEN_CONNS`/`_MAX_IDLE_CONNS`) | Yes (`DB_PG_MAX_OPEN_CONNS`/`_MAX_IDLE_CONNS`) | N/A (Tarantool pool sizing is connection-count based, fixed constants `ttCheckTimeout`/`ttConnectTimeout`/etc.) |

**Why this matters for a new domain:** if you write a new repository against MSSQL or
Oracle, you take `*DBManager` in the constructor and call `dbManager.GetMSSQLDb()` /
`dbManager.GetOracleDb()`. If you write one against PostgreSQL or Tarantool, you take
**no** constructor argument and call the package-level `repository.GetPGReadDB()` /
`repository.GetPGWriteDb()` / `repository.GetTTPool()` / `repository.GetTTReadPool()`
functions directly. These are two genuinely different integration points, and nothing in
the type system stops you from using the wrong one for a given DB — this is a **tribal
knowledge risk** worth writing into onboarding material.

## PostgreSQL dual-pool (the deepest logic in the file)

- **Write pool** (`pgWriteDb`, guarded by `pgWriteMu sync.RWMutex`): single connection
  string built from `DB_PG_SERVER`/`DB_PG_USER`/`DB_PG_PASS`/`DB_PG_INST`/`DB_PG_PORT`
  (default 5432)/`DB_PG_SSLMODE` (default `disable`)/`DB_PG_SCHEMA` (`search_path`).
  Reconnects lazily when `pgWriteConfigKey()` (a hash of all the above) changes; if a
  rebuild fails and an existing pool is live, the **old pool is kept** rather than
  returning an error — availability preferred over freshness.
- **Read pool(s)** (`pgReadPools []*PGReadDB`, guarded by a *separate* `pgReadMu`): built
  from `DB_PG_REPLICAS` (comma-separated `host:port` list) using `DB_PG_REPL_USER`/`_PASS`
  if set, else falling back to the write credentials. Reads are **round-robined**
  (`atomic.AddUint64(&pgReadIdx, 1)`) across replicas, and each candidate is health-checked
  with a bounded `PingContext` (`DB_PG_READ_PING_MS`, default 800ms) before being used —
  this can be disabled with `DB_PG_READ_VERIFY=false` to save a round-trip per read at the
  cost of blind routing during an outage.
- **No replicas configured** → `GetPGReadDB()` transparently returns the write pool tagged
  `Label: "MASTER"`. **All replicas unreachable** → same fallback, with a `log.Warn`.
- **Two separate mutexes** (`pgWriteMu`, `pgReadMu`) are used specifically so the read path
  can call `GetPGWriteDb()` for its master-fallback without self-deadlocking — documented
  in a code comment and worth preserving if this file is ever refactored.
- **Hot-reload**: `reloadConfigIfChanged()` re-`stat`s the Viper config file's mtime on
  every pool-acquisition call and re-reads it if changed, then `applyHotConfigFileValues`
  re-applies **only** the keys in the `hotConfigKeys` allow-list (`DB_PG_*`, `DB_TT_*`) —
  everything else in the file is ignored. This means an operator can add/remove a replica
  from the env file and have it picked up without a restart, but cannot hot-reload, say,
  `JWT_SECRET` this way (by design — it's an allow-list, not a blanket re-read).

## Tarantool dual-pool

Same write/read split concept, implemented differently because the Tarantool client
(`github.com/tarantool/go-tarantool/v2/pool`) has **built-in role-aware routing**
(`pool.RW` for writes, `pool.PreferRO` for reads) — so the "read pool" here is really the
same pool object queried with a different mode constant when a single pool serves both
roles, or a genuinely separate pool (with separate replication-user credentials via
`DB_TT_REPL_USER`/`_PASS`) when configured. Reads execute arbitrary SQL through a Lua
`box.execute` eval (`ttReadEvalLua`), with parameters passed as bound args (not
string-interpolated) — the code comment `-- params bound by box.execute — no SQL
injection` is accurate for the read path.

## MSSQL / Oracle — no pooling sophistication beyond `database/sql` defaults

Both are single `*sql.DB` pools created once at startup (`InitMSSQLPool`,
`InitOraclePoolWithOptions`), stored directly on the `DBManager` struct, with static
`SetMaxOpenConns(100)`/`SetMaxIdleConns(20)`/`SetConnMaxLifetime(5m)`/
`SetConnMaxIdleTime(2m)`. No replica awareness, no hot-reload, no round-robin — if you need
read/write splitting for MSSQL or Oracle in a real project, that logic does not exist yet
and would need to be built following the PG pattern.

## Health checks (`DBManager.Health()`)

Returns a `map[string]string` with one entry per configured DB plus a
`postgres_replicas` entry (`"N/M replica(s) healthy"` or `"none (reads via master)"`).
Values are one of `"healthy"`, `"unhealthy: <err>"`, or `"not configured"`. Consumed by
`controller.Health`, which maps **any** non-`healthy`/non-`not configured` value to HTTP
503. This is a **readiness**-style check (it actively pings every backend on every call,
including replicas) — there is no separate cheap **liveness** check; see §30 in
TEMPLATE-READINESS-REVIEW.md.

MSSQL/Oracle health checks use `db.Ping()`/`m.OracleDb.Ping()` (which use `context.Background()`
internally, i.e. **no explicit timeout**) — a hung network path to either of these could
make `/health` hang, unlike the PG/TT paths which use bounded `PingContext`/eval timeouts.

## Transactions

`DBManager.WithTransaction(db *sql.DB, fn TxFn) error` implements the standard
begin → run callback → commit-or-rollback pattern correctly:

- Panic inside `fn` → `tx.Rollback()`, then **re-panics** (never silently swallows a panic).
- `fn` returns an error → `tx.Rollback()`; if rollback itself fails, both errors are
  wrapped together (`fmt.Errorf("%w (rollback failed: %v)", err, rbErr)`).
- No error → `tx.Commit()`.
- No `context.Context` parameter on `TxFn` — cancellation must be handled inside the
  callback if needed; the transaction itself isn't context-aware (`db.Begin()`, not
  `db.BeginTx(ctx, opts)`).

**`WithTransaction` is currently unused** — grep confirms no repository or service method
calls it. Every existing repository method executes a single statement, so there is no
multi-statement business transaction anywhere in the sample code yet. A real domain
(e.g., "reassign an asset" touching two tables) will be the first real exerciser of this
path — worth writing a unit test against it before depending on it in production.

## Document Status

Draft for Review — traced directly from `repository/dbManager.go` and cross-checked
against every repository file, 2026-08-21.
