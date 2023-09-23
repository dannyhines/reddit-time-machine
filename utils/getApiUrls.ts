import dayjs from "dayjs";

export const getApiUrls = (startDate: number) => {
  console.log("startDate", startDate);
  const endDate = (startDate || new Date().getTime() / 1000) + 86400; // 1 day
  const oneMonth = 2629743;
  const dateObj = dayjs(startDate * 1000);
  const baseURl = "/api/posts";
  const url = baseURl + `?date=${dateObj.format("YYYY-MM-DD")}`;
  let predictionsUrl = baseURl + `&after=${startDate - oneMonth}&before=${endDate + oneMonth}&subreddit=futurology&q=`;

  const thisYear = new Date().getFullYear();
  const queryingYear = dateObj.year();
  if (queryingYear > 1970) {
    predictionsUrl += `"by%20${thisYear}`;
    for (var i = queryingYear; i < thisYear + 1; i++) {
      if (i + 3 < thisYear) {
        predictionsUrl += `"||"by%20${i + 3}`;
      }
    }
    predictionsUrl += '"';
  }
  return { url, predictionsUrl };
};
