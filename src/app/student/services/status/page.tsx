'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export default function ServicesStatusPage() {
  const router = useRouter();
  const { data: services, isLoading } = api.student.services.getMyServices.useQuery();

  useEffect(() => {
    if (services && services.length > 0) {
      // Redirect to the first service's status page
      const firstService = services[0];
      if (firstService.type) {
        router.push(`/student/services/${firstService.type.toLowerCase()}/status`);
      }
    }
  }, [services, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg mb-4">No service status to display</p>
        <p className="text-muted-foreground mb-6">you do not have any services with status information.</p>
        <button 
          onClick={() => router.push('/student/services')}
          className="text-primary hover:underline"
        >
          Go to Services Dashboard
        </button>
      </div>
    </div>
  );
}