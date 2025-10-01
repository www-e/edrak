import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { PayMobService } from "@/lib/paymob";
import { User } from "@prisma/client";

export const paymentRouter = createTRPCRouter({
  initiateCoursePayment: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        paymentMethod: z.enum(["card", "wallet"]),
        walletNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { courseId, paymentMethod, walletNumber } = input;

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

      const payment = await db.payment.create({
        data: {
          userId: user.id, // This is now guaranteed to be a string
          courseId: course.id,
          amount: course.price,
          status: "PENDING",
        },
      });

      try {
        const result = await PayMobService.initiateCoursePayment(user as User, course, payment.id, paymentMethod, walletNumber);
        if (result.type === 'iframe') {
          return { type: 'iframe', iframeUrlPath: `/student/pay/${result.token}` };
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