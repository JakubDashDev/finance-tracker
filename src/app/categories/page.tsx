import CategoryList from "@/components/categoryPage/CategoryList";
import { Divider, Spinner } from "@nextui-org/react";
import React, { Suspense } from "react";

function CategoriesPage() {
  return (
    <div className="flex flex-col gap-5 w-11/12 lg:w-2/3 xl:w-3/5">
      <div className="w-full gap-10 flex justify-between items-center">
        <h3 className="text-xl">Personal Categories</h3>
      </div>
      <Divider />

      <div className="flex flex-col gap-5 items-center justify-center">
        <Suspense fallback={<Spinner />}>
          <CategoryList />
        </Suspense>
      </div>
    </div>
  );
}

export default CategoriesPage;
