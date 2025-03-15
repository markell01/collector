/*
  Warnings:

  - Added the required column `abon_type` to the `docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "docs" ADD COLUMN     "abon_type" TEXT NOT NULL;
