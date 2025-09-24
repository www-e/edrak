import { notFound } from 'next/navigation';
import { CourseService } from '@/server/services/courseService';
import { CourseHero } from './CourseHero';
import { CourseCurriculum } from './CourseCurriculum';
import { CourseEnroll } from './CourseEnroll';

interface Props {
  params: {
    slug: string;
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseHero course={course} />
      <CourseEnroll course={course} />
      <CourseCurriculum course={course} />
    </div>
  );
}