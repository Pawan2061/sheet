/*
  Warnings:

  - You are about to drop the column `column` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lineNumber` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdateId` on the `Sheet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "column",
DROP COLUMN "lineNumber";

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "lastUpdateId";
