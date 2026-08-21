# Security Review

Method: manual read of every file in `src/` plus root config/env-related files. No secret values are printed anywhere in this document even where "present" — none were found, but the redaction rule was followed regardless as a standing policy.

## Findings

### CRITICAL

None found.

### HIGH

**H1 — JWT/session token stored in `localStorage`, readable by any script on the page.**
- Location: `src/contexts/AuthContext.tsx` (`localStorage.setItem('token', ...)`, `localStorage.getItem('token')`), `src/services/api.ts` (request interceptor reads it, response interceptor clears it).
- Risk: `localStorage` has no `httpOnly` protection. Any successful XSS on the page (from a future dependency, a future feature that renders unsanitized content, etc.) can read the token directly via `localStorage.getItem('token')` and exfiltrate it, effectively achieving full session takeover. This is a well-known, standard risk class for SPA JWT-in-localStorage patterns — flagged as HIGH rather than CRITICAL because no actual XSS vector exists in the current 21-file codebase (see XSS findings below — there are none today), so this is a latent architectural risk that becomes exploitable the moment any XSS is introduced later, not an active vulnerability today.
- Note: this is inherent to the chosen auth architecture, not a coding mistake — flagging it here is about informing a go/no-go decision for production use, not about a bug to patch.

### MEDIUM

**M1 — Hard, unconditional 401 redirect via `window.location.href` clears session and reloads the page for *any* 401 from *any* request.**
- Location: `src/services/api.ts`, response interceptor.
- Risk: Because this fires for every 401 regardless of which endpoint triggered it, a single stale/failing background request (e.g., a secondary `useFetch` call to a resource the user simply lacks access to, once such an endpoint exists) would force-log-out the entire session and hard-reload the app, discarding all unsaved in-memory state. This is a robustness/UX-adjacent security concern: over-aggressive session termination on any 401 is a broad blast radius for what might be a narrow authorization failure. It is not exploitable by an attacker directly, but it is a design gap worth fixing before scaling past one API endpoint.

**M2 — No token-expiry validation before use; expired tokens are only discovered reactively via a live 401.**
- Location: `src/contexts/AuthContext.tsx` startup logic.
- Risk: A revoked/expired token restored from `localStorage` on page load is treated as valid client-side (`isAuthenticated: !!token`) until the next network call fails. This is a UX/robustness gap more than an exploitable vulnerability (the backend should still reject the expired token on any real request), but it means the client-side "logged in" state can be silently wrong for a period.

**M3 — `README.md`/`SETUP.md` describe `.env`/`.env.production` as though they ship with the template, but the audited repository contains none.**
- Location: Documentation vs. actual root file listing.
- Risk: Not a vulnerability in the delivered code (no secrets are exposed because no `.env` file exists at all here), but a process risk: if a team member follows the README literally (`cp .env .env.local`) without realizing no `.env` exists, they may create their own ad hoc env file and accidentally commit it later if `.gitignore` is ever weakened. Flagged as MEDIUM because it's a documentation/process gap that could lead to a future secret-handling mistake, not a current secret exposure.

### LOW

**L1 — `Content-Type: application/json` and `Authorization` are the only headers ever set; no CSRF-token header pattern exists.**
- Location: `src/services/api.ts`.
- Risk: For a Bearer-token-in-header auth model (as opposed to cookies), classic CSRF is largely mitigated by design (CSRF primarily targets ambient-credential mechanisms like cookies), so this is LOW rather than higher — noted for completeness since the auth model could change (e.g., if a future refactor moves the token into an httpOnly cookie to fix H1, CSRF protections would then need to be added at that time).

**L2 — Client-side-only validation for password strength (`isStrongPassword` in `utils/validation.ts`) is defined but not actually wired into the Login form.**
- Location: `src/utils/validation.ts` vs. `src/pages/Login/index.tsx`.
- Risk: Not itself a vulnerability (login doesn't need password-strength checks; that belongs on a registration/change-password flow that doesn't exist yet), but noted because it means the utility is unverified/untested in real use — if a future registration page imports it, it should be sanity-checked against real password test cases before trusting it as the client-side gate for a security-relevant flow.

**L3 — `console.error`/`console.warn` calls throughout (`ErrorBoundary`, `AuthContext`, `useLocalStorage`, `logger.ts`) will print full error objects to the browser console in production builds, since `logger.warn`/`logger.error` are not gated by `isDevelopment` (only `info`/`debug` are).**
- Location: `src/utils/logger.ts` (`warn`/`error` methods lack the `if (this.isDevelopment)` guard that `info`/`debug` have), `src/contexts/AuthContext.tsx`, `src/components/ErrorBoundary.tsx`.
- Risk: Low — this is standard for most SPAs and doesn't leak secrets (no tokens are ever logged), but it does mean stack traces / internal error details are visible in the production browser console to any user who opens devtools, which is a minor information-disclosure surface (e.g., internal file paths in stack traces).

### INFO

**I1 — No hardcoded secrets, API keys, tokens, or credentials found anywhere in `src/` or root config files.** Confirmed by manual read of all 21 source files plus config files; the only "value" resembling a token pattern is the literal string `'token'`/`'user'` used as **localStorage key names** (`STORAGE_KEYS` in `config/constants.ts`), which are not secrets themselves.

**I2 — No `dangerouslySetInnerHTML` usage anywhere in the codebase.** Confirmed via repo-wide search — zero matches. No `eval()`, no `innerHTML` assignment either. This means there is currently **no XSS vector introduced by the template's own code** (the HIGH finding above about localStorage tokens is about the *consequence* of a future XSS, not evidence that one exists today).

**I3 — No unsafe redirects.** The only programmatic redirects are `navigate('/login')` / `navigate('/dashboard')` (React Router, internal-only paths, no user-controlled input) and `window.location.href = '/login'` (hardcoded literal, not derived from any URL parameter or user input) — no open-redirect pattern exists.

**I4 — No CORS configuration exists on the frontend** (CORS is a server-side concern); the Vite dev-server proxy (`vite.config.ts`, `/api` → `VITE_PROXY_TARGET`) is a development convenience only and is not present in the production Docker build (the nginx stage serves only the static bundle, no proxy). No assumption should be made that this dev proxy provides any production CORS handling — it does not, and none is configured for production in this repo.

**I5 — Outdated/vulnerable dependency scan**: not performable with certainty in this audit — no `npm audit` was run (would require network access and is arguably out of scope for a purely offline read-only review), and `node_modules` is not installed. See [DEPENDENCY-REVIEW.md](./DEPENDENCY-REVIEW.md) for what could be assessed from `package-lock.json` alone (resolved versions are all reasonably current majors as of the lockfile's contents; no assessment of known CVEs was possible without running `npm audit`).

## Summary counts

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| HIGH | 1 |
| MEDIUM | 3 |
| LOW | 3 |
| INFO | 5 |
