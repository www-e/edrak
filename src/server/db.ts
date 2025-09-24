import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasourceUrl: process.env.DATABASE_URL + "?pgbouncer=true&connect_timeout=60&pool_timeout=20&connection_limit=10",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;