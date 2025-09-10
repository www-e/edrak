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