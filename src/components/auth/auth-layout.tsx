"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BookOpen, Users, Award } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  imagePosition?: "left" | "right";
  features?: string[];
}

export function AuthLayout({
  children,
  imageSrc = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/8e9b55875528c3338eef2de87c4a112f-2.png?",
  imageAlt = "Students learning together",
  title,
  subtitle,
  imagePosition = "left",
  features = ["Free Learning", "Expert Instructors", "Certified Courses"],
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-secondary via-background to-secondary/50">
      {/* Left Panel - Image & Features */}
      <div className={cn(
        "hidden lg:flex lg:w-1/2 relative overflow-hidden",
        imagePosition === "right" ? "lg:order-last" : ""
      )}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="50vw"
        />

        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-center items-center text-center px-12 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome to Edraak</h2>
            <p className="text-white/90 text-lg max-w-md">
              Join thousands of learners advancing their careers with our comprehensive courses
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4 w-full max-w-sm">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  {index === 0 && <BookOpen className="w-4 h-4 text-primary" />}
                  {index === 1 && <Users className="w-4 h-4 text-primary" />}
                  {index === 2 && <Award className="w-4 h-4 text-primary" />}
                </div>
                <span className="text-white/90 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">300+</div>
              <div className="text-white/70 text-sm">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-white/70 text-sm">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-white/70 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={cn(
        "flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-12 xl:px-16",
        imagePosition === "right" ? "lg:order-first" : ""
      )}>
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo/Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Edraak</h2>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-muted-foreground font-body">
                  {subtitle}
                </p>
              )}
            </div>

            <div>
              {children}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}