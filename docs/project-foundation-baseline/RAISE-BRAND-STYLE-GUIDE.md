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

**Target organization confirmed, 2026-08-24** (PRD [§16 Resolved Question 39](../01-requirements/RAISE-PRD.md#16-open-questions)):
**RAISE is developed for direct use by Singer (Thailand)**, not a generic/reference platform.
This was confirmed while reviewing the §2 color palette below, when a stakeholder proposed
aligning the palette to Singer's actual Corporate Identity (CI) instead of a generic "tech
blue" identity. §2 now reflects that confirmed direction. This does not change any PRD
functional requirement — see the PRD entry for the exact scope of what this resolution does
and does not affect.

---

## 1. Logo concept

- **Icon**: A stylized "R" — either with an upward stroke/flourish (progress/growth metaphor) or
  constructed from connected nodes (network/data motif, reinforcing "Asset Intelligence").
- **Lockup**: Icon on the left, "RAISE" wordmark to its right in a bold, modern sans (Montserrat
  or Roboto Bold).
- **Color (updated 2026-08-24, Singer CI):** the icon box uses a red-to-dark gradient
  (Singer red → near-black) rather than blue, per §2's confirmed palette; the small
  upward-stroke accent stays a light/contrasting color for legibility against the red.
- No dedicated asset (icon file, SVG, favicon) has been produced yet — this is a direction
  applied inline in the Login page's markup, not a delivered standalone mark/file.

## 2. Color palette

**Superseded 2026-08-24** by the confirmed target-organization fact (Resolved Question 39
above): the original "generic Deep Tech Blue" palette below was proposed before RAISE's
identity as a Singer-direct platform was confirmed. It's kept for the historical record; the
palette actually implemented is the Singer-CI-aligned one further down.

### Original proposal (superseded, kept for record)

| Role | Value | Usage |
|---|---|---|
| Primary | `#1D4ED8` (Deep Tech Blue) | Trust/stability/technology; close to the existing ESAPS reference blue, slightly deepened |
| Secondary / Accent | `#0D9488` (Teal) or `#10B981` (Green) | Calls-to-action, data-viz accents, "normal/healthy" status |
| Background | `#FFFFFF` / `#F8FAFC` | Main content areas |
| Text — heading | `#1E293B` | Headings |
| Text — body | `#64748B` | Body copy (softer than pure black) |

### Singer CI-aligned palette (current, applied to Login 2026-08-24)

| Role | Value | Usage |
|---|---|---|
| Singer Red (Primary/CI) | `#E50040` — confirmed by inspecting computed styles on the live `singerthai.co.th` site, 2026-08-24 (`rgb(229, 0, 64)` on `.action.primary` CTAs and the header bar) | **Accent only** — primary buttons, focus states, logo accent, illustration highlights |
| Singer Red — pressed/dark | `#A80331` — also confirmed on `singerthai.co.th` (`rgb(168, 3, 49)`, a pressed/darker button state) | Hover/active states, anchors the darker end of the `singer-*` scale |
| Secondary | White / Gray / Dark Slate (`#0F172A`–`#1E293B`) | Singer's own secondary palette (white, gray, dark) — used for large surfaces (illustration panel background) instead of red |
| Background | `#FFFFFF` / `#F8FAFC` | Main content areas — unchanged from the original proposal |
| Text — heading | `#1E293B` | Unchanged |
| Text — body | `#64748B` | Unchanged |

The rest of the `singer-*` 11-step scale (50–950) is interpolated between these two confirmed
anchor points, not independently sourced — see the comment in `frontend/src/index.css`.

**Explicit UX caution (from the stakeholder's own proposal, adopted as a hard rule):** in an
asset-management platform, red already carries alert/breakdown/error meaning (see the
existing `error-*` semantic color used for form errors and the `danger` Button variant used
for destructive actions like Dispose). **Red is used only as an accent/interactive color here
— never as a large background fill** — to avoid colliding with that existing meaning. This is
why the illustration panel uses dark slate/black, not solid red, even though Singer's CI is
red-primary.

**Implementation note:** applied as a new `singer-*` color scale in
`frontend/src/index.css`, deliberately separate from both the existing `brand-*` (still blue,
used everywhere else in the app) and `error-*` (still the semantic danger/error red) tokens —
introducing a third scale avoids Login's new red accent becoming visually indistinguishable
from existing danger buttons elsewhere in the app. Also a new opt-in `variant="brand"` on the
shared `Button` component, used only where a page explicitly asks for it (currently: Login's
Sign-in button only) — every other page's buttons are completely unaffected.

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
- **Updated 2026-08-24, Singer CI (supersedes the two bullets above where they conflict):**
  - Right panel background changed from blue to **dark slate/near-black** (not solid red — see
    the UX caution in §2); the asset-network illustration's accent nodes are now **Singer red**
    (glowing against the dark background) instead of teal/green.
  - "Sign in" button: **Singer red** instead of blue, keeping the existing drop-shadow/hover-
    darken behavior from the original proposal.
  - Input focus state: border changes to Singer red instead of blue, **scoped to the Login
    form only** (the shared `.input-base:focus` style used by every other form in the app is
    unchanged — see the "Implementation note" in §2).
  - Microsoft/Google button styling (light-gray border/hover) is unchanged from the original
    proposal — SSO is still not a confirmed requirement, buttons remain decorative/disabled.

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

- **Login page (§4): applied twice, 2026-08-24** — first with the generic "Deep Tech Blue"
  palette, then re-applied hours later with the confirmed Singer CI palette once the target
  organization was confirmed (Resolved Question 39). What's actually in
  `frontend/src/pages/Login/index.tsx` right now is the **Singer CI version** — treat that
  file, not this guide's superseded §2 subsection, as the source of truth for exact current
  styling.
- **Dashboard and everything else: still just a proposal**, now under the Singer CI palette
  rather than the superseded generic one. When those screens are built, whoever implements
  them should treat this guide as an input, not a spec to implement blindly — cross-check
  every screen/label against `RAISE-PROTOTYPE.md` first, since that document (not this one) is
  the requirement-traceable source for what screens and fields exist. Exact navigation IA must
  match `RAISE-PROTOTYPE.md`, not be invented from §4's example list.
- This guide does **not** unblock or change the DEFER status of Auth-dependent ESAPS reference
  pages in `ESAPS-UI-FOUNDATION-BASELINE.md` §2/§3 — that still waits on
  `RAISE-NFR-SEC-RBAC-001`. Login's visual styling and its (unchanged) auth mechanism are
  independent.
- The shared `accent-*` and `brand-*` Tailwind tokens (used throughout the rest of the app)
  were deliberately **not** changed to Singer red — Login uses a new, separate `singer-*`
  token plus an opt-in `Button` variant instead, specifically to avoid an unscoped platform-wide
  re-theme and to avoid colliding with the existing `error-*`/`danger` semantic red used
  elsewhere. If a platform-wide Singer-CI re-theme is wanted later, that's a separate, explicit
  decision, not an automatic extension of this one.
- The Singer red hex (`#E50040`, dark state `#A80331`) is confirmed by direct inspection of
  the live `singerthai.co.th` site, not an official brand guideline document/asset — if Singer
  provides an official brand PDF/asset with a different exact value, correct it in
  `frontend/src/index.css`'s `--color-singer-*` scale in one pass (used nowhere else).
- If the palette/typography choices here conflict with a future design-system decision, this
  document yields — it's a proposal captured at a point in time, not an approved standard.

---

## Document Status

**Draft for Review, partially applied** — stakeholder-submitted visual identity proposal, now
aligned to Singer's confirmed Corporate Identity (PRD §16 Resolved Question 39). Login page
(§4) implemented 2026-08-24 in `frontend/src/pages/Login/index.tsx` and related files, first
with a generic palette then re-applied the same day with the Singer CI palette once the target
organization was confirmed; Dashboard and a real logo asset (§1-§3, §4's Dashboard subsection)
remain proposal-only, not yet built anywhere.
