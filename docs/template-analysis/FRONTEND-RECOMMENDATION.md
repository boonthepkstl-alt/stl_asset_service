# Frontend Foundation Recommendation

Companion to [FRONTEND-CANDIDATE-COMPARISON.md](./FRONTEND-CANDIDATE-COMPARISON.md). Read that document first for the
full evidence trail; this document gives the actionable verdict.

## Verdict: use `frontend/` as the base. This is a merge, not a pure single-candidate pick — but the merge is small and directional, not a rebuild.

`frontend/` ("raise-frontend") already IS the merge point: it already carries the `esaps_ai_template`/root-`src/`
component library forward, already carries the `react-template-main` auth/interceptor pattern forward, and already
has a materially more mature test/service layer than either source. The remaining work is not "merge three
codebases" — it is "pull two specific, well-isolated pieces from `esaps_ai_template` into the `frontend/` foundation
that already exists," plus resolve the RBAC gap that is common to all four candidates.

**Do not start from `react-template-main`, `esaps_ai_template`, or root `src/` as the base.** Reasons, in order of
weight:

1. **Only `frontend/` has a verified passing automated test suite.** This audit ran it live: 31 test files, 103
   tests, 0 failures (`cd frontend && npx vitest run`, using the pre-installed `node_modules`, no install performed).
   No other candidate has any test tooling at all. Starting anywhere else means starting at zero test coverage on
   day one of RAISE's real build.
2. **`frontend/` already targets the real backend contract.** `frontend/src/services/auth-service.ts` and
   `api-client.ts` are written explicitly against `go-template-main`'s API shape (`Authorization: Bearer`, `/api/v1`
   base path), with code comments naming the exact swap points for when the backend's real auth lands. The other
   candidates either have no backend integration (`esaps_ai_template` bundles its own throwaway Express server) or
   no API layer at all beyond a single Axios instance (`react-template-main`).
3. **`frontend/` already contains the design-system kit from `esaps_ai_template`/root `src/`, so there is nothing
   left to "port" there — it needs to be verified/extended, not imported.** The 18-component `components/ui/` kit is
   identical across candidates 2, 3, and 4 already.
4. **Root `src/` is not a real candidate on its own** — confirmed byte-for-byte identical to
   `esaps_ai_template/src/` with no build wrapper of its own (no `package.json`/`tsconfig.json`/`vite.config.ts`). It
   cannot be built, run, or type-checked independently.

## What to actually pull from where

Two specific items are genuinely missing from `frontend/` today and are worth deliberately importing:

