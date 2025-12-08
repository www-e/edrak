import { db } from "@/server/db";

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  finalAmount: number;
  coupon?: {
    id: string;
    code: string;
    type: string;
    amount: number;
  };
  error?: string;
}

export class CouponService {
  /**
   * Validates a coupon code and calculates discount
   */
  static async validateCoupon(couponCode: string, coursePrice: number, userId?: string): Promise<CouponValidationResult> {
    try {
      const coupon = await db.coupon.findUnique({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
        },
      });

      if (!coupon) {
        return {
          isValid: false,
          discount: 0,
          discountType: 'FIXED',
          finalAmount: coursePrice,
          error: 'Invalid coupon code',
        };
      }

      // Check if coupon has expired
      if (coupon.endDate && new Date() > coupon.endDate) {
        return {
          isValid: false,
          discount: 0,
          discountType: 'FIXED',
          finalAmount: coursePrice,
          error: 'Coupon has expired',
        };
      }

      // Check if coupon has started
      if (new Date() < coupon.startDate) {
        return {
          isValid: false,
          discount: 0,
          discountType: 'FIXED',
          finalAmount: coursePrice,
          error: 'Coupon is not yet valid',
        };
      }

      // Check usage limits
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return {
          isValid: false,
          discount: 0,
          discountType: 'FIXED',
          finalAmount: coursePrice,
          error: 'Coupon usage limit exceeded',
        };
      }

      // Check if user has already used this coupon (if maxUsesPerUser is set)
      if (userId && coupon.maxUsesPerUser > 0) {
        const userCouponUsage = await db.payment.count({
          where: {
            userId,
            couponId: coupon.id,
            status: 'COMPLETED',
          },
        });

        if (userCouponUsage >= coupon.maxUsesPerUser) {
          return {
            isValid: false,
            discount: 0,
            discountType: 'FIXED',
            finalAmount: coursePrice,
            error: 'You have already used this coupon',
          };
        }
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === 'PERCENTAGE') {
        discount = (coursePrice * coupon.amount) / 100;
      } else if (coupon.type === 'FIXED') {
        discount = Math.min(coupon.amount, coursePrice); // Don't discount more than the course price
      }

      const finalAmount = Math.max(0, coursePrice - discount);

      return {
        isValid: true,
        discount,
        discountType: coupon.type,
        finalAmount,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          amount: coupon.amount,
        },
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return {
        isValid: false,
        discount: 0,
        discountType: 'FIXED',
        finalAmount: coursePrice,
        error: 'Error validating coupon',
      };
    }
  }

  /**
   * Applies a coupon to a payment (marks it as used)
   */
  static async applyCouponToPayment(couponId: string): Promise<void> {
    await db.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }
}