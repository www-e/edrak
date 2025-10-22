'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Dumbbell, Apple, Brain, Mic, Briefcase } from 'lucide-react';

export function ServicesOverview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">⚙️ منصة شاملة لكل جوانب حياتك الرياضية</h2>
      <p className="text-lg text-gray-700 mb-8">
        في SportologyPlus، لا نقدم خدمة واحدة… بل منظومة متكاملة تدعمك في كل مراحل رحلتك الرياضية:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <CardContent className="flex items-center space-x-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-bold">🎓 التعلم</h3>
              <p className="text-sm text-gray-600">كورسات احترافية لبناء معرفتك وصقل مهاراتك المهنية.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex items-center space-x-4">
            <Dumbbell className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-bold">💪 التدريب</h3>
              <p className="text-sm text-gray-600">برامج مخصصة لتحقيق أهدافك البدنية.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex items-center space-x-4">
            <Apple className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-bold">🥗 التغذية</h3>
              <p className="text-sm text-gray-600">خطط غذائية ذكية تدعم أداءك وتناسب نمط حياتك.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex items-center space-x-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-bold">🧠 الدعم النفسي</h3>
              <p className="text-sm text-gray-600">استشارات متخصصة لتعزيز القوة الذهنية.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex items-center space-x-4">
            <Mic className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-bold">🎙️ المحتوى</h3>
              <p className="text-sm text-gray-600">برامج وبودكاست ومقالات من نخبة الخبراء.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardContent className="flex items-center space-x-4">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="font-bold">💼 التوظيف</h3>
              <p className="text-sm text-gray-600">مساعدة في الحصول على فرص عمل حقيقية.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}