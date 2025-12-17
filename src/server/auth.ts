import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
} from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { type NextApiRequest, type NextApiResponse } from "next";

/**
 * Wrapper for `getServerSession` so that you do not need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"] | NextApiRequest;
  res: GetServerSidePropsContext["res"] | NextApiResponse;
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

// Export auth function for client components
export { authOptions };