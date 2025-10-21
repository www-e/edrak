"use client";

import Link from "next/link";
import {
  MoveRight,
  MoveLeft,
} from "lucide-react";
import { CourseCard } from "./CourseCard";
import { api } from "@/trpc/react";


export const ActivitiesSection = () => {
    // Fetch real courses data using tRPC
    const { data: courseData, isLoading } = api.public.course.getAllCourses.useQuery();
    const courses = courseData?.courses || [];

    // Get the first 3 courses for display
    const displayCourses = courses.slice(0, 3);

    if (isLoading) {
        return (
            <section className="bg-background py-20">
                <div className="container mx-auto px-5">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-4xl font-bold text-dark-navy relative inline-block pb-4">
                            Most Popular Courses
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-primary rounded-full"></span>
                        </h2>
                        <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground font-body">
                            Discover the key courses that help enhance your skills and develop your career path, carefully designed to provide the highest levels of quality and impact
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
        <section className="bg-background py-20">
            <div className="container mx-auto px-5">
                <div className="text-center mb-12">
                     <h2 className="font-display text-4xl font-bold text-dark-navy relative inline-block pb-4">
                        Most Popular Courses
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-primary rounded-full"></span>
                    </h2>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground font-body">
                        Discover the key courses that help enhance your skills and develop your career path, carefully designed to provide the highest levels of quality and impact
                    </p>
                </div>

                <div className="relative">
                    <button className="absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-300 z-10">
                        <MoveRight className="w-6 h-6"/>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                image="/images/course-placeholder.jpg"
                                specialization={course.description?.substring(0, 100) + "..." || ""}
                                title={course.title}
                                enrollment={`+${course._count?.enrollments || 0} enrolled`}
                                url={`/courses/${course.slug}`}
                            />
                        ))}
                    </div>
                     <button className="absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-300 z-10">
                        <MoveLeft className="w-6 h-6"/>
                    </button>
                </div>

                <div className="text-center mt-16">
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-md"
                    >
                        Browse More Courses
                    </Link>
                </div>
            </div>
        </section>
    );
};