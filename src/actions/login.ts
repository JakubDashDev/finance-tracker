"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginFormValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface LoginFormState {
  errors: {
    email?: string[];
    password?: string[];
    _form?: string;
  };
}

export async function login(formState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const validation = loginFormValidation.safeParse({ email, password });

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const res = await signIn("login", {
    email,
    password,
    redirect: false,
  });

  if (!res?.ok) return { errors: { _form: res?.error || undefined } };

  redirect("/dashboard");
}
