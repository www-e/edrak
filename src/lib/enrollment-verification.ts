import { NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { db } from '@/server/db';
import { EnrollmentStatus } from '@prisma/client';
import { SessionUser } from '@/types/auth';

/**
 * Simple and fast enrollment verification
 */
export class EnrollmentVerification {
  private static enrollmentCache = new Map<string, { isEnrolled: boolean; expires: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Verify user enrollment in course with simple caching
   */
  static async verifyEnrollment(userId: string, courseId: string): Promise<boolean> {
    const cacheKey = `${userId}:${courseId}`;
    const cached = this.enrollmentCache.get(cacheKey);

    // Check cache first
    if (cached && cached.expires > Date.now()) {
      return cached.isEnrolled;
    }

    // Database lookup
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      select: {
        status: true
      }
    });

    const isEnrolled = !!(enrollment && enrollment.status === EnrollmentStatus.ACTIVE);

    // Cache result
    this.enrollmentCache.set(cacheKey, {
      isEnrolled,
      expires: Date.now() + this.CACHE_TTL
    });

    return isEnrolled;
  }

  /**
   * Middleware function for API routes requiring enrollment verification
   */
  static async requireEnrollment(req: NextRequest, courseId: string) {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return {
          error: 'Authentication required',
          status: 401
        };
      }

      const userId = (session.user as SessionUser).id;
      if (!userId) {
        return {
          error: 'Invalid session',
          status: 401
        };
      }

      const isEnrolled = await this.verifyEnrollment(userId, courseId);

      if (!isEnrolled) {
        return {
          error: 'Enrollment required to access this content',
          status: 403
        };
      }

      return {
        success: true,
        userId,
        courseId
      };
    } catch (error) {
      console.error('Enrollment verification error:', error);
      return {
        error: 'Internal server error',
        status: 500
      };
    }
  }

  /**
   * Clear enrollment cache for a specific user (useful after enrollment changes)
   */
  static clearUserCache(userId: string) {
    for (const key of this.enrollmentCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        this.enrollmentCache.delete(key);
      }
    }
  }

  /**
   * Clear all enrollment cache (useful for admin operations)
   */
  static clearAllCache() {
    this.enrollmentCache.clear();
  }

}

/**
 * Utility function to extract course ID from request parameters
 */
export function extractCourseId(params: { courseId: string } | { slug: string }, type: 'id' | 'slug' = 'id'): string {
  if (type === 'slug') {
    return (params as { slug: string }).slug;
  }
  return (params as { courseId: string }).courseId;
}

/**
 * Utility function to resolve course slug to course ID (with caching)
 */
const slugToIdCache = new Map<string, { courseId: string; expires: number }>();
const SLUG_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function resolveCourseSlug(slug: string): Promise<string | null> {
  const cached = slugToIdCache.get(slug);

  if (cached && cached.expires > Date.now()) {
    return cached.courseId;
  }

  const course = await db.course.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!course) {
    return null;
  }

  slugToIdCache.set(slug, {
    courseId: course.id,
    expires: Date.now() + SLUG_CACHE_TTL
  });

  return course.id;
}