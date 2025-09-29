import { Suspense } from 'react';
import { Header } from '@/features/landing/components/Header';
import { CourseList } from './CourseList';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="p-8 text-center">Loading courses...</div>}>
        <CourseList />
      </Suspense>
    </div>
  );
}