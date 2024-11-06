import React from "react";
import TransactionItem from "./TransactionsTable";
import { DashboardPageProps } from "@/app/dashboard/[slug]/page";
import { getUserTransactionWithBalance } from "@/queries/user-transactions";

async function TransactionList({ slug }: { slug: string }) {
  const { transactions } = await getUserTransactionWithBalance(new Date(slug));

  return (
    <div className="w-full flex flex-col gap-5">
      <TransactionItem transactions={transactions} />
    </div>
  );
}

export default TransactionList;
