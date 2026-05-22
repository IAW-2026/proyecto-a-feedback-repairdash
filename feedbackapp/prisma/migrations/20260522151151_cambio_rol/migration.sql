/*
  Warnings:

  - You are about to drop the column `idCliente` on the `Trabajo` table. All the data in the column will be lost.
  - You are about to drop the column `idTrabajador` on the `Trabajo` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `idDriver` to the `Trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idRider` to the `Trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "rolDeUsuario" AS ENUM ('rider', 'driver');

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_idCliente_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_idTrabajador_fkey";

-- AlterTable
ALTER TABLE "Trabajo" DROP COLUMN "idCliente",
DROP COLUMN "idTrabajador",
ADD COLUMN     "idDriver" TEXT NOT NULL,
ADD COLUMN     "idRider" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo",
ADD COLUMN     "rol" "rolDeUsuario" NOT NULL;

-- DropEnum
DROP TYPE "TipoUsuario";

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idRider_fkey" FOREIGN KEY ("idRider") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idDriver_fkey" FOREIGN KEY ("idDriver") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
