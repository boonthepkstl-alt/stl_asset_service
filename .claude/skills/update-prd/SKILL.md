---
name: update-prd
description: >
  รับความต้องการดิบ (raw requirement) จากผู้ใช้ หรือสัญญาณ NEEDS_PRD_CONFIRMATION จากชั้น
  ถัดไป แล้วสร้าง/ปรับปรุง docs/01-requirements/RAISE-PRD.md ใช้เมื่อผู้ใช้พิมพ์ /update-prd
  หรือขอให้ "เขียน PRD", "เพิ่ม requirement ใหม่", "อัปเดต PRD"
---

# Update PRD

Skill นี้เป็น workflow มาตรฐานสำหรับสร้าง/ปรับปรุง `docs/01-requirements/RAISE-PRD.md` ผ่าน
subagent `prd-writer`

## เมื่อถูกเรียกใช้

1. **รับ input**: ถ้าผู้ใช้ยังไม่ได้แนบความต้องการดิบ/ประเด็นที่ต้องการเพิ่ม-แก้มาพร้อม args
   ให้ถามผู้ใช้ตรงๆ ว่าต้องการอัปเดตอะไร
2. **ส่งต่อให้ subagent `prd-writer`** ผ่าน Agent tool (`run_in_background: false` เพราะอาจต้อง
   ถามผู้ใช้แบบโต้ตอบผ่าน AskUserQuestion) โดย prompt ต้องมีเนื้อหาดิบแบบ verbatim + บริบทว่านี่คือ
   session สนทนากับผู้ใช้จริง
3. **รอผลลัพธ์**: ปล่อยให้ subagent จัดการคำถามผู้ใช้เอง อย่าตอบแทน
4. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-PRD.md` จริงอย่างน้อย 1 จุดที่เกี่ยวข้องก่อนสรุป
5. **สรุปให้ผู้ใช้ทราบ**: requirement ID ที่เพิ่ม/แก้, หัวข้อที่กระทบ, และ**แจ้งว่าเอกสารชั้นถัดไป
   (Design/Prototype/AC/Test Plan/Test Cases/Traceability Matrix) ควร sync ต่อหรือไม่** — ถ้า
   requirement ที่แก้ไขกระทบ design/screen ที่มีอยู่แล้ว แนะนำให้เรียก `sync-design` ต่อ

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้ `RAISE-PRD.md` เองตรงๆ ในเทรดหลัก
- `prd-writer` ไม่ auto-approve requirement ใหม่จากสัญญาณ `NEEDS_PRD_CONFIRMATION` เอง — ต้องถาม
  ผู้ใช้ยืนยันก่อนเขียนเสมอ (หลักการ "ห้ามเดา requirement" ของ RAISE)
