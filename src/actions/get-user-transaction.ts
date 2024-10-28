"use server";

import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { Category, Transaction } from "@prisma/client";

interface GetUserTransactionResponse {
  transactions?: Transaction[];
  error?: string;
}

export async function getUserTransaction(): Promise<GetUserTransactionResponse> {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return { transactions };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
