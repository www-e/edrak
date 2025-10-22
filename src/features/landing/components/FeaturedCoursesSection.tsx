"use client";

import Link from "next/link";
import { api } from "@/trpc/react";
import { CourseCard } from "@/components/shared/CourseCard";

export const FeaturedCoursesSection = () => {
  // Fetch real courses data using tRPC
  const { data: courseData, isLoading } = api.public.course.getAllCourses.useQuery({
    limit: 3
  });
  const courses = courseData?.courses || [];

  if (isLoading) {
    return (
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-center text-4xl font-bold text-dark-navy">
              Featured Courses
            </h2>
            <p className="mt-4 mb-12 text-center text-lg text-muted-foreground">
              Discover our most popular and highly-rated courses
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-2xl font-bold text-primary">Loading courses...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-center text-4xl font-bold text-dark-navy">
            Featured Courses
          </h2>
          <p className="mt-4 mb-12 text-center text-lg text-muted-foreground">
            Discover our most popular and highly-rated courses
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link
            href="/courses"
            className="text-lg font-bold text-primary hover:underline"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};