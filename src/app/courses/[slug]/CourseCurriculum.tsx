import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Lock } from 'lucide-react';
import { Course } from '@/features/courses/types';

interface CourseCurriculumProps {
  course: Course;
}

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 font-heading">Course Content</h2>
        <p className="text-muted-foreground mb-12">
          {course.lessons?.length || 0} lessons • {(course.lessons?.length || 0) * 10} min
        </p>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.lessons?.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {index < 3 ? ( // First 3 lessons are previewable
                      <Play className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">{lesson.title}</span>
                  </div>
                  <Badge variant="outline">Lesson {lesson.order}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}