1. **From `esaps_ai_template/server.ts` (`esaps_ai_template/server.ts:1-392`) — the Gemini AI-proxy pattern**, not the
   Express server itself. `frontend/`'s `api-client.ts` already declares the rule ("AI requests must go through
   `/api/v1/ai/*`") but no implementation of that endpoint exists anywhere in this repo — it's a documented intent,
   not working code, because `frontend/` has no backend of its own (it's a pure Vite SPA) and `go-template-main` has
   no `/api/v1/ai/*` route today (only `authController.go`, `middleware/jwtAuth.go`, `middleware/serviceAuth.go` were
   found — no AI-specific controller). The concrete, valuable thing to port is the **shape** of
   `esaps_ai_template/server.ts`: server-side-only API key handling (`getAIClient()`, `server.ts:11-23`), the
   deterministic-fallback-on-failure pattern (`generateFallbackDecision`/`generateFallbackAudit`/
   `generateFallbackExecutive`/`generateFallbackChat`, `server.ts:37-132`), and the four-endpoint shape
   (`decision-matrix`, `reconcile-audit`, `executive-summary`, `chat`). This should land as a `go-template-main`
   controller (Go, matching the chosen real backend) rather than as a bolted-on Node/Express side-service — porting
   the Express server file itself into `frontend/` would reintroduce a second server stack RAISE does not need.
2. **From `esaps_ai_template/src/pages/*` and `data/*` — the richer AI-specific page/UI patterns**, specifically
   `AIAssistantDrawer.tsx` (chat-drawer UI, not present in `frontend/`) and the `data/*Data.ts` fixture shapes for AI
   decision/reconciliation domains, as a starting point for `frontend/src/data/fixtures/` and
   `frontend/src/pages/AIDecisionCenter/` to extend against, since `frontend/`'s AI Decision Center page already
   exists but is not as visually complete as `esaps_ai_template`'s.
3. **From `react-template-main` — nothing further needs porting; it's already been ported.** Its interceptor
   mechanism is the direct ancestor of `frontend/src/services/api-client.ts`, and its localStorage-token auth pattern
   is the direct ancestor of `frontend/src/contexts/AuthContext.tsx`. The one thing worth carrying over that is
   *not* yet in `frontend/` is a **decision**, not code: the prior audit's finding that JWT-in-localStorage needs an
   explicit risk-acceptance sign-off before production. Treat that finding as inherited, not resolved.

Do **not** pull `@supabase/supabase-js` from `esaps_ai_template` at all — it is an unused dependency there with no
env vars configured and no code referencing it. If RAISE genuinely needs Supabase later, add it deliberately with its
own security review; don't drag over a dead dependency "just in case."

## AI/Supabase Client-Exposure Risk — Finding

**No client-side exposure was found in the code as it exists today.** Verified via full-text grep across
`esaps_ai_template/src/` for `supabase|@google/genai|GEMINI_API_KEY` — zero matches. The Gemini calls happen only in
`esaps_ai_template/server.ts` (Node/Express, not shipped to the browser), and the two page-level `fetch()` calls
(`AIDecisionCenter.tsx:80,120`, `Reconciliation.tsx`) hit relative paths (`/api/ai/...`) on that same server, never
Google's API directly.

**The risk is structural/latent, not active:** `@supabase/supabase-js` is listed as a direct `dependency` (not
`devDependency`) in `esaps_ai_template/package.json` but is never imported anywhere in `server.ts` or `src/`. A
`dependency` (vs. `devDependency`) placement, combined with zero documentation warning against client-side use (contrast
with `frontend/.env.example`'s explicit "must never call Gemini directly and must never hold GEMINI_API_KEY/DB
credentials" comment), means a future contributor extending `esaps_ai_template` has no guardrail stopping them from
`import { createClient } from '@supabase/supabase-js'` directly inside a page component and shipping a Supabase
anon/service key to the browser. **Recommendation:** if any part of `esaps_ai_template` is carried forward, either
remove the unused `@supabase/supabase-js` dependency or add the same explicit "server-side only" comment/lint rule
`frontend/` already has for Gemini. This is a preventive flag, not an active vulnerability finding.

## Is root `src/` a stray duplicate?

**Yes — confirmed byte-for-byte identical to `esaps_ai_template/src/`**, with no divergence in any of the 39 shared
files (full diff, not sampling), and no `package.json`/`tsconfig.json`/build config of its own, so it cannot be run
independently. Treat it as a stray leftover copy, not a meaningful third source. Recommend the user delete or archive
it once `esaps_ai_template` is confirmed as the retained reference copy (this audit did not delete it — read-only
constraint — the user or a follow-up task should make that call).

## Step-by-step adoption plan

1. **Adopt `frontend/` as the sole active frontend codebase going forward.** Stop further development against
   `react-template-main`, `esaps_ai_template`, or root `src/` — they become historical/reference only.
2. **Resolve the RBAC gap before any role-differentiated RAISE feature ships.** All four candidates lack real
   authorization enforcement. `frontend/`'s `RoleManagement` page is UI-only (confirmed by its own source comments:
   "Save Changes was already a local-state-only toast"). Decide the authorization model (permission matrix persisted
   where? enforced server-side, client-side, or both?) and wire `ProtectedRoute` (`frontend/src/App.tsx:26-38`) to
   check role/permission, not just `isAuthenticated`.
3. **Stand up the real AI-proxy endpoint on `go-template-main`**, modeled on `esaps_ai_template/server.ts`'s
   four-route shape and its fallback-on-failure design, so `frontend/`'s existing `/api/v1/ai/*` convention
   (documented in `api-client.ts:7`) has something real to call instead of being an unimplemented convention.
4. **Port `AIAssistantDrawer.tsx` and the AI/reconciliation fixture data** from `esaps_ai_template/src/` into
   `frontend/src/components/` and `frontend/src/data/fixtures/` respectively, adapting to `frontend/`'s existing
   service/repository layering rather than `esaps_ai_template`'s direct-fetch pattern.
5. **Decide and document the JWT-storage risk-acceptance** (localStorage vs. httpOnly cookie via
   `go-template-main`'s `stl_token`) before production — this is inherited from `react-template-main`'s prior audit
   and not yet resolved in `frontend/`.
6. **Clean up the stray duplicates**: remove or archive root `src/`, and either remove `@supabase/supabase-js` from
   `esaps_ai_template/package.json` or add an explicit server-side-only guard comment if that template is kept as a
   reference.
7. **Add CI** (lint + test + build) for `frontend/` — none exists today despite the test suite being real and
   passing; this is the one place `frontend/` is currently behind "LEVEL 3" expectations outright.

## Blocking items before real feature work starts on `frontend/`

- No RBAC/authorization enforcement exists anywhere (UI-only permission matrix, not wired to routes or API calls).
- No CI/CD pipeline configured for `frontend/` (tests exist and pass locally, but nothing runs them automatically).
- `/api/v1/ai/*` endpoints referenced by `frontend/`'s own code comments do not exist yet on `go-template-main` —
  the AI Decision Center page currently has nothing real to call.
- JWT-in-localStorage risk-acceptance decision is still open (inherited, undocumented in `frontend/` itself).
- Root `src/` and `esaps_ai_template`'s unused `@supabase/supabase-js` dependency should be cleaned up so they stop
  being a latent source of confusion/risk for future contributors.
