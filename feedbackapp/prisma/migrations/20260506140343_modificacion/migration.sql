/*
  Warnings:

  - Added the required column `decision` to the `Reporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idReportado` to the `Reporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idReportante` to the `Reporte` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Fallo" AS ENUM ('AFavor', 'EnContra');

-- AlterTable
ALTER TABLE "Reporte" ADD COLUMN     "decision" "Fallo" NOT NULL,
ADD COLUMN     "idReportado" INTEGER NOT NULL,
ADD COLUMN     "idReportante" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idReportado_fkey" FOREIGN KEY ("idReportado") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idReportante_fkey" FOREIGN KEY ("idReportante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
