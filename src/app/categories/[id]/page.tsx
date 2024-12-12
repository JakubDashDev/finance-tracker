import CategoryPageBody from "@/components/categoryPage/CategoryPageBody";
import YearAreaChart from "@/components/statistics/YearAreaChart";
import AddTransactionForm from "@/components/transaction/AddTransactionForm";
import SearchForm from "@/components/transaction/SearchForm";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import { getSingleCategoryWithTransactions } from "@/queries/user-categories";
import { Divider } from "@nextui-org/react";
import React from "react";

interface TransactionPageProps {
  params: { id: string };
  searchParams: { search: string; page: string };
}

async function CategoriesPageDetails({ params, searchParams }: TransactionPageProps) {
  const { category, transactions } = await getSingleCategoryWithTransactions(params.id, searchParams.search);

  return (
    <div className="flex flex-col gap-16 w-11/12 lg:w-4/5 2xl:w-3/5">
      <section className="flex flex-col gap-5 ">
        <h2 className="text-xl">Category</h2>
        <Divider />

        <CategoryPageBody category={category} />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-xl">Transactions</h2>
        <Divider />
        <div className="flex flex-col sm:flex-row gap-5 justify-between">
          <SearchForm />
          <AddTransactionForm defaultCategory={category} />
        </div>
        <TransactionsTable transactions={transactions} total={transactions.length} page={Number(searchParams.page)} />
      </section>

      <section className="flex flex-col gap-5 min-h-[300px]">
        <h2 className="text-xl">Chart</h2>
        <Divider />

        <YearAreaChart categoryId={category.id} />
      </section>
    </div>
  );
}

export default CategoriesPageDetails;
