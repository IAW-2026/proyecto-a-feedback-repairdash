import { PrismaClient } from "@prisma/client";

// Dejamos la variable declarada pero vacía
let prisma: PrismaClient;

// Creamos una función que solo instancia a Prisma cuando se la llama
export const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};