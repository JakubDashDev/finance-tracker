"use server";

import { z } from "zod";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";

export interface CreateCategoryState {
  errors: {
    color?: string[];
    name?: string[];
    _form?: string[];
  };
  success: boolean;
}

const createCategoryValidation = z.object({
  color: z.string({ message: "This field is required!" }),
  name: z.string({ message: "This field is required!" }).min(1, "This field is required!"),
});

export async function createCategory(
  { categoryId }: { categoryId: undefined },
  formState: CreateCategoryState,
  formData: FormData
): Promise<CreateCategoryState> {
  const color = formData.get("categoryColor");
  const name = formData.get("categoryName");

  const validation = createCategoryValidation.safeParse({
    color,
    name,
  });

  if (!validation.success)
    return {
      errors: validation.error.flatten().fieldErrors,
      success: false,
    };

  const session = await auth();

  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
      success: false,
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: validation.data.name,
        color: validation.data.color,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { errors: {}, success: true };
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
        success: false,
      };
    } else {
      return {
        errors: {
          _form: ["Internal server error"],
        },
        success: false,
      };
    }
  }
}
