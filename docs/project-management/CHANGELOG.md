# RAISE — Changelog

**Purpose:** a stakeholder-facing "what's new," grouped by date, in
plain terms — what a user or reviewer of the running app would actually
notice. For engineering detail per PR, see
[`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md). Follows the spirit of
[Keep a Changelog](https://keepachangelog.com/), grouped by date rather
than version since there are no tagged releases yet.

**Maintenance rule:** add an entry under today's date whenever a merged PR
changes user-visible or API-visible behavior. Pure documentation-sync PRs
(chain re-syncs, this tracking folder) are **not** listed here — see
`DEVELOPMENT-LOG.md` for those.

---

## 2026-08-28

### Added
- **Category & Hierarchy screen** — a new "Category & Hierarchy" page
  (reachable from the sidebar) lists every asset category with a live
  asset count; expanding a category shows the real assets registered
  under it, each linking through to its Asset Detail page.

## 2026-08-27

### Added
- **Asset Detail — Financial and Lifecycle sections** — the Overview tab
  now shows a Financial section (purchase cost, current value, purchase
  date) and a Lifecycle section that links out to the Custody, Warranty,
  Maintenance, and Audit information for that asset.

### Fixed
- **Asset Detail — Custody History is now append-only** — the History
  tab now shows a real, growing log of custody-changing events (Assign,
  Check-in), each with a timestamp and who performed it. A Check-in no
  longer erases the prior assignment entry — both stay visible.

## 2026-08-26

### Added
- **Asset Registry — Category filter** — the Filters panel on the Assets
  page now has a Category filter (alongside Status/Department/Location)
  that narrows the asset list.

### Fixed
- **Scan QR — invalid code message** — scanning or typing a malformed
  code (garbled/unreadable input) now shows a distinct "Invalid code"
  message, instead of the same generic "No asset found" message shown
  for a well-formed code that just doesn't match any asset.

## 2026-08-25

### Changed
- **Executive Dashboard KPIs (internal, first cut)** — the Total Assets,
  Available, Assigned, In Maintenance, Expired Warranty, and department/
  type distribution numbers on the Dashboard are now computed by the
  backend instead of in the browser. No visible change for users — same
  numbers, same layout. Software License count, Monthly Depreciation/
  Cost, and the AI Insights panel are unchanged (still not backed by a
  real formula).

### Added
- **Audit Log** — Asset Detail's "Audit" tab now shows real, recorded
  activity for that asset (create/assign/check-in), each with the
  actual person who did it and when, instead of a fixed example list.
  Entries cannot be edited or deleted through the app. Maintenance
  ticket activity (create/approve/dispatch/status updates) is now
  recorded too, though there is no dedicated screen to view it yet —
  it's captured internally, ready for a future viewing surface.
- **QR / Barcode identification** — "Print QR Code" (Assets list and Asset
  Detail) now generates a real, scannable QR code linking to the asset's
  record, with a working download button. "Scan QR" on the Assets list
  opens a scan/entry field (works with a real barcode scanner or manual
  typing) that jumps straight to the matching asset.

### Fixed
- **QR Code display** — the previous "Print QR Code" modal showed a
  decorative pattern that only looked like a QR code and could not
  actually be scanned; its download button did nothing. Both now work.
- **Asset lookup by code** — looking up an asset by its printed/scanned
  code (e.g. "AST-0004") now works; previously only the internal record
  id was recognized.

## 2026-08-24

### Added
- Asset **Check-in** action — an asset can now be returned to `Available`
  from the Asset Detail page, not just assigned.
- Real **Assign** flow on Asset Detail — the "Assign" button now actually
  opens an employee picker and assigns the asset, instead of showing a
  placeholder toast.
- Real **Assignment History** on Asset Detail — shows the asset's actual
  current custody state instead of hardcoded example rows.
- **Maintenance / IT Requisition** backend — ticket creation, department
  approval, IT dispatch, and technician execution status updates are now
  backed by a real API (behind a feature flag, off by default).

## 2026-08-23

### Added
- **Employee** backend — employee records can be created, listed, filtered,
  and updated against a real API (behind a feature flag).
- Asset Registry now callable against the real backend API (behind a
  feature flag) instead of only the in-memory mock.

### Fixed
- **Login** — fixed a contract mismatch where the backend's response shape
  didn't match what the frontend expected, which made real login fail even
  with correct credentials. Login now works end-to-end against the real
  backend.

## 2026-08-22

### Added
- **Asset Registry** backend — assets can now be created, listed, filtered,
  and assigned against a real API (behind a feature flag).

### Changed
- Login page redesigned (split-panel layout).
- Roadmap-only pages (Software Licenses, AI Decision Center) are now
  hidden by default so they aren't mistaken for shipped MVP features.

### Fixed
- Dev server no longer fails to start when its default port is already in
  use.
- Fixed a pre-existing build failure in the company React template.

## 2026-08-21

### Changed
- Initial RBAC middleware wiring on the template's reference routes.
