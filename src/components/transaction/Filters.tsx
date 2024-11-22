import React from "react";
import TypeFilterSelect from "./TypeFilterSelect";
import CategoryFilterSelect from "./CategoryFilterSelect";

function Filters() {
  return (
    <div className="w-full flex gap-5 mb-2">
      <TypeFilterSelect />
      <CategoryFilterSelect />
    </div>
  );
}

export default Filters;
