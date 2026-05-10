
import { PrismaClient } from "@prisma/client";
console.log("DATABASE_URL presente:", !!process.env.DATABASE_URL);
const prisma = new PrismaClient();

export default prisma;
/*singleton por si alguna vez lo uso:
import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}
const prisma = global.prisma || new PrismaClient();

export default prisma;
*/