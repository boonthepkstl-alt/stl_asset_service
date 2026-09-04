# RAISE Acceptance Criteria

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Acceptance Criteria
**Version:** 0.12 Draft
**Status:** Draft for Acceptance Review
**Source:** [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.14 §27 (Prototype Traceability Matrix) + §5, §7–§23, §23A, §25A (per-screen specs / P-018 Settings / AI Scope Boundary / NFR Backlog Prototype Note) + §14's "IT Hardware Assignment Approval Workflow — Category-Scoped Exception" subsection + §18's rewritten P-012 Alerts (five confirmed MVP trigger conditions and fixed-per-condition severity), cross-checked against [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.15 and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.13
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

This document converts each prototype screen's traced requirement into
testable, Given/When/Then acceptance criteria, so that the next artifact
(`RAISE-TEST-PLAN.md` / `RAISE-TEST-CASES.md`) can be written directly
against them.

Every criterion below is derived only from behavior already stated in the
Prototype spec and the PRD. Where the source leaves a business rule,
threshold, field, or role undefined, the criterion is marked **NOT
TESTABLE YET** rather than inventing the missing value.

---

## 2. Principle: Derivation, Not Invention

```text
RAISE-PRD.md            (what must be true)
     ↓
RAISE-DESIGN.md          (how it's organized)
     ↓
RAISE-PROTOTYPE.md       (what the screen shows)
     ↓
RAISE-ACCEPTANCE-CRITERIA.md   (how we'll know it's true) ← this document
```

A criterion is only written where the Prototype spec already describes a
concrete element, state, or flow. Where the Prototype spec itself says a
detail is "TBD" or "conceptual," the corresponding criterion is marked
**NOT TESTABLE YET** and points back to the relevant PRD Open Question
(`RAISE-PRD.md` §16).

---

## 3. Acceptance Criteria Index

| AC Group | Screen(s) | Requirement | Status |
|---|---|---|---|
| [AC-LOGIN](#4-ac-login--p-001-login--access) | P-001 | Security Design (TBD) | Partially testable |
| [AC-DASH](#5-ac-dash--p-002-main-dashboard) | P-002 | Product / Dashboard | Testable (rewritten 2026-08-31 to match as-built dashboard, Open Finding F-22; NBV/Risk NOT TESTABLE YET) |
| [AC-ASSET-001](#6-ac-asset-001--p-003-asset-registry) | P-003 | RAISE-FR-ASSET-001 | Testable |
| [AC-ASSET-001-DETAIL](#7-ac-asset-001-detail--p-004-asset-detail) | P-004 | RAISE-FR-ASSET-001 | Testable |
| [AC-LIFE-001](#75-ac-life-001--asset-lifecycle-connectivity-cross-cutting) | P-004 (Lifecycle section) | RAISE-FR-LIFE-001 | Partially testable |
| [AC-ASSET-002](#8-ac-asset-002--p-005-category--hierarchy) | P-005 | RAISE-FR-ASSET-002 | Testable (resolved 2026-09-01, Open Finding F-27) |
| [AC-ASSET-003](#9-ac-asset-003--p-006-custody-history) | P-006 | RAISE-FR-ASSET-003 | Partially testable |
| [AC-OPS-001](#10-ac-ops-001--p-007-qr--barcode-scan) | P-007 | RAISE-FR-OPS-001 | Testable |
| [AC-OPS-002](#11-ac-ops-002--p-008-check-in--check-out) | P-008 | RAISE-FR-OPS-002 | Testable (resolved 2026-09-01, PRD §16 Resolved Question 42 — general workflow shape and permission gate confirmed for non-IT-Hardware Check-out and all Check-in; **expanded 2026-09-02, PRD §16 Resolved Question 43** — IT Hardware-category Check-out's 4-stage approval workflow now also testable at the confirmed stage-transition level. Two Stage 2 sub-points — recipient-decline path and e-signature/acknowledgment-text capture — remain **NOT TESTABLE YET**, genuinely undecided per Prototype/Design's own open-question framing. General RBAC role/permission content for other domains remains NOT TESTABLE YET, PRD §16 Q22) |
| [AC-MAINT-001](#12-ac-maint-001--p-009-maintenance) | P-009 | RAISE-FR-MAINT-001 | Partially testable (workflow shape testable; SLA/vendor/cost NOT TESTABLE YET) |
| [AC-WARRANTY-001](#13-ac-warranty-001--p-010-warranty--p-018-settings) | P-010, P-018 | RAISE-FR-WARRANTY-001 | Testable (field list resolved 2026-08-29; per-category configurable threshold resolved 2026-09-01) |
| [AC-ORACLE-001](#14-ac-oracle-001--p-011-oracle-fa--financial-view) | P-011 | RAISE-FR-ORACLE-001 | Partially testable |
| [AC-ALERT-001](#15-ac-alert-001--p-012-alerts) | P-012 | RAISE-FR-ALERT-001 | Testable for the five confirmed trigger conditions and fixed-per-condition severity (resolved 2026-09-04, PRD §16 Resolved Question 44; closes Open Finding F-05's trigger-rules cause) — only Warranty EXPIRED is actually implemented as of this date, the other four are not yet built (verification deferred to Test Case execution, not decided here); "authorized user" access gate remains NOT TESTABLE YET (PRD §16 Q22 / Open Finding F-08) |
| [AC-AUDIT-001](#16-ac-audit-001--p-013-audit-log) | P-013 | RAISE-FR-AUDIT-001 | Partially testable |
| [AC-EXEC-001](#17-ac-exec-001--p-014-executive-dashboard) | P-014 | RAISE-FR-EXEC-001 | Testable (rewritten 2026-08-31 to match as-built dashboard, Open Finding F-22; NBV/Risk NOT TESTABLE YET) |
| [AC-AI-SEARCH-001](#18-ac-ai-search-001--p-015-ai-assistant) | P-015 | RAISE-AI-SEARCH-001 | Partially testable |
| [AC-AI-STATES](#19-ac-ai-states--ai-response-states) | P-015 | RAISE-AI-SEARCH-001 | Testable |
| [AC-AI-DOC-001](#195-ac-ai-doc-001--p-004-asset-detail-incidental--ocr--extraction) | P-004 (incidental) | RAISE-AI-DOC-001 | Not testable yet |
| [AC-AI-DOC-002](#196-ac-ai-doc-002--p-004-asset-detail-incidental--metadata) | P-004 (incidental) | RAISE-AI-DOC-002 | Not testable yet |
| [AC-AI-DOC-003](#197-ac-ai-doc-003--p-005-category--hierarchy-incidental--classification) | P-005 (incidental) | RAISE-AI-DOC-003 | Not testable yet |
| [AC-AI-DOC-004](#198-ac-ai-doc-004--p-003-asset-registry-incidental--duplicate-detection) | P-003 (incidental) | RAISE-AI-DOC-004 | Not testable yet |
| [§19.9 NFR Backlog Note](#199-nfr-backlog--acceptance-criteria-note) | none (cross-cutting) | PRD §10 NFR backlog (no dedicated Traceability ID, except `RAISE-NFR-SEC-RBAC-001`) | Not testable yet (traceability note only — no AC group) |

"Testable" = every criterion in the group can be verified today from Prototype-defined
behavior. "Partially testable" = at least one criterion is blocked on an Open Question.

**Roadmap screens — no AC group written (consistent with Risk Scoring / Lifecycle
Prediction / AI Recommendation treatment, §21 checklist item):** `RAISE-PROTOTYPE.md`
v0.5 §22–§23 add **P-016 License Inventory** and **P-017 License Detail**, both tracing
to `RAISE-FR-LICENSE-001`. PRD v0.9 §6/§13/§17 confirm this requirement as **Enterprise
Roadmap, not Phase 1 MVP** (PRD §16 Resolved Question 34), and Prototype §22/§23 Status
Banners state the screens exist only because `frontend/src/pages/Licenses/` and
`frontend/src/pages/LicenseDetail/` were already built ahead of that scope decision —
they must not be read as approved MVP screens or business rules. Per this document's own
review checklist (§21: "Roadmap/Pilot capabilities ... have no MVP acceptance criteria
written here"), **no AC-LICENSE-001 Given/When/Then group is written** for P-016/P-017.
This is recorded here only as a traceability note, not a testable group:

- **P-016 License Inventory / P-017 License Detail** — Requirement `RAISE-FR-LICENSE-001`
  — **Roadmap, not MVP — no AC group written.** License field model, seat/utilization
  rule, renewal/expiry alert rule, and vendor/cost tracking are all **TBD** (PRD §16
  Q15a; Design §5.3 "Data Model TBD") in addition to the screens themselves being
  out-of-MVP-scope — writing Given/When/Then criteria now would invent both the business
  rules and the MVP status. If `RAISE-FR-LICENSE-001` is later promoted to MVP through
  product requirement review, this document should add a dedicated AC-LICENSE-001 group
  at that time, derived from whatever field model/rules are confirmed then.

---

## 4. AC-LOGIN — P-001 Login / Access

**Requirement:** Security Design (TBD) · **Screen:** P-001

- **AC-LOGIN-01** — Given a user with valid credentials, when they submit
  the login form, then they are granted access to the platform.
- **AC-LOGIN-02** — Given a user with invalid credentials, when they
  submit the login form, then an error state is shown and access is
  denied.
- **AC-LOGIN-03** — Given an authenticated user without permission for a
  given area, when they attempt to access it, then an access-denied state
  is shown.

**NOT TESTABLE YET:** the authentication mechanism, credential format, and
role/permission model are undefined (PRD §16 Q21–Q22; PRD §11 Security &
RBAC). AC-LOGIN-01/02/03 validate only the *existence* of success/error/
denied states shown in the Prototype spec (§7), not any specific
mechanism.

**RBAC MVP enforcement level — confirmed, narrow scope only (PRD §11, §16 Resolved
Question 38; Design §16 Security Architecture; Prototype §7):** business has confirmed
that a UI-only/client-side permission check is acceptable for MVP (a client-bypassing
actor is an accepted, explicit MVP risk, not an oversight), with backend-enforced RBAC
deferred to Enterprise Roadmap. This resolves only *where* AC-LOGIN-03's access-denied
check would run — it does **not** resolve *what* the roles/permissions are. The role
list, permission matrix contents, and authentication mechanism remain **TBD**, so
AC-LOGIN-03 stays scoped to verifying that an access-denied state exists and is shown
for *some* unspecified permission gate, not that any named role is correctly
gated.

---

## 5. AC-DASH — P-002 Main Dashboard

**Requirement:** Product / Dashboard (general navigation) · **Screen:** P-002

**Status Note — Corrected 2026-08-31 to match as-built dashboard (Open Finding
F-22):** the criteria below previously tested an "Asset Overview" wireframe
(Total Assets/NBV/Risk/Warranty Expiry tiles; "Asset by Category"/"Lifecycle /
Maintenance Overview"/"Recent Alerts" sections) that formal test execution
confirmed was never built (`TC-DASH-01..03`, 2026-08-29, recorded as [Open
Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question)
in `OPEN-FINDINGS.md`). Per explicit business decision on F-22, and matching
[`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md#8-p-002-main-dashboard)
§8's corrected "Sections (As Built)," the criteria below are rewritten against
the actually shipped `frontend/src/pages/Dashboard/index.tsx` page. This is a
scope/spec correction to match reality, not a new requirement.

- **AC-DASH-01** — Given an authenticated user lands on the dashboard, when
  the page loads, then the KPI grid displays all eight tiles: Total Assets,
  Available, Assigned, In Maintenance, Expired Warranty, Software Licenses,
  Monthly Depreciation, and Monthly Cost.
- **AC-DASH-02** — Given asset/maintenance/warranty/license data exists,
  when the dashboard loads, then all ten sections are displayed: AI
  Insights, AI Portfolio Health, Oracle FA Reconciliation, Asset Lifecycle,
  Department Distribution, Asset Status, Asset Type, Pending Approvals,
  Recent Activities, and Maintenance Calendar.
- **AC-DASH-03** — Given the dashboard's KPI grid as specified in
  AC-DASH-01, when a user inspects it for NBV, Risk, or Utilization tiles,
  then none of the three PRD-proposal KPIs (`RAISE-FR-EXEC-001`) is present
  in the shipped grid — this criterion documents today's gap accurately; it
  is not a passing criterion that any of the three tiles is displayed.

**Testable now:** AC-DASH-01 and AC-DASH-02 test presence of the actual
shipped tile/section list and are expected to pass against the current app.
Two caveats apply to both, neither of which blocks passing:
- Monthly Depreciation and Monthly Cost are explicitly **illustrative** — no
  depreciation model has been built (Prototype §8). AC-DASH-01 tests that the
  tiles are *displayed*, not that their figures are correct or backed by a
  defined calculation.
- None of the eight tiles or ten sections has a PRD-defined field list,
  formula, or threshold beyond what the page already computes from existing
  Asset/Maintenance/Warranty/License data (Prototype §8); AC-DASH-01/-02 test
  presence only, not calculation correctness.

**NOT TESTABLE YET — AC-DASH-03 (NBV/Risk):** NBV and Risk formulas,
thresholds, and dashboard placement remain fully undefined — see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions) §16
Q3–Q4, tracked as [Open Finding
F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement).
This is a separate, not-yet-scheduled enhancement layered on top of the
current MVP dashboard (Prototype §8 "NBV/Risk/Utilization — Proposal KPIs,
Not Yet Implemented") — AC-DASH-03 must not be read as confirming NBV/Risk
display is required to pass; it only confirms today's absence is accurately
documented, not silently dropped.

**Utilization — unaffected, unchanged (Resolved 2026-08-21, PRD §16 Resolved
Question 27):** Utilization's *definition* (assignment-time-based — % of time
an asset is assigned to a user/department, relative to total available time,
computed as a real-time snapshot with Disposed/Retired/Under-Maintenance
assets excluded from the denominator) remains resolved and is unaffected by
this correction. Only its *implementation* on the dashboard is outstanding —
no Utilization tile exists in the shipped KPI grid today, so its absence is
covered by AC-DASH-03 alongside NBV/Risk. No criterion in this document
asserts a specific numeric value, formula, or threshold a (not-yet-built)
Utilization tile must display; how "assigned" state/time would be measured
against Custody (P-006), what "total available time" would exclude, and the
aggregation window/granularity remain **design-phase TBD**. See
[`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence)
§13.

---

## 6. AC-ASSET-001 — P-003 Asset Registry

**Requirement:** `RAISE-FR-ASSET-001` · **Screen:** P-003

- **AC-ASSET-001-01** — Given asset records exist, when a user with
  appropriate access opens Asset Registry, then the list of asset records
  is displayed.
- **AC-ASSET-001-02** — Given the Asset Registry is displayed, when the
  user enters a search term, then the list is filtered to matching
  assets.
- **AC-ASSET-001-03** — Given the Asset Registry is displayed, when the
  user applies a filter (e.g., category), then only matching assets are
  shown.
- **AC-ASSET-001-04** — Given a filtered or unfiltered asset list, when
  the user selects an asset, then Asset Detail (P-004) opens for that
  asset.

**NOT TESTABLE YET:** the complete set of displayable fields (identifier,
name, status, holder, warranty status, maintenance status) is
Prototype-conceptual; the final asset master field list is unresolved
(PRD §16 Q1).

---

## 7. AC-ASSET-001-DETAIL — P-004 Asset Detail

**Requirement:** `RAISE-FR-ASSET-001` · **Screen:** P-004

- **AC-ASSET-001-D-01** — Given a selected asset, when Asset Detail
  opens, then Basic Information, Category, Custody, Financial, Warranty,
  Maintenance, QR/Barcode, Lifecycle, and Audit/History sections are all
  present for that single asset.
- **AC-ASSET-001-D-02** — Given Asset Detail is open, when the user views
  any section, then the information shown is specific to the selected
  asset only (no cross-asset leakage).

---

## 7.5. AC-LIFE-001 — Asset Lifecycle Connectivity (Cross-Cutting)

**Requirement:** `RAISE-FR-LIFE-001` · **Screen:** P-004 (Lifecycle section), reading from
Custody (P-006), Maintenance (P-009), Warranty (P-010), Audit Log (P-013)

This AC group was added to close a gap identified in
[`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md) §6:
`RAISE-FR-LIFE-001` previously had no dedicated acceptance criteria — only an
incidental mention inside AC-ASSET-001-DETAIL. The criteria below are drawn only from
what PRD §9 and Design §4.2/§9 already state; no new lifecycle business rule is
introduced.

- **AC-LIFE-001-01** — Given an asset has records in more than one lifecycle-relevant
  domain (e.g., a custody assignment, a maintenance record, and an audit log entry),
  when a user opens that asset's Detail screen (P-004) Lifecycle section, then all of
  those cross-domain records are shown as connected to that one asset.
- **AC-LIFE-001-02** — Given an asset undergoes a stage-changing operation (e.g.,
  Check-out, Check-in, a new Maintenance event), when the operation completes via its
  own screen (P-008, P-009), then Custody History, Maintenance, and Audit Log show
  consistent, non-contradictory entries for that asset (no screen shows a state the
  others contradict).
- **AC-LIFE-001-03** — Given lifecycle-connected asset data exists, when it is queried
  by a downstream function this PRD already defines (Executive Dashboard
  `AC-EXEC-001`, AI Assistant `AC-AI-SEARCH-001`), then that function can retrieve and
  use the data — this validates PRD §9's claim that "relevant lifecycle data can be
  consumed by reporting and intelligence functions," without inventing any new
  reporting feature.

**RESOLVED (was: NOT TESTABLE YET / sub-gap):** Design §4.2's conceptual state diagram
(Registered → Assigned → In Use → Check-in → Maintenance/Audit → **Disposal**) and
PRD's lifecycle diagram both include a Disposal stage, but no Disposal screen, flow, or
requirement ever existed in `RAISE-PROTOTYPE.md` or `RAISE-PRD.md` §13 MVP Scope.

**Resolved 2026-08-21 by Product/Business decision: Disposal is Enterprise Roadmap, not
MVP** (`RAISE-PRD.md` §14 item 7, §16 Resolved Question 26). Accordingly:

- AC-LIFE-001-01 through -03 above remain correctly scoped to the lifecycle stages that
  *do* have screens (Registration through Audit) — no criterion here claims disposal
  behavior, and none should until Disposal re-enters the chain as an approved MVP
  requirement.
- No new AC criterion is added for disposal. It is **Out of Scope for MVP**, not
  "blocked pending an answer" — the distinction matters for `RAISE-TEST-CASES.md`
  (see TC-LIFE-001-03, updated to Out of Scope) and `RAISE-TEST-PLAN.md`.

---

## 8. AC-ASSET-002 — P-005 Category & Hierarchy

**Requirement:** `RAISE-FR-ASSET-002` · **Screen:** P-005

**Resolved 2026-09-01 (Open Finding F-27, per explicit business decision):**
Prototype v0.9 §11 confirms "sub-category" is not a new field/data model —
it is the existing Asset `type` field — and that the hierarchy is exactly
**2 levels: Category → Type → individual assets**, no deeper. The tree
shown is the real, currently-seeded Category → Type breakdown (IT Hardware
→ Laptop/Monitor/Headphones; Mobile → Smartphone/Tablet; Office Equipment
→ Printer/Projector; Infrastructure → Server/Router; Media Equipment →
Camera), derived directly from `frontend/src/data/fixtures/mockData.ts`,
not an invented example. It is a live, data-derived grouping, not a closed
enumerated taxonomy — the specific `type` values will grow as assets with
new `type` values are added.

- **AC-ASSET-002-01** — Given categories exist, when a user opens
  Category & Hierarchy, then categories are displayed in a parent/child
  hierarchy, where the parent level is the Asset `category` field and the
  child level is the Asset `type` field (e.g. IT Hardware → Laptop/Monitor/
  Headphones; Mobile → Smartphone/Tablet; Office Equipment → Printer/
  Projector; Infrastructure → Server/Router; Media Equipment → Camera).
- **AC-ASSET-002-02** — Given an asset is assigned to a category, when
  the user views the Asset Registry or Asset Detail, then the assigned
  category is visible and consistent with the hierarchy view.
- **AC-ASSET-002-03** — Given a category node in the hierarchy (e.g. "IT
  Hardware"), when the user expands it, then its Type-level sub-groups are
  revealed (the distinct `type` values currently present within that
  `category`, e.g. Laptop/Monitor/Headphones under IT Hardware); when the
  user expands a Type-level node further (or views the existing
  per-asset list under it, per the flat category-to-assets grouping
  resolved by Open Finding F-25), then the individual assets under that
  `category`/`type` pair are revealed — matching the 2-level Category →
  Type → individual assets structure and no deeper.

This resolves the prior NOT TESTABLE YET note on this AC group. No
category/type value beyond those listed in Prototype v0.9 §11 is asserted
by any criterion above; the list is illustrative-but-real and is expected
to grow as new asset `type` values are seeded, not treated as a closed
enumeration.

---

## 9. AC-ASSET-003 — P-006 Custody History

**Requirement:** `RAISE-FR-ASSET-003` · **Screen:** P-006

- **AC-ASSET-003-01** — Given an asset has a current holder, when a user
  opens Custody History, then the current holder/assignment is
  displayed.
- **AC-ASSET-003-02** — Given an asset has past custody events, when a
  user opens Custody History, then a chronological history of
  date/holder/action entries is displayed.
- **AC-ASSET-003-03** — Given a custody-changing operation occurs
  (Check-in/Check-out, AC-OPS-002), when the operation completes, then a
  new entry is appended to Custody History and no prior entry is altered
  or removed.

**NOT TESTABLE YET:**
- The holder data model and organizational relationship model are
  undefined (PRD §16 Q13).
- **AC-ASSET-003-03 is scoped only to Check-in/Check-out as the triggering event** —
  it does not test, and must not be read as confirming, whether Custody History is
  written *only* by Check-in/Check-out or also by other custody-changing events (e.g.,
  a direct reassignment outside the Check-in/Check-out flow). The Prototype spec itself
  leaves this open (Prototype §12 "Open ambiguity," carried from PRD's Pre-Finalization
  Quality Pass — [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#duplicated--overlapping-requirements)
  §"RAISE-FR-ASSET-003 vs. RAISE-FR-OPS-002," marked **"Needs business confirmation"** —
  and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#42-custody--asset-operations)).
  A dedicated criterion for "direct reassignment without Check-in/Check-out" cannot be
  written until that confirmation exists, since no such flow/screen is defined anywhere
  in the Prototype.

---

## 10. AC-OPS-001 — P-007 QR / Barcode Scan

**Requirement:** `RAISE-FR-OPS-001` · **Screen:** P-007

- **AC-OPS-001-01** — Given a valid QR/Barcode is scanned, when the code
  matches an existing asset, then Asset Detail opens for that asset.
- **AC-OPS-001-02** — Given a QR/Barcode is scanned, when the code does
  not match any asset, then a "not found" state is shown with a retry
  option.
- **AC-OPS-001-03** — Given an invalid or unreadable code is scanned,
  when the scan completes, then an "invalid code" state is shown with a
  retry option.

**Reference Note:** VERSCAN's QR/Barcode workflow is reference-only UX
input (PRD §15); these criteria are scoped strictly to what
`RAISE-FR-OPS-001` and Prototype §13 already define, with no VERSCAN
feature added.

---

## 11. AC-OPS-002 — P-008 Check-in / Check-out

**Requirement:** `RAISE-FR-OPS-002` · **Screen:** P-008

**Workflow shape, permission gate, and holder data model resolved 2026-09-01**
(`RAISE-PRD.md` §16 Resolved Question 42, resolving Open Questions 11, 12, and 13;
`RAISE-PROTOTYPE.md` §14 P-008 and §12 P-006, v0.12): Check-in/Check-out is an
**immediate state-change operation** — there is no approval step and no
exception-handling workflow (deliberately simpler than `RAISE-FR-MAINT-001`'s 4-stage
workflow). "A user with appropriate permission" means simply **any authenticated user
("is logged in"), no role restriction** — matching the already-confirmed MVP RBAC
enforcement level (UI-only/client-side, PRD §16 Resolved Question 38). The criteria
below are updated to test this confirmed rule directly, rather than treating the
permission gate and the approval/exception-handling question as open.

- **AC-OPS-002-01** — Given an asset is available, when **any authenticated user**
  (no role restriction) selects Check-out and identifies a holder and confirms, then
  the asset's custody state updates immediately to reflect the new holder — with no
  approval step or intermediate pending state.
- **AC-OPS-002-02** — Given an asset is checked out, when any authenticated user
  confirms Check-in / return, then the asset's custody state updates immediately to
  reflect the return — with no approval step or intermediate pending state.
- **AC-OPS-002-03** — Given a Check-in or Check-out completes
  successfully, when the operation finishes, then a corresponding Audit
  Log entry (AC-AUDIT-001) is created.

**RESOLVED (was: NOT TESTABLE YET — "appropriate permission" undefined; approval/
exception-handling TBD):** both prior blockers on this AC group are closed by PRD §16
Resolved Question 42. AC-OPS-002-01/-02 above test the confirmed rule directly: any
authenticated user may Check-out/Check-in (no role restriction), and the operation is
an immediate state change with no approval step or exception-handling workflow. This
resolution is scoped **narrowly to this one permission gate** (Check-in/Check-out's
own "appropriate permission" language) — it does **not** resolve the general
role-model/permission-matrix content question for other domains (Audit, Alerts,
Warranty admin access, etc.), which remains **NOT TESTABLE YET** per PRD §16 Q21–Q22
(tracked in Open Finding F-08; see AC-LOGIN, AC-ALERT-001, AC-AUDIT-001,
AC-WARRANTY-001-06, and AC-MAINT-001's own RBAC-dependency notes).

**Not resolved by this change:** whether Check-in/Check-out is the *exclusive*
mechanism that writes Custody History (AC-ASSET-003), or whether other events (e.g.,
direct reassignment) also do, is a separate, still-open question — tracked as [Open
Finding F-10](../project-management/OPEN-FINDINGS.md) — and is unaffected by this
resolution.

### Background — IT Hardware Assignment Approval Workflow (category-scoped exception, confirmed 2026-09-02, PRD §16 Resolved Question 43; Design §4.2)

The criteria immediately above (AC-OPS-002-01/-02/-03) describe the **general** rule
and continue to apply exactly as written to **Check-in for every Asset Category**, and
to **Check-out (assignment) for every Asset Category except IT Hardware**. `RAISE-PRD.md`
§16 Resolved Question 43 (`RAISE-DESIGN.md` §4.2 "IT Hardware Assignment Approval
Workflow"; `RAISE-PROTOTYPE.md` §14 P-008, v0.13, new "IT Hardware Assignment Approval
Workflow — Category-Scoped Exception" subsection) confirms a **narrow, category-scoped
exception**: Check-out of an asset whose Asset Category is **IT Hardware** instead goes
through a new 4-stage approval workflow (Initiation → Recipient Confirmation → IT
Processing → IT Supervisor Approval) before the asset's status becomes **Assigned**.
This mirrors the same distinction AC-MAINT-001's background note (§12 below) draws
between confirmed workflow-shape content and still-TBD SLA/vendor/cost content: the
4-stage shape, its state model, its role gates at Stages 3–4 (`IT_STAFF`/`IT_MANAGER`,
no new Role), and the terminal-rejection rule are all **confirmed and testable**
(criteria AC-OPS-002-04 through -09 below); two specific Stage 2 sub-points — a
recipient-decline path, and e-signature/acknowledgment-text capture — are **not**
decided by this confirmation and remain marked NOT TESTABLE YET, not invented here.

No other asset category, and no Check-in for any category (including IT Hardware), is
affected by this exception — AC-OPS-002-09 below is a regression-guard criterion
confirming this explicitly.

- **AC-OPS-002-04 (Stage 1 — Initiation, pending state, not immediate Assigned)** —
  Given an IT Hardware-category asset is Available, when an IT/Admin user selects an
  employee and clicks Assign (the same trigger used today), then the asset does **not**
  immediately become Assigned — instead it enters state `PENDING_RECIPIENT_CONFIRMATION`
  and its displayed status badge shows a pending-approval indicator (e.g., "Assignment
  Pending — Awaiting Recipient Confirmation"), not "Assigned."
- **AC-OPS-002-05 (Stage 2 — Recipient Confirmation)** — Given an IT Hardware-category
  asset is in state `PENDING_RECIPIENT_CONFIRMATION` for a given recipient employee,
  when that recipient employee opens their own "My Pending Assignments" UI surface and
  selects Confirm Receipt, then the asset transitions to state
  `PENDING_IT_PROCESSING`.
- **AC-OPS-002-06 (Stage 3 — IT Processing)** — Given an IT Hardware-category asset is
  in state `PENDING_IT_PROCESSING`, when a user with the `IT_STAFF` role opens the IT
  Processing Queue and selects Process / Forward for Approval, then the asset
  transitions to state `PENDING_IT_SUPERVISOR_APPROVAL`.
- **AC-OPS-002-07 (Stage 4 — IT Supervisor Approval, only action that flips status to
  Assigned)** — Given an IT Hardware-category asset is in state
  `PENDING_IT_SUPERVISOR_APPROVAL`, when a user with the `IT_MANAGER` role opens the IT
  Supervisor Approval Queue and selects Approve, then the asset transitions to state
  `ASSIGNED` and its status becomes **Assigned** — this is the **only** action in the
  4-stage workflow that flips the asset's status to Assigned; no earlier stage
  transition (Stage 1 Initiation, Stage 2 Recipient Confirmation, or Stage 3 IT
  Processing) does so.
- **AC-OPS-002-08 (Rejection at Stage 3 or Stage 4 — terminal, returns to Available)** —
  Given an IT Hardware-category asset is in state `PENDING_IT_PROCESSING` (Stage 3) or
  `PENDING_IT_SUPERVISOR_APPROVAL` (Stage 4), when the acting `IT_STAFF` or `IT_MANAGER`
  user selects Reject instead of Process/Approve, then the asset's status returns
  **immediately to Available**, the flow ends, and no path reopens that rejected
  Assignment Approval Request — matching the existing P-009 Maintenance
  `REJECTED_BY_DEPT` terminal-state precedent (AC-MAINT-001, §12).
- **AC-OPS-002-09 (Regression guard — non-IT-Hardware categories unaffected)** — Given
  an asset whose Asset Category is **not** IT Hardware (Mobile, Office Equipment,
  Infrastructure, or Media Equipment) is Available, when **any authenticated user** (no
  role restriction) selects Check-out and identifies a holder and confirms, then the
  asset's custody state updates **immediately** to reflect the new holder exactly as
  described in AC-OPS-002-01 — no pending state, no 4-stage approval workflow, and no
  `IT_STAFF`/`IT_MANAGER` role requirement is introduced for any category other than
  IT Hardware. This criterion tests that the confirmed exception is category-scoped, not
  a change to the general rule.

**Stage-progress indicator:** consistent with AC-MAINT-001-09's precedent (§12), a
request in this workflow at any stage is expected to show a 4-stage progress indicator
(Initiation → Recipient Confirmation → IT Processing → IT Supervisor Approval)
displaying which stages are Done, Current, or Pending, consistent with the request's
current state. This is a design-layer UI pattern reused from P-009, not a new PRD field.

**NOT TESTABLE YET (Stage 2 sub-points — genuinely open, not decided either way):**
- **Recipient-decline path.** `RAISE-PROTOTYPE.md` §14 P-008 states explicitly that "no
  recipient-decline/reject path is defined" — the business was only asked about
  `IT_STAFF`/`IT_MANAGER` rejecting at Stages 3–4, not about the recipient declining at
  Stage 2. No criterion above tests a decline action, since no such UI element or
  resulting state is shown in the Prototype. This is a gap flagged by the Prototype
  itself, not a design decision, and no criterion should be read as confirming a
  decline path exists or is absent.
- **E-signature / acknowledgment-text capture.** Whether Stage 2's Confirm Receipt
  action should also capture an e-signature or legal-acknowledgment text (as the
  underlying physical form does) is explicitly **not decided** by PRD §16 Resolved
  Question 43 or Design §4.2 — tracked via the PRD's own `## NEEDS_PRD_CONFIRMATION`
  note (`RAISE-PRD.md` §16, raised 2026-09-02). AC-OPS-002-05 above tests only that a
  plain "Confirm Receipt" action advances the state; no criterion asserts any
  signature-capture or acknowledgment-text UI element, since none is shown in the
  Prototype.

Separately, and unaffected by this expansion: whether Custody History (`RAISE-FR-ASSET-003`)
is written once at Stage 4 final approval, or at each of the 4 stage transitions
individually, is a still-open design point per `RAISE-PROTOTYPE.md` §14's own "Open
Design Point — Custody History Write Timing" note and `RAISE-DESIGN.md` §4.2 — no
criterion above asserts when a Custody History entry is written during this workflow.
This is distinct from, and does not resolve, Open Finding F-10 (AC-ASSET-003-03, §9).

---

## 12. AC-MAINT-001 — P-009 Maintenance

**Requirement:** `RAISE-FR-MAINT-001` · **Screen:** P-009

**Background (updated — Prototype v0.5 §15):** the 4-stage maintenance-request workflow
(User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution) and
its state model (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH →
PLANNING/IN_PROGRESS/ON_HOLD → DONE`) are **business-confirmed** (PRD §16 Resolved
Question 33; Design §5.1) — this is no longer conceptual/TBD at the workflow-shape
level, so the criteria below test the confirmed stage transitions. SLA per stage, the
vendor model, the cost model, and delegated-approver configuration rules remain
**TBD** and are marked NOT TESTABLE YET separately below — deriving strictly from
Prototype §15's own "Confirmed" vs. "Still TBD" split (its Open Question note).

### Maintenance Record List

- **AC-MAINT-001-01** — Given maintenance records exist for an asset,
  when a user opens the Maintenance screen for that asset, then the
  records are displayed with date, event, status, and cost.
- **AC-MAINT-001-02** — Given multiple maintenance records exist for an
  asset, when the Maintenance screen is opened, then a chronological
  maintenance history is shown.

### 4-Stage Workflow — Stage Transitions

- **AC-MAINT-001-03 (Stage 1 — User Requisition)** — Given a user submits a new
  maintenance request for an asset (identifying the asset, requester, and issue
  description), when the request is submitted, then the request enters state
  `PENDING_DEPT_APPROVAL`.
- **AC-MAINT-001-04 (Stage 2 — Dept Approval, Delegated)** — Given a request is in
  state `PENDING_DEPT_APPROVAL`, when a Dept Approver (acting directly or, per the
  delegated-approver banner concept, "acting as delegate for" another approver)
  selects Approve, then the request transitions to state `PENDING_IT_DISPATCH`.
- **AC-MAINT-001-05 (Stage 2 — Reject / Request Info)** — Given a request is in state
  `PENDING_DEPT_APPROVAL`, when the Dept Approver selects Reject or Request Info
  instead of Approve, then the request does **not** transition to
  `PENDING_IT_DISPATCH` (the exact resulting state/flow for Reject/Request Info is
  **NOT TESTABLE YET** — Prototype §15 shows these as UI actions only, with no
  defined resulting state or downstream flow).
- **AC-MAINT-001-06 (Stage 3 — IT Dispatch)** — Given a request is in state
  `PENDING_IT_DISPATCH`, when IT Dispatch assigns the request (to a technician or
  queue) and selects Dispatch, then the request transitions to one of
  `PLANNING`, `IN_PROGRESS`, or `ON_HOLD` and Technician Execution (Stage 4) begins.
- **AC-MAINT-001-07 (Stage 4 — Technician Execution)** — Given a request is in state
  `PLANNING`, `IN_PROGRESS`, or `ON_HOLD`, when the assigned technician updates the
  status control among those three values, then the request's displayed status
  reflects the selected value.
- **AC-MAINT-001-08 (Stage 4 — Completion)** — Given a request is in state
  `PLANNING`, `IN_PROGRESS`, or `ON_HOLD`, when the technician selects Mark Complete,
  then the request transitions to state `DONE`.
- **AC-MAINT-001-09 (Stage progression visibility)** — Given a maintenance request
  exists at any stage, when a user opens that request's detail view, then the 4-stage
  progress indicator (User Requisition → Dept Approval → IT Dispatch → Technician
  Execution) shows which stages are Done, Current, or Pending, consistent with the
  request's current state.

**NOT TESTABLE YET:**
- The maintenance field model beyond date/event/status/cost, SLA per stage, the vendor
  model (internal technician vs. external vendor dispatch), and the cost model/tracking
  are not finalized in the PRD (PRD §16 Q14, partially resolved; Prototype §15 Open
  Question) — the "Priority," "Vendor model," and "Cost incurred" fields shown in the
  Prototype are placeholders only, and no criterion above asserts an SLA duration,
  vendor type, or cost value.
- **Delegated-approver configuration rules** — *who* may delegate, *to whom*, and how
  delegation is audited — are **TBD** (Prototype §15, Design §5.1); AC-MAINT-001-04 tests
  only that an Approve action (performed directly or while the delegate banner is
  shown) advances the state, not any delegation authorization rule.
- **AC-MAINT-001-04 through -08 depend on `RAISE-NFR-SEC-RBAC-001`** for *who* is
  permitted to perform each stage's action (Dept Approver, IT Dispatcher, Technician).
  **MVP enforcement level is confirmed** as UI-only/client-side, with backend enforcement
  deferred to Enterprise Roadmap (PRD §11, §16 Resolved Question 38; Design §16 Security
  Architecture) — this fixes only *where* a permission check would run, not *what* the
  roles/permissions are. The role list, permission matrix contents, and
  authentication/delegation mechanism remain **TBD** (PRD §16 Q22) — the criteria above
  test only that the state transition occurs when the corresponding stage action is
  performed, not that the acting user's role is correctly gated or verified, and no role
  name ("Dept Approver," "IT Dispatcher," "Technician") shown here should be read as an
  approved role definition.
- Prototype §15 does not define what happens if a technician attempts Mark Complete
  from any state other than `PLANNING`/`IN_PROGRESS`/`ON_HOLD`, or whether stages can be
  skipped/reversed — no criterion is written for those cases since no such behavior is
  shown in the Prototype.

---

## 13. AC-WARRANTY-001 — P-010 Warranty / P-018 Settings

**Requirement:** `RAISE-FR-WARRANTY-001` · **Screen:** P-010 (Warranty display, surfaced
on P-003 Asset Registry and P-004 Asset Detail — no standalone Warranty screen exists,
per Prototype §14) and **P-018 Settings** (admin-facing threshold configuration)

**Field list resolved 2026-08-29** (`RAISE-PRD.md` §16 Resolved Question 40, resolving
Open Question 15; `RAISE-DESIGN.md` §5.2 Warranty Domain; `RAISE-PROTOTYPE.md` §14 P-010
Warranty): for MVP, the Warranty domain has exactly one field on the Asset record —
`warrantyExpiry` (already implemented). A draft 8-field proposal (start date,
provider/vendor, type, coverage details, cost, claim contact, document reference) was
presented to the business as a candidate and was **explicitly rejected for MVP**, not
deferred — none of those seven fields is asserted below or in any criterion in this
document.

**Expiring threshold resolved 2026-09-01** (`RAISE-PRD.md` §16 Resolved Question 41,
resolving Open Question 15b; `RAISE-DESIGN.md` §5.2/§5.4; `RAISE-PROTOTYPE.md` §14 P-010
and §23A P-018 Settings): the "Expiring" boundary used to compute the 3-state Active/
Expiring/Expired Warranty status is **per-Asset-Category configurable**, not a single
fixed global number. All 5 current Asset Categories (IT Hardware, Mobile, Office
Equipment, Infrastructure, Media Equipment) default to **90 days**, and an admin may
adjust each category's threshold independently via the new **P-018 Settings** screen
("Warranty" section — one editable "Days before expiry to flag as Expiring" number input
per category, Save Changes / Reset, admin-only per `RAISE-NFR-SEC-RBAC-001`). The
threshold is stored on a Settings-domain `WarrantySettings` configuration record, not on
the Asset or Warranty record itself. This closes the prior "90-day threshold is
illustrative only" gap — the criteria below are rewritten accordingly (previously
referenced a stale "Start Date, End Date, Status" three-field shape, and separately a
single-fixed-90-day assumption; neither matches the Prototype anymore).

- **AC-WARRANTY-001-01** — Given an asset has a `warrantyExpiry` value set, when a
  user views the Asset Registry (P-003) or Asset Detail (P-004), then that asset's
  `warrantyExpiry` date is displayed.
- **AC-WARRANTY-001-02** — Given `warrantyExpiry` and the asset's Asset Category's
  configured threshold together place an asset's warranty in the Active, Expiring, or
  Expired state, when a user views the Asset Registry (P-003) or Asset Detail (P-004),
  then the corresponding Warranty badge/state is shown — this is a UI-computed display
  derived from `warrantyExpiry`, the category's configured threshold, and today's date,
  not a separately stored field (Prototype §14).
- **AC-WARRANTY-001-03** — Given an asset's `warrantyExpiry` falls within its Asset
  Category's configured "Expiring" threshold (default 90 days) from today, when a user
  views that asset on the Asset Registry (P-003) list or its Asset Detail (P-004) page,
  then that asset's Warranty badge/state shows **Expiring**, distinct from **Active**
  (threshold not yet reached) and **Expired** (`warrantyExpiry` already passed) — this
  criterion does not assert a separate, standalone "expiring-assets view" screen, since
  none exists (Prototype §14: Warranty is shown inline on P-003/P-004 only).
- **AC-WARRANTY-001-04** — Given an admin user opens Settings (P-018) and its Warranty
  section, when the section loads, then each of the 5 current Asset Categories (IT
  Hardware, Mobile, Office Equipment, Infrastructure, Media Equipment) shows an editable
  "Days before expiry to flag as Expiring" number input, defaulting to **90**.
- **AC-WARRANTY-001-05** — Given an admin changes one Asset Category's threshold value
  on P-018 and selects Save Changes, when the change is saved, then only assets in that
  changed category are affected by the new threshold (their Warranty badge/state
  recomputes accordingly on P-003/P-004) — assets in other, unchanged categories retain
  their existing threshold and are unaffected (no cross-category leakage).
- **AC-WARRANTY-001-06** — Given a non-admin user, when they attempt to access Settings
  (P-018) or edit a threshold, then access/write is denied, per `RAISE-NFR-SEC-RBAC-001`'s
  confirmed UI-only/client-side MVP enforcement level (PRD §16 Resolved Question 38) —
  this criterion tests only that a denial exists at the UI layer, not any specific role
  name or backend enforcement, since the role list/permission matrix remain **TBD** (PRD
  §16 Q22).

**RESOLVED (was: NOT TESTABLE YET — field list):** the field-list blocker on
AC-WARRANTY-001-01/-02 is closed. No criterion here asserts, or should ever assert, any
of the seven rejected fields (warranty start date, provider/vendor, type, coverage
details, cost, claim contact, document reference) — those remain out of scope for MVP
unless a future, separately-confirmed business decision adds them.

**RESOLVED (was: NOT TESTABLE YET — 90-day threshold):** the prior blocker — that the
90-day figure was only the PRD's illustrative business example (PRD §6.7), not a
confirmed generalizable rule — is closed by PRD §16 Resolved Question 41. The threshold
is now a confirmed, per-Asset-Category-configurable value (default 90 days,
admin-adjustable via P-018), not a single hardcoded constant. AC-WARRANTY-001-03 tests
this resolved rule directly; AC-WARRANTY-001-04/-05 test the P-018 Settings screen that
makes the threshold configurable; AC-WARRANTY-001-06 tests the admin-only access gate at
the confirmed MVP enforcement level. This AC group is now fully testable — no note in
this document should be read as leaving the threshold shape open any longer.

---

## 14. AC-ORACLE-001 — P-011 Oracle FA / Financial View

**Requirement:** `RAISE-FR-ORACLE-001` · **Screen:** P-011

- **AC-ORACLE-001-01** — Given Oracle FA data has been imported for an
  asset, when a user opens the Financial View, then Asset Number,
  Acquisition Information, NBV, Depreciation, Oracle Source, and
  Synchronization Status are displayed.
- **AC-ORACLE-001-02** — Given Oracle FA data is currently unavailable,
  when a user opens the Financial View, then a "data unavailable" state
  is shown instead of blank or misleading data.
- **AC-ORACLE-001-03** — Given a sync/import error has occurred, when a
  user opens the Financial View, then a "sync/import error" state is
  shown.
- **AC-ORACLE-001-04** — Given Oracle-sourced data conflicts with another
  source, when a user opens the Financial View, then a "data conflict"
  state is shown rather than one value being silently chosen.

**NOT TESTABLE YET:** integration method (API vs. file), sync frequency,
data mapping, retry mechanism, integration ownership, source-of-truth
rules, and security mechanism are all undefined (PRD §16 Q6–Q10; Design
§6.3) — AC-ORACLE-001-01 through -04 test only that the four states
(available / unavailable / error / conflict) are represented, not how
they are produced or resolved.

**"Phase 6" label — not applicable to this AC group (verified against Prototype v0.5 /
Design §6.4):** `RAISE-DESIGN.md` §6.4 records that "Phase 6" is a stale
`frontend/`-internal code-comment label (not a PRD phase), and that whether
`ReconciliationPage` satisfies `RAISE-FR-ORACLE-001` remains an **open question (PRD
Open Question 10a)**. Prototype §17 (P-011 Oracle FA / Financial View) does not
reference "Phase 6" or `ReconciliationPage`, and none of AC-ORACLE-001-01..04 above does
either — they are derived only from Prototype §17's stated screen elements (Asset
Number, Acquisition Information, NBV, Depreciation, Oracle Source, Synchronization
Status, and the four integration states). If `ReconciliationPage` is later confirmed (or
rejected) as the realization of `RAISE-FR-ORACLE-001`, this AC group should be
re-checked against whatever screen/element mapping that confirmation produces — no such
mapping is assumed here.

---

## 15. AC-ALERT-001 — P-012 Alerts

**Requirement:** `RAISE-FR-ALERT-001` · **Screen:** P-012

**Status Note — Updated 2026-09-04 to Reflect Confirmed Trigger Conditions and
Severity (PRD §16 Resolved Question 44; Design v0.13 §14 "Alert Architecture";
Prototype v0.14 §18; closes Open Finding F-05's trigger-rules-and-severity cause)**

This group previously carried a blanket **NOT TESTABLE YET** note because the MVP
alert-triggering rules and severity mapping were entirely undefined (PRD §6.9 Open
Question; tracked as Open Finding F-05). PRD v0.15 §16 Resolved Question 44 and Design
v0.13 §14 now confirm **exactly five** MVP trigger conditions with a fixed 3-level
(High/Medium/Low) severity assigned **per condition type** — not by days-overdue, not
by asset value or criticality (no such field exists in the data model). That cause of
the prior blanket note is closed; the criteria below replace it. AC-ALERT-001-01 (below)
already tested the structural display (severity / description / affected record) and
had passed on that narrower basis — it is extended, not contradicted, by the new
criteria.

**Read-time derivation, no persisted Alert record (Design §14).** None of the criteria
below imply an Alert table, Alert entity, or stored alert state — no read/unread, no
acknowledge/dismiss, no snooze. Each criterion is phrased as "given the underlying
Asset / Maintenance ticket / Assignment Approval Request is in state X, when Alerts is
opened, then a row for that condition is shown" — the row's existence is entirely
derived from currently-queried state, not a stored record.

**Implementation status (not a testability question — recorded so this section is not
overstated):** as of 2026-09-04, only the Warranty EXPIRED condition is actually
implemented. The other four confirmed conditions (Maintenance ticket OVERDUE, Warranty
EXPIRING, Maintenance ticket ON_HOLD, IT Hardware Handover PENDING) are specified here
but **not yet built**. The criteria below are written because the *scope* is now
confirmed and derivable from the Prototype, not because any of the five have been
verified passing — whether each criterion actually passes is decided at
`RAISE-TEST-CASES.md` on real test execution, not in this document.

- **AC-ALERT-001-01** — Given an alert-triggering condition has occurred,
  when an authorized user opens Alerts, then the alert is listed with a
  severity, description, and affected record.
- **AC-ALERT-001-02** — Given no multi-channel delivery is in MVP scope,
  when Alerts are displayed, then only in-app / on-screen alert
  presentation is verified — Email, Teams, and LINE Notify delivery are
  explicitly out of scope for this criterion (PRD §14 Enterprise
  Roadmap; unchanged, not a new decision).
- **AC-ALERT-001-03** — Given an Asset's `warrantyExpiry` date is in the
  past, when an authorized user opens Alerts, then a row is shown with
  severity **High**, condition "Warranty Expired," and the affected
  Asset — and selecting the row navigates to that Asset's
  [P-004 Asset Detail](../03-prototype/RAISE-PROTOTYPE.md#10-p-004-asset-detail).
- **AC-ALERT-001-04** — Given a Maintenance ticket's
  `targetResolutionDate` has passed and its status is not `DONE`, when
  an authorized user opens Alerts, then a row is shown with severity
  **High**, condition "Maintenance Ticket Overdue," and the affected
  ticket — and selecting the row navigates to that ticket's Maintenance
  Request Detail View within
  [P-009 Maintenance](../03-prototype/RAISE-PROTOTYPE.md#15-p-009-maintenance).
- **AC-ALERT-001-05** — Given an Asset's `warrantyExpiry` date falls
  inside its Asset Category's configured Expiring threshold (default 90
  days, per-category configurable via P-018 Settings, PRD §16 Resolved
  Question 41), when an authorized user opens Alerts, then a row is
  shown with severity **Medium**, condition "Warranty Expiring," and
  the affected Asset — and selecting the row navigates to that Asset's
  P-004 Asset Detail.
- **AC-ALERT-001-06** — Given a Maintenance ticket's status is
  `ON_HOLD`, when an authorized user opens Alerts, then a row is shown
  with severity **Medium**, condition "Maintenance Ticket On Hold," and
  the affected ticket — and selecting the row navigates to that
  ticket's Maintenance Request Detail View within P-009 Maintenance.
- **AC-ALERT-001-07** — Given an IT Hardware Assignment Approval
  Request is at any non-terminal stage of the P-008 4-stage workflow
  (Initiation / Recipient Confirmation / IT Processing / IT Supervisor
  Approval), when an authorized user opens Alerts, then a row is shown
  with severity **Low**, condition "IT Hardware Handover Pending," and
  the affected Handover (Assignment Approval Request) — and selecting
  the row navigates to that request's Assignment Approval Request
  detail/stage-progress view within
  [P-008 Check-in / Check-out](../03-prototype/RAISE-PROTOTYPE.md#14-p-008-check-in--check-out).
- **AC-ALERT-001-08** — Given severity is fixed per condition type (per
  the table in AC-ALERT-001-03..07), when Alerts are displayed, then no
  row's severity is computed from days-overdue, asset value, or any
  asset-criticality field — no such derivation or field exists in the
  data model, and none should be inferred.
- **AC-ALERT-001-09** — Given no Alert row is a stored record (Design
  §14 read-time derivation), when the underlying Asset, Maintenance
  ticket, or Assignment Approval Request state changes such that a
  condition listed in AC-ALERT-001-03..07 no longer holds (e.g., the
  ticket moves to `DONE`, or the handover reaches a terminal stage),
  then the corresponding row no longer appears on Alerts the next time
  it is opened — there is nothing to acknowledge, dismiss, or mark
  read, consistent with Prototype §18's "Open Questions — Left Open,
  Not Decided Here" list explicitly excluding those behaviors from MVP
  scope.
- **AC-ALERT-001-10** — Given only these five conditions are confirmed
  MVP scope, when Alerts are displayed, then no other condition (e.g.,
  preventive-maintenance-due or software-license-expiry) appears as a
  row — `RAISE-FR-LICENSE-001` is Roadmap and its alerting relationship
  is separately TBD; no next-service-date field exists for a
  preventive-maintenance condition.

**NOT TESTABLE YET:**

- AC-ALERT-001-01's "authorized user" gate cannot be fully verified: the
  role/permission model for who may view Alerts is undefined beyond the
  general MVP RBAC enforcement-level decision (UI-only/client-side,
  backend deferred to Roadmap — PRD §16 Resolved Question 38), which is a
  decision about *where* enforcement happens, not *what* the roles are
  (PRD §16 Q22, Open Finding F-08). AC-ALERT-001-01 is testable only for
  the structural behavior (an alert lists severity/description/affected
  record when opened), not for whether the correct roles are actually
  gated.

**Left open, not decided here (do not write criteria for these):**

- **Header bell-icon dropdown (`NotificationCenter.tsx` in `AppShell`)** —
  whether it is in scope for `RAISE-FR-ALERT-001` at all remains an
  unreconciled contradiction: PRD §16 Resolved Question 35 states it is
  entirely out of RAISE scope and distinct from this requirement, while
  [`ESAPS-UI-FOUNDATION-BASELINE.md`](../project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md)
  line 88 maps it to `RAISE-FR-ALERT-001` as EXTEND. PRD v0.15, Design
  v0.13, and Prototype v0.14 all carry this contradiction forward as
  still open. No criterion above tests the bell icon; none should be
  inferred from AC-ALERT-001-01..10.
- Alert acknowledgement, dismissal, read/unread, snooze,
  delivery/scheduling/digesting, and notification preferences remain out
  of MVP scope entirely and are not addressed by any criterion above
  (Prototype §18 "Open Questions — Left Open, Not Decided Here"; Design
  §14 "Explicitly Not Designed Here").

---

## 16. AC-AUDIT-001 — P-013 Audit Log

**Requirement:** `RAISE-FR-AUDIT-001` · **Screen:** P-013

- **AC-AUDIT-001-01** — Given a significant system activity occurs
  (e.g., Check-in/Check-out, asset update), when the activity completes,
  then an audit entry is created recording at minimum a timestamp, actor,
  action, and entity.
- **AC-AUDIT-001-02** — Given an audit entry exists, when any user or
  process attempts to modify or delete it through normal application
  operation, then the modification is rejected and the entry remains
  unchanged.
- **AC-AUDIT-001-03** — Given a user with audit-review access, when they
  open the Audit Log, then they can view recorded entries.

**NOT TESTABLE YET:** whether Before/After, Source, and Result are
required fields (vs. Actor/Timestamp/Action/Entity) is unconfirmed
(Design §15 lists them as "design candidates, not finalized PRD
requirements"); retention period, storage architecture, audit event
taxonomy, and privileged administrator controls are undefined (PRD §16
Q24–Q25). Separately, AC-AUDIT-001-03's "audit-review access" gate
cannot be fully verified either, since the role/permission model is
undefined (PRD §16 Q22) — this criterion is testable only for the
structural behavior (entries are viewable), not for whether the correct
role is actually enforced.

---

## 17. AC-EXEC-001 — P-014 Executive Dashboard

**Requirement:** `RAISE-FR-EXEC-001` · **Screen:** P-014

**Status Note — Corrected 2026-08-31 to match as-built dashboard (Open
Finding F-22):** the criteria below previously tested an "Executive Asset
Intelligence" wireframe (NBV/Risk/Utilization tiles; "Asset Overview"/
"Executive Summary" sections) that formal test execution confirmed was
never built — twice, `TC-EXEC-001-01`/`-02` (2026-08-26) and
`TC-DASH-01..03` (2026-08-29), recorded as [Open Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question)
in `OPEN-FINDINGS.md`. Per explicit business decision on F-22, and matching
[`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md#20-p-014-executive-dashboard)
§20's corrected "Sections (As Built)," the criteria below are rewritten
against the actually shipped `frontend/src/pages/Dashboard/index.tsx`
page — the same built page as P-002 (see AC-DASH §5). This is a scope/spec
correction to match reality — it does not add, remove, or reinterpret
`RAISE-FR-EXEC-001`.

- **AC-EXEC-001-01** — Given organization-level asset data exists, when an
  Executive user opens the Executive Dashboard, then the KPI grid displays
  all eight tiles: Total Assets, Available, Assigned, In Maintenance,
  Expired Warranty, Software Licenses, Monthly Depreciation, and Monthly
  Cost.
- **AC-EXEC-001-02** — Given the dashboard is displayed, when the
  Executive views it, then all ten sections are present: AI Insights, AI
  Portfolio Health, Oracle FA Reconciliation, Asset Lifecycle, Department
  Distribution, Asset Status, Asset Type, Pending Approvals, Recent
  Activities, and Maintenance Calendar.

**Testable now:** AC-EXEC-001-01 and -02 test presence of the actual
shipped tile/section list — identical to AC-DASH-01/-02 (§5) since P-014
and P-002 document the same built page — and are expected to pass against
the current app. The Monthly Depreciation/Monthly Cost "illustrative, no
depreciation model exists" caveat and the "presence only, not calculation
correctness" caveat noted under AC-DASH (§5) apply equally here.

**NOT TESTABLE YET (NBV/Risk — not yet built):** the PRD identifies NBV,
Risk, and Utilization as proposal-defined KPIs under `RAISE-FR-EXEC-001`.
None of the three appears in the shipped dashboard's KPI grid tested by
AC-EXEC-001-01. NBV and Risk formulas, thresholds, and dashboard placement
remain fully undefined — see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions) §16
Q3–Q4, tracked as [Open Finding
F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement).
This is a separate, not-yet-scheduled enhancement, not a silently dropped
requirement — no criterion in this document asserts NBV or Risk tiles must
be displayed on the Executive Dashboard, and none should be treated as
passing until F-03 is resolved and the enhancement is built.

**Utilization — unaffected, unchanged (Resolved 2026-08-21, PRD §16
Resolved Question 27; mechanics resolved Resolved Question 29):**
Utilization's *definition* (assignment-time-based — % of time an asset is
assigned to a user/department, relative to total available time, computed
as a real-time snapshot with Disposed/Retired/Under-Maintenance assets
excluded from the denominator) remains resolved, unaffected by this
correction. Only its *implementation* is outstanding — no Utilization tile
exists in the shipped KPI grid today. No criterion here asserts a specific
numeric value, formula, or threshold a (not-yet-built) Utilization tile
must show; how "assigned" state/time would be measured against the Custody
domain (P-006), what "total available time" would exclude, and the
aggregation window/granularity remain **design-phase TBD**. See
[`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence)
§13.

Whether the "AI Insights"/"AI Portfolio Health" sections satisfy PRD
§8.1's "AI-Generated Executive Summary" concept remains unresolved per
`RAISE-DESIGN.md` §13's still-open MVP-vs-Roadmap ambiguity note — no
criterion in this document asserts that they do.

---

## 18. AC-AI-SEARCH-001 — P-015 AI Assistant

**Requirement:** `RAISE-AI-SEARCH-001` · **Screen:** P-015

- **AC-AI-SEARCH-001-01** — Given a user submits a natural-language asset
  question, when the system processes it, then an answer is returned
  based on connected asset information.
- **AC-AI-SEARCH-001-02** — Given an answer is returned, when the user
  views it, then the "Sources / Data Used" section lists which data
  categories (e.g., Asset, Warranty, Maintenance, Financial data)
  contributed to the answer.
- **AC-AI-SEARCH-001-03** — Given the illustrative example question
  ("Which notebooks expire within 90 days?"), when submitted, then the
  returned answer includes an affected-assets count and a table of
  Asset / Warranty / Age / Maintenance / Status columns, consistent with
  the Prototype's demonstrated layout.

**NOT TESTABLE YET:** the exact citation/provenance mechanism, confidence
threshold, and conflicting-source handling are undefined (PRD §16
Q18–Q20; Design §8.2) — these criteria test that source attribution is
*present*, not its precision or format.

---

## 19. AC-AI-STATES — AI Response States

**Requirement:** `RAISE-AI-SEARCH-001` · **Screen:** P-015 (§22 AI Response States)

- **AC-AI-STATES-01 (Success)** — Given matching data exists, when a
  question is answered, then the answer, relevant data, and source
  context are shown together.
- **AC-AI-STATES-02 (No Data)** — Given no assets match the question,
  when the system responds, then a "No matching assets were found."
  message is shown instead of an empty or misleading answer.
- **AC-AI-STATES-03 (Unable to Answer)** — Given the system cannot
  derive an answer from available data, when it responds, then a
  "RAISE could not answer from the available data." message is shown.
- **AC-AI-STATES-04 (Source Unavailable)** — Given one or more source
  systems are unavailable at query time, when the system responds, then
  a "Some source data is currently unavailable." message is shown.
- **AC-AI-STATES-05 (Data Conflict)** — Given conflicting source records
  are found, when the system responds, then a "Conflicting information
  was found. Please review the source records." message is shown rather
  than silently picking one value.

These five states are explicitly enumerated in the Prototype spec (§22)
and Design's error-handling principles (Design §20), so they are fully
testable as written — only the underlying detection logic for each state
remains an implementation detail for Test Plan / Development to define.

---

## 19.5. AC-AI-DOC-001 — P-004 Asset Detail (incidental) — OCR / Extraction

**Requirement:** `RAISE-AI-DOC-001` · **Screen:** P-004 (incidental element only, per
Prototype §5 mapping note and §10 Traceability)

**Background (updated 2026-08-21 — supersedes prior v0.2 "AC Scope Boundary Note"):**
PRD v0.3 §16 Resolved Question 28 gave OCR/Extraction its own Traceability ID at
Priority P0 / Scope MVP. Design v0.4 §9A documents it (with Metadata, Classification,
Duplicate Detection) as a "design-convenience grouping only," and Prototype v0.3 §5/§10
map its effect onto P-004 Asset Detail as an **incidental** element (extracted field
display) rather than a dedicated screen. This AC group exists to give
`RAISE-AI-DOC-001` its own traceable acceptance entry (matching how AC-AI-SEARCH-001
was written for `RAISE-AI-SEARCH-001`), while marking every behavioral detail NOT
TESTABLE YET, since the PRD's own Acceptance Criteria field for this requirement
states none is defined beyond the capability being listed as "Current"
(`RAISE-PRD.md` §7 RAISE-AI-DOC-001).

- **AC-AI-DOC-001-01 — NOT TESTABLE YET.** Given a source document has been associated
  with an asset, when OCR/Extraction (`RAISE-AI-DOC-001`) processes it, then extracted
  field values would be expected to surface in Asset Detail's Basic Information /
  Financial sections (Prototype §10 "Incidental" note) — **not testable yet** because
  which document types, which fields, and the accuracy threshold are all undefined
  (`RAISE-PRD.md` §7 RAISE-AI-DOC-001 Open Question; Design §9A "Design Notes and TBD
  Items"). No criterion here asserts a specific document type, field, or accuracy
  value.

This group is intentionally limited to one placeholder criterion: the Prototype
describes only a reserved screen location (Prototype §10), not a concrete UI element
(unlike, e.g., P-001 Login's explicit "Error state" / "Access-denied state" bullets),
so no further Given/When/Then behavior can be derived without inventing detail.

---

## 19.6. AC-AI-DOC-002 — P-004 Asset Detail (incidental) — Metadata

**Requirement:** `RAISE-AI-DOC-002` · **Screen:** P-004 (incidental element only, per
Prototype §5 mapping note and §10 Traceability)

- **AC-AI-DOC-002-01 — NOT TESTABLE YET.** Given asset/document information has been
  processed, when AI-Generated Metadata (`RAISE-AI-DOC-002`) produces tags/attributes,
  then those tags would be expected to surface within Asset Detail's Basic Information
  / Financial sections alongside `RAISE-AI-DOC-001`'s extracted fields (Prototype §10
  "Incidental" note) — **not testable yet** because which metadata fields/tags are
  generated and how they are surfaced to users are undefined (`RAISE-PRD.md` §7
  RAISE-AI-DOC-002 Open Question; Design §9A). No criterion here asserts a specific
  metadata field, tag, or display format.

Same limitation as AC-AI-DOC-001: only a reserved screen location is described, not a
concrete UI element, so this group has a single placeholder criterion.

---

## 19.7. AC-AI-DOC-003 — P-005 Category & Hierarchy (incidental) — Classification

**Requirement:** `RAISE-AI-DOC-003` · **Screen:** P-005 (incidental element only, per
Prototype §5 mapping note and §11 Traceability)

- **AC-AI-DOC-003-01 — NOT TESTABLE YET.** Given an asset is uncategorized or has
  category-relevant data, when AI-Assisted Classification (`RAISE-AI-DOC-003`)
  evaluates it, then a "suggested category" indicator could surface on this screen
  (Prototype §11 "Incidental" note, illustrative "e.g." wording only) — **not testable
  yet** because whether this capability assigns category values directly or only
  suggests them for human confirmation is undefined (`RAISE-PRD.md` §7 RAISE-AI-DOC-003
  Open Question; Design §9A). No criterion here asserts an auto-assign vs.
  suggest-only behavior, since the Prototype itself takes no position on which applies.

Same limitation as AC-AI-DOC-001/002: only a reserved screen location and an
illustrative example are described, not a confirmed UI element, so this group has a
single placeholder criterion.

---

## 19.8. AC-AI-DOC-004 — P-003 Asset Registry (incidental) — Duplicate Detection

**Requirement:** `RAISE-AI-DOC-004` · **Screen:** P-003 (incidental element only, per
Prototype §5 mapping note and §9 Traceability)

- **AC-AI-DOC-004-01 — NOT TESTABLE YET.** Given multiple asset records may represent
  the same physical asset, when AI-Assisted Duplicate Detection (`RAISE-AI-DOC-004`)
  evaluates the Asset Registry list, then a "possible duplicate" indicator could
  surface on the affected row(s) (Prototype §9 "Incidental" note, illustrative "e.g."
  wording only) — **not testable yet** because matching criteria/threshold and the
  resolution workflow (auto-merge vs. flag-for-review) are undefined (`RAISE-PRD.md`
  §7 RAISE-AI-DOC-004 Open Question; Design §9A). No criterion here asserts a specific
  matching threshold or merge/flag behavior.

Same limitation as the three groups above: only a reserved screen location and an
illustrative example are described, not a confirmed UI element, so this group has a
single placeholder criterion.

**Note on all four groups (AC-AI-DOC-001..004):** these AC groups exist to satisfy
Traceability (every P0/MVP requirement should have a corresponding AC entry), not
because the Prototype defines testable UI behavior for them yet. Each group's sole
criterion is marked NOT TESTABLE YET at the criterion level (per this document's
derivation principle, §2) rather than inventing acceptance detail. This differs from
the prior v0.2 approach (a single non-testable "AC Scope Boundary Note" covering all
four with no dedicated Traceability ID) only because PRD v0.3 §16 Resolved Question 28
has since assigned each capability its own Traceability ID — the underlying acceptance
detail remains equally undefined in both versions.

---

## 19.9. NFR Backlog — Acceptance Criteria Note

**Added 2026-08-23, re-sync against `RAISE-PROTOTYPE.md` v0.6 §25A.** Prototype v0.6
added [§25A NFR Backlog — Prototype
Note](../03-prototype/RAISE-PROTOTYPE.md#25a-nfr-backlog--prototype-note), an explicit
per-area status table for the broader
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#10-non-functional-requirements) §10 NFR
backlog (Performance, Availability, Scalability, Backup/Recovery, Data Retention,
Encryption, API Security, Audit Retention, Monitoring, Logging) that sits outside
`RAISE-NFR-SEC-RBAC-001`. This section mirrors that same completeness discipline at the
Acceptance Criteria layer, so this document does not silently omit any reference to
those ten areas.

**No new AC group is written for any of the ten areas**, because none of them has a
defined value, target, mechanism, or dedicated PRD Traceability ID (Prototype §25A;
`RAISE-DESIGN.md` §16A) — writing Given/When/Then criteria now would invent both the
acceptance threshold and the requirement identity. This is consistent with this
document's own derivation principle (§2): a criterion is only written where the
Prototype spec already describes a concrete element, state, or flow, and Prototype
§25A explicitly states these ten areas have **no prototype representation at all**.

| PRD §10 NFR Area | Acceptance Criteria Status |
|---|---|
| Authentication | Already covered narrowly by AC-LOGIN (§4) — existence of success/error/access-denied states only; mechanism NOT TESTABLE YET (PRD §16 Q21) |
| Authorization / RBAC | Already covered narrowly by AC-LOGIN and AC-MAINT-001 RBAC-dependency notes (MVP enforcement level only, per `RAISE-NFR-SEC-RBAC-001`); role list/permission matrix content NOT TESTABLE YET (PRD §16 Q22). AC-OPS-002's own permission gate is a narrow exception, fully resolved 2026-09-01 (PRD §16 Resolved Question 42 — any authenticated user, no role restriction) for Check-in and non-IT-Hardware Check-out — this does not extend to the general role/permission-matrix content question for other domains. **Expanded 2026-09-02 (PRD §16 Resolved Question 43):** IT Hardware-category Check-out's Stages 3–4 reuse the existing `IT_STAFF`/`IT_MANAGER` roles (already confirmed under `RAISE-NFR-SEC-RBAC-001`, no new role introduced) — AC-OPS-002-06/-07/-08 test only that the state transition occurs when the corresponding stage action is performed, not that the acting user's role is actually enforced (MVP RBAC enforcement remains UI-only/client-side). |
| Performance | No AC group — no target defined in PRD/Design/Prototype |
| Availability | No AC group — no target defined in PRD/Design/Prototype |
| Scalability | No AC group — no target defined in PRD/Design/Prototype |
| Backup / Recovery | No AC group — no policy defined in PRD/Design/Prototype |
| Data Retention | No AC group — no policy defined in PRD/Design/Prototype |
| Encryption | No AC group — no requirement defined in PRD/Design/Prototype |
| API Security | No AC group — no requirement defined in PRD/Design/Prototype |
| Audit Retention | No AC group beyond AC-AUDIT-001's existing NOT TESTABLE YET retention-period note (§16) — no dedicated retention criterion exists |
| Monitoring | No AC group — no requirement defined in PRD/Design/Prototype |
| Logging | No AC group — distinct from the business-facing Audit Log AC group (AC-AUDIT-001), which is an application-domain acceptance criterion, not an operational logging NFR |

Only `RAISE-NFR-SEC-RBAC-001` (Authorization/RBAC) has PRD-confirmed, criterion-relevant
content today (the MVP enforcement-level decision, already reflected in AC-LOGIN and
AC-MAINT-001's dependency notes, plus AC-OPS-002's now-fully-resolved permission gate) —
the other ten areas remain fully TBD
at every layer (PRD → Design → Prototype → Acceptance Criteria) and are recorded here for
traceability completeness only, not as a commitment to future criteria.

---

## 20. Not-Yet-Testable Summary

The following PRD Open Questions (§16) block full testability of the
criteria above and must be resolved before `RAISE-TEST-PLAN.md` can treat
them as final:

| Open Question | Blocks |
|---|---|
| Q1 Asset master field list | AC-ASSET-001-01..04 |
| Q3 NBV/Risk KPI formulas (Utilization definition itself resolved — Resolved Question 27) | AC-DASH-03, AC-EXEC-001 NBV/Risk note (§17) — tracked further as Open Finding F-03 |
| Q4 Definition of Risk | AC-DASH-03, AC-EXEC-001 NBV/Risk note (§17) — tracked further as Open Finding F-03 |
| Q6–Q10 Oracle integration design | AC-ORACLE-001-01..04 |
| Q22 Roles and permissions required (Check-in/Check-out's own permission gate resolved — Resolved Question 42; general role/permission-matrix content for other domains remains open) | AC-LOGIN-01..03, AC-ALERT-001-01, AC-AUDIT-001-03, AC-MAINT-001-04..08 |
| Q13 Holder data model | AC-ASSET-003-01..03 |
| Custody-writing-events ambiguity (RAISE-FR-ASSET-003 vs. RAISE-FR-OPS-002 — PRD Pre-Finalization Quality Pass, "Duplicated / Overlapping Requirements," needs business confirmation) | AC-ASSET-003-03 (scope note only) |
| Q14 Maintenance fields / SLA / vendor model / cost model (workflow shape and state model now confirmed — Resolved Question 33; only SLA, vendor model, cost model, and delegated-approver configuration remain open) | AC-MAINT-001-01, -02 (fields); AC-MAINT-001-05 (Reject/Request Info resulting state); delegated-approver rule note under AC-MAINT-001 |
| Q18–Q20 AI citation / confidence / conflict handling | AC-AI-SEARCH-001-02..03 |
| Q21 Authentication mechanism | AC-LOGIN-01..02 |
| Q24–Q25 Audit taxonomy / retention | AC-AUDIT-001-01..02 |
| RAISE-AI-DOC-001 Open Question (document scope / fields / accuracy threshold undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-001-01 |
| RAISE-AI-DOC-002 Open Question (metadata fields/tags / surfacing undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-002-01 |
| RAISE-AI-DOC-003 Open Question (assign-vs-suggest classification behavior undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-003-01 |
| RAISE-AI-DOC-004 Open Question (matching threshold / merge-or-flag workflow undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-004-01 |
| `## NEEDS_PRD_CONFIRMATION` (raised 2026-09-02, `RAISE-PRD.md` §16 — IT Hardware Assignment Approval Workflow Stage 2 recipient-decline path and e-signature/acknowledgment-text capture, both genuinely undecided) | AC-OPS-002's Stage 2 NOT TESTABLE YET note (§11) |

No criterion in this document silently resolves these — each affected
criterion above carries its own **NOT TESTABLE YET** note.

**Resolved since last revision (2026-09-04, PRD §16 Resolved Question 44, per
confirmed business decision — closes Open Finding F-05):** F-05's cause (alert
trigger rules and severity mapping entirely undefined) is resolved. PRD v0.15 §16
Resolved Question 44 and Design v0.13 §14 confirm five MVP trigger conditions
(Warranty EXPIRED/EXPIRING, Maintenance ticket OVERDUE/ON_HOLD, IT Hardware Handover
PENDING) with a fixed High/Medium/Low severity assigned per condition type.
AC-ALERT-001 (§15) is rewritten: the prior blanket NOT TESTABLE YET note (which cited
undefined trigger rules) is replaced by AC-ALERT-001-03..10, each testing one
confirmed condition/severity pairing or a cross-cutting rule (fixed-not-computed
severity; no persisted Alert record; no sixth condition). AC-ALERT-001-01's
"authorized user" gate remains separately NOT TESTABLE YET (PRD §16 Q22, Open
Finding F-08 — unaffected by this resolution, still listed in the table above). The
bell-icon-dropdown scope contradiction (PRD §16 Resolved Question 35 vs.
`ESAPS-UI-FOUNDATION-BASELINE.md` line 88) also remains unresolved and is called out
by name in §15, not decided here. Only Warranty EXPIRED is actually implemented as of
2026-09-04 — the other four confirmed conditions are specification-complete but not
yet built; this is an implementation-status note, not a new testability blocker, and
does not change any criterion's Given/When/Then wording.

**Resolved since last revision (2026-08-31, Open Finding F-22 as-built
correction):** AC-DASH-01/-02 (§5) and AC-EXEC-001-01/-02 (§17) previously
tested a wireframe (Total Assets/NBV/Risk/Warranty Expiry or NBV/Risk/
Utilization tiles; "Asset by Category"/"Lifecycle-Maintenance Overview"/
"Recent Alerts" or "Asset Overview"/"Executive Summary" sections) that
formal test execution confirmed was never built — `TC-DASH-01..03`
(2026-08-29) and `TC-EXEC-001-01`/`-02` (2026-08-26), recorded as [Open
Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question).
Per explicit business decision on F-22, both AC groups are rewritten
against the actually shipped `frontend/src/pages/Dashboard/index.tsx` page
(matching `RAISE-PROTOTYPE.md` v0.8 §8/§20's own as-built correction) and
are now **Testable** for tile/section presence — this is a scope/spec
correction to match reality, not a resolution of any PRD Open Question.
NBV and Risk remain unresolved (Q3–Q4 above, Open Finding F-03) and are now
tracked under the new AC-DASH-03 / AC-EXEC-001's NBV/Risk note rather than
under AC-DASH-01/AC-EXEC-001-01, since the rewritten AC-DASH-01/
AC-EXEC-001-01 no longer claim NBV/Risk tiles exist. Utilization's
definition remains resolved and unaffected (Resolved Question 27); only its
dashboard implementation is outstanding, and its absence is now covered by
the same AC-DASH-03 / AC-EXEC-001 NBV/Risk note rather than a separate
row.

**Resolved since last revision:** Q15 (Warranty field list) — `RAISE-PRD.md` §16
Resolved Question 40 (2026-08-29) confirmed `warrantyExpiry` as the only Warranty field
for MVP; a draft 8-field proposal was explicitly rejected, not deferred
(`RAISE-DESIGN.md` §5.2; `RAISE-PROTOTYPE.md` §14 P-010). AC-WARRANTY-001-01 and -02
(§13 above) are now fully testable against this single-field model; no seven-field
content is asserted anywhere in this document.

**Resolved since last revision (2026-09-01):** Q15b (Warranty "Expiring" threshold
shape) — `RAISE-PRD.md` §16 Resolved Question 41 confirmed the threshold is
per-Asset-Category configurable, defaulting to 90 days for all 5 current Asset
Categories, admin-adjustable via a new **P-018 Settings** screen
(`RAISE-DESIGN.md` §5.2/§5.4; `RAISE-PROTOTYPE.md` §14 P-010 and §23A P-018 Settings).
This closes the prior "AC-WARRANTY-001-03's 90-day threshold is the PRD's illustrative
business example only, not a confirmed generalizable rule" blocker. AC-WARRANTY-001-03
(§13) is rewritten to test the resolved per-category rule directly; two new criteria —
AC-WARRANTY-001-04 (P-018 threshold inputs default to 90 per category) and
AC-WARRANTY-001-05 (editing one category's threshold does not affect other categories)
— test the P-018 Settings screen itself; AC-WARRANTY-001-06 tests the admin-only access
gate at the already-confirmed MVP enforcement level (PRD §16 Resolved Question 38), not
a new role model. AC-WARRANTY-001 (§13) is now **fully testable** — no NOT TESTABLE YET
note remains under §13.

**Resolved since last revision:** Q14 (partial) — the `RAISE-FR-MAINT-001` 4-stage
workflow shape (User Requisition → Dept Approval (Delegated) → IT Dispatch →
Technician Execution) and its state model (`PENDING_DEPT_APPROVAL →
PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE`) are confirmed
(`RAISE-PRD.md` §16 Resolved Question 33; `RAISE-DESIGN.md` §5.1; Prototype v0.5 §15).
AC-MAINT-001-03 through -09 (§12 above) are now testable for stage-transition behavior.
SLA per stage, the vendor model, the cost model, and delegated-approver configuration
rules remain **NOT TESTABLE YET** — this is a partial, not full, resolution of Q14.

**Note — RBAC MVP enforcement level confirmed, but role model still blocks several
criteria (PRD §16 Resolved Question 38; Design §16 Security Architecture):** business
confirmed that a UI-only/client-side permission check is acceptable for MVP, backend
enforcement deferred to Enterprise Roadmap. This is a narrow decision about *where*
enforcement happens, not *what* the roles/permissions are — it does not resolve Q22
(roles and permissions required), which continues to block AC-LOGIN-01..03,
AC-ALERT-001-01, AC-AUDIT-001-03, and (newly) AC-MAINT-001-04..08 as
listed in the table above. No role list, permission matrix, or authentication
mechanism is assumed anywhere in this document as a result of this confirmation.

**Resolved since last revision (2026-09-01):** Q11 (Check-in/Check-out workflow) and Q12
(who can assign/transfer an asset) — `RAISE-PRD.md` §16 Resolved Question 42 confirmed
Check-in/Check-out is an **immediate state-change operation** with no approval step or
exception-handling workflow, and that its permission gate is **any authenticated user,
no role restriction** (`RAISE-PROTOTYPE.md` §14 P-008, v0.12). AC-OPS-002-01/-02 (§11
above) are rewritten to test this confirmed rule directly; AC-OPS-002 is now **fully
testable**, and the AC Index (§3) status is updated accordingly. This resolution is
narrowly scoped to Check-in/Check-out's own permission gate — it does **not** resolve
the general role list/permission-matrix content question (Q21–Q22) for other domains
(Audit, Alerts, Warranty admin access, etc.), which remains open per the note above and
Open Finding F-08. Separately, whether Check-in/Check-out is the *exclusive* writer of
Custody History (AC-ASSET-003-03) was **not** part of this confirmation and remains open
— see Open Finding F-10 in `OPEN-FINDINGS.md`.

**New in this revision (2026-09-02):** PRD §16 Resolved Question 43 (Design §4.2 "IT
Hardware Assignment Approval Workflow") confirmed a **category-scoped exception** to
Resolved Question 42's general rule: Check-out of an IT Hardware-category asset goes
through a new 4-stage approval workflow (Initiation → Recipient Confirmation → IT
Processing → IT Supervisor Approval) before its status becomes Assigned, gated at
Stages 3–4 by the existing `IT_STAFF`/`IT_MANAGER` roles (no new Role). AC-OPS-002 (§11)
gained five new criteria (AC-OPS-002-04 through -09) testing the pending-state
initiation, recipient confirmation, IT processing, IT supervisor approval (the only
action that flips status to Assigned), terminal rejection, and a regression guard
confirming non-IT-Hardware categories are unaffected. Two Stage 2 sub-points remain
genuinely open and are **not** resolved by this confirmation: the recipient-decline
path, and e-signature/acknowledgment-text capture — both tracked via the new
`## NEEDS_PRD_CONFIRMATION` row added to the table above. AC-OPS-002-01/-02/-03 (the
general rule for Check-in and non-IT-Hardware Check-out) are unchanged.

**Resolved since last revision:** Q26 (Disposal MVP scope for `RAISE-FR-LIFE-001`) —
confirmed Enterprise Roadmap, not MVP, on 2026-08-21. See §7.5 above and
`RAISE-PRD.md` §16 Resolved Questions. No AC criterion was ever written claiming
disposal behavior, so no criterion needed correction — this only removes the item
from the open-blockers list.

**Resolved since last revision:** Q27 (Utilization KPI definition) — confirmed
assignment-time-based on 2026-08-21 (`RAISE-PRD.md` §16 Resolved Question 27; Design
v0.4 §13). **Superseded 2026-08-31 by the Open Finding F-22 as-built correction above:**
at the time this note was written, AC-DASH-01/AC-EXEC-001-01 asserted a "Utilization"
tile was present and testable against the confirmed definition; formal test execution
(`TC-DASH-01..03`, `TC-EXEC-001-01`/`-02`) subsequently confirmed no such tile — nor the
wireframe those criteria were based on — was ever built. AC-DASH-01/-02 and
AC-EXEC-001-01/-02 have since been rewritten against the actual shipped tile/section
list (§5, §17); Utilization's absence (definition still resolved, only implementation
outstanding) is now tracked under AC-DASH-03 / AC-EXEC-001's NBV/Risk note, not as a
partially-blocked note under AC-DASH-01/AC-EXEC-001-01.

**Resolved since last revision:** the traceability gap previously noted here — "no
dedicated `RAISE-AI-*` Traceability ID exists for OCR/Extraction, Metadata,
Classification, or Duplicate Detection" — is now stale. PRD v0.3 §16 Resolved Question
28 (2026-08-21) assigned `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` their own Traceability
IDs at P0/MVP. Dedicated AC groups (§19.5–§19.8 above) have been added accordingly.
The underlying acceptance *behavior* for all four remains undefined, which is why the
four rows immediately above this note — not a missing-Traceability-ID note — now
represent the blocker.

**New in this revision (2026-08-23, Prototype v0.6 §25A re-sync):** the PRD §10 NFR
backlog (Performance, Availability, Scalability, Backup/Recovery, Data Retention,
Encryption, API Security, Audit Retention, Monitoring, Logging) is not a row in this
table because none of these ten areas carries a dedicated PRD Traceability ID or a
defined value/target — there is no criterion to mark blocked. See new §19.9 above for
the explicit per-area acknowledgment (mirroring Prototype §25A / Design §16A) that no
AC group exists for these areas and why.

---

## 21. Acceptance Criteria Review Checklist

Before moving to Test Plan:

- [ ] Every prototype screen (P-001–P-015) has at least one AC group
- [ ] Every AC group traces to a PRD requirement ID or an explicit TBD
- [ ] Every criterion is written as Given/When/Then
- [ ] No criterion invents a business rule, threshold, field, or role
      beyond what PRD/Design/Prototype already state
- [ ] Every criterion with an unresolved dependency is marked NOT
      TESTABLE YET and links to the relevant PRD Open Question
- [ ] No VERSCAN-only behavior was introduced as a criterion
- [ ] Roadmap/Pilot capabilities (AI Recommendation, Risk Scoring,
      Lifecycle Prediction, License Management P-016/P-017) have no MVP
      acceptance criteria written here
- [x] `RAISE-FR-MAINT-001`'s confirmed 4-stage workflow (User Requisition → Dept
      Approval (Delegated) → IT Dispatch → Technician Execution) has stage-transition
      criteria (§12 AC-MAINT-001-03..09); SLA/vendor/cost model remain NOT TESTABLE YET
- [x] `RAISE-NFR-SEC-RBAC-001`'s confirmed MVP enforcement level (UI-only/client-side,
      backend deferred to Roadmap) is reflected in AC-LOGIN and AC-MAINT-001's
      RBAC-dependency notes without inventing a role list, permission matrix, or
      authentication mechanism (all remain TBD per PRD §16 Q22); AC-OPS-002's own
      permission gate is a narrow, separately-resolved exception (PRD §16 Resolved
      Question 42, 2026-09-01) that does not extend to the general role model
- [x] AC-ORACLE-001 does not reference the stale "Phase 6" code-comment label or assume
      `ReconciliationPage` satisfies `RAISE-FR-ORACLE-001` (PRD Open Question 10a remains
      open and unresolved here)
- [x] PRD §10 / Design §16A / Prototype §25A's broader NFR backlog (Performance,
      Availability, Scalability, Backup/Recovery, Data Retention, Encryption, API
      Security, Audit Retention, Monitoring, Logging) is explicitly acknowledged (§19.9)
      rather than silently absent from this document — no AC group is invented for any
      of these areas
- [x] AC-DASH (§5) and AC-EXEC-001 (§17) test the actual shipped
      `frontend/src/pages/Dashboard/index.tsx` tile/section list, matching
      `RAISE-PROTOTYPE.md` v0.8 §8/§20's as-built correction (Open Finding F-22) — no
      criterion asserts the old, never-built "NBV"/"Risk"/"Warranty Expiry"/"Asset by
      Category"/"Recent Alerts" wireframe; NBV/Risk remain explicitly NOT TESTABLE YET
      (Open Finding F-03), not silently marked passing
- [x] AC-OPS-002 (§11) reflects the category-scoped IT Hardware Assignment Approval
      Workflow exception (PRD §16 Resolved Question 43; Design §4.2) without altering
      AC-OPS-002-01/-02/-03's general rule for Check-in and non-IT-Hardware Check-out;
      the Stage 2 recipient-decline path and e-signature/acknowledgment-text capture are
      explicitly marked NOT TESTABLE YET rather than invented, per the Prototype's own
      open-question framing
- [x] AC-ALERT-001 (§15) tests exactly the five confirmed MVP trigger conditions and
      their fixed-per-condition High/Medium/Low severity (PRD §16 Resolved Question 44;
      Design §14; closes Open Finding F-05's trigger-rules cause), without inventing a
      sixth condition, a days-overdue/asset-value/criticality severity formula, or a
      persisted Alert record (Design §14 read-time derivation); AC-ALERT-001-01's
      "authorized user" gate remains explicitly NOT TESTABLE YET (PRD §16 Q22, Open
      Finding F-08); the header bell-icon dropdown scope contradiction (PRD §16 Resolved
      Question 35 vs. `ESAPS-UI-FOUNDATION-BASELINE.md` line 88) is named but left
      unresolved, with no criterion written for it; only Warranty EXPIRED is noted as
      actually implemented as of 2026-09-04, without any criterion claiming the other
      four have been verified

---

## 22. Next Step

```text
RAISE-PRD.md
      ↓
RAISE-DESIGN.md
      ↓
RAISE-PROTOTYPE.md
      ↓
RAISE-ACCEPTANCE-CRITERIA.md   ← Current
      ↓
RAISE-TEST-PLAN.md
      ↓
RAISE-TEST-CASES.md
      ↓
RAISE-TRACEABILITY-MATRIX.md
      ↓
Development
      ↓
RAISE-COMPLIANCE-REVIEW.md
```

The next artifact is **Test Plan**, which should convert each testable
criterion above into a test case and flag each NOT TESTABLE YET criterion
as blocked pending business confirmation.

---

## Document Status

**Version:** 0.12 (re-synced against `RAISE-PROTOTYPE.md` v0.14 §18, `RAISE-PRD.md` v0.15,
and `RAISE-DESIGN.md` v0.13 §14, 2026-09-04 — PRD §16 Resolved Question 44 /
`RAISE-FR-ALERT-001` five MVP trigger conditions and fixed-per-condition severity,
resolved; closes Open Finding F-05's trigger-rules cause)

**Change Log — v0.11 → v0.12 (2026-09-04, PRD §16 Resolved Question 44, per confirmed
business decision):**

1. **Root cause.** `RAISE-PRD.md` §16 Resolved Question 44 and `RAISE-DESIGN.md` v0.13
   §14 ("Alert Architecture") confirmed **five** MVP alert trigger conditions — Warranty
   EXPIRED (High), Maintenance ticket OVERDUE (High), Warranty EXPIRING (Medium),
   Maintenance ticket ON_HOLD (Medium), IT Hardware Handover PENDING (Low) — with
   severity fixed **per condition type**, not computed from days-overdue, asset value,
   or asset-criticality. `RAISE-PROTOTYPE.md` v0.14 §18 (P-012) was rewritten first to
   reflect this; this document is corrected to match. This closes the trigger-rules and
   severity-mapping cause of Open Finding F-05 (the "Trigger rules and channels" entry
   in `OPEN-FINDINGS.md` still tracks channels separately, which is unaffected — MVP
   remains single-channel in-app, not a new decision).
2. **AC-ALERT-001 (§15) rewritten and expanded.** A new Status Note explains the
   resolution and explicitly states that AC-ALERT-001-01 (structural display — severity /
   description / affected record) already passed on that narrower basis and is extended,
   not contradicted. The prior blanket **NOT TESTABLE YET** note (which cited undefined
   trigger rules as its sole cause) is removed and replaced with eight new criteria:
   **AC-ALERT-001-03..07** (one per confirmed condition/severity/affected-record/
   navigation-destination pairing — Warranty EXPIRED/EXPIRING and Maintenance ticket
   OVERDUE/ON_HOLD link to their existing P-004/P-009 detail views; IT Hardware Handover
   PENDING links to the Assignment Approval Request detail/stage-progress view within
   P-008 — no new screen is invented), **AC-ALERT-001-08** (severity is fixed per
   condition type, not computed from days-overdue/value/criticality),
   **AC-ALERT-001-09** (read-time derivation — a row disappears once its underlying
   condition no longer holds, with no acknowledge/dismiss/read-unread state to manage,
   per Design §14's no-persisted-Alert-record architecture), and **AC-ALERT-001-10** (no
   sixth condition — explicitly excludes preventive-maintenance-due and
   software-license-expiry). AC-ALERT-001-01's "authorized user" gate NOT TESTABLE YET
   note is kept, unchanged, since PRD §16 Q22 / Open Finding F-08 is unaffected by this
   resolution. A new "Left open, not decided here" block names the bell-icon-dropdown
   scope contradiction (PRD §16 Resolved Question 35 vs.
   `ESAPS-UI-FOUNDATION-BASELINE.md` line 88) and the acknowledge/dismiss/delivery
   exclusions, so neither is silently assumed resolved.
3. **Implementation status recorded, not overstated.** Per the Status Note in §15, only
   the Warranty EXPIRED condition is actually implemented as of 2026-09-04; the other
   four are specification-complete but not yet built. This is noted explicitly so this
   revision does not imply verification — whether each criterion passes is left to
   `RAISE-TEST-CASES.md` execution, not decided in this document.
4. **AC Index (§3)** — AC-ALERT-001 row's Status updated to record the resolution, the
   remaining NOT TESTABLE YET gate, and the implementation-status caveat.
5. **Not-Yet-Testable Summary (§20)** — a new "Resolved since last revision (2026-09-04,
   ... closes Open Finding F-05)" note added; the existing Q22 row (already scoped to
   AC-ALERT-001-01 only) required no change.
6. **Acceptance Criteria Review Checklist (§21)** gained a new checklist item confirming
   the five-condition scope, the retained NOT TESTABLE YET gate, the still-open bell-icon
   contradiction, and the implementation-status caveat.
7. No other AC group required a correction — this revision touches only the document
   header, §3 (index row), §15 (AC-ALERT-001), §20 (Not-Yet-Testable Summary), and §21
   (checklist). `RAISE-PROTOTYPE.md` and earlier layers were **not** modified by this
   pass, per this document's own scope boundary. The Login/Asset/Ops/Maintenance/
   Warranty/Oracle/Audit/Executive/AI-Search/AI-Doc groups were checked against the
   corresponding Prototype v0.14 sections and found unchanged in substance — Prototype
   v0.13 → v0.14's only content change was the P-012 Alerts rewrite itself.

**Change Log — v0.10 → v0.11 (2026-09-02, PRD §16 Resolved Question 43, per confirmed
business decision):**

1. **Root cause.** `RAISE-PRD.md` §16 Resolved Question 43 (Design §4.2 "IT Hardware
   Assignment Approval Workflow") confirmed a **category-scoped exception** to Resolved
   Question 42's general Check-in/Check-out rule: Check-out (assigning) an asset whose
   Asset Category is **IT Hardware** goes through a new 4-stage approval workflow
   (Initiation → Recipient Confirmation → IT Processing → IT Supervisor Approval) before
   the asset's status becomes Assigned, gated at Stages 3–4 by the existing `IT_STAFF`/
   `IT_MANAGER` roles (no new Role introduced). Check-in for every category, and
   Check-out for every other category, are completely unaffected. `RAISE-PROTOTYPE.md`
   v0.13 §14 (P-008) was corrected first (new "IT Hardware Assignment Approval Workflow
   — Category-Scoped Exception" subsection); this document is corrected to match.
2. **AC-OPS-002 (§11) expanded.** A new "Background — IT Hardware Assignment Approval
   Workflow" note distinguishes this category-scoped exception from AC-OPS-002-01/-02/-03's
   unchanged general rule, mirroring how AC-MAINT-001's own background note (§12)
   distinguishes confirmed workflow-shape content from still-TBD SLA/vendor/cost
   content. Six new criteria were added: **AC-OPS-002-04** (Stage 1 Initiation enters a
   pending state, not immediate Assigned), **AC-OPS-002-05** (Stage 2 Recipient
   Confirmation via the recipient's own "My Pending Assignments" UI surface),
   **AC-OPS-002-06** (Stage 3 IT Processing by an `IT_STAFF` user), **AC-OPS-002-07**
   (Stage 4 IT Supervisor Approval by an `IT_MANAGER` user — the only action that flips
   status to Assigned), **AC-OPS-002-08** (rejection at Stage 3 or 4 returns the asset
   immediately to Available, terminal, matching the existing P-009 `REJECTED_BY_DEPT`
   precedent), and **AC-OPS-002-09** (a regression-guard criterion confirming
   non-IT-Hardware categories remain immediate, any-authenticated-user Check-out,
   unaffected by the exception). A stage-progress-indicator expectation (modeled on
   AC-MAINT-001-09's Done/Current/Pending precedent) is noted.
3. **Two Stage 2 sub-points explicitly marked NOT TESTABLE YET, not invented.** The
   recipient-decline path and e-signature/acknowledgment-text capture at Stage 2 are
   genuinely undecided per `RAISE-PROTOTYPE.md` §14's own open-question framing and the
   PRD's own `## NEEDS_PRD_CONFIRMATION` note (raised 2026-09-02) — no criterion is
   written for either; both are called out by name in a new NOT TESTABLE YET block under
   §11.
4. **AC Index (§3)** — AC-OPS-002 row's Status expanded to record the confirmed IT
   Hardware exception is now testable, while explicitly naming the two Stage 2
   sub-points that remain NOT TESTABLE YET.
5. **Not-Yet-Testable Summary (§20)** — a new "New in this revision (2026-09-02)" note
   summarizes the expansion; a new `## NEEDS_PRD_CONFIRMATION`-sourced row was added to
   the blocking-questions table pointing at AC-OPS-002's Stage 2 NOT TESTABLE YET note.
6. **§19.9 NFR Backlog Note** — the Authorization/RBAC row was updated to record that
   Stages 3–4 reuse the existing `IT_STAFF`/`IT_MANAGER` roles (no new role), consistent
   with the general MVP UI-only/client-side enforcement-level note.
7. **Acceptance Criteria Review Checklist (§21)** gained a new checklist item confirming
   the category-scoped exception is reflected without altering the general rule, and
   that the two Stage 2 sub-points are marked NOT TESTABLE YET rather than invented.
8. No other AC group required a correction — this revision touches only the document
   header, §3 (index row), §11 (AC-OPS-002), §19.9 (RBAC summary table row), §20
   (Not-Yet-Testable Summary), and §21 (checklist). `RAISE-PROTOTYPE.md` and earlier
   layers were **not** modified by this pass, per this document's own scope boundary —
   only this document was edited. The Login/Asset/Maintenance/Warranty/Oracle/Alert/
   Audit/Executive/AI-Search/AI-Doc groups were checked against the corresponding
   Prototype v0.13 sections and found unchanged in substance — Prototype v0.12 → v0.13's
   only content change was the IT Hardware Assignment Approval Workflow addition itself.

**Change Log — v0.9 → v0.10 (2026-09-01, PRD §16 Resolved Question 42, per confirmed
business decision):**

1. **Root cause.** `RAISE-PRD.md` §16 Resolved Question 42 (resolving Open Questions
   11, 12, and 13) confirmed that Check-in/Check-out is an **immediate state-change
   operation** with no approval step or exception-handling workflow, that its
   permission gate is **any authenticated user, no role restriction**, and that the
   holder data model is a direct 1:1 link to an Employee record. `RAISE-PROTOTYPE.md`
   v0.12 §14 (P-008) and §12 (P-006) were corrected first (explicitly correcting an
   earlier overreach that had conflated this resolution with the separate, still-open
   Custody-History-write-path-exclusivity question); this document is corrected to
   match.
2. **AC-OPS-002 (§11) rewritten.** AC-OPS-002-01/-02 now state the confirmed rule
   directly: any authenticated user (no role restriction) may Check-out/Check-in, and
   each operation is an immediate state change with no approval step or intermediate
   pending state. The prior "NOT TESTABLE YET" note ("'appropriate permission' is
   undefined... approval requirements and exception handling... are explicitly TBD")
   is replaced with a **RESOLVED** note citing Resolved Question 42, plus an explicit
   scope boundary: this resolution does **not** extend to the general role/
   permission-matrix content question for other domains (PRD §16 Q21–Q22, Open Finding
   F-08), and does **not** resolve whether Check-in/Check-out is the *exclusive* writer
   of Custody History (a separate, still-open question tracked as Open Finding F-10 —
   left untouched in AC-ASSET-003-03, §9).
3. **AC Index (§3)** — AC-OPS-002 row's Status updated from "Partially testable" to
   "Testable (resolved 2026-09-01, PRD §16 Resolved Question 42...)."
4. **Not-Yet-Testable Summary (§20)** — the Q11/Q12 rows are removed from the blocking
   table (folded into the Q22 row's clarifying note, since Q22's own general-RBAC
   blocker for other domains is unaffected); a new "Resolved since last revision
   (2026-09-01): Q11 and Q12" note explains the resolution and its scope boundary
   (F-08, F-10 both explicitly called out as unaffected). §19.9's RBAC summary table
   and its accompanying paragraph are updated to reflect that AC-OPS-002's own
   permission gate is now a resolved exception, not covered by the general MVP
   enforcement-level note.
5. No other AC group required a correction — this revision touches only the document
   header, §3 (index row), §11 (AC-OPS-002), §19.9 (RBAC summary table row/paragraph),
   and §20 (Not-Yet-Testable Summary). AC-ASSET-003 (§9) was deliberately left
   unchanged, since its NOT TESTABLE YET note's holder-data-model bullet and its
   Custody-History-exclusivity scope note are outside the boundary of this resolution
   (the latter is explicitly the still-open Open Finding F-10). The Login/Asset/
   Maintenance/Warranty/Oracle/Alert/Audit/Executive/AI-Search/AI-Doc groups were
   checked against the corresponding Prototype v0.12 sections and found unchanged in
   substance — Prototype v0.11 → v0.12's only content change was the Check-in/
   Check-out resolution itself.

**Change Log — v0.8 → v0.9 (2026-09-01, PRD §16 Resolved Question 41, per confirmed
business decision):**

1. **Root cause.** `RAISE-PRD.md` §16 Resolved Question 41 (resolving Open Question
   15b, a follow-on to Resolved Question 40) confirmed that the Warranty "Expiring"
   threshold is **per-Asset-Category configurable**, defaulting to 90 days for all 5
   current Asset Categories, admin-adjustable via a new **P-018 Settings** screen.
   `RAISE-DESIGN.md` v0.10 §5.2/§5.4/§4.1B and `RAISE-PROTOTYPE.md` v0.10 §14 (P-010)
   and new §23A (P-018 Settings) were corrected first; this document is corrected to
   match. This closes AC-WARRANTY-001-03's prior blocker (the 90-day figure was only
   the PRD's illustrative business example, not a confirmed generalizable rule).
2. **AC-WARRANTY-001 (§13) rewritten and expanded.** The group header now cites both
   P-010 (Warranty display, inline on P-003/P-004 — no standalone Warranty screen
   exists) and P-018 Settings. AC-WARRANTY-001-01/-02 are reworded to reference the
   Asset Registry (P-003) / Asset Detail (P-004) display surfaces explicitly (not a
   "Warranty screen"), consistent with the already-existing P-010 note that no
   standalone Warranty screen was built. **AC-WARRANTY-001-03 is rewritten** to test
   that an asset within its category's configured threshold shows an **Expiring**
   Warranty badge/state distinct from Active/Expired, on P-003 and P-004 — replacing
   the prior "expiring-assets view" wording (no such standalone view exists). **Two new
   criteria added:** AC-WARRANTY-001-04 (P-018 Settings shows all 5 categories with an
   editable threshold input defaulting to 90) and AC-WARRANTY-001-05 (editing and
   saving one category's threshold affects only that category's assets, not others — no
   cross-category leakage). **A new AC-WARRANTY-001-06** tests the admin-only access
   gate to P-018 at the already-confirmed MVP enforcement level (PRD §16 Resolved
   Question 38) — no new role model is invented.
3. **NOT TESTABLE YET note on the 90-day threshold removed.** The prior note ("the
   exact 90-day threshold used in AC-WARRANTY-001-03 is the PRD's illustrative business
   example... not a confirmed, generalizable business rule") no longer applies — the
   threshold shape (per-category, default 90, admin-adjustable) is now confirmed by
   business decision and implemented end-to-end (verified via 151/151 automated tests
   passing, including a dedicated TC-WARRANTY-001-03 test, and live browser execution
   per the implementation record cited in `RAISE-PROTOTYPE.md` §23A). AC-WARRANTY-001
   is now marked **Testable** (previously "Testable (field list resolved 2026-08-29;
   90-day rule still illustrative)") in the AC Index (§3).
4. **AC Index (§3)** — AC-WARRANTY-001 row's Screen(s) column updated to "P-010, P-018"
   and Status updated to "Testable (field list resolved 2026-08-29; per-category
   configurable threshold resolved 2026-09-01)."
5. **Not-Yet-Testable Summary (§20)** — a new "Resolved since last revision
   (2026-09-01): Q15b" note added explaining the resolution and listing the new/changed
   criteria; the prior Q15 note is left intact for the field-list resolution (unchanged
   in substance) but no longer implies AC-WARRANTY-001-03 remains blocked.
6. No other AC group required a correction — this revision touches only the document
   header, §3 (index row), §13 (AC-WARRANTY-001), and §20 (Not-Yet-Testable Summary).
   The Login/Asset/Ops/Maintenance/Oracle/Alert/Audit/Executive/AI-Search/AI-Doc groups
   were checked against the corresponding Prototype v0.10 sections and found unchanged
   in substance — Prototype v0.9 → v0.10's only content change was the Warranty
   threshold resolution and the new P-018 Settings screen itself.

**Change Log — v0.7 → v0.8 (2026-09-01, Open Finding F-27 scope/spec
correction, per confirmed business decision):**

1. **Root cause.** `RAISE-PROTOTYPE.md` v0.9 §11 (P-005 Category & Hierarchy) resolved
   Open Finding F-27: "sub-category" is confirmed to be the existing Asset `type` field
   (not a new field/data model), the hierarchy is exactly 2 levels (Category → Type →
   individual assets), and the illustrative "Computer/Notebook/Desktop", "Network/
   Switch/Router" example tree is replaced with the real, currently-seeded Category →
   Type breakdown derived from `frontend/src/data/fixtures/mockData.ts`. This is a
   scope/spec correction resolving a previously-TBD open question, not a new
   requirement.
2. **AC-ASSET-002 (§8) rewritten.** AC-ASSET-002-01 now states the parent/child
   hierarchy explicitly as Category (`category` field) → Type (`type` field), with the
   real seeded example values. A new **AC-ASSET-002-03** tests that expanding a
   category reveals its Type-level sub-groups, and expanding further (or the existing
   per-asset list, per Open Finding F-25) reveals individual assets under each
   `category`/`type` pair — matching Prototype v0.9 §11's 2-level structure exactly.
   No category/type value beyond what Prototype v0.9 §11 states is asserted.
3. **NOT TESTABLE YET note removed from AC-ASSET-002.** The prior note ("the final
   category hierarchy... is explicitly illustrative, not finalized business data") no
   longer applies — the hierarchy shape and real example values are now confirmed by
   business decision. AC-ASSET-002 is now marked **Testable** (previously "Partially
   testable") in the AC Index (§3).
4. No other AC group required a correction — this revision touches only §3 (index row)
   and §8 (AC-ASSET-002). The Not-Yet-Testable Summary (§20) did not carry a numbered
   row for this item (it was referenced only inline under AC-ASSET-002 itself), so no
   §20 table row required removal.

**Change Log — v0.6 → v0.7 (2026-08-31, Open Finding F-22 as-built
correction, per explicit business decision):**

1. **Root cause.** `RAISE-PROTOTYPE.md` v0.7 §8 (P-002 Main Dashboard) and §20 (P-014
   Executive Dashboard) — the direct source for this document's AC-DASH (§5) and
   AC-EXEC-001 (§17) — specified an "Asset Overview"/"Executive Asset Intelligence"
   wireframe (Total Assets/NBV/Risk/Warranty Expiry or NBV/Risk/Utilization tiles;
   "Asset by Category"/"Lifecycle-Maintenance Overview"/"Recent Alerts" or "Asset
   Overview"/"Executive Summary" sections) that was never built. Formal test execution
   confirmed this gap twice against the same shipped page,
   `frontend/src/pages/Dashboard/index.tsx` — `TC-EXEC-001-01`/`-02` (2026-08-26) and
   `TC-DASH-01..03` (2026-08-29) — recorded as Open Finding F-22 in `OPEN-FINDINGS.md`.
   Business explicitly decided to correct the Prototype (and this Acceptance Criteria
   document downstream of it) to match the shipped app, rather than change the app to
   match the old wireframe. `RAISE-PROTOTYPE.md` v0.7 → v0.8 and `RAISE-DESIGN.md` v0.8
   → v0.9 were corrected first; this document is corrected to match.
2. **AC-DASH (§5) rewritten.** AC-DASH-01 now tests the actual eight-tile KPI grid
   (Total Assets, Available, Assigned, In Maintenance, Expired Warranty, Software
   Licenses, Monthly Depreciation, Monthly Cost); AC-DASH-02 now tests the actual
   ten-section list (AI Insights, AI Portfolio Health, Oracle FA Reconciliation, Asset
   Lifecycle, Department Distribution, Asset Status, Asset Type, Pending Approvals,
   Recent Activities, Maintenance Calendar). Both are marked **Testable** and are
   expected to pass against the current app. A new **AC-DASH-03** documents that NBV,
   Risk, and Utilization tiles are absent from the shipped grid — this criterion
   confirms the gap is accurately documented, not that the tiles must be displayed.
3. **AC-EXEC-001 (§17) rewritten** identically in substance to AC-DASH, since
   `RAISE-PROTOTYPE.md` confirms P-002 and P-014 document the same built page:
   AC-EXEC-001-01 tests the same eight-tile KPI grid; AC-EXEC-001-02 tests the same
   ten-section list. Both are marked **Testable**.
4. **NBV/Risk kept NOT TESTABLE YET, not marked passing.** Per explicit instruction,
   NBV and Risk KPI formulas remain a separate, not-yet-implemented enhancement (PRD
   §16 Q3–Q4, Open Finding F-03) — AC-DASH-03 and a corresponding NOT TESTABLE YET note
   under AC-EXEC-001 (§17) make this explicit; no criterion in this document asserts
   NBV/Risk tiles must be displayed or treats their absence as a defect to be tested
   against.
5. **Utilization unaffected, unchanged.** PRD §16 Resolved Question 27's
   assignment-time-based definition remains resolved and is not reopened by this
   correction. Only Utilization's dashboard *implementation* is outstanding — no
   Utilization tile exists in the shipped grid — and this is now covered by AC-DASH-03
   / AC-EXEC-001's NBV/Risk note rather than a standalone "testable for presence" claim
   under AC-DASH-01/AC-EXEC-001-01, since those criteria no longer reference a
   Utilization tile at all.
6. **AC Index (§3)** — AC-DASH and AC-EXEC-001 rows updated from "Partially testable"
   to "Testable (rewritten 2026-08-31 to match as-built dashboard, Open Finding F-22;
   NBV/Risk NOT TESTABLE YET)."
7. **Not-Yet-Testable Summary (§20)** — the Q3/Q4 table rows' "Blocks" column updated
   from AC-DASH-01/AC-EXEC-001-01 (no longer accurate, since those criteria no longer
   test NBV/Risk/Utilization) to AC-DASH-03/AC-EXEC-001's NBV/Risk note. A new
   "Resolved since last revision (2026-08-31, Open Finding F-22...)" note added
   explaining the correction, and the prior Q27 resolution note (v0.2→v0.3) is marked
   **Superseded 2026-08-31** rather than left to imply AC-DASH-01/AC-EXEC-001-01 still
   assert a Utilization tile exists.
8. **Acceptance Criteria Review Checklist (§21)** gained a new checklist item
   confirming AC-DASH/AC-EXEC-001 now test the actual shipped page and that NBV/Risk
   remain explicitly NOT TESTABLE YET.
9. Version citations in the document header were updated from Prototype v0.7 / Design
   v0.8 to Prototype v0.8 / Design v0.9 (PRD unchanged at v0.11). This is a
   scope/spec correction to match Prototype's already-corrected content per an
   explicit business decision on Open Finding F-22 — not a new requirement, and no
   `## NEEDS_PRD_CONFIRMATION` signal is raised. No other AC group required
   correction — the Login/Asset/Ops/Maintenance/Warranty/Oracle/Alert/Audit/
   AI-Search/AI-Doc groups were checked against the corresponding Prototype v0.8
   sections and found unchanged in substance (Prototype v0.7 → v0.8's only content
   change was the P-002/P-014 as-built correction itself).

**Change Log — v0.5 → v0.6 (2026-08-29):**

1. **`RAISE-FR-WARRANTY-001` Warranty field-list question resolved — AC-WARRANTY-001
   (§13) rewritten.** `RAISE-PRD.md` §16 Resolved Question 40 (resolving Open Question
   15), `RAISE-DESIGN.md` §5.2 (Warranty Domain), and `RAISE-PROTOTYPE.md` §14 (P-010
   Warranty) all confirm: for MVP, the Warranty domain has exactly one field —
   `warrantyExpiry` (already implemented on the Asset record). A draft 8-field proposal
   (start date, provider/vendor, type, coverage details, cost, claim contact, document
   reference) was presented to the business and **explicitly rejected for MVP**, not
   deferred. AC-WARRANTY-001-01 and -02 previously referenced a stale "Start Date, End
   Date, Status" three-field shape that no longer matches the resolved single-field
   model — both criteria are rewritten to reference `warrantyExpiry` and the
   UI-computed (not stored) Warranty Timeline derived from it. **No criterion in this
   document asserts any of the seven rejected fields** — they remain out of scope for
   MVP, not "now testable."
2. **AC-WARRANTY-001-03's 90-day-window blocker is unaffected and stays NOT TESTABLE
   YET**, since it concerns a separate, still-unconfirmed business rule (PRD §6.7
   Business Example is illustrative only), not the field-list question that was
   resolved. This distinction is now called out explicitly in §13 so the two blockers
   are not conflated.
3. **AC Index (§3)** AC-WARRANTY-001 row status updated from "Partially testable" to
   "Testable (field list resolved 2026-08-29; 90-day rule still illustrative)."
4. **Not-Yet-Testable Summary (§20)** — the "Q15 Warranty fields" row is removed from
   the blocking-questions table (the field-list question itself is closed), and a
   "Resolved since last revision: Q15" note is added explaining the resolution and
   clarifying that AC-WARRANTY-001-03's narrower 90-day-rule blocker remains open under
   its own §13 note, not as a table row.
5. Version citations in the document header were updated from Prototype v0.6 / PRD v0.9
   / Design v0.8 to Prototype v0.7 / PRD v0.11 / Design v0.8 (Design unchanged since the
   Warranty resolution landed in PRD §16 and Design §5.2, both already reflected at
   Design v0.8). No other AC group required correction — this pass is scoped only to
   the Warranty field-list resolution and its downstream index/summary references; the
   Asset/Ops/Maintenance/Oracle/Alert/Audit/Executive/AI-Search/AI-Doc groups were
   checked and found unchanged in substance.

**Change Log — v0.4 → v0.5 (2026-08-23):**

1. **PRD §10 / Design §16A / Prototype §25A NFR backlog given an explicit Acceptance
   Criteria-layer acknowledgment.** Prototype v0.6 added [§25A NFR Backlog — Prototype
   Note](../03-prototype/RAISE-PROTOTYPE.md#25a-nfr-backlog--prototype-note), mirroring
   Design v0.8's §16A, to record that the PRD §10 NFR backlog (Performance,
   Availability, Scalability, Backup/Recovery, Data Retention, Encryption, API
   Security, Audit Retention, Monitoring, Logging) has no defined value, target, or
   dedicated PRD Traceability ID outside `RAISE-NFR-SEC-RBAC-001`, and that the
   Prototype adds no screen/UI element for any of these ten areas. This document had no
   equivalent acknowledgment — new **§19.9 NFR Backlog — Acceptance Criteria Note** now
   records, per area, that no AC group is written (or, for Authentication/
   Authorization-RBAC and Audit Retention, exactly what narrow criterion content
   already exists elsewhere in this document). **No new AC group, criterion, value, or
   threshold was invented** — this pass only ensures the document does not silently
   omit reference to these ten areas, matching the discipline Design and Prototype
   applied in their own v0.7→v0.8 / v0.5→v0.6 passes.
2. **AC Index (§3)** gained a row pointing to §19.9 (marked "Not testable yet —
   traceability note only, no AC group," consistent with how the License Management
   Roadmap note is handled in §3's existing prose).
3. **Not-Yet-Testable Summary (§20)** gained a note explaining why the PRD §10 NFR
   backlog areas are not rows in that table (no PRD Traceability ID for ten of the
   eleven areas) and pointing to the new §19.9 instead.
4. **Acceptance Criteria Review Checklist (§21)** gained a new checklist item
   confirming the PRD §10 / Design §16A / Prototype §25A NFR backlog is explicitly
   acknowledged rather than silently absent.
5. Version citations in the document header were updated from Prototype v0.5 / Design
   v0.7 to Prototype v0.6 / Design v0.8 (PRD unchanged at v0.9). No other AC group
   required correction — all existing AC groups (Login through AI-Doc-004, and the
   License Management Roadmap-only note) were checked against the corresponding
   Prototype v0.6 sections and found unchanged in substance since v0.5, since Prototype
   v0.6's only content change was the addition of §25A itself (no screen, flow, or
   requirement was added, removed, or altered).

**Change Log — v0.3 → v0.4 (2026-08-21):**

1. **`RAISE-FR-MAINT-001` 4-stage workflow criteria added.** Prototype v0.5 §15
   confirmed the 4-stage maintenance-request workflow (User Requisition → Dept
   Approval (Delegated) → IT Dispatch → Technician Execution) and its state model
   (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD →
   DONE`) as business-confirmed (PRD §16 Resolved Question 33; Design §5.1). AC-MAINT-001
   (§12) was expanded from two record-list criteria to include seven new
   stage-transition criteria (AC-MAINT-001-03..09), covering each of the four stages and
   the overall progress-indicator display. SLA per stage, the vendor model, the cost
   model, and delegated-approver configuration rules remain **NOT TESTABLE YET**, and
   the new criteria's dependency on `RAISE-NFR-SEC-RBAC-001` (for who may perform each
   stage action) is flagged without inventing a role list. The AC Index (§3) and
   Not-Yet-Testable Summary (§20) were updated accordingly.
2. **License Management (P-016/P-017) — confirmed Roadmap-only, no AC group written.**
   Prototype v0.5 §22/§23 add dedicated screens for `RAISE-FR-LICENSE-001`, but PRD
   v0.9 §6/§13/§17 confirm this requirement as Enterprise Roadmap, not MVP. Consistent
   with this document's own checklist rule that Roadmap/Pilot capabilities get no MVP
   acceptance criteria, a traceability note (not a full AC group) was added after the
   AC Index (§3) recording that no AC-LICENSE-001 group exists and why.
3. **RBAC-related criteria reviewed against the confirmed MVP enforcement level.**
   Prototype v0.5 (§4, §7, §9) records that `RAISE-NFR-SEC-RBAC-001`'s MVP enforcement
   level is confirmed as UI-only/client-side, with backend enforcement deferred to
   Enterprise Roadmap (PRD §16 Resolved Question 38) — a decision about *where*
   enforcement happens, not *what* the roles/permissions are. AC-LOGIN (§4) and
   AC-OPS-002 (§11) NOT TESTABLE YET notes were expanded to cite this confirmation
   explicitly while continuing to treat the role list/permission matrix (PRD §16 Q22)
   as unresolved; no role model was invented. A corresponding note was added to the new
   AC-MAINT-001 stage-transition criteria (§12) and to the Not-Yet-Testable Summary
   (§20).
4. **AC-ORACLE-001 checked against the "Phase 6" label clarification — no drift
   found.** Design §6.4 clarifies "Phase 6" as a stale code-comment label, not a PRD
   phase, and leaves `ReconciliationPage`'s mapping to `RAISE-FR-ORACLE-001` as an open
   question (PRD Open Question 10a). AC-ORACLE-001 (§14) never referenced "Phase 6" or
   `ReconciliationPage`; a clarifying note was added confirming this and stating that no
   such mapping is assumed.
5. Version citations in the document header and screen-index cross-references were
   updated from Prototype v0.3 / PRD v0.3 / Design v0.4 to Prototype v0.5 / PRD v0.9 /
   Design v0.7. No other AC group required a correction — the Asset/Ops/Warranty/Alert/
   Audit/Executive/AI-Search/AI-Doc groups were checked against the corresponding
   Prototype v0.5 sections and found unchanged in substance since v0.3.

**Change Log — v0.2 → v0.3 (2026-08-21):**

1. **Utilization NOT TESTABLE YET notes updated from "undefined" to "partially
   resolved."** Prototype v0.3 §8 and §20 changed their Utilization callouts from
   "Open ambiguity" to "Resolved" (assignment-time-based definition, PRD v0.3 §16
   Resolved Question 27; Design v0.4 §13). AC-DASH (§5) and AC-EXEC-001 (§17) were
   updated in place: AC-DASH-01 and AC-EXEC-001-01 are now **testable** for tile
   presence plus the confirmed definition; calculation mechanics (formula,
   exclusions, aggregation window/granularity) remain a narrower **NOT TESTABLE
   YET** item, not a full block on the criterion. The Not-Yet-Testable Summary
   (§20) was updated to reflect this partial resolution.
2. **New AC groups added for `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004`.** Prototype
   v0.3 §5 (Screen Inventory) and §23 (AI Scope Boundary) corrected the prior
   "these four capabilities have no dedicated Traceability ID" statement — PRD v0.3
   §16 Resolved Question 28 assigned each its own ID at P0/MVP, mapped by Prototype
   §5/§9/§10/§11 onto existing screens (P-003, P-004, P-005) as **incidental**
   elements, not a new screen. The prior v0.2 "§19.5 AC Scope Boundary Note" (a
   non-testable traceability note) has been replaced with four dedicated,
   traceable AC groups — §19.5 AC-AI-DOC-001 (P-004), §19.6 AC-AI-DOC-002 (P-004),
   §19.7 AC-AI-DOC-003 (P-005), §19.8 AC-AI-DOC-004 (P-003) — each containing a
   single criterion marked **NOT TESTABLE YET at the criterion level**, since the
   Prototype describes only a reserved screen location (and, for Classification/
   Duplicate Detection, an illustrative "e.g." example), not a confirmed UI element
   or business rule. The AC Index (§3) and Not-Yet-Testable Summary (§20) were
   updated accordingly (four new rows each; the stale "traceability gap" note in
   §20 was replaced with a note marking it resolved).

No other screen changes were found in Prototype v0.3; no existing criterion beyond
the two items above required correction.

**Status:** Draft for Acceptance Review
**Source:** [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.13, [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.14, [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.12
**Reference:** VERSCAN only
**Next Action:** Review the v0.11 update (AC-OPS-002 §11 expanded for the IT Hardware
Assignment Approval Workflow category-scoped exception, PRD §16 Resolved Question 43)
and resolve remaining blocking Open Questions (§20) before Test Plan.
`RAISE-TEST-PLAN.md` / `RAISE-TEST-CASES.md` should be checked next for the same drift,
in particular whether they need new test cases for AC-OPS-002-04..09 (IT Hardware
4-stage approval workflow) alongside the already-noted AC-WARRANTY-001-04/-05/-06
(P-018 Settings) and AC-MAINT-001-03..09 stage-transition coverage checks, and whether
they need an equivalent NFR-backlog acknowledgment note of their own.
