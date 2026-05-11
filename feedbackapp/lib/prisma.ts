import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  console.warn("CUIDADO: DATABASE_URL no está definida en el entorno de producción.");
}

const prisma = new PrismaClient();

export default prisma;