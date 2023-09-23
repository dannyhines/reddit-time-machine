import dayjs, { Dayjs } from 'dayjs';
import { LAST_AVAILABLE_DATE } from '../../utils/constants';

// Random date between 1/1/12 and 6 months ago
const between = (from: string | Date | Dayjs = '2012-01-01', to: string | Date | Dayjs = LAST_AVAILABLE_DATE) => {
  let newDate = dayjs();
  while (newDate.isAfter(LAST_AVAILABLE_DATE)) {
    const fromMilli = dayjs(from).valueOf();
    const max = dayjs(to).valueOf() - fromMilli;
    const dateOffset = Math.floor(Math.random() * max + 1);
    newDate = dayjs(fromMilli + dateOffset).startOf('day');
  }
  return dayjs(newDate);
};
export default between;
