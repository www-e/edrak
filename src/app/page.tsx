'use client';

import { useState } from 'react';
import { Fade, Slide } from 'react-awesome-reveal';
import { Header } from "@/features/landing/components/Header";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { CompaniesSection } from "@/features/landing/components/CompaniesSection";
import { FeaturedCoursesSection } from "@/features/landing/components/FeaturedCoursesSection";
import { ActivitiesSection } from "@/features/landing/components/ActivitiesSection";
import { Footer } from "@/features/landing/components/Footer";
import { K12Section } from "@/features/landing/components/K12Section";
import { BlogSection } from "@/features/landing/components/BlogSection";
import { CourseSearch } from "@/features/landing/components/CourseSearch";
import LoadingIntro from '@/components/shared/LoadingIntro';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  return (
    <>
      {isLoading && <LoadingIntro onComplete={handleLoadingComplete} />}
      
      {!isLoading && (
        <main className="min-h-screen bg-background font-body">
          {/* Header fades in first */}
          <Fade duration={600} triggerOnce>
            <Header />
          </Fade>

          {/* Hero section slides up */}
          <Slide direction="up" duration={800} triggerOnce delay={200}>
            <HeroSection />
          </Slide>

          {/* Rest of the sections with staggered reveals */}
          <Fade duration={600} triggerOnce delay={400}>
            <CompaniesSection />
          </Fade>

          <Fade duration={600} triggerOnce delay={500}>
            <FeaturedCoursesSection />
          </Fade>

          <Fade duration={600} triggerOnce delay={600}>
            <CourseSearch />
          </Fade>

          <Fade duration={600} triggerOnce delay={700}>
            <ActivitiesSection />
          </Fade>

          <Fade duration={600} triggerOnce delay={800}>
            <K12Section />
          </Fade>

          <Fade duration={600} triggerOnce delay={900}>
            <BlogSection />
          </Fade>

          <Fade duration={600} triggerOnce delay={1000}>
            <Footer />
          </Fade>
        </main>
      )}
    </>
  );
}
