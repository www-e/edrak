'use client';

import { User, Heart, Target, Package } from 'lucide-react';
import { api } from '@/trpc/react';
import GenericForm from '@/components/forms/GenericForm';

// Define the form data type
type FormData = {
  [key: string]: string | File | null;
};

const initialFormData: FormData = {
  // Personal Data
  fullName: '',
  gender: 'male',
  age: '',
  email: '',
  phone: '',
  country: '',
  city: '',

  // Health Data
  injuries: '',
  medications: '',
  allergies: '',
  medicalConditions: '',

  // Nutrition Data
  currentWeight: '',
  currentHeight: '',
  targetWeight: '',
  dietaryRestrictions: '',
  currentEatingHabits: '',
  mealsPerDay: '',
  waterIntake: '',
  activityLevel: 'moderate',

  // Goals
  primaryGoal: 'weight-loss',
  timeframe: '',
  selectedPackage: 'gold'
};

export default function NutritionForm() {
  const createNutritionApplicationMutation = api.student.services.createNutritionApplication.useMutation();

  const steps = [
    {
      title: 'Personal Information',
      icon: User,
      fields: [
        { name: 'fullName', label: 'Full Name *', inputType: 'text', placeholder: 'Enter your full name', required: true },
        {
          name: 'gender',
          label: 'Gender *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select gender' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ],
          required: true
        },
        { name: 'age', label: 'Age (years) *', inputType: 'number', placeholder: 'Enter your age', required: true },
        { name: 'email', label: 'Email Address *', inputType: 'email', placeholder: 'Enter your email', required: true },
        { name: 'phone', label: 'Phone Number (Optional)', inputType: 'text', placeholder: 'Enter your phone number' },
        { name: 'country', label: 'Country *', inputType: 'text', placeholder: 'Enter your country', required: true },
        { name: 'city', label: 'City *', inputType: 'text', placeholder: 'Enter your city', required: true },
      ]
    },
    {
      title: 'Health & Nutrition Information',
      icon: Heart,
      fields: [
        { name: 'currentWeight', label: 'Current Weight (kg) *', inputType: 'number', placeholder: 'Enter weight in kg', required: true },
        { name: 'currentHeight', label: 'Height (cm) *', inputType: 'number', placeholder: 'Enter height in cm', required: true },
        { name: 'targetWeight', label: 'Target Weight (kg)', inputType: 'number', placeholder: 'Your target weight' },
        { name: 'mealsPerDay', label: 'Meals Per Day *', inputType: 'text', placeholder: 'e.g., 3 meals', required: true },
        { name: 'waterIntake', label: 'Daily Water Intake', inputType: 'text', placeholder: 'e.g., 2 liters' },
        {
          name: 'activityLevel',
          label: 'Activity Level *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select activity level' },
            { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
            { value: 'light', label: 'Light (exercise 1-3 days/week)' },
            { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
            { value: 'active', label: 'Active (exercise 6-7 days/week)' },
            { value: 'very-active', label: 'Very Active (intense exercise daily)' }
          ],
          required: true
        },
        { name: 'currentEatingHabits', label: 'Current Eating Habits *', inputType: 'textarea', placeholder: 'Describe your typical daily meals and eating patterns', required: true },
        { name: 'dietaryRestrictions', label: 'Dietary Restrictions or Preferences', inputType: 'textarea', placeholder: 'e.g., vegetarian, vegan, gluten-free, lactose intolerant, etc.' },
        { name: 'allergies', label: 'Food Allergies', inputType: 'textarea', placeholder: 'List any food allergies or write \'None\'' },
        { name: 'medicalConditions', label: 'Medical Conditions', inputType: 'textarea', placeholder: 'Any medical conditions we should know about (diabetes, hypertension, etc.) or write \'None\'' },
        { name: 'medications', label: 'Current Medications', inputType: 'textarea', placeholder: 'List any medications you\'re taking or write \'None\'' },
        { name: 'injuries', label: 'Injuries or Physical Limitations *', inputType: 'textarea', placeholder: 'Any injuries or physical limitations or write \'No\'', required: true }
      ]
    },
    {
      title: 'Nutrition Goals',
      icon: Target,
      fields: [
        {
          name: 'primaryGoal',
          label: 'Primary Goal *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select primary goal' },
            { value: 'weight-loss', label: 'Weight Loss' },
            { value: 'muscle-gain', label: 'Muscle Gain' },
            { value: 'performance', label: 'Athletic Performance' },
            { value: 'health-improvement', label: 'Health Improvement' },
            { value: 'body-recomposition', label: 'Body Recomposition' }
          ],
          required: true
        },
        { name: 'timeframe', label: 'Expected Timeframe to Achieve Goal', inputType: 'text', placeholder: 'e.g., 3 months, 6 months' },
      ]
    },
    {
      title: 'Choose Your Package',
      icon: Package,
      fields: [
        {
          name: 'selectedPackage',
          label: 'Select Package *',
          inputType: 'select',
          options: [
            { value: 'silver', label: '🥈 Silver - 495 EGP/month' },
            { value: 'gold', label: '🥇 Gold - 995 EGP/month (Most Popular)' },
            { value: 'diamond', label: '💎 Diamond - 1495 EGP/month' }
          ],
          required: true
        }
      ]
    }
  ];

  return (
    <GenericForm
      title="Nutrition Program Application"
      description="Fill out this form to get your personalized nutrition plan"
      steps={steps}
      initialFormData={initialFormData}
      submitMutation={createNutritionApplicationMutation.mutate}
      formId="nutrition"
      successMessage="Nutrition program request submitted successfully! We will contact you soon."
      sectionId="form"
      isDashboardForm={true}
    />
  );
}
