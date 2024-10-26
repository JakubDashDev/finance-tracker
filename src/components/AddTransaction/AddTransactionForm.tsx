"use client";
import { Input, ModalBody, Textarea, Button, Modal, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import React, { act, useEffect, useState } from "react";
import FormButton from "../common/FormButton";
import AddTransactionTypeSelect from "./AddTransactionTypeSelect";
import { createTransaction } from "@/actions/create-transaction";
import { useFormState } from "react-dom";
import { Category } from "@/queries/get-user-categories";
import AddTransactionCategory from "./AddTransactionCategory";

function AddTransactionForm() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formState, action] = useFormState(createTransaction, { errors: {}, success: false });

  useEffect(() => {
    if (formState.success) onClose();
  }, [formState, onClose]);

  return (
    <>
      <Button onPress={onOpen} variant="solid" color="primary" className="px-24">
        Add Transaction
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="py-10 dark text-white"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>
            <h3>Add new transaction</h3>
          </ModalHeader>
          <ModalBody>
            <form action={action}>
              <div className="flex flex-col gap-4">
                <Input
                  variant="underlined"
                  type="text"
                  name="title"
                  id="title"
                  label="Transaction title"
                  isInvalid={!!formState.errors.title}
                  errorMessage={formState.errors.title?.join(", ")}
                />
                <AddTransactionCategory />
                <div className="flex flex-col gap-2 lg:flex-row">
                  <AddTransactionTypeSelect
                    isInvalid={!!formState.errors.type}
                    errorMessage={formState.errors.type?.join(", ")}
                  />
                  <Input
                    variant="underlined"
                    type="number"
                    name="amount"
                    id="amount"
                    label="Amount"
                    startContent={<span className="text-sm">$</span>}
                    step={0.01}
                    isInvalid={!!formState.errors.amount}
                    errorMessage={formState.errors.amount?.join(", ")}
                  />
                </div>
                <Textarea
                  variant="underlined"
                  type="text"
                  name="description"
                  id="description"
                  label="Description"
                  isInvalid={!!formState.errors.description}
                  errorMessage={formState.errors.description?.join(", ")}
                />
                {!!formState.errors._form && (
                  <p className="text-red-600 bg-red-100 py-2 px-4 rounded text-sm">
                    {formState.errors._form.join(", ")}
                  </p>
                )}
                <FormButton>Add Transaction</FormButton>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTransactionForm;
