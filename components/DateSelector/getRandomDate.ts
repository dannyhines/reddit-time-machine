import dayjs, { Dayjs } from "dayjs";
import { FIRST_AVAILABLE_DATE, LAST_AVAILABLE_DATE } from "../../utils/constants";

// Returns random date during the period that data is available (2009-2022)
const between = (
  from: string | Date | Dayjs = FIRST_AVAILABLE_DATE,
  to: string | Date | Dayjs = LAST_AVAILABLE_DATE
) => {
  let newDate = dayjs();
  while (newDate.isAfter(LAST_AVAILABLE_DATE)) {
    const fromMilli = dayjs(from).valueOf();
    const max = dayjs(to).valueOf() - fromMilli;
    const dateOffset = Math.floor(Math.random() * max + 1);
    newDate = dayjs(fromMilli + dateOffset).startOf("day");
  }
  return dayjs(newDate);
};
export default between;
