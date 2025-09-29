"use client";

import { Calendar, Users, ChevronRight, Signal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/trpc/react";

const formatEnrollment = (count: number) => {
  const roundedCount = Math.floor(count / 100) * 100;
  return `+${new Intl.NumberFormat("en-US").format(roundedCount)}`;
};

const DifficultyBadge = ({ level }: { level: string }) => {
  const isEasy = level === "Beginner";
  const iconColor = isEasy ? "text-[#27ae60]" : "text-[#f39c12]";

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-[#8a99a8]">
      <Signal size={12} className={iconColor} />
      <span>{level}</span>
    </div>
  );
};

const FeaturedCourseCard = ({
  course,
}: {
  course: {
    id: string;
    title: string;
    image: string;
    duration: string;
    level: 'Beginner' | 'Intermediate';
    enrollment: string;
    url: string;
    category?: { name: string } | null;
  };
}) => (
  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
    <div className="relative">
      <Image
        src={course.image}
        alt={course.title}
        width={360}
        height={192}
        className="h-48 w-full object-cover"
      />
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
        <Calendar size={12} />
        <span>{course.duration}</span>
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <DifficultyBadge level={course.level} />
        <div className="flex items-center gap-1.5 rounded-md bg-[#3498db] px-2.5 py-1.5 text-xs font-semibold text-white">
          <span>Course</span>
        </div>
      </div>
    </div>
    <div className="flex flex-grow flex-col p-5">
      {course.category && (
        <div className="flex items-center gap-2 text-sm font-bold text-[#3498db] mb-2">
          <span>{course.category.name}</span>
        </div>
      )}
      <h3 className="mt-2.5 min-h-[56px] text-lg font-bold text-foreground">
        <Link
          href={course.url}
          className="hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
      </h3>
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm font-bold text-accent">
          <Users size={14} className="text-[#3498db]" />
          <span>{formatEnrollment(parseInt(course.enrollment.replace(/[^0-9]/g, '')) || 0)}</span>
        </div>
      </div>
      <Link
        href={course.url}
        className="mt-4 block w-full rounded-lg border border-primary bg-transparent py-3 text-center font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
      >
        View Course <ChevronRight className="inline-block h-4 w-4" />
      </Link>
    </div>
  </div>
);

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
            <FeaturedCourseCard
              key={course.id}
              course={{
                id: course.id,
                title: course.title,
                image: "/images/course-placeholder.jpg", // Default image
                duration: "4 Weeks", // Default duration
                level: "Beginner", // Default level
                enrollment: `+${course._count?.enrollments || 0} enrolled`,
                url: `/courses/${course.slug}`,
                category: course.category
              }}
            />
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