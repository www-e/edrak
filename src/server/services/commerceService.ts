import { PrismaClient } from '@prisma/client';

// Placeholder for Zod schemas
import { Coupon } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service class for admin-related commerce (coupons, payments) management.
 */
export class AdminCommerceService {
  /**
   * Creates a new coupon.
   * @param data - The data for the new coupon.
   */
  static async createCoupon(data: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>) {
    return prisma.coupon.create({ data });
  }
    
  /**
   * Updates an existing coupon.
   * @param couponId - The ID of the coupon to update.
   * @param data - The data to update.
   */
  static async updateCoupon(couponId: string, data: Partial<Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>>) {
    return prisma.coupon.update({
        where: { id: couponId },
        data,
    });
  }

  /**
   * Retrieves a list of all payments with their related user and course info.
   */
  static async getAllPayments() {
    return prisma.payment.findMany({
      include: {
        user: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        course: {
          select: { id: true, title: true },
        },
        coupon: {
            select: { id: true, code: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}