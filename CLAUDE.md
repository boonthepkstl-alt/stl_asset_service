# CLAUDE.md

ไฟล์นี้ให้คำแนะนำแก่ Claude Code (claude.ai/code) เมื่อทำงานกับโค้ดในโปรเจกต์นี้

## สถานะของโปรเจกต์

**ปรับปรุงล่าสุด 2026-08-24 — เขียนโค้ดจริงเริ่มไปแล้วหลายโดเมน ไม่ใช่แค่ scaffold อีกต่อไป**
ก่อนหน้านี้ส่วนนี้เคยระบุว่า `frontend/src/` ว่างเปล่าและยังไม่มีการตัดสินใจเรื่อง development
pipeline — ข้อมูลนั้นล้าสมัยแล้ว (ล้าสมัยตั้งแต่ก่อน 2026-08-24 ด้วยซ้ำ ไม่ใช่แค่วันนี้) **แหล่งความจริง
ที่ทันสมัยที่สุดสำหรับ "ตอนนี้สร้างอะไรไปแล้วบ้าง" คือ
[`docs/project-management/CURRENT-STATUS.md`](docs/project-management/CURRENT-STATUS.md)** —
เช็คไฟล์นั้นก่อนเสมอ อย่าเชื่อคำอธิบายสถานะในหัวข้อนี้ถ้าดูเก่ากว่าที่นั่น เอกสาร requirements/
design/testing ใน `docs/01-requirements/` ถึง `docs/07-traceability-matrix/` (7 ขั้นตอนแรกของ
deliverable chain ดู §3) ยังอยู่ในระดับ **draft** อย่างเป็นทางการ (แต่ละไฟล์มี "Document Status"
ท้ายไฟล์ระบุไว้ ให้เช็คก่อนอ้างอิง) แม้เนื้อหาจะสอดคล้องและถูก sync กันครบแล้วก็ตาม

**Source tree ที่มีอยู่จริงตอนนี้ (root ของโปรเจกต์ ไม่ใช่ใต้ `docs/`):**

| โฟลเดอร์ | คืออะไร | สถานะ |
|---|---|---|
| `esaps_ai_template/` | แอป ESAPS เต็มรูปแบบ (Vite + Express `server.ts` + Gemini AI + Supabase) — **Business/UI reference เท่านั้น ไม่ใช่ requirement source** | อ่านได้ ห้ามแก้ |
| `src/` (root) | ซ้ำกับ `esaps_ai_template/src/` เป๊ะ (ไฟล์ `pages/`, `data/` เหมือนกันทุกไฟล์) — สถานะ reference เดียวกัน | อ่านได้ ห้ามแก้ |
| `react-template-main/` | Company React template (ผ่านการ audit แล้ว ดู `docs/template-analysis/`) | Frontend foundation reference |
| `go-template-main/` | Company Go template (ผ่านการ audit แล้ว ดู `docs/go-template-analysis/`) — **ตอนนี้มีโดเมนจริงของ RAISE ต่อยอดเข้าไปแล้ว**: Asset Registry/Assign/Check-in, Employee, Maintenance/Ticket (controller/model/repository/service/SQL migration ครบ), Auth (demo-only — user เดียว hardcode ไว้ ยังไม่มี user store จริง) | **Build จริง** — ไม่ใช่แค่ template เปล่าอีกต่อไป |
| `frontend/` (`raise-frontend` ใน `package.json`) | **Build target จริงของ RAISE** — `src/` มีโค้ดจริงแล้ว: `App.tsx`, `components/ui/` (Button, Card, Modal, Table, Tabs ฯลฯ), `contexts/AuthContext.tsx`, `config/`, `data/fixtures/`, และไฟล์ทดสอบ (`*.test.tsx`) หลายชุด (rbac, roadmap-gating, cross-domain ฯลฯ) | **Build จริง** — ต่อ backend จริงบางส่วนแล้ว (ดูตาราง Domain Build Status ใน `CURRENT-STATUS.md` §3) |

