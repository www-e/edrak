import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const notesRouter = createTRPCRouter({
  // Get all notes for a specific lesson
  getByLesson: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        courseId: z.string(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const notes = await ctx.db.note.findMany({
        where: {
          userId: ctx.session.user.id!,
          lessonId: input.lessonId,
          courseId: input.courseId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });

      const total = await ctx.db.note.count({
        where: {
          userId: ctx.session.user.id!,
          lessonId: input.lessonId,
          courseId: input.courseId,
        },
      });

      return {
        notes,
        total,
        page: input.page,
        limit: input.limit,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  // Get all notes for a course
  getByCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const notes = await ctx.db.note.findMany({
        where: {
          userId: ctx.session.user.id!,
          courseId: input.courseId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          lesson: {
            select: {
              title: true,
              order: true,
            },
          },
        },
      });

      return notes;
    }),

  // Create a new note
  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        courseId: z.string(),
        content: z.string().min(1).max(1000),
        timestamp: z.number().min(0), // Video timestamp in seconds
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.note.create({
        data: {
          userId: ctx.session.user.id!,
          lessonId: input.lessonId,
          courseId: input.courseId,
          content: input.content,
          timestamp: input.timestamp,
        },
      });

      return note;
    }),

  // Update an existing note
  update: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify that the note belongs to the current user
      const note = await ctx.db.note.findFirst({
        where: {
          id: input.noteId,
          userId: ctx.session.user.id!,
        },
      });

      if (!note) {
        throw new Error("Note not found or access denied");
      }

      const updatedNote = await ctx.db.note.update({
        where: {
          id: input.noteId,
        },
        data: {
          content: input.content,
          updatedAt: new Date(),
        },
      });

      return updatedNote;
    }),

  // Delete a note
  delete: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify that the note belongs to the current user
      const note = await ctx.db.note.findFirst({
        where: {
          id: input.noteId,
          userId: ctx.session.user.id!,
        },
      });

      if (!note) {
        throw new Error("Note not found or access denied");
      }

      await ctx.db.note.delete({
        where: {
          id: input.noteId,
        },
      });

      return { success: true };
    }),
});