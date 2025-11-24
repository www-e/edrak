'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Target, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  // Health Data
  injuries: string;
  medications: string;
  allergies: string;
  medicalConditions: string;

  // Nutrition Data
  currentWeight: string;
  currentHeight: string;
  targetWeight: string;
  dietaryRestrictions: string;
  currentEatingHabits: string;
  mealsPerDay: string;
  waterIntake: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active";

  // Goals
  primaryGoal: "weight-loss" | "muscle-gain" | "performance" | "health-improvement" | "body-recomposition";
  timeframe: string;
  selectedPackage: "silver" | "gold" | "diamond";
}

const initialFormData: FormData = {
  fullName: '',
  gender: 'male',
  age: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  injuries: '',
  medications: '',
  allergies: '',
  medicalConditions: '',
  currentWeight: '',
  currentHeight: '',
  targetWeight: '',
  dietaryRestrictions: '',
  currentEatingHabits: '',
  mealsPerDay: '',
  waterIntake: '',
  activityLevel: 'moderate',
  primaryGoal: 'weight-loss',
  timeframe: '',
  selectedPackage: 'gold'
};

export default function NutritionForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createNutritionApplication } = api.public.applications.createNutritionApplication.useMutation();
  const { showSnackbar } = useSnackbar();

  const steps = [
    { icon: User, title: 'Personal Data', description: 'Basic information about you' },
    { icon: Heart, title: 'Health & Nutrition', description: 'Your health and eating habits' },
    { icon: Target, title: 'Goals', description: 'Your nutrition objectives' },
    { icon: Package, title: 'Package Selection', description: 'Choose your plan' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as FormData[keyof FormData] }));
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
      await createNutritionApplication(formData);

      showSnackbar('Nutrition program request submitted successfully! We will contact you soon.', 'success');

      // Reset form after successful submission
      setFormData(initialFormData);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting nutrition application:', error);
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
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Health & Nutrition Information</h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currentWeight">Current Weight (kg) *</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={formData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    placeholder="Enter weight in kg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentHeight">Height (cm) *</Label>
                  <Input
                    id="currentHeight"
                    type="number"
                    value={formData.currentHeight}
                    onChange={(e) => handleInputChange('currentHeight', e.target.value)}
                    placeholder="Enter height in cm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                    placeholder="Your target weight"
                  />
                </div>
                <div>
                  <Label htmlFor="mealsPerDay">Meals Per Day *</Label>
                  <Input
                    id="mealsPerDay"
                    value={formData.mealsPerDay}
                    onChange={(e) => handleInputChange('mealsPerDay', e.target.value)}
                    placeholder="e.g., 3 meals"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="waterIntake">Daily Water Intake</Label>
                  <Input
                    id="waterIntake"
                    value={formData.waterIntake}
                    onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                    placeholder="e.g., 2 liters"
                  />
                </div>
                <div>
                  <Label htmlFor="activityLevel">Activity Level *</Label>
                  <select
                    id="activityLevel"
                    value={formData.activityLevel}
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                    <option value="active">Active (exercise 6-7 days/week)</option>
                    <option value="very-active">Very Active (intense exercise daily)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="currentEatingHabits">Current Eating Habits *</Label>
                <Textarea
                  id="currentEatingHabits"
                  value={formData.currentEatingHabits}
                  onChange={(e) => handleInputChange('currentEatingHabits', e.target.value)}
                  placeholder="Describe your typical daily meals and eating patterns"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions or Preferences</Label>
                <Textarea
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  placeholder="e.g., vegetarian, vegan, gluten-free, lactose intolerant, etc."
                />
              </div>

              <div>
                <Label htmlFor="allergies">Food Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any food allergies or write 'None'"
                />
              </div>

              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  placeholder="Any medical conditions we should know about (diabetes, hypertension, etc.) or write 'None'"
                />
              </div>

              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="List any medications you're taking or write 'None'"
                />
              </div>

              <div>
                <Label htmlFor="injuries">Injuries or Physical Limitations *</Label>
                <Textarea
                  id="injuries"
                  value={formData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  placeholder="Any injuries or physical limitations or write 'No'"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Nutrition Goals</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="primaryGoal">Primary Goal *</Label>
                <select
                  id="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select primary goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="performance">Athletic Performance</option>
                  <option value="health-improvement">Health Improvement</option>
                  <option value="body-recomposition">Body Recomposition</option>
                </select>
              </div>

              <div>
                <Label htmlFor="timeframe">Expected Timeframe to Achieve Goal</Label>
                <Input
                  id="timeframe"
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  placeholder="e.g., 3 months, 6 months"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Choose Your Package</h3>
            <div>
              <Label htmlFor="selectedPackage">Select Package *</Label>
              <select
                id="selectedPackage"
                value={formData.selectedPackage}
                onChange={(e) => handleInputChange('selectedPackage', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="silver">🥈 Silver - 495 EGP/month</option>
                <option value="gold">🥇 Gold - 995 EGP/month (Most Popular)</option>
                <option value="diamond">💎 Diamond - 1495 EGP/month</option>
              </select>
              <p className="text-sm text-muted-foreground mt-2">
                You selected the <strong className="capitalize">{formData.selectedPackage}</strong> package.
                Our team will contact you with payment details and next steps.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-green-900 mb-2">📋 What Happens Next?</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Our nutrition team will review your application within 24-48 hours</li>
                <li>✓ We will contact you to discuss your personalized nutrition plan</li>
                <li>✓ Payment details and program start date will be confirmed</li>
                <li>✓ You will receive your customized meal plan and ongoing support</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="form" className="py-24 bg-white">
      <div className="container max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Nutrition Program Application
          </h2>
          <p className="text-xl text-muted-foreground">
            Fill out this form to get your personalized nutrition plan
          </p>
        </motion.div>

        <Card className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  index <= currentStep
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
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
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
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
