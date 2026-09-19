import { PrismaClient } from "@prisma/client";

/**
 * Prisma client ตัวเดียวต่อ process
 * dev ของ Next โหลดโมดูลใหม่ทุกครั้งที่แก้ไฟล์ ถ้าไม่เก็บไว้บน globalThis
 * จะเปิด connection ใหม่เรื่อย ๆ จนชน connection limit ของ Neon แผนฟรี (ADR 0002)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
