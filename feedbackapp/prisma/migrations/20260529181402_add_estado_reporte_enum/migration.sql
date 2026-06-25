-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('CREADO', 'PRUEBAS_AGREGADAS', 'RESUELTO');

-- AlterTable
ALTER TABLE "Reporte" ADD COLUMN     "estado" "EstadoReporte" NOT NULL DEFAULT 'CREADO';

-- Migrar los datos existentes
UPDATE "Reporte"
SET "estado" = CASE
  WHEN "decision" IS NOT NULL THEN 'RESUELTO'::"EstadoReporte"
  WHEN "estaCompleto" = true THEN 'PRUEBAS_AGREGADAS'::"EstadoReporte"
  ELSE 'CREADO'::"EstadoReporte"
END;
