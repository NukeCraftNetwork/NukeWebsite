-- CreateTable
CREATE TABLE "Products" (
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

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoughtPart" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BoughtPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MadePart" (
    "id" SERIAL NOT NULL,
    "machine" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "MadePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "components" JSONB NOT NULL,
    "assemblerGroup" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "additives" JSONB NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "component" TEXT NOT NULL,
    "packaging" JSONB NOT NULL,
    "time" INTEGER NOT NULL,
    "markup" DOUBLE PRECISION NOT NULL,
    "isMarkup" INTEGER NOT NULL,
    "isRoundUp" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_unicode_key" ON "Products"("unicode");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_boughtPartId_fkey" FOREIGN KEY ("boughtPartId") REFERENCES "BoughtPart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_madePartId_fkey" FOREIGN KEY ("madePartId") REFERENCES "MadePart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
