"use server";

import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";

interface GetUserBalanceResponse {
  message?: string;
  error?: string;
}

export async function DeleteTransaction(transactionId: string): Promise<GetUserBalanceResponse> {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  try {
    await prisma.transaction.delete({
      where: {
        id: transactionId,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { message: "success!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
