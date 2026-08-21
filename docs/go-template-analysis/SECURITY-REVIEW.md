# Security Review

Source-level review only. No secrets are reproduced in full below where redaction is
appropriate; sample/demo values already committed in the template's own source are named
because they are demo values, not real production secrets, and identifying them is the
point of this section.

## CRITICAL

None found that would compromise a production system **as long as the template's own
documented demo-auth caveat is heeded**. The items below are HIGH because they require a
deliberate fix before go-live, not because the template is unsafe to use as a starting
point.

## HIGH

1. **Hardcoded API key committed in source.** `handler/sampleHandler.go:45`:
   `req.Header.Add("apikey", "9KzNGvXB")`. This is a demo/placeholder call to an external
   sample endpoint, but it is a real hardcoded credential-shaped string sitting in
   version control. **Required action:** remove before this file is adapted for a real
   external integration; the key should come from config/secrets, never a literal.
2. **Authentication has no real credential store** (see AUTH-RBAC.md). Deploying this
   template's auth layer unmodified to any environment with real users/data would let
   anyone who knows (or guesses/leaks) `AUTH_DEMO_USERNAME`/`AUTH_DEMO_PASSWORD` — which
   default to `admin`/`password` if the env vars are simply not set — log in as an
   admin-role principal. **Required action before project start:** replace
   `AuthService.Login` with a real, hashed-password, repository-backed check.
3. **`BYPASS_JWT=true` grants admin to unauthenticated requests** when no token is
   presented at all (AUTH-RBAC.md). **Required action:** ensure this flag is
   unset/false in every non-local environment; consider adding a startup guard that
   refuses to boot with `BYPASS_JWT=true` when `ENV` is not `local/dev/development/test`.

## MEDIUM

4. **Internal error messages leaked to API clients.** Multiple controller error paths
   (`CreateSample`, `UpdateSample`, `DeleteSample`, `ListSamples`) put the raw
   `err.Error()` from a repository/DB call directly into the JSON response body
   (`controller/sampleController.go`). A `database/sql` driver error can surface schema
   details, table/column names, or (in rarer cases) fragments of the failed statement.
   **Recommendation:** log the detailed error server-side (already done) and return a
   generic client-facing message; reserve detail for logs/traces.
2. **JWT blacklist is an unbounded, unshared, in-memory map** (AUTH-RBAC.md) —
   availability/consistency issue more than a confidentiality one, but flagged here too
   because an attacker who can force many logout calls could grow the map indefinitely
   (a resource-exhaustion vector, however minor, on top of the multi-instance revocation
   gap).
3. **Plaintext credential comparison** for the demo login
   (`username != demoUsername || password != demoPassword` in `authService.go`) — not
   constant-time. Low real-world impact for a single demo string, but should not be
   copied forward into a real user-lookup implementation (use a constant-time compare,
   or better, hash comparison via a password-hashing library).
4. **Demo bootstrap SQL scripts contain hardcoded plaintext credentials**:
   `sql/oracle/V0_Prepare_Schema.sql` (`hr`/`hr`, `appuser`/`apppassword`) and
   `sql/tt/V0__Initial_Table.txt` (`mysecretpassword`). These are local
   Docker/dev-bootstrap instructions, not runtime application config, so the severity is
   contained — but they should be scrubbed or clearly marked "local-dev-only, never
   reuse" if this template's `sql/` folder is copied into a real project's repo.

## LOW / INFO

5. **No rate limiting** on `/api/auth/login` or any other endpoint — Fiber ships a
   `limiter` middleware package that is not used here. A real deployment should add
   login-attempt throttling at minimum.
6. **No CSRF protection.** Because auth can flow through a cookie (`stl_token`), and the
   cookie is not paired with any CSRF token/double-submit pattern, a state-changing
   endpoint reachable via a simple cross-site form (if any existed with a
   browser-simple content type) would be a CSRF risk. Currently all mutating routes
   expect JSON bodies (which browsers can't easily send cross-site without CORS
   preflight), and CORS defaults to a specific allow-list, which mitigates this — but it
   is not a designed-in CSRF defense, just an incidental one.
7. **CORS default is reasonably safe**: `CORS_ALLOW_ORIGINS` defaults to
   `http://localhost:3000,http://localhost:5173` (not `*`), and `AllowCredentials` is
   only enabled when the origin list isn't `*` — correct pairing, no finding here beyond
   "verify this env var is set correctly per environment before go-live."
8. **No security headers middleware** (no `helmet`-equivalent: no
   `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy` set anywhere).
   Not necessarily wrong for a pure JSON API with no server-rendered HTML, but worth a
   deliberate decision rather than a silent gap.
9. **Sensitive-value masking utility (`go-masker`) is a dependency but essentially
   unused** — it's called once, in `util/infisicalUtils.go`'s debug `fmt.Println` of
   secret values pulled from Infisical, and nowhere else. Request/response logging
   elsewhere (e.g. `log.Debugf("input: %v", someData)` patterns throughout
   controllers/services) does **not** run through any masking — if a real domain model
   ever carries PII/secrets, those `%v`/`%#v` debug logs would print them verbatim at
   DEBUG level. Not a finding against the sample domain (it has none), but a
   process risk to flag for whoever adds the first PII-bearing domain model.
10. **No explicit `context.Context` timeout on MSSQL/Oracle health pings**
    (`m.MSSQLDb.Ping()` / `m.OracleDb.Ping()` use `context.Background()` internally) —
    an unreachable/hanging network path could stall `/health`. PostgreSQL and Tarantool
    health checks are properly bounded. Availability concern, not confidentiality.

## Explicitly checked and clear

- **SQL injection**: every repository parameterizes correctly for its DB's native
  placeholder style (see REPOSITORY-PATTERN.md) — no string-concatenated queries found.
- **Auth bypass via missing checks**: JWT signature and expiry are validated
  (`jwt.ParseWithClaims` with an explicit HMAC-method check, rejecting `alg: none` /
  asymmetric-substitution attacks).
- **Unsafe deserialization**: only `encoding/json` is used for request/response bodies;
  no `encoding/gob`, no reflection-based dynamic type instantiation from untrusted input.
- **Panic safety**: `middleware.Recovery()` catches panics globally and logs a full
  stack trace server-side while returning a generic 500 to the client — correct pattern,
  no stack trace leaks to the client.

## Document Status

Draft for Review — source-level review only; no secrets scanning tool was run beyond
manual inspection and targeted grep, 2026-08-21.
