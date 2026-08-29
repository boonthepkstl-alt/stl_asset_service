# RAISE Design Document

**Product:** RAISE — Enterprise Asset Intelligence Platform
**Document:** System / Product Design
**Version:** 0.8 Draft
**Status:** Draft for Design Review
**Design Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.9
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

This document translates the approved / proposed requirements in
`RAISE-PRD.md` into a logical product and system design.

The design answers:

- How RAISE capabilities are organized
- How users interact with the platform
- How asset data flows through the system
- How Oracle FA and other data sources connect
- How the AI Intelligence Layer operates
- Which responsibilities are deterministic and which use AI
- What must be designed further before implementation

This document does **not** invent final technology choices where the PRD
does not define them.

---

# 2. Design Principles

## 2.1 PRD is the Source of Truth

All design decisions must trace back to a RAISE requirement.

```text
RAISE-PRD.md
     ↓
RAISE-DESIGN.md
     ↓
Prototype
     ↓
Acceptance Criteria
     ↓
Test Plan
```

If a design element cannot be traced to a requirement, it must be
classified as:

- Design Support
- Technical Necessity
- Open Question
- Future / Roadmap

---

## 2.2 VERSCAN is Reference Only

VERSCAN may be used to inspect existing Asset Management workflows and
UX patterns.

It must not be used as an automatic source of RAISE functionality.

```text
VERSCAN
   ↓
Reference / Benchmark
   ↓
Candidate Design Pattern
   ↓
Check against RAISE PRD
   ↓
Use only if required / approved
```

---

## 2.3 Deterministic First

Business-critical operations should use deterministic application logic.

Examples:

- CRUD
- Asset state changes
- Check-in / Check-out
- Approval / workflow rules
- Financial data processing
- Audit logging
- Access control

AI should not replace deterministic rules where exact behavior is
required.

---

## 2.4 AI as an Intelligence Layer

AI is positioned as a layer between connected data sources and business
applications.

```text
Data Sources
     ↓
Data Integration / Normalization
     ↓
AI Intelligence Layer
     ↓
Business Applications
```

---

# 3. Logical System Architecture

## 3.1 High-Level Architecture

```mermaid
flowchart TB
    subgraph PRES["Presentation Layer"]
        P1["Asset Management"]
        P2["Operations"]
        P3["Dashboard"]
        P4["AI Search"]
        P5["License Management"]
    end

    subgraph APP["Application / Domain Layer"]
        A1["Asset"]
        A2["Custody"]
        A3["Maintenance"]
        A4["Warranty"]
        A5["Audit"]
        A6["Oracle"]
        A7["Alerts"]
        A8["Lifecycle"]
        A9["Executive"]
        A10["License"]
    end

    subgraph AI["Intelligence Layer"]
        I1["Search"]
        I2["Extraction / OCR"]
        I8["Metadata"]
        I3["Classification"]
        I4["Duplicate Detection"]
        I5["Risk (Pilot)"]
        I6["Lifecycle Prediction (Pilot)"]
        I7["Recommendation (Roadmap)"]
    end

    subgraph DATA["Data Layer"]
        D1["Asset Data"]
        D2["Lifecycle Data"]
        D3["Financial Data"]
        D4["Maintenance"]
        D5["Warranty"]
        D6["Audit"]
        D7["Source Metadata"]
        D8["License Data"]
    end

    PRES --> APP --> AI --> DATA

    SRC1["Oracle FA"] --> DATA
    SRC2["Excel"] --> DATA
    SRC3["Warranty (external)"] --> DATA
    SRC4["Invoice / PO"] --> DATA
    SRC5["Maintenance (external)"] --> DATA
    SRC6["Email"] --> DATA
```

### Design Note

The diagram is a logical architecture. It does not prescribe a specific
cloud provider, programming language, database, AI model, or deployment
platform because those are not defined in the PRD.

