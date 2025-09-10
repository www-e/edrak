"use client";

import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const router = useRouter();

  const handleSignupComplete = () => {
    // Redirect to sign in page after successful signup
    router.push("/auth/signin");
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Fill in your information to get started"
      imagePosition="right"
    >
      <SignupForm onSignupComplete={handleSignupComplete} />
    </AuthLayout>
  );
}