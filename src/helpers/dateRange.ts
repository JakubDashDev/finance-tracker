/**
 * @param startDate Date or natively parseable string (e.g. 2024-04-01) *OPTIONAL
 * @param endDate Date or natively parseable string (e.g. 2024-04-01) *OPTIONAL
 * @returns Array of {key: e.g."2024-01-01",  label: e.g."January 2024" }
 */

const d = new Date();
const past = new Date(d.setFullYear(d.getFullYear() - 4));
const feature = new Date(d.setFullYear(d.getFullYear() + 8));

export function dateRange(
  startDate: string = `${past.getFullYear()}-01-01`,
  endDate: string = `${feature.getFullYear()}-01-01`
) {
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
