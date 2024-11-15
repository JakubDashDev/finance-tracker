"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  children: React.ReactNode;
  isSuccess?: boolean;
}

function FormButton({ children, isSuccess }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="solid"
      color={isSuccess ? "success" : "primary"}
      type="submit"
      isLoading={pending}
      className="w-full"
    >
      {isSuccess ? "Success" : children}
    </Button>
  );
}

export default FormButton;
