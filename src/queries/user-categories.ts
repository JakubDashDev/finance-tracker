"use server";

import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { Category, Transaction } from "@prisma/client";

async function getUserSession() {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return session;
}

/**
 * GET all categories associated with the currently logged-in user.
 *
 * @returns A Promise resolving to an array of category objects.
 */
export async function getAllUserCategories() {
  const session = await getUserSession();

  return await prisma.category.findMany({
    where: { userId: session.user!.id },
  });
}

/**
 * GET a single category along with its associated transactions for the currently logged-in user.
 *
 * @param categoryId The unique ID of the category to retrieve.
 * @param searchQuery? A search term to filter transactions by title, description, or category name. If not provided, all transactions for the category will be returned.
 *
 * @returns A Promise resolving to an object containing:
 *  - `category`: The retrieved category object.
 *  - `transactions`: An array of transactions associated with the category, filtered by the search query if provided.
 */
export async function getSingleCategoryWithTransactions(categoryId: string, searchQuery?: string) {
  const session = await getUserSession();

  const category = await prisma.category.findFirst({
    where: {
      userId: session.user.id,
      id: categoryId,
    },
  });

  if (!category) redirect("/categories");

  const search = searchQuery ?? "";

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      categoryId: category.id,
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } },
      ],
    },

    include: { category: true },
  });

  return { category, transactions };
}

/**
 * GET all categories for the currently logged-in user, along with their associated transactions.
 *
 * @returns A Promise resolving to an array of objects, where each object contains:
 *  - `category`: A category object belonging to the user.
 *  - `transactions`: An array of transactions associated with the category.
 */
export async function getCategoriesWithTransactions() {
  const session = await getUserSession();

  const result: { category: Category; transactions: Transaction[] }[] = [];

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
    },
  });

  await Promise.all(
    categories.map(async (item) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          categoryId: item.id,
        },
      });

      const final = { category: item, transactions };

      result.push(final);
    })
  );

  return result;
}
