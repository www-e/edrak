'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionUser } from "@/types/auth";
import { UserMenu } from "@/components/auth/UserMenu"; // Import the new component

// Convert SessionUser to UserMenu compatible format
const convertSessionUserToUser = (sessionUser: SessionUser) => ({
  name: sessionUser.name || undefined,
  email: sessionUser.email || undefined,
  image: sessionUser.image || undefined,
});

const navigation = [
  { name: "Dashboard", href: "/student", icon: Home },
  { name: "My Courses", href: "/student/courses", icon: BookOpen },
  { name: "My Services", href: "/student/services", icon: BookOpen },
  { name: "Profile", href: "/student/profile", icon: User },
  { name: "Payments", href: "/student/payments", icon: CreditCard },
];

interface StudentSidebarProps {
  user?: SessionUser;
}

export function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
        "bg-secondary border-r border-border",
        isCollapsed ? "w-20" : "w-72",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>

        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground">Student Portal</h1>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && (
                      <span>{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        {user && (
          <UserMenu
            user={convertSessionUserToUser(user)}
            displayMode="static"
            isCollapsed={isCollapsed}
            profileHref="/student/profile"
          />
        )}
      </div>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isMobileOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </>
  );
}