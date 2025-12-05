import Hero from '@/components/shared/Hero';
import { ServicesShapes } from '@/components/shared/FloatingShapes';

export default function TrainingHero() {
  return (
    <Hero
      title="Professional Training Programs for Every Goal"
      subtitle="Training Programs"
      description="Get personalized training programs designed by certified trainers. From home workouts to gym training and sport-specific programs - we have the perfect plan for you."
      iconEmoji="💪"
      backgroundGradient="from-orange-100/50 to-red-100/50"
      iconBackgroundColor="bg-orange-100/50"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Training Programs' }
      ]}
      primaryButton={{
        text: "Choose Your Program",
        href: "#packages"
      }}
      secondaryButton={{
        text: "View Comparison",
        href: "#packages"
      }}
    >
      <ServicesShapes />
    </Hero>
  );
}