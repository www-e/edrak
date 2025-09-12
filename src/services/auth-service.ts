import { signIn, signOut } from "next-auth/react";
import { SafeUser, SigninCredentials, SignupData } from "@/types/auth";

/**
 * Service for handling authentication ACTIONS (mutations).
 * For reading authentication STATE (e.g., is the user logged in?),
 * components should use the `useSession` hook from `next-auth/react`.
 */
export class AuthService {
  /**
   * Sign in a user with credentials.
   * @param credentials User credentials for username, password, and role.
   * @returns A promise that resolves to an object, containing an error message if the sign-in failed.
   */
  static async signin(credentials: SigninCredentials): Promise<{ error?: string }> {
    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        role: credentials.role,
        redirect: false, // We handle redirects manually in the component.
      });

      if (result?.error) {
        // Provide a generic, user-friendly error message.
        return { error: "Invalid username or password. Please try again." };
      }
      
      // Return an empty object on success.
      return {};
    } catch (error) {
      // Catch unexpected network or server errors.
      console.error("AuthService.signin error:", error);
      throw new Error("An unexpected error occurred during sign-in.");
    }
  }

  /**
   * Sign up a new user via our custom API endpoint.
   * @param data User signup data.
   * @returns A promise that resolves to an object containing the new user on success.
   */
  static async signup(data: SignupData): Promise<{ user: SafeUser }> {
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
        // Propagate the specific error message from the API.
        throw new Error(errorData.error || "Signup failed");
      }

      const user: SafeUser = await response.json();
      return { user };
    } catch (error) {
      // Re-throw the error to be caught and handled by the UI component.
      console.error("AuthService.signup error:", error);
      throw error;
    }
  }

  /**
   * Sign out the current user.
   * Redirects to the homepage upon completion.
   */
  static async signout(): Promise<void> {
    try {
      // The signOut function from next-auth handles session clearing and redirection.
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("AuthService.signout error:", error);
      throw new Error("An unexpected error occurred during sign-out.");
    }
  }
}