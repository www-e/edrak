"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function ProfessorSigninPage() {
  return (
    <AuthLayout
      title="Professor Sign In"
      subtitle="Access your course management dashboard"
      imagePosition="left"
    >
      <SigninForm defaultRole="PROFESSOR" hideRoleSelector />
    </AuthLayout>
  );
}