# RAISE — Open Findings

**Purpose:** every known gap, unresolved question, or piece of debt that
affects this project, collected in one place so nothing is only findable by
reading every document in the chain. Nothing here is new — each item is
already flagged somewhere in `docs/`; this file just indexes them. For the
authoritative detail on any PRD-level question, follow the link back to
`RAISE-PRD.md` §16 — this file summarizes, it doesn't supersede.

**Maintenance rule:** add a finding when one surfaces during any checkpoint
(per [`PROJECT-CHECKPOINTS.md`](PROJECT-CHECKPOINTS.md)'s process). Mark
**Resolved** with the resolving PR/commit when closed — never delete a row,
so the history of what was once open stays visible.

---

## Blocking (gates an MVP requirement)

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-02 | Check-in/Check-out | Exact workflow, who may assign/transfer, holder data model | PRD §16 Q11–Q13 | Open |
| F-03 | Executive Dashboard | NBV/Risk KPI formulas and thresholds | PRD §16 Q3–Q4 | Open |
| F-04 | Oracle FA Integration | Integration method, mapping, sync, security | PRD §16 Q6–Q10 | Open |
| F-05 | Alerts | Trigger rules and channels | PRD §16 (Alerts section) | Open |
| F-06 | Natural Language Search | Citation precision/format | PRD §16 Q18 | Open |
| F-07 | Document Intelligence | Confidence thresholds, field lists, matching/merge rules | PRD §16 Q20a (asked, left unanswered) + Resolved Q28/30–32 (scope only) | Open |
| F-08 | Auth / RBAC | Auth mechanism and role/permission matrix content | PRD §16 Q21–Q22 | Open — enforcement *location* resolved (Q38), role *content* is not |
| F-09 | Asset field list | Full asset master field list | PRD §16 Q1 | Open |
| F-27 | Category & Hierarchy | Sub-category taxonomy undefined (e.g. whether "IT Hardware" further subdivides, and into what) — Prototype P-005's Computer/Network example tree is explicitly illustrative, not finalized business data | Prototype §11; `RAISE-FR-ASSET-002`'s own Open Question | Open — the flat category-to-assets grouping (F-25's fix) does not depend on this being answered |

## Unresolved (scope question, not yet blocking a build)

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-10 | Custody vs. Check-in/out | `RAISE-FR-ASSET-003` (Custody History) and `RAISE-FR-OPS-002` (Check-in/Check-out) cover adjacent ground; overlap flagged twice in the PRD's own Pre-Finalization Quality Pass without resolution | PRD Pre-Finalization Quality Pass | Open |

## Known Limitations (by design, not a defect)

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-11 | Auth | Login is a single hardcoded demo credential; no real user store exists | `go-template-main/service/authService.go` | Accepted — real user store confirmed Roadmap, PRD §16 Resolved Q38 |
| F-12 | RBAC enforcement | `middleware.RequireRole` is only wired to the template's demo `/samples` routes, not any real RAISE domain | PRD §16 Resolved Q38 | Accepted — confirmed Roadmap, not MVP |

## Infrastructure / Process (not addressed anywhere in the PRD)

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-13 | Hosting | No deployment target or infrastructure decision exists | `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6 | Open — not a PRD-scope item |
| F-14 | CI/CD | No pipeline configured for either `frontend/` or `go-template-main/` | `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6 | Open |
| F-15 | API versioning | `/api` vs `/api/v1` undecided | `COMPANY-FOUNDATION-BASELINE.md` §5.1 | Open |
| F-16 | DB migration tooling | `sql/pg/V*__*.sql` files are applied manually; no migration tool wired up | `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6 | Open |
| F-17 | NFR backlog | Performance, availability, scalability, backup/recovery, encryption, monitoring, logging targets all undefined | PRD §10 | Open — acknowledged at every layer of the chain, not silently omitted |
| F-30 | No mock fallback for Auth — TC-LOGIN-01/-02 can't be exercised in a dev sandbox | `auth-service.ts`'s `login()` always calls the real `go-template-main` backend (`POST /auth/login`) — unlike Asset/Employee/Ticket, there's no `Mock*Repository`-style fallback. With no Postgres reachable and no `docker-compose`/backend `.env.example`, valid/invalid login can't be tested without standing up the full backend + DB first. Confirmed via network trace (`ERR_CONNECTION_REFUSED`) during formal test execution 2026-08-29 | `frontend/src/services/auth-service.ts`; confirmed by browser test execution 2026-08-29 (TC-LOGIN-01/-02) | Open — not a PRD-scope item |

## Confirmed via Test Execution (not blocked on any PRD question)

Found running `TC-OPS-001-*`/`TC-AUDIT-001-*`/`TC-EXEC-001-*`/`TC-ASSET-001-*`/
`TC-ASSET-001-D-*`/`TC-ASSET-002-*`/`TC-ASSET-003-*` against the real app
on 2026-08-26, and `TC-OPS-002-*`/`TC-MAINT-001-*` on 2026-08-28 (see
`RAISE-TRACEABILITY-MATRIX.md` §3 for the full evidence per row). Unlike
the "Blocking"/"Unresolved" sections above, these are not waiting on a
business decision — the AC/prototype already says what's required; the
implementation simply doesn't do it yet.

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-22 | Executive Dashboard vs. Prototype P-014 | Prototype P-014 specifies KPI tiles named exactly "NBV", "Risk", "Utilization" and sections named "Asset Overview"/"Executive Summary" (`AC-EXEC-001-01`/`-02`). The built Dashboard (`frontend/src/pages/Dashboard/index.tsx`, ported from the legacy ESAPS dashboard predating this PRD/prototype) has neither — its KPI grid is Total Assets/Available/Assigned/In Maintenance/Expired Warranty/Software Licenses/Monthly Depreciation/Monthly Cost, and its sections are AI Insights/AI Portfolio Health/Oracle FA Reconciliation/Asset Lifecycle/Department Distribution/Asset Status/Asset Type/Pending Approvals/Recent Activities/Maintenance Calendar. This is independent of the still-open NBV/Risk formula question (F-03) — even presence-only testing fails. Raises a scope question worth surfacing to the business/design owner: should Prototype P-014 be updated to match the shipped legacy-derived layout, or should the Dashboard eventually grow the P-014 tiles/sections alongside what exists today? Not answered here — flagged, not resolved. | `frontend/src/pages/Dashboard/index.tsx`; `docs/03-prototype/RAISE-PROTOTYPE.md` P-014; confirmed by browser test execution 2026-08-26 (TC-EXEC-001-01/-02) | Open |

## Minor / Tech Debt

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-18 | Frontend bundle size | Production bundle ~634 kB (gzip ~175 kB), over the 500 kB chunk-size warning threshold | `npm run build` output | Open — not urgent at current scale; code-splitting is the standard fix |
| F-19 | Backend error responses | Several `500` paths include the raw underlying Go error string in the JSON response | `RAISE-DETAILED-DESIGN.md` §7 | Open — acceptable pre-production, would need auditing before public exposure |

## Correctly Fenced (not a problem — listed for completeness)

- License Management, AI Decision Center, Risk Scoring, and Lifecycle
  Prediction all remain behind feature flags with no backend built.
  Confirmed Roadmap-only; not creeping into MVP scope.

---

## Resolved

| ID | Area | Description | Resolved by |
|---|---|---|---|
| R-01 | Login contract | Backend response envelope (snake_case, cookie-only token) didn't match frontend's expected bare camelCase object with token in body | [PR #10](https://github.com/boonthepkstl-alt/stl_asset_service/pull/10) |
| R-02 | Traceability drift | Matrix claimed to be current against a PRD version it had not re-verified (Gap 6) | [PR #12](https://github.com/boonthepkstl-alt/stl_asset_service/pull/12) |
| R-03 | react-template-main build failure | Unused imports broke the build | [PR #6](https://github.com/boonthepkstl-alt/stl_asset_service/pull/6) |
| R-04 | Checkpoint coverage | PRs #19-28 had `DEVELOPMENT-LOG.md` rows but no Level 1 Task Checkpoint entries in `PROJECT-CHECKPOINTS.md` — checkpointing had lapsed after `CHECKPOINT-2026-08-24-009` (PR #18) until `CHECKPOINT-2026-08-25-001` (PR #29) | Backfilled as `CHECKPOINT-2026-08-24-010` through `-019`, reconstructed from real `gh pr view` metadata, not memory — [PR #36](https://github.com/boonthepkstl-alt/stl_asset_service/pull/36) |
| R-05 | QR/Barcode invalid-code state | `AC-OPS-001-03` requires a distinct "invalid code" state for a malformed/unreadable scan, separate from "not found" (`AC-OPS-001-02`) — the Scan QR modal showed the identical generic "No asset found for ..." message for both | Added a plausible-code-format check (`isPlausibleCodeFormat`, alphanumeric + `-`/`_`) before attempting a lookup, showing a distinct "Invalid code..." message when it fails; re-executed `TC-OPS-001-03` and confirmed the distinct message renders |
| R-06 | Asset Registry — no Category filter | `TC-ASSET-001-03` required a Category filter that narrows the asset list; the Filters panel had Status/Department/Location selects only | Added a Category `Select` (sourced from a new `categories` fixture export, same pattern as `departments`/`locations`), wired into `MockAssetRepository.list()`'s filter predicate (not forwarded to `HttpAssetRepository` — go-template-main's `GET /assets` has no category query param, so it would silently no-op against the real backend); re-executed `TC-ASSET-001-03` via browser and confirmed the list narrows (15 → 2 on "Infrastructure") and "Clear filters" resets it |
| R-07 | Asset Detail — missing Financial and Lifecycle sections | `TC-ASSET-001-D-01` required 9 named sections on Asset Detail (Basic Info, Category, Custody, Financial, Warranty, Maintenance, QR/Barcode, Lifecycle, Audit/History); "Financial" and "Lifecycle" were entirely absent | Added a "Financial" section (Purchase Cost/Current Value/Purchase Date — fields the `Asset` record already carries, same ones the Assets list already shows) and a "Lifecycle" section (a connectivity summary linking to the Custody/Warranty/Maintenance/Audit tabs, matching Prototype P-004's "one asset → connected information across its lifecycle" principle and `AC-LIFE-001-01` — no new lifecycle-stage data model was invented); re-executed `TC-ASSET-001-D-01` via browser on asset `a1` and confirmed both sections render with real data, and that clicking a Lifecycle row jumps to the corresponding tab |
| R-08 | Custody/Assignment History is not append-only | `AC-ASSET-003-02` required a custody-changing event (Check-in/Check-out) to append a new history entry while leaving prior entries unchanged; the "Assignment History" panel instead derived a single "current custody state" row, replaced on every change | Rewired the History tab to render from the same per-asset audit trail `RAISE-FR-AUDIT-001` already builds (`recordMockAuditEntry`, `audit-repository.ts`) — append-only by construction (only ever `unshift`s, never mutates/removes), and `assign`/`checkIn` already fed it. No new custody-log data model was invented. Re-verified live on asset `a1`: performed a real Check-in (appended "Asset checked in") then a real Assign (appended "Asset assigned to Sarah Chen" alongside it, not replacing it) — both entries visible, newest-first |
| R-09 | No Category & Hierarchy screen (P-005) | `RAISE-FR-ASSET-002`'s dedicated screen didn't exist anywhere in the app's routing or navigation — not just its taxonomy content | Added a scoped-down first cut: each category expands to show the real assets registered under it — the one parent/child relationship actually confirmed anywhere in the chain. Initially shipped as a standalone `/categories` page with its own sidebar nav entry ([PR #43](https://github.com/boonthepkstl-alt/stl_asset_service/pull/43)); per user request, folded into Asset Management as a "By Category" view alongside the existing asset list ([PR #44](https://github.com/boonthepkstl-alt/stl_asset_service/pull/44)) — same content and behavior, now at `frontend/src/pages/Assets/index.tsx`, no separate route or nav entry. Does **not** implement Prototype P-005's illustrative sub-category tree (tracked separately as **F-27**, still open/TBD). Verified live: "IT Hardware" expands to 6 real seeded assets; clicking one navigates to its Asset Detail |
| R-10 | Maintenance record list — missing date and cost fields | `AC-MAINT-001-01` requires maintenance records to display "date, event, status, and cost"; Asset Detail's "Maintenance & Tickets" tab showed only ticket code, priority, workflow-stage badge, and title — no created date and no cost field rendered anywhere | Added created date and a cost field per record — preferring `itExecution.actualCost` once known, falling back to `itAssignment.estimatedCost`, or an honest "—" for a ticket not yet dispatched (no fabricated value). Verified live on asset `a1`: `REQ-2026-0042` (dispatched, in progress) shows "2026-08-15 09:30 AM · Cost: $120"; `REQ-2026-0044` (not yet dispatched) shows "Cost: —" |
| R-11 | Maintenance stage-progress indicator doesn't distinguish Current from Pending | `AC-MAINT-001-09` requires the 4-stage progress indicator to show Done/Current/Pending as 3 distinct states; `GovernanceStep` (`TicketDetail/index.tsx`) only rendered 2 (done checkmark vs. a plain gray circle for everything else) | Derived the current stage from `ticket.status` (already fully determines it — no new field invented) and added a 3rd visual state to `GovernanceStep`: a brand-colored circle with a ring, a highlighted card background, and a "Current" badge. Verified live across `PENDING_DEPT_APPROVAL` (stage 2 current), `PENDING_IT_DISPATCH` (stage 3 current), and `DONE` (no stage marked current, all done) |
| R-12 | Warranty field list undefined | `RAISE-FR-WARRANTY-001`'s field list beyond `warrantyExpiry` was undefined (PRD §16 Q15) — the standing uncompleted business-decision request in this session | User confirmed 2026-08-29: for MVP, `warrantyExpiry` is the only Warranty field; a draft 8-field proposal (start date, provider/vendor, type, coverage details, cost, claim contact, document reference) was explicitly rejected, not deferred. Recorded as PRD §16 Resolved Question 40 and propagated through the full deliverable chain (Design §5.2, Prototype P-010, Acceptance Criteria AC-WARRANTY-001, Test Plan TS-WARRANTY-001, Test Cases TC-WARRANTY-001-01/-02, Traceability Matrix Gap 7) via `/update-prd` + `/run-full-chain`. Same day, per explicit user direction ("ไม่ควรสร้างหน้า แต่เพิ่มในหน้าอุปกรณ์ที่เกี่ยวข้องพอ" — don't build a page, add it to the relevant asset page instead), implemented as a new "Warranty" column on the Assets Registry list (`frontend/src/pages/Assets/index.tsx`) showing `warrantyExpiry` + an Active/Expired badge, sortable by date — no standalone P-010 screen built. Verified live: asset `a1` shows "Active"/"2027-01-15", asset `a13` shows "Expired"/"2024-03-15". `AC-WARRANTY-001-03`'s separate 90-day-window threshold (and the "Expiring" 3rd state it would gate) remains open, unaffected |
