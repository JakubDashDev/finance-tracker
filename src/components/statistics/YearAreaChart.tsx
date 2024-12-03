"use client";

import { getTransactionForYearChart, getTransactionsForYearSummaryAreaChart } from "@/queries/user-transactions";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";

function YearAreaChart() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryFn: () => getTransactionsForYearSummaryAreaChart(),
    queryKey: ["YearAreaChart"],
  });

  if (error) return <span className="text-red-400">{error.message || "Something went wrong. Please try again"}</span>;

  return (
    <div className="w-full bg-stone-700 shadow-md rounded-md p-3 ">
      <div className="w-full flex flex-col xl:flex-row justify-between gap-y-2 ">
        <h2 className="font-bold">Last 12 months summary</h2>

        <div className="flex gap-3">
          TOTAL: 
          <div className="flex gap-1 items-center text-green-500 ">
            <FaArrowUp />${data?.reduce((acc, item) => item.income + acc, 0)}
          </div>
          <span className="flex gap-1 items-center text-red-400">
            <FaArrowDown />${data?.reduce((acc, item) => Math.abs(item.expense) + acc, 0)}
          </span>
        </div>
      </div>
      <div className="flex items-start justify-start w-full my-12 ">
        {isLoading || isFetching ? (
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer height={300}>
            <AreaChart width={730} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#17c964" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#17c964" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f31260" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f31260" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis tick={{ fill: "#ccc" }} dataKey="name" />
              <YAxis tick={{ fill: "#ccc" }} unit="$" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomSelfTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#43e86f" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ff4787" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default YearAreaChart;

const CustomSelfTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  console.log(payload);
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-500 rounded-lg p-5 flex flex-col items-center justify-center ">
        <p className="label">{`${label}`}</p>
        <div>
          {payload.map((item) => (
            <div key={item.name} style={{ display: "inline-block", padding: 10 }}>
              <div className={item.name === "income" ? "text-green-500" : "text-red-300"}>
                ${item.name === "income" ? `+${item.value}` : `-${item.value}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
