import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import TrainingHero from '@/components/training/training-hero';
import PricingTable from '@/components/training/pricing-table';
import SubscriptionForm from '@/components/training/subscription-form';
import FAQSection from '@/components/training/faq-section';
import CallToActionSection from '@/components/training/call-to-action-section';
import ImageGallery from '@/components/services/ImageGallery';

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
        <ImageGallery
          title="Training Program Gallery"
          subtitle="Visual overview of our training programs and facilities"
          images={[
            {
              src: "/images/female-playing-sports.png",
              alt: "Female athlete participating in sports training",
              caption: "Sports training session"
            },
            {
              src: "/images/female-playing-yoga.png",
              alt: "Female practicing yoga",
              caption: "Flexibility and wellness training"
            },
            {
              src: "/images/gym-private-session.png",
              alt: "Personal trainer working with client in gym",
              caption: "Gym private training session"
            },
            {
              src: "/images/female2-playing-yoga.png",
              alt: "Female athlete in yoga pose",
              caption: "Athletic performance yoga"
            }
          ]}
        />
        <PricingTable />
        <SubscriptionForm />
        <FAQSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}