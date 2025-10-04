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

// This is the main entry point for your landing page.
// We are composing the page from the sections we've built.
// This approach keeps the page file clean and focuses on the structure.
export default async function LandingPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;

  // Check if this is a Paymob payment return request
  const isPaymobReturn = resolvedSearchParams.id && resolvedSearchParams.success !== undefined;

  // If it's a Paymob return, process the payment and redirect to proper payment return page
  if (isPaymobReturn) {
    console.log("=== PROCESSING PAYMOB RETURN ===");
    console.log("Payment data received:", resolvedSearchParams);

    try {
      // Process the payment data synchronously
      await processPaymentReturn(resolvedSearchParams);

      // Redirect to proper payment return page with processed status
      const params = new URLSearchParams();
      Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, Array.isArray(value) ? value[0] : value);
        }
      });
      redirect(`/payments/return?${params.toString()}`);
    } catch (error) {
      console.error("Payment processing failed:", error);
      // Still redirect to return page even if processing fails
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