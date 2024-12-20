import TableLoader from "@/components/common/TableLoader";
import AddTransactionForm from "@/components/transaction/AddTransactionForm";
import AllTransactionsList from "@/components/transaction/AllTransactionsList";
import Filters from "@/components/transaction/Filters";
import SearchForm from "@/components/transaction/SearchForm";
import SortSelect from "@/components/transaction/SortSelect";
import React, { Suspense } from "react";

export interface TransactionsPageSearchParams {
  sort?: string;
  search?: string;
  page?: string;
  type?: string;
  category?: string;
}

export interface TransactionsPageProps {
  searchParams: TransactionsPageSearchParams;
}

function TransactionsPage({ searchParams }: TransactionsPageProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-16">
      <section className="w-11/12 lg:w-4/5 2xl:w-3/5">
        <div className="w-full flex flex-col md:flex-row gap-y-5 justify-between items-center my-5">
          <SearchForm />
          <SortSelect />
        </div>
        <div className="flex flex-col sm:flex-row gap-3  justify-between my-5">
          <Filters />
          <AddTransactionForm />
        </div>
        <Suspense fallback={<TableLoader />} key={JSON.stringify(searchParams)}>
          <AllTransactionsList searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

export default TransactionsPage;
