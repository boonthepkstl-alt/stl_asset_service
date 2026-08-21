---
name: sync-design
description: >
  ตรวจสอบและสร้าง/ปรับปรุง docs/02-design/RAISE-DESIGN.md ให้สอดคล้องกับ
  docs/01-requirements/RAISE-PRD.md ล่าสุด ใช้เมื่อผู้ใช้พิมพ์ /sync-design หรือขอให้ "ทำ design
  จาก PRD", "อัปเดต design", "เช็ค design กับ PRD ล่าสุด"
---

# Sync Design

Skill นี้เป็น workflow มาตรฐานสำหรับตรวจสอบว่า `RAISE-DESIGN.md` สอดคล้อง ("up to date") กับ
`RAISE-PRD.md` หรือไม่ ถ้าไม่สอดคล้อง ให้สร้าง/ปรับปรุงผ่าน subagent `design-writer`

## เมื่อถูกเรียกใช้

1. **ส่งต่อให้ subagent `design-writer`** ผ่าน Agent tool (`run_in_background: false`)
2. **รอผลลัพธ์**
3. **ตรวจจับสัญญาณ `## NEEDS_PRD_CONFIRMATION`**: ถ้าพบ ให้แจ้งผู้ใช้สรุปสั้นๆ ว่า design-writer
   พบ capability ที่ยังไม่มี requirement รองรับ แล้วถามผู้ใช้ว่าต้องการเรียก `update-prd` ต่อทันที
   หรือไม่ (เสนอ 3 ทาง: เรียกต่อทันที **(แนะนำ)** / ไว้ทีหลัง / ขอดูรายละเอียดก่อน) — **ห้าม
   auto-chain ไปเขียน PRD เองโดยไม่ถาม** ต่างจากระบบเดิม เพราะ RAISE ห้ามเดา requirement เอง
4. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-DESIGN.md` จริงอย่างน้อย 1-2 จุด ตรวจว่าทุก requirement
   P0 ใน PRD มี design area รองรับ
5. **สรุปให้ผู้ใช้ทราบ**: up to date หรือไม่ก่อนตรวจ, ส่วนที่แก้ไข, สัญญาณ
   `NEEDS_PRD_CONFIRMATION` (ถ้ามี) และคำตอบผู้ใช้

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้ `RAISE-DESIGN.md` เองตรงๆ ในเทรดหลัก
- Subagent ห้ามแตะ `RAISE-PRD.md` — ถ้าผลลัพธ์พูดถึงการแก้ไข PRD ให้ถือว่าผิดกฎ หยุดและแจ้งผู้ใช้
