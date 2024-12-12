import EditTransactionForm from "@/components/transaction/EditTransactionForm";
import TransactionDetailsChart from "@/components/TransactionDetailsChart";
import { getAllTransactions, getTransactionById } from "@/queries/user-transactions";
import { Divider } from "@nextui-org/react";
import React from "react";
import { FaChartSimple, FaCircleInfo } from "react-icons/fa6";

interface TransactionPageProps {
  params: { id: string };
}

async function TransactionPage({ params }: TransactionPageProps) {
  const transaction = await getTransactionById(params.id);

  return (
    <section className="flex flex-col lg:flex-row gap-16 w-11/12 lg:w-4/5 2xl:w-3/5">
      <div className="w-full gap-10 flex flex-col">
        <div>
          <h2 className="capitalize text-2xl font-bold">{transaction.title}</h2>
          <p className=" text-white/50 text-sm font-light mt-1">
            {transaction.description || "There is no description."}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-10">
          <div className="w-full sm:w-8/12 lg:w-4/5 2xl:w-3/5">
            <span className="flex items-center gap-2 font-semibold mb-10">
              <FaChartSimple /> Details
            </span>

            <EditTransactionForm transaction={transaction} />
          </div>

          <div className="w-full sm:8/12 lg:w-full">
            <span className="flex items-center gap-2 font-semibold mb-10">
              <FaCircleInfo /> Information
            </span>

            <div className=" flex-col gap-8 font-normal flex ">
              <div className="flex gap-3 items-center font-light text-sm ">
                <span className="text-white/80">Created At:</span>{" "}
                <span>{transaction.createdAt.toISOString().split("T")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransactionPage;
