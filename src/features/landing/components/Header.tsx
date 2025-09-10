"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

// This is the updated, functional theme toggle button
const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This prevents a hydration mismatch error by ensuring the component only renders on the client
  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === 'dark';

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(isDark ? 'light' : 'dark')} 
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};


export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left side: Logo */}
        <div className="flex items-center">
          <a href="#" className="text-3xl font-black text-primary tracking-tight font-heading">
            Edrak
          </a>
        </div>

        {/* Middle: Navigation Links & Search */}
        <div className="flex flex-1 items-center justify-center gap-x-8">
          <nav className="hidden lg:flex items-center gap-x-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground flex items-center gap-1 font-heading font-semibold">
              Learning Areas <ChevronDown className="h-4 w-4" />
            </a>
          </nav>
          
          <div className="relative hidden sm:block w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search" 
              className="w-full rounded-full bg-muted pl-9 pr-4 py-2 text-sm font-body"
            />
          </div>
        </div>

        {/* Right side: User Actions */}
        <div className="flex items-center gap-x-4">
          <nav className="hidden lg:flex items-center gap-x-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground font-heading font-semibold">Specializations</a>
            <a href="#" className="transition-colors hover:text-foreground font-heading font-semibold">Tools</a>
            <a href="#" className="transition-colors hover:text-foreground font-heading font-semibold">Partners</a>
          </nav>

          <div className="hidden md:flex items-center gap-x-2 text-sm font-semibold">
            <div className="w-5 h-5 bg-green-400 rounded-full border-2 border-background"></div>
            <span className="font-heading font-semibold">omar</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <ThemeToggleButton />

          <div className="lg:hidden">
            <Button variant="ghost" size="icon">
              <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};