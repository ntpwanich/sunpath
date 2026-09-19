import { defineConfig, devices } from "@playwright/test";

/**
 * e2e มีเส้นเดียว — เส้นทางที่ 1 ตั้งแต่ lead เข้ามาจนปิดการขาย (spec §13)
 * เส้นเดียวกันนี้ถูกใช้เป็น smoke test หลังสร้างข้อมูลใหม่ทุกคืน
 * ถ้าไม่ผ่าน แปลว่า demo พังก่อนที่ผู้เข้าชมคนแรกจะเจอ
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // หน้า 8 และ 9 ออกแบบสำหรับมือถือโดยเฉพาะ (spec §9)
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // ถ้าชี้ไปเซิร์ฟเวอร์ที่รันอยู่แล้ว (เช่น preview deployment ของ PR) ไม่ต้องปลุกเซิร์ฟเวอร์เอง
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command: "pnpm build && pnpm start",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
