# Dependency Review

Versions sourced from `package-lock.json` (resolved) with `package.json` ranges shown for comparison. No `npm audit`/`npm outdated` was run (would require network access against the npm registry and/or installed `node_modules`, neither available under this audit's read-only/no-install constraint) — this review is based on manual comparison of declared vs. actual usage, and general knowledge of these packages' major-version cadence as of the lockfile's contents.

## Production dependencies (5 total)

| Package | Declared range | Resolved | Used in code? | Notes |
|---|---|---|---|---|
| react | ^18.2.0 | 18.3.1 | Yes — extensively | Core, in active use. |
| react-dom | ^18.2.0 | 18.3.1 | Yes — `main.tsx` | Core, in active use. |
| react-router-dom | ^7.10.1 | 7.10.1 | Yes — `App.tsx`, `Navbar.tsx`, `Login/index.tsx` | Core, in active use. Note: README's Tech Stack section calls this "React Router 6" — stale text, actual major is 7 (see [TECH-STACK.md](./TECH-STACK.md)). |
| axios | ^1.6.2 | 1.13.2 | Yes — `services/api.ts`, `hooks/useFetch.ts` | Core, in active use. |
| zustand | ^4.4.7 | 4.5.7 | **No — zero imports anywhere in `src/`** | **Dead dependency in this snapshot.** Confirmed via repo-wide search for `zustand` across `src/` — no matches outside `package.json`/lockfile. Either remove it if genuinely unneeded, or wire it into the one place the template gestures at needing shared state (there currently is none, since `AuthContext` already covers the only cross-component state). Recommend: leave the decision to the project team, but do not assume it is "already integrated" the way README implies. |

## Dev dependencies (14 total, from `package.json`)

| Package | Declared range | In active use (config/tooling)? | Notes |
|---|---|---|---|
| typescript | ^5.2.2 | Yes — `tsconfig.json`, compiled via `build` script | Core tooling. |
| vite | ^5.0.8 | Yes — `vite.config.ts`, `dev`/`build`/`preview` scripts | Core tooling. |
| @vitejs/plugin-react | ^4.2.1 | Yes — referenced in `vite.config.ts` | Core tooling. |
| tailwindcss | ^3.4.0 | Yes — `tailwind.config.js`, `index.css` | Core tooling. |
| postcss | ^8.4.32 | Yes — `postcss.config.js` | Core tooling (Tailwind pipeline). |
| autoprefixer | ^10.4.16 | Yes — `postcss.config.js` (assumed standard registration, not independently re-verified beyond presence in deps) | Core tooling. |
| eslint | ^8.55.0 | Yes — `.eslintrc.cjs`, `lint` script | Could not be executed to confirm it actually passes (no `node_modules` — see [TESTING-STANDARD.md](./TESTING-STANDARD.md)). |
| @typescript-eslint/eslint-plugin | ^6.14.0 | Yes — referenced in `.eslintrc.cjs` `extends` | Tooling. |
| @typescript-eslint/parser | ^6.14.0 | Yes — referenced in `.eslintrc.cjs` `parser` | Tooling. |
| eslint-plugin-react-hooks | ^4.6.0 | Yes — referenced in `.eslintrc.cjs` `extends` | Tooling. |
| eslint-plugin-react-refresh | ^0.4.5 | Yes — referenced in `.eslintrc.cjs` `plugins`/rule | Tooling. |
| prettier | ^3.1.1 | Yes — `.prettierrc`, `format` script | Not integrated with ESLint (no `eslint-config-prettier`/`eslint-plugin-prettier` present) — the two tools can theoretically disagree on formatting-adjacent rules since neither defers to the other; not confirmed to actually conflict since neither tool was runnable in this audit. |
| @types/react | ^18.2.43 | Yes — implicit, TS type resolution for `react` | Matches `react`'s major (18). |
| @types/react-dom | ^18.2.17 | Yes — implicit | Matches `react-dom`'s major (18). |

## Unused / dead

- **`zustand`** — see above. The only unused production dependency identified.
- No unused dev dependencies were identified — every dev dependency maps to an actual config file or script that references it.

## Duplicate/overlapping libraries

None found. There is exactly one library per concern (one HTTP client, one router, one CSS framework, one state library-that-happens-to-be-unused, one linter, one formatter) — no competing libraries for the same job exist side by side.

## Outdated/deprecated packages

Based on major-version comparison only (no registry lookup performed):

- All production dependencies are on their current major line as of this lockfile (React 18.x — not yet React 19; Router 7.x — current; Axios 1.x — current; Zustand 4.x — not yet Zustand 5.x, though this is moot while it's unused).
- ESLint is on major version 8 (`8.57.1`), not the newer ESLint 9 flat-config line. This is not "deprecated" but is worth flagging: ESLint 8 is still functional but the ecosystem (including `@typescript-eslint`) has been migrating toward ESLint 9 + flat config (`eslint.config.js`) as the forward path. A project with a longer lifespan should be aware this template will eventually need an ESLint-major upgrade and a config-format migration.
- `@typescript-eslint/*` is on major version 6, while `typescript` itself resolves to 5.9.3 — worth a compatibility check before assuming linting fully understands every TS 5.9 syntax feature, though no actual incompatibility was observed (could not run lint to confirm either way — see [TESTING-STANDARD.md](./TESTING-STANDARD.md)).
- Node 18 (Dockerfile's `node:18-alpine`) is an LTS line but is not the newest Node LTS as of this lockfile's era — worth confirming against whatever Node version the company standardizes on, if one exists (not discoverable from this repo alone).

## Known-vulnerability concerns

No CVE-level assessment could be performed (no `npm audit`, no network access exercised, no `node_modules` installed, and installing was explicitly out of scope for this audit). This should be treated as an **open item**, not a clean bill of health — recommend running `npm audit` (or an equivalent SCA tool) as a real, separate step once dependencies are actually installed for development, before treating this template as vetted for production use.

## Recommendations (do not upgrade/remove anything — for the project team to action)

1. Decide the fate of `zustand`: either remove it from `package.json` (if the project will rely on Context + local state, as demonstrated) or actually adopt it for one real piece of shared state, so the dependency list reflects what's genuinely used.
2. Run `npm audit` after a real `npm install`, before shipping any project built from this template.
3. Track the ESLint 8 → 9 (flat config) migration as a future maintenance item, not an immediate blocker.
4. Correct README's "React Router 6" claim to "7" to prevent confusion for anyone reading docs before code.
