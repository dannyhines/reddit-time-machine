import dayjs, { Dayjs } from "dayjs";
import { FIRST_AVAILABLE_DATE, LAST_AVAILABLE_DATE } from "./constants";

const getWeekDay = (date: Dayjs) => {
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekday[date.day()];
};

const getOrdinalNum = (n: number) => {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "");
};

export const getDates = (startDate: string) => {
  const dateObj: Dayjs = dayjs(startDate);
  const stringDate = getShortDateString(dateObj);
  const shortDate = dateObj.format("M/D/YY");
  return { dateObj, stringDate, shortDate };
};

/*
  Returns "Monday, Nov. 14th 2018"
*/
export const getShortDateString = (dateObj: Dayjs) => {
  const stringDate = `${getWeekDay(dateObj)},  ${dateObj.format("MMM.")} ${getOrdinalNum(
    dateObj.date()
  )} ${dateObj.year()}`;
  return stringDate;
};

/*
  Returns "November 14th 2018"
*/
export const getMonthDayYear = (dateObj: Dayjs) => {
  const stringDate = `${dateObj.format("MMMM")} ${getOrdinalNum(dateObj.date())}, ${dateObj.year()}`;
  return stringDate;
};

export const getMonthAndYear = (d: Dayjs) => `${d.format("MMMM")} ${d.year()}`;
/*
Checks that the date is in YYY-MM-DD format
*/
export const isValidDate = (dateStr?: string | string[]) => {
  const dateRegex = new RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/);
  return typeof dateStr === "string" ? dateRegex.test(dateStr) : false;
};

export const isDateInRange = (dateStr?: string | string[]) => {
  if (!isValidDate(dateStr)) return false;
  const d = dayjs(dateStr as string);
  return d.isAfter(FIRST_AVAILABLE_DATE) && d.isBefore(LAST_AVAILABLE_DATE);
};
