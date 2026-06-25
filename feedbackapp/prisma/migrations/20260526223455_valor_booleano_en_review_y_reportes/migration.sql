/*
  Warnings:

  - Changed the type of `idReporte` on the `Pruebas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pruebas" DROP COLUMN "idReporte",
ADD COLUMN     "idReporte" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Reporte" ADD COLUMN     "estaCompleto" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "estaCompleta" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Pruebas" ADD CONSTRAINT "Pruebas_idReporte_fkey" FOREIGN KEY ("idReporte") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
