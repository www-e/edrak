import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

interface QuizHistorySelectorProps {
  quizId: string;
  courseId: string;
  onHistorySelect: (attemptId: string) => void;
  onHistoryClose: () => void;
}

export function QuizHistorySelector({ quizId, courseId: _courseId, onHistorySelect, onHistoryClose }: QuizHistorySelectorProps) {
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  // Fetch quiz attempts for history view
  const { data: quizAttempts, isLoading, isError } = api.student.quiz.getMyAttempts.useQuery(
    { quizId },
    { enabled: !!quizId }
  );

  if (isLoading) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">Loading quiz attempts...</p>
      </div>
    );
  }

  if (isError || !quizAttempts || quizAttempts.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">No quiz attempts found for this quiz.</p>
        <Button variant="outline" className="mt-2" onClick={onHistoryClose}>
          Close
        </Button>
      </div>
    );
  }

  // Set default to most recent attempt
  if (!selectedAttemptId && quizAttempts.length > 0) {
    setSelectedAttemptId(quizAttempts[0].id);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <label className="block text-sm font-medium mb-2">Select Attempt:</label>
        <select
          value={selectedAttemptId || quizAttempts[0]?.id || ''}
          onChange={(e) => setSelectedAttemptId(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        >
          {quizAttempts.map((attempt) => (
            <option key={attempt.id} value={attempt.id}>
              Attempt on {new Date(attempt.completedAt).toLocaleDateString()} - Score: {attempt.score}% ({attempt.passed ? 'Passed' : 'Failed'})
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onHistoryClose}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            if (selectedAttemptId) {
              onHistorySelect(selectedAttemptId);
            }
          }}
          disabled={!selectedAttemptId}
        >
          View Attempt
        </Button>
      </div>
    </div>
  );
}