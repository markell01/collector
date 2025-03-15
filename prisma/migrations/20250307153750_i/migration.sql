/*
  Warnings:

  - Added the required column `houses_id` to the `upload_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "upload_files" ADD COLUMN     "houses_id" TEXT NOT NULL;
