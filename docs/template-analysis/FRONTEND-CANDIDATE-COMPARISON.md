# Frontend Candidate Comparison — react-template-main vs. esaps_ai_template vs. root `src/` vs. `frontend/`

Audit date: 2026-08-21. Read-only comparative review. Candidate 1 (`react-template-main`) was audited in full in a
prior pass — see [INDEX.md](./INDEX.md) for that report set; this document reuses those findings rather than
re-reading every file, but skims the tree for a fair side-by-side. Candidates 2–4 (`esaps_ai_template`, root `src/`,
`frontend/`) were read in full for this pass: every file under each `src/`, `package.json`, `server.ts` (candidate 2
only), `vite.config.ts`/`tsconfig.json`, `.env.example`, and — for `frontend/` only, since it has installed
`node_modules` — a live `vitest run` was executed (read-only; no install, no dev server, no file mutation) to verify
the test suite actually passes rather than trusting file presence alone. No files in any candidate were modified.

`go-template-main/` (Go + REST backend) was noted but not deep-audited — out of scope for a frontend comparison. It
matters only because `frontend/` explicitly writes its API/auth contract against it (see per-candidate section below)
and because it is the ONLY candidate with a real backend deliverable, which is relevant context for the API-boundary
findings below.

## Candidate 1 — `react-template-main/` (prior audit, summarized)

Generic company React template. React 18.3 + TS 5.9 + Vite 5.4 + Tailwind 3.4 + React Router 7.10 + Axios 1.13.
Three routes, one protected group, no shared layout. Auth is a working demo (login/logout/localStorage/401
interceptor) but classified **DEMO ONLY**; RBAC is **MISSING** entirely despite a `role` field on `User`. No design
system beyond `Loading`/`Navbar`/`ErrorBoundary` — everything else is raw Tailwind. No tests, no CI/CD. JWT stored in
localStorage (XSS-exfiltration risk, flagged HIGH). No hardcoded secrets, no direct DB/AI SDK calls from the
frontend. Verdict from that audit: **READY WITH DOCUMENTED LIMITATIONS**, classified as a Level 1–2 developer
template (coherent tooling, but every non-trivial capability is a single unproven example, not a system). Full
detail across [TEMPLATE-READINESS-REVIEW.md](./TEMPLATE-READINESS-REVIEW.md) and its companion documents.

Relevant pattern this candidate is worth preserving: the Axios instance shape (`request` interceptor injects
`Authorization: Bearer <token>` from localStorage; `response` interceptor force-clears session + hard-redirects on
401) is simple, well-scoped, and — as shown below — is exactly the shape `frontend/` already copied and extended.

## Candidate 2 — `esaps_ai_template/`

**Stack:** React 19.0.1, Vite 6.2.3, Tailwind 4.1.14 (via `@tailwindcss/vite`), no router library, no Axios (uses raw
`fetch`). Adds a Node/Express dev+prod server (`server.ts`) built with `tsx`/`esbuild`, plus `@google/genai` ^2.4.0
and `@supabase/supabase-js` ^2.112.3 as **direct** `dependencies` (not devDependencies) in `esaps_ai_template/package.json:14-26`.
`node_modules` is not installed; this candidate was read source-only, no install/run was attempted (per the task's
hard constraint).

**Architecture/Routing:** `src/routes/{index.ts,pageRoutes.tsx,types.ts,breadcrumbs.ts}` — a hand-rolled route table
and breadcrumb generator, not React Router. `AppShell.tsx` provides a real shared shell (sidebar + top bar), unlike
react-template-main's per-page `<Navbar/>` pattern. 20 page components exist under `src/pages/` covering the full
asset-lifecycle domain (Assets, Employees, Licenses, Maintenance, Reconciliation, AI Decision Center, Administration,
User/Role Management, Settings, etc.) — this is a UI-complete mockup of the RAISE domain, not a thin demo.

**Design system:** The strongest of any candidate on raw component count — `src/components/ui/` has 18 primitives
(`Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Card`, `Checkbox`, `Drawer`, `Dropdown`, `EmptyState`, `Input`,
`Modal`, `Pagination`, `Progress`, `Select`, `Skeleton`, `Tabs`, `Textarea`, `Toast`), all re-exported from
`src/components/ui/index.ts`. `AIAssistantDrawer.tsx`, `Charts.tsx`, and `DataTable.tsx` are additional composite
components. This is a genuine, non-trivial component library — clearly the origin of the identical library found in
both root `src/` and `frontend/` (see below).

