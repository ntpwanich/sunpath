-- integration test ทำ TRUNCATE ทุกตารางก่อนแต่ละ test จึงต้องแยก database
-- ออกจากฐานข้อมูลที่ใช้ตอนพัฒนา ไม่อย่างนั้นข้อมูลที่กำลังเล่นอยู่จะหายทุกครั้งที่รัน test
CREATE DATABASE sunpath_test OWNER sunpath;
