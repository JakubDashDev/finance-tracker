"use client";

import { createCategory, CreateCategoryState } from "@/actions/create-category";
import { Category, GetUserCategories } from "@/queries/get-user-categories";
import { Button, Input } from "@nextui-org/react";
import { QueryObserverResult, RefetchOptions, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import FormButton from "../common/FormButton";
import { UpdateCategoryState } from "@/actions/update-category";

interface CategoryFormProps {
  submitFunction: (...args: any[]) => Promise<CreateCategoryState | UpdateCategoryState>;
  editCategoryData?: Category;
  setIsInputActive: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<GetUserCategories, Error>>;
}

function CategoryForm({ submitFunction, editCategoryData, setIsInputActive, refetch }: CategoryFormProps) {
  const updateCategory = submitFunction.bind(null, { categoryId: editCategoryData?.id });
  const createCategory = submitFunction.bind(null, { categoryId: undefined });

  const [formState, action] = useFormState(editCategoryData ? updateCategory : createCategory, {
    errors: {},
    success: false,
  });

  useEffect(() => {
    if (formState.success) {
      refetch();

      setIsInputActive((current) => !current);
    }
  }, [formState.success, setIsInputActive, refetch]);

  return (
    <form className="w-full flex flex-col items-center gap-5" action={action}>
      <div className="w-full flex items-center gap-3">
        <div className="!w-[25px] !h-[25px] !min-w-[25px] overflow-hidden rounded-[50%] flex items-center justify-center">
          <input
            id="categoryColor"
            name="categoryColor"
            type="color"
            className="w-full h-full scale-[1.7] bg-transparent cursor-pointer"
            defaultValue={editCategoryData?.color || "#e66465"}
          />
        </div>
        <Input
          id="categoryName"
          name="categoryName"
          variant="underlined"
          placeholder="Name of category"
          defaultValue={editCategoryData?.name}
        />
      </div>
      <div className="flex gap-2 w-1/2">
        <FormButton>Save</FormButton>
        <Button variant="flat" color="danger" type="button" onClick={() => setIsInputActive((current) => !current)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
