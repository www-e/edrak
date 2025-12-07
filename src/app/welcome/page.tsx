"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen,Users, Clock } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isNewUser = searchParams.get("new_user") === "true";

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/student/signin");
      return;
    }

    // Redirect existing users away from welcome page
    if (status === "authenticated" && !isNewUser) {
      router.push("/student");
      return;
    }
  }, [status, isNewUser, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to S+!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your account has been created successfully. You are now ready to start your learning journey with thousands of courses.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">300+ Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access our extensive library of expertly designed courses across various fields.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Expert Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn from industry professionals and certified experts in their fields.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Flexible Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn at your own pace from anywhere, on any device.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Explore Courses</h3>
                  <p className="text-muted-foreground">Browse our course catalog and find topics that interest you.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <span className="text-primary font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Enroll & Pay</h3>
                  <p className="text-muted-foreground">Choose your preferred payment method and complete enrollment.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <span className="text-primary font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Start Learning</h3>
                  <p className="text-muted-foreground">Access your course content and begin your learning journey.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/courses">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Courses
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/student">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className="text-center mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Signed in as <span className="font-semibold text-foreground">{session.user.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}