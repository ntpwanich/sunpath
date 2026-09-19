import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * สอง project แยกกันตาม spec §13
 *
 *   unit        กติกาเก้าข้อล้วน ๆ ไม่แตะฐานข้อมูลหรือ framework · รันระหว่างเขียนโค้ดได้
 *   integration สิ่งที่ฟังก์ชันบริสุทธิ์พิสูจน์ไม่ได้ · ต้องมี Postgres จาก docker-compose.yml
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/integration/setup/global-setup.ts"],
          setupFiles: ["tests/integration/setup/truncate-before-each.ts"],
          // ทุก test ล้างทุกตารางก่อนเริ่ม จึงรันขนานกันไม่ได้
          // ตั้งใจไม่ใช้ transaction rollback เพราะโค้ดจริงเปิด transaction เอง
          // ในกติกาเลื่อน Stage และกันคิวช่างชนกัน ซึ่งเป็นสองข้อที่ test ชุดนี้มีไว้จับ
          pool: "forks",
          maxWorkers: 1,
          fileParallelism: false,
          testTimeout: 20_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});
