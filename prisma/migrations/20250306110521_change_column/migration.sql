/*
  Warnings:

  - You are about to drop the column `house_id` on the `docs` table. All the data in the column will be lost.
  - Added the required column `claster_id` to the `docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "docs" DROP COLUMN "house_id",
ADD COLUMN     "claster_id" TEXT NOT NULL;
