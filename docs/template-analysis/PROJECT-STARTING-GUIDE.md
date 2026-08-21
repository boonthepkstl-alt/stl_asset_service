# Project Starting Guide

## Company Foundation (do not touch when starting a new project)

These are the pieces that make this a "template" rather than a blank Vite app. Modifying them should be a deliberate, template-wide decision, not something done inside an individual project.

| Foundation area | Files | Why it's foundation |
|---|---|---|
| React/TS/Build tooling | `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `postcss.config.js`, `package.json` scripts, `.eslintrc.cjs`, `.prettierrc` | Build/lint/format pipeline; changing these affects every future project cloned from this template. |
| Router setup | `src/App.tsx`'s `BrowserRouter`/`Routes` shell, the `ProtectedRoute` pattern | The routing *mechanism* (how public vs. protected routes are declared) is foundation; the actual route *entries* (`/dashboard`, etc.) are project-specific. |
| App shell primitives | `src/components/Navbar.tsx`, `src/components/ErrorBoundary.tsx`, `src/components/Loading.tsx` | Cross-cutting UI infrastructure. Note (per [ARCHITECTURE.md](./ARCHITECTURE.md)/[DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)): `Navbar` today has zero configurability (no nav-items prop), so a real project will likely need to extend it rather than truly leave it untouched — flagged here so that expectation is explicit rather than assumed. |
| HTTP client core | `src/services/api.ts`'s Axios instance, interceptors | The auth-header injection and 401-handling *mechanism* is foundation; the specific endpoints (`authAPI.login`, etc.) beyond the built-in auth ones are project-specific additions. |
| Auth mechanism | `src/contexts/AuthContext.tsx`, `ProtectedRoute` | The *pattern* (Context + localStorage + Axios interceptor) is foundation. See [AUTH-RBAC.md](./AUTH-RBAC.md) for its current limitations before treating it as production-hardened. |
| Design tokens | `tailwind.config.js` `theme.extend.colors.primary`, `fontFamily.sans` | Brand color/typography — SETUP.md explicitly lists changing these as step 1 of customization, so "do not touch" here means "do not touch the *mechanism*," not the actual color values, which every project is expected to override. |
| Error boundary | `src/components/ErrorBoundary.tsx` | Root safety net; extending it (e.g., adding per-route boundaries) is a project decision, but the base pattern is foundation. |
| Build/deploy shape | `Dockerfile`, `.dockerignore` | Container build mechanism; note it currently ships nginx's default config with no SPA fallback routing configured (see [TECH-STACK.md](./TECH-STACK.md)) — worth fixing at the template level before many projects inherit the same gap. |
| Lint/format rules | `.eslintrc.cjs`, `.prettierrc` | Code-quality gate definitions; could not be verified to actually pass in this audit (see [TESTING-STANDARD.md](./TESTING-STANDARD.md)) — recommend confirming `npm run lint` genuinely passes clean before treating it as an enforced gate. |

**Explicitly NOT part of a hardened foundation today** (do not assume otherwise): testing (none exists — [TESTING-STANDARD.md](./TESTING-STANDARD.md)), authorization/RBAC (none exists — [AUTH-RBAC.md](./AUTH-RBAC.md)), CI/CD (none exists), a real design-system component library (none exists — [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)). These are gaps in the foundation itself, not project-specific work being deferred — see [TEMPLATE-READINESS-REVIEW.md](./TEMPLATE-READINESS-REVIEW.md) for how this affects the readiness verdict.

## Project Specific (build here)

| Area | Where | Pattern to follow |
|---|---|---|
| Pages | `src/pages/<Feature>/index.tsx` | Follow the `Dashboard`/`Login` convention; use `_components/` for page-local sub-components (named exports, per the existing `DashboardHeader`/`DashboardStats` convention — note this differs from `src/components/`'s default-export convention, see [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)). |
| Domain/business services | `src/services/<domain>.ts` (new files) or additional exports inside `services/api.ts` | Follow the `authAPI` pattern; import the shared default `api` Axios instance. Resolve the `APIResponse<T>` envelope question (see [API-ARCHITECTURE.md](./API-ARCHITECTURE.md)) before writing many of these, so every new service doesn't inherit the same ambiguity. |
| API contracts / business types | `src/types/<domain>.ts` (new files) | Follow `types/auth.ts`/`types/common.ts` convention: one file per domain, exported interfaces. |
| Business components | `src/pages/<Feature>/_components/` for page-local; `src/components/` only if genuinely reused across 2+ pages | Do not put feature-specific UI in `src/components/` — that folder is meant for the app-shell/foundation pieces listed above. |
| Route registration | `src/App.tsx` | Add new `<Route>` entries; decide public vs. wrapped in `ProtectedRoute`. Remember: this is currently a manual, unenforced step — nothing fails if you forget it (see [ARCHITECTURE.md](./ARCHITECTURE.md)). |
| Business workflows / multi-step flows | New page(s) + services + types, composed together | No existing multi-step-flow example exists in the template to copy from — this is genuinely new work for the project. |
| Nav links (once real navigation is needed) | `src/components/Navbar.tsx` | Will require extending `Navbar` to accept a data-driven items list — it currently has none; treat this as new foundation work if a project needs it, and consider contributing it back to the template rather than one-off patching. |

## Step-by-step: starting a new project from this template

1. **Copy/clone the template** into the new project's repository.
2. **Rename identity**: update `package.json` `name`/`version`, `index.html` `<title>`, `README.md` project info, and `APP_NAME` in `src/config/constants.ts` (per SETUP.md's checklist — verified this checklist item is accurate against the actual file locations).
3. **Set branding**: update `tailwind.config.js`'s `primary` color scale and `fontFamily.sans`, replace `public/vite.svg`, and update the `theme-color` meta tag in `index.html` to match (note: this value is currently hardcoded separately from the Tailwind token and must be kept in sync manually — see [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)).
4. **Configure environment variables**: create your own `.env`/`.env.local` (none ship with the repo — do not expect to find one to copy, despite what README/SETUP.md imply) defining `VITE_API_URL` and `VITE_PROXY_TARGET`, and add any new `VITE_*` vars to `src/vite-env.d.ts`'s `ImportMetaEnv` interface as you introduce them.
5. **Point auth at your real backend**: update the login/logout/check endpoint paths in `src/services/api.ts` (currently `/auth/login`, `/auth/logout`, `/auth/check`) to match your backend's actual contract, and update `types/auth.ts`'s `User`/`LoginRequest`/`LoginResponse` shapes to match your real API. **Before going further, resolve the two known auth gaps** — no refresh-token flow and the unused `checkAuth` startup validation — per [AUTH-RBAC.md](./AUTH-RBAC.md), if your project needs a production-grade session lifecycle (they are not automatically fixed by pointing at a real backend).
6. **Decide on authorization now, not later, if roles matter to your project**: RBAC does not exist in this template at all (see [AUTH-RBAC.md](./AUTH-RBAC.md)) — plan and build a permissions model, route guard, and menu-filtering approach as new work before your project needs more than one class of authenticated user.
7. **Add your first real page**: create `src/pages/<YourFeature>/index.tsx`, register its route in `src/App.tsx` (public or behind `ProtectedRoute`), and add any `_components/` as needed.
8. **Add your first real API domain**: create `src/services/<domain>.ts` and `src/types/<domain>.ts` following the existing conventions; decide the `APIResponse<T>` envelope question up front so every subsequent service is consistent.
9. **Choose and install a state-management approach if `AuthContext`-style Context isn't enough**: Zustand is already an installed dependency (though currently unused) — if your project needs cross-component state beyond auth, this is the one library already present to reach for, rather than introducing a second one, unless there's a specific reason to.
10. **Set up testing before writing much business logic**: none exists today (see [TESTING-STANDARD.md](./TESTING-STANDARD.md)) — pick a stack (Vitest pairs naturally with the existing Vite build) and establish the pattern before the page count grows past the two demo pages.
11. **Set up CI/CD**: none exists today — at minimum, wire `npm run lint` and `npm run build` into a pipeline on every PR before this template is used for anything beyond a local prototype.
12. **Fix the Docker SPA-fallback gap** if deploying via the provided `Dockerfile`: add an `nginx.conf` with `try_files $uri $uri/ /index.html;` (SETUP.md shows this snippet for a *manual* nginx deployment, but it is not wired into the Docker image itself — see [TECH-STACK.md](./TECH-STACK.md)) so that deep-linked/refreshed routes don't 404 in production.
13. **Remove or genuinely use placeholder/demo content**: `DashboardStats.tsx`'s hardcoded "Card 1/2/3" cards and the entire `Dashboard` demo page exist purely to illustrate conventions — replace them with real feature pages rather than building on top of the placeholder content.
14. **Read [TEMPLATE-READINESS-REVIEW.md](./TEMPLATE-READINESS-REVIEW.md) in full** before committing engineering time, so the team enters the project with eyes open about which gaps are pre-existing template limitations versus new work the project itself must plan for.
