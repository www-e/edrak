"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Search, ChevronDown, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

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

// Dropdown component for user menu
const UserDropdown = ({ session }: { session: Session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="hidden md:flex items-center gap-x-2 text-sm font-semibold cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {session.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="font-heading font-semibold">{session.user?.name || 'User'}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium">{session.user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{session.user?.email || 'user@example.com'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// Dropdown component for learning areas
const LearningAreasDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a 
        href="#" 
        className="transition-colors hover:text-foreground flex items-center gap-1 font-heading font-semibold cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        Learning Areas <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </a>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg py-2 z-50 bg-white dark:bg-gray-900">
          <div className="px-4 py-2 hover:bg-muted cursor-pointer">
            <h3 className="font-medium">Programming</h3>
            <p className="text-sm text-muted-foreground">Learn to code with our comprehensive courses</p>
          </div>
          <div className="px-4 py-2 hover:bg-muted cursor-pointer">
            <h3 className="font-medium">Data Science</h3>
            <p className="text-sm text-muted-foreground">Master data analysis and machine learning</p>
          </div>
          <div className="px-4 py-2 hover:bg-muted cursor-pointer">
            <h3 className="font-medium">Design</h3>
            <p className="text-sm text-muted-foreground">Create beautiful interfaces and experiences</p>
          </div>
          <div className="px-4 py-2 hover:bg-muted cursor-pointer">
            <h3 className="font-medium">Business</h3>
            <p className="text-sm text-muted-foreground">Develop essential business skills</p>
          </div>
          <div className="px-4 py-2 border-t border-border mt-2">
            <a href="#" className="text-primary hover:underline text-sm font-medium">View All Categories →</a>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left side: Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-black text-primary tracking-tight font-heading">
            sportschool
          </Link>
        </div>

        {/* Middle: Navigation Links & Search */}
        <div className="flex flex-1 items-center justify-center gap-x-8">
          <nav className="hidden lg:flex items-center gap-x-6 text-sm font-medium text-muted-foreground">
            <LearningAreasDropdown />
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

          {status === "loading" ? (
            <div className="hidden md:flex items-center gap-x-2 text-sm font-semibold">
              <div className="w-5 h-5 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
              <span className="font-heading font-semibold">Loading...</span>
            </div>
          ) : session?.user ? (
            <UserDropdown session={session} />
          ) : (
            <Link href="/auth/student/signin">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex items-center gap-x-1 font-heading font-semibold"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
          
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