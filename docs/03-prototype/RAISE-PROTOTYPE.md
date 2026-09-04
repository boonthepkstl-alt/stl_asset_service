# RAISE Prototype Specification

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** Prototype Specification
**Version:** 0.14 Draft
**Status:** Draft for Prototype Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.15 + [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md) v0.13 (§23 Prototype Preparation, §9A Document Intelligence Capabilities, §4.2 Custody & Asset Operations — Check-in/Check-out workflow/permission/holder-model resolved, plus the new "IT Hardware Assignment Approval Workflow" category-scoped exception, §5.1 Maintenance Domain, §5.2 Warranty Domain — 3-state status model + per-Asset-Category Expiring threshold resolved, §5.3 License Domain, §5.4 Settings Domain, §4.1B Settings / Platform Configuration, §6.4 ReconciliationPage / "Phase 6" Label, §13 Executive Intelligence — corrected to as-built, §14 Alert Architecture — five MVP trigger conditions and fixed-per-condition severity resolved, §16 Security Architecture — MVP Enforcement Level, §16A Other Non-Functional Requirements — Design Backlog, §15/§22 Out of Scope)
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

**Version note (2026-09-04 re-sync, v0.13 → v0.14, PRD §16 Resolved Question 44 /
Design §14 "Alert Architecture"):** `RAISE-PRD.md` §16 Resolved Question 44 and
`RAISE-DESIGN.md` v0.13 §14 jointly confirm the five MVP alert trigger conditions and
their fixed-per-condition High/Medium/Low severity for `RAISE-FR-ALERT-001` — see
**[§18 P-012 Alerts](#18-p-012-alerts)** below, rewritten accordingly. This is scoped to
`RAISE-FR-ALERT-001` only; no other requirement, screen, or row is touched by this pass.
See the dedicated Change Log entry near the end of this document for the full delta.

**Version note (2026-09-02 re-sync, v0.12 → v0.13, PRD §16 Resolved Question 43 /
Design §4.2 "IT Hardware Assignment Approval Workflow"):** `RAISE-PRD.md` §16 Resolved
Question 43 and `RAISE-DESIGN.md` v0.12 §4.2 jointly confirm a **new, category-scoped
exception** to the general Check-in/Check-out resolution already reflected in this
document (Resolved Question 42, v0.11 note below): assigning (Check-out) an asset in
the **IT Hardware** Asset Category specifically now requires a **4-stage approval
workflow** — Stage 1 Initiation (IT/Admin selects an employee and clicks Assign — same
trigger as today), Stage 2 Recipient Confirmation (the assigned employee confirms
receipt themselves — combining the real paper source form's recipient and
recipient's-supervisor signatures into one digital step), Stage 3 IT Processing
(`IT_STAFF`), and Stage 4 IT Supervisor Approval (`IT_MANAGER` — only after this does
the asset's status become Assigned). Rejection at Stage 3 or Stage 4 returns the asset
immediately to Available (terminal, no reopening); no recipient-decline path is defined
at Stage 2. **No new Role is introduced** — Stage 3/4 reuse the existing `IT_STAFF`/
`IT_MANAGER` roles. **This narrows, and does not reopen or reverse,** the general
Check-in/Check-out resolution below — Check-in (every category, including IT Hardware)
and Check-out of every other category remain the existing immediate, no-approval flow,
unchanged. **[§14 P-008 Check-in / Check-out](#14-p-008-check-in--check-out)** is
updated to add this category-scoped exception, using **[§15 P-009
Maintenance](#15-p-009-maintenance)**'s 4-stage stage-progress-indicator pattern as the
closest existing UI precedent (an explicit design-layer choice, cited narratively, not
a claim that P-009's exact fields apply here). **Real-world source (context, not itself
a requirement):** a real Singer Thailand company form, "ใบดำเนินการเกี่ยวกับคอมพิวเตอร์และ
อุปกรณ์" (IT Equipment Processing Form, Version 2024), supplied by the business user this
session. **Explicitly not designed here** (per the PRD's and Design's own non-decisions,
not silently invented): no "recipient's own supervisor" field on Employee, no
PDF/document generation, no e-signature or legal-acknowledgment-text capture UI for
Stage 2 (flagged as still-open on P-008, not decided either way), and no change to
`RAISE-FR-LICENSE-001`. **Cross-referenced as still open, not resolved here:** Design
§4.2's own flagged open design point — whether Custody History (`RAISE-FR-ASSET-003`)
is written once (at Stage 4 approval) or at each of the 4 stage transitions — is **not**
decided by this pass; P-008's Traceability note below states this explicitly.
**[§27 Prototype Traceability Matrix](#27-prototype-traceability-matrix)**'s P-008 row
is updated to record this exception. `RAISE-PRD.md` and `RAISE-DESIGN.md` are not
modified by this pass; no `## NEEDS_PRD_CONFIRMATION` signal is raised for the workflow
itself (the business decision is already confirmed) — see P-008 below for the one
point (e-signature/acknowledgment-text) that remains genuinely open, matching how the
PRD and Design already flag it. See the "Document Status" section's Change Log for full
detail.

**Version note (2026-09-01 re-sync, v0.10 → v0.11, PRD §16 Resolved Question 42 /
Design §4.2):** `RAISE-PRD.md` §16 Resolved Question 42 and `RAISE-DESIGN.md` v0.11
§4.2 "Check-in/Check-out Workflow, Permission Gate, and Holder Model" jointly confirm
three previously-TBD items for `RAISE-FR-OPS-002` (Check-in/Check-out) and
`RAISE-FR-ASSET-003` (Custody History): (a) Check-in/Check-out is an **immediate
state-change operation** — select a holder and confirm (Check-out/Assign), or confirm
return (Check-in) — with **no approval step, no exception-handling workflow, and no
multi-stage process**, deliberately simpler than `RAISE-FR-MAINT-001`'s 4-stage
workflow; (b) the permission gate is **any authenticated user, no role restriction**
("appropriate permission" means simply "is logged in"), matching the already-confirmed
MVP UI-only/client-side RBAC enforcement level (PRD §16 Resolved Question 38); (c) the
Custody History holder data model is a **direct 1:1 link to an Employee record**
(`Asset.assignedEmployeeId`/`assignedTo`), with **no additional organizational
relationship model** (department, team, or location-based custody) needed for MVP.
This matches already-built, already-tested behavior in
`frontend/src/pages/AssetDetail/index.tsx`'s Assign/Check-in flow — **no code change
accompanies this sync**, only resolving a previously-TBD spec question. **[§14 P-008
Check-in / Check-out](#14-p-008-check-in--check-out)** is updated to remove the stale
"exact approval rules and exception handling remain TBD" line and to state the
confirmed immediate-state-change flow and any-authenticated-user permission gate.
**[§12 P-006 Custody History](#12-p-006-custody-history)**'s Traceability note is
updated to reflect that the holder data model is now confirmed (direct Employee link).
The narrower "does Check-in/Check-out exclusively write Custody History" question is
**not** settled by this resolution — it remains a separate, still-open question,
tracked as Open Finding F-10 in
[`OPEN-FINDINGS.md`](../project-management/OPEN-FINDINGS.md) (unaffected by this
resolution). This does **not** reopen or expand the general RBAC role/permission-matrix
content question for other domains (PRD §16 Q21–Q22), which remains TBD. `RAISE-PRD.md`
and `RAISE-DESIGN.md` are not modified by this pass; no `## NEEDS_PRD_CONFIRMATION`
signal is raised (the holder-data-model business decision is already confirmed). **A
correction to this note was made in v0.12** (2026-09-01) — an earlier draft of this pass
incorrectly claimed the exclusivity question was "also settled"; that claim was an
unconfirmed scope expansion and has been reverted. See the "Document Status" section's
Change Log for full detail.

**Version note (2026-09-01 re-sync, v0.9 → v0.10, PRD §16 Resolved Question 41 /
Design §5.2, §5.4, §4.1B):** `RAISE-PRD.md` §16 Resolved Question 41 (resolving new
Open Question 15b, a follow-on to Resolved Question 40, not a reopening of it) and
`RAISE-DESIGN.md` v0.10 §5.2/§5.4/§4.1B confirm the `RAISE-FR-WARRANTY-001` "Expiring"
threshold is **per-Asset-Category configurable**, defaulting to **90 days** for all 5
current Asset Categories (IT Hardware, Mobile, Office Equipment, Infrastructure, Media
Equipment), admin-adjustable via a new Settings domain — not a single fixed global
number. This has already been implemented and verified end-to-end in `frontend/src/`:
a 3-state Active/Expiring/Expired warranty status (computed at read time from
`warrantyExpiry` and the asset's category's configured threshold — not a stored field),
shown as a badge on both `P-003 Asset Registry` and `P-004 Asset Detail`, plus a new
**`P-018 Settings`** screen with a "Warranty" section (one editable threshold per Asset
Category, default 90, Save Changes / Reset, admin-only). **[§16 P-010
Warranty](#16-p-010-warranty)** is rewritten to describe the 3-state model and its
category-scoped, Settings-sourced threshold (replacing the prior 2-of-3-states note,
which described the threshold as still unconfirmed). A new **[§23A P-018
Settings](#23a-p-018-settings)** screen entry is added — no Settings screen existed in
this document before this pass. This does **not** reopen or expand the Warranty field
list settled by Resolved Question 40 (`warrantyExpiry` remains the only Warranty field
on the Asset record; the threshold lives on a separate Settings-domain configuration
record) — see P-010's Traceability note. `RAISE-PRD.md` and `RAISE-DESIGN.md` are not
modified by this pass; no `## NEEDS_PRD_CONFIRMATION` signal is raised (the business
decision is already confirmed). See the "Document Status" section's Change Log for
full detail.

**Version note (2026-09-01 re-sync, v0.8 → v0.9, Open Finding F-27):**
[§11 P-005 Category & Hierarchy](#11-p-005-category--hierarchy) previously
showed an illustrative "Computer / Notebook / Desktop", "Network / Switch /
Router" example tree, explicitly marked TBD, that did not match any real
category name in the app (the real seeded categories are IT Hardware,
Mobile, Office Equipment, Infrastructure, Media Equipment). Per explicit
business decision on Open Finding F-27, the sub-category concept is now
resolved: it is the existing Asset `type` field (already present end-to-end
in `go-template-main` and `frontend/src/data/fixtures/mockData.ts`), not a
new field or data model, and the hierarchy is exactly 2 levels (Category →
Type → individual assets). P-005's tree is rewritten to show the real,
currently-seeded Category → Type breakdown as an illustrative-but-real,
data-derived grouping (not a closed enumerated list). This is a scope/spec
correction resolving a previously-TBD open question, not a new requirement —
`RAISE-FR-ASSET-002` is unchanged, `RAISE-PRD.md` and `RAISE-DESIGN.md` were
not modified by this pass, and no `## NEEDS_PRD_CONFIRMATION` signal is
raised (the business decision is already confirmed). See the "Document
Status" section's Change Log for full detail.

**Version note (2026-08-31 re-sync, v0.7 → v0.8, Open Finding F-22):**
[§8 P-002 Main Dashboard](#8-p-002-main-dashboard) and [§20 P-014 Executive
Dashboard](#20-p-014-executive-dashboard) previously specified an old,
never-built wireframe (Total Assets/NBV/Risk/Warranty Expiry tiles; "Asset
by Category"/"Lifecycle-Maintenance Overview"/"Recent Alerts" or "Asset
Overview"/"Executive Summary" sections) — word-for-word identical between
the two screens, and confirmed divergent from the shipped app by formal
test execution (`TC-EXEC-001-01`/`-02`, 2026-08-26; `TC-DASH-01..03`,
2026-08-29). Per explicit business decision on [Open Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question),
both entries are now rewritten to document the actually shipped dashboard
(`frontend/src/pages/Dashboard/index.tsx`), matching `RAISE-DESIGN.md` v0.9
§13's own as-built correction. Both entries now explicitly cross-reference
each other and state that they document the same single built page, rather
than duplicating two divergent specs. The NBV/Risk/Utilization KPI concept
is preserved (not deleted) as a distinct, not-yet-scheduled future
enhancement in both entries, matching Design's framing. This is a
scope/spec correction to match Design's already-corrected content, not a
new requirement — `RAISE-FR-EXEC-001` is unchanged, `RAISE-PRD.md` and
`RAISE-DESIGN.md` were not modified by this pass, and no
`## NEEDS_PRD_CONFIRMATION` signal is raised (the business decision on F-22
is already confirmed). See the "Document Status" section's Change Log for
full detail.

**Version note (2026-08-29 re-sync, v0.6 → v0.7):** `RAISE-PRD.md` §16 Resolved
Question 40 and `RAISE-DESIGN.md` §5.2 (Warranty Domain) both resolved the previously
open Warranty field-list question (PRD Open Question 15): **for MVP,
`RAISE-FR-WARRANTY-001` has exactly one field — `warrantyExpiry`** (already implemented
on the Asset record). A draft 8-field proposal (start date, provider/vendor, type,
coverage details, cost, claim contact, document reference) was presented to the
business as a candidate list and was **explicitly rejected for MVP**, not deferred —
none of those seven fields is added here. **P-010 Warranty** below is updated to
replace its stale "Asset / Start Date / End Date / Status" field list with the
resolved single-field model; the Warranty Timeline (Active / Expiring / Expired) is
kept as a UI-computed display derived from `warrantyExpiry`, not a stored field. §27
Prototype Traceability Matrix's P-010 row is updated to reflect the resolved status.

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
├── Administration (admin-only, P-018)
│   └── Settings
│       └── Warranty (per-Asset-Category "Expiring" threshold, default 90 days)
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
for detail. **Administration / Settings (P-018)** was added 2026-09-01 (PRD
§16 Resolved Question 41; Design §4.1B/§5.4) — per Design §4.1B/§5.4's
explicit "not a general Settings framework" boundary, this is scoped
narrowly to Warranty threshold configuration only, not a general
application-settings area.

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
| P-012 | Alerts | P0 | RAISE-FR-ALERT-001 — five MVP trigger conditions and fixed-per-condition severity confirmed 2026-09-04 |
| P-013 | Audit Log | P0 | RAISE-FR-AUDIT-001 |
| P-014 | Executive Dashboard | P0 | RAISE-FR-EXEC-001 |
| P-015 | AI Assistant | P0 / Current AI | RAISE-AI-SEARCH-001 |
| P-016 | License Inventory | **Roadmap (not MVP)** | RAISE-FR-LICENSE-001 |
| P-017 | License Detail | **Roadmap (not MVP)** | RAISE-FR-LICENSE-001 |
| P-018 | Settings (Warranty Thresholds) | P0, admin-only | RAISE-FR-WARRANTY-001 (Design §4.1B / §5.4 Settings Domain) |

**P-018 note:** added 2026-09-01 (PRD §16 Resolved Question 41; Design v0.10 §4.1B/§5.4).
Not itself a separate PRD Traceability ID — Design §5.4 records the Settings Domain as a
design-layer addition, not a standalone PRD requirement — but it is the admin-facing home
for `RAISE-FR-WARRANTY-001`'s per-Asset-Category "Expiring" threshold, so it is listed
here as P0 (the same priority as the Warranty requirement it configures) and marked
admin-only per `RAISE-NFR-SEC-RBAC-001`. See [§23A P-018 Settings](#23a-p-018-settings)
for the full screen spec.

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

## Status Note — Corrected 2026-08-31 to Match As-Built (Open Finding F-22)

**This entry previously documented an "Asset Overview" wireframe (Total
Assets/NBV/Risk/Warranty Expiry tiles; "Asset by Category" / "Lifecycle /
Maintenance Overview" / "Recent Alerts" sections) that was never built —
word-for-word identical to the P-014 entry it duplicated.** Formal test
execution confirmed this gap against the actually shipped page —
`TC-DASH-01..03` (2026-08-29), recorded as [Open Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question)
in `OPEN-FINDINGS.md`. Per explicit business decision on F-22, this entry is
corrected to document the **actually shipped dashboard**, matching
[`RAISE-DESIGN.md` §13 "Logical Dashboard — Current MVP (As
Built)"](../02-design/RAISE-DESIGN.md#logical-dashboard--current-mvp-as-built).
This is a scope/spec correction to match reality, not a new requirement.

**P-002 and P-014 document the same built page.** `frontend/src/pages/
Dashboard/index.tsx` is the single dashboard shipped for both the general
"Main Dashboard" navigation entry point (P-002) and the "Executive
Dashboard" concept named in the PRD (P-014, `RAISE-FR-EXEC-001`) — there is
no separate executive-only page. This entry and [§20 P-014 Executive
Dashboard](#20-p-014-executive-dashboard) intentionally describe the same
tile/section list rather than two divergent specs, to avoid re-introducing
the drift that caused F-22. See P-014 for the requirement-facing framing of
this same page.

## Purpose

Provide an overview of asset information (general navigation entry point).

## Sections (As Built)

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         Dashboard (As Built)                        │
├────────────┬────────────┬────────────┬──────────────┬───────────────┤
│Total Assets│ Available  │  Assigned  │In Maintenance│Expired Warranty│
├────────────┼────────────┼────────────┴──────────────┴───────────────┤
│  Software  │  Monthly   │  Monthly Cost                             │
│  Licenses  │Depreciation│  (both illustrative — no depreciation      │
│            │(illustrative)│ model exists yet)                        │
├────────────┴────────────┴────────────────────────────────────────────┤
│ AI Insights                                                          │
│ AI Portfolio Health                                                  │
│ Oracle FA Reconciliation ("Oracle FA Synced")                        │
│ Asset Lifecycle (acquisitions / retirements chart)                   │
│ Department Distribution                                              │
│ Asset Status                                                         │
│ Asset Type                                                           │
│ Pending Approvals                                                    │
│ Recent Activities                                                    │
│ Maintenance Calendar                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**KPI grid (8 tiles):** Total Assets, Available, Assigned, In Maintenance,
Expired Warranty, Software Licenses, Monthly Depreciation (illustrative — no
depreciation model has been built), Monthly Cost (illustrative, same
caveat).

**Sections (10):** AI Insights, AI Portfolio Health, Oracle FA
Reconciliation (a.k.a. "Oracle FA Synced"), Asset Lifecycle
(acquisitions/retirements chart), Department Distribution, Asset Status,
Asset Type, Pending Approvals, Recent Activities, Maintenance Calendar.

None of these tiles/sections has a PRD-defined field list, formula, or
threshold beyond what the page already computes from existing Asset/
Maintenance/Warranty/License data — this entry does not invent one; it
documents what exists.

## NBV/Risk/Utilization — Proposal KPIs, Not Yet Implemented

The PRD identifies NBV, Risk, and Utilization as proposal-defined KPIs under
`RAISE-FR-EXEC-001`. **None of the three appears in the shipped dashboard's
KPI grid above.** This remains an explicit open item — a separate,
not-yet-scheduled enhancement layered on top of the current MVP dashboard,
not a silently dropped requirement.

- **Utilization's definition is already resolved** (PRD §16 Resolved
  Questions 27 and 29): Utilization = % of time an asset is assigned to a
  user/department, relative to total available time, computed as a
  real-time snapshot with Disposed/Retired/Under-Maintenance assets excluded
  from the denominator. Only its *implementation* on the dashboard is
  outstanding.
- **NBV and Risk formulas, thresholds, and dashboard placement remain TBD**
  — see [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions)
  §16 Q3–Q4, tracked as [Open Finding
  F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement).

See [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence)
§13 for the full as-built correction narrative and change log.

## Traceability

General product navigation / `RAISE-FR-EXEC-001` (the shipped page also
realizes P-014's Executive Dashboard concept — see [§20 P-014 Executive
Dashboard](#20-p-014-executive-dashboard)). Consistent with the Prototype
Traceability Matrix's existing treatment (§27), P-002 is not given its own
formal matrix row because it traces to general product navigation rather
than a single numbered PRD requirement in isolation; the requirement-facing
row for this same built page is recorded against P-014.

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
- Warranty status (3-state Active/Expiring/Expired badge — see P-010 Warranty for the
  computed-status model and its per-Asset-Category threshold, sourced from P-018
  Settings)
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

**Warranty section field list:** the "Warranty" section above surfaces the single
`warrantyExpiry` field resolved for `RAISE-FR-WARRANTY-001` (PRD §16 Resolved Question 40;
Design §5.2) — see P-010 Warranty for the full field-list detail and the rejected
8-field draft. No additional warranty fields are assumed on this screen. The section
also shows the derived 3-state Active/Expiring/Expired warranty status badge, computed
against the asset's category's configured Expiring threshold (default 90 days,
admin-adjustable via **P-018 Settings** — PRD §16 Resolved Question 41; Design §5.2/§5.4)
— see P-010 Warranty for the full status-model detail.

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

**Resolved 2026-09-01 (Open Finding F-27, per explicit business decision):**
"sub-category" is **not** a new field or data model — it is the existing
`type` field already present on the Asset record end-to-end
(`go-template-main/sql/pg/V1__Assets_Table.sql` `type varchar(100)`;
`model/assetModel.go` `Type string`; `frontend/src/data/fixtures/mockData.ts`
already populates it on every seeded asset). The hierarchy is exactly
**2 levels — Category → Type → individual assets** — not a deeper, freely
nested taxonomy.

The tree below shows the real, currently-seeded Category → Type breakdown,
derived directly from `frontend/src/data/fixtures/mockData.ts` (not
invented). It is illustrative-but-real: this is a **live, data-derived
grouping**, not a fixed enumerated taxonomy — the specific `type` values
listed under each category will grow as more assets with new `type` values
are added, and no closed list of allowed `type` values is being defined
here.

```text
Category (by `category` field)
│
├── IT Hardware
│   ├── Laptop
│   ├── Monitor
│   └── Headphones
│
├── Mobile
│   ├── Smartphone
│   └── Tablet
│
├── Office Equipment
│   ├── Printer
│   └── Projector
│
├── Infrastructure
│   ├── Server
│   └── Router
│
└── Media Equipment
    └── Camera
```

(sub-levels = distinct `type` values currently present within each
`category` value; individual assets nest one level further below each
`type`, per the flat category-to-assets grouping already resolved by
Open Finding F-25.)

This replaces the prior "Computer / Notebook / Desktop", "Network / Switch
/ Router" example tree, which did not match any real category names in the
app and was explicitly marked TBD/illustrative-only. The **"By Category"**
view (currently Category → flat asset list) is to be extended one level to
Category → Type → asset list to match this structure; no new UI screen is
introduced by this change.

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

**Holder data model — resolved 2026-09-01 (PRD §16 Resolved Question 42; Design
§4.2):** the "Holder" shown in this screen (Current Holder and each History row) is a
**direct 1:1 link to an Employee record** (`Asset.assignedEmployeeId`/`assignedTo`).
No additional organizational relationship model (department, team, or location-based
custody) is part of MVP — the prototype's "Holder" column should be read as an Employee
name/identifier only, not a department/team/location value.

**Custody-history write path — still open (Open Finding F-10, not resolved by PRD §16
Resolved Question 42):** whether this history table records only Check-in/Check-out
events (`RAISE-FR-OPS-002`, see P-008) or also other custody-changing events (e.g., a
separate direct-reassignment path) remains a genuinely open question. PRD §16 Resolved
Question 42 confirmed that Check-in/Check-out itself is a single **immediate
state-change operation** with **no approval step and no exception-handling workflow**
— but it was never asked, and the user never confirmed, whether Check-in/Check-out is
the *exclusive* writer of Custody History. The fact that no other code path currently
exists to write Custody History is a fact about the current build, not a confirmed
business rule about what mechanisms are allowed. This overlap between
`RAISE-FR-ASSET-003` (Custody History) and `RAISE-FR-OPS-002` (Check-in/Check-out) is
tracked as **Open Finding F-10** in
[`OPEN-FINDINGS.md`](../project-management/OPEN-FINDINGS.md) — Status: Open. The generic
"Action" column (Assigned/Transferred) is retained as-is pending that resolution — no
new Action value is invented. See
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

Support asset custody operations. **As of 2026-09-02 (PRD §16 Resolved Question 43;
Design §4.2 "IT Hardware Assignment Approval Workflow"), Check-out (Assign) of an asset
in the IT Hardware Asset Category is a category-scoped exception to the general
immediate-state-change flow below** — see "IT Hardware Assignment Approval Workflow"
subsection further down. Check-in (every category, including IT Hardware) and Check-out
of every other category (Mobile, Office Equipment, Infrastructure, Media Equipment)
are unaffected and remain exactly as described in the general model.

## Workflow, Permission, and Holder Model — Resolved 2026-09-01 (PRD §16 Resolved Question 42; Design §4.2)

Check-in/Check-out is confirmed as an **immediate state-change operation** — there is
**no approval step, no exception-handling workflow, and no multi-stage process** — this
is **deliberately simpler** than `RAISE-FR-MAINT-001`'s 4-stage workflow (see P-009),
not an inconsistency to reconcile. The permission gate is **any authenticated user, no
role restriction**: "a user with appropriate permission" means simply "is logged in,"
matching the already-confirmed MVP UI-only/client-side RBAC enforcement level (no
backend enforcement in MVP — see P-001's Traceability note). The Holder selected in
Check-out and confirmed in Check-in is a **direct 1:1 link to an Employee record**
(`Asset.assignedEmployeeId`/`assignedTo`) — no department/team/location selection is
part of this screen. This matches already-built, already-tested behavior in
`frontend/src/pages/AssetDetail/index.tsx`'s Assign/Check-in flow; no new field,
workflow step, or role is invented here.

**Narrowed 2026-09-02 for one category only (PRD §16 Resolved Question 43; Design
§4.2 "IT Hardware Assignment Approval Workflow") — does not reopen or reverse the
paragraph above.** This general model continues to apply exactly as written to: Check-in
for every asset category, and Check-out (assignment) for every category **except IT
Hardware**. Check-out of an **IT Hardware** category asset instead goes through the
4-stage approval workflow described below before the asset's status becomes Assigned.

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

No approval step or exception-handling workflow exists for this operation — resolved
2026-09-01 (PRD §16 Resolved Question 42; Design §4.2); see the Workflow, Permission,
and Holder Model note above. **This applies to Check-in for every category, and to
Check-out for every category except IT Hardware** — for IT Hardware Check-out, see the
subsection immediately below.

## IT Hardware Assignment Approval Workflow — Category-Scoped Exception (confirmed 2026-09-02, PRD §16 Resolved Question 43; Design §4.2)

Applies **only** to Check-out (assigning) an asset whose Asset Category is **IT
Hardware**. All other categories, and Check-in for every category (including IT
Hardware), are unaffected and use the general immediate flow above.

**Real-world source (context, not itself a requirement):** a real Singer Thailand
company form, "ใบดำเนินการเกี่ยวกับคอมพิวเตอร์และอุปกรณ์" (IT Equipment Processing Form,
Version 2024), requires 4 physical signatures for an IT equipment handover. The
confirmed digital workflow merges the paper form's recipient signature and the
recipient's-supervisor signature into a single digital step (Stage 2 below) — a
deliberate business simplification, not an oversight.

**Trigger (Stage 1 — Initiation):** identical to today's Assign action on this screen —
an IT/Admin user selects an employee and clicks Assign. The one difference for IT
Hardware: instead of the asset immediately becoming **Assigned**, it enters a new
**pending** state (design-layer name: `PENDING_RECIPIENT_CONFIRMATION`) and an
**Assignment Approval Request** record is created, tracking the asset, the recipient
employee, the current stage, and a per-stage actor/timestamp (Design §4.2).

```text
Asset Detail (IT Hardware asset, currently Available)
────────────────────────────────────────────────────
[ Assign ▾ ] → Select employee → Confirm
        ↓
Status badge changes from "Available" to a pending-approval indicator
(e.g., "Assignment Pending — Awaiting Recipient Confirmation")
— NOT "Assigned" yet
```

**Stage-progress indicator — pattern reused from P-009 Maintenance (design-layer UI
choice, not a PRD-defined field):** the closest existing MVP precedent for a multi-actor,
multi-stage approval flow is P-009's Maintenance ticket workflow (submit → approve/
reject → dispatch → status-update/complete). This screen reuses that same visible
stage-progress-indicator pattern, relabeled for this workflow's 4 stages:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Assignment Approval Request: AAR-XXXX             Asset: RAISE-XXXX     │
├────────────────────────────────────────────────────────────────────────┤
│  Stage 1            Stage 2                Stage 3          Stage 4    │
│  Initiation      → Recipient             → IT             → IT          │
│  (IT/Admin)         Confirmation            Processing       Supervisor │
│                     (Recipient)             (IT_STAFF)       Approval   │
│                                                                (IT_MGR) │
│  ●───────────────────○──────────────────────○──────────────○          │
│  Done               Current                Pending        Pending     │
└────────────────────────────────────────────────────────────────────────┘
```

### Per-Stage Screen Concepts

**Stage 1 — Initiation (IT/Admin)**

```text
Asset Detail — Assign action (unchanged trigger)
────────────────────────────────────
Select employee (recipient)
[ Assign ]
        ↓
State: PENDING_RECIPIENT_CONFIRMATION
Asset status: remains "Available" in data terms, shown to users as a
pending-approval indicator (not "Assigned")
```

**Stage 2 — Recipient Confirmation (the assigned employee, own action)**

```text
My Pending Assignments (Recipient's own view — new UI surface)
────────────────────────────────────
Asset | Category | Initiated by | Initiated on
[ Confirm Receipt ]
        ↓ (Confirm)
State: PENDING_IT_PROCESSING
```

- Combines the paper form's recipient-signature and recipient's-supervisor-signature
  steps into this one digital action, per explicit business decision — no separate
  "recipient's supervisor approves" screen or step exists.
- **No recipient-decline/reject path is defined** — the business was only asked about
  `IT_STAFF`/`IT_MANAGER` rejecting (Stages 3–4), not about the recipient declining.
  This prototype does not invent a "Decline" button here; only "Confirm Receipt" is
  shown. This is a gap, not a design decision — flagged, not silently resolved.
- **Not designed here (genuinely open, not decided either way):** any e-signature or
  legal-acknowledgment-text capture UI at this step. The paper form's liability
  acknowledgment text is real context for *why* an active confirmation step exists, but
  the PRD and Design explicitly do not decide whether to capture that text or a
  signature digitally — this remains open, tracked via the PRD's own
  `## NEEDS_PRD_CONFIRMATION` note. This prototype shows only a plain "Confirm Receipt"
  action and does not invent any acknowledgment-capture element.

**Stage 3 — IT Processing (`IT_STAFF`)**

```text
IT Processing Queue (IT_STAFF view — new UI surface)
────────────────────────────────────
Asset | Category | Recipient | Confirmed on

Processing action:
┌──────────────────────────────────────────┐
│ [ Process / Forward for Approval ]       │
│ [ Reject ]                                │
└──────────────────────────────────────────┘
        ↓ (Process)                ↓ (Reject)
State: PENDING_IT_SUPERVISOR_APPROVAL   State: REJECTED
                                          Asset status → Available (terminal)
```

**Stage 4 — IT Supervisor Approval (`IT_MANAGER`)**

```text
IT Supervisor Approval Queue (IT_MANAGER view — new UI surface)
────────────────────────────────────
Asset | Category | Recipient | Processed by | Processed on

Approval action:
┌──────────────────────────────────────────┐
│ [ Approve ]                               │
│ [ Reject ]                                │
└──────────────────────────────────────────┘
        ↓ (Approve)                ↓ (Reject)
State: ASSIGNED                     State: REJECTED
Asset status → Assigned             Asset status → Available (terminal)
(existing status value —
no new status name introduced)
```

### Rejection

Rejecting at Stage 3 or Stage 4 (`IT_STAFF` or `IT_MANAGER`) returns the asset
**immediately to Available** and ends the flow — **terminal, no reopening**, matching
the existing P-009 Maintenance `REJECTED_BY_DEPT` terminal-state precedent. No path
reopens a rejected Assignment Approval Request; a new Assign action (Stage 1) must be
started over.

### Conceptual State Model (mirrors Design §4.2)

```text
PENDING_RECIPIENT_CONFIRMATION → PENDING_IT_PROCESSING → PENDING_IT_SUPERVISOR_APPROVAL → ASSIGNED
                    │                        │                          │
                    └────────────────────────┴──────────── REJECTED (Stage 3/4 only) → Available
```

### Roles

No new Role is introduced. Stage 3 and Stage 4 reuse the existing `IT_STAFF` and
`IT_MANAGER` roles already confirmed under `RAISE-NFR-SEC-RBAC-001`. This is the one
specific case on this screen where Check-out is **not** gated merely by "any
authenticated user" — for Stage 3/4 actions specifically, a role is required. As with
P-009, this prototype does not implement real role-gating logic (MVP RBAC enforcement
is UI-only/client-side per PRD §16 Resolved Question 38) — the Stage 3/4 queue views
above are shown as concepts only, not an approved permission-enforcement mechanism.

### Open Design Point — Custody History Write Timing (genuinely undecided, not invented here)

**Cross-referenced from Design §4.2's own explicitly-flagged open design point — not
resolved by this prototype.** Whether `RAISE-FR-ASSET-003` Custody History is written
only once, at final (Stage 4) approval, or at each of the 4 stage transitions
individually, is **not defined** by PRD §16 Resolved Question 43 or by Design §4.2. This
prototype does not invent an answer or show a specific Custody History entry at any
particular stage transition above — see [§12 P-006 Custody
History](#12-p-006-custody-history) for the existing Custody History screen, which is
unaffected by this open point until it is resolved.

### Explicitly Not Designed Here

Per the PRD's and Design's own non-decisions, this prototype does not add:

- A "recipient's own supervisor" relationship/field to the Employee data model.
- Any PDF/document generation of the physical form.
- Any e-signature or legal-acknowledgment-text capture UI at Stage 2 (see Stage 2 note
  above — flagged as open, not decided either way).
- Any change to `RAISE-FR-LICENSE-001` (License/software-install tracking) — unaffected.
- Any recipient-decline/reject UI at Stage 2 (see Stage 2 note above).

## Traceability

`RAISE-FR-OPS-002` — general workflow shape (immediate state-change, no approval/
exception handling), permission gate (any authenticated user), and holder data model
(direct Employee link) all confirmed 2026-09-01, PRD §16 Resolved Question 42; Design
§4.2. **Narrowed 2026-09-02 (PRD §16 Resolved Question 43; Design §4.2 "IT Hardware
Assignment Approval Workflow"):** Check-out (assign) of an IT Hardware category asset
requires the 4-stage approval workflow above (Initiation → Recipient Confirmation → IT
Processing → IT Supervisor Approval), gated at Stages 3–4 by `IT_STAFF`/`IT_MANAGER`
(`RAISE-NFR-SEC-RBAC-001`, no new role) — all other categories and all Check-in
unaffected. Also traces to `RAISE-FR-ASSET-002` (Asset Category — IT Hardware is the
category key that triggers the exception) and `RAISE-FR-ASSET-003` (Custody History —
write-timing across the 4 stages is a still-open design point, not resolved here; see
above). Not resolved by any of this: the general RBAC role/permission-matrix content for
other domains (PRD §16 Q21–Q22), which remains TBD; any recipient-decline path at Stage
2; and the e-signature/acknowledgment-text question at Stage 2 (both flagged above, not
invented).

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

**Field list resolved 2026-08-29** (PRD §16 Resolved Question 40, resolving PRD Open
Question 15; Design §5.2 Warranty Domain): for MVP, the Asset record carries exactly
one Warranty field — `warrantyExpiry` (already implemented). A draft 8-field proposal
(start date, provider/vendor, type, coverage details, cost, claim contact, document
reference) was presented to the business as a candidate list and was **explicitly
rejected for MVP**, not deferred — none of those fields is shown below or assumed
elsewhere in this prototype. **Expiring-threshold shape resolved 2026-09-01** (PRD §16
Resolved Question 41, resolving Open Question 15b — a follow-on to Resolved Question 40,
not a reopening of it): this does **not** add a new Warranty field to the Asset
record — the threshold lives on a separate Settings-domain configuration record, see
below.

```text
Warranty
────────────────────────────
Asset
warrantyExpiry

Warranty Status (derived, not a stored field) — 3-state
────────────────────────────
Active / Expiring / Expired
```

**Warranty Status — 3-state, computed (resolved 2026-09-01, Design §5.2):** status is
computed at read time from `warrantyExpiry`, a threshold (in days), and the evaluation
date ("now") — it is not a stored field:

- **Active** — `warrantyExpiry` is further away than the threshold.
- **Expiring** — `warrantyExpiry` falls within the threshold window from today.
- **Expired** — `warrantyExpiry` has already passed.

**Expiring threshold — per-Asset-Category configurable, default 90 days (resolved
2026-09-01, PRD §16 Resolved Question 41; Design §5.2/§5.4):** the threshold used to
compute the "Expiring" boundary is **not** a single fixed global number — it is looked
up per the asset's Asset Category (`RAISE-FR-ASSET-002`) from a Settings-domain
configuration record (`WarrantySettings: Record<AssetCategory, thresholdDays>`), not
stored on the Asset or Warranty record itself. All 5 current Asset Categories (IT
Hardware, Mobile, Office Equipment, Infrastructure, Media Equipment) default to **90
days**; an admin may adjust each category's threshold independently via **[P-018
Settings](#23a-p-018-settings)** (new screen, see below). This resolves the previously
open threshold question referenced in the prior draft of this section (which had
described "Expiring" as not implemented pending confirmation).

**Implementation direction confirmed 2026-08-29, threshold model confirmed 2026-09-01:**
per explicit user decision, the Warranty field is **not** built as a dedicated P-010
screen — it is surfaced on the relevant existing asset page instead. A "Warranty" column
on `P-003 Asset Registry` (the Assets list) and the "Warranty & Coverage" section on
`P-004 Asset Detail` both show `warrantyExpiry` and the full 3-state Active/Expiring/
Expired badge, computed against the asset's category's configured threshold (sourced
from Settings, default 90 days). This section of the Prototype is retained for
historical/traceability purposes (it's what the field-list and threshold decisions
resolved against) but should **not** be read as a pending build target — no standalone
Warranty screen is planned; the threshold's admin-editable home is P-018 Settings, not a
new Warranty screen.

## Example RAISE Use Case

The prototype should demonstrate the ability to identify assets
approaching warranty expiry.

Example:

```text
Warranty expires within category threshold (default 90 days)
        ↓
List affected assets
        ↓
Open Asset Detail
```

This reflects the RAISE business example without implementing AI
Recommendation. **Note:** the "90 days" figure in this example is illustrative and is
now the confirmed **default** for all 5 current Asset Categories, not a single fixed
global number — see the Expiring-threshold subsection above and PRD §16 Resolved
Question 41.

## Traceability

`RAISE-FR-WARRANTY-001` — field list resolved 2026-08-29 (`warrantyExpiry` only for
MVP; see PRD §16 Resolved Question 40 and Design §5.2). Expiring-threshold shape
resolved 2026-09-01: per-Asset-Category configurable, default 90 days, admin-adjustable
via **P-018 Settings** (see PRD §16 Resolved Question 41 and Design §5.2/§5.4). Also
depends on `RAISE-FR-ASSET-002` (Category, as the threshold key) and
`RAISE-NFR-SEC-RBAC-001` (admin-only access to edit thresholds, via P-018).

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

## Status Note — Updated 2026-09-04 to Reflect Confirmed Trigger Conditions/Severity (PRD §16 Resolved Question 44; Design §14)

**This entry previously showed the scoped-down first cut of this screen: the only
trigger condition was Warranty EXPIRED, and severity was rendered honestly as "Not yet
defined" because no severity model had been decided.** PRD v0.15 §16 Resolved Question
44 and Design v0.13 §14 ("Alert Architecture") now confirm **five** MVP trigger
conditions and a fixed 3-level (High/Medium/Low) severity scale assigned **per
condition type** — this entry is rewritten to reflect that. This is a spec update to
match a newly-confirmed business decision, not a reinterpretation of
`RAISE-FR-ALERT-001`'s existing scope.

**Read-time derivation, no stored Alert record (Design §14).** Nothing below implies an
Alert table, an Alert entity, or a persisted alert state (e.g., no read/unread, no
acknowledge/dismiss, no snooze). Every row on this screen is the output of evaluating
current Asset, Maintenance ticket, and IT Hardware Assignment Approval Request state at
the moment the screen is displayed.

## Purpose

Display, at read time, the five confirmed MVP alert conditions derived from
already-existing Asset, Maintenance ticket, and IT Hardware Assignment Approval Request
state — with severity and the affected record — to an authorized user (role/permission
detail for alert visibility remains TBD, see Open Question below).

## Five MVP Trigger Conditions and Severity (confirmed 2026-09-04)

| Condition | Derived From | Severity | Affected Record Type |
|---|---|---|---|
| Warranty **EXPIRED** | `Asset.warrantyExpiry` in the past | High | Asset |
| Maintenance ticket **OVERDUE** | Ticket `targetResolutionDate` passed AND status != `DONE` | High | Maintenance ticket |
| Warranty **EXPIRING** | `Asset.warrantyExpiry` inside the existing per-Asset-Category Expiring threshold (default 90 days, see P-010 Warranty / P-018 Settings) | Medium | Asset |
| Maintenance ticket **ON_HOLD** | Ticket status is `ON_HOLD` | Medium | Maintenance ticket |
| IT Hardware handover **PENDING** | Assignment Approval Request is at any non-terminal stage of the P-008 4-stage IT Hardware Assignment Approval Workflow | Low | Handover (Assignment Approval Request) |

No condition beyond these five, and no severity level beyond High/Medium/Low, is shown
on this screen. Severity is fixed per condition type — it is **not** computed from
days-overdue, asset value, or any asset-criticality field (no such field exists in the
data model).

## Prototype

```text
Alerts
──────────────────────────────────────────────────────────────────
Severity   Condition                    Affected Record
──────────────────────────────────────────────────────────────────
High       Warranty Expired             Asset A          → Asset Detail (P-004)
High       Maintenance Ticket Overdue   Ticket MR-0042    → Maintenance Request
                                                             Detail (P-009)
Medium     Warranty Expiring            Asset B          → Asset Detail (P-004)
Medium     Maintenance Ticket On Hold   Ticket MR-0031    → Maintenance Request
                                                             Detail (P-009)
Low        IT Hardware Handover Pending Asset C           → Assignment Approval
                                                             Request Detail (P-008)
──────────────────────────────────────────────────────────────────
```

Each row shows the condition, its fixed severity, and the affected record. Selecting a
row navigates to the record's existing detail view — there is no dedicated "Alert
Detail" destination screen, and none is invented here:

- **Warranty EXPIRED / EXPIRING** rows link to **[P-004 Asset Detail](#10-p-004-asset-detail)**
  (the asset whose `warrantyExpiry` triggered the condition) — this matches the linking
  behavior already shown in the prior version of this screen.
- **Maintenance ticket OVERDUE / ON_HOLD** rows link to the **Maintenance Request Detail
  View** within **[P-009 Maintenance](#15-p-009-maintenance)** ("Prototype — 4-Stage
  Workflow (Request Detail View)") — the closest existing screen that shows a single
  ticket's stage/status.
- **IT Hardware Handover PENDING** rows link to the **Assignment Approval Request**
  detail/stage-progress view within **[P-008 Check-in / Check-out](#14-p-008-check-in--check-out)**
  ("IT Hardware Assignment Approval Workflow" subsection) — the closest existing screen
  that shows a single handover's stage/status.

**Not a new screen:** the affected record is no longer always an Asset (as it was when
Warranty EXPIRED was the only condition) — it is now an Asset, a Maintenance ticket, or
a Handover depending on condition type. This is handled by pointing each condition at
the existing detail screen for its record type, per the three bullets above, not by
introducing a new "Ticket Detail" or "Handover Detail" screen ID.

Email / Teams / LINE Notify remain Phase 2 / Enterprise Roadmap and are not shown as
MVP delivery channels — carried forward unchanged from the prior version of this
entry, per `RAISE-FR-ALERT-001`'s own Scope line and PRD §16 Resolved Question 44
(channel scope was not a new decision).

## Open Questions — Left Open, Not Decided Here

- **Header bell-icon dropdown (`NotificationCenter.tsx` in `AppShell`) — still
  unreconciled.** PRD §16 Resolved Question 35 lists it as confirmed **entirely out of
  RAISE scope** and distinct from `RAISE-FR-ALERT-001`, while
  [`ESAPS-UI-FOUNDATION-BASELINE.md`](../project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md)
  line 88 maps it **to** `RAISE-FR-ALERT-001` as EXTEND. PRD v0.15 §16 Resolved Question
  44 and Design v0.13 §14 both explicitly decline to resolve this contradiction. This
  entry (P-012, the Alerts screen/page) does **not** speak to the bell icon's contents
  or scope either way — it remains open for a future business confirmation round.
- **"Authorized user"** (who may view this screen) is unspecified beyond the general MVP
  RBAC enforcement-level decision (UI-only/client-side, backend deferred to Roadmap —
  see P-001 Login's Traceability note); PRD §16 Q22 / Open Finding F-08 tracks this
  separately and is unaffected by this update.
- Alert acknowledgement, dismissal, read/unread, snooze, delivery/scheduling/digesting,
  and notification preferences are all out of MVP scope and are not shown on this
  screen — consistent with Design §14's "Explicitly Not Designed Here."

## Traceability

`RAISE-FR-ALERT-001` — five MVP trigger conditions (Warranty EXPIRED/EXPIRING,
Maintenance ticket OVERDUE/ON_HOLD, IT Hardware Handover PENDING) and fixed-per-condition
High/Medium/Low severity confirmed 2026-09-04 (PRD §16 Resolved Question 44; Design §14
Alert Architecture). Dependencies (unchanged from PRD §6): `RAISE-FR-WARRANTY-001`,
`RAISE-FR-MAINT-001`, `RAISE-FR-OPS-002`.

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

## Status Note — Corrected 2026-08-31 to Match As-Built (Open Finding F-22)

**This entry previously documented an "Executive Asset Intelligence"
wireframe (NBV/Risk/Utilization tiles; "Asset Overview" / "Executive
Summary" sections) that was never built — word-for-word identical to the old
P-002 entry it duplicated.** Formal test execution confirmed this gap twice
against the actually shipped page — `TC-EXEC-001-01`/`-02` (2026-08-26) and
`TC-DASH-01..03` (2026-08-29) — recorded as [Open Finding
F-22](../project-management/OPEN-FINDINGS.md#confirmed-via-test-execution-not-blocked-on-any-prd-question)
in `OPEN-FINDINGS.md`. Per explicit business decision on F-22, this entry is
corrected to document the **actually shipped dashboard**, matching
[`RAISE-DESIGN.md` §13 "Logical Dashboard — Current MVP (As
Built)"](../02-design/RAISE-DESIGN.md#logical-dashboard--current-mvp-as-built).
This is a scope/spec correction to match reality — it does not add, remove,
or reinterpret `RAISE-FR-EXEC-001`.

**P-014 and P-002 document the same built page.** There is no separate
executive-only page: `frontend/src/pages/Dashboard/index.tsx` is the single
dashboard shipped for both the "Executive Dashboard" concept named in the
PRD (P-014, this entry) and the general "Main Dashboard" navigation entry
point ([§8 P-002 Main Dashboard](#8-p-002-main-dashboard)). This entry and
P-002 intentionally describe the same tile/section list rather than two
divergent specs, to avoid re-introducing the drift that caused F-22.

## Purpose

Provide an organization-level executive view (`RAISE-FR-EXEC-001`),
realized by the same dashboard page documented in P-002.

## Sections (As Built)

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         Dashboard (As Built)                        │
├────────────┬────────────┬────────────┬──────────────┬───────────────┤
│Total Assets│ Available  │  Assigned  │In Maintenance│Expired Warranty│
├────────────┼────────────┼────────────┴──────────────┴───────────────┤
│  Software  │  Monthly   │  Monthly Cost                             │
│  Licenses  │Depreciation│  (both illustrative — no depreciation      │
│            │(illustrative)│ model exists yet)                        │
├────────────┴────────────┴────────────────────────────────────────────┤
│ AI Insights                                                          │
│ AI Portfolio Health                                                  │
│ Oracle FA Reconciliation ("Oracle FA Synced")                        │
│ Asset Lifecycle (acquisitions / retirements chart)                   │
│ Department Distribution                                              │
│ Asset Status                                                         │
│ Asset Type                                                           │
│ Pending Approvals                                                    │
│ Recent Activities                                                    │
│ Maintenance Calendar                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**KPI grid (8 tiles):** Total Assets, Available, Assigned, In Maintenance,
Expired Warranty, Software Licenses, Monthly Depreciation (illustrative — no
depreciation model has been built), Monthly Cost (illustrative, same
caveat).

**Sections (10):** AI Insights, AI Portfolio Health, Oracle FA
Reconciliation (a.k.a. "Oracle FA Synced"), Asset Lifecycle
(acquisitions/retirements chart), Department Distribution, Asset Status,
Asset Type, Pending Approvals, Recent Activities, Maintenance Calendar.

None of these tiles/sections has a PRD-defined field list, formula, or
threshold beyond what the page already computes from existing Asset/
Maintenance/Warranty/License data — this entry does not invent one; it
documents what exists.

## NBV/Risk/Utilization — Proposal KPIs, Not Yet Implemented

The PRD identifies NBV, Risk, and Utilization as proposal-defined KPIs under
`RAISE-FR-EXEC-001`. **None of the three appears in the shipped dashboard's
KPI grid above.** This remains an explicit open item — a separate,
not-yet-scheduled enhancement layered on top of the current MVP dashboard,
not a silently dropped requirement.

- **Utilization — Resolved 2026-08-21 (PRD v0.3 §16 Resolved Question 27;
  mechanics resolved PRD v0.4 §16 Resolved Question 29):** Utilization = %
  of time an asset is assigned to a user/department, relative to total
  available time, computed as a real-time snapshot with Disposed/Retired/
  Under-Maintenance assets excluded from the denominator. Only its
  *implementation* on the dashboard is outstanding — no formula, threshold,
  or calculation logic is implemented today.
- **NBV and Risk formulas, thresholds, and dashboard placement remain TBD**
  — see [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions)
  §16 Q3–Q4, tracked as [Open Finding
  F-03](../project-management/OPEN-FINDINGS.md#blocking-gates-an-mvp-requirement).

See [`RAISE-DESIGN.md`](../02-design/RAISE-DESIGN.md#13-executive-intelligence)
§13 for the full as-built correction narrative and change log, including
the still-unresolved "AI-Generated Executive Summary" MVP-vs-Roadmap
ambiguity (not asserted to be satisfied by the "AI Insights" / "AI Portfolio
Health" sections above).

## Traceability

`RAISE-FR-EXEC-001` — realized by the same built page as [§8 P-002 Main
Dashboard](#8-p-002-main-dashboard); see that entry's Traceability note for
how the Prototype Traceability Matrix (§27) records this pairing.

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

# 23A. P-018 Settings

**New screen, added 2026-09-01** (PRD §16 Resolved Question 41, resolving Open
Question 15b; Design v0.10 §4.1B "Settings / Platform Configuration" and §5.4
"Settings Domain"). Not itself a separate PRD Traceability ID — Design §5.4 explicitly
records the Settings Domain as a design-layer addition, not a standalone PRD
requirement — but it is the confirmed, already-implemented admin-facing home for
`RAISE-FR-WARRANTY-001`'s per-Asset-Category "Expiring" threshold. Lettered `23A`
(rather than renumbered `24`) to avoid renumbering every subsequent section and its
cross-reference anchors, matching this document's existing precedent for §25A NFR
Backlog — Prototype Note.

## Status Banner

**Implemented, not exploratory.** Unlike P-016/P-017 (Roadmap, not MVP), P-018 is P0/MVP
and already implemented end-to-end: `frontend/src/types/settings.ts` (`WarrantySettings`
type), `frontend/src/services/settings-service.ts` and
`frontend/src/services/settings-repository.ts` (seed/read/update), and
`frontend/src/pages/Settings/index.tsx` (the "Warranty" section/tab).

## Purpose

Provide an admin-facing UI to view and edit platform configuration values. For MVP,
scoped to exactly one section: the Warranty "Expiring" threshold, per Asset Category.
**Not a general Settings framework** — see "Scope Boundary" below.

## Prototype Elements

```text
Settings
──────────────────────────────────────────────────────────
[ Warranty ]   ← section/tab (only section for MVP)

Warranty — "Days before expiry to flag as Expiring"
──────────────────────────────────────────────────────────
Asset Category            Threshold (days)
IT Hardware                [ 90 ]
Mobile                     [ 90 ]
Office Equipment           [ 90 ]
Infrastructure             [ 90 ]
Media Equipment            [ 90 ]

Actions: [ Save Changes ]   [ Reset ]
```

- One row per current Asset Category (`RAISE-FR-ASSET-002`) — exactly the 5 categories
  seeded in the app: IT Hardware, Mobile, Office Equipment, Infrastructure, Media
  Equipment. Not a closed enumerated list at the design level (Design §5.4), but the
  prototype shows the real, currently-seeded set, matching this document's existing
  convention for category lists (see P-005 Category & Hierarchy).
- Each row's threshold is an editable number input, defaulting to **90** (days) for
  every category at first setup.
- **Save Changes** persists edits to the `WarrantySettings` configuration record.
  **Reset** reverts unsaved edits (the exact reset semantics — revert to last-saved vs.
  revert to default 90 — mirror the as-built `frontend/src/pages/Settings/index.tsx`
  behavior and are not independently re-specified here).
- **Admin-only access.** Per `RAISE-NFR-SEC-RBAC-001` and Design §5.4 "Access Control,"
  write access (editing a threshold) is admin-only. Consistent with this document's
  existing MVP enforcement-level note (§4 User Roles; PRD §16 Resolved Question 38;
  Design §16 Security Architecture), MVP enforcement is UI-only/client-side — the same
  accepted MVP risk (server-side bypass not blocked) applies here and is not restated as
  a new risk. The role list, permission matrix, and authentication mechanism remain
  **TBD**, same as every other admin-gated area in this document.

## Scope Boundary

Per Design §4.1B/§5.4, this is explicitly **not** a general Settings/platform
configuration framework — it is scoped narrowly to exactly one confirmed need
(Warranty per-category thresholds). No other configuration area (e.g., alert rules,
maintenance SLA, license terms) is added here; adding one would require a separate,
future business confirmation, matching Design §5.4's own scope-creep boundary.

## User Flow

```text
Settings
      │
      └── Warranty section
               │
               ├── Edit a category's threshold (number input)
               ├── Save Changes → WarrantySettings updated
               │        │
               │        ▼
               │   Consumed by Warranty status computation
               │   on P-003 Asset Registry / P-004 Asset Detail
               │   (Active / Expiring / Expired badge)
               │
               └── Reset → discard unsaved edits
```

## Traceability

`RAISE-FR-WARRANTY-001` (sole current driver of this screen, per Design §4.1B) — Design
§4.1B/§5.4 explicitly frame this screen as design-layer only (not its own PRD
Traceability ID). Also depends on `RAISE-FR-ASSET-002` (Category, as the configuration
key) and `RAISE-NFR-SEC-RBAC-001` (admin-only access, MVP enforcement level UI-only per
PRD §16 Resolved Question 38). See PRD §16 Resolved Question 41 and Design §4.1B/§5.4 for
the full requirement/design basis.

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
Warranty (P-003 Asset Registry Warranty column / P-004 Asset Detail Warranty section)
 ↓
Expiring Assets (3-state badge — threshold sourced from the asset's category's
                  P-018 Settings entry, default 90 days)
 ↓
Asset Detail
 ↓
Maintenance / Financial Context
```

Requirement:

`RAISE-FR-WARRANTY-001` (Expiring threshold: per-Asset-Category configurable, admin
edits via P-018 Settings — PRD §16 Resolved Question 41; Design §5.2/§5.4)

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
| P-005 Category | RAISE-FR-ASSET-002 | Planned — sub-category taxonomy resolved 2026-09-01 (Open Finding F-27): sub-category = existing Asset `type` field, 2-level hierarchy (Category → Type), real 2026-09-01 seeded example shown, not a closed enumerated list |
| P-006 Custody | RAISE-FR-ASSET-003 | Planned — holder data model resolved 2026-09-01 (PRD §16 Resolved Question 42; Design §4.2): direct 1:1 link to Employee record, no additional organizational relationship model |
| P-007 QR / Barcode | RAISE-FR-OPS-001 | Planned |
| P-008 Check-in / Check-out | RAISE-FR-OPS-002 | Planned — workflow shape and permission gate resolved 2026-09-01 (PRD §16 Resolved Question 42; Design §4.2): immediate state-change operation, no approval/exception-handling workflow, any authenticated user. **Exception, confirmed 2026-09-02 (PRD §16 Resolved Question 43; Design §4.2 "IT Hardware Assignment Approval Workflow"):** Check-out (Assign) of an **IT Hardware** category asset specifically requires a new 4-stage approval workflow (Initiation → Recipient Confirmation → IT Processing (`IT_STAFF`) → IT Supervisor Approval (`IT_MANAGER`), no new role) before status becomes Assigned; rejection at Stage 3/4 returns the asset to Available (terminal). All other categories and all Check-in unaffected. Custody History write-timing across the 4 stages remains a genuinely open design point (Design §4.2), not resolved by this row; e-signature/acknowledgment-text capture at Stage 2 also remains open, not decided |
| P-009 Maintenance | RAISE-FR-MAINT-001 | Planned — 4-stage workflow shape reflected (confirmed 2026-08-21); SLA/vendor/cost model TBD |
| P-010 Warranty | RAISE-FR-WARRANTY-001 | Planned — field list resolved 2026-08-29 (PRD §16 Resolved Question 40; Design §5.2): `warrantyExpiry` only for MVP; 7-field draft explicitly rejected. Expiring-threshold shape resolved 2026-09-01 (PRD §16 Resolved Question 41; Design §5.2/§5.4): 3-state Active/Expiring/Expired status, per-Asset-Category configurable threshold (default 90 days, admin-adjustable via P-018 Settings) — implemented end-to-end |
| P-011 Oracle FA | RAISE-FR-ORACLE-001 | Planned |
| P-012 Alerts | RAISE-FR-ALERT-001 | Planned — five MVP trigger conditions (Warranty EXPIRED/EXPIRING, Maintenance ticket OVERDUE/ON_HOLD, IT Hardware Handover PENDING) and fixed-per-condition High/Medium/Low severity resolved 2026-09-04 (PRD §16 Resolved Question 44; Design §14 Alert Architecture); read-time derivation, no persisted Alert entity, no new detail screen — links to existing P-004 Asset Detail / P-009 Maintenance Request Detail / P-008 Assignment Approval Request detail by condition type. Header bell-icon dropdown (`NotificationCenter.tsx`) in/out-of-scope contradiction (Resolved Question 35 vs. `ESAPS-UI-FOUNDATION-BASELINE.md`) remains open, not decided by this row |
| P-013 Audit | RAISE-FR-AUDIT-001 | Planned |
| P-014 Executive | RAISE-FR-EXEC-001 | Planned — corrected 2026-08-31 to match as-built dashboard (Open Finding F-22); same built page as P-002 Main Dashboard; NBV/Risk/Utilization KPIs remain a separate, not-yet-scheduled enhancement |
| P-015 AI Assistant | RAISE-AI-SEARCH-001 | Planned |
| P-004 Asset Detail (incidental) | RAISE-AI-DOC-001 (OCR / Extraction) | Planned — no dedicated screen; TBD acceptance behavior |
| P-004 Asset Detail (incidental) | RAISE-AI-DOC-002 (Metadata) | Planned — no dedicated screen; TBD acceptance behavior |
| P-005 Category & Hierarchy (incidental) | RAISE-AI-DOC-003 (Classification) | Planned — no dedicated screen; TBD acceptance behavior |
| P-003 Asset Registry (incidental) | RAISE-AI-DOC-004 (Duplicate Detection) | Planned — no dedicated screen; TBD acceptance behavior |
| P-016 License Inventory | RAISE-FR-LICENSE-001 | **Roadmap, not MVP** — exploratory prototype screen mirroring already-built `frontend/src/pages/Licenses/`; field model/alert rule/seat tracking/vendor-cost tracking all TBD |
| P-017 License Detail | RAISE-FR-LICENSE-001 | **Roadmap, not MVP** — exploratory prototype screen mirroring already-built `frontend/src/pages/LicenseDetail/`; same TBD items as P-016 |
| P-018 Settings | RAISE-FR-WARRANTY-001 (Design §4.1B/§5.4 — not itself a separate PRD Traceability ID) | Implemented — new 2026-09-01 (PRD §16 Resolved Question 41; Design §4.1B/§5.4): admin-only Warranty section, one editable per-Asset-Category threshold, default 90 days, Save Changes / Reset |

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

**v0.7 re-sync (2026-08-29, against PRD v0.10 / Design §5.2):** `RAISE-FR-WARRANTY-001`'s
row is updated (not added) — PRD §16 Resolved Question 40 and Design §5.2 resolved the
previously open Warranty field-list question (PRD Open Question 15): `warrantyExpiry` is
the only Warranty field for MVP; a draft 8-field proposal was explicitly rejected, not
deferred. P-010 Warranty's field list and P-004 Asset Detail's Warranty section note are
both updated accordingly (see their respective sections). No screen, requirement ID, or
row was added or removed — this is a field-list correction only.

**v0.10 re-sync (2026-09-01, against PRD v0.12 / Design v0.10 §5.2/§5.4/§4.1B, PRD §16
Resolved Question 41):** `RAISE-FR-WARRANTY-001`'s P-010 row is updated (not added) to
record the resolved Expiring-threshold shape: 3-state Active/Expiring/Expired warranty
status, computed against a per-Asset-Category threshold (default 90 days,
admin-adjustable) rather than a single global constant. A new **P-018 Settings** row is
added — the admin-facing home for this threshold (Design §4.1B/§5.4; not itself a
separate PRD Traceability ID, so its Requirement column cites `RAISE-FR-WARRANTY-001` as
the driving requirement, matching how this table already handles other design-layer-only
areas). P-003 Asset Registry and P-004 Asset Detail's entries in this table are
unchanged — the 3-state badge is a spec detail within their existing
`RAISE-FR-ASSET-001`/`RAISE-FR-LIFE-001` rows, not a new requirement mapping. No other
row is affected.

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
- [x] `RAISE-FR-WARRANTY-001`'s Expiring threshold is represented as
      per-Asset-Category configurable (default 90 days), not a single fixed
      global number — P-010 Warranty's 3-state Active/Expiring/Expired model
      and the new P-018 Settings screen (admin-only, one threshold per Asset
      Category) match PRD §16 Resolved Question 41 and Design §5.2/§5.4/§4.1B
      (checked during v0.10 re-sync, 2026-09-01); no additional Warranty
      field beyond `warrantyExpiry` was added

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

**Version:** 0.13 (2026-09-02, PRD v0.14 §16 Resolved Question 43 / Design v0.12 §4.2
"IT Hardware Assignment Approval Workflow")

**Change Log — v0.13 → v0.14 (2026-09-04, PRD §16 Resolved Question 44 / Design §14
"Alert Architecture", per explicit business confirmation):**

1. **Root confirmation.** PRD v0.15 §16 Resolved Question 44 and Design v0.13 §14
   jointly confirm exactly **five** MVP `RAISE-FR-ALERT-001` trigger conditions, each
   derivable from fields that already exist (no new field, no data-model change):
   Warranty EXPIRED (`Asset.warrantyExpiry` in the past, High), Maintenance ticket
   OVERDUE (`targetResolutionDate` passed AND status != `DONE`, High), Warranty
   EXPIRING (existing per-Asset-Category threshold, default 90 days, Medium),
   Maintenance ticket ON_HOLD (Medium), and IT Hardware handover PENDING (any
   non-terminal stage of the P-008 4-stage workflow, Low). Severity is a fixed 3-level
   scale assigned **per condition type** — explicitly not by days-overdue, asset value,
   or an asset-criticality field. Alerts remain a **read-time derivation** with no
   persisted Alert entity (Design §14).
2. **[§18 P-012 Alerts](#18-p-012-alerts)** rewritten: replaces the prior scoped-down
   first cut (Warranty EXPIRED only, severity honestly marked "Not yet defined") with
   all five conditions and the confirmed severity mapping. The affected-record column is
   generalized from "always an Asset" to Asset / Maintenance ticket / Handover depending
   on condition type, each linking to its existing detail view — **P-004 Asset Detail**
   (Warranty EXPIRED/EXPIRING), the Maintenance Request Detail View within **P-009
   Maintenance** (Ticket OVERDUE/ON_HOLD), and the Assignment Approval Request
   detail/stage-progress view within **P-008 Check-in / Check-out** (Handover PENDING).
   **No new destination screen is introduced** — no "Ticket Detail" or "Handover
   Detail" screen ID is created; each condition is grounded in a screen that already
   exists in this document.
3. **Left open, not decided by this pass** (carried forward unchanged): whether the
   header bell-icon dropdown (`NotificationCenter.tsx` in `AppShell`) is in scope for
   `RAISE-FR-ALERT-001` — the unreconciled contradiction between PRD §16 Resolved
   Question 35 (out of scope entirely) and
   `docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md` (maps it to
   `RAISE-FR-ALERT-001` as EXTEND) is restated as open on P-012, not resolved. The
   "authorized user" access-gate detail (PRD §16 Q22 / Open Finding F-08) is likewise
   unaffected. Channel scope (single-channel, in-app only) was already the requirement's
   own Scope line, not a new decision, and is not presented as one.
4. **Explicitly not invented:** no sixth trigger condition (no preventive-maintenance-due
   condition — no next-service-date field exists; no software-license-expiry condition —
   `RAISE-FR-LICENSE-001` remains Roadmap and its relationship to alerting is separately
   TBD); no alert acknowledgement/dismissal/read-unread/snooze; no delivery/scheduling/
   digesting/notification-preference model.
5. **§5 Screen Inventory and §27 Prototype Traceability Matrix** — P-012 rows updated to
   note the five confirmed trigger conditions and fixed-per-condition severity.
6. **No other screen, requirement ID, or row is added, removed, or changed.** P-004,
   P-008, and P-009's own specs are unchanged — they are only cited/linked from P-012 as
   already-existing destination screens.
7. **`RAISE-PRD.md` and `RAISE-DESIGN.md` are not modified by this pass.** No
   `## NEEDS_PRD_CONFIRMATION` signal is raised — every trigger condition, severity
   value, and link target used here already exists in the PRD/Design sources cited.
8. Header metadata updated: Version bumped to 0.14; PRD Source updated to v0.15
   (advanced from v0.14); Design Source updated to v0.13 (advanced from v0.12), with the
   new §14 "Alert Architecture" section added to the cited section list.

**Change Log — v0.12 → v0.13 (2026-09-02, PRD §16 Resolved Question 43 / Design §4.2,
per explicit business confirmation, sourced from a real Singer Thailand company IT
Equipment Processing Form supplied this session):**

1. **Root confirmation.** PRD §16 Resolved Question 43 and Design v0.12 §4.2 "IT
   Hardware Assignment Approval Workflow" jointly confirm a **new, category-scoped
   exception** to the general Check-in/Check-out resolution (Resolved Question 42,
   already reflected in this document since v0.11): Check-out (assigning) an asset in
   the **IT Hardware** Asset Category now requires a **4-stage approval workflow**
   (Stage 1 Initiation — IT/Admin selects employee and clicks Assign, same trigger as
   today; Stage 2 Recipient Confirmation — the assigned employee confirms receipt
   themselves, combining the paper source form's recipient and recipient's-supervisor
   signatures into one digital step; Stage 3 IT Processing — `IT_STAFF`; Stage 4 IT
   Supervisor Approval — `IT_MANAGER`, only after which the asset's status becomes
   Assigned) before the asset's status becomes Assigned. Rejection at Stage 3 or 4
   returns the asset immediately to Available (terminal, no reopening). **No new Role is
   introduced.** This narrows, and does not reopen or reverse, the general resolution —
   Check-in for every category, and Check-out for every category except IT Hardware,
   are unaffected.
2. **[§14 P-008 Check-in / Check-out](#14-p-008-check-in--check-out)** updated: a new
   "IT Hardware Assignment Approval Workflow — Category-Scoped Exception" subsection
   added, describing the pending state entered at Stage 1, the recipient's own
   confirmation UI surface at Stage 2, the `IT_STAFF` processing queue at Stage 3, the
   `IT_MANAGER` approval queue at Stage 4, a stage-progress indicator reusing P-009
   Maintenance's closest existing 4-stage UI precedent, the rejection/terminal-state
   behavior, and the conceptual state model. The Purpose and "Workflow, Permission, and
   Holder Model" notes at the top of the section are updated to flag the narrowing
   without altering the general model they describe. The Traceability line is expanded
   to cite `RAISE-FR-ASSET-002` (Asset Category) and `RAISE-FR-ASSET-003` (Custody
   History) alongside `RAISE-FR-OPS-002`.
3. **Genuinely open points are recorded as open, not invented:** (a) whether Custody
   History is written once (Stage 4 approval) or at each of the 4 stage transitions is
   explicitly cross-referenced from Design §4.2's own flagged open design point and left
   undecided; (b) no recipient-decline/reject UI is shown at Stage 2 (the business was
   only asked about `IT_STAFF`/`IT_MANAGER` rejection); (c) no e-signature or
   legal-acknowledgment-text capture UI is shown at Stage 2 — this remains open per the
   PRD's own `## NEEDS_PRD_CONFIRMATION` note and is stated as still-open on P-008, not
   silently decided either way.
4. **Explicitly not invented:** no "recipient's own supervisor" field is added to the
   Employee model; no PDF/document generation; no change to `RAISE-FR-LICENSE-001`.
5. **§27 Prototype Traceability Matrix** — P-008 row updated with the confirmed
   category-scoped exception and the two still-open points above.
6. **No other screen, requirement ID, or row is added, removed, or changed.** P-009
   Maintenance's own spec is unchanged — it is only cited narratively as the closest UI
   precedent for P-008's new stage-progress indicator.
7. **`RAISE-PRD.md` and `RAISE-DESIGN.md` are not modified by this pass.** No
   `## NEEDS_PRD_CONFIRMATION` signal is raised for the workflow itself (the business
   decision is already confirmed); the e-signature/acknowledgment-text question is
   stated as still-open (matching how the PRD and Design already flag it), not raised as
   a newly-discovered gap.
8. Header metadata updated: Version bumped to 0.13; PRD Source updated to v0.14
   (advanced from v0.13); Design Source updated to v0.12 (advanced from v0.11), with the
   new §4.2 "IT Hardware Assignment Approval Workflow" subsection added to the cited
   section list.

**Change Log — v0.11 → v0.12 (2026-09-01, correction — reverting an unconfirmed scope
expansion introduced in v0.11):**

1. **What was wrong.** The v0.11 pass (below) stated that, in addition to the
   confirmed holder-data-model resolution, "the narrower 'does Check-in/Check-out
   exclusively write Custody History' question is now also settled (yes — there is no
   separate reassignment/exception path)," and described Check-in/Check-out as
   "effectively the only mechanism that writes Custody History for MVP." This was
   incorrect.
2. **Why it was wrong.** PRD §16 Resolved Question 42 (recorded via AskUserQuestion)
   confirmed exactly three items: (a) Check-in/Check-out is an immediate state-change
   operation with no approval step, (b) the permission gate is any authenticated user,
   and (c) the holder data model is a direct Employee link. The user was never asked
   about, and never confirmed, whether Check-in/Check-out is the *exclusive* writer of
   Custody History. That is a separate, still-open question, already tracked as
   **Open Finding F-10** in
   [`OPEN-FINDINGS.md`](../project-management/OPEN-FINDINGS.md) ("`RAISE-FR-ASSET-003`
   (Custody History) and `RAISE-FR-OPS-002` (Check-in/Check-out) cover adjacent
   ground; overlap flagged twice in the PRD's own Pre-Finalization Quality Pass
   without resolution" — Status: Open). Inferring an answer to F-10 from the
   observation that no other code path currently writes Custody History is a fact
   about the current build, not a confirmed business rule about what's allowed — this
   is exactly the kind of unconfirmed-scope-expansion `RAISE-PRD.md` forbids.
3. **What changed.** The top-of-doc v0.10 → v0.11 version note (§ above) and
   [§12 P-006 Custody History](#12-p-006-custody-history)'s "Custody-history write
   path" note are both reverted to state only that the holder data model is resolved
   (direct Employee link, PRD §16 Resolved Question 42), and to explicitly flag the
   exclusivity question as open and tracked under Open Finding F-10 — not settled.
   The Change Log entry for v0.10 → v0.11 (below) is corrected in place (item 3) with
   a note pointing to this correction, per this document's convention of never
   silently fixing a mistake.
4. **Unaffected.** The holder-data-model resolution (direct 1:1 Employee link) and
   the Check-in/Check-out workflow/permission-gate resolutions (items (a) and (b)
   above) are unaffected by this correction — those were genuinely confirmed via
   AskUserQuestion and remain resolved.
5. **`RAISE-PRD.md` and `RAISE-DESIGN.md` are not modified by this pass** — this is a
   correction to this document's own prior (incorrect) synthesis, not a change to
   either source document. No `## NEEDS_PRD_CONFIRMATION` signal is raised — F-10
   remains tracked as an existing Open Finding, not a newly discovered gap.
6. Header metadata updated: Version bumped to 0.12; PRD Source and Design Source
   citations unchanged (still v0.13 / v0.11 respectively — this pass changes no
   requirement or design content, only corrects this document's prior wording).

**Change Log — v0.10 → v0.11 (2026-09-01, PRD §16 Resolved Question 42 / Design §4.2,
per explicit business confirmation already implemented and verified end-to-end in
`frontend/src/`):**

1. **Root confirmation.** PRD §16 Resolved Question 42 (resolving PRD Open Questions
   11–13) and Design v0.11 §4.2 "Check-in/Check-out Workflow, Permission Gate, and
   Holder Model" jointly confirm: (a) **Workflow (Q11)** — `RAISE-FR-OPS-002`
   (Check-in/Check-out) is an **immediate state-change operation** — select a holder
   and confirm (Check-out/Assign), or confirm return (Check-in) — with **no approval
   step, no exception-handling workflow, and no multi-stage process**, deliberately
   simpler than `RAISE-FR-MAINT-001`'s 4-stage workflow (the two are confirmed as
   intentionally different shapes, not an oversight); (b) **Permission (Q12)** — **any
   authenticated user, no role restriction**, matching the already-confirmed MVP
   UI-only/client-side RBAC enforcement level; "appropriate permission" in
   `RAISE-FR-OPS-002` means simply "is logged in"; does not reopen the broader RBAC
   role/permission-matrix content question for other domains; (c) **Holder data model
   (Q13, `RAISE-FR-ASSET-003`)** — a **direct 1:1 link to an Employee record**
   (`Asset.assignedEmployeeId`/`assignedTo`); no additional organizational
   relationship model (department, team, or location-based custody) is needed for
   MVP.
2. **[§14 P-008 Check-in / Check-out](#14-p-008-check-in--check-out)** updated: a new
   "Workflow, Permission, and Holder Model — Resolved 2026-09-01" note added under
   Purpose; the stale "Exact approval rules and exception handling remain TBD." line
   removed and replaced with a statement that no approval step or exception-handling
   workflow exists; the Traceability line expanded to record the three confirmed items
   and to note that the general RBAC role/permission-matrix content for other domains
   remains TBD (not resolved by this confirmation).
3. **[§12 P-006 Custody History](#12-p-006-custody-history)** updated: the prior "Open
   ambiguity" note (holder data model undefined; unclear whether Check-in/Check-out
   exclusively writes Custody History) is replaced with a resolved note for the
   holder data model (direct Employee link). ~~and Check-in/Check-out is effectively
   the only mechanism that writes Custody History for MVP (since there is no separate
   reassignment/exception path)~~ **— CORRECTED in v0.12 (2026-09-01): this claim was
   wrong.** The exclusivity question was never asked of, or confirmed by, the user
   (PRD §16 Resolved Question 42 covers only workflow shape, permission gate, and
   holder data model — not write-path exclusivity); it remains open, tracked as Open
   Finding F-10 in [`OPEN-FINDINGS.md`](../project-management/OPEN-FINDINGS.md). See
   the v0.11 → v0.12 Change Log entry above for full detail. The generic "Action"
   column (Assigned/Transferred) is kept unchanged pending that resolution — no new
   Action value is invented.
4. **§27 Prototype Traceability Matrix** — P-006 and P-008 rows updated with the
   resolved status notes above.
5. **No new screen, field, workflow step, or role invented.** This pass matches
   already-built, already-tested behavior (`frontend/src/pages/AssetDetail/index.tsx`'s
   Assign/Check-in flow) — no code change accompanies this sync, only a spec
   correction resolving previously-TBD language.
6. **`RAISE-PRD.md` and `RAISE-DESIGN.md` are not modified by this pass.** No
   `## NEEDS_PRD_CONFIRMATION` signal is raised — the business decision (PRD §16
   Resolved Question 42) is already confirmed and matches as-built behavior.
7. Header metadata updated: Version bumped to 0.11; PRD Source updated to v0.13
   (advanced from v0.12); Design Source updated to v0.11 (advanced from v0.10), with
   §4.2 added to the cited section list.

**Change Log — v0.9 → v0.10 (2026-09-01, PRD §16 Resolved Question 41 / Design
§5.2/§5.4/§4.1B, per explicit business confirmation already implemented and verified
end-to-end in `frontend/src/`):**

1. **Root confirmation.** PRD §16 Resolved Question 41 (resolving new Open Question
   15b, a follow-on to Resolved Question 40 — not a reopening of it) and Design v0.10
   §5.2/§5.4/§4.1B confirm the `RAISE-FR-WARRANTY-001` "Expiring" threshold is
   **per-Asset-Category configurable**, defaulting to **90 days** for all 5 current
   Asset Categories (IT Hardware, Mobile, Office Equipment, Infrastructure, Media
   Equipment), admin-adjustable via a new Settings domain — not a single fixed global
   number as the illustrative source Business Example alone might suggest.
2. **Warranty status is now formally a 3-state model** (Active / Expiring / Expired),
   computed at read time from `warrantyExpiry`, the category's threshold, and the
   evaluation date — not a stored field. [§16 P-010
   Warranty](#16-p-010-warranty) is rewritten to state this explicitly, replacing the
   prior "2 of 3 states implemented, Expiring pending" note (which described the
   threshold as still unconfirmed — now resolved).
3. **New [§23A P-018 Settings](#23a-p-018-settings) screen added** — admin-only,
   documents the already-built `frontend/src/pages/Settings/index.tsx` "Warranty"
   section: one editable threshold (default 90) per Asset Category, Save Changes /
   Reset actions. Cross-references Design §4.1B "Settings / Platform Configuration"
   and §5.4 "Settings Domain." Explicitly scoped narrowly (not a general Settings
   framework), matching Design's own scope-creep boundary.
4. **P-003 Asset Registry and P-004 Asset Detail** updated to note their existing
   Warranty status displays now show the full 3-state badge (not 2-of-3), sourced from
   the asset's category's P-018-configured threshold. No new field is added to either
   screen — this is a status/threshold-model clarification only.
5. **§5 Screen Inventory** table gets a new P-018 row; **§3 Information Architecture**
   gets a new "Administration" branch (Settings → Warranty); **§26 Flow D — Warranty**
   updated to show the threshold source; **§27 Prototype Traceability Matrix** gets an
   updated P-010 row and a new P-018 row; **§28 Prototype Review Checklist** gets a new
   confirmation item.
6. **Field list unchanged.** This pass does **not** reopen or expand the Warranty
   field list settled by Resolved Question 40 — `warrantyExpiry` remains the only
   Warranty field on the Asset record; the threshold lives on a separate
   Settings-domain configuration record, not on the Asset or Warranty record.
7. **`RAISE-PRD.md` and `RAISE-DESIGN.md` are not modified by this pass.** No
   `## NEEDS_PRD_CONFIRMATION` signal is raised — the business decision (PRD §16
   Resolved Question 41) is already confirmed and implemented.
8. Header metadata updated: Version bumped to 0.10; PRD Source updated to v0.12
   (advanced from v0.10); Design Source updated to v0.10 (advanced from v0.9), with
   §5.2/§5.4/§4.1B added to the cited section list.

**Change Log — v0.8 → v0.9 (2026-09-01, Open Finding F-27 sub-category
taxonomy resolution, per explicit business decision):**

1. **Root cause.** [§11 P-005 Category &
   Hierarchy](#11-p-005-category--hierarchy) showed an illustrative example
   tree ("Computer / Notebook / Desktop", "Network / Switch / Router"),
   explicitly marked "TBD and must not be treated as finalized business
   data," that did not correspond to any real category name in the app —
   the real seeded categories in `frontend/src/data/fixtures/mockData.ts`
   are IT Hardware, Mobile, Office Equipment, Infrastructure, and Media
   Equipment. Recorded as Open Finding F-27 in `OPEN-FINDINGS.md`.
2. **Business decision confirmed:** the existing Asset `type` field IS the
   sub-category — no new field or data model is introduced. This field is
   already present end-to-end: `go-template-main/sql/pg/V1__Assets_Table.sql`
   (`type varchar(100)`), `model/assetModel.go` (`Type string`), and
   `frontend/src/data/fixtures/mockData.ts` (populated on every seeded
   asset).
3. **Hierarchy is exactly 2 levels** — Category → Type → individual assets —
   matching what the "By Category" view (currently Category → flat asset
   list) is to be extended to, one level further.
4. **P-005's Prototype tree rewritten** to the real, currently-seeded
   Category → Type breakdown, derived directly from
   `frontend/src/data/fixtures/mockData.ts` (not invented): IT Hardware →
   Laptop/Monitor/Headphones; Mobile → Smartphone/Tablet; Office Equipment →
   Printer/Projector; Infrastructure → Server/Router; Media Equipment →
   Camera. Explicitly framed as illustrative-but-real and data-derived — not
   a closed, fixed enumerated taxonomy; the specific `type` values within
   each category will grow as more assets are added.
5. **`RAISE-FR-ASSET-002` unchanged; `RAISE-PRD.md` and `RAISE-DESIGN.md` not
   modified by this pass.** This is a scope/spec correction resolving a
   previously-TBD open question, not a new requirement. No
   `## NEEDS_PRD_CONFIRMATION` signal is raised — the business decision on
   F-27 is already confirmed.
6. **§27 Prototype Traceability Matrix** row for P-005 updated to note the
   resolution. The separate, still-open `RAISE-AI-DOC-003` (Classification)
   incidental note on P-005 is unchanged by this pass — it concerns
   AI-suggested/assigned category values, a distinct question from the
   sub-category taxonomy resolved here.
7. Header metadata updated: Version bumped to 0.9; PRD/Design sources
   re-verified unchanged at v0.10/v0.9.

**Change Log — v0.7 → v0.8 (2026-08-31, Open Finding F-22 as-built
correction, per explicit business decision):**

1. **Root cause.** [§8 P-002 Main Dashboard](#8-p-002-main-dashboard) and
   [§20 P-014 Executive Dashboard](#20-p-014-executive-dashboard) specified
   an old "Asset Overview" / "Executive Asset Intelligence" wireframe
   (Total Assets/NBV/Risk/Warranty Expiry or NBV/Risk/Utilization tiles;
   "Asset by Category"/"Lifecycle-Maintenance Overview"/"Recent Alerts" or
   "Asset Overview"/"Executive Summary" sections) that was never built —
   the two entries were word-for-word identical to each other despite
   nominally describing different screens. Formal test execution confirmed
   this gap twice against the same shipped page,
   `frontend/src/pages/Dashboard/index.tsx` — `TC-EXEC-001-01`/`-02`
   (2026-08-26, testing P-014) and `TC-DASH-01..03` (2026-08-29, testing
   P-002) — recorded as Open Finding F-22 in `OPEN-FINDINGS.md`. Business
   explicitly decided to fix this prototype spec to match the shipped app
   (and `RAISE-DESIGN.md` v0.9 §13, corrected the same way immediately
   prior), rather than change the app to match the old wireframe.
2. **P-002 and P-014 rewritten** to document the real shipped tile/section
   list: KPI grid (Total Assets, Available, Assigned, In Maintenance,
   Expired Warranty, Software Licenses, Monthly Depreciation (illustrative),
   Monthly Cost (illustrative)) and sections (AI Insights, AI Portfolio
   Health, Oracle FA Reconciliation, Asset Lifecycle, Department
   Distribution, Asset Status, Asset Type, Pending Approvals, Recent
   Activities, Maintenance Calendar) — copied from `RAISE-DESIGN.md` v0.9
   §13's as-built list, with no field, formula, or threshold invented
   beyond what Design already states.
3. **P-002 and P-014 now explicitly state they document the same single
   built page** and cross-reference each other, rather than presenting two
   divergent specs as before. This is the corrective measure against the
   root cause in item 1.
4. **NBV/Risk/Utilization preserved, not deleted.** Both entries retain a
   dedicated "NBV/Risk/Utilization — Proposal KPIs, Not Yet Implemented"
   subsection recording these three as a separate, not-yet-scheduled
   enhancement layered on top of the current MVP dashboard — matching
   `RAISE-DESIGN.md` §13's framing exactly. Utilization's already-resolved
   definition and calculation mechanics (PRD §16 Resolved Questions 27/29)
   are restated unchanged; NBV and Risk formulas remain TBD per PRD §16
   Q3–Q4 / Open Finding F-03 — no new formula or threshold is added.
5. **`RAISE-FR-EXEC-001` unchanged; `RAISE-PRD.md` and `RAISE-DESIGN.md` not
   modified by this pass.** This is a scope/spec correction to match
   Design's already-corrected content, not a new requirement. No
   `## NEEDS_PRD_CONFIRMATION` signal is raised — the business decision on
   F-22 is already confirmed.
6. **§27 Prototype Traceability Matrix** row for P-014 updated to note the
   as-built correction and the shared-page relationship with P-002; the
   existing exclusion of P-002 from that requirement-ID-keyed table
   (general product navigation, not a single numbered PRD requirement) is
   unchanged and still documented in that section's cross-check note.
7. Header metadata updated: Version bumped to 0.8; Design Source updated to
   reference Design v0.9 (PRD unchanged at v0.10, re-verified during this
   pass).

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
