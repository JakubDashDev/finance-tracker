"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";

/**
 * `DELETE` a category for the currently authenticated user.
 *
 * @param categoryId The unique identifier of the category to delete.
 * @param pathToRevalidate (Optional) A path to revalidate after the category is deleted.
 *
 * @returns A Promise resolving to an object with:
 *  - `message`: A success message if the category was deleted successfully.
 *  - `error`: An error message if the operation failed.
 */
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