**มี `.git` แล้ว** — เป็น git repository จริง มี remote บน GitHub
(`boonthepkstl-alt/stl_asset_service`) ใช้ workflow แบบ 1 branch ต่อ 1 การเปลี่ยนแปลง แล้ว merge
ผ่าน PR (ดู [`DEVELOPMENT-LOG.md`](docs/project-management/DEVELOPMENT-LOG.md) สำหรับ PR-by-PR
log) **⚠ อาจมีหลาย Claude Code session ทำงานใน working directory เดียวกันนี้พร้อมกัน** (สลับ
branch/commit แบบไม่ประสานงานกัน) — ก่อนสั่ง `git checkout`/`reset`/`clean` หรือคำสั่งทำลายอื่นใด
ให้รัน `git status`/`git reflog` ตรวจก่อนเสมอว่ามี uncommitted change ของ session อื่นอยู่หรือไม่
ถ้ามีให้แยกไปทำงานใน `git worktree` แทนการสลับ branch ตรงๆ ในไดเรกทอรีเดียวกัน

**ห้ามอ่าน `esaps_ai_template/`/`src/` เป็น requirement** — ทั้งสองเป็น business/UI reference
เท่านั้น ตามกติกาเดียวกับ VERSCAN (ดูหัวข้อถัดไป) รายละเอียดการตัดสินใจว่าแต่ละหน้า/โฟลเดอร์ควร
KEEP/EXTEND/REFACTOR/REPLACE/DEFER/DO NOT USE อยู่ใน
[`docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md`](docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md)
(อ้างอิง `docs/company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md` สำหรับความพร้อมของ
template สองอันด้วย) — **อ่านสองไฟล์นี้ก่อนเสมอ ถ้าจะเขียนโค้ดใน `frontend/`/`go-template-main/`
เพิ่ม**

## ภาพรวมระบบที่กำลังวางแผน

**แหล่งอ้างอิงเดียว (source of truth)** ของภาพรวมระบบ ขอบเขต และบทบาทผู้ใช้ คือ
[`docs/01-requirements/RAISE-PRD.md`](docs/01-requirements/RAISE-PRD.md) — **ห้ามสมมติโดเมนหรือ
ฟีเจอร์ของระบบจากความจำหรือจากตัวอย่างโปรเจกต์อื่น** ให้เปิดอ่านไฟล์นี้ก่อนตอบคำถามเกี่ยวกับภาพรวมระบบเสมอ

ต้นทางที่แท้จริงของ PRD คือ **RAISE Hackathon Proposal** (ADT-RAISE Hackathon Pitch Day, 26 กรกฎาคม 2026)
**VERSCAN เป็นระบบอ้างอิง/เปรียบเทียบเท่านั้น (REFERENCE ONLY)** — ห้ามเพิ่มฟีเจอร์ของ VERSCAN เข้าสู่ขอบเขต
RAISE โดยอัตโนมัติ ทุกเอกสารในวอลต์นี้ต้องคงกติกานี้ต่อไป แม้จะแก้ไขหรือเพิ่มเนื้อหาใหม่

## โครงสร้างพื้นที่เอกสาร (`docs/`)

โปรเจกต์นี้ใช้ **1 ไฟล์รวมต่อ 1 ขั้นตอนของ deliverable chain** (ไม่ใช่หลายไฟล์ย่อยแบบ
`01-spec/*.md` + `backlog.md` + `feature-list.md`) โครงสร้างจริงตอนนี้คือ:

