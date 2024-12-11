"use server";

import { Category, Transaction } from "@prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { sortSearch } from "@/helpers/sortSearch";
import { PAGINATION_NUMBER } from "@/const";
import { TransactionsPageSearchParams } from "@/app/transactions/page";
import { redirect } from "next/navigation";

export interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

export interface DefaultSearchParams {
  sort?: string;
  search?: string;
  page?: string;
}

async function getUserSession() {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return session;
}

export async function getSingleCategoryWithTransactions(categoryId: string, searchParams: string) {
  const session = await getUserSession();

  const category = await prisma.category.findFirst({
    where: {
      userId: session.user.id,
      id: categoryId,
    },
  });

  if (!category) redirect("/categories");

  const search = searchParams ?? "";

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      categoryId: category.id,
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } },
      ],
    },

    include: { category: true },
  });

  return { category, transactions };
}

export async function getCategoriesWithTransactions() {
  const session = await getUserSession();

  const result: { category: Category; transactions: Transaction[] }[] = [];

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
    },
  });

  await Promise.all(
    categories.map(async (item) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          categoryId: item.id,
        },
      });

      const final = { category: item, transactions };

      result.push(final);
    })
  );

  return result;
}

export async function getTransactionsForYearSummaryAreaChart(categoryId?: string) {
  const session = await getUserSession();

  const start = new Date(new Date().getFullYear(), 0, 1, 1).toISOString().split("T")[0];
  const end = new Date(new Date().getFullYear(), 11, 31, 1).toISOString().split("T")[0];

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        gt: new Date(start),
        lte: new Date(end),
      },
      categoryId: categoryId,
    },
  });

  const months: { month: number; year: number; name: string; income: number; expense: number }[] = [];

  let current = new Date(start);
  current.setDate(1);

  //NOTE: fill array with correct shape of data
  while (current <= new Date(end)) {
    months.push({
      month: current.getMonth() + 1,
      year: current.getFullYear(),
      name: `${current.getFullYear()}-${current.getMonth() + 1}`,
      income: 0,
      expense: 0,
    });
    current.setMonth(current.getMonth() + 1);
  }

  transactions.forEach((item) => {
    const itemDate = new Date(item.transactionDate);
    const itemMonth = itemDate.getMonth() + 1;
    const itemYear = itemDate.getFullYear();

    const targetMonth = months.find((month) => month.month === itemMonth && month.year === itemYear);

    if (targetMonth) {
      if (item.amount > 0) {
        targetMonth.income += item.amount;
      } else {
        targetMonth.expense += Math.abs(item.amount); //NOTE: using Math.abs for show properly data in chart, there is still expense key
      }
    }
  });

  return months;
}
export async function getTransactionForCategoryChart(categoryId: string) {
  const session = await getUserSession();

  const category = await prisma.category.findFirst({
    where: {
      userId: session.user.id,
      id: categoryId,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      categoryId: categoryId,
    },
  });

  const result = [
    { type: "income", sum: 0 },
    { type: "expense", sum: 0 },
  ];

  transactions.forEach((item) => {
    if (item.amount > 0) {
      result[0].sum += item.amount;
    } else if (item.amount < 0) {
      result[1].sum += item.amount;
    }
  });

  return { result, category };
}

export async function getTransactionForYearChart(start: string, end: string) {
  const session = await getUserSession();

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      transactionDate: {
        gt: new Date(start),
        lte: new Date(end),
      },
    },
  });

  const months: { month: number; year: number; name: string; amount: number }[] = [];

  let current = new Date(start);
  current.setDate(1);

  //NOTE: fill array with correct shape of data
  while (current <= new Date(end)) {
    months.push({
      month: current.getMonth() + 1,
      year: current.getFullYear(),
      name: `${current.getFullYear()}-${current.getMonth() + 1}`,
      amount: 0,
    });
    current.setMonth(current.getMonth() + 1);
  }

  transactions.forEach((item) => {
    const itemDate = new Date(item.transactionDate);
    const itemMonth = itemDate.getMonth() + 1;
    const itemYear = itemDate.getFullYear();

    const targetMonth = months.find((month) => month.month === itemMonth && month.year === itemYear);

    if (targetMonth) {
      targetMonth.amount += item.amount;
    }
  });

  return months;
}

export async function getAllTransactionsWithCount(searchParams: TransactionsPageSearchParams) {
  const session = await getUserSession();

  const search = searchParams?.search ?? "";
  const page = isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page);
  const orderBy = sortSearch(searchParams?.sort) ?? { transactionDate: "desc" };

  const type = searchParams.type ?? "all";
  const categoryId = searchParams.category === "all" ? undefined : searchParams.category;
  const month = searchParams.month;
  const date = month ? new Date(month) : undefined;

  const conditions = {
    AND: [
      { userId: session.user.id },
      { categoryId: categoryId },
      { amount: type === "all" ? undefined : type === "expense" ? { lt: 0 } : { gt: 0 } },
      {
        transactionDate: date
          ? {
              lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
              gte: new Date(date.getFullYear(), date.getMonth(), 1),
            }
          : {},
      },
    ],
    OR: [
      { title: { contains: search } },
      { description: { contains: search } },
      { category: { name: { contains: search } } },
    ],
  };

  const count = await prisma.transaction.count({ where: conditions });
  const transactions = await prisma.transaction.findMany({
    where: conditions,
    orderBy,
    include: { category: true },
    take: PAGINATION_NUMBER,
    skip: (page - 1) * PAGINATION_NUMBER,
  });

  return { count, transactions };
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

export async function getUserTransactionWithCount(currentFilter: Date, searchParams: DefaultSearchParams) {
  const session = await getUserSession();

  const search = searchParams?.search ?? "";
  const page = isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page);
  const orderBy = sortSearch(searchParams?.sort) ?? { transactionDate: "desc" };

  const filters = {
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
  };

  const count = await prisma.transaction.count({
    where: filters,
  });
  const transactions = await prisma.transaction.findMany({
    where: filters,
    orderBy: orderBy,
    include: { category: true },
    take: PAGINATION_NUMBER,
    skip: (page - 1) * PAGINATION_NUMBER,
  });

  return { count, transactions };
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
