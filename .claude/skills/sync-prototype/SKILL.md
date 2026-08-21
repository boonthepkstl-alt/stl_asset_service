---
name: sync-prototype
description: >
  ตรวจสอบและสร้าง/ปรับปรุง docs/03-prototype/RAISE-PROTOTYPE.md ให้สอดคล้องกับ
  docs/01-requirements/RAISE-PRD.md/docs/02-design/RAISE-DESIGN.md ล่าสุด ใช้เมื่อผู้ใช้พิมพ์
  /sync-prototype หรือขอให้ "ทำ prototype spec จาก design", "อัปเดต prototype", "เช็ค
  prototype กับ requirement ล่าสุด"
---

# Sync Prototype

Skill นี้เป็น workflow มาตรฐานสำหรับตรวจสอบว่า `RAISE-PROTOTYPE.md` สอดคล้องกับ `RAISE-PRD.md`/
`RAISE-DESIGN.md` หรือไม่ ถ้าไม่สอดคล้อง ให้สร้าง/ปรับปรุงผ่าน subagent `prototype-writer`

## เมื่อถูกเรียกใช้

1. **ส่งต่อให้ subagent `prototype-writer`** ผ่าน Agent tool (`run_in_background: false`)
2. **รอผลลัพธ์**
3. **ตรวจจับสัญญาณ `## NEEDS_PRD_CONFIRMATION`**: เช่นเดียวกับ `sync-design` — ถ้าพบ ให้ถามผู้ใช้
   ก่อนเรียก `update-prd` เสมอ ไม่ auto-chain เอง
4. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-PROTOTYPE.md` จริงอย่างน้อย 1-2 จุด ตรวจว่าทุก requirement
   P0 มีหน้าจอรองรับและมี Traceability กลับไปยัง requirement ID
5. **สรุปให้ผู้ใช้ทราบ**: up to date หรือไม่ก่อนตรวจ, หน้าจอที่สร้าง/แก้ไข, สัญญาณ
   `NEEDS_PRD_CONFIRMATION` (ถ้ามี)

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้ `RAISE-PROTOTYPE.md` เองตรงๆ ในเทรดหลัก
- Subagent ห้ามแตะ `RAISE-PRD.md`/`RAISE-DESIGN.md` — ถ้าผลลัพธ์พูดถึงการแก้ไขไฟล์เหล่านั้น ให้
  ถือว่าผิดกฎ หยุดและแจ้งผู้ใช้
