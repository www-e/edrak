"use client";

import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const router = useRouter();

  const handleSignupComplete = () => {
    // Redirect to welcome page after successful signup (auto-login will be handled by AuthService)
    router.push("/welcome?new_user=true");
  };

  return (
    <AuthLayout
      title="Join S+ Today"
      subtitle="Start your learning journey with thousands of courses"
      imagePosition="right"
      features={[
        "300+ Free Courses",
        "Expert Instructors",
        "Certificate of Completion"
      ]}
    >
      <SignupForm onSignupComplete={handleSignupComplete} />
    </AuthLayout>
  );
}