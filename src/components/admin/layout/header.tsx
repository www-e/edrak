"use client";

import { AppHeader } from "@/components/shared/AppHeader";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export function AdminHeader({ onMenuToggle, user }: AdminHeaderProps) {
  return (
    <AppHeader
      onMenuToggle={onMenuToggle}
      title="Admin Dashboard"
      user={user}
      profileHref="/admin/profile"
      showMobileMenu={true}
    />
  );
}