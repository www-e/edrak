import FeatureGrid from '@/components/shared/FeatureGrid';
import { GraduationCap, Dumbbell, Apple, Brain, Podcast, Briefcase } from 'lucide-react';

const ecosystemCards = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Learning',
    description: 'Professional courses to build your knowledge and refine your professional skills',
    color: 'from-primary to-primary/70'
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: 'Training',
    description: 'Customized programs to achieve your physical goals',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: <Apple className="w-8 h-8" />,
    title: 'Nutrition',
    description: 'Smart nutrition plans that support your performance and suit your lifestyle and goals',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Mental Support',
    description: 'Specialized consultations to enhance mental strength and confidence in competitions',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <Podcast className="w-8 h-8" />,
    title: 'Content',
    description: 'Programs, podcasts and articles from elite experts',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Employment',
    description: 'Help in getting real job opportunities in the sports field',
    color: 'from-indigo-500 to-violet-600'
  }
];

export default function EcosystemGrid() {
  return (
    <FeatureGrid
      title="Comprehensive Platform for All Aspects of Your Sports Life"
      description="At SportologyPlus, we do not offer just one service... but a comprehensive ecosystem that supports you through every stage of your sports journey"
      items={ecosystemCards}
      columns={3}
      showIcon={true}
      centerContent={false}
      cardStyle="hover-effect"
    />
  );
}
