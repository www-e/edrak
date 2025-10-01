import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const studentProfileRouter = createTRPCRouter({
  /**
   * Get the profile information for the logged-in student.
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
        studentProfile: true, // Includes bio, avatar etc. if it exists
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Student profile not found.',
      });
    }

    return user;
  }),
});