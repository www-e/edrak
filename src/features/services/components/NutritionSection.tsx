'use client';

import { motion } from 'framer-motion';

export function NutritionSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">🥗 البرامج الغذائية المخصصة</h2>
      <p className="text-lg text-gray-700 mb-4">نظام غذائي علمي يناسب هدفك الرياضي</p>
      <p className="text-base text-gray-600 mb-8">
        خطط تغذية متوازنة مصممة من قبل أخصائيي تغذية رياضية، تعتمد على أحدث الدراسات لتضمن الأداء والطاقة المثالية.
      </p>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">تشمل الخدمة:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>خطة غذائية شهرية متغيرة كل أسبوع</li>
          <li>متابعة مستمرة وتعديل حسب النتائج</li>
          <li>إرشادات مكملات غذائية آمنة</li>
        </ul>
      </div>
      <p className="text-lg font-bold">الأسعار: ابتداءً من 500 جنيه شهريًا</p>
    </motion.section>
  );
}