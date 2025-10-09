import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { PayMobService } from "@/lib/paymob";
import { User } from "@prisma/client";
import { CouponService } from "@/lib/coupon-service";

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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { courseId, paymentMethod, walletNumber, couponCode } = input;

      // Type guard to ensure user.id exists
      if (!user?.id) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Session is invalid." });
      }

      if (paymentMethod === "wallet" && !walletNumber) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A mobile number is required for wallet payments." });
      }

      const course = await db.course.findUnique({ where: { id: courseId, visibility: "PUBLISHED" } });
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found or is not available for purchase." });
      }

      const existingEnrollment = await db.enrollment.findFirst({ where: { userId: user.id, courseId: course.id, status: "ACTIVE" } });
      if (existingEnrollment) {
        throw new TRPCError({ code: "CONFLICT", message: "You are already enrolled in this course." });
      }

      // Handle coupon validation if provided
      let finalAmount = course.price;
      let couponId: string | undefined;

      if (couponCode) {
        const couponValidation = await CouponService.validateCoupon(couponCode, course.price, user.id);
        if (!couponValidation.isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: couponValidation.error || "Invalid coupon code"
          });
        }
        finalAmount = couponValidation.finalAmount;
        couponId = couponValidation.coupon?.id;
      }

      const payment = await db.payment.create({
        data: {
          userId: user.id, // This is now guaranteed to be a string
          courseId: course.id,
          amount: finalAmount,
          status: "PENDING",
          paymentMethod: paymentMethod,
          ...(couponId && { couponId }),
        },
      });

      // Apply coupon usage if coupon was used
      if (couponId) {
        await CouponService.applyCouponToPayment(couponId);
      }

      try {
        const result = await PayMobService.initiateCoursePayment(user as User, course, payment.id, paymentMethod, walletNumber, finalAmount);

        if (result.type === 'iframe') {
          // Build complete iframe URL (matching working project)
          const baseUrl = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";
          const iframeId = process.env.PAYMOB_IFRAME_ID || process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;

          let iframeUrl = null;
          if (iframeId && result.token) {
            iframeUrl = `${baseUrl.replace('/api', '')}/api/acceptance/iframes/${iframeId}?payment_token=${result.token}`;
          }

          return {
            type: 'iframe',
            paymentId: payment.id,
            iframeUrl,
          };
        } else {
          return { type: 'redirect', redirectUrl: result.url };
        }
      } catch (error) {
        console.error("Failed to initiate PayMob payment:", error);
        await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not initiate payment gateway. Please try again later." });
      }
    }),
});