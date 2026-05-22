/*
  Warnings:

  - The values [admin] on the enum `rolDeUsuario` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "rolDeUsuario_new" AS ENUM ('rider', 'driver', 'feedbackAdmin');
ALTER TABLE "Usuario" ALTER COLUMN "rol" TYPE "rolDeUsuario_new" USING ("rol"::text::"rolDeUsuario_new");
ALTER TYPE "rolDeUsuario" RENAME TO "rolDeUsuario_old";
ALTER TYPE "rolDeUsuario_new" RENAME TO "rolDeUsuario";
DROP TYPE "public"."rolDeUsuario_old";
COMMIT;
