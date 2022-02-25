import dayjs, { Dayjs } from "dayjs";

// Random date between 1/1/12 and 6 months ago (ignore 2013 because there's no data)
const between = (
  from: string | Date | Dayjs = "2012-01-01",
  to: string | Date | Dayjs = dayjs().subtract(6, "month")
) => {
  let newDate = dayjs("2013");
  while (newDate.year() === 2013 || newDate.isAfter("2020")) {
    const fromMilli = dayjs(from).valueOf();
    const max = dayjs(to).valueOf() - fromMilli;
    const dateOffset = Math.floor(Math.random() * max + 1);
    newDate = dayjs(fromMilli + dateOffset).startOf("day");
  }
  return dayjs(newDate);
};
export default between;
