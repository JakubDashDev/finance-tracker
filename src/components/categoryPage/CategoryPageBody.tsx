"use client";

import React from "react";
import CategoryForm from "../category/CategoryForm";
import { Button } from "@nextui-org/react";
import { Category } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "@/actions/delete-category";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { updateCategory } from "@/actions/update-category";
import { revalidatePath } from "next/cache";
import customRevalidatePath from "@/actions/revalidateTag";

interface CategoryPageBodyProps {
  category: Category;
}

function CategoryPageBody({ category }: CategoryPageBodyProps) {
  const { mutate, error, isPending } = useMutation({
    mutationFn: ({ categoryId, pathToRevalidate }: { categoryId: string; pathToRevalidate: string }) =>
      deleteCategory(categoryId, pathToRevalidate),
    onError: () => {
      alert(error?.message);
    },
  });

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 flex gap-5 items-center">
      <CategoryForm
        submitFunction={updateCategory}
        editCategoryData={category}
        refetchFn={() => customRevalidatePath("/categories")}
      >
        <Button variant="light" className="flex items-center gap-2 w-full  justify-start capitalize text-medium">
          <div style={{ width: 8, height: 8, backgroundColor: category.color, borderRadius: 9999 }}></div>
          {category.name}
        </Button>
      </CategoryForm>

      <Button
        variant="light"
        color="danger"
        isLoading={isPending}
        onClick={() => mutate({ categoryId: category.id, pathToRevalidate: "/categories" })}
      >
        <FaTrash />
      </Button>
    </div>
  );
}

export default CategoryPageBody;
