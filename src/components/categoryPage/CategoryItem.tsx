import { Category, Transaction } from "@prisma/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

interface CategoryItemProps {
  category: Category;
  transactions: Transaction[];
}

function CategoryItem({ category, transactions }: CategoryItemProps) {
  const incomes = useMemo(
    () => transactions.filter((item) => item.amount > 0).reduce((acc, item) => item.amount + acc, 0),
    [transactions]
  );

  const expenses = useMemo(
    () => transactions.filter((item) => item.amount < 0).reduce((acc, item) => item.amount + acc, 0),
    [transactions]
  );

  return (
    <Link
      href={`categories/${category.id}`}
      className="w-full hover:brightness-110 shadow-md rounded-md p-3"
      style={{backgroundColor: `${category.color}55`}}
    >
      <div className="flex gap-2 items-center">
        <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: category.color }} />
        <h4 className="capitalize">{category.name}</h4>
      </div>
      <div className="w-full flex items-center justify-center gap-3 mt-3">
        <div className="flex  items-center text-green-500 ">
          <FaArrowUp />${incomes}
        </div>
        <span className="flex items-center text-red-400">
          <FaArrowDown />${Math.abs(expenses)}
        </span>
      </div>
    </Link>
  );
}

export default CategoryItem;
