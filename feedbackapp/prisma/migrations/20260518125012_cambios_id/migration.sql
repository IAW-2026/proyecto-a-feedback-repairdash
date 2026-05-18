/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_idReportado_fkey";

-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_idReportante_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_idCliente_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_idTrabajador_fkey";

-- AlterTable
ALTER TABLE "Reporte" ALTER COLUMN "idReportado" SET DATA TYPE TEXT,
ALTER COLUMN "idReportante" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "idUsuario" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Trabajo" ALTER COLUMN "idCliente" SET DATA TYPE TEXT,
ALTER COLUMN "idTrabajador" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_idTrabajador_fkey" FOREIGN KEY ("idTrabajador") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idReportado_fkey" FOREIGN KEY ("idReportado") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idReportante_fkey" FOREIGN KEY ("idReportante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
