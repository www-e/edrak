"use client";

import { useState, useRef} from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Signal, Info, ChevronRight, ChevronLeft, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from "@/trpc/react";

const categories = [
  'Career Preparation', 'Technology', 'Self Development', 'Business & Entrepreneurship', 'Languages', 'Art, Design & Media', 'Teacher Education & Training', 'Classroom Environment', 'Humanities'
];

export const CategoriesSection = () => {
  const [activeCategory, setActiveCategory] = useState('Career Preparation');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch real courses data using tRPC
  const { data: courseData, isLoading } = api.public.course.getAllCourses.useQuery();
  const courses = courseData?.courses || [];

  // Filter courses based on active category
  const filteredCourses = courses.filter(course =>
    course.category?.name === activeCategory
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.9;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Start Learning for Free Now</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground max-w-3xl mx-auto">
              Discover a wide collection of over 300 courses, specially designed to meet your skills and interests!
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                className={`rounded-full px-6 py-2 text-base font-medium transition-colors duration-300
                  ${activeCategory === category
                    ? 'bg-blue-800 text-white hover:bg-blue-700'
                    : 'bg-white border-gray-300 text-muted-foreground hover:bg-gray-100 hover:border-gray-400'
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
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
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Start Learning for Free Now</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground max-w-3xl mx-auto">
            Discover a wide collection of over 300 courses, specially designed to meet your skills and interests!
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              className={`rounded-full px-6 py-2 text-base font-medium transition-colors duration-300
                ${activeCategory === category
                  ? 'bg-blue-800 text-white hover:bg-blue-700'
                  : 'bg-white border-gray-300 text-muted-foreground hover:bg-gray-100 hover:border-gray-400'
                }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {filteredCourses.length > 0 ? (
               filteredCourses.map((course) => (
                 <Card key={course.id} className="w-[360px] flex-shrink-0 snap-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden bg-card">
                     <div className="relative">
                       <Image
                         src="/images/course-placeholder.jpg"
                         alt={course.title}
                         width={360}
                         height={202}
                         className="object-cover w-full h-[202px]"
                       />
                       <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 text-sm font-semibold text-foreground rounded-full px-3 py-1">
                         <Calendar className="w-4 h-4 text-gray-500" />
                         <span>4 Weeks</span>
                       </div>
                       <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-black/40 rounded-full">
                         <Info className="w-5 h-5 text-white" />
                       </div>
                       <div className="absolute bottom-3 left-3 flex items-center gap-2">
                         <div className="flex items-center gap-1 bg-white/90 text-sm font-bold text-foreground rounded-full px-3 py-1">
                           <Signal className="w-4 h-4 text-red-500" />
                           <span>Beginner</span>
                         </div>
                         <div className="bg-white/90 text-sm font-bold text-foreground rounded-full px-3 py-1">
                           <span>Course</span>
                         </div>
                       </div>
                     </div>
                     <CardContent className="p-4 flex flex-col gap-3">
                       {course.description && (
                         <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{course.description}</p>
                       )}
                       <Link href={`/courses/${course.slug}`} className="group">
                         <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                           {course.title}
                         </h3>
                       </Link>
                       <div className="flex justify-between items-center text-accent font-bold">
                         <div className="flex items-center gap-2 text-blue-800">
                           <span>+{course._count?.enrollments || 0} enrolled</span>
                           <Bookmark className="w-5 h-5" />
                         </div>
                       </div>
                       <Link href={`/courses/${course.slug}`} className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary font-bold py-2.5 px-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                         <span>View Course</span>
                         <ChevronRight className="w-5 h-5" />
                       </Link>
                     </CardContent>
                   </Card>
               ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-lg text-muted-foreground">No courses found for this category.</p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 -left-5 md:-left-6 w-12 h-12 rounded-full bg-white shadow-md hover:bg-gray-100 hidden lg:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 -right-5 md:-right-6 w-12 h-12 rounded-full bg-white shadow-md hover:bg-gray-100 hidden lg:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-block bg-primary text-primary-foreground font-bold rounded-lg px-8 py-4 text-lg hover:opacity-90 transition-opacity"
          >
            Browse More {activeCategory} Courses
          </Link>
        </div>
      </div>
    </section>
  );
}