"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "@/trpc/react";

interface QuizFormProps {
  courseId: string;
  lessonId?: string;
  quizId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}


export function QuizForm({ courseId, lessonId, quizId, onSuccess, onCancel }: QuizFormProps) {
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0, order: 1 },
  ]);

  // Fetch existing quiz if editing
  const { data: existingQuiz, isLoading } = api.admin.quiz.getById.useQuery(
    { id: quizId! },
    { enabled: !!quizId }
  );

  // Load quiz data when it's fetched
  useEffect(() => {
    if (existingQuiz) {
      setTitle(existingQuiz.title);
      setDescription(existingQuiz.description || "");
      setPassingScore(existingQuiz.passingScore);
      setQuestions(
        existingQuiz.questions.map((q, index: number) => ({
          question: q.question,
          options: q.options as string[],
          correctAnswer: q.correctAnswer,
          order: index + 1,
        }))
      );
    }
  }, [existingQuiz]);

  const createQuizMutation = api.admin.quiz.create.useMutation({
    onSuccess: () => {
      utils.admin.quiz.getByCourse.invalidate({ courseId });
      onSuccess();
    },
  });

  const updateQuizMutation = api.admin.quiz.update.useMutation({
    onSuccess: () => {
      utils.admin.quiz.getByCourse.invalidate({ courseId });
      onSuccess();
    },
  });

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0, order: questions.length + 1 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // Reorder
    newQuestions.forEach((q, i) => {
      q.order = i + 1;
    });
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: string | number) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex].options = newOptions;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    // Adjust correct answer if needed
    if (newQuestions[questionIndex].correctAnswer >= newQuestions[questionIndex].options.length) {
      newQuestions[questionIndex].correctAnswer = 0;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.length < 2) {
        alert(`Question ${i + 1} must have at least 2 options`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`Question ${i + 1} has empty options`);
        return;
      }
    }

    const quizData = {
      courseId: lessonId ? undefined : courseId,
      lessonId,
      title,
      description: description || undefined,
      passingScore,
      questions,
    };

    if (quizId) {
      updateQuizMutation.mutate({ id: quizId, ...quizData });
    } else {
      createQuizMutation.mutate(quizData);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{quizId ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Quiz Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lesson 1 Quiz"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this quiz covers"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="passingScore">Passing Score (%) *</Label>
            <Input
              id="passingScore"
              type="number"
              min="0"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Students must score at least {passingScore}% to pass
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Questions</h3>
          <Button type="button" onClick={handleAddQuestion} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.map((question, questionIndex) => (
          <Card key={questionIndex}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge>Question {questionIndex + 1}</Badge>
                </div>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(questionIndex)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text *</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                  placeholder="Enter your question"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label>Options *</Label>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() =>
                          handleQuestionChange(questionIndex, "correctAnswer", optionIndex)
                        }
                        className="w-4 h-4"
                      />
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(questionIndex, optionIndex, e.target.value)
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {question.options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(questionIndex)}
                    className="mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Option
                  </Button>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Select the correct answer by clicking the radio button
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createQuizMutation.isPending || updateQuizMutation.isPending}
        >
          {createQuizMutation.isPending || updateQuizMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              Saving...
            </>
          ) : quizId ? (
            "Update Quiz"
          ) : (
            "Create Quiz"
          )}
        </Button>
      </div>
    </form>
  );
}
