/*
  Warnings:

  - Changed the type of `abon_id` on the `docs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "docs" DROP COLUMN "abon_id",
ADD COLUMN     "abon_id" INTEGER NOT NULL;
