/*
  Warnings:

  - You are about to drop the `upload_files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "upload_files";

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templatesHouse" (
    "id" SERIAL NOT NULL,
    "house_id" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,

    CONSTRAINT "templatesHouse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "templatesHouse" ADD CONSTRAINT "templatesHouse_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
