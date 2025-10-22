'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users } from 'lucide-react';

export function CoursesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">🎓 الكورسات التعليمية الأونلاين</h2>
      <p className="text-lg text-gray-700 mb-8">
        تعلم من الخبراء... في أي وقت ومن أي مكان<br />
        استكشف مكتبتنا الغنية بالكورسات الرقمية المتخصصة في مختلف فروع علوم الرياضة.
      </p>
      <p className="text-base text-gray-600 mb-8">الكورسات متاحة أونلاين 24/7 مع محتوى حديث وشهادات معتمدة.</p>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">ماذا ستحصل عليه؟</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>محاضرات فيديو عالية الجودة (HD) – شرح تطبيقي مبسط وواضح</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>مواد تعليمية قابلة للتحميل – ملفات PDF، عروض تقديمية، ومراجع علمية</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>أنشطة تفاعلية واختبارات تقييم لتعزيز الفهم والتطبيق</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>شهادات رقمية معتمدة عند اجتياز الكورس بنجاح</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>تحديثات مستمرة وفق أحدث الأبحاث والدراسات</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">التخصصات المتاحة:</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">🏋️ علوم التدريب الرياضي</Badge>
          <Badge variant="outline">🥗 التغذية الرياضية</Badge>
          <Badge variant="outline">🧠 علم النفس الرياضي</Badge>
          <Badge variant="outline">🏃 الاستشفاء والتأهيل البدني</Badge>
          <Badge variant="outline">📊 الإدارة الرياضية</Badge>
          <Badge variant="outline">👶 التدريب للفئات الخاصة</Badge>
          <Badge variant="outline">⚽ كورسات متخصصة لكل رياضة</Badge>
          <Badge variant="outline">وأكثر</Badge>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">لمن هذه الخدمة؟</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span>👨‍🏫 المدربون الرياضيون</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span>🏃 الرياضيون المحترفون والهواة</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span>🥗 أخصائي التغذية</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span>🎓 طلاب كليات علوم الرياضة</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span>💼 كل من يسعى للتطور في مجاله الرياضي</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span>لمن يريد حياة صحية أفضل</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">الأسعار:</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="p-4">
            <CardContent>
              <p className="text-lg font-bold">💰 الكورس الفردي: يبدأ من 1500 جنيه</p>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <p className="text-lg font-bold">🎁 باقة 3 كورسات: خصم 20%</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 flex gap-4">
          <Button size="lg">اختر الآن كورساتك وابدأ</Button>
          <Button variant="outline" size="lg">تصفح الكورسات الآن</Button>
          <Button variant="outline" size="lg">اشترك الآن</Button>
        </div>
      </div>
    </motion.section>
  );
}