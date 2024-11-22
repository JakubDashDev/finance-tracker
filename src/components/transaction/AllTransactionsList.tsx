import React from "react";
import TransactionsTable from "./TransactionsTable";
import { getAllTransactionsWithCount } from "@/queries/user-transactions";
import { TransactionsPageSearchParams } from "@/app/transactions/page";

export interface AllTransactionsListProps {
  searchParams: TransactionsPageSearchParams;
}

async function AllTransactionsList({ searchParams }: AllTransactionsListProps) {
  const { transactions, count } = await getAllTransactionsWithCount(searchParams);

  return <TransactionsTable transactions={transactions} total={count} />;
}

export default AllTransactionsList;
