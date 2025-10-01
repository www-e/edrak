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
import { User,  Lock, Phone, Heart, ChevronLeft, ChevronRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";

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
   email: z.string().email("Please enter a valid email address"),
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    secondPhoneNumber: "",
    categoryPreference: "",
    referralSource: "",
    username: "",
    email: "",
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
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await interestsForm.trigger();
      if (isValid) {
        const data = interestsForm.getValues();
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: CredentialsFormValues) => {
    try {
      const completeData: SignupData = {
        ...formData,
        ...data,
        // Required fields are already in formData
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };

      await AuthService.signup(completeData);

      // If signup is successful, show message and trigger completion callback
      showSnackbar("Account created successfully! Please sign in.", "success");
      onSignupComplete();
    } catch (error) {
      // Catch errors thrown by the service
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
    { number: 2, title: "Interests", icon: Heart, description: "Your learning preferences" },
    { number: 3, title: "Credentials", icon: Lock, description: "Secure your account" },
  ];

  return (
    <div className="w-full">
      {/* Modern Progress indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center">
          {steps.map((stepInfo, index) => (
            <div key={stepInfo.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= stepInfo.number
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : step > stepInfo.number
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > stepInfo.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <stepInfo.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    step >= stepInfo.number ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {stepInfo.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stepInfo.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-20 mx-4 rounded-full transition-colors duration-300 ${
                    step > stepInfo.number ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form steps */}
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Personal Information</h3>
              <p className="text-muted-foreground">Let us start with the basics</p>
            </div>

            <Form {...personalInfoForm}>
              <form
                onSubmit={personalInfoForm.handleSubmit(() => handleNext())}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={personalInfoForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              placeholder="Enter your first name"
                              className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </div>
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
                        <FormLabel className="text-foreground font-medium">Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              placeholder="Enter your last name"
                              className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </div>
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
                      <FormLabel className="text-foreground font-medium">Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            placeholder="Enter your phone number"
                            className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                            {...field}
                          />
                        </div>
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
                      <FormLabel className="text-foreground font-medium">Second Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            placeholder="Enter second phone number"
                            className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Learning Preferences</h3>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>

            <Form {...interestsForm}>
              <form
                onSubmit={interestsForm.handleSubmit(() => handleNext())}
                className="space-y-6"
              >
                <FormField
                  control={interestsForm.control}
                  name="categoryPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">What would you like to learn? (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Technology, Business, Languages..."
                          className="h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                          {...field}
                        />
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
                      <FormLabel className="text-foreground font-medium">How did you hear about us? (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Google, Social Media, Friend..."
                          className="h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-12 px-6"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Create Account</h3>
              <p className="text-muted-foreground">Choose a username and secure password</p>
            </div>

            <Form {...credentialsForm}>
              <form
                onSubmit={credentialsForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={credentialsForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={credentialsForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            placeholder="Choose a unique username"
                            className="pl-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                            {...field}
                          />
                        </div>
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
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 h-12 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-2">
                        Password must be at least 6 characters long
                      </div>
                    </FormItem>
                  )}
                />

                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Password Strength</span>
                    <span className="text-green-600 font-medium">Strong</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-12 px-6"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
