"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp 
} from "lucide-react";
import { api } from "@/trpc/react";

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: isLoadingMetrics } = api.admin.commerce.getDashboardMetrics.useQuery();
  const { data: usersData, isLoading: isLoadingUsers } = api.admin.user.getAll.useQuery();
  
  const recentUsers = usersData?.slice(0, 5) ?? [];

  if (isLoadingMetrics || isLoadingUsers) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the sportschool admin dashboard</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers ?? 0}</div>
            {/* You can add percentage change logic here later */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalCourses ?? 0}</div>
            {/* You can add percentage change logic here later */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {metrics?.totalRevenue ?? 0}</div>
             {/* You can add percentage change logic here later */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeEnrollments ?? 0}</div>
             {/* You can add percentage change logic here later */}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length > 0 ? recentUsers.map((user) => (
                <div key={user.id} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.firstName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                  <div className="ml-auto font-medium capitalize text-sm">{user.role.toLowerCase()}</div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent users found.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-sm text-muted-foreground text-center py-4">
               Course data will be connected in the next step.
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}