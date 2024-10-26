"use server";

import { z } from "zod";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";

export interface UpdateCategoryState {
  errors: {
    color?: string[];
    name?: string[];
    _form?: string[];
  };
  success: boolean;
}

const updateCategoryValidation = z.object({
  color: z.string({ message: "This field is required!" }),
  name: z.string({ message: "This field is required!" }).min(1, "This field is required!"),
});

export async function updateCategory(
  { categoryId }: { categoryId: string },
  formState: UpdateCategoryState,
  formData: FormData
): Promise<UpdateCategoryState> {
  const color = formData.get("categoryColor");
  const name = formData.get("categoryName");

  const validation = updateCategoryValidation.safeParse({
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
    await prisma.category.update({
      data: {
        name: validation.data.name,
        color: validation.data.color,
      },
      where: { id: categoryId },
    });

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
