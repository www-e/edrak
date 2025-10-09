import { NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { db } from '@/server/db';
import { EnrollmentStatus } from '@prisma/client';
import { SessionUser } from '@/types/auth';
import { CacheService } from '@/server/services/cacheService';

/**
 * Simple and fast enrollment verification
 */
export class EnrollmentVerification {

  /**
    * Verify user enrollment in course with unified caching
    */
   static async verifyEnrollment(userId: string, courseId: string): Promise<boolean> {
     const cacheKey = CacheService.createKey('enrollment', userId, courseId);

     // Check cache first
     const cached = CacheService.get<boolean>(cacheKey);
     if (cached !== null) {
       return cached;
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

     // Cache result for 5 minutes
     CacheService.set(cacheKey, isEnrolled, 5 * 60 * 1000);

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
     // Get all cache keys and filter enrollment keys for this user
     const allKeys = CacheService.getStats().items.map(item => item.key);
     const userEnrollmentKeys = allKeys.filter(key => key.startsWith(`enrollment:${userId}:`));

     userEnrollmentKeys.forEach(key => {
       CacheService.delete(key);
     });
   }

   /**
    * Clear all enrollment cache (useful for admin operations)
    */
   static clearAllCache() {
     // Get all cache keys and filter enrollment keys
     const allKeys = CacheService.getStats().items.map(item => item.key);
     const enrollmentKeys = allKeys.filter(key => key.startsWith('enrollment:'));

     enrollmentKeys.forEach(key => {
       CacheService.delete(key);
     });
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
 * Utility function to resolve course slug to course ID (with unified caching)
 */
export async function resolveCourseSlug(slug: string): Promise<string | null> {
  const cacheKey = CacheService.createKey('course-slug', slug);

  // Check cache first
  const cached = CacheService.get<string>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const course = await db.course.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!course) {
    return null;
  }

  // Cache result for 10 minutes
  CacheService.set(cacheKey, course.id, 10 * 60 * 1000);

  return course.id;
}