"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function AdminSigninPage() {
  return (
    <AuthLayout
      title="Admin Dashboard Access"
      subtitle="Manage the platform and users"
      imagePosition="left"
      features={[
        "User Management",
        "Content Moderation",
        "Analytics & Reports",
        "System Administration"
      ]}
    >
      <SigninForm defaultRole="ADMIN" hideRoleSelector />
    </AuthLayout>
  );
}