---
name: run-full-chain
description: >
  ตรวจสอบความสอดคล้องของเอกสารทั้งเชน RAISE ในคำสั่งเดียวตามลำดับ: RAISE-PRD.md →
  RAISE-DESIGN.md → RAISE-PROTOTYPE.md → RAISE-ACCEPTANCE-CRITERIA.md → RAISE-TEST-PLAN.md →
  RAISE-TEST-CASES.md → RAISE-TRACEABILITY-MATRIX.md ถ้าไม่สอดคล้องในชั้นใด จะแก้ไขให้ ใช้เมื่อ
  ผู้ใช้พิมพ์ /run-full-chain หรือขอให้ "ตรวจสอบทั้ง pipeline", "sync ทุกชั้นให้ตรงกัน", "เช็ค
  ตั้งแต่ PRD ยัน traceability matrix", "อัปเดตทั้งเชนจาก PRD ล่าสุด"
---

# Run Full Chain

Skill นี้เป็น orchestrator สำหรับตรวจสอบ+ปรับปรุงเอกสารทั้ง 7 ขั้นตอนของ RAISE deliverable chain
ในคำสั่งเดียว โดยรันตามลำดับ (sequential เสมอ ห้ามรันขนาน) เพราะแต่ละขั้นตอนต้องใช้เวอร์ชันล่าสุด
ของขั้นตอนก่อนหน้าเป็นแหล่งความจริง

## เมื่อถูกเรียกใช้

1. **ขั้นที่ 1 — Design ↔ PRD**: เรียกผ่าน Skill tool ด้วย `skill: sync-design` รอผลลัพธ์ก่อน
   เสมอ
2. **ตรวจสอบผลลัพธ์ขั้นที่ 1**: สุ่มอ่าน `RAISE-DESIGN.md` จริงอย่างน้อย 1 จุด ถ้าพบสัญญาณ
   `NEEDS_PRD_CONFIRMATION` ที่ยังไม่ถูกจัดการ (ผู้ใช้ยังไม่ตอบ) ให้หยุด pipeline รอผู้ใช้ตัดสินใจ
   ก่อนไปขั้นถัดไป — ถ้าพบปัญหาเชิงโครงสร้าง ให้หยุดและรายงานผู้ใช้ทันที
3. **ขั้นที่ 2 — Prototype ↔ Design/PRD**: เรียกผ่าน Skill tool ด้วย `skill: sync-prototype`
   **ต้องรอขั้นที่ 1 เสร็จสมบูรณ์ก่อนเสมอ**
4. **ตรวจสอบผลลัพธ์ขั้นที่ 2**: เช่นเดียวกับข้อ 2
5. **ขั้นที่ 3 — Acceptance Criteria ↔ Prototype**: เรียกผ่าน Skill tool ด้วย
   `skill: sync-acceptance-criteria` **ต้องรอขั้นที่ 2 เสร็จสมบูรณ์ก่อนเสมอ**
6. **ตรวจสอบผลลัพธ์ขั้นที่ 3**: สุ่มอ่าน `RAISE-ACCEPTANCE-CRITERIA.md` จริงอย่างน้อย 1 จุด
7. **ขั้นที่ 4 — Test Plan ↔ Acceptance Criteria**: เรียกผ่าน Skill tool ด้วย
   `skill: sync-test-plan` **ต้องรอขั้นที่ 3 เสร็จสมบูรณ์ก่อนเสมอ**
8. **ขั้นที่ 5 — Test Cases ↔ Test Plan**: เรียกผ่าน Skill tool ด้วย `skill: sync-test-cases`
   **ต้องรอขั้นที่ 4 เสร็จสมบูรณ์ก่อนเสมอ**
9. **ขั้นที่ 6 — Traceability Matrix (สรุปทั้งเชน + หา gap)**: เรียกผ่าน Skill tool ด้วย
   `skill: sync-traceability-matrix` **ต้องรอขั้นที่ 5 เสร็จสมบูรณ์ก่อนเสมอ**
10. **สรุปผลรวมทั้งเชนเป็นรายงานเดียว** แยกตามขั้นตอน (up to date อยู่แล้วหรือแก้ไขอะไรไปบ้าง),
    สัญญาณ `NEEDS_PRD_CONFIRMATION` ที่เกิดขึ้นระหว่างทาง (ถ้ามี, พร้อมคำตอบผู้ใช้), และสรุป gap
    จาก Traceability Matrix (ใหม่/resolved)

## ข้อควรระวัง

- **ต้องรันตามลำดับเสมอ (sequential) ห้ามรันขนาน** — แต่ละขั้นตอนต้องพึ่งผลลัพธ์ที่อัปเดตแล้วของ
  ขั้นก่อนหน้าเป็นแหล่งความจริง
- ห้ามข้ามชั้นใดชั้นหนึ่งไปเอง แม้ผู้ใช้จะถามถึงแค่ปัญหาชั้นปลาย (เช่น "traceability matrix ตรงไหม")
  เพราะ PRD/Design ที่ล้าสมัยจะทำให้ผลตรวจชั้นปลายผิดไปด้วย
- **ถ้าพบสัญญาณ `NEEDS_PRD_CONFIRMATION` ในขั้นตอนใด ต้องหยุดถามผู้ใช้ก่อนเสมอ ห้าม
  auto-approve แล้วเรียก `update-prd` เองโดยไม่ถาม** — นี่คือหลักการสำคัญของ RAISE ที่ห้ามเดา/
  ขยายขอบเขต requirement โดยไม่มีการยืนยันจากธุรกิจ (ต่างจากระบบ auto-chain ของ pipeline เดิม)
- ถ้า skill ตัวใดตัวหนึ่งรายงานปัญหาเชิงโครงสร้าง (ไฟล์ที่คาดไว้หาไม่เจอ ฯลฯ) ให้หยุด pipeline
  ทันที ไม่ไปขั้นตอนถัดไป แล้วรายงานปัญหานั้นให้ผู้ใช้ก่อนเสมอ
