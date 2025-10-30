import FeatureGrid from '@/components/shared/FeatureGrid';
import ContentCards from '@/components/shared/ContentCards';
import { Play, FileText, Award, TrendingUp, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  { icon: <Play className="w-5 h-5" />, text: 'High-quality video lectures (HD) – simple and clear practical explanations' },
  { icon: <FileText className="w-5 h-5" />, text: 'Downloadable educational materials – PDF files, presentations, and scientific references' },
  { icon: <TrendingUp className="w-5 h-5" />, text: 'Interactive activities and assessment tests to enhance understanding and application' },
  { icon: <Award className="w-5 h-5" />, text: 'Certified digital certificates upon successful course completion' },
];

const specializations = [
  'Sports Training Sciences',
  'Sports Nutrition',
  'Sports Psychology',
  'Recovery and Physical Rehabilitation',
  'Sports Management',
  'Training for Special Categories',
  'Specialized Courses for Each Sport',
  'And More...'
];

const targetAudience = [
  'Sports Coaches',
  'Professional and Amateur Athletes',
  'Nutrition Specialists',
  'Sports Science Students',
  'Anyone Seeking Development in Their Sports Field',
  'Those Who Want a Better Healthy Life'
];

export default function CourseShowcase() {
  const featureGridItems = features.map((feature, index) => ({
    icon: feature.icon,
    title: `Feature ${index + 1}`,
    description: feature.text,
    color: "from-primary to-primary/70"
  }));

  const cards = [
    {
      title: "Available Specializations",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {specializations.map((spec, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{spec}</span>
            </div>
          ))}
        </div>
      ),
      icon: <span className="text-2xl">🏋️</span>,
      color: "from-primary/10 to-secondary/10"
    },
    {
      title: "Who is this service for?",
      content: (
        <div className="space-y-3">
          {targetAudience.map((audience, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-foreground">{audience}</span>
            </div>
          ))}
        </div>
      ),
      icon: <span className="text-2xl">👨‍🏫</span>,
      color: "from-primary to-accent",
      background: "gradient"
    }
  ];

  return (
    <section id="courses" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          {/* Left: Content (3 columns) */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="text-xl">🎓</span>
              <span>Online Educational Courses</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Learn from Experts...
              <span className="block text-primary mt-2">Anytime and Anywhere</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Explore our rich library of digital courses specialized in various branches of sports science, available online 24/7 with certified digital certificates.
            </p>

            {/* Features grid */}
            <FeatureGrid
              title=""
              description=""
              items={featureGridItems}
              columns={2}
              showIcon={true}
              centerContent={false}
              cardStyle="default"
            />

            {/* Pricing */}
            <div className="bg-white/60 border border-border rounded-2xl p-6 mb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Individual Course</p>
                  <p className="text-3xl font-bold text-foreground">
                    1,500 <span className="text-lg font-normal text-muted-foreground">EGP</span>
                  </p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-medium mb-1">
                    20% Discount
                  </div>
                  <p className="text-sm text-muted-foreground">3-Course Package</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/courses">
                  <span>Browse Courses Now</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/courses">
                  Start Learning Now
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Info Cards (2 columns) */}
          <div className="lg:col-span-2">
            <ContentCards
              cards={cards}
              columns={2}
              spacing="large"
              background="glass"
              hoverEffect={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
