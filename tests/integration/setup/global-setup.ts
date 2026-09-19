import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { testDatabaseUrl } from "./test-database-url";

/**
 * ใช้ prisma migrate deploy ไม่ใช่ db push โดยตั้งใจ
 * เพื่อให้ test ชุดนี้จับได้เมื่อ migration กับ schema เริ่มไม่ตรงกัน
 * ซึ่งเป็นความพังที่จะไปโผล่ตอน deploy จริงเท่านั้นถ้าไม่จับตรงนี้
 */
export default function setup(): void {
  const url = testDatabaseUrl();
  const migrationsDir = "prisma/migrations";
  const hasMigrations =
    existsSync(migrationsDir) && readdirSync(migrationsDir).some((entry) => !entry.startsWith("."));

  if (!hasMigrations) {
    console.warn("[integration] ยังไม่มี migration — ข้ามขั้น migrate deploy");
    return;
  }

  execFileSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
}
