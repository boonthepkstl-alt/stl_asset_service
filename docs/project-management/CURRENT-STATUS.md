# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-08-25, after PR #29 (`CHECKPOINT-2026-08-25-001`). The
`BASELINE-CHECKPOINT-2026-08-24` scan is still the last full live
re-verification against `git`/source; this update applies PR #21-#29's
changes on top of it (Singer CI branding, timeline checkpoint links, and
QR/Barcode) without re-running a full baseline scan — see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md) F-20 for the checkpoint-coverage
gap this left between PR #18 and PR #29. Every development session should
close out per
[`SESSION-CLOSEOUT-PROTOCOL.md`](SESSION-CLOSEOUT-PROTOCOL.md), which is
what keeps this section current.

---

## 1. Overall Health

The documentation chain (`docs/01-requirements/` … `docs/07-traceability-matrix/`)
is internally consistent and current — all 6 historical traceability gaps
are closed and re-verified against real file content, not just re-asserted.
The gap between "documented" and "built" is real but honestly tracked: 3 of
the platform's MVP domains have a full backend-to-frontend implementation;
the rest is either genuinely blocked on an open PRD question or
intentionally out of MVP scope (Roadmap).

## 2. Deliverable Chain Document Versions

| Document | Version | Notes |
|---|---|---|
| [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) | 0.9 | Draft for Requirement Review |
| [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) | 0.8 | Gap-closure pass against PRD v0.9 |
| [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) | 0.6 | 17-screen inventory |
| [`RAISE-ACCEPTANCE-CRITERIA.md`](../04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md) | 0.5 | Re-synced against Prototype v0.6 |
| [`RAISE-TEST-PLAN.md`](../05-test-plan/RAISE-TEST-PLAN.md) | 0.5 | Re-synced against AC v0.5 |
| [`RAISE-TEST-CASES.md`](../06-test-cases/RAISE-TEST-CASES.md) | 0.5 | 62 test cases |
| [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md) | 0.5 | All 6 gaps resolved |
| [`RAISE-HIGH-LEVEL-ARCHITECTURE.md`](../08-architecture/RAISE-HIGH-LEVEL-ARCHITECTURE.md) | — | As-built, not versioned against PRD chain |
| [`RAISE-API-DB-SPEC.md`](../09-api-db-spec/RAISE-API-DB-SPEC.md) | — | As-built |
| [`RAISE-DETAILED-DESIGN.md`](../10-detailed-design/RAISE-DETAILED-DESIGN.md) | — | As-built |

## 3. Domain Build Status

### Backend domains (`go-template-main`, PostgreSQL-backed, real endpoints)

| Domain | Requirement | Status |
|---|---|---|
| Asset Registry | `RAISE-FR-ASSET-001` | ✅ Built |
| Asset Assign / Check-in | `RAISE-FR-ASSET-003` / `RAISE-FR-OPS-002` (partial) | ✅ Built — no approval step, no history log (holder model TBD) |
| Employee | supports `RAISE-FR-ASSET-003` | ✅ Built |
| Maintenance / Ticket | `RAISE-FR-MAINT-001` | ✅ Built — 4-stage workflow shape only; SLA/vendor/cost model TBD |
| Auth | supports `RAISE-NFR-SEC-RBAC-001` | ✅ Built, demo-only — hardcoded single user, no real user store |
| QR / Barcode lookup | `RAISE-FR-OPS-001` | ✅ Built — [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29). `GET /assets/:id` now resolves by `code` too (dual lookup); real QR generation + Scan QR flow live on both Assets list and Asset Detail. Manually browser-verified; formal `TC-OPS-001-01..03` execution not yet run (`OPEN-FINDINGS.md` — noted in the CHECKPOINT-2026-08-25-001 Known Issues) |

### Frontend features still Mock-only (no backend endpoint exists)

| Feature | Requirement | Blocking reason |
|---|---|---|
| Warranty | `RAISE-FR-WARRANTY-001` | Field list beyond `warrantyExpiry` is Open Question (PRD §16 Q15) |
| License | `RAISE-FR-LICENSE-001` | Confirmed Roadmap, not MVP |
| AI Decision Center | `RAISE-AI-RECOMMEND-001` | Confirmed Roadmap |
| Alerts | `RAISE-FR-ALERT-001` | Trigger rules/channels TBD |
| Audit Log | `RAISE-FR-AUDIT-001` | Field taxonomy TBD |
| Executive Dashboard | `RAISE-FR-EXEC-001` | NBV/Risk KPI formulas TBD |
| Oracle FA Integration | `RAISE-FR-ORACLE-001` | Integration method/mapping/sync/security all TBD |
| Natural Language Search | `RAISE-AI-SEARCH-001` | Citation precision/format TBD |
| Document Intelligence | `RAISE-AI-DOC-001..004` | Confidence thresholds / field lists / matching rules undefined |
| Asset Lifecycle Connectivity | `RAISE-FR-LIFE-001` | Partially blocked; Disposal stage confirmed Roadmap |
| User/Role Management | supports `RAISE-NFR-SEC-RBAC-001` | Backend RBAC enforcement confirmed Roadmap, not MVP |

## 4. Checkpoint Backlog

Triaged against [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
§3–§5 — re-check that file before picking an item, it may have changed.

**Buildable now:** None currently listed `NOT_TESTED (no blockers)` in the
traceability matrix — QR / Barcode (`RAISE-FR-OPS-001`), the last such
item, was built in PR #29 (see §3 above).

**Needs a scoped-down first cut** (real AC exists, some fields TBD — same
pattern as Maintenance/Check-in and now QR/Barcode): Audit Log
(`RAISE-FR-AUDIT-001`, could log mutations that already happen without
inventing a taxonomy), Executive Dashboard (`RAISE-FR-EXEC-001`, could move
existing client-side KPI math to a backend endpoint without inventing the
still-TBD formulas). These are the recommended next candidates.

**Blocked on a business decision:** Warranty, Alerts, Oracle FA Integration,
Natural Language Search, Document Intelligence, User/Role Management
backend (RBAC enforcement itself is Roadmap-confirmed, not just TBD).

**Explicitly out of scope (Roadmap/Pilot):** License Management, AI
Decision Center, Risk Scoring, Lifecycle Prediction, Asset Disposal,
real-time ERP integration, native mobile app, predictive analytics,
workflow automation, multi-channel alerts.
