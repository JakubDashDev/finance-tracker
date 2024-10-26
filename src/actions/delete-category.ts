"use server";

import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";

interface DeleteTransaction {
  message?: string;
  error?: string;
}

export async function DeleteCategory(categoryId: string) {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
    });

    return { message: "success!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
