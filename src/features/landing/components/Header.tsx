"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/courses", label: "Courses", prefetch: true },
    { href: "/nutrition", label: "Nutrition", prefetch: true },
    { href: "/psychology", label: "Psychology", prefetch: true },
    { href: "/training", label: "Training", prefetch: true },
    { href: "/services", label: "Services", prefetch: false },
    { href: "/faq", label: "FAQ", prefetch: false },
    { href: "/about", label: "About", prefetch: false },
    { href: "/legal", label: "Legal", prefetch: false },
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
              className="h-20 w-auto"
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
                  prefetch={link.prefetch}
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {/* Mobile Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="w-full h-12 pl-4 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch={link.prefetch}
                        className="block px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth */}
                  <div className="pt-6 border-t border-gray-200">
                    {status === "loading" ? (
                      <div className="flex justify-center">
                        <span className="text-gray-500">Loading...</span>
                      </div>
                    ) : session?.user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{session.user?.name}</p>
                            <p className="text-sm text-gray-500">{session.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link href="/student/profile" className="flex-1">
                            <Button variant="outline" size="lg" className="w-full text-base">
                              View Profile
                            </Button>
                          </Link>
                          <Button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            variant="destructive"
                            size="lg"
                            className="flex-1 text-base"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link href="/auth/student/signin" className="block">
                          <Button variant="outline" size="lg" className="w-full text-base">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth/signup" className="block">
                          <Button size="lg" className="w-full text-base">
                            Create Account
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
