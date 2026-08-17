import dayjs from "dayjs";
import { Post } from "../types/Post";

export const getReadableDate = (date: string) => dayjs(date).format("MMMM D, YYYY");

const trimDescription = (description: string, maxLength = 160) => {
  if (description.length <= maxLength) return description;
  return `${description.slice(0, maxLength - 1).trimEnd()}…`;
};

const POST_CATEGORY_LABELS: Array<[Post["post_type"], string]> = [
  ["news", "news"],
  ["politics", "politics"],
  ["sports", "sports"],
  ["science", "science"],
  ["pics", "pictures"],
  ["meme", "memes"],
  ["prediction", "predictions"],
];

const getCategoryList = (posts: Post[]) => {
  const categories = POST_CATEGORY_LABELS.filter(([postType]) => posts.some((post) => post.post_type === postType)).map(
    ([, label]) => label
  );

  return new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(categories);
};

export const getDateMetaDescription = (date: string, posts: Post[]) => {
  const readableDate = getReadableDate(date);
  const categories = getCategoryList(posts);
  const archiveDetails = categories ? `, featuring ${categories}` : "";

  return trimDescription(`See what Reddit's front page looked like on ${readableDate}${archiveDetails}.`);
};

export const getDateSummary = (date: string, posts: Post[]) => {
  const readableDate = getReadableDate(date);
  const categories = getCategoryList(posts);

  if (!categories) {
    return `Explore Reddit's archived front page from ${readableDate}.`;
  }

  return `This archive preserves Reddit's front page from ${readableDate}, featuring ${categories}.`;
};
