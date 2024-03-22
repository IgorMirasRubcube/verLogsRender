/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transfers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `birth_date` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transfers" DROP CONSTRAINT "Transfers_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Transfers" DROP CONSTRAINT "Transfers_toId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "complement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "agency" TEXT,
ADD COLUMN     "balance" DECIMAL(13,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "block_date" TIMESTAMP(3),
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "addressId" DROP NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Transactions";

-- DropTable
DROP TABLE "Transfers";

-- DropEnum
DROP TYPE "EnumStatusAccount";

-- DropEnum
DROP TYPE "StatementType";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "from_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,
    "value" DECIMAL(13,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
