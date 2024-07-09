import NextAuth from "next-auth/next";
import { config } from "../../../../../lib/authConfig";

const handler = NextAuth(config);

export { handler as GET, handler as POST };
