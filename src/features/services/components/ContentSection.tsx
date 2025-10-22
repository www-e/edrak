'use client';

import { motion } from 'framer-motion';

export function ContentSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">🎙️ المحتوى الرياضي (البودكاست والبرامج المرئية والمقالات)</h2>
      <p className="text-lg text-gray-700 mb-4">تعلم واستلهم من قصص الرياضيين والخبراء</p>
      <p className="text-base text-gray-600 mb-8">
        تابع برنامج Sportology Plus Weekly والبودكاست الخاص بنا لتتعرف على آخر الاتجاهات، قصص النجاح، ونصائح الخبراء في مجالات التغذية والتدريب والذهن الرياضي.
      </p>
      <p className="text-base text-gray-600">الوصول: مجانًا عبر YouTube وSpotify</p>
    </motion.section>
  );
}