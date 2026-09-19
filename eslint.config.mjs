import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/**
 * ขอบเขตระหว่างชั้นตาม ADR 0001 — บังคับด้วย lint ไม่ใช่ข้อตกลงในหัว
 *
 *   app  →  use-cases  →  domain
 *                      ↘  infra
 *
 * domain เป็นฟังก์ชันบริสุทธิ์ ห้ามรู้จัก framework หรือฐานข้อมูล
 * มิฉะนั้นกติกาเก้าข้อจะทดสอบโดยไม่เปิด framework ไม่ได้ (spec §14 ข้อ 2)
 */
const domainIsPure = {
  files: ["src/server/domain/**/*.ts"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "react",
              "react-dom",
              "next",
              "next/*",
              "server-only",
              "@prisma/client",
              "prisma",
              "@/app/*",
              "@/components/*",
              "@/server/infra/*",
              "@/server/use-cases/*",
            ],
            message: "ชั้น domain ต้องเป็นฟังก์ชันบริสุทธิ์ (ADR 0001) — ย้าย IO ไปไว้ที่ use-case",
          },
        ],
      },
    ],
  },
};

const serverIsFrameworkFree = {
  files: ["src/server/**/*.ts"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "react",
              "react-dom",
              "next/navigation",
              "next/headers",
              "@/app/*",
              "@/components/*",
            ],
            message: "src/server ห้ามผูกกับ React หรือ Next (ADR 0001)",
          },
        ],
      },
    ],
  },
};

const appGoesThroughUseCases = {
  files: ["src/app/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/server/infra/*"],
            message:
              "หน้าและ Server Action เรียกผ่าน @/server/use-cases เท่านั้น — การอ่านเขียนฐานข้อมูลอยู่ที่ชั้น use-case (spec §13)",
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // serverIsFrameworkFree ต้องมาก่อน domainIsPure — eslint ทับ rule เดียวกันด้วยตัวหลังสุด
  serverIsFrameworkFree,
  domainIsPure,
  // ปิด rule ที่ทับกับ prettier — เรื่องรูปแบบให้ prettier ตัดสินอย่างเดียว
  prettier,
  appGoesThroughUseCases,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/generated/**"]),
]);

export default eslintConfig;
