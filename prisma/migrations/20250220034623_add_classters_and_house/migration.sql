-- CreateTable
CREATE TABLE "Clasters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "col_houses" INTEGER NOT NULL,

    CONSTRAINT "Clasters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "internet_id" INTEGER NOT NULL,
    "intercom_id" INTEGER NOT NULL,
    "tv_id" INTEGER NOT NULL,
    "claster_id" TEXT NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_claster_id_fkey" FOREIGN KEY ("claster_id") REFERENCES "Clasters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
