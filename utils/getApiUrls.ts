import dayjs from "dayjs";

export const getApiUrls = (startDate: string) => {
  const from = dayjs(startDate).subtract(1, "week").format("YYYY-MM-DD");
  const to = dayjs(startDate).add(1, "week").format("YYYY-MM-DD");
  let predictionsUrl = `/predictions?from=${from}&to=${to}`;
  return { url: "", predictionsUrl };
};
