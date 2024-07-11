import AddTransaction from "@/components/AddTransaction/AddTransaction";
import Balance from "@/components/Balance";
import Loader from "@/components/common/Loader";
import Header from "@/components/Header";
import Summary from "@/components/Summary";
import TransactionList from "@/components/TransactionList/TransactionList";
import { Divider } from "@nextui-org/react";
import React, { Suspense } from "react";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <main className="w-full flex flex-col gap-10 items-center justify-center dark text-white">
      <Header />
      <section className="text-white flex flex-col justify-center mt-5 gap-4">
        <h1 className="text-xl font-bold">
          Welcome, <span className="text-sky-500">{session.user.name || session.user?.email}</span>
        </h1>
        <Suspense fallback={<Loader />}>
          <Balance />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <Summary />
        </Suspense>
      </section>

      <section>
        <AddTransaction />
      </section>

      <section className="w-full flex items-center justify-center">
        <div className="flex flex-col gap-5 w-11/12 md:w-1/2 lg:w-1/3 xl:w-3/5">
          <h3 className="text-xl">History</h3>
          <Divider />
          <Suspense fallback={<Loader />}>
            <TransactionList />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
