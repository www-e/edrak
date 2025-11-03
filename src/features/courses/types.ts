// Course-related interfaces to be shared across components

export interface Lesson {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
}

export interface Category {
  name: string;
}

export interface Professor {
  id?: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface CourseCount {
  enrollments: number;
  lessons?: number; // Optional since list view might not need this
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  language: string;
  slug: string;
  rating: number;
  ratingCount: number;
  thumbnailUrl?: string | null;
  category: Category | null;
  professor: Professor;
  lessons?: Lesson[];
  _count: CourseCount;
}

// Specific type for course listings (what's returned from getPublishedCourses)
export interface CourseListing {
  id: string;
  title: string;
  description: string;
  price: number;
  language: string;
  slug: string;
  rating: number;
  ratingCount: number;
  thumbnailUrl?: string | null;
  createdAt: Date;
  category: Category | null;
  professor: Professor;
  _count: {
    enrollments: number;
  };
}