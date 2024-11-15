"use client";

import { DeleteCategory } from "@/actions/delete-category";
import { Category, GetUserCategories } from "@/queries/get-user-categories";
import { Button, Input, Modal, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import React from "react";
import { FaCog } from "react-icons/fa";
import { FaPlus, FaTrash } from "react-icons/fa6";
import AddEditCategoryForm from "./AddEditCategoryForm";

interface ManageCategoriesModalProps {
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<GetUserCategories, Error>>;
  category: Category | null;
  data: GetUserCategories | undefined;
  isLoading: boolean;
  error: Error | null;
}

function ManageCategoriesModal({ category, data, isLoading, error, refetch }: ManageCategoriesModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    mutate: deleteCategory,
    isPending,
    error: deleteCategoryError,
  } = useMutation({
    mutationFn: (categoryId: string) => DeleteCategory(categoryId),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <>
      <Button
        onPress={onOpen}
        variant="ghost"
        className="flex items-center gap-2 w-full border-none justify-center capitalize"
      >
        <FaCog /> Manage Categories
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="py-10 dark text-white"
        backdrop="blur"
      >
        <ModalContent className="px-5">
          <ModalHeader>Manage your categories</ModalHeader>

          {isLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-1">
              {data?.categories?.map((item) => (
                <div key={item.id} className="w-full flex justify-between items-center">
                  <AddEditCategoryForm refetch={refetch} editCategoryData={item}>
                    <Button
                      variant="light"
                      className="flex items-center gap-2 w-full  justify-start capitalize"
                      isDisabled={category?.id === item.id}
                    >
                      <div style={{ width: 8, height: 8, backgroundColor: item.color, borderRadius: 9999 }}></div>
                      {item.name}
                    </Button>
                  </AddEditCategoryForm>

                  <Button
                    variant="light"
                    color="danger"
                    onClick={() => deleteCategory(item.id)}
                    isDisabled={isPending || category?.id === item.id}
                  >
                    {isPending ? <Spinner /> : <FaTrash />}
                  </Button>
                </div>
              ))}

              <div className="w-full flex items-center justify-center px-2 mt-5">
                <AddEditCategoryForm refetch={refetch} editCategoryData={undefined}>
                  <Button variant="light">
                    <FaPlus />
                    Add Category
                  </Button>
                </AddEditCategoryForm>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageCategoriesModal;
