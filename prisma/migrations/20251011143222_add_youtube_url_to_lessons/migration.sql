/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `enrolledAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayReference` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayResponse` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentGateway` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Made the column `courseId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('COURSE_START', 'LESSON_COMPLETE', 'COURSE_COMPLETE', 'QUIZ_PASS', 'ASSIGNMENT_SUBMIT');

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_courseId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "videoUrl",
ADD COLUMN     "youtubeUrl" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "enrolledAt",
DROP COLUMN "gatewayReference",
DROP COLUMN "gatewayResponse",
DROP COLUMN "paymentGateway",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymobResponse" JSONB,
ADD COLUMN     "paymobTransactionId" BIGINT,
ALTER COLUMN "courseId" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "paymobOrderId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "PaymentWebhook" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "paymobTransactionId" BIGINT NOT NULL,
    "webhookPayload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "processingAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "certificateCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "studentName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "professorName" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressMilestone" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "milestoneType" "MilestoneType" NOT NULL,
    "metadata" JSONB,
    "achievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentWebhook_paymentId_idx" ON "PaymentWebhook"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentWebhook_paymobTransactionId_idx" ON "PaymentWebhook"("paymobTransactionId");

-- CreateIndex
CREATE INDEX "PaymentWebhook_processedAt_idx" ON "PaymentWebhook"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateCode_key" ON "Certificate"("certificateCode");

-- CreateIndex
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");

-- CreateIndex
CREATE INDEX "Certificate_courseId_idx" ON "Certificate"("courseId");

-- CreateIndex
CREATE INDEX "Certificate_certificateCode_idx" ON "Certificate"("certificateCode");

-- CreateIndex
CREATE INDEX "Certificate_status_idx" ON "Certificate"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");

-- CreateIndex
CREATE INDEX "ProgressMilestone_userId_idx" ON "ProgressMilestone"("userId");

-- CreateIndex
CREATE INDEX "ProgressMilestone_courseId_idx" ON "ProgressMilestone"("courseId");

-- CreateIndex
CREATE INDEX "ProgressMilestone_milestoneType_idx" ON "ProgressMilestone"("milestoneType");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressMilestone_userId_courseId_milestoneType_key" ON "ProgressMilestone"("userId", "courseId", "milestoneType");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_courseId_idx" ON "Payment"("courseId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paymobOrderId_idx" ON "Payment"("paymobOrderId");

-- CreateIndex
CREATE INDEX "Payment_paymobTransactionId_idx" ON "Payment"("paymobTransactionId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentWebhook" ADD CONSTRAINT "PaymentWebhook_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMilestone" ADD CONSTRAINT "ProgressMilestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMilestone" ADD CONSTRAINT "ProgressMilestone_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