**API architecture / AI integration — the key finding for this candidate:** `server.ts:1-392` is an Express server
that owns the **only** `@google/genai` usage in the entire candidate. It exposes four backend routes —
`/api/ai/decision-matrix`, `/api/ai/reconcile-audit`, `/api/ai/executive-summary`, `/api/ai/chat` (`server.ts:146,
217, 265, 319`) — each of which calls `getAIClient()` (`server.ts:11-23`, reading `process.env.GEMINI_API_KEY`)
**server-side**, with a same-shape deterministic fallback (`generateFallback*`, `server.ts:37-132`) if the key is
absent or the call fails/times out. Grepping `src/` for `supabase|@google/genai|GEMINI_API_KEY` returns **zero
matches** — confirmed no browser-side code imports either SDK or reads the key. The two `fetch()` call sites that hit
these routes are in `src/pages/AIDecisionCenter.tsx:80,120` and `src/pages/Reconciliation.tsx`, both calling the
relative path `/api/ai/...`, i.e. the browser talks to Express, Express talks to Gemini. **This is the correct
pattern** — the API-key/secret-exposure risk that the task asked to check for is NOT present in the code as shipped.
The residual risk is structural, not code-level: `@supabase/supabase-js` is a direct dependency with **zero
references anywhere** in `server.ts` or `src/` — a dead/aspirational dependency today, but its presence as a listed
`dependency` (bundled toward the client build target if anyone ever imports it into `src/`) is a standing invitation
for a future contributor to import it client-side and leak a Supabase key, since nothing in the repo (no lint rule,
no comment, no doc) warns against it the way `frontend/`'s `api-client.ts` explicitly does (see Candidate 4).

**Auth/RBAC:** `src/pages/Auth.tsx` exists as a single login-page mockup; no `AuthContext`, no protected-route
wrapper, no token storage pattern, no interceptor — weaker than react-template-main on this axis specifically, despite
being richer everywhere else.

**Testing:** **MISSING entirely** — no test files, no test runner in `package.json` (`esaps_ai_template/package.json:6-13`
has no `test` script).

**Security:** `.env.example` (`esaps_ai_template/.env.example`) declares only `GEMINI_API_KEY=` — value not present,
correctly redacted/absent as expected of an example file. No Supabase env vars declared even though the SDK is a
dependency, reinforcing that Supabase is unused/aspirational rather than wired to anything.

**Dependency health:** Lean and current (React 19, Vite 6, Tailwind 4) but couples a frontend UI scaffold with a
custom Express server as a first-class dependency — an architecture decision a consuming project would need to
either adopt wholesale or strip out.

**Documentation:** No README in the folder; `metadata.json` exists but wasn't treated as human documentation. Nothing
that explains the fallback-on-missing-key design decision except the inline code comments already cited above.

**Maturity level: LEVEL 1 Developer/Prototype Template — AI-forward.** Excellent domain UI coverage and a genuinely
sound client/server AI-proxy split, but no auth, no RBAC, no tests, no CI, no docs. It reads as a hackathon-grade UI
prototype with an unusually well-designed AI backend proxy bolted on.

## Candidate 3 — root `src/` (orphaned tree)

**Finding: `src/` is a byte-for-byte duplicate of `esaps_ai_template/src/`, not a divergent snapshot.**

A full file-list diff (`diff <(find esaps_ai_template/src -type f) <(find src -type f)`) shows **zero path
differences** — every file in one exists in the other with the identical relative path. A full content diff was then
run across all shared files (`diff -q` per file, 39 files total) and returned **zero differing files** — spot-checked
individually on `App.tsx`, `main.tsx`, `pages/Dashboard.tsx`, and `components/ui/Button.tsx` (all `IDENTICAL`), then
confirmed exhaustively across the whole tree with a loop that reported 0 differing files out of all shared files.

`src/` has **no** `package.json`, `tsconfig.json`, `vite.config.ts`, `server.ts`, or `.env.example` of its own — it
is purely the `src/` subtree with no build wrapper, confirming the task brief's description of it as orphaned. It
cannot be run, built, or type-checked independently; it only exists as a source tree.

