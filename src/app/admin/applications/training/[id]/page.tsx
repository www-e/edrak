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
import { ArrowLeft, Dumbbell, Save, Image as ImageIcon } from "lucide-react";
import { useSnackbar } from "@/components/shared/snackbar-context";
import Image from "next/image";

export default function TrainingApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);

  // Await the params promise
  const paramsValue = use(params);
  const { id } = paramsValue;

  const { data: application, isLoading } = api.admin.applications.getTrainingApplicationById.useQuery({
    id: id,
  });

  const updateMutation = api.admin.applications.updateTrainingApplication.useMutation({
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
    assignedTrainer: "",
    preferredProgram: "",
  });

  // Update formData when application loads
  useEffect(() => {
    if (application) {
      setFormData({
        status: application.status,
        notes: application.notes || "",
        assignedTrainer: application.assignedTrainer || "",
        preferredProgram: application.preferredProgram || "",
      });
    }
  }, [application]);

  const handleUpdate = () => {
    updateMutation.mutate({
      id: id,
      status: formData.status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED",
      notes: formData.notes || undefined,
      assignedTrainer: formData.assignedTrainer || undefined,
      preferredProgram: formData.preferredProgram as "home" | "gym" | "sportSpecific" | undefined,
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
          <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Application not found</p>
          <Button onClick={() => router.push("/admin/applications")} className="mt-4">
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/applications")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">Training Application</h1>
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
                <Label className="text-muted-foreground">Previous Trainer</Label>
                <p className="font-medium capitalize">{application.previousTrainer}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Selected Package</Label>
                <p className="font-medium capitalize">{application.selectedPackage || "Not selected"}</p>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-muted-foreground">Injuries</Label>
              <p className="font-medium">{application.injuries}</p>
            </div>
          </Card>

          {/* Training Background */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Training Background</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Training Age</Label>
                <p className="font-medium">{application.trainingAge}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Weekly Training Days</Label>
                <p className="font-medium">{application.weeklyDays}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Daily Exercises</Label>
                <p className="font-medium">{application.dailyExercises}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Workout Duration</Label>
                <p className="font-medium">{application.workoutDuration}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Exercise Types</Label>
                <p className="font-medium capitalize">{application.exerciseTypes}</p>
              </div>
              {application.primarySport && (
                <div>
                  <Label className="text-muted-foreground">Primary Sport</Label>
                  <p className="font-medium">{application.primarySport}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Body Measurements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Body Measurements</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Weight</Label>
                <p className="font-medium">{application.weight} kg</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Height</Label>
                <p className="font-medium">{application.height} cm</p>
              </div>
              {application.chestCircumference && (
                <div>
                  <Label className="text-muted-foreground">Chest</Label>
                  <p className="font-medium">{application.chestCircumference} cm</p>
                </div>
              )}
              {application.waistCircumference && (
                <div>
                  <Label className="text-muted-foreground">Waist</Label>
                  <p className="font-medium">{application.waistCircumference} cm</p>
                </div>
              )}
              {application.hipCircumference && (
                <div>
                  <Label className="text-muted-foreground">Hip</Label>
                  <p className="font-medium">{application.hipCircumference} cm</p>
                </div>
              )}
              {application.armCircumference && (
                <div>
                  <Label className="text-muted-foreground">Arm</Label>
                  <p className="font-medium">{application.armCircumference} cm</p>
                </div>
              )}
              {application.thighCircumference && (
                <div>
                  <Label className="text-muted-foreground">Thigh</Label>
                  <p className="font-medium">{application.thighCircumference} cm</p>
                </div>
              )}
            </div>
          </Card>

          {/* Fitness Tests */}
          {(application.squatTest || application.pushupTest || application.enduranceTest || application.flexibilityTest) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fitness Tests</h2>
              <div className="grid grid-cols-2 gap-4">
                {application.squatTest && (
                  <div>
                    <Label className="text-muted-foreground">Squat Test</Label>
                    <p className="font-medium">{application.squatTest}</p>
                  </div>
                )}
                {application.pushupTest && (
                  <div>
                    <Label className="text-muted-foreground">Push-up Test</Label>
                    <p className="font-medium">{application.pushupTest}</p>
                  </div>
                )}
                {application.enduranceTest && (
                  <div>
                    <Label className="text-muted-foreground">Endurance Test</Label>
                    <p className="font-medium">{application.enduranceTest}</p>
                  </div>
                )}
                {application.flexibilityTest && (
                  <div>
                    <Label className="text-muted-foreground">Flexibility Test</Label>
                    <p className="font-medium">{application.flexibilityTest}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Body Photos */}
          {(application.frontPhoto || application.sidePhoto || application.backPhoto) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Body Photos</h2>
              <div className="grid grid-cols-3 gap-4">
                {application.frontPhoto ? (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Front</Label>
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={application.frontPhoto}
                        alt="Front photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {application.sidePhoto ? (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Side</Label>
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={application.sidePhoto}
                        alt="Side photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {application.backPhoto ? (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Back</Label>
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={application.backPhoto}
                        alt="Back photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Goals */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Training Goals</h2>
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
              {application.nutritionPlan && (
                <div>
                  <Label className="text-muted-foreground">Nutrition Plan Preference</Label>
                  <p className="font-medium">{application.nutritionPlan}</p>
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
                <Label htmlFor="assignedTrainer">Assigned Trainer</Label>
                <Input
                  id="assignedTrainer"
                  value={formData.assignedTrainer}
                  onChange={(e) => setFormData({ ...formData, assignedTrainer: e.target.value })}
                  placeholder="Enter trainer name"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="preferredProgram">Preferred Program</Label>
                <select
                  id="preferredProgram"
                  value={formData.preferredProgram}
                  onChange={(e) => setFormData({ ...formData, preferredProgram: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                >
                  <option value="">Not Selected</option>
                  <option value="home">Home Training</option>
                  <option value="gym">Gym Training</option>
                  <option value="sportSpecific">Sport-Specific</option>
                </select>
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
