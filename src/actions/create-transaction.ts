"use server";

import { number, string, z } from "zod";
import prisma from "../../lib/prismadb";
import { revalidatePath } from "next/cache";
import { auth } from "../../lib/auth";

interface CreateTransactionState {
  errors: {
    title?: string[];
    amount?: string[];
    type?: string[];
    categoryId?: string[];
    description?: string[];
    transactionDate?: string[];
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
  categoryId: string().optional(),
  description: string().optional(),
  transactionDate: string({ message: "Please provide transaction date" }),
});

/**
 * CREATE a new transaction for the currently authenticated user.
 *
 * @param formState The initial state of the form, including error messages and success status.
 * @param formData A `FormData` object containing the form inputs:
 *  - `title`: The title of the transaction (minimum 3 characters).
 *  - `amount`: The amount for the transaction (must be a positive number).
 *  - `type`: The type of transaction, either "income" or "expense".
 *  - `categoryId`: (Optional) The ID of the category associated with the transaction.
 *  - `description`: (Optional) A description of the transaction.
 *  - `transactionDate`: The date of the transaction.
 *
 * @returns A `Promise` resolving to an updated `CreateTransactionState`:
 *  - `errors`: Validation or server errors related to the form.
 *  - `success`: `true` if the transaction was created successfully, otherwise `false`.
 */
export async function createTransaction(
  formState: CreateTransactionState,
  formData: FormData
): Promise<CreateTransactionState> {
  const title = formData.get("title");
  const amount = formData.get("amount");
  const type = formData.get("type");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");
  const transactionDate = formData.get("transactionDate");

  //FORM VALIDATION
  const validation = createTransactionFormValidation.safeParse({
    title,
    amount,
    type,
    categoryId,
    description,
    transactionDate,
  });

  if (!validation.success)
    return {
      errors: validation.error.flatten().fieldErrors,
      success: false,
    };
  //FORM VALIDATION

  //USER VALIDATION
  const session = await auth();

  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
      success: false,
    };
  }
  //USER VALIDATION

  //CREATE RECORD
  try {
    await prisma.transaction.create({
      data: {
        title: validation.data.title,
        amount:
          validation.data.type === "expense" ? -Math.abs(validation.data.amount) : Math.abs(validation.data.amount),
        description: validation.data.description,
        userId: session.user.id!,
        categoryId: validation.data.categoryId || null,
        transactionDate: new Date(validation.data.transactionDate!).toISOString() || new Date().toISOString(),
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
  //CREATE RECORD
}
