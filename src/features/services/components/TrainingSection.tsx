'use client';

import { motion } from 'framer-motion';

export function TrainingSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">💪 التدريب الشخصي والبرامج الرياضية</h2>
      <p className="text-lg text-gray-700 mb-4">خطط تدريبية مخصصة لمستواك وأهدافك</p>
      <p className="text-base text-gray-600 mb-8">
        احصل على برنامج تدريبي مصمم خصيصًا لك، بإشراف مدرب شخصي يتابعك خطوة بخطوة لتحقيق أفضل نتائج ممكنة.
      </p>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">تشمل الخدمة:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>تقييم بدني شامل</li>
          <li>برنامج تدريبي أسبوعي مخصص</li>
          <li>متابعة</li>
          <li>تقارير تقدم شهرية</li>
        </ul>
      </div>
      <p className="text-base text-gray-600 mb-4">الفئات المستفيدة: الرياضيون الهواة والمحترفون في أي رياضة، والراغبون في تحسين اللياقة أو خسارة الوزن.</p>
      <p className="text-lg font-bold">الأسعار: ابتداءً من 500 جنيه شهريًا</p>
    </motion.section>
  );
}