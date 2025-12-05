import Hero from '@/components/shared/Hero';
import { NutritionShapes } from '@/components/shared/FloatingShapes';

export default function NutritionHero() {
  return (
    <Hero
      title="Personalized Nutrition for Peak Performance"
      subtitle="Nutrition Programs"
      description="Professional nutrition programs designed specifically for athletes. Get personalized meal plans, expert guidance, and continuous support to achieve your fitness goals."
      iconEmoji="🥗"
      backgroundGradient="from-green-100/50 to-emerald-100/50"
      iconBackgroundColor="bg-green-100/50"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Nutrition Programs' }
      ]}
      primaryButton={{
        text: "Get Your Program Now",
        href: "#form"
      }}
      secondaryButton={{
        text: "View Packages",
        href: "#packages"
      }}
    >
      <NutritionShapes />
    </Hero>
  );
}