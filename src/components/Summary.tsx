import { getUserTransactionWithBalance } from "@/queries/user-transactions";
import React from "react";

async function Summary({ slug }: { slug: string }) {
  const { income, expense } = await getUserTransactionWithBalance(new Date(slug.split("T")[0]));

  return (
    <div className="w-full md:w-1/3 bg-white/10 shadow-md rounded py-10 px-10 flex justify-center gap-16 text-lg">
      <div className="flex flex-col items-center justify-center">
        <span>INCOME</span>
        <span className="text-green-500">${income?.toFixed(2)}</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span>EXPENSE</span>
        <span className="text-red-400">${expense?.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default Summary;
