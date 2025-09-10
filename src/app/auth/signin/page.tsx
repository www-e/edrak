"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";

export default function SigninPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to access your account"
      imagePosition="left"
    >
      <SigninForm />
    </AuthLayout>
  );
}