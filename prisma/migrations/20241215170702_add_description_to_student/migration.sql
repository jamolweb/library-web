/*
  Warnings:

  - Made the column `phoneNumber` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
