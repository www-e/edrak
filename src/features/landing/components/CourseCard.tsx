"use client";

import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the shape of the data a card will receive
type CourseCardProps = {
  imageUrl: string;
  level: string;
  type: string;
  title: string;
  studentCount: string;
  link: string;
};

export function CourseCard({ imageUrl, level, type, title, studentCount, link }: CourseCardProps) {
  return (
    // CardContainer from Aceternity UI enables the 3D effect.
    // We remove the default padding (`py-20`) to make it fit our design.
    <CardContainer containerClassName="py-0" className="w-full">
      <CardBody className="relative group/card w-full h-auto rounded-xl">
        {/* We use shadcn's Card component for consistent theme styling */}
        <Card className="w-full h-full rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform-gpu">
          <CardItem translateZ='75' className='w-full'>
            <Image
              src={imageUrl}
              height='1000'
              width='1000'
              className='h-48 w-full object-cover'
              alt={`Promotional image for the course: ${title}`}
            />
          </CardItem>
          <div className='p-6 space-y-3'>
            <CardItem translateZ='50' className='flex gap-2 text-xs'>
              <span className='bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold px-2 py-1 rounded font-heading'>
                {level}
              </span>
              <span className='bg-primary/10 text-primary dark:bg-primary/20 font-semibold px-2 py-1 rounded font-heading'>
                {type}
              </span>
            </CardItem>

            <CardItem
              translateZ='100'
              className='text-lg font-bold text-foreground tracking-wide font-heading'
            >
              {title}
            </CardItem>

            <CardItem
              translateZ='30'
              className='text-sm text-muted-foreground font-body'
            >
              {studentCount}+ learners
            </CardItem>

            <div className='border-t border-border my-4'></div>
            
            <CardItem translateZ='40' className='w-full pt-2'>
              <Button asChild variant='outline' className='w-full font-semibold font-heading hover:scale-105 transition-transform duration-200'>
                <a href={link}>
                  View Specialization &rarr;
                </a>
              </Button>
            </CardItem>
          </div>
        </Card>
      </CardBody>
    </CardContainer>
  );
}