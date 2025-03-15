/*
  Warnings:

  - You are about to drop the column `fileName` on the `templates` table. All the data in the column will be lost.
  - Added the required column `name` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "fileName",
ADD COLUMN     "name" TEXT NOT NULL;
