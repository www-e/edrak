'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Home, GraduationCap, Dumbbell, Apple, Brain, Briefcase, CreditCard, Shield, Smartphone } from 'lucide-react';

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqCategories: FAQCategory[] = [
  { id: 'general', title: 'General Questions', icon: <Home className="w-5 h-5" />, color: 'blue' },
  { id: 'courses', title: 'Educational Courses', icon: <GraduationCap className="w-5 h-5" />, color: 'green' },
  { id: 'training', title: 'Training Programs', icon: <Dumbbell className="w-5 h-5" />, color: 'purple' },
  { id: 'nutrition', title: 'Nutrition Programs', icon: <Apple className="w-5 h-5" />, color: 'orange' },
  { id: 'psychology', title: 'Psychology Consultations', icon: <Brain className="w-5 h-5" />, color: 'pink' },
  { id: 'employment', title: 'Employment', icon: <Briefcase className="w-5 h-5" />, color: 'indigo' },
  { id: 'payment', title: 'Payment & Subscriptions', icon: <CreditCard className="w-5 h-5" />, color: 'teal' },
  { id: 'security', title: 'Account & Security', icon: <Shield className="w-5 h-5" />, color: 'red' },
  { id: 'technical', title: 'Technical Support', icon: <Smartphone className="w-5 h-5" />, color: 'gray' },
];

