"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Lock} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
}

interface LessonListProps {
  courseId: string;
  lessons: Lesson[];
}

export function LessonList({ courseId, lessons }: LessonListProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Course Content</h2>
        <p className="text-muted-foreground">
          {lessons.length} lessons • Beginner level
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {lesson.order}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {index < 3 ? (
                      <Play className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">{lesson.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">Lesson {lesson.order}</Badge>
                  {index < 3 && (
                    <Button asChild size="sm">
                      <Link href={`/student/courses/${courseId}/lessons/${lesson.id}`}>
                        Start
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}