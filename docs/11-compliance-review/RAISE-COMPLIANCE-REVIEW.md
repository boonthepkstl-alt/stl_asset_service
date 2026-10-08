# RAISE — Requirement Compliance Review

**Document Status:** Draft v1.8 — **Re-verified 2026-10-07 against Traceability Matrix v2.19. The first verdict movement since v1.4, and the headline goes down: 7 of 18 (38.9%), from 8 of 17 (47.1%).**

Three business decisions answered in chat on 2026-10-07 — DR-05, DR-06 and DR-03 — reached this document through the full chain (PRD v0.23 → matrix v2.19). **Two of them move the board, for two different reasons, and §4 separates them:** the denominator grew by one, because DR-06 created a new MVP requirement (`RAISE-FR-ASSET-004`) that is built nowhere; and `RAISE-FR-ASSET-001` moved from `PASS` to `PASS (partial)`, because DR-05 added criteria to it — **one of which targets a defect that has shipped since the form was built** and that its original passes never exercised. **Nothing in the product regressed.**

**This revision also updates the body, which the last three did not.** v1.5, v1.6 and v1.7 each prepended a header note; none touched §3, §7 or the Document Status footer, which still read **v1.4**. Re-checking §3 row by row found three cells stale independent of today's changes — `RAISE-FR-EXEC-001` still named the useful-life values (supplied 2026-09-23) as its blocker, `RAISE-FR-WARRANTY-001` still called `TC-WARRANTY-001-07` blocked (it passed 2026-09-24), and Dashboard/Navigation still described a nine-tile grid. §7 still said "F-03 needs values" two weeks after it got them. **All corrected.** The lesson §7 has carried since v1.1 — re-verify in the same pass — was being honoured in the header only.

*(v1.7: re-verified 2026-10-07 against matrix v2.18 — DR-01 and DR-04 answered, no verdict moved. Header retained below.)*

---

**Document Status:** Draft v1.7 — **Re-verified 2026-10-07 against Traceability Matrix v2.18 (unchanged). No verdict moved; the headline stays 8 of 17 (47%).**

