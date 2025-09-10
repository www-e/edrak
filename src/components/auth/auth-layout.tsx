"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  imagePosition?: "left" | "right";
}

export function AuthLayout({
  children,
  imageSrc = "/images/auth-placeholder.jpg",
  imageAlt = "Authentication",
  title,
  subtitle,
  imagePosition = "left",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className={cn(
        "flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24",
        imagePosition === "right" ? "lg:order-last" : ""
      )}>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-heading">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground font-body">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block relative w-1/2">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
        />
      </div>
    </div>
  );
}