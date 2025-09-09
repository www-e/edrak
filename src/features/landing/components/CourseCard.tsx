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
        <Card className="w-full h-full rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300">
          <CardItem translateZ="50" className="w-full">
            <Image
              src={imageUrl}
              height="1000"
              width="1000"
              className="h-48 w-full object-cover"
              alt={`Promotional image for the course: ${title}`}
            />
          </CardItem>
          <div className="p-6 text-right space-y-3">
            <CardItem as="div" translateZ="40" className="flex justify-end gap-2 text-xs">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold px-2 py-1 rounded">
                {level}
              </span>
              <span className="bg-primary/10 text-primary dark:bg-primary/20 font-semibold px-2 py-1 rounded">
                {type}
              </span>
            </CardItem>

            <CardItem
              as="h4"
              translateZ="60"
              className="text-lg font-bold text-foreground tracking-wide"
            >
              {title}
            </CardItem>

            <CardItem
              as="p"
              translateZ="20"
              className="text-sm text-muted-foreground"
            >
              {studentCount}+ متعلم
            </CardItem>

            <div className="border-t border-border my-4"></div>
            
            <CardItem translateZ="30" className="w-full pt-2">
              <Button asChild variant="outline" className="w-full font-semibold">
                <a href={link}>
                  عرض التخصص &larr;
                </a>
              </Button>
            </CardItem>
          </div>
        </Card>
      </CardBody>
    </CardContainer>
  );
}