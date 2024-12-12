import { getCategoriesWithTransactions } from "@/queries/user-categories";
import { Category, Transaction } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

async function CategoryList() {
  const transactions = await getCategoriesWithTransactions();

  return (
    <div className="w-full xl:w-1/3 bg-stone-700 shadow-md rounded-md p-3 overflow-y-auto max-h-[340px] ">
      <div className="w-full flex flex-col gap-y-2 justify-center items-center">
        <h2 className="font-bold">Categories</h2>

        <div className="w-full flex flex-col gap-2 ">
          {transactions.map((item) => (
            <CategoryItem key={item.category.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryList;

const CategoryItem = ({ item }: { item: { category: Category; transactions: Transaction[] } }) => (
  <Link
    href={`/categories/${item.category.id}`}
    className="flex flex-row justify-between hover:bg-white/10 py-1 px-1 rounded-xl cursor-pointer"
  >
    <div className="flex gap-2 items-center justify-center max-w-[40%] ">
      <div className="min-w-[8px] h-[8px] rounded-full" style={{ backgroundColor: item.category.color }} />
      <div className="whitespace-nowrap overflow-hidden capitalize">{item.category.name}</div>
    </div>
    <div className="flex gap-3">
      <div className="flex  items-center text-green-500 ">
        <FaArrowUp />${item.transactions.filter((item) => item.amount > 0).reduce((acc, item) => item.amount + acc, 0)}
      </div>
      <span className="flex items-center text-red-400">
        <FaArrowDown />$
        {item.transactions.filter((item) => item.amount < 0).reduce((acc, item) => Math.abs(item.amount) + acc, 0)}
      </span>
    </div>
  </Link>
);
