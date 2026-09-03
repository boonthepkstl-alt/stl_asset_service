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

## 2026-09-03

### Changed
- **Asset Handovers navigation consolidated to one page** — the sidebar
  previously listed 3 separate items for the IT Hardware handover
  workflow (My Pending Assignments / IT Processing Queue / IT Supervisor
  Approval Queue). These are now one "Asset Handovers" entry with tabs
  for each stage — only the tabs relevant to your role show up, and the
  page opens on the tab that matches what you'd normally act on. No
  change to what the workflow itself does.

## 2026-09-02

### Added
- **IT Hardware Assignment Approval Workflow (backend only)** — assigning
  an asset in the **IT Hardware** category no longer happens instantly.
  It now goes through 4 steps: the assigned employee must confirm they
  received it, then IT processes the handover, then an IT supervisor
  gives final approval before the asset shows as Assigned. If IT or the
  supervisor rejects it at their step, the asset immediately goes back to
  Available. Assigning every other category of asset, and all Check-in,
  works exactly as before — unaffected. **Initially shipped API-only**
  (no screen for employees, IT staff, or IT supervisors to act on it) —
  a real UI shipped later the same day, see below.
- **IT Hardware Assignment Approval Workflow now has a real UI** — the
  employee being assigned an IT Hardware asset now sees it under "My
  Pending Assignments" and can confirm receipt; IT staff and IT
  supervisors get their own queues to process and approve handovers.
  Previously this workflow only existed at the API level with no way to
  actually use it from the app.

## 2026-09-01

### Added
- **Local Docker infrastructure** — `docker compose up --build` now runs
  the whole stack (frontend, backend, PostgreSQL) as 3 containers for
  local dev/demo, with the database schema auto-applied on first run.
  See `DOCKER.md`. This is local tooling only — production hosting is
  still undecided.
- **Configurable Warranty "Expiring" threshold** — the Warranty badge on
  the Asset Registry list and Asset Detail page now shows three states
  (Active/Expiring/Expired) instead of two. How many days before expiry
  an asset is flagged "Expiring" is configurable per Asset Category
  (default 90 days) via a new "Warranty" section in System Settings.

### Fixed
- **System Settings is now restricted to admin accounts** — previously
  any signed-in user could reach the Settings page (including the new
  Warranty threshold editor); it's now gated the same way as
  Administration/User Management/Role Management.

## 2026-08-29

### Added
- **Warranty status on the Asset Registry** — the Assets list now shows
  a "Warranty" column with each asset's expiry date and an Active/
  Expired badge, sortable by date.

## 2026-08-28

### Added
- **"By Category" view on Asset Management** — the Assets page now has a
  "By Category" tab alongside the existing list view: it lists every
  asset category with a live asset count, and expanding a category
  shows the real assets registered under it, each linking through to
  its Asset Detail page. (Initially shipped as a separate "Category &
  Hierarchy" page with its own sidebar entry; folded into Asset
  Management the same day since it's a view of the same asset data, not
  a distinct destination.)

### Fixed
- **Maintenance records now show date and cost** — each ticket listed
  under an asset's "Maintenance & Tickets" tab now shows when it was
  created and its cost (or "—" if it hasn't been dispatched yet).
- **Ticket Detail's stage indicator now shows which stage is current** —
  the 4-stage governance timeline previously showed a ticket's current
  stage the same way as a stage that hasn't started yet; it's now
  visually distinct (highlighted, with a "Current" label).

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
