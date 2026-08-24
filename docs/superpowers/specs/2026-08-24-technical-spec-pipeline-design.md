# Technical Spec Pipeline — Design Spec

## Purpose

RAISE's deliverable chain currently covers Requirements → Design → Prototype → Acceptance
Criteria → Test Plan → Test Cases → Traceability Matrix (7 stages, each with a dedicated
agent+skill under `.claude/agents/` / `.claude/skills/`). It has no stage for **Technical
Spec** — Architecture, API/DB Spec, Detailed Design, NFR — the W4D1 course content and the
final gap `CLAUDE.md` explicitly calls out as "ยังไม่มี agent/skill สำหรับช่วง Development."

This spec adds four new stages to close that gap, following the exact pattern already
established by `design-writer`/`sync-design` and its five siblings — same tool set, same
"check upstream doc → find gap → fill only what's justified → flag anything unresolvable"
loop, same escape hatch for out-of-scope findings.

## Non-goals

- Not resolving the Company Foundation unresolved decisions themselves (token transport,
  response envelope, role model — `COMPANY-FOUNDATION-BASELINE.md` §6). Those are template-owner
  decisions, not something this pipeline can make on their behalf.
- Not writing any code in `frontend/`. This is documentation tooling only.
- Not introducing a new requirement-ID namespace. Every Technical Spec doc traces back to
  existing `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` IDs — no `RAISE-ARCH-*`/`RAISE-API-*` IDs.

## 1. Folder renumbering

The folder number is the chain's execution order per `CLAUDE.md`. Since Technical Spec
depends only on PRD + Design (not on Prototype/AC/Test), it is inserted right after Design,
and everything downstream shifts:

| Old path | New path |
|---|---|
| `docs/03-prototype/` | `docs/07-prototype/` |
| `docs/04-acceptance-criteria/` | `docs/08-acceptance-criteria/` |
| `docs/05-test-plan/` | `docs/09-test-plan/` |
| `docs/06-test-cases/` | `docs/10-test-cases/` |
| `docs/07-traceability-matrix/` | `docs/11-traceability-matrix/` |

New folders:

| Folder | File | Upstream source(s) |
|---|---|---|
| `docs/03-architecture/` | `RAISE-ARCHITECTURE.md` | `RAISE-PRD.md` + `RAISE-DESIGN.md` + `COMPANY-FOUNDATION-BASELINE.md` (confirmed tech stack: React + Go/Fiber) |
| `docs/04-api-db-spec/` | `RAISE-API-DB-SPEC.md` | `RAISE-ARCHITECTURE.md` |
| `docs/05-detailed-design/` | `RAISE-DETAILED-DESIGN.md` | `RAISE-API-DB-SPEC.md` |
| `docs/06-nfr/` | `RAISE-NFR.md` | `RAISE-PRD.md` §10 (NFR backlog) + `RAISE-DETAILED-DESIGN.md` |

This is a **move + relink** operation on existing files — `git mv` each folder, then fix every
relative markdown link that pointed at the old path (agents, skills, `CLAUDE.md`, and the
docs themselves cross-reference each other by relative path).

## 2. New agents

Four new agents under `.claude/agents/`, mirroring `design-writer.md`'s structure exactly
(frontmatter `tools: Read, Write, Edit, Glob, Grep, AskUserQuestion`, `model: sonnet`):

- **`architecture-writer`** — owns `RAISE-ARCHITECTURE.md`. Reads `RAISE-PRD.md` +
  `RAISE-DESIGN.md` (logical architecture — no tech stack) + `COMPANY-FOUNDATION-BASELINE.md`
  (the tech stack itself: React/Vite frontend, Go/Fiber backend, already audited). Produces:
  high-level architecture diagram (Mermaid), tier/deployment topology, component-to-requirement
  traceability table, data flow. Unlike `design-writer`, this agent is **allowed** to name the
  concrete stack, because `COMPANY-FOUNDATION-BASELINE.md` already settled it — but every
  decision blocked by that document's §6 unresolved items must be marked `**BLOCKED**` with a
  link back to the specific numbered item, never guessed.

- **`api-db-spec-writer`** — owns `RAISE-API-DB-SPEC.md`. Reads `RAISE-ARCHITECTURE.md`.
  Produces: conceptual/logical/physical DB spec (entities, relationships — no DDL unless a
  requirement demands a specific constraint), REST endpoint inventory per requirement, request/
  response shapes. Response envelope shape and auth-header-vs-cookie transport are both
  `**BLOCKED**` on Company Foundation decisions #1/#2 until resolved — the agent documents the
  endpoint list and data model regardless, since those don't depend on the blocked decisions.

- **`detailed-design-writer`** — owns `RAISE-DETAILED-DESIGN.md`. Reads `RAISE-API-DB-SPEC.md`.
  Produces: business logic / pseudo-code for each P0 requirement's core flow, exception/error
  handling per the course's pattern (e.g., race condition → 409, upstream failure → 503),
  security notes per endpoint.

