"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function ProfessorSigninPage() {
  return (
    <AuthLayout
      title="Welcome Back, Professor"
      subtitle="Manage your courses and students"
      imagePosition="left"
      features={[
        "Create & Edit Courses",
        "Track Student Progress",
        "View Analytics",
        "Earn Revenue"
      ]}
    >
      <SigninForm defaultRole="PROFESSOR" hideRoleSelector />
    </AuthLayout>
  );
}