"use client";
import { Skeleton } from "@nextui-org/react";
import React from "react";

function Loader() {
  return (
    <Skeleton className="rounded-lg w-full h-full">
      <div className="w-full rounded-lg min-h-24 h-full"></div>
    </Skeleton>
  );
}

export default Loader;
