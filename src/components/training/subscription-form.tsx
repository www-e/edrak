'use client';

import { User, Dumbbell, Target, Camera, FileText } from 'lucide-react';
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
  previousTrainer: 'yes',
  injuries: '',

  // Training Data
  trainingAge: '',
  weeklyDays: '',
  dailyExercises: '',
  workoutDuration: '',
  exerciseTypes: 'cardio',
  primarySport: '',

  // Body Measurements
  weight: '',
  height: '',
  chestCircumference: '',
  waistCircumference: '',
  hipCircumference: '',
  armCircumference: '',
  thighCircumference: '',

  // Fitness Tests
  squatTest: '',
  pushupTest: '',
  enduranceTest: '',
  flexibilityTest: '',

  // Body Photos
  frontPhoto: '',
  sidePhoto: '',
  backPhoto: '',

  // Goals
  primaryGoal: 'muscle-gain',
  timeframe: '',
  nutritionPlan: '',
  psychologicalSupport: '',
  selectedPackage: 'gold'
};

export default function SubscriptionForm() {
  const createTrainingApplicationMutation = api.public.applications.createTrainingApplication.useMutation();

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
        {
          name: 'previousTrainer',
          label: 'Have you trained with a personal trainer before? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select option' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
          required: true
        },
        { name: 'injuries', label: 'Do you have any injuries or health conditions to consider? *', inputType: 'textarea', placeholder: 'Please describe any injuries or health conditions (or write \'No\' if none)', required: true }
      ]
    },
    {
      title: 'Training Information',
      icon: Dumbbell,
      fields: [
        { name: 'trainingAge', label: 'Training Age (Duration of sports practice) *', inputType: 'text', placeholder: 'e.g., 2 years', required: true },
        { name: 'weeklyDays', label: 'Number of training days per week *', inputType: 'number', placeholder: 'e.g., 3', required: true },
        { name: 'dailyExercises', label: 'Number of exercises per day *', inputType: 'text', placeholder: 'e.g., 5-7 exercises', required: true },
        { name: 'workoutDuration', label: 'Average workout duration (minutes) *', inputType: 'number', placeholder: 'e.g., 60', required: true },
        {
          name: 'exerciseTypes',
          label: 'Types of primary exercises *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select exercise type' },
            { value: 'cardio', label: 'Cardio' },
            { value: 'resistance', label: 'Resistance' },
            { value: 'flexibility', label: 'Flexibility' },
            { value: 'mixed', label: 'Mixed' }
          ],
          required: true
        },
        { name: 'primarySport', label: 'Primary sport (if any)', inputType: 'text', placeholder: 'e.g., swimming, MMA, football...' }
      ]
    },
    {
      title: 'Body Measurements',
      icon: Target,
      fields: [
        { name: 'weight', label: 'Current Weight (kg) *', inputType: 'number', placeholder: 'Enter weight in kg', required: true },
        { name: 'height', label: 'Height (cm) *', inputType: 'number', placeholder: 'Enter height in cm', required: true },
        { name: 'chestCircumference', label: 'Chest Circumference (cm)', inputType: 'number', placeholder: 'Chest measurement' },
        { name: 'waistCircumference', label: 'Waist Circumference (cm)', inputType: 'number', placeholder: 'Waist measurement' },
        { name: 'hipCircumference', label: 'Hip Circumference (cm)', inputType: 'number', placeholder: 'Hip measurement' },
        { name: 'armCircumference', label: 'Arm Circumference (cm)', inputType: 'number', placeholder: 'Arm measurement' },
        { name: 'thighCircumference', label: 'Thigh Circumference (cm)', inputType: 'number', placeholder: 'Thigh measurement' },
        // Fitness Tests
        { name: 'squatTest', label: 'Squat Test (repetitions per minute)', inputType: 'number', placeholder: 'Number of squats in 1 minute' },
        { name: 'pushupTest', label: 'Push-up Test (repetitions per minute)', inputType: 'number', placeholder: 'Number of push-ups in 1 minute' },
        { name: 'enduranceTest', label: 'Endurance Test (1km run time or 3 minutes steady)', inputType: 'text', placeholder: 'Running time for 1km or 3 min steady' },
        { name: 'flexibilityTest', label: 'Flexibility Test (reaching the ground from standing)', inputType: 'text', placeholder: 'Distance to ground from standing' }
      ]
    },
    {
      title: 'Body Photos (Required)',
      icon: Camera,
      fields: [
        {
          name: 'frontPhoto',
          label: 'Front Photo *',
          inputType: 'file',
          required: true
        },
        {
          name: 'sidePhoto',
          label: 'Side Photo *',
          inputType: 'file',
          required: true
        },
        {
          name: 'backPhoto',
          label: 'Back Photo *',
          inputType: 'file',
          required: true
        }
      ]
    },
    {
      title: 'Subscription Goals',
      icon: FileText,
      fields: [
        {
          name: 'primaryGoal',
          label: 'Primary goal from the program *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select primary goal' },
            { value: 'muscle-gain', label: 'Increase muscle mass' },
            { value: 'weight-loss', label: 'Weight loss' },
            { value: 'performance', label: 'Improve performance' },
            { value: 'rehabilitation', label: 'Rehabilitation' },
            { value: 'general-fitness', label: 'General fitness' }
          ],
          required: true
        },
        { name: 'timeframe', label: 'Expected timeframe to achieve goal', inputType: 'text', placeholder: 'e.g., 3 months, 6 months' },
        { name: 'nutritionPlan', label: 'Do you want to combine the program with a nutrition plan or psychological support?', inputType: 'textarea', placeholder: 'Please specify your preferences' },
        {
          name: 'selectedPackage',
          label: 'Select Package *',
          inputType: 'select',
          options: [
            { value: 'silver', label: '🥈 Silver Package' },
            { value: 'gold', label: '🥇 Gold Package (Most Popular)' },
            { value: 'diamond', label: '💎 Diamond Package' }
          ],
          required: true
        }
      ]
    }
  ];

  return (
    <GenericForm
      title="Required Data Form"
      description="Please fill out this comprehensive form to help us create the perfect training program for you"
      steps={steps}
      initialFormData={initialFormData}
      submitMutation={createTrainingApplicationMutation.mutate}
      formId="training"
      successMessage="Training program request submitted successfully! We will contact you soon."
      sectionId="form"
    />
  );
}