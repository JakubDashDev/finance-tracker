import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import React from "react";

interface LoginPageProps {
  searchParams: {
    callbackUrl: string | undefined;
    error: string | undefined;
  };
}

function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl, error } = searchParams;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-11/12 md:w-1/2 xl:w-1/4 flex items-center">
        <Link href={callbackUrl || "/"} className="text-white me-auto ">
          {"<--"}
        </Link>
        <h1 className="my-2 text-white font-bold me-auto">ExpenseT</h1>
      </div>
      <div className="w-11/12 md:w-1/2 xl:w-1/4 bg-white p-5 rounded">
        <LoginForm error={error} />
      </div>
    </div>
  );
}

export default LoginPage;
