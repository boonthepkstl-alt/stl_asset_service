# RAISE Prototype Specification

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Prototype Specification
**Version:** 0.6 Draft
**Status:** Draft for Prototype Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.9 + [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.8 (§23 Prototype Preparation, §9A Document Intelligence Capabilities, §5.1 Maintenance Domain, §5.3 License Domain, §6.4 ReconciliationPage / "Phase 6" Label, §16 Security Architecture — MVP Enforcement Level, §16A Other Non-Functional Requirements — Design Backlog, §15/§22 Out of Scope)
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

**Version note (2026-08-23 re-sync, v0.5 → v0.6):** this pass re-verifies against
`RAISE-PRD.md` v0.9 (unchanged since the v0.5 sync) and `RAISE-DESIGN.md` v0.8 (advanced
from v0.7, which this prototype was last synced against). One Design-only change was
checked for drift in this pass:

4. **Design v0.8 added [§16A Other Non-Functional Requirements — Design
   Backlog](../02-design/RAISE-DESIGN.md#16a-other-non-functional-requirements--design-backlog),**
   an explicit design-layer placeholder for the broader PRD §10 NFR backlog
   (Performance, Availability, Scalability, Backup/Recovery, Data Retention,
   Encryption, API Security, Audit Retention, Monitoring, Logging) that sits
   outside `RAISE-NFR-SEC-RBAC-001`. None of these areas carries a dedicated
   PRD Traceability ID, has a defined value/target/mechanism, or implies any
   new screen — Design itself only added a status-tracking table, not a new
   requirement or design area. This prototype adds the same kind of explicit
   completeness placeholder (new §25A below) so that no PRD §10 NFR area is
   silently absent from this document either, without inventing any UI,
   value, or mechanism the PRD/Design do not define. See §25A for detail.

**Version note (2026-08-21 re-sync, v0.4 → v0.5):** this pass re-verifies against
`RAISE-PRD.md` v0.9 and `RAISE-DESIGN.md` v0.7 (both moved forward from v0.6/v0.5, which
this prototype was last synced against). Three PRD/Design changes were checked for drift
in this pass:

1. **License Management Design/PRD inconsistency — now resolved, no longer open.** The
   `## NEEDS_PRD_CONFIRMATION` raised in Prototype v0.4 (that `RAISE-DESIGN.md` v0.5
   §4.1A/§5.3 still said "Priority P0, Scope MVP" for `RAISE-FR-LICENSE-001`, contradicting
   the PRD's Roadmap-only decision) has been **fixed at the Design layer**: `RAISE-DESIGN.md`
   v0.6/v0.7 §4.1A and §5.3 now correctly state "Priority: Roadmap (not MVP-confirmed) ·
   Scope: Enterprise Roadmap — not Phase 1 MVP," consistent with `RAISE-PRD.md` v0.9 §6/§13/
   §17. This prototype's existing Roadmap-only treatment of P-016/P-017 required **no
   change** — it was already aligned — but the stale `## NEEDS_PRD_CONFIRMATION` signal
   from v0.4 is removed below since its underlying issue no longer exists.
2. **Six ESAPS-reference-only pages confirmed out of scope** (`Assignment.tsx`, `Auth.tsx`
   beyond Login, `Inventory.tsx`, `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`,
   plus `ErrorPages.tsx` as generic infrastructure) per `RAISE-PRD.md` §15/§16 Resolved
   Question 35 and `RAISE-DESIGN.md` §22 "Out of Scope." This prototype never referenced
   any of these six pages/flows in any screen, pending state, or "TBD/uncertain" note —
   **no drift found; no change required.**
3. **`RAISE-FR-ORACLE-001` "Phase 6" label clarification.** `RAISE-DESIGN.md` §6.4 now
   records that "Phase 6" is a stale `frontend/`-internal code-comment label, not a PRD
   phase, and that `ReconciliationPage`'s mapping to `RAISE-FR-ORACLE-001` remains an
   **open question (PRD Open Question 10a)** — not to be inferred. This prototype's
   **P-011 Oracle FA / Financial View** never referenced "Phase 6" or `ReconciliationPage`
   — **no drift found; no change required.**

Additionally, `RAISE-NFR-SEC-RBAC-001`'s MVP enforcement level is now confirmed
(UI-only/client-side for MVP; backend enforcement deferred to Roadmap — PRD §11, §16
Resolved Question 38; Design §16 Security Architecture). This is a narrow decision about
*where* enforcement happens, not *what* the roles/permissions are — the role list,
permission matrix contents, and authentication mechanism all remain **TBD**. Screens that
reference RBAC dependency (P-001, P-009) are updated below to note the confirmed
enforcement-level scope **without assuming or inventing any role model, role name, or
permission set** — consistent with the instruction that role model content must stay TBD.

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
│   ├── Maintenance History
│   └── Request Workflow (4-stage: User Requisition → Dept Approval
│       (Delegated) → IT Dispatch → Technician Execution)
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
├── AI Assistant
│   └── Natural Language Search
│
└── Roadmap (not MVP — exploratory, kept visually separated per §2.3)
    └── License Management
        ├── License Inventory (P-016)
        └── License Detail (P-017)
```

**Note:** This is a prototype information architecture. Final navigation
requires design review. **License Management is placed under a separate
"Roadmap" branch, not under the main MVP navigation tree**, because
`RAISE-FR-LICENSE-001` is confirmed Enterprise Roadmap, not MVP (PRD v0.9
§6/§13/§17; `RAISE-DESIGN.md` v0.7 §4.1A/§5.3/§22 agree) — see P-016/P-017
for detail.

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
(PRD §11 Security & RBAC). **MVP enforcement-level note (PRD v0.9 §11, §16 Resolved
Question 38; Design v0.7 §16 Security Architecture):** business has confirmed that a
UI-only/client-side permission check is acceptable for MVP, with backend-enforced RBAC
deferred to Enterprise Roadmap — this fixes *where* enforcement happens, not *what* the
roles/permissions are. The role list, permission matrix contents, and authentication
mechanism remain **TBD**; this prototype does not assume, name, or design any role model
beyond the four actors listed in the table above (which come from PRD §5 Target Users,
not from a permission matrix).

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
| P-016 | License Inventory | **Roadmap (not MVP)** | RAISE-FR-LICENSE-001 |
| P-017 | License Detail | **Roadmap (not MVP)** | RAISE-FR-LICENSE-001 |

Risk Scoring, Lifecycle Prediction and AI Recommendation should be
treated as Pilot / Roadmap prototype areas unless separately approved
(PRD §7 AI Requirements). **License Management (P-016/P-017) is likewise a
Roadmap area** (PRD v0.9 §6/§13/§17 confirm `RAISE-FR-LICENSE-001` as Enterprise
Roadmap, not MVP) — see the note under §5's screen list below and the Document
Status change log for why these two screens exist in this prototype despite not
being MVP.

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

**P-016/P-017 License Management — Roadmap, not MVP (PRD v0.6, added
2026-08-21):** unlike the screens above, P-016/P-017 are given their **own
dedicated screens** rather than being folded into an existing screen as an
"incidental" element, because `RAISE-FR-LICENSE-001` is a structurally distinct
domain (its own inventory + detail view — Design §4.1A/§5.3) rather than a
capability layered onto an existing asset screen. However, **the PRD's
Requirement Traceability Matrix (§17) and MVP Scope section (§13) both
confirm this requirement as Enterprise Roadmap, not Phase 1 MVP** — the
requirement's identity and screens exist here only because
`frontend/src/pages/Licenses/` and `frontend/src/pages/LicenseDetail/` are
already built, tested, and routed in the `frontend/` source tree ahead of
that Roadmap-only scope decision (PRD §16 Resolved Question 34). These two
screens are therefore recorded as **Roadmap / exploratory prototype
screens** — they document the already-built UI concept for engineering
alignment, they are **not** to be read as confirmed MVP scope, and no field
model, alert rule, seat/utilization rule, or vendor/cost rule shown on them
should be treated as PRD-approved. See §22 (P-016 License Inventory) / §23 (P-017 License
Detail) below. **Update (v0.5, 2026-08-21 re-sync):** the Design/PRD inconsistency
previously flagged here — `RAISE-DESIGN.md` v0.5 §4.1A/§5.3 stating "Priority P0, Scope
MVP" against the PRD's Roadmap-only decision — has since been **corrected at the Design
layer** (`RAISE-DESIGN.md` v0.6/v0.7 now states Roadmap/not-MVP in both sections,
consistent with `RAISE-PRD.md` v0.9 §6/§13/§17). The `## NEEDS_PRD_CONFIRMATION` signal
raised against it in Prototype v0.4 is therefore closed and removed from this revision.

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
authentication mechanism remains TBD. **MVP enforcement level confirmed (PRD v0.9 §11,
§16 Resolved Question 38):** a UI-only/client-side permission check is acceptable for
MVP; backend-enforced RBAC is deferred to Enterprise Roadmap. This is an accepted,
explicit MVP risk (a client-bypassing actor is not blocked server-side), not an
oversight — it does not change what this screen shows. The role list, permission
matrix contents, and authentication mechanism itself remain **TBD** — no role model is
assumed on this screen.

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

Show maintenance information associated with an asset, and support the
**confirmed 4-stage maintenance-request workflow** (PRD v0.9 §6
`RAISE-FR-MAINT-001`; Design v0.7 §5.1 — confirmed 2026-08-21, PRD §16
Resolved Question 33).

## Prototype — Maintenance Record List

```text
Maintenance
────────────────────────────────────
Asset
Date
Event
Status (stage)
Cost

History
────────────────────────────────────
Date | Event | Status | Cost
```

The fields are conceptual because the PRD does not finalize the
maintenance schema (SLA, vendor model, and cost model remain **TBD** — see
Open Question below).

## Prototype — 4-Stage Workflow (Request Detail View)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Maintenance Request: MR-XXXX                          Asset: RAISE-XXXX │
├────────────────────────────────────────────────────────────────────────┤
│  Stage 1            Stage 2                Stage 3          Stage 4    │
│  User            → Dept Approval        → IT           → Technician    │
│  Requisition       (Delegated)             Dispatch        Execution   │
│  ●───────────────────○──────────────────────○──────────────○          │
│  Done               Current                Pending        Pending     │
└────────────────────────────────────────────────────────────────────────┘
```

### Per-Stage Screen Concepts

**Stage 1 — User Requisition**

```text
New Maintenance Request
────────────────────────────────────
Asset (selected / scanned)
Requested by
Issue description
Priority (conceptual — TBD)
[ Submit Request ]
        ↓
State: PENDING_DEPT_APPROVAL
```

**Stage 2 — Dept Approval (Delegated)**

```text
Pending Approval Queue (Dept Approver view)
────────────────────────────────────
Request ID | Asset | Requested by | Issue | Submitted

Approver identity concept:
┌──────────────────────────────────────────┐
│ Approving as: [ Dept Approver ▾ ]        │
│  ⤷ "Acting as delegate for: Approver X"  │
│    (shown only when delegated-approver   │
│     setting is active — TBD rules)       │
├──────────────────────────────────────────┤
│ [ Approve ]   [ Reject ]   [ Request Info ]│
└──────────────────────────────────────────┘
        ↓ (Approve)
State: PENDING_IT_DISPATCH
```

- The **delegated-approver concept** (Design §5.1) is shown here as a
  labeled banner only — *who* may delegate, *to whom*, and how delegation
  is audited are **TBD**; no delegation configuration logic is implemented
  in this prototype.

**Stage 3 — IT Dispatch**

```text
Dispatch Queue (IT view)
────────────────────────────────────
Request ID | Asset | Approved by | Approved on

Dispatch action:
┌──────────────────────────────────────────┐
│ Assign to: [ Technician / Queue ▾ ]      │
│ Vendor model: Internal / External — TBD  │
│ [ Dispatch ]                              │
└──────────────────────────────────────────┘
        ↓
State: PLANNING / IN_PROGRESS / ON_HOLD (Technician Execution begins)
```

**Stage 4 — Technician Execution**

```text
Technician Work View
────────────────────────────────────
Request ID | Asset | Dispatched by

Status control: [ PLANNING ▾ | IN_PROGRESS ▾ | ON_HOLD ▾ ]
Work notes
Cost incurred (TBD — cost model not defined)
[ Mark Complete ]
        ↓
State: DONE
```

## Conceptual State Model (mirrors Design §5.1)

```text
PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE
```

## User Flow

```text
Maintenance
      │
      ├── New Request (User Requisition) ──► PENDING_DEPT_APPROVAL
      ├── Approval Queue (Dept Approval, Delegated) ──► PENDING_IT_DISPATCH
      ├── Dispatch Queue (IT Dispatch) ──► PLANNING/IN_PROGRESS/ON_HOLD
      └── Technician Work View (Technician Execution) ──► DONE
```

## Traceability

`RAISE-FR-MAINT-001` — 4-stage workflow shape (User Requisition → Dept
Approval (Delegated) → IT Dispatch → Technician Execution) and the state
model (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH →
PLANNING/IN_PROGRESS/ON_HOLD → DONE`) are business-confirmed per PRD §6 /
§16 Resolved Question 33 and Design §5.1 — reflected above.

Requirement traceability (RBAC dependency): approval, dispatch, and
technician roles, and the delegated-approver setting, depend on
`RAISE-NFR-SEC-RBAC-001`. **MVP enforcement level confirmed (PRD v0.9 §11, §16 Resolved
Question 38; Design v0.7 §16 Security Architecture):** UI-only/client-side enforcement is
acceptable for MVP, backend deferred to Roadmap — but this only fixes *where* a future
permission check would run, not *what* the roles/permissions are. The role list,
permission matrix contents, and authentication/delegation mechanism remain **TBD** — no
role-gating logic is implemented in this prototype; the stage screens above are shown for
all roles for prototype purposes only, and no role name (e.g., "Dept Approver," "IT
Dispatcher," "Technician") shown on these mockups should be read as an approved role
definition.

## Open Question

**Confirmed:** the 4-stage workflow shape and state model above. **Still
TBD** (PRD §16 Q14 partially resolved; Design §5.1): SLA per stage, the
vendor model (internal technician vs. external vendor dispatch), the cost
model/tracking, and delegated-approver configuration rules (who may
delegate, to whom, and how delegation is audited). None of these are
implemented or assumed in this prototype — the "Priority," "Vendor model,"
and "Cost incurred" fields above are placeholders only.

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

# 22. P-016 License Inventory

## Status Banner

**Roadmap — not MVP.** `RAISE-FR-LICENSE-001` (Software / SaaS License
Management) is confirmed **Enterprise Roadmap, not Phase 1 MVP** in
`RAISE-PRD.md` v0.9 §6/§13/§17 (PRD §16 Resolved Question 34). This screen is
included in the prototype only because `frontend/src/pages/Licenses/` is
already built, tested, and routed in the `frontend/` source tree ahead of
that scope decision — it documents the existing UI concept for engineering
alignment. **It must not be read as an approved MVP screen or as approved
business rules.** (`RAISE-DESIGN.md` v0.6/v0.7 §4.1A/§5.3 now also correctly
state Roadmap/not-MVP for this requirement — the earlier Design/PRD
inconsistency on this point noted in Prototype v0.4 is resolved.)

## Purpose

Provide an inventory view of software/SaaS license records — mirrors the
already-built `frontend/src/pages/Licenses/index.tsx` (list/table/grid views,
search, and filter chips for "Expiring Soon," "High Spend," and "Audit / risk"
categories).

## Prototype Elements

```text
License Inventory
──────────────────────────────────────────────────────────
Search   Filter: All | Expiring Soon | High Spend | Audit / True-up Risk

Summary tiles: Total Annual Spend | Seat Utilization | Upcoming
               Renewals | Potential Savings (all TBD calculation rules)

Table
──────────────────────────────────────────────────────────
Product & Vendor | Category / Model | Seat Utilization |
Financials | Renewal Date | Status | Actions
```

- **Seat Utilization, Financials (annual cost/cost-per-seat), and Status**
  columns mirror fields already present in the built `frontend/` code
  (`SoftwareLicense`/`LicenseStatus` types), but **none of these fields, their
  computation rules, or the "Expiring Soon"/"Over-Allocated" status
  thresholds are approved PRD requirements** — the license field model is
  explicitly **TBD** per PRD §16 Q15a / Design §5.3 "Data Model TBD."
- **Actions:** "Add License," "Allocate Seat" — shown as existing UI concepts
  from the built code; the underlying workflow/approval rules (if any) are
  **not** defined in the PRD and are not implied to exist by showing this UI.

## User Flow

```text
License Inventory
      │
      ├── Search / Filter
      └── Select License Row
               ↓
          License Detail (P-017)
```

## Traceability

`RAISE-FR-LICENSE-001` — **Roadmap scope, not MVP** (PRD v0.9 §6, §13, §17;
Design v0.7 §4.1A, §5.3). Priority/scope identity is confirmed; the license
field model, renewal/expiry alert rule, seat/utilization tracking, and
vendor/cost tracking shown above are all **TBD** and are not implemented or
assumed business logic in this prototype — they are placeholders that mirror
the already-built `frontend/` UI only.

## Open Question

License field model, renewal/expiry alert rule, seat/utilization tracking,
and vendor/cost tracking are all **TBD** (PRD §16 Q15a; Design §5.3 "Data
Model TBD"). Whether license expiry should integrate with
`RAISE-FR-ALERT-001` (P-012 Alerts) is also **TBD** (PRD §16 Q15a; Design §5.3
"Relationship to Alerts (Open)") — no such integration is shown here.

---

# 23. P-017 License Detail

## Status Banner

**Roadmap — not MVP.** Same status as P-016 above — see that screen's Status
Banner for the full explanation. This screen mirrors the already-built
`frontend/src/pages/LicenseDetail/` code.

## Purpose

Provide a single-record detail view of one software/SaaS license — mirrors
`frontend/src/pages/LicenseDetail/`.

## Prototype Elements

```text
License Detail: <Product> (<License Code>)
──────────────────────────────────────────────────────────
Vendor / Publisher
Category / License Model
Seats: Purchased / Used / Utilization %
Financials: Annual Cost / Cost per Seat
Renewal Date / Status (Active / Expiring Soon / Expired /
                        Over-Allocated / Under-Utilized)

Association
──────────────────────────────────────────────────────────
Allocated Seats → Holder(s) [where such an association exists]
Linked Hardware Asset(s) [where such an association exists]

Actions: Allocate Seat | Renew Subscription
```

- The **Association → Asset(s) / Holder(s)** section reflects Design §5.3's
  conceptual data flow ("Association → Asset(s) [where such an association
  exists]," "Association → Holder(s) [where such an association exists]") —
  shown here as a placeholder relationship display only.
- **Renew Subscription** and **Allocate Seat** actions mirror the built
  `frontend/` UI; no approval workflow, cost-tracking rule, or audit rule is
  implied — all are **TBD**.

## User Flow

```text
License Inventory (P-016)
      │
      └── Select License
               ↓
          License Detail
               ├── Allocate Seat → Holder / Asset association
               └── Renew Subscription → Updated Renewal Date / Cost
```

## Traceability

`RAISE-FR-LICENSE-001` — **Roadmap scope, not MVP** (PRD v0.9 §6, §13, §17;
Design v0.7 §4.1A, §5.3). See P-016's Traceability note for the same caveats;
they apply identically here.

## Open Question

Same open items as P-016 (license field model, renewal/expiry alert rule,
seat/utilization tracking, vendor/cost tracking, relationship to
`RAISE-FR-ALERT-001`) — all **TBD**, see PRD §16 Q15a and Design §5.3.

---

# 24. AI Response States

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

# 25. AI Scope Boundary

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

# 25A. NFR Backlog — Prototype Note

[`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#16a-other-non-functional-requirements--design-backlog)
§16A (added in Design v0.8) records that
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#10-non-functional-requirements)
§10's broader NFR backlog — Performance, Availability, Scalability,
Backup/Recovery, Data Retention, Encryption, API Security, Audit Retention,
Monitoring, Logging — has **no defined value, target, or mechanism** and (unlike
`RAISE-NFR-SEC-RBAC-001`) **no dedicated PRD Traceability ID**. This prototype
therefore does **not** add a screen, UI element, or placeholder tile for any of
these eleven areas — there is nothing testable or visualizable yet, and doing so
would invent UI ahead of an undefined requirement.

This section exists only so the prototype layer explicitly acknowledges the same
backlog Design §16A tracks, rather than silently having no reference to it at
all:

| PRD §10 NFR Area | Prototype Status |
|---|---|
| Authentication | No screen beyond P-001's generic auth action placeholder (§7) — mechanism TBD |
| Authorization / RBAC | Covered narratively on P-001/P-009 (MVP enforcement level only — UI-only/client-side, per `RAISE-NFR-SEC-RBAC-001`); role list/permission content TBD, no role model shown |
| Performance | No prototype representation — no target defined in PRD/Design |
| Availability | No prototype representation — no target defined in PRD/Design |
| Scalability | No prototype representation — no target defined in PRD/Design |
| Backup / Recovery | No prototype representation — no policy defined in PRD/Design |
| Data Retention | No prototype representation — no policy defined in PRD/Design |
| Encryption | No prototype representation — no requirement defined in PRD/Design |
| API Security | No prototype representation — no requirement defined in PRD/Design |
| Audit Retention | No prototype representation beyond P-013's generic Audit Log screen (§19) — retention period is explicitly out of scope for that screen's mock data, see P-013 |
| Monitoring | No prototype representation — no requirement defined in PRD/Design |
| Logging | No prototype representation — distinct from the business-facing Audit Log (P-013), which is an application-domain screen, not an operational logging NFR |

Only `RAISE-NFR-SEC-RBAC-001` (Authorization/RBAC) has PRD-confirmed,
prototype-relevant content (the MVP enforcement-level decision, already reflected
on P-001 and P-009) — the other ten areas remain fully TBD at every layer
(PRD → Design → Prototype) and are recorded here for traceability completeness
only, not as a commitment to future screens.

---

# 26. Core Prototype User Flows

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

## Flow H — Maintenance Request (4-Stage Workflow)

```text
Asset Detail
 ↓
Maintenance → New Request (User Requisition)
 ↓
State: PENDING_DEPT_APPROVAL
 ↓
Approval Queue (Dept Approval, Delegated)
 ↓
State: PENDING_IT_DISPATCH
 ↓
Dispatch Queue (IT Dispatch)
 ↓
State: PLANNING / IN_PROGRESS / ON_HOLD
 ↓
Technician Work View (Technician Execution)
 ↓
State: DONE
```

Requirement:

`RAISE-FR-MAINT-001` — 4-stage workflow shape confirmed 2026-08-21 (PRD §16
Resolved Question 33; Design §5.1). SLA per stage, vendor model, cost model,
and delegated-approver configuration rules remain **TBD**.

---

## Flow I — License Lookup (Roadmap, not MVP)

```text
License Inventory (P-016)
 ↓
Search / Filter
 ↓
License Detail (P-017)
 ↓
Allocate Seat / Renew Subscription (UI concept only)
```

Requirement:

`RAISE-FR-LICENSE-001` — **Roadmap scope, not MVP** (PRD v0.9 §6/§13/§17).
Shown here for completeness because P-016/P-017 exist in this prototype, but
this flow is **not** part of the MVP-scoped core flows A–H above and must
not be treated as approved MVP functionality.

---

# 27. Prototype Traceability Matrix

| Prototype | Requirement | Status |
|---|---|---|
| P-003 Asset Registry | RAISE-FR-ASSET-001 | Planned |
| P-004 Asset Detail | RAISE-FR-LIFE-001 | Planned |
| P-005 Category | RAISE-FR-ASSET-002 | Planned |
| P-006 Custody | RAISE-FR-ASSET-003 | Planned |
| P-007 QR / Barcode | RAISE-FR-OPS-001 | Planned |
| P-008 Check-in / Check-out | RAISE-FR-OPS-002 | Planned |
| P-009 Maintenance | RAISE-FR-MAINT-001 | Planned — 4-stage workflow shape reflected (confirmed 2026-08-21); SLA/vendor/cost model TBD |
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
| P-016 License Inventory | RAISE-FR-LICENSE-001 | **Roadmap, not MVP** — exploratory prototype screen mirroring already-built `frontend/src/pages/Licenses/`; field model/alert rule/seat tracking/vendor-cost tracking all TBD |
| P-017 License Detail | RAISE-FR-LICENSE-001 | **Roadmap, not MVP** — exploratory prototype screen mirroring already-built `frontend/src/pages/LicenseDetail/`; same TBD items as P-016 |

**Cross-check against [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) §17 (PRD v0.9):**
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
is also intentionally excluded — its Scope is `MVP (enforcement level only)` with
Priority `TBD` in PRD §17 (not a fully-scoped P0/MVP requirement), and Design §24
likewise omits it from the design-area table, covering it structurally under
Design §16 Security Architecture instead; P-001 Login and P-009 Maintenance reference it
narratively (including the confirmed UI-only/client-side MVP enforcement level, PRD §16
Resolved Question 38) without a formal traceability row, matching that treatment. The
role list, permission matrix contents, and authentication mechanism remain **TBD** and
are not assumed by this table. `RAISE-FR-LIFE-001` (P0, MVP, APPROVED
in PRD §17) is added as a row against P-004 Asset Detail — previously missing from this
matrix despite being a P0/MVP requirement; see P-004's Traceability note for how it is
realized across P-004/P-006/P-009/P-010/P-013 collectively.

**v0.4 addition — `RAISE-FR-LICENSE-001` (P-016/P-017):** PRD §17 (v0.9) records this
requirement's Status as `ROADMAP — identity/scope confirmed 2026-08-21; field model/alert
rules/vendor-cost tracking TBD` and Scope as `Roadmap` (not MVP). Per PRD §17's own
downstream-sync guidance, a Roadmap-scoped requirement's Prototype column should read
**"Not applicable — Roadmap, not MVP"** rather than "Planned," since "Planned" is reserved
for MVP-scoped work awaiting a sync pass. The rows above use "Roadmap, not MVP" to make
this distinction explicit rather than reusing "Planned" — if this matrix is consumed by a
downstream tool expecting the exact PRD §17 vocabulary, these two rows should be read as
PRD-status `"Not applicable — Roadmap, not MVP"`, not as being on the same MVP delivery
track as the other rows in this table. `RAISE-FR-MAINT-001`'s row was **updated, not
added** — the requirement already had a row in v0.3; only its Status detail changed to
reflect the confirmed 4-stage workflow shape (PRD v0.6 §16 Resolved Question 33).

**v0.5 re-sync (2026-08-21, against PRD v0.9 / Design v0.7):** no rows added, removed, or
requiring a status change in this matrix. `RAISE-AI-DOC-004` (Duplicate Detection)
remains at Status "Planned — no dedicated screen; TBD acceptance behavior" — PRD §17
still records its acceptance detail as unresolved (asked 2026-08-21, no business answer
received), so this row is not upgraded even though `RAISE-AI-DOC-001`–`003` (which did
receive acceptance detail) were already reflected at v0.4. `RAISE-FR-ORACLE-001`'s row
is unchanged — Design §6.4's "Phase 6" label clarification and the still-open
`ReconciliationPage` mapping question (PRD Open Question 10a) do not add a new
requirement ID or change this row's status; P-011 Oracle FA / Financial View was checked
and does not reference "Phase 6" or `ReconciliationPage`.

**v0.6 re-sync (2026-08-23, against PRD v0.9 [unchanged] / Design v0.8):** no rows added,
removed, or requiring a status change in this matrix. Design v0.8 added §16A (PRD §10 NFR
backlog placeholder) — none of those eleven NFR areas carries a PRD Traceability ID, so
none is a candidate row in this requirement-ID-keyed matrix; the completeness
acknowledgment for them is instead recorded narratively in new [§25A NFR Backlog —
Prototype Note](#25a-nfr-backlog--prototype-note), consistent with how Design §24 excludes
the same areas from its own traceability table and points to §16A instead.

---

# 28. Prototype Review Checklist

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
- [x] Maintenance's confirmed 4-stage workflow (User Requisition → Dept
      Approval (Delegated) → IT Dispatch → Technician Execution) is
      represented on P-009, with SLA/vendor/cost model left as TBD
- [x] License Management (P-016/P-017) is clearly labeled Roadmap/not-MVP,
      not presented as an approved MVP screen, despite having a dedicated
      screen (`RAISE-DESIGN.md` v0.6/v0.7 §4.1A/§5.3 now also correctly say
      Roadmap/not-MVP — the Design/PRD inconsistency previously open here is
      resolved as of the v0.5 re-sync; see Document Status below)
- [x] Six ESAPS-reference-only pages confirmed out of scope (PRD §15, §16
      Resolved Question 35) are not referenced by any screen in this document
      (checked during v0.5 re-sync — no drift found)
- [x] `RAISE-FR-ORACLE-001`'s "Phase 6" code-comment label (clarified as not
      a PRD phase, Design §6.4) is not referenced by P-011 Oracle FA /
      Financial View (checked during v0.5 re-sync — no drift found)
- [x] `RAISE-NFR-SEC-RBAC-001`'s confirmed MVP enforcement level (UI-only/
      client-side, backend deferred to Roadmap) is noted on P-001 and P-009
      without inventing a role list, permission matrix, or authentication
      mechanism (all remain TBD per PRD §11)
- [x] PRD §10 / Design §16A's broader NFR backlog (Performance, Availability,
      Scalability, Backup/Recovery, Data Retention, Encryption, API Security,
      Audit Retention, Monitoring, Logging) is explicitly acknowledged (§25A)
      rather than silently absent from this document — no screen or UI value
      is invented for any of these areas (checked during v0.6 re-sync)

---

# 29. Prototype Deliverable Structure

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

# 30. Next Step

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

**Version:** 0.6 (re-synced against RAISE-PRD.md v0.9 [unchanged] and RAISE-DESIGN.md
v0.8, 2026-08-23 — no screens added or removed; one new completeness section added
(§25A) mirroring Design's own §16A gap-closure pass; no `## NEEDS_PRD_CONFIRMATION`
signal raised)

**Change Log — v0.5 → v0.6 (2026-08-23, design-completeness gap-closure sync):**

1. **PRD §10 / Design §16A NFR backlog given an explicit prototype-layer
   placeholder.** Design v0.8 added [§16A Other Non-Functional Requirements —
   Design Backlog](../02-design/RAISE-DESIGN.md#16a-other-non-functional-requirements--design-backlog),
   an explicit design-status table for the PRD §10 NFR backlog (Performance,
   Availability, Scalability, Backup/Recovery, Data Retention, Encryption, API
   Security, Audit Retention, Monitoring, Logging) that sits outside
   `RAISE-NFR-SEC-RBAC-001`. This prototype had no equivalent acknowledgment
   anywhere in the document — new **[§25A NFR Backlog — Prototype
   Note](#25a-nfr-backlog--prototype-note)** now records, per area, that no
   screen/UI value is shown (or, for Authorization/RBAC and the Audit Log's
   generic screen, exactly what narrow content already exists and why the rest
   remains TBD). **No new screen, value, target, or mechanism was invented** —
   this pass only makes sure the prototype document does not silently omit
   these eleven areas, matching the discipline Design itself applied in its
   v0.7 → v0.8 pass.
2. **§27 Prototype Traceability Matrix** cross-check note updated with a v0.6
   re-sync entry explaining why the PRD §10 NFR backlog areas are not rows in
   that requirement-ID-keyed table (no PRD Traceability ID) and pointing to the
   new §25A instead, mirroring Design §24's equivalent reasoning.
3. **§28 Prototype Review Checklist** gained a new checklist item confirming
   the PRD §10 / Design §16A NFR backlog is explicitly acknowledged rather than
   silently absent.
4. **No new requirement, screen, flow, or capability was invented.** This pass
   only adds a structural placeholder for content the PRD/Design already state
   as backlog/TBD — no `## NEEDS_PRD_CONFIRMATION` signal is raised, because
   nothing found in this pass requires UI for a capability the PRD does not
   already define a value for.
5. Header metadata updated: Version bumped to 0.6; Design Source updated to
   reference Design v0.8 (PRD unchanged at v0.9, re-verified during this pass).

**Change Log — v0.4 → v0.5 (2026-08-21):**

1. **License Management Design/PRD inconsistency — resolved, `## NEEDS_PRD_CONFIRMATION`
   closed.** `RAISE-DESIGN.md` v0.4's `## NEEDS_PRD_CONFIRMATION` item (that Design v0.5
   §4.1A/§5.3 stated "Priority P0, Scope MVP" for `RAISE-FR-LICENSE-001`, contradicting
   the PRD's Roadmap-only decision) is now fixed at the Design layer: `RAISE-DESIGN.md`
   v0.6/v0.7 §4.1A/§5.3 both correctly state Roadmap/not-MVP, consistent with
   `RAISE-PRD.md` v0.9 §6/§13/§17. This prototype's P-016/P-017 treatment required no
   change (it was already Roadmap-labeled), but every citation of `RAISE-DESIGN.md`
   v0.5's stale wording was updated to note the fix, and the `## NEEDS_PRD_CONFIRMATION`
   section itself is removed from this revision (see closing note below).
2. **Six ESAPS-reference-only pages confirmed out of scope** (PRD §15, §16 Resolved
   Question 35; Design §22 "Out of Scope"): `Assignment.tsx`, `Auth.tsx` beyond Login,
   `Inventory.tsx`, `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`, and
   `ErrorPages.tsx` were checked against every screen in this document (P-001–P-017 and
   the "Incidental" mapping notes) — **none of these pages/flows was ever referenced
   here as a screen, a pending/uncertain element, or an implied requirement.** No change
   was needed; recorded in the Review Checklist (§28) as a completed check for this
   pass.
3. **`RAISE-FR-ORACLE-001` "Phase 6" label clarification** (Design v0.7 §6.4; PRD §16
   Resolved Question 37, Open Question 10a): checked **P-011 Oracle FA / Financial
   View** — it never referenced "Phase 6" or `ReconciliationPage`, so no correction was
   needed. The underlying open question (whether `ReconciliationPage` satisfies
   `RAISE-FR-ORACLE-001` or needs a new requirement ID) remains unresolved in the PRD and
   is not answered or assumed here.
4. **`RAISE-NFR-SEC-RBAC-001` MVP enforcement level confirmed** (PRD §11, §16 Resolved
   Question 38; Design v0.7 §16 Security Architecture — MVP Enforcement Level): a
   UI-only/client-side permission check is acceptable for MVP, backend deferred to
   Roadmap. Added a narrow clarifying note to **P-001 Login**, **§4 User Roles**, and
   **P-009 Maintenance**'s RBAC-dependency note. This decision fixes only *where*
   enforcement happens, not *what* the roles/permissions are — the role list, permission
   matrix contents, and authentication mechanism remain **TBD**, and **no role model,
   role name, or permission set was invented or assumed anywhere in this document** as a
   result of this change.
5. Version citations throughout (`RAISE-PRD.md` v0.6 → v0.9; `RAISE-DESIGN.md` v0.5 →
   v0.7) were updated in the places that assert the *current* document version (header,
   Screen Inventory §5 notes, P-016/P-017 Status Banners and Traceability sections, §27
   Prototype Traceability Matrix, Document Status/Source lines). Historical citations
   that record *when* a specific PRD Resolved Question was decided (e.g., "PRD v0.3 §16
   Resolved Question 27") were left unchanged, since those are date-stamped historical
   references, not claims about the current document version.
6. No other requirement gaps, stale requirement references, or new screens/flows without
   requirement backing were found against PRD v0.9 §17 / Design v0.7 §24 during this
   pass.

**Change Log — v0.3 → v0.4 (2026-08-21):**

1. **`RAISE-FR-MAINT-001` 4-stage workflow shape bound to P-009 Maintenance**
   (PRD v0.6 §6, §16 Resolved Question 33; Design v0.5 §5.1): P-009 now
   documents the confirmed workflow (User Requisition → Dept Approval
   (Delegated) → IT Dispatch → Technician Execution), the state model
   (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH →
   PLANNING/IN_PROGRESS/ON_HOLD → DONE`), and a per-stage screen concept for
   each stage, including the delegated-approver banner concept. SLA per
   stage, vendor model, cost model, and delegated-approver configuration
   rules remain **TBD**, carried forward unchanged from PRD/Design — not
   invented here. Added **Flow H — Maintenance Request (4-Stage Workflow)**
   to §26 Core Prototype User Flows. §27 Prototype Traceability Matrix's
   `RAISE-FR-MAINT-001` row status updated (not newly added) to reflect the
   confirmed workflow shape.
2. **Two new screens added for `RAISE-FR-LICENSE-001`: P-016 License
   Inventory and P-017 License Detail** (PRD v0.6 §6, §16 Resolved Question
   34; Design v0.5 §4.1A, §5.3). These mirror the already-built, tested
   `frontend/src/pages/Licenses/` and `frontend/src/pages/LicenseDetail/`
   code. Field model, renewal/expiry alert rule, seat/utilization tracking,
   and vendor/cost tracking remain **TBD**, per the PRD — not invented here.
   Added **Flow I — License Lookup** to §26. §5 Screen Inventory and §27
   Prototype Traceability Matrix updated with both screens.
   - **Important scope correction / discrepancy flagged:** `RAISE-PRD.md`
     v0.6 §6/§13/§17 confirms `RAISE-FR-LICENSE-001` as **Enterprise
     Roadmap, not Phase 1 MVP** (an earlier PRD pass had briefly and
     incorrectly recorded it as P0/MVP before the actual business decision
     was received; PRD §16 Resolved Question 34 documents the correction).
     `RAISE-DESIGN.md` v0.5 §4.1A and §5.3 still state "Priority P0, Scope
     MVP" for this requirement, which is now **stale relative to the PRD
     and inconsistent with Design's own §14 (listing it under Enterprise
     Roadmap item 8) and §22 (which lists it under the MVP boundary
     instead)**. Per this agent's operating rule that Roadmap/Pilot
     requirements do not get MVP screens unless the user confirms otherwise,
     and because the task instruction for this sync explicitly requested
     P-016/P-017, both screens were created **but labeled Roadmap / not-MVP
     status banners** throughout (Screen Inventory, per-screen Status
     Banners, Traceability Matrix, Core Flow) to stay consistent with the
     PRD's more authoritative §17 Requirement Traceability Matrix rather
     than Design's stale wording. See `## NEEDS_PRD_CONFIRMATION` below —
     this is a Design-document defect (not a Prototype defect) that this
     agent cannot fix directly, since editing `RAISE-DESIGN.md` is out of
     scope for this document.
3. **§5 Screen Inventory, §26 Core Prototype User Flows, §27 Prototype
   Traceability Matrix, and §28 Prototype Review Checklist** updated to
   reflect both changes above. Sections 22–30 were renumbered (previously
   22–28) to make room for the two new screen sections (now §22 P-016, §23
   P-017); no content beyond the two new sections and the items listed above
   was altered during renumbering.
4. No other requirement gaps or stale requirement references were found
   against PRD v0.6 §17 / Design v0.5 §24 during this pass.

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
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.9 + [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.8
**Reference:** VERSCAN only
**Next Action:** Review this v0.6 re-sync, in particular the new §25A NFR Backlog —
Prototype Note added to mirror Design v0.8's §16A gap-closure pass. Downstream
`RAISE-ACCEPTANCE-CRITERIA.md` should be checked next for the same drift — in
particular whether it still needs to (a) cover the confirmed `RAISE-FR-MAINT-001`
4-stage workflow, (b) continue treating `RAISE-FR-LICENSE-001`/P-016/P-017 as
out-of-MVP-scope, (c) avoid inventing any RBAC role model while still reflecting
the confirmed UI-only/client-side MVP enforcement level, and (d) acknowledge the PRD
§10 / Design §16A NFR backlog explicitly rather than omitting it.

---

## NEEDS_PRD_CONFIRMATION

**None outstanding as of this v0.6 re-sync.**

This re-sync pass checked the one flagged Design change (v0.7 → v0.8: new §16A PRD §10
NFR backlog placeholder) and found no screen, flow, or "pending/uncertain" note in this
document that required a change beyond adding an equivalent completeness
acknowledgment (new §25A) and citation/version updates. No new requirement, screen, or
flow without PRD/Design backing was introduced or discovered during this pass, so no new
confirmation is being requested.

The one `## NEEDS_PRD_CONFIRMATION` item historically raised in Prototype v0.4 — that
`RAISE-DESIGN.md` v0.5 §4.1A/§5.3 stated `RAISE-FR-LICENSE-001` as "Priority P0, Scope
MVP," contradicting the PRD's Roadmap-only decision — remains **closed** (fixed at the
Design layer in v0.6/v0.7 and re-verified unchanged in Design v0.8): `RAISE-DESIGN.md`
§4.1A and §5.3 still state "Priority: Roadmap (not MVP-confirmed)" / "Scope: Enterprise
Roadmap — not Phase 1 MVP," matching `RAISE-PRD.md` v0.9 §6/§13/§17 and Design's own
§14/§22. No Design-document defect is open against this prototype.
