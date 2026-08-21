# CLAUDE.md

ไฟล์นี้ให้คำแนะนำแก่ Claude Code (claude.ai/code) เมื่อทำงานกับโค้ดในโปรเจกต์นี้

## สถานะของโปรเจกต์

**ปรับปรุงล่าสุด 2026-08-21 — ส่วนนี้เคยระบุว่า "ยังไม่มีซอร์สโค้ด" ซึ่งไม่จริงอีกต่อไป**
ตอนนี้ root ของโปรเจกต์มี source tree จริงอยู่หลายส่วนแล้ว (ดูรายละเอียดด้านล่าง) แต่งาน
requirements/design/testing ใน `docs/01-requirements/` ถึง `docs/07-traceability-matrix/`
(ครบ 7 ขั้นตอนของ deliverable chain ดู §3) ยังคงอยู่ในระดับ **draft** เหมือนเดิม — แต่ละไฟล์ยังอยู่ใน
สถานะ "Draft for Review" ของขั้นตอนตัวเอง ไม่ใช่เอกสารอนุมัติสุดท้าย ให้ตรวจ "Document Status"
ท้ายไฟล์แต่ละฉบับก่อนอ้างอิงหรือแก้ไข อย่าเชื่อคำอธิบายสถานะที่เขียนไว้ในเอกสารฉบับเก่ากว่า

**Source tree ที่มีอยู่จริงตอนนี้ (root ของโปรเจกต์ ไม่ใช่ใต้ `docs/`):**

| โฟลเดอร์ | คืออะไร | สถานะ |
|---|---|---|
| `esaps_ai_template/` | แอป ESAPS เต็มรูปแบบ (Vite + Express `server.ts` + Gemini AI + Supabase) — **Business/UI reference เท่านั้น ไม่ใช่ requirement source** | อ่านได้ ห้ามแก้ |
| `src/` (root) | ซ้ำกับ `esaps_ai_template/src/` เป๊ะ (ไฟล์ `pages/`, `data/` เหมือนกันทุกไฟล์) — สถานะ reference เดียวกัน | อ่านได้ ห้ามแก้ |
| `react-template-main/` | Company React template (ผ่านการ audit แล้ว ดู `docs/template-analysis/`) | Frontend foundation reference |
| `go-template-main/` | Company Go template (ผ่านการ audit แล้ว ดู `docs/go-template-analysis/`) | Backend foundation reference |
| `frontend/` (`raise-frontend` ใน `package.json`) | **Build target จริงของ RAISE** — ใช้ company-template conventions แล้ว, `node_modules/` ติดตั้งแล้ว, แต่ `src/` ยังว่าง (มีแค่ `dist/` build artifact) | อยู่ระหว่างพัฒนา — ยังไม่มี source จริงข้างใน |

**ยังไม่มี `.git`** — โปรเจกต์นี้ยังไม่ใช่ git repository เลย (ไม่มี `.claude`/`docs`/source ใดๆ
ถูก track) หากมีการเริ่ม initialize git ควรพิจารณา `.gitignore` สำหรับ `node_modules/`, `dist/`
ก่อนเสมอ

