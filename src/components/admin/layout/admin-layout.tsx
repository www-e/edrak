"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { usePathname } from "next/navigation";

// Lazy load components for better performance
const AdminHeader = lazy(() => import("@/components/admin/layout/header").then(module => ({ default: module.AdminHeader })));
const AdminSidebar = lazy(() => import("@/components/admin/layout/sidebar").then(module => ({ default: module.AdminSidebar })));

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading sidebar...</div>}>
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<div className="h-16 bg-background border-b flex items-center justify-center">Loading header...</div>}>
          <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        </Suspense>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading page...</div>}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}