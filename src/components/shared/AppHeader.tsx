"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu"; // Import the new component

// The User interface can be removed if it's defined in UserMenu and not used elsewhere here.
// For now, we leave it in case other parts of the file system use it.
interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface AppHeaderProps {
  onMenuToggle?: () => void;
  title: string;
  user?: User;
  profileHref?: string;
  showMobileMenu?: boolean;
  className?: string;
}

export function AppHeader({
  onMenuToggle,
  title,
  user,
  profileHref = "/profile",
  showMobileMenu = true,
  className = ""
}: AppHeaderProps) {

  return (
    <header className={`sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur ${className}`}>
      <div className="flex h-16 items-center px-4 md:px-6">
        {showMobileMenu && onMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>

          {user && (
            <UserMenu user={user} profileHref={profileHref} />
          )}
        </div>
      </div>
    </header>
  );
}