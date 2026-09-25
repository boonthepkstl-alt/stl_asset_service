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
| **Status** | **ANSWERED 2026-09-23** — see "The answer" below. Recorded as PRD §16 **Resolved Question 54** (PRD v0.22), closing **Open Question 3a** and resolving [F-03](OPEN-FINDINGS.md). |
| **Blocks** | ~~The NBV tile on the Dashboard, the NBV section of the P-018 Settings screen, **Gap 21**, and `RAISE-FR-EXEC-001`'s remaining `PASS (partial)`.~~ **Unblocked.** Both surfaces are now built and the chain is synced. **Gap 21 is NOT closed** and `RAISE-FR-EXEC-001` stays `PASS (partial)`: the seven affected test cases are now testable but **none has been formally executed**, so no verdict moved. |

### The answer — received 2026-09-23

Business answered: **"ใช้ 5 ปีทุกอย่างยกเว้นมือถือ 3 ปี"** — *"use 5 years for
everything except mobile phones, 3 years."*

| Asset Type | Useful life (years) |
|---|---|
| Laptop | 5 |
| Monitor | 5 |
| Headphones | 5 |
| **Smartphone** | **3** |
| Tablet | 5 |
| Printer | 5 |
| Projector | 5 |
| Server | 5 |
| Router | 5 |
| Camera | 5 |

**Two ambiguities in that phrasing were put back to the business and answered
explicitly rather than inferred.** Recording them here matters, because neither
is recoverable from the sentence above and both are exactly the kind of thing a
later reader would "fix" in the wrong direction:

1. **Tablet is 5, not 3.** "มือถือ" was confirmed to mean the Smartphone
   handset specifically — **not** the whole Mobile category, which also contains
   Tablet. Smartphone is the only Asset Type at 3 years.
2. **These ten are the Asset Types present in the data today, not a blanket
   default.** `type` is free text and new kinds will appear. An Asset Type with
   no configured value is **not** assumed to be 5 — it continues under PRD §16
   **Resolved Question 51**, contributing `purchaseCost` unchanged and staying
   counted in the portfolio total. RQ51 is unamended.

**What followed the same day:** the full chain was propagated (Design v0.20,
Prototype v0.21, AC v0.21, Test Plan v0.21, Test Cases v0.35, Matrix v2.17) and
both surfaces were implemented — the P-018 Settings NBV section and the tenth
Dashboard KPI tile, with `lib/nbv.ts` re-keyed from Category to Type (RQ52,
which the code had never actually followed). The ten values are pinned by a test
that fails on an eleventh entry as well as on a changed one, so a future
invented row cannot pass quietly.

**What did NOT follow:** execution. The automated suite covers the wiring; no
formal browser execution of `TC-DASH-01`/`TC-EXEC-001-01`/`TC-DASH-03b`/
`TC-WARRANTY-001-07` has happened, so **Gap 21 stays open** and the Compliance
Review board is unchanged at **8 PASS / 2 FAIL / 6 BLOCKED / 1 partial**.
Answering the question did not, by itself, move a verdict — and this request
having been "the only outstanding item that would move one" is a statement about
what it unblocks, not about what it delivers.
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

## DR-04 — Where is RAISE meant to run, and is deploying it in scope yet?

| | |
|---|---|
| **Raised** | 2026-09-22 — **first time this has ever been asked.** F-13 has been open since the architecture document was written and has never carried a decision request. |
| **Finding** | [F-13](OPEN-FINDINGS.md) |
| **Requirement** | None. F-13 is filed under *Infrastructure / Process — not addressed anywhere in the PRD.* |
| **Status** | **Awaiting answer** |
| **Blocks** | **F-14's remaining half** (CI builds no container image because there is nowhere to publish one), and every deployment-shaped item in `RAISE-HIGH-LEVEL-ARCHITECTURE.md` §6. Blocks **no MVP requirement** — nothing in the traceability matrix depends on it. |

### How this request differs from DR-01, DR-02 and DR-03 — stated plainly

The other three ask for **business rules engineering must not invent**: useful-life
values, a requester rule, a scope decision. This one is different, and pretending
otherwise would be misleading.

