'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureItem {
  icon?: ReactNode;
  title: string;
  description: string;
  color?: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

interface FeatureGridProps {
  title: string;
  description?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
  showIcon?: boolean;
  centerContent?: boolean;
  cardStyle?: 'default' | 'minimal' | 'hover-effect';
  background?: string;
}

export default function FeatureGrid({
  title,
  description,
  items,
  columns = 3,
  className = '',
  showIcon = true,
  centerContent = false,
  cardStyle = 'default',
  background = ''
}: FeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const cardClasses = {
    default: 'bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group',
    minimal: 'bg-white/60 backdrop-blur-sm border-2 border-gray-200/60 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30',
    'hover-effect': 'bg-white/40 backdrop-blur-sm border-2 border-gray-200/60 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 group relative'
  };

  const contentAlignment = centerContent ? 'text-center' : '';

  return (
    <section className={`py-24 ${background} ${className}`}>
      <div className="container max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-16 ${contentAlignment}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* Feature Grid */}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`
                ${cardClasses[cardStyle]}
                ${centerContent ? '' : 'flex items-start gap-6'}
                ${item.href ? 'cursor-pointer' : ''}
                ${item.onClick ? 'cursor-pointer' : ''}
              `}
              onClick={item.onClick}
            >
              {/* Card Content */}
              {cardStyle === 'hover-effect' && (
                <>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color || 'from-primary/5 to-secondary/5'} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full" />
                </>
              )}

              {showIcon && item.icon && (
                <div className={`
                  ${cardStyle === 'minimal' ? 'relative' : ''}
                  ${centerContent ? 'mx-auto mb-6' : 'flex-shrink-0'}
                `}>
                  <div className={`
                    inline-flex p-4 rounded-2xl text-white shadow-lg mb-6
                    ${item.color ? `bg-gradient-to-r ${item.color}` : 'bg-gradient-to-r from-primary to-primary/80'}
                    ${cardStyle === 'default' ? 'group-hover:scale-110 transition-transform duration-300' : ''}
                  `}>
                    {item.icon}
                  </div>
                </div>
              )}

              <div className="flex-1">
                {item.badge && (
                  <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4">
                    {item.badge}
                  </div>
                )}
                
                <h3 className={`
                  text-xl font-bold font-heading mb-3 
                  ${cardStyle === 'default' ? 'text-gray-900 group-hover:text-primary transition-colors' : 'text-gray-900 group-hover:text-primary transition-colors relative z-10'}
                  ${centerContent ? 'text-center' : ''}
                `}>
                  {item.title}
                </h3>
                
                <p className={`
                  text-muted-foreground leading-relaxed
                  ${centerContent ? 'text-center' : ''}
                  ${cardStyle === 'default' ? '' : 'relative z-10'}
                `}>
                  {item.description}
                </p>
              </div>

              {/* Bottom accent line for hover-effect style */}
              {cardStyle === 'hover-effect' && item.color && (
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}