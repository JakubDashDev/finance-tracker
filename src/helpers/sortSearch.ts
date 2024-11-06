import { SORT_ARR } from "@/const";

/**
 * @param sort Basically any string, but for return real orderBy param should be a string that is in the SORT_ARR
 * @returns Object { [sortKey]: [sortValue] }
 */

export function sortSearch(sort?: string) {
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
