# Next.js เป็นทั้ง frontend และ backend โดยแยกชั้น domain ออกจาก framework

SunPath เป็นระบบเดียว ทีมเดียว ผู้ใช้หลักสิบคน การแยก backend ออกเป็นบริการต่างหากจะเพิ่ม deploy อีกก้อน, CORS, auth ข้ามโดเมน และ latency โดยไม่ได้แก้ปัญหาอะไรที่มีอยู่จริง เราจึงใช้ Next.js App Router ตัวเดียว — Server Components สำหรับอ่าน, Server Actions สำหรับเขียน, Route Handlers สำหรับ webhook รับ lead จากภายนอก

เงื่อนไขที่ผูกมากับการตัดสินใจนี้: business logic ทั้งหมดอยู่ใน `src/server/<domain>` ที่ไม่ import อะไรจาก React หรือ Next เลย Server Action เป็นเพียงเปลือกบางที่ validate input แล้วเรียก domain ทำให้กติกาทางธุรกิจ (การคัดกรอง lead, การมอบหมายงาน, SLA, การคำนวณขนาดระบบ) ทดสอบได้โดยไม่ต้องรัน framework และย้ายออกไปไว้หลัง API แยกได้ภายหลังถ้าจำเป็น
