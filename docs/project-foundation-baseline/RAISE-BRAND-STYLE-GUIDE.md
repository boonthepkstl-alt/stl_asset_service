# RAISE Brand & Style Guide (Proposed)

## Purpose and scope

This document captures a **visual identity proposal** for RAISE (Enterprise Asset Intelligence
Platform) — logo direction, color palette, typography, and UI styling guidelines — submitted by
a stakeholder while reviewing `esaps_ai_template/src/pages/Auth.tsx` (the ESAPS reference Login
page, viewed read-only, not a page under active development in this project).

**This is not a requirement document and carries no `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` ID.**
Branding/visual-identity is not itself a functional or non-functional requirement in
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) — this guide exists so the proposal isn't lost
before real frontend work starts, not to assert it as settled scope.

**Status when written:** `frontend/` (`raise-frontend`, the actual RAISE build target) has an
empty `src/` — no Login page or any other screen exists there yet. The two-panel Login layout
that prompted this proposal is `esaps_ai_template/src/pages/Auth.tsx`, which
[`ESAPS-UI-FOUNDATION-BASELINE.md`](ESAPS-UI-FOUNDATION-BASELINE.md) §2 marks **DEFER** — the
authentication mechanism behind it (`RAISE-NFR-SEC-RBAC-001`) is still TBD in the PRD. **No file
in `esaps_ai_template/` was modified to produce or apply this guide** — per `CLAUDE.md`, that tree
is read-only reference.

Visual identity (logo/color/type) is independent of the auth-mechanism question — it can be
adopted whenever real screens are built in `frontend/`, regardless of when
`RAISE-NFR-SEC-RBAC-001` resolves. Component-level application (e.g., an actual styled Login
screen) still waits on that resolution, same as every other Auth-dependent slice in
`ESAPS-UI-FOUNDATION-BASELINE.md` §3.

---

## 1. Logo concept

- **Icon**: A stylized "R" — either with an upward stroke/flourish (progress/growth metaphor) or
  constructed from connected nodes (network/data motif, reinforcing "Asset Intelligence").
- **Lockup**: Icon on the left, "RAISE" wordmark to its right in a bold, modern sans (Montserrat
  or Roboto Bold).
- No asset (icon file, SVG, favicon) has been produced yet — this is a direction, not a delivered
  mark.

## 2. Color palette

| Role | Value | Usage |
|---|---|---|
| Primary | `#1D4ED8` (Deep Tech Blue) | Trust/stability/technology; close to the existing ESAPS reference blue, slightly deepened |
| Secondary / Accent | `#0D9488` (Teal) or `#10B981` (Green) | Calls-to-action, data-viz accents, "normal/healthy" status |
| Background | `#FFFFFF` / `#F8FAFC` | Main content areas |
| Text — heading | `#1E293B` | Headings |
| Text — body | `#64748B` | Body copy (softer than pure black) |

## 3. Typography

| Language | Recommended family | Why |
|---|---|---|
| English/Latin | `Inter` or `Roboto` | Screen-optimized, reads well with dense numeric data |
| Thai | `Prompt` or `Noto Sans Thai` | Modern, formal register |

## 4. UI guidelines by area

**Login screen** (visual restyle direction only — functional auth flow unaffected):
- Right panel (graphic side): replace the current simple device illustration with an isometric
  3D or abstract data-visualization illustration (floating asset network, mock dashboard) to
  better read as "Asset Intelligence Platform."
- Left panel (form side): add a soft drop-shadow to the primary "Sign in" button, darken primary
  blue on hover; give the Microsoft/Google buttons a light-gray border with a light-gray hover
  background.

**Dashboard** (post-login overview — no such screen exists yet in `frontend/` or in the PRD's
confirmed MVP scope beyond what's already in `RAISE-PROTOTYPE.md`):
- Sidebar navigation (dark blue or white) with primary sections such as Overview, Asset
  Directory, Predictive Maintenance, Reports — **note:** exact navigation labels/IA must still
  match whatever screens `RAISE-PROTOTYPE.md` actually specifies, not be invented independently
  of it.
- Summary card widgets (total assets, assets needing urgent maintenance in red/orange warning
  color) and charts using the secondary/accent color.

---

## 5. How this should be used

- When `frontend/src/` implementation actually begins, whoever builds the design system /
  component library (see `COMPANY-FOUNDATION-BASELINE.md` §6, unresolved decision #5) should treat
  this guide as an input, not a spec to implement blindly — cross-check every screen/label against
  `RAISE-PROTOTYPE.md` first, since that document (not this one) is the requirement-traceable
  source for what screens and fields exist.
- This guide does **not** unblock or change the DEFER status of Auth-dependent ESAPS reference
  pages in `ESAPS-UI-FOUNDATION-BASELINE.md` §2/§3 — that still waits on
  `RAISE-NFR-SEC-RBAC-001`.
- If the palette/typography choices here conflict with a future design-system decision, this
  document yields — it's a proposal captured at a point in time, not an approved standard.

---

## Document Status

**Draft for Review** — stakeholder-submitted visual identity proposal, captured verbatim with
light structuring, not yet applied to any code (no file under `frontend/`, `esaps_ai_template/`,
or `src/` was modified to produce this document). 2026-08-24.
