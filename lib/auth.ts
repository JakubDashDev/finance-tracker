import { getServerSession } from "next-auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next/types";
import { config } from "./authConfig";

export function auth(
  ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, config);
}