**อย่าสมมติ** ว่า `frontend/` มีสถาปัตยกรรมโค้ดจริงแล้วจนกว่าจะปรากฏจริง (ตอนนี้มีแค่ scaffold
เปล่า) และ**ห้ามอ่าน `esaps_ai_template/`/`src/` เป็น requirement** — ทั้งสองเป็น business/UI
reference เท่านั้น ตามกติกาเดียวกับ VERSCAN (ดูหัวข้อถัดไป) รายละเอียดการตัดสินใจว่าแต่ละหน้า/
โฟลเดอร์ควร KEEP/EXTEND/REFACTOR/REPLACE/DEFER/DO NOT USE อยู่ใน
[`docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md`](docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md)
(อ้างอิง `docs/company-foundation-baseline/COMPANY-FOUNDATION-BASELINE.md` สำหรับความพร้อมของ
template สองอันด้วย) — **อ่านสองไฟล์นี้ก่อนเสมอ ถ้าจะเริ่มเขียนโค้ดจริงใน `frontend/`**

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
```

เมื่อสร้างเอกสารใหม่ในขั้นตอนใด ให้ใส่ในโฟลเดอร์ที่ตรงกับหมายเลขขั้นตอนนั้น (ตัวเลขนำหน้าโฟลเดอร์คือลำดับ
ของ deliverable chain ไม่ใช่ลำดับ SDLC ทั่วไป) และตั้งชื่อไฟล์ตามรูปแบบ `RAISE-<STAGE>.md` ที่ใช้อยู่แล้ว
เพื่อความสอดคล้อง — **อย่าสร้างไฟล์ย่อยหลายไฟล์ต่อขั้นตอน** (เช่น แยก per-feature) เว้นแต่ผู้ใช้ร้องขอ
ให้เปลี่ยนรูปแบบนี้อย่างชัดเจน

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
Development (ยังไม่เริ่ม)
        │
        ▼
RAISE-COMPLIANCE-REVIEW.md (ยังไม่มีไฟล์)
        │
        └──► Finding / Gap ──► Fix / Re-test
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

**ยังไม่มี agent/skill สำหรับช่วง Development** (`RAISE-COMPLIANCE-REVIEW.md` และหลังจากนั้น)
แม้ตอนนี้จะมี source tree จริงแล้ว (`frontend/`, `esaps_ai_template/`, `src/`, template ทั้งสอง —
ดูหัวข้อ "สถานะของโปรเจกต์" ด้านบน) เพราะยังไม่มีการตัดสินใจเรื่อง tech stack ที่แน่ชัดสำหรับ RAISE
เอง (company template สองอันผ่าน audit แล้วแต่ยังมี unresolved decision หลายจุด ดู
`COMPANY-FOUNDATION-BASELINE.md` §6) และ `frontend/` เองยังไม่มี source code จริงข้างใน — ควร
ออกแบบ pipeline ของช่วง Development แยกต่างหาก เมื่อเริ่มเขียนโค้ดจริงใน `frontend/` แล้วเท่านั้น
อย่าเดาโครงสร้างล่วงหน้า

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
- `frontend/` มี package manifest แล้ว (`package.json` ชื่อ `raise-frontend`, ใช้ Vite/TypeScript/
  Tailwind v4/ESLint/Prettier/Vitest ตาม company React template) แต่ยังไม่มี source code จริงข้างใน
  (`src/` ว่าง) และยังไม่มี CI config ใดๆ — เมื่อเริ่มเขียนโค้ดจริงแล้ว ควรกลับมาอัปเดตไฟล์นี้ให้มี
  คำสั่ง build/lint/test จริง (อ้างจาก `frontend/package.json` scripts) และสถาปัตยกรรมโค้ดจริง
  รวมถึงพิจารณาว่าจะยังใช้โครงสร้าง 1-ไฟล์-ต่อ-ขั้นตอนนี้ต่อไปสำหรับ `docs/` หรือจะย้ายไปใช้รูปแบบที่
  `.claude/agents`/`.claude/skills` คาดหวังแทน
- ก่อนเขียนโค้ดจริงใน `frontend/` ให้อ่าน
  [`docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md`](docs/project-foundation-baseline/ESAPS-UI-FOUNDATION-BASELINE.md)
  ก่อนเสมอ เพื่อดูว่าหน้า/ฟีเจอร์ไหนใน `esaps_ai_template/`/`src/` (ESAPS reference) ควร
  KEEP/EXTEND/REFACTOR/REPLACE/DEFER/DO NOT USE ตาม requirement ที่ยืนยันแล้วใน `RAISE-PRD.md`
  — ห้ามพอร์ตหน้าจาก ESAPS reference ตรงๆ โดยไม่ตรวจสอบกับเอกสารนี้ก่อน
