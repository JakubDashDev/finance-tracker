"use client";

import { Category, GetUserCategories } from "@/queries/get-user-categories";
import { Button, Input, Modal, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import ManageCategoriesModal from "../Category/ManageCategoriesModal";

interface TransactionCategorySelect {
  defaultCategory?: Category | null;
}

function AddTransactionCategory({ defaultCategory }: TransactionCategorySelect) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [category, setCategory] = useState<Category | null>(defaultCategory || null);

  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => GetUserCategories(),
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
    <>
      <div className="w-full h-full">
        <Input name="categoryId" value={category?.id} onClick={onOpen} type="hidden" />
        <Button
          onClick={onOpen}
          className="border-b-2 border-[#3f3f46] hover:border-[#4e4e57] pt-2 w-full bg-transparent rounded-none flex justify-start items-start px-2 capitalize"
          style={{ color: category ? "white" : "#a1a1aa" }}
        >
          {category ? (
            <div className="flex gap-2 items-center">
              <div style={{ width: 8, height: 8, backgroundColor: category.color, borderRadius: 9999 }}></div>
              {category.name}
            </div>
          ) : (
            "Category"
          )}
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="py-10 dark text-white"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Choose category</ModalHeader>

          {isLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-1">
              {data?.categories?.map((item) => (
                <Button
                  variant="ghost"
                  key={item.id}
                  className="flex items-center gap-2 w-full border-none justify-start capitalize"
                  style={{ backgroundColor: category?.id === item.id ? "#4e4e57" : undefined }}
                  onClick={() => {
                    setCategory(item);
                    onClose();
                  }}
                >
                  <div style={{ width: 8, height: 8, backgroundColor: item.color, borderRadius: 9999 }}></div>
                  {item.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-2 w-full border-none justify-start capitalize text-red-500"
                onClick={() => {
                  setCategory(null);
                  onClose();
                }}
              >
                <div style={{ width: 8, height: 8, backgroundColor: "#f31260", borderRadius: 9999 }}></div>
                Unset category
              </Button>
              <ManageCategoriesModal
                category={category}
                data={data}
                isLoading={isLoading}
                refetch={refetch}
                error={error}
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTransactionCategory;
