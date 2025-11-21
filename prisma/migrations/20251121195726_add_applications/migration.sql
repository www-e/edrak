-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "PsychologyApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "previousTrainer" TEXT NOT NULL,
    "previousPsychologist" TEXT NOT NULL,
    "medications" TEXT NOT NULL,
    "injuries" TEXT NOT NULL,
    "primarySport" TEXT NOT NULL,
    "trainingAge" TEXT NOT NULL,
    "weeklyDays" TEXT NOT NULL,
    "workoutDuration" TEXT NOT NULL,
    "preparingForCompetition" TEXT NOT NULL,
    "competitionDate" TEXT,
    "affectingPerformance" TEXT NOT NULL,
    "previousBreakdown" TEXT NOT NULL,
    "generalMentalState" TEXT NOT NULL,
    "sleepDifficulties" TEXT NOT NULL,
    "anxietyEpisodes" TEXT NOT NULL,
    "primaryGoal" TEXT NOT NULL,
    "sessionPreference" TEXT NOT NULL,
    "combineWithTraining" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "assignedPsychologist" TEXT,
    "firstSessionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PsychologyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "previousTrainer" TEXT NOT NULL,
    "injuries" TEXT NOT NULL,
    "trainingAge" TEXT NOT NULL,
    "weeklyDays" TEXT NOT NULL,
    "dailyExercises" TEXT NOT NULL,
    "workoutDuration" TEXT NOT NULL,
    "exerciseTypes" TEXT NOT NULL,
    "primarySport" TEXT,
    "weight" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "chestCircumference" TEXT,
    "waistCircumference" TEXT,
    "hipCircumference" TEXT,
    "armCircumference" TEXT,
    "thighCircumference" TEXT,
    "squatTest" TEXT,
    "pushupTest" TEXT,
    "enduranceTest" TEXT,
    "flexibilityTest" TEXT,
    "frontPhoto" TEXT,
    "sidePhoto" TEXT,
    "backPhoto" TEXT,
    "primaryGoal" TEXT NOT NULL,
    "timeframe" TEXT,
    "nutritionPlan" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "assignedTrainer" TEXT,
    "preferredProgram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PsychologyApplication_status_idx" ON "PsychologyApplication"("status");

-- CreateIndex
CREATE INDEX "PsychologyApplication_email_idx" ON "PsychologyApplication"("email");

-- CreateIndex
CREATE INDEX "PsychologyApplication_createdAt_idx" ON "PsychologyApplication"("createdAt");

-- CreateIndex
CREATE INDEX "PsychologyApplication_primarySport_idx" ON "PsychologyApplication"("primarySport");

-- CreateIndex
CREATE INDEX "TrainingApplication_status_idx" ON "TrainingApplication"("status");

-- CreateIndex
CREATE INDEX "TrainingApplication_email_idx" ON "TrainingApplication"("email");

-- CreateIndex
CREATE INDEX "TrainingApplication_createdAt_idx" ON "TrainingApplication"("createdAt");

-- CreateIndex
CREATE INDEX "TrainingApplication_primaryGoal_idx" ON "TrainingApplication"("primaryGoal");

-- CreateIndex
CREATE INDEX "TrainingApplication_preferredProgram_idx" ON "TrainingApplication"("preferredProgram");
