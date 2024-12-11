"use client";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import FormButton from "../common/FormButton";
import { CreateCategoryState } from "@/actions/create-category";
import { UpdateCategoryState } from "@/actions/update-category";
import { useFormState } from "react-dom";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { GetUserCategories } from "@/queries/get-user-categories";
import { Category } from "@prisma/client";

interface CategoryFormProps {
  submitFunction: (...args: any[]) => Promise<CreateCategoryState | UpdateCategoryState>;
  children: React.ReactNode;
  editCategoryData?: Category;
  refetchFn: (() => void) | ((options?: RefetchOptions) => Promise<QueryObserverResult<GetUserCategories, Error>>);
  // refetch from react query or customRevalidatePath
}

function CategoryForm({ children, submitFunction, editCategoryData, refetchFn }: CategoryFormProps) {
  const [isActive, setIsActive] = useState(false);

  const updateCategory = submitFunction.bind(null, { categoryId: editCategoryData?.id });
  const createCategory = submitFunction.bind(null, { categoryId: undefined });

  const [formState, action] = useFormState(editCategoryData ? updateCategory : createCategory, {
    errors: {},
    success: false,
  });

  useEffect(() => {
    if (formState.success) {
      setIsActive(false);
      refetchFn();
    }
  }, [formState]);

  return isActive ? (
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
        <Button variant="flat" color="danger" type="button" onClick={() => setIsActive((current) => !current)}>
          Cancel
        </Button>
      </div>
    </form>
  ) : (
    React.cloneElement(children as any, { onClick: () => setIsActive((current) => !current) })
  );
}

export default CategoryForm;
