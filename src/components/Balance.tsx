import { GetUserBalance } from "@/actions/get-user-balance";
import React from "react";

async function Balance() {
  const { balance, error } = await GetUserBalance();

  return (
    <div className="flex flex-col">
      <h3>Your Balance: </h3>
      <h2 className="text-4xl font-bold flex items-center gap-1">
        <span className={`${balance! >= 0 ? "text-green-500" : "text-red-500"}`}>$</span>
        {balance?.toFixed(2) ?? 0}
      </h2>
      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
}

export default Balance;
