"use client";

import { Input } from "@nextui-org/react";
import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

function SearchForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;

    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    router.push(pathname + "?" + params.toString());
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");

    router.push(pathname + "?" + params.toString());
  };
  return (
    <form className="w-full md:w-1/2" onSubmit={handleSubmit}>
      <Input
        id="transactionSearch"
        name="search"
        type="text"
        placeholder="Search..."
        defaultValue={searchParams.get("search")?.toString()}
        className="border border-[#9999] rounded-xl"
        isClearable
        onClear={handleClear}
      />
    </form>
  );
}

export default SearchForm;
