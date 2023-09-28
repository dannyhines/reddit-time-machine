import dayjs from "dayjs";
export const REDDIT_BASE_URL = "https://reddit.com";
export const TWO_YEARS_IN_SECONDS = 63113852;
export const FIRST_AVAILABLE_DATE = dayjs("2009-01-01");
export const LAST_AVAILABLE_DATE = dayjs("2022-12-27");
export const DEFAULT_THUMBNAIL = "default_thumbnail.png";
export const POST_COLUMNS = `id, title, url, created_utc, author, domain, score, is_video, permalink, preview, subreddit, thumbnail, thumbnail_height, thumbnail_width, created_date, 'prediction' as post_type`;
