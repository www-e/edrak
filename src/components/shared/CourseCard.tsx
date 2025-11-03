import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/features/courses/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseCardProps {
  course: Course;
}

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t">
          <Skeleton className="h-4 w-12" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <Skeleton className="h-3 w-24 mt-3" />
      </CardContent>
    </Card>
  );
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={course.thumbnailUrl || `/images/course${(course.id.charCodeAt(0) % 3) + 1}.png`}
            alt={course.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            unoptimized={true}
          />
        </div>
        <CardContent className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              {course.category && (
                <Badge variant="secondary" className="mb-2">
                  {course.category.name}
                </Badge>
              )}
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{course._count.enrollments}+</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>{course.rating > 0 ? course.rating.toFixed(1) : '0.0'}</span>
              </div>
              {course.price > 0 ? (
                <span className="font-bold">${course.price.toFixed(2)}</span>
              ) : (
                <span className="text-green-600 font-medium">Free</span>
              )}
            </div>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            By {course.professor.firstName} {course.professor.lastName}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}