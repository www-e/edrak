'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Enhanced floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[10%] w-80 h-80 bg-gradient-to-r from-primary/20 to-green-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[15%] w-96 h-96 bg-gradient-to-r from-accent/20 to-blue-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/30 to-primary/30 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Enhanced Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-sm text-muted-foreground mb-12"
        >
          <Link href="/" className="hover:text-primary transition-colors font-medium px-3 py-1 rounded-full hover:bg-primary/5">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">Our Services</span>
        </motion.nav>

        {/* Enhanced Hero content */}
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-green-100/50 text-primary text-sm font-semibold mb-8 border border-primary/20"
          >
            <span className="text-3xl animate-bounce">🏆</span>
            <span>Our Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold font-heading mb-8 leading-tight"
          >
            <span className="text-gray-900">Comprehensive Solutions</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-600 to-primary mt-3 animate-pulse">
              for Every Athlete
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-4xl"
          >
            Everything you need for your sports development in one platform that combines science, experience, and continuous support.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-green-600 text-white font-bold rounded-2xl hover:from-primary/90 hover:to-green-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Get Started Today
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-primary/20 text-primary font-bold rounded-2xl hover:bg-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
