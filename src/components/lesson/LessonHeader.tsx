import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface LessonHeaderProps {
  courseId: string;
  lessonOrder: number;
  lessonTitle: string;
  lessonContent?: string;
}

export function LessonHeader({ courseId: _courseId, lessonOrder, lessonTitle, lessonContent }: LessonHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Lesson {lessonOrder}</Badge>
        <Badge variant="secondary">Beginner</Badge>
      </div>
      <h1 className="text-3xl font-bold">{lessonTitle}</h1>
      <p className="text-muted-foreground">
        {lessonContent ? lessonContent.substring(0, 200) + '...' : 'No description available'}
      </p>
    </div>
  );
}

interface BreadcrumbProps {
  courseId: string;
  courseTitle?: string;
}

export function Breadcrumb({ courseId, courseTitle }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/student/courses" className="hover:text-foreground">
        My Courses
      </Link>
      <span>/</span>
      <Link href={`/student/courses/${courseId}`} className="hover:text-foreground">
        {courseTitle || 'Course'}
      </Link>
      <span>/</span>
      <span className="text-foreground">Lesson</span>
    </div>
  );
}