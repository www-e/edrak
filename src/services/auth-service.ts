import { signIn, signOut } from "next-auth/react";
import { SafeUser, SigninCredentials, SignupData } from "@/types/auth";

/**
 * Service for handling authentication operations
 */
export class AuthService {
  /**
   * Sign in a user with credentials
   * @param credentials User credentials
   * @returns Promise resolving to the sign in result
   */
  static async signin(credentials: SigninCredentials): Promise<{ error?: string }> {
    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        role: credentials.role,
        redirect: false,
      });

      if (result?.error) {
        return { error: result.error };
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
      throw error;
    }
  }

  /**
   * Sign up a new user
   * @param data User signup data
   * @returns Promise resolving to the created user or error
   */
  static async signup(data: SignupData): Promise<{ user?: SafeUser; error?: string }> {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      const user: SafeUser = await response.json();
      return { user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
      throw error;
    }
  }

  /**
   * Sign out the current user
   * @returns Promise resolving when sign out is complete
   */
  static async signout(): Promise<void> {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
      throw error;
    }
  }

  /**
   * Check if the current user is authenticated
   * @returns Promise resolving to boolean indicating if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    // This would typically be implemented with a server-side check
    // For now, we'll return true as a placeholder
    return true;
  }

  /**
   * Get the current user's role
   * @returns Promise resolving to the user's role or null if not authenticated
   */
  static async getCurrentUserRole(): Promise<"STUDENT" | "PROFESSOR" | "ADMIN" | null> {
    // This would typically be implemented with a server-side check
    // For now, we'll return null as a placeholder
    return null;
  }
}