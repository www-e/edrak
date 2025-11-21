import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { PayMobService } from "@/lib/paymob";
import { User } from "@prisma/client";
import { CouponService } from "@/lib/coupon-service";
import { WalletService } from "@/lib/wallet-service";

export const paymentRouter = createTRPCRouter({
  validateCoupon: protectedProcedure
    .input(
      z.object({
        couponCode: z.string().min(1, "Coupon code is required"),
        coursePrice: z.number().positive("Course price must be positive"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { couponCode, coursePrice } = input;

      if (!user?.id) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Session is invalid." });
      }

      return await CouponService.validateCoupon(couponCode, coursePrice, user.id);
    }),

  initiateCoursePayment: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        paymentMethod: z.enum(["card", "wallet"]),
        walletNumber: z.string().optional(),
        couponCode: z.string().optional(),
        walletAmountToUse: z.number().min(0).optional(), // NEW: Wallet usage
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { courseId, paymentMethod, walletNumber, couponCode, walletAmountToUse } = input;

      // Type guard to ensure user.id exists
      if (!user?.id) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Session is invalid." });
      }

      const userId = user.id; // Capture for type safety

      if (paymentMethod === "wallet" && !walletNumber) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A mobile number is required for wallet payments." });
      }

      const course = await db.course.findUnique({ where: { id: courseId, visibility: "PUBLISHED" } });
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found or is not available for purchase." });
      }

      const existingEnrollment = await db.enrollment.findFirst({ where: { userId, courseId: course.id, status: "ACTIVE" } });
      if (existingEnrollment) {
        throw new TRPCError({ code: "CONFLICT", message: "You are already enrolled in this course." });
      }

      // Handle coupon validation if provided
      let priceAfterCoupon = course.price;
      let couponId: string | undefined;

      if (couponCode) {
        const couponValidation = await CouponService.validateCoupon(couponCode, course.price, userId);
        if (!couponValidation.isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: couponValidation.error || "Invalid coupon code"
          });
        }
        priceAfterCoupon = couponValidation.finalAmount;
        couponId = couponValidation.coupon?.id;
      }

      // NEW: Handle wallet usage
      const walletAmount = walletAmountToUse || 0;
      
      // Validate wallet amount doesn't exceed price or balance
      if (walletAmount > 0) {
        if (walletAmount > priceAfterCoupon) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Wallet amount (${walletAmount} EGP) cannot exceed course price (${priceAfterCoupon} EGP)`
          });
        }

        const hasSufficientBalance = await WalletService.validateSufficientBalance(userId, walletAmount);
        if (!hasSufficientBalance) {
          const currentBalance = await WalletService.getBalance(userId);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Insufficient wallet balance. Available: ${currentBalance} EGP, Required: ${walletAmount} EGP`
          });
        }
      }

      // Calculate final amount to pay via PayMob
      const finalAmountToPayMob = priceAfterCoupon - walletAmount;

      // NEW: Use transaction to atomically debit wallet and create payment
      let payment;
      try {
        payment = await db.$transaction(async (tx) => {
          // Debit wallet if amount > 0
          if (walletAmount > 0) {
            await WalletService.debitForPurchase(
              userId,
              walletAmount,
              "", // Payment ID will be set after creation
              course.title
            );
          }

          // Create payment record
          const newPayment = await tx.payment.create({
            data: {
              userId,
              courseId: course.id,
              amount: priceAfterCoupon, // Store the actual amount paid (after coupon, before wallet)
              status: "PENDING",
              paymentMethod: paymentMethod,
              walletAmountUsed: walletAmount,
              ...(couponId && { couponId }),
            },
          });

          // Update wallet transaction with payment ID
          if (walletAmount > 0) {
            await tx.walletTransaction.updateMany({
              where: {
                userId,
                relatedPaymentId: null,
                type: "PURCHASE_DEBIT",
                createdAt: {
                  gte: new Date(Date.now() - 5000), // Last 5 seconds
                },
              },
              data: {
                relatedPaymentId: newPayment.id,
              },
            });
          }

          return newPayment;
        });
      } catch (error) {
        console.error("Failed to create payment with wallet debit:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to process payment"
        });
      }

      // Apply coupon usage if coupon was used
      if (couponId) {
        await CouponService.applyCouponToPayment(couponId);
      }

      // If final amount is 0 (fully paid with wallet), auto-complete the payment
      if (finalAmountToPayMob <= 0) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "COMPLETED", completedAt: new Date() }
        });

        // Create enrollment immediately
        await db.enrollment.create({
          data: {
            userId,
            courseId: course.id,
            status: "ACTIVE",
            completionPercentage: 0,
          },
        });

        return {
          type: 'completed' as const,
          paymentId: payment.id,
          message: "Course purchased successfully with wallet balance!",
        };
      }

      // Otherwise, initiate PayMob payment for remaining amount
      try {
        const result = await PayMobService.initiateCoursePayment(
          user as User,
          course,
          payment.id,
          paymentMethod,
          walletNumber,
          finalAmountToPayMob // Pass reduced amount to PayMob
        );

        if (result.type === 'iframe') {
          // Build complete iframe URL (matching working project)
          const baseUrl = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";
          const iframeId = process.env.PAYMOB_IFRAME_ID || process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;

          let iframeUrl = null;
          if (iframeId && result.token) {
            iframeUrl = `${baseUrl.replace('/api', '')}/api/acceptance/iframes/${iframeId}?payment_token=${result.token}`;
          }

          return {
            type: 'iframe' as const,
            paymentId: payment.id,
            iframeUrl,
          };
        } else {
          return { type: 'redirect' as const, redirectUrl: result.url };
        }
      } catch (error) {
        console.error("Failed to initiate PayMob payment:", error);
        
        // Rollback: Refund wallet and mark payment as failed
        await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
        
        if (walletAmount > 0) {
          await WalletService.refundFailedPayment(userId, walletAmount, payment.id, course.title);
        }
        
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not initiate payment gateway. Your wallet has been refunded." });
      }
    }),
});