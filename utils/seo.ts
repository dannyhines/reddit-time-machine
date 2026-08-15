import dayjs from "dayjs";
import { Post } from "../types/Post";

export const getReadableDate = (date: string) => dayjs(date).format("MMMM D, YYYY");

const trimDescription = (description: string, maxLength = 160) => {
  if (description.length <= maxLength) return description;
  return `${description.slice(0, maxLength - 1).trimEnd()}…`;
};

const trimTitle = (title: string, maxLength = 120) => {
  const trimmedTitle = title.trim();
  if (trimmedTitle.length <= maxLength) return trimmedTitle;
  return `${trimmedTitle.slice(0, maxLength - 1).trimEnd()}…`;
};

export const getDateMetaDescription = (date: string, posts: Post[]) => {
  const readableDate = getReadableDate(date);
  const notableTitles = posts
    .slice(0, 2)
    .map((post) => trimTitle(post.title))
    .filter(Boolean);
  const notableText = notableTitles.length ? ` Top posts included ${notableTitles.join(" and ")}.` : "";

  return trimDescription(`See what Reddit's front page looked like on ${readableDate}.${notableText}`);
};

export const getDateSummary = (date: string, posts: Post[]) => {
  const readableDate = getReadableDate(date);
  const titles = posts
    .slice(0, 3)
    .map((post) => trimTitle(post.title))
    .filter(Boolean);

  if (!titles.length) {
    return `Explore Reddit's archived front page from ${readableDate}.`;
  }

  const discussionList = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
    titles.map((title) => `“${title}”`)
  );

  return `This archive preserves ${posts.length} posts from Reddit on ${readableDate}. Popular discussions included ${discussionList}.`;
};
