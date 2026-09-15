import dayjs from "dayjs";
import { FIRST_AVAILABLE_DATE, LAST_AVAILABLE_DATE } from "./constants";
import { generateDateStrings } from "./generateDateStrings";

export interface ArchiveMonth {
  year: string;
  month: string;
  label: string;
}

export const FIRST_ARCHIVE_DATE = FIRST_AVAILABLE_DATE.format("YYYY-MM-DD");
export const LAST_ARCHIVE_DATE = LAST_AVAILABLE_DATE.format("YYYY-MM-DD");

export const getArchiveDates = () => generateDateStrings(FIRST_ARCHIVE_DATE, LAST_ARCHIVE_DATE);

export const getArchiveMonths = (): ArchiveMonth[] => {
  const months: ArchiveMonth[] = [];
  let month = FIRST_AVAILABLE_DATE.startOf("month");
  const lastMonth = LAST_AVAILABLE_DATE.startOf("month");

  while (month.isBefore(lastMonth) || month.isSame(lastMonth, "month")) {
    months.push({
      year: month.format("YYYY"),
      month: month.format("MM"),
      label: month.format("MMMM YYYY"),
    });
    month = month.add(1, "month");
  }

  return months;
};

export const getDatesForArchiveMonth = (year: string, month: string) =>
  getArchiveDates().filter((date) => date.startsWith(`${year}-${month}-`));

export const getAdjacentArchiveMonths = (year: string, month: string) => {
  const months = getArchiveMonths();
  const index = months.findIndex((archiveMonth) => archiveMonth.year === year && archiveMonth.month === month);

  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? months[index - 1] : null,
    next: index < months.length - 1 ? months[index + 1] : null,
  };
};

export const getAdjacentArchiveDates = (date: string) => {
  const value = dayjs(date);
  const previous = value.isAfter(FIRST_AVAILABLE_DATE, "day") ? value.subtract(1, "day").format("YYYY-MM-DD") : null;
  const next = value.isBefore(LAST_AVAILABLE_DATE, "day") ? value.add(1, "day").format("YYYY-MM-DD") : null;

  return { previous, next };
};
