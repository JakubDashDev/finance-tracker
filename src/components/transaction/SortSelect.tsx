"use client";

import { SORT_ARR } from "@/const";
import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

function SortSelect() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = new URLSearchParams(searchParams.toString());

  const handleClick = (value: string) => {
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    router.push(pathname + "?" + params.toString());
  };

  return (
    <Select
      items={SORT_ARR}
      label="Sort by:"
      placeholder="Choose sort"
      className="max-w-xs"
      style={{ textTransform: "capitalize", border: "1px solid #9999" }}
      defaultSelectedKeys={[searchParams.get("sort") ?? "transactionDate-desc"]}
      onChange={(e) => handleClick(e.target.value)}
    >
      {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
    </Select>
  );
}

export default SortSelect;
