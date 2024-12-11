"use client";

import { deleteCategory } from "@/actions/delete-category";
import { Button, Modal, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FaCog } from "react-icons/fa";
import { FaPlus, FaTrash } from "react-icons/fa6";
import CategoryForm from "./CategoryForm";
import { updateCategory } from "@/actions/update-category";
import { createCategory } from "@/actions/create-category";
import { Category } from "@prisma/client";

interface ManageCategoriesModalProps {
  refetch: any;
  category: Category | null;
  data: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

function ManageCategoriesModal({ category, data, isLoading, error, refetch }: ManageCategoriesModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    mutate: deleteCategoryFn,
    isPending,
    error: deleteCategoryError,
  } = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
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
              {data?.map((item: Category) => (
                <div key={item.id} className="w-full flex justify-between items-center">
                  <CategoryForm refetchFn={refetch} submitFunction={updateCategory} editCategoryData={item}>
                    <Button
                      variant="light"
                      className="flex items-center gap-2 w-full  justify-start capitalize"
                      isDisabled={category?.id === item.id}
                    >
                      <div style={{ width: 8, height: 8, backgroundColor: item.color, borderRadius: 9999 }}></div>
                      {item.name}
                    </Button>
                  </CategoryForm>

                  <Button
                    variant="light"
                    color="danger"
                    onClick={() => deleteCategoryFn(item.id)}
                    isDisabled={isPending || category?.id === item.id}
                  >
                    {isPending ? <Spinner /> : <FaTrash />}
                  </Button>
                </div>
              ))}

              <div className="w-full flex items-center justify-center px-2 mt-5">
                <CategoryForm refetchFn={refetch} submitFunction={createCategory}>
                  <Button variant="light">
                    <FaPlus />
                    Add Category
                  </Button>
                </CategoryForm>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageCategoriesModal;
