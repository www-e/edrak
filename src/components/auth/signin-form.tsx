"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { AuthService } from "@/services/auth-service";
import { SigninCredentials } from "@/types/auth";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["STUDENT", "PROFESSOR", "ADMIN"]),
});

type FormValues = z.infer<typeof formSchema>;

interface SigninFormProps {
  defaultRole?: "STUDENT" | "PROFESSOR" | "ADMIN";
  hideRoleSelector?: boolean;
}

export function SigninForm({
  defaultRole,
  hideRoleSelector = false,
}: SigninFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: defaultRole,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const credentials: SigninCredentials = {
        username: data.username,
        password: data.password,
        role: data.role,
      };

      const result = await AuthService.signin(credentials);

      if (result.error) {
        // Now handles the error message returned from the service
        showSnackbar(result.error, "error");
      } else {
        showSnackbar("Sign in successful! Redirecting...", "success");

        // Redirect immediately on success
        // The page router will handle showing the correct dashboard
        const redirectUrl =
          {
            ADMIN: "/admin",
            PROFESSOR: "/professor/dashboard", // Assuming this is the correct path
            STUDENT: "/student/dashboard", // Assuming this is the correct path
          }[data.role] || "/";

        router.push(redirectUrl);
      }
    } catch (error) {
      // This will catch unexpected errors thrown by the service
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!hideRoleSelector && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="PROFESSOR">Professor</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