- **`nfr-writer`** — owns `RAISE-NFR.md`. Reads `RAISE-PRD.md` §10 (existing NFR backlog,
  currently all TBD per the `RAISE-DESIGN.md` §16A / `RAISE-PROTOTYPE.md` §25A / AC §19.9 /
  Test Plan §3.3 / Test Cases §18.5 chain of backlog acknowledgments already in place) and
  `RAISE-DETAILED-DESIGN.md`. Produces: the 6 NFR categories (Performance, Scalability,
  Availability, Security, Usability, Maintainability), each entry either a **concrete number**
  (carrying forward the course's "no adjectives" rule — "search 1M records in 3s," never "fast")
  sourced from an actual PRD value, or explicitly `TBD` with a pointer to the relevant PRD Open
  Question. This agent must never invent a number the PRD didn't provide.

Each agent's system prompt keeps the same guardrails as `design-writer`: never edit its
upstream doc, never invent a requirement, close with `## NEEDS_PRD_CONFIRMATION` only if a
genuinely uncovered capability surfaces (not for TBD/BLOCKED items, which are expected and
correctly marked, not gaps).

## 3. New skills

Four new skills under `.claude/skills/`, mirroring `sync-design/SKILL.md`'s orchestration
(dispatch to the matching writer agent via the Agent/Skill tool, wait, detect
`NEEDS_PRD_CONFIRMATION`, spot-check the output, summarize):

- `sync-architecture` → `architecture-writer`
- `sync-api-db-spec` → `api-db-spec-writer`
- `sync-detailed-design` → `detailed-design-writer`
- `sync-nfr` → `nfr-writer`

Plus one new orchestrator skill, **`run-technical-phase`**, mirroring `run-full-chain`'s
structure but scoped to just these 4 stages in order (architecture → api-db-spec →
detailed-design → nfr), with the same "stop and ask if `NEEDS_PRD_CONFIRMATION` appears,
never auto-chain to `update-prd`" rule.

## 4. Chain-wide updates

- **`run-full-chain`** grows from 7 to 11 steps, in execution order: `sync-design` →
  `sync-architecture` → `sync-api-db-spec` → `sync-detailed-design` → `sync-nfr` →
  `sync-prototype` → `sync-acceptance-criteria` → `sync-test-plan` → `sync-test-cases` →
  `sync-traceability-matrix`. (Design still gates everything below it, same as today; Technical
  Spec and Prototype are independent branches off Design per the course's own dependency
  diagram, but this project's convention is one linear chain, so Technical Spec runs first
  since nothing downstream of it depends on Prototype.)

- **`traceability-matrix-writer`** gains `RAISE-ARCHITECTURE.md`, `RAISE-API-DB-SPEC.md`,
  `RAISE-DETAILED-DESIGN.md`, and `RAISE-NFR.md` as additional read-only inputs, and its output
  table gains columns/rows connecting requirement IDs to the relevant Technical Spec section,
  so a requirement's technical coverage (not just test coverage) is visible in the master
  matrix.

- **`CLAUDE.md`** updates:
  - §3 (`โครงสร้างพื้นที่เอกสาร`) folder table updated to the new 11-stage layout.
  - §4 (`Deliverable Chain`) diagram updated to show the 4 new stages between Design and
    Prototype.
  - §5 (`.claude/agents` and `.claude/skills`) updated from "7 agents / 7 skills + run-full-chain"
    to "11 agents / 11 skills + run-full-chain + run-technical-phase," and the "ยังไม่มี
    agent/skill สำหรับช่วง Development" line is corrected — Technical Spec is no longer
    undocumented; only actual coding (post-Traceability-Matrix) remains without a pipeline.

## 5. Content rules (apply to all 4 new agents)

- No new requirement-ID namespace — cite existing `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` IDs
  only.
- A Company Foundation unresolved decision (`COMPANY-FOUNDATION-BASELINE.md` §6, items 1-10)
  that blocks a section must be marked `**BLOCKED**` with a link to the specific item — never
  guessed or silently resolved.
- NFR values must be concrete numbers sourced from the PRD, or explicitly `TBD` with a link to
  the PRD Open Question — never a vague adjective.
- Mermaid diagrams in fenced ` ```mermaid ` blocks; cross-doc references use plain markdown
  relative links (`[text](../path/to/file.md)`), never Obsidian wikilinks — consistent with
  every existing doc in this vault.
- `## NEEDS_PRD_CONFIRMATION` is reserved for a genuinely uncovered capability, never used for
  expected TBD/BLOCKED items.

## Open question carried forward, not resolved here

Whether the 4 new Technical Spec agents should also be permitted to write `**BLOCKED**`
findings back into `COMPANY-FOUNDATION-BASELINE.md` itself (e.g., "Architecture needed decision
#1 resolved, escalating") is left for a future pass — out of scope for this spec, since that
document belongs to whoever owns the Company Foundation, not to the RAISE deliverable chain.
