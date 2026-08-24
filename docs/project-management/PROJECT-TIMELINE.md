# RAISE — Project Timeline

**Purpose:** a phase-level narrative of how the project got here — grouping
the PR-by-PR detail in [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) into
meaningful stretches of work, for anyone who wants "what happened, roughly
when, and why" without reading every merge. For the current snapshot, see
[`CURRENT-STATUS.md`](CURRENT-STATUS.md); for individual shipped
checkpoints with verification evidence, see
[`PROJECT-CHECKPOINTS.md`](PROJECT-CHECKPOINTS.md).

**Maintenance rule:** add a new phase (or extend the current one's date
range) when the nature of the work shifts meaningfully — not after every
PR. Most PRs belong to an existing phase.

---

## Phase 0 — Company Template Foundation & RBAC Wiring
**2026-08-21** · [#1](https://github.com/boonthepkstl-alt/stl_asset_service/pull/1)

The starting point: two audited company templates (`go-template-main`,
`react-template-main`) with a documented KEEP/EXTEND/REFACTOR baseline, but
no RAISE-specific domain code yet. This phase wired `RequireRole`
middleware to the template's demo routes — the reference pattern every real
RAISE domain's RBAC decision would later point back to.

## Phase 1 — Requirements Chain Confirmation
**2026-08-21 – 2026-08-22** · [#2](https://github.com/boonthepkstl-alt/stl_asset_service/pull/2), [#3](https://github.com/boonthepkstl-alt/stl_asset_service/pull/3)

Closed every `NEEDS_PRD_CONFIRMATION` item raised by the design/prototype
layer: Maintenance's 4-stage workflow shape, License Management's
Roadmap-only scope, the ESAPS-reference-only page list, AI Recommendation's
Roadmap classification, the Oracle "Phase 6" label question, and the RBAC
MVP-enforcement-level decision (UI-only, backend deferred). All six landed
in `RAISE-PRD.md` and were then propagated down through Design, Prototype,
AC, Test Plan, and Test Cases in the same PR cycle.

## Phase 2 — Frontend Polish & Roadmap Gating
**2026-08-22** · [#4](https://github.com/boonthepkstl-alt/stl_asset_service/pull/4), [#5](https://github.com/boonthepkstl-alt/stl_asset_service/pull/5), [#6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6)

Housekeeping ahead of real backend work: Roadmap-only pages (Licenses, AI
Decision Center) gated behind a feature flag so they don't read as approved
MVP scope; the Login page restyled to a split-panel layout; the dev
server's port made configurable; a pre-existing build failure in
`react-template-main` itself fixed (2 lines, fixed directly in the
template rather than worked around).

## Phase 3 — Backend Domain Buildout
**2026-08-22 – 2026-08-24** · [#7](https://github.com/boonthepkstl-alt/stl_asset_service/pull/7), [#8](https://github.com/boonthepkstl-alt/stl_asset_service/pull/8), [#9](https://github.com/boonthepkstl-alt/stl_asset_service/pull/9), [#10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10), [#11](https://github.com/boonthepkstl-alt/stl_asset_service/pull/11), [#13](https://github.com/boonthepkstl-alt/stl_asset_service/pull/13)

The core of real development: three MVP domains built full-stack
(model → repository → service → controller → router, mirrored on the
frontend behind a feature flag) —

- **Asset Registry** (`RAISE-FR-ASSET-001`) + Assign/Check-in
  (`RAISE-FR-ASSET-003`/`RAISE-FR-OPS-002`, partial)
- **Employee** (supporting Asset custody)
- **Maintenance / Ticket** (`RAISE-FR-MAINT-001`), the confirmed 4-stage
  workflow

A real bug was also found and fixed mid-phase: the login response
contract mismatch (backend sent a cookie-only, snake_case envelope;
frontend expected a bare camelCase object with the token in the body) —
found via live browser reproduction, not just code review, and fixed per
an explicit business decision (fix the backend, don't change the frontend
to cookie-only auth).

## Phase 4 — Documentation Maturity & Process Tooling
**2026-08-24** · [#12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12), [#14](https://github.com/boonthepkstl-alt/stl_asset_service/pull/14), [#15](https://github.com/boonthepkstl-alt/stl_asset_service/pull/15), *(this PR)*

With three real domains shipped, the documentation caught up to the code:
the deliverable chain was re-synced end-to-end (closing a critical
version-drift gap in the traceability matrix), a project-management
tracker was introduced and then split into the six focused files in this
folder, and three new as-built technical documents (High-Level
Architecture, API/DB Spec, Detailed Design) were added to describe the
system that actually exists, not a pre-code plan.

---

*Next phase not yet started — see [`CURRENT-STATUS.md`](CURRENT-STATUS.md)
§4 for the checkpoint backlog.*
