-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "valoracion" DROP NOT NULL,
ALTER COLUMN "review" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trabajo" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "fechaFin" DROP NOT NULL;
DROP SEQUENCE "Trabajo_id_seq";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Usuario_id_seq";