```
docs/
  01-requirements/
    RAISE-PRD.md                      Product Requirements — source of truth หลักของทั้งวอลต์
  02-design/
    RAISE-DESIGN.md                   Logical architecture / UX design — อ้างอิงกลับไปยัง RAISE-PRD.md
  03-prototype/
    RAISE-PROTOTYPE.md                Screen inventory + per-screen spec — อ้างอิง RAISE-PRD.md + RAISE-DESIGN.md
  04-acceptance-criteria/
    RAISE-ACCEPTANCE-CRITERIA.md      Given/When/Then ต่อ screen — อ้างอิง RAISE-PROTOTYPE.md
  05-test-plan/
    RAISE-TEST-PLAN.md                Test suite/level/entry-exit criteria — อ้างอิง RAISE-ACCEPTANCE-CRITERIA.md
  06-test-cases/
    RAISE-TEST-CASES.md               Test case แบบ step-by-step ต่อ suite — อ้างอิง RAISE-TEST-PLAN.md
  07-traceability-matrix/
    RAISE-TRACEABILITY-MATRIX.md      ตารางรวม PRD → Design → Prototype → AC → Suite → Test Case
  08-architecture/
    RAISE-HIGH-LEVEL-ARCHITECTURE.md  As-built — ไม่ใช่ pre-code spec ดู "ส่วนต่อขยาย" ด้านล่าง
  09-api-db-spec/
    RAISE-API-DB-SPEC.md              As-built — endpoint/schema ที่มีอยู่จริงใน go-template-main
  10-detailed-design/
    RAISE-DETAILED-DESIGN.md          As-built — business logic ที่มีอยู่จริง
  project-management/
    CURRENT-STATUS.md                 Snapshot ปัจจุบัน (overwrite ทับของเดิม ไม่ append) — ดูก่อนเสมอ
    DEVELOPMENT-LOG.md                PR-by-PR log แบบละเอียด
    PROJECT-TIMELINE.md               เล่าเรื่องระดับ phase
    PROJECT-CHECKPOINTS.md            Checkpoint tracker
    CHANGELOG.md                      สรุปแบบ stakeholder-facing
    OPEN-FINDINGS.md                  รวม gap/open question ทั้งหมดไว้จุดเดียว
```

