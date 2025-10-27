import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { EnrollmentStatus } from "@prisma/client";

export const studentDashboardRouter = createTRPCRouter({
  /**
    * Get key metrics for the student dashboard.
    */
   getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
     const userId = ctx.session.user.id;

     // Execute queries in parallel for performance
     const [enrollmentStats, paymentStats] = await Promise.all([
       db.enrollment.groupBy({
         by: ['status'],
         _count: {
           id: true,
         },
         where: { userId },
       }),
       db.payment.aggregate({
         _sum: {
           amount: true,
         },
         _count: {
             id: true,
         },
         where: { userId, status: 'COMPLETED' },
       }),
     ]);

     const activeCourses = enrollmentStats.find(stat => stat.status === EnrollmentStatus.ACTIVE)?._count.id || 0;
     const completedCourses = enrollmentStats.find(stat => stat.status === EnrollmentStatus.COMPLETED)?._count.id || 0;

     const stats = {
       activeCourses,
       completedCourses,
       totalPayments: paymentStats._count.id,
       totalSpent: Number(paymentStats._sum.amount || 0),
     };

     return stats;
   }),
});