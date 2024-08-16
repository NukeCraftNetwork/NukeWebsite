/*
  Warnings:

  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_boughtPartId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_componentId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_madePartId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_productId_fkey";

-- DropTable
DROP TABLE "Products";

-- CreateTable
CREATE TABLE "Toco" (
    "id" SERIAL NOT NULL,
    "unicode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "folder" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "secrecyPerm" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boughtPartId" INTEGER,
    "madePartId" INTEGER,
    "componentId" INTEGER,
    "productId" INTEGER,

    CONSTRAINT "Toco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Toco_unicode_key" ON "Toco"("unicode");

-- AddForeignKey
ALTER TABLE "Toco" ADD CONSTRAINT "Toco_boughtPartId_fkey" FOREIGN KEY ("boughtPartId") REFERENCES "BoughtPart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toco" ADD CONSTRAINT "Toco_madePartId_fkey" FOREIGN KEY ("madePartId") REFERENCES "MadePart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toco" ADD CONSTRAINT "Toco_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toco" ADD CONSTRAINT "Toco_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
