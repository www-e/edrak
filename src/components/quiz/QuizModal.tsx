"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quizId: string;
  courseId: string;
  quizTitle: string;
  onQuizPassed?: () => void;
  reviewMode?: boolean; // When true, allows reviewing previous attempts
  attemptId?: string; // For review mode, specify which attempt to review
}


export function QuizModal({ open, onClose, quizId, courseId, quizTitle, onQuizPassed, reviewMode = false, attemptId }: QuizModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);

  // Fetch quiz data
  const { data: quizData, isLoading: quizLoading, isError, error } = api.student.quiz.getById.useQuery(
    { quizId, courseId },
    { enabled: open && !reviewMode } // Only fetch when modal is open and not in review mode
  );

  // Fetch specific attempt for review mode
  const { data: reviewData, isLoading: reviewLoading } = api.student.quiz.getAttemptReview.useQuery(
    { quizId, attemptId: attemptId! },
    { enabled: reviewMode && !!attemptId } // Only fetch when in review mode with attempt ID
  );

  const questions = reviewMode && reviewData ? reviewData.quiz.questions : quizData?.questions || [];

  // For review mode, get the specific attempt
  const reviewAttempt = reviewMode && reviewData ? reviewData.attempt : null;

  const isLoading = quizLoading || reviewLoading;

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

  // Display error state if there's an error
  if (isError) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Error</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Failed to load quiz data</p>
            <p className="text-sm text-muted-foreground">{error?.message || 'Unknown error occurred'}</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading quiz...</p>
            </div>
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
        ) : reviewMode ? (
          // Review Mode View
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Review Quiz Attempt</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                reviewAttempt?.passed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {reviewAttempt?.score}% - {reviewAttempt?.passed ? "Passed" : "Failed"}
              </div>
            </div>

            {questions.map((question, questionIndex) => {
              const userAnswerIndex = reviewAttempt?.answers && Array.isArray(reviewAttempt.answers)
                ? (reviewAttempt.answers as number[])[questionIndex] ?? -1
                : -1;

              return (
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
                        <div
                          key={optionIndex}
                          className={`w-full text-left p-4 rounded-lg border-2 ${
                            optionIndex === userAnswerIndex
                              ? "border-blue-500 bg-blue-50"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                optionIndex === userAnswerIndex
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-border"
                              }`}
                            >
                              {optionIndex === userAnswerIndex && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className={
                              optionIndex === userAnswerIndex
                                ? "text-blue-700 font-medium"
                                : ""
                            }>
                              {option}
                            </span>
                          </div>

                          {optionIndex === userAnswerIndex && (
                            <div className="ml-8 mt-2 text-sm text-blue-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Your selected answer
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {questions.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No questions available for this quiz.</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 justify-end sticky bottom-0 bg-background pt-4 border-t">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          // Quiz Taking Mode View
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
                {submitAttemptMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : "Submit Quiz"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