**Traceability note on Intelligence Layer nodes (updated 2026-08-21 against
PRD v0.3):** `I2` (Extraction/OCR), `I8` (Metadata), `I3` (Classification), and
`I4` (Duplicate Detection) reflect the "Current" AI capabilities named in
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#7-ai-requirements) §7's
capability table. As of PRD v0.3 (§16 Resolved Question 28), these four
capabilities now each have a dedicated Traceability ID at Priority P0 / Scope
MVP — `RAISE-AI-DOC-001` (Extraction/OCR, node `I2`), `RAISE-AI-DOC-002`
(Metadata, node `I8`), `RAISE-AI-DOC-003` (Classification, node `I3`), and
`RAISE-AI-DOC-004` (Duplicate Detection, node `I4`) — matching the treatment
already given to Natural Language Search (`RAISE-AI-SEARCH-001`). This
replaces the prior design note stating these nodes had "no dedicated
Traceability ID ... in the PRD"; that gap is now closed at the PRD identity/
priority/scope level. Detailed acceptance behavior for each of the four
remains **TBD** in the PRD itself, so this design likewise does not assume
document scope, field lists, matching thresholds, or resolution workflows —
see [§9A Document Intelligence Capabilities](#9a-document-intelligence-capabilities-ocrextraction-metadata-classification-duplicate-detection)
below for the design-level detail and open items.

**Traceability note on new License nodes (added 2026-08-21 against PRD v0.5;
priority/scope corrected 2026-08-21 in Design v0.6 against PRD v0.6/v0.7/v0.8):**
`P5` (License Management, Presentation Layer), `A10` (License, Application/Domain
Layer), and `D8` (License Data, Data Layer) are nodes retained to reflect
[`RAISE-FR-LICENSE-001`](../01-requirements/RAISE-PRD.md#raise-fr-license-001--software--saas-license-management)
(Software / SaaS License Management), added to the PRD in v0.5. This requirement
originates from already-built `frontend/src/pages/Licenses/` and
`frontend/src/pages/LicenseDetail/` code, not from the original Hackathon
Proposal (see PRD §16 Resolved Question 34). The requirement's identity,
**priority (Roadmap), and scope (Enterprise Roadmap — not Phase 1 MVP)** are
confirmed — the license field model, renewal/expiry alert rule,
seat/utilization tracking, and vendor/cost tracking are all **TBD** in the
PRD, so this design likewise does not invent a field model or alert rule.
**Correction (2026-08-21, Design v0.6):** this note and the diagram's
placement of `P5`/`A10`/`D8` previously implied Priority P0 / Scope MVP,
matching an earlier, incorrect PRD draft position — the PRD itself has since
corrected this to Roadmap, and this design now matches. The diagram still
shows these nodes in their existing layer positions (they are still valid
logical components), but they must be read as Roadmap-scoped, not MVP, per
[§22 MVP vs Roadmap Design Boundary](#22-mvp-vs-roadmap-design-boundary). See
[§5.3 License Domain](#53-license-domain-enterprise-roadmap) below for
design-level detail and open items.

---

# 4. Major System Components

## 4.1 Asset Management

Responsible for:

- Asset Registry
- Category & Hierarchy
- Asset lifecycle information
- Asset identity
- Asset status

Requirement traceability:

- `RAISE-FR-ASSET-001`
- `RAISE-FR-ASSET-002`
- `RAISE-FR-LIFE-001`

---

## 4.1A License Management (Enterprise Roadmap)

**Priority:** Roadmap (not MVP-confirmed) · **Scope:** Enterprise Roadmap — not
Phase 1 MVP (corrected 2026-08-21 against PRD v0.6/v0.7/v0.8, §16 Resolved
Question 34; see [Document Status](#document-status) v0.6 change log for the
correction history). This design area was originally recorded here as
"Priority P0, Scope MVP" in Design v0.5 — that was a design-layer error made
before the actual business decision was reflected; the PRD's own correction
note on `RAISE-FR-LICENSE-001` states an earlier PRD pass briefly and
incorrectly recorded Priority P0 / Scope MVP too, before being corrected to
Roadmap. This design now matches the corrected PRD.

Responsible for (Roadmap-phase, not built for MVP):

- License inventory (list view)
- License detail record
- Association of a license with applicable asset(s) and/or holder(s), where
  such an association exists

Requirement traceability:

- `RAISE-FR-LICENSE-001` (Roadmap)

**Status:** design area retained, reclassified from MVP to Roadmap
(2026-08-21 correction, against PRD v0.6+). See [§5.3 License
Domain](#53-license-domain) for the conceptual data flow and TBD items — the
field model, renewal/expiry alert rule, seat/utilization tracking, and
vendor/cost tracking are all **TBD** in the PRD and are not invented here.
See also [§22 MVP vs Roadmap Design Boundary](#22-mvp-vs-roadmap-design-boundary),
where this capability now appears under Roadmap, not MVP.

---

## 4.2 Custody & Asset Operations

Responsible for:

- Custody History
- Check-in / Check-out
- QR / Barcode identification
- Asset state transition

Requirement traceability:

- `RAISE-FR-ASSET-003`
- `RAISE-FR-OPS-001`
- `RAISE-FR-OPS-002`

### Conceptual State

```text
                    ┌──────────────┐
                    │   REGISTERED │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   ASSIGNED   │
                    └──────┬───────┘
                           │
                    Check-out / Transfer
                           │
                           ▼
                    ┌──────────────┐
                    │   IN USE     │
                    └──────┬───────┘
                           │
                         Return
                           │
                           ▼
                    ┌──────────────┐
                    │   CHECK-IN   │
                    └──────┬───────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Maintenance / Audit│
                 └─────────┬──────────┘
                           │
                           ▼
                       Disposal
```

**Important:** Exact asset statuses and transition rules remain TBD in
the PRD.

**Open ambiguity (from PRD Pre-Finalization Quality Pass):** the PRD does not
clarify whether Check-in/Check-out (`RAISE-FR-OPS-002`) is the *only* mechanism
that writes Custody History (`RAISE-FR-ASSET-003`), or whether other events
(e.g., direct reassignment) also do. This design groups both under one domain
component (Custody & Asset Operations) pending that business confirmation — see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#duplicated--overlapping-requirements).

**Disposal is Enterprise Roadmap, not MVP** (resolved 2026-08-21, see
`RAISE-PRD.md` §14 item 7 and §16 Resolved Questions). It remains in this diagram as the
conceptual terminal stage of the asset lifecycle, but no Disposal screen, flow, or data
model is part of the MVP design — no MVP component in §4/§5/§6 below should be read as
implying a disposal capability exists.

---

# 5. Maintenance & Warranty

## 5.1 Maintenance Domain

The maintenance domain stores maintenance information associated with an
asset, including a defined maintenance-request workflow.

Conceptual relationship:

```text
Asset
  │
  ├── Maintenance Record
  │       ├── Date
  │       ├── Event
  │       ├── Status
  │       └── Cost
  │
  └── Maintenance History
```

### Maintenance Request Workflow (confirmed 2026-08-21, PRD v0.5 §16 Resolved Question 33)

The PRD now confirms a **4-stage workflow shape** for `RAISE-FR-MAINT-001`,
originally identified as an ESAPS-reference pattern in
`docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md` §4:

```text
Stage 1                Stage 2                     Stage 3            Stage 4
User Requisition  →  Dept Approval (Delegated)  →  IT Dispatch  →  Technician Execution
```

- **User Requisition** — a user raises a maintenance request against an asset.
- **Dept Approval (Delegated)** — the request is approved by a department
  approver, who may be a delegated approver per a configurable
  delegated-approver setting.
- **IT Dispatch** — an approved request is dispatched by IT to a
  technician/queue.
- **Technician Execution** — the technician performs the maintenance work
  through to completion.

### Conceptual State Model

```text
   ┌────────────────────────┐
   │ PENDING_DEPT_APPROVAL  │  ← created by User Requisition
   └───────────┬────────────┘
               │ Dept Approval (Delegated)
               ▼
   ┌────────────────────────┐
   │  PENDING_IT_DISPATCH   │
   └───────────┬────────────┘
               │ IT Dispatch
               ▼
   ┌────────────────────────────────────┐
   │ PLANNING / IN_PROGRESS / ON_HOLD   │  ← Technician Execution
   └───────────────────┬─────────────────┘
                        ▼
                     ┌──────┐
                     │ DONE │
                     └──────┘
```

This state model is carried directly from the PRD's Acceptance Criteria for
design reference and must not be extended with additional states without
business confirmation.

**Delegated-approver concept:** the Dept Approval stage may be performed by a
delegated approver per a configurable setting. Delegation configuration rules
(who may delegate, to whom, and how delegation is audited) are **TBD** — see
below.

**Remaining TBD (per PRD §16 Q14, partially resolved):** SLA per stage, the
vendor model (internal technician vs. external vendor dispatch), the cost
model/tracking, and delegated-approver configuration rules are **not**
defined in the PRD and therefore remain TBD in this design as well. This
design does not invent values for any of them.

Requirement:

`RAISE-FR-MAINT-001`

Requirement traceability (RBAC dependency): approval, dispatch, and technician
roles, and the delegated-approver setting, depend on `RAISE-NFR-SEC-RBAC-001`
(TBD, see [§16 Security Architecture](#16-security-architecture)).

---

## 5.2 Warranty Domain

**Status:** field list **resolved 2026-08-29** (PRD §16 Resolved Question 40,
resolving PRD Open Question 15). For MVP, the Warranty field is a single field
on the Asset record:

```text
Asset
  │
  └── warrantyExpiry
```

`warrantyExpiry` is already implemented on the Asset record. A draft 8-field
proposal (start date, provider/vendor, type, coverage details, cost, claim
contact, document reference — in addition to expiry) was presented to the
business as a candidate, not a decision; the business explicitly **rejected**
those seven additional fields for MVP scope (not silently deferred). Any of
them would require a separate, future business confirmation before being
added to `RAISE-FR-WARRANTY-001` or this design. This design intentionally
does not model those rejected fields.

Requirement:

`RAISE-FR-WARRANTY-001`

### Future AI Use

Warranty information can become an input to:

- Natural-language search
- Risk analysis
- Lifecycle analysis
- Recommendation

---

## 5.3 License Domain (Enterprise Roadmap)

**Status:** design area retained, **Priority Roadmap, Scope Enterprise
Roadmap — not Phase 1 MVP** (corrected 2026-08-21 against PRD v0.6/v0.7/v0.8,
§16 Resolved Question 34). Requirement:
[`RAISE-FR-LICENSE-001`](../01-requirements/RAISE-PRD.md#raise-fr-license-001--software--saas-license-management)
(Software / SaaS License Management). **Correction note:** Design v0.5 stated
"Priority P0, Scope MVP" here — that was incorrect and has been corrected in
this revision to match the PRD's own correction (the PRD itself records that
an earlier PRD pass briefly and incorrectly recorded the same P0/MVP values
before the actual business decision, Roadmap, was received).

**Origin note:** unlike every other requirement in this design, this one has
no basis in the original Hackathon Proposal / v0.1 draft PRD — it formalizes
already-built, tested `frontend/src/pages/Licenses/` and
`frontend/src/pages/LicenseDetail/` code into a requirement (PRD §16 Resolved
Question 34). Only the requirement's identity, priority, and scope are
confirmed; this design therefore intentionally does not invent a field model,
alert rule, or vendor/cost tracking model beyond what the code implies at the
component/data-flow level.

### Conceptual Component & Data Flow

```text
License Inventory (list view)
        │
        ▼
License Detail (single record view)
        │
        ├── Association → Asset(s)   [where such an association exists]
        │
        └── Association → Holder(s)  [where such an association exists]
```

- **License Inventory** — a list view of license records (mirrors
  `frontend/src/pages/Licenses/`).
- **License Detail** — a detail view of a single license record (mirrors
  `frontend/src/pages/LicenseDetail/`).
- Both views are gated by `RAISE-NFR-SEC-RBAC-001` (access control for
  license data, per PRD Dependencies) — TBD pending Security Design.

### Data Model TBD

The following are **not** defined in the PRD and are therefore **not**
invented here — they remain open design/requirement items:

- License field model (what fields constitute a license record)
- Renewal / expiry alert rule
- Seat / utilization tracking
- Vendor / cost tracking

### Relationship to Alerts (Open)

Whether license renewal/expiry should integrate with
[`RAISE-FR-ALERT-001`](#14-alert-architecture) (Alert Architecture) — the same
way warranty expiry does — is explicitly **TBD** in the PRD (§16 Q15a) and is
therefore left as an open design item, not assumed. If confirmed, license
expiry would conceptually feed the same `Business Event → Rule Evaluation →
Alert Created → Authorized User` flow described in §14, but this must not be
built ahead of that confirmation.

### Dependencies

- `RAISE-FR-ASSET-001` (asset association)
- `RAISE-NFR-SEC-RBAC-001` (access control)
- `RAISE-FR-ALERT-001` (relationship TBD, see above)

---

# 6. Oracle FA Integration

## 6.1 Logical Design

```text
                 ┌─────────────────┐
                 │    Oracle FA    │
                 └────────┬────────┘
                          │
                          │ Integration
                          ▼
                 ┌─────────────────┐
                 │ Integration     │
                 │ Layer           │
                 └────────┬────────┘
                          │
                 Mapping / Validation
                          │
                          ▼
                 ┌─────────────────┐
                 │ RAISE Asset     │
                 │ Data Context    │
                 └────────┬────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Dashboard     Search      Intelligence
```

## 6.2 Required MVP Capability

The PRD requires:

- Oracle FA Integration
- Import NBV / Depreciation

Requirement:

`RAISE-FR-ORACLE-001`

## 6.3 Integration Design Decisions Still Required

The PRD explicitly leaves these open:

- API vs file integration
- Synchronization frequency
- Data mapping
- Error handling
- Retry mechanism
- Integration ownership
- Source-of-truth rules
- Security mechanism

Therefore the design must not prematurely select one method.

## 6.4 ReconciliationPage / "Phase 6" Label — Not a Design Decision Yet

**Updated 2026-08-21 against PRD v0.9 (§16 Resolved Question 37, Open Question
10a):** `frontend/`'s `ReconciliationPage` (`frontend/src/pages/modules.tsx`)
carries an internal code comment referencing a "Phase 6" once "Oracle FA is
connected." Business has confirmed that **"Phase 6" is a stale/internal-only
label from `frontend/`'s own migration plan and does not correspond to any
phase defined in `RAISE-PRD.md`** — `RAISE-PRD.md` only defines Phase 1 MVP
and Enterprise Roadmap (see [§22 MVP vs Roadmap Design
Boundary](#22-mvp-vs-roadmap-design-boundary)). This design must **disregard
"Phase 6" entirely as a scope or sequencing signal** — it says nothing about
whether, when, or on what `ReconciliationPage` depends.

**This resolves only the label.** The substantive question — **whether
`ReconciliationPage` is intended to satisfy `RAISE-FR-ORACLE-001`'s
reconciliation acceptance behavior, or whether it needs a separate
requirement ID** — remains **explicitly open** in the PRD
([Open Question 10a](../01-requirements/RAISE-PRD.md#16-open-questions)) and
is **not answered by this design**. Accordingly:

- This design does **not** add `ReconciliationPage` as a component of the
  §6.1 Logical Design or of Oracle FA Integration's requirement traceability
  above, because doing so would silently assume an answer to Open Question
  10a.
- No mapping between `ReconciliationPage` and `RAISE-FR-ORACLE-001` — or a new
  requirement ID — should be treated as decided until PRD Open Question 10a
  is resolved by business.
- See also [§25 Design Open Questions, item 15a](#25-design-open-questions)
  below, added to carry this question forward at the design layer.

---

# 7. Data Source Architecture

RAISE connects information from multiple sources.

```text
┌────────────┐
│   Excel    │
└─────┬──────┘
      │
┌─────▼──────┐
│ Oracle FA  │
└─────┬──────┘
      │
┌─────▼──────┐
│  Warranty  │
└─────┬──────┘
      │
┌─────▼──────┐
│ Maintenance│
└─────┬──────┘
      │
┌─────▼──────┐
│ Invoice/PO │
└─────┬──────┘
      │
┌─────▼──────┐
│   Email    │
└─────┬──────┘
      │
      ▼
Integration / Normalization
      │
      ▼
RAISE Intelligence Context
```

## 7.1 Data Normalization

The integration layer should conceptually perform:

```text
Source Data
   ↓
Extract
   ↓
Validate
   ↓
Map
   ↓
Normalize
   ↓
Associate with Asset
   ↓
Store / Index
   ↓
Expose to Applications / AI
```

The exact implementation is TBD.

---

# 8. AI Intelligence Architecture

## 8.1 Hybrid AI Model

RAISE PRD defines two major execution patterns.

### Deterministic / Rule-based

```text
CRUD
Workflow
Business Rules
Access Control
Audit
Financial Processing
```

### LLM / RAG

```text
Natural Language Search
Data Summarization
```

This separation must be preserved.

---

## 8.2 AI Flow

```text
                    User Question
                          │
                          ▼
                 ┌─────────────────┐
                 │ Query / Intent   │
                 │ Understanding    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Data Retrieval  │
                 │ / RAG           │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Context / Source│
                 │ Validation      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ LLM / Response  │
                 └────────┬────────┘
                          │
                          ▼
                    User Answer
```

### Important Design Rule

The AI response must not invent asset facts.

Where applicable, the response should expose the source information used
to produce the answer.

The exact citation / provenance mechanism remains a design item because
the PRD asks how AI answers should cite source data.

---

# 9. Natural Language Search

Requirement:

`RAISE-AI-SEARCH-001`

## Conceptual Flow

```text
User
 │
 │ "Which notebooks expire
 │  within 90 days?"
 ▼
AI Search
 │
 ▼
Identify intent
 │
 ▼
Retrieve:
 ├── Asset
 ├── Warranty
 ├── Maintenance
 └── Financial data
 │
 ▼
Apply business rules / filters
 │
 ▼
Generate answer
 │
 ▼
Show result + source context
```

The final UI and retrieval technology are TBD.

**Open ambiguity (from PRD Pre-Finalization Quality Pass):** the PRD classifies
Natural Language Search as a "Current" AI capability and lists it as `P0`, but
it is unclear whether "Current" means already prototyped/demoed at the pitch or
simply "intended for MVP." This design treats `RAISE-AI-SEARCH-001` as MVP based
on that classification, consistent with the PRD's own reading — but this should
be confirmed, not assumed settled, before implementation. See
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#ambiguous-requirements).

---

# 9A. Document Intelligence Capabilities (OCR/Extraction, Metadata, Classification, Duplicate Detection)

Requirements:

- `RAISE-AI-DOC-001` (OCR / Extraction)
- `RAISE-AI-DOC-002` (Metadata)
- `RAISE-AI-DOC-003` (Classification)
- `RAISE-AI-DOC-004` (Duplicate Detection)

Status: **Current AI capability, Priority P0, Scope MVP** (confirmed
2026-08-21 via PRD §16 Resolved Question 28). These four capabilities were
previously row labels only in the PRD §7 capability table with no dedicated
requirement; they now have Traceability IDs and MVP scope, consistent with
`RAISE-AI-SEARCH-001`.

## Conceptual Flow

```text
Source Document / Record
 (Invoice, PO, Warranty doc,
  Maintenance doc, Email attachment)
        │
        ▼
 OCR / Extraction (RAISE-AI-DOC-001)
        │
        ▼
 Metadata Generation (RAISE-AI-DOC-002)
        │
        ▼
 Classification (RAISE-AI-DOC-003)
        │
        ▼
 Duplicate Detection (RAISE-AI-DOC-004)
        │
        ▼
 Associate with Asset / Financial / Maintenance / Warranty record
```

This sequencing (Extraction → Metadata → Classification → Duplicate
Detection) is a **design-level convenience grouping only** — the PRD does not
state an execution order between the four capabilities, and each may in
practice run independently or in a different order. This diagram should not
be read as a specified pipeline.

## Design Notes and TBD Items

**Updated 2026-08-21 against PRD v0.4 (§16 Resolved Questions 30–32):**
acceptance detail for `RAISE-AI-DOC-001`, `RAISE-AI-DOC-002`, and
`RAISE-AI-DOC-003` is now business-confirmed. `RAISE-AI-DOC-004` was asked
about in the same session but received no answer and remains fully TBD.

- **OCR / Extraction (`RAISE-AI-DOC-001`):**
  - **Document scope (resolved):** three document types — Invoice/Receipt,
    Warranty document, and Asset nameplate/label (e.g., serial number,
    model).
  - **Confidence-threshold mechanism (resolved):** the system computes a
    confidence score for extracted data; when the score is below a defined
    threshold, the extraction is routed to **human review before it is
    saved to the asset record** — no auto-save below threshold.
  - **Still TBD:** the exact numeric confidence-threshold value itself. The
    mechanism must not be built assuming a specific cutoff number until
    business confirms it.
- **Metadata (`RAISE-AI-DOC-002`):**
  - **Scope (resolved):** three areas — (a) document type tagging, (b)
    key-value field extraction (e.g., vendor, date, amount), (c) search
    tags/keywords for full-text search.
  - **Still TBD (design-phase detail):** exact per-document-type field list
    and how tags/keywords are surfaced to users in the UI.
- **Classification (`RAISE-AI-DOC-003`):**
  - **Mode (resolved):** **suggestion-only** — the capability suggests a
    category/document-type classification; it must **not** auto-assign the
    classification (e.g., into `RAISE-FR-ASSET-002` Category & Hierarchy). A
    human user must review and confirm the suggestion before it is written
    to the record.
  - **Still TBD (design-phase detail):** exact classification taxonomy
    (category list, document-type list) and the human-confirmation
    UI/workflow detail.
- **Duplicate Detection (`RAISE-AI-DOC-004`):** matching criteria/threshold
  and the resolution workflow (auto-merge vs. flag-for-review) remain fully
  **TBD** — explicitly asked of the business in the 2026-08-21 session with
  **no answer received**. Do not infer behavior from the resolution pattern
  used for `RAISE-AI-DOC-001`/`002`/`003` above.

## Hybrid AI Architecture Placement

Consistent with [§2.3 Deterministic First](#23-deterministic-first) and
[§8.1 Hybrid AI Model](#81-hybrid-ai-model): these four capabilities sit in
the AI/LLM-assisted layer (they are listed as "Current" AI capabilities in
PRD §7, not as deterministic CRUD). Per PRD v0.4 confirmation, `RAISE-AI-DOC-001`
(below-threshold extractions) and `RAISE-AI-DOC-003` (classification) are both
**human-review-gated** — neither auto-saves nor auto-assigns without human
confirmation — consistent with [§2.3 Deterministic First](#23-deterministic-first).
`RAISE-AI-DOC-004` (Duplicate Detection) remains fully TBD on this point
(auto-merge vs. flag-for-review not yet decided) and must not bypass
deterministic confirmation/audit logic until the PRD resolves it. This
boundary must be preserved regardless of which capability runs first.

## Dependencies

- `RAISE-FR-ASSET-001` (all four)
- `RAISE-FR-ASSET-002` (Classification, `RAISE-AI-DOC-003`)
- `RAISE-AI-DOC-001` (Metadata, `RAISE-AI-DOC-002`, depends on extraction
  output per PRD)
- Data sources named in PRD §7 intro: Excel, Oracle FA, Warranty,
  Maintenance, Invoice/PO, Email

---

# 10. Risk Scoring

Requirement:

`RAISE-AI-RISK-001`

Status:

**Pilot**

## Conceptual Input

```text
Asset Age
    │
Maintenance History
    │
Warranty Status
    │
Oracle FA
    │
    ▼
Risk Evaluation
    │
    ▼
Risk Score
```

The PRD does not define:

- Formula
- Weight
- Threshold
- Training data
- Model
- Accuracy target

Therefore these must be validated as part of the pilot design.

---

# 11. Lifecycle Prediction

Requirement:

`RAISE-AI-LIFECYCLE-001`

Status:

**Pilot**

Concept:

```text
Historical Asset Data
        │
        ├── Age
        ├── Maintenance
        ├── Warranty
        ├── Financial
        └── Lifecycle
        │
        ▼
Prediction Model
        │
        ▼
Future Lifecycle Signal
```

Prediction target and accuracy criteria are TBD.

---

# 12. AI Recommendation

Requirement:

`RAISE-AI-RECOMMEND-001`

Status:

**Roadmap**

The design should leave an extension point for future recommendations.

Concept:

```text
Connected Data
      │
      ▼
Risk / Prediction
      │
      ▼
Business Rules
      │
      ▼
Recommendation
      │
      ├── Recommended Action
      ├── Reason
      ├── Confidence
      └── Source References
```

This capability must not be treated as mandatory Phase 1 implementation
based on the current PRD.

---

# 13. Executive Intelligence

Requirement:

`RAISE-FR-EXEC-001`

## Logical Dashboard

```text
┌────────────────────────────────────────────────┐
│              Executive Dashboard              │
├────────────┬────────────┬──────────────────────┤
│    NBV     │    Risk    │     Utilization      │
├────────────┴────────────┴──────────────────────┤
│ Asset Overview                                 │
│                                                │
│ Category / Lifecycle / Financial Overview      │
│                                                │
├────────────────────────────────────────────────┤
│ Executive Summary                              │
└────────────────────────────────────────────────┘
```

The PRD identifies:

- NBV
- Risk
- Utilization

as proposal-defined KPIs.

NBV and Risk KPI formulas, thresholds, and dashboard layout remain TBD — see
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#16-open-questions) §16 Q3
(partially resolved).

**Utilization — Resolved 2026-08-21 (PRD v0.3, §16 Resolved Question 27):**
~~"Utilization" is listed in the PRD as a KPI with no definition~~. Business
confirmed the definition as **assignment-time-based**:

> Utilization = % of time an asset is assigned to a user/department,
> relative to total available time.

The Utilization tile in the dashboard mockup above should be read against
this definition.

**Calculation mechanics — Resolved 2026-08-21 (PRD v0.4, §16 Resolved
Question 29):**

- **Aggregation window = real-time snapshot** — Utilization is computed as a
  point-in-time value as of "now"; it is **not** a time-series/period
  aggregation (e.g., not "average utilization over the last 30/90 days").
- **Denominator exclusions** — assets with status Disposed, Retired, or Under
  Maintenance are **excluded** from the "total available time" denominator;
  only assets in an active/available-for-assignment state count toward the
  denominator. This denominator interacts with the Custody domain in
  [§4.2](#42-custody--asset-operations) and the asset lifecycle states in
  [§18 Logical Data Model](#18-logical-data-model), both of which remain
  design-phase TBD for exact status naming.

NBV and Risk KPI formulas remain undefined and unresolved. See
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#8-executive-intelligence) §8
and [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#ambiguous-requirements)
Pre-Finalization Quality Pass.

**Open ambiguity (from PRD Pre-Finalization Quality Pass):** the "Executive
Summary" block above corresponds to the PRD's "AI-Generated Executive Summary"
under `RAISE-FR-EXEC-001`. The PRD describes it as a demonstrated capability but
does **not** state whether it is MVP or Roadmap — its dependency on
natural-language summarization sits at the boundary of what is explicitly
"Current" AI capability. This design includes the block as a placeholder only;
it must not be read as confirmed MVP scope until resolved. See
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#gaps-between-hackathon-proposal-and-proposed-prd).

---

# 14. Alert Architecture

Requirement:

`RAISE-FR-ALERT-001`

## MVP

The system needs an alert capability.

```text
Business Event
     │
     ▼
Rule Evaluation
     │
     ▼
Alert Created
     │
     ▼
Authorized User
```

Exact MVP alert rules and channels are TBD.

## Roadmap

Multi-channel delivery:

```text
Email
Teams
LINE Notify
```

is Phase 2 / Enterprise Roadmap.

**Design boundary note (from PRD Pre-Finalization Quality Pass):** the
warranty-expiry-within-90-days scenario is used in the PRD to illustrate *both*
this MVP Alert capability (`RAISE-FR-ALERT-001`) and the Roadmap AI
Recommendation capability (`RAISE-AI-RECOMMEND-001`). These are not the same
requirement — MVP Alert scope must stay a simple rule-triggered notification
and must not be over-built to match the richer Roadmap recommendation example
(recommended action, confidence, reason, source references). See
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#duplicated--overlapping-requirements).

---

# 15. Audit Architecture

Requirement:

`RAISE-FR-AUDIT-001`

## Concept

```text
User / System Action
        │
        ▼
Audit Event
        │
        ▼
Immutable Audit Store
        │
        ▼
Audit Review
```

Audit events should conceptually contain enough information to support
traceability.

Potential attributes requiring confirmation:

- Actor
- Timestamp
- Action
- Entity
- Before / After
- Source
- Result

These are design candidates, not finalized PRD requirements.

The PRD still requires definition of:

- Retention
- Storage architecture
- Event taxonomy
- Privileged administrator controls

---

# 16. Security Architecture

The PRD requires a later Security Design.

Logical model:

```text
User
 │
 ▼
Authentication
 │
 ▼
Authorization / RBAC
 │
 ▼
Application
 │
 ├── Asset Data
 ├── Financial Data
 ├── Maintenance
 ├── Warranty
 ├── AI
 └── Audit
```

## Security Design Work Items

- Authentication mechanism
- Authorization model
- Role definitions
- Data access boundaries
- AI data access control
- Sensitive data handling
- Integration credentials
- Administrative access

No specific technology is selected by this design.

## MVP Enforcement Level — Resolved 2026-08-21 (PRD v0.9, §11, §16 Resolved Question 38)

Requirement: `RAISE-NFR-SEC-RBAC-001`.

Business has confirmed **where** enforcement happens for MVP — this is a
narrower question than the full RBAC model above, and must not be read as
resolving it:

- **A UI-only (client-side) permission-matrix is acceptable for the
  Hackathon MVP.** Backend-enforced RBAC is **not required to ship Phase 1**
  — it is explicitly deferred to **Enterprise Roadmap / Phase 2**.
- This matches the enforcement pattern already present in the reference
  source trees per `CLAUDE.md` (`frontend/` route guards + a client-side
  permission-matrix persistence layer; `go-template-main`'s `RequireRole`
  middleware wired only as a reference example on one CRUD group, not as a
  production backend admin/user/role management API). This design treats
  those as **reference implementation patterns only**, consistent with
  [§2.2 VERSCAN is Reference Only](#22-verscan-is-reference-only)'s promotion
  discipline — it does not treat either template as an approved RAISE
  architecture decision beyond the enforcement-level point the PRD itself
  confirms.
- **Security caveat (carried from PRD, not dropped):** UI-only enforcement
  means an actor who bypasses the client (e.g., direct API calls) is not
  blocked by a server-side check for MVP. This is recorded as an **accepted,
  explicit MVP risk**, to be visible to a future `RAISE-COMPLIANCE-REVIEW.md`
  as a known gap to close before Phase 2 production hardening — not an
  oversight of this design.

**Still fully TBD — this decision does not resolve any of it:** the actual
**role list**, **permission matrix contents**, and **authentication
mechanism** remain undefined in the PRD (Open Questions 21–23). This design
does **not** assume or invent any role model, role name, or permission
structure as a result of the enforcement-level decision above — the
enforcement-level answer only fixes *where* a future permission check would
run, not *what* the roles/permissions are. All Security Design Work Items
listed earlier in this section (Role definitions, Authorization model,
Authentication mechanism, etc.) remain open exactly as before this update.

Every MVP component elsewhere in this design that references role/permission
gating (e.g., [§4.2 Custody & Asset Operations](#42-custody--asset-operations),
[§5.1 Maintenance Domain](#51-maintenance-domain)'s approval/dispatch/
technician roles, [§5.3 License Domain](#53-license-domain)'s access control,
[§15 Audit Architecture](#15-audit-architecture)'s privileged administrator
controls) continues to depend on `RAISE-NFR-SEC-RBAC-001` as **TBD** for role
content — only the client-side-vs-backend enforcement question is now
answered, and only for MVP.

---

# 16A. Other Non-Functional Requirements — Design Backlog

[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#10-non-functional-requirements)
§10 records an NFR backlog that is broader than `RAISE-NFR-SEC-RBAC-001`
(covered in [§16 Security Architecture](#16-security-architecture) above).
The PRD explicitly states it does **not** define detailed NFR values for
these areas — they are a requirements backlog, not invented specifications —
so this design likewise does not assign any value, target, or mechanism to
them. This section exists only so that each area has an explicit design
placeholder, rather than silently having no design representation at all.

| NFR Area (PRD §10) | Design Status |
|---|---|
| Authentication | TBD — see [§16 Security Architecture](#16-security-architecture) Security Design Work Items (mechanism not yet selected) |
| Authorization / RBAC | MVP enforcement level (UI-only/client-side) resolved — see [§16 Security Architecture, "MVP Enforcement Level"](#16-security-architecture); role list/permission contents remain TBD |
| Performance | TBD — no target defined in PRD; no design mechanism proposed |
| Availability | TBD — no target defined in PRD; no design mechanism proposed |
| Scalability | TBD — no target defined in PRD; no design mechanism proposed |
| Backup / Recovery | TBD — no policy defined in PRD; no design mechanism proposed |
| Data Retention | TBD — no policy defined in PRD; interacts with [§15 Audit Architecture](#15-audit-architecture)'s retention item and `RAISE-FR-LICENSE-001`/warranty data, but no retention period is assumed anywhere in this design |
| Encryption | TBD — no requirement defined in PRD; no design mechanism proposed |
| API Security | TBD — no requirement defined in PRD; relates to [§19 API / Integration Boundary](#19-api--integration-boundary), which also leaves authentication/endpoint definitions TBD |
| Audit Retention | TBD — no retention period defined in PRD; see [§15 Audit Architecture](#15-audit-architecture) "Retention" item, which already carries this as an open item |
| Monitoring | TBD — no requirement defined in PRD; no design mechanism proposed |
| Logging | TBD — no requirement defined in PRD; distinct from the business-facing Audit Log in [§15](#15-audit-architecture), which is an application-domain requirement, not an operational logging NFR |

None of these areas is assumed resolved, and none is assigned a design
mechanism, technology, or numeric target — doing so would invent content the
PRD explicitly leaves as backlog. This table exists purely for traceability
completeness; see the cross-check note in [§24 Design
Traceability](#24-design-traceability).

---

# 17. Primary User Interaction Model

## IT Asset

```text
Login
 ↓
Asset Registry
 ↓
Search / Scan
 ↓
View / Update Asset
 ↓
Custody / Maintenance / Warranty
 ↓
Audit
```

## Finance

```text
Login
 ↓
Financial Asset View
 ↓
Oracle FA Data
 ↓
NBV / Depreciation
 ↓
Reconciliation / Analysis
```

## Executive

```text
Login
 ↓
Executive Dashboard
 ↓
KPI
 ↓
Asset Insight
 ↓
Summary
```

## Auditor

```text
Login
 ↓
Asset / History
 ↓
Custody History
 ↓
Audit Log
 ↓
Traceability
```

These are logical journeys derived from the PRD user groups and
requirements. Detailed UX is deferred to Prototype.

---

# 18. Logical Data Model

The PRD does not define a final database schema. The following is a
conceptual model for design discussion.

```text
                    ┌──────────────┐
                    │    ASSET     │
                    └──────┬───────┘
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
  CATEGORY             CUSTODY              WARRANTY
                           │
                           ▼
                      MAINTENANCE

       ASSET
         │
         ├────────────── FINANCIAL
         │                 │
         │                 └── NBV / Depreciation
         │
         ├────────────── QR / BARCODE
         │
         └────────────── LIFECYCLE

All significant system activities
         │
         ▼
    AUDIT LOG
```

## Data Model TBD

The following require detailed design:

- Asset master fields
- Category hierarchy
- Holder model
- Maintenance fields
- Warranty fields — **resolved for MVP** (`warrantyExpiry` only; PRD §16
  Resolved Question 40; see [§5.2 Warranty Domain](#52-warranty-domain)),
  retained here only because the other data model TBD items are still open
- Financial fields
- Oracle mapping
- Lifecycle state model
- Audit event model

---

# 19. API / Integration Boundary

The design should maintain clear boundaries between domains.

```text
                 ┌──────────────────┐
                 │ Presentation     │
                 └────────┬─────────┘
                          │
                    Application APIs
                          │
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                  ▼
     Asset API       Operations API      AI API
        │                 │                  │
        ▼                 ▼                  ▼
     Asset Data       Lifecycle         Intelligence
                                            │
                                     Data Retrieval
                                            │
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                           Oracle         Internal      External
                           / Sources      Data          Sources
```

The exact API style, authentication and endpoint definitions are TBD.

---

# 20. Error Handling Principles

Because integration and AI depend on external / connected data, the
system should distinguish:

```text
SUCCESS
PARTIAL_SUCCESS
VALIDATION_ERROR
SOURCE_UNAVAILABLE
INTEGRATION_ERROR
AUTHORIZATION_ERROR
AI_UNABLE_TO_ANSWER
DATA_CONFLICT
```

These are proposed design states and must be validated before
implementation.

---

# 21. Data Conflict Handling

The PRD explicitly asks:

> What happens when source data conflicts?

Therefore the design requires a source-of-truth policy before
implementation.

Conceptual flow:

```text
Source A ──┐
           │
Source B ──┼──► Conflict Detection
           │
Source C ──┘
                  │
                  ▼
             Resolution Rule
                  │
            ┌─────┴─────┐
            ▼           ▼
        Resolved     Escalate
```

The actual source priority rules are TBD.

---

# 22. MVP vs Roadmap Design Boundary

## MVP

```text
Asset Registry
Category / Hierarchy
Custody History
QR / Barcode
Check-in / Check-out
Maintenance (4-stage workflow shape confirmed 2026-08-21)
Warranty
Oracle FA Integration
NBV / Depreciation
Alerts
Immutable Audit Log
```

## Current / AI Capability Classification

```text
OCR / Extraction
Metadata
Classification
Duplicate Detection
Natural Language Search
```

## Pilot

```text
Risk Scoring
Lifecycle Prediction
```

## Roadmap

```text
AI Recommendation
Real-time ERP Integration
Native Mobile App
Predictive Analytics
Workflow Automation
Multi-channel Alerts
Asset Disposal Workflow
Software / SaaS License Management (RAISE-FR-LICENSE-001)
```

**Asset Disposal Workflow** was confirmed as Enterprise Roadmap (not MVP) by
Product/Business decision on 2026-08-21 (see [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md)
§14 item 7 and §16 Resolved Questions, item 26). It remains the conceptual terminal stage
of the asset lifecycle diagram in [§4.2](#42-custody--asset-operations), but no MVP
component in §4–§6 implies a working disposal capability.

**Software / SaaS License Management (`RAISE-FR-LICENSE-001`)** — **moved from the
MVP list to this Roadmap list in Design v0.6.** Design v0.5 had incorrectly placed
this item under MVP ("Priority P0, Scope MVP" — see the §4.1A/§5.3 correction notes)
before the design layer caught up with the PRD's own already-corrected position
(Roadmap, per §16 Resolved Question 34). See [§4.1A License
Management](#41a-license-management-enterprise-roadmap) and [§5.3 License
Domain](#53-license-domain-enterprise-roadmap).

## Out of Scope (No Design Area — By Business Decision)

The following ESAPS-reference-only pages/flows are confirmed **out of RAISE scope
entirely** (not MVP, not Pilot, not Roadmap) by business decision, 2026-08-21, per
[`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#15-out-of-scope) §15 and §16
Resolved Question 35. They receive **no design area, no component, and no
Traceability ID at any tier** in this document:

- `Assignment.tsx` — asset assignment flow (beyond `RAISE-FR-OPS-002`
  Check-in/Check-out)
- `Auth.tsx` beyond Login (registration/password-reset/MFA-type screens)
- `Inventory.tsx` (distinct from `RAISE-FR-ASSET-001` Asset Registry)
- `NotificationCenter.tsx` (distinct from `RAISE-FR-ALERT-001` Alerts)
- `Profile.tsx` (user self-service profile page)
- `Reports.tsx` (distinct from `RAISE-FR-EXEC-001` Executive Dashboard)
- `ErrorPages.tsx` (404/500/etc.) — treated as generic application
  infrastructure, not a business requirement; no design area needed at any tier

(`SoftwareLicense.tsx`, also named in the same PRD resolution, is not a
separate rejection — it is the same underlying feature as `RAISE-FR-LICENSE-001`
and is already covered, as Roadmap, in [§4.1A](#41a-license-management-enterprise-roadmap)/
[§5.3](#53-license-domain-enterprise-roadmap) above.)

None of the seven items above should be promoted into a design area, `frontend/`
build scope, or a Traceability ID unless a fresh Business Requirement Review
reopens them per the PRD's [VERSCAN Reference Policy promotion
path](../01-requirements/RAISE-PRD.md#verscan-reference-policy) analog.

The classification must remain aligned with the PRD until Product Review
changes it.

---

# 23. Prototype Preparation

The next Prototype should be derived from this design and the PRD.

Recommended initial screen groups:

```text
1. Login / Access
2. Asset Dashboard
3. Asset Registry
4. Asset Detail
5. QR / Barcode Operation
6. Check-in / Check-out
7. Maintenance
8. Warranty
9. Oracle / Financial Asset View
10. Audit History
11. Executive Dashboard
12. AI Natural Language Search
```

### Important

The screen list is a **prototype planning proposal**, not an approved UI
requirement.

Each screen must be traced to one or more PRD requirements before being
treated as mandatory.

---

# 24. Design Traceability

| PRD Requirement | Design Area |
|---|---|
| RAISE-FR-ASSET-001 | Asset Management |
| RAISE-FR-ASSET-002 | Category / Hierarchy |
| RAISE-FR-ASSET-003 | Custody |
| RAISE-FR-OPS-001 | QR / Barcode |
| RAISE-FR-OPS-002 | Check-in / Check-out |
| RAISE-FR-MAINT-001 | Maintenance (§5.1 — 4-stage workflow shape confirmed) |
| RAISE-FR-WARRANTY-001 | Warranty (§5.2 — field list resolved 2026-08-29: `warrantyExpiry` only) |
| RAISE-FR-LICENSE-001 | License Management — **Roadmap, not MVP** (§4.1A, §5.3; corrected 2026-08-21) |
| RAISE-FR-ORACLE-001 | Oracle Integration |
| RAISE-FR-ALERT-001 | Alert Architecture |
| RAISE-FR-AUDIT-001 | Audit Architecture |
| RAISE-FR-EXEC-001 | Executive Dashboard |
| RAISE-FR-LIFE-001 | Lifecycle |
| RAISE-AI-SEARCH-001 | AI Search |
| RAISE-AI-DOC-001 | Document Intelligence Capabilities (§9A) |
| RAISE-AI-DOC-002 | Document Intelligence Capabilities (§9A) |
| RAISE-AI-DOC-003 | Document Intelligence Capabilities (§9A) |
| RAISE-AI-DOC-004 | Document Intelligence Capabilities (§9A) |
| RAISE-AI-RISK-001 | Risk Scoring |
| RAISE-AI-LIFECYCLE-001 | Lifecycle Prediction |
| RAISE-AI-RECOMMEND-001 | Recommendation Extension |

**Cross-check against [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) §17 (Requirement
Traceability Matrix, PRD v0.9):** every PRD requirement ID has a corresponding design
area above, including the four `RAISE-AI-DOC-001`–`RAISE-AI-DOC-004` rows added
2026-08-21 to match PRD v0.3 §16 Resolved Question 28, and the `RAISE-FR-LICENSE-001`
row (Roadmap — corrected 2026-08-21 in Design v0.6 to match the PRD's own correction to
Priority Roadmap / Scope Enterprise Roadmap, §16 Resolved Question 34; Design v0.5 had
incorrectly carried this row as MVP). `RAISE-FR-MAINT-001`'s design area (§5.1) was
updated, not newly added, to reflect the PRD-confirmed 4-stage workflow shape (§16
Resolved Question 33). One PRD item, `RAISE-NFR-SEC-RBAC-001`, is intentionally not a
row here because it is covered structurally by [§16 Security
Architecture](#16-security-architecture) rather than a single design area — no gap,
just a different mapping shape. **As of Design v0.7 (PRD v0.9), §16 Security
Architecture's new "MVP Enforcement Level" subsection also covers the
`RAISE-NFR-SEC-RBAC-001` MVP-enforcement-level confirmation (§16 Resolved Question 38:
UI-only/client-side for MVP, backend deferred to Roadmap) — role list, permission
matrix contents, and authentication mechanism remain TBD and are not assumed resolved
by this mapping.** The remaining PRD §10 NFR backlog areas (Performance, Availability,
Scalability, Backup/Recovery, Data Retention, Encryption, API Security, Audit
Retention, Monitoring, Logging) have no dedicated Traceability ID in the PRD (only
`RAISE-NFR-SEC-RBAC-001` does), so they are not rows in this table either — they are
instead given an explicit design placeholder in [§16A Other Non-Functional
Requirements — Design Backlog](#16a-other-non-functional-requirements--design-backlog),
added in Design v0.8, so that no PRD-referenced area is silently absent from this
document. `RAISE-FR-ORACLE-001`'s design area (§6, now including new §6.4) was
updated, not newly added, to record that the "Phase 6" code-comment label is confirmed
not a PRD phase (§16 Resolved Question 37) while the substantive
`ReconciliationPage`↔`RAISE-FR-ORACLE-001` mapping question (Open Question 10a) remains
open and is not inferred. The six ESAPS-reference-only pages plus `ErrorPages.tsx`
confirmed out of scope entirely (PRD §16 Resolved Question 35) are intentionally **not**
rows here either — see [Out of Scope (No Design Area)](#out-of-scope-no-design-area--by-business-decision)
under §22.

---

# 25. Design Open Questions

These must be resolved before implementation. (Superset of PRD §16, restated in
design-relevant grouping — not a new set of questions.)

## Business

1. What is the authoritative asset master?
2. Which asset types are in MVP?
3. What is utilization? — **Resolved 2026-08-21** (PRD v0.3 §16 Resolved
   Question 27, mechanics resolved in PRD v0.4 §16 Resolved Question 29):
   definition confirmed as assignment-time-based; calculation mechanics
   confirmed as real-time snapshot with Disposed/Retired/Under-Maintenance
   denominator exclusions (see [§13 Executive Intelligence](#13-executive-intelligence)).
   NBV/Risk KPI formulas remain open.
4. What is risk?
5. What business decision should AI support first?

## Data

6. What is the asset master schema?
7. What is the category hierarchy?
8. What is the holder model?
9. What fields are required for maintenance? — workflow **shape** confirmed
   2026-08-21 (PRD v0.5 §16 Resolved Question 33, see
   [§5.1 Maintenance Domain](#51-maintenance-domain)); SLA per stage, vendor
   model, cost model, and delegated-approver configuration rules remain
   open.
10. What fields are required for warranty? — **Resolved 2026-08-29** (PRD §16
   Resolved Question 40, resolving PRD Open Question 15): for MVP,
   `warrantyExpiry` is the only Warranty field. The remaining seven draft
   fields (start date, provider/vendor, type, coverage details, cost, claim
   contact, document reference) are explicitly rejected for MVP, not
   deferred — see [§5.2 Warranty Domain](#52-warranty-domain).
10a. What is the license field model, renewal/expiry alert rule,
   seat/utilization tracking, and vendor/cost tracking for
   `RAISE-FR-LICENSE-001`? — new open question, added 2026-08-21 against PRD
   v0.5 (§16 Open Question 15a); see
   [§5.3 License Domain](#53-license-domain).

## Oracle

11. Oracle FA version/system?
12. Required fields?
13. Source of truth for financial data?
14. Synchronization frequency?
15. Integration method?
15a. Does `frontend/`'s `ReconciliationPage` placeholder
    (`frontend/src/pages/modules.tsx`) satisfy `RAISE-FR-ORACLE-001`'s
    reconciliation acceptance criteria, or does it need a separate
    requirement ID? — added 2026-08-21 against PRD v0.9 ([Open Question
    10a](../01-requirements/RAISE-PRD.md#16-open-questions)). The unrelated
    "Phase 6" code-comment labeling question is resolved (not a PRD phase,
    §16 Resolved Question 37) — this mapping question is **not**; see
    [§6.4](#64-reconciliationpage--phase-6-label--not-a-design-decision-yet).
    (Note: this design's own numbering already uses "10a" above under **Data**
    for the unrelated `RAISE-FR-LICENSE-001` field-model question, inherited
    from earlier design revisions before this restated-grouping numbering
    diverged from the PRD's §16 numbering — this new item is numbered "15a"
    here, under **Oracle**, to avoid colliding with that existing entry. Do
    not confuse the two "10a"/"15a" labels across the PRD and this design.)

## AI

16. Which AI capabilities are mandatory for the Hackathon implementation?
17. Which sources can AI access?
18. How are source citations shown?
19. What confidence threshold is acceptable? — **Partially resolved
    2026-08-21** (PRD v0.4 §16 Resolved Question 30) for `RAISE-AI-DOC-001`:
    mechanism confirmed (below-threshold → human review before save); the
    numeric threshold value itself remains TBD.
20. How are conflicting sources handled?
20a. `RAISE-AI-DOC-004` (Duplicate Detection) matching threshold and
    merge-vs-flag workflow — explicitly asked of the business 2026-08-21 and
    left unanswered; remains fully TBD, see [§9A](#9a-document-intelligence-capabilities-ocrextraction-metadata-classification-duplicate-detection).

## Security

21. Authentication mechanism?
22. Roles and permissions? — **Enforcement-level sub-question resolved
    2026-08-21** (PRD v0.9, §16 Resolved Question 38): UI-only/client-side
    enforcement is acceptable for MVP; backend enforcement is deferred to
    Roadmap. The role list and permission matrix **contents** themselves
    remain fully open — see [§16 Security Architecture, "MVP Enforcement
    Level"](#16-security-architecture).
23. Sensitive data?
24. Immutable audit event definition?
25. Retention period?

---

# 26. Technology Selection

The PRD does **not** define a final technology stack.

Therefore this design intentionally does not select:

- Frontend framework
- Backend framework
- Database technology
- Cloud provider
- AI model
- Vector database
- Integration middleware
- Messaging platform
- Deployment platform

These should be selected after:

1. Functional design
2. Data model
3. Integration requirements
4. Security requirements
5. AI evaluation requirements

Technology choices must support the PRD rather than redefine it.

---

# 27. Design Review Gate

Before moving to Prototype, confirm:

- [ ] Every MVP requirement has a design representation
- [ ] No VERSCAN feature was added without RAISE requirement support
- [ ] Oracle integration boundary is defined enough for prototype
- [ ] Asset lifecycle model is accepted
- [ ] User journeys are accepted
- [ ] AI / deterministic boundary is accepted
- [ ] Security design work items are identified
- [ ] Data model open questions are tracked
- [ ] Roadmap capabilities are not accidentally included in MVP
- [ ] Design traceability is complete
- [ ] PRD §10 NFR backlog areas each have an explicit design placeholder (not silently omitted)

---

# 28. Next Deliverable

After Design Review:

```text
RAISE-PRD.md
      ↓
RAISE-DESIGN.md       ← Current
      ↓
RAISE-PROTOTYPE
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

---

## Document Status

**Version:** 0.8 (gap-closure pass against RAISE-PRD.md v0.9 — no PRD version
change; PRD content re-verified unchanged since the v0.7 sync)

**Change Log — v0.7 → v0.8 (design-completeness gap closure; PRD remains
v0.9, no PRD change):**

1. **PRD §10 NFR backlog given an explicit design placeholder.** Re-reading
   [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md#10-non-functional-requirements)
   §10 against this design found that the broader NFR backlog (Performance,
   Availability, Scalability, Backup/Recovery, Data Retention, Encryption,
   API Security, Audit Retention, Monitoring, Logging) had **no design area
   at all** anywhere in this document — only `RAISE-NFR-SEC-RBAC-001`
   (Authorization/RBAC) had one, via §16 Security Architecture. New
   [§16A Other Non-Functional Requirements — Design
   Backlog](#16a-other-non-functional-requirements--design-backlog) added
   directly after §16, listing each area's design status as **TBD**,
   carrying forward the PRD's own "not sufficiently specified, do not invent"
   framing without assigning any value, target, or mechanism. This does not
   change scope or add a requirement — every one of these areas was already
   named in the PRD as an undefined backlog item; this pass only makes sure
   the design document does not silently omit them.
2. **[§24 Design Traceability](#24-design-traceability) cross-check note
   updated** to explain why the PRD §10 NFR backlog areas are not rows in the
   traceability table (they carry no dedicated Traceability ID in the PRD,
   unlike `RAISE-NFR-SEC-RBAC-001`) and to point to the new §16A placeholder
   instead, so the "no gap" reasoning stays auditable in one place.
3. **[§27 Design Review Gate](#27-design-review-gate)** gained a new
   checklist item confirming the PRD §10 NFR backlog areas each have an
   explicit design placeholder.
4. **No new requirement, capability, or technology choice was invented.**
   This pass only adds structural placeholders for content the PRD already
   states as backlog/TBD — no `## NEEDS_PRD_CONFIRMATION` signal is raised,
   because nothing found in this pass requires a capability the PRD does not
   already acknowledge (the PRD itself names all eleven NFR areas in §10; it
   simply has not yet assigned values to them).
5. Header metadata updated: Version bumped to 0.8; Design Source unchanged
   (still PRD v0.9 — PRD content was re-read in full during this pass and
   found unchanged from the v0.7 sync).

**Change Log — v0.6 → v0.7 (sync with PRD v0.8 → v0.9: RBAC MVP enforcement
level confirmed; Oracle FA "Phase 6" label confirmed not a PRD phase, mapping
question carried forward as Open Question 10a):**

1. **`RAISE-NFR-SEC-RBAC-001` MVP enforcement level bound to design** (PRD
   v0.9, §11, §16 Resolved Question 38): new **"MVP Enforcement Level"**
   subsection added under [§16 Security
   Architecture](#16-security-architecture) recording that a UI-only
   (client-side) permission-matrix is acceptable for MVP, with
   backend-enforced RBAC explicitly deferred to Enterprise Roadmap / Phase 2,
   plus the associated security caveat (client-bypass risk, accepted for
   MVP). **This design explicitly does not treat the role list, permission
   matrix contents, or authentication mechanism as resolved** — those remain
   TBD exactly as before, per the PRD's own framing that this decision fixes
   only *where* enforcement happens, not *what* the roles/permissions are. No
   role model of any kind (names, hierarchy, permission set) has been
   invented or assumed at the design layer as a result of this update.
   [§24 Design Traceability](#24-design-traceability)'s cross-check note and
   [§25 Design Open Questions](#25-design-open-questions) Q22 updated to
   reference the enforcement-level resolution without implying the broader
   RBAC content question is answered.
2. **`RAISE-FR-ORACLE-001` / Oracle FA Reconciliation clarified** (PRD v0.9,
   §16 Resolved Question 37, Open Question 10a): new [§6.4
   ReconciliationPage / "Phase 6" Label — Not a Design Decision
   Yet](#64-reconciliationpage--phase-6-label--not-a-design-decision-yet)
   records that the "Phase 6" code-comment label on `frontend/`'s
   `ReconciliationPage` is confirmed **not** a PRD phase and must be
   disregarded as a scope/sequencing signal — but that the substantive
   question of whether `ReconciliationPage` satisfies
   `RAISE-FR-ORACLE-001`'s reconciliation acceptance behavior, or needs a
   separate requirement ID, **remains open** and is **not** answered or
   inferred by this design. `ReconciliationPage` is therefore **not** added
   as a component of §6.1's Logical Design or of `RAISE-FR-ORACLE-001`'s
   requirement traceability. New Q15a added under [§25 Design Open
   Questions, Oracle](#25-design-open-questions) to carry this forward at the
   design layer (numbered 15a here, distinct from this design's pre-existing
   Q10a on the unrelated License field-model question — the two documents'
   internal numbering has diverged; see the note attached to the new Q15a
   entry).
3. **Header metadata updated:** Version bumped to 0.7; Design Source updated
   to reference PRD v0.9.
4. **No new design area was invented, and no requirement was newly added or
   removed.** Both PRD v0.9 changes are clarifications/confirmations of
   existing requirements (`RAISE-NFR-SEC-RBAC-001`, `RAISE-FR-ORACLE-001`)
   already covered by this design's structure — no `##
   NEEDS_PRD_CONFIRMATION` signal is raised by this pass.

**Change Log — v0.5 → v0.6 (correction pass: License Management scope fix +
out-of-scope acknowledgment; PRD advanced v0.5 → v0.6 → v0.7 → v0.8 across
sessions in between):**

1. **`RAISE-FR-LICENSE-001` (Software / SaaS License Management) scope
   corrected from MVP to Roadmap.** Design v0.5 had recorded this design area
   as "Priority P0, Scope MVP" in both [§4.1A License
   Management](#41a-license-management-enterprise-roadmap) and [§5.3 License
   Domain](#53-license-domain-enterprise-roadmap) — this was a design-layer
   defect, not a business decision; the PRD itself confirms the actual
   business decision was **Priority Roadmap, Scope Enterprise Roadmap** (see
   PRD §16 Resolved Question 34, and the PRD's own note that an earlier PRD
   draft briefly and incorrectly recorded P0/MVP before that decision was
   received). This design now matches the corrected PRD:
   - §4.1A and §5.3 headings and body text updated to Roadmap / Enterprise
     Roadmap, with the correction explicitly noted in place (not silently
     fixed).
   - §3.1 architecture diagram traceability note for nodes `P5`/`A10`/`D8`
     corrected to Roadmap.
   - [§22 MVP vs Roadmap Design Boundary](#22-mvp-vs-roadmap-design-boundary):
     "Software / SaaS License Management" removed from the MVP list and added
     to the Roadmap list, with a correction note.
   - [§24 Design Traceability](#24-design-traceability): `RAISE-FR-LICENSE-001`
     row annotated as Roadmap, not MVP; cross-check note updated.
2. **Out-of-scope acknowledgment added for six ESAPS-reference-only pages
   plus `ErrorPages.tsx`** (`Assignment.tsx`, `Auth.tsx` beyond Login,
   `Inventory.tsx`, `NotificationCenter.tsx`, `Profile.tsx`, `Reports.tsx`,
   `ErrorPages.tsx`), per PRD §15 Out of Scope and §16 Resolved Question 35.
   This design never previously referenced these pages as an unresolved
   design item, so there was nothing stale to remove — a new **[Out of Scope
   (No Design Area)](#out-of-scope-no-design-area--by-business-decision)**
   subsection under §22 now explicitly records that these seven items receive
   no design area, component, or Traceability ID at any tier, and why. §24's
   cross-check note also references this subsection so the "no gap" reasoning
   is auditable in one place. `SoftwareLicense.tsx` (named in the same PRD
   resolution) is noted as already covered by the `RAISE-FR-LICENSE-001`
   Roadmap design area above, not a separate rejection.
3. **`RAISE-AI-RECOMMEND-001` (§12 AI Recommendation) reviewed — no change
   needed.** This design area already correctly states Status: Roadmap, with
   no MVP subset and an explicit "must not be treated as mandatory Phase 1
   implementation" caveat, consistent with the PRD's re-confirmation (§16
   Resolved Question 36) that it stays Roadmap-only.
4. **Header metadata updated:** Version bumped to 0.6; Design Source updated
   to reference PRD v0.8 (the PRD advanced through v0.6 and v0.7 with no
   design-relevant changes beyond the License correction and out-of-scope
   confirmation already captured above; see PRD's own Document Status change
   log for the intervening PRD-only edits, e.g. the Oracle FA "Phase 6"
   labeling resolution, which does not require a design change since the
   substantive `RAISE-FR-ORACLE-001`/`ReconciliationPage` question remains
   open per PRD §16 Resolved Question 37 and Open Question 10a — no design
   action possible until that is answered).
5. No other PRD requirement was found to be missing design coverage, and no
   new `## NEEDS_PRD_CONFIRMATION` signal is raised by this pass — every
   change above corrects this design's alignment with an *existing*,
   already-resolved PRD decision; nothing new was invented at the design
   layer.

**Change Log — v0.4 → v0.5 (sync with PRD v0.4 → v0.5, plus catch-up on the
PRD v0.4 acceptance-detail items not yet reflected in design v0.4):**

1. **`RAISE-FR-MAINT-001` (Maintenance) 4-stage workflow shape bound to
   design** (PRD v0.5, §16 Resolved Question 33): [§5.1 Maintenance
   Domain](#51-maintenance-domain) now documents the confirmed workflow
   (User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician
   Execution) and the state model
   (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE`),
   including the delegated-approver concept. SLA per stage, vendor model,
   cost model, and delegated-approver configuration rules remain TBD, carried
   forward unchanged from the PRD — not invented here.
2. **New design area added for `RAISE-FR-LICENSE-001`** (Software / SaaS
   License Management, PRD v0.5, §16 Resolved Question 34): new
   [§4.1A License Management](#41a-license-management) component and new
   [§5.3 License Domain](#53-license-domain) conceptual data flow. Field
   model, renewal/expiry alert rule, seat/utilization tracking,
   vendor/cost tracking, and the relationship to `RAISE-FR-ALERT-001` all
   remain TBD per the PRD — not invented here. §3.1 architecture diagram
   updated with new nodes `P5` (License Management), `A10` (License), and
   `D8` (License Data).
3. **Catch-up: `RAISE-AI-DOC-001`/`002`/`003` acceptance detail bound to
   design** (PRD v0.4, §16 Resolved Questions 30–32 — PRD advanced from v0.3
   to v0.4 to v0.5 across sessions; this design was last synced to v0.3 and
   had not yet reflected the v0.4 acceptance-detail resolutions until now):
   [§9A Document Intelligence Capabilities](#9a-document-intelligence-capabilities-ocrextraction-metadata-classification-duplicate-detection)
   updated with the confirmed document scope and confidence-threshold
   mechanism for `RAISE-AI-DOC-001` (numeric threshold value still TBD),
   confirmed metadata scope for `RAISE-AI-DOC-002`, and confirmed
   suggestion-only mode for `RAISE-AI-DOC-003`. `RAISE-AI-DOC-004` remains
   fully TBD (asked, not answered) and is explicitly called out as such so it
   is not mistaken for having followed the same resolution pattern. Hybrid AI
   Architecture Placement note updated accordingly.
4. **Catch-up: Utilization KPI calculation mechanics bound to design** (PRD
   v0.4, §16 Resolved Question 29): [§13 Executive Intelligence](#13-executive-intelligence)
   updated with the confirmed real-time-snapshot aggregation window and the
   Disposed/Retired/Under-Maintenance denominator exclusions. NBV and Risk
   KPI formulas remain open.
5. **§22 MVP vs Roadmap Design Boundary updated:** Maintenance line annotated
   with the confirmed workflow-shape status; License Management added to the
   MVP list.
6. **§24 Design Traceability updated:** new row for `RAISE-FR-LICENSE-001`;
   `RAISE-FR-MAINT-001` row annotated with its updated design area reference;
   cross-check note updated to reference PRD v0.5.
7. **§25 Design Open Questions updated:** Q3 (utilization) marked fully
   resolved on the mechanics point (NBV/Risk formulas still open); Q9
   (maintenance fields) annotated with the confirmed workflow shape and
   remaining TBD items; new Q10a added for the license field model/alert
   rule/tracking questions; Q19 (AI confidence threshold) annotated with the
   partial resolution for `RAISE-AI-DOC-001`; new Q20a added for the
   unresolved `RAISE-AI-DOC-004` matching/merge question.
8. No PRD requirement was found to be missing design coverage after this
   pass — see the Design Traceability cross-check note in §24. No new
   `## NEEDS_PRD_CONFIRMATION` signal was raised by this sync; all design
   additions map to an existing PRD requirement ID and preserve every TBD
   marker the PRD itself carries (no TBD was resolved at the design layer).

**Change Log — v0.3 → v0.4 (sync with PRD v0.2 → v0.3):**

1. **Four new AI requirement IDs bound to design.** PRD v0.3 (§16 Resolved
   Question 28) added `RAISE-AI-DOC-001` (OCR/Extraction), `RAISE-AI-DOC-002`
   (Metadata), `RAISE-AI-DOC-003` (Classification), and `RAISE-AI-DOC-004`
   (Duplicate Detection) at Priority P0 / Scope MVP. This design now: (a)
   updates the §3.1 Intelligence Layer traceability note to bind nodes `I2`,
   `I8`, `I3`, `I4` to these IDs instead of stating "no dedicated
   Traceability ID"; (b) adds new [§9A Document Intelligence
   Capabilities](#9a-document-intelligence-capabilities-ocrextraction-metadata-classification-duplicate-detection)
   describing conceptual flow, TBD acceptance items (carried forward unchanged
   from the PRD, not invented), and Hybrid AI Architecture placement; (c)
   adds four rows to the §24 Design Traceability table.
2. **Utilization KPI callout changed from "Open ambiguity" to "Resolved."**
   PRD v0.3 (§16 Resolved Question 27) confirmed Utilization as
   assignment-time-based (% of time an asset is assigned to a
   user/department, relative to total available time). §13 Executive
   Intelligence and §25 Design Open Questions (Q3) updated accordingly.
   Calculation mechanics, aggregation window, and NBV/Risk KPI formulas
   remain open design items — not silently resolved.
3. No other requirement gaps, stale requirement references, or AI status
   mismatches were found against PRD v0.3 §7/§8/§17. All 21 Traceability
   IDs in PRD §17 (v0.3) now have a corresponding design area in §24.

**Status:** Draft for Design Review
**Source:** [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.9
**Next Action:** Review and approve the v0.8 gap-closure pass (new §16A NFR
backlog placeholder; no PRD change, no new requirement) before Prototype;
note that downstream documents (`RAISE-PROTOTYPE.md`,
`RAISE-ACCEPTANCE-CRITERIA.md`, `RAISE-TEST-PLAN.md`, `RAISE-TEST-CASES.md`,
`RAISE-TRACEABILITY-MATRIX.md`) still need their own sync pass to reflect:
(a) the `RAISE-AI-DOC-001`–`RAISE-AI-DOC-003` acceptance detail and the
resolved Utilization calculation mechanics (carried over from PRD v0.4, not
yet synced downstream); (b) the confirmed `RAISE-FR-MAINT-001` 4-stage
workflow shape (PRD v0.5); (c) first-time downstream coverage for the
`RAISE-FR-LICENSE-001` requirement, now correctly Roadmap-scoped (per PRD
§16 Resolved Question 34, corrected in Design v0.6); (d) if any downstream
document had similarly mis-recorded `RAISE-FR-LICENSE-001` as MVP, it needs
the same correction applied; (e) the v0.7 additions — the
`RAISE-NFR-SEC-RBAC-001` MVP-enforcement-level decision (UI-only/client-side
for MVP, backend deferred to Roadmap; role list/permission
matrix/authentication mechanism still TBD) and the `RAISE-FR-ORACLE-001`
"Phase 6" label clarification (label disregarded; `ReconciliationPage`
mapping question still open, Open Question 10a); and (f) the v0.8 addition —
the PRD §10 NFR backlog placeholder (§16A), which downstream documents should
likewise acknowledge as an explicit TBD area rather than omit entirely.
