"use client";
import React from "react";
import FormButton from "@/components/common/FormButton";
import { Input, Link } from "@nextui-org/react";
import { useFormState } from "react-dom";
import { signup } from "@/actions/sign-up";

function SignUpForm() {
  const [formState, action] = useFormState(signup, { errors: {} });

  return (
    <form action={action}>
      <div className="flex flex-col gap-4">
        <Input
          name="name"
          id="name"
          type="text"
          label="Your name"
          variant="bordered"
          isInvalid={!!formState.errors.name}
          errorMessage={formState.errors.name?.join(", ")}
        />
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
        <Input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          variant="bordered"
          isInvalid={!!formState.errors.confirmPassword}
          errorMessage={formState.errors.confirmPassword?.join(", ")}
        />
        {formState.errors._form && (
          <p className="bg-red-100 py-2 px-4 rounded text-red-600 text-sm">{formState.errors._form}</p>
        )}
        <FormButton>Sign Up</FormButton>
        <Link href="/login" className="text-blue-600 text-center text-sm underline">
          Already have an account?
        </Link>
      </div>
    </form>
  );
}

export default SignUpForm;
