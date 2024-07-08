"use client";
import { Input } from "@nextui-org/react";
import React, { useRef } from "react";
import FormButton from "./common/FormButton";
import Link from "next/link";
import { login } from "@/actions/login";
import { useFormState } from "react-dom";

function LoginForm() {
  const [formState, action] = useFormState(login, { errors: {} });

  return (
    <form action={action}>
      <div className="flex flex-col gap-4">
        <Input
          name="email"
          id="email"
          type="text"
          label="Email"
          variant="bordered"
          isInvalid={!!formState.errors.email}
          errorMessage={formState.errors.email?.join(", ")}
        />
        <Input
          name="password"
          id="password"
          type="password"
          label="Password"
          variant="bordered"
          isInvalid={!!formState.errors.password}
          errorMessage={formState.errors.password?.join(", ")}
        />
        {!!formState.errors._form && (
          <p className="text-red-600 bg-red-100 py-2 px-4 rounded text-sm">{formState.errors._form}</p>
        )}
        <FormButton>Sign In</FormButton>
        <Link href="/signup" className="text-blue-600 text-center text-sm underline">
          Dont have account yet?
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
