
"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface UserMenuProps {
  user: User;
  profileHref?: string;
  displayMode?: "dropdown" | "static";
  isCollapsed?: boolean; // For static mode in sidebar
}

export function UserMenu({ 
  user, 
  profileHref = "/profile", 
  displayMode = "dropdown",
  isCollapsed = false 
}: UserMenuProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (displayMode === 'static') {
    return (
      <div className="border-t border-border p-4">
        <div className="mb-4">
          <Link href={profileHref} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </Link>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    );
  }

  // Default to dropdown display mode
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex lg:flex-col lg:items-start">
            <span className="text-sm font-semibold text-foreground">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
