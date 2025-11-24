"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchFilter } from "@/components/admin/shared/search-filter";
import { DataTable, type DataTableColumn } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Brain, Dumbbell, Apple } from "lucide-react";

// This is the robust, correct way to get the type from the tRPC router.
type RouterOutput = inferRouterOutputs<AppRouter>;
type PsychologyApplication = RouterOutput["admin"]["applications"]["getPsychologyApplications"]["applications"][number];
type TrainingApplication = RouterOutput["admin"]["applications"]["getTrainingApplications"]["applications"][number];
type NutritionApplication = RouterOutput["admin"]["applications"]["getNutritionApplications"]["applications"][number];

export default function ApplicationsPage() {
  const router = useRouter();
  
  // Psychology applications state
  const [psychologyPage, setPsychologyPage] = useState(1);
  const [psychologySearch, setPsychologySearch] = useState("");
  const [psychologyStatus, setPsychologyStatus] = useState<string | undefined>();
  
  // Training applications state
  const [trainingPage, setTrainingPage] = useState(1);
  const [trainingSearch, setTrainingSearch] = useState("");
  const [trainingStatus, setTrainingStatus] = useState<string | undefined>();

  // Nutrition applications state
  const [nutritionPage, setNutritionPage] = useState(1);
  const [nutritionSearch, setNutritionSearch] = useState("");
  const [nutritionStatus, setNutritionStatus] = useState<string | undefined>();

  const { data: psychologyData, isLoading: psychologyLoading } = api.admin.applications.getPsychologyApplications.useQuery({
    page: psychologyPage,
    limit: 20,
    search: psychologySearch || undefined,
    status: psychologyStatus as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | undefined,
  });

  const { data: trainingData, isLoading: trainingLoading } = api.admin.applications.getTrainingApplications.useQuery({
    page: trainingPage,
    limit: 20,
    search: trainingSearch || undefined,
    status: trainingStatus as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | undefined,
  });

  const { data: nutritionData, isLoading: nutritionLoading } = api.admin.applications.getNutritionApplications.useQuery({
    page: nutritionPage,
    limit: 20,
    search: nutritionSearch || undefined,
    status: nutritionStatus as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | undefined,
  });

  const psychologyApplications = psychologyData?.applications ?? [];
  const trainingApplications = trainingData?.applications ?? [];
  const nutritionApplications = nutritionData?.applications ?? [];

  const psychologyColumns: DataTableColumn<PsychologyApplication>[] = [
    {
      key: "fullName" as keyof PsychologyApplication,
      title: "Full Name",
    },
    {
      key: "email" as keyof PsychologyApplication,
      title: "Email",
    },
    {
      key: "primarySport" as keyof PsychologyApplication,
      title: "Primary Sport",
    },
    {
      key: "primaryGoal" as keyof PsychologyApplication,
      title: "Goal",
    },
    {
      key: "status" as keyof PsychologyApplication,
      title: "Status",
      render: (value: PsychologyApplication[keyof PsychologyApplication]) => (
        <StatusBadge variant={value === 'PENDING' ? 'default' : value === 'APPROVED' ? 'success' : value === 'REJECTED' ? 'destructive' : 'warning'}>
          {value as string}
        </StatusBadge>
      ),
    },
    {
      key: "assignedPsychologist" as keyof PsychologyApplication,
      title: "Psychologist",
      render: (value: PsychologyApplication[keyof PsychologyApplication]) => (
        <span className="text-sm text-muted-foreground">
          {value ? String(value) : "Not Assigned"}
        </span>
      ),
    },
    {
      key: "createdAt" as keyof PsychologyApplication,
      title: "Applied",
      render: (value: PsychologyApplication[keyof PsychologyApplication]) => (
        (value as Date).toLocaleDateString()
      ),
    },
  ];

  const trainingColumns: DataTableColumn<TrainingApplication>[] = [
    {
      key: "fullName" as keyof TrainingApplication,
      title: "Full Name",
    },
    {
      key: "email" as keyof TrainingApplication,
      title: "Email",
    },
    {
      key: "primaryGoal" as keyof TrainingApplication,
      title: "Goal",
    },
    {
      key: "preferredProgram" as keyof TrainingApplication,
      title: "Program",
      render: (value: TrainingApplication[keyof TrainingApplication]) => (
        <span className="text-sm">
          {value === 'home' ? 'Home Training' : 
           value === 'gym' ? 'Gym Training' : 
           value === 'sportSpecific' ? 'Sport-Specific' : 'Not Selected'}
        </span>
      ),
    },
    {
      key: "status" as keyof TrainingApplication,
      title: "Status",
      render: (value: TrainingApplication[keyof TrainingApplication]) => (
        <StatusBadge variant={value === 'PENDING' ? 'default' : value === 'APPROVED' ? 'success' : value === 'REJECTED' ? 'destructive' : 'warning'}>
          {value as string}
        </StatusBadge>
      ),
    },
    {
      key: "assignedTrainer" as keyof TrainingApplication,
      title: "Trainer",
      render: (value: TrainingApplication[keyof TrainingApplication]) => (
        <span className="text-sm text-muted-foreground">
          {value ? String(value) : "Not Assigned"}
        </span>
      ),
    },
    {
      key: "createdAt" as keyof TrainingApplication,
      title: "Applied",
      render: (value: TrainingApplication[keyof TrainingApplication]) => (
        (value as Date).toLocaleDateString()
      ),
    },
  ];

  const nutritionColumns: DataTableColumn<NutritionApplication>[] = [
    {
      key: "fullName" as keyof NutritionApplication,
      title: "Full Name",
    },
    {
      key: "email" as keyof NutritionApplication,
      title: "Email",
    },
    {
      key: "primaryGoal" as keyof NutritionApplication,
      title: "Goal",
      render: (value: NutritionApplication[keyof NutritionApplication]) => (
        <span className="text-sm capitalize">
          {String(value).replace(/-/g, ' ')}
        </span>
      ),
    },
    {
      key: "selectedPackage" as keyof NutritionApplication,
      title: "Package",
      render: (value: NutritionApplication[keyof NutritionApplication]) => (
        <span className="text-sm capitalize">
          {value ? String(value) : "Not Selected"}
        </span>
      ),
    },
    {
      key: "status" as keyof NutritionApplication,
      title: "Status",
      render: (value: NutritionApplication[keyof NutritionApplication]) => (
        <StatusBadge variant={value === 'PENDING' ? 'default' : value === 'APPROVED' ? 'success' : value === 'REJECTED' ? 'destructive' : 'warning'}>
          {value as string}
        </StatusBadge>
      ),
    },
    {
      key: "assignedNutritionist" as keyof NutritionApplication,
      title: "Nutritionist",
      render: (value: NutritionApplication[keyof NutritionApplication]) => (
        <span className="text-sm text-muted-foreground">
          {value ? String(value) : "Not Assigned"}
        </span>
      ),
    },
    {
      key: "createdAt" as keyof NutritionApplication,
      title: "Applied",
      render: (value: NutritionApplication[keyof NutritionApplication]) => (
        (value as Date).toLocaleDateString()
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Manage psychology, training, and nutrition program applications"
        actions={
          <Button onClick={() => router.refresh()}>
            Refresh
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Psychology</p>
              <p className="text-2xl font-bold">{psychologyData?.pagination?.total ?? 0}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Psychology Pending</p>
              <p className="text-2xl font-bold text-orange-500">{psychologyData?.applications?.filter((app: PsychologyApplication) => app.status === 'PENDING').length ?? 0}</p>
            </div>
            <Brain className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Training</p>
              <p className="text-2xl font-bold">{trainingData?.pagination?.total ?? 0}</p>
            </div>
            <Dumbbell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Training Pending</p>
              <p className="text-2xl font-bold text-orange-500">{trainingData?.applications?.filter((app: TrainingApplication) => app.status === 'PENDING').length ?? 0}</p>
            </div>
            <Dumbbell className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Nutrition</p>
              <p className="text-2xl font-bold">{nutritionData?.pagination?.total ?? 0}</p>
            </div>
            <Apple className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nutrition Pending</p>
              <p className="text-2xl font-bold text-orange-500">{nutritionData?.applications?.filter((app: NutritionApplication) => app.status === 'PENDING').length ?? 0}</p>
            </div>
            <Apple className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Psychology Applications Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Psychology Applications ({psychologyData?.pagination?.total ?? 0})
        </h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchFilter
            value={psychologySearch}
            onChange={setPsychologySearch}
            placeholder="Search psychology applications..."
            className="w-full md:w-80"
          />
          <select
            value={psychologyStatus || ''}
            onChange={(e) => setPsychologyStatus(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        
        <DataTable
          data={psychologyApplications}
          columns={psychologyColumns}
          loading={psychologyLoading}
          pagination={{
            page: psychologyPage,
            pageSize: 20,
            total: psychologyData?.pagination?.total ?? 0,
            onPageChange: setPsychologyPage,
          }}
          onRowClick={(app) => router.push(`/admin/applications/psychology/${app.id}`)}
          emptyState={
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No psychology applications found</p>
            </div>
          }
        />
      </div>

      {/* Training Applications Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-blue-500" />
          Training Applications ({trainingData?.pagination?.total ?? 0})
        </h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchFilter
            value={trainingSearch}
            onChange={setTrainingSearch}
            placeholder="Search training applications..."
            className="w-full md:w-80"
          />
          <select
            value={trainingStatus || ''}
            onChange={(e) => setTrainingStatus(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        
        <DataTable
          data={trainingApplications}
          columns={trainingColumns}
          loading={trainingLoading}
          pagination={{
            page: trainingPage,
            pageSize: 20,
            total: trainingData?.pagination?.total ?? 0,
            onPageChange: setTrainingPage,
          }}
          onRowClick={(app) => router.push(`/admin/applications/training/${app.id}`)}
          emptyState={
            <div className="text-center py-8">
              <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No training applications found</p>
            </div>
          }
        />
      </div>

      {/* Nutrition Applications Section */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Apple className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold">Nutrition Applications</h2>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchFilter
              value={nutritionSearch}
              onChange={setNutritionSearch}
              placeholder="Search by name, email, or goal..."
            />
          </div>
          <select
            value={nutritionStatus || ""}
            onChange={(e) => setNutritionStatus(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <DataTable
          data={nutritionApplications}
          columns={nutritionColumns}
          loading={nutritionLoading}
          pagination={{
            page: nutritionPage,
            pageSize: 20,
            total: nutritionData?.pagination?.total ?? 0,
            onPageChange: setNutritionPage,
          }}
          onRowClick={(app) => router.push(`/admin/applications/nutrition/${app.id}`)}
          emptyState={
            <div className="text-center py-8">
              <Apple className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No nutrition applications found</p>
            </div>
          }
        />
      </div>
    </div>
  );
}