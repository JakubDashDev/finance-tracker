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

export async function getAllUserCategories() {
  const session = await getUserSession();

  return await prisma.category.findMany({
    where: { userId: session.user!.id },
  });
}

export async function getSingleCategoryWithTransactions(categoryId: string, searchParams: string) {
  const session = await getUserSession();

  const category = await prisma.category.findFirst({
    where: {
      userId: session.user.id,
      id: categoryId,
    },
  });

  if (!category) redirect("/categories");

  const search = searchParams ?? "";

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
