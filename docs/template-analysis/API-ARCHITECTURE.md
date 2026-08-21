# API Architecture

Source: `src/services/api.ts` (the only HTTP-layer file in the template), consumed by `src/contexts/AuthContext.tsx` and `src/hooks/useFetch.ts`.

## HTTP client

- **Library**: Axios 1.13.2 (resolved), created once via `axios.create()` as a module-level singleton (`const api = axios.create({...})`), exported as both `default` (`api`) and a named `authAPI` object.
- **Base URL handling**: `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'`. Read once at module load from Vite's `import.meta.env`. Falls back to a hardcoded localhost default if the env var is absent — meaning a misconfigured production build that forgets to set `VITE_API_URL` would silently point at `localhost:8000` in the shipped bundle rather than failing loudly.
- **Timeout**: Fixed `10000` ms (10s) for every request, set once at instance creation. No per-request override is used anywhere in the codebase, and no guidance exists for when a call needs a longer/shorter timeout.
- **Default headers**: `Content-Type: application/json` set globally.

## Interceptors

**Request interceptor** (`api.interceptors.request.use`):
- Reads `token` directly from `localStorage` on every outgoing request and sets `Authorization: Bearer <token>` if present.
- No token-refresh-before-expiry logic; no check of whether the token is actually still valid before attaching it.

**Response interceptor** (`api.interceptors.response.use`):
- On success: pass-through, no response transformation/unwrapping.
- On error: if `error.response?.status === 401`, it clears `token`/`user` from `localStorage` and does a **hard browser redirect** — `window.location.href = '/login'` — then re-rejects the error.
  - This is a full page reload, not a React Router navigation (`navigate('/login')`), so it discards all in-memory app state unconditionally on any 401, including ones that might be recoverable (e.g., a single expired background poll request) rather than only on session-ending 401s.
  - There is no distinction between "this specific request's resource requires a role the user doesn't have" (which a backend might also signal via 401/403) and "the session itself is invalid" — both would trigger a full forced logout+redirect under this logic; 403 is not handled/interpreted at all.

## Request/response wrapper

- **None.** Callers use `api.get<T>(url)` / `api.post<T>(url, body)` directly and read `.data` off the Axios response themselves (see `useFetch.ts`: `const response = await api.get<T>(url); ... response.data`).
- `types/api.ts` defines an `APIResponse<T> { data: T; message?: string; success: boolean }` envelope type, but **it is never actually used** anywhere in `services/api.ts` or `hooks/useFetch.ts` — responses are typed and consumed as raw `T`, not as `APIResponse<T>`. This is a discrepancy between the types layer and actual usage: either the backend is expected to return raw payloads (in which case `APIResponse<T>` is dead/aspirational code) or the client is currently failing to unwrap the real envelope. This should be resolved before a real project builds on top of it — flagged as a gap, not silently assumed either way.
- `APIError` (also in `types/api.ts`) is only referenced as a generic type parameter on `AxiosError<APIError>` in the response interceptor's error handler signature — it is never read from (`error.response.data.message` etc. is never accessed anywhere), so error messages surfaced to the UI (e.g., Login's static Thai "invalid username or password" string) do not actually use any server-provided error detail.

## Error handling

- Axios errors propagate up as rejected promises to callers.
- `AuthContext.login()` does not catch its own error — it lets `authAPI.login()` throw, and `Login/index.tsx`'s `handleSubmit` catches it with a single generic Thai error message ("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" / "invalid username or password"), regardless of the actual failure reason (network error, 500, 401, timeout all produce the same message).
- `AuthContext.logout()` does catch its own error (`try { await authAPI.logout() } catch { ... } finally { clear local state anyway }`), which is a reasonable "log out locally even if the server call fails" pattern.
- `useFetch` catches errors and surfaces `error.message` (Axios's own message, e.g. "Network Error" or "Request failed with status code 500") directly into UI state — this leaks Axios-internal phrasing to end users rather than a curated message, and is English-only even though the rest of the UI is Thai-localized.

## Auth headers

Covered above under Request interceptor — a single, global `Authorization: Bearer <token>` header injection point. No support for multiple auth schemes, no per-service API keys, no separate "public" vs. "authenticated" Axios instances (a public, unauthenticated endpoint would still get the header attached if a stale token exists in localStorage, since the interceptor doesn't distinguish routes).

## Retry / cancellation

**MISSING entirely.**
- No retry logic (no `axios-retry`, no manual retry wrapper) for transient network failures or 5xx responses.
- No request cancellation: `useFetch`'s cleanup only sets a local `isMounted` flag to avoid a `setState` on an unmounted component — it does **not** call `AbortController`/`axios` cancel tokens, so the actual in-flight HTTP request is not aborted when a component unmounts or dependencies change rapidly (e.g., fast route changes could leave stale requests running against the network, just not updating state).

## Frontend-to-backend boundary (secrets/DB access)

Confirmed: the frontend performs **no direct database access and no direct third-party secret-bearing API calls**. All network I/O goes through the single `api` Axios instance targeting `VITE_API_URL` (a backend the frontend does not implement), which is the correct architecture for a frontend template. No API keys, connection strings, or secret tokens are hardcoded in `src/` (see [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) for the full secret-scan results).

## Recommended integration pattern for a new API (based on what already exists, not a new proposal)

Following the existing `authAPI` pattern in `services/api.ts`: add a new named export object per domain (e.g., `export const assetAPI = { list: () => api.get<Asset[]>('/assets'), ... }`) in the same file, or split into `services/<domain>.ts` files importing the shared default `api` instance — the latter is what `README.md`'s "Project Structure" diagram documents (`services/[domain].ts`) even though only `services/api.ts` currently exists. Before adopting this pattern as-is for a real project, resolve the `APIResponse<T>` envelope discrepancy noted above, since every new domain service will otherwise inherit the same ambiguity about whether responses are wrapped or raw.
