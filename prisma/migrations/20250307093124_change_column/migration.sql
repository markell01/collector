/*
  Warnings:

  - The primary key for the `upload_files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `file_name` to the `upload_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "upload_files" DROP CONSTRAINT "upload_files_pkey",
ADD COLUMN     "file_name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "upload_files_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "upload_files_id_seq";
