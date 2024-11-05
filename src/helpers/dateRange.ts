/**
 * @param startDate Date or natively parseable string (e.g. 2024-04-01)
 * @param endDate Date or natively parseable string (e.g. 2024-04-01)
 * @returns Array of {key: e.g."2024-01-01",  label: e.g."January 2024" }
 */

export function dateRange(startDate: string, endDate: string) {
  let start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  while (start <= end) {
    const displayMonth = start.getUTCMonth() + 1;

    const key = [
      start.getUTCFullYear(),
      displayMonth.toString().padStart(2, "0"),
      // always display the first of the month
      "01",
    ].join("-");

    const label = new Date(key).toLocaleString("UTC", { month: "long", year: "numeric" });

    dates.push({ key, label });

    // progress the loop
    start = new Date(start.setUTCMonth(displayMonth));
  }

  return dates;
}
