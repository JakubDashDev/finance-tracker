"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { string, z } from "zod";

const signUpFormValidation = z
  .object({
    name: string().min(2),
    email: string().email(),
    password: string().min(8),
    confirmPassword: string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface SignUpFormState {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string;
  };
}

export async function signup(formState: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const validation = signUpFormValidation.safeParse({ name, email, password, confirmPassword });

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const res = await signIn("signup", {
    name,
    email,
    password,
    confirmPassword,
    redirect: false,
  });

  if (!res?.ok) return { errors: { _form: res?.error || undefined } };

  redirect("/dashboard");
}
