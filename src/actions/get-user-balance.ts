"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../lib/prismadb";

interface GetUserBalanceResponse {
  balance?: number;
  error?: string;
}

export async function GetUserBalance(): Promise<GetUserBalanceResponse> {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
    });

    const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return { balance };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
