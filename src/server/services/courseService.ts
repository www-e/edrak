import { db } from "@/server/db";
import { CourseVisibility, Prisma } from "@prisma/client";
import { createSearchConditions } from "@/lib/search";
import { courseDataTransformer, lessonDataTransformer } from "@/lib/data-transform";
import { DataAccess } from "@/lib/data-access";
import { cacheCourseData, getCachedData, generateCourseCacheKey, cacheData } from "@/lib/redis";
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

    // Generate cache key for admin course listings
    const cacheKey = generateCourseCacheKey({
      type: 'admin_courses',
      page,
      limit,
      search: search || '',
      sortBy,
      sortOrder,
    });

    // Try Redis cache first (admin courses change moderately)
    const cachedResult = await getCachedData<{
      courses: Array<{
        id: string;
        title: string;
        description: string;
        price: number;
        language: string;
        visibility: string;
        createdAt: Date;
        professor: { firstName: string; lastName: string };
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Build search conditions using utility
    const where = createSearchConditions(search, ['title', 'description']) as Prisma.CourseWhereInput;

    const { data: courses, pagination } = await DataAccess.executeParallelQuery(
      () => db.course.findMany({
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      () => db.course.count({ where }),
      page,
      limit
    );

    const result = {
      courses,
      pagination
    };

    // Cache for 3 minutes (admin courses change moderately)
    await cacheData(cacheKey, result, 180);

    return result;
  }

  static async getCourseById(id: string) {
    return db.course.findUnique({
      where: { id },
      include: {
        professor: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        lessons: {
          where: { isDeleted: false },
          orderBy: { order: "asc" },
          select: {
            ...DataAccess.getLessonSelect(),
            youtubeUrl: true,
            attachments: {
              select: DataAccess.getAttachmentSelect(),
              orderBy: { createdAt: 'asc' }
            }
          }
        },
      },
    });
  }

  static async createLesson(data: CreateLessonInput) {
    const transformedData = lessonDataTransformer(data) as CreateLessonInput;
    return db.lesson.create({
      data: {
        ...transformedData,
        youtubeUrl: data.youtubeUrl || null,
      },
    });
  }

  static async updateLesson(data: UpdateLessonInput) {
    const { id, ...updateData } = data;
    return db.lesson.update({
      where: { id },
      data: {
        ...updateData,
        youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : undefined,
      },
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
   * Enhanced with Redis caching for improved performance
   */
  static async getPublishedCourses(filters?: {
    category?: string;
    price?: 'free' | 'paid';
    search?: string;
    page?: number;
    limit?: number;
  }) {
    // Generate cache key for consistent caching
    const cacheKey = generateCourseCacheKey({
      category: filters?.category || '',
      price: filters?.price || '',
      search: filters?.search || '',
      page: filters?.page || 1,
      limit: filters?.limit || 12,
    });

    // Define proper types for cached data
    type CachedCourseData = {
      courses: Array<{
        id: string;
        title: string;
        description: string;
        price: number;
        language: string;
        slug: string;
        rating: number;
        ratingCount: number;
        createdAt: Date;
        category: { name: string } | null;
        professor: { firstName: string; lastName: string };
        _count: { enrollments: number };
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };

    // Try to get from cache first
    const cachedResult = await getCachedData<CachedCourseData>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

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

    const { data: courses, pagination } = await DataAccess.executeParallelQuery(
      () => db.course.findMany({
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
        skip: (page - 1) * limit,
        take: limit
      }),
      () => db.course.count({ where }),
      page,
      limit
    );

    const result = { courses, pagination };

    // Cache the result for 2 hours (courses don't change frequently)
    await cacheCourseData(cacheKey, result);

    return result;
  }

  /**
    * Get a specific course by its slug (PUBLIC - No lesson details)
    * Only returns basic course information for preview/marketing with Redis caching
    */
   static async getCourseBySlug(slug: string) {
     const cacheKey = `course:slug:${slug}`;

     // Try Redis cache first (course details change infrequently)
     const cachedCourse = await getCachedData<{
       id: string;
       title: string;
       description: string;
       price: number;
       language: string;
       slug: string;
       rating: number;
       ratingCount: number;
       createdAt: Date;
       category: { name: string } | null;
       professor: { id: string; firstName: string; lastName: string; username: string };
       _count: { enrollments: number; lessons: number };
     } | null>(cacheKey);
     if (cachedCourse) {
       return cachedCourse;
     }

     const course = await db.course.findUnique({
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

     // Cache for 1 hour (course details change infrequently)
     if (course) {
       await cacheData(cacheKey, course, 3600);
     }

     return course;
   }
}