import { SORT_ARR } from "@/const";

export type SortValue = (typeof SORT_ARR)[number]["value"];

/**
 * @param sort A string that is contained in the SORT_ARR @typedef SortValue
 * @returns Object { [sortKey]: [sortValue] }
 */

export function sortSearch(sort?: SortValue) {
  //Default value
  let orderBy = { createdAt: "desc" } as any;

  const currentSort = sort?.split("-");
  const isCorrect =
    currentSort && SORT_ARR.some((item) => item.value.toLowerCase() === currentSort.join("-").toLowerCase());

  if (currentSort && isCorrect) {
    const sort = currentSort[0].toString();
    const order = currentSort[1].toString();

    orderBy = { [sort]: order };
  }

  return orderBy;
}
