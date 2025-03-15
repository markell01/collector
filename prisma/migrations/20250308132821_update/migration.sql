/*
  Warnings:

  - The primary key for the `templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `templates` table. All the data in the column will be lost.
  - The required column `uid` was added to the `templates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "templatesHouse" DROP CONSTRAINT "templatesHouse_template_id_fkey";

-- AlterTable
ALTER TABLE "templates" DROP CONSTRAINT "templates_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "templates_pkey" PRIMARY KEY ("uid");

-- AddForeignKey
ALTER TABLE "templatesHouse" ADD CONSTRAINT "templatesHouse_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
