'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function ServicesClosing() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-6">✨ ابدأ رحلتك الرياضية اليوم مع SportologyPlus</h2>
      <p className="text-lg text-gray-700 mb-8">
        سواء كنت في بداية طريقك أو في قمة احترافك، نحن هنا لنكون شريكك في كل خطوة.<br />
        انضم إلينا وابدأ مرحلة جديدة من التقدم الرياضي والعلمي.
      </p>
      <Button size="lg" className="text-lg px-8 py-4">ابدأ الآن</Button>
    </motion.section>
  );
}