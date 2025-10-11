"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@prisma/client";

interface CourseFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  isPending: boolean;
  professors: { id: string; firstName: string | null; lastName: string | null }[];
  categories: Category[] | null | undefined;
  submitButtonText?: string;
  handleTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CourseForm({
  form,
  onSubmit,
  isPending,
  professors,
  categories,
  submitButtonText = "Submit",
  handleTitleChange,
}: CourseFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to Web Development"
                      {...field}
                      onChange={handleTitleChange ? handleTitleChange : field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Slug *</FormLabel>
                  <FormControl><Input placeholder="e.g., intro-to-web-dev" {...field} /></FormControl>
                  <FormDescription>This is the URL-friendly version of the title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl><Textarea placeholder="Describe the course content and objectives." {...field} rows={8} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Metadata */}
          <div className="md:col-span-1 space-y-6">
            <FormField
              control={form.control}
              name="professorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a professor" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professors.map(prof => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.firstName} {prof.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (EGP) *</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
