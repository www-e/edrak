'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Dumbbell, Apple, Brain, Podcast, Briefcase } from 'lucide-react';
import { ReactNode } from 'react';

interface EcosystemCard {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const ecosystemCards: EcosystemCard[] = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Learning',
    description: 'Professional courses to build your knowledge and refine your professional skills',
    color: 'from-primary to-primary/70',
    delay: 0.1
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: 'Training',
    description: 'Customized programs to achieve your physical goals',
    color: 'from-blue-500 to-blue-600',
    delay: 0.2
  },
  {
    icon: <Apple className="w-8 h-8" />,
    title: 'Nutrition',
    description: 'Smart nutrition plans that support your performance and suit your lifestyle and goals',
    color: 'from-green-500 to-emerald-600',
    delay: 0.3
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Mental Support',
    description: 'Specialized consultations to enhance mental strength and confidence in competitions',
    color: 'from-purple-500 to-pink-500',
    delay: 0.4
  },
  {
    icon: <Podcast className="w-8 h-8" />,
    title: 'Content',
    description: 'Programs, podcasts and articles from elite experts',
    color: 'from-orange-500 to-red-500',
    delay: 0.5
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Employment',
    description: 'Help in getting real job opportunities in the sports field',
    color: 'from-indigo-500 to-violet-600',
    delay: 0.6
  }
];

export default function EcosystemGrid() {
  return (
    <section className="py-24">
      <div className="container max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Comprehensive Platform for All Aspects of Your Sports Life
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At SportologyPlus, we do not offer just one service... but a comprehensive ecosystem that supports you through every stage of your sports journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecosystemCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative h-full bg-white/40 backdrop-blur-sm border-2 border-gray-200/60 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                {/* Enhanced gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-8 transition-opacity duration-500`} />

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full"></div>

                {/* Icon with enhanced styling */}
                <div className={`relative inline-flex p-5 rounded-2xl bg-gradient-to-br ${card.color} text-white mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {card.icon}
                </div>

                {/* Content with better typography */}
                <h3 className="text-2xl font-bold font-heading mb-4 group-hover:text-primary transition-colors relative z-10">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {card.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
