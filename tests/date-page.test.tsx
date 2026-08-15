import { getPostsForDate } from "../server/database";
import { getStaticProps } from "../pages/[date]";
import { Post } from "../types/Post";

jest.mock("../server/database", () => ({
  getPostsForDate: jest.fn(),
}));

const mockedGetPostsForDate = jest.mocked(getPostsForDate);

const post: Post = {
  id: "post-1",
  title: "An archived Reddit post",
  url: "https://example.com",
  created_utc: 0,
  author: "author",
  domain: "example.com",
  score: 100,
  permalink: "/r/news/comments/post-1",
  subreddit: "news",
  created_date: "2014-07-04",
  post_type: "news",
};

describe("date page routing", () => {
  beforeEach(() => mockedGetPostsForDate.mockReset());

  it.each(["nope", "2022-02-29", "2008-12-31", "2025-01-01"])(
    "returns a real 404 for malformed or out-of-range date %s",
    async (date) => {
      const result = await getStaticProps({ params: { date } } as never);
      expect(result).toEqual({ notFound: true });
      expect(mockedGetPostsForDate).not.toHaveBeenCalled();
    }
  );

  it("server-renders archived posts for a valid date", async () => {
    mockedGetPostsForDate.mockResolvedValue([post]);

    const result = await getStaticProps({ params: { date: "2014-07-04" } } as never);

    expect(mockedGetPostsForDate).toHaveBeenCalledWith("2014-07-04");
    expect(result).toEqual({ props: { date: "2014-07-04", posts: [post] } });
  });

  it("returns a 404 instead of publishing a thin page when a date has no posts", async () => {
    mockedGetPostsForDate.mockResolvedValue([]);

    const result = await getStaticProps({ params: { date: "2014-07-04" } } as never);

    expect(result).toEqual({ notFound: true });
  });
});
