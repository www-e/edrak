'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Dumbbell, Camera, Target, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { Select } from '@/components/ui/select'; // Not used, keeping for future reference
import { Card } from '@/components/ui/card';
import { api } from '@/trpc/react';
import { useSnackbar } from '@/components/shared/snackbar-context';

interface FormData {
  // Personal Data
  fullName: string;
  gender: "male" | "female";
  age: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  previousTrainer: "yes" | "no";
  injuries: string;

  // Training Data
  trainingAge: string;
  weeklyDays: string;
  dailyExercises: string;
  workoutDuration: string;
  exerciseTypes: "cardio" | "resistance" | "flexibility" | "mixed";
  primarySport: string;

  // Body Measurements
  weight: string;
  height: string;
  chestCircumference: string;
  waistCircumference: string;
  hipCircumference: string;
  armCircumference: string;
  thighCircumference: string;

  // Fitness Tests
  squatTest: string;
  pushupTest: string;
  enduranceTest: string;
  flexibilityTest: string;

  // Body Photos
  frontPhoto: File | null;
  sidePhoto: File | null;
  backPhoto: File | null;

  // Goals
  primaryGoal: "muscle-gain" | "weight-loss" | "performance" | "rehabilitation" | "general-fitness";
  timeframe: string;
  nutritionPlan: string;
  psychologicalSupport: string;
}

const initialFormData: FormData = {
  fullName: '',
  gender: 'male',
  age: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  previousTrainer: 'yes',
  injuries: '',
  trainingAge: '',
  weeklyDays: '',
  dailyExercises: '',
  workoutDuration: '',
  exerciseTypes: 'cardio',
  primarySport: '',
  weight: '',
  height: '',
  chestCircumference: '',
  waistCircumference: '',
  hipCircumference: '',
  armCircumference: '',
  thighCircumference: '',
  squatTest: '',
  pushupTest: '',
  enduranceTest: '',
  flexibilityTest: '',
  frontPhoto: null,
  sidePhoto: null,
  backPhoto: null,
  primaryGoal: 'muscle-gain',
  timeframe: '',
  nutritionPlan: '',
  psychologicalSupport: ''
};

