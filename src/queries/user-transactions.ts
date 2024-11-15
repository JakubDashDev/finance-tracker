"use server";

import { Category, Transaction } from "@prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { sortSearch } from "@/helpers/sortSearch";

export interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

export async function getUserTransaction(currentFilter: Date): Promise<TransactionWithCategory[]> {
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

export async function getUserTransactionWithBalance(
  currentFilter: Date,
  searchParams?: { sort?: string; search?: string }
) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  //sort
  const orderBy = sortSearch(searchParams?.sort);

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

export async function getTransactionById(id: string) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return await prisma.transaction.findFirstOrThrow({
    where: { AND: [{ userId: session.user.id }, { id: id }] },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTransactionsByCategory(categoryId: string | null) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!categoryId) return;

  return await prisma.transaction.findMany({
    where: { AND: [{ userId: session.user.id }, { categoryId: categoryId }] },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTrasnactionsByDate(date: Date) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!date) throw new Error("Date is required!");

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
      },
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTransactionByDateAndCategory(date: Date, categoryId: string) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!date || !categoryId) throw new Error("Params are required!");

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
      },
      categoryId: categoryId,
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTransactionsByDateAndOnlyIncome(date: Date) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!date) throw new Error("Date is required!");

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
      },
      amount: {
        gt: 0,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTransactionByDateAndCategoryOnlyIncome(date: Date, categoryId: string) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!date || !categoryId) throw new Error("Params are required!");

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
      },
      categoryId: categoryId,
      amount: {
        gt: 0,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTransactionsByDateAndOnlyExpense(date: Date) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!date) throw new Error("Date is required!");

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
      },
      amount: {
        lt: 0,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getTransactionByDateAndCategoryOnlyExpense(date: Date, categoryId: string) {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  if (!date || !categoryId) throw new Error("Params are required!");

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
      },
      categoryId: categoryId,
      amount: {
        lt: 0,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}
