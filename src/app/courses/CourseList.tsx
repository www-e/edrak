'use client';

import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight, Calendar, Signal, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  'Career Preparation', 'Technology', 'Self Development', 'Business & Entrepreneurship',
  'Languages', 'Art, Design & Media', 'Teacher Education & Training', 'Classroom Environment', 'Humanities'
];

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: { name: string } | null;
  _count?: { enrollments?: number };
}

const FilterButton = ({ category, selected, onClick }: {
  category: string; selected: boolean; onClick: () => void;
}) => (
  <Button
    variant={selected ? 'default' : 'outline'}
    onClick={onClick}
    className={`rounded-full px-6 py-3 text-base font-medium transition-all duration-300 ${
      selected
        ? 'bg-primary text-primary-foreground shadow-lg'
        : 'hover:bg-primary/10 hover:border-primary'
    }`}
  >
    {category}
  </Button>
);

const CourseCard = ({ course }: { course: Course }) => (
  <div className="bg-card rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-2xl transition-all duration-300 group">
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
        <Signal className="w-5 h-5 text-white" />
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
    <div className="p-6 flex flex-col gap-3">
      {course.category && <Badge variant="secondary" className="w-fit">{course.category.name}</Badge>}
      <Link href={`/courses/${course.slug}`} className="group">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{course.description}</p>
      <div className="flex justify-between items-center text-accent font-bold">
        <div className="flex items-center gap-2 text-blue-800">
          <span>+{course._count?.enrollments || 0} enrolled</span>
          <Bookmark className="w-5 h-5" />
        </div>
      </div>
      <Link
        href={`/courses/${course.slug}`}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary font-bold py-3 px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <span>View Course</span>
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  </div>
);

export function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const pageSize = 12;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => setCurrentPage(1), [selectedCategory, debouncedSearchQuery]);

  const { data: coursesData, isLoading, error } = api.public.course.getAllCourses.useQuery({
    category: selectedCategory || undefined,
    search: debouncedSearchQuery || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const courses = coursesData?.courses || [];
  const pagination = coursesData?.pagination;

  if (error) {
    return (
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center py-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">Unable to load courses</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Explore Our Courses</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover expertly designed courses to advance your skills and accelerate your career growth
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
            <Input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-4 h-14 text-lg rounded-xl border-2 border-border focus:border-primary bg-background"
            />
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <FilterButton category="All Categories" selected={!selectedCategory} onClick={() => setSelectedCategory('')} />
            {categories.map(category => (
              <FilterButton
                key={category}
                category={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {pagination?.totalCount || 0} {pagination?.totalCount === 1 ? "Course" : "Courses"}
            </h2>
            {selectedCategory && (
              <p className="text-muted-foreground mt-1">
                in <span className="font-medium text-primary">{selectedCategory}</span>
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)} className="lg:hidden">
            Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-card rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">No courses found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
              <Button onClick={() => { setSelectedCategory(''); setSearchQuery(''); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} courses
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={!pagination.hasPrev} className="rounded-full">
                <ChevronLeft className="h-5 w-5" /> Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="lg"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-12 h-12 rounded-full font-bold ${currentPage === pageNum ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-primary/10 hover:border-primary'}`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button variant="outline" size="lg" onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))} disabled={!pagination.hasNext} className="rounded-full">
                Next <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}