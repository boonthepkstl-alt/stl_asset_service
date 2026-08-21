# Testing Standard

## What was actually attempted

Per audit instructions, the following commands were attempted from within `react-template-main` (read-only, nothing installed or modified):

```
npm run lint    # attempted
npm run build   # not attempted after lint result (see below)
```

`package.json` scripts are: `dev`, `build` (`tsc && vite build`), `preview`, `lint`, `format`. There is **no `test` script and no `typecheck` script** — `build` is the only script that performs type checking (via `tsc` with `noEmit: true`), bundled together with the production bundle step rather than exposed as its own command.

**Result of `npm run lint`**: failed immediately with `'eslint' is not recognized as an internal or external command` — because `node_modules/` does not exist in this delivered tree (confirmed: `test -d node_modules` → absent) and dependencies were never installed. Per the audit's hard constraints, installing packages is prohibited, so `npm run lint` and `npm run build` (and therefore the `tsc` typecheck step) **could not be executed or verified** in this audit. This is reported honestly rather than assuming they would pass.

**Implication**: no pass/fail evidence exists for lint or the type-check-via-build step in this audit. This is a limitation of the audit environment (no dependency install permitted), not a claim that the code itself would fail — it genuinely was not run.

## Actual testing setup found in the codebase

**None.** Specifically confirmed absent:

- **Unit test framework**: No Jest, no Vitest. No `vitest.config.ts`, no `jest.config.*`. `package.json` devDependencies contain zero testing libraries.
- **Component testing**: No `@testing-library/react`, no `@testing-library/jest-dom`, no Enzyme.
- **Integration tests**: None found.
- **Route testing**: None found (no test exercises `App.tsx`'s route table or `ProtectedRoute` logic).
- **E2E testing**: No Playwright, no Cypress, no config files, no `e2e/` directory.
- **Test files**: A repo-wide file listing of `src/` shows zero `*.test.ts(x)`/`*.spec.ts(x)` files — every one of the 21 source files was read in full during this audit and none is a test file.
- **Test utilities/mocks/fixtures**: None exist (no `__mocks__/`, no `src/test-utils.tsx`, no MSW/`msw` handlers, no fixture data files beyond the hardcoded demo strings inside `DashboardStats.tsx`).
- **CI wiring for tests**: Moot — there is no CI/CD pipeline at all (confirmed in [ARCHITECTURE.md](./ARCHITECTURE.md)), so even if tests existed, nothing would currently run them automatically.

## Feature → test-layer flow diagram (limited to what's real)

```
Feature code
     │
     ▼
  (no test layer exists)
     │
     ▼
npm run build   →  tsc typecheck (compile-time safety net only)
     │
     ▼
Manual QA in the browser (implied, not codified anywhere)
```

This is the entirety of the real quality-gate chain today: TypeScript's compiler is the only automated correctness check the template provides, and even that runs bundled inside `build` rather than as an independent, fast `typecheck` script a developer or CI step could call cheaply. ESLint provides a second static-analysis layer (`npm run lint`) but, like `build`, could not be verified to actually pass in this audit environment.

## Standing recommendation (do not read this as "tests exist")

A project adopting this template starts from **zero test coverage** and must choose and configure a testing stack from scratch (this decision is intentionally left to the project team — see [PROJECT-STARTING-GUIDE.md](./PROJECT-STARTING-GUIDE.md) and [TEMPLATE-READINESS-REVIEW.md](./TEMPLATE-READINESS-REVIEW.md) for how this factors into the readiness verdict). Given Vite is already the build tool, Vitest is the most natural first addition (shares Vite's config/transform pipeline), but no such choice has been made in this template as delivered, and this audit does not recommend adopting a new tool preemptively.
