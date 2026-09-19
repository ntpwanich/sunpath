import { config } from "dotenv";

config({ path: ".env", quiet: true });

/**
 * integration test ใช้ database คนละตัวกับตอนพัฒนาเสมอ เพราะทุก test ทำ TRUNCATE
 * ถ้าไม่ได้ตั้ง TEST_DATABASE_URL ไว้ ให้ล้มตั้งแต่ต้น ดีกว่าเผลอล้างฐานข้อมูลที่กำลังใช้อยู่
 */
export function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "ไม่ได้ตั้ง TEST_DATABASE_URL — คัดลอก .env.example เป็น .env แล้วรัน pnpm db:up",
    );
  }
  if (!/_test(\?|$)/.test(url.split("/").pop() ?? "")) {
    throw new Error(`TEST_DATABASE_URL ต้องชี้ไป database ที่ลงท้ายด้วย _test เท่านั้น: ${url}`);
  }
  return url;
}
