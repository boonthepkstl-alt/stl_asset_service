# RAISE Acceptance Criteria

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Acceptance Criteria
**Version:** 0.3 Draft
**Status:** Draft for Acceptance Review
**Source:** [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.3 §25 (Prototype Traceability Matrix) + §5, §7–§23 (per-screen specs / AI Scope Boundary), cross-checked against [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.3 and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.4
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
| [AC-DASH](#5-ac-dash--p-002-main-dashboard) | P-002 | Product / Dashboard | Partially testable |
| [AC-ASSET-001](#6-ac-asset-001--p-003-asset-registry) | P-003 | RAISE-FR-ASSET-001 | Testable |
| [AC-ASSET-001-DETAIL](#7-ac-asset-001-detail--p-004-asset-detail) | P-004 | RAISE-FR-ASSET-001 | Testable |
| [AC-LIFE-001](#75-ac-life-001--asset-lifecycle-connectivity-cross-cutting) | P-004 (Lifecycle section) | RAISE-FR-LIFE-001 | Partially testable |
| [AC-ASSET-002](#8-ac-asset-002--p-005-category--hierarchy) | P-005 | RAISE-FR-ASSET-002 | Partially testable |
| [AC-ASSET-003](#9-ac-asset-003--p-006-custody-history) | P-006 | RAISE-FR-ASSET-003 | Partially testable |
| [AC-OPS-001](#10-ac-ops-001--p-007-qr--barcode-scan) | P-007 | RAISE-FR-OPS-001 | Testable |
| [AC-OPS-002](#11-ac-ops-002--p-008-check-in--check-out) | P-008 | RAISE-FR-OPS-002 | Partially testable |
| [AC-MAINT-001](#12-ac-maint-001--p-009-maintenance) | P-009 | RAISE-FR-MAINT-001 | Partially testable |
| [AC-WARRANTY-001](#13-ac-warranty-001--p-010-warranty) | P-010 | RAISE-FR-WARRANTY-001 | Partially testable |
| [AC-ORACLE-001](#14-ac-oracle-001--p-011-oracle-fa--financial-view) | P-011 | RAISE-FR-ORACLE-001 | Partially testable |
| [AC-ALERT-001](#15-ac-alert-001--p-012-alerts) | P-012 | RAISE-FR-ALERT-001 | Partially testable |
| [AC-AUDIT-001](#16-ac-audit-001--p-013-audit-log) | P-013 | RAISE-FR-AUDIT-001 | Partially testable |
| [AC-EXEC-001](#17-ac-exec-001--p-014-executive-dashboard) | P-014 | RAISE-FR-EXEC-001 | Partially testable |
| [AC-AI-SEARCH-001](#18-ac-ai-search-001--p-015-ai-assistant) | P-015 | RAISE-AI-SEARCH-001 | Partially testable |
| [AC-AI-STATES](#19-ac-ai-states--ai-response-states) | P-015 | RAISE-AI-SEARCH-001 | Testable |
| [AC-AI-DOC-001](#195-ac-ai-doc-001--p-004-asset-detail-incidental--ocr--extraction) | P-004 (incidental) | RAISE-AI-DOC-001 | Not testable yet |
| [AC-AI-DOC-002](#196-ac-ai-doc-002--p-004-asset-detail-incidental--metadata) | P-004 (incidental) | RAISE-AI-DOC-002 | Not testable yet |
| [AC-AI-DOC-003](#197-ac-ai-doc-003--p-005-category--hierarchy-incidental--classification) | P-005 (incidental) | RAISE-AI-DOC-003 | Not testable yet |
| [AC-AI-DOC-004](#198-ac-ai-doc-004--p-003-asset-registry-incidental--duplicate-detection) | P-003 (incidental) | RAISE-AI-DOC-004 | Not testable yet |

"Testable" = every criterion in the group can be verified today from Prototype-defined
behavior. "Partially testable" = at least one criterion is blocked on an Open Question.

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

---

## 5. AC-DASH — P-002 Main Dashboard

**Requirement:** Product / Dashboard (general navigation) · **Screen:** P-002

- **AC-DASH-01** — Given an authenticated user lands on the dashboard,
  when the page loads, then Total Assets, NBV, Risk, and Warranty Expiry
  summary tiles are displayed.
- **AC-DASH-02** — Given asset data exists, when the dashboard loads,
  then an "Asset by Category" view and a "Lifecycle / Maintenance
  Overview" view are displayed.
- **AC-DASH-03** — Given alert data exists, when the dashboard loads,
  then a "Recent Alerts" section is displayed.

**NOT TESTABLE YET:** of the four summary tiles, only NBV, Risk, and
Utilization are PRD-approved KPI concepts (PRD §8.1); "Total Assets" and
"Warranty Expiry" tile behavior, and the exact KPI formulas, are
Prototype-exploration and remain unconfirmed (Prototype §8).

**Utilization — Testable (presence + assignment-time-based definition available),
resolved 2026-08-21:** PRD v0.3 §16 Resolved Question 27 and Design v0.4 §13 confirmed
Utilization's *definition* as **assignment-time-based** (% of time an asset is assigned
to a user/department, relative to total available time) — this is no longer an
undefined concept, per Prototype §8's updated "Resolved 2026-08-21" callout. Accordingly:

- **Testable now:** AC-DASH-01 can be verified for the presence of a tile labeled
  "Utilization," *and* that label can now be checked against the confirmed definition
  above (i.e., a reviewer can confirm the tile is documented/described as an
  assignment-time-based measure, not an arbitrary unlabeled figure).
- **NOT TESTABLE YET (calculation mechanics):** how "assigned" state/time is measured
  against Custody (P-006), what "total available time" excludes, and the aggregation
  window/granularity remain **design-phase TBD** (Prototype §8). No criterion in this
  document asserts a specific numeric value, formula, or threshold the Utilization tile
  must display — that remains blocked pending further design input. See
  [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions) §16 Q3 (partially
  resolved) and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence).

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

- **AC-ASSET-002-01** — Given categories exist, when a user opens
  Category & Hierarchy, then categories are displayed in a parent/child
  hierarchy.
- **AC-ASSET-002-02** — Given an asset is assigned to a category, when
  the user views the Asset Registry or Asset Detail, then the assigned
  category is visible and consistent with the hierarchy view.

**NOT TESTABLE YET:** the final category hierarchy (e.g., Computer >
Notebook/Desktop, Network > Switch/Router) shown in the Prototype spec is
explicitly illustrative, not finalized business data (Prototype §11; PRD
§16 Q — category structure not enumerated as a numbered open question in
the PRD but stated as an open item in RAISE-FR-ASSET-002's Open Question).

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

- **AC-OPS-002-01** — Given an asset is available, when a user with
  appropriate permission selects Check-out and identifies a holder and
  confirms, then the asset's custody state updates to reflect the new
  holder.
- **AC-OPS-002-02** — Given an asset is checked out, when a user
  confirms Check-in / return, then the asset's custody state updates to
  reflect the return.
- **AC-OPS-002-03** — Given a Check-in or Check-out completes
  successfully, when the operation finishes, then a corresponding Audit
  Log entry (AC-AUDIT-001) is created.

**NOT TESTABLE YET:** "appropriate permission" is undefined (no role
model exists — PRD §16 Q12, Q22); approval requirements and exception
handling for Check-in/Check-out are explicitly TBD (Prototype §14; PRD
§16 Q11).

---

## 12. AC-MAINT-001 — P-009 Maintenance

**Requirement:** `RAISE-FR-MAINT-001` · **Screen:** P-009

- **AC-MAINT-001-01** — Given maintenance records exist for an asset,
  when a user opens the Maintenance screen for that asset, then the
  records are displayed with date, event, status, and cost.
- **AC-MAINT-001-02** — Given multiple maintenance records exist for an
  asset, when the Maintenance screen is opened, then a chronological
  maintenance history is shown.

**NOT TESTABLE YET:** the maintenance field model, SLA, vendor model, and
cost model are not finalized in the PRD (PRD §16 Q14; Prototype §15) —
the date/event/status/cost fields above are Prototype-conceptual and
subject to change.

---

## 13. AC-WARRANTY-001 — P-010 Warranty

**Requirement:** `RAISE-FR-WARRANTY-001` · **Screen:** P-010

- **AC-WARRANTY-001-01** — Given an asset has warranty information, when
  a user opens the Warranty screen, then Start Date, End Date, and Status
  are displayed.
- **AC-WARRANTY-001-02** — Given warranty status is Active, Expiring, or
  Expired, when the Warranty screen is opened, then the corresponding
  timeline state is shown.
- **AC-WARRANTY-001-03** — Given an asset's warranty falls within the
  90-day expiry window (the PRD's illustrative business example), when a
  user views the Warranty list, then that asset appears in an
  expiring-assets view that links to its Asset Detail.

**NOT TESTABLE YET:** the required warranty fields beyond Start/End/
Status are undefined (PRD §16 Q15); the exact 90-day rule is an
illustrative example, not a confirmed business rule (PRD §6.7).

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

---

## 15. AC-ALERT-001 — P-012 Alerts

**Requirement:** `RAISE-FR-ALERT-001` · **Screen:** P-012

- **AC-ALERT-001-01** — Given an alert-triggering condition has occurred,
  when an authorized user opens Alerts, then the alert is listed with a
  severity, description, and associated asset.
- **AC-ALERT-001-02** — Given no multi-channel delivery is in MVP scope,
  when Alerts are displayed, then only in-app / on-screen alert
  presentation is verified — Email, Teams, and LINE Notify delivery are
  explicitly out of scope for this criterion (PRD §14 Enterprise
  Roadmap).

**NOT TESTABLE YET:** the exact MVP alert-triggering rules (which
conditions generate which severity) are undefined (PRD §6.9 Open
Question; Prototype §18) — the "Warranty Expiring / High" and
"Maintenance Due / Medium" pairings shown in the Prototype are
illustrative examples only, not confirmed rules. Separately,
AC-ALERT-001-01's "authorized user" gate cannot be fully verified either,
since the role/permission model is undefined (PRD §16 Q22) — this
criterion is testable only for the structural behavior (an alert lists
severity/description/asset when opened), not for whether the correct
roles are actually gated.

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

- **AC-EXEC-001-01** — Given organization-level asset data exists, when
  an Executive user opens the Executive Dashboard, then NBV, Risk, and
  Utilization KPI tiles are displayed.
- **AC-EXEC-001-02** — Given the dashboard is displayed, when the
  Executive views it, then an Asset Overview section and an Executive
  Summary section are present.

**NOT TESTABLE YET:** exact KPI formulas, thresholds, and dashboard
layout are undefined (PRD §16 Q3; Prototype §20); whether the Executive
Summary content is AI-generated (as PRD §8.1 describes) or static is
unresolved per this PRD's own gap analysis.

**Utilization — Testable (presence + assignment-time-based definition available),
resolved 2026-08-21:** PRD v0.3 §16 Resolved Question 27 and Design v0.4 §13 confirmed
Utilization's *definition* as **assignment-time-based** (% of time an asset is assigned
to a user/department, relative to total available time), per Prototype §20's updated
"Resolved 2026-08-21" callout (supersedes the prior "Open ambiguity — Utilization"
wording). Accordingly:

- **Testable now:** AC-EXEC-001-01 can be verified for the presence of a tile labeled
  "Utilization," *and* that the tile is documented/described against the confirmed
  assignment-time-based definition (not an arbitrary unlabeled figure).
- **NOT TESTABLE YET (calculation mechanics):** how "assigned" state/time is measured
  against the Custody domain (P-006), what "total available time" excludes, and the
  aggregation window/granularity remain **design-phase TBD** (Prototype §20). No
  criterion here asserts a specific numeric value, formula, or threshold the
  Utilization tile must show — this remains blocked pending further design input. See
  [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions) §16 Q3 (partially
  resolved) and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence).
  NBV and Risk KPI formulas remain fully unresolved/open (unaffected by this change).

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

## 20. Not-Yet-Testable Summary

The following PRD Open Questions (§16) block full testability of the
criteria above and must be resolved before `RAISE-TEST-PLAN.md` can treat
them as final:

| Open Question | Blocks |
|---|---|
| Q1 Asset master field list | AC-ASSET-001-01..04 |
| Q3 Definition of Utilization | AC-DASH-01, AC-EXEC-001-01 |
| Q4 Definition of Risk | AC-DASH-01, AC-EXEC-001-01 |
| Q6–Q10 Oracle integration design | AC-ORACLE-001-01..04 |
| Q11 Check-in/Check-out workflow | AC-OPS-002-01..02 |
| Q12 Who can assign/transfer an asset | AC-OPS-002-01 |
| Q22 Roles and permissions required | AC-LOGIN-01..03, AC-OPS-002-01, AC-ALERT-001-01, AC-AUDIT-001-03 |
| Q13 Holder data model | AC-ASSET-003-01..03 |
| Custody-writing-events ambiguity (RAISE-FR-ASSET-003 vs. RAISE-FR-OPS-002 — PRD Pre-Finalization Quality Pass, "Duplicated / Overlapping Requirements," needs business confirmation) | AC-ASSET-003-03 (scope note only) |
| Q14 Maintenance fields | AC-MAINT-001-01..02 |
| Q15 Warranty fields | AC-WARRANTY-001-01..03 |
| Q18–Q20 AI citation / confidence / conflict handling | AC-AI-SEARCH-001-02..03 |
| Q21 Authentication mechanism | AC-LOGIN-01..02 |
| Q24–Q25 Audit taxonomy / retention | AC-AUDIT-001-01..02 |
| RAISE-AI-DOC-001 Open Question (document scope / fields / accuracy threshold undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-001-01 |
| RAISE-AI-DOC-002 Open Question (metadata fields/tags / surfacing undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-002-01 |
| RAISE-AI-DOC-003 Open Question (assign-vs-suggest classification behavior undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-003-01 |
| RAISE-AI-DOC-004 Open Question (matching threshold / merge-or-flag workflow undefined — `RAISE-PRD.md` §7) | AC-AI-DOC-004-01 |

No criterion in this document silently resolves these — each affected
criterion above carries its own **NOT TESTABLE YET** note.

**Resolved since last revision:** Q26 (Disposal MVP scope for `RAISE-FR-LIFE-001`) —
confirmed Enterprise Roadmap, not MVP, on 2026-08-21. See §7.5 above and
`RAISE-PRD.md` §16 Resolved Questions. No AC criterion was ever written claiming
disposal behavior, so no criterion needed correction — this only removes the item
from the open-blockers list.

**Resolved since last revision:** Q27 (Utilization KPI definition) — confirmed
assignment-time-based on 2026-08-21 (`RAISE-PRD.md` §16 Resolved Question 27; Design
v0.4 §13). AC-DASH-01 and AC-EXEC-001-01 are now testable for tile presence + the
confirmed definition; only calculation mechanics (formula, exclusions, aggregation
window) remain a separate, narrower NOT TESTABLE YET item under each criterion (see
§5 and §17 above) — this table intentionally does not list AC-DASH-01/AC-EXEC-001-01
as fully blocked any longer, only as partially blocked, per those criteria's own notes.

**Resolved since last revision:** the traceability gap previously noted here — "no
dedicated `RAISE-AI-*` Traceability ID exists for OCR/Extraction, Metadata,
Classification, or Duplicate Detection" — is now stale. PRD v0.3 §16 Resolved Question
28 (2026-08-21) assigned `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` their own Traceability
IDs at P0/MVP. Dedicated AC groups (§19.5–§19.8 above) have been added accordingly.
The underlying acceptance *behavior* for all four remains undefined, which is why the
four rows immediately above this note — not a missing-Traceability-ID note — now
represent the blocker.

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
      Lifecycle Prediction) have no MVP acceptance criteria written here

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

**Version:** 0.3 (re-verified against `RAISE-PROTOTYPE.md` v0.3, 2026-08-21 — two
synchronization updates applied:)

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
**Source:** [`RAISE-PROTOTYPE.md`](../03-prototype/RAISE-PROTOTYPE.md) v0.3, [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.3, [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.4
**Reference:** VERSCAN only
**Next Action:** Review acceptance criteria and resolve blocking Open Questions (§20) before Test Plan
