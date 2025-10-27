import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { EnrollmentStatus } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { EnrollmentVerification } from "@/lib/enrollment-verification";

export const studentCoursesRouter = createTRPCRouter({
  /**
   * Enroll in a free course (price <= 0)
   */
  enrollInFreeCourse: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID is required" });
      }

      // Check if course exists and is free
      const course = await db.course.findUnique({
        where: { id: input.courseId },
        select: { id: true, price: true, visibility: true, title: true }
      });

      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }

      if (course.visibility !== "PUBLISHED") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Course is not available for enrollment" });
      }

      if (course.price > 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This endpoint is only for free courses" });
      }

      // Check if already enrolled
      const existingEnrollment = await db.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: input.courseId } }
      });

      if (existingEnrollment) {
        if (existingEnrollment.status === "ACTIVE") {
          throw new TRPCError({ code: "CONFLICT", message: "You are already enrolled in this course" });
        } else {
          // Reactivate cancelled enrollment
          const reactivatedEnrollment = await db.enrollment.update({
            where: { id: existingEnrollment.id },
            data: { status: "ACTIVE" }
          });
          return { enrollmentId: reactivatedEnrollment.id, isNewEnrollment: false };
        }
      }

      // Create new enrollment
      const newEnrollment = await db.enrollment.create({
        data: {
          userId,
          courseId: input.courseId,
          status: "ACTIVE"
        }
      });

      return { enrollmentId: newEnrollment.id, isNewEnrollment: true };
    }),

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

    const courses = enrollments.map(enrollment => ({
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

    return courses;
  }),

  /**
   * Get full course details with lessons for enrolled students only
   * This includes lesson content that requires enrollment verification
   */
  getCourseDetails: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID is required." });

      // Verify enrollment first
      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Enrollment required to access course details"
        });
      }

      // Get full course details with lessons
      const course = await db.course.findUnique({
        where: {
          id: input.courseId,
          visibility: "PUBLISHED" // Ensure course is still published
        },
        include: {
          category: {
            select: {
              name: true
            }
          },
          professor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true
            }
          },
          lessons: {
            where: {
              isDeleted: false,
              isVisible: true
            },
            orderBy: {
              order: "asc"
            },
            select: {
              id: true,
              title: true,
              content: true,
              order: true,
              isVisible: true,
              duration: true,
              createdAt: true,
              // Include attachments for each lesson
              attachments: {
                select: {
                  id: true,
                  name: true,
                  fileName: true,
                  mimeType: true,
                  fileSize: true,
                  bunnyCdnUrl: true,
                  createdAt: true
                },
                orderBy: {
                  createdAt: 'asc'
                }
              },
              youtubeUrl: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              lessons: {
                where: {
                  isDeleted: false,
                  isVisible: true
                }
              }
            }
          }
        }
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found or no longer available"
        });
      }

      return {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          price: course.price,
          language: course.language,
          slug: course.slug,
          rating: course.rating,
          ratingCount: course.ratingCount,
          createdAt: course.createdAt,
          category: course.category,
          professor: course.professor,
          lessonCount: course._count.lessons,
          enrollmentCount: course._count.enrollments,
          lessons: course.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            order: lesson.order,
            duration: lesson.duration,
            isVisible: lesson.isVisible,
            createdAt: lesson.createdAt,
            youtubeUrl: lesson.youtubeUrl,
            attachments: lesson.attachments
          }))
        }
      };
    }),
});