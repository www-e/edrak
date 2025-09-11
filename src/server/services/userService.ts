import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CreateUserInput, UpdateUserInput, ResetPasswordInput } from '@/types/admin';

const prisma = new PrismaClient();

/**
 * Service class for admin-related user management.
 */
export class AdminUserService {
  /**
   * Creates a new user with a specified role.
   * @param data - The data for the new user.
   */
  static async createUser(data: CreateUserInput) {
    const { password, ...rest } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
  
  /**
   * Retrieves all users.
   */
  static async getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
        }
    });
  }

  /**
   * Updates a user's information.
   * @param data - The data to update.
   */
  static async updateUser(data: UpdateUserInput) {
    const { id, ...rest } = data;
    return prisma.user.update({
      where: { id },
      data: rest,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      }
    });
  }

  /**
   * Resets a user's password.
   * @param data - The user ID and new password.
   */
  static async resetPassword(data: ResetPasswordInput) {
    const { id, newPassword } = data;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return { success: true, message: "Password reset successfully." };
  }
}