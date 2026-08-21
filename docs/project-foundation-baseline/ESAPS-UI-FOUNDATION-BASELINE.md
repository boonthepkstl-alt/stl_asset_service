# Project Foundation Baseline

## Purpose and scope

This document sits **one layer above** [`COMPANY-FOUNDATION-BASELINE.md`](../company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md)
and does **not** repeat its content. That document already covers template/infrastructure
readiness for the React and Go company templates (KEEP/FIX/EXTEND/PROJECT/REMOVE decisions,
target architectures, cross-platform standards, unresolved decisions, a readiness checklist).
Read it first if the question is "is the template ready" — this document does not re-answer
that.

This document adds the two layers the company baseline explicitly excludes:

1. **The ESAPS legacy UI** (`esaps_ai_template/` and the duplicate `src/`) as a **business/UI
   reference only** — never a requirement source.
2. **The RAISE requirement chain** ([`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) and its
   Design/Prototype/AC/Test Plan/Test Cases/Traceability Matrix descendants) as the sole
   requirement authority.

It answers one question per legacy-UI page: **what do we do with it, and why** — tracing every
decision back to a specific `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` requirement ID, or stating
plainly that no such ID exists.

```text
COMPANY-FOUNDATION-BASELINE.md   → Frontend/Backend infra readiness (existing, referenced only)
ESAPS UI (esaps_ai_template/, src/) → Business/UI reference, page-by-page
RAISE-PRD.md + chain             → Business requirement authority (existing, referenced only)
                    │
                    ▼
        ESAPS-UI-FOUNDATION-BASELINE.md (this document)
                    │
                    ▼
        frontend/ (raise-frontend scaffold) — target build
```

**Neither source tree was modified to produce this document.** `esaps_ai_template/`, `src/`,
`react-template-main/`, `go-template-main/`, `COMPANY-FOUNDATION-BASELINE.md`, and every file
under `docs/01-requirements/` through `docs/07-traceability-matrix/` were read-only inputs.

Per this vault's own working rule (already established for VERSCAN in `CLAUDE.md`), a reference
source **never** expands RAISE's scope by itself. Every "reference only" or "DO NOT USE"
decision below is a statement that the PRD does not (yet) cover that feature — not a judgment
that it should never be covered.

---

## 1. Source map

| Source | What it is | Allowed use |
|---|---|---|
| [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) (+ Design/Prototype/AC/Test Plan/Test Cases/Traceability Matrix) | The RAISE deliverable chain | **Sole requirement authority.** Every decision below cites a requirement ID from here or states that none exists. |
| [`COMPANY-FOUNDATION-BASELINE.md`](../company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md) | Synthesis of the React/Go template audits | **Infra/template readiness authority.** Referenced, not repeated. |
| `esaps_ai_template/` | Full standalone ESAPS app — `metadata.json` names it "Enterprise Smart Asset & Procurement System"; Vite + Express (`server.ts`) + `@google/genai` (Gemini) + Supabase | **Business/UI reference only.** Its 22 pages under `src/pages/` are the subject of §2 below. |
| `src/` (root) | An **exact duplicate** of `esaps_ai_template/src/` — identical file lists in both `pages/` and `data/` | Same status as `esaps_ai_template/` — a second copy of the same reference, not a second source. Both are cited interchangeably in §2 since their content is identical. No removal recommendation is made here; that's a separate housekeeping decision outside this document's scope. |
| `esaps_ai_template/server.ts` | Working repair-vs-replace decision engine: confidence score, 3-year TCO calculation, fallback logic when no Gemini key is present | **Reference material only**, and only for Pilot/Roadmap-status AI capabilities (`RAISE-AI-RISK-001`, `RAISE-AI-LIFECYCLE-001`, `RAISE-AI-RECOMMEND-001`) — see AIDecisionCenter.tsx in §2. Not MVP scope. |
| `frontend/` (`raise-frontend`) | The actual RAISE build target — company-template conventions already applied via `package.json`, `src/` currently empty except for a `dist/` build artifact | This baseline is the spec for **populating** this scaffold — see §5. Not a proposal to create a new one. |

---

## 2. ESAPS UI page-by-page decision table

Decision vocabulary for this table only (distinct from the company baseline's KEEP/FIX/EXTEND/PROJECT/REMOVE,
since these are UI/screen-level decisions, not infra-level ones):

| Decision | Meaning |
|---|---|
| **KEEP** | Reusable as-is; no RAISE-specific rework needed. |
| **EXTEND** | Good starting point, maps to a confirmed requirement, but needs real work to close a gap (missing field, wrong KPI set, reference-only sub-feature to rework). |
| **REFACTOR** | The underlying concept is right but the implementation encodes assumptions not yet approved (an invented workflow, a computation RAISE sources from elsewhere) — needs restructuring, not just extension. |
| **DEFER** | Maps to a Pilot- or Roadmap-status requirement, not MVP. Correct to reference now, wrong to build now. |
| **DO NOT USE** | No RAISE requirement ID backs this feature at all, at any scope/status. Not even Pilot/Roadmap. |

Requirement IDs are cited from [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) §17 (Requirement
Traceability Matrix, v0.4). Both `esaps_ai_template/src/pages/` and `src/pages/` are identical, so
either copy applies.

| Page | Maps to RAISE Requirement ID(s) | Decision | Justification |
|---|---|---|---|
| `AssetList.tsx` | `RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-002`, `RAISE-AI-SEARCH-001`, `RAISE-FR-OPS-001` | **EXTEND** | Registry/category table and NL-search box are close to spec, but AI-SEARCH-001 requires citing source data and OPS-001's QR flow is VERSCAN-reference-only — both need rework, not a straight port. |
| `AssetDetail.tsx` | `RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-003`, `RAISE-FR-WARRANTY-001`, `RAISE-FR-AUDIT-001` | **EXTEND** | Overview/warranty/history/audit tabs map well; the embedded AI health score touches Pilot-only `RAISE-AI-RISK-001` and the ticket tab depends on the unconfirmed `RAISE-FR-MAINT-001` workflow (see below) — both sub-parts need to be split out. |
| `CreateAsset.tsx` | `RAISE-FR-ASSET-001` | **REFACTOR** | Wizard structure is reusable for registry creation, but its local depreciation-method calculator conflicts with `RAISE-FR-ORACLE-001`, where NBV/depreciation is imported from Oracle FA, not computed client-side. |
| `Assignment.tsx` | `RAISE-FR-ASSET-003`, `RAISE-FR-OPS-002` | **EXTEND** | Assign/transfer flows are the concrete mechanism for the custody-history changes `RAISE-FR-ASSET-003` requires; needs RBAC gating once `RAISE-NFR-SEC-RBAC-001` is resolved. |
| `EmployeeDetail.tsx` | `RAISE-FR-ASSET-003`, `RAISE-FR-AUDIT-001` | **REFACTOR** | Assigned-hardware/history/audit tabs map correctly; its "Software & SaaS" tab has zero backing requirement (see `SoftwareLicense.tsx`) and must be stripped, not merely extended. |
| `Dashboard.tsx` | `RAISE-FR-EXEC-001`, `RAISE-FR-ORACLE-001` | **EXTEND** | Executive-dashboard layout and Oracle FA banner map correctly; the KPI tiles shown (Available/Assigned/etc.) don't match the PRD's defined KPI set (NBV, Risk, Utilization) and must be redone against the actual set. |
| `Maintenance.tsx` | `RAISE-FR-MAINT-001` | **REFACTOR** | Maintenance/ticketing concept maps correctly, but `RAISE-FR-MAINT-001`'s own PRD Open Question states the complete workflow is undefined — the specific 4-stage delegated-approval governance shown here is an ESAPS design decision, not a RAISE one (see §4). |
| `TicketDetail.tsx` | `RAISE-FR-MAINT-001` | **REFACTOR** | Same rationale as `Maintenance.tsx` — a detail view of the same unconfirmed workflow. |
| `Reconciliation.tsx` | `RAISE-FR-ORACLE-001` | **EXTEND** | Strong, direct match to Oracle FA Integration (P0/MVP); the AI "root cause" auto-resolution actions exceed any confirmed AI capability and should be scoped down to what's actually approved. |
| `NotificationCenter.tsx` | `RAISE-FR-ALERT-001` | **EXTEND** | Matches MVP's single-channel in-app alerts requirement; exact alert-triggering rules remain TBD per `RAISE-FR-ALERT-001`'s own open question. |
| `AIDecisionCenter.tsx` | `RAISE-AI-RISK-001`, `RAISE-AI-LIFECYCLE-001`, `RAISE-AI-RECOMMEND-001` | **DEFER** | Repair-vs-Replace, ROI simulation, portfolio risk, and executive briefing are all built on Pilot- or Roadmap-status capabilities — none is MVP-confirmed per PRD §13. Reference material for later, not now. |
| `Administration.tsx` | `RAISE-FR-ASSET-002`, `RAISE-NFR-SEC-RBAC-001` | **REFACTOR** | Departments/locations/master-data cards map to `RAISE-FR-ASSET-002`'s category/hierarchy needs; the user/role admin cards depend on an RBAC model the PRD explicitly marks TBD. |
| `RoleManagement.tsx` | `RAISE-NFR-SEC-RBAC-001` | **DEFER** | Permission-matrix concept is reasonable, but the entire role model is undefined in the PRD — nothing concrete to build against yet. |
| `UserManagement.tsx` | `RAISE-NFR-SEC-RBAC-001` | **DEFER** | Same as `RoleManagement.tsx` — no role/permission model exists yet to build invite/suspend flows against. |
| `Auth.tsx` | `RAISE-NFR-SEC-RBAC-001` | **DEFER** | Authentication mechanism is explicitly TBD in the PRD; nothing to validate the reference implementation against until Security Design resolves it. |
| `Profile.tsx` | `RAISE-NFR-SEC-RBAC-001` | **DEFER** | Password/2FA sections depend on the same undefined authentication mechanism. |
| `Settings.tsx` | `RAISE-NFR-SEC-RBAC-001` | **DEFER** | Security section maps to the TBD RBAC/auth NFR; Backup/Retention sections map to PRD areas also marked TBD — none has a defined value yet. |
| `SoftwareLicense.tsx` | *None* | **DO NOT USE** | No `RAISE-FR`/`RAISE-AI`/`RAISE-NFR` ID covers SaaS/software-license management anywhere in the PRD. Unbacked scope — not even Pilot/Roadmap. |
| `LicenseDetail.tsx` | *None* | **DO NOT USE** | Same gap as `SoftwareLicense.tsx` — a detail view of a feature area RAISE never defines. |
| `Inventory.tsx` | *None* | **DO NOT USE** | Warehouse stock/transfer/receiving is a distinct consumables-inventory concept never mentioned in the PRD; RAISE's "Asset Registry" is IT-asset-specific, not spare-parts logistics. |
| `Reports.tsx` | *None* | **DO NOT USE** | No requirement ID covers batch PDF/Excel report generation; the closest concept (`RAISE-FR-EXEC-001`) is a live dashboard, not an export generator — using this page would invent scope. |
| `ErrorPages.tsx` | *(infrastructure, not a business requirement)* | **KEEP** | Generic 404/403 pages are a technical necessity with no functional-requirement mapping and no conflict with PRD scope — reusable as-is. |

### Notable pattern across the table

Four pages (`SoftwareLicense.tsx`, `LicenseDetail.tsx`, `Inventory.tsx`, `Reports.tsx`) correspond
to **no RAISE requirement ID whatsoever**, at any priority or scope tier. These are ESAPS-only
feature areas layered on top of the shared asset-management concept — exactly the kind of
automatic scope creep the VERSCAN reference-only policy (PRD §15) exists to prevent, now
recurring with a second reference source. They are marked DO NOT USE, not silently omitted, so
the gap is visible rather than assumed-resolved.

---

## 3. Vertical-slice migration order

Each slice is scoped to what the PRD actually approves for MVP (`docs/01-requirements/RAISE-PRD.md`
§13 MVP Scope), using the ESAPS pages above only where marked KEEP/EXTEND/REFACTOR.

```text
1. Dashboard        → RAISE-FR-EXEC-001, RAISE-FR-ORACLE-001            (Dashboard.tsx)
2. Asset            → RAISE-FR-ASSET-001/002/003, RAISE-AI-SEARCH-001,   (AssetList, AssetDetail,
                       RAISE-FR-OPS-001/002                              CreateAsset, Assignment.tsx)
3. Employee          → RAISE-FR-ASSET-003, RAISE-FR-AUDIT-001            (EmployeeDetail.tsx,
                                                                          Software/SaaS tab stripped)
4. Maintenance       → RAISE-FR-MAINT-001                                (Maintenance, TicketDetail.tsx —
                       (absorbs "IT Requisition" as a sub-detail,        4-stage approval workflow flagged,
                        not a separate slice — see §4)                   not yet approved)
5. Reconciliation    → RAISE-FR-ORACLE-001                               (Reconciliation.tsx)
6. Alerts            → RAISE-FR-ALERT-001                                (NotificationCenter.tsx)
7. Administration    → RAISE-FR-ASSET-002, RAISE-NFR-SEC-RBAC-001        (Administration.tsx, once RBAC
                                                                          model is resolved)
8. AI (deferred)      → RAISE-AI-RISK-001, RAISE-AI-LIFECYCLE-001,        (AIDecisionCenter.tsx —
                       RAISE-AI-RECOMMEND-001 (all Pilot/Roadmap)         reference only, not built yet)
```

**"IT Requisition" is not its own slice.** It is a sub-detail of the Maintenance slice (see §4)
and **"Audit" is not its own slice** — audit logging (`RAISE-FR-AUDIT-001`) is a cross-cutting
concern surfaced inside Asset/Employee detail pages, not a standalone screen, matching how the
RAISE Prototype/AC chain already treats it.

Auth/RBAC-dependent pages (`RoleManagement.tsx`, `UserManagement.tsx`, `Auth.tsx`, `Profile.tsx`,
`Settings.tsx`) are cross-cutting infrastructure, not a vertical slice — they block every slice
above until `RAISE-NFR-SEC-RBAC-001` is resolved, and should be tracked as a prerequisite, not
sequenced as slice 9.

---

## 4. `## NEEDS_PRD_CONFIRMATION`

**Open item found during this baseline's construction — requires a business decision before the
Maintenance slice (§3.4) can be built against the ESAPS reference workflow:**

> `esaps_ai_template/src/config/navigation.ts` merges "IT Requisition" into the Maintenance nav
> item as **"IT Requisition & Maintenance"**, with `pageTitles.maintenance` describing a specific
> **4-stage workflow**: User Requisition → Dept Approval (Delegated) → IT Dispatch → Technician
> Execution. `src/data/requisitionData.ts` implements this exact state machine
> (`PENDING_DEPT_APPROVAL → PENDING_IT_DISPATCH → PLANNING/IN_PROGRESS/ON_HOLD → DONE`), including
> a "delegated approver" setting.
>
> `RAISE-FR-MAINT-001` exists in the PRD and is confirmed P0/MVP, but its own Open Question states
> the complete maintenance workflow is **not yet defined** — no PRD text confirms or denies this
> specific 4-stage delegated-approval governance model.
>
> **This is not a request to add a new requirement ID** — `RAISE-FR-MAINT-001` already covers
> Maintenance. It is a request to confirm or reject one specific workflow shape for that existing
> requirement, since the ESAPS reference cannot be assumed correct by default.

This is logged here, not auto-resolved, per this project's rule that a reference source never
silently expands or shapes an existing requirement's business rules. Recommended next step: raise
this in the next `/update-prd` round alongside `RAISE-FR-MAINT-001`'s other open items (SLA,
vendor model — already tracked in the Traceability Matrix).

**For visibility, not for confirmation** (already correctly excluded, not candidates being
proposed): the four DO NOT USE pages in §2 (`SoftwareLicense.tsx`, `LicenseDetail.tsx`,
`Inventory.tsx`, `Reports.tsx`) represent ESAPS feature areas with zero RAISE backing. They are
recorded here so a future reader can see they were considered and deliberately excluded, not
overlooked.

---

## 5. Status of the `frontend/` scaffold

`frontend/` already exists as `raise-frontend` (`package.json` name field), with company-template
conventions applied (Vite, TypeScript, Tailwind v4, ESLint, Prettier, Vitest) and dependencies
already installed (`node_modules/` present). Its `src/` directory is currently **empty** — only a
`dist/` build artifact exists, suggesting migration work started and paused before any source was
committed.

This baseline is the specification for **populating** that empty `src/`, slice by slice per §3,
using the ESAPS reference pages per their §2 decision — not a proposal to scaffold a new project.
The company template's own readiness checklist
([`COMPANY-FOUNDATION-BASELINE.md`](../company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md)
§7 "Must be done before any RAISE code is written against these templates") still applies and is
not superseded by this document — in particular, the RBAC/auth-transport/response-envelope
unresolved decisions there block the Administration/Auth/RBAC-dependent slices in §3 from being
built correctly, independent of anything found in this baseline.

---

## Document Status

**Draft for Review** — synthesized from a 22-page read-only review of `esaps_ai_template/src/pages/`
(identical to `src/pages/`), cross-referenced against `docs/01-requirements/RAISE-PRD.md` v0.4 §6,
§13, §15, §17, and referencing (not duplicating) `docs/company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md`.
No source tree was modified while producing this document. 2026-08-21.

**Known follow-up, not yet actioned:** `CLAUDE.md` still states no source code exists in this
project ("ยังไม่มีซอร์สโค้ด"), which is no longer accurate now that `esaps_ai_template/`, `src/`,
`frontend/`, `react-template-main/`, and `go-template-main/` all exist. Per prior agreement, this
will be corrected in a separate pass after this document is reviewed, not as part of this change.
