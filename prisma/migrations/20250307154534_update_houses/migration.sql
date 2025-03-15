/*
  Warnings:

  - The `houses_id` column on the `upload_files` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "upload_files" DROP COLUMN "houses_id",
ADD COLUMN     "houses_id" TEXT[];
