import { PrismaClient } from "@prisma/client";
import { testDatabaseUrl } from "./test-database-url";

/** Prisma client ที่ชี้ไป database ของ test เท่านั้น */
export const testPrisma = new PrismaClient({
  datasources: { db: { url: testDatabaseUrl() } },
});

/**
 * ล้างทุกตารางก่อนแต่ละ test
 * อ่านรายชื่อตารางจาก pg_tables ไม่ใช่เขียนรายการไว้เอง
 * ตารางใหม่ที่เพิ่มทีหลังจึงถูกล้างด้วยโดยไม่ต้องมาแก้ไฟล์นี้
 */
export async function truncateAllTables(): Promise<void> {
  const tables = await testPrisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma_%'
  `;

  if (tables.length === 0) return;

  const list = tables.map(({ tablename }) => `"public"."${tablename}"`).join(", ");
  await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}
