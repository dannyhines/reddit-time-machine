import { Post } from "../types/Post";
import { getDateMetaDescription, getDateSummary } from "./seo";

const makePost = (id: string, title: string): Post => ({
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
  post_type: "news",
});

describe("date SEO content", () => {
  const posts = [makePost("1", "First story"), makePost("2", "Second story"), makePost("3", "Third story")];

  it("writes a query-aligned description grounded in the archived posts", () => {
    const description = getDateMetaDescription("2014-07-04", posts);

    expect(description).toContain("Reddit's front page looked like on July 4, 2014");
    expect(description).toContain("First story");
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("writes visible unique summary copy for the date", () => {
    expect(getDateSummary("2014-07-04", posts)).toBe(
      "This archive preserves 3 posts from Reddit on July 4, 2014. Popular discussions included “First story”, “Second story”, and “Third story”."
    );
  });
});
