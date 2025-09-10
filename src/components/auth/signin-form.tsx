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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function SigninForm({ defaultRole, hideRoleSelector = false }: SigninFormProps) {
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
        showSnackbar(result.error, "error");
      } else {
        showSnackbar("Sign in successful!", "success");
        
        // Wait a bit for the snackbar to be visible before proceeding
        setTimeout(() => {
          // Redirect based on role
          switch (data.role) {
            case "ADMIN":
              router.push("/admin/dashboard");
              break;
            case "PROFESSOR":
              router.push("/professor/dashboard");
              break;
            case "STUDENT":
              router.push("/student/dashboard");
              break;
            default:
              router.push("/");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      showSnackbar("Sign in failed", "error");
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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