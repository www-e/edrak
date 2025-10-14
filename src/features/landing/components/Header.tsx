"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Menu, X, ChevronLeft, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

const ChevronBack = ChevronLeft;

export const Header = () => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenuPage, setMobileMenuPage] = useState('main'); // 'main', 'categories', 'languages'
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/services", label: "Services" },
    { href: "/partners/", label: "Partners" },
  ];

  const exploreLinks = [
    { href: "/courses", label: "All Courses" },
  ];

  return (
    <header className="sticky top-0 z-50 h-[88px] bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.06)] font-body">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between h-full max-w-[1200px] mx-auto px-5">
        <div className="flex items-center h-full gap-x-6">
          <Link href="/">
            <Image
              src="/spl-logo.png"
              alt="Sportology Plus Logo"
              width={240}
              height={76}
              className="h-16 w-auto"
              priority={true}
              sizes="240px"
            />
          </Link>
          
          <div className="relative h-full flex items-center" onMouseEnter={() => setIsExploreOpen(true)} onMouseLeave={() => setIsExploreOpen(false)}>
            <button className="flex items-center gap-x-1 text-foreground text-base font-semibold hover:text-primary transition-colors">
              Learning Areas
              <ChevronDown size={16} className={`transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isExploreOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-4 z-10">
                <div className="flex flex-col">
                  {exploreLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="px-6 py-2 text-foreground hover:bg-muted transition-colors text-left">
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-border my-2"></div>
                  <Link href="/courses" className="px-6 py-2 text-primary font-semibold hover:bg-muted transition-colors text-left">
                    View All Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
           <div className="relative">
            <Input 
              type="search" 
              placeholder="Search"
              className="bg-muted border-none rounded-full h-10 w-64 pl-10 pr-4 text-foreground placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          </div>
        </div>

        <div className="flex items-center gap-x-6">
          <div className="flex items-center gap-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-6 border-l border-border"></div>

          <div className="flex items-center gap-x-4">
            {status === "loading" ? (
              <div className="flex items-center text-sm font-semibold">
                <div className="w-5 h-5 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : session?.user ? (
              <div className="hidden md:flex items-center gap-x-2 text-sm font-semibold">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || ''}
                </div>
                <span className="font-body font-semibold">{session.user?.name || ''}</span>
                <Link href="/student/profile">
                  <Button variant="outline" size="sm" className="bg-background border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm">
                    <User size={16} className="mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="destructive"
                  size="sm"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold shadow-sm"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/student/signin" className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
            )}
            <Link href="/auth/signup" passHref>
              <Button asChild className="bg-primary text-primary-foreground rounded-lg px-6 py-2 h-auto text-base font-semibold hover:bg-primary/90">
                Sign Up Free
              </Button>
            </Link>
            
          </div>
        </div>
      </nav>
      {/* Mobile Navigation */}
      <nav className="lg:hidden flex items-center justify-between h-full px-5">
        <div className="flex items-center gap-x-4">
          <button onClick={() => { setIsMobileMenuOpen(true); setMobileMenuPage('main'); }} aria-label="Open menu">
            <Menu size={24} className="text-foreground" />
          </button>
          <Link href="/">
            <Image
              src="/spl-logo.png"
              alt="Sportology Plus Logo"
              width={240}
              height={76}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          {status === "loading" ? (
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 bg-green-400 rounded-full border animate-pulse"></div>
              <span className="ml-1">Loading...</span>
            </div>
          ) : session?.user ? (
            <>
              <Link href="/student/profile">
                <Button variant="outline" size="sm" className="bg-background border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                  <User size={14} className="mr-1" />
                  Profile
                </Button>
              </Link>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="destructive"
                size="sm"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              >
                <LogOut size={14} className="mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/student/signin" className="text-sm font-semibold text-foreground">
              Sign In
            </Link>
          )}
          <Link href="/auth/signup" passHref>
            <Button asChild size="sm" className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 h-auto text-sm font-semibold">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
            {/* Main Menu */}
            <div className={`flex flex-col h-full ${mobileMenuPage === 'main' ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={24} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-4">
                <div className="relative">
                  <Input type="search" placeholder="Search" className="bg-muted border-none rounded-full h-10 w-full pl-10 pr-4"/>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                </div>
              </div>
              <div className="flex flex-col p-4 text-lg font-semibold text-foreground">
                <button onClick={() => setMobileMenuPage('categories')} className="w-full text-left py-3">Learning Areas</button>
                {navLinks.map((link) => (
                     <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left py-3">{link.label}</Link>
                ))}
              </div>
            </div>

            {/* Categories Menu */}
            <div className={`flex flex-col h-full ${mobileMenuPage === 'categories' ? '' : 'hidden'}`}>
                 <div className="flex items-center p-4 border-b border-border">
                  <button onClick={() => setMobileMenuPage('main')}>
                    <ChevronBack size={24} className="text-muted-foreground" />
                  </button>
                  <h6 className="flex-grow text-center font-bold text-xl">Learning Areas</h6>
                </div>
                <div className="flex flex-col p-4 text-lg font-semibold text-foreground">
                  {exploreLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="py-3">
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-border my-2"></div>
                  <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-primary">
                    View All Courses
                  </Link>
                </div>
            </div>
            
             <div className={`flex flex-col h-full ${mobileMenuPage === 'languages' ? '' : 'hidden'}`}>
                 <div className="flex items-center p-4 border-b border-border">
                  <button onClick={() => setMobileMenuPage('main')}>
                    <ChevronBack size={24} className="text-muted-foreground" />
                  </button>
                  <h6 className="flex-grow text-center font-bold text-xl">Languages</h6>
                </div>
                 <div className="flex flex-col p-4 font-semibold text-foreground">
                  <span className="py-3 text-muted-foreground">Language selection coming soon</span>
                </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};