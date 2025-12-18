import { PrismaClient, Prisma } from '@prisma/client';

const db = new PrismaClient();

export class LibraryService {
  /**
   * Create a new library item
   */
  static async createLibraryItem(data: {
    name: string;
    type: 'FOOD' | 'EXERCISE' | 'NUTRITION_SET';
    description?: string;
    metadata?: Prisma.LibraryItemCreateInput["metadata"];
    imageUrl?: string;
  }) {
    return await db.libraryItem.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        metadata: data.metadata,
        imageUrl: data.imageUrl,
      },
    });
  }

  /**
   * Get all active library items with optional filtering
   */
  static async getLibraryItems(filters?: {
    type?: 'FOOD' | 'EXERCISE' | 'NUTRITION_SET';
    search?: string;
  }) {
    return await db.libraryItem.findMany({
      where: {
        isActive: true,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.search && {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get a specific library item by ID
   */
  static async getLibraryItemById(id: string) {
    return await db.libraryItem.findUnique({
      where: { id, isActive: true },
    });
  }

  /**
   * Update a library item
   */
  static async updateLibraryItem(id: string, data: {
    name?: string;
    type?: 'FOOD' | 'EXERCISE' | 'NUTRITION_SET';
    description?: string;
    metadata?: Prisma.LibraryItemUpdateInput["metadata"];
    imageUrl?: string;
    isActive?: boolean;
  }) {
    return await db.libraryItem.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        metadata: data.metadata,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
      },
    });
  }

  /**
   * Delete a library item (soft delete by setting isActive to false)
   */
  static async deleteLibraryItem(id: string) {
    return await db.libraryItem.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Create a student plan
   */
  static async createStudentPlan(data: {
    name: string;
    description?: string;
    studentId: string;
    professorId: string;
    planItems: {
      libraryItemId: string;
      quantity?: number;
      duration?: number;
      repetitions?: number;
      sets?: number;
      notes?: string;
    }[];
  }) {
    return await db.$transaction(async (tx) => {
      // Create the student plan
      const studentPlan = await tx.studentPlan.create({
        data: {
          name: data.name,
          description: data.description,
          studentId: data.studentId,
          professorId: data.professorId,
        },
        include: {
          planItems: {
            include: {
              libraryItem: true,
            },
          },
        },
      });

      // Create plan items if provided
      if (data.planItems.length > 0) {
        await Promise.all(
          data.planItems.map((item) => 
            tx.planItem.create({
              data: {
                studentPlanId: studentPlan.id,
                libraryItemId: item.libraryItemId,
                quantity: item.quantity,
                duration: item.duration,
                repetitions: item.repetitions,
                sets: item.sets,
                notes: item.notes,
              },
            })
          )
        );
        
        // Re-fetch the student plan with its plan items
        return await tx.studentPlan.findUnique({
          where: { id: studentPlan.id },
          include: {
            planItems: {
              include: {
                libraryItem: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            },
            professor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          },
        });
      }

      return studentPlan;
    });
  }

  /**
   * Get all plans for a specific student
   */
  static async getStudentPlans(studentId: string) {
    return await db.studentPlan.findMany({
      where: {
        studentId,
        isActive: true,
      },
      include: {
        planItems: {
          include: {
            libraryItem: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get all plans created by a specific professor
   */
  static async getProfessorPlans(professorId: string) {
    return await db.studentPlan.findMany({
      where: {
        professorId,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        planItems: {
          include: {
            libraryItem: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a specific student plan by ID
   */
  static async getStudentPlanById(id: string, studentId?: string) {
    const whereClause: {
      id: string;
      isActive: boolean;
      studentId?: string;
    } = { id, isActive: true };
    if (studentId) {
      whereClause.studentId = studentId;
    }

    return await db.studentPlan.findUnique({
      where: whereClause,
      include: {
        planItems: {
          include: {
            libraryItem: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
    });
  }
}