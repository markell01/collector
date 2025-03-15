/*
  Warnings:

  - You are about to drop the column `url` on the `upload_files` table. All the data in the column will be lost.
  - Added the required column `placement` to the `upload_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "upload_files" DROP COLUMN "url",
ADD COLUMN     "placement" INTEGER NOT NULL;
