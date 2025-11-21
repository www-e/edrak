import { db } from "@/server/db";
import { Prisma, TransactionType, CashbackType, Course } from "@prisma/client";
import { TRPCError } from "@trpc/server";

/**
 * WalletService - Centralized service for all wallet operations
 * Follows the same pattern as CouponService for consistency
 * All operations use Prisma transactions for atomicity
 */
export class WalletService {
  /**
   * Get user's current wallet balance
   */
  static async getBalance(userId: string): Promise<number> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return Number(user.walletBalance);
  }

  /**
   * Validate if user has sufficient balance for a purchase
   */
  static async validateSufficientBalance(
    userId: string,
    amount: number
  ): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= amount;
  }

  /**
   * Debit wallet for a course purchase (called before payment initiation)
   * Uses atomic transaction to ensure consistency
   */
  static async debitForPurchase(
    userId: string,
    amount: number,
    paymentId: string,
    courseName: string
  ): Promise<void> {
    if (amount <= 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Debit amount must be positive",
      });
    }

    await db.$transaction(async (tx) => {
      // Get current balance with row lock to prevent race conditions
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const balanceBefore = Number(user.walletBalance);

      // Validate sufficient balance
      if (balanceBefore < amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Insufficient wallet balance. Available: ${balanceBefore} EGP, Required: ${amount} EGP`,
        });
      }

      const balanceAfter = balanceBefore - amount;

      // Update user balance using atomic decrement
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: amount,
          },
        },
      });

      // Create transaction record for audit trail
      await tx.walletTransaction.create({
        data: {
          userId,
          type: TransactionType.PURCHASE_DEBIT,
          amount: new Prisma.Decimal(-amount), // Negative for debit
          balanceBefore: new Prisma.Decimal(balanceBefore),
          balanceAfter: new Prisma.Decimal(balanceAfter),
          description: `Wallet payment for course: ${courseName}`,
          relatedPaymentId: paymentId,
          metadata: {
            courseName,
            debitedAt: new Date().toISOString(),
          },
        },
      });
    });
  }

  /**
   * Credit cashback to user's wallet (called from payment webhook on success)
   * Includes idempotency check to prevent double-crediting
   */
  static async creditCashback(
    userId: string,
    amount: number,
    paymentId: string,
    courseName: string,
    txClient?: Prisma.TransactionClient
  ): Promise<void> {
    if (amount <= 0) {
      // No cashback to credit, skip silently
      return;
    }

    const dbClient = txClient || db;

    // Idempotency check: Has cashback already been credited for this payment?
    const existingCashback = await dbClient.walletTransaction.findFirst({
      where: {
        relatedPaymentId: paymentId,
        type: TransactionType.CASHBACK_CREDIT,
      },
    });

    if (existingCashback) {
      // Already credited, skip to prevent double-crediting
      return;
    }

    // Get current balance
    const user = await dbClient.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const balanceBefore = Number(user.walletBalance);
    const balanceAfter = balanceBefore + amount;

    // Update user balance using atomic increment
    await dbClient.user.update({
      where: { id: userId },
      data: {
        walletBalance: {
          increment: amount,
        },
      },
    });

    // Create transaction record
    await dbClient.walletTransaction.create({
      data: {
        userId,
        type: TransactionType.CASHBACK_CREDIT,
        amount: new Prisma.Decimal(amount), // Positive for credit
        balanceBefore: new Prisma.Decimal(balanceBefore),
        balanceAfter: new Prisma.Decimal(balanceAfter),
        description: `Cashback earned from course: ${courseName}`,
        relatedPaymentId: paymentId,
        metadata: {
          courseName,
          creditedAt: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Admin-initiated wallet adjustment (add or remove funds)
   */
  static async adminAdjustBalance(
    userId: string,
    amount: number,
    reason: string,
    adminId: string
  ): Promise<void> {
    if (amount === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Adjustment amount cannot be zero",
      });
    }

    await db.$transaction(async (tx) => {
      // Get current balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true, firstName: true, lastName: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const balanceBefore = Number(user.walletBalance);
      const balanceAfter = balanceBefore + amount;

      // Prevent negative balance
      if (balanceAfter < 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot debit ${Math.abs(amount)} EGP. User only has ${balanceBefore} EGP available.`,
        });
      }

      // Update user balance
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      await tx.walletTransaction.create({
        data: {
          userId,
          type: amount > 0 ? TransactionType.ADMIN_CREDIT : TransactionType.ADMIN_DEBIT,
          amount: new Prisma.Decimal(amount),
          balanceBefore: new Prisma.Decimal(balanceBefore),
          balanceAfter: new Prisma.Decimal(balanceAfter),
          description: reason,
          adminId,
          metadata: {
            adminId,
            userName: `${user.firstName} ${user.lastName}`,
            adjustedAt: new Date().toISOString(),
          },
        },
      });
    });
  }

  /**
   * Refund wallet amount if payment initiation fails
   */
  static async refundFailedPayment(
    userId: string,
    amount: number,
    paymentId: string,
    courseName: string
  ): Promise<void> {
    if (amount <= 0) {
      return; // Nothing to refund
    }

    await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const balanceBefore = Number(user.walletBalance);
      const balanceAfter = balanceBefore + amount;

      // Refund the amount
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      await tx.walletTransaction.create({
        data: {
          userId,
          type: TransactionType.REFUND_CREDIT,
          amount: new Prisma.Decimal(amount),
          balanceBefore: new Prisma.Decimal(balanceBefore),
          balanceAfter: new Prisma.Decimal(balanceAfter),
          description: `Refund for failed payment: ${courseName}`,
          relatedPaymentId: paymentId,
          metadata: {
            courseName,
            refundedAt: new Date().toISOString(),
            reason: "Payment initiation failed",
          },
        },
      });
    });
  }

  /**
   * Calculate cashback amount based on course configuration
   * Returns 0 if no cashback configured or if finalAmount is 0 (free course)
   */
  static calculateCashback(
    course: Pick<Course, 'cashbackType' | 'cashbackValue'>, 
    finalAmount: number
  ): number {
    // No cashback on free courses
    if (finalAmount <= 0) {
      return 0;
    }

    // No cashback if not configured
    if (course.cashbackType === CashbackType.NONE) {
      return 0;
    }

    let cashback = 0;

    if (course.cashbackType === CashbackType.PERCENTAGE) {
      const percentage = Number(course.cashbackValue);
      cashback = (finalAmount * percentage) / 100;
    } else if (course.cashbackType === CashbackType.FIXED) {
      cashback = Number(course.cashbackValue);
    }

    // Round to 2 decimal places
    return Math.round(cashback * 100) / 100;
  }

  /**
   * Get user's wallet transaction history with pagination
   */
  static async getTransactionHistory(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      type?: TransactionType;
    }
  ) {
    const { page = 1, limit = 20, type } = options || {};

    const where: Prisma.WalletTransactionWhereInput = {
      userId,
      ...(type && { type }),
    };

    const [transactions, total] = await Promise.all([
      db.walletTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          relatedPayment: {
            select: {
              id: true,
              status: true,
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      }),
      db.walletTransaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
