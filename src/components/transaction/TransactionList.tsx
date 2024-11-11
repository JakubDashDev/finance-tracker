import React from "react";
import TransactionItem from "./TransactionsTable";
import { getUserTransactionWithBalance } from "@/queries/user-transactions";
import SearchForm from "./SearchForm";

interface TransactionListProps {
  slug: string;
  searchParams: { sort: string; search: string };
}

async function TransactionList({ slug, searchParams }: TransactionListProps) {
  const { transactions } = await getUserTransactionWithBalance(new Date(slug), searchParams);

  return (
    <div className="w-full flex flex-col gap-5">
      <SearchForm />
      <TransactionItem transactions={transactions} />
    </div>
  );
}

export default TransactionList;
