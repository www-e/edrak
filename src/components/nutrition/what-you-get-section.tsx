import FeatureGrid from '@/components/shared/FeatureGrid';
import { ClipboardList, Target, FileText, MessageCircle, Video, Award } from 'lucide-react';

export default function WhatYouGetSection() {
  const benefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Comprehensive Assessment of Your Health & Goals",
      description: "Complete evaluation of your current health status and fitness objectives",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Meal Plan & Complementary Recommendations",
      description: "Personalized meal plans with complementary recommendations and healthy recipes",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Comprehensive PDF Analysis Report",
      description: "Detailed analytical PDF report of your nutritional patterns and lifestyle",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Direct Support & Priority Response",
      description: "Direct support on WhatsApp with priority response based on your package",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Calls with Nutritionist",
      description: "Video calls with a nutrition expert to analyze results and modify plans",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Monthly Nutrition Certificate",
      description: "Nutrition follow-up certificate that can be added to your athletic resume",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <FeatureGrid
      title="What Will You Get?"
      description="Comprehensive support and professional guidance for your nutrition journey"
      items={benefits}
      columns={3}
      background="bg-gradient-to-br from-green-50 to-emerald-50"
      showIcon={true}
      centerContent={true}
      cardStyle="default"
    />
  );
}