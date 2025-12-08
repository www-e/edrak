import { QuizModal } from "@/components/quiz/QuizModal";
import { QuizHistorySelector } from "@/components/quiz/QuizHistorySelector";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/api/root";

export type QuizData = inferRouterOutputs<AppRouter>["student"]["quiz"]["getByLesson"];

interface QuizIntegrationProps {
  courseId: string;
  quizData: QuizData;
  showQuizModal: boolean;
  setShowQuizModal: (show: boolean) => void;
  showQuizHistory: boolean;
  setShowQuizHistory: (show: boolean) => void;
  selectedAttemptId: string | null;
  setSelectedAttemptId: (id: string | null) => void;
  handleQuizPassed: () => void;
}

export function QuizIntegration({
  courseId,
  quizData,
  showQuizModal,
  setShowQuizModal,
  showQuizHistory,
  setShowQuizHistory,
  selectedAttemptId,
  setSelectedAttemptId,
  handleQuizPassed
}: QuizIntegrationProps) {

  return (
    <>
      {/* Quiz Taking Modal */}
      {quizData && showQuizModal && !selectedAttemptId && (
        <QuizModal
          open={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
          }}
          quizId={quizData.id}
          courseId={courseId}
          quizTitle={quizData.title}
          onQuizPassed={handleQuizPassed}
        />
      )}

      {/* Quiz History Selector */}
      {quizData && showQuizHistory && (
        <QuizHistorySelector
          quizId={quizData.id}
          courseId={courseId}
          onHistorySelect={(attemptId) => {
            setSelectedAttemptId(attemptId);
            // Also update state to show the review mode in QuizModal
            setShowQuizHistory(false);
            setShowQuizModal(true);
          }}
          onHistoryClose={() => setShowQuizHistory(false)}
        />
      )}
      {/* Quiz Review Modal */}
      {quizData && showQuizModal && selectedAttemptId && (
        <QuizModal
          open={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedAttemptId(null); // Reset selected attempt when closing review
          }}
          quizId={quizData.id}
          courseId={courseId}
          quizTitle={`${quizData.title} - Review`}
          reviewMode={true}
          attemptId={selectedAttemptId}
        />
      )}
    </>
  );
}