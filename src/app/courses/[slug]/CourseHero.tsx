"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, BookOpen, Clock, Award, ArrowLeft, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Course } from '@/features/courses/types';

interface CourseHeroProps {
  course: Course;
}

export function CourseHero({ course }: CourseHeroProps) {
  const { data: session } = useSession();

  return (
    <>
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/courses">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {session?.user && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/student/courses">
                    My Courses
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative">
            {/* Content Column */}
            <div className="space-y-8">
              {/* Category & Tags */}
              <div className="flex flex-wrap gap-3">
                {course.category && (
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                    {course.category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                  Beginner Friendly
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                  Certificate Included
                </Badge>
              </div>

              {/* Title & Description */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-heading bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {course.title}
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  {course.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-border/50 backdrop-blur-sm">
                  <Star className="h-6 w-6 mx-auto mb-2 fill-yellow-500 text-yellow-500" />
                  <div className="text-2xl font-bold text-foreground">
                    {course.rating > 0 ? course.rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {course.ratingCount || 0} ratings
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-border/50 backdrop-blur-sm">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">
                    {course._count.enrollments}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    students
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-border/50 backdrop-blur-sm">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-foreground">
                    {course._count.lessons}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    lessons
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-border/50 backdrop-blur-sm">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-foreground">
                    {(course._count?.lessons || 0) * 45}m
                  </div>
                  <div className="text-sm text-muted-foreground">
                    estimated
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-4 p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-border/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Created by {course.professor.firstName} {course.professor.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Professional Instructor
                  </div>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                  <Image
                    src={`/images/course${(course.id.charCodeAt(0) % 3) + 1}.png`}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={true}
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Floating Price Badge */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  {course.price > 0 ? `${course.price} EGP` : 'FREE'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}