'use client';

import { motion } from 'framer-motion';

export function EmploymentSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">💼 خدمات التوظيف الرياضي</h2>
      <p className="text-lg text-gray-700 mb-4">نوصلك بفرصك القادمة في عالم الرياضة</p>
      <p className="text-base text-gray-600 mb-8">
        سواء كنت مدربًا، أخصائي تغذية، أو خبير أداء بدني – نساعدك في إيجاد فرص عمل تناسب مهاراتك في المؤسسات والنوادي الرياضية.
      </p>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">تشمل الخدمة:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>إنشاء ملف مهني احترافي</li>
          <li>ربط مباشر مع الجهات الرياضية</li>
          <li>ورش تطوير المهارات المهنية</li>
        </ul>
      </div>
      <p className="text-base text-gray-600 mb-2">الأسعار: مجانًا لفترة محدودة</p>
      <p className="text-lg font-bold">خطة احترافية سنوية: 200 جنيه</p>
    </motion.section>
  );
}