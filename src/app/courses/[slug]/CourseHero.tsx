import { Badge } from '@/components/ui/badge';
import { Star, Users, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Course } from '@/features/courses/types';

interface CourseHeroProps {
  course: Course;
}

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {course.category && (
                <Badge variant="secondary">{course.category.name}</Badge>
              )}
              <Badge variant="outline">Beginner Friendly</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              {course.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{course.rating > 0 ? course.rating.toFixed(1) : '0.0'}</span>
                <span className="text-muted-foreground">({course.ratingCount || 0} ratings)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-5 w-5" />
                <span>{course._count.enrollments} students</span>
              </div>
              
              <div className="flex items-center gap-1">
                <BookOpen className="h-5 w-5" />
                <span>{course._count.lessons} lessons</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span>Created by</span>
              <span className="font-semibold">
                {course.professor.firstName} {course.professor.lastName}
              </span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-full h-80 max-w-md">
              <Image
                src={`/images/course${(course.id.charCodeAt(0) % 3) + 1}.png`}
                alt={course.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}