**Conclusion:** this is a stray duplicate, almost certainly left behind by an extraction/copy step when
`esaps_ai_template` was created (or vice versa — the direction of copy cannot be determined from file contents alone
since they are identical, but the practical conclusion is the same either way). It carries no unique information and
is safe to disregard as an artifact once `esaps_ai_template/src/` is treated as the canonical copy. It is not a
"pick this one" candidate on its own — it is not independently buildable — but it is worth flagging to the user for
cleanup since a second, unwrapped copy of 39 source files sitting at repo root is exactly the kind of thing that
causes a future contributor to edit the wrong copy.

**Maturity level:** N/A — not independently evaluable as a foundation; same content as Candidate 2 minus the build
wrapper and server.

## Candidate 4 — `frontend/` ("raise-frontend")

**Stack:** React 19.0.1, Vite 6.2.3, Tailwind 4.1.14, react-router-dom 7.10.1, Axios 1.7.9 (confirmed via
`frontend/package.json`; installed versions verified from `frontend/node_modules/react/package.json` → `19.2.8` and
`frontend/node_modules/vite/package.json` → `6.4.3`, i.e. resolved versions are current within their majors).
`node_modules/` is installed and a `dist/` exists (has been built at least once). This is the only candidate with
both a real test runner AND a passing test suite verified live in this audit.

**Architecture/Routing:** Real React Router v7 `BrowserRouter`/`Routes` in `frontend/src/App.tsx:1-79`, using a
single `ProtectedRoute` wrapper (`App.tsx:26-38`, same `isAuthenticated`-gate mechanism as react-template-main) around
16 route entries covering the full domain (Dashboard, Assets, Employees, Maintenance, Tickets, Licenses,
Reconciliation, AI Decision Center, Administration, User/Role Management, Settings) plus an explicit `NotFound`
catch-all route (`App.tsx:69`) — something react-template-main lacks. Pages live under `pages/<Name>/index.tsx` with
a co-located `index.test.tsx` per page (see Testing below) — a real convention, not an ad-hoc one.