**Hosting is a decision engineering could propose options for.** What makes it
yours rather than ours is that it commits money, a vendor, and someone to operate
it — none of which is engineering's to commit on your behalf. **So if a
recommendation would help, ask and you'll get one.** That offer is deliberately
not extended in DR-02, where a suggested figure would contaminate the answer.

### The cheapest answer first

> **Is deploying RAISE anywhere beyond a developer's machine in scope right now?**

**If the answer is no — "local demo only for now" — that is a complete answer and
the best possible outcome for this request.** It closes F-13 as *decided: not yet*,
and it reclassifies F-14's remaining half from "blocked" to "not needed yet", which
removes it from the board rather than leaving it to look like neglected work.
**Nothing needs building, and one open finding stops being open.**

Only if deployment **is** in scope does the rest of this matter.

### What exists today

- **The app runs as three containers** — frontend, backend, Postgres — via
  `docker-compose.yml` and two Dockerfiles. Local development and demo are
  reproducible. That was done on 2026-09-01.
- **CI validates both stacks on every pull request** — lint, type-check, tests,
  build, and `gofmt`. It has been green on every merge.
- **CI does not build or publish a container image**, because there is nowhere
  agreed to publish it to. That is the entire content of F-14's remaining half.
- **Database migrations can be applied on demand** (`-migrate`), but do not run
  automatically — deliberately, since running them at startup is unsafe across
  multiple instances, which is itself a deployment-shaped question.

### If deployment is in scope, the inputs needed

**No option is proposed for any of these** — but unlike DR-02, a recommendation is
available on request:

| # | Input needed | Why it blocks work |
|---|---|---|
| 1 | **Where it runs** — a cloud provider, on-premise servers, or the company's existing platform | Determines everything downstream. Without it, nothing else on this list can be answered. |
| 2 | **A container registry** | The single thing F-14's remaining half needs. CI can build and publish images the day this exists. |
| 3 | **Which environments** — production only, or staging as well | Decides how many configurations exist and whether migrations need a rehearsal target. |
| 4 | **Who operates it** — this team, an internal platform team, or a vendor | Decides how much of the work is ours at all, and who holds the credentials. |
| 5 | **Whether infrastructure-as-code is expected** | A tooling and skills commitment, not a detail. |

### What is not being asked here

**Nothing about the product.** No requirement, screen, field or business rule
changes on any answer to this request. It is entirely about where the software
runs, and it can be answered "not yet" without consequence for anything in the
deliverable chain.

---

---

## DR-05 — Is Asset Type a fixed list or an open vocabulary?

| | |
|---|---|
| **Raised** | 2026-09-25, from the NBV execution sweep (`CHECKPOINT-2026-09-24-001`) |
| **Finding** | [F-60](OPEN-FINDINGS.md) |
| **Requirement** | `RAISE-FR-ASSET-001` (Asset Registry) for the product half; `RAISE-FR-EXEC-001` for the testing half |
| **Status** | **Awaiting answer** |
| **Blocks** | The last two cases of **Gap 21** (`TC-DASH-04`/`TC-EXEC-001-04`). Blocks **no verdict** on its own — `RAISE-FR-EXEC-001` is already `PASS (partial)` and stays there either way. It does, however, block four Asset Types and an entire Category from being registered through the app. |

### What was found, and how

While executing the NBV test cases against the running app, two of the seven could not be run. They need an asset whose Type has no configured useful life, and **the application cannot create one.** Create Asset's Type field is a closed list of **six** options — Laptop, Monitor, Smartphone, Tablet, Server, Printer — and every one of them already has a configured value. Nothing edits Type after creation.

That is the testing half. **The product half is larger and was not what anyone was looking for:**

> **The register contains ten Asset Types. The form can create six of them.**
>
> Headphones, Projector, Router and Camera assets exist in the system today, and all four now carry a business-confirmed useful life (Resolved Question 54). **None of them can be registered through the app.** Neither can anything in the **Media Equipment** category, which is missing from the Category dropdown entirely — four of five categories are offered.

Nothing is broken for existing assets: they display, depreciate and report normally. The gap is only in creating new ones.

### What is already true, so the question stays narrow

