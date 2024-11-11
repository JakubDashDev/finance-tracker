import EditTransactionForm from "@/components/transaction/EditTransactionForm";
import { getTransactionById, getTransactionsByCategory } from "@/queries/user-transactions";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaChartArea, FaChartSimple, FaCircleInfo } from "react-icons/fa6";

interface TransactionPageProps {
  params: { id: string };
}

async function TransactionPage({ params }: TransactionPageProps) {
  const transaction = await getTransactionById(params.id);
  const transactionsWithSameCategory = await getTransactionsByCategory(transaction.categoryId);

  return (
    <section className="flex flex-col gap-12 w-11/12 lg:w-2/3 xl:w-3/5">
      <div className="">
        <h2 className="capitalize text-3xl font-semibold mb-2">{transaction.title}</h2>
        <p className="text-white/50 font-light text-sm">
          {transaction.description || "There is no description for this transaction."}
        </p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-24 ">
        <div className="w-full flex flex-col gap-5">
          <span className="flex items-center gap-2 font-semibold text-lg">
            <FaCircleInfo className="text-white/70" /> Information
          </span>

          <EditTransactionForm transaction={transaction} />
        </div>

        <div className="w-full flex flex-col ">
          <span className="flex items-center gap-2 font-semibold text-lg">
            <FaChartSimple className="text-white/70" /> Statystics
          </span>

          {transactionsWithSameCategory?.map((item) => item.title)}
        </div>
      </div>
    </section>
  );
}

export default TransactionPage;
