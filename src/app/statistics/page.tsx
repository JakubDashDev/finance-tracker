import CategoryChart from "@/components/statistics/CategoryChart";
import CategoryList from "@/components/statistics/CategoryList";
import YearAreaChart from "@/components/statistics/YearAreaChart";
import YearChart from "@/components/statistics/YearChart";
import React from "react";

function StatisticsPage() {
  return (
    <div className="flex flex-col gap-5 w-11/12 lg:w-2/3 xl:w-3/5">
      <YearChart />
      <div className="flex flex-col xl:flex-row gap-2">
        <CategoryChart />
        <CategoryList />
      </div>
      <YearAreaChart />
    </div>
  );
}

export default StatisticsPage;
