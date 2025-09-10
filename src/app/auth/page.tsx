"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Edrak</CardTitle>
          <CardDescription>
            Select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => router.push("/auth/student/signin")}
          >
            Student
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => router.push("/auth/professor/signin")}
          >
            Professor
          </Button>
          <Button 
            className="w-full" 
            variant="secondary"
            onClick={() => router.push("/auth/admin/signin")}
          >
            Administrator
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                New user?
              </span>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="ghost"
            onClick={() => router.push("/auth/signup")}
          >
            Create Student Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}