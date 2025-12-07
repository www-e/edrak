import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { QuizData } from "./QuizIntegration";

interface LessonNavigationProps {
  quizData: QuizData | undefined;
  quizAttempts: number | undefined; // Number of attempts from _count
  setShowQuizHistory: (show: boolean) => void;
  handleMarkComplete: () => void;
}

export function LessonNavigation({
  quizData,
  quizAttempts,
  setShowQuizHistory,
  handleMarkComplete
}: LessonNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Lesson
        </Button>
        <Button variant="outline" size="sm">
          Next Lesson
        </Button>
      </div>

      <div className="flex gap-2">
        {quizData?.hasPassed && quizAttempts && quizAttempts > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setShowQuizHistory(true);
            }}
          >
            View Quiz History
          </Button>
        )}
        <Button
          onClick={handleMarkComplete}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Complete
        </Button>
      </div>
    </div>
  );
}