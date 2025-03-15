-- CreateTable
CREATE TABLE "upload_files" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "upload_files_pkey" PRIMARY KEY ("id")
);
