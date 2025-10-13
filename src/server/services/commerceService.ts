import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { createUserSearchConditions, createCouponSearchConditions } from "@/lib/search";
import { couponDataTransformer } from "@/lib/data-transform";
import { DataAccess } from "@/lib/data-access";
import { cacheData, getCachedData } from "@/lib/redis";

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
    * Retrieves key metrics for the admin dashboard with optimized parallel queries and Redis caching.
    */
   static async getDashboardMetrics(): Promise<{
     totalUsers: number;
     totalCourses: number;
     activeEnrollments: number;
     totalRevenue: number;
   }> {
     const cacheKey = 'admin:dashboard:metrics';

     // Try Redis cache first (cross-server consistency)
     const cachedMetrics = await getCachedData<{
       totalUsers: number;
       totalCourses: number;
       activeEnrollments: number;
       totalRevenue: number;
     }>(cacheKey);
     if (cachedMetrics) {
       return cachedMetrics;
     }

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

     // Cache in Redis for 30 seconds (admin data changes frequently)
     await cacheData(cacheKey, metrics, 30);

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
}
