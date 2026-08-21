# RAISE Prototype Specification

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Prototype Specification
**Version:** 0.3 Draft
**Status:** Draft for Prototype Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.3 + [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.4 (§23 Prototype Preparation, §9A Document Intelligence Capabilities)
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

This document defines the first UX/UI prototype scope for RAISE, expanding the
screen-group proposal from [`RAISE-DESIGN.md` §23](../02-design/RAISE-DESIGN.md#23-prototype-preparation)
into full per-screen specs.

The prototype is intended to validate:

- User journeys
- Information architecture
- Navigation
- Asset workflows
- Executive dashboard concept
- AI natural-language search concept
- Data relationships
- MVP boundaries

The prototype is **not** the final UI implementation and does not define
technology.

---

# 2. Prototype Principles

## 2.1 PRD → Design → Prototype

```text
RAISE-PRD.md
     ↓
RAISE-DESIGN.md
     ↓
RAISE-PROTOTYPE
```

Every mandatory prototype screen must trace to a PRD requirement.

## 2.2 VERSCAN is Reference Only

VERSCAN may be consulted for UX patterns, but no VERSCAN feature is
automatically included.

```text
VERSCAN
   ↓
UX Reference
   ↓
Compare with RAISE PRD
   ↓
Use only when justified
```

## 2.3 MVP First

The first prototype should focus on Phase 1 MVP:

- Asset Registry
- Category & Hierarchy
- Custody History
- QR / Barcode
- Check-in / Check-out
- Maintenance
- Warranty
- Oracle FA Integration
- NBV / Depreciation
- Alerts
- Immutable Audit Log

AI capabilities must follow the status in the PRD. Roadmap capabilities
should be visually separated from MVP.

---

# 3. Prototype Information Architecture

```text
RAISE
│
├── Dashboard
│
├── Assets
│   ├── Asset Registry
│   ├── Asset Detail
│   ├── Category & Hierarchy
│   └── Custody History
│
├── Operations
│   ├── Scan QR / Barcode
│   ├── Check-in
│   ├── Check-out
│   └── Transfer / Custody
│
├── Maintenance
│   ├── Maintenance Records
│   └── Maintenance History
│
├── Warranty
│   ├── Warranty Overview
│   └── Warranty Detail
│
├── Finance
│   ├── Oracle FA
│   └── NBV / Depreciation
│
├── Alerts
│
├── Audit
│   └── Audit Log
│
└── AI Assistant
    └── Natural Language Search
```

**Note:** This is a prototype information architecture. Final navigation
requires design review.

---

# 4. User Roles

The PRD identifies:

| Role | Prototype Focus |
|---|---|
| IT Asset | Asset operations and lifecycle |
| Finance | Oracle FA / NBV / Depreciation |
| Executive | KPI and asset intelligence |
| Auditor | History and traceability |

Role-specific access behavior is still subject to Security Design
(PRD §11 Security & RBAC).

---

# 5. Screen Inventory

| ID | Screen | Priority | Requirement |
|---|---|---|---|
| P-001 | Login / Access | P0 | Security Design (TBD) |
| P-002 | Main Dashboard | P0 | Product / Dashboard |
| P-003 | Asset Registry | P0 | RAISE-FR-ASSET-001; incidental RAISE-AI-DOC-004 (Duplicate Detection) |
| P-004 | Asset Detail | P0 | RAISE-FR-ASSET-001, RAISE-FR-LIFE-001; incidental RAISE-AI-DOC-001 (OCR/Extraction), RAISE-AI-DOC-002 (Metadata) |
| P-005 | Category & Hierarchy | P0 | RAISE-FR-ASSET-002; incidental RAISE-AI-DOC-003 (Classification) |
| P-006 | Custody History | P0 | RAISE-FR-ASSET-003 |
| P-007 | QR / Barcode Scan | P0 | RAISE-FR-OPS-001 |
| P-008 | Check-in / Check-out | P0 | RAISE-FR-OPS-002 |
| P-009 | Maintenance | P0 | RAISE-FR-MAINT-001 |
| P-010 | Warranty | P0 | RAISE-FR-WARRANTY-001 |
| P-011 | Oracle FA / Financial View | P0 | RAISE-FR-ORACLE-001 |
| P-012 | Alerts | P0 | RAISE-FR-ALERT-001 |
| P-013 | Audit Log | P0 | RAISE-FR-AUDIT-001 |
| P-014 | Executive Dashboard | P0 | RAISE-FR-EXEC-001 |
| P-015 | AI Assistant | P0 / Current AI | RAISE-AI-SEARCH-001 |

Risk Scoring, Lifecycle Prediction and AI Recommendation should be
treated as Pilot / Roadmap prototype areas unless separately approved
(PRD §7 AI Requirements).

**Mapping to Design §23 screen groups:** the 12 groups listed in the design
document (Login, Asset Dashboard, Asset Registry, Asset Detail, QR/Barcode,
Check-in/Check-out, Maintenance, Warranty, Oracle/Financial, Audit, Executive,
AI Search) expand to 15 screens here because Asset Registry/Detail is split
further into Registry (P-003), Detail (P-004), Category (P-005), and Custody
(P-006) to match the four distinct PRD requirements (`RAISE-FR-ASSET-001/002/003`)
that Design §4.1/§4.2 assigns to that area. No screen was added beyond what
Design and the PRD already require.

**Mapping `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` (PRD v0.3, confirmed P0/MVP
2026-08-21) — no new screen added:** PRD v0.3 gave these four "Current" AI
capabilities (OCR/Extraction, Metadata, Classification, Duplicate Detection)
their own Traceability IDs, and Design v0.4 §9A documents them as a
**"design-convenience grouping only"** rather than a dedicated screen — Design
§23 (Prototype Preparation) still lists the same 12 screen groups as v0.3, with
no 13th group added for Document Intelligence. Consistent with that, this
prototype does **not** introduce a new P-NNN screen for these four
requirements. Instead, each requirement's effect is represented as an
incidental element of an existing screen it is closest to per Design §9A's
conceptual flow (Extraction → Metadata → Classification → Duplicate Detection
→ Associate with Asset record):

- `RAISE-AI-DOC-001` (OCR/Extraction) and `RAISE-AI-DOC-002` (Metadata) →
  represented on **P-004 Asset Detail** (extracted/tagged field display).
- `RAISE-AI-DOC-003` (Classification) → represented on **P-005 Category &
  Hierarchy** (whether classification assigns or only suggests a category
  value is still TBD per PRD §7 / Design §9A).
- `RAISE-AI-DOC-004` (Duplicate Detection) → represented on **P-003 Asset
  Registry** (flagged/merged duplicate records).

This mapping is a **prototype design choice**, not a PRD-mandated screen
split — per Design §9A the four capabilities have no PRD-defined execution
order or UI location, so a future design pass could relocate them without
changing PRD scope. All four remain **P0/MVP requirements with no defined
acceptance behavior (TBD)** — see PRD §7 and Design §9A "Design Notes and TBD
Items" — so the elements described on P-003/P-004/P-005 below are
placeholders only, not confirmed UI.

---

# 6. Global Layout

Conceptual desktop layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ RAISE                    Search / AI Search        User      │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Dashboard     │                                              │
│ Assets        │                Main Content                   │
│ Operations    │                                              │
│ Maintenance   │                                              │
│ Warranty      │                                              │
│ Finance       │                                              │
│ Alerts        │                                              │
│ Audit         │                                              │
│ AI Assistant  │                                              │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

The final visual style is intentionally not prescribed yet.

---

# 7. P-001 Login / Access

## Purpose

Provide the entry point to the platform.

## Prototype Elements

- Username / identity
- Authentication action
- Error state
- Access-denied state

## Traceability

Security requirements are identified in the PRD (§11 Security & RBAC) but the
authentication mechanism remains TBD.

Therefore this screen validates the user journey only.

---

# 8. P-002 Main Dashboard

## Purpose

Provide an overview of asset information.

## Proposed Sections

```text
┌─────────────────────────────────────────────────────────────┐
│ Asset Overview                                              │
├────────────┬────────────┬────────────┬──────────────────────┤
│ Total      │ NBV        │ Risk       │ Warranty Expiry      │
│ Assets     │            │            │                      │
├────────────┴────────────┴────────────┴──────────────────────┤
│ Asset by Category                                           │
├─────────────────────────────────────────────────────────────┤
│ Lifecycle / Maintenance Overview                            │
├─────────────────────────────────────────────────────────────┤
│ Recent Alerts                                               │
└─────────────────────────────────────────────────────────────┘
```

Only KPI concepts explicitly identified by the PRD should be treated as
approved:

- NBV
- Risk
- Utilization

Other dashboard elements are prototype exploration and require review.

**Utilization — Resolved 2026-08-21 (PRD v0.3 §16 Resolved Question 27;
Design v0.4 §13):** ~~"Utilization" is listed as a KPI with no definition in
the PRD~~. Business confirmed the definition as **assignment-time-based**:

> Utilization = % of time an asset is assigned to a user/department,
> relative to total available time.

This tile should be read against that definition. Calculation mechanics (how
"assigned" state/time is measured against Custody, what "total available
time" excludes, and aggregation window/granularity) remain **TBD** — this
prototype shows the tile as a labeled placeholder only, with no formula
implemented. NBV and Risk KPI formulas remain unresolved. See
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#8-executive-intelligence) §8
and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence).

---

# 9. P-003 Asset Registry

## Purpose

Provide the central asset list.

## Main Elements

- Search
- Filter
- Category
- Asset identifier
- Asset name
- Status
- Holder
- Warranty status
- Maintenance status

## User Flow

```text
Asset Registry
      │
      ├── Search
      ├── Filter
      └── Select Asset
               ↓
          Asset Detail
```

## Traceability

`RAISE-FR-ASSET-001`

**Incidental: `RAISE-AI-DOC-004` (Duplicate Detection, PRD v0.3, P0/MVP,
confirmed 2026-08-21):** per §5's mapping note, flagged/merged duplicate
records may surface in this list (e.g., a "possible duplicate" indicator on a
row). Matching criteria/threshold and the resolution workflow (auto-merge vs.
flag-for-review) are **TBD** per PRD §7 / Design §9A — no such logic is
implemented or assumed in this prototype; this note only reserves the screen
location for when that behavior is defined.

---

# 10. P-004 Asset Detail

## Purpose

Provide the consolidated view of one asset.

## Proposed Sections

```text
Asset Detail
│
├── Basic Information
├── Category
├── Custody
├── Financial
├── Warranty
├── Maintenance
├── QR / Barcode
├── Lifecycle
└── Audit / History
```

## Prototype Principle

The screen should demonstrate RAISE's central concept:

> One asset → connected information across its lifecycle.

## Traceability

`RAISE-FR-ASSET-001`, `RAISE-FR-LIFE-001` (the Lifecycle section demonstrates asset
lifecycle connectivity — Design §4.1 assigns `RAISE-FR-LIFE-001` to the Asset Management
area alongside `RAISE-FR-ASSET-001`/`002`; Design §24 traces it to the "Lifecycle" design
area specifically. No separate P-NNN screen is created for it — it is realized here plus
across Custody (P-006), Maintenance (P-009), Warranty (P-010), and Audit (P-013), which
together represent the lifecycle stages per Design §4.2's conceptual state diagram.)

**Disposal explicitly excluded:** Design §4.2's conceptual state diagram keeps Disposal as
the terminal lifecycle stage, but PRD §14 (Enterprise Roadmap, item 7) and PRD §16
Resolved Questions #26 confirm Disposal is **Enterprise Roadmap, not MVP** (resolved
2026-08-21). No Disposal section, state, or action is included on this screen (or on
P-006/P-009/P-010/P-013) — this Lifecycle section stops at Audit/History, matching the
non-Disposal MVP scope. A Disposal screen/flow should only be added if Roadmap item 7 is
later promoted to MVP through product requirement review.

**Incidental: `RAISE-AI-DOC-001` and `RAISE-AI-DOC-002` (OCR/Extraction,
Metadata, PRD v0.3, P0/MVP, confirmed 2026-08-21):** per §5's mapping note,
fields extracted from source documents (`RAISE-AI-DOC-001`) and any generated
metadata/tags (`RAISE-AI-DOC-002`) would be surfaced within the Basic
Information / Financial sections above. Which document types, which fields,
accuracy threshold, and which metadata fields/tags are generated are all
**TBD** per PRD §7 / Design §9A — no extraction or metadata logic is
implemented or assumed in this prototype; this note only reserves the screen
location for when that behavior is defined.

---

# 11. P-005 Category & Hierarchy

## Purpose

Show asset categories and hierarchy.

## Prototype

```text
Category
│
├── Computer
│   ├── Notebook
│   └── Desktop
│
├── Network
│   ├── Switch
│   └── Router
│
└── Other
```

The actual hierarchy is TBD and must not be treated as finalized
business data.

## Traceability

`RAISE-FR-ASSET-002`

**Incidental: `RAISE-AI-DOC-003` (Classification, PRD v0.3, P0/MVP, confirmed
2026-08-21):** per §5's mapping note, an AI-suggested or AI-assigned category
value could surface on this screen (e.g., a "suggested category" indicator on
an uncategorized asset). Whether this capability assigns category values
directly or only suggests them for human confirmation is **TBD** per PRD §7 /
Design §9A — no such logic is implemented or assumed in this prototype; this
note only reserves the screen location for when that behavior is defined.

---

# 12. P-006 Custody History

## Purpose

Show who/what has held an asset and its historical custody.

## Prototype

```text
Asset: RAISE-XXXX

Current Holder
└── Current Assignment

History
────────────────────────────────────
Date       Holder       Action
────────────────────────────────────
Date A     Holder A     Assigned
Date B     Holder B     Transferred
Date C     Holder C     Assigned
```

## Traceability

`RAISE-FR-ASSET-003`

**Open ambiguity (carried from PRD Pre-Finalization Quality Pass / Design §4.2):** it is
not defined whether this history table records only Check-in/Check-out events
(`RAISE-FR-OPS-002`, see P-008) or also other custody-changing events (e.g., direct
reassignment). The prototype shows a generic "Action" column (Assigned/Transferred) to
stay neutral pending that business confirmation — it must not be read as confirming that
only Check-in/Check-out writes custody history. See
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#duplicated--overlapping-requirements)
and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#42-custody--asset-operations).

---

# 13. P-007 QR / Barcode Scan

## Purpose

Identify an asset using QR / Barcode.

## Flow

```text
Scan
 ↓
Identify Asset
 ↓
Asset Found?
 ├── Yes → Asset Detail
 └── No  → Not Found / Retry
```

## Prototype States

- Camera / scanner placeholder
- Scan success
- Asset not found
- Invalid code
- Retry

## Reference Note

VERSCAN demonstrates an existing QR/Barcode workflow — **reference only** for
UX exploration per PRD §15 VERSCAN Reference Policy; no VERSCAN-specific
feature is included here beyond what RAISE-FR-OPS-001 requires.

## Traceability

`RAISE-FR-OPS-001`

---

# 14. P-008 Check-in / Check-out

## Purpose

Support asset custody operations.

## Check-out

```text
Select Asset
   ↓
Select / Identify Holder
   ↓
Confirm
   ↓
Asset State Updated
   ↓
Audit Event
```

## Check-in

```text
Identify Asset
   ↓
Confirm Return
   ↓
Update Custody
   ↓
Audit Event
```

Exact approval rules and exception handling remain TBD.

## Traceability

`RAISE-FR-OPS-002`

---

# 15. P-009 Maintenance

## Purpose

Show maintenance information associated with an asset.

## Prototype

```text
Maintenance
────────────────────────────────────
Asset
Date
Event
Status
Cost

History
────────────────────────────────────
Date | Event | Status | Cost
```

The fields are conceptual because the PRD does not finalize the
maintenance schema.

## Traceability

`RAISE-FR-MAINT-001`

---

# 16. P-010 Warranty

## Purpose

Track warranty information.

## Prototype

```text
Warranty
────────────────────────────
Asset
Start Date
End Date
Status

Warranty Timeline
────────────────────────────
Active / Expiring / Expired
```

## Example RAISE Use Case

The prototype should demonstrate the ability to identify assets
approaching warranty expiry.

Example:

```text
Warranty expires within 90 days
        ↓
List affected assets
        ↓
Open Asset Detail
```

This reflects the RAISE business example without implementing AI
Recommendation.

## Traceability

`RAISE-FR-WARRANTY-001`

---

# 17. P-011 Oracle FA / Financial View

## Purpose

Show financial information associated with an asset.

## Prototype

```text
Financial Information
────────────────────────────
Asset Number
Acquisition Information
NBV
Depreciation
Oracle Source
Synchronization Status
```

## Integration State

The prototype should visually support:

- Data available
- Data unavailable
- Sync / import error
- Data conflict

The actual integration mechanism remains TBD.

## Traceability

`RAISE-FR-ORACLE-001`

---

# 18. P-012 Alerts

## Purpose

Display relevant asset alerts.

## Prototype

```text
Alerts
──────────────────────────────────────────────
Severity   Alert                  Asset
──────────────────────────────────────────────
High       Warranty Expiring     Asset A
Medium     Maintenance Due       Asset B
```

Exact MVP alert rules are TBD.

Email / Teams / LINE Notify should not be represented as mandatory MVP
delivery channels because they are roadmap capabilities.

## Traceability

`RAISE-FR-ALERT-001`

---

# 19. P-013 Audit Log

## Purpose

Provide traceability of important activities.

## Prototype

```text
Audit Log
─────────────────────────────────────────────
Time       Actor     Action       Entity
─────────────────────────────────────────────
10:00      User A    Check-out    Asset A
10:05      User B    Update       Asset B
```

Potential attributes shown in the design:

- Actor
- Timestamp
- Action
- Entity
- Before / After
- Source
- Result

These are design candidates and must be confirmed.

## Traceability

`RAISE-FR-AUDIT-001`

---

# 20. P-014 Executive Dashboard

## Purpose

Provide an organization-level executive view.

## Prototype

```text
┌─────────────────────────────────────────────┐
│ EXECUTIVE ASSET INTELLIGENCE                │
├────────────┬────────────┬───────────────────┤
│ NBV        │ Risk       │ Utilization       │
├────────────┴────────────┴───────────────────┤
│                                             │
│ Asset Overview                              │
│                                             │
├─────────────────────────────────────────────┤
│ Executive Summary                           │
│                                             │
└─────────────────────────────────────────────┘
```

## Approved KPI Concepts

- NBV
- Risk
- Utilization

Final KPI formulas and thresholds remain TBD.

**Utilization — Resolved 2026-08-21 (PRD v0.3 §16 Resolved Question 27;
Design v0.4 §13):** ~~the PRD lists "Utilization" as a KPI with no
definition~~. Business confirmed the definition as **assignment-time-based**:

> Utilization = % of time an asset is assigned to a user/department,
> relative to total available time.

This dashboard's "Utilization" tile should be read against that definition.
Calculation mechanics (how "assigned" state/time is measured against the
Custody domain, what "total available time" excludes, and the aggregation
window/granularity) remain **design-phase TBD** — this prototype still shows
"Utilization" as a **placeholder KPI tile** with no formula, threshold, or
calculation logic implemented. Acceptance Criteria can now define a testable
*conceptual* value (assignment-time percentage) for this tile, but the exact
threshold/formula still requires further design input before test values can
be finalized. NBV and Risk KPI formulas remain unresolved and open — see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions) §16 Q3,
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#8-executive-intelligence) §8,
and [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence).

## Traceability

`RAISE-FR-EXEC-001`

---

# 21. P-015 AI Assistant

## Purpose

Demonstrate RAISE's AI Intelligence concept using Natural Language
Search.

## Prototype

```text
┌──────────────────────────────────────────────────────┐
│ Ask RAISE                                             │
│                                                      │
│ "Which notebooks expire within 90 days?"             │
│                                                      │
│ [ Ask ]                                              │
├──────────────────────────────────────────────────────┤
│ Answer                                               │
│                                                      │
│ Affected Assets: XX                                  │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Asset | Warranty | Age | Maintenance | Status    │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ Sources / Data Used                                  │
│ - Asset                                              │
│ - Warranty                                           │
│ - Maintenance                                        │
│ - Financial data                                     │
└──────────────────────────────────────────────────────┘
```

## AI Flow

```text
User Question
      ↓
Intent Understanding
      ↓
Data Retrieval
      ↓
Source Validation
      ↓
Answer
      ↓
Source Context
```

This follows the RAISE Design (§8, §9) and the PRD requirement for Natural
Language Search.

## Traceability

`RAISE-AI-SEARCH-001`

---

# 22. AI Response States

The prototype should include:

### Success

```text
Answer + Relevant Data + Source Context
```

### No Data

```text
No matching assets were found.
```

### Unable to Answer

```text
RAISE could not answer from the available data.
```

### Source Unavailable

```text
Some source data is currently unavailable.
```

### Data Conflict

```text
Conflicting information was found.
Please review the source records.
```

These states reflect the Design error-handling principles (Design §20 Error
Handling Principles) and must be validated before implementation.

---

# 23. AI Scope Boundary

## Prototype Now

The first AI prototype should focus on:

**Natural Language Search**

The PRD classifies:

- OCR / Extraction — Current
- Metadata — Current
- Classification — Current
- Duplicate Detection — Current
- Natural Language Search — Current

Risk Scoring and Lifecycle Prediction are Pilot capabilities.

AI Recommendation is Roadmap.

Therefore the prototype should not present Recommendation as an approved
MVP feature.

**Traceability note (updated 2026-08-21 — supersedes prior v0.2 wording):**
~~OCR/Extraction, Metadata, Classification, and Duplicate Detection have no
dedicated Traceability ID or requirement field set of their own in the
PRD~~. **This is now stale.** PRD v0.3 (§16 Resolved Question 28, confirmed
2026-08-21) gave each of the four capabilities its own Traceability ID at
**Priority P0 / Scope MVP**, matching `RAISE-AI-SEARCH-001`'s treatment as a
"Current" capability:

- `RAISE-AI-DOC-001` — OCR / Extraction
- `RAISE-AI-DOC-002` — Metadata
- `RAISE-AI-DOC-003` — Classification
- `RAISE-AI-DOC-004` — Duplicate Detection

Design v0.4 §9A documents these four under "Document Intelligence
Capabilities" but explicitly frames their sequencing/grouping as a
**"design-convenience grouping only,"** not a dedicated screen — Design §23
(Prototype Preparation) still lists the same 12 screen groups as before, with
no 13th group added. Consistent with that, this prototype still does **not**
create a separate P-NNN screen for these four requirements. Instead — per the
mapping note added to §5 (Screen Inventory) and the "Incidental" traceability
notes now added to P-003 (Duplicate Detection), P-004 (OCR/Extraction,
Metadata), and P-005 (Classification) — each requirement is represented as an
incidental element of an existing screen, reserving a location for the
behavior without inventing acceptance detail the PRD does not yet define.
Detailed acceptance behavior, document/field scope, and thresholds for all
four remain **TBD** (PRD §7; Design §9A "Design Notes and TBD Items") and must
not be treated as fully specified until business/design input resolves them.

---

# 24. Core Prototype User Flows

## Flow A — Find Asset

```text
Dashboard
 ↓
Asset Registry
 ↓
Search / Filter
 ↓
Asset Detail
```

Requirements:

`RAISE-FR-ASSET-001`

---

## Flow B — Scan Asset

```text
Dashboard
 ↓
QR / Barcode
 ↓
Scan
 ↓
Asset Detail
```

Requirement:

`RAISE-FR-OPS-001`

---

## Flow C — Check-out

```text
Asset Detail
 ↓
Check-out
 ↓
Holder
 ↓
Confirm
 ↓
Custody Updated
 ↓
Audit Log
```

Requirements:

- `RAISE-FR-OPS-002`
- `RAISE-FR-ASSET-003`
- `RAISE-FR-AUDIT-001`

---

## Flow D — Warranty

```text
Dashboard
 ↓
Warranty
 ↓
Expiring Assets
 ↓
Asset Detail
 ↓
Maintenance / Financial Context
```

Requirement:

`RAISE-FR-WARRANTY-001`

---

## Flow E — Finance

```text
Asset Detail
 ↓
Financial
 ↓
Oracle FA
 ↓
NBV / Depreciation
```

Requirement:

`RAISE-FR-ORACLE-001`

---

## Flow F — Executive

```text
Executive Dashboard
 ↓
KPI
 ↓
Asset Overview
 ↓
Executive Summary
```

Requirement:

`RAISE-FR-EXEC-001`

---

## Flow G — Ask RAISE

```text
AI Assistant
 ↓
Natural Language Question
 ↓
Retrieve Asset Context
 ↓
Answer
 ↓
Source Context
```

Requirement:

`RAISE-AI-SEARCH-001`

---

# 25. Prototype Traceability Matrix

| Prototype | Requirement | Status |
|---|---|---|
| P-003 Asset Registry | RAISE-FR-ASSET-001 | Planned |
| P-004 Asset Detail | RAISE-FR-LIFE-001 | Planned |
| P-005 Category | RAISE-FR-ASSET-002 | Planned |
| P-006 Custody | RAISE-FR-ASSET-003 | Planned |
| P-007 QR / Barcode | RAISE-FR-OPS-001 | Planned |
| P-008 Check-in / Check-out | RAISE-FR-OPS-002 | Planned |
| P-009 Maintenance | RAISE-FR-MAINT-001 | Planned |
| P-010 Warranty | RAISE-FR-WARRANTY-001 | Planned |
| P-011 Oracle FA | RAISE-FR-ORACLE-001 | Planned |
| P-012 Alerts | RAISE-FR-ALERT-001 | Planned |
| P-013 Audit | RAISE-FR-AUDIT-001 | Planned |
| P-014 Executive | RAISE-FR-EXEC-001 | Planned |
| P-015 AI Assistant | RAISE-AI-SEARCH-001 | Planned |
| P-004 Asset Detail (incidental) | RAISE-AI-DOC-001 (OCR / Extraction) | Planned — no dedicated screen; TBD acceptance behavior |
| P-004 Asset Detail (incidental) | RAISE-AI-DOC-002 (Metadata) | Planned — no dedicated screen; TBD acceptance behavior |
| P-005 Category & Hierarchy (incidental) | RAISE-AI-DOC-003 (Classification) | Planned — no dedicated screen; TBD acceptance behavior |
| P-003 Asset Registry (incidental) | RAISE-AI-DOC-004 (Duplicate Detection) | Planned — no dedicated screen; TBD acceptance behavior |

**Cross-check against [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) §17 (PRD v0.3):**
every row's requirement ID exists in the PRD's Requirement Traceability Matrix, and every
P0/MVP requirement in that matrix now has at least one row here — including
`RAISE-AI-DOC-001` through `RAISE-AI-DOC-004`, added 2026-08-21 following PRD v0.3 §16
Resolved Question 28 and Design v0.4 §9A/§24. Per Design §9A's "design-convenience
grouping only" framing, these four are recorded against the existing screen each is
mapped to (§5's mapping note), not a new P-NNN screen, and their Status is marked
"Planned — no dedicated screen; TBD acceptance behavior" to distinguish them from
requirements with a dedicated screen and defined acceptance criteria. This resolves,
at the prototype layer, the "Pending — awaiting downstream sync" status that PRD §17
recorded for these four requirements' Prototype column. P-001 (Login) and P-002 (Main
Dashboard) are intentionally excluded from this table — they trace to Security Design
(TBD, PRD §11) and general product navigation respectively, not to a single numbered PRD
requirement, consistent with how the source table treats them. `RAISE-NFR-SEC-RBAC-001`
is also intentionally excluded — its Priority/Scope are TBD (not P0/MVP) in PRD §17, and
Design §24 likewise omits it from the design-area table, covering it structurally under
Design §16 Security Architecture instead; P-001 Login references it narratively without a
formal traceability row, matching that treatment. `RAISE-FR-LIFE-001` (P0, MVP, APPROVED
in PRD §17) is added as a row against P-004 Asset Detail — previously missing from this
matrix despite being a P0/MVP requirement; see P-004's Traceability note for how it is
realized across P-004/P-006/P-009/P-010/P-013 collectively.

---

# 26. Prototype Review Checklist

Before moving to Acceptance Criteria:

- [ ] All P0 MVP requirements have prototype coverage
- [ ] User journeys are understandable
- [ ] Asset lifecycle is represented
- [ ] Custody history is represented
- [ ] QR / Barcode flow is represented
- [ ] Maintenance and Warranty are represented
- [ ] Oracle / NBV / Depreciation context is represented
- [ ] Audit traceability is represented
- [ ] Executive KPI concept is represented
- [ ] Natural Language Search is represented
- [ ] AI source context is represented
- [ ] Error states are represented
- [ ] Roadmap features are clearly separated
- [ ] No VERSCAN-only feature was silently added
- [ ] Every mandatory screen has a requirement ID

---

# 27. Prototype Deliverable Structure

Recommended project structure:

```text
docs/
├── 01-requirements/
│   └── RAISE-PRD.md
│
├── 02-design/
│   └── RAISE-DESIGN.md
│
└── 03-prototype/
    └── RAISE-PROTOTYPE.md
```

If a visual prototype is created later:

```text
03-prototype/
├── RAISE-PROTOTYPE.md
├── user-flows/
├── screens/
└── assets/
```

---

# 28. Next Step

After prototype review:

```text
RAISE-PRD.md
      ↓
RAISE-DESIGN.md
      ↓
RAISE-PROTOTYPE.md       ← Current
      ↓
RAISE-ACCEPTANCE-CRITERIA.md
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

The next artifact should be **Acceptance Criteria**, not source code.

---

## Document Status

**Version:** 0.3 (re-verified against RAISE-PRD.md v0.3 and RAISE-DESIGN.md v0.4,
2026-08-21 — no new screens created; two synchronization updates applied:)

**Change Log — v0.2 → v0.3 (2026-08-21):**

1. **`RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` traceability update.** PRD v0.3 (§16
   Resolved Question 28) confirmed these four capabilities (OCR/Extraction,
   Metadata, Classification, Duplicate Detection) as P0/MVP requirements with
   their own Traceability IDs, and Design v0.4 added §9A "Document
   Intelligence Capabilities" documenting them as a "design-convenience
   grouping only" (no dedicated screen). §23 AI Scope Boundary's prior
   statement that these four "have no dedicated Traceability ID" is now
   **stale and has been corrected** in place. Rather than adding a 13th
   screen (consistent with Design §23 Prototype Preparation still listing
   only 12 screen groups), each requirement was mapped to the existing
   screen closest to its effect and given an "Incidental" traceability note:
   `RAISE-AI-DOC-001`/`002` → P-004 Asset Detail; `RAISE-AI-DOC-003` → P-005
   Category & Hierarchy; `RAISE-AI-DOC-004` → P-003 Asset Registry. §5 Screen
   Inventory's Requirement column and §25 Prototype Traceability Matrix were
   both updated with these mappings (status: "Planned — no dedicated screen;
   TBD acceptance behavior"). Detailed acceptance behavior for all four
   remains TBD per PRD §7 / Design §9A; no UI logic beyond a placeholder
   location is implemented or assumed.
2. **Utilization KPI callout changed from "Open ambiguity" to "Resolved."**
   PRD v0.3 (§16 Resolved Question 27) and Design v0.4 §13 confirmed
   Utilization as assignment-time-based (% of time an asset is assigned to a
   user/department, relative to total available time). Updated on both
   P-002 Main Dashboard and P-014 Executive Dashboard KPI tile callouts.
   Calculation mechanics, formula, and threshold remain design-phase TBD;
   the tiles remain unimplemented placeholders. NBV and Risk KPI formulas
   remain unresolved/open.

No screen additions or removals were made; no stale requirement references
remain outside the two items above.

**Status:** Draft for Prototype Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.3 + [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.4
**Reference:** VERSCAN only
**Next Action:** Review Prototype Scope and User Flows; downstream
`RAISE-ACCEPTANCE-CRITERIA.md` should be synchronized next to cover
`RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` (as TBD/incidental) and the resolved
Utilization KPI definition.
