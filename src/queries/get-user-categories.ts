"use server";

import { getUserSession } from "@/helpers/getUserSession";
import prisma from "../../lib/prismadb";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface GetUserCategories {
  categories?: Category[];
  error?: string;
}

export async function GetUserCategories(): Promise<GetUserCategories> {
  const { user, error } = await getUserSession();

  if (error) return { error };

  try {
    const categories = await prisma.category.findMany({
      where: { userId: user!.id },
    });

    return { categories };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
