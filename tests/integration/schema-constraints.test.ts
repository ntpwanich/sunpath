import { describe, expect, it } from "vitest";
import { testPrisma } from "./setup/prisma";
import {
  makeContact,
  makeOpportunity,
  makeQuotation,
  makeQuotationRevision,
  makeSurvey,
  makeUser,
} from "./fixtures";

/**
 * กติกาสี่ข้อนี้ตั้งใจให้ฐานข้อมูลเป็นคนบังคับ ไม่ใช่โค้ดฝั่งเดียว
 * เพราะสองคนกดพร้อมกันคนละ request จะผ่านการเช็คในโค้ดทั้งคู่ได้
 * test ชุดนี้จึงยิงตรงไปที่ตาราง ไม่ผ่านชั้น use-case โดยตั้งใจ
 */
const uniqueViolation = { code: "P2002" };

describe("เบอร์โทรซ้ำ", () => {
  it("เบอร์เดียวกันมี Contact ได้แถวเดียว", async () => {
    await makeContact({ phoneNumber: "0812345678" });

    await expect(makeContact({ phoneNumber: "0812345678" })).rejects.toMatchObject(uniqueViolation);
  });
});

describe("หนึ่งคนมีงานที่ยังไม่ปิดได้ทีละงานเดียว", () => {
  it("เปิดงานที่สองซ้อนงานที่ยังไม่ปิดของคนเดิมไม่ได้", async () => {
    const contact = await makeContact();
    await makeOpportunity({ contactId: contact.id });

    await expect(makeOpportunity({ contactId: contact.id })).rejects.toMatchObject(uniqueViolation);
  });

  it("ปิดงานเดิมแล้วเปิดงานใหม่ให้คนเดิมได้", async () => {
    const contact = await makeContact();
    const first = await makeOpportunity({ contactId: contact.id });

    await testPrisma.opportunity.update({
      where: { id: first.id },
      data: {
        currentStage: "CLOSED_LOST",
        contactIdWhileOpen: null,
        loss: {
          create: {
            lostAt: new Date("2026-03-01T10:00:00.000Z"),
            lossReason: "PRICE",
          },
        },
      },
    });

    const second = await makeOpportunity({ contactId: contact.id });

    expect(second.contactIdWhileOpen).toBe(contact.id);
    await expect(testPrisma.opportunity.count({ where: { contactId: contact.id } })).resolves.toBe(
      2,
    );
  });
});

describe("คิวช่างสำรวจ", () => {
  it("ช่างคนเดียวกันรับสองงานในวันและช่วงเดียวกันไม่ได้", async () => {
    const surveyor = await makeUser({ userRole: "SURVEYOR" });
    const scheduledDate = new Date("2026-09-24T00:00:00.000Z");
    await makeSurvey({ surveyorUserId: surveyor.id, scheduledDate, scheduledTimeSlot: "MORNING" });

    await expect(
      makeSurvey({ surveyorUserId: surveyor.id, scheduledDate, scheduledTimeSlot: "MORNING" }),
    ).rejects.toMatchObject(uniqueViolation);
  });

  it("วันเดียวกันแต่คนละช่วงได้", async () => {
    const surveyor = await makeUser({ userRole: "SURVEYOR" });
    const scheduledDate = new Date("2026-09-24T00:00:00.000Z");
    await makeSurvey({ surveyorUserId: surveyor.id, scheduledDate, scheduledTimeSlot: "MORNING" });

    const afternoon = await makeSurvey({
      surveyorUserId: surveyor.id,
      scheduledDate,
      scheduledTimeSlot: "AFTERNOON",
    });

    expect(afternoon.scheduledTimeSlot).toBe("AFTERNOON");
  });
});

describe("เวอร์ชันใบเสนอราคา", () => {
  it("ใบเดียวกันมีเวอร์ชันซ้ำไม่ได้", async () => {
    const quotation = await makeQuotation();
    await makeQuotationRevision({ quotationId: quotation.id, versionNumber: 1 });

    await expect(
      makeQuotationRevision({ quotationId: quotation.id, versionNumber: 1 }),
    ).rejects.toMatchObject(uniqueViolation);
  });

  it("ฉบับใหม่อ้างถึงฉบับก่อนหน้าได้ และฉบับก่อนหน้าถูกอ้างได้ครั้งเดียว", async () => {
    const quotation = await makeQuotation();
    const first = await makeQuotationRevision({ quotationId: quotation.id, versionNumber: 1 });

    const second = await makeQuotationRevision({
      quotationId: quotation.id,
      versionNumber: 2,
      previousRevisionId: first.id,
    });

    expect(second.previousRevisionId).toBe(first.id);
    await expect(
      makeQuotationRevision({
        quotationId: quotation.id,
        versionNumber: 3,
        previousRevisionId: first.id,
      }),
    ).rejects.toMatchObject(uniqueViolation);
  });
});
