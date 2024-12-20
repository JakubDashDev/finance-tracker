import CredentialsProvider from "next-auth/providers/credentials";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession, NextAuthOptions } from "next-auth";
import { compare, hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";
import prisma from "./prismadb";

export const config = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "login",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user
          .findUnique({
            where: { email: credentials?.email },
          })
          .catch((error) => {
            if (error instanceof Error) {
              throw new Error(error.message);
            } else {
              throw new Error("Internal server error");
            }
          });

        if (user && (await compare(credentials?.password as string, user.password))) {
          return { name: user.name, id: user.id, email: user.email, image: user.image };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
    CredentialsProvider({
      id: "signup",
      type: "credentials",
      credentials: {
        name: {},
        email: {},
        password: {},
        confirmPassword: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.name || !credentials?.email || !credentials.password || !credentials.confirmPassword)
          return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });

        if (user) throw new Error("User with this email already exisits");

        const hashedPassword = await hash(credentials?.password as string, 10);

        try {
          const newUser = await prisma.user.create({
            data: {
              name: credentials.name,
              email: credentials.email,
              password: hashedPassword,
              Category: {
                createMany: {
                  data: [
                    { name: "food", color: "#edbe2f" },
                    { name: "car", color: "#ed2fbe" },
                    { name: "home", color: "#2f68ed" },
                    { name: "pleasure", color: "#2f7bed" },
                  ],
                },
              },
            },
          });

          if (newUser) {
            return { name: newUser.name, id: newUser.id, email: newUser.email, image: newUser.image };
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Internal server error");
          }
        }

        revalidatePath("/");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600000, //1 hour
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (!!user) token.user = user;

      if (trigger && session) {
        token = { ...token, user: session };
        return token;
      }
      return token;
    },
    //usually not neded, here we are fixing bug in nextauth
    async session(props) {
      return {
        ...props.session,
        user: {
          ...(props.token.user as User),
          id: props.token.sub,
        },
      };
    },
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;
