import { DatabasePost, normalizeDatabasePost } from "./database";

const post: DatabasePost = {
  id: "post-1",
  title: "Archived post",
  url: "https://example.com",
  created_utc: 0,
  author: "author",
  domain: "example.com",
  score: 100,
  permalink: "/r/news/comments/post-1",
  subreddit: "news",
  created_date: new Date("2014-07-04T00:00:00.000Z"),
  post_type: "news",
};

describe("database serialization", () => {
  it("normalizes PostgreSQL dates for Next.js static props", () => {
    expect(normalizeDatabasePost(post).created_date).toBe("2014-07-04");
  });
});
