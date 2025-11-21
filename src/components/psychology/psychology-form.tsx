'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, User, Activity, Target } from 'lucide-react';
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
  previousTrainer: "yes" | "no";
  previousPsychologist: "yes" | "no";
  medications: string;
  injuries: string;

  // Sports Data
  primarySport: string;
  trainingAge: string;
  weeklyDays: string;
  workoutDuration: string;
  preparingForCompetition: "yes" | "no";
  competitionDate: string;

  // Current Mental State
  affectingPerformance: string;
  previousBreakdown: "yes" | "no";
  generalMentalState: "stable" | "unstable" | "stressed" | "unclear";
  sleepDifficulties: "yes" | "no";
  anxietyEpisodes: "yes" | "no";

  // Goals
  primaryGoal: "performance-improvement" | "stress-management" | "confidence-building" | "pre-competition-support" | "psychological-rehabilitation";
  sessionPreference: "individual" | "general";
  combineWithTraining: string;
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
  previousPsychologist: 'yes',
  medications: '',
  injuries: '',
  primarySport: '',
  trainingAge: '',
  weeklyDays: '',
  workoutDuration: '',
  preparingForCompetition: 'yes',
  competitionDate: '',
  affectingPerformance: '',
  previousBreakdown: 'yes',
  generalMentalState: 'stable',
  sleepDifficulties: 'yes',
  anxietyEpisodes: 'yes',
  primaryGoal: 'performance-improvement',
  sessionPreference: 'individual',
  combineWithTraining: ''
};

export default function PsychologyForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createPsychologyApplication } = api.public.applications.createPsychologyApplication.useMutation();
  const { showSnackbar } = useSnackbar();

  const steps = [
    { icon: User, title: 'Personal Data', description: 'Basic information about you' },
    { icon: Activity, title: 'Sports Information', description: 'Your sports background' },
    { icon: Brain, title: 'Mental State', description: 'Current psychological assessment' },
    { icon: Target, title: 'Goals & Preferences', description: 'Your objectives' }
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
      // Submit the form data through the API
      await createPsychologyApplication(formData);

      showSnackbar('Psychology consultation request submitted successfully! We will contact you soon.', 'success');

      // Reset form after successful submission
      setFormData(initialFormData);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting psychology application:', error);
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
                <Label htmlFor="phone">Phone Number</Label>
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
              <div>
                <Label htmlFor="previousPsychologist">Have you worked with a psychologist before? *</Label>
                <select
                  id="previousPsychologist"
                  value={formData.previousPsychologist}
                  onChange={(e) => handleInputChange('previousPsychologist', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="medications">Do you take any psychological or medical medications? *</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="Please specify if yes, or write 'No' if none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="injuries">Do you have any health conditions or sports injuries to consider? *</Label>
                <Textarea
                  id="injuries"
                  value={formData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  placeholder="Please describe any health conditions or injuries, or write 'No' if none"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Sports Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primarySport">Primary sport or type of sports activity *</Label>
                <Input
                  id="primarySport"
                  value={formData.primarySport}
                  onChange={(e) => handleInputChange('primarySport', e.target.value)}
                  placeholder="e.g., football, swimming, MMA..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="trainingAge">Training age (duration of sports practice since beginning) *</Label>
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
                <Label htmlFor="workoutDuration">Average daily workout duration (minutes) *</Label>
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
                <Label htmlFor="preparingForCompetition">Are you preparing for an upcoming competition or match? *</Label>
                <select
                  id="preparingForCompetition"
                  value={formData.preparingForCompetition}
                  onChange={(e) => handleInputChange('preparingForCompetition', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {formData.preparingForCompetition === 'yes' && (
                <div>
                  <Label htmlFor="competitionDate">Competition or match date (if applicable)</Label>
                  <Input
                    id="competitionDate"
                    value={formData.competitionDate}
                    onChange={(e) => handleInputChange('competitionDate', e.target.value)}
                    placeholder="e.g., March 15, 2024"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Current Mental State</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="affectingPerformance">What most affects your current sports performance? (stress, lack of focus, loss of motivation, personal problems...) *</Label>
                <Textarea
                  id="affectingPerformance"
                  value={formData.affectingPerformance}
                  onChange={(e) => handleInputChange('affectingPerformance', e.target.value)}
                  placeholder="Please describe what affects your performance"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="previousBreakdown">Have you ever experienced a psychological breakdown or loss of confidence during competitions? *</Label>
                <select
                  id="previousBreakdown"
                  value={formData.previousBreakdown}
                  onChange={(e) => handleInputChange('previousBreakdown', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="generalMentalState">How do you describe your general mental state? *</Label>
                <select
                  id="generalMentalState"
                  value={formData.generalMentalState}
                  onChange={(e) => handleInputChange('generalMentalState', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select mental state</option>
                  <option value="stable">Stable</option>
                  <option value="unstable">Unstable</option>
                  <option value="stressed">Stressed</option>
                  <option value="unclear">Unclear</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="sleepDifficulties">Do you have difficulty sleeping or waking up? *</Label>
                <select
                  id="sleepDifficulties"
                  value={formData.sleepDifficulties}
                  onChange={(e) => handleInputChange('sleepDifficulties', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="anxietyEpisodes">Do you suffer from anxiety attacks or excessive thinking? *</Label>
                <select
                  id="anxietyEpisodes"
                  value={formData.anxietyEpisodes}
                  onChange={(e) => handleInputChange('anxietyEpisodes', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Consultation Goals</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="primaryGoal">What is your primary goal from psychological consultations? *</Label>
                <select
                  id="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select primary goal</option>
                  <option value="performance-improvement">Improve performance</option>
                  <option value="stress-management">Manage stress</option>
                  <option value="confidence-building">Build confidence</option>
                  <option value="pre-competition-support">Pre-competition support</option>
                  <option value="psychological-rehabilitation">Psychological rehabilitation</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="sessionPreference">Do you prefer individual sessions or general guidance? *</Label>
                <select
                  id="sessionPreference"
                  value={formData.sessionPreference}
                  onChange={(e) => handleInputChange('sessionPreference', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select preference</option>
                  <option value="individual">Individual sessions</option>
                  <option value="general">General guidance</option>
                </select>
              </div>

              <div>
                <Label htmlFor="combineWithTraining">Do you want to combine psychological consultation with a sports training or nutrition program?</Label>
                <Textarea
                  id="combineWithTraining"
                  value={formData.combineWithTraining}
                  onChange={(e) => handleInputChange('combineWithTraining', e.target.value)}
                  placeholder="Please specify your preferences"
                  required
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
            Psychology Consultation Application
          </h2>
          <p className="text-xl text-muted-foreground">
            Fill out this comprehensive form to help us provide the best psychological support for your athletic performance
          </p>
        </motion.div>

        <Card className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-purple-500 text-white border-purple-500' 
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-purple-500' : 'bg-gray-300'
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
              <Button onClick={nextStep} className="bg-purple-500 hover:bg-purple-600">
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
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