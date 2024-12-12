"use client";

import { DateRangePicker, DateValue, RangeValue, Spinner } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";
import { getTransactionForYearChart } from "@/queries/user-transactions-forChart";

function YearChart() {
  const router = useRouter();
  const defaultValue = useMemo(
    () => ({
      start: parseDate(new Date(new Date().getFullYear(), 0, 1, 1).toISOString().split("T")[0]),
      end: parseDate(new Date(new Date().getFullYear(), 11, 31, 1).toISOString().split("T")[0]),
    }),
    []
  );

  const [calendarValue, setCalendarValue] = useState<RangeValue<DateValue>>(defaultValue);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryFn: () =>
      getTransactionForYearChart(
        `${calendarValue.start.month}-${calendarValue.start.day}-${calendarValue.start.year}`,
        `${calendarValue.end.month}-${calendarValue.end.day}-${calendarValue.end.year}`
      ),
    queryKey: ["YearChartTransactions"],
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refetch();
      window.localStorage.setItem("calendarValue", JSON.stringify(calendarValue));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [calendarValue, refetch]);

  const COLORS = ["#f31260", "#17c964"];

  if (error) return <span className="text-red-400">{error.message || "Something went wrong. Please try again"}</span>;

  return (
    <div className="w-full bg-stone-700 shadow-md rounded-md p-3 ">
      <div className="w-full flex flex-col md:flex-row gap-y-2 justify-center md:justify-between items-center ">
        <h2 className="font-bold">Date Range</h2>
        <div className="flex flex-col gap-1 items-start">
          <DateRangePicker
            className="max-w-xs"
            aria-label="date range"
            labelPlacement="outside"
            value={calendarValue}
            onChange={setCalendarValue}
          />
          {JSON.stringify(defaultValue) !== JSON.stringify(calendarValue) && (
            <button
              type="button"
              onClick={() => setCalendarValue(defaultValue)}
              className="text-sm text-blue-300 underline"
            >
              Back to current year
            </button>
          )}
        </div>
      </div>
      <div className="flex items-start justify-start w-full my-12 ">
        {isLoading || isFetching ? (
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer height={200}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid />
              <XAxis tick={{ fill: "#ccc" }} dataKey="name" />
              <YAxis tick={{ fill: "#ccc" }} unit="$" />
              <Tooltip content={<CustomSelfTooltip />} />
              <ReferenceLine y={0} stroke="#f5a524" />
              <Bar dataKey="amount" fill="#a7acb1" unit="$">
                {data!.map((entry, index) => {
                  const color = entry.amount > 0 ? COLORS[1] : COLORS[0];
                  return (
                    <Cell
                      key={entry.name}
                      fill={color}
                      onClick={() => router.push(`/dashboard/${entry.year}-${entry.month}-01`)}
                      className="cursor-pointer"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default YearChart;

function CustomSelfTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-500 rounded-lg p-5 flex flex-col items-center justify-center ">
        <p className="label">{`${label}`}</p>
        <div>
          {payload.map((item) => (
            <div key={item.name} style={{ display: "inline-block", padding: 10 }}>
              <div className={item.value > 0 ? "text-green-500" : "text-red-300"}>
                ${item.value > 0 ? `+${item.value}` : `${item.value}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
