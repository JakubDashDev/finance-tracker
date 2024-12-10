"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";

export async function deleteCategory(categoryId: string, pathToRevalidate?: string) {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
    });

    pathToRevalidate && revalidatePath(pathToRevalidate);

    return { message: "success!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
