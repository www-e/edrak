"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/services", label: "Services" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/spl-logo.png"
              alt="Sportology Plus Logo"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority={true}
            />
          </Link>

          {/* Desktop: Nav + Search + Auth */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-64 h-9 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              {status === "loading" ? (
                <span className="text-sm text-gray-500">Loading...</span>
              ) : session?.user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
                  </div>
                  <Link href="/student/profile">
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    variant="destructive"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/student/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2}>
              {isMobileMenuOpen ? (
                <>
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </>
              ) : (
                <>
                  <line x1={3} y1={6} x2={21} y2={6} />
                  <line x1={3} y1={12} x2={21} y2={12} />
                  <line x1={3} y1={18} x2={21} y2={18} />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-gray-200">
              {status === "loading" ? (
                <span className="text-sm text-gray-500">Loading...</span>
              ) : session?.user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/student/profile" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/student/signin" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
