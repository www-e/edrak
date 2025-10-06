import { PrismaClient, Prisma } from "@prisma/client";
import { CacheService } from "./cacheService";
import {  createPaginationResult } from "@/lib/pagination";
import { createUserSearchConditions, createCouponSearchConditions } from "@/lib/search";
import { couponDataTransformer } from "@/lib/data-transform";

// Placeholder for Zod schemas
import { Coupon } from "@prisma/client";

const prisma = new PrismaClient();

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
    return prisma.coupon.create({ data: transformedData });
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
    return prisma.coupon.update({
      where: { id: couponId },
      data,
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

     const [payments, total] = await Promise.all([
       prisma.payment.findMany({
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
       prisma.payment.count({ where })
     ]);

     return {
       payments,
       pagination: createPaginationResult(page, limit, total)
     };
   }
  /**
   * Retrieves key metrics for the admin dashboard with optimized parallel queries and caching.
   */
  static async getDashboardMetrics(): Promise<{
    totalUsers: number;
    totalCourses: number;
    activeEnrollments: number;
    totalRevenue: number;
  }> {
    const cacheKey = CacheService.createKey('dashboard', 'metrics');

    // Try to get from cache first
    const cachedMetrics = CacheService.get<{
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
      prisma.user.aggregate({
        _count: { id: true },
        where: { isActive: true }
      }),
      prisma.course.aggregate({
        _count: { id: true },
        where: { visibility: 'PUBLISHED' }
      }),
      prisma.enrollment.aggregate({
        _count: { id: true },
        where: { status: 'ACTIVE' }
      }),
      prisma.payment.aggregate({
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

    // Cache the metrics for 30 seconds
    CacheService.set(cacheKey, metrics, 30 * 1000);

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

     const [coupons, total] = await Promise.all([
       prisma.coupon.findMany({
         where,
         orderBy: {
           createdAt: "desc",
         },
         skip: (page - 1) * limit,
         take: limit,
       }),
       prisma.coupon.count({ where })
     ]);

     return {
       coupons,
       pagination: createPaginationResult(page, limit, total)
     };
   }

  /**
   * Retrieves a single coupon by its ID.
   * @param id - The ID of the coupon.
   */
  static async getCouponById(id: string) {
    return prisma.coupon.findUnique({
      where: { id },
    });
  }
}
