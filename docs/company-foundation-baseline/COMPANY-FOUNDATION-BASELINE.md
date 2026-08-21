# Company Foundation Baseline

## Purpose and scope

This document synthesizes two independent, read-only audits —

- **Go backend template** (`go-template-main`, module `singer/go-template-new-2026-06`) —
  see [`../go-template-analysis/`](../go-template-analysis/INDEX.md)
- **React frontend template** (`react-template-main`) — see
  [`../template-analysis/`](../template-analysis/INDEX.md)

— into a single **Company Foundation Baseline**: what a real project (including RAISE)
should inherit as-is, what must be fixed before inheriting it, what must be built out
further, what is each individual project's own responsibility rather than the
foundation's, and what should be dropped rather than carried forward.

**Neither template was modified to produce this document.** All decisions below are
traced to a specific finding in one of the two source audits; nothing here introduces a
new claim about either codebase that wasn't already established there. Two claims from
the frontend audit (`zustand` unused, `role` field unreferenced outside its own type) were
independently re-verified by grep before being relied on here.

This document is about **infrastructure/template readiness**, not about RAISE's business
domain. Per the project's own working rule, RAISE's requirements live solely in
[`docs/01-requirements/RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) — nothing below
should be read as inventing or expanding RAISE's functional scope. Where RAISE is
mentioned, it is only as "the first real consumer of this baseline," not as a source of
new requirements.

## How to read the decision tables

| Decision | Meaning |
|---|---|
| **KEEP** | Works correctly as shipped. Adopt directly into new projects with no change. |
| **FIX** | Present but wrong, unsafe, or inconsistent. Must be corrected in the template (or in a documented wrapper) before any project builds on it. |
| **EXTEND** | Present but incomplete for real use. The mechanism/skeleton is sound; the missing part must be built out — by the foundation team if it's cross-project, by the individual project if it's domain-specific (see PROJECT). |
| **PROJECT** | Foundation should provide a *pattern*, not a finished implementation. Each project (including RAISE) builds its own instance of this. |
| **REMOVE** | Dead, unused, or actively misleading. Delete rather than carry forward; do not let new projects discover and depend on it by accident. |

---

## 1. Backend decisions (Go template)

| Area | Decision | Why (source finding) |
|---|---|---|
| Layered architecture (controller→service→repository→DB), manual constructor DI | **KEEP** | Traceable, framework-free, easy to mock in tests — ARCHITECTURE.md |
| `main.go` bootstrap/shutdown sequence | **KEEP** | Correct ordering (HTTP stops before DB pools close); fail-soft startup is a deliberate, reasonable choice — ARCHITECTURE.md |
| PostgreSQL/Tarantool dual read-write pool (hot-reload, round-robin health-checked reads) | **KEEP** | Genuinely production-grade; the two-mutex deadlock-avoidance design is subtle and already correct — DATABASE-ARCHITECTURE.md |
| MSSQL/Oracle single-pool pattern | **KEEP, EXTEND if a real project needs read replicas on either** | Works correctly for a single pool; has no read/write split today — DATABASE-ARCHITECTURE.md |
| Repository parameter binding (per-engine placeholder styles) | **KEEP** | No SQL injection found in any of the four engines — REPOSITORY-PATTERN.md, SECURITY-REVIEW.md |
| `DBManager.WithTransaction` | **KEEP mechanism, EXTEND usage** | Correctly panic-safe and rollback-safe, but zero call sites exist — the first cross-row write in any real domain must exercise it — DATABASE-ARCHITECTURE.md |
| `shipped architecture.md`'s `DBManager` field description | **FIX** | Factually wrong — claims `PGDb`/`TTPool` struct fields that don't exist — ARCHITECTURE.md discrepancy table |
| `controller.Ping` method + its `version` constant | **REMOVE** | Dead code; the live `/ping` route is an unrelated inline closure in the router — ARCHITECTURE.md |
| `AuthService.Login` (demo credential check) | **FIX before any real deployment** | Single hardcoded env-var account, plaintext compare, no user store, no hashing dependency — AUTH-RBAC.md |
| `middleware.RequireRole` | **KEEP mechanism, FIX wiring** | Correctly implemented, attached to **zero routes** — must be wired once a role model is decided — AUTH-RBAC.md |
| `middleware.ServiceAuth` | **KEEP mechanism, dormant until needed** | Fully implemented, never called — do not delete (useful for future internal service-to-service calls), but do not assume it's protecting anything today — AUTH-RBAC.md |
| `util.StartBlacklistCleanup` | **FIX — must be called** | Function exists but is never invoked from `main.go`; blacklist grows unbounded without it — AUTH-RBAC.md, SECURITY-REVIEW.md |
| JWT blacklist (in-memory map) | **EXTEND for multi-instance** | Correct for single-instance; does not propagate revocation across replicas — needs a shared store (Redis/DB) before horizontal scaling — AUTH-RBAC.md |
| `BYPASS_JWT` escape hatch | **FIX — needs a hard guard** | Grants admin to unauthenticated requests when no token is presented; currently only convention (not enforced) keeps it off outside dev — SECURITY-REVIEW.md |
| Hardcoded API key in `handler/sampleHandler.go` | **REMOVE** | Committed demo credential; must not be copied into any real integration — SECURITY-REVIEW.md |
| Raw `err.Error()` returned to API clients on 5xx paths | **FIX** | Leaks internal DB/driver detail to clients — SECURITY-REVIEW.md, API-ARCHITECTURE.md |
| `fiber.Map` ad-hoc error envelopes | **FIX — needs a single shared type** | Two inconsistent shapes already exist across handlers; will drift further per new domain — API-ARCHITECTURE.md |
| API versioning (`/api/...`, no `/v1`) | **EXTEND before any external client depends on it** | No versioning mechanism exists at all — API-ARCHITECTURE.md |
| Pagination envelope (`{data,total,page,limit,total_pages}`) | **KEEP** | Consistent, sane, works today — API-ARCHITECTURE.md |
| Filtering/sorting | **PROJECT** | Not modeled at all; each domain's query needs differ enough that this is not a one-size foundation concern | API-ARCHITECTURE.md |
| Repository facade shape (5-method CRUD interface per engine) | **KEEP as convention, PROJECT for instances** | The *pattern* generalizes; each domain builds its own repository following it — REPOSITORY-PATTERN.md |
| `util.SomeUtilMethods` placeholder | **REMOVE** | No real logic, a scaffold-only stub — BACKEND-STRUCTURE.md |
| `SampleService.SampleServiceFunction` / `CallAllRepositories` / `POST /sample` route | **REMOVE from any real project's copy** | Demonstration-only scaffolding; do not model real business logic on their shape — SERVICE-PATTERN.md |
| Migration files (`sql/*/Vn__*.sql`, no runner) | **EXTEND** | Naming looks migration-tool-ready but nothing applies them automatically — a tool decision (golang-migrate/goose, or scripted apply) is required — BACKEND-STRUCTURE.md, DATABASE-ARCHITECTURE.md |
| Demo credentials in local bootstrap SQL scripts (`hr`/`hr`, `mysecretpassword`, etc.) | **FIX (scrub or mark clearly local-only)** | Low severity but should not be copied verbatim into a real project's repo — SECURITY-REVIEW.md |
| Logging (`logger/`, logrus + nested formatter + Logstash hook) | **KEEP** | Solid, works, correctly injects trace/span IDs — TEMPLATE-READINESS-REVIEW.md |
| OpenTelemetry tracing | **KEEP (opt-in)** | Fully wired end-to-end, off by default via `OTEL_ENABLED` — TEMPLATE-READINESS-REVIEW.md |
| Metrics endpoint | **PROJECT/EXTEND** | Missing entirely; no Prometheus client dependency exists — TEMPLATE-READINESS-REVIEW.md |
| Liveness vs. readiness distinction | **EXTEND** | Only one readiness-style `/health` exists — TEMPLATE-READINESS-REVIEW.md |
| Integration-style controller tests (httptest + real DB, host-guarded teardown) | **KEEP** | Genuinely good pattern, keep as the project convention — TESTING-STANDARD.md |
| Mocked unit tests at service/repository level | **EXTEND** | None exist; every non-trivial assertion depends on a live DB today — TESTING-STANDARD.md |
| Docker packaging | **EXTEND** | Confirmed absent — TEMPLATE-READINESS-REVIEW.md |
| CI/CD pipeline | **EXTEND** | Confirmed absent (no `.github/`, no Makefile) — TEMPLATE-READINESS-REVIEW.md |
| Rate limiting, security-headers middleware | **EXTEND** | Neither exists; Fiber ships a limiter package that isn't used — SECURITY-REVIEW.md |
| `go-file-rotatelogs` dependency | **FIX (long-term, not urgent)** | Unmaintained upstream since ~2018 — DEPENDENCY-REVIEW.md |
| `denisenkom/go-mssqldb` dependency | **FIX (watch, not urgent)** | Superseded by a more active fork; acceptable to keep unless MSSQL support expands significantly — DEPENDENCY-REVIEW.md |

## 2. Frontend decisions (React template)

| Area | Decision | Why (source finding) |
|---|---|---|
| Bootstrap (`main.tsx`→`App.tsx`: ErrorBoundary→BrowserRouter→AuthProvider→Routes) | **KEEP** | Coherent, working shell — ARCHITECTURE.md |
| `ProtectedRoute` mechanism (binary authenticated-or-not gate) | **KEEP mechanism, EXTEND for roles** | Works correctly for its one job; has no role/permission parameter — AUTH-RBAC.md |
| Route table defined inline in `App.tsx` | **KEEP for now, EXTEND once page count grows** | Followable, but not tooling-enforced; fine at 2 pages — ARCHITECTURE.md |
| Lazy-loading / code-splitting | **PROJECT/EXTEND** | Missing entirely; each project should add `React.lazy`+`Suspense` once its page count justifies it — ARCHITECTURE.md |
| 404/not-found route | **FIX** | Missing; unmatched paths render nothing — ARCHITECTURE.md |
| Root-only `ErrorBoundary` | **EXTEND** | A crash in one page currently takes down the whole shell; per-route/per-section boundaries should be added as pages multiply — ARCHITECTURE.md |
| Shared `<AppLayout>`/nav shell | **FIX** | Does not exist; each protected page must remember to render `<Navbar/>` itself — ARCHITECTURE.md |
| `ROUTES` constants map (`config/constants.ts`) | **FIX — wire it up, do not leave unused** | Exists specifically to prevent nav/route drift but is imported by neither `App.tsx` nor `Navbar.tsx` — re-verified by grep in this session — ARCHITECTURE.md |
| `useLocalStorage` hook | **FIX — wire it up** | `AuthContext` duplicates its exact logic via direct `localStorage` calls instead of using the hook that already exists — re-verified by grep — ARCHITECTURE.md |
| `checkAuth` startup validation endpoint | **FIX — call it** | Defined in `services/api.ts`, never invoked — a restored `localStorage` token is trusted client-side with no server validation until the next request 401s — AUTH-RBAC.md |
| Zustand dependency | **REMOVE (or adopt deliberately)** | Installed, zero imports anywhere in `src/` — re-verified by grep in this session. A project may legitimately choose to use it, but that is a new decision, not inherited usage — DEPENDENCY-REVIEW.md |
| `role` field on `User` type | **EXTEND — build the whole authorization layer** | Exists only as a type; zero other references anywhere — re-verified by grep. Do not treat as "half-built" — AUTH-RBAC.md |
| JWT stored in `localStorage` | **FIX before production security review** | XSS-exfiltration risk if any future XSS is introduced (none exists today) — a go/no-go decision, addressed in Cross-Platform Standards §4 below — SECURITY-REVIEW.md |
| Axios interceptor mechanism (auth header injection, 401 handling) | **KEEP mechanism, FIX the blunt full-reload-on-any-401 behavior** | Correct approach, too broad a blast radius — API-ARCHITECTURE.md, SECURITY-REVIEW.md |
| `APIResponse<T>` envelope type | **FIX — resolve the ambiguity before adding more service files** | Defined but unused; each new service currently free to invent its own shape — API-ARCHITECTURE.md |
| Page/`_components` folder convention, `@/` path alias | **KEEP** | Scales reasonably for small-to-medium apps — ARCHITECTURE.md |
| `Loading`, `Navbar`, `ErrorBoundary` components | **KEEP mechanism, EXTEND `Navbar` to be data-driven/configurable** | Genuinely reusable but `Navbar` is currently hardcoded with no nav items — DESIGN-SYSTEM.md (frontend audit) |
| Design-system primitives (Button/Input/Select/Modal/Table) | **PROJECT/EXTEND** | None exist; every page hand-writes raw Tailwind — a foundation-level decision (build a shared component library once, before RAISE, vs. per-project) is an **unresolved decision**, see §6 |
| Testing (any kind) | **EXTEND** | Zero tests, zero framework, zero CI check beyond the TypeScript compiler — TESTING-STANDARD.md |
| CI/CD pipeline | **EXTEND** | Confirmed absent — ARCHITECTURE.md (frontend audit) |
| Dockerfile (multi-stage, nginx) | **KEEP shape, FIX nginx SPA-fallback config** | Reasonable starting point, but ships default nginx config with no `try_files` fallback — deep links/refreshes will 404 as delivered — ARCHITECTURE.md, TECH-STACK.md (frontend audit) |
| README/SETUP accuracy | **FIX** | Several stale claims (Router "6" vs actual 7, Zustand described as active, file-structure diagram mismatches, referenced `.env` files that don't exist) — TEMPLATE-READINESS-REVIEW.md (frontend audit) |
| `logger.warn`/`logger.error` not gated by `isDevelopment` | **FIX (low severity)** | Only `info`/`debug` are gated; production console gets internal error detail — SECURITY-REVIEW.md (frontend audit) |
| Accessibility (ARIA, live regions, focus management) | **EXTEND** | Basic semantic HTML/labels present; no `aria-*` anywhere, no live-region announcements — ARCHITECTURE.md (frontend audit) |
| i18n | **PROJECT** | Not present; frontend audit notes 100% hardcoded Thai UI strings today — a per-project decision, not a foundation mandate unless the company standardizes on one i18n library across projects (see §6) |

---

## 3. Target backend architecture (post-fix, pre-domain)

```
                        ┌─────────────────────────────────────────┐
                        │   main.go  (renamed module per project)  │
                        │   - util.Init() config/secrets/logging   │
                        │   - InitTracing (OTel, opt-in)            │
                        │   - InitTT() / InitPG()  (package pools)  │
                        │   - InitMSSQLPool / InitOraclePoolWithOpts│
                        │   - fiber.New + CORS + audit logger       │
                        │   - router.SetupRoutes(app, dbManager)    │
                        │   - graceful shutdown (SIGINT/SIGTERM)    │
                        └───────────────────┬───────────────────────┘
                                            │
                app.Use(Tracing) → app.Use(Recovery) → app.Use(RateLimit *NEW*)
                                            │
                        /api/v1  (versioned — FIX from today's /api)
                            ├── public: /ping, /auth/login
                            └── protected (JWTAuth):
                                 ├── role-gated where needed (RequireRole *WIRED*)
                                 └── /health, /<domain>/...
                                            │
     ┌──────────────────────────────────────┼──────────────────────────────────────┐
     ▼                                      ▼                                      ▼
[ Controller ]                     [ Controller ]                          [ Controller ]
 shared error-response type *NEW*   (per domain, following sample shape)
     │                                      │
     ▼                                      ▼
[  Service   ]  — thin CRUD + real validation *NEW where domain needs it*
     │              transaction boundary via DBManager.WithTransaction for multi-row ops
     ▼
[ Repository ]  — facade + per-engine impl, same 5-method CRUD shape
     │
     ▼
[  DBManager  ]  — MSSQL/Oracle single-pool  |  package-level PG/TT dual-pool (unchanged)
     │
     ▼
 PostgreSQL / MSSQL / Oracle / Tarantool
```

Additions relative to today's shipped template, all traced to a FIX/EXTEND decision
above: API versioning, a shared error-response type, `RequireRole` actually attached to
routes, a rate-limiter middleware, `StartBlacklistCleanup` called at startup (or the
blacklist externalized), and a decided migration-tool story. Everything else in the
diagram is unchanged from the audited template.

## 4. Target frontend architecture (post-fix, pre-domain)

```
main.tsx
 └─ ErrorBoundary (root)
     └─ BrowserRouter
         └─ AuthProvider  — uses useLocalStorage *FIXED*, calls checkAuth on mount *FIXED*
             └─ AppLayout *NEW — shared shell, Navbar rendered once, not per-page*
                 └─ Routes  (driven by ROUTES constant *FIXED — no longer unused*)
                      ├─ /login                          (public)
                      ├─ ProtectedRoute (auth only)       → existing pages
                      ├─ RoleProtectedRoute *NEW*          → role-gated pages, once RBAC model is decided
                      ├─ * (404 catch-all) *NEW*
                      └─ per-route/per-section ErrorBoundary *EXTEND, as page count grows*
```

State management (unchanged pattern, decision recorded not re-litigated):
`useState` for page-local UI state; React Context for cross-cutting session/domain state
(`AuthContext`'s own pattern); the existing `useFetch` hook (or a project-specific
evolution of it) for simple server-state reads. Zustand is either removed or adopted
deliberately for one real piece of state — not left installed-and-unused (§6, open
decision on *which*).

API layer: single Axios instance (kept), request/response interceptor mechanism kept,
but the blunt "any 401 → hard reload" behavior scoped down to distinguish
session-expired-globally from a single endpoint's access-denied response, and the
`APIResponse<T>` envelope either actually unwrapped everywhere or removed — not left
ambiguous.

---

## 5. Cross-platform standards

These are the contracts the backend and frontend baselines must agree on, so that
building RAISE (or any project) against both foundations doesn't require inventing this
per-project. Each standard below states the current state on each side, the target, and
who owns closing the gap.

### 5.1 API contract

| Aspect | Backend current | Frontend current | Target | Owner |
|---|---|---|---|---|
| Base path/versioning | `/api/...`, no version | `/api/...` (mirrors backend) | `/api/v1/...` on both sides before any real client ships | Backend introduces the segment; frontend's `API_ENDPOINTS`/base URL config follows |
| Success envelope | Direct entity/collection JSON, no wrapper | `APIResponse<T>` type defined, unused | Pick **one**: either every response is wrapped (`{data, meta}`-style) or none are — currently **unresolved**, see §6 |
| Error envelope | Ad-hoc `fiber.Map`, 2+ inconsistent shapes | Axios interceptor assumes some error shape implicitly | One shared `{status, message, code?}` shape, backend-defined, frontend types generated/hand-kept in sync | Backend defines it; frontend's `types/api.ts` mirrors it |
| Pagination | `{data,total,page,limit,total_pages}` (backend, works) | No paginated list UI exists yet to consume it | Keep the backend shape; frontend should build its list-consuming pattern against exactly this shape, not invent another | Frontend, once first paginated screen exists |
| Auth transport | Bearer header OR `HttpOnly` cookie, backend supports both | Bearer header only (from `localStorage`) | Decide **one** primary transport for browser clients — see §5.2, this is the same as the localStorage-vs-cookie open decision | Joint — **unresolved**, see §6 |

### 5.2 Authentication

- **Backend today**: JWT (HS256), demo credential check, dual transport support
  (header or `HttpOnly` cookie), in-memory single-instance revocation.
- **Frontend today**: reads a JWT from `localStorage`, sends it as a Bearer header,
  never uses the cookie transport the backend already supports.
- **Target**: Whichever project is first to need a hardened auth story (RAISE or
  otherwise) should decide between:
  - (a) **Keep Bearer-header + localStorage**, accept the XSS-exfiltration risk as a
    documented, explicit risk-acceptance (mitigated by strict CSP/no `dangerouslySetInnerHTML`
    discipline on the frontend — currently true, per the frontend audit's XSS findings), or
  - (b) **Move to the backend's existing `HttpOnly` cookie transport**, which removes
    the JS-readable-token risk but requires adding CSRF protection (currently absent on
    both sides) since cookie auth reintroduces that attack class.
  This is **not decided** by either audit and should not be decided implicitly by
  whichever pattern a project happens to copy first — see §6.
- Either way: the backend's demo `AuthService.Login` must be replaced with a real
  credential store (FIX, §1) before this matters in production, and the frontend's
  unused `checkAuth` call must be wired in (FIX, §2) so a restored session is actually
  re-validated against the server on load, not just assumed valid because a token
  string exists locally.
- Token refresh: **missing on both sides**. Must be designed together — a refresh
  endpoint the backend doesn't have yet, and a silent-refresh interceptor the frontend
  doesn't have yet — rather than backend and frontend inventing incompatible schemes
  independently.

### 5.3 RBAC

- **Backend today**: role is carried in the JWT claim and copied into `c.Locals`;
  `RequireRole` middleware can gate a route by role list, but is wired to none.
- **Frontend today**: `role` exists as a type field, referenced nowhere else; no
  route-level or component-level role gating exists.
- **Target model** (to be filled in once decided, not invented here): a single
  role/permission vocabulary defined **once**, most naturally on the backend (since
  it's the enforcement authority) and consumed by the frontend as an opaque string list
  from the JWT/`/me`-style endpoint — never re-derived independently on the client.
  Concretely, closing this gap means:
  1. Backend: decide the actual role set and whether permissions are role-derived or
     per-user (not decided by any audit — see §6), then attach `RequireRole` (or its
     successor) to every route that needs it.
  2. Frontend: add a `RoleProtectedRoute` (or extend `ProtectedRoute` with a
     `requiredRole` prop) and a `useHasRole`/`useHasPermission` hook, then build the
     nav-filtering that today's un-wired `ROUTES` constant was presumably meant to
     support.
  3. **The backend's RBAC decision must land first** — the frontend has nothing
     authoritative to enforce against until the backend's role/permission model and
     `/me`-equivalent response shape exist.

### 5.4 Security

| Control | Backend | Frontend | Cross-platform target |
|---|---|---|---|
| Transport | No enforced HTTPS at the app layer (deployment/infra concern) | Same | Confirm at deploy/infra layer for both — not a template-level gap on either side |
| Rate limiting | Missing (Fiber has an unused limiter package) | N/A (frontend can't enforce this) | Add on backend, prioritize `/api/v1/auth/login` first |
| CSRF | Not designed in (mitigated incidentally by JSON-body CORS behavior today) | Not designed in | Only becomes mandatory if §5.2 resolves toward cookie-based auth — otherwise low priority |
| Security headers | Missing (no CSP/X-Frame-Options/etc.) | N/A (served by whatever hosts the built bundle — currently nginx default config) | Add on backend API responses; add to the frontend's nginx config together, since the nginx SPA-fallback fix (§2) touches the same file |
| Secrets in source | One hardcoded API key (handler), demo credentials in bootstrap SQL | None found | Remove the backend one; keep frontend's clean state; add a secret-scanning pre-commit/CI step to prevent recurrence on either side |
| Error detail exposure | Raw `err.Error()` leaked on several 5xx paths | N/A (frontend doesn't generate server errors) | Fix on backend only |
| Dependency vulnerability scanning | Not run (`govulncheck` not installed) | Not run (`npm audit` not run, no `node_modules`) | Both need a CI step running the language-appropriate scanner before go-live |

### 5.5 Testing

| Layer | Backend | Frontend | Target |
|---|---|---|---|
| Unit | None (no mocked repository/service tests) | None (no framework at all) | Backend: mock the repository interface for the first domain with real business logic. Frontend: pick a framework (Vitest is the natural fit given Vite) and write the first component/hook test before feature work accumulates further |
| Integration | Real, DB-backed, httptest-driven, host-guarded teardown — a genuinely good pattern | None | Keep backend's pattern as the house style for its layer; frontend has no equivalent layer yet to define a style for |
| E2E | None | None | Not urgent for either until RAISE (or another consumer) has enough real screens/flows to justify the investment — **not a pre-RAISE blocker**, tracked as a later milestone |
| CI enforcement | None (`go build`/`vet`/`test`/`gofmt` all pass today, but nothing runs them automatically) | None (`npm run lint`/`build` documented but not automated) | A minimal pipeline on each repo running its own build+vet/lint+test is a **pre-RAISE requirement**, see checklist §7 |

---

## 6. Unresolved decisions

These require an explicit choice by whoever owns the Company Foundation (not something
either audit resolved, and not something this document should resolve unilaterally):

1. **Token transport for browser clients**: Bearer-header-in-`localStorage` (current
   frontend behavior, XSS-exfiltration risk, simpler) vs. `HttpOnly` cookie (backend
   already supports it, removes that risk, requires adding CSRF protection that neither
   side has today). Blocks §5.2 from being fully specified.
2. **Response envelope shape**: wrap every API response in a common envelope, or keep
   returning entities/collections directly with a separate, consistently-used error
   shape only for failures. Blocks §5.1 from being fully specified; also blocks
   resolving the frontend's dangling `APIResponse<T>` type (FIX item, §2).
3. **Role/permission model**: flat role strings only (as today, on both sides) vs. a
   real permission system (role → permissions[] → route/UI gating). Blocks §5.3 and
   blocks the backend's `RequireRole` wiring from having anything concrete to wire to.
4. **Migration tooling for the backend**: adopt `golang-migrate`/`goose` now, or
   continue applying `sql/*.sql` files by hand until a second real domain/engine forces
   the decision. No audit finding mandates either; it's a team preference call.
5. **Design-system investment for the frontend**: build a shared
   Button/Input/Select/Modal/Table component library once, before RAISE's first real
   screens are built, vs. let RAISE build its own screen-specific components and
   extract a shared library later once patterns repeat. Either is defensible; the
   frontend audit only established that **no such library currently exists**, not which
   path is better.
6. **Zustand's fate**: remove the unused dependency, or adopt it deliberately for one
   real piece of cross-component state once RAISE has a concrete need for it. Leaving
   it installed-and-unused indefinitely is the one option this document rules out.
7. **`ServiceAuth`/internal API-key middleware's fate**: keep it dormant for a future
   service-to-service integration need, or remove it now and reintroduce it if/when
   actually needed. No current consumer exists on either side.
8. **i18n**: standardize a library/approach at the foundation level (affecting every
   future project), or leave it as a per-project decision. The frontend template today
   hardcodes Thai strings with no i18n layer at all — this is a scope question, not a
   bug to fix silently.
9. **MSSQL/Oracle read-replica support**: build it now (mirroring the PG/TT dual-pool
   pattern) as a foundation investment, or wait until a real project (RAISE or
   otherwise) actually needs read scaling on either engine. No current finding shows an
   active need.
10. **Blacklist backing store for multi-instance deployments**: Redis, a DB table, or
    a decision that the backend will only ever run single-instance for the foreseeable
    future (in which case calling `StartBlacklistCleanup` is sufficient and no external
    store is needed yet). Affects how big the AUTH-RBAC FIX item actually is.

---

## 7. Readiness checklist before starting the RAISE project

Each line is a **concrete, verifiable action**, not a restated finding. Items are
grouped by whether they block starting RAISE at all, or can proceed in parallel with
RAISE's early requirements/design work (per the project's own deliverable-chain
convention — RAISE's own PRD/design/etc. work is unaffected by backend/frontend template
readiness and can continue regardless of checklist status).

### Must be done before any RAISE code is written against these templates

- [ ] Backend: replace `AuthService.Login`'s demo check with a real,
  repository-backed, hashed-password credential store — **or** explicitly accept demo
  auth for a bounded pilot/demo phase of RAISE, in writing, with a tracked follow-up.
- [ ] Backend: resolve unresolved decision #1 (token transport) and #3 (role model) —
  both are prerequisites for wiring `RequireRole` to any RAISE route meaningfully.
- [ ] Backend: guarantee `BYPASS_JWT` cannot be true outside local development (env
  discipline documented in deployment runbooks, or a startup assertion in code).
- [ ] Backend: remove the hardcoded API key in `handler/sampleHandler.go` before that
  file is adapted for any real external integration RAISE needs.
- [ ] Backend: call `util.StartBlacklistCleanup()` at startup, or replace the
  blacklist with a shared store per unresolved decision #10.
- [ ] Backend: stop returning raw `err.Error()` on 5xx paths; return a generic
  client-facing message, keep detail in logs (already logged correctly today).
- [ ] Frontend: wire `checkAuth` into `AuthContext`'s startup effect so restored
  sessions are server-validated, not just assumed valid.
- [ ] Frontend: wire the existing `useLocalStorage` hook into `AuthContext` instead of
  the duplicated direct `localStorage` calls.
- [ ] Frontend: add a 404 catch-all route.
- [ ] Both: resolve unresolved decision #2 (response envelope) before RAISE's first
  real endpoint/service-call pair is built, so RAISE doesn't have to guess a convention
  neither template actually settled.
- [ ] Both: fix the `architecture.md` (backend) and README/SETUP (frontend)
  documentation drift identified in each audit, so RAISE engineers onboarding from
  those docs aren't misled.

### Should be done before RAISE reaches its first production deployment (not before RAISE's first line of code)

- [ ] Backend: add a minimal CI pipeline (`go build`, `go vet`, `gofmt -l`, `go test`)
  — currently all pass locally but nothing runs them automatically.
- [ ] Frontend: add a minimal CI pipeline (`npm run lint`, `npm run build`) and adopt a
  test framework (Vitest, given the existing Vite toolchain) with at least one real test.
- [ ] Backend: add Docker packaging (currently absent entirely).
- [ ] Frontend: fix the Dockerfile's nginx stage to include SPA-fallback
  (`try_files`) config.
- [ ] Backend: add rate limiting, at minimum on the login endpoint.
- [ ] Backend: add API versioning (`/api/v1`) before any external client depends on
  the unversioned path — cheaper to do before RAISE ships a client than after.
- [ ] Backend: decide and implement a migration-tooling story (unresolved decision #4)
  before RAISE's schema needs outgrow hand-applied SQL files.
- [ ] Both: run a dependency-vulnerability scan (`govulncheck ./...` /
  `npm audit`, once installable) and address findings.
- [ ] Both: add security headers (backend API responses; frontend's nginx config).

### Explicitly NOT required before RAISE starts (deferred by design, not by oversight)

- Full design-system component library (unresolved decision #5 — RAISE may build its
  own screen-specific components first and extract shared ones later).
- E2E testing (no current screens/flows justify the investment yet).
- MSSQL/Oracle read-replica support (no current need established).
- i18n layer (unresolved decision #8 — scope question, not a blocker).
- Metrics/Prometheus endpoint (useful, not a hard blocker for a first deployment).

## Document Status

Draft for Review — synthesized from [`go-template-analysis/`](../go-template-analysis/INDEX.md)
and [`template-analysis/`](../template-analysis/INDEX.md), with the two highest-stakes
frontend claims (Zustand unused; `role` field unreferenced) independently re-verified by
grep during this session, 2026-08-21. Neither `go-template-main` nor `react-template-main`
was modified while producing this document.
