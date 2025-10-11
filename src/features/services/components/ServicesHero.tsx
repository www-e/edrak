'use client';

import { motion } from 'framer-motion';
import { ServiceType, ServiceTheme } from '@/app/services/page';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Waves } from 'lucide-react';

interface ServicesHeroProps {
  theme: ServiceTheme;
  activeService: ServiceType;
}

const serviceContent = {
  physiotherapy: {
    title: "Restore Movement, Reclaim Life",
    subtitle: "Expert physical therapy and rehabilitation services tailored to your unique needs. From injury recovery to performance optimization.",
    highlights: ["Evidence-based treatments", "Personalized care plans", "Advanced rehabilitation techniques"],
    cta: "Start Your Recovery Journey"
  },
  swimming: {
    title: "Dive Into Excellence",
    subtitle: "Master the art of swimming with world-class instruction. From learning to swim to competitive training and aquatic therapy.",
    highlights: ["Professional coaching", "Technique mastery", "Water confidence building"],
    cta: "Begin Your Aquatic Journey"
  }
};

export function ServicesHero({ theme, activeService }: ServicesHeroProps) {
  const content = serviceContent[activeService];
  const Icon = activeService === 'physiotherapy' ? Activity : Waves;

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: theme.surface }}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        {activeService === 'physiotherapy' ? (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <Badge
                variant="outline"
                className="w-fit border-2 px-4 py-2 text-sm font-semibold"
                style={{
                  borderColor: theme.accent,
                  color: theme.accent,
                  backgroundColor: `${theme.accent}10`
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                Professional {theme.name} Services
              </Badge>

              <h1
                className="text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: theme.text }}
              >
                {content.title}
              </h1>

              <p
                className="text-xl leading-relaxed max-w-lg"
                style={{ color: theme.textMuted }}
              >
                {content.subtitle}
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid gap-4"
            >
              {content.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <span style={{ color: theme.textMuted }}>{highlight}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: theme.primary,
                  color: 'white'
                }}
              >
                {content.cta}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 font-semibold border-2 hover:bg-opacity-10 transition-all duration-300"
                style={{
                  borderColor: theme.accent,
                  color: theme.accent,
                  backgroundColor: `${theme.accent}10`
                }}
              >
                View Pricing Plans
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Element - Static but Interactive */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[500px] lg:h-[600px]"
          >
            {/* Static Background Shape */}
            <div
              className="absolute inset-0 rounded-3xl opacity-10 hover:opacity-20 transition-opacity duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              }}
            />

            {/* Interactive Elements */}
            <div className="absolute inset-0">
              {activeService === 'physiotherapy' ? (
                // Medical-themed static elements
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        scale: 1.1,
                        opacity: 0.8,
                        transition: { duration: 0.2 }
                      }}
                      className="absolute w-16 h-16 rounded-full border-2 cursor-pointer hover:border-opacity-100"
                      style={{
                        borderColor: `${theme.accent}40`,
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`
                      }}
                    />
                  ))}
                </div>
              ) : (
                // Swimming-themed static elements
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        scale: 1.2,
                        opacity: 0.9,
                        transition: { duration: 0.2 }
                      }}
                      className="absolute w-12 h-8 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: `${theme.secondary}60`,
                        left: `${10 + i * 10}%`,
                        top: `${15 + (i % 4) * 20}%`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}