import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { EnrollmentVerification } from "@/lib/enrollment-verification";

export const studentProgressRouter = createTRPCRouter({
  /**
   * Mark a lesson as complete
   */
  markLessonComplete: protectedProcedure
    .input(
      z.object({
        lessonId: z.string().uuid(),
        courseId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify enrollment
      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to update lesson progress",
        });
      }

      // Check if enrollment exists
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: input.courseId,
          },
        },
      });

      if (!enrollment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enrollment not found",
        });
      }

      // Upsert lesson progress (create if doesn't exist, update if exists)
      const lessonProgress = await db.lessonProgress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollment.id,
            lessonId: input.lessonId,
          },
        },
        update: {
          isCompleted: true,
          completedAt: new Date(),
          videoWatchedPercentage: 100, // Mark as fully watched since it's being completed
        },
        create: {
          enrollmentId: enrollment.id,
          lessonId: input.lessonId,
          isCompleted: true,
          completedAt: new Date(),
          videoWatchedPercentage: 100,
        },
      });

      // Update enrollment completion percentage
      const courseLessons = await db.lesson.findMany({
        where: {
          courseId: input.courseId,
          isVisible: true,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      const completedLessons = await db.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          lessonId: {
            in: courseLessons.map(lesson => lesson.id),
          },
          isCompleted: true,
        },
      });

      const completionPercentage = Math.round(
        (completedLessons / Math.max(1, courseLessons.length)) * 100
      );

      await db.enrollment.update({
        where: { id: enrollment.id },
        data: { completionPercentage, lastAccessedAt: new Date() },
      });

      // If all lessons are completed, update enrollment status to COMPLETED
      if (completionPercentage === 100) {
        await db.enrollment.update({
          where: { id: enrollment.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // Create a course completion milestone
        await db.progressMilestone.upsert({
          where: {
            userId_courseId_milestoneType: {
              userId,
              courseId: input.courseId,
              milestoneType: "COURSE_COMPLETE",
            },
          },
          create: {
            userId,
            courseId: input.courseId,
            milestoneType: "COURSE_COMPLETE",
            metadata: {
              completedAt: new Date(),
            },
          },
          update: {
            metadata: {
              completedAt: new Date(),
            },
          },
        });
      }

      return lessonProgress;
    }),

  /**
   * Get lesson progress for a specific lesson
   */
  getLessonProgress: protectedProcedure
    .input(
      z.object({
        lessonId: z.string().uuid(),
        courseId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to access lesson progress",
        });
      }

      // Get enrollment
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: input.courseId,
          },
        },
      });

      if (!enrollment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enrollment not found",
        });
      }

      // Get lesson progress
      const lessonProgress = await db.lessonProgress.findUnique({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollment.id,
            lessonId: input.lessonId,
          },
        },
      });

      return lessonProgress;
    }),

  /**
   * Get course completion percentage
   */
  getCourseProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to access progress",
        });
      }

      // Get enrollment with progress
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: input.courseId,
          },
        },
      });

      if (!enrollment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enrollment not found",
        });
      }

      return {
        completionPercentage: enrollment.completionPercentage,
        status: enrollment.status,
        completedAt: enrollment.completedAt,
      };
    }),
});