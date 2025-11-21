import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import TrainingHero from '@/components/training/training-hero';
import PricingTable from '@/components/training/pricing-table';
import SubscriptionForm from '@/components/training/subscription-form';
import FAQSection from '@/components/training/faq-section';
import CallToActionSection from '@/components/training/call-to-action-section';

export const metadata: Metadata = {
  title: 'Training Programs | SportologyPlus',
  description: 'Professional training programs for all levels - home training, gym training, and sport-specific programs with certified trainers',
};

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <TrainingHero />
        <PricingTable />
        <SubscriptionForm />
        <FAQSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}