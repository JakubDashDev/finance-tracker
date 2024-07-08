"use client";
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Spinner color="primary" />;

  if (session && session.user) {
    return (
      <Popover placement="bottom-start" className="min-w-48" backdrop="blur">
        <PopoverTrigger>
          <Avatar isBordered  src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Gracie" className="w-[30px] h-[30px] cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full flex flex-col justify-start items-start px-1 py-2">
            <Button className="text-red-600 w-full" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <div className="flex gap-4">
      <Button variant="flat" onClick={() => signIn()} className="text-white">
        Sign In
      </Button>
      <Button as={Link} href="/signup" variant="flat" className="bg-sky-600 text-white">
        Sign Up
      </Button>
    </div>
  );
}

export default AuthButton;
