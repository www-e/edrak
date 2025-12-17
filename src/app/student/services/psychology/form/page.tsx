'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';
import PsychologyForm from '@/components/psychology/psychology-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function StudentPsychologyFormPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as { id: string })?.id ?? '';  // Type assertion to handle the session structure

  // Check if user has purchased psychology service
  const { data: serviceAccess, isLoading: serviceCheckLoading } = api.student.services.hasServiceAccess.useQuery({
    serviceType: 'PSYCHOLOGY',
    userId: userId
  }, {
    enabled: status === 'authenticated' && !!userId
  });

  // Check if user has already submitted form
  const { data: formSubmission } = api.student.services.getFormSubmission.useQuery({
    serviceType: 'PSYCHOLOGY',
    userId: userId
  }, {
    enabled: status === 'authenticated' && !!userId
  });

  // Redirect if user doesn't have access or has already submitted form
  useEffect(() => {
    if (status === 'authenticated' && userId) {
      if (!serviceAccess?.hasAccess) {
        router.push('/services');
      } else if (formSubmission) {
        router.push('/student/services/psychology/status');
      }
    }
  }, [status, userId, serviceAccess, formSubmission, router]);

  if (status === 'loading' || serviceCheckLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/student/signin');
    return null;
  }

  if (!serviceAccess?.hasAccess) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Psychology Consultation Application</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don&apos;t have access to this service. Please purchase a psychology package first.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (formSubmission) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Psychology Consultation Application</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You&apos;ve already submitted your psychology application. You can view your status on the services page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Psychology Consultation Application</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Please fill out this form to help us provide the best psychological support for your athletic performance.
          </p>
          <PsychologyForm />
        </CardContent>
      </Card>
    </div>
  );
}