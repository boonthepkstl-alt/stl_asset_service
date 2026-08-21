# Template Structure

Full file inventory of `react-template-main` as actually found on disk (not as described by README). Total: 21 files under `src/`, plus root config/tooling files. `public/` contains only `vite.svg`.

## Root

| Folder/File | Responsibility | Standard | Extensible | Notes |
|---|---|---|---|---|
| `package.json` | Scripts, dependencies | Yes | Yes | No `test` or `typecheck` script; `build` runs `tsc && vite build` (tsc acts as the typecheck gate). |
| `package-lock.json` | Locked dependency graph | Yes | N/A | Present, npm-based. |
| `tsconfig.json` / `tsconfig.node.json` | TS compiler config, `@/*` path alias | Yes | Yes | Strict mode on (`strict`, `noUnusedLocals`, `noUnusedParameters`). |
| `vite.config.ts` | Build tool config, dev proxy to `/api` | Yes | Yes | Proxy target read from `VITE_PROXY_TARGET` env, defaults to `localhost:8000`. |
| `tailwind.config.js` | Design tokens (color, font) | Yes | Yes | Only `primary` color scale and `fontFamily.sans` (Prompt) are customized; no spacing/radius/shadow tokens defined. |
| `postcss.config.js` | Tailwind/Autoprefixer pipeline | Yes | Yes | Standard, not further inspected beyond confirming presence. |
| `.eslintrc.cjs` | Lint rules | Yes | Yes | `eslint:recommended` + `@typescript-eslint/recommended` + `react-hooks/recommended`; `no-explicit-any` and `no-unused-vars` set to `warn`, not `error`. |
| `.prettierrc` | Formatting rules | Yes | Yes | semi, single-quote, printWidth 100. |
| `.gitignore` | Excludes `.env*`, `node_modules`, `dist`, etc. | Yes | N/A | Confirms `.env` files are intentionally not committed — none exist in the delivered tree either. |
| `.dockerignore` | Docker build context excludes | Yes | N/A | Present, not further inspected. |
| `Dockerfile` | Multi-stage build (node:18-alpine → nginx:1.27.1-alpine) | Yes | Yes | Static SPA container; no env-var injection step, no healthcheck. |
| `index.html` | HTML entry, Google Fonts preconnect, theme-color meta | Yes | Yes | Thai-first (`lang="th"`, Prompt font). |
| `README.md` | Feature list, architecture overview, customization guide | Partially accurate | N/A | Several claims do not match actual code — see discrepancy notes below. |
| `SETUP.md` | Setup/customization checklist, optional-library suggestions | Partially accurate | N/A | References files (`.env`, `types/index.ts`, `services/auth.ts`) that do not exist in this tree. |
| `public/vite.svg` | Placeholder favicon | Yes | Yes | Meant to be replaced per SETUP.md checklist. |

## `src/`

