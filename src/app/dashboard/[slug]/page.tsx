import Balance from "@/components/Balance";
import Loader from "@/components/common/Loader";
import Header from "@/components/Header";
import Summary from "@/components/Summary";
import TransactionList from "@/components/TransactionList/TransactionList";
import { Divider } from "@nextui-org/react";
import React, { Suspense } from "react";
import { auth } from "@/../lib/auth";
import { redirect } from "next/navigation";
import MonthSelector from "@/components/MonthSelector";
import AddTransactionForm from "@/components/AddTransaction/AddTransactionForm";

export interface DashboardPageProps {
  params: { slug: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <main className="w-full flex flex-col gap-10 items-center justify-center dark text-white">
      <Header />
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
          <h3 className="text-xl">History</h3>
          <Divider />
          <Suspense fallback={<Loader />}>
            <TransactionList slug={params.slug} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
