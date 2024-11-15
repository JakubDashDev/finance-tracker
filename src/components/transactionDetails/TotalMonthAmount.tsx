import { TransactionWithCategory } from "@/queries/user-transactions";
import React from "react";
import CustomLegend from "../common/CustomLegend";

interface TotalMonthAmountProps {
  transaction: TransactionWithCategory;
  transactionInMonth: TransactionWithCategory[];
}

function TotalMonthAmount({ transaction, transactionInMonth }: TotalMonthAmountProps) {
  const total = transactionInMonth
    .filter((item) => item.id !== transaction.id) //exclude current transaction to show correct data when there is only one transaction
    .reduce((acc, item) => acc + item.amount, 0);

  const transactionProcentage = ((Math.abs(transaction.amount) / Math.abs(total + transaction.amount)) * 100).toFixed(
    0
  );

  return (
    <div>
      <div className="font-light mb-2">
        <p>Total month {transaction.amount > 0 ? "income" : "expense"}:</p>
      </div>

      <div
        className="w-full bg-blue-500 h-[25px] rounded-xl"
        style={{ backgroundColor: transaction.amount > 0 ? "#006fee" : "#f31260" }}
      >
        <div
          className={`w-full bg-green-600 z-10 rounded-xl h-[25px] flex items-center justify-center`}
          style={{ width: `${Number(transactionProcentage) < 3 ? 3 : transactionProcentage}%` }}
        ></div>
      </div>

      <div className="flex flex-row gap-x-6 gap-y-1 flex-wrap my-1 ">
        <CustomLegend color="bg-green-600" title={transaction.title} value={transaction.amount} />
        <CustomLegend color={transaction.amount > 0 ? "bg-blue-500" : "bg-red-500"} title="Other" value={total} />
      </div>
    </div>
  );
}

export default TotalMonthAmount;
