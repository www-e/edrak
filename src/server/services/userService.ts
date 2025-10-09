import { db } from "@/server/db";
import bcrypt from 'bcryptjs';
import { CreateUserInput, UpdateUserInput, ResetPasswordInput } from '@/types/admin';
import { DataAccess } from '@/lib/data-access';

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

    const user = await db.user.create({
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
   * Retrieves all users with pagination and search support.
   */
  static async getAllUsers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 50, search, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};

    const searchFields = ['username', 'email', 'firstName', 'lastName'];
    const where = DataAccess.buildSearchQuery(search, searchFields);

    const { data: users, pagination } = await DataAccess.executeParallelQuery(
      () => db.user.findMany({
        where,
        select: DataAccess.getUserSelect(),
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      () => db.user.count({ where }),
      page,
      limit
    );

    return {
      users,
      ...pagination
    };
  }
    /**
   * Retrieves a single user by their ID.
   * @param id - The ID of the user.
   */
  static async getUserById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: {
        ...DataAccess.getUserSelect(),
        email: true,
        phoneNumber: true,
        secondPhoneNumber: true,
        categoryPreference: true,
        referralSource: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Updates a user's information.
   * @param data - The data to update.
   */
  static async updateUser(data: UpdateUserInput) {
    const { id, ...rest } = data;
    return db.user.update({
      where: { id },
      data: rest,
      select: {
        id: true,
        username: true,
        email: true,
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
    await db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return { success: true, message: "Password reset successfully." };
  }
}