"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Maximize, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LessonViewerProps {
  courseId: string;
  lessonId: string;
}

export function LessonViewer({ courseId, lessonId }: LessonViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock lesson data - in real implementation, this would come from API
  const lesson = {
    id: lessonId,
    title: "Introduction to the Course",
    description: "Welcome to your learning journey! This lesson covers the basics.",
    videoUrl: "https://example.com/video.mp4", // Mock URL
    duration: "15:30",
    order: 1,
  };

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
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>

      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black rounded-t-lg aspect-video">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <p className="text-lg font-semibold mb-2">Video Player</p>
                <p className="text-sm opacity-75">Click to start playing</p>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <div className="flex-1">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <span className="text-white text-sm">0:00 / {lesson.duration}</span>

                <Button size="sm" variant="secondary">
                  <Volume2 className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="secondary">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
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
                onClick={() => setProgress(100)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>
              This is where the lesson content would appear. In a real implementation,
              this would include formatted text, code examples, images, and other
              educational materials.
            </p>
            <p>
              The lesson content can be stored as markdown and rendered using a
              library like <code>react-markdown</code> for rich formatting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}