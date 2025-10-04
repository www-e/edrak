import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: process.env.DATABASE_URL + "?pgbouncer=true&connect_timeout=30&pool_timeout=10&connection_limit=5",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;