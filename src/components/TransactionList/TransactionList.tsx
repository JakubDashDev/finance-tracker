import { getUserTransaction } from "@/actions/get-user-transaction";
import { Divider, Skeleton } from "@nextui-org/react";
import React, { Suspense } from "react";
import TransactionItem from "./TransactionsTable";

async function TransactionList() {
  const { transactions, error } = await getUserTransaction();

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full flex flex-col gap-5">
      <TransactionItem transactions={transactions} />
    </div>
  );
}

export default TransactionList;
