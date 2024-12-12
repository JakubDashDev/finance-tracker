import React from "react";
import TransactionsTable from "./TransactionsTable";
import { getAllTransactions } from "@/queries/user-transactions";
import { TransactionsPageSearchParams } from "@/app/transactions/page";

export interface AllTransactionsListProps {
  searchParams: TransactionsPageSearchParams;
}

async function AllTransactionsList({ searchParams }: AllTransactionsListProps) {
  const transactions = await getAllTransactions(searchParams);

  return <TransactionsTable transactions={transactions} total={transactions.length} />;
}

export default AllTransactionsList;
