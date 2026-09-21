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
`§16 Resolved Question` or finding row that carries the consequence. Where a
request has a sendable page, link it from that request's table — this file stays the
record of what was asked; the page is only a nicer way to ask it. The
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

## DR-02 — What is the useful life, per Asset Type, for Net Book Value?

| | |
|---|---|
| **Raised** | 2026-09-21 (first asked 2026-09-10 as part of a combined request; no copy of that one was kept) |
| **Finding** | [F-03](OPEN-FINDINGS.md) |
| **Requirement** | `RAISE-FR-EXEC-001` — Executive Dashboard |
| **Status** | **Awaiting answer** |
| **Blocks** | The NBV tile on the Dashboard, the NBV section of the P-018 Settings screen, **Gap 21**, and `RAISE-FR-EXEC-001`'s remaining `PASS (partial)`. **This is the only outstanding item that would move a Compliance Review verdict.** |
| **Sendable version** | <https://claude.ai/artifact/SBSEdYxNAAyS6G9rKCqBos> — the same question as a fillable schedule, one row per Asset Type. Answers save to the page, so a reply cannot go missing the way the 2026-09-10 one did. **Private by default: it must be shared from its own Share menu before the recipient can open it.** Answering by email or chat instead is equally fine — the page says so itself. |

### What is already decided — so the ask is as narrow as possible

Everything about *how* NBV works is settled. None of it is being reopened:

- **Formula** (PRD §16 **Resolved Question 46**): straight-line —
  `NBV = purchaseCost − (purchaseCost ÷ usefulLifeYears × assetAgeInYears)`
- **Salvage value:** zero. **Clamped** at 0 — an asset past its useful life is
  worth 0, never negative.
- **Inputs:** `purchaseDate` and `purchaseCost`, both of which already exist on
  every Asset record.
- **Where it is configured:** the P-018 Settings screen, following the same
  pattern the Warranty Expiring-threshold already uses (RQ41).
- **An Asset Type with no configured value** (PRD §16 **Resolved Question 51**)
  contributes its `purchaseCost` unchanged to the portfolio total — treated as
  not yet depreciated, still included. **So a partial answer is usable.**
- **The code is already written and tested.** `frontend/src/lib/nbv.ts`
  implements the formula in full, with 15 unit tests, and takes the useful-life
  lookup as an **injected parameter** — it defines **no defaults of its own**.
  It has zero production importers today because there is nothing to feed it.

### The question

> **For each Asset Type, how many years is its useful life for depreciation
> purposes?**

As currently seeded, the Asset Types present in the data are:

| Category | Asset Types needing a value |
|---|---|
| IT Hardware | Laptop, Monitor, Headphones |
| Mobile | Smartphone, Tablet |
| Office Equipment | Printer, Projector |
| Infrastructure | Server, Router |
| Media Equipment | Camera |

**This list is not a fixed enumeration.** `type` is free text on the Asset
record, so it grows as new kinds of asset are added. Per RQ51 above, a Type
with no configured value is simply treated as not yet depreciated — so **you do
not need to wait until you can answer for every Type.** Values for the Types
that matter most are enough to start.

### Why it is asked per **Type** and not per **Category**

Because you told us so. PRD §16 **Resolved Question 52** (2026-09-08) amended
RQ46 after the earlier per-Category question could not be answered for **IT
Hardware** — *"it depends on the equipment purchased"*. Per-Type is a superset:
nothing about the other four categories' coverage is lost by keying it this way.

### If the answer is "not yet"

That is a complete answer and needs no follow-up. The NBV tile stays unbuilt,
`RAISE-FR-EXEC-001` stays `PASS (partial)`, and Gap 21 stays open — all of
which is already the recorded state. **Nothing is blocked on *hearing* that.**
What does not work is silence, because silence is indistinguishable from the
question not having reached you.

### What engineering will not do

**Supply a plausible-looking default so the tile can ship.** These numbers
become money on an executive dashboard. PRD §16 Open Question 3a says in terms:
*"Do not invent or use an illustrative number as if confirmed."* This project
has held F-03 open across four separate requests rather than fill it in, and
raised **F-54** precisely because four SLA values reached production without
authority. **No candidate values are offered here, deliberately** — not even as
a starting point to react to, because a number offered for convenience has a
way of becoming the answer.

---

## DR-03 — Who is the requester when an IT Requisition is created?

| | |
|---|---|
| **Raised** | 2026-09-21 (first asked 2026-09-10 as part of a combined request; no copy of that one was kept) |
| **Finding** | [F-55](OPEN-FINDINGS.md) |
| **Requirement** | `RAISE-FR-MAINT-001` — Maintenance / IT Requisition |
| **Status** | **Awaiting answer** |
| **Blocks** | The Create IT Requisition form in real-API mode. `RAISE-FR-MAINT-001`'s verdict is **not** affected — it stays a full `PASS`. |

### The defect, stated plainly

`frontend/src/pages/CreateRequisition/index.tsx:60` reads:

```
const requesterId = params.get('requesterId') || 'e1';
```

`'e1'` is a **mock fixture id** (`mockData.ts:345`). Real employee ids in
Postgres are UUIDs. So when the page is opened **without** a `requesterId` in
the URL and the real-API flags are on, the lookup for employee `'e1'` returns
**404**, and the page fails before any requisition is submitted — showing
*"Unable to submit the IT requisition. Please try again."*, **a retryable
message for something that can never succeed on retry.**

**Which entry points are affected:** the sidebar, the Maintenance list's "New
IT Requisition" button, and Asset Detail. Only **Employee Detail** passes a
real `requesterId`, because it files on that employee's behalf.

**Nothing user-facing is broken today** — the real-API flags default off
outside the Docker stack. But `docker-compose.yml` defaults them **on**, so
this surfaces the moment anyone runs the composed stack.

### The question

> **When someone opens Create IT Requisition without naming an employee, who
> should the requisition be filed on behalf of?**

### The options identified, none of them chosen here

**(a) The logged-in user.** The obvious answer — and **not implementable
today**, which is why it is listed first rather than recommended. The
authenticated `User` (`frontend/src/types/auth.ts`) carries only
`{id, username, fullName, role}` and **no employee id**; the demo user's `id`
is the literal string `"admin"`. Choosing (a) means first establishing a
`User`→`Employee` link that does not exist, which makes it partly downstream of
**F-08** (authentication mechanism and role model, still open).

**(b) An explicit requester field on the form.** The person filing chooses the
employee, defaulting to nobody. Implementable now with no dependency on F-08 —
but it **adds a field to a confirmed screen**, which is a specification change
and needs the same authority as any other scope change.

**(c) Some other rule you specify.** For example: always require arriving from
an employee's record, and remove the standalone entry points entirely.

### If the answer is "not yet"

Also a complete answer. The defect stays recorded, the real-API flags stay off
outside the composed stack, and nothing regresses. **What should not happen is
this being fixed quietly by picking (b)** because it is the easiest to build.

### What engineering will not do

Substitute a different hardcoded id, or silently default to the first employee
in the list. Both would replace one invented answer with another. **The fix is
small; deciding what it should do is not engineering's call.**

---

## Previously sent, no durable copy

**Superseded 2026-09-21.** **F-03** and **F-55** had a combined request prepared
and sent on **2026-09-10** — the checkpoints record that it was sent, but not
its contents. Both are now written up properly as **DR-02** and **DR-03** above,
so the next follow-up has something specific to point at.

**Nothing else is outstanding without a durable copy.** If a new decision is
needed, write it up as a `DR-NN` section before asking, not after.
