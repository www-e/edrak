import Hero from '@/components/shared/Hero';
import { ServicesShapes } from '@/components/shared/FloatingShapes';

export default function PsychologyHero() {
  return (
    <Hero
      title="Sports Psychology for Peak Performance"
      subtitle="Sports Psychology Consultations"
      description="Because the athletic mind is the foundation of victory... In Sportology Plus, we provide you with a unique service to support you psychologically in your sports journey. Whether you're a beginner starting your path, a player preparing for a local championship, or a professional competing at the highest levels—we're here with you through specialized sports psychologists."
      iconEmoji="🧠"
      backgroundGradient="from-purple-100/50 to-pink-100/50"
      iconBackgroundColor="bg-purple-100/50"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Sports Psychology' }
      ]}
      primaryButton={{
        text: "Choose Your Package"
      }}
      secondaryButton={{
        text: "View Packages"
      }}
    >
      <ServicesShapes />
    </Hero>
  );
}