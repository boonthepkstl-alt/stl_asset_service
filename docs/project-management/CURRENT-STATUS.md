# RAISE — Current Status

**Purpose:** the single point-in-time snapshot of where the project stands
right now. Unlike the other files in this folder, this one is **overwritten
in place**, not appended to — it always describes "now," not history.
For history, see [`DEVELOPMENT-LOG.md`](DEVELOPMENT-LOG.md) (raw PR-by-PR
log) or [`PROJECT-TIMELINE.md`](PROJECT-TIMELINE.md) (phase-level
narrative). For a running list of what shipped in stakeholder-facing terms,
see [`CHANGELOG.md`](CHANGELOG.md). For known problems, see
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md).

**As of:** 2026-08-26, after `CHECKPOINT-2026-08-26-003` (second
test-execution sweep — Asset Registry/Detail/Category/Custody — not yet
shipped via PR, see that checkpoint for status). The
`BASELINE-CHECKPOINT-2026-08-24` scan is still the last full live
re-verification against `git`/source. F-20 (checkpoint-coverage gap) is
closed (R-04); F-21 (QR/Barcode invalid-code state) is closed (R-05) —
`RAISE-FR-OPS-001` is `PASS` on all three test cases. Two rounds of
formal test-case execution have now run (2026-08-26): the first covered
QR/Barcode, Audit Log, and Executive Dashboard (found F-21, F-22); the
second covered Asset Registry, Asset Detail, Category & Hierarchy, and
Custody History (found **F-23 through F-26**, all open). `RAISE-FR-ASSET-001`,
`RAISE-FR-ASSET-002`, and `RAISE-FR-ASSET-003` now carry real,
evidence-based `FAIL`/`FAIL (partial)` Test Status in
`RAISE-TRACEABILITY-MATRIX.md` (§3) — this is a materially different
picture than the pre-code-era default these rows carried before. Every
development session should close out per
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
| Asset Registry | `RAISE-FR-ASSET-001` | 🟡 Built, FAIL (partial) per formal test execution 2026-08-26 — list/search/row-click/detail-isolation all **PASS**, but no Category filter exists (**F-23**) and Asset Detail is missing its Financial and Lifecycle sections (**F-24**) |
| Category & Hierarchy | `RAISE-FR-ASSET-002` | 🟡 Built (partial), FAIL per formal test execution 2026-08-26 — category *display* is consistent across screens (PASS), but the dedicated P-005 Category & Hierarchy screen doesn't exist at all (**F-25**) |
| Asset Assign / Check-in | `RAISE-FR-ASSET-003` / `RAISE-FR-OPS-002` (partial) | 🟡 Built, FAIL per formal test execution 2026-08-26 — current holder displays correctly, but Custody/Assignment History is not append-only: a Check-in replaces the prior entry instead of appending a new one (**F-26**), and no seeded asset has a real multi-event history to test against |
| Employee | supports `RAISE-FR-ASSET-003` | ✅ Built |
| Maintenance / Ticket | `RAISE-FR-MAINT-001` | ✅ Built — 4-stage workflow shape only; SLA/vendor/cost model TBD |
| Auth | supports `RAISE-NFR-SEC-RBAC-001` | ✅ Built, demo-only — hardcoded single user, no real user store |
| QR / Barcode lookup | `RAISE-FR-OPS-001` | ✅ Built, PASS on all test cases — [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29) + a follow-up F-21 fix (see `DEVELOPMENT-LOG.md` for the PR number once shipped). `GET /assets/:id` resolves by `code` too (dual lookup); real QR generation + Scan QR flow live on both Assets list and Asset Detail. `TC-OPS-001-01..03` all **PASS** — the invalid-code state (F-21) is fixed via a plausible-code-format check before lookup |
| Audit Log | `RAISE-FR-AUDIT-001` | 🟡 Built — [PR #31](https://github.com/boonthepkstl-alt/stl_asset_service/pull/31) (Asset domain) + [PR #35](https://github.com/boonthepkstl-alt/stl_asset_service/pull/35) (Ticket domain). `GET /audit-logs` + recording on Asset create/assign/check-in and Ticket create/approve/dispatch/status-update. No update/delete path exists (immutability by omission). The testable subset of `TC-AUDIT-001-01..03` **PASSED** formal execution 2026-08-26; field taxonomy and the audit-review role gate remain TBD (unchanged, blocked on PRD) |
| Executive Dashboard KPIs (first cut) | `RAISE-FR-EXEC-001` | 🟡 Built, narrow scope, FAIL on prototype match per formal test execution — [PR #33](https://github.com/boonthepkstl-alt/stl_asset_service/pull/33). `GET /dashboard/stats` computes status counts, expired-warranty count, and department/type distribution from real Asset data. Software License count still comes from the frontend's mock license service (no backend License table exists — Roadmap-only). NBV/Risk KPI formulas and Utilization's calculation mechanics remain **not started** (PRD §16 Q3/Q4/Q29 TBD). **`TC-EXEC-001-01/-02` FAILED formal execution 2026-08-26** — the built page has no tiles/sections named per Prototype P-014 at all (not even presence-only), a gap independent of the formula question — see `OPEN-FINDINGS.md` F-22 |
| Oracle FA Integration | `RAISE-FR-ORACLE-001` | Integration method/mapping/sync/security all TBD |
| Natural Language Search | `RAISE-AI-SEARCH-001` | Citation precision/format TBD |
| Document Intelligence | `RAISE-AI-DOC-001..004` | Confidence thresholds / field lists / matching rules undefined |
| Asset Lifecycle Connectivity | `RAISE-FR-LIFE-001` | Partially blocked; Disposal stage confirmed Roadmap |
| User/Role Management | supports `RAISE-NFR-SEC-RBAC-001` | Backend RBAC enforcement confirmed Roadmap, not MVP |

## 4. Checkpoint Backlog

Triaged against [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
§3–§5 — re-check that file before picking an item, it may have changed.

**Buildable now:** **F-23** (no Category filter on Asset Registry) —
the smallest, most self-contained of the four new findings from the
2026-08-26 Asset-domain test-execution sweep; same shape as F-21 (a
missing UI affordance the AC already fully specifies, no PRD question
attached). F-24 (missing Financial/Lifecycle sections on Asset Detail)
and F-26 (Custody History not append-only) are also non-PRD-blocked but
larger — worth scoping separately rather than bundling into one PR. F-25
(no Category & Hierarchy screen) is the largest of the four (a whole new
screen) and closest to "needs a scoped-down first cut."

**Needs a scoped-down first cut:** None remaining — Audit Log (PR #31 +
#35, now covering both Asset and Ticket domains) and Executive Dashboard
(PR #33) were the last items in this category, both now built to the
extent possible without inventing TBD content. Nothing further is
currently drawable on Executive Dashboard's NBV/Risk KPI formulas without
a business decision (§16 Q3/Q4). Separately, **F-22** (Executive
Dashboard vs. Prototype P-014 tile/section-name mismatch) is *not* a
"first cut" candidate — it's a scope-reconciliation question for the
business/design owner (should the prototype or the shipped page change?)
before any code should be written toward it.

**Blocked on a business decision:** Warranty, Alerts, Oracle FA Integration,
Natural Language Search, Document Intelligence, User/Role Management
backend (RBAC enforcement itself is Roadmap-confirmed, not just TBD).

**Explicitly out of scope (Roadmap/Pilot):** License Management, AI
Decision Center, Risk Scoring, Lifecycle Prediction, Asset Disposal,
real-time ERP integration, native mobile app, predictive analytics,
workflow automation, multi-channel alerts.
