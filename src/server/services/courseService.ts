import { db } from "@/server/db";
import type { CreateCourseInput, CreateLessonInput, UpdateCourseInput } from '@/types/admin';

export class AdminCourseService {
  static async createCourse(data: CreateCourseInput) {
    return db.course.create({ data: { ...data, categoryId: data.categoryId ?? null } });
  }
  
  static async updateCourse(id: string, data: UpdateCourseInput['data']) {
    return db.course.update({ where: { id }, data });
  }

  static async getAllCourses() {
    return db.course.findMany({
      select: { 
        id: true, 
        title: true, 
        description: true,
        price: true, 
        language: true,
        visibility: true, 
        createdAt: true,
        professor: { select: { firstName: true, lastName: true } },
       },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCourseById(id: string) {
    return db.course.findUnique({
      where: { id },
      include: {
        professor: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        lessons: { where: { isDeleted: false }, orderBy: { order: 'asc' } },
      },
    });
  }

  static async createLesson(data: CreateLessonInput) {
    return db.lesson.create({ data: { ...data, videoUrl: data.videoUrl ?? null } });
  }
  
  // ... (The rest of the methods are correct and unchanged) ...
  static async getLesson(id: string) { return db.lesson.findUnique({ where: { id } }); }
  static async getLessonAttachments(lessonId: string) { return db.attachment.findMany({ where: { lessonId } }); }
  static async softDeleteLesson(lessonId: string) { return db.lesson.update({ where: { id: lessonId }, data: { isDeleted: true, deletedAt: new Date() } }); }
  static async restoreLesson(lessonId: string) { return db.lesson.update({ where: { id: lessonId }, data: { isDeleted: false, deletedAt: null } }); }
}