# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-08-25, after PR #33 (`CHECKPOINT-2026-08-25-003`). The
`BASELINE-CHECKPOINT-2026-08-24` scan is still the last full live
re-verification against `git`/source; this update applies PR #21-#33's
changes on top of it (Singer CI branding, timeline checkpoint links,
QR/Barcode, Audit Log first cut, and Executive Dashboard KPI first cut)
without re-running a full baseline scan — see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md) F-20 for the checkpoint-coverage
gap this left between PR #18 and PR #29 (PR #29 onward has Level 1
checkpoints). Every development session should close out per
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
| Audit Log (first cut) | `RAISE-FR-AUDIT-001` | 🟡 Built, narrow scope — [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31). `GET /audit-logs` + recording on Asset create/assign/check-in only (Ticket domain not yet hooked in). No update/delete path exists (immutability by omission). Field set limited to Actor/Action/Entity/Timestamp — Before/After/Source/Result and the audit-review role gate remain TBD, so `TC-AUDIT-001-01`/`-03` stay partial per the traceability matrix |
| Executive Dashboard KPIs (first cut) | `RAISE-FR-EXEC-001` | 🟡 Built, narrow scope — [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33). `GET /dashboard/stats` computes status counts, expired-warranty count, and department/type distribution from real Asset data. Software License count still comes from the frontend's mock license service (no backend License table exists — Roadmap-only). NBV/Risk KPI formulas and Utilization's calculation mechanics remain **not started** (PRD §16 Q3/Q4/Q29 TBD) — `TC-EXEC-001-01/-02` stay partial per the traceability matrix; Monthly Depreciation/Cost and the AI Insights panel remain static illustrative content, unchanged |
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

**Needs a scoped-down first cut:** None remaining as a *fresh* pick —
Audit Log (PR #31) and Executive Dashboard (PR #33) were the last two
items in this category, both now built to the extent possible without
inventing TBD content. Two already-scoped **extensions** of existing
first cuts remain buildable without inventing anything new:
Ticket-domain audit hook-in (extends PR #31 — wire `AuditService.Record`
into `CreateTicket`/`DecideApproval`/`Dispatch`/`UpdateExecutionStatus`,
same pattern already proven on the Asset domain), and nothing further is
currently drawable on Executive Dashboard without an NBV/Risk/Utilization
formula decision (§16 Q3/Q4/Q29) — that one genuinely needs a business
answer, not just more scoping discipline.

**Blocked on a business decision:** Warranty, Alerts, Oracle FA Integration,
Natural Language Search, Document Intelligence, User/Role Management
backend (RBAC enforcement itself is Roadmap-confirmed, not just TBD).

**Explicitly out of scope (Roadmap/Pilot):** License Management, AI
Decision Center, Risk Scoring, Lifecycle Prediction, Asset Disposal,
real-time ERP integration, native mobile app, predictive analytics,
workflow automation, multi-channel alerts.
