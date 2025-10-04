import { LessonViewer } from "@/components/lesson/LessonViewer";

interface Props {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default function LessonPage({ params }: Props) {
  return (
    <LessonViewer courseId={params.courseId} lessonId={params.lessonId} />
  );
}