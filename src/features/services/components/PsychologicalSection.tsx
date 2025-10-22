'use client';

import { motion } from 'framer-motion';

export function PsychologicalSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">🧠 الاستشارات النفسية الرياضية</h2>
      <p className="text-lg text-gray-700 mb-4">طور قوتك الذهنية مثل قوتك البدنية</p>
      <p className="text-base text-gray-600 mb-8">
        النجاح الرياضي يبدأ من العقل. نقدم جلسات دعم نفسي ورياضي لمساعدتك على التعامل مع الضغط، القلق، وتحديات المنافسة.
      </p>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">تشمل الخدمة:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>جلسات فردية أونلاين مع مختصين</li>
        </ul>
      </div>
      <p className="text-lg font-bold">الأسعار: ابتداءً من 500 جنيه للجلسة</p>
    </motion.section>
  );
}