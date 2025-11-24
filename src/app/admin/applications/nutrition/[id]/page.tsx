"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { ArrowLeft, Apple, Save } from "lucide-react";
import { useSnackbar } from "@/components/shared/snackbar-context";

export default function NutritionApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);

  // Await the params promise
  const paramsValue = use(params);
  const { id } = paramsValue;

  const { data: application, isLoading } = api.admin.applications.getNutritionApplicationById.useQuery({
    id: id,
  });

  const updateMutation = api.admin.applications.updateNutritionApplication.useMutation({
    onSuccess: () => {
      showSnackbar("Application updated successfully", "success");
      setIsEditing(false);
      router.refresh();
    },
    onError: (error) => {
      showSnackbar(`Error: ${error.message}`, "error");
    },
  });

  const [formData, setFormData] = useState({
    status: "PENDING",
    notes: "",
    assignedNutritionist: "",
  });

  // Update formData when application loads
  useEffect(() => {
    if (application) {
      setFormData({
        status: application.status,
        notes: application.notes || "",
        assignedNutritionist: application.assignedNutritionist || "",
      });
    }
  }, [application]);

  const handleUpdate = () => {
    updateMutation.mutate({
      id: id,
      status: formData.status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED",
      notes: formData.notes || undefined,
      assignedNutritionist: formData.assignedNutritionist || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Apple className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Application not found</p>
          <Button onClick={() => router.push("/admin/applications")} className="mt-4">
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/applications")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Apple className="w-8 h-8 text-green-500" />
            <div>
              <h1 className="text-2xl font-bold">Nutrition Application</h1>
              <p className="text-sm text-muted-foreground">ID: {application.id}</p>
            </div>
          </div>
        </div>
        <StatusBadge 
          variant={
            application.status === 'PENDING' ? 'default' : 
            application.status === 'APPROVED' ? 'success' : 
            application.status === 'REJECTED' ? 'destructive' : 
            'warning'
          }
        >
          {application.status}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{application.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Gender</Label>
                <p className="font-medium capitalize">{application.gender}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Age</Label>
                <p className="font-medium">{application.age} years</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{application.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{application.phone || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="font-medium">{application.city}, {application.country}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Selected Package</Label>
                <p className="font-medium capitalize">{application.selectedPackage || "Not selected"}</p>
              </div>
            </div>
          </Card>

          {/* Body Measurements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Body Measurements</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Current Weight</Label>
                <p className="font-medium">{application.currentWeight} kg</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Height</Label>
                <p className="font-medium">{application.currentHeight} cm</p>
              </div>
              {application.targetWeight && (
                <div>
                  <Label className="text-muted-foreground">Target Weight</Label>
                  <p className="font-medium">{application.targetWeight} kg</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Activity Level</Label>
                <p className="font-medium capitalize">{application.activityLevel.replace(/-/g, ' ')}</p>
              </div>
            </div>
          </Card>

          {/* Nutrition Habits */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Nutrition Habits</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Current Eating Habits</Label>
                <p className="font-medium whitespace-pre-wrap">{application.currentEatingHabits}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Meals Per Day</Label>
                  <p className="font-medium">{application.mealsPerDay}</p>
                </div>
                {application.waterIntake && (
                  <div>
                    <Label className="text-muted-foreground">Water Intake</Label>
                    <p className="font-medium">{application.waterIntake}</p>
                  </div>
                )}
              </div>
              {application.dietaryRestrictions && (
                <div>
                  <Label className="text-muted-foreground">Dietary Restrictions</Label>
                  <p className="font-medium">{application.dietaryRestrictions}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Health Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Health Information</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Injuries</Label>
                <p className="font-medium">{application.injuries}</p>
              </div>
              {application.allergies && (
                <div>
                  <Label className="text-muted-foreground">Allergies</Label>
                  <p className="font-medium">{application.allergies}</p>
                </div>
              )}
              {application.medicalConditions && (
                <div>
                  <Label className="text-muted-foreground">Medical Conditions</Label>
                  <p className="font-medium">{application.medicalConditions}</p>
                </div>
              )}
              {application.medications && (
                <div>
                  <Label className="text-muted-foreground">Medications</Label>
                  <p className="font-medium">{application.medications}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Goals */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Nutrition Goals</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Primary Goal</Label>
                <p className="font-medium capitalize">{application.primaryGoal.replace(/-/g, ' ')}</p>
              </div>
              {application.timeframe && (
                <div>
                  <Label className="text-muted-foreground">Timeframe</Label>
                  <p className="font-medium">{application.timeframe}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar - Management */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Application Management</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                >
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <Label htmlFor="assignedNutritionist">Assigned Nutritionist</Label>
                <Input
                  id="assignedNutritionist"
                  value={formData.assignedNutritionist}
                  onChange={(e) => setFormData({ ...formData, assignedNutritionist: e.target.value })}
                  placeholder="Enter nutritionist name"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add internal notes..."
                  rows={4}
                  disabled={!isEditing}
                />
              </div>

              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Application
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Metadata</h2>
            <div className="space-y-2 text-sm">
              <div>
                <Label className="text-muted-foreground">Submitted</Label>
                <p className="font-medium">{new Date(application.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Updated</Label>
                <p className="font-medium">{new Date(application.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
