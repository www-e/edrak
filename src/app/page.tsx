import { redirect } from 'next/navigation';
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
import { processPaymentReturn } from '@/lib/payment-return-processor';

export default async function LandingPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;

  const isPaymobReturn = resolvedSearchParams.id && resolvedSearchParams.success !== undefined;

  if (isPaymobReturn) {
    try {
      await processPaymentReturn(resolvedSearchParams);
      const params = new URLSearchParams();
      Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, Array.isArray(value) ? value[0] : value);
        }
      });
      redirect(`/payments/return?${params.toString()}`);
    } catch {
      const params = new URLSearchParams();
      Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, Array.isArray(value) ? value[0] : value);
        }
      });
      redirect(`/payments/return?${params.toString()}`);
    }
  }

  // Otherwise, show the normal landing page
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