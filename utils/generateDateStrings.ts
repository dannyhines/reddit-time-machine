import dayjs from "dayjs";

// This function generates all the date strings to statically generate every path at build time
export function generateDateStrings(startDate: string, endDate: string) {
  let date = dayjs(startDate);
  const end = dayjs(endDate);
  const dates = [];

  while (date.isBefore(end) || date.isSame(end)) {
    dates.push(date.format("YYYY-MM-DD"));
    date = date.add(1, "day");
  }

  return dates;
}
