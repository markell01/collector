-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Login" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Login_key" ON "User"("Login");
