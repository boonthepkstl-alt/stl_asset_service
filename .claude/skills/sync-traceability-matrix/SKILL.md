---
name: sync-traceability-matrix
description: >
  สร้าง/ปรับปรุง docs/07-traceability-matrix/RAISE-TRACEABILITY-MATRIX.md โดยไล่ตรวจทั้งเชน
  เอกสารตั้งแต่ PRD ถึง Test Cases แบบย้อนกลับ พร้อมหา gap ใช้เมื่อผู้ใช้พิมพ์
  /sync-traceability-matrix หรือขอให้ "ทำ traceability matrix", "หา gap ในเอกสารทั้งหมด",
  "อัปเดต traceability matrix"
---

# Sync Traceability Matrix

Skill นี้เป็น workflow มาตรฐานสำหรับสร้าง/ปรับปรุง `RAISE-TRACEABILITY-MATRIX.md` ผ่าน subagent
`traceability-matrix-writer`

## เมื่อถูกเรียกใช้

1. **ส่งต่อให้ subagent `traceability-matrix-writer`** ผ่าน Agent tool
   (`run_in_background: false`)
2. **รอผลลัพธ์**
3. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-TRACEABILITY-MATRIX.md` จริง ตรวจว่า gap ที่รายงานมี
   เหตุผลรองรับจริง (ไม่ใช่แค่ orphan ID ผิวเผิน) และไม่มี gap เดิมถูกปิดโดยไม่มีเอกสารต้นทางรองรับ
4. **สรุปให้ผู้ใช้ทราบ**: requirement ที่ trace ครบ/ไม่ครบ, gap ใหม่ที่พบ (ถ้ามี), gap เดิมที่
   resolved แล้ว (ถ้ามี) — ถ้าพบ gap ใหม่ที่ P0, แนะนำผู้ใช้ว่าควรกลับไปแก้เอกสารชั้นไหนก่อน
   (design/prototype/AC/test plan/test cases) ตามลักษณะของ gap ที่พบ

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้เอกสารเองตรงๆ ในเทรดหลัก
- Subagent เป็น read-only ต่อทุกเอกสารในเชน ยกเว้นไฟล์ matrix เอง — ถ้าผลลัพธ์พูดถึงการแก้ไข
  เอกสารอื่น ให้ถือว่าผิดกฎ หยุดและแจ้งผู้ใช้
