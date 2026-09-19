-- CreateEnum
CREATE TYPE "Segment" AS ENUM ('RESIDENTIAL', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('LINE_OA', 'FACEBOOK_ADS', 'WEBSITE_FORM', 'TRADE_FAIR', 'REFERRAL');

-- CreateEnum
CREATE TYPE "RoofType" AS ENUM ('METAL_SHEET', 'CONCRETE_DECK', 'CORRUGATED_TILE', 'CPAC_TILE', 'DIAMOND_TILE');

-- CreateEnum
CREATE TYPE "BuildingOwnership" AS ENUM ('OWNED', 'RENTED', 'MORTGAGED');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('NEW_LEAD', 'CONTACTED', 'QUALIFIED', 'SURVEY_SCHEDULED', 'SURVEYED', 'QUOTED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "QualificationVerdict" AS ENUM ('PASS', 'NEEDS_REVIEW', 'REJECT');

-- CreateEnum
CREATE TYPE "LossReason" AS ENUM ('PRICE', 'CHOSE_COMPETITOR', 'NOT_QUALIFIED', 'ROOF_UNSUITABLE', 'POSTPONED', 'UNREACHABLE', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityKind" AS ENUM ('CALL', 'LINE_MESSAGE', 'MEETING', 'NOTE');

-- CreateEnum
CREATE TYPE "TaskKind" AS ENUM ('FIRST_CONTACT', 'QUALIFY', 'SCHEDULE_SURVEY', 'ISSUE_QUOTATION', 'FOLLOW_UP_QUOTATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "QuotationRevisionState" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ISSUED', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "SurveyTimeSlot" AS ENUM ('MORNING', 'AFTERNOON');

-- CreateEnum
CREATE TYPE "RoofCondition" AS ENUM ('GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SALES_MANAGER', 'SALES', 'SURVEYOR', 'ADMIN_STAFF', 'SYSTEM');

-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL,
    "contactName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "firstWonAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "leadSource" "LeadSource" NOT NULL,
    "contactIdWhileOpen" UUID,
    "segment" "Segment" NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "addressLine" TEXT,
    "monthlyElectricityBillBaht" INTEGER NOT NULL,
    "roofType" "RoofType" NOT NULL,
    "buildingOwnership" "BuildingOwnership" NOT NULL,
    "currentStage" "Stage" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityStageLog" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "fromStage" "Stage",
    "toStage" "Stage" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL,
    "changedByUserId" UUID NOT NULL,
    "transitionNote" TEXT,

    CONSTRAINT "OpportunityStageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityQualification" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "recommendedVerdict" "QualificationVerdict" NOT NULL,
    "decidedVerdict" "QualificationVerdict" NOT NULL,
    "overrideReason" TEXT,
    "decidedByUserId" UUID NOT NULL,
    "decidedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpportunityQualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityActivity" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "authorUserId" UUID NOT NULL,
    "activityKind" "ActivityKind" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "activityNote" TEXT NOT NULL,

    CONSTRAINT "OpportunityActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityTask" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "assigneeUserId" UUID NOT NULL,
    "taskKind" "TaskKind" NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "plannedFor" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "completedByActivityId" UUID,
    "isSystemGenerated" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpportunityTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityWin" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "acceptedRevisionId" UUID NOT NULL,
    "wonAt" TIMESTAMP(3) NOT NULL,
    "contractValueBaht" INTEGER NOT NULL,
    "depositReceivedAt" TIMESTAMP(3),
    "handedOffToInstallationAt" TIMESTAMP(3),

    CONSTRAINT "OpportunityWin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityLoss" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "lostAt" TIMESTAMP(3) NOT NULL,
    "lossReason" "LossReason" NOT NULL,
    "lossNote" TEXT,

    CONSTRAINT "OpportunityLoss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationRevision" (
    "id" UUID NOT NULL,
    "quotationId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "previousRevisionId" UUID,
    "revisionState" "QuotationRevisionState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "systemSizeKwp" DECIMAL(6,2) NOT NULL,
    "estimatedInstallationDays" INTEGER NOT NULL,
    "basePriceBaht" INTEGER NOT NULL,
    "travelSurchargeBaht" INTEGER NOT NULL,
    "discountPercent" DECIMAL(5,2) NOT NULL,
    "discountAmountBaht" INTEGER NOT NULL,
    "totalPriceBaht" INTEGER NOT NULL,
    "estimatedMonthlySavingsBaht" INTEGER NOT NULL,
    "paybackYearsMin" DECIMAL(3,1) NOT NULL,
    "paybackYearsMax" DECIMAL(3,1) NOT NULL,

    CONSTRAINT "QuotationRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationRevisionItem" (
    "id" UUID NOT NULL,
    "revisionId" UUID NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceBaht" INTEGER NOT NULL,
    "lineTotalBaht" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "QuotationRevisionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationRevisionDiscountApproval" (
    "id" UUID NOT NULL,
    "revisionId" UUID NOT NULL,
    "requestedByUserId" UUID NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "approvedByUserId" UUID,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "approvalNote" TEXT,

    CONSTRAINT "QuotationRevisionDiscountApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "surveyorUserId" UUID NOT NULL,
    "scheduledDate" DATE NOT NULL,
    "scheduledTimeSlot" "SurveyTimeSlot" NOT NULL,
    "assignedByUserId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL,
    "schedulingNote" TEXT,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyReport" (
    "id" UUID NOT NULL,
    "surveyId" UUID NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "installableSystemSizeKwp" DECIMAL(6,2) NOT NULL,
    "observedRoofType" "RoofType" NOT NULL,
    "roofCondition" "RoofCondition" NOT NULL,
    "roofLoadKgPerSqm" DECIMAL(5,2) NOT NULL,
    "distanceToPanelMeters" DECIMAL(5,1) NOT NULL,
    "shadingNote" TEXT,
    "surveyorNote" TEXT,

    CONSTRAINT "SurveyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyReportPhoto" (
    "id" UUID NOT NULL,
    "surveyReportId" UUID NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "isSeedPhoto" BOOLEAN NOT NULL,
    "photoCaption" TEXT,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "SurveyReportPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userRole" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phoneNumber_key" ON "Contact"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_contactId_key" ON "Customer"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_contactIdWhileOpen_key" ON "Opportunity"("contactIdWhileOpen");

-- CreateIndex
CREATE INDEX "Opportunity_ownerUserId_currentStage_idx" ON "Opportunity"("ownerUserId", "currentStage");

-- CreateIndex
CREATE INDEX "Opportunity_currentStage_idx" ON "Opportunity"("currentStage");

-- CreateIndex
CREATE INDEX "Opportunity_contactId_idx" ON "Opportunity"("contactId");

-- CreateIndex
CREATE INDEX "OpportunityStageLog_opportunityId_changedAt_idx" ON "OpportunityStageLog"("opportunityId", "changedAt");

-- CreateIndex
CREATE INDEX "OpportunityStageLog_toStage_changedAt_idx" ON "OpportunityStageLog"("toStage", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityQualification_opportunityId_key" ON "OpportunityQualification"("opportunityId");

-- CreateIndex
CREATE INDEX "OpportunityActivity_opportunityId_occurredAt_idx" ON "OpportunityActivity"("opportunityId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityTask_completedByActivityId_key" ON "OpportunityTask"("completedByActivityId");

-- CreateIndex
CREATE INDEX "OpportunityTask_assigneeUserId_completedAt_plannedFor_idx" ON "OpportunityTask"("assigneeUserId", "completedAt", "plannedFor");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityWin_opportunityId_key" ON "OpportunityWin"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityWin_acceptedRevisionId_key" ON "OpportunityWin"("acceptedRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityLoss_opportunityId_key" ON "OpportunityLoss"("opportunityId");

-- CreateIndex
CREATE INDEX "OpportunityLoss_lossReason_idx" ON "OpportunityLoss"("lossReason");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_opportunityId_key" ON "Quotation"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotationNumber_key" ON "Quotation"("quotationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationRevision_previousRevisionId_key" ON "QuotationRevision"("previousRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationRevision_quotationId_versionNumber_key" ON "QuotationRevision"("quotationId", "versionNumber");

-- CreateIndex
CREATE INDEX "QuotationRevisionItem_revisionId_sortOrder_idx" ON "QuotationRevisionItem"("revisionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationRevisionDiscountApproval_revisionId_key" ON "QuotationRevisionDiscountApproval"("revisionId");

-- CreateIndex
CREATE INDEX "Survey_scheduledDate_idx" ON "Survey"("scheduledDate");

-- CreateIndex
CREATE INDEX "Survey_opportunityId_idx" ON "Survey"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_surveyorUserId_scheduledDate_scheduledTimeSlot_key" ON "Survey"("surveyorUserId", "scheduledDate", "scheduledTimeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyReport_surveyId_key" ON "SurveyReport"("surveyId");

-- CreateIndex
CREATE INDEX "SurveyReportPhoto_surveyReportId_sortOrder_idx" ON "SurveyReportPhoto"("surveyReportId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityStageLog" ADD CONSTRAINT "OpportunityStageLog_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityStageLog" ADD CONSTRAINT "OpportunityStageLog_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityQualification" ADD CONSTRAINT "OpportunityQualification_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityQualification" ADD CONSTRAINT "OpportunityQualification_decidedByUserId_fkey" FOREIGN KEY ("decidedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityActivity" ADD CONSTRAINT "OpportunityActivity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityActivity" ADD CONSTRAINT "OpportunityActivity_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityTask" ADD CONSTRAINT "OpportunityTask_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityTask" ADD CONSTRAINT "OpportunityTask_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityTask" ADD CONSTRAINT "OpportunityTask_completedByActivityId_fkey" FOREIGN KEY ("completedByActivityId") REFERENCES "OpportunityActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityWin" ADD CONSTRAINT "OpportunityWin_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityWin" ADD CONSTRAINT "OpportunityWin_acceptedRevisionId_fkey" FOREIGN KEY ("acceptedRevisionId") REFERENCES "QuotationRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityLoss" ADD CONSTRAINT "OpportunityLoss_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevision" ADD CONSTRAINT "QuotationRevision_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevision" ADD CONSTRAINT "QuotationRevision_previousRevisionId_fkey" FOREIGN KEY ("previousRevisionId") REFERENCES "QuotationRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevisionItem" ADD CONSTRAINT "QuotationRevisionItem_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "QuotationRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevisionDiscountApproval" ADD CONSTRAINT "QuotationRevisionDiscountApproval_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "QuotationRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevisionDiscountApproval" ADD CONSTRAINT "QuotationRevisionDiscountApproval_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRevisionDiscountApproval" ADD CONSTRAINT "QuotationRevisionDiscountApproval_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_surveyorUserId_fkey" FOREIGN KEY ("surveyorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyReport" ADD CONSTRAINT "SurveyReport_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyReportPhoto" ADD CONSTRAINT "SurveyReportPhoto_surveyReportId_fkey" FOREIGN KEY ("surveyReportId") REFERENCES "SurveyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
