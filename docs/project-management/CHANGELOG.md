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
