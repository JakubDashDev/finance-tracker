"use client";

import { DatePicker, Input, Textarea } from "@nextui-org/react";
import React from "react";
import AddTransactionCategory from "./AddTransaction/AddTransactionCategory";
import AddTransactionTypeSelect from "./AddTransaction/AddTransactionTypeSelect";
import { useFormState } from "react-dom";
import { createTransaction } from "@/actions/create-transaction";
import FormButton from "./common/FormButton";
import { TransactionWithCategory } from "@/queries/user-transactions";
import { parseDate } from "@internationalized/date";
import { updateTransaction } from "@/actions/update-transaction";

function EditTransactionForm({ transaction }: { transaction: TransactionWithCategory }) {
  const [formState, action] = useFormState(updateTransaction.bind(null, { transactionId: transaction.id }), {
    errors: {},
    success: false,
  });

  console.log(formState);

  return (
    <form action={action}>
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <Input
          variant="underlined"
          type="text"
          name="title"
          id="title"
          label="Transaction title"
          isInvalid={!!formState.errors.title}
          errorMessage={formState.errors.title?.join(", ")}
          isRequired
          defaultValue={transaction.title}
        />
        <AddTransactionCategory defaultCategory={transaction.category} />
        <DatePicker
          name="transactionDate"
          variant="underlined"
          label="Transaction Date"
          showMonthAndYearPickers
          isInvalid={!!formState.errors.transactionDate}
          errorMessage={formState.errors.transactionDate?.join(", ")}
          defaultValue={parseDate(transaction.transactionDate.toISOString().split("T")[0])}
          isRequired
        />
        <div className="flex flex-col gap-2 lg:flex-row">
          <AddTransactionTypeSelect
            isInvalid={!!formState.errors.type}
            errorMessage={formState.errors.type?.join(", ")}
            defaultSelected={transaction.amount > 0 ? "income" : "expense"}
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
            isRequired
            defaultValue={Math.abs(transaction.amount).toString()}
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
          defaultValue={transaction.description || ""}
        />
        {!!formState.errors._form && (
          <p className="text-red-600 bg-red-100 py-2 px-4 rounded text-sm">{formState.errors._form.join(", ")}</p>
        )}
        {formState.success && (
          <p className="text-green-600 bg-green-100 py-2 px-4 rounded text-sm">Transaction updated!</p>
        )}
        <FormButton>Update Transaction</FormButton>
      </div>
    </form>
  );
}

export default EditTransactionForm;