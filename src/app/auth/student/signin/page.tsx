"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function StudentSigninPage() {
  return (
    <AuthLayout
      title="Student Sign In"
      subtitle="Access your learning dashboard"
      imagePosition="left"
    >
      <SigninForm defaultRole="STUDENT" hideRoleSelector />
    </AuthLayout>
  );
}