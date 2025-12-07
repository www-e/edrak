import FeatureGrid from '@/components/shared/FeatureGrid';
import { BarChart3, Clock, Award, MessageCircle } from 'lucide-react';

export default function WhyChooseSection() {
  const reasons = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Programs Built on Personal Data Analysis",
      description: "Personalized programs based on your personal data analysis, not just general templates",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Weekly/Monthly Monitoring & Program Flexibility",
      description: "Continuous monitoring and flexibility in program adjustments based on your progress",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Professional Recommendations for Nutrition & Sleep",
      description: "Expert recommendations on nutrition and sleep to achieve the best results",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Direct Support from Certified Nutritionist",
      description: "Direct support from a certified nutritionist for personalized guidance and answers",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <FeatureGrid
      title="Why Choose Our Nutrition Programs?"
      items={reasons}
      columns={2}
      background="bg-gradient-to-br from-gray-50 to-white"
      showIcon={true}
      centerContent={false}
      cardStyle="default"
    />
  );
}