const faqData: Record<string, FAQItem[]> = {
  general: [
    {
      id: 'what-is-sportology',
      question: 'What is SportologyPlus.com?',
      answer: 'SportologyPlus.com is a comprehensive online platform specialized in sports sciences, offering a range of services including professional educational courses, customized training and nutrition programs, sports psychology consultations, exclusive scientific content, and an employment portal for sports professionals. Everything you need for your professional and scientific development in one place.'
    },
    {
      id: 'who-is-it-for',
      question: 'Who is the platform suitable for?',
      answer: 'Our platform is designed to suit everyone, including professional and amateur athletes, trainers and fitness specialists, nutritionists and health science professionals, students in sports science colleges, and anyone seeking to improve their health or develop their athletic level.'
    },
    {
      id: 'available-countries',
      question: 'Is the platform available in my country?',
      answer: 'Yes, the platform is available to all users in the Arab world and internationally. All you need is a device connected to the internet, and you can start immediately from anywhere.'
    },
    {
      id: 'free-trial',
      question: 'Does the platform offer a free version or trial period?',
      answer: 'Yes, SportologyPlus provides free and trial options, including free content through the media library and the ability to browse courses and programs before subscribing.'
    },
    {
      id: 'getting-started',
      question: 'How do I start using the platform?',
      answer: '1. Create a free account on SportologyPlus.com\n2. Browse the courses or programs that suit you\n3. Subscribe to the service that matches your goals\n4. Start your journey in sports and scientific development with us'
    },
    {
      id: 'platform-languages',
      question: 'What languages does the platform support?',
      answer: 'Currently, our platform primarily supports Arabic and English. You can switch between languages in your account settings. We are working on adding more languages to serve our international users better.'
    },
    {
      id: 'mobile-app',
      question: 'Do you have a mobile application?',
      answer: 'Yes, we have mobile applications available for both iOS and Android devices. You can download them from the App Store and Google Play Store. The mobile apps provide the same features as the web platform with optimized mobile experience.'
    },
    {
      id: 'offline-access',
      question: 'Can I access content offline?',
      answer: 'Yes, our mobile applications allow you to download courses and content for offline viewing. This feature is available for premium subscribers and ensures you can continue learning even without an internet connection.'
    },
    {
      id: 'customer-support',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team through multiple channels: email support@sportologyplus.com, live chat on our website, phone support during business hours, or through our help center which contains detailed guides and tutorials.'
    }
  ],
  courses: [
    {
      id: 'course-types',
      question: 'What types of courses do you offer?',
      answer: 'We offer a diverse range of courses in areas including sports training sciences, sports nutrition, sports psychology, injuries and rehabilitation, sports management, and specialized courses in specific sports.'
    },
    {
      id: 'certificates',
      question: 'Are the certificates accredited?',
      answer: 'Yes, trainees receive a certified digital certificate from SportologyPlus that can be added to employment files and professional platforms like LinkedIn.'
    },
    {
      id: 'course-format',
      question: 'Are the courses recorded or live?',
      answer: 'We offer three types of courses: recorded courses that you can watch anytime, live workshops (Live Webinars) for interaction with experts, and practical workshops in specific locations and specific courses.'
    },
    {
      id: 'enrollment',
      question: 'How can I enroll in a course?',
      answer: '• Visit the courses page\n• Choose the appropriate course\n• Click on "Subscribe Now"\n• Complete the payment process and start immediately'
    },
    {
      id: 'course-duration',
      question: 'How long do courses typically last?',
      answer: 'Course duration varies depending on the type and level. Short courses may last 2-4 weeks, while comprehensive programs can extend to 3-6 months. Each course description includes detailed information about its duration.'
    },
    {
      id: 'course-prerequisites',
      question: 'Are there prerequisites for enrolling in courses?',
      answer: 'Prerequisites vary by course. Basic courses usually have no prerequisites, while advanced courses may require prior knowledge or experience in the field. All requirements are clearly stated in the course description.'
    },
    {
      id: 'course-access',
      question: 'How long do I have access to course materials?',
      answer: 'Once enrolled, you have lifetime access to course materials. You can revisit lessons, download resources, and access updates whenever you need them.'
    },
    {
      id: 'course-structure',
      question: 'How are courses structured?',
      answer: 'Our courses are structured with video lectures, interactive quizzes, downloadable resources, practical assignments, and discussion forums. Each module builds upon the previous one to ensure comprehensive understanding.'
    },
    {
      id: 'course-instructors',
      question: 'Who are the course instructors?',
      answer: 'Our courses are taught by certified professionals, university professors, and industry experts with extensive experience in their respective fields. All instructors hold relevant qualifications and certifications.'
    },
    {
      id: 'course-assessment',
      question: 'How are students assessed in courses?',
      answer: 'Assessment methods include quizzes, assignments, practical projects, and final examinations. Each course has clear grading criteria and provides detailed feedback on your performance.'
    },
    {
      id: 'course-progress',
      question: 'Can I track my progress in courses?',
      answer: 'Yes, our platform provides detailed progress tracking. You can see completed lessons, quiz scores, assignment status, and overall course completion percentage in your personalized dashboard.'
    },
    {
      id: 'course-difficulty',
      question: 'What are the difficulty levels of courses?',
      answer: 'Courses are categorized into three levels: Beginner (no prior knowledge required), Intermediate (basic understanding needed), and Advanced (professional experience recommended). Choose the level that matches your current knowledge.'
    }
  ],
  training: [
    {
      id: 'training-types',
      question: 'What types of training programs do you offer?',
      answer: 'We offer customized training programs designed for different fitness levels and goals, including strength training, endurance programs, sports-specific training, and rehabilitation programs.'
    },
    {
      id: 'training-customization',
      question: 'How are training programs customized?',
      answer: 'Our training programs are personalized based on your fitness level, goals, available equipment, time commitment, and any specific requirements or limitations you may have. Each program is tailored to your individual needs.'
    },
    {
      id: 'training-duration',
      question: 'How long are training programs?',
      answer: 'Training program duration varies based on your goals. Short-term programs can be 4-8 weeks, while comprehensive transformation programs may last 3-6 months. We also offer ongoing maintenance programs.'
    },
    {
      id: 'training-follow-up',
      question: 'Do you provide follow-up and adjustments?',
      answer: 'Yes, our trainers provide regular follow-up sessions to monitor your progress, make necessary adjustments to your program, and ensure you are achieving your goals safely and effectively.'
    },
    {
      id: 'training-equipment',
      question: 'What equipment do I need for training programs?',
      answer: 'Many of our programs can be done with minimal or no equipment (bodyweight exercises). For equipment-based programs, we specify what is needed and offer modifications for different equipment availability.'
    },
    {
      id: 'training-frequency',
      question: 'How many days per week should I train?',
      answer: 'Training frequency depends on your program and fitness level. Most programs range from 3-6 days per week, with rest days built in for recovery. We design programs that fit your schedule and recovery needs.'
    }
  ],
  nutrition: [
    {
      id: 'nutrition-programs',
      question: 'What nutrition programs are available?',
      answer: 'We provide scientifically-designed nutrition plans tailored to athletic goals, including weight management, performance optimization, and specialized dietary requirements for different sports.'
    },
    {
      id: 'nutrition-personalization',
      question: 'How are nutrition plans personalized?',
      answer: 'Nutrition plans are customized based on your age, gender, weight, height, activity level, dietary preferences, allergies, and specific athletic goals. We also consider any medical conditions or restrictions.'
    },
    {
      id: 'nutrition-goals',
      question: 'What nutrition goals can you help with?',
      answer: 'We help with various goals including weight loss, muscle gain, performance enhancement, recovery optimization, sports-specific nutrition, and overall health improvement through balanced nutrition.'
    },
    {
      id: 'nutrition-monitoring',
      question: 'How do you monitor nutrition progress?',
      answer: 'We track your progress through regular check-ins, food diary reviews, body measurements, performance metrics, and adjustments to your plan based on your results and feedback.'
    },
    {
      id: 'nutrition-supplements',
      question: 'Do you recommend supplements?',
      answer: 'We focus primarily on whole food nutrition but may recommend supplements when necessary to address specific deficiencies or enhance performance. All recommendations are evidence-based and safe.'
    },
    {
      id: 'nutrition-education',
      question: 'Do you provide nutrition education?',
      answer: 'Yes, our programs include comprehensive nutrition education covering macronutrients, micronutrients, meal timing, hydration, and how different foods affect athletic performance and recovery.'
    }
  ],
  psychology: [
    {
      id: 'psychology-services',
      question: 'What psychology consultation services do you offer?',
      answer: 'Our sports psychology consultations help athletes overcome mental challenges, achieve psychological balance, and enhance athletic performance and motivation for success.'
    },
    {
      id: 'psychology-topics',
      question: 'What topics do psychology consultations cover?',
      answer: 'Our consultations cover performance anxiety, motivation, goal setting, concentration, mental toughness, stress management, confidence building, and recovery from setbacks or injuries.'
    },
    {
      id: 'psychology-formats',
      question: 'What formats are available for psychology consultations?',
      answer: 'We offer individual sessions, group workshops, online consultations, and intensive programs. Sessions can be conducted in person, via video call, or through our secure platform.'
    },
    {
      id: 'psychology-duration',
      question: 'How long are psychology consultation sessions?',
      answer: 'Individual sessions typically last 45-60 minutes. We also offer intensive programs that may include multiple sessions over several weeks, depending on your needs and goals.'
    },
    {
      id: 'psychology-approach',
      question: 'What psychological approaches do you use?',
      answer: 'Our psychologists use evidence-based approaches including cognitive-behavioral therapy (CBT), mindfulness techniques, positive psychology, and sports-specific mental training strategies tailored to athletic performance.'
    },
    {
      id: 'psychology-benefits',
      question: 'What are the benefits of sports psychology consultations?',
      answer: 'Benefits include improved focus and concentration, better stress management, enhanced motivation and confidence, faster recovery from setbacks, and overall improved athletic performance and enjoyment.'
    }
  ],
  employment: [
    {
      id: 'employment-services',
      question: 'What employment services do you provide?',
      answer: 'We help sports professionals access suitable job opportunities in training, nutrition, or sports management, connecting talents with opportunities to build careers with confidence and professionalism.'
    },
    {
      id: 'employment-types',
      question: 'What types of job opportunities are available?',
      answer: 'We connect professionals with opportunities including personal trainer positions, sports nutritionist roles, sports psychology consultants, sports facility management, coaching positions, and sports education roles.'
    },
    {
      id: 'employment-requirements',
      question: 'What qualifications do I need for employment services?',
      answer: 'Requirements vary by position but generally include relevant certifications, experience in the field, and completion of our professional development courses. We help you identify and obtain necessary qualifications.'
    },
    {
      id: 'employment-process',
      question: 'How does the employment process work?',
      answer: '1. Create a professional profile highlighting your skills and experience\n2. Complete relevant certifications through our platform\n3. Browse available opportunities\n4. Apply for positions that match your expertise\n5. Participate in interviews and placement process'
    },
    {
      id: 'employment-locations',
      question: 'Are job opportunities available internationally?',
      answer: 'Yes, we have partnerships with sports facilities, gyms, and organizations worldwide. Opportunities are available in the Middle East, Europe, North America, and other regions depending on current demand.'
    },
    {
      id: 'employment-support',
      question: 'Do you provide career support and guidance?',
      answer: 'Yes, we offer resume building, interview preparation, career counseling, and ongoing professional development support to help you advance in your sports career.'
    }
  ],
  payment: [
    {
      id: 'payment-methods',
      question: 'What payment methods are accepted?',
      answer: 'We accept various secure payment methods including credit cards, debit cards, and digital wallets to ensure convenient transactions for all users.'
    },
    {
      id: 'payment-security',
      question: 'How secure are payment transactions?',
      answer: 'All payment transactions are processed through encrypted, PCI-compliant payment gateways. We never store your payment information on our servers, ensuring maximum security for your financial data.'
    },
    {
      id: 'payment-currency',
      question: 'What currencies are supported?',
      answer: 'We support multiple currencies including USD, EUR, GBP, and regional currencies like SAR, AED, EGP depending on your location. The platform automatically detects and displays prices in your local currency when possible.'
    },
    {
      id: 'payment-installments',
      question: 'Can I pay in installments?',
      answer: 'Yes, we offer installment payment options for many of our courses and programs. The number of installments and terms vary depending on the total cost and duration of the service.'
    },
    {
      id: 'payment-receipts',
      question: 'How do I get payment receipts?',
      answer: 'Payment receipts are automatically sent to your email address after successful transactions. You can also access all your receipts and invoices in your account dashboard under the billing section.'
    }
  ],
  security: [
    {
      id: 'account-security',
      question: 'How secure is my account information?',
      answer: 'We implement industry-standard security measures including encryption, secure authentication, and regular security audits to protect your personal and payment information.'
    }
  ],
  technical: [
    {
      id: 'technical-support',
      question: 'How can I get technical support?',
      answer: 'Our technical support team is available through multiple channels including email, live chat, and our help center to assist you with any technical issues or questions.'
    }
  ]
};

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Find answers to common questions about SportologyPlus
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-12"
          >
            Choose the category that interests you
          </motion.h2>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.icon}
                {category.title}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            <AnimatePresence mode="wait">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openItems.has(faq.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No questions found matching your search.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}