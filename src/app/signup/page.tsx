import SignUpForm from "@/components/SignUpForm";
import Link from "next/link";
import React from "react";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

async function SignUpPage() {
  const session = await auth();

  if (session?.user) redirect(`/dashboard/${new Date().toISOString()}`);
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-11/12 md:w-1/2 xl:w-1/4 flex items-center">
        <Link href="/" className="text-white me-auto ">
          {"<--"}
        </Link>
        <h1 className="my-2 text-white font-bold me-auto">ExpenseT</h1>
      </div>
      <div className="w-11/12 md:w-1/2 xl:w-1/4 bg-white p-5 rounded">
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
