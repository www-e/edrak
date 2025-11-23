"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw } from "lucide-react";
import { api } from "@/trpc/react";
import type { Prisma } from "@prisma/client";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quizId: string;
  courseId: string;
  quizTitle: string;
  onQuizPassed?: () => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: Prisma.JsonValue;
  order: number;
}

export function QuizModal({ open, onClose, quizId, courseId, quizTitle, onQuizPassed }: QuizModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);

  // Fetch quiz data
  const { data: quizData, isLoading } = api.student.quiz.getById.useQuery(
    { quizId, courseId },
    { enabled: open } // Only fetch when modal is open
  );

  const questions = quizData?.questions || [];
  const passingScore = quizData?.passingScore || 70;

  const submitAttemptMutation = api.student.quiz.submitAttempt.useMutation({
    onSuccess: (data) => {
      setResult({
        passed: data.passed,
        score: data.score,
        correctCount: data.correctCount,
        totalQuestions: data.totalQuestions,
      });
      setIsSubmitted(true);

      if (data.passed && onQuizPassed) {
        onQuizPassed();
      }
    },
  });

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    // Convert answers object to array
    const answersArray = questions.map((_, index) => selectedAnswers[index] ?? -1);

    submitAttemptMutation.mutate({
      quizId,
      courseId,
      answers: answersArray,
    });
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  const handleClose = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResult(null);
    onClose();
  };

  const allQuestionsAnswered = questions.length > 0 && questions.every((_, index) => selectedAnswers[index] !== undefined);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{quizTitle}</DialogTitle>
          <DialogDescription>
            {!isSubmitted ? (
              "Answer all questions to complete this quiz. You can retake it unlimited times."
            ) : result?.passed ? (
              "Congratulations! You passed the quiz."
            ) : (
              "You didn't pass this time. Try again!"
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading quiz...</p>
          </div>
        ) : isSubmitted && result ? (
          // Results View
          <div className="space-y-6">
            <Card className={result.passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  {result.passed ? (
                    <Trophy className="w-16 h-16 text-green-600" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">
                    {result.passed ? "Quiz Passed!" : "Quiz Not Passed"}
                  </h3>
                  <p className="text-lg mb-4">
                    Your Score: <span className="font-bold">{result.score}%</span>
                  </p>
                  <p className="text-muted-foreground">
                    You answered {result.correctCount} out of {result.totalQuestions} questions correctly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              {result.passed ? (
                <Button onClick={handleClose} size="lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              ) : (
                <>
                  <Button onClick={handleRetry} size="lg" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={handleClose} size="lg" variant="ghost">
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          // Quiz Questions View
          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="outline" className="mt-1">
                      Q{questionIndex + 1}
                    </Badge>
                    <p className="text-lg font-medium flex-1">{question.question}</p>
                  </div>

                  <div className="space-y-2 ml-12">
                    {(question.options as string[]).map((option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAnswers[questionIndex] === optionIndex
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[questionIndex] === optionIndex
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            {selectedAnswers[questionIndex] === optionIndex && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {questions.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No questions available for this quiz.</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 justify-end sticky bottom-0 bg-background pt-4 border-t">
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || submitAttemptMutation.isPending}
              >
                {submitAttemptMutation.isPending ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
