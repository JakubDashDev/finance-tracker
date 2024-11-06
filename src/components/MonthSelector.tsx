"use client";

import { DashboardPageProps } from "@/app/dashboard/[slug]/page";
import { dateRange } from "@/helpers/dateRange";
import { Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

function MonthSelector({ slug }: { slug: string }) {
  const router = useRouter();

  const d = new Date();
  const past = new Date(d.setFullYear(d.getFullYear() - 4));
  const feature = new Date(d.setFullYear(d.getFullYear() + 8));

  const dates = dateRange(`${past.getFullYear()}-01-01`, `${feature.getFullYear()}-01-01`);

  const slugAsDate = new Date(slug);
  const currentFilter = new Date(slugAsDate.getFullYear(), slugAsDate.getMonth(), 2).toISOString().split("T")[0];

  return (
    <Select
      items={dates}
      label="Choosen month:"
      placeholder="Choose month"
      className="max-w-xs"
      defaultSelectedKeys={[currentFilter]}
      style={{ textTransform: "capitalize", border: "1px solid #9999" }}
    >
      {(date) => (
        <SelectItem
          onClick={() => router.push(`/dashboard/${date.key}`)}
          key={date.key}
          style={{ textTransform: "capitalize" }}
        >
          {date.label}
        </SelectItem>
      )}
    </Select>
  );
}

export default MonthSelector;
