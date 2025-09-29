import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Signal, Info, ChevronRight, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Define the shape of the data a card will receive
type CourseCardProps = {
  id: string | number;
  image: string;
  duration: string;
  specialization?: string;
  type: string;
  level: 'Beginner' | 'Intermediate';
  title: string;
  enrollment: string;
  url: string;
};

export function CourseCard({
  image,
  duration,
  specialization,
  type,
  level,
  title,
  enrollment,
  url
}: CourseCardProps) {
  return (
    <Card className="w-full max-w-[360px] flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden bg-card transition-shadow duration-300 hover:shadow-lg">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={360}
            height={202}
            className="object-cover w-full h-[202px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
            priority={false}
          />
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 text-sm font-semibold text-foreground rounded-full px-3 py-1 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{duration}</span>
          </div>
          <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 text-sm font-bold text-foreground rounded-full px-3 py-1 backdrop-blur-sm">
              <Signal className="w-4 h-4 text-red-500" />
              <span>{level}</span>
            </div>
            <div className="bg-white/90 text-sm font-bold text-foreground rounded-full px-3 py-1 backdrop-blur-sm">
              <span>{type}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4 flex flex-col gap-3">
          {specialization && (
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{specialization}</p>
          )}
          <Link href={url} className="group">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {title}
            </h3>
          </Link>
          <div className="flex justify-between items-center text-accent font-bold">
            <div className="flex items-center gap-2 text-blue-800">
              <span className="text-sm">{enrollment}</span>
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <Link href={url} className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary font-bold py-2.5 px-4 hover:bg-primary hover:text-primary-foreground transition-colors">
            <span>View Course</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </CardContent>
      </Card>
  );
}