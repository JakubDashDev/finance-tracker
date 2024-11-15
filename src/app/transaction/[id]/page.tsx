import EditTransactionForm from "@/components/transaction/EditTransactionForm";
import TotalCategoryAmount from "@/components/transactionDetails/TotalCategoryAmount";
import TotalMonthAmount from "@/components/transactionDetails/TotalMonthAmount";
import {
  getTransactionById,
  getTransactionsByCategory,
  getTransactionsByDateAndOnlyExpense,
  getTransactionsByDateAndOnlyIncome,
} from "@/queries/user-transactions";
import Link from "next/link";
import React from "react";
import { FaChartSimple, FaCircleInfo } from "react-icons/fa6";

interface TransactionPageProps {
  params: { id: string };
}

async function TransactionPage({ params }: TransactionPageProps) {
  const transaction = await getTransactionById(params.id);
  const transactionsIncomeInMonth =
    transaction.amount > 0
      ? await getTransactionsByDateAndOnlyIncome(transaction.transactionDate)
      : await getTransactionsByDateAndOnlyExpense(transaction.transactionDate);
  const transactionsWithSameCategory = await getTransactionsByCategory(transaction.categoryId);

  return (
    <section className="flex flex-col lg:flex-row gap-16 w-11/12 lg:w-4/5 2xl:w-3/5">
      <div className="w-full gap-10 flex flex-col">
        <div>
          <h2 className="capitalize text-2xl font-bold">{transaction.title}</h2>
          <p className=" text-white/80 text-sm capitalize mt-1">{transaction.description}</p>
        </div>

        <div className="w-full grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-10">
          <div className="w-full sm:w-8/12 lg:w-4/5 2xl:w-3/5">
            <span className="flex items-center gap-2 font-semibold mb-10">
              <FaCircleInfo /> Information
            </span>

            <EditTransactionForm transaction={transaction} />
          </div>

          <div className="w-full sm:8/12 lg:w-3/5">
            <span className="flex items-center gap-2 font-semibold mb-10">
              <FaChartSimple /> Details
            </span>

            <div className="flex flex-col gap-8">
              <TotalMonthAmount transaction={transaction} transactionInMonth={transactionsIncomeInMonth} />

              {transactionsWithSameCategory ? (
                <TotalCategoryAmount
                  transaction={transaction}
                  transactionsWithSameCategory={transactionsWithSameCategory}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 font-light mb-2">
                  <p>
                    Share of transaction in <span className="text-lg font-bold">Category</span>{" "}
                    {transaction.amount > 0 ? "income:" : "expense:"}
                  </p>
                  <p className="text-white/60 ">Please set category to see this statistic.</p>
                </div>
              )}
            </div>

            {/* <p className="w-full text-center mt-24">
              For more statistics visit{" "}
              <Link href="/stats" className="text-blue-500 underline">
                Statistics Page
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransactionPage;
