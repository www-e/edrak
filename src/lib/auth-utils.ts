import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CurrentUser } from "@/types/auth";
import { EnrollmentVerification } from "@/lib/enrollment-verification";

/**
 * Unified authentication utilities
 * Consolidates all authentication patterns across the application
 */

// Get the current user session (App Router compatible)
export async function getCurrentUser(): Promise<CurrentUser | undefined> {
  const session = await getServerSession(authOptions);
  return session?.user as CurrentUser | undefined;
}

// App Router compatible session getter for API routes
export async function getAppRouterSession() {
  return await getServerSession(authOptions);
}

// Unified authentication utility to reduce redundancy
export async function requireAuth(): Promise<CurrentUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user as CurrentUser;
}

// Check if user has a specific role
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN");
}

// Check if user is professor
export async function isProfessor(): Promise<boolean> {
  return hasRole("PROFESSOR");
}

// Check if user is student
export async function isStudent(): Promise<boolean> {
  return hasRole("STUDENT");
}

// Middleware function for role-based access
export async function requireRole(role: string): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== role) {
    throw new Error("Insufficient permissions");
  }

  return user;
}

// Unified enrollment verification with authentication
export async function requireEnrollment(courseId: string): Promise<{
  user: CurrentUser;
  isEnrolled: boolean;
}> {
  const user = await requireAuth();
  const isEnrolled = await EnrollmentVerification.verifyEnrollment(user.id, courseId);

  if (!isEnrolled) {
    throw new Error("Enrollment required to access this content");
  }

  return { user, isEnrolled };
}

// Check if user is enrolled in course (without throwing error)
export async function checkEnrollment(courseId: string): Promise<{
  user: CurrentUser;
  isEnrolled: boolean;
}> {
  const user = await requireAuth();
  const isEnrolled = await EnrollmentVerification.verifyEnrollment(user.id, courseId);

  return { user, isEnrolled };
}