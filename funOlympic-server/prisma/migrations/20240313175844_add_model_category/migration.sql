-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "sport" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);
