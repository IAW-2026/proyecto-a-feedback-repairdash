/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewCliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewTrabajador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trabajador` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idCliente` to the `Trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idTrabajador` to the `Trabajo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('Cliente', 'Trabajador');

-- DropForeignKey
ALTER TABLE "ReviewCliente" DROP CONSTRAINT "ReviewCliente_idCliente_fkey";

-- DropForeignKey
ALTER TABLE "ReviewCliente" DROP CONSTRAINT "ReviewCliente_idTrabajo_fkey";

-- DropForeignKey
ALTER TABLE "ReviewTrabajador" DROP CONSTRAINT "ReviewTrabajador_idTrabajador_fkey";

-- DropForeignKey
ALTER TABLE "ReviewTrabajador" DROP CONSTRAINT "ReviewTrabajador_idTrabajo_fkey";

-- DropIndex
DROP INDEX "Pruebas_idReporte_key";

-- AlterTable
ALTER TABLE "Pruebas" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Pruebas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trabajo" ADD COLUMN     "idCliente" INTEGER NOT NULL,
ADD COLUMN     "idTrabajador" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "ReviewCliente";

-- DropTable
DROP TABLE "ReviewTrabajador";

-- DropTable
DROP TABLE "Trabajador";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "valoracion" INTEGER NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "idTrabajo" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "valoracion" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_mail_key" ON "Usuario"("mail");

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idTrabajador_fkey" FOREIGN KEY ("idTrabajador") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idTrabajo_fkey" FOREIGN KEY ("idTrabajo") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
