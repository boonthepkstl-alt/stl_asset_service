# RAISE — Business Decision Requests

**Purpose:** the outstanding questions that only the business can answer,
written in a form that can be sent to a stakeholder as-is. Each request states
what is blocked, what is being asked, and what engineering will do with each
possible answer — and **deliberately proposes no answer of its own.**

This file exists because decision requests were previously drafted in-session
and sent without leaving a durable artifact (see `CHECKPOINT-2026-09-10-002`
and `-003`, which record that a request covering **F-03** and **F-55** was
"prepared and sent to the stakeholder 2026-09-10" — with no copy of what was
actually asked). A question that cannot be re-read later cannot be followed up
on, and a re-ask that silently differs from the original is worse than no ask
at all.

**Maintenance rule:** one section per request, identified `DR-NN`. Never delete
a request — mark it **Answered** with the date and the decision, and link to the
`§16 Resolved Question` or finding row that carries the consequence. The
finding register ([`OPEN-FINDINGS.md`](OPEN-FINDINGS.md)) stays the index of
*what is blocked*; this file is the record of *what was asked, and when*.

**Standing rule for every request in this file:** engineering does not fill in a
missing business value to unblock itself. This project has held **F-03** open
across four separate requests rather than inventing five numbers, and raised
**F-54** precisely because four SLA values reached production without
authority. A request that goes unanswered stays unanswered.

---

## DR-01 — Is Software License (`RAISE-FR-LICENSE-001`) promoted from Roadmap to MVP?

| | |
|---|---|
| **Raised** | 2026-09-18 |
| **Finding** | [F-57](OPEN-FINDINGS.md) |
| **Requirement** | `RAISE-FR-LICENSE-001` — Software / SaaS License Management |
| **Status** | **Awaiting answer** |
| **Blocks** | Any Software License backend or CRUD work. Blocks nothing currently in approved scope. |

### What prompted this

A "Phase 5C — Software License vertical slice" was requested as the next
development target. Before writing any code, the requirement was checked — and
it is **confirmed Roadmap, not MVP**, with acceptance criteria that do not yet
exist. So there is currently nothing to build against.

### What the documents currently say

`RAISE-PRD.md` §6, `RAISE-FR-LICENSE-001`:

- **Priority:** "Roadmap (not MVP-confirmed)"
- **Scope:** "Enterprise Roadmap — not Phase 1 MVP"
- **Acceptance Criteria:** "Not yet defined pending Roadmap-phase planning…
  Exact field model, renewal/expiry alert rules, seat/utilization tracking, and
  vendor/cost tracking are **TBD** — not to be assumed complete until
  confirmed, **and not to be built for MVP**."
- Confirmed by the business on **2026-08-21** (§16 Resolved Question 34).

`PROJECT-TIMELINE.md` Phase 5 records the status as *"⚪ Not started —
confirmed Roadmap, not MVP"*, and notes in its own Risks field that the
finished-looking UI "invites building a backend for it without a PRD scope
change."

### What exists today

The **frontend is complete and intentionally fenced**: list page, detail page,
domain types, fixtures, a mock-only repository, a service, two hooks, and
tests. Navigation and routes are hidden by default behind
`ROADMAP_FEATURES_ENABLED`, and a regression test asserts they stay hidden.

The **backend does not exist at all** — no license table, model, endpoint or
migration — and there is no real-API path on the frontend either. That absence
is deliberate, not an oversight.

### The question

> **Should `RAISE-FR-LICENSE-001` (Software / SaaS License Management) be
> promoted from Enterprise Roadmap to Phase 1 MVP scope?**

### If the answer is **No** (the current documented position)

Nothing changes and nothing needs doing. The pages remain flag-gated and
demo-only, the backend remains unbuilt, and F-57 is closed as *confirmed
unchanged*. **This is a valid and complete answer** — the request is not asking
for permission to build, it is asking which state is intended.

### If the answer is **Yes**

Engineering cannot start from a Yes alone. The acceptance criteria a slice
would be built and tested against do not exist, so the chain has to be
re-entered at `RAISE-PRD.md` first — the traceability matrix's own rule, quoted
in the Phase 5 timeline entry: *promoting this to MVP means re-entering the
chain at `RAISE-PRD.md` first, not skipping straight to a backend PR.*

The five inputs a Yes requires, all currently marked TBD in the PRD
(§16 Q15a). **No option is proposed for any of them — these are open
questions, not a menu:**

| # | Input needed | Why it blocks code |
|---|---|---|
| 1 | **License field model** — what constitutes a license record | Determines the table, the API contract and every validation rule. Nothing can be built without it. |
| 2 | **Renewal / expiry alert rule** | Determines whether expiry is a stored field, a derived state, or an alert condition — and whether it integrates with `RAISE-FR-ALERT-001` (also TBD). |
| 3 | **Seat / utilization tracking** — whether licenses have seat counts, and how allocation works | Decides whether a license↔asset/employee relationship exists at all, and therefore whether there is a join to model. |
| 4 | **Vendor / cost tracking** — which financial fields are in scope | Financial fields on a real record carry the same weight as the NBV values withheld under **F-03**; they will not be guessed. |
| 5 | **Access model** — who may view and who may modify license data | `RAISE-NFR-SEC-RBAC-001` is a listed dependency, and the role/permission matrix content is itself still open under **F-08**. |

Once supplied, the order of work is: PRD → Design → Prototype → Acceptance
Criteria → Test Plan → Test Cases → Traceability Matrix, and only then the
implementation.

### What engineering will *not* do

Pick any of the five above in order to make a slice implementable, or ship
placeholder fields "to be corrected later." That is the failure mode **F-54**
records, and avoiding it is why this request exists rather than a pull request.

---

## Previously sent, no durable copy

**F-03** (useful-life values per Asset Type) and **F-55** (Create Requisition
requester rule) had a combined decision request prepared and sent on
**2026-09-10**; the checkpoints record that it was sent, but not its contents.
Both remain unanswered. Their current state is in
[`OPEN-FINDINGS.md`](OPEN-FINDINGS.md) — **not restated here**, deliberately, so
this file cannot drift from the register. If either is re-asked, write it up as
a `DR-NN` section above so the next follow-up has something to point at.
