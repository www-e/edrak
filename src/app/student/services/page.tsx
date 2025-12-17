'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { BookOpen, CheckCircle, Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function ServiceCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function StudentServicesPage() {
  const { data: services, isLoading, error } = api.student.services.getMyServices.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
          <p className="text-muted-foreground">Manage your purchased services</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
          <p className="text-muted-foreground">Manage your purchased services</p>
        </div>
        <Card className="py-16 text-center">
          <CardContent>
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to load services</h3>
            <p className="text-muted-foreground">Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
        <p className="text-muted-foreground">Manage your purchased services</p>
      </div>

      {!services?.length ? (
        <Card>
          <CardContent className="text-center py-16">
            <CreditCard className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You have not purchased any services yet. Browse our catalog to find your first service.
            </p>
            <Button asChild size="lg">
              <Link href="/services">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Services
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{service.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {service.type}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 mr-1" />
                  {service.paymentStatus}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status</span>
                    <span className="capitalize">{service.formStatus}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {service.formStatus === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Form completed</span>
                      </>
                    ) : service.formStatus === 'pending' ? (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600">Form pending</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Not started</span>
                      </>
                    )}
                  </div>
                </div>

                {service.formStatus !== 'completed' && (
                  <Button asChild className="w-full">
                    <Link href={`/student/services/${service.type.toLowerCase()}/form`}>
                      {service.formStatus === 'pending' ? 'Continue Form' : 'Complete Application'}
                    </Link>
                  </Button>
                )}

                {service.formStatus === 'completed' && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/student/services/${service.type.toLowerCase()}/status`}>
                      View Status
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}