import { Category, Transaction } from "@prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";

export interface UserTransactions extends Transaction {
  category: Category | null;
}

export async function getUserTransaction(currentFilter: Date): Promise<UserTransactions[]> {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return await prisma.transaction.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        {
          transactionDate: {
            lte: new Date(currentFilter.getFullYear(), currentFilter.getMonth() + 1, 0),
            gte: new Date(currentFilter.getFullYear(), currentFilter.getMonth(), 1),
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getUserTransactionWithBalance(currentFilter: Date) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");


  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        {
          transactionDate: {
            lte: new Date(currentFilter.getFullYear(), currentFilter.getMonth() + 1, 0),
            gte: new Date(currentFilter.getFullYear(), currentFilter.getMonth(), 1),
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  

  const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const amounts = transactions.map((transaction) => transaction.amount);
  const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0);

  return { transactions, balance, income, expense };
}