- **The data layer has no opinion.** `type` is `varchar(100) NOT NULL` in PostgreSQL, a plain `string` in the Go model and in the frontend's `Asset` type. There is **no enum, no check constraint, and no service-side validation** anywhere. Any string is accepted through the API today.
- **The closed list exists only in the form.** It is six hardcoded `<option>` values in one screen, not a model of the business.
- **Resolved Questions 52 and 54 both presume the set can grow.** RQ52 keyed useful life per Type precisely because IT Hardware has no single lifespan; RQ54 supplied values for "the ten Asset Types present in the data **today**" and explicitly declined to set a default for later ones. **Resolved Question 51 exists to govern exactly that case** — an unconfigured Type contributes its purchase cost unchanged. So the specification already assumes new Types appear. What it never says is **who may introduce one.**

### The question

> **Is Asset Type a fixed vocabulary the business controls, or open text whoever registers an asset can extend?**

### The options, none of them chosen here

**(a) Open text.** The form takes a free-text Type (or a combobox suggesting existing values). Matches what the data layer already permits and what RQ51/RQ52/RQ54 already assume. All ten Types become registerable immediately, new ones need no code change — and RQ51's rule becomes reachable through the UI, so `TC-DASH-04`/`TC-EXEC-001-04` become executable. **The cost is consistency:** "Laptop", "laptop" and "Lap top" would become three Types, each grouping and depreciating separately.

**(b) Fixed list, widened.** The dropdown is corrected to the ten Types and five Categories that actually exist. Consistency is preserved and today's gap closes. **Note the consequence for testing, because it is easy to miss:** if the list is exactly the ten configured Types, then **the UI can never produce an unconfigured Type**, and `TC-DASH-04`/`TC-EXEC-001-04` stay unexecutable through the UI permanently — not as a defect, but by construction. RQ51's rule would still be live, since the API accepts any string and data can arrive from imports, migrations or the backend directly; it would simply not be reachable from the screen. Adding a Type later becomes a code change.

**(c) Leave the form as it is.** Cheapest, and the hardest to defend: four Types and a Category that already exist in the register would remain uncreatable, with no stated reason.

### The second question, which only matters under (b)

> **Is unit-level coverage enough for a rule the UI cannot reach?**

`frontend/src/lib/nbv.test.ts` already covers RQ51's rule — an unconfigured Type contributes `purchaseCost` unchanged and stays counted in the total. Under option (b) that would be the only coverage it can have at the UI level.

**Answering "yes, that is sufficient" is a legitimate answer, not a concession.** It would let `TC-DASH-04`/`TC-EXEC-001-04` be closed as *covered elsewhere* rather than left open indefinitely, and **Gap 21 would close.** Answering "no" keeps them open until the rule can be exercised end to end.

**This one is partly ours, so unlike DR-02 a recommendation is available on request** — the same offer made in DR-04. What makes it yours is that it sets the standard for when this project considers a rule tested, which is a precedent beyond this gap.

### What engineering will do with each answer

| Answer | What follows |
|---|---|
| **(a) Open text** | Replace the Type `Select` with free text or a combobox; consider normalising case at entry. `TC-DASH-04`/`TC-EXEC-001-04` become executable; Gap 21 closes on execution. |
| **(b) Fixed list, widened** | Correct both dropdowns to the real ten Types and five Categories. Gap 21's last two cases then depend on the second question. |
| **(c) Leave as is** | Record it as an accepted limitation in F-60 with the reason, and close nothing. |
| **Second question: yes** | `TC-DASH-04`/`TC-EXEC-001-04` recorded as covered by unit test, Gap 21 closed, the standard written down so it is not re-argued case by case. |
| **Second question: no** | Both stay open; closing them requires whatever seam option (a) or a test-data route would provide. |

**No option is proposed here.** Whether Type is the business's vocabulary or the registrar's is a question about how this organisation wants its asset data governed, and engineering picking it would be inventing scope — the same reason **F-03** was held open across four requests rather than filled in with five plausible numbers.

---

## Previously sent, no durable copy

**Superseded 2026-09-21.** **F-03** and **F-55** had a combined request prepared
and sent on **2026-09-10** — the checkpoints record that it was sent, but not
its contents. Both are now written up properly as **DR-02** and **DR-03** above,
so the next follow-up has something specific to point at.

**Nothing else is outstanding without a durable copy.** If a new decision is
needed, write it up as a `DR-NN` section before asking, not after.
