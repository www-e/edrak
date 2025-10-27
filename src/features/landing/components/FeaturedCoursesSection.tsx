import Link from "next/link";
import { CourseCard, CourseCardSkeleton } from "@/components/shared/CourseCard";

interface FeaturedCoursesSectionProps {
  initialCourses: Array<{
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
}

export const FeaturedCoursesSection = ({ initialCourses }: FeaturedCoursesSectionProps) => {
  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-center text-4xl font-bold text-dark-navy">
            Featured Courses
          </h2>
          <p className="mt-4 mb-12 text-center text-lg text-muted-foreground">
            Discover our most popular and highly-rated courses
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initialCourses.length > 0 ? (
            initialCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            // Show skeleton loading while courses load
            Array.from({ length: 3 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          )}
        </div>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link
            href="/courses"
            className="text-lg font-bold text-primary hover:underline"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};