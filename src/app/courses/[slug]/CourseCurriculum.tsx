import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Lock, BookOpen, Clock, Eye, LucideIcon } from 'lucide-react';
import { Course } from '@/features/courses/types';
import Link from 'next/link';

interface CourseCurriculumProps { course: Course; }

interface Lesson { id: string; title: string; order: number; }

const StatCard = ({ icon: Icon, label, value, color = "text-primary" }: {
  icon: LucideIcon; label: string; value: string | number; color?: string;
}) => (
  <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 px-4 py-2 rounded-full border border-border/50">
    <Icon className={`h-5 w-5 ${color}`} />
    <span className="font-semibold">{value} {label}</span>
  </div>
);

const LessonCard = ({ lesson, index, isPreview, isLocked }: {
  lesson: Lesson; index: number; isPreview?: boolean; isLocked?: boolean;
}) => (
  <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
    isPreview
      ? "bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30 hover:bg-green-100/50 dark:hover:bg-green-950/30"
      : "bg-muted/30 border border-border/50 opacity-75"
  }`}>
    <div className="flex items-center gap-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
        isPreview ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"
      }`}>
        {index + 1}
      </div>
      <div className={`p-2 rounded-lg ${isPreview ? "bg-white dark:bg-gray-800" : "bg-muted"}`}>
        {isPreview ? <Play className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
      </div>
      <span className={`font-semibold ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
        {lesson.title}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant={isPreview ? "outline" : "secondary"} className={isPreview ? "bg-green-100 text-green-700 border-green-300" : ""}>
        {isPreview ? <><Eye className="h-3 w-3 mr-1" />Preview</> : <><Lock className="h-3 w-3 mr-1" />Locked</>}
      </Badge>
      <Badge variant="secondary">Lesson {lesson.order}</Badge>
    </div>
  </div>
);

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  const lessons = course.lessons || [];
  const previewLessons = lessons.slice(0, 3);
  const lockedLessons = lessons.slice(3);

  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Course Content</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive curriculum designed to take you from beginner to expert
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <StatCard icon={BookOpen} label="Lessons" value={lessons.length} />
            <StatCard icon={Clock} label="h Total" value={Math.floor((lessons.length * 45) / 60)} color="text-blue-600" />
            <StatCard icon={Eye} label="Free Preview" value={previewLessons.length} color="text-green-600" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Free Preview Lessons</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Start learning immediately with these sample lessons</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {previewLessons.map((lesson, index) => (
                <LessonCard key={lesson.id} lesson={lesson} index={index} isPreview />
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Premium Content</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lockedLessons.length} more lessons available after enrollment
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lockedLessons.slice(0, 3).map((lesson, index) => (
                <LessonCard key={lesson.id} lesson={lesson} index={index} isLocked />
              ))}

              {lockedLessons.length > 3 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">+{lockedLessons.length - 3} more lessons available</p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                    <Link href={`/auth/student/signin?callbackUrl=/courses/${course.slug}`}>
                      Sign In to Unlock All Content
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
            <h3 className="text-2xl font-bold mb-3">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enroll now to unlock all {lessons.length} lessons and start your journey to mastery.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Play className="h-5 w-5 mr-2" />
              Enroll Now - {course.price > 0 ? `${course.price} EGP` : 'FREE'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}