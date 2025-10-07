'use client';

import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CreditCard, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function PaymentsTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function StudentPaymentsPage() {
  const { data: payments, isLoading, error } = api.student.payments.getPaymentHistory.useQuery();

  const renderContent = () => {
    if (isLoading) {
      return <PaymentsTableSkeleton />;
    }

    if (error) {
      return (
        <div className="py-16 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Failed to load payment history</h3>
          <p className="mt-1 text-muted-foreground">Please try refreshing the page.</p>
        </div>
      );
    }

    if (payments?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No payments found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Your history of successful payments will appear here once you enroll in a course.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Transaction Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                <Link href={`/courses/${payment.course?.slug}`} className="hover:underline">
                    {payment.course?.title || 'N/A'}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(payment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {Number(payment.amount).toFixed(2)} {payment.currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            A record of all your successful transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}