"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { api } from "@/trpc/react";
import { DashboardSkeleton, UsersSkeleton } from "@/components/admin/shared/dashboard-skeleton";
import { Suspense } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: isLoadingMetrics } = api.admin.commerce.getDashboardMetrics.useQuery();
  const { data: usersData} = api.admin.user.getAll.useQuery();

  const recentUsers = usersData?.users?.slice(0, 5) ?? [];

  // Show skeleton while critical data loads
  if (isLoadingMetrics) {
    return <DashboardSkeleton />;
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create New Coupon</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Generate discount codes for courses
            </p>
            <Link href="/admin/commerce/coupons/new" className="inline-block">
              <Button size="sm">
                Create Coupon
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create New Quiz</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Add assessments to your courses
            </p>
            <Link href="/admin/courses" className="inline-block">
              <Button size="sm">
                Manage Quizzes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              View reports and insights
            </p>
            <Link href="/admin/commerce" className="inline-block">
              <Button size="sm">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Exams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Track student evaluations
            </p>
            <Link href="/admin/courses" className="inline-block">
              <Button size="sm">
                Manage Exams
              </Button>
            </Link>
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
            <Suspense fallback={<UsersSkeleton />}>
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
            </Suspense>
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