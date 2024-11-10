import { Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { SelectorIcon } from "../common/SelectorIcon";

interface AddTransactionTypeSelectProps {
  isInvalid: boolean | undefined;
  errorMessage: string | undefined;
  defaultSelected?: string;
}

const selectData = [
  {
    id: "expense",
    name: "Expense",
  },
  {
    id: "income",
    name: "Income",
  },
];

function AddTransactionTypeSelect({ isInvalid, errorMessage, defaultSelected }: AddTransactionTypeSelectProps) {
  return (
    <Select
      name="type"
      id="type"
      variant="underlined"
      items={selectData}
      label="Transaction type"
      selectorIcon={<SelectorIcon />}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      defaultSelectedKeys={[defaultSelected ?? ""]}
      renderValue={(items) =>
        items.map((item) => (
          <div
            key={item.key}
            className={`${item.data?.name === "Expense" ? "text-red-500 font-bold " : "text-green-500 font-bold "}`}
          >
            {item.data?.name}
          </div>
        ))
      }
    >
      {(item) => (
        <SelectItem key={item.id} color={item.name === "Expense" ? "danger" : "success"}>
          {item.name}
        </SelectItem>
      )}
    </Select>
  );
}

export default AddTransactionTypeSelect;
