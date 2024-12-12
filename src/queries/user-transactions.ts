"use server";

import { Category, Transaction } from "@prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { sortSearch, SortValue } from "@/helpers/sortSearch";
import { PAGINATION_NUMBER } from "@/const";
import { TransactionsPageSearchParams } from "@/app/transactions/page";

export interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

async function getUserSession() {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return session;
}

/**
 * GET a list of transactions linked to the currently logged-in user
 *
 * @param searchParams Optional search and filtering parameters:
 *  - `search`: A search term.
 *  - `page`: The page number for pagination.
 *  - `sort`: Specifies the sorting order of the results.
 *  - `type`: Specifies the type of transactions to retrieve.
 *  - `category`: The category ID to filter by.
 * @param dateFilter An optional date used to filter transactions. The function determines the range
 * between the first and last day of the month for the given date.
 *
 * @returns A Promise resolving to an array of transaction objects, each including its associated category.
 */
export async function getAllTransactions(searchParams?: TransactionsPageSearchParams, dateFilter?: Date) {
  const session = await getUserSession();

  //NOTE: all possible search params
  const search = searchParams?.search ?? "";
  const page = isNaN(Number(searchParams?.page)) ? 1 : Number(searchParams?.page);
  const orderBy = sortSearch(searchParams?.sort as SortValue) ?? { transactionDate: "desc" };
  const type = searchParams?.type ?? "all";
  const categoryId = searchParams?.category === "all" ? undefined : searchParams?.category;

  const conditions = {
    AND: [
      { userId: session.user.id },
      { categoryId: categoryId },
      { amount: type === "all" ? undefined : type === "expense" ? { lt: 0 } : { gt: 0 } },
      {
        transactionDate: {
          lte: dateFilter && new Date(dateFilter.getFullYear(), dateFilter.getMonth() + 1, 0),
          gte: dateFilter && new Date(dateFilter.getFullYear(), dateFilter.getMonth(), 1),
        },
      },
    ],
    OR: [
      { title: { contains: search } },
      { description: { contains: search } },
      { category: { name: { contains: search } } },
    ],
  };

  return await prisma.transaction.findMany({
    where: conditions,
    orderBy,
    include: { category: true },
    take: PAGINATION_NUMBER,
    skip: (page - 1) * PAGINATION_NUMBER,
  });
}

/**
 * GET a user's transactions for a specific month along with financial summaries.
 *
 * @param currentFilter A `Date` object specifying the month to filter transactions.
 * Transactions within the given month's range will be included.
 * 
 * @param searchParams Optional search and sorting parameters:
 *  - `sort`: Sorting criteria.
 *  - `search`: A search term.
 *
 * @returns An object containing:
 *  - `transactions`: The list of transactions matching the filter.
 *  - `balance`: The total balance of all transactions.
 *  - `income`: The total income from positive transaction amounts.
 *  - `expense`: The total expense from negative transaction amounts.

 */
export async function getUserTransactionWithBalance(
  currentFilter: Date,
  searchParams?: { sort?: string; search?: string }
) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  //sort
  const orderBy = sortSearch(searchParams?.sort as SortValue);

  //search
  const search = searchParams?.search ?? "";

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
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } },
      ],
    },
    orderBy,
    include: { category: true },
  });

  const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const amounts = transactions.map((transaction) => transaction.amount);
  const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0);

  return { transactions, balance, income, expense };
}

/**
 * GET a single transaction by its ID for the currently logged-in user.
 *
 * @param id The unique id of the transaction to retrieve.
 *
 * @returns A Promise resolving to the transaction object, including its associated category.

 */
export async function getTransactionById(id: string) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return await prisma.transaction.findFirstOrThrow({
    where: { AND: [{ userId: session.user.id }, { id: id }] },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}
