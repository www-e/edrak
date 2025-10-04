import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { EnrollmentStatus } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const studentCoursesRouter = createTRPCRouter({
  checkEnrollment: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID is required." });

      const enrollment = await db.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: input.courseId } }
      });

      return {
        isEnrolled: !!enrollment,
        enrollment: enrollment ? {
          enrollmentId: enrollment.id,
          enrolledAt: enrollment.enrolledAt,
          completionPercentage: enrollment.completionPercentage,
        } : null,
      };
    }),

  getMyEnrolledCourses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const enrollments = await db.enrollment.findMany({
      where: { userId, status: EnrollmentStatus.ACTIVE },
      include: {
        course: {
          include: {
            professor: { select: { firstName: true, lastName: true } },
            _count: { select: { lessons: true } }
          }
        }
      },
      orderBy: { enrolledAt: "desc" }
    });

    return enrollments.map(enrollment => ({
      enrollmentId: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        description: enrollment.course.description,
        language: enrollment.course.language,
        rating: enrollment.course.rating,
        professorName: `${enrollment.course.professor.firstName} ${enrollment.course.professor.lastName}`,
        lessonCount: enrollment.course._count.lessons,
      },
      completionPercentage: enrollment.completionPercentage,
    }));
  }),
});