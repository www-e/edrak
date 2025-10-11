'use client';

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { StatCard } from "@/components/shared/StatCard";

function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function StudentCoursesPage() {
  const { data: enrollments, isLoading, error } = api.student.courses.getMyEnrolledCourses.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Card className="py-16 text-center">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to load courses</h3>
            <p className="text-muted-foreground">Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      {!enrollments?.length ? (
        <Card>
          <CardContent className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You have not enrolled in any courses yet. Browse our catalog to find your first course.
            </p>
            <Button asChild size="lg">
              <Link href="/courses">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
              title="Active Courses" 
              value={enrollments.filter(e => e.completionPercentage < 100).length} 
              icon={BookOpen} 
            />
            <StatCard 
              title="Completed" 
              value={enrollments.filter(e => e.completionPercentage === 100).length} 
              icon={CheckCircle} 
            />
            <StatCard 
              title="Total Progress" 
              value={`${enrollments.length > 0
                ? Math.round(enrollments.reduce((acc, e) => acc + e.completionPercentage, 0) / enrollments.length)
                : 0}%`}
              icon={TrendingUp} 
            />
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.enrollmentId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{enrollment.course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    by {enrollment.course.professorName}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {enrollment.course.lessonCount} lessons
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{enrollment.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/student/courses/${enrollment.course.id}`}>
                      {enrollment.completionPercentage === 0 ? 'Start Learning' :
                       enrollment.completionPercentage === 100 ? 'Review Course' :
                       'Continue Learning'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}