Two decision requests were answered: **DR-01** (Software License stays Roadmap — F-57 resolved as *confirmed unchanged*) and **DR-04** (running RAISE beyond a developer's machine is not yet in scope — F-13 resolved as *decided: not yet*). **Neither touches a §3 row:** `RAISE-FR-LICENSE-001` is Roadmap and not among the 17, and F-13 has no requirement at all. This revision exists only so §5 stops listing both as open — a small correction, made because tracking documents drifting quietly out of date has been this month's most frequent defect.

*(v1.6: re-verified 2026-09-24 against matrix v2.18 — the NBV execution sweep, no verdict moved. Header retained below.)*

---

**Document Status:** Draft v1.6 — **Re-verified 2026-09-24 against Traceability Matrix v2.18. The headline stays 8 of 17 (47%).**

The NBV execution sweep this document has been waiting on finally ran, against the real app on the merged code (PR #151, `158362e`). **Five of seven cases PASS** — the ten-tile KPI grid re-executed against its current criterion (`TC-DASH-01`/`TC-EXEC-001-01`, the superseded nine-tile PASSes explicitly not carried forward), the NBV tile itself (`TC-DASH-03b`/`TC-EXEC-001-03b`, rendering **$9.6K of $30.1K across 15 assets** — a figure independently recomputed from the fixtures with RQ46's formula and RQ54's values before it was accepted), and the P-018 NBV section (`TC-WARRANTY-001-07`, ten pre-populated rows matching RQ54 exactly, **including the two values the business had to disambiguate by hand**).

**`RAISE-FR-EXEC-001` still does not reach a full `PASS`, and the reason is a new one.** `TC-DASH-04`/`TC-EXEC-001-04` — PRD §16 Resolved Question 51's unconfigured-Asset-Type rule — are recorded **BLOCKED (test data unreachable)**. They are not blocked on a business answer and not on an unbuilt feature. **The application cannot produce the precondition:** Create Asset's Type field is a closed six-option list, every option already configured; all fifteen seeded assets use configured Types; and no screen edits `type` after creation. The rule is not untested — `frontend/src/lib/nbv.test.ts` covers it at the unit level — but it has never been exercised through the running app. Raised as Open Finding **F-60**, which also records the product-level half: four Asset Types and an entire Category cannot be registered through the UI at all.

**Gap 21 narrows rather than closes.** Its unbuilt half is discharged and five of its seven cases pass; two remain.

**Worth naming, because this document has twice reported verdicts its execution record did not support:** this is the first revision in four where execution actually happened, and the headline still did not move. That is the correct outcome, not a disappointing one — a single blocked case is enough to keep a requirement qualified, and `TC-DASH-04`'s own step 1 claiming the condition was "reachable by data alone" went unchallenged until someone tried it.

*(v1.5: re-verified 2026-09-23 against matrix v2.17 — DR-02 answered and the feature built, no verdict moved. Header retained below.)*

---

**Document Status:** Draft v1.5 — **Re-verified 2026-09-23 against Traceability Matrix v2.17. No verdict moved; the headline stays 8 of 17 (47%).**

The business answer this document has named as its one verdict-moving blocker finally arrived: Decision Request **DR-02** was answered 2026-09-23, supplying the ten per-Asset-Type NBV useful-life values (PRD §16 **Resolved Question 54**, closing Open Question 3a and resolving Open Finding **F-03**). The chain was propagated end to end and both NBV surfaces — the P-018 Settings section and the tenth Dashboard KPI tile — were built the same day, with `lib/nbv.ts` re-keyed from Category to Type (RQ52, which the code had never followed).

**None of that changes a verdict here, and saying so plainly is the point of this revision.** `RAISE-FR-EXEC-001` stays **`PASS (partial)`** and **Gap 21 stays open**. The seven affected criteria moved from *blocked* to *testable*, not to *passing*: `TC-DASH-01`/`TC-EXEC-001-01`/`TC-DASH-03b`/`TC-WARRANTY-001-07` have **not been formally executed**, and `TC-DASH-01`/`TC-EXEC-001-01`'s existing PASS records were taken against the superseded **nine**-tile criteria and require re-execution rather than carry-forward. Automated tests cover the wiring (296 passing, from 289, four of the new ones mutation-verified); they are not this chain's execution record.

This is the third consecutive revision where the honest result is "nothing moved," and it is worth naming why that keeps happening: this document reports **executed** verdicts, and the project has repeatedly done the work that makes execution *possible* without then executing. v1.1 existed because the opposite error — reporting a verdict the execution record did not support — reached the headline number twice.

*(v1.4: re-verified 2026-09-20 against matrix v2.16 — restored the Warranty row after v1.3's erroneous downgrade. Header retained below.)*

---

**Document Status:** Draft v1.4 — **Re-verified 2026-09-20 against Traceability Matrix v2.16.** v1.3 downgraded `RAISE-FR-WARRANTY-001` to `PASS (partial)` to match the matrix's label. **That was wrong** — Open Finding **F-59** established that the label, not the body, was the stale half: the cell has contradicted itself since matrix **v2.2**, four days *before* the dual-mapped `TC-WARRANTY-001-07` that the `(partial)` was assumed to describe even existed. Matrix v2.16 corrects the label; this row is restored to **`PASS`** and the headline returns to **8 of 17 (47%)**. The other 17 verdicts were re-checked row by row at v1.3 and are unchanged. *(v1.2 header retained below for history.)*

*(v1.3: re-verified 2026-09-20 against matrix v2.15 — corrected §7's stale gap claim and F-03's re-key, and wrongly downgraded the Warranty row.)*

*(v1.2: Draft v1.2 — re-verified 2026-09-07 against Traceability Matrix v2.6.)*

*(v1.2: Draft v1.2 — re-verified 2026-09-07 against Traceability Matrix v2.6.)*
**Scope note:** this is the first artifact in the deliverable chain that
consumes real source code rather than producing the spec for it. It
consolidates [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md)
**v2.16** against the code in `go-template-main/` and `frontend/`, per the
chain diagram in [`CLAUDE.md`](../../CLAUDE.md):

```text
RAISE-TRACEABILITY-MATRIX.md
      │
      ▼
Development (Source Code)
      │
      ▼
Requirement Compliance Review   ← this document
      │
      └──► Finding / Gap ──► Fix / Re-test
```

It is **not** a numbered stage of the original 7-stage deliverable chain
(`docs/01-requirements/` … `docs/07-traceability-matrix/`) and carries no
`RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` ID of its own, matching the
convention already used by `docs/08-architecture/` through
`docs/10-detailed-design/`. It **does not re-derive** any evidence —
every verdict below cites the Traceability Matrix row (or
`OPEN-FINDINGS.md` entry) that already carries the underlying test
execution/live-verification evidence. Re-deriving evidence here would
create a second copy that can drift from the source; this document's job
is to consolidate and render a verdict, not to re-test.

**Source:** [`RAISE-TRACEABILITY-MATRIX.md`](../07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md) v1.4 (§3–§5), cross-checked against [`OPEN-FINDINGS.md`](../project-management/OPEN-FINDINGS.md) (as of R-18) and [`RAISE-PRD.md`](../01-requirements/RAISE-PRD.md) v0.12.
**As of:** 2026-09-01, immediately after `CHECKPOINT-2026-09-01-007` (`OPEN-FINDINGS.md`/`PROJECT-CHECKPOINTS.md` are the authoritative point-in-time record — re-check those, and the Traceability Matrix's own version header, before trusting this table on a later date).
**Source of Truth:** RAISE PRD
**Reference Only:** VERSCAN

---

## 1. Purpose

Per `RAISE-PRD.md` §17's Traceability convention and the Traceability
Matrix's own §8 "Compliance Review Readiness" section, this document
renders one formal verdict per MVP requirement — `PASS`, `PARTIAL`,
`FAIL`, `BLOCKED`, or `NOT_IMPLEMENTED` — and records what would need to
happen to move each non-`PASS` row forward. It is a **verdict layer**,
not a new evidence-gathering pass: every row below traces to a specific
Traceability Matrix §3/§4 cell, which itself traces to a specific test
execution or live-verification event recorded there.

**Readiness check performed before drafting this document:** the
Traceability Matrix's own §6 confirms all 13 tracked chain-consistency
gaps are resolved (Gaps 1–13), and §9's review checklist is fully
checked. This means the chain feeding this review is internally
consistent — no requirement below is missing a Design/Prototype/AC/Test
Plan/Test Case layer, and no citation in this document rests on an
unverified claim from a downstream document.

## 1a. Revision Note — what changed at v1.4, and why it mattered

**v1.4 (2026-09-20) — `RAISE-FR-WARRANTY-001` restored to `PASS`; v1.3's downgrade was an error.**

v1.3 found this document recording a full `PASS` where the matrix's label said
`PASS (partial)`, and corrected down on the principle that a compliance review
consolidates its input rather than overruling it. **The principle is right. The
application was wrong**, because the matrix cell contradicts *itself*, and v1.3 aligned
to one half of it without first establishing which half was stale. It then filed the
ambiguity as **F-59** and deferred it — having already acted on it.

**F-59's answer, and the one fact that settles it:** the contradiction is older than
the thing blamed for it. At matrix **v2.2 (2026-09-04)** the cell already read label
`PASS (partial)` and body *"Overall row status: **PASS** — no remaining PRD-content
blocker and no remaining unexecuted test case for this requirement"*.
`TC-WARRANTY-001-07` was added **2026-09-05**. The `(partial)` label cannot have
described a case that did not yet exist; it is a leftover from before **Gap 12** and
**Gap 13** closed on 2026-09-01, updated in the body and missed in the label.

Four further signals in the current cell agree: the **AC Group(s)** column assigns
`AC-WARRANTY-001-07` to `RAISE-FR-EXEC-001`, the **TC ID(s)** column marks `-01..06`
*"this requirement, unaffected"* and `-07` as belonging to EXEC-001's NBV scope, and
the body says twice that `-07` is *"not counted within this row's own `PASS`"*.

**The fix went where the defect was.** Matrix **v2.16** corrects the label; this
document follows it, as it should have all along. **v1.3's rule stands unchanged —
this document does not overrule the matrix** — and the lesson v1.4 adds is narrower:
**when the input contradicts itself, investigate before correcting, not after.**
Answering F-59 cost one `git show` across fourteen revisions; acting first cost a
published verdict being wrong twice in three days.

---

## 1b. Revision Note — what changed at v1.3

**v1.3 (2026-09-20) — re-verified against matrix v2.15, nine revisions on from v1.2.**
All 18 verdicts were re-checked row by row. **Seventeen matched. One did not, and it
was not caused by the nine revisions of drift:**

- **`RAISE-FR-WARRANTY-001`, `PASS` → `PASS (partial)`.** The matrix has recorded this
  row as `PASS (partial)` continuously **from v2.2 through v2.15** — checked by reading
  the row out of all fourteen committed revisions, not inferred. v1.1 set it to a full
  `PASS` on its own reasoning that `TC-WARRANTY-001-07` belongs to
  `RAISE-FR-EXEC-001`'s NBV scope. **The reasoning is echoed in the matrix's own row
  text and may well be right — but this document consolidates its input, it does not
  overrule it.** The disagreement is real and is now filed as **F-59** for whoever owns
  the matrix to settle; until then this document reports what the matrix records.
- **§7's "no gap open at all" corrected.** True of matrix v2.6, false from v2.7 onward.
  **Gap 21 is open** (NBV tile unbuilt, blocked on F-03); Gaps 22–27 opened and closed
  in between.
- **F-03 re-keyed.** PRD §16 Resolved Question 52 (2026-09-08) changed the useful-life
  configuration from per-Category to **per Asset Type**, so "five numbers" is no longer
  the right description of what is missing.

**The uncomfortable part, recorded rather than smoothed over:** v1.1 existed to fix
F-47 — this document overstating `RAISE-FR-EXEC-001` as a full `PASS`. In the same
revision it overstated `RAISE-FR-WARRANTY-001` the same way, and v1.2 carried it
forward. **A re-verification pass is not self-verifying**, and the headline number it
produced (8 of 17) was wrong in the flattering direction for two revisions.

---

**v1.1 (2026-09-07) — retained below for history.** At v1.0 this document
consolidated Traceability Matrix **v1.4**; the matrix had reached **v2.6**, and two of
the verdicts below had gone stale in opposite directions:

| Requirement | v1.0 said | Matrix v2.6 records | Direction |
|---|---|---|---|
| `RAISE-FR-EXEC-001` | **`PASS`** | **`PASS (partial)`** | **Overstated** — the more serious error |
| `RAISE-FR-ALERT-001` | `PASS (partial)` | **full `PASS`** | Understated |

**The overstatement is the one worth naming plainly.** v1.0 reported the Executive
Dashboard as a full, unqualified `PASS` on the grounds that its "confirmed
8-tile/10-section scope is fully PASS regardless" of the then-open NBV/Risk question.
That reasoning stopped holding once the KPI scope itself was resolved and grew: PRD
§16 Resolved Questions 46—48 (2026-09-05) confirmed the NBV formula, put Risk out
of MVP scope, and recorded Utilization as built — which turned "a separate,
still-open question" into **an unmet part of this requirement's own confirmed
scope**. The Acceptance Criteria layer then wrote a criterion for NBV (`AC-DASH-03b` /
`AC-EXEC-001-03b`), the Test Cases layer wrote a case, and that case is `BLOCKED`. A
full `PASS` can no longer be justified.

**Nothing regressed in the product** in either direction. The Executive Dashboard
gained a working Utilization tile in this period; Alerts gained a working header bell.
Both verdict movements are the chain catching up to its own resolved questions, which
is exactly what this document exists to surface.

**Also corrected at v1.1:** §5 listed F-02, F-05, F-18 and F-19 as open when all four
had been resolved (R-19, R-23, R-21, R-22), and §7 stated "Gaps 1—13 resolved"
when the matrix now records **Gaps 1—20 resolved with no gap open at all** — the
first time in that document's history.

---

## 2. Verdict Legend

| Verdict | Meaning |
|---|---|
| `PASS` | Every test case for this requirement has been formally executed against the real running app (or, for backend-only items, against real code) and passed. No open PRD-content question blocks any part of the requirement's confirmed scope. |
| `PARTIAL` | Some test cases/sub-criteria PASS; at least one sub-item is genuinely blocked on an open PRD/business question (not a build gap) — the requirement is correctly built for everything currently confirmed, and the remainder is honestly out of reach until that question is answered. |
| `FAIL` | At least one test case was formally executed and failed against the app as built — a real, confirmed build defect or missing capability, independent of any open PRD question. |
| `BLOCKED` | The requirement (or a sub-item within it) cannot be tested at all yet, because a prerequisite PRD/business decision has not been made — there is no build gap to fix, only a decision to obtain. |
| `NOT_TESTED` | *Added at v1.8.* Fully specified through the chain, test cases written, **nothing executed** — here, because nothing has been built. Not `FAIL`, which this legend reserves for an executed run; not `BLOCKED`, because nothing waits on a decision. Taken from the Traceability Matrix, which first used it for the unbuilt NBV cases at v2.17. |
| `NOT_IMPLEMENTED` | Reserved until v1.8 for "a future requirement with zero code against it." **That requirement has now arrived** — `RAISE-FR-ASSET-004` — and this review records it as the matrix does, `NOT_TESTED` with "not built" stated, rather than introducing a category the matrix does not use. This document does not overrule the matrix. |

## 3. MVP Requirement Compliance — Verdicts

| Requirement | Title | Verdict | Evidence (Traceability Matrix §3/§4) | What would move this forward |
|---|---|---|---|---|
| `RAISE-FR-ASSET-001` | Asset Registry | **PASS (partial)** — *downgraded at v1.8* | §3 row (matrix **v2.19**) — `TC-ASSET-001-01..04`, `TC-ASSET-001-D-01..02` all PASS, executed 2026-08-26/-27, **and still standing.** PRD §16 Resolved Question 55 (2026-10-07) added `TC-ASSET-001-05..08` on the Create Asset form, **none executed, all expected to FAIL**: `-05..-07` because the open-text Type field is decided but not built (Gap 29); **`-08` because the shipped form offers four Categories and omits Media Equipment** — a defect present since the form was built, against data confirmed since Resolved Question 41 (Gap 30). The original six cases never exercised the registration form, so they could not see it. | Build the open-text Type field and correct the Category list to the confirmed five, then execute `-05..-08`. **Both are engineering work; neither needs a decision.** F-09 (full field list) remains a separate open question that does not block this row. |
| `RAISE-FR-ASSET-002` | Category & Hierarchy | **PASS** | §3 row — `TC-ASSET-002-01..03` all PASS, re-executed 2026-09-01 after F-27 spec resolution | Nothing outstanding. |
| `RAISE-FR-ASSET-004` | Employee Offboarding (Held-Asset Flag) — *new MVP requirement at v1.8* | **NOT_TESTED** — *not built* | §3 row (matrix **v2.19**) — brought into MVP by PRD §16 Resolved Question 56 (DR-06, 2026-10-07). The chain is complete with no orphan: PRD → Design §4.2 → Prototype P-003/P-004/P-006/P-008 → `AC-ASSET-004-01..13` → `TS-ASSET-004` → `TC-ASSET-004-01..13`, 1:1. **No "Holder inactive" or "Holder on leave" text exists anywhere in `frontend/src/`**, and no case has run. Test data is reachable today: holder links are seeded on every asset, and employee status is editable. | Build the held-asset badge (Gap 28), then execute. **Engineering work; no decision outstanding.** Five of the thirteen cases (the negative ones) pass trivially against an unbuilt feature and count for nothing until `-01` passes in the same build — the matrix records this, and so does this review. |
| `RAISE-FR-ASSET-003` | Custody History | **PASS** | §3 row — `TC-ASSET-003-01..03` all PASS, executed 2026-08-26/-27 | Nothing outstanding for this row. `RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` scope overlap (F-10) is a separate, still-open documentation-clarity question, not a defect in either row. |
| `RAISE-FR-OPS-001` | QR / Barcode | **PASS** | §3 row — `TC-OPS-001-01..03` all PASS, re-executed 2026-08-26 after F-21 fix | Nothing outstanding. |
| `RAISE-FR-OPS-002` | Check-in / Check-out | **PASS** | §3 row — `TC-OPS-002-01..03` all PASS, executed 2026-08-28 | "Appropriate permission" role-correctness (PRD §16 Q22 / F-08) remains untestable but does not block the state-transition/audit-entry behavior already confirmed. |
| `RAISE-FR-MAINT-001` | Maintenance (4-stage workflow) | **PASS** | §3 row — `TC-MAINT-001-01..09` all PASS, executed 2026-08-28 | SLA/vendor/cost model and delegated-approver configuration rules remain a separate, still-open PRD question — does not block the confirmed workflow-shape PASS. |
| `RAISE-FR-WARRANTY-001` | Warranty | **PASS** — *restored at v1.4 after v1.3 downgraded it in error; see §1a* | §3 row (matrix **v2.16**) — `TC-WARRANTY-001-01..06` all PASS, last case executed 2026-09-01 (surfaced and fixed a real Settings admin-gating defect first). The matrix's own **AC Group(s)** and **TC ID(s)** columns assign `TC-WARRANTY-001-07` to `RAISE-FR-EXEC-001`'s NBV scope, and its cell concludes *"Overall row status: **PASS**"*. | Nothing outstanding for this requirement. `TC-WARRANTY-001-07` shares the P-018 Settings screen but tests `RAISE-FR-EXEC-001`'s NBV section — **executed and passing 2026-09-24**, counted there, not here. *(Until v1.8 this cell said it was BLOCKED on F-03 — stale since 2026-09-24.)* |
| `RAISE-FR-ORACLE-001` | Oracle FA Integration + NBV/Depreciation | **FAIL** | §3 row — `TC-ORACLE-001-01..04` all FAIL, executed 2026-08-29; `/reconciliation` renders a generic placeholder stub, not the specified Financial View | Business explicitly deferred building even a scoped placeholder-vs-real screen (`OPEN-FINDINGS.md` F-31, 2026-09-01) until the Oracle FA integration mechanism itself is resolved (F-04, PRD §16 Q6–Q10). No further engineering action is expected until that decision lands. |
| `RAISE-FR-ALERT-001` | Alerts | **PASS** — *upgraded from `PASS (partial)` at v1.1* | §3 row (matrix v2.6) — **all seventeen `TC-ALERT-001-01..17` executed and passing, across both surfaces**: the Alerts screen (P-012, `-01..-11`) and the header bell in global chrome (`-12..-17`, executed 2026-09-07). The five trigger conditions and their fixed severities were confirmed by PRD §16 Resolved Question 44 (F-05 → R-23), the access gate by Resolved Question 45 (F-08 partial → R-25), and the bell's scope by Resolved Question 49 (Gap 17). | Nothing outstanding for this requirement's confirmed MVP scope. **PRD §16 Q22a** (should a user see only *their* alerts?) is raised but unspecified, has no criterion written for it, and is not specifiable today — no `User`→`Employee` link exists — so it is future scope, not an unmet criterion. |
| `RAISE-FR-AUDIT-001` | Immutable Audit Log | **BLOCKED (partial)** | §3 row — testable subset (`TC-AUDIT-001-01..03`) all PASS, executed 2026-08-26 | Field taxonomy (Design §15) and the audit-review role gate (PRD §16 Q22 / F-08) require a PRD/Design answer, not more testing. |
| `RAISE-FR-EXEC-001` | Executive Dashboard | **PASS (partial)** — *corrected DOWN from `PASS` at v1.1, see §1a* | §3 row (matrix **v2.19**) — the **ten**-tile grid re-executed 2026-09-24: `TC-EXEC-001-01`/`-02`/`-03a`/`-03b` and their `TC-DASH-*` twins PASS, including the NBV tile itself (**$9.6K of $30.1K across 15 assets**, recomputed independently from the fixtures before it was accepted). **`TC-EXEC-001-04` / `TC-DASH-04` are BLOCKED** — Resolved Question 51's unconfigured-Type rule, whose precondition no screen could create. | **Changed at v1.8: no decision is outstanding any more.** The useful-life values arrived 2026-09-23 (Resolved Question 54); the blocker on `-04` changed on 2026-10-07 from "test data unreachable" to **"reachable once the open-text Type field is built"** (Resolved Question 55). So Gap 21 now waits on the same build as `RAISE-FR-ASSET-001`'s Gap 29. *(Until v1.8 this cell said the missing piece was "the five default per-Asset-Category useful-life values" — stale twice over: re-keyed per Type on 2026-09-08 and supplied on 2026-09-23.)* |
| `RAISE-AI-SEARCH-001` | Natural Language Search | **FAIL** | §3 row — `TC-AI-SEARCH-001-01..03` and `TC-AI-STATES-01..05` (8 cases) all FAIL, executed 2026-08-29; two non-matching placeholder/keyword-filter surfaces exist, neither is a real Q&A engine | Business explicitly deferred building even a scoped canned-answer engine (`OPEN-FINDINGS.md` F-33, 2026-09-01) until a real AI backend integration lands. No further engineering action is expected until that decision lands. |
| `RAISE-FR-LIFE-001` | Asset Lifecycle Connectivity | **BLOCKED** | §3 row — `TC-LIFE-001-01/-02/-04` partial, `-03` (Disposal) confirmed out-of-scope Roadmap item, not a gap | The partial sub-items require PRD-level lifecycle-stage detail not yet defined. Disposal is correctly excluded, not a defect. |
| `RAISE-AI-DOC-001` | Document Intelligence — OCR / Extraction | **BLOCKED (full)** | §3 row — sole criterion NOT TESTABLE YET; numeric confidence-threshold value TBD | Awaits a business answer on the confidence-threshold value (F-07). |
| `RAISE-AI-DOC-002` | Document Intelligence — Metadata | **BLOCKED (full)** | §3 row — per-document-type field list / UI surfacing remain design-phase TBD | Awaits design-phase detail (F-07). |
| `RAISE-AI-DOC-003` | Document Intelligence — Classification | **BLOCKED (full)** | §3 row — taxonomy / confirmation-UI detail remain design-phase TBD | Awaits design-phase detail (F-07). |
| `RAISE-AI-DOC-004` | Document Intelligence — Duplicate Detection | **BLOCKED (full)** | §3 row — matching threshold/merge-vs-flag workflow explicitly asked of business 2026-08-21, left unanswered | Awaits a business answer that was already requested once and not received (F-07, PRD §16 Open Question 20a). |

### 3.1 Cross-Cutting Items (no single `RAISE-FR-*` ID)

| Item | Verdict | Evidence (Traceability Matrix §4) | What would move this forward |
|---|---|---|---|
| `RAISE-NFR-SEC-RBAC-001` (Security & RBAC) | **PASS** | §4 row — `TC-LOGIN-01..03` all PASS, `-01`/`-02` resolved 2026-09-01 (F-30, Mock auth fallback) | The production authentication mechanism and role/permission matrix *content* (PRD §16 Q21–Q22 / F-08) remain a genuinely open PRD question, separate from the UI-only MVP enforcement *location* already confirmed and tested here. |
| Dashboard / Navigation (P-002, same page as `RAISE-FR-EXEC-001`) | **PASS (partial)** | §4 row (matrix **v2.19**) — `TC-DASH-01`/`-02`/`-03a`/`-03b` PASS against the **ten**-tile grid, re-executed 2026-09-24; the nine-tile passes of 2026-09-07 were explicitly not carried forward. The old `TC-DASH-03` absence-check stays retired. | Same `-04` blocker as `RAISE-FR-EXEC-001` — same page, tracked once (Gap 21 → Gap 29). *(Until v1.8 this row described the nine-tile grid and an NBV blocker that no longer exists.)* |

### 3.2 Roadmap / Pilot Items — Correctly Out of Scope

Per Traceability Matrix §5, `RAISE-AI-RISK-001`, `RAISE-AI-LIFECYCLE-001`,
`RAISE-AI-RECOMMEND-001`, `RAISE-FR-LICENSE-001`, and five unlabeled
Roadmap items (real-time ERP integration, native mobile app, predictive
analytics, workflow automation, multi-channel alerts) carry **no MVP
compliance verdict** — they are confirmed Roadmap/Pilot scope, not MVP,
and correctly have zero test coverage by design. This is not a gap; it
would become one only if any were promoted to MVP without first
re-entering the deliverable chain at `RAISE-PRD.md`.

## 4. Compliance Summary

Of the **18** MVP-scoped requirements carrying a `RAISE-FR-*`/`RAISE-AI-*`
Traceability ID (Traceability Matrix **v2.19** §3) — **17 until v1.8**:

| Verdict | Count | Requirements |
|---|---|---|
| `PASS` | 7 | `RAISE-FR-ASSET-002`, `-003`, `RAISE-FR-OPS-001`, `-002`, `RAISE-FR-MAINT-001`, `RAISE-FR-WARRANTY-001`, `RAISE-FR-ALERT-001` |
| `PASS (partial)` | 2 | `RAISE-FR-EXEC-001`, **`RAISE-FR-ASSET-001`** *(downgraded at v1.8)* |
| `FAIL` | 2 | `RAISE-FR-ORACLE-001`, `RAISE-AI-SEARCH-001` |
| `BLOCKED (partial)` | 1 | `RAISE-FR-AUDIT-001` |
| `BLOCKED` | 1 | `RAISE-FR-LIFE-001` |
| `BLOCKED (full)` | 4 | `RAISE-AI-DOC-001..004` |
| `NOT_TESTED` | 1 | **`RAISE-FR-ASSET-004`** *(new MVP requirement at v1.8 — not built)* |

Plus 2 cross-cutting items with no dedicated ID: `RAISE-NFR-SEC-RBAC-001`
(`PASS`) and Dashboard/Navigation (`PASS (partial)`, same page as
`RAISE-FR-EXEC-001`).

**Reading this honestly: 7 of 18 (38.9%)** carry a full, unqualified `PASS` — **down
from 8 of 17 (47.1%).** The 8.2-point drop has two separate causes. **Neither is a
regression in the product**, and they must not be read as one:

| Cause | Effect on the headline |
|---|---|
| **The denominator grew.** `RAISE-FR-ASSET-004` (Employee Offboarding) became an MVP requirement by business decision on 2026-10-07. It is specified end to end and built nowhere. | 8/17 → 8/18: **−2.7 points** |
| **One verdict moved down.** `RAISE-FR-ASSET-001` gained four criteria. One of them catches **a defect that has shipped since the Create Asset form was built** — four Categories offered, Media Equipment missing — which the original six passing cases never exercised. Those six passes still stand. | 8/18 → 7/18: **−5.5 points** |

`PASS` or `PASS (partial)` combined: 9 of 17 (52.9%) → 9 of 18 (50.0%).

**Every §3 verdict re-checked against matrix v2.19 row by row at v1.8**, and three
evidence cells found stale independent of today's changes (EXEC-001, WARRANTY-001,
Dashboard/Navigation) — corrected above. The verdicts themselves matched; the cells
explaining them had not been maintained since v1.4.

*History, retained — the 8-of-17 figure and how v1.3/v1.4 reached it:*

**This figure has now been wrong in both directions inside three days, and the record
of that is worth more than the number.** v1.1 and v1.2 printed 8-of-17 while the
matrix's `RAISE-FR-WARRANTY-001` **label** read `PASS (partial)`. v1.3 read that label,
concluded this document had overstepped, and corrected down to 7-of-17. **v1.3 was
wrong** — it aligned to the label without first establishing which half of a
self-contradicting cell was the error.

**F-59 answered that, and the decisive evidence is a date.** The matrix cell has
contradicted itself since **v2.2 (2026-09-04)** — label `PASS (partial)`, body
*"Overall row status: **PASS** — no remaining PRD-content blocker and no remaining
unexecuted test case for this requirement"*. `TC-WARRANTY-001-07`, the dual-mapped case
usually blamed for the `(partial)`, **was not added until 2026-09-05**. The label
therefore never described the dual-mapping; it is a leftover from before Gap 12 and
Gap 13 closed on 2026-09-01. Matrix **v2.16** corrects the label; this row is restored.

**What v1.1 got right and why it still looked wrong:** its verdict was correct, but it
reached `PASS` by reasoning about which requirement `TC-WARRANTY-001-07` belongs to
rather than by catching the stale label — which is indistinguishable, from the outside,
from a compliance review upgrading its own input. **The rule from v1.3 stands: this
document does not overrule the matrix.** The fix was never to change the verdict here;
it was to fix the matrix.

**Consequence, stated because it must not be mistaken for the motive:** the count
returns to 8-of-17. F-59 was filed with an explicit warning against picking the reading
that improves that number, and the reading was picked on the v2.2-predates-`-07`
evidence, which is independent of it.

**Every verdict in this table now matches the Traceability Matrix row it cites** —
verified row by row against v2.15 this revision, rather than asserted. That claim was
made at v1.1 and v1.2 too, and was false for one row both times; it is stated here only
because it has now actually been checked.

## 5. Open Findings Driving Non-`PASS` Verdicts

Cross-referenced against [`OPEN-FINDINGS.md`](../project-management/OPEN-FINDINGS.md) as of this revision:

**Blocking (gates an MVP requirement, genuinely open):** ~~F-03~~ — **RESOLVED
2026-09-23** (DR-02 answered; PRD §16 Resolved Question 54 supplied the ten
per-Asset-Type values, closing Open Question 3a). **This removes the business
blocker without moving `RAISE-FR-EXEC-001`'s verdict**: what remains is execution,
tracked as Gap 21, not an unanswered question. F-04 (Oracle FA integration
mechanism), F-06 (NL Search citation format), F-07 (Document Intelligence
thresholds/fields), F-08 (Auth mechanism / role-permission matrix content —
**narrowed**, R-25: resolved for the Alerts screen only).

**Raised since v1.2, and none of them changes a §3 verdict:** **F-55** (the Create
Requisition page cannot submit in real-API mode — its default requester is a mock
fixture id; **decided 2026-10-07 as DR-03** — the requester is the logged-in user, effective only with the Roadmap real user store, so its blocker is now that dependency rather than a decision; it still drives no verdict).
**F-57** (a Software License vertical slice was requested as the next target;
`RAISE-FR-LICENSE-001` is business-confirmed **Roadmap, not MVP**, with acceptance
criteria undefined — asked as `DECISION-REQUESTS.md` DR-01, **answered 2026-10-07: not in the first release; F-57 resolved as confirmed unchanged**).
**F-58** (three source files cite a `SOFTWARE-LICENSE-MIGRATION.md` that does not
exist). **F-59** (this revision — the matrix's own `RAISE-FR-WARRANTY-001` row labels
the verdict `PASS (partial)` while its body text says the blocked case "is not counted
within this row's own `PASS`"; see §1a). F-53, F-54 and F-56 were raised and resolved
in the same period.

**Decided 2026-10-07, and now driving verdicts — build pending, not decision pending:** **F-60** (Create Asset offers six of the ten Asset Types in the register and four of the five Categories) — DR-05 answered *open text*; it drives `RAISE-FR-ASSET-001`'s downgrade through Gaps 29 and 30, and gates Gap 21. **F-61** (no employee-offboarding feature of any kind) — DR-06 answered; it became the new MVP requirement `RAISE-FR-ASSET-004`, `NOT_TESTED`, Gap 28. **All six decision requests are now answered.**

**Reclassified at v1.2 (2026-09-07), not resolved:** **F-09** (asset master field
list) and **F-35** (asset code scheme) were both filed as blocking. Neither gates any
verdict in §3 — F-09 appears **zero** times in the traceability matrix, and this
document's own `RAISE-FR-ASSET-001` row already says it *"does not block this row's
current PASS"*; F-35 appears in neither document and that requirement is a full `PASS`
on the current `AST-####` scheme. Both remain **open**, as scope questions rather than
blockers (`OPEN-FINDINGS.md` F-48 → R-33). **Nothing was downgraded in substance** —
only in how it is filed, which is what a reader triages from.

**Resolved since v1.0, and listed here because v1.0 named them as open:** F-02
(Check-in/Check-out workflow detail → R-19), F-05 (Alert trigger rules and severity
→ R-23), F-18 (bundle size / route-level code splitting → R-21), F-19 (raw Go error
strings in 5xx responses → R-22). Also resolved in the same period and never listed
here: F-14 (CI → R-20), F-41 (raw driver errors in 404 bodies → R-26), F-44
(non-deterministic local test runs → R-27), F-45 and F-46 (test-case and
specification wording defects → R-29, R-30).

**Explicitly deferred by business decision (not awaiting a decision —
a decision was already made not to build yet):** F-31 (Oracle FA
Financial View), F-33 (AI Assistant Q&A engine).

**Unresolved (scope question, not yet blocking a build):** F-10
(`RAISE-FR-ASSET-003` vs. `RAISE-FR-OPS-002` overlap).

**Known Limitations (by design, not a defect):** F-11 (single hardcoded
demo login, no real user store), F-12 (RBAC middleware wired to demo
routes only) — both confirmed Roadmap, not MVP gaps.

**Infrastructure / Process (outside PRD scope):** F-13 (hosting — **decided 2026-10-07: not yet**, DR-04,
R-43), F-14 (CI/CD — **resolved for source validation** (R-20); image build/push **not needed yet**, DR-04), F-15 (API
versioning), F-16 (DB migration tooling — **narrowed 2026-09-18**: a runner now tracks
applied versions and can migrate an existing volume; startup auto-run, rollback and CI
integration remain out of scope), F-17 (NFR backlog targets undefined).

**Minor / Tech Debt:** F-38 (the Employee audit trail is a mock-mode fixture shim with
no backend), F-40 (a flaky navigate-away test pattern — all known sites fixed), F-43
(request-parse 4xx bodies still echo Go decoder text, and one 401 reports a
token-signing failure — deliberately not swept with F-41).

None of these are new — this section exists so a reviewer reading only
this document, not the full `docs/project-management/` folder, still
sees the honest list rather than an implied "everything not in §3/§4 is
fine."

## 6. What This Review Does Not Cover

- **Non-functional requirements** (Performance, Availability,
  Scalability, Backup/Recovery, Encryption, API Security, Monitoring,
  Logging — PRD §10) have no defined target anywhere in the chain (F-17)
  and therefore cannot receive a compliance verdict, `PASS` or
  otherwise — inventing one would misrepresent an undefined target as a
  met one. See Traceability Matrix §4.2 for the standing "no invented
  value" acknowledgment at every layer.
- **Production readiness** (hosting, CI/CD, DB migration tooling — F-13,
  F-14, F-16) is out of PRD scope entirely and not assessed here.
- **Security audit** — this review confirms the *recorded* MVP RBAC
  enforcement level (UI-only/client-side) matches what was built and
  tested; it does not constitute a security review of that choice, which
  the PRD itself already flags as a known, accepted MVP-scope limitation
  (F-11/F-12).

## 7. Recommendation

**Matrix v2.19 records 30 gaps, 26 of them closed; four are open** — Gap 21 (the RQ51 cases), and the three opened at v2.19: Gap 28 (`RAISE-FR-ASSET-004`, built nowhere), Gap 29 (the open-text Type field) and Gap 30 (the Category list defect). *Derived, not quoted: the matrix states no single total — 27 gaps through v2.15 with Gap 21 the only open one, none added at v2.16–v2.18, three added at v2.19.* This review's verdicts are drawn from real, dated test execution and live-verification evidence, not assumption. *(Until v1.8 this paragraph said "Matrix v2.15 records 27 gaps" and that Gap 21 was "blocked on F-03" — both stale since 2026-09-23.)*

**v1.0 said "no action is required to finish this review." That was true of its
content and false in practice — and v1.1 exists because of it.** A compliance review
is a living artifact, like the Traceability Matrix it consumes, and this one was left
twelve matrix revisions behind until an audit of "what is actually still outstanding"
went looking. **The concrete lesson: re-verify this document in the same pass that
closes a gap or resolves a finding, not when someone happens to check.** Every
close-out that moves a verdict in the matrix should move it here too.

**The headline went down at v1.8, and what changed underneath it points the other way.** For the first time in this review's history, **the rows that moved are waiting on engineering, not on a decision.** All six decision requests are answered. `RAISE-FR-ASSET-001`, `RAISE-FR-ASSET-004` and `RAISE-FR-EXEC-001` — the two rows that moved and the one whose last blocker changed — are each waiting on a build that needs no further input: the open-text Type field and the Category correction (Gaps 29, 30, and through them Gap 21), and the held-asset badge (Gap 28). **Building those three is the one path in the project that would raise the headline.** Done in full, with every case passing, it would take the board to **10 of 18 (55.6%)** — stated as arithmetic, not a forecast.

The rest divides cleanly by what it waits on. **Still awaiting a business or design decision:** `RAISE-FR-AUDIT-001`, `RAISE-FR-LIFE-001` and `RAISE-AI-DOC-001..004` (F-07, F-08). **Deferred by an explicit business decision not to build yet:** `RAISE-FR-ORACLE-001` and `RAISE-AI-SEARCH-001` (F-31, F-33). This document still does not recommend an order among the decision-blocked items.

*History, retained: until v1.8 this section recommended F-03 as "materially cheaper than the rest — values, not a model," gating two rows. It was answered on 2026-09-23 and gated one row, not two, after v1.4 restored `RAISE-FR-WARRANTY-001`.*

---

## Document Status

**Version:** 1.8 (2026-10-07 — re-verified against Traceability Matrix **v2.19**; the first verdict movement since v1.4). *This line read 1.4 through v1.5, v1.6 and v1.7: each of those revisions prepended a header note and never updated this footer or the body.*
**Author:** Re-verified by Claude Code. **No new test execution was performed for this revision or for v1.3** — every verdict cites an execution already recorded in the matrix.
**Next Action:** unchanged — re-verify in the same pass that closes a gap or resolves a finding, and re-check **every** row, not only the ones the last pass touched. **v1.4 adds a third rule: when the input contradicts itself, investigate which half is stale *before* correcting, not after.**

**Change Log — v1.3 → v1.4 (2026-09-20, same day)**

1. **`RAISE-FR-WARRANTY-001` restored, `PASS (partial)` → `PASS`** — v1.3's downgrade was an error. F-59 established that the matrix cell has contradicted itself since **v2.2 (2026-09-04)**, while `TC-WARRANTY-001-07` — the case the `(partial)` was assumed to describe — was not added until **2026-09-05**. The label was the stale half.
2. **Headline restored, 7-of-17 (41%) → 8-of-17 (47%)**, with the full history of it moving in both directions recorded in §4 rather than quietly settled.
3. **Matrix v2.16** corrects the label at source; this document consolidates it rather than overruling it — which is what v1.1 should have done and v1.3 should have verified.
4. **F-59 marked RESOLVED** in `OPEN-FINDINGS.md` with answer **(b)** and the dating evidence.
5. **Nothing else changed.** v1.3's other corrections — §7's stale "no gap open" claim, F-03's per-Asset-Type re-key, the §5 refresh — all stand.

*(v1.3 header retained for history below.)*

**Version:** 1.3 (2026-09-20 — re-verified against Traceability Matrix **v2.15**)
**Author:** Re-verified by Claude Code, consolidating existing chain evidence — **no new test execution was performed for this revision**; every verdict cites an execution already recorded in the matrix.
**Next Action:** unchanged and now twice-demonstrated — **re-verify in the same pass that closes a gap or resolves a finding.** v1.3 also adds a second rule learned the hard way: **check every row against the matrix, including the rows the previous pass said were fine.** v1.1's error survived v1.2 because v1.2 only revisited the rows it had already been looking at.

**Change Log — v1.2 → v1.3 (2026-09-20)**

1. **`RAISE-FR-WARRANTY-001` corrected DOWN, `PASS` → `PASS (partial)`** — the matrix has said `PASS (partial)` since **v2.2**, verified by reading the row out of all fourteen committed matrix revisions. Not drift; an error introduced at v1.1 and carried by v1.2.
2. **§4 headline corrected, 8-of-17 (47%) → 7-of-17 (41%)**, and the claim that no verdict had been inflated replaced with one that has actually been checked.
3. **§7 gap claim corrected** — "Gaps 1—20 all resolved, no gap open at all" was true of v2.6 and false from v2.7; **Gap 21 is open**.
4. **F-03 re-keyed per Asset Type** (PRD §16 RQ52, 2026-09-08) — "five numbers per Category" is no longer accurate, and F-03 now gates **two** §3 rows, not one.
5. **§5 refreshed** — F-55, F-57, F-58 and F-59 added; F-14 and F-16 annotated as narrowed rather than flatly open.
6. **F-59 raised** rather than settled: the matrix's Warranty row labels the verdict `PASS (partial)` while its body says the blocked case is "not counted within this row's own `PASS`". This document does not resolve that ambiguity on the matrix's behalf.

*(v1.2 header retained for history below.)*

**Version:** 1.2 (2026-09-07 — §5/§7 corrected: F-09 and F-35 reclassified as scope questions, not blockers)

**Change Log — v1.1 → v1.2 (2026-09-07, same day)**

1. **§5** — F-09 removed from the Blocking list and a paragraph added recording that F-09 and F-35 were both filed as blocking while gating no verdict in §3. Neither is resolved; both are reclassified. F-09 appears **zero** times in the traceability matrix, and this document's own `RAISE-FR-ASSET-001` row already said it does not block that row's PASS — an internal contradiction this document had been carrying.
2. **§7** — F-09 dropped from the "ordering the rest" list, which had implied it competed with F-04/F-06/F-07/F-08 for scheduling.
3. **Why this revision exists at all:** v1.1 added the rule *"re-verify in the same pass that closes a gap or resolves a finding, not when someone happens to check."* An audit changed how F-09 and F-35 are filed in `OPEN-FINDINGS.md` (F-48 → R-33) on the same day — so this document was re-verified in that same pass rather than left to drift again. **The rule's first exercise.**

**Version:** 1.1 (2026-09-07 — re-verified against `RAISE-TRACEABILITY-MATRIX.md` **v2.6**)
**Author:** Re-verified by Claude Code, consolidating existing chain evidence — no new test execution was performed for this revision; every verdict cites an execution already recorded in the matrix and `RAISE-TEST-CASES.md` v0.26
**Next Action:** **Re-verify in the same pass that closes a gap or resolves a finding, not when someone happens to check.** v1.0 said no action was required to finish this review; it then sat twelve matrix revisions behind, with one verdict overstating compliance, until an audit went looking. Any close-out that moves a verdict in the matrix must move it here too.

**Change Log — v1.0 → v1.1 (2026-09-07)**

1. **Header + §1a Revision Note added** — records that v1.0 consumed matrix v1.4 while the matrix had reached v2.6, and that two verdicts had gone stale in opposite directions.
2. **`RAISE-FR-EXEC-001` corrected DOWN, `PASS` → `PASS (partial)`** — the more serious of the two errors. v1.0 excused the NBV gap as "a separate, still-open question"; PRD §16 Resolved Questions 46—48 pulled NBV **inside** the requirement's confirmed scope, where `TC-EXEC-001-03b`/`TC-DASH-03b` now sit `BLOCKED`.
3. **`RAISE-FR-ALERT-001` upgraded, `PASS (partial)` → full `PASS`** — all seventeen `TC-ALERT-001-01..17` executed across both surfaces (P-012 and the header bell). PRD §16 Q22a weighed explicitly and recorded as future scope, not an unmet criterion.
4. **`RAISE-FR-WARRANTY-001` and Dashboard/Navigation rows annotated** — `TC-WARRANTY-001-07` belongs to `RAISE-FR-EXEC-001`'s NBV scope and does not qualify the Warranty row; the retired `TC-DASH-03` absence-check is recorded as superseded, not invalidated.
5. **§4 rewritten** to state that the headline 8-of-17 figure is unchanged **while its membership swapped** — a stable number concealing two opposite movements is the exact reason this document's currency matters.
6. **§5 corrected** — F-02, F-05, F-18 and F-19 were listed as open but had been resolved (R-19, R-23, R-21, R-22); F-03 and F-08 are recorded as narrowed rather than open-as-before; F-14, F-41, F-44, F-45 and F-46 added as resolved; the Minor/Tech Debt list replaced with what is actually outstanding (F-38, F-40, F-43).
7. **§7 rewritten** — "Gaps 1—13 resolved" corrected to **Gaps 1—20 resolved, none open**, and F-03 named as the only remaining finding whose resolution would move a §3 verdict to a full `PASS`, without recommending a business priority for the rest.

*(v1.0 header retained for history: Version 1.0 (2026-09-01 — first draft, drawn from `RAISE-TRACEABILITY-MATRIX.md` v1.4))*
**Author:** Drafted by Claude Code per user request, consolidating existing chain evidence — no new test execution was performed to produce this document.
**Next Action:** Re-verify/re-run after the next PR that touches a `RAISE-FR-*`/`RAISE-AI-*` requirement's implementation or resolves an entry in `OPEN-FINDINGS.md`.
