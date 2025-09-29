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
      title="Join Edraak Today"
      subtitle="Start your learning journey with thousands of courses"
      imagePosition="right"
      features={[
        "300+ Free Courses",
        "Expert Instructors",
        "Lifetime Access",
        "Certificate of Completion"
      ]}
    >
      <SignupForm onSignupComplete={handleSignupComplete} />
    </AuthLayout>
  );
}