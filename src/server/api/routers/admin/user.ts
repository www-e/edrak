import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { AdminUserService } from "@/server/services/userService";
import { CreateUserInputSchema, UpdateUserInputSchema, ResetPasswordInputSchema } from "@/types/admin";
// NOTE: For now, we use `adminProcedure`. We will upgrade this to a more secure
// `adminProcedure` in the next batch to lock it down to only Admins.

export const adminUserRouter = createTRPCRouter({
  /**
   * Get a list of all users.
   */
  getAll: adminProcedure
    .query(async () => {
      return AdminUserService.getAllUsers();
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