import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { createUserSearchConditions, createCouponSearchConditions } from "@/lib/search";
import { couponDataTransformer } from "@/lib/data-transform";
import { DataAccess } from "@/lib/data-access";

// Placeholder for Zod schemas
import { Coupon } from "@prisma/client";

/**
 * Service class for admin-related commerce (coupons, payments) management.
 */
export class AdminCommerceService {
  /**
   * Creates a new coupon.
   * @param data - The data for the new coupon.
   */
  static async createCoupon(
    data: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">
  ) {
    const transformedData = couponDataTransformer(data) as Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">;
    return db.coupon.create({
      data: transformedData,
      select: DataAccess.getCouponSelect()
    });
  }

  /**
   * Updates an existing coupon.
   * @param couponId - The ID of the coupon to update.
   * @param data - The data to update.
   */
  static async updateCoupon(
    couponId: string,
    data: Partial<Omit<Coupon, "id" | "createdAt" | "updatedAt">>
  ) {
    return db.coupon.update({
      where: { id: couponId },
      data,
      select: DataAccess.getCouponSelect()
    });
  }

  /**
    * Retrieves a list of all payments with their related user and course info.
    */
   static async getAllPayments(options?: {
     page?: number;
     limit?: number;
     search?: string;
   }) {
     const { page = 1, limit = 50, search } = options || {};

     const where = createUserSearchConditions(search) as Prisma.PaymentWhereInput;

     const { data: payments, pagination } = await DataAccess.executeParallelQuery(
       () => db.payment.findMany({
         where,
         include: {
           user: {
             select: { id: true, username: true, firstName: true, lastName: true },
           },
           course: {
             select: { id: true, title: true },
           },
           coupon: {
             select: { id: true, code: true },
           },
         },
         orderBy: {
           createdAt: "desc",
         },
         skip: (page - 1) * limit,
         take: limit,
       }),
       () => db.payment.count({ where }),
       page,
       limit
     );

     return {
       payments,
       pagination
     };
   }
  /**
    * Retrieves key metrics for the admin dashboard with optimized parallel queries.
    */
   static async getDashboardMetrics(): Promise<{
     totalUsers: number;
     totalCourses: number;
     activeEnrollments: number;
     totalRevenue: number;
   }> {
     // Execute all queries in parallel for maximum performance
     const [userStats, courseStats, enrollmentStats, revenueStats] = await Promise.all([
       db.user.aggregate({
         _count: { id: true },
         where: { isActive: true }
       }),
       db.course.aggregate({
         _count: { id: true },
         where: { visibility: 'PUBLISHED' }
       }),
       db.enrollment.aggregate({
         _count: { id: true },
         where: { status: 'ACTIVE' }
       }),
       db.payment.aggregate({
         _sum: { amount: true },
         where: { status: 'COMPLETED' }
       })
     ]);

     const metrics = {
       totalUsers: userStats._count.id,
       totalCourses: courseStats._count.id,
       activeEnrollments: enrollmentStats._count.id,
       totalRevenue: Number(revenueStats._sum.amount || 0),
     };

     return metrics;
   }

  /**
    * Retrieves all coupons with pagination support.
    */
   static async getAllCoupons(options?: {
     page?: number;
     limit?: number;
     search?: string;
   }) {
     const { page = 1, limit = 50, search } = options || {};

     const where = createCouponSearchConditions(search) as Prisma.CouponWhereInput;

     const { data: coupons, pagination } = await DataAccess.executeParallelQuery(
       () => db.coupon.findMany({
         where,
         orderBy: {
           createdAt: "desc",
         },
         skip: (page - 1) * limit,
         take: limit,
       }),
       () => db.coupon.count({ where }),
       page,
       limit
     );

     return {
       coupons,
       pagination
     };
   }

  /**
   * Retrieves a single coupon by its ID.
   * @param id - The ID of the coupon.
   */
  static async getCouponById(id: string) {
    return db.coupon.findUnique({
      where: { id },
    });
  }

  // ==================== WALLET MANAGEMENT ====================

  /**
   * Adjust user wallet balance (admin operation)
   */
  static async adjustUserWallet(
    userId: string,
    amount: number,
    reason: string,
    adminId: string
  ) {
    const { WalletService } = await import("@/lib/wallet-service");
    await WalletService.adminAdjustBalance(userId, amount, reason, adminId);

    return {
      success: true,
      message: `Wallet adjusted by ${amount} EGP`,
      newBalance: await WalletService.getBalance(userId),
    };
  }

  /**
   * Get user wallet balance
   */
  static async getUserWalletBalance(userId: string) {
    const { WalletService } = await import("@/lib/wallet-service");
    const balance = await WalletService.getBalance(userId);

    return {
      balance,
      currency: "EGP",
    };
  }

  /**
   * Get user wallet transaction history
   */
  static async getUserWalletTransactions(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      type?: "PURCHASE_DEBIT" | "CASHBACK_CREDIT" | "ADMIN_CREDIT" | "ADMIN_DEBIT" | "REFUND_CREDIT" | "CASHBACK_REVERSAL";
    }
  ) {
    const { WalletService } = await import("@/lib/wallet-service");
    const result = await WalletService.getTransactionHistory(userId, options);

    return {
      transactions: result.transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: Number(tx.amount),
        balanceBefore: Number(tx.balanceBefore),
        balanceAfter: Number(tx.balanceAfter),
        description: tx.description,
        createdAt: tx.createdAt,
        adminId: tx.adminId,
        relatedPayment: tx.relatedPayment
          ? {
              id: tx.relatedPayment.id,
              status: tx.relatedPayment.status,
              courseTitle: tx.relatedPayment.course?.title || "Unknown Course",
            }
          : null,
      })),
      pagination: result.pagination,
    };
  }

  /**
   * Update course cashback configuration
   */
  static async updateCourseCashback(
    courseId: string,
    cashbackType: "NONE" | "PERCENTAGE" | "FIXED",
    cashbackValue?: number
  ) {
    if (cashbackType !== "NONE" && (cashbackValue === undefined || cashbackValue === null)) {
      throw new Error("Cashback value is required when cashback type is not NONE");
    }

    if (cashbackType === "PERCENTAGE" && cashbackValue && cashbackValue > 100) {
      throw new Error("Percentage cashback cannot exceed 100%");
    }

    const course = await db.course.update({
      where: { id: courseId },
      data: {
        cashbackType,
        cashbackValue: cashbackValue ?? 0,
      },
      select: {
        id: true,
        title: true,
        cashbackType: true,
        cashbackValue: true,
      },
    });

    return {
      success: true,
      message: `Cashback configuration updated for course: ${course.title}`,
      course: {
        ...course,
        cashbackValue: Number(course.cashbackValue),
      },
    };
  }
}
