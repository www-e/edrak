'use client';

import { motion } from 'framer-motion';
import { ServiceType, ServiceTheme } from '@/app/services/page';
import { Button } from '@/components/ui/button';
import { Activity, Waves } from 'lucide-react';

interface ServiceTabsProps {
  activeService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
  theme: ServiceTheme;
}

const services = [
  {
    id: 'physiotherapy' as ServiceType,
    name: 'Physical Therapy',
    icon: Activity,
    description: 'Rehabilitation & Recovery',
    features: ['Injury Recovery', 'Pain Management', 'Performance Optimization']
  },
  {
    id: 'swimming' as ServiceType,
    name: 'Swimming',
    icon: Waves,
    description: 'Aquatic Training & Therapy',
    features: ['Swimming Lessons', 'Competitive Training', 'Water Therapy']
  }
];

export function ServiceTabs({ activeService, onServiceChange, theme }: ServiceTabsProps) {
  return (
    <section className="py-16" style={{ backgroundColor: theme.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Tab Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = activeService === service.id;

              return (
                <motion.div
                  key={service.id}
                  layout
                  className="relative"
                >
                  <Button
                    variant="outline"
                    onClick={() => onServiceChange(service.id)}
                    className={`w-full h-auto p-6 text-left transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'border-2 shadow-lg'
                        : 'border-2 hover:border-opacity-50'
                    }`}
                    style={{
                      borderColor: isActive ? theme.primary : `${theme.text}20`,
                      backgroundColor: isActive ? theme.surface : 'transparent',
                      color: isActive ? theme.primary : theme.text
                    }}
                  >
                    {/* Background Animation for Active Tab */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: theme.primary }}
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative z-10 flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-xl flex-shrink-0 ${
                          isActive ? 'text-white' : ''
                        }`}
                        style={{
                          backgroundColor: isActive ? theme.primary : `${theme.primary}15`,
                          color: isActive ? 'white' : theme.primary
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                        <p
                          className="text-sm mb-3"
                          style={{ color: isActive ? theme.text : theme.textMuted }}
                        >
                          {service.description}
                        </p>

                        <div className="space-y-1">
                          {service.features.map((feature) => (
                            <div
                              key={feature}
                              className="text-xs flex items-center space-x-2"
                              style={{ color: isActive ? theme.textMuted : `${theme.text}80` }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: theme.secondary }}
                              />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 opacity-0 hover:opacity-5 transition-opacity duration-300"
                        style={{ backgroundColor: theme.primary }}
                      />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Active Service Features */}
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: `${theme.primary}10`,
                borderColor: `${theme.primary}30`,
                color: theme.primary
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="text-sm font-medium">
                Currently Viewing: {services.find(s => s.id === activeService)?.name}
              </span>
            </div>

            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: theme.textMuted }}
            >
              {activeService === 'physiotherapy'
                ? "Choose from our comprehensive physical therapy programs designed to restore movement, reduce pain, and optimize your physical performance."
                : "Discover our swimming programs ranging from beginner lessons to competitive training, all designed to build confidence and skill in the water."
              }
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}