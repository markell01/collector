/*
  Warnings:

  - Added the required column `house_id` to the `docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "docs" ADD COLUMN     "house_id" TEXT NOT NULL;
