"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface QuizListProps {
  courseId: string;
  onCreateQuiz: () => void;
  onEditQuiz: (quizId: string) => void;
}

export function QuizList({ courseId, onCreateQuiz, onEditQuiz }: QuizListProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: quizzes, isLoading } = api.admin.quiz.getByCourse.useQuery({ courseId });

  const deleteQuizMutation = api.admin.quiz.delete.useMutation({
    onSuccess: () => {
      utils.admin.quiz.getByCourse.invalidate({ courseId });
    },
  });

  const toggleActiveMutation = api.admin.quiz.toggleActive.useMutation({
    onSuccess: () => {
      utils.admin.quiz.getByCourse.invalidate({ courseId });
    },
  });

  const handleDelete = (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      deleteQuizMutation.mutate({ id: quizId });
    }
  };

  const handleToggleActive = (quizId: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id: quizId, isActive: !isActive });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Quizzes</h2>
        <Button onClick={onCreateQuiz}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {quizzes && quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{quiz.title}</h3>
                      <Badge variant={quiz.isActive ? "default" : "secondary"}>
                        {quiz.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {quiz.lesson && (
                        <Badge variant="outline">
                          Lesson: {quiz.lesson.title}
                        </Badge>
                      )}
                      {!quiz.lessonId && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          Final Course Quiz
                        </Badge>
                      )}
                    </div>
                    {quiz.description && (
                      <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{quiz.questions.length} questions</span>
                      <span>Pass: {quiz.passingScore}%</span>
                      <span>{quiz._count.attempts} attempts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(quiz.id, quiz.isActive)}
                    >
                      {quiz.isActive ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditQuiz(quiz.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(quiz.id)}
                      disabled={deleteQuizMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No quizzes created yet.</p>
            <Button onClick={onCreateQuiz}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
