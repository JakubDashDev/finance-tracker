import React, { useMemo } from "react";
import CategoryItem from "./CategoryItem";
import CategoryForm from "../category/CategoryForm";
import { Button } from "@nextui-org/react";
import { createCategory } from "@/actions/create-category";
import customRevalidatePath from "@/actions/revalidateTag";
import { FaPlus } from "react-icons/fa6";
import { getCategoriesWithTransactions } from "@/queries/user-categories";

async function CategoryList() {
  const categoryWithTransactions = await getCategoriesWithTransactions();

  return (
    <div className="w-full gap-x-4 2xl:gap-x-12 gap-y-8 grid grid-cols-1 sm::grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
      <CategoryForm submitFunction={createCategory} refetchFn={customRevalidatePath("/categories") as any}>
        <Button className="w-full h-full hover:brightness-110 shadow-md rounded-md p-3 bg-stone-700 flex items-center text-medium">
          <FaPlus /> Add new category
        </Button>
      </CategoryForm>
      {categoryWithTransactions.map((category) => (
        <CategoryItem key={category.category.id} category={category.category} transactions={category.transactions} />
      ))}
    </div>
  );
}

export default CategoryList;
