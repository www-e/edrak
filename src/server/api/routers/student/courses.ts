import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { EnrollmentStatus } from "@prisma/client";

export const studentCoursesRouter = createTRPCRouter({
  /**
   * Get all courses a student is actively enrolled in.
   */
  getMyEnrolledCourses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const enrollments = await db.enrollment.findMany({
      where: {
        userId: userId,
        status: EnrollmentStatus.ACTIVE,
      },
      include: {
        course: {
          include: {
            professor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    // We map the data to ensure we only return what the frontend needs.
    return enrollments.map((enrollment) => ({
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