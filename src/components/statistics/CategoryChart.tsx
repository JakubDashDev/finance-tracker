"use client";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import CategorySelect from "../category/CategorySelect";
import { useSearchParams } from "next/navigation";
import { getTransactionForCategoryChart } from "@/queries/user-transactions-forChart";

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#fff" style={{ textTransform: "capitalize" }}>
        {payload.type}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.type === "expense" ? "#f2291b" : "#00ad11"}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.type === "expense" ? "#f2291b" : "#00ad11"}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={payload.type === "expense" ? "#f2291b" : "#00ad11"}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill={payload.type === "expense" ? "#f2291b" : "#00ad11"} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`$${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function CategoryChart() {
  const searchParams = useSearchParams();

  const [currentCategory, setCurrentCateogry] = useState<string>("");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryFn: () => getTransactionForCategoryChart(currentCategory),
    queryKey: ["MostPopularCategoryChart"],
    enabled: currentCategory.length > 0,
  });

  useEffect(() => {
    refetch();
  }, [currentCategory, refetch]);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  if (error) return <span className="text-red-400">{error.message || "Something went wrong. Please try again"}</span>;

  const renderData = () => {
    if (currentCategory.length == 0) {
      return <span className="w-full my-24 text-center">Please select category to see chart.</span>;
    } else if ((data && data.result[0].sum === 0 && data.result[1].sum === 0) || !data?.category) {
      return <span className="w-full my-24 text-center">No data for this category.</span>;
    } else {
      return (
        <ResponsiveContainer height={250}>
          <PieChart key={searchParams.get("category")}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data?.result.map((item) => ({
                ...item,
                sum: Math.abs(item.sum),
              }))}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill={data?.category.color}
              dataKey="sum"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="w-full xl:w-2/3 bg-stone-700 shadow-md rounded-md p-3 min-h-[340px]">
      <div className="w-full flex flex-col xl:flex-row xl:justify-between gap-y-2 justify-center items-center">
        <h2 className="font-bold">Category</h2>
        <CategorySelect setCategory={setCurrentCateogry} />
      </div>

      <div className="flex items-start justify-start w-full mt-6">
        {isLoading || isFetching ? (
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          renderData()
        )}
      </div>
    </div>
  );
}

export default CategoryChart;
