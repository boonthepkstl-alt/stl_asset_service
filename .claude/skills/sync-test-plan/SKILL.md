---
name: sync-test-plan
description: >
  ตรวจสอบและสร้าง/ปรับปรุง docs/05-test-plan/RAISE-TEST-PLAN.md ให้สอดคล้องกับ
  docs/04-acceptance-criteria/RAISE-ACCEPTANCE-CRITERIA.md ล่าสุด ใช้เมื่อผู้ใช้พิมพ์
  /sync-test-plan หรือขอให้ "ทำ test plan จาก acceptance criteria", "อัปเดต test plan", "เช็ค
  test plan กับ AC ล่าสุด"
---

# Sync Test Plan

Skill นี้เป็น workflow มาตรฐานสำหรับตรวจสอบว่า `RAISE-TEST-PLAN.md` สอดคล้องกับ
`RAISE-ACCEPTANCE-CRITERIA.md` หรือไม่ ถ้าไม่สอดคล้อง ให้สร้าง/ปรับปรุงผ่าน subagent
`test-plan-writer`

## เมื่อถูกเรียกใช้

1. **ส่งต่อให้ subagent `test-plan-writer`** ผ่าน Agent tool (`run_in_background: false`)
2. **รอผลลัพธ์**
3. **ตรวจสอบผลลัพธ์**: สุ่มอ่าน `RAISE-TEST-PLAN.md` จริงอย่างน้อย 1-2 จุด ตรวจว่าทุก AC group
   มี suite รองรับ และ blocked items ตรงกับ NOT TESTABLE YET ใน AC document จริง
4. **สรุปให้ผู้ใช้ทราบ**: up to date หรือไม่ก่อนตรวจ, suite ที่สร้าง/แก้ไข, จำนวน blocked items

## ข้อควรระวัง

- ห้ามข้ามการเรียก subagent แล้วแก้เอกสารเองตรงๆ ในเทรดหลัก
- Subagent ห้ามแตะ `RAISE-ACCEPTANCE-CRITERIA.md` หรือชั้นก่อนหน้า
- ไม่มี auto-chain ไป `update-prd` ในชั้นนี้ — ถ้า subagent รายงานว่า AC ไม่ครอบคลุมพอ ให้แนะนำ
  ผู้ใช้รัน `sync-acceptance-criteria` ก่อนแทน
