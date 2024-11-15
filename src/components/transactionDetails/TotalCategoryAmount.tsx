import { TransactionWithCategory } from "@/queries/user-transactions";
import React from "react";
import CustomLegend from "../common/CustomLegend";

interface TotalCategoryAmountProps {
  transaction: TransactionWithCategory;
  transactionsWithSameCategory: TransactionWithCategory[];
}

function TotalCategoryAmount({ transaction, transactionsWithSameCategory }: TotalCategoryAmountProps) {
  const total = transactionsWithSameCategory
    .filter((item) => item.id !== transaction.id)
    .filter((item) => (transaction.amount > 0 ? item.amount > 0 : item.amount < 0))
    .reduce((acc, item) => acc + item.amount, 0);

  const transactionProcentage = ((Math.abs(transaction.amount) / Math.abs(transaction.amount + total)) * 100).toFixed(
    0
  );

  return (
    <div>
      <div className="font-light mb-2">
        <p>
          Share of transaction in{" "}
          <span className="text-lg font-bold" style={{ color: transaction.category?.color }}>
            {transaction.category?.name}
          </span>{" "}
          {transaction.amount > 0 ? "income:" : "expense:"}
        </p>
      </div>

      <div className="w-full h-[25px] rounded-xl" style={{ backgroundColor: transaction.category?.color || "#006fee" }}>
        <div
          className={`bg-green-600 z-10 rounded-xl h-[25px] overflow-hidden flex items-center justify-center`}
          style={{ width: `${Number(transactionProcentage) < 3 ? 3 : transactionProcentage}%` }}
        ></div>
      </div>

      <div className="flex flex-row gap-x-6 gap-y-1 flex-wrap my-1 ">
        <CustomLegend color="bg-green-600" title={transaction.title} value={transaction.amount} />
        <CustomLegend color={transaction.category?.color || "#006fee"} title="Other" value={total} />
      </div>
    </div>
  );
}

export default TotalCategoryAmount;
