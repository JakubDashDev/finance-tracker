"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../lib/prismadb";

interface GetUserSummaryResponse {
  income?: number;
  expense?: number;
  error?: string;
}

export async function GetUserSummary(): Promise<GetUserSummaryResponse> {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
    });

    const amounts = transactions.map((transaction) => transaction.amount);

    const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0);
    const expense = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0);

    return { income, expense: Math.abs(expense) };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
