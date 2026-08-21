# Tech Stack

Versions below are taken from **`package-lock.json`** (resolved/installed versions), not from `README.md`, which is stale in places (see [TEMPLATE-STRUCTURE.md](./TEMPLATE-STRUCTURE.md) discrepancy list). `package.json` range column shown for reference.

## Production dependencies

| Technology | package.json range | Resolved version (lockfile) | Purpose | Company Standard? | Notes |
|---|---|---|---|---|---|
| react | ^18.2.0 | 18.3.1 | UI library | Undetermined — no company standards doc found in this repo | Standard, current major (React 18, not 19). |
| react-dom | ^18.2.0 | 18.3.1 | DOM renderer | Undetermined | Matches `react` version. |
| react-router-dom | ^7.10.1 | 7.10.1 | Client-side routing | Undetermined | README says "React Router 6" — **stale**, actual is v7 and `App.tsx` uses the v7 `Routes`/`Route`/`Outlet` API. |
| axios | ^1.6.2 | 1.13.2 | HTTP client | Undetermined | Lockfile resolved well ahead of the package.json floor (1.6.2 → 1.13.2); no ceiling risk since range is caret. |
| zustand | ^4.4.7 | 4.5.7 | State management | Undetermined | **Installed but never imported anywhere in `src/`** — dead dependency in this template snapshot (see [DEPENDENCY-REVIEW.md](./DEPENDENCY-REVIEW.md)). |

## Dev dependencies

| Technology | package.json range | Resolved version | Purpose | Company Standard? | Notes |
|---|---|---|---|---|---|
| typescript | ^5.2.2 | 5.9.3 | Type checking | Undetermined | `tsc` (no-emit) is the only typecheck path; run via `npm run build`, not a dedicated `typecheck` script. |
| vite | ^5.0.8 | 5.4.21 | Build tool / dev server | Undetermined | Vite 5, not yet Vite 6/7. |
| @vitejs/plugin-react | ^4.2.1 | (not individually verified beyond lockfile presence) | React fast-refresh plugin for Vite | Undetermined | Standard pairing with Vite. |
| tailwindcss | ^3.4.0 | 3.4.18 | Utility-first CSS | Undetermined | Tailwind v3, not v4 (v4 has a materially different config format — relevant if the company later standardizes on v4). |
| postcss / autoprefixer | ^8.4.32 / ^10.4.16 | not individually re-verified | CSS pipeline | Undetermined | Standard Tailwind companion tooling. |
| eslint | ^8.55.0 | 8.57.1 | Linting | Undetermined | ESLint 8 (flat config not adopted; still `.eslintrc.cjs`). Relevant if company is moving to ESLint 9 flat config. |
| @typescript-eslint/eslint-plugin, @typescript-eslint/parser | ^6.14.0 | not individually re-verified | TS-aware linting | Undetermined | v6, not v7/v8. |
| eslint-plugin-react-hooks | ^4.6.0 | not individually re-verified | Hooks-rule linting | Undetermined | Standard. |
| eslint-plugin-react-refresh | ^0.4.5 | not individually re-verified | Vite fast-refresh lint rule | Undetermined | Standard for Vite+React templates. |
| prettier | ^3.1.1 | not individually re-verified | Formatting | Undetermined | Not wired into ESLint (`eslint-config-prettier` / `eslint-plugin-prettier` are absent) — the two tools run independently, which can produce conflicting diagnostics; not verified to conflict in practice since neither ran (see [TESTING-STANDARD.md](./TESTING-STANDARD.md)). |

## Explicitly absent (do not assume present)

- No test runner (Jest/Vitest/Testing Library) — MISSING.
- No E2E framework (Playwright/Cypress) — MISSING.
- No form library (react-hook-form, Formik) — MISSING; SETUP.md lists it as an "optional" future install, confirming it is intentionally not yet part of the foundation.
- No UI/component library (NextUI, shadcn/ui, Headless UI) — MISSING; same "optional" status in SETUP.md.
- No data-table library (TanStack Table) — MISSING, optional per SETUP.md.
- No date library (date-fns/dayjs) — MISSING; date formatting is hand-rolled in `utils/format.ts` via `Intl`/`toLocaleDateString`.
- No icon library — MISSING.
- No i18n library — MISSING, despite the UI already being 100% Thai-language hardcoded strings (no translation layer exists at all, so "i18n-ready" should not be assumed).
- No CI/CD config of any kind (`.github/`, `.gitlab-ci.yml`, etc.) — MISSING, confirmed by directory search.

## Runtime/tooling versions implied by Dockerfile

| Item | Value | Notes |
|---|---|---|
| Node (build stage) | `node:18-alpine` | Node 18 — check against company Node LTS standard if one exists; not verifiable from this repo alone. |
| Web server (prod stage) | `nginx:1.27.1-alpine` | Serves the static `dist/` output; no custom `nginx.conf` is copied in, so SPA fallback routing (`try_files`) is **not configured inside the image** — only shown as a manual example in `SETUP.md` for a non-Docker deployment. This is a gap if the Docker image is used as-is for an SPA behind deep links. |
