# Repository Pattern

## Shape

One **facade interface** (`repository.SampleRepository`) aggregates four **per-database
interfaces** (`SamplePGRepository`, `SampleMSSQLRepository`, `SampleOracleRepository`,
`SampleTTRepository`). Each per-DB interface has the identical 5-method shape:

```go
type SampleXRepository interface {
    GetSomeXData(id string) (model.SampleModel, error)
    AddSomeXData(someData model.SampleModel) (string, error)
    UpdateSomeXData(id string, someData model.SampleModel) (string, error)
    DeleteSomeXData(id string) (string, error)
    ListSomeXData(page, limit int) ([]model.SampleModel, int, error)
}
```

The facade's **primary CRUD methods** (`Create`, `GetByID`, `Update`, `Delete`, `List`)
delegate to the **PostgreSQL** implementation only — PG is the primary/canonical store for
this sample domain. The facade **also** exposes explicit per-database methods (`TTAdd`,
`PGAdd`, `OracleAdd`, `MSSQLAdd`, and their `Get` counterparts) so a caller can
deliberately fan out to all four engines — this is what `SampleService.CallAllRepositories`
does, purely as a **demonstration** of multi-DB access, not a real business pattern to
imitate as-is.

## Ownership of SQL

SQL strings live in `model/sampleModel.go` as package-level `var SQL_simple_<db>_<verb>`
constants — **not** inline in the repository method bodies, and not in separate `.sql`
files loaded at runtime. Each repository method references the constant for its DB/verb.
This keeps the query text next to the struct it maps to, at the cost of `model/` importing
nothing but knowing about 4 SQL dialects — acceptable at 1 domain, would want a
`model/<domain>_sql.go` per domain (not per verb) once there are more than 2–3 domains.

## Parameter binding — no SQL injection risk found

| DB | Style | Verified safe |
|---|---|---|
| PostgreSQL | `$1, $2, $3` positional, via `stmt.Exec(...)` / `QueryContext(ctx, sql, args...)` | ✅ |
| MS SQL | `sql.Named("id", id)` etc. | ✅ |
| Oracle | `:1, :2, :3` positional, via `db.QueryContext(ctx, sql, id)` | ✅ |
| Tarantool | `?` positional via `box.execute(sql, params)` (Lua eval), args passed as a slice, never string-concatenated | ✅ |

No repository method builds a query by string concatenation/`fmt.Sprintf` with
caller-supplied data. This holds for the sample domain; **it is a convention to enforce by
code review, not something enforced by tooling** — nothing prevents a future domain
repository from using `fmt.Sprintf` into a query string.

## Read/write routing lives in the repository, not the facade

`samplePGRepository` and `sampleTTRepository` (the two DBs with dual pools) explicitly
call the **read** accessor (`GetPGReadDB()` / `evalRead()` via `GetTTReadPool()`) for
`Get*`/`List*` and the **write** accessor (`GetPGWriteDb()` / `GetTTPool()`) for
`Add*`/`Update*`/`Delete*`. This routing decision is made **inside each method**, not
centralized — a new PG/TT repository method must remember to call the correct accessor;
there's no interface-level enforcement that reads can't accidentally hit the write pool
(that would actually be harmless correctness-wise, just a missed optimization) or, worse,
that a write accidentally goes to a *read replica* (that would silently fail or diverge —
worth a lint rule or code-review checklist item in a real project).

## Error/status convention

Every write method returns `(string, error)` where the string is one of
`"COMPLETE"`, `"NOT_FOUND"`, `"ERROR"`, or (Tarantool add only) `"OK"` — **inconsistent
even within this one template** (`AddSomeTTData` returns `"OK"` while every other `Add*`
returns `"COMPLETE"`). `NOT_FOUND` is derived from `RowsAffected() == 0` after an
UPDATE/DELETE — correct approach for detecting a no-op write — but the underlying `error`
return is `nil` in the `NOT_FOUND` case, so callers must check the **string**, not just the
error, to detect "not found." This is an easy footgun for a new repository author who
only checks `err != nil`.

## How to add a repository for a new database engine

1. Define `SampleXRepository` (or, for a new domain, `<Domain>XRepository`) with the same
   5-method shape (`Get`, `Add`, `Update`, `Delete`, `List`) for consistency, though the
   method set can grow per domain need.
2. Decide: does this DB need dual read/write pools? If yes, follow the PG/TT
   package-level-pool pattern (§DATABASE-ARCHITECTURE.md) and give your repository a
   no-argument constructor. If no, add fields to `DBManager` and follow the
   MSSQL/Oracle single-pool pattern with a `*DBManager`-argument constructor.
3. Add SQL constants to the relevant model file, one per verb, using the target DB's
   native parameter placeholder style — never string-concatenate caller input into SQL.
4. Wire the new repository into the facade (or a new facade, if it's a new domain) and
   into `router/sampleRouter.go`'s manual DI block.
5. Add a migration file under `sql/<engine>/` following the existing `Vn__description.sql`
   naming — but note there is **no migration runner** wired up; someone (or some future
   CI step) must apply these files by hand or introduce a tool (golang-migrate/goose).

## Document Status

Draft for Review — verified against all five files in `repository/`, 2026-08-21.
