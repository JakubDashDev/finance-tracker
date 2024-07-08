import { GetUserSummary } from "@/actions/get-user-summary";
import React from "react";

async function Summary() {
  const { income, expense, error } = await GetUserSummary();

  return (
    <div className="w-full bg-white/10 shadow-md rounded py-10 px-10 flex items-center gap-16 text-lg">
      <div className="flex flex-col items-center justify-center">
        <span>INCOME</span>
        <span className="text-green-500">${income?.toFixed(2)}</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span>EXPENSE</span>
        <span className="text-red-400">${expense?.toFixed(2)}</span>
      </div>
      {error && <span className="text-red-400">Error: {error}</span>}
    </div>
  );
}

export default Summary;
