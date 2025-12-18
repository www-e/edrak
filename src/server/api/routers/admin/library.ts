import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { LibraryService } from '@/server/services/libraryService';

export const adminLibraryRouter = createTRPCRouter({
  // Library Items CRUD
  createLibraryItem: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        type: z.enum(['FOOD', 'EXERCISE', 'NUTRITION_SET']),
        description: z.string().optional(),
        metadata: z.any().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user has admin role
      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('Only admins can create library items');
      }

      return await LibraryService.createLibraryItem({
        name: input.name,
        type: input.type,
        description: input.description,
        metadata: input.metadata,
        imageUrl: input.imageUrl,
      });
    }),

  getAllLibraryItems: protectedProcedure
    .input(
      z.object({
        type: z.enum(['FOOD', 'EXERCISE', 'NUTRITION_SET']).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify user has admin role
      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('Only admins can view library items');
      }

      return await LibraryService.getLibraryItems({
        type: input.type,
        search: input.search,
      });
    }),

  getLibraryItemById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify user has admin role
      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('Only admins can view library items');
      }

      return await LibraryService.getLibraryItemById(input.id);
    }),

  updateLibraryItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required').optional(),
        type: z.enum(['FOOD', 'EXERCISE', 'NUTRITION_SET']).optional(),
        description: z.string().optional(),
        metadata: z.any().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user has admin role
      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('Only admins can update library items');
      }

      const { id, ...updateData } = input;
      return await LibraryService.updateLibraryItem(id, updateData);
    }),

  deleteLibraryItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user has admin role
      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('Only admins can delete library items');
      }

      return await LibraryService.deleteLibraryItem(input.id);
    }),
});