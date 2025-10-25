import { notFound } from 'next/navigation';
import { CourseService } from '@/server/services/courseService';
import { CourseHero } from './CourseHero';
import { CourseCurriculum } from './CourseCurriculum';
import { CourseEnroll } from './CourseEnroll';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseHero course={course} />
        <CourseEnroll course={course} />
        <CourseCurriculum course={course} />
      </Suspense>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-64 w-full mb-6" />
      <Skeleton className="h-8 w-64 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
