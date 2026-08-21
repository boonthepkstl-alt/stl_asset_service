# Service Pattern

## Verdict: THIN, with one deliberately fat demonstration method

`service/sampleService.go` and `service/authService.go` are both thin orchestration
layers: they call into a repository/util and translate the result, with almost no
independent business logic of their own.

| Method | What it actually does | Business logic present? |
|---|---|---|
| `CreateSample` | Generate a UUID if the caller didn't supply an ID; delegate to `sampleRepo.Create` | Minimal (ID generation policy) |
| `GetSample` / `UpdateSample` / `DeleteSample` | Pure pass-through to the facade | None |
| `ListSamples` | Delegate to `sampleRepo.List`, then compute `TotalPages = ceil(total/limit)` | Minimal (pagination math) |
| `Health` | Pass-through to `dbManager.Health()` | None |
| `SampleServiceFunction` | Calls `handler.SampleFunction("TEST")`, returns `"OK"`/`"ERROR"` — a scaffold placeholder | None — clearly a "replace me" stub |
| `CallAllRepositories` | Fans out to **all four** per-DB repository methods, collects per-call errors into a `map[string]string`, never returns a hard error itself | This is a **demonstration** of multi-DB orchestration and partial-failure handling, not a real business operation — do not model new domain logic on this method's shape |
| `AuthService.Login` | Compares username/password against **hardcoded env-var defaults** (`admin`/`password`/`admin`/`Template Admin` if env unset), then calls `util.GenerateToken` | This is the entire "business logic" of auth today — see AUTH-RBAC.md |

## Transaction ownership

**No service method opens a transaction.** `DBManager.WithTransaction` exists
(DATABASE-ARCHITECTURE.md) but nothing calls it. Every current service method maps to
exactly one repository call, so there is no multi-step business operation yet that would
need transactional consistency. When a real domain adds one (e.g., "transfer an asset
between two custodians" touching two rows/tables), the service layer — not the
repository or controller — should own the transaction boundary: open it via
`dbManager.WithTransaction(dbManager.GetPGWriteDb(), func(tx *sql.Tx) error { ... })`
(once a transaction-aware repository method variant exists to accept a `*sql.Tx`, which
does not exist today — the sample repositories only accept a bare `*sql.DB`/pool, not a
`*sql.Tx`). **This is a gap to design before the first cross-row business operation is
built**, not something the template solves for you.

## Validation

Almost none exists at the service layer. `CreateSample` validates nothing about
`Column1`/`Column2` content; `AuthService.Login` only checks for empty
username/password. Struct-tag-based validation (e.g. `go-playground/validator`) is not a
dependency of this template — any real domain will need to add both a validation library
and the discipline to call it, most naturally right after `c.BodyParser` in the
controller or as the first statement in the corresponding service method.

## Error handling

Services largely return the underlying repository error unwrapped (e.g. `GetSample`
returns `obj.sampleRepo.GetByID(id)` verbatim). The one place errors are given richer
context is `CreateSample`, which returns a fresh `fmt.Errorf("failed to create record")`
when the repo reports the sentinel string `"ERROR"` — note this **discards** the original
underlying `error` in that specific branch, replacing it with a generic message; the
original error is still logged via `log.Errorf` first, so it's not lost operationally, but
it is lost to the caller.

## Recommended pattern for future domains

- Keep services thin for pure CRUD; that's the template's own norm and it's a reasonable
  default.
- Put a real validation step at the top of each service method that accepts external
  input, once a validation library is chosen (currently undecided — flag as an open
  question for the next real project, not something to invent unilaterally here).
- Any operation touching more than one row/table across a call boundary should open a
  transaction in the **service**, using `DBManager.WithTransaction` (extending the
  repository interfaces to accept a transaction handle where needed) rather than issuing
  multiple independent repository calls that can partially fail.
- Do not copy `CallAllRepositories`'s "call every DB, collect partial errors" shape into
  real domain code unless the actual requirement is genuinely "best-effort write to N
  independent stores" — for anything that needs to be atomic, that shape is wrong.

## Document Status

Draft for Review — verified against `service/sampleService.go` and `service/authService.go`,
2026-08-21.
