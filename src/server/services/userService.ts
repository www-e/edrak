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

    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' as const } },
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
    /**
   * Retrieves a single user by their ID.
   * @param id - The ID of the user.
   */
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        secondPhoneNumber: true,
        categoryPreference: true,
        referralSource: true,
        role: true,
        isActive: true,
        createdAt: true,
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