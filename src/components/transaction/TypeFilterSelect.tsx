"use client";

import { Select, SelectedItems, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

function TypeFilterSelect() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = new URLSearchParams(searchParams.toString());

  const handleClick = (value: string) => {
    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }

    router.push(pathname + "?" + params.toString());
  };
  const selectArr = [
    { label: "Exepense", value: "expense", color: "#f31260" },
    { label: "Income", value: "income", color: "#17c964" },
    { label: "All", value: "all", color: "" },
  ];

  return (
    <Select
      items={selectArr}
      placeholder="Choose type"
      aria-label="Transaction type"
      className="max-w-xs "
      style={{ textTransform: "capitalize" }}
      defaultSelectedKeys={[searchParams.get("type") ?? "all"]}
      onChange={(e) => handleClick(e.target.value)}
      renderValue={(items: SelectedItems<(typeof selectArr)[number]>) => {
        return items.map((item) => (
          <span key={item.key} style={{ color: item.data?.color }}>
            {item.data?.label}
          </span>
        ));
      }}
    >
      {(item) => (
        <SelectItem key={item.value} style={{ color: item.color }}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
}

export default TypeFilterSelect;
