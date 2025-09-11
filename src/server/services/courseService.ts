import { PrismaClient } from '@prisma/client';

// Placeholder for Zod schemas we will create later
// For now, we'll use Prisma's generated types.
import { Course, Lesson, Attachment } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service class for admin-related course and content management.
 */
export class AdminCourseService {
  /**
   * Creates a new course and assigns it to a professor.
   * @param data - The data for the new course.
   */
  static async createCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>) {
    return prisma.course.create({ data });
  }

  /**
   * Creates a new lesson for a specific course.
   * @param data - The data for the new lesson.
   */
  static async createLesson(data: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>) {
    return prisma.lesson.create({ data });
  }

  /**
   * Soft deletes a lesson by setting the isDeleted flag.
   * @param lessonId - The ID of the lesson to soft delete.
   */
  static async softDeleteLesson(lessonId: string) {
    return prisma.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  /**
   * Restores a soft-deleted lesson.
   * @param lessonId - The ID of the lesson to restore.
   */
  static async restoreLesson(lessonId: string) {
    return prisma.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: false, deletedAt: null },
    });
  }
  
  /**
   * Creates an attachment record for a lesson.
   * Note: This only handles the database record. The file upload to Bunny CDN
   * will be handled by a separate procedure that calls this service.
   * @param data - The data for the new attachment.
   */
  static async createAttachment(data: Omit<Attachment, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.attachment.create({ data });
  }
    
  /**
   * Deletes an attachment record from the database.
   * Note: This only handles the database record. The file deletion from Bunny CDN
   * will be handled by a separate procedure.
   * @param attachmentId - The ID of the attachment to delete.
   */
  static async deleteAttachment(attachmentId: string) {
    return prisma.attachment.delete({
        where: { id: attachmentId },
    });
  }
}