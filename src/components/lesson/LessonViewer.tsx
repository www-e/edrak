"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, AlertCircle, Eye, Play } from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "@/components/ui/video-player";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";

interface LessonViewerProps {
  courseId: string;
  lessonId: string;
}

interface LessonData {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  duration: number | null;
  order: number;
  isVisible: boolean;
  createdAt: string;
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
  };
}

export function LessonViewer({ courseId, lessonId }: LessonViewerProps) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson data and progress from API
  useEffect(() => {
    const fetchLessonAndProgress = async () => {
      try {
        setLoading(true);

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

  // Format duration from minutes to HH:MM format
  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return "0:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  // Handle lesson completion - just mark as complete locally
  const handleMarkComplete = () => {
    // Mark lesson as completed (no API call needed as per requirements)
    console.log('Lesson marked as complete');
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/student/courses" className="hover:text-foreground">
            My Courses
          </Link>
          <span>/</span>
          <Link href={`/student/courses/${courseId}`} className="hover:text-foreground">
            Course
          </Link>
          <span>/</span>
          <span className="text-foreground">Lesson</span>
        </div>

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
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lesson not found.</p>
          <Link href={`/student/courses/${courseId}`}>
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/student/courses" className="hover:text-foreground">
          My Courses
        </Link>
        <span>/</span>
        <Link href={`/student/courses/${courseId}`} className="hover:text-foreground">
          Course Name
        </Link>
        <span>/</span>
        <span className="text-foreground">Lesson {lesson.order}</span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Lesson {lesson.order}</Badge>
          <Badge variant="secondary">Beginner</Badge>
        </div>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">
          {lesson.content ? lesson.content.substring(0, 200) + '...' : 'No description available'}
        </p>
      </div>

      {/* Video Player */}
      {lesson.videoUrl ? (
        <div className="space-y-4">
          <VideoPlayer
            src={lesson.videoUrl}
            title={lesson.title}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
              <Button variant="outline" size="sm">
                Next Lesson
              </Button>
            </div>

            <Button
              onClick={handleMarkComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold mb-2">No Video Available</p>
              <p className="text-sm text-muted-foreground">
                This lesson does not have a video yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {lesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
            ) : (
              <p className="text-muted-foreground">No lesson content available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Attachments */}
       {lesson.attachments && lesson.attachments.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle>Lesson Resources</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-3">
               {lesson.attachments.map((attachment) => {
                 const fileIcon = getFileIcon(attachment.fileName, attachment.mimeType);
                 const formattedSize = formatFileSize(attachment.fileSize);

                 return (
                   <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                         <span className="text-lg">{fileIcon}</span>
                       </div>
                       <div className="flex-1">
                         <p className="font-medium">{attachment.name}</p>
                         <p className="text-sm text-muted-foreground">
                           {formattedSize} • {attachment.mimeType}
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       {/* Preview button for viewable files */}
                       {(attachment.mimeType.startsWith('image/') ||
                         attachment.mimeType === 'application/pdf' ||
                         attachment.fileName.match(/\.(txt|md)$/i)) && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                         >
                           <Eye className="w-4 h-4 mr-2" />
                           Preview
                         </Button>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           </CardContent>
         </Card>
       )}
    </div>
  );
}