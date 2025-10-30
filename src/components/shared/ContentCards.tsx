'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContentCard {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  color?: string;
  background?: string;
  borderColor?: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

interface ContentCardsProps {
  cards: ContentCard[];
  columns?: 2 | 3;
  className?: string;
  background?: string;
  spacing?: 'normal' | 'large';
  showIcons?: boolean;
  hoverEffect?: boolean;
}

export default function ContentCards({
  cards,
  columns = 2,
  className = '',
  background = '',
  spacing = 'normal',
  showIcons = true,
  hoverEffect = true
}: ContentCardsProps) {
  const gridCols = {
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  const cardSpacing = {
    normal: 'p-6',
    large: 'p-8'
  };

  const backgroundClasses = {
    default: 'bg-white/60 border border-border',
    glass: 'bg-white/40 backdrop-blur-sm border-2 border-gray-200/60',
    solid: 'bg-white border border-gray-200',
    gradient: 'bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20'
  };

  const cardBackground = backgroundClasses[background as keyof typeof backgroundClasses] || backgroundClasses.default;

  return (
    <section className={`py-16 ${className}`}>
      <div className="container max-w-[1400px] mx-auto px-6">
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              whileHover={hoverEffect ? { transition: { duration: 0.3 } } : {}}
              className={`
                relative rounded-3xl overflow-hidden cursor-pointer
                ${cardBackground}
                ${cardSpacing[spacing]}
                ${hoverEffect ? 'hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500' : 'shadow-lg'}
                group
              `}
              onClick={card.onClick}
            >
              {/* Gradient overlay for hover effect */}
              {card.color && hoverEffect && (
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              )}

              {/* Decorative elements */}
              {hoverEffect && (
                <>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full" />
                </>
              )}

              {/* Card Header */}
              <div className="flex items-start gap-4 mb-6 relative z-10">
                {card.icon && showIcons && (
                  <div className={`
                    flex-shrink-0 p-3 rounded-xl text-white shadow-lg
                    ${card.color ? `bg-gradient-to-br ${card.color}` : 'bg-gradient-to-br from-primary to-primary/80'}
                  `}>
                    {card.icon}
                  </div>
                )}

                <div className="flex-1">
                  {card.badge && (
                    <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-3">
                      {card.badge}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold font-heading group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                {card.content}
              </div>

              {/* Bottom accent line for hover effect */}
              {card.color && hoverEffect && (
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}