'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  ArrowLeft,
  User,
  Target,
  Package
} from 'lucide-react';
import Link from 'next/link';

// Define the application types based on Prisma schema
type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';

interface BaseApplication {
  id: string;
  fullName: string;
  gender: string;
  age: number;
  email: string;
  phone?: string;
  country: string;
  city: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PsychologyApplication extends BaseApplication {
  previousTrainer: string;
  previousPsychologist: string;
  medications: string;
  injuries: string;
  primarySport: string;
  trainingAge: string;
  weeklyDays: string;
  workoutDuration: string;
  preparingForCompetition: string;
  competitionDate?: string;
  affectingPerformance: string;
  previousBreakdown: string;
  generalMentalState: string;
  sleepDifficulties: string;
  anxietyEpisodes: string;
  primaryGoal: string;
  sessionPreference: string;
  combineWithTraining?: string;
  selectedPackage?: string;
  assignedPsychologist?: string;
  firstSessionDate?: Date;
}

interface TrainingApplication extends BaseApplication {
  previousTrainer: string;
  injuries: string;
  trainingAge: string;
  weeklyDays: string;
  dailyExercises: string;
  workoutDuration: string;
  exerciseTypes: string;
  primarySport?: string;
  weight: string;
  height: string;
  chestCircumference?: string;
  waistCircumference?: string;
  hipCircumference?: string;
  armCircumference?: string;
  thighCircumference?: string;
  squatTest?: string;
  pushupTest?: string;
  enduranceTest?: string;
  flexibilityTest?: string;
  frontPhoto?: string;
  sidePhoto?: string;
  backPhoto?: string;
  primaryGoal: string;
  timeframe?: string;
  nutritionPlan?: string;
  selectedPackage?: string;
  assignedTrainer?: string;
  preferredProgram?: string;
}

interface NutritionApplication extends BaseApplication {
  injuries: string;
  medications?: string;
  allergies?: string;
  medicalConditions?: string;
  currentWeight: string;
  currentHeight: string;
  targetWeight?: string;
  dietaryRestrictions?: string;
  currentEatingHabits: string;
  mealsPerDay: string;
  waterIntake?: string;
  activityLevel: string;
  primaryGoal: string;
  timeframe?: string;
  selectedPackage?: string;
  assignedNutritionist?: string;
}

type FormSubmission = PsychologyApplication | TrainingApplication | NutritionApplication;

interface ServiceStatusPageProps {
  params: Promise<{
    serviceType: string;
  }>;
}

export default function ServiceStatusPage({ params }: ServiceStatusPageProps) {
  const router = useRouter();
  const { data: session, status: rawStatus } = useSession();
  const status = rawStatus as 'loading' | 'authenticated' | 'unauthenticated';
  const [serviceInfo, setServiceInfo] = React.useState<{ serviceType: string, userId: string }>({ serviceType: '', userId: '' });
  const [loaded, setLoaded] = React.useState(false);

  // Check authentication status and redirect if needed
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/student/signin');
    }
  }, [status, router]);

  React.useEffect(() => {
    if (status === 'loading') {
      return; // Don't do anything while session is loading
    }

    const initialize = async () => {
      const awaitedParams = await params;
      const serviceType = awaitedParams.serviceType.toUpperCase();
      const userId = (session?.user as { id: string })?.id || '';
      setServiceInfo({ serviceType, userId });
      setLoaded(true);
    };

    initialize();
  }, [params, session, status]);

  if (status === 'loading' || !loaded) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const serviceType = serviceInfo.serviceType;
  const userId = serviceInfo.userId;

  const { data: formSubmission, isLoading, error } = api.student.services.getFormSubmission.useQuery({
    serviceType: serviceType as 'NUTRITION' | 'PSYCHOLOGY' | 'TRAINING',
    userId: userId || ''
  }, {
    enabled: !!userId
  }) as { data: FormSubmission | null; isLoading: boolean; error: unknown };

  if ((status as 'loading' | 'authenticated' | 'unauthenticated') === 'loading' || isLoading) {
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
    return null; // Redirect effect handles this
  }

  if (error || !formSubmission) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{serviceType.charAt(0) + serviceType.slice(1).toLowerCase()} Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No application found for this service. Please complete your application first.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild>
                <Link href={`/student/services/${serviceType.toLowerCase()}/form`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to Application
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format service type for display
  const formattedServiceType = serviceType.charAt(0) + serviceType.slice(1).toLowerCase();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/student/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {formattedServiceType} Application Status
            </CardTitle>
            <Badge 
              variant={formSubmission.status === 'PENDING' ? 'secondary' : 
                      formSubmission.status === 'APPROVED' ? 'default' : 
                      formSubmission.status === 'REJECTED' ? 'destructive' : 'secondary'}
            >
              {formSubmission.status === 'PENDING' ? (
                <>
                  <Clock className="mr-1 h-3 w-3" />
                  Pending Review
                </>
              ) : formSubmission.status === 'APPROVED' ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Approved
                </>
              ) : formSubmission.status === 'REJECTED' ? (
                <>
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Rejected
                </>
              ) : (
                <>
                  <FileText className="mr-1 h-3 w-3" />
                  {formSubmission.status}
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {formSubmission.fullName}</p>
                  <p><span className="font-medium">Email:</span> {formSubmission.email}</p>
                  <p><span className="font-medium">Age:</span> {formSubmission.age}</p>
                  <p><span className="font-medium">Gender:</span> {formSubmission.gender}</p>
                  <p><span className="font-medium">Location:</span> {formSubmission.city}, {formSubmission.country}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Goals & Preferences
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Primary Goal:</span> {formSubmission.primaryGoal}</p>
                  <p><span className="font-medium">Selected Package:</span> {formSubmission.selectedPackage || 'Not specified'}</p>
                  {serviceType === 'TRAINING' && 'preferredProgram' in formSubmission && formSubmission.preferredProgram && (
                    <p><span className="font-medium">Program Type:</span> {formSubmission.preferredProgram}</p>
                  )}
                  {serviceType === 'PSYCHOLOGY' && 'primarySport' in formSubmission && formSubmission.primarySport && (
                    <p><span className="font-medium">Primary Sport:</span> {formSubmission.primarySport}</p>
                  )}
                  {serviceType === 'NUTRITION' && 'currentWeight' in formSubmission && formSubmission.currentWeight && (
                    <p><span className="font-medium">Current Weight:</span> {formSubmission.currentWeight} kg</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Application Details
              </h3>
              <div className="text-sm">
                <p><span className="font-medium">Submitted:</span> {new Date(formSubmission.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Current Status:</span> {formSubmission.status}</p>
                {formSubmission.status === 'REJECTED' && formSubmission.notes && (
                  <>
                    <p className="font-medium mt-2">Reason for rejection:</p>
                    <p className="text-muted-foreground">{formSubmission.notes}</p>
                  </>
                )}
                {formSubmission.status === 'APPROVED' &&
                 (('assignedNutritionist' in formSubmission && formSubmission.assignedNutritionist) ||
                  ('assignedPsychologist' in formSubmission && formSubmission.assignedPsychologist) ||
                  ('assignedTrainer' in formSubmission && formSubmission.assignedTrainer)) && (
                  <>
                    <p className="font-medium mt-2">Assigned Specialist:</p>
                    <p className="text-muted-foreground">
                      {'assignedNutritionist' in formSubmission ? formSubmission.assignedNutritionist :
                       'assignedPsychologist' in formSubmission ? formSubmission.assignedPsychologist :
                       'assignedTrainer' in formSubmission ? formSubmission.assignedTrainer : ''}
                    </p>
                  </>
                )}
              </div>
            </div>

            {formSubmission.status === 'PENDING' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your application is currently under review. Our specialists will contact you within 24-48 hours.
                </AlertDescription>
              </Alert>
            )}

            {formSubmission.status === 'APPROVED' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Congratulations! Your application has been approved. A specialist will contact you soon to begin your program.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/student/services">
                  Back to Services
                </Link>
              </Button>
              {formSubmission.status === 'APPROVED' && (
                <Button>
                  Contact Specialist
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}