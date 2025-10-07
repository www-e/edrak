"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/admin/shared/page-header";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { api } from "@/trpc/react";
import { CreateUserInputSchema } from "@/types/admin"; // Import the schema

// Infer the type from the schema
type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserInputSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "STUDENT",
      isActive: true, // Set the default value here
    },
  });
  
  const createUser = api.admin.user.create.useMutation({
    onSuccess: () => {
      showSnackbar("User created successfully!", "success");
      router.push("/admin/users");
      router.refresh();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to create user", "error");
    }
  });

  // The 'data' from the form now correctly matches the schema type
  function onSubmit(data: CreateUserInput) {
    createUser.mutate(data);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create User"
        description="Add a new user to the platform"
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        }
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
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
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="01xxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
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
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}