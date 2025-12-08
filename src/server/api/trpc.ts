import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { db } from "@/server/db";
import { SessionUser } from "@/types/auth";
import { authOptions } from "@/lib/auth";

type CreateContextOptions = {
  session: { user: SessionUser } | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const session = await getServerSession(authOptions);

  return createInnerTRPCContext({
    session: session as { user: SessionUser } | null,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== 'ADMIN') {
      throw new TRPCError({ 
          code: "FORBIDDEN", 
          message: "You must be an admin to perform this action." 
      });
  }
  return next({
      ctx: {
          session: { ...ctx.session, user: ctx.session.user },
      },
  });
});

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);