"use server";

import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";

interface GetUserBalanceResponse {
  message?: string;
  error?: string;
}

/**
 * `DELETE` a transaction for the currently authenticated user.
 *
 * @param transactionId The unique ID of the transaction to delete.
 *
 * @returns A `Promise` resolving to an object containing:
 *  - `message`: A success message if the transaction was deleted successfully.
 *  - `error`: An error message if the operation failed.
 */
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
