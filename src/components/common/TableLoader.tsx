"use client";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";

function TableLoader() {
  return (
    <Table
      aria-label="table"
      classNames={{
        base: " overflow-hidden",
        table: "min-h-[150px]",
      }}
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

      <TableBody isLoading items={[]} loadingContent={<Spinner />}>
        <TableRow>
          <TableCell>{""}</TableCell>
          <TableCell>{""}</TableCell>
          <TableCell>{""}</TableCell>
          <TableCell>{""}</TableCell>
          <TableCell>{""}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default TableLoader;
