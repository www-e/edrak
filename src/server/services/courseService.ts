import { db } from "@/server/db";
import { CourseVisibility, Prisma } from "@prisma/client";
import { createPaginationResult } from "@/lib/pagination";
import { createSearchConditions } from "@/lib/search";
import { courseDataTransformer, lessonDataTransformer } from "@/lib/data-transform";
import type {
  CreateCourseInput,
  CreateLessonInput,
  UpdateCourseInput,
  UpdateLessonInput,
} from "@/types/admin";

export class AdminCourseService {
  static async createCourse(data: CreateCourseInput) {
    const transformedData = courseDataTransformer(data) as CreateCourseInput;
    return db.course.create({
      data: transformedData,
    });
  }

  static async updateCourse(data: UpdateCourseInput) {
    const { id, ...updateData } = data;
    return db.course.update({
      where: { id },
      data: updateData,
    });
  }

  static async getAllCourses(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};

    // Build search conditions using utility
    const where = createSearchConditions(search, ['title', 'description']) as Prisma.CourseWhereInput;

    const skip = (page - 1) * limit;

    // Execute queries in parallel for better performance
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          language: true,
          visibility: true,
          createdAt: true,
          professor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      db.course.count({ where })
    ]);

    return {
      courses,
      pagination: createPaginationResult(page, limit, total)
    };
  }

  static async getCourseById(id: string) {
    return db.course.findUnique({
      where: { id },
      include: {
        professor: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        lessons: { where: { isDeleted: false }, orderBy: { order: "asc" } },
      },
    });
  }

  static async createLesson(data: CreateLessonInput) {
    const transformedData = lessonDataTransformer(data) as CreateLessonInput;
    return db.lesson.create({
      data: transformedData,
    });
  }

  static async updateLesson(data: UpdateLessonInput) {
    const { id, ...updateData } = data;
    return db.lesson.update({
      where: { id },
      data: updateData,
    });
  }

  static async getLesson(id: string) {
    return db.lesson.findUnique({ where: { id } });
  }

  static async getLessonAttachments(lessonId: string) {
    return db.attachment.findMany({ where: { lessonId } });
  }

  static async softDeleteLesson(lessonId: string) {
    return db.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  static async restoreLesson(lessonId: string) {
    return db.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: false, deletedAt: null },
    });
  }
}

export class CourseService {
  /**
   * Get all published courses with relevant information for public display
   */
  static async getPublishedCourses(filters?: {
    category?: string;
    price?: 'free' | 'paid';
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.CourseWhereInput = {
      visibility: CourseVisibility.PUBLISHED
    };

    // Add category filter - get categoryId first if category name is provided
    if (filters?.category) {
      const category = await db.category.findFirst({
        where: { name: filters.category },
        select: { id: true }
      });
      if (category) {
        where.categoryId = category.id;
      } else {
        // If category not found, return no results
        where.id = 'non-existent-id';
      }
    }

    // Add price filter
    if (filters?.price === 'free') {
      where.price = 0;
    } else if (filters?.price === 'paid') {
      where.price = { gt: 0 };
    }

    // Add search filter using utility
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const [courses, totalCount] = await Promise.all([
      db.course.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          language: true,
          slug: true,
          rating: true,
          ratingCount: true,
          createdAt: true,
          category: {
            select: {
              name: true
            }
          },
          professor: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              enrollments: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      db.course.count({ where })
    ]);

    return {
      courses,
      pagination: createPaginationResult(page, limit, totalCount)
    };
  }

  /**
   * Get a specific course by its slug (PUBLIC - No lesson details)
   * Only returns basic course information for preview/marketing
   */
  static async getCourseBySlug(slug: string) {
    return db.course.findUnique({
      where: {
        slug,
        visibility: CourseVisibility.PUBLISHED
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        language: true,
        slug: true,
        rating: true,
        ratingCount: true,
        createdAt: true,
        category: {
          select: {
            name: true
          }
        },
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: {
              where: {
                isDeleted: false,
                isVisible: true
              }
            }
          }
        }
      }
    });
  }
}