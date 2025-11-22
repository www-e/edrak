import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const messagesRouter = createTRPCRouter({
  // Get messages for a specific course
  getByCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.professorMessage.findMany({
        where: {
          courseId: input.courseId,
          OR: [
            { senderId: ctx.session.user.id! }, // Messages sent by the user
            { recipientId: ctx.session.user.id! } // Messages received by the user
          ]
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            }
          },
          recipient: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            }
          },
          lesson: {
            select: {
              title: true,
            }
          }
        },
      });

      return messages;
    }),

  // Get messages sent by user
  getSent: protectedProcedure
    .query(async ({ ctx }) => {
      const messages = await ctx.db.professorMessage.findMany({
        where: {
          senderId: ctx.session.user.id!,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          recipient: {
            select: {
              firstName: true,
              lastName: true,
            }
          },
          course: {
            select: {
              title: true,
            }
          },
          lesson: {
            select: {
              title: true,
            }
          }
        },
      });

      return messages;
    }),

  // Create a new message to professor
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        recipientId: z.string(), // Professor ID
        lessonId: z.string().optional(),
        title: z.string().min(1).max(200),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify that the user is enrolled in the course
      const enrollment = await ctx.db.enrollment.findFirst({
        where: {
          userId: ctx.session.user.id!,
          courseId: input.courseId,
        },
      });

      if (!enrollment) {
        throw new Error("You must be enrolled in this course to send messages to the professor");
      }

      // Verify that the recipient is the professor of this course
      const course = await ctx.db.course.findFirst({
        where: {
          id: input.courseId,
          professorId: input.recipientId,
        },
      });

      if (!course) {
        throw new Error("Invalid recipient for this course");
      }

      const message = await ctx.db.professorMessage.create({
        data: {
          senderId: ctx.session.user.id!,
          recipientId: input.recipientId,
          courseId: input.courseId,
          lessonId: input.lessonId,
          title: input.title,
          content: input.content,
        },
      });

      return message;
    }),

  // Update an existing message (only content/title if not yet read)
  update: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
        title: z.string().min(1).max(200).optional(),
        content: z.string().min(1).max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.professorMessage.findFirst({
        where: {
          id: input.messageId,
          senderId: ctx.session.user.id!,
          status: "PENDING", // Only allow editing if not read/replied
        },
      });

      if (!message) {
        throw new Error("Message not found, already read, or access denied");
      }

      const updatedMessage = await ctx.db.professorMessage.update({
        where: {
          id: input.messageId,
        },
        data: {
          title: input.title,
          content: input.content,
          updatedAt: new Date(),
        },
      });

      return updatedMessage;
    }),

  // Mark a message as read
  markAsRead: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.professorMessage.findFirst({
        where: {
          id: input.messageId,
          recipientId: ctx.session.user.id!, // Only recipient can mark as read
        },
      });

      if (!message) {
        throw new Error("Message not found or access denied");
      }

      const updatedMessage = await ctx.db.professorMessage.update({
        where: {
          id: input.messageId,
        },
        data: {
          status: "READ",
          updatedAt: new Date(),
        },
      });

      return updatedMessage;
    }),
});