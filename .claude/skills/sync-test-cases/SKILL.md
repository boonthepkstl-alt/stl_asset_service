---
name: sync-test-cases
description: >
  ตรวจสอบและสร้าง/ปรับปรุง docs/06-test-cases/RAISE-TEST-CASES.md ให้สอดคล้องกับ
  docs/05-test-plan/RAISE-TEST-PLAN.md ล่าสุด ใช้เมื่อผู้ใช้พิมพ์ /sync-test-cases หรือขอให้
  "ทำ test case จาก test plan", "อัปเดต test case", "เช็ค test case กับ test plan ล่าสุด"
---

# Sync Test Cases

Skill นี้เป็น workflow มาตรฐานสำหรับตรวจสอบว่า `RAISE-TEST-CASES.md` สอดคล้องกับ
`RAISE-TEST-PLAN.md` หรือไม่ ถ้าไม่สอดคล้อง ให้สร้าง/ปรับปรุงผ่าน subagent `test-cases-writer`

## เมื่อถูกเรียกใช้

1. **ส่งต่อให้ subagent `test-cases-writer`** ผ่าน Agent tool (`run_in_background: false`)
2. **รอผลลัพธ์**
3. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-TEST-CASES.md` จริงอย่างน้อย 1-2 จุด ตรวจว่าทุก
   acceptance criterion มี test case คู่กัน 1:1 จริง และ BLOCKED (partial) vs BLOCKED (full)
   ถูกแยกให้ถูกต้อง
4. **สรุปให้ผู้ใช้ทราบ**: up to date หรือไม่ก่อนตรวจ, TC ที่สร้าง/แก้ไข, สัดส่วน
   testable/blocked

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้เอกสารเองตรงๆ ในเทรดหลัก
- Subagent ห้ามแตะ `RAISE-TEST-PLAN.md` หรือชั้นก่อนหน้า
