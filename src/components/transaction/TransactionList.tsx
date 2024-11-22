import React from "react";
import TransactionTable from "./TransactionsTable";
import { getUserTransactionWithCount } from "@/queries/user-transactions";

interface TransactionListProps {
  slug: string;
  searchParams: { sort: string; search: string; page: string };
}

async function TransactionList({ slug, searchParams }: TransactionListProps) {
  const { transactions, count } = await getUserTransactionWithCount(new Date(slug), searchParams);

  return <TransactionTable transactions={transactions} total={count} />;
}

export default TransactionList;
