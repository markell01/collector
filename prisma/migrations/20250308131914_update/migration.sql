/*
  Warnings:

  - You are about to drop the column `file_name` on the `templates` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "file_name",
ADD COLUMN     "fileName" TEXT NOT NULL;
