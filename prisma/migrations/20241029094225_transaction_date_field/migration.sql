/*
  Warnings:

  - Added the required column `transactionDate` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL;
