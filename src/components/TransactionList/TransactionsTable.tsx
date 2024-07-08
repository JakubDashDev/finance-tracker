"use client";
import { DeleteTransaction } from "@/actions/delete-transaction";
import {
  Button,
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Transaction } from "@prisma/client";
import React from "react";

interface TransactionsTableProps {
  transactions: Transaction[] | undefined;
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  const handleDelete = async (transactionId: string) => {
    const confirm = window.confirm("Are you sure to delete this transaction?");

    if (!confirm) return;

    await DeleteTransaction(transactionId);
  };

  const renderCell = React.useCallback((transaction: Transaction, columnKey: React.Key) => {
    const cellValue = transaction[columnKey as keyof Transaction];

    switch (columnKey) {
      case "title":
        return <span>{transaction.title}</span>;

      case "amount":
        return (
          <div className={`${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
            <span>{transaction.amount > 0 ? "+ " : "- "}</span>
            <span>{Math.abs(transaction.amount)}$</span>
          </div>
        );

      case "description":
        return <span>{transaction.description}</span>;

      case "action":
        return (
          <Tooltip color="danger" content="Delete transaction">
            <Button onClick={() => handleDelete(transaction.id)} variant="light" color="danger" size="sm">
              <span className="text-lg">❌</span>
            </Button>
          </Tooltip>
        );
      default:
        return cellValue?.toLocaleString();
    }
  }, []);

  return (
    <Table isStriped aria-label="table">
      <TableHeader>
        <TableColumn key="title">TITLE</TableColumn>
        <TableColumn key="amount" width={180} minWidth={180}>
          AMOUNT
        </TableColumn>
        <TableColumn key="description">DESCRIPTION</TableColumn>
        <TableColumn key="action" width={40}>
          ACTION
        </TableColumn>
      </TableHeader>
      {transactions!.length > 0 ? (
        <TableBody items={transactions}>
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      ) : (
        <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
      )}
    </Table>
  );
}

export default TransactionsTable;
