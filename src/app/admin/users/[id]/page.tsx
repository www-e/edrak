"use client";

import { useRouter, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Key, User, Phone, Tag, Calendar, CheckCircle } from "lucide-react";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError, error } = api.admin.user.getById.useQuery({ id: userId });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        <h2 className="heading-2">Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="heading-2">User Not Found</h2>
        <p className="text-muted-foreground">The user you are looking for does not exist.</p>
        <Button onClick={() => router.push("/admin/users")} className="mt-4">
          Back to Users
        </Button>
      </div>
    );
  }
  
  const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <div className="space-y-6">
      <PageHeader
        title={userFullName || user.username}
        description={`Details for user @${user.username}`}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
              Edit User
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Role:</span>
              <StatusBadge variant={user.role === "ADMIN" ? "destructive" : user.role === "PROFESSOR" ? "warning" : "default"}>
                {user.role}
              </StatusBadge>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Status:</span>
              <StatusBadge variant={user.isActive ? "success" : "secondary"}>
                {user.isActive ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
             <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Joined On:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Phone:</span>
              <span>{user.phoneNumber}</span>
            </div>
             {user.secondPhoneNumber && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                <span className="font-medium mr-2">Alt Phone:</span>
                <span>{user.secondPhoneNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Preferences Card */}
         <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Preferences & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Category Preference:</span>
              <span>{user.categoryPreference || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="font-medium mr-2">Referral Source:</span>
              <span>{user.referralSource || 'Not set'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}