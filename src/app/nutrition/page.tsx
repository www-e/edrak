import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import NutritionHero from '@/components/nutrition/nutrition-hero';
import WhyChooseSection from '@/components/nutrition/why-choose-section';
import PackagesSection from '@/components/nutrition/packages-section';
import WhatYouGetSection from '@/components/nutrition/what-you-get-section';
import FAQSection from '@/components/nutrition/faq-section';
import CallToActionSection from '@/components/nutrition/call-to-action-section';

export const metadata: Metadata = {
  title: 'Nutrition Programs | SportologyPlus',
  description: 'Professional nutrition programs designed specifically for athletes - personalized plans, expert guidance, and continuous support',
};

export default function NutritionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <NutritionHero />
        <WhyChooseSection />
        <PackagesSection />
        <WhatYouGetSection />
        <FAQSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}