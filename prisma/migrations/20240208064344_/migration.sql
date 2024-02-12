/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "accessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_accessToken_key" ON "Customer"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_refreshToken_key" ON "Customer"("refreshToken");
