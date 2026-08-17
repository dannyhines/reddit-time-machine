import { Post } from "../types/Post";
import { getDateMetaDescription, getDateSummary } from "./seo";

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
    expect(description).toContain("3 archived posts featuring news, pictures, and memes");
    expect(description).not.toContain("First story");
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("writes a concise visible summary without repeating post titles", () => {
    expect(getDateSummary("2014-07-04", posts)).toBe(
      "This archive preserves Reddit's front page from July 4, 2014, with 3 posts featuring news, pictures, and memes."
    );
  });
});
