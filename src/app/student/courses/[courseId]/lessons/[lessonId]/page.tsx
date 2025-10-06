import { LessonViewer } from "@/components/lesson/LessonViewer";

interface Props {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  return (
    <LessonViewer courseId={courseId} lessonId={lessonId} />
  );
}