'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Fade, Slide } from 'react-awesome-reveal';

const features = [
  {
    text: 'Educational Courses',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/1df27a1f65d7a11c430110d8c0b19059-3.svg?',
  },
  {
    text: 'Expert Consultations',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/24a5b0927f8bfdee096f8788396076ef-4.svg?',
  },
  {
    text: 'Personalized Programs',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/1b5b8c5bbcaaa4382cf7d3656fd0d067-5.svg?',
  },
];

export const HeroSection = () => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative pt-16 pb-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Text content */}
          <div className="z-10">
            <Fade direction="up" cascade damping={0.1} triggerOnce>
              <h1 className="text-5xl font-bold font-display text-foreground leading-tight">
                Sportology Plus – Ambition, Science, Progress
              </h1>
              
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
                In Sportology Plus, we believe that ambition is the beginning, science is the path, and progress is the result. We are here to guide you in your sports journey towards the best.
              </p>
              
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Your integrated platform for sports sciences - from educational courses to specialized programs, and professional consultations.
              </p>
            </Fade>

            <Slide direction="up" delay={300} triggerOnce>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/services"
                  prefetch={false}
                  className="inline-block py-4 px-8 bg-primary text-primary-foreground font-semibold text-base rounded-lg shadow-md hover:bg-primary/90 transition-colors text-center"
                >
                  Browse Services
                </Link>
                <Link
                  href="/courses"
                  prefetch={true}
                  className="inline-block py-4 px-8 border-2 border-primary text-primary font-semibold text-base rounded-lg shadow-md hover:bg-primary hover:text-primary-foreground transition-colors text-center"
                >
                  Subscribe to Course
                </Link>
              </div>
            </Slide>

            <Fade delay={500} triggerOnce>
              <div className="mt-16 flex">
                <div className="flex flex-col sm:flex-row gap-y-6 gap-x-8">
                  {features.map((feature, index) => (
                    <Fade key={index} delay={600 + index * 100} triggerOnce>
                      <div className="flex items-center gap-x-3">
                        <Image 
                          src={feature.icon} 
                          alt="" 
                          width={44} 
                          height={44} 
                          className="flex-shrink-0" 
                        />
                        <h6 className="text-[15px] font-semibold text-foreground max-w-[140px] leading-snug">
                          {feature.text}
                        </h6>
                      </div>
                    </Fade>
                  ))}
                </div>
              </div>
            </Fade>
          </div>
          
          {/* Right side - Images */}
          <Fade direction="right" delay={400} triggerOnce>
            <div className="relative h-[450px] lg:h-[550px] order-first lg:order-last">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/52c174da636f73477b63e89dc2f23932-6.svg?"
                alt="Decorative background shape"
                fill
                style={{ objectFit: 'contain' }}
                className="absolute -top-4 -left-16"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/8e9b55875528c3338eef2de87c4a112f-2.png?"
                alt="Two students, a woman and a man, smiling"
                fill
                style={{ objectFit: 'contain' }}
                className="relative z-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={true}
              />
            </div>
          </Fade>

        </div>
      </div>
    </section>
  );
};
