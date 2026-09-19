import { describe, expect, it } from "vitest";
import { testPrisma } from "./setup/prisma";

// ยืนยันว่า project integration ต่อฐานข้อมูลจาก docker-compose.yml ได้จริง
// และ hook ล้างตารางก่อนแต่ละ test ทำงาน — จะถูกแทนที่ด้วย test ของจริงในงานก้อนถัดไป
describe("การเชื่อมต่อฐานข้อมูลของ integration test", () => {
  it("คุยกับ Postgres ได้", async () => {
    const rows = await testPrisma.$queryRaw<{ one: number }[]>`SELECT 1::int AS one`;
    expect(rows[0]?.one).toBe(1);
  });
});
