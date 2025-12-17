'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, ReactNode } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon?: ReactNode;
  color?: string;
}

interface UnifiedFAQProps {
  items: FAQItem[];
  categories?: FAQCategory[];
  showSearch?: boolean;
  showCategories?: boolean;
  layout?: 'simple' | 'advanced';
  title?: string;
  description?: string;
  className?: string;
}

export default function UnifiedFAQ({
  items,
  categories = [],
  showSearch = false,
  showCategories = false,
  layout = 'simple',
  title = "Frequently Asked Questions",
  description = "Find answers to common questions",
  className = ""
}: UnifiedFAQProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = !searchTerm ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'all' ||
      categories.find(cat => cat.id === activeCategory);

    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Hero Section */}
      {layout === 'advanced' && (
        <section className="bg-white py-20">
          <div className="container max-w-4xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-heading mb-6"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              {description}
            </motion.p>

            {/* Search Bar */}
            {showSearch && (
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
            )}
          </div>
        </section>
      )}

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          {/* Simple layout header */}
          {layout === 'simple' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-gray-900">
                {title.split(' ').slice(0, -1).join(' ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                  {' ' + title.split(' ').slice(-1)[0]}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            </motion.div>
          )}

          {/* Category Tabs (Advanced layout) */}
          {showCategories && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
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
          )}

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                        openItems.has(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openItems.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
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