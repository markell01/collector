-- CreateTable
CREATE TABLE "docs" (
    "id" SERIAL NOT NULL,
    "abon_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);
