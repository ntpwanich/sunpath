# SunPath

ระบบจัดการงานขายและลูกค้าสำหรับผู้รับเหมาติดตั้งโซลาร์รูฟท็อป — ชิ้นงาน portfolio ที่สร้างจากกรณีศึกษาสมมติของบริษัท **ไทยซัน โซลูชั่น**

- [ข้อกำหนดผลิตภัณฑ์และการออกแบบ](./docs/spec.md) — เริ่มอ่านที่นี่
- [ศัพท์ที่ใช้ในระบบ](./CONTEXT.md)
- [กติกาทางธุรกิจ](./docs/business-rules.md)
- [บันทึกการตัดสินใจเชิงสถาปัตยกรรม](./docs/adr)

## รันในเครื่อง

ต้องมี Node 22, pnpm และ Docker

```bash
pnpm install
cp .env.example .env
pnpm db:up          # Postgres บนพอร์ต 5433 จาก docker-compose.yml
pnpm db:migrate     # ยังไม่มี migration จนกว่า schema จะถูกเพิ่ม
pnpm dev
```

## คำสั่งที่ใช้บ่อย

|                                |                                                             |
| ------------------------------ | ----------------------------------------------------------- |
| `pnpm test:unit`               | กติกาทางธุรกิจล้วน ๆ ไม่แตะฐานข้อมูล รันได้ระหว่างเขียนโค้ด |
| `pnpm test:integration`        | ต้อง `pnpm db:up` ก่อน ใช้ database `sunpath_test`          |
| `pnpm test:e2e`                | เส้นทางที่ 1 ด้วย Playwright                                |
| `pnpm lint` · `pnpm typecheck` | เกณฑ์เดียวกับที่ CI ใช้                                     |
| `pnpm db:reset`                | ลบ volume แล้วสร้างใหม่ทั้งชุด                              |

## โครงไฟล์

```
src/app/                หน้าและ Server Action (เปลือกบาง: zod → use-case)
src/server/domain/      ฟังก์ชันบริสุทธิ์ — กติกาทางธุรกิจ รับ now: Date เข้ามาเสมอ
src/server/use-cases/   ประกอบ domain เข้ากับฐานข้อมูล คุม transaction
src/server/infra/       Prisma, EmailSender, ที่เก็บรูป
prisma/schema/          schema แยกตามกลุ่มตาราง ตั้งค่า path ไว้ใน prisma.config.ts
prisma/migrations/      migration ที่ integration test รัน migrate deploy ก่อนเริ่มทุกครั้ง
tests/integration/      ยิงที่ชั้น use-case ใช้ Postgres จริง
tests/e2e/              Playwright
```

ขอบเขตระหว่างชั้นถูกบังคับด้วย eslint ตาม [ADR 0001](./docs/adr/0001-nextjs-fullstack-with-isolated-domain-layer.md) — ชั้น `domain` import `react`, `next` หรือ `@prisma/client` ไม่ได้

สถานะ: scaffold และ schema เสร็จแล้ว (17 ตาราง ดู [spec §6](./docs/spec.md)) ยังไม่มีชั้น domain และหน้าจอ
