import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { QuizService } from "@/server/services/quizService";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Validation schemas
const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).min(2, "At least 2 options required").max(6, "Maximum 6 options allowed"),
  correctAnswer: z.number().min(0).max(5),
  order: z.number().min(1),
});

const createQuizSchema = z.object({
  courseId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  passingScore: z.number().min(0).max(100).default(70),
  questions: z.array(quizQuestionSchema).min(1, "At least 1 question required"),
});

const updateQuizSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  passingScore: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  questions: z.array(quizQuestionSchema).optional(),
});

export const adminQuizRouter = createTRPCRouter({
  /**
   * Create a new quiz
   */
  create: protectedProcedure
    .input(createQuizSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin or professor
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.role !== "PROFESSOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can create quizzes",
        });
      }

      // Validate that either courseId or lessonId is provided
      if (!input.courseId && !input.lessonId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either courseId or lessonId must be provided",
        });
      }

      return QuizService.createQuiz(input);
    }),

  /**
   * Update an existing quiz
   */
  update: protectedProcedure
    .input(updateQuizSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.role !== "PROFESSOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can update quizzes",
        });
      }

      return QuizService.updateQuiz(input);
    }),

  /**
   * Get quiz by ID (admin view with correct answers)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.role !== "PROFESSOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can view quiz details",
        });
      }

      const quiz = await QuizService.getQuizById(input.id);

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      return quiz;
    }),

  /**
   * Get all quizzes for a course
   */
  getByCourse: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.role !== "PROFESSOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can view course quizzes",
        });
      }

      return QuizService.getQuizzesByCourse(input.courseId);
    }),

  /**
   * Delete a quiz
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.role !== "PROFESSOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can delete quizzes",
        });
      }

      return QuizService.deleteQuiz(input.id);
    }),

  /**
   * Toggle quiz active status
   */
  toggleActive: protectedProcedure
    .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.role !== "PROFESSOR") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can toggle quiz status",
        });
      }

      return QuizService.updateQuiz({
        id: input.id,
        isActive: input.isActive,
      });
    }),
});
