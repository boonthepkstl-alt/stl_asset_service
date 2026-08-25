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
| F-01 | Warranty | Field list beyond `warrantyExpiry` undefined | PRD §16 Q15 | Open |
| F-02 | Check-in/Check-out | Exact workflow, who may assign/transfer, holder data model | PRD §16 Q11–Q13 | Open |
| F-03 | Executive Dashboard | NBV/Risk KPI formulas and thresholds | PRD §16 Q3–Q4 | Open |
| F-04 | Oracle FA Integration | Integration method, mapping, sync, security | PRD §16 Q6–Q10 | Open |
| F-05 | Alerts | Trigger rules and channels | PRD §16 (Alerts section) | Open |
| F-06 | Natural Language Search | Citation precision/format | PRD §16 Q18 | Open |
| F-07 | Document Intelligence | Confidence thresholds, field lists, matching/merge rules | PRD §16 Q20a (asked, left unanswered) + Resolved Q28/30–32 (scope only) | Open |
| F-08 | Auth / RBAC | Auth mechanism and role/permission matrix content | PRD §16 Q21–Q22 | Open — enforcement *location* resolved (Q38), role *content* is not |
| F-09 | Asset field list | Full asset master field list | PRD §16 Q1 | Open |

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

## Minor / Tech Debt

| ID | Area | Description | Source | Status |
|---|---|---|---|---|
| F-18 | Frontend bundle size | Production bundle ~634 kB (gzip ~175 kB), over the 500 kB chunk-size warning threshold | `npm run build` output | Open — not urgent at current scale; code-splitting is the standard fix |
| F-19 | Backend error responses | Several `500` paths include the raw underlying Go error string in the JSON response | `RAISE-DETAILED-DESIGN.md` §7 | Open — acceptable pre-production, would need auditing before public exposure |
| F-20 | Checkpoint coverage | PRs #19-28 (CLAUDE.md refresh, session-protocol rule, baseline checkpoint, next-step protocol, Singer CI branding x5, timeline checkpoint links) have `DEVELOPMENT-LOG.md` rows (backfilled in [PR #29](https://github.com/boonthepkstl-alt/stl_asset_service/pull/29)'s close-out) but no Level 1 Task Checkpoint entries in `PROJECT-CHECKPOINTS.md` — checkpointing lapsed after CHECKPOINT-2026-08-24-009 (PR #18) until CHECKPOINT-2026-08-25-001 (PR #29) | `PROJECT-CHECKPOINTS.md` (gap between the two dated entries) | Open — backfilling 10 PRs' worth of detailed checkpoints accurately needs per-PR diff review, deferred rather than guessed |

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
