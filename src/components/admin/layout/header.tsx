"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* TODO: Add user profile dropdown */}
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}