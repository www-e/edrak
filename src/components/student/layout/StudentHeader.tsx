'use client';

import { SessionUser } from "@/types/auth";
import { AppHeader } from "@/components/shared/AppHeader";

interface StudentHeaderProps {
  user: SessionUser;
}

export function StudentHeader({ user }: StudentHeaderProps) {
  return (
    <AppHeader
      title="Student Portal"
      user={{
        name: user.name || undefined,
        email: user.email || undefined,
        image: user.image || undefined
      }}
      profileHref="/student/profile"
      showMobileMenu={true}
      className="shadow-sm"
    />
  );
}