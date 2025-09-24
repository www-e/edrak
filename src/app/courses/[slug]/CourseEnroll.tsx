'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Course } from '@/features/courses/types';

interface CourseEnrollProps {
  course: Course;
}

export function CourseEnroll({ course }: CourseEnrollProps) {
  const { data: session } = useSession();
  
  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-heading">
              {course.price > 0 ? `${course.price.toFixed(2)}` : 'Free'}
            </h3>
            <p className="text-muted-foreground mt-1">
              Lifetime access • 30-day money-back guarantee
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {session ? (
              <Button size="lg" className="w-full sm:w-auto">
                Enroll Now
              </Button>
            ) : (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={`/auth/signup?callbackUrl=/courses/${course.slug}`}>
                  Sign Up & Enroll
                </Link>
              </Button>
            )}
            
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Add to Wishlist
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}