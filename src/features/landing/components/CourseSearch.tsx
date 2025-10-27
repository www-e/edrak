"use client";

import { Search } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

export const CourseSearch = () => {
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query');
    if (query) {
      router.prefetch('/courses');
      router.push(`/courses?query=${encodeURIComponent(query as string)}`);
    }
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Discover over 300 free training courses on the SportSchool platform
          </h2>
          <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            <div className="relative">
              <input
                type="text"
                name="query"
                placeholder="What would you like to learn today?"
                className="w-full h-20 rounded-xl border-0 bg-input pl-6 pr-20 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute inset-y-0 right-0 flex w-20 items-center justify-center"
              >
                <Search className="h-7 w-7 text-muted-foreground" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};