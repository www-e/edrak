import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const studentPaymentsRouter = createTRPCRouter({
  /**
   * Get the payment history for the logged-in student.
   */
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const payments = await db.payment.findMany({
      where: {
        userId: userId,
        status: "COMPLETED", // Only show successful payments
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payments;
  }),
});