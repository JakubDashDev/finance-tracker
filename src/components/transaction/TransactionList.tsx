import React from "react";
import TransactionTable from "./TransactionsTable";
import { getUserTransactionWithBalance, getUserTransactionWithCount } from "@/queries/user-transactions";
import SearchForm from "./SearchForm";

interface TransactionListProps {
  slug: string;
  searchParams: { sort: string; search: string; page: string };
}

async function TransactionList({ slug, searchParams }: TransactionListProps) {
  const { transactions, count } = await getUserTransactionWithCount(new Date(slug), searchParams);

  return (
    <div className="w-full flex flex-col gap-5">
      <SearchForm />
      <TransactionTable transactions={transactions} total={count} />
    </div>
  );
}

export default TransactionList;
