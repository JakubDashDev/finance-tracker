"use server";

import { getUserSession } from "@/helpers/getUserSession";
import prisma from "../../lib/prismadb";
import { auth } from "../../lib/auth";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface GetUserCategories {
  categories?: Category[];
  error?: string;
}

export async function GetUserCategories() {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized!");

  return await prisma.category.findMany({
    where: { userId: session.user!.id },
  });
}
