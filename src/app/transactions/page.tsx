import SearchForm from "@/components/transaction/SearchForm";
import SortSelect from "@/components/transaction/SortSelect";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import { getAllTransactionsWithCount } from "@/queries/user-transactions";
import React from "react";

export interface TransactionsPageProps {
  searchParams: { sort: string; search: string; page: string };
}

async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const { transactions, count } = await getAllTransactionsWithCount(searchParams);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-16">
      <section className="w-11/12 lg:w-4/5 2xl:w-3/5">
        <div className="w-full flex flex-col md:flex-row gap-y-5 justify-between items-center my-5">
          <SearchForm />
          <SortSelect />
        </div>
        <TransactionsTable
          transactions={transactions}
          page={isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page)}
          total={count}
        />
      </section>
    </div>
  );
}

export default TransactionsPage;
