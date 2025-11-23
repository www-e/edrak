"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizList } from "@/components/admin/quiz/QuizList";
import { QuizForm } from "@/components/admin/quiz/QuizForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CourseQuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [showForm, setShowForm] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | undefined>();

  const handleCreateQuiz = () => {
    setEditingQuizId(undefined);
    setShowForm(true);
  };

  const handleEditQuiz = (quizId: string) => {
    setEditingQuizId(quizId);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingQuizId(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingQuizId(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/courses/${courseId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage quizzes for this course. Quizzes can be assigned to specific lessons or set as a final course quiz.
        </p>
      </div>

      {/* Content */}
      {showForm ? (
        <QuizForm
          courseId={courseId}
          quizId={editingQuizId}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <QuizList
          courseId={courseId}
          onCreateQuiz={handleCreateQuiz}
          onEditQuiz={handleEditQuiz}
        />
      )}
    </div>
  );
}
