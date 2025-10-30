'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

interface CallToActionProps {
  title: string;
  description: string;
  badgeText?: string;
  primaryButton?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryButton?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  trustIndicators?: Array<{
    number: string;
    label: string;
  }>;
  backgroundGradient?: string;
  className?: string;
}

export default function CallToActionSection({
  title,
  description,
  badgeText = "Get Started",
  primaryButton = {
    text: "Learn More"
  },
  secondaryButton,
  trustIndicators = [
    { number: "500+", label: "Happy Customers" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Expert Support" }
  ],
  backgroundGradient = "from-primary via-green-600 to-primary",
  className = ""
}: CallToActionProps) {
  return (
    <section className={`py-24 bg-gradient-to-br ${backgroundGradient} text-white relative overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 bg-white/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-[15%] w-80 h-80 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-8 border border-white/20">
              <Star className="w-5 h-5" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              {title}
            </h2>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {primaryButton.href ? (
              <Link href={primaryButton.href} className="group px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3">
                <span className="text-lg">{primaryButton.text}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <button 
                onClick={primaryButton.onClick}
                className="group px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
              >
                <span className="text-lg">{primaryButton.text}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}
            
            {secondaryButton && (
              secondaryButton.href ? (
                <Link href={secondaryButton.href} className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {secondaryButton.text}
                </Link>
              ) : (
                <button 
                  onClick={secondaryButton.onClick}
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {secondaryButton.text}
                </button>
              )
            )}
          </motion.div>

          {/* Trust indicators */}
          {trustIndicators && trustIndicators.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-12 border-t border-white/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {trustIndicators.map((indicator, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold mb-2">{indicator.number}</div>
                    <div className="text-white/80 text-sm">{indicator.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}