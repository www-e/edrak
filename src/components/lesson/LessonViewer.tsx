"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, MessageCircle, StickyNote, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { NoteTakingPanel } from "@/components/lesson/NoteTakingPanel";
import { ProfessorMessagingPanel } from "@/components/lesson/ProfessorMessagingPanel";
import { Breadcrumb, LessonHeader } from "@/components/lesson/LessonHeader";
import { VideoDisplay, AttachmentList } from "@/components/lesson/VideoDisplay";
import { LessonContent } from "@/components/lesson/LessonContent";
import { LessonNavigation } from "@/components/lesson/LessonNavigation";
import { QuizIntegration } from "@/components/lesson/QuizIntegration";
import { useLessonData } from "@/hooks/useLessonData";
import { api } from "@/trpc/react";

interface LessonViewerProps {
  courseId: string;
  lessonId: string;
}

export function LessonViewer({ courseId, lessonId }: LessonViewerProps) {
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [showMessagingPanel, setShowMessagingPanel] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  const { lesson, loading, error, refetch } = useLessonData({ courseId, lessonId });

  // Check if lesson has a quiz
  const { data: quizData } = api.student.quiz.getByLesson.useQuery(
    { lessonId, courseId },
    { enabled: !!lessonId && !!courseId }
  );

  // Fetch quiz attempts for history view (needed for navigation)
  const { data: quizAttempts } = api.student.quiz.getMyAttempts.useQuery(
    { quizId: quizData?.id || '' },
    { enabled: !!quizData?.id }
  );

  // Mutation to mark lesson as complete
  const markLessonCompleteMutation = api.student.progress.markLessonComplete.useMutation({
    onSuccess: () => {
      console.log('Lesson marked as complete');
      // Optionally refresh lesson data or update UI to reflect completion
    },
    onError: (error) => {
      console.error('Failed to mark lesson as complete:', error);
      // Optionally show an error message to the user
    }
  });

  // Handle lesson completion - check for quiz first
  const handleMarkComplete = () => {
    // If there's a quiz and user hasn't passed it, show quiz modal
    if (quizData && !quizData.hasPassed) {
      setShowQuizModal(true);
      return;
    }

    // Otherwise, mark lesson as complete
    // TODO: Call API to mark lesson progress as complete
    console.log('Lesson marked as complete');
  };

  // Handle quiz passed - close modal and mark lesson complete
  const handleQuizPassed = () => {
    setShowQuizModal(false);
    // Mark lesson as complete after passing quiz
    markLessonCompleteMutation.mutate({ lessonId, courseId });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="aspect-video bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb courseId={courseId} courseTitle={lesson?.course?.title} />

        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/courses/${lesson?.course.slug || courseId}`}>
                <Button variant="outline">
                  Back to Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <Breadcrumb courseId={courseId} />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lesson not found.</p>
          <Link href={`/student/courses/${courseId}`}>
            <Button variant="outline" className="mt-4">
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb courseId={courseId} courseTitle={lesson?.course?.title} />
      <LessonHeader
        courseId={courseId}
        lessonOrder={lesson.order}
        lessonTitle={lesson.title}
        lessonContent={lesson.content}
      />

      <VideoDisplay
        lessonTitle={lesson.title}
        youtubeUrl={lesson.youtubeUrl}
        attachments={lesson.attachments}
        onAddNote={() => setShowNotePanel(true)}
        onSendMessage={() => setShowMessagingPanel(true)}
      />

      <LessonNavigation
        quizData={quizData || undefined}
        quizAttempts={quizData?.hasPassed ? (quizAttempts?.length || 0) : 0}
        setShowQuizHistory={setShowQuizHistory}
        handleMarkComplete={handleMarkComplete}
      />

      {/* Note Taking & Messaging Panel Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowNotePanel(!showNotePanel)}
        >
          {showNotePanel ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          <StickyNote className="w-4 h-4 mr-2" />
          Notes ({showNotePanel ? 'Hide' : 'Show'})
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowMessagingPanel(!showMessagingPanel)}
        >
          {showMessagingPanel ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          <MessageCircle className="w-4 h-4 mr-2" />
          Message Professor ({showMessagingPanel ? 'Hide' : 'Show'})
        </Button>
      </div>

      {/* Note Taking Panel */}
      {showNotePanel && (
        <NoteTakingPanel
          courseId={courseId}
          lessonId={lessonId}
          className="w-full"
        />
      )}

      {/* Professor Messaging Panel */}
      {showMessagingPanel && lesson.course.professor && (
        <ProfessorMessagingPanel
          courseId={courseId}
          lessonId={lessonId}
          professorId={lesson.course.professor.id}
          className="w-full"
        />
      )}

      <LessonContent content={lesson.content} />

      {lesson.attachments.length > 0 && (
        <Card>
          <div className="p-6">
            <AttachmentList attachments={lesson.attachments} />
          </div>
        </Card>
      )}

      <QuizIntegration
        courseId={courseId}
        quizData={quizData || null}
        showQuizModal={showQuizModal}
        setShowQuizModal={setShowQuizModal}
        showQuizHistory={showQuizHistory}
        setShowQuizHistory={setShowQuizHistory}
        selectedAttemptId={selectedAttemptId}
        setSelectedAttemptId={setSelectedAttemptId}
        handleQuizPassed={handleQuizPassed}
      />
    </div>
  );
}