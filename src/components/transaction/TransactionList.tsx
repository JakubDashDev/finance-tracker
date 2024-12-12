import React from "react";
import TransactionTable from "./TransactionsTable";
import { getAllTransactions } from "@/queries/user-transactions";

interface TransactionListProps {
  slug: string;
  searchParams: { sort: string; search: string; page: string };
}

async function TransactionList({ slug, searchParams }: TransactionListProps) {
  const transactions = await getAllTransactions(searchParams, new Date(slug));

  return <TransactionTable transactions={transactions} total={transactions.length} />;
}

export default TransactionList;
