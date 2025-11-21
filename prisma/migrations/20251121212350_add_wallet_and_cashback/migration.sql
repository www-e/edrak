-- CreateEnum
CREATE TYPE "CashbackType" AS ENUM ('NONE', 'PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE_DEBIT', 'CASHBACK_CREDIT', 'ADMIN_CREDIT', 'ADMIN_DEBIT', 'REFUND_CREDIT');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "cashbackType" "CashbackType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "cashbackValue" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cashbackEarned" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "walletAmountUsed" DECIMAL(10,2) DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletBalance" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "balanceBefore" DECIMAL(10,2) NOT NULL,
    "balanceAfter" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "relatedPaymentId" TEXT,
    "adminId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletTransaction_userId_idx" ON "WalletTransaction"("userId");

-- CreateIndex
CREATE INDEX "WalletTransaction_type_idx" ON "WalletTransaction"("type");

-- CreateIndex
CREATE INDEX "WalletTransaction_createdAt_idx" ON "WalletTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_relatedPaymentId_idx" ON "WalletTransaction"("relatedPaymentId");

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_relatedPaymentId_fkey" FOREIGN KEY ("relatedPaymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
