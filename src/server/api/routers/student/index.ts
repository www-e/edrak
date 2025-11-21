import { createTRPCRouter } from "@/server/api/trpc";
import { studentDashboardRouter } from "./dashboard";
import { studentCoursesRouter } from "./courses";
import { studentProfileRouter } from "./profile";
import { studentPaymentsRouter } from "./payments";
import { paymentRouter } from "./payment"; // Import the new payment router
import { walletRouter } from "./wallet"; // Import the wallet router

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
});