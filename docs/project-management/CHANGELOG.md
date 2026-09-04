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

## 2026-09-04

### Changed
- **The app loads faster on first open** — it used to download every
  screen in the product before showing you the login page, including
  ones most people never open. Each screen is now fetched the first
  time you actually go to it, which cuts the initial download by more
  than half. You may briefly see a "Loading..." message the first time
  you visit a screen in a session; after that it is instant.
- **Editing an employee's details is now its own page, not a pop-up** —
  "Edit Identity" on an employee's profile now opens a full page at its
  own address instead of a dialog box on top of the profile. The fields
  are exactly the same ones as before — job title, phone, status,
  department, location, desk and reporting manager — and Cancel still
  discards your changes. This was the last form in the app that still
  edited a record in a pop-up; adding an asset and adding an employee had
  already moved to full pages.
- **Changes to an employee now show who actually made them** — entries on
  an employee's Audit tab are credited to the person signed in, rather
  than always saying "Current Admin".

### Fixed
- **A duplicate phone number can no longer slip through unnoticed** —
  when editing an employee, the check for "this phone number already
  belongs to someone else" used to pass silently if the employee list
  couldn't be loaded, which meant a genuine duplicate could be saved with
  no warning at all. It now tells you it couldn't check, and doesn't
  save, instead of quietly assuming there was no clash.

## 2026-09-03

### Added
- **Adding an employee is now its own page, not a pop-up** — "Add
  Employee" on the Employees list opens a full page instead of a modal
  dialog, so there's room to see every field at once. (It briefly shipped
  as a multi-step wizard earlier the same day; see "Create forms are now
  a single page" below for why that changed.)
- **Optional Employee Code on the Add Employee form** — you can now type
  an employee's ID yourself instead of always getting a generated one,
  the same way the Add Asset form already let you supply an Asset Code.
  Leave it blank and one is still generated for you. Previously, typing
  one had no effect — the server replaced whatever you entered.

### Changed
- **Create forms are now a single page instead of a step-by-step
  wizard** — both "Add Asset" and "Add Employee" now show all their
  fields on one scrolling page with a Save bar pinned to the bottom,
  rather than walking you through numbered steps. The final "Review"
  step is gone: everything is already visible, and on the Asset form
  that review screen only listed 6 of the form's 13 fields anyway. If
  something is missing when you save, **all** the errors now appear at
  once instead of one step at a time.
- **Employee ID must now be 8 digits** — the Employee Code field is
  checked against the company's real ID format: exactly 8 digits, where
  the first 2 are the year the person joined (for example `26725898` for
  someone who joined in 2026). Anything else is rejected as you type.
  RAISE does **not** invent these numbers — the last 6 digits are issued
  by HR, so the field is validated, never auto-filled with a real-looking
  ID. Note that automatically-generated and demo employee codes still use
  the older `EMP-…` style and do not match this format yet.
- **Duplicate work email or phone number is now blocked** — entering an
  email address or phone number that already belongs to another employee
  now shows an error and stops you from continuing, both when adding a
  new employee and when editing an existing one's contact details.
- **"New Asset" removed from the top bar** — the button used to appear
  on every screen, including ones that have nothing to do with assets
  (Settings, Employees, Licenses). It's still on the Asset Management
  page itself, where it belongs.
- **Breadcrumbs are now clickable, starting from "Home"** — the trail at
  the top of each page now begins with "Home" (which takes you to the
  dashboard), and the steps in between — like "Employee Management" —
  now actually navigate back. Previously the whole trail was plain text
  that looked like links but did nothing.
- **Asset Handovers navigation consolidated to one page** — the sidebar
  previously listed 3 separate items for the IT Hardware handover
  workflow (My Pending Assignments / IT Processing Queue / IT Supervisor
  Approval Queue). These are now one "Asset Handovers" entry with tabs
  for each stage — only the tabs relevant to your role show up, and the
  page opens on the tab that matches what you'd normally act on. No
  change to what the workflow itself does.
- **Breadcrumb trails are now announced properly by screen readers** —
  the trail at the top of each page is now labelled as a breadcrumb
  landmark, so assistive technology can identify and jump to it instead
  of treating it as unlabelled navigation. No visual change. (The rest of
  that PR was test coverage, which isn't listed here.)

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
