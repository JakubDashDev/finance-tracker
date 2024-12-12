"use client";
import React from "react";
import { Select, SelectedItems, SelectItem } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllUserCategories } from "@/queries/user-categories";
import { Category } from "@prisma/client";

interface CategorySelectProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

function CategorySelect({ setCategory }: CategorySelectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryFn: () => getAllUserCategories(),
    queryKey: ["Categories"],
  });

  if (error) {
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-red-600 bg-red-100 py-2 px-4 rounded text-sm">
        {error?.message || "Sorry we couldn't fetch your categories. Please try again"}
      </span>
    </div>;
  }

  return (
    <Select
      isLoading={isLoading}
      items={data || []}
      selectionMode="single"
      placeholder="Choose category filter"
      aria-label="Transaction category filter"
      className="max-w-xs"
      style={{ textTransform: "capitalize" }}
      defaultSelectedKeys={[searchParams.get("category") ?? ""]}
      onChange={(e) => setCategory(e.target.value)}
      renderValue={(items: SelectedItems<Category>) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: item.data?.color }} />
            <span>{item.data?.name}</span>
          </div>
        ));
      }}
    >
      {(item) => (
        <SelectItem key={item.id} textValue={item.name}>
          <div className="flex items-center gap-2 capitalize">
            <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}

export default CategorySelect;
