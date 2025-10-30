"use client";

import Link from "next/link";
import {
  GraduationCap,
  Brain,
  Utensils,
  Dumbbell,
  Headphones,
  Briefcase,
  MoveRight,
  MoveLeft,
} from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Educational Courses",
    subtitle: "(Free - Paid)",
    description: "Learn from elite experts in sports training, nutrition, and mental health through simplified, practical, and applied scientific content suitable for all levels.",
    link: "/courses",
    linkText: "Discover courses →",
  },
  {
    icon: Brain,
    title: "Sports Psychology Consultations",
    subtitle: "",
    description: "We support you to overcome mental challenges and achieve psychological balance that enhances your athletic performance and strengthens your motivation towards success.",
    link: "/services/consultations",
    linkText: "Buy consultation →",
  },
  {
    icon: Utensils,
    title: "Customized Nutrition Programs",
    subtitle: "",
    description: "Enjoy nutrition plans designed specifically for your goals, whether you are a professional athlete or seeking a healthy and balanced lifestyle.",
    link: "/nutrition",
    linkText: "Start your program →",
  },
  {
    icon: Dumbbell,
    title: "Training Programs and Personal Trainer",
    subtitle: "",
    description: "Get a personal training program with direct supervision from a specialized coach who monitors your progress step by step to achieve the best results in your sport.",
    link: "/services/training",
    linkText: "Start your program →",
  },
  {
    icon: Headphones,
    title: "Free Visual and Audio Content",
    subtitle: "",
    description: "Podcast and sports program that provides the latest information and tips from field experts.",
    link: "/content",
    linkText: "Watch now →",
  },
  {
    icon: Briefcase,
    title: "Sports Employment Services",
    subtitle: "(Free for a limited time)",
    description: "We help you access suitable professional opportunities in training, nutrition, or sports management, to build your career with confidence and professionalism. We connect talents with opportunities.",
    link: "/services/employment",
    linkText: "Browse opportunities →",
  },
];

export const ActivitiesSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-dark-navy relative inline-block pb-4">
            Our Services
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-primary rounded-full"></span>
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground font-body">
            Comprehensive sports science solutions tailored to your needs, from education to professional development.
          </p>
        </div>

        <div className="relative">
          <button className="absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-300 z-10">
            <MoveRight className="w-6 h-6"/>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-card rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-6 flex flex-col transition-shadow duration-300 hover:shadow-2xl">
                <div className="flex items-center mb-4">
                  <service.icon className="w-10 h-10 text-primary mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                    {service.subtitle && <p className="text-sm text-muted-foreground">{service.subtitle}</p>}
                  </div>
                </div>
                <p className="text-base text-muted-foreground mb-6 flex-grow">
                  {service.description}
                </p>
                <Link href={service.link} className="text-primary font-semibold flex items-center self-start hover:underline gap-2 transition-colors">
                  <span>{service.linkText}</span>
                </Link>
              </div>
            ))}
          </div>
          <button className="absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-300 z-10">
            <MoveLeft className="w-6 h-6"/>
          </button>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-md"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    </section>
  );
};