export default function SubscriptionForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createTrainingApplication } = api.public.applications.createTrainingApplication.useMutation();
  const { showSnackbar } = useSnackbar();

  const steps = [
    { icon: User, title: 'Personal Data', description: 'Basic information about you' },
    { icon: Dumbbell, title: 'Training Data', description: 'Your fitness background' },
    { icon: Target, title: 'Body Measurements', description: 'Physical assessments' },
    { icon: Camera, title: 'Body Photos', description: 'Visual documentation (optional)' },
    { icon: FileText, title: 'Goals & Preferences', description: 'Your objectives' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as FormData[keyof FormData] }));
  };

  const handleFileChange = (field: 'frontPhoto' | 'sidePhoto' | 'backPhoto', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // For file uploads, we'd need to implement a separate upload process
      // For now, we'll submit the form without file data
      await createTrainingApplication({
        ...formData,
        frontPhoto: undefined, // File upload would need special handling
        sidePhoto: undefined,
        backPhoto: undefined,
      });

      showSnackbar('Training program request submitted successfully! We will contact you soon.', 'success');

      // Reset form after successful submission
      setFormData(initialFormData);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting training application:', error);
      showSnackbar('Error submitting application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter your age"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter your country"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="previousTrainer">Have you trained with a personal trainer before? *</Label>
                <select
                  id="previousTrainer"
                  value={formData.previousTrainer}
                  onChange={(e) => handleInputChange('previousTrainer', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="injuries">Do you have any injuries or health conditions to consider? *</Label>
              <Textarea
                id="injuries"
                value={formData.injuries}
                onChange={(e) => handleInputChange('injuries', e.target.value)}
                placeholder="Please describe any injuries or health conditions (or write 'No' if none)"
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Training Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="trainingAge">Training Age (Duration of sports practice) *</Label>
                <Input
                  id="trainingAge"
                  value={formData.trainingAge}
                  onChange={(e) => handleInputChange('trainingAge', e.target.value)}
                  placeholder="e.g., 2 years"
                  required
                />
              </div>
              <div>
                <Label htmlFor="weeklyDays">Number of training days per week *</Label>
                <Input
                  id="weeklyDays"
                  type="number"
                  value={formData.weeklyDays}
                  onChange={(e) => handleInputChange('weeklyDays', e.target.value)}
                  placeholder="e.g., 3"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dailyExercises">Number of exercises per day *</Label>
                <Input
                  id="dailyExercises"
                  value={formData.dailyExercises}
                  onChange={(e) => handleInputChange('dailyExercises', e.target.value)}
                  placeholder="e.g., 5-7 exercises"
                  required
                />
              </div>
              <div>
                <Label htmlFor="workoutDuration">Average workout duration (minutes) *</Label>
                <Input
                  id="workoutDuration"
                  type="number"
                  value={formData.workoutDuration}
                  onChange={(e) => handleInputChange('workoutDuration', e.target.value)}
                  placeholder="e.g., 60"
                  required
                />
              </div>
              <div>
                <Label htmlFor="exerciseTypes">Types of primary exercises *</Label>
                <select
                  id="exerciseTypes"
                  value={formData.exerciseTypes}
                  onChange={(e) => handleInputChange('exerciseTypes', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select exercise type</option>
                  <option value="cardio">Cardio</option>
                  <option value="resistance">Resistance</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <Label htmlFor="primarySport">Primary sport (if any)</Label>
                <Input
                  id="primarySport"
                  value={formData.primarySport}
                  onChange={(e) => handleInputChange('primarySport', e.target.value)}
                  placeholder="e.g., swimming, MMA, football..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Body Measurements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="weight">Current Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter weight in kg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Enter height in cm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="chestCircumference">Chest Circumference (cm)</Label>
                <Input
                  id="chestCircumference"
                  type="number"
                  value={formData.chestCircumference}
                  onChange={(e) => handleInputChange('chestCircumference', e.target.value)}
                  placeholder="Chest measurement"
                />
              </div>
              <div>
                <Label htmlFor="waistCircumference">Waist Circumference (cm)</Label>
                <Input
                  id="waistCircumference"
                  type="number"
                  value={formData.waistCircumference}
                  onChange={(e) => handleInputChange('waistCircumference', e.target.value)}
                  placeholder="Waist measurement"
                />
              </div>
              <div>
                <Label htmlFor="hipCircumference">Hip Circumference (cm)</Label>
                <Input
                  id="hipCircumference"
                  type="number"
                  value={formData.hipCircumference}
                  onChange={(e) => handleInputChange('hipCircumference', e.target.value)}
                  placeholder="Hip measurement"
                />
              </div>
              <div>
                <Label htmlFor="armCircumference">Arm Circumference (cm)</Label>
                <Input
                  id="armCircumference"
                  type="number"
                  value={formData.armCircumference}
                  onChange={(e) => handleInputChange('armCircumference', e.target.value)}
                  placeholder="Arm measurement"
                />
              </div>
              <div>
                <Label htmlFor="thighCircumference">Thigh Circumference (cm)</Label>
                <Input
                  id="thighCircumference"
                  type="number"
                  value={formData.thighCircumference}
                  onChange={(e) => handleInputChange('thighCircumference', e.target.value)}
                  placeholder="Thigh measurement"
                />
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4">🧪 Initial Fitness Tests (Optional)</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="squatTest">Squat Test (repetitions per minute)</Label>
                  <Input
                    id="squatTest"
                    type="number"
                    value={formData.squatTest}
                    onChange={(e) => handleInputChange('squatTest', e.target.value)}
                    placeholder="Number of squats in 1 minute"
                  />
                </div>
                <div>
                  <Label htmlFor="pushupTest">Push-up Test (repetitions per minute)</Label>
                  <Input
                    id="pushupTest"
                    type="number"
                    value={formData.pushupTest}
                    onChange={(e) => handleInputChange('pushupTest', e.target.value)}
                    placeholder="Number of push-ups in 1 minute"
                  />
                </div>
                <div>
                  <Label htmlFor="enduranceTest">Endurance Test (1km run time or 3 minutes steady)</Label>
                  <Input
                    id="enduranceTest"
                    value={formData.enduranceTest}
                    onChange={(e) => handleInputChange('enduranceTest', e.target.value)}
                    placeholder="Running time for 1km or 3 min steady"
                  />
                </div>
                <div>
                  <Label htmlFor="flexibilityTest">Flexibility Test (reaching the ground from standing)</Label>
                  <Input
                    id="flexibilityTest"
                    value={formData.flexibilityTest}
                    onChange={(e) => handleInputChange('flexibilityTest', e.target.value)}
                    placeholder="Distance to ground from standing"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Body Photos (Optional but Recommended)</h3>
            <p className="text-muted-foreground mb-6">
              Please send 3 clear body photos for assessment: Front, Side, and Back. 
              Example: Front photo in mirror with sportswear showing body clearly, without editing or filters.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="frontPhoto">Front Photo</Label>
                <input
                  id="frontPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('frontPhoto', e.target.files?.[0] || null)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="sidePhoto">Side Photo</Label>
                <input
                  id="sidePhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('sidePhoto', e.target.files?.[0] || null)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="backPhoto">Back Photo</Label>
                <input
                  id="backPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('backPhoto', e.target.files?.[0] || null)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Subscription Goals</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="primaryGoal">Primary goal from the program *</Label>
                <select
                  id="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select primary goal</option>
                  <option value="muscle-gain">Increase muscle mass</option>
                  <option value="weight-loss">Weight loss</option>
                  <option value="performance">Improve performance</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="general-fitness">General fitness</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="timeframe">Expected timeframe to achieve goal</Label>
                <Input
                  id="timeframe"
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  placeholder="e.g., 3 months, 6 months"
                />
              </div>

              <div>
                <Label htmlFor="nutritionPlan">Do you want to combine the program with a nutrition plan or psychological support?</Label>
                <Textarea
                  id="nutritionPlan"
                  value={formData.nutritionPlan}
                  onChange={(e) => handleInputChange('nutritionPlan', e.target.value)}
                  placeholder="Please specify your preferences"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Required Data Form
          </h2>
          <p className="text-xl text-muted-foreground">
            Please fill out this comprehensive form to help us create the perfect training program for you
          </p>
        </motion.div>

        <Card className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-green-500 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}