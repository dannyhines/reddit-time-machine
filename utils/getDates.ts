import dayjs, { Dayjs } from "dayjs";

export const getDates = (startDate: string) => {
  const dateObj: Dayjs = dayjs(startDate);
  const stringDate = getShortDateString(dateObj);
  const shortDate = dateObj.format("M/D/YY");
  return { dateObj, stringDate, shortDate };
};

export const getWeekDay = (date: Dayjs) => {
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekday[date.day()];
};

export const getOrdinalNum = (n: number) => {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "");
};

export const getShortDateString = (dateObj: Dayjs) => {
  const stringDate = `${getWeekDay(dateObj)},  ${dateObj.format("MMM.")} ${getOrdinalNum(
    dateObj.date()
  )} ${dateObj.year()}`;
  return stringDate;
};

export const getMonthDayYear = (dateObj: Dayjs) => {
  const stringDate = `${dateObj.format("MMMM")} ${getOrdinalNum(dateObj.date())}, ${dateObj.year()}`;
  return stringDate;
};
