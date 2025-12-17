'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useSnackbar } from '@/components/shared/snackbar-context';
import { useRouter } from 'next/navigation';


interface FormFieldBase {
  name: string;
  label: string;
  required?: boolean;
  inputType: string; // Using string to allow flexibility
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

// Using FormFieldBase with string inputType to allow flexibility

interface GenericStep {
  title: string;
  description?: string;
  icon: React.ElementType;
  fields: Array<FormFieldBase>;
}

interface FormData {
  [key: string]: string | File | null;
}

type SubmitMutationFunction<T> = (variables: T) => void;

interface GenericFormProps<T = Record<string, unknown>> {
  title: string;
  description: string;
  steps: GenericStep[];
  initialFormData: FormData;
  submitMutation: SubmitMutationFunction<T>;
  formId: string;
  successMessage?: string;
  sectionId?: string;
  isDashboardForm?: boolean; // New prop to indicate if this form is used in dashboard context
}

export default function GenericForm<T = Record<string, unknown>>({
  title,
  description,
  steps,
  initialFormData,
  submitMutation,
  formId,
  successMessage = 'Form submitted successfully! We will contact you soon.',
  sectionId = 'form',
  isDashboardForm = false // Default to false for backward compatibility
}: GenericFormProps<T>) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  // Function to handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submit form with photo URLs
      // We need to type-assert the formData to the expected mutation type
      await submitMutation(formData as T);

      showSnackbar(successMessage, 'success');

      // If this is a dashboard form, redirect to services page after successful submission
      if (isDashboardForm) {
        // Wait a bit for the snackbar to show before redirecting
        setTimeout(() => {
          router.push('/student/services');
        }, 1500);
      } else {
        // For non-dashboard forms, reset the form and go back to first step
        setFormData(initialFormData);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      showSnackbar('Error submitting application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (field: string, file: File | null) => {
    if (!file) {
      setFormData(prev => ({ ...prev, [field]: '' }));
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('courseId', `${formId}-application`); // Course ID format for service applications

      // Only add serviceApplication if this is a dashboard form
      if (isDashboardForm) {
        const serviceType = formId.toUpperCase(); // formId like 'training' becomes 'TRAINING'
        formDataUpload.append('serviceApplication', serviceType);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Store the BunnyCDN URL in form state
      setFormData(prev => ({ ...prev, [field]: result.attachment.bunnyCdnUrl }));
      showSnackbar(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} uploaded successfully!`, 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showSnackbar('Error uploading photo. Please try again.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
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

  const renderField = (field: FormFieldBase) => {
    switch (field.inputType) {
      case 'textarea':
        return (
          <div key={field.name} className={field.className}>
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={field.className}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={field.className}>
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <select
              id={field.name}
              value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required={field.required}
            >
              <option value="">Select option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className={field.className}>
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <input
              id={field.name}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-300 rounded-md"
              disabled={isUploadingPhoto}
              required={field.required}
            />
            {formData[field.name] && typeof formData[field.name] === 'string' && formData[field.name] !== '' && (
              <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
            )}
          </div>
        );

      default: // text, number, email, tel
        return (
          <div key={field.name} className={field.className}>
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.inputType}
              value={typeof formData[field.name] === 'string' ? formData[field.name] as string : ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        );
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-6">{step.title}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {step.fields.map(field => renderField(field))}
        </div>
      </div>
    );
  };

  return (
    <section id={sectionId} className="py-24 bg-white">
      <div className="container max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {description}
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