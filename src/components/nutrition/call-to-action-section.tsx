import CallToActionSection from '@/components/shared/CallToAction';

export default function NutritionCallToAction() {
  return (
    <CallToActionSection
      title="Try a Nutrition Plan That Combines Science & Practical Experience"
      description="Start your journey towards the best athletic and healthy version of yourself"
      badgeText="Transform Your Performance"
      primaryButton={{
        text: "Get Your Program Now"
      }}
      secondaryButton={{
        text: "View All Packages"
      }}
      trustIndicators={[
        { number: "500+", label: "Athletes Transformed" },
        { number: "95%", label: "Success Rate" },
        { number: "24/7", label: "Expert Support" }
      ]}
      backgroundGradient="from-green-600 via-emerald-600 to-green-700"
    />
  );
}