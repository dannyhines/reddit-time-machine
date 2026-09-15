import { REDDIT_BASE_URL } from "./constants";

const REDDIT_PATH = /^\/(?:r|comments|gallery)(?:\/|$)/i;
const ABSOLUTE_HTTP_URL = /^https?:\/\//i;

const isSafeHttpUrl = (url: string) => {
  if (!ABSOLUTE_HTTP_URL.test(url)) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

export const getRedditPermalinkUrl = (permalink: string | null | undefined) => {
  const path = typeof permalink === "string" ? permalink.trim() : "";

  if (REDDIT_PATH.test(path)) {
    return new URL(path, REDDIT_BASE_URL).toString();
  }

  return REDDIT_BASE_URL;
};

export const normalizePostUrl = (postUrl: string | null | undefined, permalink: string | null | undefined) => {
  const url = typeof postUrl === "string" ? postUrl.trim() : "";

  if (isSafeHttpUrl(url)) return url;
  if (REDDIT_PATH.test(url)) return new URL(url, REDDIT_BASE_URL).toString();

  return getRedditPermalinkUrl(permalink);
};
