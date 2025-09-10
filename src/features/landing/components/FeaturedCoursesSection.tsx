import { Button } from "@/components/ui/button";
import { CourseCard } from "./CourseCard";

// In a real app, this data would come from an API or database.
const courses = [
  {
    imageUrl: "/images/course1.png",
    level: "Intermediate",
    type: "Specialization",
    title: "Microsoft SQL Server Database",
    studentCount: "10,700",
    link: "#",
  },
  {
    imageUrl: "/images/course2.png",
    level: "Intermediate",
    type: "Specialization",
    title: "Basic Leadership Tools",
    studentCount: "22,200",
    link: "#",
  },
  {
    imageUrl: "/images/course3.png",
    level: "Intermediate",
    type: "Specialization",
    title: "Professional Leadership Fundamentals",
    studentCount: "11,900",
    link: "#",
  },
];

export const FeaturedCoursesSection = () => {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      {/* 
        This div creates the subtle grid pattern on the left side of the section,
        just like in the original Edrak design, adding a professional touch.
      */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-0 -z-10 h-full w-1/4" 
        style={{
          backgroundImage: "url('/images/green-grid.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top left',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-primary font-heading">Specializations</h3>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground font-heading">
            Develop your skills through specialized educational paths and programs
          </h2>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button size="lg" className="font-bold px-8 py-6 rounded-lg font-heading">
            Browse All Specializations
          </Button>
        </div>
      </div>
    </section>
  );
};