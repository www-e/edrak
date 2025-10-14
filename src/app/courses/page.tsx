import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { CourseList } from './CourseList';
import { CourseService } from '@/server/services/courseService';

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CourseList
        initialCourses={coursesData.courses}
        initialPagination={coursesData.pagination}
        searchParams={params}
      />
    </div>
  );
}