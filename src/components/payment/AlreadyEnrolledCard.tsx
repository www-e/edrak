
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Award, BookOpen, Users } from 'lucide-react';
// Define the enrollment type inline since RouterOutputs is not available
type EnrollmentData = {
  enrollmentId: string;
  enrolledAt: Date;
  completionPercentage: number;
};

interface AlreadyEnrolledCardProps {
  enrollmentData: EnrollmentData;
  courseId: string;
}

export function AlreadyEnrolledCard({ enrollmentData, courseId }: AlreadyEnrolledCardProps) {
  const completionPercentage = enrollmentData?.completionPercentage || 0;

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 dark:from-green-950/10 dark:via-background dark:to-blue-950/10">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <CardContent className="p-0">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20" />
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">Already Enrolled! 🎉</h3>
                <p className="text-green-50 text-lg md:text-xl max-w-2xl mx-auto">
                  Welcome back! You have full access to this course content.
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-foreground mb-4">
                  Continue Your Learning Journey
                </h4>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-bold">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-muted-foreground text-lg">
                  {completionPercentage === 100
                    ? "🎓 Congratulations! you have completed this course. You can review the content anytime."
                    : `📚 you have completed ${completionPercentage}% of this course. Keep up the great work!`
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg">
                  <Link href={`/student/courses/${courseId}`} className="flex items-center gap-2">
                    {completionPercentage === 100 ? (
                      <>
                        <Award className="w-5 h-5" />
                        Review Course
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        Continue Learning
                      </>
                    )}
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold">
                  <Link href="/student/courses" className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    View All My Courses
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
