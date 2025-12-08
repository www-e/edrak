import { useState, useEffect } from "react";

// Define the same interface as in LessonViewer
interface LessonData {
  id: string;
  title: string;
  content: string;
  duration: number | null;
  order: number;
  isVisible: boolean;
  createdAt: string;
  youtubeUrl?: string | null;  // YouTube video URL for free courses
  attachments: Array<{
    id: string;
    name: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    bunnyCdnUrl: string;
    createdAt: string;
  }>;
  course: {
    id: string;
    title: string;
    slug: string;
    professor: {
      id: string;
      firstName: string;
      lastName: string;
    }
  };
}

interface UseLessonDataProps {
  courseId: string;
  lessonId: string;
}

interface UseLessonDataReturn {
  lesson: LessonData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLessonData({ courseId, lessonId }: UseLessonDataProps): UseLessonDataReturn {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  // Fetch lesson data and progress from API
  useEffect(() => {
    const fetchLessonAndProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch lesson data
        const lessonResponse = await fetch(`/api/lessons/${lessonId}?courseId=${courseId}`);

        // Handle lesson response
        if (!lessonResponse.ok) {
          if (lessonResponse.status === 403) {
            setError("You must be enrolled in this course to access the lesson content.");
          } else if (lessonResponse.status === 404) {
            setError("Lesson not found or not available.");
          } else {
            setError("Failed to load lesson content.");
          }
          return;
        }

        const lessonData = await lessonResponse.json();
        if (lessonData.success) {
          setLesson(lessonData.lesson);
        } else {
          setError(lessonData.error || "Failed to load lesson.");
          return;
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Network error occurred while loading the lesson.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchLessonAndProgress();
    }
  }, [courseId, lessonId]);

  const refetch = () => {
    const fetchLessonAndProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch lesson data
        const lessonResponse = await fetch(`/api/lessons/${lessonId}?courseId=${courseId}`);

        // Handle lesson response
        if (!lessonResponse.ok) {
          if (lessonResponse.status === 403) {
            setError("You must be enrolled in this course to access the lesson content.");
          } else if (lessonResponse.status === 404) {
            setError("Lesson not found or not available.");
          } else {
            setError("Failed to load lesson content.");
          }
          return;
        }

        const lessonData = await lessonResponse.json();
        if (lessonData.success) {
          setLesson(lessonData.lesson);
        } else {
          setError(lessonData.error || "Failed to load lesson.");
          return;
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Network error occurred while loading the lesson.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchLessonAndProgress();
    }
  };

  return { lesson, loading, error, refetch };
}