'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { BookOpen, Award, CreditCard, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-1/3" />
            </CardContent>
        </Card>
    );
}

export default function StudentDashboardPage() {
  const { data: stats, isLoading, error } = api.student.dashboard.getDashboardStats.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your learning journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
            <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </>
        ) : error ? (
            <div className="col-span-4 rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
                <p>Could not load your dashboard stats. Please try refreshing the page.</p>
            </div>
        ) : (
            <>
                <StatCard title="Active Courses" value={stats?.activeCourses ?? 0} icon={BookOpen} />
                <StatCard title="Completed Courses" value={stats?.completedCourses ?? 0} icon={Award} />
                <StatCard title="Total Payments" value={stats?.totalPayments ?? 0} icon={CreditCard} />
                <StatCard title="Total Spent (EGP)" value={stats?.totalSpent.toFixed(2) ?? '0.00'} icon={TrendingUp} />
            </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Pick up where you left off in your enrolled courses.
            </p>
            <Button asChild className="w-full">
              <Link href="/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse My Courses
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discover New Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Explore our catalog and find your next learning adventure.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/courses">
                Explore Catalog
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}