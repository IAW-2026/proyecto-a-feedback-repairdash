-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('SinResolver', 'Resuelto');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "valoracion" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajador" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "valoracion" INTEGER NOT NULL,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajo" (
    "id" SERIAL NOT NULL,
    "tipoDeTrabajo" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewCliente" (
    "idCliente" INTEGER NOT NULL,
    "idTrabajo" INTEGER NOT NULL,
    "valoracion" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "ReviewCliente_pkey" PRIMARY KEY ("idCliente","idTrabajo")
);

-- CreateTable
CREATE TABLE "ReviewTrabajador" (
    "idTrabajador" INTEGER NOT NULL,
    "idTrabajo" INTEGER NOT NULL,
    "valoracion" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "ReviewTrabajador_pkey" PRIMARY KEY ("idTrabajador","idTrabajo")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "idTrabajo" INTEGER NOT NULL,
    "resolucion" "Estado" NOT NULL DEFAULT 'SinResolver',

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pruebas" (
    "idReporte" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_mail_key" ON "Cliente"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajador_mail_key" ON "Trabajador"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewCliente_idCliente_key" ON "ReviewCliente"("idCliente");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewCliente_idTrabajo_key" ON "ReviewCliente"("idTrabajo");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewTrabajador_idTrabajador_key" ON "ReviewTrabajador"("idTrabajador");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewTrabajador_idTrabajo_key" ON "ReviewTrabajador"("idTrabajo");

-- CreateIndex
CREATE UNIQUE INDEX "Reporte_idTrabajo_key" ON "Reporte"("idTrabajo");

-- CreateIndex
CREATE UNIQUE INDEX "Pruebas_idReporte_key" ON "Pruebas"("idReporte");

-- AddForeignKey
ALTER TABLE "ReviewCliente" ADD CONSTRAINT "ReviewCliente_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCliente" ADD CONSTRAINT "ReviewCliente_idTrabajo_fkey" FOREIGN KEY ("idTrabajo") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTrabajador" ADD CONSTRAINT "ReviewTrabajador_idTrabajador_fkey" FOREIGN KEY ("idTrabajador") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTrabajador" ADD CONSTRAINT "ReviewTrabajador_idTrabajo_fkey" FOREIGN KEY ("idTrabajo") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idTrabajo_fkey" FOREIGN KEY ("idTrabajo") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pruebas" ADD CONSTRAINT "Pruebas_idReporte_fkey" FOREIGN KEY ("idReporte") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
