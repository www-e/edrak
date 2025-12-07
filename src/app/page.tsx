import { CourseService } from '@/server/services/courseService';
import { Header } from "@/features/landing/components/Header";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { FeaturedCoursesSection } from "@/features/landing/components/FeaturedCoursesSection";
import { ActivitiesSection } from "@/features/landing/components/ActivitiesSection";
import { Footer } from "@/features/landing/components/Footer";
import { K12Section } from "@/features/landing/components/K12Section";
import { BlogSection } from "@/features/landing/components/BlogSection";
import { CourseSearch } from "@/features/landing/components/CourseSearch";

// Enable ISR - regenerate every 30 minutes for fresh content
export const revalidate = 1800;

type FeaturedCourse = {
  id: string;
  title: string;
  description: string;
  price: number;
  language: string;
  slug: string;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  category: { name: string } | null;
  professor: { firstName: string; lastName: string };
  _count: { enrollments: number };
};

function LandingContent({ featuredCourses }: { featuredCourses: FeaturedCourse[] }) {
  return (
    <main className="min-h-screen bg-background font-body">
      <Header />
      <HeroSection />
      <FeaturedCoursesSection initialCourses={featuredCourses} />
      <CourseSearch />
      <ActivitiesSection />
      <K12Section />
      <BlogSection />
      <Footer />
    </main>
  );
}

export default async function LandingPage() {
  // Pre-fetch featured courses server-side for instant loading
  const { courses: featuredCourses } = await CourseService.getPublishedCourses({
    limit: 3
  });

  return <LandingContent featuredCourses={featuredCourses} />;
}