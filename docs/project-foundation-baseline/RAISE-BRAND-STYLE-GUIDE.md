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

**Status when written (2026-08-24, superseded same day):** this section originally stated that
`frontend/`'s `src/` was empty and that the two-panel layout came from the read-only
`esaps_ai_template/src/pages/Auth.tsx` reference. **That was already stale at the time of
writing** — `frontend/src/pages/Login/index.tsx` is real, in-development RAISE code (split-panel
layout shipped in PR #5), not the ESAPS reference. The stakeholder who submitted this proposal
was looking at the real, running `frontend/` Login page on `localhost`, not the reference app.

**Applied 2026-08-24** (same day, once this was caught): logo mark, color usage, typography, and
Login-panel styling from §1-§4 below were implemented directly in
`frontend/src/pages/Login/index.tsx`, `frontend/src/components/ui/Button.tsx`,
`frontend/src/index.css`, and `frontend/index.html` — scoped to the Login page and shared
Button component only, not a platform-wide re-theme (the existing `brand-*` token already
matched the proposed primary blue almost exactly; the proposed teal/green accent was applied
using the existing `success-*` token rather than redefining the shared `accent-*` token, which
is used elsewhere in the app and was left untouched to avoid an unscoped visual change). See
`docs/project-management/DEVELOPMENT-LOG.md` for the corresponding checkpoint.

The auth *mechanism* question (`RAISE-NFR-SEC-RBAC-001`, still TBD) is unaffected by this —
visual styling and the underlying auth flow are independent, and the Login page's actual
username/password submission logic was not touched by this styling pass.

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

- **Login page (§4): applied**, 2026-08-24 — see the note under "Status when written" above.
  Any future Login change should stay consistent with what's now actually in
  `frontend/src/pages/Login/index.tsx`, not re-derive from this guide's original text.
- **Dashboard and everything else: still just a proposal.** When those screens are built,
  whoever implements them should treat this guide as an input, not a spec to implement blindly —
  cross-check every screen/label against `RAISE-PROTOTYPE.md` first, since that document (not
  this one) is the requirement-traceable source for what screens and fields exist. Exact
  navigation IA must match `RAISE-PROTOTYPE.md`, not be invented from §4's example list.
- This guide does **not** unblock or change the DEFER status of Auth-dependent ESAPS reference
  pages in `ESAPS-UI-FOUNDATION-BASELINE.md` §2/§3 — that still waits on
  `RAISE-NFR-SEC-RBAC-001`. Login's visual styling and its (unchanged) auth mechanism are
  independent.
- The shared `accent-*` Tailwind token (used in 13 other files) was deliberately **not**
  changed to teal/green — only Login-scoped elements use the proposed accent, via the existing
  `success-*` token. If a platform-wide re-theme is wanted later, that's a separate, explicit
  decision, not an automatic extension of this one.
- If the palette/typography choices here conflict with a future design-system decision, this
  document yields — it's a proposal captured at a point in time, not an approved standard.

---

## Document Status

**Draft for Review, partially applied** — stakeholder-submitted visual identity proposal.
Login page (§4) implemented 2026-08-24 in `frontend/src/pages/Login/index.tsx` and related
files (see "Applied 2026-08-24" note above); Dashboard and logo asset (§1-§3, §4's Dashboard
subsection) remain proposal-only, not yet built anywhere.
