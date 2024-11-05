import { DashboardPageProps } from "@/app/dashboard/[slug]/page";
import { getUserTransactionWithBalance } from "@/queries/user-transactions";
import React from "react";

async function Balance({ slug }: { slug: string }) {
  const { balance } = await getUserTransactionWithBalance(new Date(slug.split("T")[0]));

  return (
    <div className="flex flex-col">
      <h2 className="text-4xl font-bold flex items-center gap-1">
        <span className={`${balance! >= 0 ? "text-green-500" : "text-red-500"}`}>$</span>
        {balance?.toFixed(2) ?? 0}
      </h2>
    </div>
  );
}

export default Balance;
