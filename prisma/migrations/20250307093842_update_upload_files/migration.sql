/*
  Warnings:

  - A unique constraint covering the columns `[file_name]` on the table `upload_files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "upload_files_file_name_key" ON "upload_files"("file_name");
