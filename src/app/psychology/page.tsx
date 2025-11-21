import { Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import PsychologyHero from '@/components/psychology/psychology-hero';
import PsychologyPackages from '@/components/psychology/psychology-packages';
import PsychologyForm from '@/components/psychology/psychology-form';
import PsychologyFAQ from '@/components/psychology/psychology-faq';
import CallToActionSection from '@/components/shared/CallToAction';
import ImageGallery from '@/components/services/ImageGallery';

export const metadata: Metadata = {
  title: 'Sports Psychology Consultations | SportologyPlus',
  description: 'Professional sports psychology consultations for athletes - mental performance training, stress management, and confidence building',
};

export default function PsychologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <PsychologyHero />
        <ImageGallery
          title="Psychology Consultation Gallery"
          subtitle="Visual insights into our sports psychology services"
          images={[
            {
              src: "/images/doctor-talks-with-client.png",
              alt: "Sports psychologist talking with client",
              caption: "One-on-one consultation session"
            },
            {
              src: "/images/client-talks-with-doctor.png",
              alt: "Client speaking with sports psychologist",
              caption: "Understanding mental performance needs"
            },
            {
              src: "/images/male-doctor-with-client.png",
              alt: "Male sports psychologist with client",
              caption: "Professional psychological support"
            }
          ]}
        />
        <PsychologyPackages />
        <PsychologyForm />
        <PsychologyFAQ />
        <CallToActionSection
          title="Ready to Strengthen Your Mental Game?"
          description="Join hundreds of athletes who have transformed their performance through mental coaching. Start your journey to peak psychological performance today."
          badgeText="Mental Performance"
          primaryButton={{
            text: "Book Consultation",
            href: "#form"
          }}
          secondaryButton={{
            text: "Learn More",
            href: "#packages"
          }}
          trustIndicators={[
            { number: "200+", label: "Athletes Coached" },
            { number: "4.9/5", label: "Success Rating" },
            { number: "15+", label: "Expert Psychologists" }
          ]}
          backgroundGradient="from-purple-600 via-pink-500 to-blue-600"
        />
      </main>
      <Footer />
    </div>
  );
}