import { User, Role } from "@prisma/client";

// Extend the default session user type
export interface SessionUser {
  id?: string;
  role?: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// User type without password for safe return
export type SafeUser = Omit<User, "password">;

// Type for the current user session
export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
}

// Interface for signin credentials
export interface SigninCredentials {
  username: string;
  password: string;
  role: "STUDENT" | "PROFESSOR" | "ADMIN";
}

// Interface for signup data
export interface SignupData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondPhoneNumber?: string;
  categoryPreference?: string;
  referralSource?: string;
}