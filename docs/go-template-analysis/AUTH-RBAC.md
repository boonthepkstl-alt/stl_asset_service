# Authentication & Authorization (RBAC)

## Authentication mechanism: JWT (HS256), classified **DEMO**

- Token issuance: `util.GenerateToken(userID, username, role, fullName)`
  (`util/jwtUtils.go`) — HS256-signed via `golang-jwt/jwt/v5`, secret from `JWT_SECRET`
  env var (no default — an empty secret would sign with an empty key, which is a
  deployment-configuration risk, not a code defect: **`JWT_SECRET` must be set and must
  not be empty in any real environment**). Expiry from `JWT_EXPIRE_HOURS` (default 24h).
  Each token gets a random 16-byte hex JTI (`generateJTI`) used later for blacklisting.
- Token transport: **both** an `Authorization: Bearer <token>` header **and** an
  `HttpOnly` cookie named `stl_token` are supported by `middleware.JWTAuth()` (header
  takes precedence if present). The login endpoint sets the cookie; nothing sets the
  header from the server side (a browser client would rely on the cookie, an API client
  on the header).
- Cookie flags: `Secure`/`SameSite` chosen by `authCookieOptions()` based on
  `APP_ENV`/`ENV` — `local|dev|development|test` → `Secure=false, SameSite=Lax`; anything
  else (including unset) → `Secure=true, SameSite=None`. **Note**: `SameSite=None`
  requires `Secure=true` per browser spec, which this satisfies — correct pairing.
- Credential check (`service/authService.go`): a **single hardcoded demo account**,
  sourced from `AUTH_DEMO_USERNAME`/`AUTH_DEMO_PASSWORD`/`AUTH_DEMO_ROLE`/
  `AUTH_DEMO_FULL_NAME` env vars (defaulting to `admin`/`password`/`admin`/`Template
  Admin` if unset), compared with a plain `==` string comparison (not
  constant-time — a timing side-channel exists in theory, low practical severity for a
  single demo account, see SECURITY-REVIEW.md). **There is no user table, no repository
  call, no password hashing anywhere in the auth path.** The template's own README
  explicitly documents this as a placeholder ("Replace the demo auth service with a
  repository-backed user lookup when starting a real project") — restated here because
  it is the single most important integration point for any real project.
- Logout / revocation: `AuthController.Logout` reads the JWT (from the cookie), extracts
  its JTI, and calls `util.BlacklistToken(jti, expiresAt)`. `middleware.JWTAuth()` checks
  `util.IsTokenBlacklisted(claims.ID)` on every request.

## Classification: **DEMO**, not production-ready, for three independent reasons

1. **No real credential store.** A production system needs a user repository (with
   hashed passwords — no hashing library is even a dependency yet) — this is a full
   rewrite of `AuthService.Login`, not a config change.
2. **Blacklist is single-instance, in-memory, and never garbage-collected.**
   `tokenBlacklist` (`util/tokenBlacklist.go`) is a package-level `map[string]int64`
   guarded by a mutex. `cleanupBlacklist()` (which deletes expired entries) is only ever
   called from `StartBlacklistCleanup()`, and **`StartBlacklistCleanup()` is never called
   from `main.go` or anywhere else** — confirmed by repo-wide grep. Consequences:
   - The map grows **unbounded** for the lifetime of the process — every logout leaks
     one entry permanently until process restart.
   - In a **multi-instance deployment** (more than one replica behind a load balancer),
     a logout on instance A does not revoke the token on instance B — the blacklist is
     not shared (no Redis/DB backing). Logout is effectively **best-effort single-node
     only** today.
3. **No refresh-token flow.** Tokens are stateless bearer tokens with a fixed expiry;
   there is no refresh endpoint, so a client must re-login when the token expires.

## Authorization / RBAC: **defined but not enforced**

- `middleware.RequireRole(roles ...string) fiber.Handler` (`middleware/jwtAuth.go`) is
  fully implemented: reads `role` from `c.Locals`, allows `admin` unconditionally, allows
  any role in the given list, otherwise 403.
- The JWT claims (`util.JWTClaims`) carry a `Role` field, and `middleware.JWTAuth()` does
  put it into `c.Locals("role")` on every authenticated request.
- **However, `RequireRole` is never attached to any route in `router/sampleRouter.go`.**
  Grep confirms zero call sites outside its own definition. Every route behind
  `middleware.JWTAuth()` currently requires only "any valid, non-blacklisted JWT" — there
  is **no role differentiation enforced anywhere today**, despite the primitive existing
  and despite the demo login flow issuing a `role` claim (`admin`, or whatever
  `AUTH_DEMO_ROLE` is set to).
- **Recommended flow once wired** (this is the intended shape, not yet realized):
  ```
  Role (JWT claim, set at login)
       ↓
  Permission (not modeled at all yet — no permission concept exists, only role strings)
       ↓
  Middleware (middleware.RequireRole("editor", "admin"), attach per-route)
       ↓
  Handler (controller method)
  ```
  There is no `Permission` type/table/concept in this codebase — only bare role strings
  compared for equality. A real RBAC system with permissions-per-role would need to be
  designed from scratch; do not assume one exists because `RequireRole` is present.

## `BYPASS_JWT` — a development escape hatch with a footgun if misconfigured

When `BYPASS_JWT=true` **and no token is presented at all** (no header, no cookie),
`middleware.JWTAuth()` injects a synthetic identity (`BYPASS_JWT_USER_ID`/`_USERNAME`/
`_ROLE`, defaulting to `bypass-user`/`bypass-user`/**`admin`**) and calls `c.Next()` — i.e.
**every unauthenticated request is treated as an admin** when this flag is on. This is
clearly meant for local development only, but it is an env-var flag with no other
safeguard (no "never true outside dev" assertion, no environment check). **A required
action before any non-local deployment is to guarantee `BYPASS_JWT` is unset/false** —
this should be called out explicitly in deployment checklists/CI, not just left to
convention.

## Dead code: `middleware.ServiceAuth()`

A separate API-key-based middleware for service-to-service calls
(`middleware/serviceAuth.go`) exists, comparing an `apikey` header against
`INTERNAL_API_KEY` env var. It is **fully implemented but never attached to any route** —
confirmed by grep. If a real project needs internal-service authentication, this is a
ready-to-wire building block, but currently does nothing.

## Document Status

Draft for Review — verified against `middleware/jwtAuth.go`, `middleware/serviceAuth.go`,
`service/authService.go`, `controller/authController.go`, `util/jwtUtils.go`,
`util/tokenBlacklist.go`, and a repo-wide grep for call sites, 2026-08-21.
