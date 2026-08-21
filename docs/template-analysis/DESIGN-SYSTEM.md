# Design System

## Summary

There is **no dedicated design-system layer** in this template — no `src/components/ui/` folder, no `Button`/`Input`/`Select`/`Modal`/`Table`/`Card` primitives. Every page (`Login`, `Dashboard`) hand-writes raw Tailwind utility classes directly on native HTML elements (`<input>`, `<button>`, `<div>`). The only reusable, non-page-specific components in the entire codebase are `Loading`, `Navbar`, and `ErrorBoundary` — three components total.

## Component inventory

| Component | Location | Naming convention | Props convention | Styling convention | Composition pattern | A11y support | Classification |
|---|---|---|---|---|---|---|---|
| `Loading` | `src/components/Loading.tsx` | PascalCase file = component name, default export | Single optional `message?: string` prop, typed via `interface LoadingProps` | Inline Tailwind utility classes on JSX, no `cva`/variant system | Standalone leaf component, no children slot | No `role="status"`/`aria-live` — spinner is purely visual | **SHARED** — generic enough for reuse, but not yet proven across multiple pages (only imported nowhere currently — see note below) |
| `Navbar` | `src/components/Navbar.tsx` | PascalCase file = component name, default export | No props — reads `useAuth()` directly | Inline Tailwind, hardcoded `bg-white shadow-md` | Consumes `useAuth()` + `useNavigate()` internally (tightly coupled to auth context, not a pure presentational component) | `<nav>` semantic tag used correctly; no `aria-current` on any nav link (moot today since it has no links) | **FOUNDATION** for the authenticated app shell, but **FEATURE-SPECIFIC** in practice since it has zero configurability (no nav-items prop, no slot for additional actions) |
| `ErrorBoundary` | `src/components/ErrorBoundary.tsx` | PascalCase file = component name, default export | `children: ReactNode` only | Inline Tailwind on the fallback UI | Class component wrapping `children`, single fallback UI (not customizable via props/slots) | Fallback heading/button are plain text, no `role="alert"` | **FOUNDATION** — this is genuinely foundational (root-level infra) but is a single hardcoded fallback UI, not a configurable/reusable pattern (can't pass a custom fallback renderer) |
| `DashboardHeader` | `src/pages/Dashboard/_components/DashboardHeader.tsx` | PascalCase, **named export** (not default — inconsistent with the three above) | `{ user: User \| null }` | Inline Tailwind | Presentational, receives data via props (best-practice pattern here) | Plain `<h1>`/`<p>`, fine for this simple case | **FEATURE-SPECIFIC** (Dashboard-only, correctly scoped under `_components`) |
| `DashboardStats` | `src/pages/Dashboard/_components/DashboardStats.tsx` | PascalCase, named export | None | Inline Tailwind grid | Static hardcoded 3-card demo content ("Card 1/2/3", placeholder Thai text) | No issues, but content is literally placeholder — not a real, reusable stat-card component (no props for title/value/icon) | **LEGACY/DEMO-ONLY** — exists purely to illustrate the `_components` folder convention, not meant to be extended as-is |
| `Login` (page) | `src/pages/Login/index.tsx` | PascalCase, default export | None (self-contained page) | Inline Tailwind | Full page, owns its own form state | Correct `<label htmlFor>`/`id` pairing, `autoComplete` set; no `aria-live` on error message | **FEATURE-SPECIFIC** (a page, not a system component) |
| `Dashboard` (page) | `src/pages/Dashboard/index.tsx` | PascalCase, default export | None | Inline Tailwind | Composes `Navbar` + `DashboardHeader` + `DashboardStats` | N/A (composition root) | **FEATURE-SPECIFIC** |

**UNUSED**: None of the current components are dead code in the sense of "written but never imported" — every file above is actually reached at runtime via the route tree. The closer analogue to "unused" in this template is the **Zustand dependency** (installed, zero imports) — see [DEPENDENCY-REVIEW.md](./DEPENDENCY-REVIEW.md) — and the `types/common.ts` pagination types, which are defined but have no consumer yet.

## Naming/props/styling conventions observed

- **File naming**: One component per file, file name matches component name in PascalCase. Page components use `index.tsx` inside a feature folder (`pages/Login/index.tsx`), consistent with the README's documented convention.
- **Export style is inconsistent**: root `src/components/*` use `export default`; `pages/*/_components/*` use named exports (`export const X`). A developer copying one pattern into the wrong location will produce an import-style mismatch — this is a real, observable inconsistency in the 3 vs. 2 file sample, not a hypothetical risk.
- **Props typing**: Each component with props defines a local `interface <Component>Props`, which is a clean, consistent TypeScript convention.
- **Styling**: 100% Tailwind utility classes, applied directly and repeatedly (e.g., `rounded-lg bg-white p-6 shadow` is duplicated across the two `DashboardStats` cards rather than extracted). No `class-variance-authority` (cva), no `clsx`/`tailwind-merge` for conditional class composition — none of these are installed. Any component needing variants (e.g., a `Button` with `primary`/`secondary`/`danger`) would need this tooling added; it does not exist today.
- **Composition pattern**: Simple parent-renders-children JSX composition; no compound-component pattern, no render-props, no slot API demonstrated anywhere.

## Design tokens

Source: `tailwind.config.js` (`theme.extend`) and `src/index.css`.

| Token | Value | Usage | Source |
|---|---|---|---|
| `colors.primary.50`–`900` | `#fef1f4` → `#7d0f31` (10-step scale, base `500` = `#E50141`) | Buttons, links, focus rings, spinner accent, page `<title>`/meta `theme-color` | `tailwind.config.js` |
| `fontFamily.sans` | `['Prompt', 'sans-serif']` | Applied globally via `@layer base { body { @apply font-sans } }` | `tailwind.config.js` + `src/index.css` |
| Google Fonts import | `Prompt:wght@300;400;500;600;700` | Loaded via `<link>` preconnect/stylesheet in `index.html` | `index.html` |
| `theme-color` meta | `#E50141` | Browser chrome color on mobile | `index.html` (hardcoded, matches `primary.500` but not derived from the Tailwind config programmatically — must be kept in sync manually if the brand color changes) |
| Scrollbar colors | track `#f1f1f1`, thumb `#888`/`#555` hover | Custom `::-webkit-scrollbar` rules | `src/index.css` (raw hex, not tied to the `primary` token scale) |
| `.scrollbar-hide` utility | N/A (behavioral, not color) | Hides scrollbar cross-browser | `src/index.css` `@layer utilities` |

No spacing scale, border-radius scale, shadow scale, breakpoint overrides, or z-index scale are customized — the template relies entirely on Tailwind's built-in defaults for everything except color and font. This means "design tokens" in this template are effectively **one brand color scale + one font family**; there is no broader token system (no semantic tokens like `--color-surface`, `--color-danger`, etc.) to inventory.
