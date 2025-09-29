import { Header } from "@/features/landing/components/Header";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { CompaniesSection } from "@/features/landing/components/CompaniesSection";
import { CategoriesSection } from "@/features/landing/components/CategoriesSection";
import { FeaturedCoursesSection } from "@/features/landing/components/FeaturedCoursesSection";
import { ActivitiesSection } from "@/features/landing/components/ActivitiesSection";
import { Footer } from "@/features/landing/components/Footer";
import { K12Section } from "@/features/landing/components/K12Section";
import { BlogSection } from "@/features/landing/components/BlogSection";
import { CourseSearch } from "@/features/landing/components/CourseSearch";

// This is the main entry point for your landing page.
// We are composing the page from the sections we've built.
// This approach keeps the page file clean and focuses on the structure.
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background font-body">
      <Header />
      <HeroSection />
      <CompaniesSection />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <CourseSearch />
      <ActivitiesSection />
      <K12Section />
      <BlogSection />
      <Footer />
    </main>
  );
}