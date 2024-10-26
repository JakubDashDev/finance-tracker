"use client";
import { createCategory } from "@/actions/create-category";
import { GetUserCategories } from "@/queries/get-user-categories";
import { Button, Input } from "@nextui-org/react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import CategoryForm from "./CategoryForm";
import { updateCategory } from "@/actions/update-category";

interface AddEditCategoryFormProps {
  editCategoryData?: {
    id: string;
    color: string;
    name: string;
  };
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<GetUserCategories, Error>>;
  children: React.ReactNode;
}

function AddEditCategoryForm({ editCategoryData, refetch, children }: AddEditCategoryFormProps) {
  const [isInputActive, setIsInputActive] = useState(false);

  return isInputActive ? (
    <CategoryForm
      submitFunction={editCategoryData ? updateCategory : createCategory}
      editCategoryData={editCategoryData}
      setIsInputActive={setIsInputActive}
      refetch={refetch}
    />
  ) : (
    React.cloneElement(children as any, { onClick: () => setIsInputActive((current) => !current) })
  );
}

export default AddEditCategoryForm;
