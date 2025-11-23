import { db } from "@/server/db";
import type { Prisma } from "@prisma/client";

export interface CreateQuizInput {
  courseId?: string;
  lessonId?: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    order: number;
  }>;
}

export interface UpdateQuizInput {
  id: string;
  title?: string;
  description?: string;
  passingScore?: number;
  isActive?: boolean;
  questions?: Array<{
    id?: string;
    question: string;
    options: string[];
    correctAnswer: number;
    order: number;
  }>;
}

export class QuizService {
  /**
   * Create a new quiz with questions
   */
  static async createQuiz(data: CreateQuizInput) {
    return db.quiz.create({
      data: {
        courseId: data.courseId || null,
        lessonId: data.lessonId || null,
        title: data.title,
        description: data.description,
        passingScore: data.passingScore,
        questions: {
          create: data.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: q.order,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  /**
   * Update an existing quiz
   */
  static async updateQuiz(data: UpdateQuizInput) {
    const { id, questions, ...updateData } = data;

    // If questions are provided, delete old ones and create new ones
    if (questions) {
      await db.quizQuestion.deleteMany({
        where: { quizId: id },
      });
    }

    return db.quiz.update({
      where: { id },
      data: {
        ...updateData,
        ...(questions && {
          questions: {
            create: questions.map((q) => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              order: q.order,
            })),
          },
        }),
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  /**
   * Get quiz by ID (admin view - includes correct answers)
   */
  static async getQuizById(id: string) {
    return db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Get quiz for student (excludes correct answers)
   */
  static async getQuizForStudent(id: string) {
    const quiz = await db.quiz.findUnique({
      where: { id, isActive: true },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });

    return quiz;
  }

  /**
   * Get all quizzes for a course
   */
  static async getQuizzesByCourse(courseId: string) {
    return db.quiz.findMany({
      where: { courseId },
      include: {
        questions: {
          select: {
            id: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get quiz for a specific lesson
   */
  static async getQuizByLesson(lessonId: string) {
    return db.quiz.findFirst({
      where: { lessonId, isActive: true },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });
  }

  /**
   * Get final course quiz (quiz with courseId but no lessonId)
   */
  static async getFinalCourseQuiz(courseId: string) {
    return db.quiz.findFirst({
      where: {
        courseId,
        lessonId: null,
        isActive: true,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });
  }

  /**
   * Delete a quiz
   */
  static async deleteQuiz(id: string) {
    return db.quiz.delete({
      where: { id },
    });
  }

  /**
   * Submit quiz attempt and calculate score
   */
  static async submitQuizAttempt(
    quizId: string,
    userId: string,
    answers: number[]
  ) {
    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await db.quizAttempt.create({
      data: {
        quizId,
        userId,
        answers,
        score,
        passed,
      },
    });

    // If passed, create progress milestone (only if quiz has courseId)
    if (passed && quiz.courseId) {
      await db.progressMilestone.upsert({
        where: {
          userId_courseId_milestoneType: {
            userId,
            courseId: quiz.courseId,
            milestoneType: "QUIZ_PASS",
          },
        },
        create: {
          userId,
          courseId: quiz.courseId,
          milestoneType: "QUIZ_PASS",
          metadata: {
            quizId,
            score,
            attemptId: attempt.id,
          },
        },
        update: {
          metadata: {
            quizId,
            score,
            attemptId: attempt.id,
          },
        },
      });
    }

    return {
      attempt,
      passed,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
    };
  }

  /**
   * Check if user has passed a quiz
   */
  static async hasUserPassedQuiz(quizId: string, userId: string) {
    const passedAttempt = await db.quizAttempt.findFirst({
      where: {
        quizId,
        userId,
        passed: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return !!passedAttempt;
  }

  /**
   * Get user's quiz attempts
   */
  static async getUserQuizAttempts(quizId: string, userId: string) {
    return db.quizAttempt.findMany({
      where: {
        quizId,
        userId,
      },
      orderBy: {
        completedAt: "desc",
      },
    });
  }
}
