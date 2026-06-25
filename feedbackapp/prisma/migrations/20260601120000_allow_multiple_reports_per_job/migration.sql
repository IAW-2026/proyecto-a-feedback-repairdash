-- Drop the existing unique index on idTrabajo
DROP INDEX IF EXISTS "Reporte_idTrabajo_key";

-- Add composite unique constraint (one report per user per job)
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idTrabajo_idReportante_key" UNIQUE ("idTrabajo", "idReportante");
