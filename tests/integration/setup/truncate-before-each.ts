import { afterAll, beforeEach } from "vitest";
import { testPrisma, truncateAllTables } from "./prisma";

beforeEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
