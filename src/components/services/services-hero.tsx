import Hero from '@/components/shared/Hero';
import { ServicesShapes } from '@/components/shared/FloatingShapes';

export default function ServicesHero() {
  return (
    <Hero
      title="Comprehensive Solutions for Every Athlete"
      subtitle="Our Services"
      description="Everything you need for your sports development in one platform that combines science, experience, and continuous support."
      iconEmoji="🏆"
      backgroundGradient="from-primary/10 to-green-100/50"
      iconBackgroundColor="bg-primary/10"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Our Services' }
      ]}
      primaryButton={{
        text: "Get Started Today"
      }}
      secondaryButton={{
        text: "Learn More"
      }}
    >
      <ServicesShapes />
    </Hero>
  );
}
