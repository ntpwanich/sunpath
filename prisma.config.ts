import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// ไฟล์นี้จำเป็นเพราะ schema ถูกแยกเป็นหลายไฟล์ใต้ prisma/schema/
// และเพราะเมื่อมีไฟล์นี้ Prisma จะไม่อ่าน .env ให้เองอีก จึงต้อง import dotenv ข้างบน
export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed/index.ts",
  },
});
