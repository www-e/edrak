'use client';

import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Mail, Phone, Calendar, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
                 <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    );
}

export default function StudentProfilePage() {
  const { data: profile, isLoading, error } = api.student.profile.getProfile.useQuery();

  const renderContent = () => {
    if (isLoading) {
      return <ProfileSkeleton />;
    }

    if (error || !profile) {
      return (
        <Card className="py-16 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Could not load profile</h3>
          <p className="mt-1 text-muted-foreground">There was an error fetching your data.</p>
        </Card>
      );
    }
    
    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>View your personal information.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                        <p className="text-muted-foreground">@{profile.username}</p>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center gap-4 text-sm">
                        <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">Email:</span>
                        <span className="text-muted-foreground">{profile.username}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">Phone:</span>
                        <span className="text-muted-foreground">{profile.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">Member Since:</span>
                        <span className="text-muted-foreground">
                            {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        {renderContent()}
    </div>
  );
}