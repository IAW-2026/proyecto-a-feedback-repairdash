import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Please configure it in your .env file or Vercel environment variables."
      );
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : [""error"],
    });
  }
  return globalForPrisma.prisma;
};