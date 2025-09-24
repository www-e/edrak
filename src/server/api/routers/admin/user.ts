import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminUserService } from "@/server/services/userService";
import { CreateUserInputSchema, UpdateUserInputSchema, ResetPasswordInputSchema } from "@/types/admin";
import { z } from "zod";
// NOTE: For now, we use `adminProcedure`. We will upgrade this to a more secure
// `adminProcedure` in the next batch to lock it down to only Admins.

export const adminUserRouter = createTRPCRouter({
  /**
   * Get a list of all users with pagination and search support.
   */
  getAll: adminProcedure
    .input(z.object({
      page: z.number().min(1).optional(),
      limit: z.number().min(1).max(100).optional(),
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }).optional())
    .query(async ({ input }) => {
      return AdminUserService.getAllUsers(input);
  }),
    /**
   * Get a single user by ID.
   */
  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return AdminUserService.getUserById(input.id);
    }),

  /**
   * Create a new user (Student, Professor, or Admin).
   */
  create: adminProcedure
    .input(CreateUserInputSchema)
    .mutation(async ({ input }) => {
      return AdminUserService.createUser(input);
    }),

  /**
   * Update an existing user's details.
   */
  update: adminProcedure
    .input(UpdateUserInputSchema)
    .mutation(async ({ input }) => {
      return AdminUserService.updateUser(input);
    }),
    
  /**
   * Reset a user's password.
   */
  resetPassword: adminProcedure
    .input(ResetPasswordInputSchema)
    .mutation(async ({ input }) => {
        return AdminUserService.resetPassword(input);
    }),
});