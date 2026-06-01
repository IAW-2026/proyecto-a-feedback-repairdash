/*
  Warnings:

  - The primary key for the `Pruebas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reporte` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Trabajo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[idTrabajo,idUsuario]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Pruebas" DROP CONSTRAINT "Pruebas_idReporte_fkey";

-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_idReportado_fkey";

-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_idReportante_fkey";

-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_idTrabajo_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_idTrabajo_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_idCliente_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_idTrabajador_fkey";

-- AlterTable
ALTER TABLE "Pruebas" DROP CONSTRAINT "Pruebas_pkey",
ALTER COLUMN "idReporte" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pruebas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pruebas_id_seq";

-- AlterTable
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "idTrabajo" SET DATA TYPE TEXT,
ALTER COLUMN "idReportado" SET DATA TYPE TEXT,
ALTER COLUMN "idReportante" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reporte_id_seq";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "idTrabajo" SET DATA TYPE TEXT,
ALTER COLUMN "idUsuario" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_pkey",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "idCliente" SET DATA TYPE TEXT,
ALTER COLUMN "idTrabajador" SET DATA TYPE TEXT,
ADD CONSTRAINT "Trabajo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_idTrabajo_idUsuario_key" ON "Review"("idTrabajo", "idUsuario");

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idTrabajador_fkey" FOREIGN KEY ("idTrabajador") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idTrabajo_fkey" FOREIGN KEY ("idTrabajo") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idTrabajo_fkey" FOREIGN KEY ("idTrabajo") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idReportado_fkey" FOREIGN KEY ("idReportado") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idReportante_fkey" FOREIGN KEY ("idReportante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pruebas" ADD CONSTRAINT "Pruebas_idReporte_fkey" FOREIGN KEY ("idReporte") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
