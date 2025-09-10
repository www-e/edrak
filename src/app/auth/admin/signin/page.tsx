"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function AdminSigninPage() {
  return (
    <AuthLayout
      title="Admin Sign In"
      subtitle="Access the administration panel"
      imagePosition="left"
    >
      <SigninForm defaultRole="ADMIN" hideRoleSelector />
    </AuthLayout>
  );
}