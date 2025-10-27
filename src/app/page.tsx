import { CourseService } from '@/server/services/courseService';
import { Header } from "@/features/landing/components/Header";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { CompaniesSection } from "@/features/landing/components/CompaniesSection";
import { FeaturedCoursesSection } from "@/features/landing/components/FeaturedCoursesSection";
import { ActivitiesSection } from "@/features/landing/components/ActivitiesSection";
import { Footer } from "@/features/landing/components/Footer";
import { K12Section } from "@/features/landing/components/K12Section";
import { BlogSection } from "@/features/landing/components/BlogSection";
import { CourseSearch } from "@/features/landing/components/CourseSearch";

// Enable ISR - regenerate every 30 minutes for fresh content
export const revalidate = 1800;

export default async function LandingPage() {
  // Pre-fetch featured courses server-side for instant loading
  const featuredCourses = await CourseService.getPublishedCourses({
    limit: 3
  });

  return (
    <main className="min-h-screen bg-background font-body">
      <Header />

      <HeroSection />

      <CompaniesSection />

      <FeaturedCoursesSection initialCourses={featuredCourses.courses} />

      <CourseSearch />

      <ActivitiesSection />

      <K12Section />

      <BlogSection />

      <Footer />
    </main>
  );
}
