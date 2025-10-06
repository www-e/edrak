import { notFound } from "next/navigation";
import { AdminCourseService } from "@/server/services/courseService";
import { LessonList } from "@/components/lesson/LessonList";

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;
  const course = await AdminCourseService.getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Course</span>
          <span>/</span>
          <span>{course.title}</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-xl text-muted-foreground mt-2">{course.description}</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>by {course.professor.firstName} {course.professor.lastName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{course.lessons.length} lessons</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <LessonList courseId={courseId} lessons={course.lessons} />
    </div>
  );
}