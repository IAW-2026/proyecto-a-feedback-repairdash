/*
  Warnings:

  - A unique constraint covering the columns `[idTrabajo,idUsuario]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_idTrabajo_idUsuario_key" ON "Review"("idTrabajo", "idUsuario");
