"use server";

import { User } from "@prisma/client";
import { auth } from "../../lib/auth";

interface GetUserSession {
  user?: User;
  error?: string;
}

export async function getUserSession(): Promise<GetUserSession> {
  const session = await auth();

  if (!session || !session.user) return { error: "You need to be sign in to do this!" };

  return { user: session.user as User };
}
