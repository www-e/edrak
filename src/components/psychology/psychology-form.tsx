'use client';

import { User, Activity, Brain, Target } from 'lucide-react';
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
  previousPsychologist: 'yes',
  medications: '',
  injuries: '',

  // Sports Data
  primarySport: '',
  trainingAge: '',
  weeklyDays: '',
  workoutDuration: '',
  preparingForCompetition: 'yes',
  competitionDate: '',

  // Current Mental State
  affectingPerformance: '',
  previousBreakdown: 'yes',
  generalMentalState: 'stable',
  sleepDifficulties: 'yes',
  anxietyEpisodes: 'yes',

  // Goals
  primaryGoal: 'performance-improvement',
  sessionPreference: 'individual',
  combineWithTraining: '',
  selectedPackage: 'gold'
};

export default function PsychologyForm() {
  const createPsychologyApplicationMutation = api.student.services.createPsychologyApplication.useMutation();

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
        { name: 'phone', label: 'Phone Number', inputType: 'text', placeholder: 'Enter your phone number' },
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
        {
          name: 'previousPsychologist',
          label: 'Have you worked with a psychologist before? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select option' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
          required: true
        },
        { name: 'medications', label: 'Do you take any psychological or medical medications? *', inputType: 'textarea', placeholder: 'Please specify if yes, or write \'No\' if none', required: true },
        { name: 'injuries', label: 'Do you have any health conditions or sports injuries to consider? *', inputType: 'textarea', placeholder: 'Please describe any health conditions or injuries, or write \'No\' if none', required: true, className: 'md:col-span-2' },
      ]
    },
    {
      title: 'Sports Information',
      icon: Activity,
      fields: [
        { name: 'primarySport', label: 'Primary sport or type of sports activity *', inputType: 'text', placeholder: 'e.g., football, swimming, MMA...', required: true },
        { name: 'trainingAge', label: 'Training age (duration of sports practice since beginning) *', inputType: 'text', placeholder: 'e.g., 2 years', required: true },
        { name: 'weeklyDays', label: 'Number of training days per week *', inputType: 'number', placeholder: 'e.g., 3', required: true },
        { name: 'workoutDuration', label: 'Average daily workout duration (minutes) *', inputType: 'number', placeholder: 'e.g., 60', required: true },
        {
          name: 'preparingForCompetition',
          label: 'Are you preparing for an upcoming competition or match? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select option' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
          required: true
        },
        {
          name: 'competitionDate',
          label: 'Competition or match date (if applicable)',
          inputType: 'text',
          placeholder: 'e.g., March 15, 2024',
          className: 'md:col-span-2'
        }
      ]
    },
    {
      title: 'Current Mental State',
      icon: Brain,
      fields: [
        { name: 'affectingPerformance', label: 'What most affects your current sports performance? (stress, lack of focus, loss of motivation, personal problems...) *', inputType: 'textarea', placeholder: 'Please describe what affects your performance', required: true },
        {
          name: 'previousBreakdown',
          label: 'Have you ever experienced a psychological breakdown or loss of confidence during competitions? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select option' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
          required: true
        },
        {
          name: 'generalMentalState',
          label: 'How do you describe your general mental state? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select mental state' },
            { value: 'stable', label: 'Stable' },
            { value: 'unstable', label: 'Unstable' },
            { value: 'stressed', label: 'Stressed' },
            { value: 'unclear', label: 'Unclear' }
          ],
          required: true
        },
        {
          name: 'sleepDifficulties',
          label: 'Do you have difficulty sleeping or waking up? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select option' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
          required: true
        },
        {
          name: 'anxietyEpisodes',
          label: 'Do you suffer from anxiety attacks or excessive thinking? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select option' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
          required: true
        }
      ]
    },
    {
      title: 'Consultation Goals',
      icon: Target,
      fields: [
        {
          name: 'primaryGoal',
          label: 'What is your primary goal from psychological consultations? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select primary goal' },
            { value: 'performance-improvement', label: 'Improve performance' },
            { value: 'stress-management', label: 'Manage stress' },
            { value: 'confidence-building', label: 'Build confidence' },
            { value: 'pre-competition-support', label: 'Pre-competition support' },
            { value: 'psychological-rehabilitation', label: 'Psychological rehabilitation' }
          ],
          required: true
        },
        {
          name: 'sessionPreference',
          label: 'Do you prefer individual sessions or general guidance? *',
          inputType: 'select',
          options: [
            { value: '', label: 'Select preference' },
            { value: 'individual', label: 'Individual sessions' },
            { value: 'general', label: 'General guidance' }
          ],
          required: true
        },
        { name: 'combineWithTraining', label: 'Do you want to combine psychological consultation with a sports training or nutrition program?', inputType: 'textarea', placeholder: 'Please specify your preferences', required: true },
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
      title="Psychology Consultation Application"
      description="Fill out this comprehensive form to help us provide the best psychological support for your athletic performance"
      steps={steps}
      initialFormData={initialFormData}
      submitMutation={createPsychologyApplicationMutation.mutate}
      formId="psychology"
      successMessage="Psychology consultation request submitted successfully! We will contact you soon."
      sectionId="form"
      isDashboardForm={true}
    />
  );
}