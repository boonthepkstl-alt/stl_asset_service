# Authentication & Authorization (RBAC)

## Authentication implementation

Source: `src/contexts/AuthContext.tsx`, `src/services/api.ts`, `src/pages/Login/index.tsx`, `src/App.tsx`.

| Capability | Status | Evidence |
|---|---|---|
| Login flow | **READY** (basic, demo-quality) | `Login/index.tsx` submits a form, calls `useAuth().login()`, navigates to `/dashboard` on success, shows a generic error on failure. Functionally complete for a simple username/password flow. |
| Logout flow | **READY** (basic) | `Navbar.tsx` calls `useAuth().logout()`, which calls `authAPI.logout()`, clears context + localStorage in a `finally` block regardless of server response, then navigates to `/login`. |
| Session persistence across reloads | **PARTIAL** | `AuthContext`'s `useEffect` reads `token`/`user` from `localStorage` on mount and restores them — this works, but there is **no server-side validation of the restored token** (`authAPI.checkAuth()` exists in `services/api.ts` but is **never called anywhere** in the app, including at startup). A user with a stale/revoked token stored locally will appear "logged in" client-side until their next API call 401s. |
| Token storage | **DEMO ONLY** | JWT stored as a plain string in `localStorage` (`STORAGE_KEYS`/raw `'token'` key) — readable by any JavaScript running on the page, including third-party scripts or an XSS payload. No httpOnly-cookie option, no in-memory-only option. See [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) for severity classification. |
| Token refresh | **MISSING** | No refresh-token concept exists anywhere in the types (`LoginResponse` has only `token` + `user`, no `refreshToken`/`expiresAt`), no silent-refresh interceptor logic, no refresh endpoint in `API_ENDPOINTS`. A token, once it expires, cannot be silently renewed — the user is forced to log in again (via the 401 → hard redirect path). |
| Token expiration handling | **PARTIAL** | Expiration is only ever discovered reactively, when an API call returns 401 (handled by the Axios response interceptor). There is no proactive expiry check (e.g., decoding JWT `exp` client-side, or a background timer) — so a user could sit on an expired-token screen with no API calls firing and never be told their session ended until they next interact with something that hits the network. |
| Protected routes | **READY** (single-tier only) | `App.tsx`'s `ProtectedRoute` component gates `/dashboard` behind `isAuthenticated` (derived as `!!token`, not from any actual token validity check — see above). Works correctly for the one protected route that exists. |
| 401 handling | **READY** (blunt) | Global Axios response interceptor clears storage and force-redirects via `window.location.href = '/login'` on any 401 from any request — see [API-ARCHITECTURE.md](./API-ARCHITECTURE.md) for the tradeoffs of this being a hard reload rather than a router navigation. |
| Password handling | **READY** (client-side only) | Login form sends raw username/password over the configured `api` instance; no client-side password hashing (correctly left to transport security + backend, which is the right call — but worth noting there is no visible HTTPS enforcement anywhere in this frontend-only repo, that responsibility sits with deployment/infra). |
| "Remember me" / session duration control | **MISSING** | Not implemented; the app has no concept of session length or persistent-vs-session storage choice — everything is always in durable `localStorage`. |

**Overall authentication verdict: DEMO ONLY.** It demonstrates the shape of a JWT-in-localStorage auth flow correctly enough to build a real backend integration against, but multiple capabilities a production auth system needs (refresh, proactive expiry awareness, startup token validation via the unused `checkAuth`) are either missing or unused-but-present as dead code.

## Authorization / RBAC implementation

**MISSING entirely.** This must be stated plainly rather than inferred from the presence of a `role` field, per the audit's own instruction not to assume RBAC exists just because folder/type structure suggests it.

Evidence for "MISSING," not "partial":
- `types/auth.ts` defines `User.role: 'admin' | 'user' | 'manager'`.
- A repo-wide search for `role` inside `src/` returns **exactly one match** — the type definition itself. `role` is never read, never checked, never branched on, anywhere in `AuthContext`, `App.tsx`, `ProtectedRoute`, `Navbar`, or any page component.
- There is no permissions model at all: no `Permission` type, no `permissions` array on `User`, no permission-checking hook (`usePermission`/`useHasRole`), no `RoleGuard`/`RequirePermission` component.
- `ProtectedRoute` in `App.tsx` implements exactly one binary check: authenticated or not. It has no parameter for "requires role X" or "requires permission Y."
- No route in `App.tsx` is restricted by role (there is only one protected route, `/dashboard`, open to any authenticated user regardless of role).
- No UI element anywhere conditionally renders based on role (e.g., no "Admin" menu item gated on `user.role === 'admin'`).
- No menu/nav permission filtering exists, because the nav bar itself has no menu items to filter (see [ARCHITECTURE.md](./ARCHITECTURE.md)).

**Conclusion: the `role` field is aspirational/unused scaffolding.** A new project cannot treat this template as having RBAC "mostly done, just needs wiring" — it needs the entire authorization layer designed and built from zero: a permissions model, a route-guard extension (or a second guard component) that accepts required-role/permission parameters, and a component-level guard or hook for conditional rendering.

## Extension pattern: Role → Permission → Route → UI (what would need to be built, not what exists)

Since none of this exists today, this section describes the **gap to fill**, not a documented existing pattern:

1. **Role/Permission model**: Extend `types/auth.ts` beyond the current `role` string union — decide whether permissions are role-derived (a static `ROLE_PERMISSIONS` map) or delivered per-user from the backend (`User.permissions: string[]`). Neither exists yet.
2. **Route-level enforcement**: `ProtectedRoute` in `App.tsx` would need a new prop (e.g., `requiredRole?: Role`) or a sibling component (`RoleProtectedRoute`) — today it only checks `isAuthenticated`.
3. **Component-level enforcement**: No `<Can permission="...">` / `useHasPermission()` primitive exists to build conditional UI on. Would need to be created new.
4. **Menu/nav filtering**: Since `Navbar.tsx` has no data-driven menu items at all (see [ARCHITECTURE.md](./ARCHITECTURE.md)'s nav-registration risk), a permission-aware menu would require building both the data-driven menu system and its permission filter simultaneously — there is no existing menu structure to retrofit filtering onto.

Do not assume any of the above four items are "mostly there" — each is a from-scratch build for a project adopting this template.