| Folder/File | Responsibility | Standard | Extensible | Notes |
|---|---|---|---|---|
| `main.tsx` | React root bootstrap (`ReactDOM.createRoot` + `StrictMode`) | Yes | Yes | Minimal, no provider wrapping here (providers live in `App.tsx`). |
| `App.tsx` | Router setup, `ProtectedRoute`, top-level route table | Yes | Partially | Only 3 routes exist (`/login`, `/dashboard`, `/`); no lazy loading, no 404/catch-all route, no nested module pattern beyond one `ProtectedRoute` wrapper — see [ARCHITECTURE.md](./ARCHITECTURE.md). |
| `components/ErrorBoundary.tsx` | App-level React error boundary (class component) | Yes | Yes | Only one boundary at the root; no per-route/per-section boundaries. |
| `components/Loading.tsx` | Generic spinner | Yes | Yes | FOUNDATION-level shared component (see [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)). |
| `components/Navbar.tsx` | App shell top nav, shows username + logout | Partially | No | Nav items are hardcoded JSX, not data-driven — adding a new nav link means editing this file directly; no nav-id-to-route mapping exists at all (flagged as a risk). |
| `config/constants.ts` | `APP_NAME`, `ROUTES`, `API_ENDPOINTS`, `STORAGE_KEYS`, `DATE_FORMATS` | Yes | Yes | `ROUTES` and `API_ENDPOINTS` constants exist but are **not actually referenced** by `App.tsx` or `services/api.ts` (both hardcode string literals instead) — inconsistency, not enforced. |
| `contexts/AuthContext.tsx` | Auth state (user/token/loading), login/logout | Yes | Partially | Single global context; no refresh-token flow, no expiry check — see [AUTH-RBAC.md](./AUTH-RBAC.md). |
| `hooks/useFetch.ts` | Generic GET-fetch hook with loading/error/data state | Yes | Yes | GET only; no mutation hook (`usePost`/`useMutation`) equivalent exists. |
| `hooks/useLocalStorage.ts` | Generic localStorage-synced state hook | Yes | Yes | Not used by `AuthContext` (which manipulates `localStorage` directly instead) — inconsistent internal usage. |
| `index.css` | Tailwind directives + custom scrollbar + `.scrollbar-hide` utility | Yes | Yes | No CSS custom properties / design-token variables defined here (all tokens live in `tailwind.config.js`). |
| `pages/Login/index.tsx` | Login form page | Yes | Yes | Single-file page, no `_components` subfolder (consistent with SETUP.md's "optional" note). |
| `pages/Dashboard/index.tsx` | Dashboard page, composes header + stats | Yes | Yes | Demonstrates the `_components` convention described in README. |
| `pages/Dashboard/_components/DashboardHeader.tsx` | Page-local header component | Yes | Yes | FEATURE-SPECIFIC. |
| `pages/Dashboard/_components/DashboardStats.tsx` | Page-local static demo stat cards | Yes | Yes | Hardcoded placeholder content ("Card 1/2/3") — demo/example only, not real functionality. |
| `services/api.ts` | Axios instance, interceptors, `authAPI` | Yes | Yes | Only auth endpoints defined; no generic request wrapper for future domain services beyond the raw `api` export — see [API-ARCHITECTURE.md](./API-ARCHITECTURE.md). |
| `types/api.ts` | `APIError`, `APIResponse<T>` | Yes | Yes | `APIResponse<T>` envelope type is defined but never actually used by `services/api.ts` (responses are consumed as raw `T`, not `APIResponse<T>`) — inconsistency. |
| `types/auth.ts` | `User`, `LoginRequest`, `LoginResponse` | Yes | Yes | `User.role` exists but has zero consumers anywhere in `src/` — see [AUTH-RBAC.md](./AUTH-RBAC.md). |
| `types/common.ts` | `PaginationParams`, `PaginatedResponse<T>` | Yes | Yes | Defined but unused (no paginated list feature exists yet in the demo). |
| `utils/format.ts` | Number/currency/date formatting (Thai locale) | Yes | Yes | Pure functions, no side effects, good candidate for reuse. |
| `utils/logger.ts` | Console-wrapper logger (info/warn/error/debug) | Yes | Yes | No remote/telemetry sink — dev-console only (see [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) for the implication). |
| `utils/validation.ts` | Email/Thai-phone/Thai-ID/password-strength validators | Yes | Yes | Pure functions, Thailand-specific business rules baked into a "generic" utils file — worth knowing before reusing across non-Thai projects. |
| `vite-env.d.ts` | `ImportMetaEnv` typing for `VITE_API_URL`, `VITE_PROXY_TARGET` | Yes | Yes | Only two env vars are typed; any new `VITE_*` var must be added here manually. |

## Discrepancies between docs and actual code (code wins)

1. README lists "🎯 Zustand - Lightweight state management" as a feature; Zustand is a declared dependency but is **not imported or used anywhere** in `src/`.
2. README's Tech Stack section says "React Router 6"; the actual installed/resolved version (`package-lock.json`) is **7.10.1**, and `package.json` also pins `^7.10.1`.
3. README's "Project Structure" diagram shows `services/auth.ts` and `types/index.ts`; the real files are `services/api.ts` (auth logic lives inside it as `authAPI`) and separate `types/auth.ts`/`types/common.ts`/`types/api.ts` — there is no `types/index.ts`.
4. README and SETUP.md both reference `.env` / `.env.production` as if committed template files exist; no `.env*` file is present anywhere in the delivered tree (correctly gitignored, but the docs imply a starter file ships with the repo, and it does not).
5. `config/constants.ts` defines `ROUTES` and `API_ENDPOINTS` maps that are never imported/used by `App.tsx` or `services/api.ts` — the constants exist but are not enforced as the single source of truth.
