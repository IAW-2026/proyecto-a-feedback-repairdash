/*
  Warnings:

  - The primary key for the `Pruebas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Pruebas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Reporte` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Reporte` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pruebas" DROP CONSTRAINT "Pruebas_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Pruebas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_pkey" CASCADE,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