**ส่วนต่อขยาย (`08-architecture/` ถึง `10-detailed-design/`) ไม่ใช่ส่วนหนึ่งของ 7-stage deliverable
chain เดิม** — ถูกเพิ่มเข้ามา (PR #15) เพื่อบันทึกสถาปัตยกรรม/API/DB/detailed-design ของสิ่งที่
**สร้างจริงไปแล้ว** ใน `go-template-main`/`frontend/` (ย้อนกลับจากซอร์สโค้ด ไม่ใช่ไปข้างหน้าจาก PRD)
จงใจ **ต่อท้าย** หมายเลข ไม่ renumber `07-traceability-matrix/` เดิม เพราะงาน dev เริ่มไปแล้วก่อนจะมี
เอกสารชุดนี้ — อย่าตีความว่าเอกสารกลุ่มนี้ต้อง sync ล่วงหน้ากับ PRD/Design แบบเดียวกับ 7 ขั้นตอนแรก
(มีเคยมีข้อเสนอสร้าง agent/skill pipeline แบบ pre-code สำหรับ Technical Spec — ถูกยกเลิกไปแล้วเพราะ
พบว่างานจริงทำไปก่อนสเปคนั้นจะถูกเขียนเสียอีก ดู
[`docs/superpowers/specs/2026-08-24-technical-spec-pipeline-design.md`](docs/superpowers/specs/2026-08-24-technical-spec-pipeline-design.md)
หัวข้อ SUPERSEDED)

เมื่อสร้างเอกสารใหม่ในขั้นตอนใดของ 7-stage chain เดิม ให้ใส่ในโฟลเดอร์ที่ตรงกับหมายเลขขั้นตอนนั้น
(ตัวเลขนำหน้าโฟลเดอร์คือลำดับของ deliverable chain ไม่ใช่ลำดับ SDLC ทั่วไป) และตั้งชื่อไฟล์ตามรูปแบบ
`RAISE-<STAGE>.md` ที่ใช้อยู่แล้วเพื่อความสอดคล้อง — **อย่าสร้างไฟล์ย่อยหลายไฟล์ต่อขั้นตอน** (เช่น
แยก per-feature) เว้นแต่ผู้ใช้ร้องขอให้เปลี่ยนรูปแบบนี้อย่างชัดเจน

การอ้างอิงข้ามเอกสารในวอลต์นี้ใช้ **markdown relative link ธรรมดา** `[ข้อความ](../path/to/file.md)`
ไม่ใช่ Obsidian wikilink — ไม่มีโฟลเดอร์ `.obsidian/` อยู่ในโปรเจกต์นี้ ให้คงรูปแบบ markdown link ต่อไป

## Deliverable Chain และรหัสอ้างอิง

```text
RAISE Hackathon Proposal
        │
        ▼
01. RAISE-PRD.md                 ← Product Requirements (source of truth)
        │
        ▼
02. RAISE-DESIGN.md              ← UX / Architecture
        │
        ▼
03. RAISE-PROTOTYPE.md           ← UI / User Flow
        │
        ▼
04. RAISE-ACCEPTANCE-CRITERIA.md ← Given/When/Then ต่อ screen
        │
        ▼
05. RAISE-TEST-PLAN.md           ← Test suite / level / entry-exit criteria
        │
        ▼
06. RAISE-TEST-CASES.md          ← Test case แบบ step-by-step
        │
        ▼
07. RAISE-TRACEABILITY-MATRIX.md ← ตารางรวมทั้งสาย (ใช้เตรียม Compliance Review)
        │
        ▼
Development ← เริ่มไปแล้วจริง ตั้งแต่ก่อนมี 08-10 ด้วยซ้ำ (ดู DEVELOPMENT-LOG.md PR #7 เป็นต้นไป)
        │      ไม่มี agent/skill pipeline คอยกำกับ — ทำตรงใน go-template-main/frontend/ ทีละ PR
        ▼
08-10. RAISE-HIGH-LEVEL-ARCHITECTURE.md / RAISE-API-DB-SPEC.md / RAISE-DETAILED-DESIGN.md
        ← บันทึก as-built ย้อนหลังจากโค้ดจริง (ไม่ใช่ pre-code spec, ไม่ renumber 07)
        │
        ▼
RAISE-COMPLIANCE-REVIEW.md (ยังไม่มีไฟล์ — ยังไม่มี agent/skill สำหรับขั้นนี้)
        │
        └──► Finding / Gap ──► Fix / Re-test (ดู OPEN-FINDINGS.md สำหรับรายการปัจจุบัน)
```

**รหัส Requirement ID ที่ใช้จริงในเอกสารชุดนี้:**
- `RAISE-FR-<DOMAIN>-<NNN>` — functional requirement (เช่น `RAISE-FR-ASSET-001`, `RAISE-FR-OPS-002`)
- `RAISE-AI-<DOMAIN>-<NNN>` — AI capability requirement (เช่น `RAISE-AI-SEARCH-001`, สถานะ Current/Pilot/Roadmap ต้องคงตามที่ระบุใน PRD §7 เสมอ ห้ามเลื่อนสถานะเองโดยไม่มีการอนุมัติ)
- `RAISE-NFR-<DOMAIN>-<NNN>` — non-functional requirement (ส่วนใหญ่ยังเป็น TBD ตาม PRD §10-§11)

**ไม่มีระบบ `FR-xx`/`NFR-xx` แบบสั้น และไม่มี `backlog.md`/`feature-list.md`/`user-journey.md`**
ในโปรเจกต์นี้ — ถ้าพบการอ้างอิงถึงไฟล์เหล่านี้ในเอกสารเก่าหรือใน `.claude/agents`/`.claude/skills`
(ดู §5 ด้านล่าง) ให้ถือว่าล้าสมัยเทียบกับโครงสร้างจริงใน `docs/`

**ทุกขั้นตอนต้องคงหลักการเดียวกัน:** ห้ามเขียนรายละเอียดที่ไม่มีอยู่ในเอกสารขั้นตอนก่อนหน้า
จุดใดที่ยังไม่มีคำตอบ (business rule, threshold, field, role) ให้ทำเครื่องหมาย **TBD** /
**NOT TESTABLE YET** / **BLOCKED** พร้อมอ้างอิงกลับไปยัง Open Question ที่เกี่ยวข้องเสมอ — ห้ามแก้ไข
ให้ดูเหมือนสมบูรณ์โดยไม่มีมูล

## `.claude/agents` และ `.claude/skills` — ตรงกับโครงสร้างจริงแล้ว

โปรเจกต์นี้มี custom agents ใน `.claude/agents/` (7 ตัว — 1 ตัวต่อ 1 ขั้นตอนของ deliverable
chain ใน §3: `prd-writer`, `design-writer`, `prototype-writer`, `acceptance-criteria-writer`,
`test-plan-writer`, `test-cases-writer`, `traceability-matrix-writer`) และ skills ใน
`.claude/skills/` (8 ตัว — 1 skill ต่อ 1 agent บวก `run-full-chain` ที่ไล่รันทั้งเชนในคำสั่งเดียว:
`/update-prd`, `/sync-design`, `/sync-prototype`, `/sync-acceptance-criteria`, `/sync-test-plan`,
`/sync-test-cases`, `/sync-traceability-matrix`, `/run-full-chain`)

ระบบนี้สร้างขึ้นมาแทนที่ชุด agents/skills เดิม (15 agents + 10 skills) ที่ถูกออกแบบไว้สำหรับ
โปรเจกต์อื่น ("tasks-mng") ซึ่งใช้โครงสร้างหลายไฟล์ย่อยต่อขั้นตอน (`backlog.md`,
`feature-list.md`, `user-journey.md`, `architecture.md`/`api-spec.md`/`db-spec.md`,
`FR-xx`/`NFR-xx`, Obsidian wikilink ฯลฯ) — ไม่ตรงกับโครงสร้าง RAISE เลย ชุดเดิมถูกลบทิ้งแล้ว
(ยกเว้นแนวคิดบางส่วนที่ยังเกี่ยวข้อง เช่น สัญญาณ "พบ requirement ใหม่ระหว่างทำงาน" ถูกปรับเป็น
`## NEEDS_PRD_CONFIRMATION` — **ต่างจากเดิมตรงที่ต้องถามผู้ใช้ยืนยันก่อนเขียน PRD ใหม่เสมอ ไม่
auto-chain ให้อัตโนมัติ** เพราะ RAISE ห้ามเดา/ขยายขอบเขต requirement เองโดยไม่มีการยืนยัน)

**ยังไม่มี agent/skill สำหรับช่วง Development** (`RAISE-COMPLIANCE-REVIEW.md` และหลังจากนั้น) —
**แต่ต่างจากที่เคยเข้าใจ ตอนนี้ Development ไม่ได้ "รอ" อีกต่อไป มันเริ่มไปแล้วจริงและไปไกลพอสมควร**
(หลายโดเมนใน `go-template-main`/`frontend/` — ดูหัวข้อ "สถานะของโปรเจกต์") โดยไม่มี agent/skill
pipeline คอยกำกับเลย เขียนโค้ดตรงเป็น PR ทีละใบ (ดู `DEVELOPMENT-LOG.md`) เอกสาร as-built
(`08-architecture/` ถึง `10-detailed-design/`) ก็ถูกเขียนขึ้นภายหลังเพื่อบันทึกสิ่งที่สร้างไปแล้ว ไม่ใช่
เอกสารนำทางล่วงหน้า

เคยมีข้อเสนอให้สร้าง agent/skill pipeline แบบ pre-code สำหรับ Technical Spec (Architecture/API-DB
Spec/Detailed Design/NFR ตามแนวทาง 7 stage เดิม) — แต่ถูกยกเลิก (SUPERSEDED) เพราะระหว่างเขียนสเปคพบว่า
งานจริงถูกสร้างไปก่อนแล้ว (PR #7–#15 มาก่อนสเปคนั้นถูกร่างด้วยซ้ำ) ทำให้ premise ของสเปค (ยังไม่มีโค้ด,
ต้องมี pipeline ก่อนเขียนโค้ด) ผิดไปจากความจริง ดู
[`docs/superpowers/specs/2026-08-24-technical-spec-pipeline-design.md`](docs/superpowers/specs/2026-08-24-technical-spec-pipeline-design.md)
ถ้าจะลองออกแบบ pipeline สำหรับช่วง Development ใหม่ (ไม่ว่าจะเป็น pre-code หรือแบบ sync-as-built
เข้ากับ `08-10` ที่มีอยู่) **ให้เช็ค `docs/project-management/CURRENT-STATUS.md` และ
`DEVELOPMENT-LOG.md` ก่อนเสมอ** เพื่อไม่ให้ตั้งสมมติฐานผิดซ้ำแบบเดียวกัน

## แนวทางการทำงานในโปรเจกต์นี้ตอนนี้

- ยึด [`RAISE-PRD.md`](docs/01-requirements/RAISE-PRD.md) เป็นแหล่งอ้างอิงหลักของทุก requirement —
  ใช้รหัส `RAISE-FR-*`/`RAISE-AI-*`/`RAISE-NFR-*` เมื่อพูดคุยหรือวางแผน และตรวจ §17 (Requirement
  Traceability Matrix) ของ PRD ก่อนเสมอเพื่อดูสถานะล่าสุด
- ก่อนแก้ไขเอกสารขั้นตอนใด ให้ไล่ตรวจ **ทั้งสาย** ว่าการเปลี่ยนแปลงกระทบเอกสารขั้นตอนถัดไปหรือไม่
  (เช่น แก้ PRD requirement → ต้องตรวจ Design → Prototype → Acceptance Criteria → Test Plan →
  Test Cases → Traceability Matrix ว่ายังสอดคล้องกันอยู่) — รูปแบบการทำงานที่ผ่านมาในโปรเจกต์นี้คือ
  แก้ไล่ทีละไฟล์ตามลำดับสาย ไม่ใช่แก้ไฟล์เดียวแบบแยกส่วน
- เมื่อพบช่องว่าง (gap) ระหว่างขั้นตอน เช่น requirement ที่ไม่มี test coverage หรือ open question
  ที่ยังไม่ถูกตอบ **ให้บันทึกไว้ชัดเจนในเอกสาร ไม่ใช่แก้ให้ดูสมบูรณ์เงียบๆ** (ดูตัวอย่างรูปแบบการบันทึก
  gap ใน `RAISE-TRACEABILITY-MATRIX.md` §6)
- `frontend/` มี source code จริงแล้ว (`App.tsx`, `components/ui/`, `contexts/AuthContext.tsx`,
  ไฟล์ทดสอบหลายชุด) ใช้ `npm run dev`/`build`/`lint`/`test` ตาม scripts ใน `frontend/package.json`
  (Vite + tsc + ESLint + Vitest) — ยังไม่มี CI config (`.github/workflows/`) ทั้งฝั่ง frontend และ
  `go-template-main` ถ้าจะเพิ่ม CI ให้ตรวจสอบว่ามีอยู่จริงก่อนเสมอ (`ls .github/workflows/`) อย่าสมมติ
- ก่อนแก้/เพิ่มโค้ดใน `frontend/`/`go-template-main/` โดยอ้างอิงหน้า/ฟีเจอร์จาก ESAPS reference ให้อ่าน
  [`docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md`](docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md)
  ก่อนเสมอ เพื่อดูว่าหน้า/ฟีเจอร์ไหนใน `esaps_ai_template/`/`src/` ควร
  KEEP/EXTEND/REFACTOR/REPLACE/DEFER/DO NOT USE ตาม requirement ที่ยืนยันแล้วใน `RAISE-PRD.md`
  — ห้ามพอร์ตหน้าจาก ESAPS reference ตรงๆ โดยไม่ตรวจสอบกับเอกสารนี้ก่อน
- **ก่อนเริ่มงานใดๆ ที่เกี่ยวกับ "ตอนนี้สร้างอะไรไปแล้ว/ยังไม่ได้สร้าง" ให้เช็ค
  [`docs/project-management/CURRENT-STATUS.md`](docs/project-management/CURRENT-STATUS.md) ก่อนเสมอ**
  — เป็นไฟล์เดียวที่ overwrite ทับให้ตรงกับปัจจุบันจริง (ไฟล์อื่นในโฟลเดอร์เดียวกันเป็น log สะสม/
  ประวัติ ไม่ใช่ snapshot) ไฟล์นี้เองก็อาจ stale ได้ถ้ามี PR ใหม่หลังจากนั้น ให้ดู "As of" ที่หัวไฟล์
  เทียบกับ `git log --oneline -5` ก่อนเชื่อ 100%
- **โปรเจกต์นี้อาจมีหลาย Claude Code session ทำงานพร้อมกันในเครื่องเดียวกัน** ก่อน commit/checkout/
  reset ให้ `git status` และ `git reflog` เช็คก่อนเสมอว่ามีงานของ session อื่นค้างอยู่หรือไม่ ถ้าต้อง
  ทำงานแยกจาก branch ปัจจุบันโดยไม่รบกวน session อื่น ให้ใช้ `git worktree add` แยกไดเรกทอรีแทนการ
  `git checkout` สลับ branch ตรงๆ ในไดเรกทอรีเดิม
