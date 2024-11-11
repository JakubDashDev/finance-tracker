import Balance from "@/components/Balance";
import Loader from "@/components/common/Loader";
import Header from "@/components/Header";
import Summary from "@/components/Summary";
import TransactionList from "@/components/transaction/TransactionList";
import { Divider } from "@nextui-org/react";
import React, { Suspense } from "react";
import { auth } from "@/../lib/auth";
import { redirect } from "next/navigation";
import MonthSelector from "@/components/MonthSelector";
import AddTransactionForm from "@/components/transaction/AddTransactionForm";
import SortSelect from "@/components/transaction/SortSelect";

export interface DashboardPageProps {
  params: { slug: string };
  searchParams: { sort: string; search: string };
}

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <>
      <section className="flex flex-col gap-5 w-11/12 lg:w-2/3 xl:w-3/5">
        <div className="w-full gap-10 flex justify-between items-center">
          <h3 className="text-xl">Balance</h3>
          <MonthSelector slug={params.slug} />
        </div>
        <Divider />
        <div className="flex flex-col gap-5 items-center justify-center">
          <Suspense fallback={<Loader />}>
            <Balance slug={params.slug} />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <Summary slug={params.slug} />
          </Suspense>
        </div>
      </section>

      <section>
        <AddTransactionForm slug={params.slug} />
      </section>

      <section className="w-full flex items-center justify-center">
        <div className="flex flex-col gap-5 w-11/12 lg:w-2/3 xl:w-3/5">
          <div className="w-full gap-10 flex justify-between items-center">
            <h3 className="text-xl">History</h3>
            <SortSelect />
          </div>
          <Divider />
          <Suspense fallback={<Loader />} key={searchParams.sort}>
            <TransactionList slug={params.slug} searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
