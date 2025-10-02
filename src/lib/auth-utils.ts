import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CurrentUser } from "@/types/auth";

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
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user as CurrentUser;
}

// Check if user has a specific role
export async function hasRole(role: string) {
  const user = await getCurrentUser();
  return user?.role === role;
}

// Check if user is admin
export async function isAdmin() {
  return hasRole("ADMIN");
}

// Check if user is professor
export async function isProfessor() {
  return hasRole("PROFESSOR");
}

// Check if user is student
export async function isStudent() {
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