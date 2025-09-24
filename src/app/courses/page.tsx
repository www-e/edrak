import { Suspense } from 'react';
import { CourseList } from './CourseList';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8 text-center">Loading courses...</div>}>
        <CourseList />
      </Suspense>
    </div>
  );
}