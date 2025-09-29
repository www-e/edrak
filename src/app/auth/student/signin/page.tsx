"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function StudentSigninPage() {
  return (
    <AuthLayout
      title="Welcome Back, Student"
      subtitle="Continue your learning journey"
      imagePosition="left"
      features={[
        "Track Your Progress",
        "Access All Courses",
        "Download Certificates",
        "Join Study Groups"
      ]}
    >
      <SigninForm defaultRole="STUDENT" hideRoleSelector />
    </AuthLayout>
  );
}