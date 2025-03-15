/*
  Warnings:

  - You are about to drop the column `file_name` on the `upload_files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileName]` on the table `upload_files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `upload_files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "upload_files_file_name_key";

-- AlterTable
ALTER TABLE "upload_files" DROP COLUMN "file_name",
ADD COLUMN     "fileName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "upload_files_fileName_key" ON "upload_files"("fileName");
