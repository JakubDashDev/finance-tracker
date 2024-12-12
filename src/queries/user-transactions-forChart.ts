"use server";

import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";

async function getUserSession() {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return session;
}

/**
 * Get Transactions and prepare data to chart friendly strucutre
 *
 * @param categoryId? The uniqe Category id
 * @returns The chart friendly array
 * @use It was prepared with the intention of being used in YearAreaChart.tsx.
 */
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

/**
 * Get Transactions and prepare data to chart friendly strucutre
 *
 * @param categoryId? The uniqe Category id
 * @returns The chart friendly array
 * @use It was prepared with the intention of being used in CategoryChart.tsx
 */
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

/**
 * Get Transactions and prepare data to chart friendly strucutre
 *
 * @param start The first day of the period for which we want to find the data
 * @param end The last day of the period for which we want to find the data
 * @returns The chart friendly array
 * @use It was prepared with the intention of being used in YearChart.tsx
 */
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
