"use client";
import { DeleteTransaction } from "@/actions/delete-transaction";
import { PAGINATION_NUMBER } from "@/const";
import { TransactionWithCategory } from "@/queries/user-transactions";
import { Button, Chip, Pagination, Tooltip } from "@nextui-org/react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface TransactionsTableProps {
  transactions: TransactionWithCategory[];
  page?: number;
  total: number;
}

function TransactionsTable({ transactions, page, total }: TransactionsTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDelete = async (transactionId: string) => {
    const confirm = window.confirm("Are you sure to delete this transaction?");

    if (!confirm) return;

    await DeleteTransaction(transactionId);
  };

  const renderCell = React.useCallback((transaction: TransactionWithCategory, columnKey: React.Key) => {
    const cellValue = transaction[columnKey as keyof TransactionWithCategory];

    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col-reverse md:flex-row gap-x-3">
            <span className="text-gray-500">{transaction.transactionDate.toISOString().split("T")[0]}</span>
            <span>{transaction.title}</span>
          </div>
        );

      case "amount":
        return (
          <div className={`${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
            <span>{transaction.amount > 0 ? "+ " : "- "}</span>
            <span>{Math.abs(transaction.amount)}$</span>
          </div>
        );

      case "description":
        return <span>{transaction.description}</span>;

      case "category":
        return transaction.category ? (
          <Chip
            className="capitalize"
            size="sm"
            variant="flat"
            style={{ backgroundColor: transaction.category?.color }}
          >
            {transaction.category?.name}
          </Chip>
        ) : (
          <></>
        );

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
    <Table
      isStriped
      aria-label="table"
      bottomContent={
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={Math.ceil(total / PAGINATION_NUMBER) > 0 ? Math.ceil(total / PAGINATION_NUMBER) : 1}
          onChange={(page) => router.push(`${pathname}?page=${page}`)}
        />
      }
    >
      <TableHeader>
        <TableColumn key="title">TITLE</TableColumn>
        <TableColumn key="amount" width={180} minWidth={180}>
          AMOUNT
        </TableColumn>
        <TableColumn key="description">DESCRIPTION</TableColumn>
        <TableColumn key="category">CATEGORY</TableColumn>
        <TableColumn key="action" width={40}>
          ACTION
        </TableColumn>
      </TableHeader>
      {transactions!.length > 0 ? (
        <TableBody items={transactions}>
          {(item) => (
            <TableRow
              key={item.id}
              onClick={() => router.push(`/transaction/${item.id}`)}
              className="cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
            >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      ) : (
        <TableBody emptyContent={"No transactions to display."}>{[]}</TableBody>
      )}
    </Table>
  );
}

export default TransactionsTable;
