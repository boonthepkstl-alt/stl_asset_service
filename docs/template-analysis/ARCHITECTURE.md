# Architecture

## Entry point bootstrap trace

```
index.html
  └─ <script type="module" src="/src/main.tsx">
       └─ src/main.tsx
            ReactDOM.createRoot(#root).render(
              <React.StrictMode>
                <App />                         // src/App.tsx
              </React.StrictMode>
            )
              └─ <ErrorBoundary>                 // src/components/ErrorBoundary.tsx (class component, root-level only)
                   └─ <BrowserRouter>             // react-router-dom v7
                        └─ <AuthProvider>         // src/contexts/AuthContext.tsx (reads localStorage on mount)
                             └─ <Routes>
                                  ├─ /login              → <Login/>                (public)
                                  ├─ (ProtectedRoute)    → <Outlet/>
                                  │     └─ /dashboard    → <Dashboard/>            (protected)
                                  └─ /                   → <Navigate to="/dashboard"/>
```

No provider composition beyond `AuthProvider` exists (no ThemeProvider, no QueryClientProvider, no i18n provider) — `AuthContext` is the only global context in the template.

## Routing architecture

- **Library**: `react-router-dom` v7.10.1, using the classic component API (`<Routes>`/`<Route>`/`<Outlet>`), not the newer data-router (`createBrowserRouter`) API. This is a valid v7 usage pattern but means none of v7's data-loading features (loaders, actions, `defer`) are used.
- **Route table**: defined entirely inline in `src/App.tsx`. There is no separate `routes.ts`/`routes.tsx` config file — adding a route means editing `App.tsx` directly.
- **Protected vs. public routes**: one `ProtectedRoute` wrapper component (`App.tsx` lines 8-20) checks `useAuth().isAuthenticated` and either renders `<Outlet/>` or redirects to `/login`. Only `/dashboard` currently sits behind it. This is a **single flat protection group** — there is no support in the code for per-route role/permission requirements (see [AUTH-RBAC.md](./AUTH-RBAC.md)), and no nested protected sub-trees are demonstrated.
- **Lazy loading**: **MISSING**. Both `Login` and `Dashboard` are imported as static top-level imports; no `React.lazy`/`Suspense` code-splitting exists anywhere. For a 2-page demo this doesn't matter, but the template does not demonstrate the pattern a new project would need once page count grows.
- **404 / not-found handling**: **MISSING**. There is no catch-all `<Route path="*" .../>`. Any unmatched path renders nothing (React Router v7 renders `null` for no match) rather than a friendly not-found page.
- **Error handling in routing**: The single root `ErrorBoundary` (class component, `componentDidCatch` + `console.error`) covers the whole app. There are no per-route or per-section boundaries, so a crash in `Dashboard` unmounts `Login` and the whole shell too (since the boundary sits above `BrowserRouter`, a route crash forces a full white-boundary-screen rather than staying inside the shell/nav).
- **Pattern for adding a new module (as documented in README, cross-checked against actual code)**: create `src/pages/<Feature>/index.tsx` (+ optional `_components/`), then manually add a `<Route>` entry in `App.tsx`, choosing public vs. wrapped-in-`ProtectedRoute`. This is a real, followable pattern, but it is **not enforced by tooling** — nothing fails CI or lint if a developer forgets to add the route, forgets the protection wrapper, or misspells the path.

## Layout / app shell analysis

