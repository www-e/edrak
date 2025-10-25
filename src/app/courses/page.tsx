 import { Metadata } from 'next';
 import { Header } from '@/features/landing/components/Header';
 import { CourseList } from './CourseList';
 import { CourseService } from '@/server/services/courseService';
 import { AdminCategoryService } from '@/server/services/categoryService';
 import { Suspense } from 'react';
 import { Skeleton } from '@/components/ui/skeleton';

// Enable ISR - regenerate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Explore Courses - Sportology Plus Learning Platform',
  description: 'Discover expertly designed courses to advance your skills and accelerate your career growth',
};

// Pre-generate popular course categories for ISR
export async function generateStaticParams() {
  const categories = ['Technology', 'Business', 'Self Development'];
  return categories.map(category => ({ category }));
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;

  // Server-side data fetching for ISR
  const coursesData = await CourseService.getPublishedCourses({
    category: typeof params.category === 'string' ? params.category : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    page: typeof params.page === 'string' ? parseInt(params.page) : 1,
    limit: 12,
  });

  // Fetch categories server-side
  const categories = await AdminCategoryService.getAllCategories();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<CourseListSkeleton />}>
        <CourseList
          initialCourses={coursesData.courses}
          initialPagination={coursesData.pagination}
          searchParams={params}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}

function CourseListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
