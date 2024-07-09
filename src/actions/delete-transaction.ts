"use server";

import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";
import  {auth}  from "../app/api/auth/[...nextauth]";

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
