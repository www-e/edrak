"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "@/components/shared/snackbar-context";
import { AuthService } from "@/services/auth-service";
import { SignupData } from "@/types/auth";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  secondPhoneNumber: z.string().optional(),
});

const interestsSchema = z.object({
  categoryPreference: z.string().optional(),
  referralSource: z.string().optional(),
});

const credentialsSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
type InterestsFormValues = z.infer<typeof interestsSchema>;
type CredentialsFormValues = z.infer<typeof credentialsSchema>;

interface SignupFormProps {
  onSignupComplete: () => void;
}

export function SignupForm({ onSignupComplete }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    secondPhoneNumber: "",
    categoryPreference: "",
    referralSource: "",
    username: "",
    password: "",
  });

  const personalInfoForm = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      secondPhoneNumber: formData.secondPhoneNumber,
    },
  });

  const interestsForm = useForm<InterestsFormValues>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      categoryPreference: formData.categoryPreference,
      referralSource: formData.referralSource,
    },
  });

  const credentialsForm = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      username: formData.username,
      password: formData.password,
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await personalInfoForm.trigger();
      if (isValid) {
        const data = personalInfoForm.getValues();
        setFormData(prev => ({ ...prev, ...data }));
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await interestsForm.trigger();
      if (isValid) {
        const data = interestsForm.getValues();
        setFormData(prev => ({ ...prev, ...data }));
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: CredentialsFormValues) => {
    try {
      const completeData: SignupData = { 
        ...formData, 
        ...data,
        // Ensure required fields are present
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };
      
      const result = await AuthService.signup(completeData);

      if (result.error) {
        showSnackbar(result.error, "error");
      } else {
        showSnackbar("Account created successfully!", "success");
        
        // Wait a bit for the snackbar to be visible before proceeding
        setTimeout(() => {
          onSignupComplete();
        }, 1000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      showSnackbar("Signup failed", "error");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`h-1 w-16 mx-2 ${
                    step > num ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Personal Info</span>
          <span>Interests</span>
          <span>Credentials</span>
        </div>
      </div>

      {/* Form steps */}
      <div className="bg-card rounded-lg shadow-md p-6">
        {step === 1 && (
          <Form {...personalInfoForm}>
            <form onSubmit={personalInfoForm.handleSubmit(() => handleNext())} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={personalInfoForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalInfoForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={personalInfoForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalInfoForm.control}
                name="secondPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Second phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...interestsForm}>
            <form onSubmit={interestsForm.handleSubmit(() => handleNext())} className="space-y-4">
              <FormField
                control={interestsForm.control}
                name="categoryPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Preference (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Category preference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={interestsForm.control}
                name="referralSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us? (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Referral source" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...credentialsForm}>
            <form onSubmit={credentialsForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={credentialsForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={credentialsForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit">Sign Up</Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}