---
name: sync-acceptance-criteria
description: >
  ตรวจสอบและสร้าง/ปรับปรุง docs/04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md ให้
  สอดคล้องกับ docs/03-prototype/RAISE-PROTOTYPE.md ล่าสุด ใช้เมื่อผู้ใช้พิมพ์
  /sync-acceptance-criteria หรือขอให้ "ทำ acceptance criteria จาก prototype", "อัปเดต AC",
  "เช็ค AC กับ prototype ล่าสุด"
---

# Sync Acceptance Criteria

Skill นี้เป็น workflow มาตรฐานสำหรับตรวจสอบว่า `RAISE-ACCEPTANCE-CRITERIA.md` สอดคล้องกับ
`RAISE-PROTOTYPE.md` หรือไม่ ถ้าไม่สอดคล้อง ให้สร้าง/ปรับปรุงผ่าน subagent
`acceptance-criteria-writer`

## เมื่อถูกเรียกใช้

1. **ส่งต่อให้ subagent `acceptance-criteria-writer`** ผ่าน Agent tool
   (`run_in_background: false`)
2. **รอผลลัพธ์**
3. **ตรวจจับสัญญาณ `## NEEDS_PRD_CONFIRMATION`**: ถ้าพบ ให้ถามผู้ใช้ก่อนเรียก `update-prd` เสมอ
4. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-ACCEPTANCE-CRITERIA.md` จริงอย่างน้อย 1-2 จุด ตรวจว่า
   criterion ที่ควรเป็น NOT TESTABLE YET ถูกทำเครื่องหมายไว้จริง (ไม่ใช่เขียนให้ดูสมบูรณ์เกินจริง)
5. **สรุปให้ผู้ใช้ทราบ**: up to date หรือไม่ก่อนตรวจ, screen ที่ครอบคลุมแล้ว/ยังไม่ครอบคลุม,
   จำนวน criterion ที่ NOT TESTABLE YET, สัญญาณ `NEEDS_PRD_CONFIRMATION` (ถ้ามี)

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้เอกสารเองตรงๆ ในเทรดหลัก
- Subagent ห้ามแตะ `RAISE-PROTOTYPE.md` หรือชั้นก่อนหน้า — ถ้าผลลัพธ์พูดถึงการแก้ไขให้ถือว่าผิดกฎ
