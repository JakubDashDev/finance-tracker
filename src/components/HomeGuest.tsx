import React from "react";
import AuthButton from "./AuthButton";
import { Button } from "@nextui-org/react";
import Link from "next/link";

function HomeGuest() {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-64 text-white">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="text-lg">Please sign in to manage your transaction</p>
      <div className="mt-4">
        <Button as={Link} href="/login" variant="solid" color="primary" className="min-w-32">
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default HomeGuest;