- **Shell composition**: `Dashboard/index.tsx` manually renders `<Navbar/>` above its content; `Login/index.tsx` renders no shell at all (full-bleed centered card). There is **no shared `<AppLayout>`/`<AuthenticatedLayout>` wrapper component** — each protected page is individually responsible for including `<Navbar/>`. If a second protected page (`Profile`, `Settings`, as README's example suggests) were added, a developer must remember to import and render `<Navbar/>` themselves; nothing enforces shell consistency across protected routes.
- **Header/Nav**: `Navbar.tsx` is a single hardcoded component — it shows the app name, the logged-in username, and a logout button. There are **no nav links/menu items at all** (no way to navigate between pages via the nav bar in the current demo — the only two pages are reached via login-redirect or direct URL).
- **Sidebar**: **MISSING** — no sidebar component exists in the template.
- **Footer**: **MISSING** — no footer component exists.
- **Nav-item-to-route-path relationship**: Because there are no nav items, there is no registration mechanism to evaluate — but this is itself the risk: the template provides **no established pattern** (no `navConfig` array, no route-metadata objects) for keeping a future nav bar's links in sync with the route table in `App.tsx`. If a project extends `Navbar.tsx` with real links, the burden of keeping link `href`s consistent with `App.tsx`'s route paths falls entirely on manual discipline, with nothing enforcing it (no shared `ROUTES` usage in `Navbar.tsx`; `config/constants.ts` does define a `ROUTES` map but neither `App.tsx` nor `Navbar.tsx` imports it — **flagged as a risk**, since the one piece of infrastructure that could prevent this drift already exists but is unused).

## State management analysis

| State category | What's used | Where |
|---|---|---|
| UI state (form inputs, toggles, loading flags) | React `useState` | `Login/index.tsx` (username/password/error/loading), `App.tsx`'s `ProtectedRoute` loading branch |
| Domain/session state (current user, auth token) | React Context (`AuthContext`) + `localStorage` | `contexts/AuthContext.tsx` |
| Server/remote state (fetched API data) | Ad-hoc `useEffect` + `useState` inside a custom `useFetch` hook | `hooks/useFetch.ts` — no caching, no dedupe, no invalidation, no background refetch (i.e., not equivalent to React Query/SWR; it is a minimal fetch-on-mount hook) |
| Global/cross-cutting app state (theme, feature flags, etc.) | **MISSING** | No such state exists in the demo |
| Persisted client state (localStorage-backed) | Custom `useLocalStorage` hook exists as a utility, **but `AuthContext` does not use it** — it calls `localStorage.getItem/setItem/removeItem` directly instead, duplicating the same logic the hook already encapsulates | `hooks/useLocalStorage.ts` vs. `contexts/AuthContext.tsx` |
| Declared but unused state library | **Zustand is a dependency and is not used anywhere** | `package.json` only |

**Recommended pattern for new features, based on what's already used (not a new library suggestion, per audit constraints)**: React Context for cross-cutting session/domain data (following the `AuthContext` pattern), local `useState` for page-local UI state, and the existing `useFetch` hook (or a project-specific variant of it) for simple server-state reads. Because Zustand is already an installed dependency despite being unused, a new project **could** legitimately choose it for larger cross-component state instead of prop-drilling or over-using Context — but that would be a new adoption decision for the project team to make explicitly, not something the template currently demonstrates or requires.

## Accessibility (a11y)

- **Semantic HTML**: `<nav>` used correctly in `Navbar.tsx`; `<form>`/`<label htmlFor>` used correctly in `Login/index.tsx` (labels are properly associated with `id`-matched inputs). `<button type="submit">` used correctly.
- **Labels**: Present and correctly wired for both Login inputs (`username`, `password`), including `autoComplete` attributes (`username`, `current-password`) — a good practice for password managers.
- **Keyboard navigation**: Not explicitly broken (no `tabIndex={-1}` traps, no click-only handlers replacing native interactive elements), but not explicitly tested either since there is no running app in this audit environment (no `node_modules`).
- **Focus management**: No focus-trap or `autoFocus` handling anywhere; no modal/dialog component exists in the template to evaluate modal focus behavior at all — **MISSING** as a pattern to demonstrate.
- **ARIA**: No `aria-*` attributes anywhere in the codebase (grep found none). The loading spinner (`Loading.tsx`) has no `role="status"`/`aria-live` region, so a screen reader user gets no announcement during async loads.
- **Error announcements**: The Login error message (`<div className="...">{error}</div>`) has no `role="alert"`/`aria-live`, so a screen-reader user isn't proactively notified of a failed login.
- **Overall a11y rating**: **PARTIAL** — basic semantic/label hygiene is present, but ARIA/live-region/focus-management patterns needed for a truly accessible design system are absent.

## Responsive design

- Tailwind responsive utility classes (`sm:`, `md:`, `lg:`) are used in `Navbar.tsx` (`px-4 sm:px-6 lg:px-8`), `Dashboard/index.tsx` (same pattern), and `DashboardStats.tsx` (`md:grid-cols-2 lg:grid-cols-3`) — consistent with Tailwind's default breakpoint scale (no custom breakpoints defined in `tailwind.config.js`, so defaults apply: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px).
- No responsive **table** component exists to evaluate (no Table component in the design system at all — see [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)).
- No responsive **dialog/modal** component exists to evaluate — **MISSING**.
- Login form and Dashboard cards use `max-w-*`/`grid`/`flex` patterns that will reflow reasonably on small viewports, but this was verified by reading Tailwind class names only, not by rendering the app (no dev server was started per the read-only/no-install constraint — see [TESTING-STANDARD.md](./TESTING-STANDARD.md)).

## CI/CD

**MISSING entirely.** No `.github/workflows/`, no `.gitlab-ci.yml`, no `azure-pipelines.yml`, no `Jenkinsfile`, no deploy script of any kind was found anywhere in the repository (confirmed via recursive search for `.yml`/`.yaml` files — none exist outside dependency metadata). The only deployment artifact is the `Dockerfile`, which must be built and pushed manually; there is no automation wiring lint/build/test to a pipeline, and (as noted in [TECH-STACK.md](./TECH-STACK.md)) the Dockerfile's nginx stage ships the default nginx config, so SPA deep-link fallback routing is not configured inside the image either.