**Design system:** Identical 18-component `components/ui/` kit to `esaps_ai_template`/root `src/` (`Alert` through
`Toast`, same file set, same `index.ts` barrel), plus `ErrorBoundary.tsx` (missing from candidate 2/3's `ui/` set)
and one real component test, `components/ui/Button.test.tsx`. This confirms `frontend/` inherited the esaps
component library rather than building its own from scratch — the UI kit itself is shared IP across candidates 2, 3,
and 4.

**API architecture:** `frontend/src/services/api-client.ts:1-39` is a single Axios instance with the exact
request/response interceptor mechanism from react-template-main (Bearer-token injection, 401 → clear storage + hard
redirect), but with one material addition: an explicit code comment at the top —
*"Never call Gemini or any AI provider directly from the browser; AI-related requests must go through
`/api/v1/ai/*` on this same client"* (`api-client.ts:5-7`) — showing this candidate was built with direct knowledge
of, and a deliberate rejection of, the exact risk pattern flagged as a concern for candidate 2. `baseURL` defaults to
`http://localhost:8080/api/v1` (`api-client.ts:9`), i.e. it targets `go-template-main`'s API, not any AI SDK
directly. A full layered service structure exists: `services/*-service.ts` (business-facing) wrapping
`services/*-repository.ts` (data-shape) wrapping `api-client.ts`, for 9 domains (asset, employee, license, role,
ticket, user, settings, dashboard, ai-decision) — materially more architecture than any other candidate's API layer.

**Auth/RBAC:** `contexts/AuthContext.tsx:1-85` — same localStorage-token pattern as react-template-main, and it says
so explicitly in its own comment: *"Foundation-phase auth boundary: localStorage token, same pattern as
react-template-main. This is intentionally NOT the final implementation"* (`AuthContext.tsx:17-21`), naming the
target end-state (JWT via `Authorization: Bearer` or `go-template-main`'s `stl_token` cookie plus a `RequireRole()`
enforcement point). `services/auth-service.ts:1-18` explicitly documents that it "maps directly onto
go-template-main's authController" so that swapping the backend's demo stub for a real implementation requires no
frontend change. **RBAC enforcement itself is still MISSING** — `ProtectedRoute` (`App.tsx:26-38`) checks only
`isAuthenticated`, never role/permission; `RoleManagement/index.tsx` is a full-featured permission-matrix UI
(`pages/RoleManagement/index.tsx:11-186`, module × action checkboxes) but its own code comments say the underlying
`Role` type "has no persisted shape... 'Save Changes' was already a local-state-only toast" (`RoleManagement/index.tsx:18-21`)
— i.e., this is a well-built UI mockup of RBAC administration, not a working authorization system, same class of gap
as react-template-main and esaps_ai_template, just with a much more convincing UI on top.

**Testing — the clearest differentiator.** `vitest.config.ts` + `src/test/{setup.ts,test-utils.tsx}` are configured;
31 test files exist covering unit tests (`Button.test.tsx`), per-service tests (9 `*-service.test.ts` files), and
integration/cross-domain route tests (`App.navigation.test.tsx`, `App.cross-domain.test.tsx`,
`App.administration-route.test.tsx`, `App.license-cross-domain.test.tsx`, `App.ticket-cross-domain.test.tsx`,
`App.route.test.tsx`). This audit ran the suite live (`cd frontend && npx vitest run`, using the already-installed
`node_modules`, no install performed): **31 test files passed, 103 tests passed, 0 failed**, in ~23.6s. No other
candidate has any test tooling at all, let alone a passing suite this size.

**Security:** `frontend/.env.example` reads: `VITE_API_BASE_URL=http://localhost:8080/api/v1` plus a comment
*"The frontend must never call Gemini directly and must never hold GEMINI_API_KEY/DB credentials"* — an explicit,
written security boundary, not an implicit one. No Gemini/Supabase packages appear anywhere in
`frontend/package.json`'s dependencies at all (confirmed by reading the full file) — the risk pattern found in
candidate 2 cannot occur here because the SDKs are not even installed. JWT-in-localStorage is inherited unchanged
from react-template-main and carries the same HIGH-severity XSS-exfiltration caveat noted in that prior audit.

**Dependency health:** `axios ^1.7.9`, `react-router-dom ^7.10.1`, `lucide-react ^0.546.0` as the only three non-React
production deps — lean. Dev deps include a full lint/format/test stack (`eslint` 8.57 + two `@typescript-eslint`
plugins, `prettier`, `vitest` 2.1.8, `@testing-library/react` 16.1, `jsdom`). No dead/unused dependency was found by
inspection (unlike react-template-main's unused Zustand).

**Documentation:** Inline code comments throughout (`api-client.ts`, `AuthContext.tsx`, `auth-service.ts`,
`RoleManagement/index.tsx`) actively cross-reference other planned artifacts by name — `AI-ARCHITECTURE.md`,
`AUTH-RBAC.md`, `API-SPECIFICATION.md`, `go-template-main` — none of which exist as files under `docs/` yet (the
`docs/` tree in this repo is the RAISE PRD/Design/Prototype/AC/Test chain, not these named files) — meaning the
comments describe an *intended* documentation set that has not actually been written yet. Treat these as forward
references/TODOs, not as proof the documents exist.

**Maturity level: LEVEL 2 Reusable Company Template, verging on LEVEL 3 in test discipline specifically.** This is
the only candidate with: a layered service/repository API architecture, a real (if pre-final) auth pattern explicitly
scoped against a named backend, a written security rule preventing the exact AI-SDK-exposure risk category, and a
genuinely passing automated test suite. It still lacks RBAC enforcement, CI/CD config (none found under `frontend/`),
and has the same JWT-in-localStorage posture as candidate 1 — so it is not unqualified LEVEL 3, but it is materially
ahead of all three other candidates on every axis except raw design-system file count (tied with 2/3) and AI-feature
UI completeness (behind candidate 2, which has richer AI-specific pages like `AIAssistantDrawer.tsx`).

## Comparison Table

| Axis | 1. react-template-main | 2. esaps_ai_template | 3. root `src/` | 4. `frontend/` |
|---|---|---|---|---|
| Routing | React Router 7, 3 routes, flat, no 404 | Hand-rolled route table, no router lib, no 404 route object but has `ErrorPages.tsx` | Same as candidate 2 (identical files) | React Router 7, 16 routes, explicit `NotFound` catch-all |
| Shared layout/shell | None — per-page `<Navbar/>` | `AppShell.tsx` real shell | Same as candidate 2 | `AppShell.tsx` (inherited from 2/3) |
| Design system | 3 components only (`Loading`/`Navbar`/`ErrorBoundary`) | 18-component `ui/` kit + `DataTable`/`Charts`/`AIAssistantDrawer` | Identical to candidate 2 | Same 18-component kit + `ErrorBoundary`, +1 component test |
| API architecture | 1 Axios instance, interceptors, no service/repository layering | `fetch()` direct calls to own Express `/api/ai/*` proxy; no generic API client | Identical to candidate 2 | Layered `api-client → *-service → *-repository`, 9 domains, Axios |
| AI integration | None | Express server proxies Gemini (`server.ts`), fallback-safe, key server-side only | Identical to candidate 2 (no server.ts present in `src/` itself, but same client code) | AI Decision Center UI calls own backend `/api/v1/ai/*` (not directly implemented in this candidate — targets go-template-main) |
| Auth | Demo login/logout, localStorage token, DEMO ONLY | UI-only `Auth.tsx` page, no context/interceptor | Same as candidate 2 | localStorage token + `AuthContext`, explicitly documented as foundation-phase, targets go-template-main contract |
| RBAC / Authorization | MISSING (role field unused) | MISSING (no role concept at all in auth) | Same as candidate 2 | MISSING enforcement; RoleManagement UI exists but is local-state-only (no persisted permission model) |
| Testing | None | None | None | Vitest + RTL, 31 files / 103 tests, **verified passing live** |
| Security | No secrets; JWT-in-localStorage HIGH finding; no direct AI/DB SDK calls | No secrets; Gemini key stays server-side (verified via grep); `@supabase/supabase-js` unused dead dependency, still a future-risk vector | Same as candidate 2 | No secrets; JWT-in-localStorage inherited HIGH finding; explicit written rule + zero AI/DB SDK dependencies at all |
| Dependency health | 1 dead dep (Zustand); else current | Lean, current (React 19/Vite 6/Tailwind 4); coupling to bespoke Express server is a structural choice a consumer must accept or strip | Same as candidate 2, but literally not runnable (no manifest) | Lean, current, no dead deps found; full lint+format+test devDependency stack |
| Documentation | README/SETUP present but several claims stale vs. code (corrected in prior audit) | No README; only inline code comments | None (no manifest, no docs) | No standalone README, but rich inline comments naming target docs/backend that don't exist yet — treat as forward-looking TODOs |
| Buildable standalone? | Yes | Yes (not installed/run in this audit) | **No** — no package.json/tsconfig/vite config of its own | Yes — already built once (`dist/` present) and already has `node_modules` installed |
| Maturity level | LEVEL 1–2 | LEVEL 1 (AI-forward prototype) | N/A (orphan duplicate, not independently evaluable) | LEVEL 2, verging LEVEL 3 on testing discipline |

## Cross-Cutting Findings

1. **The 18-component `components/ui/` design-system kit is shared IP across candidates 2, 3, and 4** — it
   originated in (or alongside) `esaps_ai_template`, was copied verbatim into orphaned root `src/`, and was carried
   into `frontend/` (with two small additions: `ErrorBoundary.tsx` and a component test). None of this exists in
   `react-template-main`, which has no comparable component library at all.
2. **`frontend/` is demonstrably built with awareness of the other three candidates.** Its own code comments
   name-check "same pattern as react-template-main" (`AuthContext.tsx:18`) and explicitly warn against the exact
   AI-SDK-in-the-browser risk pattern that exists as a *dependency* (if not yet as active code) in
   `esaps_ai_template` (`api-client.ts:6`). This strongly suggests `frontend/` was authored *after*, and partly *in
   response to*, the other three — not independently.
3. **No candidate has a working RBAC enforcement layer.** All four either have no role concept (`react-template-main`
   has an unused field; `esaps_ai_template`/root `src/` have none in auth at all) or have a convincing
   permission-management UI with no backing enforcement (`frontend/`'s `RoleManagement` page, confirmed
   local-state-only by its own source comments). This is a hard blocker to resolve before RAISE can ship any
   role-differentiated feature (see PRD user-role scope), regardless of which candidate is chosen.
