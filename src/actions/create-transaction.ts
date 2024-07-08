"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { number, string, z } from "zod";
import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";

interface CreateTransactionState {
  errors: {
    title?: string[];
    amount?: string[];
    type?: string[];
    description?: string[];
    _form?: string[];
  };
  success: boolean;
}

const createTransactionFormValidation = z.object({
  title: string({ message: "Please enter title that have at least 3 characters" }).min(
    3,
    "Please enter title that have at least 3 characters"
  ),
  amount: z.coerce
    .number({ message: "Please enter a number" })
    .positive("Value have to be positive")
    .multipleOf(0.01, "Please enter correct value"),
  type: string().min(1, "Please selet an option"),
  description: string().optional(),
});

export async function createTransaction(
  formState: CreateTransactionState,
  formData: FormData
): Promise<CreateTransactionState> {
  const title = formData.get("title");
  const amount = formData.get("amount");
  const type = formData.get("type");
  const description = formData.get("description");

  //⬇️FORM VALIDATION⬇️
  const validation = createTransactionFormValidation.safeParse({
    title,
    amount,
    type,
    description,
  });

  if (!validation.success)
    return {
      errors: validation.error.flatten().fieldErrors,
      success: false,
    };
  //⬆️FORM VALIDATION⬆️

  //⬇️USER VALIDATION⬇️
  const session = await auth();

  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
      success: false,
    };
  }
  //⬆️USER VALIDATION⬆️

  //⬇️CREATE RECORD⬇️
  try {
    await prisma.transaction.create({
      data: {
        title: validation.data.title,
        amount:
          validation.data.type === "expense" ? -Math.abs(validation.data.amount) : Math.abs(validation.data.amount),
        description: validation.data.description,
        userId: session.user.id!,
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
  //⬆️CREATE RECORD⬆️
}
