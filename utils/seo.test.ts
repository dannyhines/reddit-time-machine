import { Post } from "../types/Post";
import {
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
  getDateMetaDescription,
  getDateSummary,
  getSocialImageUrl,
} from "./seo";

const makePost = (id: string, title: string, postType: Post["post_type"] = "news"): Post => ({
  id,
  title,
  url: "https://example.com",
  created_utc: 0,
  author: "author",
  domain: "example.com",
  score: 100,
  permalink: `/r/news/comments/${id}`,
  subreddit: "news",
  created_date: "2014-07-04",
  post_type: postType,
});

describe("date SEO content", () => {
  const posts = [
    makePost("1", "First story", "news"),
    makePost("2", "Second story", "pics"),
    makePost("3", "Third story", "meme"),
  ];

  it("writes a query-aligned description grounded in the archived posts", () => {
    const description = getDateMetaDescription("2014-07-04", posts);

    expect(description).toContain("Reddit's front page looked like on July 4, 2014");
    expect(description).toContain("featuring news, pictures, and memes");
    expect(description).not.toContain("3 archived posts");
    expect(description).not.toContain("First story");
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("writes a concise visible summary without repeating post titles", () => {
    expect(getDateSummary("2014-07-04", posts)).toBe(
      "This archive preserves Reddit's front page from July 4, 2014, featuring news, pictures, and memes."
    );
  });
});

describe("social image URLs", () => {
  it("uses exact 1200 by 630 share cards with page-specific context", () => {
    expect(SOCIAL_IMAGE_WIDTH).toBe(1200);
    expect(SOCIAL_IMAGE_HEIGHT).toBe(630);
    expect(getSocialImageUrl()).toBe("https://www.reddit-time-machine.com/api/og?kind=home");
    expect(getSocialImageUrl({ kind: "date", date: "2021-01-28" })).toBe(
      "https://www.reddit-time-machine.com/api/og?kind=date&date=2021-01-28"
    );
    expect(getSocialImageUrl({ kind: "month", year: "2016", month: "11" })).toBe(
      "https://www.reddit-time-machine.com/api/og?kind=month&year=2016&month=11"
    );
  });
});
