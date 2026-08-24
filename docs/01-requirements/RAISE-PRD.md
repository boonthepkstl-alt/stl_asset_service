# RAISE Product Requirements Document (PRD)

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document Type:** Product Requirements Document
**Version:** 0.10 Draft — target organization confirmed: **RAISE is developed for direct use by Singer (Thailand)** (§16 Resolved Question 39), not a generic platform — a branding/identity fact, no functional scope change. All six `## NEEDS_PRD_CONFIRMATION` items from `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 remain closed out (RAISE-FR-MAINT-001 4-stage workflow business-confirmed; License Management confirmed **Roadmap-only** — `RAISE-FR-LICENSE-001` added; six ESAPS-reference-only pages confirmed **out of scope**; RAISE-AI-RECOMMEND-001 re-confirmed **Roadmap-only, no MVP subset**; Oracle FA Reconciliation "Phase 6" code-comment label confirmed **not a PRD phase** (the separate `ReconciliationPage`↔`RAISE-FR-ORACLE-001` mapping question remains **unanswered** — carried forward as Open Question 10a); `RAISE-NFR-SEC-RBAC-001` MVP enforcement level confirmed **UI-only/client-side, backend deferred to Roadmap**). See Document Status change log at the bottom of this file for full history, including a correction to an earlier inaccurate draft of License Management's scope.
**Status:** Draft for Requirement Review
**Primary Source:** RAISE — Enterprise Asset Intelligence Platform — Final(1).pdf, ADT-RAISE Hackathon Pitch Day, 26 July 2026 (via `RAISE-PRD.md` v0.1 draft supplied 2026-08-20)
**Source of Truth:** RAISE Hackathon Proposal / RAISE business objectives and MVP scope
**Reference Only:** VERSCAN — never a source of RAISE requirements

> This document restructures and expands the v0.1 draft PRD into the analyst template
> (17 sections + full requirement field set + pre-finalization quality pass). No content
> from the v0.1 draft has been dropped; nothing beyond it has been invented. Every
> requirement below carries a **Source Reference** back to the v0.1 draft section it was
> taken from, since that draft — not this document — is the layer closest to the original
> Hackathon proposal.

---

## 1. Product Overview

**Product Name:** RAISE — Enterprise Asset Intelligence Platform

RAISE converts fragmented IT asset information (spread across Excel, Oracle FA/EBS,
warranty records, maintenance records, invoices/POs, and email) into a connected asset
platform with an AI intelligence layer on top. RAISE explicitly is **not** positioned as
"an Asset Management system with AI" — AI is a layer that connects and analyzes
information already captured by the core asset platform, not a replacement for
deterministic asset-management workflows (see [§12 AI Architecture Principle](#12-ai-architecture-principle-hybrid)).

The Hackathon MVP is scoped as an **8-week initiative** that establishes the platform
foundation and leads toward the Enterprise Roadmap (§14–§15).

*Source: v0.1 draft §2 (Product Overview), §14 (MVP Definition).*

---

## 2. Problem Statement

The organization invests significant amounts in IT assets, but information about those
assets is fragmented across:

- Excel
- Oracle FA / EBS
- Warranty information
- Maintenance information
- Invoice / PO information
- Email

The core problem is **not** merely storing asset data — it is converting fragmented,
multi-source data into timely, reliable decisions.

**Illustrative business question (from source):**
> "Which notebooks will expire from warranty within 90 days, and which should be
> repaired, extended, or replaced?"

*Source: v0.1 draft §2.4 (Business Problem).*

---

## 3. Product Vision

RAISE transforms fragmented asset information into actionable **Insight and
Recommendations** that help users make faster, more accurate, and more traceable
decisions.

**Core Product Principle:** RAISE is not intended to replace an Asset Management system
with AI. AI is positioned as an intelligence layer that connects information from
multiple sources, analyzes relationships between them, and converts information into
decision-support insight.

*Source: v0.1 draft §2.2 (Product Vision), §2.3 (Core Product Principle).*

---

## 4. Goals & Objectives

| Goal ID | Goal | Description |
|---|---|---|
| G1 | Centralize Asset Information | Provide a common asset platform covering the asset lifecycle. |
| G2 | Reduce Manual Data Work | Reduce manual searching, reconciliation, reporting, and repeated data collection. |
| G3 | Improve Asset Visibility | Provide a consolidated view of assets, custody, maintenance, warranty, and financial information. |
| G4 | Improve Decision Making | Use AI to analyze connected information and provide useful insight and recommendations. |
| G5 | Improve Traceability | Provide information that can be verified and traced, including audit-related activities. |
| G6 | Establish a Foundation for Enterprise AI | Create an extensible foundation from the Hackathon MVP toward the Enterprise Roadmap. |

**Target business outcomes** (source-identified, not yet formal SLA/NFR values):
faster access to information; reduced manual work; reduced risk of missing information;
more accurate decision-making; improved executive visibility; better traceability.

*Source: v0.1 draft §4 (Product Goals), §10 (Business Outcomes).*

---

## 5. Target Users

| User / Actor | Primary Need |
|---|---|
| IT Asset (staff) | Register, track, audit, maintain, and manage assets |
| Finance | Reconcile asset information with Oracle FA and financial information |
| Executive | View organization-level asset KPIs and summaries |
| Auditor | Trace asset information and verify historical activities |

These four actors are the only ones defined by the source for the Hackathon MVP. No
other actor (e.g., end-user asset holder, procurement, vendor) is defined in the source
— treat any additional actor as an **open question** requiring business confirmation
(see [§16](#16-open-questions)).

*Source: v0.1 draft §3 (Target Users).*

---

## 6. Functional Requirements

Each requirement below uses the full field set requested for this PRD. Fields not
determinable from the source are marked **TBD** rather than invented.

### RAISE-FR-ASSET-001 — Asset Registry

| Field | Value |
|---|---|
| Title | Central Asset Registry |
| Description | The system shall provide a central Asset Registry for managing asset information. |
| Business Objective | G1 (Centralize Asset Information), G3 (Improve Asset Visibility) |
| User/Actor | IT Asset, Finance, Executive, Auditor |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Users with appropriate access can view asset records; asset information can be used by downstream asset operations and intelligence functions; asset records can be associated with lifecycle information. |
| Dependencies | None identified in source |
| Source Reference | v0.1 draft §6.1 |
| Traceability ID | RAISE-FR-ASSET-001 |
| Open Question | Complete asset master field list is not defined — see [§16 Q1–Q2](#16-open-questions). |

### RAISE-FR-ASSET-002 — Category & Hierarchy

| Field | Value |
|---|---|
| Title | Asset Category & Hierarchy |
| Description | The system shall support asset categories and hierarchy. |
| Business Objective | G1, G3 |
| User/Actor | IT Asset, Executive |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Assets can be associated with an applicable category; category information can support asset search, analysis, and reporting. |
| Dependencies | RAISE-FR-ASSET-001 |
| Source Reference | v0.1 draft §6.2 |
| Traceability ID | RAISE-FR-ASSET-002 |
| Open Question | Final category hierarchy structure is not defined in source. |

### RAISE-FR-ASSET-003 — Custody History

| Field | Value |
|---|---|
| Title | Asset Custody History |
| Description | The system shall maintain custody history for assets. |
| Business Objective | G3, G5 (Improve Traceability) |
| User/Actor | IT Asset, Auditor |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Asset custody information can be viewed; historical custody information is retained for traceability; custody history can be used in asset lifecycle analysis. |
| Dependencies | RAISE-FR-ASSET-001 |
| Source Reference | v0.1 draft §6.3 |
| Traceability ID | RAISE-FR-ASSET-003 |
| Open Question | Holder data model and organizational relationship model not defined — see [§16 Q13](#16-open-questions). |

### RAISE-FR-OPS-001 — QR / Barcode

| Field | Value |
|---|---|
| Title | QR / Barcode Identification |
| Description | The system shall support QR / Barcode operations for assets. |
| Business Objective | G2 (Reduce Manual Data Work) |
| User/Actor | IT Asset |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Users can use QR / Barcode information to identify an asset; the identified asset can be connected to its asset record. |
| Dependencies | RAISE-FR-ASSET-001 |
| Source Reference | v0.1 draft §6.4 |
| Traceability ID | RAISE-FR-OPS-001 |
| Reference Note | VERSCAN demonstrates an existing QR/Barcode workflow. **REFERENCE ONLY** — design exploration input, not additional RAISE scope. |

### RAISE-FR-OPS-002 — Check-in / Check-out

| Field | Value |
|---|---|
| Title | Asset Check-in / Check-out |
| Description | The system shall support asset Check-in / Check-out operations. |
| Business Objective | G1, G3 |
| User/Actor | IT Asset |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | A user with appropriate permission can initiate an asset check-in or check-out process; the operation updates the relevant asset custody state; the operation is traceable. |
| Dependencies | RAISE-FR-ASSET-003, RAISE-NFR-SEC-RBAC-001 |
| Source Reference | v0.1 draft §6.5 |
| Traceability ID | RAISE-FR-OPS-002 |
| Open Question | Detailed workflow, approval requirements, exception handling, and user roles are TBD — see [§16 Q11–Q12](#16-open-questions). |

### RAISE-FR-MAINT-001 — Maintenance

| Field | Value |
|---|---|
| Title | Maintenance Information |
| Description | The system shall support maintenance information as part of the asset lifecycle, including a defined maintenance-request workflow. |
| Business Objective | G1, G3, G4 |
| User/Actor | IT Asset |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Maintenance information can be associated with an asset; maintenance history can be used as an input to asset analysis. **Workflow (resolved 2026-08-21** — business confirmation via `/update-prd` session, see [§16 Resolved Question 33](#16-open-questions)): a maintenance request follows a **4-stage workflow**: (1) **User Requisition** — a user raises a maintenance request against an asset; (2) **Dept Approval (Delegated)** — the request is approved by a department approver, who may be a delegated approver per a configurable delegated-approver setting; (3) **IT Dispatch** — an approved request is dispatched by IT to a technician/queue; (4) **Technician Execution** — the technician performs the maintenance work through to completion. State model (for design reference): `PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE`. |
| Dependencies | RAISE-FR-ASSET-001; RAISE-NFR-SEC-RBAC-001 (approval/dispatch/technician roles and the delegated-approver setting require the RBAC model) |
| Source Reference | v0.1 draft §6.6; workflow shape confirmed via `/update-prd` session, 2026-08-21, per [§16 Resolved Question 33](#16-open-questions) — originally identified as an ESAPS-reference pattern in `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 (`## NEEDS_PRD_CONFIRMATION` Item 1) |
| Traceability ID | RAISE-FR-MAINT-001 |
| Open Question | **Workflow shape is now confirmed** (see Acceptance Criteria above). **Still TBD:** SLA per stage, vendor model (internal technician vs. external vendor dispatch), and cost model/tracking — see [§16 Q14 (partially resolved)](#16-open-questions). Delegated-approver configuration rules (who may delegate, to whom, audit of delegation) are also not yet defined. |

### RAISE-FR-WARRANTY-001 — Warranty

| Field | Value |
|---|---|
| Title | Warranty Information |
| Description | The system shall support warranty information as part of the asset lifecycle. |
| Business Objective | G1, G3, G4 |
| User/Actor | IT Asset, Finance |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Warranty information can be associated with an asset; warranty status can be used for tracking; warranty information can be used as an input to AI analysis. |
| Dependencies | RAISE-FR-ASSET-001 |
| Source Reference | v0.1 draft §6.7 |
| Traceability ID | RAISE-FR-WARRANTY-001 |
| Business Example | Identifying assets whose warranty will expire within 90 days (source-cited use case). |
| Open Question | Required warranty fields not defined — see [§16 Q15](#16-open-questions). |

### RAISE-FR-LICENSE-001 — Software / SaaS License Management

| Field | Value |
|---|---|
| Title | Software / SaaS License Management |
| Description | The system may support management of software/SaaS licenses as part of the asset lifecycle, including a license inventory and a license detail view. **This is an Enterprise Roadmap capability, not Phase 1 MVP.** |
| Business Objective | G1 (Centralize Asset Information), G3 (Improve Asset Visibility) |
| User/Actor | IT Asset, Finance |
| Priority | Roadmap (not MVP-confirmed) |
| Scope | **Enterprise Roadmap** — not Phase 1 MVP |
| Acceptance Criteria | Not yet defined pending Roadmap-phase planning. Directionally: users with appropriate access would view a license inventory and a license detail record; license information could be associated with the applicable asset(s) and/or holder(s) where such an association exists. Exact field model, renewal/expiry alert rules, seat/utilization tracking, and vendor/cost tracking are **TBD** — not to be assumed complete until confirmed, and not to be built for MVP. |
| Dependencies | RAISE-FR-ASSET-001; RAISE-NFR-SEC-RBAC-001 (access control for license data); relationship to RAISE-FR-ALERT-001 for any renewal/expiry alerting is TBD |
| Source Reference | Not present in v0.1 draft or the RAISE Hackathon Proposal — added as a new **Roadmap** requirement, business-confirmed via `/update-prd` session, 2026-08-21, resolving the `NEEDS_PRD_CONFIRMATION` item (Item 6) in `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 (already-built, tested `frontend/src/pages/Licenses/` and `frontend/src/pages/LicenseDetail/` code with no prior PRD requirement backing it). See [§16 Resolved Question 34](#16-open-questions). **Note:** an earlier pass of this PRD briefly recorded this requirement as Priority P0 / Scope MVP before the actual business decision was received — that was incorrect and has been corrected here to Roadmap, per the confirmed decision. |
| Traceability ID | RAISE-FR-LICENSE-001 |
| Open Question | License field model (what constitutes a license record), renewal/expiry alert rule, seat/utilization tracking, and vendor/cost tracking are all **TBD** and deferred to Roadmap planning — see [§16 Q15a](#16-open-questions). Whether license expiry should integrate with RAISE-FR-ALERT-001 is also TBD. Existing `frontend/src/pages/Licenses/` and `LicenseDetail` code is ahead of this Roadmap-only scope decision — this should be flagged to engineering as functionality that is currently shipped/routed but not yet an approved MVP requirement. |

---

## 7. AI Requirements

The proposal defines an AI Intelligence Layer sitting between the data sources (Excel,
Oracle FA, Warranty, Maintenance, Invoice/PO, Email) and business applications.

**AI capability classification (as stated in source — statuses must not be silently
upgraded to MVP without product approval):**

| Capability | Status in Proposal |
|---|---|
| OCR / Extraction | Current |
| Metadata | Current |
| Classification | Current |
| Duplicate Detection | Current |
| Natural Language Search | Current |
| Risk Scoring | Pilot |
| Lifecycle Prediction | Pilot |
| Recommendation | Roadmap |

**Note on Traceability IDs (2026-08-21):** OCR/Extraction, Metadata, Classification, and
Duplicate Detection previously existed only as row labels in this table with no dedicated
requirement. Business confirmed via `/update-prd` session that all four should receive
Traceability IDs at Priority P0 / Scope MVP, consistent with Natural Language Search's
treatment as a "Current" capability (see [§16 Resolved Question 28](#16-open-questions)).
These are recorded as `RAISE-AI-DOC-001` through `RAISE-AI-DOC-004` below. **Update
2026-08-21 (v0.4):** detailed acceptance behavior for `RAISE-AI-DOC-001`,
`RAISE-AI-DOC-002`, and `RAISE-AI-DOC-003` has since been confirmed by business (see
[§16 Resolved Questions 30–32](#16-open-questions)) and is recorded in each requirement
below. `RAISE-AI-DOC-004` (Duplicate Detection) was asked about in the same session but
**received no answer** — its acceptance behavior remains fully **TBD**.

### RAISE-AI-SEARCH-001 — Natural Language Search

| Field | Value |
|---|---|
| Title | Natural Language Asset Search |
| Description | The system should allow users to search asset information using natural language. |
| Business Objective | G2, G4 |
| User/Actor | IT Asset, Finance, Executive, Auditor |
| Priority | P0 / Current AI Capability |
| Scope | MVP |
| Acceptance Criteria | User can submit a natural-language asset question; the system returns an answer based on connected asset information; the response identifies relevant source information where applicable. |
| Dependencies | RAISE-FR-ASSET-001, connected data sources (§7 data sources) |
| Source Reference | v0.1 draft §7.3 |
| Traceability ID | RAISE-AI-SEARCH-001 |
| Example | A user should be able to ask a business question instead of manually opening multiple screens and filtering data. |

### RAISE-AI-DOC-001 — OCR / Extraction

| Field | Value |
|---|---|
| Title | Document OCR / Data Extraction |
| Description | RAISE should extract data from asset-related source documents (e.g., invoices, POs, warranty/maintenance documents) using OCR/extraction, as one of the "Current"-status AI capabilities in the proposal's capability table. |
| Business Objective | G2 (Reduce Manual Data Work), G4 (Improve Decision Making) |
| User/Actor | IT Asset, Finance |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | **Resolved 2026-08-21** (business confirmation via `/update-prd` session — see [§16 Resolved Question 30](#16-open-questions)): (1) **Document scope** — OCR/Extraction covers three document types: Invoice/Receipt, Warranty document, and Asset nameplate/label (e.g., serial number, model). (2) **Confidence-threshold mechanism** — the system **shall** compute a confidence score for extracted data and, when the score is below a defined threshold, route the extraction to **human review before it is saved to the asset record** (no auto-save below threshold). The **numeric threshold value itself is TBD** — business confirmed the mechanism must exist but has not yet set the exact cutoff; the workflow must not be built assuming a specific number until that value is confirmed. |
| Dependencies | RAISE-FR-ASSET-001; data sources named in §7 intro (Excel, Oracle FA, Warranty, Maintenance, Invoice/PO, Email) |
| Source Reference | v0.1 draft §7 (AI capability classification table); confirmed as a formal requirement via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 28](#16-open-questions)); document scope and confidence-threshold mechanism confirmed via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 30](#16-open-questions)) |
| Traceability ID | RAISE-AI-DOC-001 |
| Open Question | **Numeric confidence-threshold value is still TBD** — mechanism (route-to-human-review below threshold) is confirmed, but the exact cutoff number is not yet defined; see [§16 Open Questions](#16-open-questions). |

### RAISE-AI-DOC-002 — Metadata

| Field | Value |
|---|---|
| Title | AI-Generated Metadata (Extraction / Tagging) |
| Description | RAISE should generate or extract metadata (e.g., tags, attributes) from connected asset information/documents, as one of the "Current"-status AI capabilities in the proposal's capability table. |
| Business Objective | G2, G4 |
| User/Actor | IT Asset, Finance |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | **Resolved 2026-08-21** (business confirmation via `/update-prd` session — see [§16 Resolved Question 31](#16-open-questions)): Metadata capability covers three areas: (1) **Document type tagging** — assigning a document-type tag to ingested documents; (2) **Key-value field extraction** — extracting structured key-value fields such as vendor, date, amount; (3) **Search tags/keywords** — generating tags/keywords to support full-text search. Exact field lists per document type and the surfaced-to-user UI treatment remain design-phase detail, not yet specified. |
| Dependencies | RAISE-FR-ASSET-001, RAISE-AI-DOC-001 |
| Source Reference | v0.1 draft §7 (AI capability classification table); confirmed as a formal requirement via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 28](#16-open-questions)); metadata scope confirmed via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 31](#16-open-questions)) |
| Traceability ID | RAISE-AI-DOC-002 |
| Open Question | Exact per-document-type field list and UI surfacing of tags/keywords remain design-phase TBD — see [§16 Open Questions](#16-open-questions). |

### RAISE-AI-DOC-003 — Classification

| Field | Value |
|---|---|
| Title | AI-Assisted Asset / Document Classification |
| Description | RAISE should classify connected asset information/documents (e.g., into category or document type) using AI, as one of the "Current"-status AI capabilities in the proposal's capability table. |
| Business Objective | G2, G4 |
| User/Actor | IT Asset, Finance |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | **Resolved 2026-08-21** (business confirmation via `/update-prd` session — see [§16 Resolved Question 32](#16-open-questions)): **Suggestion-only mode** — the AI classification capability shall only **suggest** a category/document-type classification; it must **not** auto-assign the classification to the asset/document record. A human user must review and confirm the suggestion before it is written to the record. This resolves the previously-open question of whether the capability assigns directly or only suggests — it only suggests. |
| Dependencies | RAISE-FR-ASSET-001, RAISE-FR-ASSET-002 |
| Source Reference | v0.1 draft §7 (AI capability classification table); confirmed as a formal requirement via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 28](#16-open-questions)); suggestion-only mode confirmed via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 32](#16-open-questions)) |
| Traceability ID | RAISE-AI-DOC-003 |
| Open Question | Exact classification taxonomy (category list, document-type list) and the human-confirmation UI/workflow detail remain design-phase TBD — see [§16 Open Questions](#16-open-questions). |

### RAISE-AI-DOC-004 — Duplicate Detection

| Field | Value |
|---|---|
| Title | AI-Assisted Duplicate Detection |
| Description | RAISE should detect duplicate asset records/information across connected sources using AI, as one of the "Current"-status AI capabilities in the proposal's capability table. |
| Business Objective | G2, G3 (Improve Asset Visibility) |
| User/Actor | IT Asset, Finance |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Not defined in source beyond the capability being listed as "Current" — **TBD**: matching criteria/threshold and resolution workflow (auto-merge vs. flag-for-review) are not specified. **This question was explicitly asked of the business during the 2026-08-21 `/update-prd` session and was left unanswered** — it remains fully TBD, not silently resolved; see [§16 Open Questions](#16-open-questions). |
| Dependencies | RAISE-FR-ASSET-001 |
| Source Reference | v0.1 draft §7 (AI capability classification table); confirmed as a formal requirement via `/update-prd` session, 2026-08-21 (see [§16 Resolved Question 28](#16-open-questions)) |
| Traceability ID | RAISE-AI-DOC-004 |
| Open Question | No acceptance detail, matching threshold, or resolution workflow defined. **Asked during the 2026-08-21 `/update-prd` session; no answer was provided — remains open pending the next business confirmation round.** |

### RAISE-AI-RISK-001 — Risk Scoring

| Field | Value |
|---|---|
| Title | Asset Risk Scoring |
| Description | RAISE should be capable of evaluating asset risk using connected asset information. |
| Business Objective | G4 |
| User/Actor | IT Asset, Executive |
| Priority | Pilot (not confirmed MVP) |
| Scope | Roadmap / Pilot — **not MVP unless confirmed** |
| Acceptance Criteria | Not defined in source beyond example inputs. |
| Dependencies | RAISE-FR-ASSET-001, RAISE-FR-MAINT-001, RAISE-FR-WARRANTY-001, RAISE-FR-ORACLE-001 |
| Source Reference | v0.1 draft §7.4 |
| Traceability ID | RAISE-AI-RISK-001 |
| Example Inputs (source-identified) | Asset age; maintenance/repair history; warranty status; Oracle FA information. |
| Open Question | Exact risk model and scoring formula are not defined — see [§16 Q4](#16-open-questions). |

### RAISE-AI-LIFECYCLE-001 — Lifecycle Prediction

| Field | Value |
|---|---|
| Title | Asset Lifecycle Prediction |
| Description | RAISE should support future asset lifecycle analysis and prediction. |
| Business Objective | G4 |
| User/Actor | IT Asset, Executive |
| Priority | Pilot (not confirmed MVP) |
| Scope | Roadmap / Pilot — **not MVP unless confirmed** |
| Acceptance Criteria | Not defined in source. |
| Dependencies | RAISE-FR-ASSET-001, RAISE-FR-MAINT-001, RAISE-FR-WARRANTY-001 |
| Source Reference | v0.1 draft §7.5 |
| Traceability ID | RAISE-AI-LIFECYCLE-001 |
| Open Question | Prediction algorithm, training data, target outcome, accuracy threshold not defined. |

### RAISE-AI-RECOMMEND-001 — AI Recommendation

| Field | Value |
|---|---|
| Title | AI-Generated Recommendations |
| Description | RAISE should provide recommendations based on multiple connected asset data sources. |
| Business Objective | G4 |
| User/Actor | IT Asset, Executive |
| Priority | Roadmap (demonstrated as a concept at pitch, but explicitly a future capability) |
| Scope | **Enterprise Roadmap** — not Phase 1 MVP |
| Acceptance Criteria | Demonstrated concept output includes: number of affected assets, repair cost information, asset age, risk score, recommended action, reason for recommendation, confidence, referenced sources. |
| Dependencies | RAISE-AI-RISK-001, RAISE-AI-LIFECYCLE-001 |
| Source Reference | v0.1 draft §7.6 |
| Traceability ID | RAISE-AI-RECOMMEND-001 |
| Demonstrated Example | "Which notebooks nearing warranty expiry should be extended and which should be replaced?" |
| Important | Presented as future/roadmap capability even though demonstrated at pitch — must be tracked separately from mandatory Phase 1 scope. |
| MVP-Scope Confirmation | **Confirmed 2026-08-21** (business confirmation via `/update-prd` session, resolving `## NEEDS_PRD_CONFIRMATION` Item 3 in `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 — see [§16 Resolved Question 36](#16-open-questions)): **stays Roadmap-only, no MVP subset requested.** `frontend/`'s existing `AIDecisionCenter` page (mock recommendation UI showing age, repair cost, risk score, recommended action, confidence) has **no MVP requirement backing it** and is **out of MVP scope**. **Engineering note:** this page/mock UI should be flagged for removal or feature-gating (e.g., hidden behind a Roadmap-phase flag) until `RAISE-AI-RECOMMEND-001` is actually promoted to MVP through a future requirement review — it must not be treated as already-approved MVP functionality just because it is built and routed. |

---

## 8. Executive Intelligence

### RAISE-FR-EXEC-001 — Executive Dashboard

| Field | Value |
|---|---|
| Title | Executive Asset Dashboard |
| Description | RAISE shall provide an executive view of asset information. |
| Business Objective | G3, G4 |
| User/Actor | Executive |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Executive users can view an organization-level asset summary; the dashboard provides defined asset KPIs; the dashboard supports faster decision-making using consolidated information. |
| Dependencies | RAISE-FR-ASSET-001, RAISE-FR-ORACLE-001 |
| Source Reference | v0.1 draft §8.1 |
| Traceability ID | RAISE-FR-EXEC-001 |
| Proposal-defined KPIs | NBV; Risk; Utilization. |
| Utilization KPI Definition | **Resolved 2026-08-21** (business confirmation via `/update-prd` session): **Assignment-time-based** — Utilization = % of time an asset is assigned to a user/department, relative to total available time. This resolves [§16 Resolved Question 27](#16-open-questions); NBV and Risk KPI formulas remain undefined. |
| Utilization Calculation Mechanics | **Resolved 2026-08-21** (business confirmation via `/update-prd` session — see [§16 Resolved Question 29](#16-open-questions)): (a) **Aggregation window = real-time snapshot** — Utilization is computed as a point-in-time value as of "now"; this is **not** a time-series/period aggregation (e.g., not "average utilization over the last 30/90 days"). (b) **Denominator exclusions** — assets with status Disposed, Retired, or Under Maintenance are **excluded** from the "total available time" denominator; only assets in an active/available-for-assignment state count toward the denominator. Numerator/assignment-time definition itself is unchanged from Resolved Question 27. |
| AI-Generated Executive Summary | Described in proposal as a capability; scope/format not further defined. |
| Open Question | NBV and Risk KPI formulas, thresholds, and dashboard layout remain undefined — see [§16 Q3 (partially resolved)](#16-open-questions). |

---

## 9. Integration Requirements

### RAISE-FR-ORACLE-001 — Oracle FA Integration

| Field | Value |
|---|---|
| Title | Oracle FA Integration & NBV/Depreciation Import |
| Description | The system shall integrate with Oracle FA as part of the MVP governance and integration capability, including import of NBV / Depreciation data. |
| Business Objective | G1, G3 |
| User/Actor | Finance, Executive |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Oracle FA information can be brought into the RAISE asset intelligence context; NBV / Depreciation information can be imported; Oracle-derived information can be used together with asset, maintenance, and warranty information. |
| Dependencies | RAISE-FR-ASSET-001 |
| Source Reference | v0.1 draft §6.8 |
| Traceability ID | RAISE-FR-ORACLE-001 |
| Open Question | API vs. file integration; synchronization frequency; data mapping; error handling; retry mechanism; integration ownership; source-of-truth rules; security mechanism — all undefined, see [§16 Q6–Q10](#16-open-questions). **Additionally (2026-08-21):** whether `frontend/`'s `ReconciliationPage` placeholder (`frontend/src/pages/modules.tsx`) is intended to satisfy this requirement's reconciliation acceptance behavior, or whether it needs a separate requirement ID, is **still unanswered — not resolved, do not infer** (see [§16 Resolved Question 37](#16-open-questions), which resolves only the "Phase 6" labeling sub-question, not this one). |

**Roadmap integration item (not MVP):** Real-time ERP Integration — see [§14 Enterprise Roadmap](#14-enterprise-roadmap).

---

## 10. Non-Functional Requirements

The Hackathon proposal does **not** define detailed NFR values. This section is
intentionally a requirements backlog, not invented specifications. Each area below
requires a value to be defined during Technical Design before it can move to
"Ready for Design" (see [Definition of Ready, §22 in prior draft — retained conceptually below](#appendix-a-process-definitions)).

| Area | Status |
|---|---|
| Authentication | TBD |
| Authorization / RBAC | **MVP enforcement level confirmed 2026-08-21: UI-only/client-side, backend enforcement deferred to Roadmap** — role list, permission matrix contents, and authentication mechanism remain TBD (see [§11](#11-security--rbac)) |
| Performance | TBD |
| Availability | TBD |
| Scalability | TBD |
| Backup / Recovery | TBD |
| Data Retention | TBD |
| Encryption | TBD |
| API Security | TBD |
| Audit Retention | TBD (see [§12 Audit & Compliance in this document — actually §12 below is AI Architecture; audit retention detailed in §12 of this PRD numbering is under Audit & Compliance §12](#12-audit--compliance)) |
| Monitoring | TBD |
| Logging | TBD |

*Source: v0.1 draft §11 (Non-Functional Requirements).*

**AI Architecture Principle (constrains NFR/technical design):** the proposal specifies
a **Hybrid AI Architecture** —
- **Rule-based** for: workflow, CRUD, functions requiring deterministic accuracy.
- **LLM / RAG** for: natural-language search, data summarization.

AI should not replace deterministic business rules where deterministic behavior is
required. This principle must be preserved in technical architecture.

*Source: v0.1 draft §12 (AI Architecture Principle).*

---

## 11. Security & RBAC

Security requirements are **not sufficiently specified** in the Hackathon proposal to
define detailed implementation requirements. The source only establishes that
role/permission-gated actions exist implicitly (e.g., "a user with appropriate
permission" in Check-in/Check-out, RAISE-FR-OPS-002) without defining the role model.

A later Security Design must cover, at minimum:

- Authentication
- Authorization
- Role-based access control
- Data access boundaries
- Auditability
- AI data access controls
- Sensitive data handling
- Integration credentials
- Administrative access

These are **design work items**, not finalized requirements. Treat as
**RAISE-NFR-SEC-RBAC-001** pending full Security Design and further business
confirmation (see [§16 Q21–Q23](#16-open-questions)). **MVP enforcement level confirmed
2026-08-21** (business confirmation via `/update-prd` session, resolving
`## NEEDS_PRD_CONFIRMATION` Item 5 in
`docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 — see
[§16 Resolved Question 38](#16-open-questions)):

- **A UI-only (client-side) permission-matrix is acceptable for the Hackathon MVP.**
  Backend-enforced RBAC is **not required to ship Phase 1** — it is explicitly deferred
  to **Enterprise Roadmap / Phase 2**.
- This matches `frontend/`'s current state: route guards + a client-side
  permission-matrix persistence layer are implemented, and `go-template-main`'s
  `RequireRole` middleware is wired only as a **reference example on one CRUD group**,
  not as a real backend admin/user/role management API.
- **Security caveat (recorded, not silently dropped):** UI-only enforcement means any
  actor who can bypass the client (e.g., direct API calls) is not blocked by a
  server-side check for MVP. This is an **accepted, explicit MVP risk**, not an oversight
  — it must be visible to Security Design and to the Compliance Review stage
  (`RAISE-COMPLIANCE-REVIEW.md`, not yet created) as a known gap to close before any
  Phase 2 production hardening.
- **Still TBD, not resolved by this decision:** the actual role list, permission
  matrix contents, authentication mechanism, and all other items in the "must cover, at
  minimum" list above remain undefined — this decision only fixes *where* enforcement
  happens for MVP (client-side only), not *what* the roles/permissions are.

*Source: v0.1 draft §13 (Security & Governance); MVP enforcement-level confirmed via
`/update-prd` session, 2026-08-21.*

---

## 12. Audit & Compliance

### RAISE-FR-AUDIT-001 — Immutable Audit Log

| Field | Value |
|---|---|
| Title | Immutable Audit Log |
| Description | The system shall provide an immutable audit log for governance and traceability. |
| Business Objective | G5 |
| User/Actor | Auditor, Executive |
| Priority | P0 |
| Scope | MVP |
| Acceptance Criteria | Relevant activities are recorded; historical records cannot be modified through normal application operations; authorized users can review audit information. |
| Dependencies | RAISE-FR-ASSET-003, RAISE-NFR-SEC-RBAC-001 |
| Source Reference | v0.1 draft §6.10 |
| Traceability ID | RAISE-FR-AUDIT-001 |
| Open Question | Retention period, storage architecture, audit event taxonomy, and privileged administrator controls not specified — see [§16 Q24–Q25](#16-open-questions). |

### RAISE-FR-ALERT-001 — Alerts

| Field | Value |
|---|---|
| Title | Asset Management Alerts |
| Description | The system shall provide alerts relevant to asset management activities. |
| Business Objective | G2, G5 |
| User/Actor | IT Asset, Finance |
| Priority | P0 |
| Scope | MVP (single-channel; multi-channel is Roadmap) |
| Acceptance Criteria | Relevant conditions can trigger an alert; alert information is visible to an authorized user. |
| Dependencies | RAISE-FR-WARRANTY-001, RAISE-FR-MAINT-001 |
| Source Reference | v0.1 draft §6.9 |
| Traceability ID | RAISE-FR-ALERT-001 |
| Open Question | Exact alert rules and channels for MVP are TBD. Multi-channel alerts (Email/Teams/LINE Notify) are explicitly Phase 2 Roadmap, not MVP. |

---

## 13. MVP Scope

The Phase 1 Hackathon MVP (8-week initiative) is defined as:

**Core Asset Management:** Asset Registry (RAISE-FR-ASSET-001) · Category & Hierarchy
(RAISE-FR-ASSET-002) · Custody History (RAISE-FR-ASSET-003)

**Asset Operations:** QR/Barcode (RAISE-FR-OPS-001) · Check-in/Check-out
(RAISE-FR-OPS-002) · Maintenance (RAISE-FR-MAINT-001 — 4-stage workflow shape
confirmed 2026-08-21) · Warranty (RAISE-FR-WARRANTY-001)

**Governance & Integration:** Oracle FA Integration + NBV/Depreciation Import
(RAISE-FR-ORACLE-001) · Alerts (RAISE-FR-ALERT-001) · Immutable Audit Log
(RAISE-FR-AUDIT-001)

**Executive Intelligence:** Executive Dashboard (RAISE-FR-EXEC-001)

**AI (Current-status capability only):** Natural Language Search (RAISE-AI-SEARCH-001) ·
OCR / Extraction (RAISE-AI-DOC-001) · Metadata (RAISE-AI-DOC-002) · Classification
(RAISE-AI-DOC-003) · Duplicate Detection (RAISE-AI-DOC-004) — the latter four confirmed
as P0/MVP requirements 2026-08-21 (see [§16 Resolved Question 28](#16-open-questions)).
**Update (v0.4):** detailed acceptance behavior for RAISE-AI-DOC-001, RAISE-AI-DOC-002,
and RAISE-AI-DOC-003 is now confirmed (see §7 and [§16 Resolved Questions 30–32]
(#16-open-questions)); RAISE-AI-DOC-004's acceptance behavior remains TBD — asked in the
same session but not answered.

**Primary Users:** IT Asset, Finance, Executive, Auditor

**Explicitly excluded from MVP despite being demonstrated at pitch:** Risk Scoring and
Lifecycle Prediction are **Pilot** status, and AI Recommendation is **Roadmap** status —
none are confirmed MVP requirements (see [§7](#7-ai-requirements)). **Re-confirmed
2026-08-21** for `RAISE-AI-RECOMMEND-001` specifically, with no MVP subset carved out —
see [§16 Resolved Question 36](#16-open-questions). `frontend/`'s `AIDecisionCenter`
page/mock UI has no MVP requirement behind it and should be flagged for
removal/feature-gating pending Roadmap-phase promotion.

**Also explicitly excluded from MVP:** Software/SaaS License Management
(RAISE-FR-LICENSE-001) is confirmed **Roadmap, not MVP** (2026-08-21) — see
[§14 Enterprise Roadmap](#14-enterprise-roadmap). Six additional ESAPS-reference-only
pages (Assignment, Auth beyond Login, Inventory, NotificationCenter, Profile, Reports)
are confirmed **out of scope entirely** (not even Roadmap) — see
[§15 Out of Scope](#15-out-of-scope) and [§16 Resolved Question 35](#16-open-questions).

*Source: v0.1 draft §5.1, §14 (MVP Definition).*

---

## 14. Enterprise Roadmap

The proposal identifies the following Phase 2 capabilities. These remain roadmap items
**unless separately approved** through product requirement review:

1. Real-time ERP Integration
2. Native Mobile App
3. AI Recommendation (RAISE-AI-RECOMMEND-001)
4. Predictive Analytics
5. Workflow Automation
6. Multi-channel Alerts (Email, Teams, LINE Notify)
7. **Asset Disposal workflow** (terminal stage of `RAISE-FR-LIFE-001`'s asset lifecycle —
   full disposal screen/flow, including whether/how prior custody, maintenance, warranty,
   and audit history is retained post-disposal)
8. **Software / SaaS License Management** (`RAISE-FR-LICENSE-001`) — license inventory
   and license detail management, sourced from already-built `frontend/` code
   (`frontend/src/pages/Licenses/`, `frontend/src/pages/LicenseDetail/`) with no basis in
   the original Hackathon Proposal. Field model, renewal/expiry alert rule,
   seat/utilization tracking, and vendor/cost tracking are all undefined and deferred to
   Roadmap-phase planning.

*Source: v0.1 draft §5.2, §15 (Enterprise Roadmap) for items 1–6. Item 7 is not in the
source proposal — it was raised as an open question during Traceability Matrix review
(`RAISE-TRACEABILITY-MATRIX.md` §6) because Design's lifecycle diagram includes a Disposal
stage with no MVP capability behind it, and **confirmed as Roadmap (not MVP) by
Product/Business decision, 2026-08-21**. Item 8 is not in the source proposal either — it
was raised via the `## NEEDS_PRD_CONFIRMATION` log in
`docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 and **confirmed as Roadmap
(not MVP) by business decision, 2026-08-21** — see
[§16 Resolved Question 34](#16-open-questions).*

---

## 15. Out of Scope

The following are **not** to be assumed as Phase 1 requirements without further
approval:

- Full AI Recommendation implementation
- Predictive Analytics implementation
- Real-time ERP Integration
- Native Mobile Application
- Workflow Automation beyond MVP needs
- Multi-channel notification implementation
- **Any VERSCAN-specific feature not explicitly required by RAISE** — VERSCAN is a
  reference/benchmark only (see [VERSCAN Reference Policy](#verscan-reference-policy)
  below); a VERSCAN capability with no support in RAISE requirements is marked
  **REFERENCE ONLY**.
- **The following ESAPS-reference-only pages/flows — confirmed explicitly out of RAISE
  scope entirely (not MVP, not Pilot, not Roadmap) by business decision, 2026-08-21**
  (see [§16 Resolved Question 35](#16-open-questions)). These exist in
  `esaps_ai_template/src/pages/` (business/UI reference only, per CLAUDE.md) with no
  corresponding `frontend/` page and no RAISE PRD requirement, and were raised via the
  `## NEEDS_PRD_CONFIRMATION` log in
  `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4:
  - `Assignment.tsx` — asset assignment flow (beyond `RAISE-FR-OPS-002` Check-in/Check-out)
  - `Auth.tsx` beyond Login (registration/password-reset/MFA-type screens)
  - `Inventory.tsx` (distinct from `RAISE-FR-ASSET-001` Asset Registry)
  - `NotificationCenter.tsx` (distinct from `RAISE-FR-ALERT-001` Alerts)
  - `Profile.tsx` (user self-service profile page)
  - `Reports.tsx` (distinct from `RAISE-FR-EXEC-001` Executive Dashboard)
  - `SoftwareLicense.tsx` — superseded by the License Management decision above; this is
    the same underlying feature as `RAISE-FR-LICENSE-001` (Roadmap), not a separate one,
    and is listed here only to close out the confirmation item, not as an independent
    rejection
  - `ErrorPages.tsx` (404/500/etc.) — treated as generic application infrastructure, not
    a business requirement; no Traceability ID needed for this one at any tier

  None of these should be promoted into `frontend/` build scope, and none receive a
  Traceability ID. If a genuine business need for any of them emerges later, it must go
  through a fresh Business Requirement Review per the
  [VERSCAN Reference Policy promotion path](#verscan-reference-policy) analog — this
  decision is not permanently irreversible, only currently closed.

### VERSCAN Reference Policy

VERSCAN may be used to explore existing Asset Management workflows, identify useful UX
patterns, compare common capabilities, validate that proposed workflows are practical,
and discover clarifying questions. VERSCAN must **not** be treated as a source of truth.

Promotion path for a VERSCAN-inspired idea:
`VERSCAN Reference → Candidate Capability → Business Requirement Review → RAISE PRD → Approved / Rejected`

Currently, only one VERSCAN reference note exists in the source material: the QR/Barcode
workflow under RAISE-FR-OPS-001, explicitly marked REFERENCE ONLY.

*Source: v0.1 draft §16 (Out of Scope), §17 (VERSCAN Reference Policy).*

---

## 16. Open Questions

The following must be resolved before detailed design. None are silently resolved in
this PRD.

**Business**
1. What is the authoritative asset master?
2. Which asset types are included in MVP?
3. What is the exact definition of utilization (Executive Dashboard KPI)? — **Partially
   resolved 2026-08-21, see [Resolved Question 27](#16-open-questions)**: the
   *definition* of Utilization is now confirmed (assignment-time-based). The exact
   *formula thresholds* and the NBV/Risk KPI formulas remain open.
4. What is the exact definition of risk (RAISE-AI-RISK-001)?
5. What business decisions must AI support first?

**Oracle / Integration**
6. What Oracle FA version/system is used?
7. What fields must be imported?
8. Is Oracle the source of truth for financial attributes?
9. How frequently should data synchronize?
10. What integration method will be used (API vs. file)?
10a. Does `frontend/`'s `ReconciliationPage` placeholder (`frontend/src/pages/modules.tsx`)
    satisfy `RAISE-FR-ORACLE-001`'s reconciliation acceptance criteria, or does it need a
    separate requirement ID? — Raised alongside [Resolved Question 37]
    (#16-open-questions), which resolved only the unrelated "Phase 6" labeling question
    in the same code comment. This sub-question is **explicitly still open** — not
    answered, not to be inferred from Resolved Question 37.

**Asset Operations**
11. What is the exact Check-in / Check-out workflow?
12. Who can assign or transfer an asset?
13. What is the holder data model?
14. What maintenance information is required? — **Partially resolved 2026-08-21, see
    [Resolved Question 33](#16-open-questions)**: the 4-stage workflow *shape* (User
    Requisition → Dept Approval (Delegated) → IT Dispatch → Technician Execution) is now
    confirmed. SLA per stage, vendor model, cost model, and delegated-approver
    configuration rules remain open.
15. What warranty fields are required?
15a. What is the license field model, renewal/expiry alert rule, seat/utilization
    tracking, and vendor/cost tracking for `RAISE-FR-LICENSE-001`? — new open question
    raised alongside the requirement's addition, 2026-08-21; see
    [Resolved Question 34](#16-open-questions) (identity/priority/scope resolved; detail
    fields not).

**AI**
16. Which AI capability is mandatory for the Hackathon MVP (beyond Natural Language
    Search, which is the only "Current" capability the MVP scope table explicitly
    includes)?
17. What sources can the AI access?
18. How should AI answers cite source data?
19. What confidence threshold is acceptable? — **Partially resolved 2026-08-21** for
    `RAISE-AI-DOC-001` (OCR/Extraction): a confidence-threshold mechanism (route below
    threshold to human review before save) is confirmed, but the **exact numeric
    threshold value remains TBD** — see [Resolved Question 30](#16-open-questions).
20. What happens when source data conflicts?
20a. **`RAISE-AI-DOC-004` (Duplicate Detection) — matching threshold and merge-vs-flag
    workflow.** This was explicitly asked of the business during the 2026-08-21
    `/update-prd` session and **no answer was given**. Remains fully TBD — do **not**
    treat as resolved; carry forward to the next business confirmation round.

**Security**
21. What authentication mechanism will be used?
22. What roles and permissions are required?
23. What data is sensitive?
24. What audit events must be immutable?
25. What retention period is required?

*Source: v0.1 draft §18 (Open Questions).*

### Resolved Questions

26. **Is asset Disposal in Phase 1 MVP scope for `RAISE-FR-LIFE-001`?** — Raised during
    Traceability Matrix review (`RAISE-TRACEABILITY-MATRIX.md` §6), not part of the
    original 25 above. **Resolved 2026-08-21: Enterprise Roadmap, not MVP** — see
    [§14 Enterprise Roadmap, item 7](#14-enterprise-roadmap). Design's lifecycle diagram
    (Purchase → Register → Assign → Maintain → Audit → Dispose) keeps Disposal as the
    conceptual terminal stage, but no Disposal screen/flow/requirement is built in MVP.

27. **What is the exact definition of Utilization (Executive Dashboard KPI,
    `RAISE-FR-EXEC-001`)?** — Business confirmed via `/update-prd` session,
    **2026-08-21**: **Assignment-time-based** — Utilization = % of time an asset is
    assigned to a user/department, relative to total available time. This resolves
    `RAISE-TRACEABILITY-MATRIX.md` Gap 5 (sub-item: Utilization KPI definition). NBV and
    Risk KPI formulas, thresholds, and dashboard layout are **still open** (see Q3 above).

28. **Should the four "Current"-status AI capabilities (OCR/Extraction, Metadata,
    Classification, Duplicate Detection) that exist only as row labels in the §7
    capability table receive their own Traceability IDs?** — Business confirmed via
    `/update-prd` session, **2026-08-21**: **Yes, add IDs for all four**, at
    **Priority P0 / Scope MVP**, matching `RAISE-AI-SEARCH-001`'s treatment as a
    "Current" capability. See new requirements `RAISE-AI-DOC-001` through
    `RAISE-AI-DOC-004` in [§7 AI Requirements](#7-ai-requirements). This resolves
    `RAISE-TRACEABILITY-MATRIX.md` Gap 5 (sub-item: missing Traceability IDs for
    Current-status AI capabilities). Detailed acceptance behavior, field lists, and
    business rules for each capability remain **TBD** — only the identity, priority,
    and scope of these requirements are resolved by this decision.

29. **What are the calculation mechanics of the Utilization KPI (`RAISE-FR-EXEC-001`) —
    aggregation window and denominator exclusions?** — Business confirmed via
    `/update-prd` session, **2026-08-21**: (a) **Aggregation window = real-time
    snapshot** — Utilization is a point-in-time calculation as of "now," not a
    time-series/period aggregate. (b) **Denominator exclusions** — assets in
    Disposed, Retired, or Under Maintenance status are excluded from the "total
    available time" denominator. This is a sub-resolution of
    [Resolved Question 27](#16-open-questions) (which fixed the assignment-time
    *definition*); Question 29 fixes the *calculation mechanics*. See
    [§8 Executive Intelligence](#8-executive-intelligence).

30. **What is the document scope and confidence-handling rule for `RAISE-AI-DOC-001`
    (OCR/Extraction)?** — Business confirmed via `/update-prd` session, **2026-08-21**:
    (a) **Document scope** — three document types: Invoice/Receipt, Warranty document,
    Asset nameplate/label (serial number, model). (b) **Confidence-threshold
    mechanism** — extractions below a confidence threshold must be routed to human
    review before being saved to the asset record. The **numeric threshold value is
    still TBD** — the mechanism is confirmed, the cutoff number is not. See
    `RAISE-AI-DOC-001` in [§7 AI Requirements](#7-ai-requirements).

31. **What is the metadata scope for `RAISE-AI-DOC-002` (Metadata)?** — Business
    confirmed via `/update-prd` session, **2026-08-21**: three areas — (a) document
    type tagging, (b) key-value field extraction (e.g., vendor, date, amount), (c)
    search tags/keywords for full-text search. See `RAISE-AI-DOC-002` in
    [§7 AI Requirements](#7-ai-requirements).

32. **What is the classification mode for `RAISE-AI-DOC-003` (Classification) — does it
    auto-assign or only suggest?** — Business confirmed via `/update-prd` session,
    **2026-08-21**: **Suggestion only** — a human must confirm before the
    classification is assigned to the record; no auto-assignment. See
    `RAISE-AI-DOC-003` in [§7 AI Requirements](#7-ai-requirements).

**Not resolved — asked but no answer received (2026-08-21 `/update-prd` session):**
`RAISE-AI-DOC-004` (Duplicate Detection) matching threshold and merge-vs-flag-for-review
workflow (see [Open Question 20a](#16-open-questions)) remain **fully TBD**. This is
recorded here explicitly so it is not mistaken for a resolved item alongside 29–32.

33. **Is the ESAPS-reference 4-stage maintenance workflow (User Requisition → Dept
    Approval (Delegated) → IT Dispatch → Technician Execution) a confirmed business rule
    for `RAISE-FR-MAINT-001`?** — Raised as `## NEEDS_PRD_CONFIRMATION` Item 1 in
    `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 (workflow
    pattern found in `esaps_ai_template/src/config/navigation.ts` and
    `src/data/requisitionData.ts`, a reference-only source). Business confirmed via
    `/update-prd` session, **2026-08-21**: **Yes — use as business rule.** The 4-stage
    workflow shape (User Requisition → Dept Approval (Delegated) → IT Dispatch →
    Technician Execution), including a delegated-approver setting, is now a confirmed
    part of `RAISE-FR-MAINT-001`'s Acceptance Criteria (see [§6](#6-functional-requirements)).
    This resolves the workflow-*shape* portion of Open Question 14; SLA, vendor model,
    cost model, and delegated-approver configuration rules remain **TBD**.

34. **Should `frontend/src/pages/Licenses/` and `frontend/src/pages/LicenseDetail/` —
    already-built, tested RAISE frontend code with no prior PRD requirement — be kept
    and formalized as a requirement, or cut from scope?** — Raised as
    `## NEEDS_PRD_CONFIRMATION` Item 6 in
    `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4. Business confirmed via
    `/update-prd` session, **2026-08-21**: **Add as a new requirement, at Scope
    Enterprise Roadmap (not MVP).** Recorded as `RAISE-FR-LICENSE-001` (Software / SaaS
    License Management) in [§6](#6-functional-requirements) and
    [§14 Enterprise Roadmap, item 8](#14-enterprise-roadmap). Only the requirement's
    identity and Roadmap scope are resolved by this decision — the license field
    model, renewal/expiry alert rule, seat/utilization tracking, and vendor/cost
    tracking are **TBD** (see Open Question 15a above). **Correction note:** an earlier
    pass of this PRD briefly and incorrectly recorded this decision as Priority P0 /
    Scope MVP before the actual business answer (Roadmap) was received; that was a
    document defect, now corrected here and everywhere else this requirement is
    referenced (§6, §13, §17, Pre-Finalization Quality Pass, Document Status).

35. **For the remaining ESAPS-reference-only pages found in
    `esaps_ai_template/src/pages/` with no corresponding `frontend/` page or PRD
    requirement — `Assignment.tsx`, `Auth.tsx` (beyond Login), `Inventory.tsx`,
    `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`, `SoftwareLicense.tsx`,
    `ErrorPages.tsx` — should any be promoted into RAISE scope?** — Raised as
    `## NEEDS_PRD_CONFIRMATION` Item 2 in
    `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4. Business confirmed via
    `/update-prd` session, **2026-08-21**: **All out of scope**, except
    `SoftwareLicense.tsx`, which is not a separate rejection — it is the same underlying
    feature as `RAISE-FR-LICENSE-001` (Roadmap, per Resolved Question 34) and is
    superseded by that decision rather than independently rejected. None of the
    remaining seven receive a Traceability ID at any tier (not MVP, not Pilot, not
    Roadmap). See [§15 Out of Scope](#15-out-of-scope) for the full list and rationale.

36. **Should `RAISE-AI-RECOMMEND-001` (AI Recommendation) stay Roadmap-only, or does
    `frontend/`'s already-built `AIDecisionCenter` page (mock recommendation UI —
    age, repair cost, risk score, recommended action, confidence) map to an MVP-scoped
    subset that needs its own requirement?** — Raised as `## NEEDS_PRD_CONFIRMATION`
    Item 3 in `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4. Business
    confirmed via `/update-prd` session, **2026-08-21**: **`RAISE-AI-RECOMMEND-001`
    stays Roadmap-only — no MVP subset requested.** The `AIDecisionCenter` page/mock UI
    in `frontend/` is out of MVP scope and should be flagged for removal or
    feature-gating until Roadmap phase. See `RAISE-AI-RECOMMEND-001` in
    [§7 AI Requirements](#7-ai-requirements).

37. **Does "Phase 6" (a code comment in `frontend/src/pages/modules.tsx` →
    `ReconciliationPage`, reading "Migrates from src/pages/Reconciliation.tsx once Oracle
    FA is connected in Phase 6") correspond to any phase defined in `RAISE-PRD.md`?** —
    Raised as part of `## NEEDS_PRD_CONFIRMATION` Item 4 in
    `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4. Business confirmed via
    `/update-prd` session, **2026-08-21**: **No — "Phase 6" is a stale/internal-only
    label from `frontend/`'s own migration plan, not a PRD artifact.** `RAISE-PRD.md` has
    no phase-numbering scheme matching "Phase 6" (it only has Phase 1 MVP / Enterprise
    Roadmap as defined in [§13](#13-mvp-scope) and [§14](#14-enterprise-roadmap)). This
    label must be **disregarded entirely as a scope signal** — it does not indicate
    anything about whether `ReconciliationPage` is in scope, when it should ship, or
    what it depends on. **This resolves only the labeling question.** The substantive
    question — whether `ReconciliationPage` is intended to satisfy `RAISE-FR-ORACLE-001`,
    or needs its own separate requirement ID — was **not** addressed by this decision and
    remains open; see the "Open Question" field on `RAISE-FR-ORACLE-001` in
    [§9 Integration Requirements](#9-integration-requirements) and
    [Open Question 10a](#16-open-questions) below. Do not infer an answer to that part
    from this resolution.

38. **Does the RAISE MVP require backend-enforced RBAC before Phase 1 ships, or is a
    UI-only permission-matrix acceptable, with enforcement deferred to a later phase?**
    — Raised as `## NEEDS_PRD_CONFIRMATION` Item 5 in
    `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4. Business confirmed via
    `/update-prd` session, **2026-08-21**: **UI-only (client-side) permission-matrix is
    acceptable for MVP; backend-enforced RBAC is explicitly deferred to Enterprise
    Roadmap / Phase 2.** This matches `frontend/`'s current implementation (route guards
    + client-side permission-matrix persistence) and treats `go-template-main`'s
    `RequireRole` middleware as a reference example only (wired on one CRUD group), not
    as production backend enforcement. The security caveat — that UI-only enforcement
    does not block a client-bypassing actor (e.g., direct API calls) — is explicitly
    recorded as an accepted MVP risk, not silently dropped. See
    `RAISE-NFR-SEC-RBAC-001` in [§11 Security & RBAC](#11-security--rbac). This closes
    out the last of the six `## NEEDS_PRD_CONFIRMATION` items logged in
    `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4.

39. **Is RAISE being built for direct use by a named organization, or is it a
    general-purpose platform with no specific end customer?** — Raised
    2026-08-24 while reviewing a stakeholder-submitted visual identity proposal that
    asked whether to apply a specific company's Corporate Identity (CI) colors.
    Business confirmed, **2026-08-24: RAISE is developed for direct use by Singer
    (Thailand)** — not a generic/reference platform. This is consistent with, but not
    previously stated as plainly as, the `singer/go-template-new-2026-06` module
    namespace of the company Go backend template
    (`docs/company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md`), which had
    been treated as an internal naming detail rather than a confirmed business fact
    until now. **Effect of this resolution:** Singer's Corporate Identity (red primary,
    white/gray/dark secondary) is now a legitimate basis for visual-design decisions —
    see `docs/project-foundation-baseline/RAISE-BRAND-STYLE-GUIDE.md` for the
    CI-aligned styling guidance and its explicit caution against using red as a large
    background fill (red already carries alert/breakdown/error meaning elsewhere in
    an asset-management UI). This does **not** change any functional requirement,
    priority, or scope item elsewhere in this PRD — it is a branding/identity fact,
    not a new `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` requirement.

---

## 17. Requirement Traceability Matrix

| Traceability ID | Title | Scope | Priority | Status | Source Reference |
|---|---|---|---|---|---|
| RAISE-FR-ASSET-001 | Asset Registry | MVP | P0 | APPROVED | v0.1 §6.1 |
| RAISE-FR-ASSET-002 | Category & Hierarchy | MVP | P0 | APPROVED | v0.1 §6.2 |
| RAISE-FR-ASSET-003 | Custody History | MVP | P0 | APPROVED | v0.1 §6.3 |
| RAISE-FR-OPS-001 | QR / Barcode | MVP | P0 | APPROVED | v0.1 §6.4 |
| RAISE-FR-OPS-002 | Check-in / Check-out | MVP | P0 | TBD (workflow detail) | v0.1 §6.5 |
| RAISE-FR-MAINT-001 | Maintenance | MVP | P0 | Workflow shape confirmed; SLA/vendor/cost model still TBD | v0.1 §6.6; workflow shape confirmed 2026-08-21 |
| RAISE-FR-WARRANTY-001 | Warranty | MVP | P0 | TBD (field list) | v0.1 §6.7 |
| RAISE-FR-LICENSE-001 | Software / SaaS License Management | Roadmap | Not MVP-confirmed | ROADMAP — identity/scope confirmed 2026-08-21; field model/alert rules/vendor-cost tracking TBD | New requirement, not in v0.1 draft; added 2026-08-21, confirmed Roadmap-only |
| RAISE-FR-ORACLE-001 | Oracle FA Integration | MVP | P0 | TBD (integration design) | v0.1 §6.8 |
| RAISE-FR-ALERT-001 | Alerts | MVP | P0 | TBD (rules/channels) | v0.1 §6.9 |
| RAISE-FR-AUDIT-001 | Immutable Audit Log | MVP | P0 | TBD (retention/taxonomy) | v0.1 §6.10 |
| RAISE-FR-EXEC-001 | Executive Dashboard | MVP | P0 | TBD (KPI formulas) | v0.1 §8.1 |
| RAISE-AI-SEARCH-001 | Natural Language Search | MVP | P0 | APPROVED | v0.1 §7.3 |
| RAISE-AI-DOC-001 | OCR / Extraction | MVP | P0 | Acceptance detail defined — ready for downstream sync (numeric confidence threshold still TBD) | v0.1 §7 capability table; confirmed 2026-08-21; acceptance detail confirmed 2026-08-21 |
| RAISE-AI-DOC-002 | Metadata | MVP | P0 | Acceptance detail defined — ready for downstream sync | v0.1 §7 capability table; confirmed 2026-08-21; acceptance detail confirmed 2026-08-21 |
| RAISE-AI-DOC-003 | Classification | MVP | P0 | Acceptance detail defined — ready for downstream sync | v0.1 §7 capability table; confirmed 2026-08-21; acceptance detail confirmed 2026-08-21 |
| RAISE-AI-DOC-004 | Duplicate Detection | MVP | P0 | TBD (acceptance detail) — asked 2026-08-21, no business answer received; still open | v0.1 §7 capability table; confirmed 2026-08-21 |
| RAISE-AI-RISK-001 | Risk Scoring | Pilot | Not MVP-confirmed | PILOT | v0.1 §7.4 |
| RAISE-AI-LIFECYCLE-001 | Lifecycle Prediction | Pilot | Not MVP-confirmed | PILOT | v0.1 §7.5 |
| RAISE-AI-RECOMMEND-001 | AI Recommendation | Roadmap | Not MVP | ROADMAP | v0.1 §7.6 |
| RAISE-NFR-SEC-RBAC-001 | Security & RBAC | MVP (enforcement level only) | TBD | MVP enforcement level confirmed 2026-08-21 (UI-only, backend deferred to Roadmap) — role list/permission matrix/authentication mechanism still TBD | v0.1 §13; MVP enforcement level confirmed 2026-08-21 |
| RAISE-FR-LIFE-001 | Asset Lifecycle Connectivity | MVP (foundation) | P0 | APPROVED | v0.1 §9 |

**Downstream sync status for newly-added IDs (2026-08-21, updated in v0.4/v0.5):** This
PRD-local matrix tracks Scope/Priority/Status only; per-stage columns
(Design/Prototype/AC/Suite/Test Case) are maintained in
[`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md).
For `RAISE-AI-DOC-001`, `RAISE-AI-DOC-002`, and `RAISE-AI-DOC-003`, acceptance detail is
now defined in this PRD (v0.4) — all downstream stage columns
(Design / Prototype / Acceptance Criteria / Test Suite / Test Case) should be updated
from "Pending — awaiting downstream sync" to reflect the confirmed business rules once
`RAISE-DESIGN.md`, `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`,
`RAISE-TEST-PLAN.md`, and `RAISE-TEST-CASES.md` are each updated. For `RAISE-AI-DOC-004`,
no acceptance detail exists yet (business did not answer when asked); all downstream
stage columns remain **"Pending — awaiting downstream sync"** and must not be advanced
until acceptance detail is confirmed.

**v0.5 addition:** `RAISE-FR-MAINT-001`'s confirmed 4-stage workflow shape (Acceptance
Criteria updated in §6) requires the same downstream stage columns
(Design / Prototype / Acceptance Criteria / Test Suite / Test Case) in
`RAISE-TRACEABILITY-MATRIX.md` to be updated to reflect the confirmed business rule.
`RAISE-FR-LICENSE-001` is a brand-new requirement, confirmed **Roadmap-only** (not MVP —
see [§16 Resolved Question 34](#16-open-questions)), with no downstream document coverage
yet. Because it is Roadmap, not MVP, it does **not** require urgent downstream sync
alongside the MVP-scoped `RAISE-AI-DOC-*`/`RAISE-FR-MAINT-001` items above — it should be
added to `RAISE-TRACEABILITY-MATRIX.md` with status **ROADMAP** and all downstream stage
columns **"Not applicable — Roadmap, not MVP"** rather than "Pending — awaiting downstream
sync" (that phrasing is reserved for MVP-scoped work awaiting a sync pass).

**v0.6 addition:** Six ESAPS-reference-only pages (`Assignment.tsx`, `Auth.tsx` beyond
Login, `Inventory.tsx`, `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`) plus
`ErrorPages.tsx` are confirmed **out of scope** ([§16 Resolved Question 35]
(#16-open-questions)) and require **no entry at all** in
`RAISE-TRACEABILITY-MATRIX.md` — they never had a Traceability ID and none is being
created now.

Recommended per-requirement test/compliance status values (from source):
`PASS · PARTIAL · FAIL · BLOCKED · NOT_IMPLEMENTED · NOT_TESTED`

Recommended requirement status values (from source):
`PROPOSED · APPROVED · TBD · PILOT · ROADMAP · OUT_OF_SCOPE`

*Source: v0.1 draft §19–§21 (Traceability Model, ID Convention, Status Model).*

---

## Pre-Finalization Quality Pass

Per instructions, ambiguity and gaps are surfaced here, not silently resolved.

### Duplicated / Overlapping Requirements

- **RAISE-FR-ASSET-003 (Custody History) vs. RAISE-FR-OPS-002 (Check-in/Check-out):**
  both describe changes to custody state. The source does not clarify whether
  Check-in/Check-out is the *only* mechanism that writes Custody History, or whether
  other events (e.g., direct reassignment) also do. **Needs business confirmation.**
- **RAISE-FR-ALERT-001 (Alerts)** overlaps conceptually with the warranty-expiry example
  used to illustrate both Alerts (§6.9 in v0.1) and AI Recommendation (§7.6 in v0.1 — the
  "which notebooks expire in 90 days" example). The source uses one business scenario to
  motivate two different capabilities (a simple MVP alert vs. a Roadmap AI
  recommendation). This is not a true duplicate but is easy to conflate during design —
  flagged so MVP alert scope isn't accidentally over-built to match the Roadmap example.

### Ambiguous Requirements

- **RAISE-FR-EXEC-001 (Executive Dashboard):** ~~"Utilization" is listed as a KPI with no
  definition.~~ **Resolved 2026-08-21** — Utilization is now defined as assignment-time-based
  (see [§8](#8-executive-intelligence) and [§16 Resolved Question 27](#16-open-questions)).
  NBV and Risk KPI formulas remain undefined and are still open.
- **RAISE-AI-SEARCH-001 (Natural Language Search):** classified as "Current" capability in
  the AI capability table, yet the source gives no acceptance detail beyond a general
  example. It's unclear whether "Current" means already prototyped/demoed at the pitch,
  or simply "not Pilot/Roadmap" (i.e., intended for MVP). This PRD treats it as MVP based
  on its "Current" classification and its explicit listing as `P0` in the requirement
  itself, but this reading should be confirmed.
- **RAISE-AI-DOC-001, RAISE-AI-DOC-002, RAISE-AI-DOC-003 (OCR/Extraction, Metadata,
  Classification):** now have Traceability IDs, P0/MVP scope (confirmed 2026-08-21,
  [§16 Resolved Question 28](#16-open-questions)), **and** business-confirmed
  acceptance detail (document/metadata scope, confidence-threshold mechanism,
  suggestion-only mode — confirmed 2026-08-21, [§16 Resolved Questions 30–32]
  (#16-open-questions)). The one remaining open point across these three is the
  **numeric confidence-threshold value** for `RAISE-AI-DOC-001` — the mechanism is
  defined but the cutoff number is not.
- **RAISE-AI-DOC-004 (Duplicate Detection):** has a Traceability ID and P0/MVP scope
  (confirmed 2026-08-21, [§16 Resolved Question 28](#16-open-questions)), but — unlike
  the other three — was explicitly asked about in the same 2026-08-21 session and
  **received no business answer**. Matching threshold and merge-vs-flag-for-review
  workflow remain **fully TBD** and should be treated as a design-phase input
  requirement, not a fully specified requirement. Do not infer behavior from
  RAISE-AI-DOC-001/002/003's resolution pattern.
- **RAISE-FR-ALERT-001 (Alerts):** "relevant conditions" and "authorized user" are
  undefined — no rule set or role given.
- **RAISE-FR-MAINT-001 (Maintenance):** ~~complete workflow undefined~~ **Partially
  resolved 2026-08-21** — the 4-stage workflow shape is now confirmed (see
  [§16 Resolved Question 33](#16-open-questions)). SLA per stage, vendor model
  (internal vs. external), cost model, and delegated-approver configuration rules
  remain undefined.
- **RAISE-FR-LICENSE-001 (Software / SaaS License Management):** newly added
  2026-08-21, confirmed **Roadmap scope, not MVP**. Only identity and Roadmap scope are
  confirmed — the license field model, renewal/expiry alert rule, seat/utilization
  tracking, and vendor/cost tracking are entirely undefined. Relationship to
  `RAISE-FR-ALERT-001` (should license expiry trigger an alert the same way warranty
  expiry does?) is also undefined and should be raised in a future Roadmap-planning
  confirmation round. **Engineering note:** `frontend/src/pages/Licenses/` and
  `LicenseDetail` are already built, tested, and routed in `frontend/` — this is ahead
  of the confirmed Roadmap-only scope and should be flagged/reconciled (e.g.,
  feature-gated) rather than treated as approved MVP functionality.
- **RAISE-AI-RECOMMEND-001 (AI Recommendation):** ~~unclear whether `frontend/`'s
  already-built `AIDecisionCenter` page implies an MVP subset~~ **Resolved 2026-08-21**
  — confirmed Roadmap-only, no MVP subset (see
  [§16 Resolved Question 36](#16-open-questions)). **Engineering note:**
  `AIDecisionCenter` is ahead of confirmed scope in the same way as the Licenses pages —
  should be flagged for removal or feature-gating, not treated as approved MVP
  functionality.
- **RAISE-NFR-SEC-RBAC-001 (Security & RBAC):** ~~unclear whether backend enforcement is
  required for MVP~~ **Partially resolved 2026-08-21** — MVP *enforcement level* is now
  confirmed as UI-only/client-side, with backend enforcement explicitly deferred to
  Roadmap (see [§11](#11-security--rbac) and
  [§16 Resolved Question 38](#16-open-questions)). This resolves only *where*
  enforcement happens for MVP; the role list, permission matrix contents, and
  authentication mechanism (Open Questions 21–23) remain fully undefined.
- **RAISE-FR-ORACLE-001 (Oracle FA Integration):** the "Phase 6" code-comment label on
  `frontend/`'s `ReconciliationPage` has been confirmed meaningless as a PRD scope signal
  (**Resolved 2026-08-21**, [§16 Resolved Question 37](#16-open-questions)), but whether
  `ReconciliationPage` itself satisfies this requirement, or needs its own ID, remains
  **explicitly unresolved** — see [Open Question 10a](#16-open-questions). Do not confuse
  the "Phase 6" resolution with a resolution of this substantive mapping question.

### Requirements Needing Business Confirmation

- Whether **Natural Language Search** is truly the only AI capability in MVP scope, or
  whether Risk Scoring should also be pulled into MVP as a pilot-within-MVP (the source
  lists it as "Pilot" but also uses it as an input to the flagship demo example).
- The **actor list** (§5) — whether any actor beyond IT Asset/Finance/Executive/Auditor
  (e.g., a general employee/asset holder role for check-out requests) is needed for
  Check-in/Check-out to function.
- The **RBAC role model** underlying "a user with appropriate permission"
  (RAISE-FR-OPS-002) and "an authorized user" (RAISE-FR-AUDIT-001, RAISE-FR-ALERT-001) —
  no roles are named anywhere in the source. **Note:** the *enforcement level* question
  (backend vs. UI-only for MVP) is now resolved — see `RAISE-NFR-SEC-RBAC-001` above and
  [§16 Resolved Question 38](#16-open-questions) — but the actual role/permission
  *content* is still fully open and belongs here.
- Whether the **Oracle FA integration** is intended to be one-way (import only, as
  stated) or eventually bidirectional — the Roadmap lists "Real-time ERP Integration"
  separately, implying MVP Oracle integration is batch/one-way import only, but this is
  inferred, not stated outright.
- Whether `frontend/`'s `ReconciliationPage` placeholder satisfies `RAISE-FR-ORACLE-001`
  or needs a separate requirement ID — see [Open Question 10a](#16-open-questions).

### Gaps Between Hackathon Proposal and Proposed PRD

- The source (v0.1 draft) provides **no data model** (asset master fields, category
  taxonomy, custody/holder model) — every functional requirement in §6 depends on a data
  model that does not yet exist in any source document.
- The source provides **no NFR values** at all (§10) — performance, availability,
  scalability, backup/recovery, encryption, monitoring, logging are all blank TBD.
- The source provides **no security/RBAC model** (§11) beyond implicit references to
  "appropriate permission" / "authorized user."
- The source does **not** specify whether the Executive Summary (AI-generated, under
  RAISE-FR-EXEC-001) is MVP or Roadmap — it appears listed alongside MVP KPIs but its AI
  dependency (natural-language summarization) sits at the boundary of what's explicitly
  "Current" AI capability. **Flagged, not resolved.**
- No non-Hackathon stakeholder review of this PRD has occurred yet — this remains a
  **draft for requirement review**, per the document status below.
- **RAISE-FR-LICENSE-001 has no basis in the original Hackathon Proposal / v0.1 draft
  at all.** It originates entirely from already-built `frontend/` code
  (`frontend/src/pages/Licenses/`, `frontend/src/pages/LicenseDetail/`) discovered
  during `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 review, and was
  added only after explicit business confirmation on 2026-08-21 as a **Roadmap-scope**
  requirement (see [§16 Resolved Question 34](#16-open-questions)) — it is not MVP. This
  is flagged here because it is a structurally different kind of requirement addition
  than the rest of this PRD — it formalizes existing code into a requirement, rather
  than deriving a requirement from the Hackathon Proposal and then building code from
  it. Treat its field-level detail as no more settled than any other freshly-added TBD
  requirement, and note that the underlying `frontend/` code is currently ahead of the
  confirmed Roadmap-only scope.
- **Six ESAPS-reference-only pages were confirmed entirely out of RAISE scope on
  2026-08-21** (`Assignment.tsx`, `Auth.tsx` beyond Login, `Inventory.tsx`,
  `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`, plus `ErrorPages.tsx` treated
  as infrastructure — see [§16 Resolved Question 35](#16-open-questions) and
  [§15 Out of Scope](#15-out-of-scope)). None of these ever had a PRD requirement or
  Traceability ID, and none is created now. This closes out
  `## NEEDS_PRD_CONFIRMATION` Item 2 from
  `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4.

---

## Appendix A — Process Definitions (carried from v0.1 draft, unchanged)

**Next Deliverables sequence:** RAISE-PRD.md → RAISE-DESIGN.md → RAISE-PROTOTYPE →
RAISE-ACCEPTANCE-CRITERIA.md → RAISE-TEST-PLAN.md → RAISE-TEST-CASES.md →
RAISE-TRACEABILITY-MATRIX.md → Source Code → RAISE-COMPLIANCE-REVIEW.md

**Definition of Ready for Design:** Requirement ID exists; business objective is clear;
user/actor is identified; scope is identified; priority is identified; acceptance
behavior is sufficiently clear; dependencies are known; open questions affecting design
are resolved.

**Definition of Done for Implementation:** Design approved; prototype/UX behavior
defined where applicable; Acceptance Criteria defined; Test Case exists; Source Code
implements the requirement; Test Case passes; Requirement Compliance Review passes.

*Source: v0.1 draft §22–§24.*

---

## Document Status

**Version:** 0.10 (Draft for Requirement Review)
**Status:** Draft for Requirement Review
**Primary Source:** RAISE — Enterprise Asset Intelligence Platform — Final(1).pdf, ADT-RAISE Hackathon Pitch Day, 26 July 2026

**Change Log — v0.9 → v0.10 (2026-08-24, business confirmation via direct stakeholder
conversation):**

1. **Target organization confirmed** (new [§16 Resolved Question 39](#16-open-questions)):
   business confirmed that **RAISE is being developed for direct use by Singer
   (Thailand)**, not as a generic/reference platform — raised while reviewing a
   stakeholder visual-identity proposal that asked whether to apply Singer's Corporate
   Identity colors. No functional requirement, priority, or scope item changes as a
   result — this is a branding/identity fact only, recorded so it isn't silently
   assumed from the `singer/go-template-new-2026-06` backend module namespace. See
   `docs/project-foundation-baseline/RAISE-BRAND-STYLE-GUIDE.md` for the resulting
   CI-aligned styling guidance.

**Change Log — v0.8 → v0.9 (2026-08-21, via `/update-prd` session, live user
confirmation):**

1. **`RAISE-NFR-SEC-RBAC-001` MVP enforcement level confirmed** (new
   [§16 Resolved Question 38](#16-open-questions)): business confirmed, resolving
   `## NEEDS_PRD_CONFIRMATION` Item 5 (the last of the six items) in
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4, that a **UI-only
   (client-side) permission-matrix is acceptable for the Hackathon MVP** — backend-
   enforced RBAC is **explicitly deferred to Enterprise Roadmap / Phase 2**. This
   matches `frontend/`'s current implementation (route guards + client-side
   permission-matrix persistence) and treats `go-template-main`'s `RequireRole`
   middleware as a reference example only (wired on one CRUD group). The security
   caveat — that UI-only enforcement does not block a client-bypassing actor — is
   explicitly recorded as an accepted MVP risk. Updated in §10 (NFR backlog table,
   Authorization/RBAC row), §11 (Security & RBAC), and §17 (Traceability Matrix row for
   `RAISE-NFR-SEC-RBAC-001`, now Status "MVP enforcement level confirmed... role
   list/permission matrix/authentication mechanism still TBD"). **Only the enforcement
   *location* (client-side vs. backend) is resolved — the actual role list, permission
   matrix contents, and authentication mechanism remain fully TBD.**
2. **This closes out all six `## NEEDS_PRD_CONFIRMATION` items** logged in
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4 (Maintenance workflow,
   ESAPS-reference pages, AI Decision Center, Oracle FA Reconciliation "Phase 6",
   Software/SaaS License Management, and RBAC enforcement level).
3. **Full internal-consistency pass performed across v0.5–v0.9** (per explicit request):
   confirmed no other stale/contradictory scope claims remain — in particular, verified
   every `RAISE-FR-LICENSE-001` reference now consistently reads Roadmap (not the
   earlier, incorrect MVP/P0 claim), verified the "first/second `NEEDS_PRD_CONFIRMATION`
   item" ordinal language was replaced with explicit Item-number citations
   (Items 1–6) matching `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4's
   own numbering, and verified §16 Resolved Questions 33–38 all have real, non-dangling
   entries (no orphaned cross-references). No further contradictions were found requiring
   correction beyond what is itemized in this and the v0.6 change log entries.
4. **Impact on downstream documents:** the RBAC enforcement-level decision is a
   **security/architecture decision, not a change to any existing requirement's
   Acceptance Criteria** — it does not by itself require a `RAISE-DESIGN.md` /
   `RAISE-ACCEPTANCE-CRITERIA.md` rewrite, but Technical/Security Design should
   explicitly document the UI-only-for-MVP decision and the accepted risk when it is
   authored, and `RAISE-TEST-PLAN.md`/`RAISE-TEST-CASES.md` should **not** assume or test
   for backend-enforced permission checks in MVP scope (only UI-level gating).
   `RAISE-TRACEABILITY-MATRIX.md` should have its `RAISE-NFR-SEC-RBAC-001` row status
   updated to match §17 of this PRD.

**Change Log — v0.7 → v0.8 (2026-08-21, via `/update-prd` session, live user
confirmation):**

1. **Oracle FA Reconciliation "Phase 6" label confirmed not a PRD phase** (new
   [§16 Resolved Question 37](#16-open-questions)): business confirmed, resolving part
   of `## NEEDS_PRD_CONFIRMATION` Item 4 in
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4, that the "Phase 6"
   reference in `frontend/src/pages/modules.tsx`'s `ReconciliationPage` code comment is a
   **stale/internal-only label from `frontend/`'s own migration plan**, not a phase
   defined anywhere in `RAISE-PRD.md`, and must be **disregarded entirely as a scope
   signal**. Updated in §9 (`RAISE-FR-ORACLE-001` Open Question field).
2. **Explicitly NOT resolved — left open on purpose:** whether `ReconciliationPage`
   itself is intended to satisfy `RAISE-FR-ORACLE-001`'s reconciliation acceptance
   criteria, or needs a separate requirement ID, was **not** part of this decision. The
   user explicitly declined to have this inferred from the "Phase 6" answer. Recorded as
   new **Open Question 10a** in §16, and flagged in `RAISE-FR-ORACLE-001`'s Open Question
   field in §9. Per RAISE's "no silent resolution" principle, this sub-question is
   carried forward unanswered to the next business confirmation round.
3. **Impact on downstream documents:** none — this decision only concerns a code-comment
   label, not a requirement's scope, acceptance criteria, or Traceability ID.
   `RAISE-FR-ORACLE-001`'s existing MVP scope and status in §17 (Traceability Matrix) and
   `RAISE-TRACEABILITY-MATRIX.md` are unchanged.

**Change Log — v0.6 → v0.7 (2026-08-21, via `/update-prd` session, live user
confirmation):**

1. **`RAISE-AI-RECOMMEND-001` (AI Recommendation) re-confirmed Roadmap-only** (new
   [§16 Resolved Question 36](#16-open-questions)): business confirmed, resolving
   `## NEEDS_PRD_CONFIRMATION` Item 3 in
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4, that this requirement
   stays **Roadmap-only with no MVP subset carved out**. `frontend/`'s `AIDecisionCenter`
   page (mock recommendation UI showing age, repair cost, risk score, recommended
   action, confidence) has no MVP requirement backing it and should be **flagged for
   removal or feature-gating** until Roadmap phase. Updated in §7
   (`RAISE-AI-RECOMMEND-001`), §13 (MVP Scope exclusion note), and the Pre-Finalization
   Quality Pass.
2. **Impact on downstream documents:** minimal — `RAISE-AI-RECOMMEND-001` was already
   Roadmap in the Traceability Matrix (§17, unchanged); no MVP artifact needs
   walking back. The main actionable item is for engineering: `frontend/`'s
   `AIDecisionCenter` page is currently shipped/routed ahead of this confirmed
   Roadmap-only scope and should be reconciled (flagged for removal or gating), the same
   pattern already flagged for the Licenses pages in v0.6.

**Change Log — v0.5 → v0.6 (2026-08-21, via `/update-prd` session, live user
confirmation):**

1. **Correction to `RAISE-FR-LICENSE-001`'s recorded scope.** The v0.4 → v0.5 change log
   entry below (and the requirement itself, at the time) stated Priority P0 / Scope MVP.
   That was recorded **before** the actual business decision was received and was
   incorrect. The real, now-confirmed decision (via live user confirmation, 2026-08-21)
   is **Priority Roadmap / Scope Enterprise Roadmap, not MVP**. Corrected in §6, §13
   (removed from MVP list), §14 (added as Enterprise Roadmap item 8), §16 (Resolved
   Question 34 text corrected), §17 (Traceability Matrix row corrected to
   Roadmap/ROADMAP), and the Pre-Finalization Quality Pass. This correction does not
   change the requirement's identity (`RAISE-FR-LICENSE-001` still exists) — only its
   priority/scope.
2. **Six ESAPS-reference-only pages confirmed entirely out of RAISE scope** (new
   [§16 Resolved Question 35](#16-open-questions)): `Assignment.tsx`, `Auth.tsx` (beyond
   Login), `Inventory.tsx`, `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`, and
   `ErrorPages.tsx` (treated as generic infrastructure, no requirement needed at any
   tier). `SoftwareLicense.tsx` is not independently rejected — it is superseded by the
   `RAISE-FR-LICENSE-001` Roadmap decision above (same feature). Added to
   [§15 Out of Scope](#15-out-of-scope) and [§13 MVP Scope](#13-mvp-scope) (explicit
   exclusion note). This resolves `## NEEDS_PRD_CONFIRMATION` Item 2 from
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4.
3. **Impact on downstream documents:** minimal — `RAISE-FR-LICENSE-001` was never
   MVP-scoped in reality, so no downstream MVP artifact needs to be walked back; if any
   downstream document was drafted assuming `RAISE-FR-LICENSE-001` was MVP, it must be
   corrected to Roadmap. The seven out-of-scope pages never had downstream coverage and
   need none now. `RAISE-FR-MAINT-001`'s confirmed 4-stage workflow (from v0.5, unchanged
   by this version) still requires a downstream sync pass — see the v0.4 → v0.5 entry
   below, and the "Next Action" note at the bottom of this section.

**Change Log — v0.4 → v0.5 (2026-08-21, via `/update-prd` session, business-confirmed
through the coordinating agent):**

1. **`RAISE-FR-MAINT-001` (Maintenance) workflow shape confirmed** (new
   [§16 Resolved Question 33](#16-open-questions)): business confirmed the
   ESAPS-reference 4-stage workflow — User Requisition → Dept Approval (Delegated) → IT
   Dispatch → Technician Execution — as a business rule for this requirement, including
   a delegated-approver setting. State model recorded for design reference:
   `PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE`.
   Updated in §6. This resolves the *workflow-shape* portion of Open Question 14;
   SLA per stage, vendor model, cost model, and delegated-approver configuration rules
   remain **TBD**. This resolves `## NEEDS_PRD_CONFIRMATION` Item 1 logged in
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4. *(Path/numbering
   corrected here in v0.9's consistency pass — originally miscited as
   `docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md` §4, "first" item;
   the actual source document is `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md`
   §4, Item 1.)*
2. **New requirement added: `RAISE-FR-LICENSE-001` (Software / SaaS License
   Management)**, recorded at the time as Priority P0, Scope MVP (new
   [§16 Resolved Question 34](#16-open-questions)) — ***corrected in the v0.5 → v0.6
   entry above: the real business decision was Roadmap, not MVP; this entry is left
   as originally written for historical accuracy of what was recorded at the time, but
   should not be read as the current state — see v0.5 → v0.6 above and §6/§13/§14/§17
   for the corrected, current scope.*** Business confirmed that the already-built,
   tested `frontend/src/pages/Licenses/` and `frontend/src/pages/LicenseDetail/` code
   should be formalized as a requirement rather than cut from scope. Added to §6, §13
   (MVP Scope), and §17 (Traceability Matrix). Field model, renewal/expiry alert rule,
   seat/utilization tracking, and vendor/cost tracking are all **TBD** (new Open
   Question 15a) — only identity and scope are resolved by this decision. This resolves
   `## NEEDS_PRD_CONFIRMATION` Item 6 logged in
   `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4.
3. **§17 Requirement Traceability Matrix updated:** `RAISE-FR-MAINT-001` status changed
   from "TBD (workflow detail)" to "Workflow shape confirmed; SLA/vendor/cost model
   still TBD"; new row added for `RAISE-FR-LICENSE-001` with downstream stage columns
   marked "Pending — awaiting downstream sync" in
   `RAISE-TRACEABILITY-MATRIX.md`.
4. **Pre-Finalization Quality Pass updated** to reflect both changes: the
   `RAISE-FR-MAINT-001` ambiguity note is updated to show partial resolution; a new
   note is added for `RAISE-FR-LICENSE-001` flagging its remaining TBD fields and its
   undefined relationship to `RAISE-FR-ALERT-001`. A new "Gaps" entry flags that
   `RAISE-FR-LICENSE-001`, unlike every other requirement in this PRD, has no basis in
   the original Hackathon Proposal / v0.1 draft — it formalizes existing `frontend/`
   code into a requirement instead.
5. **Impact on downstream documents:** both changes affect requirements referenced by
   `RAISE-DESIGN.md`, `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`,
   `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`, and `RAISE-TRACEABILITY-MATRIX.md`.
   **This PRD update does not itself modify those documents** — per this task's explicit
   scope boundary, only `RAISE-PRD.md` was changed. Downstream synchronization
   (`/sync-design`, `/sync-prototype`, `/sync-acceptance-criteria`, `/sync-test-plan`,
   `/sync-test-cases`, `/sync-traceability-matrix`) should be run in a subsequent pass
   to: (a) reflect `RAISE-FR-MAINT-001`'s confirmed 4-stage workflow in
   design/prototype/AC/test artifacts, and (b) create first-time downstream coverage for
   the brand-new `RAISE-FR-LICENSE-001` requirement across all six downstream documents.

**Change Log — v0.3 → v0.4 (2026-08-21, via `/update-prd` session, business-confirmed
through the coordinating agent):**

1. **Utilization KPI calculation mechanics resolved** (new [§16 Resolved Question 29]
   (#16-open-questions), sub-resolution of Resolved Question 27): (a) **Aggregation
   window = real-time snapshot** — Utilization is a point-in-time calculation, not a
   time-series/period aggregate; (b) **Denominator exclusions** — Disposed, Retired,
   and Under Maintenance assets are excluded from the "total available time"
   denominator. Updated in §8 (`RAISE-FR-EXEC-001`).
2. **RAISE-AI-DOC-001 (OCR/Extraction) acceptance detail resolved** (new
   [§16 Resolved Question 30](#16-open-questions)): document scope confirmed as
   Invoice/Receipt, Warranty document, and Asset nameplate/label; a confidence-threshold
   mechanism is confirmed (below-threshold extractions routed to human review before
   save), but the **numeric threshold value remains TBD**. Updated in §7.
3. **RAISE-AI-DOC-002 (Metadata) acceptance detail resolved** (new
   [§16 Resolved Question 31](#16-open-questions)): scope confirmed as document type
   tagging, key-value field extraction, and search tags/keywords. Updated in §7.
4. **RAISE-AI-DOC-003 (Classification) acceptance detail resolved** (new
   [§16 Resolved Question 32](#16-open-questions)): mode confirmed as suggestion-only —
   human confirmation required before assignment, no auto-assign. Updated in §7.
5. **RAISE-AI-DOC-004 (Duplicate Detection) — explicitly NOT resolved.** This
   requirement's matching-threshold and merge-vs-flag-for-review workflow questions
   were asked in the same 2026-08-21 `/update-prd` session, but **no business answer
   was received**. Per RAISE's "no silent resolution" principle, all TBD markers for
   RAISE-AI-DOC-004 (in §7, §16 Open Question 20a, and §17) are left unchanged. This
   item is carried forward, unresolved, to the next business confirmation round.
6. **§17 Requirement Traceability Matrix updated:** status for RAISE-AI-DOC-001,
   RAISE-AI-DOC-002, and RAISE-AI-DOC-003 changed from "TBD (acceptance detail)" to
   "Acceptance detail defined — ready for downstream sync" (RAISE-AI-DOC-001 additionally
   notes the numeric confidence threshold is still open). RAISE-AI-DOC-004 status is
   unchanged ("TBD (acceptance detail)"), with a note that it was asked about and not
   answered.
7. **Pre-Finalization Quality Pass updated** to reflect the above: RAISE-AI-DOC-001/002/003
   are now described as resolved (with the one remaining confidence-threshold-value gap
   flagged for RAISE-AI-DOC-001); RAISE-AI-DOC-004 is now called out separately as
   unresolved so it is not mistaken for having followed the same resolution pattern.
8. **Impact on downstream documents:** these changes affect requirements referenced by
   `RAISE-DESIGN.md`, `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`,
   `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`, and `RAISE-TRACEABILITY-MATRIX.md`.
   **This PRD update does not itself modify those documents** — per this task's explicit
   scope boundary, only `RAISE-PRD.md` was changed. Downstream synchronization
   (`/sync-design`, `/sync-prototype`, `/sync-acceptance-criteria`, `/sync-test-plan`,
   `/sync-test-cases`, `/sync-traceability-matrix`) should be run in a subsequent pass
   for RAISE-AI-DOC-001/002/003 and for the Utilization KPI mechanics update.
   RAISE-AI-DOC-004 should remain marked "Pending — awaiting downstream sync" /
   not-yet-testable in all downstream documents until it is resolved.

**Change Log — v0.2 → v0.3 (2026-08-21, via `/update-prd` session, business-confirmed
through the coordinating agent):**

1. **Utilization KPI definition resolved** (§16 Q3 → Resolved Question 27): Utilization
   is now defined as **assignment-time-based** — % of time an asset is assigned to a
   user/department, relative to total available time. Updated in §8 (Executive
   Dashboard KPI section, `RAISE-FR-EXEC-001`) and the Pre-Finalization Quality Pass
   (Ambiguous Requirements). NBV and Risk KPI formulas remain undefined/open.
2. **Four new AI capability requirements added** (§16 Resolved Question 28): business
   confirmed that OCR/Extraction, Metadata, Classification, and Duplicate Detection —
   previously row labels only in the §7 capability table with no Traceability ID —
   should each receive a Traceability ID at **Priority P0 / Scope MVP** (matching
   `RAISE-AI-SEARCH-001`'s treatment). Added as `RAISE-AI-DOC-001` (OCR/Extraction),
   `RAISE-AI-DOC-002` (Metadata), `RAISE-AI-DOC-003` (Classification), and
   `RAISE-AI-DOC-004` (Duplicate Detection) in §7, with rows added to the §17
   Requirement Traceability Matrix and §13 MVP Scope updated accordingly. Detailed
   acceptance behavior, field lists, and business rules for each of the four remain
   **TBD** — only identity, priority, and scope are resolved.
3. Both changes resolve `RAISE-TRACEABILITY-MATRIX.md` **Gap 5** (both sub-items:
   Utilization KPI definition, and missing Traceability IDs for Current-status AI
   capabilities).
4. **Impact on downstream documents:** These changes affect requirements referenced by
   `RAISE-DESIGN.md`, `RAISE-PROTOTYPE.md`, `RAISE-ACCEPTANCE-CRITERIA.md`,
   `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`, and `RAISE-TRACEABILITY-MATRIX.md`.
   **This PRD update does not itself modify those documents** — they must be
   synchronized in a subsequent pass (per this vault's `/sync-design`, `/sync-prototype`,
   `/sync-acceptance-criteria`, `/sync-test-plan`, `/sync-test-cases`, and
   `/sync-traceability-matrix` chain) to reflect the resolved Utilization definition and
   the four new `RAISE-AI-DOC-*` requirements.

**Next Action:** Business / Product Requirement Review — resolve remaining open questions
in §16 (NBV/Risk KPI formulas; `RAISE-AI-DOC-001` numeric confidence-threshold value;
`RAISE-AI-DOC-004` matching threshold and merge-vs-flag-for-review workflow — asked
2026-08-21, still unanswered; `RAISE-FR-MAINT-001` SLA/vendor/cost model and
delegated-approver configuration rules; `RAISE-FR-LICENSE-001` Roadmap-phase field model,
renewal/expiry alert rule, seat/utilization tracking, and vendor/cost tracking;
**`RAISE-FR-ORACLE-001` Open Question 10a — whether `frontend/`'s `ReconciliationPage`
placeholder satisfies this requirement or needs a separate ID, explicitly left open per
[Resolved Question 37](#16-open-questions)**) and the one remaining
`## NEEDS_PRD_CONFIRMATION` item still awaiting a business answer (backend-enforced vs.
UI-only RBAC for MVP — see `docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md` §4
Item 5; Items 3 and 4 were resolved 2026-08-21, see
[§16 Resolved Questions 36–37](#16-open-questions)); then run the downstream sync chain
(`RAISE-DESIGN.md` onward) to reflect this v0.8 update — in particular to update
`RAISE-FR-MAINT-001`'s downstream artifacts for the confirmed workflow shape
(MVP-scoped, needs sync now) and to note `RAISE-FR-LICENSE-001`'s Roadmap-only status in
`RAISE-TRACEABILITY-MATRIX.md` (no urgent MVP sync needed). The seven ESAPS-reference
pages confirmed out of scope in v0.6, the `RAISE-AI-RECOMMEND-001` re-confirmation in
v0.7, and the "Phase 6" labeling clarification in v0.8 require no downstream document
changes. Outstanding actions: an **engineering flag** (not a docs-chain sync) for
`frontend/`'s `AIDecisionCenter` page (should be removed or feature-gated, no MVP
requirement behind it), and a **pending business answer** on whether
`ReconciliationPage` maps to `RAISE-FR-ORACLE-001` or needs its own ID.
