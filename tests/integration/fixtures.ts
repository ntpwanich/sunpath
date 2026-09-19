import type { Prisma } from "@prisma/client";
import { testPrisma } from "./setup/prisma";

/**
 * factory สำหรับ integration test — ค่าตั้งต้นสมเหตุสมผลพอที่จะ insert ผ่าน
 * แล้วให้แต่ละ test ระบุเฉพาะฟิลด์ที่เรื่องของมันสนใจจริง ๆ
 *
 * เวลาถูกส่งเข้ามาเป็นค่าเสมอ ไม่มี factory ตัวไหนเรียก new Date() เอง
 * เพราะ test ที่ผูกกับนาฬิกาเครื่องจะเริ่มล้มเองในวันที่ไม่มีใครแก้อะไร
 */
const REFERENCE_TIME = new Date("2026-09-19T09:12:00.000Z");

let sequence = 0;
const nextSuffix = (): string => String(++sequence).padStart(4, "0");

export function makeUser(overrides: Partial<Prisma.UserUncheckedCreateInput> = {}) {
  const suffix = nextSuffix();
  return testPrisma.user.create({
    data: {
      userName: `พนักงาน ${suffix}`,
      email: `user-${suffix}@thaisun.example`,
      userRole: "SALES",
      isActive: true,
      createdAt: REFERENCE_TIME,
      ...overrides,
    },
  });
}

export function makeContact(overrides: Partial<Prisma.ContactUncheckedCreateInput> = {}) {
  const suffix = nextSuffix();
  return testPrisma.contact.create({
    data: {
      contactName: `ผู้สนใจ ${suffix}`,
      phoneNumber: `081${suffix.padStart(7, "0")}`,
      createdAt: REFERENCE_TIME,
      ...overrides,
    },
  });
}

export async function makeOpportunity(
  overrides: Partial<Prisma.OpportunityUncheckedCreateInput> = {},
) {
  const contactId = overrides.contactId ?? (await makeContact()).id;
  const ownerUserId = overrides.ownerUserId ?? (await makeUser()).id;

  return testPrisma.opportunity.create({
    data: {
      contactId,
      ownerUserId,
      contactIdWhileOpen: contactId,
      leadSource: "WEBSITE_FORM",
      segment: "RESIDENTIAL",
      province: "กรุงเทพมหานคร",
      district: "บางกะปิ",
      addressLine: "123 ซอยลาดพร้าว 101",
      monthlyElectricityBillBaht: 4200,
      roofType: "METAL_SHEET",
      buildingOwnership: "OWNED",
      currentStage: "NEW_LEAD",
      createdAt: REFERENCE_TIME,
      ...overrides,
    },
  });
}

export async function makeSurvey(overrides: Partial<Prisma.SurveyUncheckedCreateInput> = {}) {
  const opportunityId = overrides.opportunityId ?? (await makeOpportunity()).id;
  const surveyorUserId = overrides.surveyorUserId ?? (await makeUser({ userRole: "SURVEYOR" })).id;
  const assignedByUserId =
    overrides.assignedByUserId ?? (await makeUser({ userRole: "SALES_MANAGER" })).id;

  return testPrisma.survey.create({
    data: {
      opportunityId,
      surveyorUserId,
      assignedByUserId,
      scheduledDate: new Date("2026-09-24T00:00:00.000Z"),
      scheduledTimeSlot: "MORNING",
      assignedAt: REFERENCE_TIME,
      ...overrides,
    },
  });
}

export async function makeQuotation(overrides: Partial<Prisma.QuotationUncheckedCreateInput> = {}) {
  const opportunityId = overrides.opportunityId ?? (await makeOpportunity()).id;

  return testPrisma.quotation.create({
    data: {
      opportunityId,
      quotationNumber: `QT-2026-${nextSuffix()}`,
      createdAt: REFERENCE_TIME,
      ...overrides,
    },
  });
}

export async function makeQuotationRevision(
  overrides: Partial<Prisma.QuotationRevisionUncheckedCreateInput> = {},
) {
  const quotationId = overrides.quotationId ?? (await makeQuotation()).id;

  return testPrisma.quotationRevision.create({
    data: {
      quotationId,
      versionNumber: 1,
      revisionState: "DRAFT",
      createdAt: REFERENCE_TIME,
      systemSizeKwp: "3.50",
      estimatedInstallationDays: 2,
      basePriceBaht: 140_000,
      travelSurchargeBaht: 0,
      discountPercent: "0.00",
      discountAmountBaht: 0,
      totalPriceBaht: 140_000,
      estimatedMonthlySavingsBaht: 2_048,
      paybackYearsMin: "4.0",
      paybackYearsMax: "7.0",
      ...overrides,
    },
  });
}
