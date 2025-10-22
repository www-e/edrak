import Link from 'next/link';
import { CourseCard } from '@/components/shared/CourseCard';
import { Course } from '@/features/courses/types';

interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CourseListProps {
  initialCourses: Course[];
  initialPagination: PaginationResult;
  searchParams?: { category?: string; search?: string; page?: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseListProps {
  initialCourses: Course[];
  initialPagination: PaginationResult;
  searchParams?: { category?: string; search?: string; page?: string };
  categories: Category[];
}

export function CourseList({ initialCourses, initialPagination, searchParams, categories }: CourseListProps) {
  const currentPage = parseInt(searchParams?.page || '1');
  const selectedCategory = searchParams?.category || '';
  const searchQuery = searchParams?.search || '';

  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Explore Our Courses</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover expertly designed courses to advance your skills and accelerate your career growth
          </p>

          {/* Static search form - client-side filtering will be handled by page navigation */}
          <div className="max-w-2xl mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <div className="pl-14 pr-4 h-14 text-lg rounded-xl border-2 border-border bg-muted flex items-center">
              <span className="text-muted-foreground">Search for courses...</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">Filter by Category</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/courses"
                className={`rounded-full px-6 py-3 text-base font-medium transition-all duration-300 ${
                  !selectedCategory
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-background border-2 border-border hover:bg-primary/10 hover:border-primary'
                }`}
              >
                All Categories
              </Link>
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/courses?category=${encodeURIComponent(category.slug)}`}
                  className={`rounded-full px-6 py-3 text-base font-medium transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background border-2 border-border hover:bg-primary/10 hover:border-primary'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {initialPagination?.total || 0} {initialPagination?.total === 1 ? "Course" : "Courses"}
            </h2>
            {selectedCategory && (
              <p className="text-muted-foreground mt-1">
                in <span className="font-medium text-primary">{selectedCategory}</span>
              </p>
            )}
          </div>
        </div>

        {/* Static course grid - no loading states needed for server component */}
        {initialCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {initialCourses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">No courses found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                Clear Filters
              </Link>
            </div>
          </div>
        )}

        {/* Static pagination - server-calculated */}
        {initialPagination && initialPagination.totalPages > 1 && (
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {((initialPagination.page - 1) * initialPagination.limit) + 1} to {Math.min(initialPagination.page * initialPagination.limit, initialPagination.total)} of {initialPagination.total} courses
            </div>

            <div className="flex items-center gap-2">
              {initialPagination.hasPrev ? (
                <Link
                  href={`/courses?page=${currentPage - 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="inline-flex items-center justify-center rounded-full border-2 border-border bg-background px-4 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary"
                >
                  <span className="mr-2">←</span> Previous
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-full border-2 border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
                  <span className="mr-2">←</span> Previous
                </span>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, initialPagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;

                  return (
                    <Link
                      key={pageNum}
                      href={`/courses?page=${pageNum}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                      className={`w-12 h-12 rounded-full font-bold flex items-center justify-center ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-background border-2 border-border hover:bg-primary/10 hover:border-primary'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {initialPagination.hasNext ? (
                <Link
                  href={`/courses?page=${currentPage + 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="inline-flex items-center justify-center rounded-full border-2 border-border bg-background px-4 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary"
                >
                  Next <span className="ml-2">→</span>
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-full border-2 border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
                  Next <span className="ml-2">→</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}