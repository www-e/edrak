import { createTRPCRouter } from "@/server/api/trpc";
import { studentDashboardRouter } from "./dashboard";
import { studentCoursesRouter } from "./courses";
import { studentProfileRouter } from "./profile";
import { studentPaymentsRouter } from "./payments";
import { paymentRouter } from "./payment"; // Import the new payment router
import { walletRouter } from "./wallet"; // Import the wallet router
import { notesRouter } from "./notes"; // Import the notes router
import { messagesRouter } from "./messages"; // Import the messages router
import { studentQuizRouter } from "./quiz"; // Import the quiz router
import { studentProgressRouter } from "./progress"; // Import the progress router
import { studentServicesRouter } from "./services"; // Import the services router

/**
 * This is the primary router for all student-related API endpoints.
 * It merges other routers into a single, namespaced API structure.
 */
export const studentRouter = createTRPCRouter({
  dashboard: studentDashboardRouter,
  courses: studentCoursesRouter,
  profile: studentProfileRouter,
  payments: studentPaymentsRouter,
  payment: paymentRouter, // Register the new payment router
  wallet: walletRouter, // Register the wallet router
  notes: notesRouter, // Register the notes router
  messages: messagesRouter, // Register the messages router
  quiz: studentQuizRouter, // Register the quiz router
  progress: studentProgressRouter, // Register the progress router
  services: studentServicesRouter, // Register the services router
});