import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { QuizService } from "@/server/services/quizService";
import { EnrollmentVerification } from "@/lib/enrollment-verification";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const studentQuizRouter = createTRPCRouter({
  /**
   * Get quiz by ID (student view - no correct answers)
   */
  getById: protectedProcedure
    .input(z.object({ quizId: z.string().uuid(), courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is required",
        });
      }

      // Verify enrollment
      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to access quizzes",
        });
      }

      const quiz = await QuizService.getQuizForStudent(input.quizId);

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      // Check if user has already passed
      const hasPassed = await QuizService.hasUserPassedQuiz(quiz.id, userId);

      return {
        ...quiz,
        hasPassed,
      };
    }),

  /**
   * Get quiz for a lesson (student view - no correct answers)
   */
  getByLesson: protectedProcedure
    .input(z.object({ lessonId: z.string().uuid(), courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is required",
        });
      }

      // Verify enrollment
      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to access quizzes",
        });
      }

      const quiz = await QuizService.getQuizByLesson(input.lessonId);

      if (!quiz) {
        return null; // No quiz for this lesson
      }

      // Check if user has already passed
      const hasPassed = await QuizService.hasUserPassedQuiz(quiz.id, userId);

      return {
        ...quiz,
        hasPassed,
      };
    }),

  /**
   * Get final course quiz (student view - no correct answers)
   */
  getFinalCourseQuiz: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is required",
        });
      }

      // Verify enrollment
      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to access quizzes",
        });
      }

      const quiz = await QuizService.getFinalCourseQuiz(input.courseId);

      if (!quiz) {
        return null; // No final quiz for this course
      }

      // Check if user has already passed
      const hasPassed = await QuizService.hasUserPassedQuiz(quiz.id, userId);

      return {
        ...quiz,
        hasPassed,
      };
    }),

  /**
   * Submit quiz attempt
   */
  submitAttempt: protectedProcedure
    .input(
      z.object({
        quizId: z.string().uuid(),
        courseId: z.string().uuid(),
        answers: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is required",
        });
      }

      // Verify enrollment
      const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, input.courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be enrolled in this course to take quizzes",
        });
      }

      return QuizService.submitQuizAttempt(input.quizId, userId, input.answers);
    }),

  /**
   * Check if user has passed a quiz
   */
  checkPassed: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is required",
        });
      }

      const hasPassed = await QuizService.hasUserPassedQuiz(input.quizId, userId);
      return { hasPassed };
    }),

  /**
   * Get user's quiz attempts (for history/review)
   */
  getMyAttempts: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is required",
        });
      }

      return QuizService.getUserQuizAttempts(input.quizId, userId);
    }),

  /**
   * Get quiz attempt review data (includes question details without revealing correct answers)
   */
  getAttemptReview: protectedProcedure
    .input(z.object({
      quizId: z.string().uuid(),
      attemptId: z.string().uuid()
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify enrollment in the course
      const quiz = await QuizService.getQuizById(input.quizId);
      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      if (quiz.courseId) {
        const isEnrolled = await EnrollmentVerification.verifyEnrollment(userId, quiz.courseId);
        if (!isEnrolled) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You must be enrolled in this course to access quiz review",
          });
        }
      }

      // Get the specific attempt
      const attempt = await QuizService.getQuizAttempt(input.attemptId, userId);
      if (!attempt || attempt.quizId !== input.quizId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz attempt not found",
        });
      }

      // Get quiz questions (this will not include correct answers to maintain quiz integrity)
      const quizForStudent = await QuizService.getQuizForStudent(input.quizId);
      if (!quizForStudent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      return {
        attempt,
        quiz: quizForStudent,
      };
    }),
});
